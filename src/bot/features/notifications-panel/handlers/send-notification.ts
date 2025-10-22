import type { Context } from '#root/bot/context.js'
import type { NotificationPriority, NotificationType, TargetAudience } from '#root/modules/notifications/types.js'
import { Database } from '#root/modules/database/index.js'
import { NotificationService } from '#root/modules/notifications/notification-service.js'
import { getUserDisplayName } from '#root/modules/services/user-display/index.js'
import { Composer, InlineKeyboard } from 'grammy'
import { confirmAndSendNotification, notificationDraft, SEND_NOTIFICATION_CONVERSATION } from '../conversations/send-notification-conversation.js'

export const sendNotificationHandler = new Composer<Context>()
const notificationService = new NotificationService()

// notificationDraft Map is now imported from conversation file to share state

/**
 * Main send notification menu
 */
sendNotificationHandler.callbackQuery('settings:notifications:send', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📤 إشعار فردي', 'notif:send:individual')
    .row()
    .text('👥 إشعار جماعي', 'notif:send:group')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '📤 **إرسال إشعار**\n\n'
    + 'اختر نوع الإشعار الذي تريد إرساله:\n\n'
    + '📤 **إشعار فردي**: إرسال لمستخدم محدد\n'
    + '👥 **إشعار جماعي**: إرسال لمجموعة من المستخدمين',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Individual notification - Select user
 */
sendNotificationHandler.callbackQuery('notif:send:individual', async (ctx) => {
  await ctx.answerCallbackQuery()

  // Get all users from database
  const users = await Database.prisma.user.findMany({
    where: { isActive: true, isBanned: false },
    select: {
      id: true,
      telegramId: true,
      fullName: true,
      nickname: true,
      firstName: true,
      lastName: true,
      phone: true,
    },
    take: 20, // Limit to 20 users for inline keyboard
  })

  if (users.length === 0) {
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'settings:notifications:send')

    await ctx.editMessageText(
      '❌ **لا يوجد مستخدمون**\n\n'
      + 'لا يوجد مستخدمون نشطون في قاعدة البيانات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
    return
  }

  const keyboard = new InlineKeyboard()

  // Add user buttons (max 2 per row)
  for (let i = 0; i < Math.min(users.length, 10); i++) {
    const user = users[i]
    const displayName = getUserDisplayName(user)
    keyboard.text(
      `👤 ${displayName}`,
      `notif:individual:user:${user.id}`,
    )
    if (i % 2 === 1 || i === users.length - 1) {
      keyboard.row()
    }
  }

  keyboard.text('🔙 رجوع', 'settings:notifications:send')

  await ctx.editMessageText(
    '📤 **إرسال إشعار فردي**\n\n'
    + 'اختر المستخدم الذي تريد إرسال الإشعار إليه:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Individual notification - Select user handler
 */
sendNotificationHandler.callbackQuery(/^notif:individual:user:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const userId = Number.parseInt(ctx.match[1])
  const currentUserId = ctx.from?.id
  if (!currentUserId)
    return

  // Store selected user in draft
  const draft = notificationDraft.get(currentUserId) || {}
  draft.targetUserIds = [userId]
  notificationDraft.set(currentUserId, draft)

  // Show type selection
  const keyboard = new InlineKeyboard()
    .text('ℹ️ معلومة', 'notif:individual:type:info')
    .text('✅ نجاح', 'notif:individual:type:success')
    .row()
    .text('⚠️ تحذير', 'notif:individual:type:warning')
    .text('❌ خطأ', 'notif:individual:type:error')
    .row()
    .text('📢 إعلان', 'notif:individual:type:announcement')
    .text('🔔 تذكير', 'notif:individual:type:reminder')
    .row()
    .text('🚨 تنبيه', 'notif:individual:type:alert')
    .row()
    .text('🔙 رجوع', 'notif:send:individual')

  await ctx.editMessageText(
    '🏷️ **اختر نوع الإشعار**\n\n'
    + 'اختر نوع الإشعار الذي تريد إرساله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Individual notification - Select type handler
 */
sendNotificationHandler.callbackQuery(/^notif:individual:type:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const type = ctx.match[1] as NotificationType
  const userId = ctx.from?.id
  if (!userId)
    return

  // Store type in draft
  const draft = notificationDraft.get(userId) || {}
  draft.type = type
  notificationDraft.set(userId, draft)

  // Show priority selection
  const keyboard = new InlineKeyboard()
    .text('🔵 عادي', 'notif:individual:priority:normal')
    .text('🟡 مهم', 'notif:individual:priority:important')
    .row()
    .text('🟠 عاجل', 'notif:individual:priority:urgent')
    .text('🔴 حرج', 'notif:individual:priority:critical')
    .row()
    .text('🔙 رجوع', 'notif:send:individual')

  await ctx.editMessageText(
    '⚡ **اختر الأولوية**\n\n'
    + 'اختر أولوية الإشعار:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Individual notification - Select priority and start conversation
 */
sendNotificationHandler.callbackQuery(/^notif:individual:priority:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const priority = ctx.match[1] as NotificationPriority
  const userId = ctx.from?.id
  if (!userId)
    return

  // Store priority in draft and move to session
  const draft = notificationDraft.get(userId) || {}
  draft.priority = priority

  // Get target user details
  const targetUserId = draft.targetUserIds?.[0]
  if (!targetUserId) {
    await ctx.answerCallbackQuery('❌ خطأ في البيانات')
    return
  }

  // Prepare notification data
  const notificationData = {
    type: draft.type || 'info',
    priority: draft.priority || 'normal',
    targetAudience: 'specific_users' as const,
    targetUserIds: draft.targetUserIds,
  }

  ctx.logger?.info({
    storedData: notificationData,
  }, '🚀 About to start conversation')

  // Store in session before entering conversation
  ctx.session.notificationData = notificationData

  // Start conversation (will read from session.notificationData)
  await ctx.conversation.enter(SEND_NOTIFICATION_CONVERSATION)

  ctx.logger?.info('✅ Conversation enter called')
})

/**
 * Group notification - Select target audience
 */
sendNotificationHandler.callbackQuery('notif:send:group', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('👥 كل المستخدمين', 'notif:target:all_users')
    .text('👨‍💼 كل الإداريين', 'notif:target:all_admins')
    .row()
    .text('⭐ السوبر أدمن', 'notif:target:super_admin')
    .text('✅ المستخدمون النشطون', 'notif:target:active_users')
    .row()
    .text('💤 المستخدمون غير النشطين', 'notif:target:inactive_users')
    .text('🆕 المستخدمون الجدد', 'notif:target:new_users')
    .row()
    .text('🔙 رجوع', 'settings:notifications:send')

  await ctx.editMessageText(
    '👥 **إرسال إشعار جماعي**\n\n'
    + 'اختر الفئة المستهدفة:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Set target audience
 */
sendNotificationHandler.callbackQuery(/^notif:target:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const target = ctx.match[1] as TargetAudience
  const userId = ctx.from?.id
  if (!userId)
    return

  // Initialize or update draft
  const draft = notificationDraft.get(userId) || {}
  draft.target = target
  notificationDraft.set(userId, draft)

  const targetLabels: Record<TargetAudience, string> = {
    all_users: '👥 كل المستخدمين',
    all_admins: '👨‍💼 كل الإداريين',
    super_admin: '⭐ السوبر أدمن',
    role: '🎭 دور محدد',
    specific_users: '📌 مستخدمون محددون',
    active_users: '✅ المستخدمون النشطون',
    inactive_users: '💤 المستخدمون غير النشطين',
    new_users: '🆕 المستخدمون الجدد',
  }

  const keyboard = new InlineKeyboard()
    .text('📝 نوع الإشعار', 'notif:select:type')
    .row()
    .text('🔙 رجوع', 'notif:send:group')

  await ctx.editMessageText(
    '✅ **تم تحديد الفئة المستهدفة**\n\n'
    + `الفئة: ${targetLabels[target]}\n\n`
    + 'الخطوة التالية: اختر نوع الإشعار',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Select notification type
 */
sendNotificationHandler.callbackQuery('notif:select:type', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('ℹ️ معلومات', 'notif:type:info')
    .text('✅ نجاح', 'notif:type:success')
    .row()
    .text('⚠️ تحذير', 'notif:type:warning')
    .text('❌ خطأ', 'notif:type:error')
    .row()
    .text('📢 إعلان', 'notif:type:announcement')
    .text('🔔 تذكير', 'notif:type:reminder')
    .row()
    .text('🚨 تنبيه', 'notif:type:alert')
    .row()
    .text('🔙 رجوع', 'notif:send:group')

  await ctx.editMessageText(
    '📝 **اختر نوع الإشعار**\n\n'
    + 'ℹ️ **معلومات** - معلومات عامة\n'
    + '✅ **نجاح** - عمليات ناجحة\n'
    + '⚠️ **تحذير** - تحذيرات\n'
    + '❌ **خطأ** - أخطاء\n'
    + '📢 **إعلان** - إعلانات عامة\n'
    + '🔔 **تذكير** - تذكيرات\n'
    + '🚨 **تنبيه** - تنبيهات عاجلة',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Set notification type
 */
sendNotificationHandler.callbackQuery(/^notif:type:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const type = ctx.match[1] as NotificationType
  const userId = ctx.from?.id
  if (!userId)
    return

  const draft = notificationDraft.get(userId) || {}
  draft.type = type
  notificationDraft.set(userId, draft)

  const typeLabels: Record<NotificationType, string> = {
    info: 'ℹ️ معلومات',
    success: '✅ نجاح',
    warning: '⚠️ تحذير',
    error: '❌ خطأ',
    announcement: '📢 إعلان',
    reminder: '🔔 تذكير',
    alert: '🚨 تنبيه',
  }

  const keyboard = new InlineKeyboard()
    .text('⚡ اختر الأولوية', 'notif:select:priority')
    .row()
    .text('🔙 رجوع', 'notif:select:type')

  await ctx.editMessageText(
    '✅ **تم تحديد نوع الإشعار**\n\n'
    + `النوع: ${typeLabels[type]}\n\n`
    + 'الخطوة التالية: اختر الأولوية',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Select notification priority
 */
sendNotificationHandler.callbackQuery('notif:select:priority', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('🔵 عادي', 'notif:priority:normal')
    .text('🟡 مهم', 'notif:priority:important')
    .row()
    .text('🟠 عاجل', 'notif:priority:urgent')
    .text('🔴 حرج', 'notif:priority:critical')
    .row()
    .text('🔙 رجوع', 'notif:select:type')

  await ctx.editMessageText(
    '⚡ **اختر أولوية الإشعار**\n\n'
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

/**
 * Set notification priority and show summary
 */
sendNotificationHandler.callbackQuery(/^notif:priority:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const priority = ctx.match[1] as NotificationPriority
  const userId = ctx.from?.id
  if (!userId)
    return

  const draft = notificationDraft.get(userId) || {}
  draft.priority = priority
  notificationDraft.set(userId, draft)

  const targetLabels: Record<TargetAudience, string> = {
    all_users: '👥 كل المستخدمين',
    all_admins: '👨‍💼 كل الإداريين',
    super_admin: '⭐ السوبر أدمن',
    role: '🎭 دور محدد',
    specific_users: '📌 مستخدمون محددون',
    active_users: '✅ المستخدمون النشطون',
    inactive_users: '💤 المستخدمون غير النشطين',
    new_users: '🆕 المستخدمون الجدد',
  }

  const typeLabels: Record<NotificationType, string> = {
    info: 'ℹ️ معلومات',
    success: '✅ نجاح',
    warning: '⚠️ تحذير',
    error: '❌ خطأ',
    announcement: '📢 إعلان',
    reminder: '🔔 تذكير',
    alert: '🚨 تنبيه',
  }

  const priorityLabels: Record<NotificationPriority, string> = {
    normal: '🔵 عادي',
    important: '🟡 مهم',
    urgent: '🟠 عاجل',
    critical: '🔴 حرج',
  }

  const keyboard = new InlineKeyboard()
    .text('📝 إدخال الرسالة', 'notif:enter:message')
    .row()
    .text('🔙 رجوع', 'notif:select:priority')

  await ctx.editMessageText(
    '📋 **ملخص الإشعار**\n\n'
    + `**الفئة المستهدفة**: ${targetLabels[draft.target!]}\n`
    + `**النوع**: ${typeLabels[draft.type!]}\n`
    + `**الأولوية**: ${priorityLabels[priority]}\n\n`
    + 'الخطوة الأخيرة: أدخل نص الرسالة',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Prompt for message input - Start conversation
 */
sendNotificationHandler.callbackQuery('notif:enter:message', async (ctx) => {
  await ctx.answerCallbackQuery()

  const userId = ctx.from?.id
  if (!userId)
    return

  const draft = notificationDraft.get(userId)
  if (!draft || !draft.target || !draft.type || !draft.priority) {
    await ctx.editMessageText('❌ بيانات الإشعار غير مكتملة. الرجاء المحاولة مرة أخرى.')
    return
  }

  // Store in session
  ctx.session.notificationData = {
    type: draft.type,
    priority: draft.priority,
    targetAudience: draft.target as string,
    targetRole: undefined,
  }

  // Start conversation
  await ctx.conversation.enter(SEND_NOTIFICATION_CONVERSATION)
})

/**
 * Confirm and send notification
 */
sendNotificationHandler.callbackQuery('notif:send:confirm', async (ctx) => {
  await confirmAndSendNotification(ctx)
})

/**
 * Cancel sending notification
 */
sendNotificationHandler.callbackQuery('notif:send:cancel', async (ctx) => {
  await ctx.answerCallbackQuery()
  if (ctx.session) {
    delete ctx.session.notificationData
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '❌ تم إلغاء إرسال الإشعار',
    { reply_markup: keyboard },
  )
})
