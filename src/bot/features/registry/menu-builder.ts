/**
 * Menu Builder
 *
 * Builds dynamic inline keyboards from feature configurations.
 */

import type { FeatureConfig, MenuBuilderOptions, SubFeature, UserRole } from './types.js'
import { InlineKeyboard } from 'grammy'
import { featureRegistry } from './feature-registry.js'

export class MenuBuilder {
  /**
   * Build main menu keyboard
   */
  static buildMainMenu(userRole: UserRole, options?: MenuBuilderOptions): InlineKeyboard {
    const keyboard = new InlineKeyboard()
    const features = featureRegistry.getAccessibleSorted(userRole)

    const maxPerRow = options?.maxButtonsPerRow ?? 2

    features.forEach((feature, index) => {
      const text = this.formatFeatureName(feature.config)
      const callbackData = `menu:feature:${feature.config.id}`

      keyboard.text(text, callbackData)

      // New row after maxPerRow buttons or if it's the last button
      if ((index + 1) % maxPerRow === 0 || index === features.length - 1) {
        keyboard.row()
      }
    })

    return keyboard
  }

  /**
   * Build sub-menu keyboard for a feature
   */
  static buildSubMenu(
    featureId: string,
    userRole: UserRole,
    options?: MenuBuilderOptions,
  ): InlineKeyboard | null {
    const feature = featureRegistry.get(featureId)
    if (!feature)
      return null
    // Allow building submenu for system features even when disabled in main menu
    const isSystem = feature.config.category === 'system'
    if (!isSystem && !feature.config.enabled)
      return null

    // Check if user can access this feature
    if (!featureRegistry.canAccess(featureId, userRole))
      return null

    const subFeatures = featureRegistry.getAccessibleSubFeatures(featureId, userRole)
    if (subFeatures.length === 0)
      return null

    const keyboard = new InlineKeyboard()
    const maxPerRow = options?.maxButtonsPerRow ?? 2

    subFeatures.forEach((subFeature, index) => {
      const text = this.formatSubFeatureName(subFeature)
      // Route directly to the real handler if provided; fallback to internal menu route
      const callbackData = subFeature.handler || `menu:sub:${featureId}:${subFeature.id}`

      keyboard.text(text, callbackData)

      // New row after maxPerRow buttons or if it's the last button
      if ((index + 1) % maxPerRow === 0 || index === subFeatures.length - 1) {
        keyboard.row()
      }
    })

    // Add back button
    if (options?.showBackButton !== false) {
      const backText = options?.backButtonText ?? '⬅️ رجوع'
      keyboard.text(backText, 'menu:back').row()
    }

    return keyboard
  }

  /**
   * Build breadcrumb navigation
   */
  static buildBreadcrumb(path: string[]): string {
    if (path.length === 0)
      return 'القائمة الرئيسية'

    const breadcrumbs: string[] = ['القائمة الرئيسية']

    for (const featureId of path) {
      const feature = featureRegistry.get(featureId)
      if (feature) {
        breadcrumbs.push(feature.config.name)
      }
    }

    return breadcrumbs.join(' > ')
  }

  /**
   * Format feature name with icon
   */
  private static formatFeatureName(config: FeatureConfig): string {
    if (config.icon) {
      return `${config.icon} ${config.name}`
    }
    return config.name
  }

  /**
   * Format sub-feature name with icon
   */
  private static formatSubFeatureName(subFeature: SubFeature): string {
    if (subFeature.icon) {
      return `${subFeature.icon} ${subFeature.name}`
    }
    return subFeature.name
  }

  /**
   * Parse callback data
   */
  static parseCallback(callbackData: string): {
    action: string
    featureId?: string
    subFeatureId?: string
  } | null {
    const parts = callbackData.split(':')
    if (parts[0] !== 'menu')
      return null

    if (parts[1] === 'back') {
      return { action: 'back' }
    }

    if (parts[1] === 'feature' && parts[2]) {
      return { action: 'feature', featureId: parts[2] }
    }

    if (parts[1] === 'sub' && parts[2] && parts[3]) {
      return { action: 'sub', featureId: parts[2], subFeatureId: parts[3] }
    }

    return null
  }

  /**
   * Get feature description text
   */
  static getFeatureDescription(featureId: string): string | null {
    const feature = featureRegistry.get(featureId)
    if (!feature)
      return null

    let text = `**${this.formatFeatureName(feature.config)}**\n\n`

    if (feature.config.description) {
      text += `${feature.config.description}\n\n`
    }

    const subFeatures = featureRegistry.getEnabledSubFeatures(featureId)
    if (subFeatures.length > 0) {
      text += 'الأقسام المتاحة:\n'
      subFeatures.forEach((sf) => {
        text += `• ${this.formatSubFeatureName(sf)}\n`
      })
    }

    return text
  }
}
