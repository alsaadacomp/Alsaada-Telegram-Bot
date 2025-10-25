/**
 * Profile Management Handlers
 * معالجات إدارة الملف الشخصي
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const profileHandler = new Composer<Context>()

/**
 * Handle text input for profile editing - MUST be first to catch text messages
 */
profileHandler.on('message:text', async (ctx, next) => {
  logger.debug({
    profileEditField: ctx.session.profileEditField,
    text: ctx.message.text,
    hasDbUser: !!ctx.dbUser,
  }, 'Profile text handler called')

  // التحقق من وجود حقل التعديل في الجلسة
  if (!ctx.session.profileEditField || !ctx.dbUser) {
    logger.debug('No profile edit field or dbUser, calling next()')
    return next()
  }

  const field = ctx.session.profileEditField
  const newValue = ctx.message.text

  logger.debug({ field, newValue }, 'Processing profile edit')

  // التحقق من إلغاء العملية
  if (newValue === '/cancel') {
    ctx.session.profileEditField = undefined
    await ctx.reply('❌ تم إلغاء العملية')
    return
  }

  // التحقق من صحة البيانات
  if (field === 'email' && newValue && !isValidEmail(newValue)) {
    await ctx.reply('❌ البريد الإلكتروني غير صحيح')
    return
  }

  if (field === 'phone' && newValue && !isValidPhone(newValue)) {
    await ctx.reply('❌ رقم الهاتف غير صحيح')
    return
  }

  try {
    // تحديث البيانات في قاعدة البيانات
    await Database.prisma.user.update({
      where: { id: ctx.dbUser.userId },
      data: {
        [field]: newValue || null,
        updatedAt: new Date(),
      },
    })

    // مسح الحقل من الجلسة
    ctx.session.profileEditField = undefined

    const keyboard = new InlineKeyboard()
      .text('👁️ عرض الملف الشخصي', 'profile:view')
      .row()
      .text('✏️ تعديل حقل آخر', 'profile:edit')

    await ctx.reply(
      `✅ **تم تحديث ${getFieldDisplayName(field)} بنجاح!**\n\nالقيمة الجديدة: **${newValue}**`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error, field, newValue }, 'Failed to update profile field')
    await ctx.reply('❌ حدث خطأ أثناء حفظ البيانات')
  }
})

/**
 * View Profile - عرض الملف الشخصي
 */
profileHandler.callbackQuery('profile:view', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const user = await Database.prisma.user.findUnique({
      where: { id: ctx.dbUser.userId },
      select: {
        id: true,
        telegramId: true,
        username: true,
        fullName: true,
        nickname: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        isBanned: true,
        department: true,
        position: true,
        createdAt: true,
        lastActiveAt: true,
      },
    })

    if (!user) {
      await ctx.answerCallbackQuery('❌ المستخدم غير موجود')
      return
    }

    // بناء رسالة الملف الشخصي
    let message = '👤 **الملف الشخصي**\n\n'

    // المعلومات الأساسية
    message += '**المعلومات الأساسية:**\n'
    message += `🆔 **المعرف:** ${user.id}\n`
    message += `📱 **Telegram ID:** \`${user.telegramId}\`\n`

    if (user.username) {
      message += `👤 **اسم المستخدم:** @${user.username}\n`
    }

    if (user.fullName) {
      message += `📝 **الاسم الكامل:** ${user.fullName}\n`
    }

    if (user.nickname) {
      message += `🏷️ **اسم الشهرة:** ${user.nickname}\n`
    }

    if (user.phone) {
      message += `📞 **رقم الهاتف:** ${user.phone}\n`
    }

    if (user.email) {
      message += `📧 **البريد الإلكتروني:** ${user.email}\n`
    }

    // معلومات العمل
    message += '\n**معلومات العمل:**\n'
    message += `🎭 **الدور:** ${getRoleDisplayName(user.role)}\n`

    if (user.department) {
      message += `🏢 **القسم:** ${user.department}\n`
    }

    if (user.position) {
      message += `💼 **المنصب:** ${user.position}\n`
    }

    // حالة الحساب
    message += '\n**حالة الحساب:**\n'
    message += `✅ **الحالة:** ${user.isActive ? 'نشط' : 'غير نشط'}\n`
    message += `🚫 **الحظر:** ${user.isBanned ? 'محظور' : 'غير محظور'}\n`

    // التواريخ
    message += '\n**التواريخ:**\n'
    message += `📅 **تاريخ التسجيل:** ${new Date(user.createdAt).toLocaleDateString('ar-EG')}\n`

    if (user.lastActiveAt) {
      message += `🕐 **آخر نشاط:** ${new Date(user.lastActiveAt).toLocaleDateString('ar-EG')}\n`
    }

    const keyboard = new InlineKeyboard()
      .text('✏️ تعديل الملف الشخصي', 'profile:edit')
      .row()
      .text('🔐 تغيير كلمة المرور', 'profile:change-password')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error viewing profile')
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء عرض الملف الشخصي')
  }
})

/**
 * Edit Profile - تعديل الملف الشخصي
 */
profileHandler.callbackQuery('profile:edit', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📝 الاسم الكامل', 'profile:edit:fullName')
    .text('🏷️ اسم الشهرة', 'profile:edit:nickname')
    .row()
    .text('📞 رقم الهاتف', 'profile:edit:phone')
    .text('📧 البريد الإلكتروني', 'profile:edit:email')
    .row()
    .text('🏢 القسم', 'profile:edit:department')
    .text('💼 المنصب', 'profile:edit:position')
    .row()
    .text('🔙 رجوع', 'profile:view')

  await ctx.editMessageText(
    '✏️ **تعديل الملف الشخصي**\n\nاختر الحقل الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Edit specific field - تعديل حقل محدد
 */
profileHandler.callbackQuery(/^profile:edit:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const field = ctx.match![1]

  const fieldNames: Record<string, string> = {
    fullName: 'الاسم الكامل',
    nickname: 'اسم الشهرة',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    department: 'القسم',
    position: 'المنصب',
  }

  const fieldName = fieldNames[field]
  if (!fieldName) {
    await ctx.answerCallbackQuery('❌ حقل غير صحيح')
    return
  }

  // حفظ الحقل المراد تعديله في الجلسة
  ctx.session.profileEditField = field

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'profile:edit')

  await ctx.editMessageText(
    `✏️ **تعديل ${fieldName}**\n\nأرسل القيمة الجديدة:\n\n_(يمكنك إلغاء العملية بإرسال /cancel)_`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle cancel command
 */
profileHandler.command('cancel', async (ctx) => {
  if (ctx.session.profileEditField) {
    ctx.session.profileEditField = undefined
    await ctx.reply('❌ تم إلغاء العملية')
  }
})

/**
 * Change Password - تغيير كلمة المرور
 */
profileHandler.callbackQuery('profile:change-password', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'profile:view')

  await ctx.editMessageText(
    '🔐 **تغيير كلمة المرور**\n\n⚠️ **ملاحظة:** كلمة المرور مرتبطة بحساب Telegram الخاص بك ولا يمكن تغييرها من خلال البوت.\n\nلحماية حسابك:\n• استخدم كلمة مرور قوية لحساب Telegram\n• فعّل المصادقة الثنائية\n• لا تشارك بياناتك مع أحد',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

// Helper functions
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    SUPER_ADMIN: 'سوبر أدمن 👑',
    ADMIN: 'أدمن 🛡️',
    USER: 'مستخدم 👤',
    GUEST: 'زائر 👥',
    MODERATOR: 'مشرف 🔧',
  }
  return roleNames[role] || role
}

function getFieldDisplayName(field: string): string {
  const fieldNames: Record<string, string> = {
    fullName: 'الاسم الكامل',
    nickname: 'اسم الشهرة',
    phone: 'رقم الهاتف',
    email: 'البريد الإلكتروني',
    department: 'القسم',
    position: 'المنصب',
  }
  return fieldNames[field] || field
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/
  return phoneRegex.test(phone)
}
