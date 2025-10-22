/**
 * Notifications Panel Feature
 * لوحة إدارة الإشعارات الاحترافية
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { notificationsPanelConfig } from './config.js'
import { historyStatsHandler } from './handlers/history-stats.js'
import { sendNotificationHandler } from './handlers/send-notification.js'
import { templatesHandler } from './handlers/templates.js'

// Export config for feature registry
export { notificationsPanelConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(sendNotificationHandler)
composer.use(templatesHandler)
composer.use(historyStatsHandler)
