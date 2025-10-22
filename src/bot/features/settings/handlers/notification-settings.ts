import type { Context } from '#root/bot/context.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const notificationSettingsHandler = new Composer<Context>()

/**
 * Enable/Disable Notifications
 */
notificationSettingsHandler.callbackQuery('settings:notifications:enabled', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const isEnabled = await settingsManager.get('notifications.enabled') as boolean

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:notifications:enabled:toggle')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '🔔 **تفعيل الإشعارات**\n\n'
    + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التعطيل، لن يتم إرسال أي إشعارات للمستخدمين.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

notificationSettingsHandler.callbackQuery('settings:notifications:enabled:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentValue = await settingsManager.get('notifications.enabled') as boolean
  const newValue = !currentValue

  await settingsManager.set(
    'notifications.enabled',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل الإشعارات' : '⬜ تم تعطيل الإشعارات',
  )

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعل' : '⬜ معطل', 'settings:notifications:enabled:toggle')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '🔔 **تفعيل الإشعارات**\n\n'
    + `الحالة: ${newValue ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التعطيل، لن يتم إرسال أي إشعارات للمستخدمين.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Default Priority Settings
 */
notificationSettingsHandler.callbackQuery('settings:notifications:priority', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentPriority = await settingsManager.get('notifications.default_priority') as string

  const priorityLabels: Record<string, string> = {
    normal: '🔵 عادي',
    important: '🟡 مهم',
    urgent: '🟠 عاجل',
    critical: '🔴 حرج',
  }

  const keyboard = new InlineKeyboard()
    .text(currentPriority === 'normal' ? '✅ عادي' : '⬜ عادي', 'settings:notifications:priority:normal')
    .text(currentPriority === 'important' ? '✅ مهم' : '⬜ مهم', 'settings:notifications:priority:important')
    .row()
    .text(currentPriority === 'urgent' ? '✅ عاجل' : '⬜ عاجل', 'settings:notifications:priority:urgent')
    .text(currentPriority === 'critical' ? '✅ حرج' : '⬜ حرج', 'settings:notifications:priority:critical')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '⚡ **الأولوية الافتراضية للإشعارات**\n\n'
    + `الأولوية الحالية: ${priorityLabels[currentPriority]}\n\n`
    + '**الأنواع:**\n'
    + '🔵 **عادي** - إشعارات عادية\n'
    + '🟡 **مهم** - إشعارات مهمة تحتاج انتباه\n'
    + '🟠 **عاجل** - إشعارات عاجلة\n'
    + '🔴 **حرج** - إشعارات حرجة جداً',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

notificationSettingsHandler.callbackQuery(/^settings:notifications:priority:(normal|important|urgent|critical)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const newPriority = ctx.match[1]

  await settingsManager.set(
    'notifications.default_priority',
    newPriority,
    { updatedBy: ctx.dbUser?.userId },
  )

  const priorityLabels: Record<string, string> = {
    normal: '🔵 عادي',
    important: '🟡 مهم',
    urgent: '🟠 عاجل',
    critical: '🔴 حرج',
  }

  await ctx.answerCallbackQuery(`✅ تم تغيير الأولوية إلى ${priorityLabels[newPriority]}`)

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(newPriority === 'normal' ? '✅ عادي' : '⬜ عادي', 'settings:notifications:priority:normal')
    .text(newPriority === 'important' ? '✅ مهم' : '⬜ مهم', 'settings:notifications:priority:important')
    .row()
    .text(newPriority === 'urgent' ? '✅ عاجل' : '⬜ عاجل', 'settings:notifications:priority:urgent')
    .text(newPriority === 'critical' ? '✅ حرج' : '⬜ حرج', 'settings:notifications:priority:critical')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '⚡ **الأولوية الافتراضية للإشعارات**\n\n'
    + `الأولوية الحالية: ${priorityLabels[newPriority]}\n\n`
    + '**الأنواع:**\n'
    + '🔵 **عادي** - إشعارات عادية\n'
    + '🟡 **مهم** - إشعارات مهمة تحتاج انتباه\n'
    + '🟠 **عاجل** - إشعارات عاجلة\n'
    + '🔴 **حرج** - إشعارات حرجة جداً',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})
