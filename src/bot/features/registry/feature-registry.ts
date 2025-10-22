/**
 * Feature Registry
 *
 * Central registry for managing all bot features.
 * Stores, retrieves, and manages feature configurations and composers.
 */

import type { Composer } from 'grammy'
import type { Context } from '../../context.js'
import type {
  FeatureConfig,
  FeatureMetadata,
  FeatureModule,
  PermissionCheckResult,
  SubFeature,
  UserRole,
} from './types.js'

export class FeatureRegistry {
  private features = new Map<string, FeatureMetadata>()

  /**
   * Register a feature
   */
  register(module: FeatureModule, path: string): void {
    const { config, composer } = module

    if (this.features.has(config.id)) {
      throw new Error(`Feature '${config.id}' is already registered`)
    }

    this.features.set(config.id, {
      config,
      composer,
      path,
      loaded: true,
      loadedAt: new Date(),
    })
  }

  /**
   * Unregister a feature
   */
  unregister(featureId: string): boolean {
    return this.features.delete(featureId)
  }

  /**
   * Get a feature by ID
   */
  get(featureId: string): FeatureMetadata | undefined {
    return this.features.get(featureId)
  }

  /**
   * Get all registered features
   */
  getAll(): FeatureMetadata[] {
    return Array.from(this.features.values())
  }

  /**
   * Get enabled features only
   */
  getEnabled(): FeatureMetadata[] {
    return this.getAll().filter(f => f.config.enabled)
  }

  /**
   * Get features by category
   */
  getByCategory(category: string): FeatureMetadata[] {
    return this.getEnabled().filter(f => f.config.category === category)
  }

  /**
   * Get features accessible by a user role
   */
  getByRole(role: UserRole): FeatureMetadata[] {
    return this.getEnabled().filter(f => this.checkPermission(f.config, role).allowed)
  }

  /**
   * Get features sorted by order
   */
  getSorted(): FeatureMetadata[] {
    return this.getEnabled().sort((a, b) => {
      const orderA = a.config.order ?? 999
      const orderB = b.config.order ?? 999
      return orderA - orderB
    })
  }

  /**
   * Get features accessible by role and sorted
   */
  getAccessibleSorted(role: UserRole): FeatureMetadata[] {
    return this.getSorted().filter(f => this.checkPermission(f.config, role).allowed)
  }

  /**
   * Get all composers for enabled features
   */
  getComposers(): Composer<Context>[] {
    return this.getEnabled().map(f => f.composer)
  }

  /**
   * Check if a feature exists
   */
  has(featureId: string): boolean {
    return this.features.has(featureId)
  }

  /**
   * Check if a feature is enabled
   */
  isEnabled(featureId: string): boolean {
    const feature = this.get(featureId)
    return feature?.config.enabled ?? false
  }

  /**
   * Get sub-feature by ID
   */
  getSubFeature(featureId: string, subFeatureId: string): SubFeature | undefined {
    const feature = this.get(featureId)
    if (!feature)
      return undefined

    return feature.config.subFeatures?.find(sf => sf.id === subFeatureId)
  }

  /**
   * Get enabled sub-features for a feature
   */
  getEnabledSubFeatures(featureId: string): SubFeature[] {
    const feature = this.get(featureId)
    if (!feature || !feature.config.subFeatures)
      return []

    return feature.config.subFeatures
      .filter(sf => sf.enabled !== false)
      .sort((a, b) => {
        const orderA = a.order ?? 999
        const orderB = b.order ?? 999
        return orderA - orderB
      })
  }

  /**
   * Get accessible sub-features by role
   */
  getAccessibleSubFeatures(featureId: string, role: UserRole): SubFeature[] {
    return this.getEnabledSubFeatures(featureId).filter(sf =>
      this.checkSubFeaturePermission(sf, role).allowed,
    )
  }

  /**
   * Check permission for a feature
   */
  checkPermission(config: FeatureConfig, role: UserRole): PermissionCheckResult {
    // SUPER_ADMIN always allowed
    if (role === 'SUPER_ADMIN') {
      return { allowed: true, userRole: role }
    }
    // If no permissions specified, allow all
    if (!config.permissions || config.permissions.length === 0) {
      return { allowed: true }
    }

    // Check if user role is in allowed roles
    const allowed = config.permissions.includes(role)

    return {
      allowed,
      reason: allowed ? undefined : 'Insufficient permissions',
      required: config.permissions,
      userRole: role,
    }
  }

  /**
   * Check permission for a sub-feature
   */
  checkSubFeaturePermission(subFeature: SubFeature, role: UserRole): PermissionCheckResult {
    // SUPER_ADMIN always allowed
    if (role === 'SUPER_ADMIN') {
      return { allowed: true, userRole: role }
    }
    // If no permissions specified, allow all
    if (!subFeature.permissions || subFeature.permissions.length === 0) {
      return { allowed: true }
    }

    // Check if user role is in allowed roles
    const allowed = subFeature.permissions.includes(role)

    return {
      allowed,
      reason: allowed ? undefined : 'Insufficient permissions',
      required: subFeature.permissions,
      userRole: role,
    }
  }

  /**
   * Check if user can access a feature
   */
  canAccess(featureId: string, role: UserRole): boolean {
    const feature = this.get(featureId)
    if (!feature)
      return false
    // Allow accessing system features even if disabled (opened from settings/UI only)
    const isSystem = feature.config.category === 'system'
    if (!isSystem && feature.config.enabled !== true)
      return false

    return this.checkPermission(feature.config, role).allowed
  }

  /**
   * Check if user can access a sub-feature
   */
  canAccessSubFeature(featureId: string, subFeatureId: string, role: UserRole): boolean {
    // First check if can access parent feature
    if (!this.canAccess(featureId, role))
      return false

    const subFeature = this.getSubFeature(featureId, subFeatureId)
    if (!subFeature || subFeature.enabled === false)
      return false

    return this.checkSubFeaturePermission(subFeature, role).allowed
  }

  /**
   * Get total count of features
   */
  count(): number {
    return this.features.size
  }

  /**
   * Get count of enabled features
   */
  countEnabled(): number {
    return this.getEnabled().length
  }

  /**
   * Clear all features
   */
  clear(): void {
    this.features.clear()
  }

  /**
   * Get feature IDs
   */
  getIds(): string[] {
    return Array.from(this.features.keys())
  }

  /**
   * Get registry statistics
   */
  getStats() {
    const all = this.getAll()
    const enabled = this.getEnabled()

    return {
      total: all.length,
      enabled: enabled.length,
      disabled: all.length - enabled.length,
      categories: new Set(all.map(f => f.config.category).filter(Boolean)).size,
      withSubFeatures: all.filter(f => f.config.subFeatures && f.config.subFeatures.length > 0)
        .length,
    }
  }
}

// Singleton instance
export const featureRegistry = new FeatureRegistry()
