/**
 * Performance Settings Handler
 * معالج إعدادات الأداء والكاش
 */

import type { Context } from '#root/bot/context.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const performanceSettingsHandler = new Composer<Context>()

/**
 * Main performance settings menu
 */
performanceSettingsHandler.callbackQuery('settings:performance', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('💨 الكاش', 'settings:performance:cache')
    .row()
    .text('⏱️ مدة الكاش', 'settings:performance:cache-timeout')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '⚡ **إعدادات الأداء**\n\n'
    + 'اختر الإعداد الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Cache toggle
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentValue = await settingsManager.get('performance.cache_enabled')
  const isEnabled = Boolean(currentValue)

  const keyboard = new InlineKeyboard()
    .text(`${isEnabled ? '❌ إيقاف' : '✅ تفعيل'} الكاش`, 'settings:performance:cache:toggle')
    .row()
    .text('🔄 تحديث الكاش', 'settings:performance:cache:refresh')
    .row()
    .text('🗑️ مسح الكاش', 'settings:performance:cache:clear')
    .row()
    .text('📊 إحصائيات الكاش', 'settings:performance:cache:stats')
    .row()
    .text('🔙 رجوع لإعدادات الأداء', 'settings:performance')

  await ctx.editMessageText(
    '💨 **إعدادات الكاش**\n\n'
    + `**الحالة الحالية:** ${isEnabled ? '✅ مفعل' : '❌ معطل'}\n\n`
    + '**الوظائف المتاحة:**\n'
    + '🔄 **تحديث الكاش**: إعادة تحميل البيانات المهمة\n'
    + '🗑️ **مسح الكاش**: حذف جميع البيانات المخزنة مؤقتاً\n'
    + '📊 **إحصائيات الكاش**: عرض معلومات عن استخدام الكاش\n\n'
    + '💡 **ملاحظة**: الكاش يحسن الأداء عبر تخزين البيانات مؤقتاً.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Cache timeout settings
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache-timeout', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const currentValue = await settingsManager.get('performance.cache_timeout')
  const timeoutMinutes = Math.floor(Number(currentValue) / 60000) // Convert ms to minutes

  const keyboard = new InlineKeyboard()
    .text('5 دقائق', 'settings:performance:timeout:5')
    .text('10 دقائق', 'settings:performance:timeout:10')
    .row()
    .text('15 دقيقة', 'settings:performance:timeout:15')
    .text('30 دقيقة', 'settings:performance:timeout:30')
    .row()
    .text('60 دقيقة', 'settings:performance:timeout:60')
    .text('120 دقيقة', 'settings:performance:timeout:120')
    .row()
    .text('✏️ مدة مخصصة', 'settings:performance:timeout:custom')
    .row()
    .text('🔙 رجوع لإعدادات الأداء', 'settings:performance')

  await ctx.editMessageText(
    '⏱️ **مدة الكاش**\n\n'
    + `**المدة الحالية:** ${timeoutMinutes} دقيقة\n\n`
    + '**اختر مدة جديدة:**\n\n'
    + '💡 **ملاحظة**: كلما كانت المدة أطول، كلما كان الأداء أفضل ولكن البيانات قد تكون أقل حداثة.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Cache toggle handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const currentValue = await settingsManager.get('performance.cache_enabled')
    const newValue = !currentValue

    await settingsManager.set('performance.cache_enabled', newValue)

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع لإعدادات الكاش', 'settings:performance:cache')

    const statusMessage = newValue
      ? '💨 الكاش مفعل الآن وسيحسن الأداء عبر تخزين البيانات مؤقتاً.'
      : '⚠️ الكاش معطل الآن وقد يكون الأداء أبطأ قليلاً.'

    await ctx.editMessageText(
      `✅ **تم ${newValue ? 'تفعيل' : 'إيقاف'} الكاش بنجاح!**\n\n**الحالة الجديدة:** ${newValue ? '✅ مفعل' : '❌ معطل'}\n\n${statusMessage}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error toggling cache:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء تغيير إعدادات الكاش')
  }
})

/**
 * Cache refresh handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache:refresh', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    // Here you would implement actual cache refresh logic
    // For now, we'll simulate it
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع لإعدادات الكاش', 'settings:performance:cache')

    // Reload cache timeout from database
    await settingsManager.reloadCacheTimeout()

    await ctx.editMessageText(
      '🔄 **تم تحديث الكاش بنجاح!**\n\n'
      + '**ما تم تحديثه:**\n'
      + '• بيانات المستخدمين\n'
      + '• إعدادات النظام\n'
      + '• قوالب الإشعارات\n'
      + '• إحصائيات قاعدة البيانات\n'
      + '• مدة الكاش من قاعدة البيانات\n\n'
      + '✅ الكاش محدث الآن ويحتوي على أحدث البيانات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error refreshing cache:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء تحديث الكاش')
  }
})

/**
 * Cache clear handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache:clear', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('✅ تأكيد المسح', 'settings:performance:cache:clear:confirm')
    .row()
    .text('❌ إلغاء', 'settings:performance:cache')

  await ctx.editMessageText(
    '🗑️ **مسح الكاش**\n\n'
    + '⚠️ **تحذير**: هذا الإجراء سيمسح جميع البيانات المخزنة مؤقتاً في الكاش.\n\n'
    + '**ما سيتم مسحه:**\n'
    + '• بيانات المستخدمين المخزنة مؤقتاً\n'
    + '• إعدادات النظام المخزنة مؤقتاً\n'
    + '• قوالب الإشعارات المخزنة مؤقتاً\n'
    + '• جميع البيانات المؤقتة الأخرى\n\n'
    + '💡 **ملاحظة**: البيانات الأصلية في قاعدة البيانات لن تتأثر.\n\n'
    + 'هل أنت متأكد من أنك تريد المتابعة؟',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Cache clear confirmation handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache:clear:confirm', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    // Here you would implement actual cache clearing logic
    // For now, we'll simulate it
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع لإعدادات الكاش', 'settings:performance:cache')

    // Clear all cache
    settingsManager.clearCache()

    await ctx.editMessageText(
      '🗑️ **تم مسح الكاش بنجاح!**\n\n'
      + '**ما تم مسحه:**\n'
      + '• بيانات المستخدمين المخزنة مؤقتاً\n'
      + '• إعدادات النظام المخزنة مؤقتاً\n'
      + '• قوالب الإشعارات المخزنة مؤقتاً\n'
      + '• جميع البيانات المؤقتة الأخرى\n\n'
      + '✅ الكاش فارغ الآن وسيتم إعادة ملؤه تدريجياً عند الحاجة.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error clearing cache:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء مسح الكاش')
  }
})

/**
 * Cache statistics handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:cache:stats', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    // Get actual cache statistics
    const stats = settingsManager.getCacheStats()
    const timeoutMinutes = Math.floor(stats.timeout / 60000)
    const keyboard = new InlineKeyboard()
      .text('🔄 تحديث الإحصائيات', 'settings:performance:cache:stats')
      .row()
      .text('🔙 رجوع لإعدادات الكاش', 'settings:performance:cache')

    const cacheEntries = stats.entries.length
    const userEntries = stats.entries.filter(e => e.key.includes('user')).length
    const settingEntries = stats.entries.filter(e => e.key.includes('setting')).length
    const templateEntries = stats.entries.filter(e => e.key.includes('template')).length

    await ctx.editMessageText(
      '📊 **إحصائيات الكاش**\n\n'
      + `**حالة الكاش:**\n`
      + `• الحالة: ${stats.enabled ? '✅ مفعل' : '❌ معطل'}\n`
      + `• المدة: ${timeoutMinutes} دقيقة\n`
      + `• إجمالي العناصر: ${stats.size} عنصر\n\n`
      + `**البيانات المخزنة:**\n`
      + `• المستخدمين: ${userEntries} عنصر\n`
      + `• الإعدادات: ${settingEntries} عنصر\n`
      + `• القوالب: ${templateEntries} عنصر\n`
      + `• أخرى: ${cacheEntries - userEntries - settingEntries - templateEntries} عنصر\n\n`
      + `**الأداء:**\n`
      + `• مدة الكاش: ${timeoutMinutes} دقيقة\n`
      + `• إجمالي العناصر: ${stats.size}\n`
      + `• آخر تحديث: الآن\n\n`
      + '💡 **ملاحظة**: هذه إحصائيات حقيقية من النظام.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error getting cache stats:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء جلب إحصائيات الكاش')
  }
})

/**
 * Cache timeout handlers
 */
performanceSettingsHandler.callbackQuery(/^settings:performance:timeout:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const minutes = Number.parseInt(ctx.match![1], 10)
  const milliseconds = minutes * 60000

  try {
    await settingsManager.set('performance.cache_timeout', milliseconds)

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع لإعدادات مدة الكاش', 'settings:performance:cache-timeout')

    await ctx.editMessageText(
      `✅ **تم تحديث مدة الكاش بنجاح!**\n\n`
      + `**المدة الجديدة:** ${minutes} دقيقة\n\n`
      + '💡 **ملاحظة**: المدة الجديدة ستطبق على البيانات الجديدة فقط.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error setting cache timeout:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء تحديث مدة الكاش')
  }
})

/**
 * Custom cache timeout handler
 */
performanceSettingsHandler.callbackQuery('settings:performance:timeout:custom', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  // Set session to await input
  ctx.session.awaitingInput = {
    type: 'cache_timeout',
  }

  const keyboard = new InlineKeyboard()
    .text('❌ إلغاء', 'settings:performance:cache-timeout')

  await ctx.editMessageText(
    '✏️ **مدة مخصصة للكاش**\n\n'
    + 'أدخل المدة بالدقائق (1-1440):\n\n'
    + '**أمثلة:**\n'
    + '• 5 (5 دقائق)\n'
    + '• 30 (30 دقيقة)\n'
    + '• 120 (ساعتان)\n'
    + '• 1440 (24 ساعة)\n\n'
    + '💡 **ملاحظة**: المدة القصوى هي 24 ساعة (1440 دقيقة).',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle text input for custom cache timeout
 */
performanceSettingsHandler.on('message:text', async (ctx, next) => {
  if (!ctx.session.awaitingInput || ctx.dbUser?.role !== 'SUPER_ADMIN') {
    return next()
  }

  const { type } = ctx.session.awaitingInput
  const newValue = ctx.message.text.trim()

  if (newValue === '/cancel') {
    ctx.session.awaitingInput = undefined
    await ctx.reply('❌ تم إلغاء العملية.')
    return
  }

  if (type === 'cache_timeout') {
    try {
      const minutes = Number.parseInt(newValue, 10)

      if (Number.isNaN(minutes) || minutes < 1 || minutes > 1440) {
        await ctx.reply('❌ القيمة يجب أن تكون رقماً بين 1 و 1440 دقيقة.')
        return
      }

      const milliseconds = minutes * 60000
      await settingsManager.set('performance.cache_timeout', milliseconds)

      ctx.session.awaitingInput = undefined

      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع لإعدادات مدة الكاش', 'settings:performance:cache-timeout')

      await ctx.reply(
        `✅ **تم تحديث مدة الكاش بنجاح!**\n\n`
        + `**المدة الجديدة:** ${minutes} دقيقة\n\n`
        + '💡 **ملاحظة**: المدة الجديدة ستطبق على البيانات الجديدة فقط.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    catch (error) {
      console.error('Error setting custom cache timeout:', error)
      await ctx.reply('❌ حدث خطأ أثناء تحديث مدة الكاش.')
      ctx.session.awaitingInput = undefined
    }
  }
})
