/**
 * Reports and Analytics Feature
 * ميزة التقارير والإحصائيات
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { reportsConfig } from './config.js'
import { reportsHandler } from './handlers/reports.js'

// Export config for feature registry
export { reportsConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(reportsHandler)
