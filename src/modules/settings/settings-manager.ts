/**
 * Settings Manager
 *
 * Centralized settings management system with caching, validation,
 * hot-reload support, and change tracking.
 */

import type {
  Setting,
  SettingCategory,
  SettingChangeEvent,
  SettingChangeListener,
  SettingDefinition,
  SettingExport,
  SettingQueryFilters,
  SettingScope,
  SettingsImportResult,
  SettingsManagerOptions,
  SettingsSnapshot,
  SettingUpdateInput,
  ValidationResult,
} from './types.js'
import { EventEmitter } from 'node:events'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import {
  botSettings,
  databaseSettings,
  featureSettings,
  loggingSettings,
  notificationSettings,
  performanceSettings,
  securitySettings,
} from './default-settings.js'

export class SettingsManager extends EventEmitter {
  private static instance: SettingsManager | null = null
  private definitions = new Map<string, SettingDefinition>()
  private cache = new Map<string, { value: unknown, timestamp: number }>()
  private options: Required<SettingsManagerOptions>

  private constructor(options: SettingsManagerOptions = {}) {
    super()
    this.options = {
      enableCache: options.enableCache ?? true,
      cacheTimeout: options.cacheTimeout ?? 60000, // 1 minute - will be updated dynamically
      enableHistory: options.enableHistory ?? true,
      enableHotReload: options.enableHotReload ?? true,
      validateOnSet: options.validateOnSet ?? true,
    }
  }

  /**
   * Initialize settings manager
   */
  async initialize(): Promise<void> {
    try {
      // Register all default settings
      this.registerSettings([
        ...botSettings,
        ...featureSettings,
        ...databaseSettings,
        ...performanceSettings,
        ...loggingSettings,
        ...notificationSettings,
        ...securitySettings,
      ])

      // Reload cache timeout from database
      await this.reloadCacheTimeout()

      logger.info('Settings manager initialized successfully')
    }
    catch (error) {
      logger.error({ error }, 'Failed to initialize settings manager')
    }
  }

  /**
   * Get singleton instance
   */
  static getInstance(options?: SettingsManagerOptions): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager(options)
    }
    return SettingsManager.instance
  }

  /**
   * Register a setting definition
   */
  registerSetting(definition: SettingDefinition): void {
    if (this.definitions.has(definition.key)) {
      logger.warn(`Setting '${definition.key}' already registered. Overwriting.`)
    }

    this.definitions.set(definition.key, definition)
    logger.debug(`Setting registered: ${definition.key}`)
  }

  /**
   * Register multiple setting definitions
   */
  registerSettings(definitions: SettingDefinition[]): void {
    definitions.forEach(def => this.registerSetting(def))
  }

  /**
   * Get a setting definition
   */
  getDefinition(key: string): SettingDefinition | undefined {
    return this.definitions.get(key)
  }

  /**
   * Get all setting definitions
   */
  getAllDefinitions(): SettingDefinition[] {
    return Array.from(this.definitions.values())
  }

  /**
   * Get definitions by category
   */
  getDefinitionsByCategory(category: SettingCategory): SettingDefinition[] {
    return this.getAllDefinitions().filter(def => def.category === category)
  }

  /**
   * Get definitions by scope
   */
  getDefinitionsByScope(scope: SettingScope): SettingDefinition[] {
    return this.getAllDefinitions().filter(def => def.scope === scope)
  }

  /**
   * Get current cache timeout from settings
   */
  private async getCacheTimeout(): Promise<number> {
    try {
      // Get directly from database without using cache to avoid circular dependency
      const setting = await Database.prisma.setting.findFirst({
        where: {
          key: 'performance.cache_timeout',
          scope: 'GLOBAL',
        },
      })

      if (setting) {
        const timeout = this.deserializeValue(setting.value, 'number') as number
        return timeout ?? this.options.cacheTimeout
      }

      return this.options.cacheTimeout
    }
    catch (error) {
      logger.debug({ error }, 'Failed to get cache timeout, using default')
      return this.options.cacheTimeout
    }
  }

  /**
   * Reload cache timeout from database
   */
  async reloadCacheTimeout(): Promise<void> {
    try {
      // Get directly from database without using cache
      const setting = await Database.prisma.setting.findFirst({
        where: {
          key: 'performance.cache_timeout',
          scope: 'GLOBAL',
        },
      })

      if (setting) {
        const timeout = this.deserializeValue(setting.value, 'number') as number
        if (timeout && typeof timeout === 'number') {
          this.options.cacheTimeout = timeout
          logger.info({ newTimeout: timeout }, 'Cache timeout reloaded from database')
        }
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to reload cache timeout')
    }
  }

  /**
   * Clear all cache
   */
  clearCache(key?: string): void {
    if (key) {
      // Clear all cache entries for this key
      for (const cacheKey of this.cache.keys()) {
        if (cacheKey.startsWith(`${key}:`)) {
          this.cache.delete(cacheKey)
        }
      }
    }
    else {
      this.cache.clear()
    }
    logger.info(key ? `Cache cleared for key: ${key}` : 'All cache cleared')
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number
    timeout: number
    enabled: boolean
    entries: Array<{ key: string, age: number, value: unknown }>
  } {
    const entries = Array.from(this.cache.entries()).map(([key, data]) => ({
      key,
      age: Date.now() - data.timestamp,
      value: data.value,
    }))

    return {
      size: this.cache.size,
      timeout: this.options.cacheTimeout,
      enabled: this.options.enableCache,
      entries,
    }
  }

  /**
   * Get a setting value
   */
  async get<T = unknown>(
    key: string,
    options?: {
      userId?: number
      featureId?: string
      useCache?: boolean
    },
  ): Promise<T | undefined> {
    const { userId, featureId, useCache = this.options.enableCache } = options || {}

    // Check cache first
    if (useCache) {
      const cacheKey = this.getCacheKey(key, userId, featureId)
      const cached = this.cache.get(cacheKey)
      const currentTimeout = await this.getCacheTimeout()
      if (cached && Date.now() - cached.timestamp < currentTimeout) {
        return cached.value as T
      }
    }

    try {
      const definition = this.definitions.get(key)
      if (!definition) {
        logger.warn(`Setting '${key}' not registered`)
        return undefined
      }

      // Try to find existing setting
      let setting = null
      try {
        setting = await Database.prisma.setting.findFirst({
          where: {
            key,
            scope: definition.scope.toUpperCase() as any,
            userId: definition.scope === 'user' && userId ? userId : 0, // Use 0 instead of null
            featureId: definition.scope === 'feature' && featureId ? featureId : '', // Use empty string instead of null
          },
        })
      }
      catch (error) {
        // If setting doesn't exist in DB yet, use default
        logger.debug({ key }, 'Setting not found in DB, using default')
      }

      const value = setting ? this.deserializeValue(setting.value, definition.type) : definition.defaultValue

      // Update cache
      if (useCache) {
        const cacheKey = this.getCacheKey(key, userId, featureId)
        this.cache.set(cacheKey, { value, timestamp: Date.now() })
      }

      return value as T
    }
    catch (error) {
      logger.error({ error, key }, 'Failed to get setting')
      return undefined
    }
  }

  /**
   * Set a setting value
   */
  async set(
    key: string,
    value: unknown,
    options?: {
      userId?: number
      featureId?: number
      updatedBy?: number
      reason?: string
      skipValidation?: boolean
    },
  ): Promise<boolean> {
    const {
      userId,
      featureId,
      updatedBy,
      reason,
      skipValidation = false,
    } = options || {}

    try {
      const definition = this.definitions.get(key)
      if (!definition) {
        logger.error(`Setting '${key}' not registered`)
        return false
      }

      if (definition.type === 'boolean') {
        value = (value === true || value === 'true')
      }

      // Validate
      if (this.options.validateOnSet && !skipValidation && definition.validation) {
        const validationResult = this.validateValue(value, definition)
        if (!validationResult.isValid) {
          logger.error({ key, error: validationResult.error }, 'Setting validation failed')
          return false
        }
      }

      // Get old value for change tracking
      const oldSetting = await Database.prisma.setting.findFirst({
        where: {
          key,
          scope: definition.scope.toUpperCase() as any,
          userId: definition.scope === 'user' && userId ? userId : 0, // Use 0 instead of null
          featureId: definition.scope === 'feature' && featureId ? String(featureId) : '', // Use empty string instead of null
        },
      })

      const oldValue = oldSetting ? this.deserializeValue(oldSetting.value, definition.type) : definition.defaultValue

      // Serialize value
      const serializedValue = this.serializeValue(value, definition.type)

      // Prepare unique constraint values - handle nulls properly
      const uniqueKey = {
        key,
        scope: definition.scope.toUpperCase() as any,
        userId: definition.scope === 'user' && userId ? userId : 0, // Use 0 instead of null
        featureId: definition.scope === 'feature' && featureId ? String(featureId) : '', // Use empty string instead of null
      }

      // Upsert setting
      logger.debug({ key, uniqueKey, serializedValue }, 'Upserting setting')

      const setting = await Database.prisma.setting.upsert({
        where: {
          key_scope_userId_featureId: uniqueKey as any,
        },
        update: {
          value: serializedValue,
          updatedBy,
          updatedAt: new Date(),
        },
        create: {
          key,
          value: serializedValue,
          scope: definition.scope.toUpperCase() as any,
          category: definition.category.toUpperCase() as any,
          type: definition.type.toUpperCase() as any,
          userId: definition.scope === 'user' && userId ? userId : 0, // Use 0 instead of null
          featureId: definition.scope === 'feature' && featureId ? String(featureId) : '', // Use empty string instead of null
          description: definition.description,
          isSecret: definition.isSecret ?? false,
          updatedBy,
        },
      })

      // Save history
      if (this.options.enableHistory) {
        await Database.prisma.settingHistory.create({
          data: {
            settingId: setting.id,
            settingKey: key,
            oldValue: this.serializeValue(oldValue, definition.type),
            newValue: serializedValue,
            changedBy: updatedBy,
            reason,
          },
        })
      }

      // Clear cache
      const cacheKey = this.getCacheKey(key, userId, featureId)
      this.cache.delete(cacheKey)

      logger.info({
        key,
        oldValue,
        newValue: value,
        serializedValue,
        settingId: setting.id,
        updatedBy,
      }, 'Setting updated successfully')

      // Emit change event
      const changeEvent: SettingChangeEvent = {
        key,
        oldValue,
        newValue: value,
        scope: definition.scope,
        userId,
        featureId: String(featureId),
        changedBy: updatedBy,
        timestamp: new Date(),
      }
      this.emit('change', changeEvent)
      this.emit(`change:${key}`, changeEvent)

      // Update cache timeout if this is the cache timeout setting
      if (key === 'performance.cache_timeout' && typeof value === 'number') {
        this.options.cacheTimeout = value
        logger.info({ newTimeout: value }, 'Cache timeout updated')
      }

      logger.info({ key, scope: definition.scope }, 'Setting updated')
      return true
    }
    catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        key,
        value,
        options,
      }, 'Failed to set setting')
      return false
    }
  }

  /**
   * Delete a setting
   */
  async delete(
    key: string,
    options?: {
      userId?: number
      featureId?: string
    },
  ): Promise<boolean> {
    const { userId, featureId } = options || {}

    try {
      const definition = this.definitions.get(key)
      if (!definition) {
        logger.error(`Setting '${key}' not registered`)
        return false
      }

      await Database.prisma.setting.deleteMany({
        where: {
          key,
          userId: definition.scope === 'user' ? userId : undefined,
          featureId: definition.scope === 'feature' ? featureId : undefined,
        },
      })

      // Clear cache
      const cacheKey = this.getCacheKey(key, userId, featureId)
      this.cache.delete(cacheKey)

      logger.info({ key, scope: definition.scope }, 'Setting deleted')
      return true
    }
    catch (error) {
      logger.error({ error, key }, 'Failed to delete setting')
      return false
    }
  }

  /**
   * Get all settings matching filters
   */
  async getAll(filters?: SettingQueryFilters): Promise<Setting[]> {
    try {
      const where: any = {}

      if (filters?.key)
        where.key = filters.key
      if (filters?.keys)
        where.key = { in: filters.keys }
      if (filters?.scope)
        where.scope = filters.scope.toUpperCase()
      if (filters?.category)
        where.category = filters.category.toUpperCase()
      if (filters?.userId)
        where.userId = filters.userId
      if (filters?.featureId)
        where.featureId = filters.featureId

      const settings = await Database.prisma.setting.findMany({ where })

      return settings.map((s: any) => ({
        ...s,
        value: this.deserializeValue(s.value, s.type as any),
        scope: s.scope.toLowerCase() as SettingScope,
        category: s.category.toLowerCase() as SettingCategory,
        type: s.type.toLowerCase() as any,
      }))
    }
    catch (error) {
      logger.error({ error, filters }, 'Failed to get all settings')
      return []
    }
  }

  /**
   * Reset a setting to its default value
   */
  async reset(
    key: string,
    options?: {
      userId?: number
      featureId?: number
      updatedBy?: number
    },
  ): Promise<boolean> {
    const definition = this.definitions.get(key)
    if (!definition) {
      logger.error(`Setting '${key}' not registered`)
      return false
    }

    return this.set(key, definition.defaultValue, options)
  }

  /**
   * Get setting history
   */
  async getHistory(key: string, limit = 50): Promise<Array<{
    id: number
    oldValue: unknown
    newValue: unknown
    changedBy?: number
    reason?: string
    createdAt: Date
  }>> {
    try {
      const definition = this.definitions.get(key)
      if (!definition) {
        return []
      }

      const history = await Database.prisma.settingHistory.findMany({
        where: { settingKey: key },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return history.map((h: any) => ({
        id: h.id,
        oldValue: h.oldValue ? this.deserializeValue(h.oldValue, definition.type) : null,
        newValue: this.deserializeValue(h.newValue, definition.type),
        changedBy: h.changedBy ?? undefined,
        reason: h.reason ?? undefined,
        createdAt: h.createdAt,
      }))
    }
    catch (error) {
      logger.error({ error, key }, 'Failed to get setting history')
      return []
    }
  }

  /**
   * Export settings
   */
  async export(filters?: SettingQueryFilters): Promise<SettingExport[]> {
    const settings = await this.getAll(filters)

    return settings.map(s => ({
      key: s.key,
      value: s.value,
      scope: s.scope,
      category: s.category,
      description: s.description,
    }))
  }

  /**
   * Import settings
   */
  async import(
    settings: SettingExport[],
    options?: {
      updatedBy?: number
      overwrite?: boolean
    },
  ): Promise<SettingsImportResult> {
    const result: SettingsImportResult = {
      success: true,
      imported: 0,
      failed: 0,
      errors: [],
    }

    for (const setting of settings) {
      try {
        const exists = await this.get(setting.key)
        if (exists && !options?.overwrite) {
          result.failed++
          result.errors.push({
            key: setting.key,
            error: 'Setting already exists and overwrite is disabled',
          })
          continue
        }

        const success = await this.set(setting.key, setting.value, {
          updatedBy: options?.updatedBy,
        })

        if (success) {
          result.imported++
        }
        else {
          result.failed++
          result.errors.push({
            key: setting.key,
            error: 'Failed to import setting',
          })
        }
      }
      catch (error) {
        result.failed++
        result.errors.push({
          key: setting.key,
          error: error instanceof Error ? error.message : String(error),
        })
      }
    }

    result.success = result.failed === 0
    return result
  }

  /**
   * Create a settings snapshot
   */
  async createSnapshot(filters?: SettingQueryFilters): Promise<SettingsSnapshot> {
    const settings = await this.export(filters)

    return {
      timestamp: new Date(),
      version: '1.0.0',
      settings,
    }
  }

  /**
   * Restore from a snapshot
   */
  async restoreSnapshot(
    snapshot: SettingsSnapshot,
    options?: {
      updatedBy?: number
    },
  ): Promise<SettingsImportResult> {
    return this.import(snapshot.settings, { ...options, overwrite: true })
  }

  /**
   * Add change listener
   */
  onChange(key: string, listener: SettingChangeListener): void {
    this.on(`change:${key}`, listener)
  }

  /**
   * Remove change listener
   */
  offChange(key: string, listener: SettingChangeListener): void {
    this.off(`change:${key}`, listener)
  }

  /**
   * Validate a value against a setting definition
   */
  private validateValue(value: unknown, definition: SettingDefinition): ValidationResult {
    const validation = definition.validation
    if (!validation) {
      return { isValid: true }
    }

    // Required check
    if (validation.required && (value === null || value === undefined || value === '')) {
      return { isValid: false, error: 'Value is required' }
    }

    // Type-specific validation
    switch (definition.type) {
      case 'number':
        if (typeof value !== 'number') {
          return { isValid: false, error: 'Value must be a number' }
        }
        if (validation.min !== undefined && value < validation.min) {
          return { isValid: false, error: `Value must be at least ${validation.min}` }
        }
        if (validation.max !== undefined && value > validation.max) {
          return { isValid: false, error: `Value must be at most ${validation.max}` }
        }
        break

      case 'string':
        if (typeof value !== 'string') {
          return { isValid: false, error: 'Value must be a string' }
        }
        if (validation.min !== undefined && value.length < validation.min) {
          return { isValid: false, error: `Value must be at least ${validation.min} characters` }
        }
        if (validation.max !== undefined && value.length > validation.max) {
          return { isValid: false, error: `Value must be at most ${validation.max} characters` }
        }
        if (validation.pattern) {
          const regex = new RegExp(validation.pattern)
          if (!regex.test(value)) {
            return { isValid: false, error: 'Value does not match required pattern' }
          }
        }
        break

      case 'boolean':
        if (typeof value !== 'boolean') {
          return { isValid: false, error: 'Value must be a boolean' }
        }
        break

      case 'array':
        if (!Array.isArray(value)) {
          return { isValid: false, error: 'Value must be an array' }
        }
        break
    }

    // Enum validation
    if (validation.enum && validation.enum.length > 0) {
      if (!validation.enum.includes(value)) {
        return { isValid: false, error: `Value must be one of: ${validation.enum.join(', ')}` }
      }
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value)
    }

    return { isValid: true }
  }

  /**
   * Serialize value for storage
   */
  private serializeValue(value: unknown, type: string): string {
    switch (type) {
      case 'string':
        return String(value)
      case 'number':
        return String(value)
      case 'boolean':
        return String(value)
      case 'json':
      case 'array':
        return JSON.stringify(value)
      default:
        return String(value)
    }
  }

  /**
   * Deserialize value from storage
   */
  private deserializeValue(value: any, type: string): unknown {
    switch (type.toLowerCase()) {
      case 'string':
        return String(value)
      case 'number':
        return Number(value)
      case 'boolean':
        return value === 'true' || value === true
      case 'json':
      case 'array':
        try {
          return JSON.parse(value)
        }
        catch {
          return value
        }
      default:
        return value
    }
  }

  /**
   * Get cache key
   */
  private getCacheKey(key: string, userId?: number, featureId?: number | string): string {
    return `${key}:${userId || 'global'}:${featureId || 'none'}`
  }
}

// Export singleton instance
export const settingsManager = SettingsManager.getInstance()
