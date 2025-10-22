/**
 * Bot Settings Handler
 * معالج إعدادات البوت
 */

import type { Context } from '#root/bot/context.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const botSettingsHandler = new Composer<Context>()

/**
 * Maintenance Mode Toggle
 */
botSettingsHandler.callbackQuery('settings:bot:maintenance', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentValue = await settingsManager.get('bot.maintenance_mode')
  const isEnabled = currentValue === true

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعّل' : '⬜ معطّل', 'settings:bot:maintenance:toggle')
    .row()
    .text('✏️ تعديل رسالة الصيانة', 'settings:bot:maintenance:message')
    .row()
    .text('🔙 رجوع لإعدادات البوت', 'settings:bot')

  await ctx.editMessageText(
    '🔧 **وضع الصيانة (Maintenance Mode)**\n\n'
    + `الحالة الحالية: ${isEnabled ? '✅ **مفعّل**' : '⬜ **معطّل**'}\n\n`
    + 'عند التفعيل:\n'
    + '• البوت يعمل فقط للسوبر أدمن\n'
    + '• باقي المستخدمين يرون رسالة الصيانة\n'
    + '• مفيد للتحديثات والصيانة',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

botSettingsHandler.callbackQuery('settings:bot:maintenance:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentValue = await settingsManager.get('bot.maintenance_mode')
  const newValue = !currentValue

  await settingsManager.set(
    'bot.maintenance_mode',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل وضع الصيانة' : '⬜ تم تعطيل وضع الصيانة',
  )

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعّل' : '⬜ معطّل', 'settings:bot:maintenance:toggle')
    .row()
    .text('✏️ تعديل رسالة الصيانة', 'settings:bot:maintenance:message')
    .row()
    .text('🔙 رجوع لإعدادات البوت', 'settings:bot')

  await ctx.editMessageText(
    '🔧 **وضع الصيانة (Maintenance Mode)**\n\n'
    + `الحالة الحالية: ${newValue ? '✅ **مفعّل**' : '⬜ **معطّل**'}\n\n`
    + 'عند التفعيل:\n'
    + '• البوت يعمل فقط للسوبر أدمن\n'
    + '• باقي المستخدمين يرون رسالة الصيانة\n'
    + '• مفيد للتحديثات والصيانة',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

botSettingsHandler.callbackQuery('settings:bot:maintenance:message', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentMessage = await settingsManager.get('bot.maintenance_message') as string
    || 'البوت حالياً في وضع الصيانة. سنعود قريباً!'

  await ctx.editMessageText(
    '✏️ **تعديل رسالة الصيانة**\n\n'
    + `الرسالة الحالية:\n${currentMessage}\n\n`
    + 'أرسل الرسالة الجديدة:\n'
    + '_(يمكنك استخدام Markdown)_\n\n'
    + 'أو اضغط /cancel للإلغاء',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'maintenance_message',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Welcome Message
 */
botSettingsHandler.callbackQuery('settings:bot:welcome', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentMessage = await settingsManager.get('bot.welcome_message') as string || 'Welcome!'

  const keyboard = new InlineKeyboard()
    .text('✏️ تعديل الرسالة', 'settings:bot:welcome:edit')
    .row()
    .text('🔙 رجوع لإعدادات البوت', 'settings:bot')

  await ctx.editMessageText(
    '📝 **رسالة الترحيب**\n\n'
    + `الرسالة الحالية:\n${currentMessage}\n\n`
    + 'هذه الرسالة تظهر عند إرسال /start',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

botSettingsHandler.callbackQuery('settings:bot:welcome:edit', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentMessage = await settingsManager.get('bot.welcome_message') as string || 'Welcome!'

  await ctx.editMessageText(
    '✏️ **تعديل رسالة الترحيب**\n\n'
    + `الرسالة الحالية:\n${currentMessage}\n\n`
    + 'أرسل الرسالة الجديدة:\n'
    + '_(يمكنك استخدام Markdown)_\n\n'
    + 'المتغيرات المتاحة:\n'
    + '• `{name}` - اسم المستخدم\n'
    + '• `{username}` - معرف المستخدم\n\n'
    + 'أو اضغط /cancel للإلغاء',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'welcome_message',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Default Language
 */
botSettingsHandler.callbackQuery('settings:bot:language', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentLang = await settingsManager.get('bot.default_language') as string || 'ar'

  const keyboard = new InlineKeyboard()
    .text(currentLang === 'ar' ? '✅ العربية' : '⬜ العربية', 'settings:bot:language:ar')
    .text(currentLang === 'en' ? '✅ English' : '⬜ English', 'settings:bot:language:en')
    .row()
    .text('🔙 رجوع لإعدادات البوت', 'settings:bot')

  await ctx.editMessageText(
    '🌐 **اللغة الافتراضية**\n\n'
    + `اللغة الحالية: **${currentLang === 'ar' ? 'العربية' : 'English'}**\n\n`
    + 'اختر اللغة الافتراضية للبوت:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

botSettingsHandler.callbackQuery(/^settings:bot:language:(ar|en)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const lang = ctx.match[1]

  await settingsManager.set(
    'bot.default_language',
    lang,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    `✅ تم تغيير اللغة إلى ${lang === 'ar' ? 'العربية' : 'English'}`,
  )

  // Refresh the view
  const keyboard = new InlineKeyboard()
    .text(lang === 'ar' ? '✅ العربية' : '⬜ العربية', 'settings:bot:language:ar')
    .text(lang === 'en' ? '✅ English' : '⬜ English', 'settings:bot:language:en')
    .row()
    .text('🔙 رجوع لإعدادات البوت', 'settings:bot')

  await ctx.editMessageText(
    '🌐 **اللغة الافتراضية**\n\n'
    + `اللغة الحالية: **${lang === 'ar' ? 'العربية' : 'English'}**\n\n`
    + 'اختر اللغة الافتراضية للبوت:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle text input for bot settings
 */
botSettingsHandler.on('message:text', async (ctx, next) => {
  if (!ctx.session.awaitingInput || ctx.dbUser?.role !== 'SUPER_ADMIN') {
    return next()
  }

  const { type, messageId: _messageId } = ctx.session.awaitingInput
  const newValue = ctx.message.text.trim()

  if (newValue === '/cancel') {
    ctx.session.awaitingInput = undefined
    await ctx.reply('❌ تم إلغاء العملية.')
    return
  }

  try {
    if (type === 'maintenance_message') {
      await settingsManager.set(
        'bot.maintenance_message',
        newValue,
        { updatedBy: ctx.dbUser.userId },
      )

      ctx.session.awaitingInput = undefined

      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع لوضع الصيانة', 'settings:bot:maintenance')

      await ctx.reply(
        '✅ **تم تحديث رسالة الصيانة بنجاح!**\n\n'
        + `الرسالة الجديدة:\n${newValue}`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    else if (type === 'welcome_message') {
      await settingsManager.set(
        'bot.welcome_message',
        newValue,
        { updatedBy: ctx.dbUser.userId },
      )

      ctx.session.awaitingInput = undefined

      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع لرسالة الترحيب', 'settings:bot:welcome')

      await ctx.reply(
        '✅ **تم تحديث رسالة الترحيب بنجاح!**\n\n'
        + `الرسالة الجديدة:\n${newValue}`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    else {
      return next()
    }
  }
  catch (error) {
    ctx.logger.error({ error, type, newValue }, 'Failed to update bot setting')
    await ctx.reply('❌ حدث خطأ أثناء حفظ الإعداد.')
  }
})
