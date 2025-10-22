/**
 * Test Feature Module
 *
 * قسم تجريبي يستخدم جميع الوحدات المبنية
 */

import type { Context } from '../../context.js'
import { Composer } from 'grammy'
import { testFeatureConfig } from './config.js'
import { formDemoHandler } from './handlers/form-demo.js'
import { multiStepDemoHandler } from './handlers/multi-step-demo.js'
import { tableDemoHandler } from './handlers/table-demo.js'

export const composer = new Composer<Context>()

// Export config for auto-discovery
export { testFeatureConfig as config }

// Register all handlers
composer.use(formDemoHandler)
composer.use(multiStepDemoHandler)
composer.use(tableDemoHandler)

/**
 * Initialize the test feature
 */
export async function init() {
  console.log('✅ Test Feature initialized')
}

/**
 * Cleanup on shutdown
 */
export async function cleanup() {
  console.log('🔄 Test Feature cleaned up')
}
