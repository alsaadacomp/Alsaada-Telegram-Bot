/**
 * Logging Settings Handler
 * معالج إعدادات السجلات
 */

import type { Context } from '#root/bot/context.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const loggingSettingsHandler = new Composer<Context>()

/**
 * Logging Level Settings
 */
loggingSettingsHandler.callbackQuery('settings:logging:level', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentLevel = await settingsManager.get('logging.level') as string || 'info'

  const keyboard = new InlineKeyboard()
    .text(currentLevel === 'debug' ? '✅ Debug' : '⬜ Debug', 'settings:logging:level:debug')
    .text(currentLevel === 'info' ? '✅ Info' : '⬜ Info', 'settings:logging:level:info')
    .row()
    .text(currentLevel === 'warn' ? '✅ Warn' : '⬜ Warn', 'settings:logging:level:warn')
    .text(currentLevel === 'error' ? '✅ Error' : '⬜ Error', 'settings:logging:level:error')
    .row()
    .text('🔙 رجوع لإعدادات السجلات', 'settings:logging')

  await ctx.editMessageText(
    '📝 **مستوى السجلات**\n\n'
    + `المستوى الحالي: **${currentLevel.toUpperCase()}**\n\n`
    + '**المستويات المتاحة:**\n'
    + '• **Debug**: جميع التفاصيل (للتطوير)\n'
    + '• **Info**: المعلومات العامة (موصى به)\n'
    + '• **Warn**: التحذيرات فقط\n'
    + '• **Error**: الأخطاء فقط\n\n'
    + 'اختر المستوى المطلوب:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Change logging level
 */
loggingSettingsHandler.callbackQuery(/^settings:logging:level:(debug|info|warn|error)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const level = ctx.match[1]

  await settingsManager.set(
    'logging.level',
    level,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(`✅ تم تغيير المستوى إلى ${level.toUpperCase()}`)

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(level === 'debug' ? '✅ Debug' : '⬜ Debug', 'settings:logging:level:debug')
    .text(level === 'info' ? '✅ Info' : '⬜ Info', 'settings:logging:level:info')
    .row()
    .text(level === 'warn' ? '✅ Warn' : '⬜ Warn', 'settings:logging:level:warn')
    .text(level === 'error' ? '✅ Error' : '⬜ Error', 'settings:logging:level:error')
    .row()
    .text('🔙 رجوع لإعدادات السجلات', 'settings:logging')

  await ctx.editMessageText(
    '📝 **مستوى السجلات**\n\n'
    + `المستوى الحالي: **${level.toUpperCase()}**\n\n`
    + '**المستويات المتاحة:**\n'
    + '• **Debug**: جميع التفاصيل (للتطوير)\n'
    + '• **Info**: المعلومات العامة (موصى به)\n'
    + '• **Warn**: التحذيرات فقط\n'
    + '• **Error**: الأخطاء فقط\n\n'
    + 'اختر المستوى المطلوب:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Save to file settings
 */
loggingSettingsHandler.callbackQuery('settings:logging:save', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const isEnabled = await settingsManager.get('logging.log_to_file') as boolean

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:logging:save:toggle')
    .row()
    .text('🔙 رجوع لإعدادات السجلات', 'settings:logging')

  await ctx.editMessageText(
    '💾 **حفظ السجلات في ملفات**\n\n'
    + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التفعيل، سيتم حفظ جميع السجلات في ملفات على الخادم.\n'
    + 'هذا مفيد للتدقيق وتتبع الأخطاء.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Toggle save to file
 */
loggingSettingsHandler.callbackQuery('settings:logging:save:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentValue = await settingsManager.get('logging.log_to_file') as boolean
  const newValue = !currentValue

  await settingsManager.set(
    'logging.log_to_file',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل حفظ السجلات' : '⬜ تم تعطيل حفظ السجلات',
  )

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعل' : '⬜ معطل', 'settings:logging:save:toggle')
    .row()
    .text('🔙 رجوع لإعدادات السجلات', 'settings:logging')

  await ctx.editMessageText(
    '💾 **حفظ السجلات في ملفات**\n\n'
    + `الحالة: ${newValue ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التفعيل، سيتم حفظ جميع السجلات في ملفات على الخادم.\n'
    + 'هذا مفيد للتدقيق وتتبع الأخطاء.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})
