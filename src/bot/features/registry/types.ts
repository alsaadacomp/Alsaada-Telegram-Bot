/**
 * Feature System Types
 *
 * Type definitions for the auto-discovery feature system.
 */

import type { Composer } from 'grammy'
import type { Context } from '../../context.js'

/**
 * User role type
 */
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'GUEST'

/**
 * Sub-feature definition
 * Represents a sub-menu item within a main feature
 */
export interface SubFeature {
  /** Unique identifier for the sub-feature */
  id: string

  /** Display name (supports localization key or direct text) */
  name: string

  /** Optional icon/emoji */
  icon?: string

  /** Description of the sub-feature */
  description?: string

  /** Handler function name to be called */
  handler: string

  /** Required permissions to access this sub-feature */
  permissions?: UserRole[]

  /** Whether this sub-feature is enabled */
  enabled?: boolean

  /** Order in the menu (lower = higher priority) */
  order?: number

  /** Callback data pattern for this sub-feature */
  callbackData?: string
}

/**
 * Main feature configuration
 * Defines a top-level feature section
 */
export interface FeatureConfig {
  /** Unique identifier for the feature */
  id: string

  /** Display name (supports localization key or direct text) */
  name: string

  /** Icon/emoji for the feature */
  icon?: string

  /** Description of the feature */
  description?: string

  /** Whether this feature is enabled */
  enabled: boolean

  /** Order in the main menu (lower = higher priority) */
  order?: number

  /** Required permissions to access this feature */
  permissions?: UserRole[]

  /** Category for grouping features */
  category?: string

  /** Sub-features within this feature */
  subFeatures?: SubFeature[]

  /** Custom callback data pattern */
  callbackPattern?: string
}

/**
 * Feature module structure
 * What each feature exports
 */
export interface FeatureModule {
  /** The feature configuration */
  config: FeatureConfig

  /** The Grammy composer with handlers */
  composer: Composer<Context>

  /** Optional initialization function */
  init?: () => Promise<void> | void

  /** Optional cleanup function */
  cleanup?: () => Promise<void> | void
}

/**
 * Feature metadata
 * Internal tracking information
 */
export interface FeatureMetadata {
  /** Feature configuration */
  config: FeatureConfig

  /** Feature composer */
  composer: Composer<Context>

  /** File path of the feature */
  path: string

  /** Whether the feature is loaded */
  loaded: boolean

  /** Load timestamp */
  loadedAt?: Date

  /** Error if loading failed */
  error?: string
}

/**
 * Menu structure for navigation
 */
export interface MenuStructure {
  /** Main features to display */
  features: FeatureConfig[]

  /** Current navigation path */
  path: string[]

  /** Current user context */
  userRole: UserRole
}

/**
 * Navigation context
 */
export interface NavigationContext {
  /** Current feature ID */
  featureId?: string

  /** Current sub-feature ID */
  subFeatureId?: string

  /** Navigation path */
  path: string[]

  /** User role for permission checking */
  userRole: UserRole
}

/**
 * Feature registry options
 */
export interface FeatureRegistryOptions {
  /** Base path for features */
  basePath?: string

  /** Whether to auto-load features on startup */
  autoLoad?: boolean

  /** Whether to watch for file changes (hot reload) */
  watchChanges?: boolean
}

/**
 * Feature loader result
 */
export interface LoadResult {
  /** Number of features loaded */
  loaded: number

  /** Number of features failed to load */
  failed: number

  /** List of loaded feature IDs */
  loadedFeatures: string[]

  /** List of failed features with errors */
  failedFeatures: Array<{
    id: string
    path: string
    error: string
  }>
}

/**
 * Menu builder options
 */
export interface MenuBuilderOptions {
  /** Maximum buttons per row */
  maxButtonsPerRow?: number

  /** Show back button */
  showBackButton?: boolean

  /** Back button text */
  backButtonText?: string

  /** Show home button */
  showHomeButton?: boolean

  /** Home button text */
  homeButtonText?: string
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  /** Whether the user has permission */
  allowed: boolean

  /** Reason if not allowed */
  reason?: string

  /** Required permissions */
  required?: UserRole[]

  /** User's current role */
  userRole?: UserRole
}
