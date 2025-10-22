import type { Context } from '#root/bot/context.js'
import { NotificationService } from '#root/modules/notifications/notification-service.js'
import { Composer, InlineKeyboard } from 'grammy'

export const historyStatsHandler = new Composer<Context>()
const notificationService = new NotificationService()

/**
 * Notification history
 */
historyStatsHandler.callbackQuery('settings:notifications:history', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const history = await notificationService.getHistory(10)

  if (history.length === 0) {
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

    await ctx.editMessageText(
      '📊 **سجل الإشعارات**\n\n'
      + 'لا توجد إشعارات في السجل حالياً.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
    return
  }

  let message = '📊 **سجل الإشعارات** (آخر 10)\n\n'

  history.forEach((record: any, index: number) => {
    const statusEmojiMap: Record<string, string> = {
      pending: '⏳',
      sent: '✅',
      failed: '❌',
      cancelled: '🚫',
      scheduled: '📅',
    }
    const statusEmoji = statusEmojiMap[record.status] || '❓'

    const typeEmojiMap: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      announcement: '📢',
      reminder: '🔔',
      alert: '🚨',
    }
    const typeEmoji = typeEmojiMap[record.type] || 'ℹ️'

    const priorityEmojiMap: Record<string, string> = {
      normal: '🔵',
      important: '🟡',
      urgent: '🟠',
      critical: '🔴',
    }
    const priorityEmoji = priorityEmojiMap[record.priority] || '🔵'

    message += `${index + 1}. ${statusEmoji} ${typeEmoji} ${priorityEmoji}\n`
    message += `   **الرسالة**: ${record.message.substring(0, 50)}${record.message.length > 50 ? '...' : ''}\n`
    message += `   **المستلمون**: ${record.recipients.length}\n`
    message += `   **النجاح**: ${record.successCount} | **الفشل**: ${record.failureCount}\n`
    message += `   **التاريخ**: ${record.createdAt.toLocaleDateString('ar')}\n\n`
  })

  const keyboard = new InlineKeyboard()
    .text('🗑️ مسح السجل', 'notif:history:clear')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

/**
 * Clear history
 */
historyStatsHandler.callbackQuery('notif:history:clear', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('✅ نعم، امسح', 'notif:history:clear:confirm')
    .text('❌ لا، إلغاء', 'settings:notifications:history')

  await ctx.editMessageText(
    '⚠️ **تأكيد مسح السجل**\n\n'
    + 'هل أنت متأكد من مسح سجل الإشعارات؟\n'
    + 'لا يمكن التراجع عن هذا الإجراء.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Confirm clear history
 */
historyStatsHandler.callbackQuery('notif:history:clear:confirm', async (ctx) => {
  await ctx.answerCallbackQuery()

  await notificationService.clearHistory()

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '✅ **تم مسح سجل الإشعارات بنجاح**',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Notification statistics
 */
historyStatsHandler.callbackQuery('settings:notifications:stats', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const stats = await notificationService.getStatistics()

  const message
    = '📈 **إحصائيات الإشعارات**\n\n'
      + '📊 **المجموع الكلي**\n'
      + `   • الإجمالي: ${stats.total}\n`
      + `   • تم الإرسال: ${stats.sent}\n`
      + `   • فشل: ${stats.failed}\n`
      + `   • معلق: ${stats.pending}\n`
      + `   • مجدول: ${stats.scheduled}\n`
      + `   • ملغي: ${stats.cancelled}\n`
      + `   • نسبة النجاح: ${stats.successRate.toFixed(1)}%\n\n`

      + '⚡ **حسب الأولوية**\n'
      + `   🔵 عادي: ${stats.byPriority.normal}\n`
      + `   🟡 مهم: ${stats.byPriority.important}\n`
      + `   🟠 عاجل: ${stats.byPriority.urgent}\n`
      + `   🔴 حرج: ${stats.byPriority.critical}\n\n`

      + '📝 **حسب النوع**\n'
      + `   ℹ️ معلومات: ${stats.byType.info}\n`
      + `   ✅ نجاح: ${stats.byType.success}\n`
      + `   ⚠️ تحذير: ${stats.byType.warning}\n`
      + `   ❌ خطأ: ${stats.byType.error}\n`
      + `   📢 إعلان: ${stats.byType.announcement}\n`
    + `   🔔 تذكير: ${stats.byType.reminder}\n`
    + `   🚨 تنبيه: ${stats.byType.alert}\n\n`

    + '👥 **حسب الفئة المستهدفة**\n'
    + `   • كل المستخدمين: ${stats.byTarget.all_users}\n`
    + `   • كل الإداريين: ${stats.byTarget.all_admins}\n`
    + `   • السوبر أدمن: ${stats.byTarget.super_admin}\n`
    + `   • دور محدد: ${stats.byTarget.role}\n`
    + `   • مستخدمون محددون: ${stats.byTarget.specific_users}\n`
    + `   • مستخدمون نشطون: ${stats.byTarget.active_users}\n`
    + `   • مستخدمون غير نشطين: ${stats.byTarget.inactive_users}\n`
    + `   • مستخدمون جدد: ${stats.byTarget.new_users}`

  const keyboard = new InlineKeyboard()
    .text('🔄 تحديث', 'settings:notifications:stats')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})
