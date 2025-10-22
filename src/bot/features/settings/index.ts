/**
 * Settings Feature
 * نظام الإعدادات الشامل للسوبر ادمن
 */

import type { Context } from '#root/bot/context.js'
import { Composer, InlineKeyboard } from 'grammy'
import { historyStatsHandler } from '../notifications-panel/handlers/history-stats.js'
import { sendNotificationHandler } from '../notifications-panel/handlers/send-notification.js'
import { templatesHandler } from '../notifications-panel/handlers/templates.js'
import { settingsConfig } from './config.js'
import { botSettingsHandler } from './handlers/bot-settings.js'
import { companySettingsFullHandler } from './handlers/company-settings-full.js'
import { databaseSettingsHandler } from './handlers/database-settings.js'
import { featuresToggleHandler } from './handlers/features-toggle.js'
import { loggingSettingsHandler } from './handlers/logging-settings.js'
import { notificationSettingsHandler } from './handlers/notification-settings.js'
import { performanceSettingsHandler } from './handlers/performance-settings.js'
import { securitySettingsHandler } from './handlers/security-settings.js'

// Export config for feature registry
export { settingsConfig as config }

export const composer = new Composer<Context>()
export const settingsFeatureComposer = composer // للتوافق مع الاستخدام القديم

// Register all handlers
settingsFeatureComposer.use(companySettingsFullHandler)
settingsFeatureComposer.use(featuresToggleHandler)
settingsFeatureComposer.use(botSettingsHandler)
settingsFeatureComposer.use(securitySettingsHandler)
settingsFeatureComposer.use(databaseSettingsHandler)
settingsFeatureComposer.use(loggingSettingsHandler)
settingsFeatureComposer.use(notificationSettingsHandler)
settingsFeatureComposer.use(performanceSettingsHandler)
// Notification panel handlers (now part of notification settings)
settingsFeatureComposer.use(sendNotificationHandler)
settingsFeatureComposer.use(templatesHandler)
settingsFeatureComposer.use(historyStatsHandler)

/**
 * Main settings menu
 */
settingsFeatureComposer.callbackQuery('settings:main', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🏢 بيانات الشركة', 'settings:company')
    .row()
    .text('🔧 إعدادات البوت', 'settings:bot')
    .row()
    .text('🎯 تفعيل/إيقاف الأقسام', 'settings:features')
    .row()
    .text('🔒 إعدادات الأمان', 'settings:security')
    .row()
    .text('📊 إعدادات قاعدة البيانات', 'settings:database')
    .row()
    .text('📝 إعدادات السجلات', 'settings:logging')
    .row()
    .text('🔔 إعدادات الإشعارات', 'settings:notifications')
    .row()
    .text('⚡ إعدادات الأداء', 'settings:performance')
    .row()
    .text('🌐 إعدادات اللغة', 'settings:language')
    .row()
    .text('🔙 رجوع', 'settings:close')

  await ctx.editMessageText(
    '⚙️ **لوحة الإعدادات**\n\n'
    + 'اختر القسم الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Bot settings
 */
settingsFeatureComposer.callbackQuery('settings:bot', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔧 وضع الصيانة', 'settings:bot:maintenance')
    .row()
    .text('📝 رسالة الترحيب', 'settings:bot:welcome')
    .row()
    .text('🌐 اللغة الافتراضية', 'settings:bot:language')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '🔧 **إعدادات البوت**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Security settings
 */
settingsFeatureComposer.callbackQuery('settings:security', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔒 حد المحاولات', 'settings:security:rate-limit')
    .row()
    .text('🚫 الحظر التلقائي', 'settings:security:auto-ban')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '🔒 **إعدادات الأمان**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Database settings
 */
settingsFeatureComposer.callbackQuery('settings:database', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('💾 النسخ الاحتياطي التلقائي', 'settings:database:backup')
    .row()
    .text('🗄️ حد النسخ الاحتياطية', 'settings:database:max-backups')
    .row()
    .text('📦 إدارة النسخ الاحتياطية', 'settings:database:manage-backups')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '📊 **إعدادات قاعدة البيانات**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Logging settings
 */
settingsFeatureComposer.callbackQuery('settings:logging', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📝 مستوى السجلات', 'settings:logging:level')
    .row()
    .text('💾 حفظ السجلات', 'settings:logging:save')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '📝 **إعدادات السجلات**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Notifications settings
 */
settingsFeatureComposer.callbackQuery('settings:notifications', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔔 تفعيل الإشعارات', 'settings:notifications:enabled')
    .row()
    .text('⚡ الأولوية الافتراضية', 'settings:notifications:priority')
    .row()
    .text('📤 إرسال إشعار', 'settings:notifications:send')
    .row()
    .text('📋 القوالب الجاهزة', 'settings:notifications:templates')
    .row()
    .text('📊 سجل الإشعارات', 'settings:notifications:history')
    .row()
    .text('📈 إحصائيات الإشعارات', 'settings:notifications:stats')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '🔔 **إعدادات الإشعارات**\n\n'
    + 'اختر الإعداد أو الوظيفة التي تريدها:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Language settings
 */
settingsFeatureComposer.callbackQuery('settings:language', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🌐 اللغة الافتراضية', 'settings:language:default')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '🌐 **إعدادات اللغة**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Close settings
 */
settingsFeatureComposer.callbackQuery('settings:close', async (ctx) => {
  await ctx.answerCallbackQuery()
  await ctx.deleteMessage()
})
