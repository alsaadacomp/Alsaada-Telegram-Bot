import type { Context } from '#root/bot/context.js'
import type { NotificationPriority, NotificationType, TargetAudience } from '#root/modules/notifications/types.js'
import type { Conversation } from '@grammyjs/conversations'
import type { Context as DefaultContext } from 'grammy'
import { Database } from '#root/modules/database/index.js'
import { NotificationService } from '#root/modules/notifications/notification-service.js'
import { createConversation } from '@grammyjs/conversations'
import { InlineKeyboard } from 'grammy'

const notificationService = new NotificationService()

export const SEND_NOTIFICATION_CONVERSATION = 'send_notification'

type ConversationContext = DefaultContext & Context

interface NotificationData {
  type: string
  priority: string
  targetAudience: string
  targetRole?: string
  targetUserIds?: number[]
  message?: string
}

// Shared draft Map - MUST be imported from handler
export const notificationDraft = new Map<number, {
  message?: string
  type?: NotificationType
  priority?: NotificationPriority
  target?: TargetAudience
  targetUserIds?: number[]
}>()

export function sendNotificationConversation() {
  return createConversation(
    async (conversation: Conversation<Context, ConversationContext>, ctx: ConversationContext) => {
      // Get user ID to fetch data from draft
      const userId = ctx.from?.id
      if (!userId) {
        await ctx.reply('❌ خطأ: لم يتم التعرف على المستخدم')
        return
      }

      // Send initial prompt IMMEDIATELY (before any wait)
      await ctx.reply(
        '📝 **أدخل نص الإشعار**\n\n'
        + 'اكتب الرسالة التي تريد إرسالها:\n\n'
        + '• يمكنك استخدام Markdown للتنسيق\n'
        + '• للإلغاء: /cancel',
        { parse_mode: 'Markdown' },
      )

      // NOW wait for user's message
      ctx = await conversation.wait()

      // Read from notificationDraft Map (set by handler before conversation.enter)
      const draft = notificationDraft.get(userId)

      // Debug: After first wait
      ctx.logger?.info({
        userId,
        hasDraft: !!draft,
        draft,
      }, '🎬 Conversation - After first wait')

      // Check if data exists in draft
      if (!draft || !draft.type || !draft.priority) {
        await ctx.reply('❌ خطأ: بيانات الإشعار غير موجودة. الرجاء المحاولة مرة أخرى.')
        return
      }

      // Build notification data from draft
      const notifData: NotificationData = {
        type: draft.type,
        priority: draft.priority,
        targetAudience: 'specific_users',
        targetUserIds: draft.targetUserIds,
      }

      // Process the message we just received
      if (ctx.hasCommand('cancel')) {
        // Clear draft data
        notificationDraft.delete(userId)

        if (ctx.session && ctx.session.notificationData) {
          delete ctx.session.notificationData
        }
        const keyboard = new InlineKeyboard()
          .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

        await ctx.reply('❌ تم إلغاء إرسال الإشعار', {
          reply_markup: keyboard,
        })
        return
      }
      else if (!ctx.has('message:text')) {
        await ctx.reply('⚠️ الرجاء إرسال نص فقط')
        return
      }

      // Save the message to notificationDraft Map
      notifData.message = ctx.message.text
      draft.message = ctx.message.text
      notificationDraft.set(userId, draft)

      ctx.logger?.info({
        userId,
        message: draft.message,
        fullDraft: draft,
      }, '💾 Message saved to notificationDraft')

      // Show summary and confirm
      const keyboard = new InlineKeyboard()
        .text('✅ تأكيد وإرسال', 'notif:send:confirm')
        .text('❌ إلغاء', 'notif:send:cancel')

      // Build target description
      let targetDescription = getAudienceName(notifData.targetAudience)
      if (notifData.targetAudience === 'specific_users' && notifData.targetUserIds && notifData.targetUserIds.length > 0) {
        targetDescription = `مستخدم محدد (${notifData.targetUserIds.length} مستخدم)`
      }

      const summary
        = '📋 **ملخص الإشعار**\n\n'
          + `📝 **النص**: ${notifData.message}\n`
          + `🎯 **الفئة المستهدفة**: ${targetDescription}\n`
          + `🏷️ **النوع**: ${getTypeName(notifData.type)}\n`
          + `⚡ **الأولوية**: ${getPriorityName(notifData.priority)}\n\n`
          + 'هل تريد إرسال هذا الإشعار؟'

      await ctx.reply(summary, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })

      // Data is already saved in notificationDraft Map (line 100)
    },
    SEND_NOTIFICATION_CONVERSATION,
  )
}

/**
 * Confirm and send notification
 */
export async function confirmAndSendNotification(ctx: Context) {
  const userId = ctx.from?.id
  if (!userId) {
    await ctx.answerCallbackQuery('❌ خطأ: لم يتم التعرف على المستخدم')
    return
  }

  // Read from notificationDraft Map (shared with conversation)
  const draft = notificationDraft.get(userId)

  // Debug: Check draft
  ctx.logger?.info({
    userId,
    hasDraft: !!draft,
    draft,
  }, 'Confirmation handler - checking draft')

  if (!draft || !draft.message) {
    await ctx.answerCallbackQuery('⚠️ بيانات الإشعار غير موجودة')
    return
  }

  // Build notification data from draft
  // After the check above, we know message exists
  const message = draft.message as string

  // Determine target audience (use draft.target if available, otherwise specific_users)
  const targetAudience = draft.target || 'specific_users'

  // For specific_users, use the internal userIds
  // NotificationService will handle the conversion to telegramIds
  const notifData: NotificationData = {
    type: draft.type || 'info',
    priority: draft.priority || 'normal',
    targetAudience,
    targetUserIds: draft.targetUserIds, // Internal database user IDs
    message,
  }

  await ctx.answerCallbackQuery('⏳ جاري الإرسال...')

  try {
    // Send notification using NotificationService
    let result

    try {
      // Use the appropriate send method based on target audience
      switch (notifData.targetAudience) {
        case 'all_users':
          result = await notificationService.sendToAllUsers({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'all_admins':
          result = await notificationService.sendToAdmins({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'super_admin':
          result = await notificationService.sendToSuperAdmin({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'role':
          if (notifData.targetRole) {
            result = await notificationService.sendToRole(notifData.targetRole as any, {
              message,
              type: notifData.type as any,
              priority: notifData.priority as any,
            })
          }
          else {
            throw new Error('Target role not specified')
          }
          break

        case 'active_users':
          result = await notificationService.sendToActiveUsers({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'inactive_users':
          result = await notificationService.sendToInactiveUsers({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'new_users':
          result = await notificationService.sendToNewUsers({
            message,
            type: notifData.type as any,
            priority: notifData.priority as any,
          })
          break

        case 'specific_users':
          if (notifData.targetUserIds && notifData.targetUserIds.length > 0) {
            result = await notificationService.sendToUsers(notifData.targetUserIds, {
              message,
              type: notifData.type as any,
              priority: notifData.priority as any,
            })
          }
          else {
            throw new Error('No target users specified')
          }
          break

        default:
          throw new Error('Invalid target audience')
      }
    }
    catch (sendError) {
      throw sendError
    }

    const successCount = result.sentCount
    const failureCount = result.failedCount

    const keyboard = new InlineKeyboard()
      .text('📊 عرض الإحصائيات', 'settings:notifications:stats')
      .row()
      .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

    await ctx.editMessageText(
      '✅ **تم إرسال الإشعار بنجاح**\n\n'
      + `📤 **المرسل إليهم**: ${successCount + failureCount}\n`
      + `✅ **نجح**: ${successCount}\n`
      + `❌ **فشل**: ${failureCount}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    // Clear draft data
    notificationDraft.delete(userId)

    // Clear session data (if any)
    if (ctx.session && ctx.session.notificationData) {
      delete ctx.session.notificationData
    }
  }
  catch (error) {
    ctx.logger?.error({ error }, 'Failed to send notification')

    await ctx.editMessageText(
      '❌ **فشل إرسال الإشعار**\n\n'
      + 'حدث خطأ أثناء محاولة إرسال الإشعار.',
      { parse_mode: 'Markdown' },
    )

    if (ctx.session) {
      delete ctx.session.notificationData
    }
  }
}

/**
 * Helper functions
 */
function getAudienceName(audience: string): string {
  const names: Record<string, string> = {
    all_users: 'جميع المستخدمين',
    all_admins: 'جميع المديرين',
    super_admin: 'السوبر أدمن',
    role: 'دور محدد',
    specific_users: 'مستخدمون محددون',
    active_users: 'مستخدمون نشطون',
    inactive_users: 'مستخدمون غير نشطين',
    new_users: 'مستخدمون جدد',
  }
  return names[audience] || audience
}

function getTypeName(type: string): string {
  const names: Record<string, string> = {
    info: 'معلومة',
    success: 'نجاح',
    warning: 'تحذير',
    error: 'خطأ',
    announcement: 'إعلان',
    reminder: 'تذكير',
    alert: 'تنبيه',
  }
  return names[type] || type
}

function getPriorityName(priority: string): string {
  const names: Record<string, string> = {
    normal: 'عادي',
    important: 'مهم',
    urgent: 'عاجل',
    critical: 'حرج',
  }
  return names[priority] || priority
}
