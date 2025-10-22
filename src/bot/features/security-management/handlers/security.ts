/**
 * Security Management Handlers
 * معالجات إدارة الأمان
 */

import type { Context } from '#root/bot/context.js'
import { logger } from '#root/modules/services/logger/index.js'
import { SecurityService } from '#root/modules/services/security/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const securityHandler = new Composer<Context>()

/**
 * Security Dashboard Handler
 */
securityHandler.callbackQuery('security:dashboard', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || (ctx.dbUser.role !== 'SUPER_ADMIN' && ctx.dbUser.role !== 'ADMIN')) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحضير لوحة الأمان...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const stats = await SecurityService.getSecurityStatistics()

    let message = '🛡️ **لوحة الأمان**\n\n'
    message += `📊 **إحصائيات الأمان:**\n`
    message += `• إجمالي الأحداث: ${stats.totalEvents.toLocaleString()}\n`
    message += `• التهديدات الأخيرة: ${stats.recentThreats}\n`
    message += `• الجلسات النشطة: ${stats.activeSessions}\n\n`

    message += `📈 **الأحداث حسب النوع:**\n`
    Object.entries(stats.eventsByType).forEach(([type, count]) => {
      const icon = getEventTypeIcon(type)
      message += `${icon} ${type}: ${count}\n`
    })

    message += `\n🚨 **الأحداث حسب الخطورة:**\n`
    Object.entries(stats.eventsBySeverity).forEach(([severity, count]) => {
      const icon = getSeverityIcon(severity)
      message += `${icon} ${severity}: ${count}\n`
    })

    const keyboard = new InlineKeyboard()
      .text('📝 سجل الأحداث', 'security:events')
      .text('🚨 كشف التهديدات', 'security:threats')
      .row()
      .text('🔐 المصادقة الثنائية', 'security:2fa')
      .text('⚙️ الإعدادات', 'security:settings')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading security dashboard')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل لوحة الأمان**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Security Events Handler
 */
securityHandler.callbackQuery('security:events', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || (ctx.dbUser.role !== 'SUPER_ADMIN' && ctx.dbUser.role !== 'ADMIN')) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحميل سجل الأحداث...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const events = await SecurityService.getRecentSecurityEvents(10)

    if (events.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('📊 لوحة الأمان', 'security:dashboard')
        .row()
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText(
        '📝 **سجل الأحداث الأمنية**\n\n📭 لا توجد أحداث مسجلة\n\n💡 سيتم عرض الأحداث الأمنية هنا',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    let message = '📝 **سجل الأحداث الأمنية**\n\n'

    events.forEach((event, index) => {
      const icon = getEventTypeIcon(event.type)
      const severityIcon = getSeverityIcon(event.severity)
      const time = event.timestamp.toLocaleString('ar-SA')

      message += `${index + 1}. ${icon} **${event.type}**\n`
      message += `   ${severityIcon} ${event.severity} • 👤 ${event.userId}\n`
      message += `   📅 ${time}\n\n`
    })

    const keyboard = new InlineKeyboard()
      .text('🔄 تحديث', 'security:events')
      .text('📊 لوحة الأمان', 'security:dashboard')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading security events')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل سجل الأحداث**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Two-Factor Authentication Handler
 */
securityHandler.callbackQuery('security:2fa', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(
      '🔐 **المصادقة الثنائية**\n\n'
      + '🛡️ **ما هي المصادقة الثنائية؟**\n'
      + 'المصادقة الثنائية تضيف طبقة حماية إضافية لحسابك\n\n'
      + '📱 **كيف تعمل:**\n'
      + '1. أدخل كلمة المرور العادية\n'
      + '2. أدخل الرمز من التطبيق\n'
      + '3. احصل على الوصول الآمن\n\n'
      + '🔧 **الإعدادات:**\n'
      + '• تفعيل/إلغاء المصادقة الثنائية\n'
      + '• إدارة الرموز الاحتياطية\n'
      + '• عرض QR Code للإعداد\n\n'
      + '💡 **نصائح الأمان:**\n'
      + '• احتفظ بالرموز الاحتياطية في مكان آمن\n'
      + '• لا تشارك رموز المصادقة مع أحد\n'
      + '• استخدم تطبيق موثوق للمصادقة',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading 2FA info')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل معلومات المصادقة الثنائية**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Password Policy Handler
 */
securityHandler.callbackQuery('security:password-policy', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || ctx.dbUser.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(
      '🔑 **سياسة كلمات المرور**\n\n'
      + '📋 **المتطلبات الحالية:**\n'
      + '• الحد الأدنى: 8 أحرف\n'
      + '• يجب أن تحتوي على حرف كبير\n'
      + '• يجب أن تحتوي على حرف صغير\n'
      + '• يجب أن تحتوي على رقم\n'
      + '• يجب أن تحتوي على رمز خاص\n\n'
      + '⚙️ **الإعدادات:**\n'
      + '• الحد الأدنى للأحرف: 8\n'
      + '• تعقيد كلمة المرور: مفعل\n'
      + '• انتهاء الصلاحية: 90 يوم\n'
      + '• منع إعادة الاستخدام: آخر 5 كلمات\n\n'
      + '🛡️ **الحماية:**\n'
      + '• تشفير كلمات المرور\n'
      + '• منع كلمات المرور الشائعة\n'
      + '• مراقبة محاولات الاختراق\n\n'
      + '💡 **نصائح:**\n'
      + '• استخدم كلمات مرور فريدة\n'
      + '• لا تشارك كلمات المرور\n'
      + '• غيّر كلمة المرور بانتظام',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading password policy')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل سياسة كلمات المرور**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Security Settings Handler
 */
securityHandler.callbackQuery('security:settings', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || ctx.dbUser.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(
      '⚙️ **إعدادات الأمان**\n\n'
      + '🔒 **إعدادات تسجيل الدخول:**\n'
      + '• الحد الأقصى للمحاولات: 5\n'
      + '• مدة القفل: 15 دقيقة\n'
      + '• انتهاء الجلسة: 24 ساعة\n'
      + '• المصادقة الثنائية: اختيارية\n\n'
      + '🛡️ **إعدادات الحماية:**\n'
      + '• مراقبة النشاط المشبوه: مفعل\n'
      + '• تسجيل جميع الأحداث: مفعل\n'
      + '• تنبيهات الأمان: مفعل\n'
      + '• النسخ الاحتياطي التلقائي: مفعل\n\n'
      + '📊 **إعدادات المراقبة:**\n'
      + '• الاحتفاظ بالسجلات: 90 يوم\n'
      + '• مستوى التسجيل: مفصل\n'
      + '• مراقبة الوصول: مفعل\n'
      + '• تحليل الأنماط: مفعل\n\n'
      + '🚨 **إعدادات التنبيهات:**\n'
      + '• تنبيهات فورية: مفعل\n'
      + '• تنبيهات يومية: مفعل\n'
      + '• تنبيهات أسبوعية: مفعل\n'
      + '• تنبيهات الطوارئ: مفعل',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading security settings')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل إعدادات الأمان**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Threat Detection Handler
 */
securityHandler.callbackQuery('security:threats', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || ctx.dbUser.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري فحص التهديدات...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Mock threat detection results
    const threats = [
      {
        id: 'threat_1',
        type: 'Multiple Failed Logins',
        severity: 'HIGH',
        user: 'User ID: 123',
        timestamp: new Date(),
        status: 'ACTIVE',
      },
      {
        id: 'threat_2',
        type: 'Unusual Access Pattern',
        severity: 'MEDIUM',
        user: 'User ID: 456',
        timestamp: new Date(),
        status: 'INVESTIGATING',
      },
      {
        id: 'threat_3',
        type: 'Suspicious File Upload',
        severity: 'LOW',
        user: 'User ID: 789',
        timestamp: new Date(),
        status: 'RESOLVED',
      },
    ]

    let message = '🚨 **كشف التهديدات**\n\n'

    threats.forEach((threat, index) => {
      const severityIcon = getSeverityIcon(threat.severity)
      const statusIcon = getStatusIcon(threat.status)
      const time = threat.timestamp.toLocaleString('ar-SA')

      message += `${index + 1}. ${severityIcon} **${threat.type}**\n`
      message += `   👤 ${threat.user}\n`
      message += `   ${statusIcon} ${threat.status} • 📅 ${time}\n\n`
    })

    const keyboard = new InlineKeyboard()
      .text('🔄 فحص جديد', 'security:threats')
      .text('📊 لوحة الأمان', 'security:dashboard')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error detecting threats')
    await ctx.editMessageText('❌ **حدث خطأ أثناء فحص التهديدات**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Helper function to get event type icon
 */
function getEventTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    LOGIN: '🔓',
    FAILED_LOGIN: '🔒',
    ROLE_CHANGE: '👤',
    SUSPICIOUS_ACTIVITY: '⚠️',
    FILE_UPLOAD: '📁',
    DATA_ACCESS: '📊',
  }
  return icons[type] || '📝'
}

/**
 * Helper function to get severity icon
 */
function getSeverityIcon(severity: string): string {
  const icons: Record<string, string> = {
    LOW: '🟢',
    MEDIUM: '🟡',
    HIGH: '🟠',
    CRITICAL: '🔴',
  }
  return icons[severity] || '⚪'
}

/**
 * Helper function to get status icon
 */
function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    ACTIVE: '🔴',
    INVESTIGATING: '🟡',
    RESOLVED: '🟢',
    IGNORED: '⚪',
  }
  return icons[status] || '⚪'
}
