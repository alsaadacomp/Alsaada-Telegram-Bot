/**
 * Settings Manager Types
 *
 * Comprehensive type definitions for the centralized settings management system.
 */

/**
 * Setting scope types
 */
export type SettingScope = 'global' | 'feature' | 'user'

/**
 * Setting value types
 */
export type SettingValueType = 'string' | 'number' | 'boolean' | 'json' | 'array'

/**
 * Setting category for organization
 */
export type SettingCategory =
  | 'general'
  | 'bot'
  | 'security'
  | 'notifications'
  | 'features'
  | 'database'
  | 'logging'
  | 'performance'
  | 'ui'
  | 'custom'

/**
 * Setting definition interface
 */
export interface SettingDefinition {
  key: string
  scope: SettingScope
  category: SettingCategory
  type: SettingValueType
  defaultValue: unknown
  description?: string
  validation?: SettingValidation
  isSecret?: boolean // For sensitive data
  requiresRestart?: boolean // If changing requires bot restart
  isEditable?: boolean // Can be edited from UI
  group?: string // For grouping in UI
  order?: number // Display order
}

/**
 * Setting validation rules
 */
export interface SettingValidation {
  required?: boolean
  min?: number // For numbers/strings
  max?: number // For numbers/strings
  pattern?: string // Regex pattern for strings
  enum?: unknown[] // Allowed values
  custom?: (value: unknown) => ValidationResult
}

/**
 * Validation result
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Setting value with metadata
 */
export interface Setting {
  id: number
  key: string
  value: unknown
  scope: SettingScope
  category: SettingCategory
  type: SettingValueType
  userId?: number // For user-scoped settings
  featureId?: string // For feature-scoped settings
  description?: string
  isSecret?: boolean
  createdAt: Date
  updatedAt: Date
  updatedBy?: number
}

/**
 * Setting update input
 */
export interface SettingUpdateInput {
  value: unknown
  updatedBy?: number
}

/**
 * Setting query filters
 */
export interface SettingQueryFilters {
  scope?: SettingScope
  category?: SettingCategory
  featureId?: string
  userId?: number
  key?: string
  keys?: string[]
}

/**
 * Setting change event
 */
export interface SettingChangeEvent {
  key: string
  oldValue: unknown
  newValue: unknown
  scope: SettingScope
  userId?: number
  featureId?: string
  changedBy?: number
  timestamp: Date
}

/**
 * Setting history entry
 */
export interface SettingHistoryEntry {
  id: number
  settingKey: string
  oldValue: unknown
  newValue: unknown
  changedBy?: number
  changedAt: Date
  reason?: string
}

/**
 * Settings group for UI organization
 */
export interface SettingsGroup {
  name: string
  label: string
  description?: string
  icon?: string
  order?: number
  settings: SettingDefinition[]
}

/**
 * Setting export format
 */
export interface SettingExport {
  key: string
  value: unknown
  scope: SettingScope
  category: SettingCategory
  description?: string
}

/**
 * Settings import result
 */
export interface SettingsImportResult {
  success: boolean
  imported: number
  failed: number
  errors: Array<{
    key: string
    error: string
  }>
}

/**
 * Settings snapshot for backup/restore
 */
export interface SettingsSnapshot {
  timestamp: Date
  version: string
  settings: SettingExport[]
}

/**
 * Settings change listener
 */
export type SettingChangeListener = (event: SettingChangeEvent) => void | Promise<void>

/**
 * Settings manager options
 */
export interface SettingsManagerOptions {
  enableCache?: boolean
  cacheTimeout?: number // milliseconds
  enableHistory?: boolean
  enableHotReload?: boolean
  validateOnSet?: boolean
}
