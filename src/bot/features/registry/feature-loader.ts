/**
 * Feature Loader
 *
 * Auto-discovers and loads features from the features directory.
 */

import type { FeatureModule, LoadResult } from './types.js'
import { readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { logger } from '../../../modules/services/logger/index.js'
import { featureRegistry } from './feature-registry.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class FeatureLoader {
  private basePath: string

  constructor(basePath?: string) {
    this.basePath = basePath || join(__dirname, '..')
  }

  /**
   * Load all features from the features directory
   */
  async loadAll(): Promise<LoadResult> {
    const result: LoadResult = {
      loaded: 0,
      failed: 0,
      loadedFeatures: [],
      failedFeatures: [],
    }

    try {
      const items = readdirSync(this.basePath)

      for (const item of items) {
        const itemPath = join(this.basePath, item)

        // Skip non-directories
        if (!statSync(itemPath).isDirectory())
          continue

        // Skip registry directory
        if (item === 'registry')
          continue

        // Check for index.ts (source) or index.js (compiled)
        let indexPath = join(itemPath, 'index.js')
        let useSourceFile = false

        try {
          statSync(indexPath)
        }
        catch {
          // Try .ts file instead
          indexPath = join(itemPath, 'index.ts')
          try {
            statSync(indexPath)
            useSourceFile = true
          }
          catch {
            continue // Skip if neither exists
          }
        }

        // Try to load the feature
        try {
          await this.loadFeature(item, indexPath, useSourceFile)
          result.loaded++
          result.loadedFeatures.push(item)
        }
        catch (error) {
          result.failed++
          result.failedFeatures.push({
            id: item,
            path: itemPath,
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to load features')
    }

    return result
  }

  /**
   * Load a single feature
   */
  private async loadFeature(featureId: string, indexPath: string, useSourceFile: boolean): Promise<void> {
    try {
      // Convert Windows path to file URL
      const normalizedPath = indexPath.replace(/\\/g, '/')
      const fileUrl = useSourceFile
        ? `file:///${normalizedPath}` // Direct TS import
        : `file:///${normalizedPath}` // JS import

      // Import the feature module
      const module = await import(fileUrl)

      // Check if module exports required fields
      if (!module.config) {
        throw new Error(`Feature '${featureId}' does not export 'config'`)
      }

      if (!module.composer && !module.default) {
        throw new Error(`Feature '${featureId}' does not export 'composer' or 'default'`)
      }

      const featureModule: FeatureModule = {
        config: module.config,
        composer: module.composer || module.default,
        init: module.init,
        cleanup: module.cleanup,
      }

      // Register the feature
      featureRegistry.register(featureModule, indexPath)

      // Run init if exists
      if (featureModule.init) {
        await featureModule.init()
      }

      logger.info({
        id: featureModule.config.id,
        enabled: featureModule.config.enabled,
      }, `Feature loaded: ${featureModule.config.name}`)
    }
    catch (error) {
      logger.error({ error }, `Failed to load feature: ${featureId}`)
      throw error
    }
  }

  /**
   * Reload all features
   */
  async reload(): Promise<LoadResult> {
    featureRegistry.clear()
    return await this.loadAll()
  }

  /**
   * Get features directory path
   */
  getBasePath(): string {
    return this.basePath
  }
}

// Singleton instance
export const featureLoader = new FeatureLoader()
