/**
 * Security Settings Handler
 * معالج إعدادات الأمان
 */

import type { Context } from '#root/bot/context.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const securitySettingsHandler = new Composer<Context>()

/**
 * Rate Limit Settings
 */
securitySettingsHandler.callbackQuery('settings:security:rate-limit', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const isEnabled = await settingsManager.get('security.rate_limit_enabled') as boolean
  const maxRequests = await settingsManager.get('security.rate_limit_max_requests') as number
  const window = await settingsManager.get('security.rate_limit_window') as number

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:security:rate-limit:toggle')
    .row()
    .text('✏️ تعديل الحد الأقصى', 'settings:security:rate-limit:max')
    .text('✏️ تعديل النافذة', 'settings:security:rate-limit:window')
    .row()
    .text('🔙 رجوع لإعدادات الأمان', 'settings:security')

  await ctx.editMessageText(
    '🔒 **إعدادات حد المحاولات (Rate Limit)**\n\n'
    + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
    + `الحد الأقصى للطلبات: **${maxRequests}**\n`
    + `النافذة الزمنية: **${window / 1000} ثانية**\n\n`
    + 'هذه الإعدادات تحمي البوت من الاستخدام المفرط.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

securitySettingsHandler.callbackQuery('settings:security:rate-limit:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentValue = await settingsManager.get('security.rate_limit_enabled') as boolean
  const newValue = !currentValue

  await settingsManager.set(
    'security.rate_limit_enabled',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل حد المحاولات' : '⬜ تم تعطيل حد المحاولات',
  )

  // Refresh the view
  const maxRequests = await settingsManager.get('security.rate_limit_max_requests') as number
  const window = await settingsManager.get('security.rate_limit_window') as number

  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعل' : '⬜ معطل', 'settings:security:rate-limit:toggle')
    .row()
    .text('✏️ تعديل الحد الأقصى', 'settings:security:rate-limit:max')
    .text('✏️ تعديل النافذة', 'settings:security:rate-limit:window')
    .row()
    .text('🔙 رجوع لإعدادات الأمان', 'settings:security')

  await ctx.editMessageText(
    '🔒 **إعدادات حد المحاولات (Rate Limit)**\n\n'
    + `الحالة: ${newValue ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
    + `الحد الأقصى للطلبات: **${maxRequests}**\n`
    + `النافذة الزمنية: **${window / 1000} ثانية**\n\n`
    + 'هذه الإعدادات تحمي البوت من الاستخدام المفرط.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

securitySettingsHandler.callbackQuery('settings:security:rate-limit:max', async (ctx) => {
  await ctx.answerCallbackQuery()

  const maxRequests = await settingsManager.get('security.rate_limit_max_requests') as number

  await ctx.editMessageText(
    '✏️ **تعديل الحد الأقصى للطلبات**\n\n'
    + `القيمة الحالية: ${maxRequests}\n\n`
    + 'أرسل القيمة الجديدة (رقم):',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'rate_limit_max',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

securitySettingsHandler.callbackQuery('settings:security:rate-limit:window', async (ctx) => {
  await ctx.answerCallbackQuery()

  const window = await settingsManager.get('security.rate_limit_window') as number

  await ctx.editMessageText(
    '✏️ **تعديل نافذة الوقت**\n\n'
    + `القيمة الحالية: ${window / 1000} ثانية\n\n`
    + 'أرسل القيمة الجديدة (بالثواني):',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'rate_limit_window',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Auto-ban Settings
 */
securitySettingsHandler.callbackQuery('settings:security:auto-ban', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const isEnabled = await settingsManager.get('security.auto_ban_on_spam') as boolean

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:security:auto-ban:toggle')
    .row()
    .text('🔙 رجوع لإعدادات الأمان', 'settings:security')

  await ctx.editMessageText(
    '🚫 **إعدادات الحظر التلقائي**\n\n'
    + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التفعيل، سيتم حظر المستخدمين الذين يرسلون رسائل مزعجة بشكل تلقائي.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

securitySettingsHandler.callbackQuery('settings:security:auto-ban:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentValue = await settingsManager.get('security.auto_ban_on_spam') as boolean
  const newValue = !currentValue

  await settingsManager.set(
    'security.auto_ban_on_spam',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل الحظر التلقائي' : '⬜ تم تعطيل الحظر التلقائي',
  )

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعل' : '⬜ معطل', 'settings:security:auto-ban:toggle')
    .row()
    .text('🔙 رجوع لإعدادات الأمان', 'settings:security')

  await ctx.editMessageText(
    '🚫 **إعدادات الحظر التلقائي**\n\n'
    + `الحالة: ${newValue ? '✅ **مفعل**' : '⬜ **معطل**'}\n\n`
    + 'عند التفعيل، سيتم حظر المستخدمين الذين يرسلون رسائل مزعجة بشكل تلقائي.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

securitySettingsHandler.on('message:text', async (ctx, next) => {
  if (!ctx.session.awaitingInput || ctx.dbUser?.role !== 'SUPER_ADMIN') {
    return next()
  }

  const { type, messageId } = ctx.session.awaitingInput
  const newValue = ctx.message.text.trim()

  if (newValue === '/cancel') {
    ctx.session.awaitingInput = undefined
    await ctx.reply('❌ تم إلغاء العملية.')
    return
  }

  try {
    let settingKey: string | undefined
    let valueToSet: any = newValue

    if (type === 'rate_limit_max') {
      settingKey = 'security.rate_limit_max_requests'
      valueToSet = Number.parseInt(newValue, 10)
      if (Number.isNaN(valueToSet)) {
        await ctx.reply('❌ القيمة يجب أن تكون رقماً.')
        return
      }
    }
    else if (type === 'rate_limit_window') {
      settingKey = 'security.rate_limit_window'
      valueToSet = Number.parseInt(newValue, 10) * 1000
      if (Number.isNaN(valueToSet)) {
        await ctx.reply('❌ القيمة يجب أن تكون رقماً.')
        return
      }
    }

    if (settingKey) {
      await settingsManager.set(
        settingKey,
        valueToSet,
        { updatedBy: ctx.dbUser.userId },
      )

      ctx.session.awaitingInput = undefined

      await ctx.reply(
        '✅ **تم تحديث الإعداد بنجاح!**',
        { parse_mode: 'Markdown' },
      )

      // Refresh the view
      const isEnabled = await settingsManager.get('security.rate_limit_enabled') as boolean
      const maxRequests = await settingsManager.get('security.rate_limit_max_requests') as number
      const window = await settingsManager.get('security.rate_limit_window') as number

      const keyboard = new InlineKeyboard()
        .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:security:rate-limit:toggle')
        .row()
        .text('✏️ تعديل الحد الأقصى', 'settings:security:rate-limit:max')
        .text('✏️ تعديل النافذة', 'settings:security:rate-limit:window')
        .row()
        .text('🔙 رجوع لإعدادات الأمان', 'settings:security')

      if (messageId) {
        await ctx.api.editMessageText(
          ctx.chat.id,
          messageId,
          '🔒 **إعدادات حد المحاولات (Rate Limit)**\n\n'
          + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
          + `الحد الأقصى للطلبات: **${maxRequests}**\n`
          + `النافذة الزمنية: **${window / 1000} ثانية**\n\n`
          + 'هذه الإعدادات تحمي البوت من الاستخدام المفرط.',
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          },
        )
      }
    }
    else {
      return next()
    }
  }
  catch (error) {
    ctx.logger.error({ error, type, newValue }, 'Failed to update security setting')
    await ctx.reply('❌ حدث خطأ أثناء حفظ الإعداد.')
  }
})
