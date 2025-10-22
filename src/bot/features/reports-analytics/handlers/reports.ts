/**
 * Reports and Analytics Handlers
 * معالجات التقارير والإحصائيات
 */

import type { Context } from '#root/bot/context.js'
import { Buffer } from 'node:buffer'
import { logger } from '#root/modules/services/logger/index.js'
import { ReportsService } from '#root/modules/services/reports/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const reportsHandler = new Composer<Context>()

/**
 * Helper function to get role display name
 */
function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    SUPER_ADMIN: 'مدير عام',
    ADMIN: 'مدير',
    USER: 'مستخدم',
    GUEST: 'ضيف',
  }
  return roleNames[role] || role
}

/**
 * Analytics Overview Handler
 */
reportsHandler.callbackQuery('reports:analytics', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحضير التقرير...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })
    // Generate analytics report for the last 30 days
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    const analyticsData = await ReportsService.generateAnalyticsReport({
      start: startDate,
      end: endDate,
    })

    const formattedReport = ReportsService.formatReportData(analyticsData)

    const keyboard = new InlineKeyboard()
      .text('📤 تصدير CSV', 'reports:export:csv')
      .text('📥 تصدير Excel', 'reports:export:xlsx')
      .text('🔄 تحديث', 'reports:analytics')
      .row()
      .text('👥 تقارير المستخدمين', 'reports:users')
      .text('⚙️ أداء النظام', 'reports:system')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply(formattedReport, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating analytics report')
    await ctx.reply('❌ **حدث خطأ أثناء إنشاء التقرير**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})/**
   * User Reports Handler
   */
reportsHandler.callbackQuery('reports:users', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحضير تقرير المستخدمين...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Get user statistics
    const { Database } = await import('#root/modules/database/index.js')
    const prisma = Database.prisma

    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    })
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    })

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    })

    let report = '👥 **تقرير المستخدمين**\n\n'
    report += `📊 **الإحصائيات العامة:**\n`
    report += `• إجمالي المستخدمين: ${totalUsers}\n`
    report += `• المستخدمين النشطين (آخر 7 أيام): ${activeUsers}\n`
    report += `• المستخدمين الجدد (آخر 30 يوم): ${newUsers}\n\n`

    report += `👤 **التوزيع حسب الأدوار:**\n`
    usersByRole.forEach((role: any) => {
      const roleName = getRoleDisplayName(role.role)
      report += `• ${roleName}: ${role._count.role}\n`
    })

    const keyboard = new InlineKeyboard()
      .text('📤 تصدير CSV', 'reports:export:csv')
      .text('📥 تصدير Excel', 'reports:export:xlsx')
      .row()
      .text('📈 نظرة عامة', 'reports:analytics')
      .text('📝 سجل النشاط', 'reports:activity')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply(report, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating user report')
    await ctx.reply('❌ **حدث خطأ أثناء إنشاء تقرير المستخدمين**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})/**
   * System Performance Handler
   */
reportsHandler.callbackQuery('reports:system', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || ctx.dbUser.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحضير تقرير أداء النظام...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const systemReport = await ReportsService.generateSystemPerformanceReport()

    let report = '⚙️ **تقرير أداء النظام**\n\n'
    report += `🕐 **وقت التشغيل:** ${Math.floor(systemReport.system.uptime / 3600)} ساعة\n\n`

    report += `💾 **استخدام الذاكرة:**\n`
    report += `• الذاكرة المستخدمة: ${systemReport.system.memoryUsage.heapUsed} ميجابايت\n`
    report += `• إجمالي الذاكرة: ${systemReport.system.memoryUsage.heapTotal} ميجابايت\n`
    report += `• الذاكرة الخارجية: ${systemReport.system.memoryUsage.external} ميجابايت\n\n`

    report += `🖥️ **استخدام المعالج:**\n`
    report += `• المستخدم: ${systemReport.system.cpuUsage.user} ثانية\n`
    report += `• النظام: ${systemReport.system.cpuUsage.system} ثانية\n\n`

    report += `🗄️ **قاعدة البيانات:**\n`
    report += `• المستخدمين: ${systemReport.database.users}\n`
    report += `• الشركات: ${systemReport.database.companies}\n`
    report += `• الفروع: ${systemReport.database.branches}\n`
    report += `• المشاريع: ${systemReport.database.projects}\n`
    report += `• الإشعارات: ${systemReport.database.notifications}\n\n`

    report += `⏰ **آخر تحديث:** ${systemReport.timestamp.toLocaleString('ar-SA')}`

    const keyboard = new InlineKeyboard()
      .text('📤 تصدير CSV', 'reports:export:csv')
      .text('📥 تصدير Excel', 'reports:export:xlsx')
      .row()
      .text('🔄 تحديث', 'reports:system')
      .text('📈 نظرة عامة', 'reports:analytics')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply(report, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating system report')
    await ctx.reply('❌ **حدث خطأ أثناء إنشاء تقرير النظام**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})/**
   * Activity Logs Handler
   */
reportsHandler.callbackQuery('reports:activity', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.editMessageText('🔄 **جاري تحضير سجل النشاط...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Mock activity data for now
    const activities = [
      { time: '09:00', action: 'تسجيل دخول', user: 'أحمد محمد', details: 'دخول ناجح' },
      { time: '09:15', action: 'إنشاء إشعار', user: 'سارة أحمد', details: 'إشعار جديد للمستخدمين' },
      { time: '09:30', action: 'تحديث الملف الشخصي', user: 'محمد علي', details: 'تحديث البيانات الشخصية' },
      { time: '10:00', action: 'مسح باركود', user: 'فاطمة حسن', details: 'مسح QR Code بنجاح' },
      { time: '10:15', action: 'تغيير الدور', user: 'أحمد محمد', details: 'ترقية مستخدم إلى مدير' },
    ]

    let report = '📝 **سجل النشاط**\n\n'
    report += `🕐 **آخر الأنشطة:**\n\n`

    activities.forEach((activity, index) => {
      report += `${index + 1}. **${activity.time}** - ${activity.action}\n`
      report += `   👤 ${activity.user}\n`
      report += `   📋 ${activity.details}\n\n`
    })

    const keyboard = new InlineKeyboard()
      .text('🔄 تحديث', 'reports:activity')
      .text('📤 تصدير', 'reports:export:activity')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(report, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating activity report')
    await ctx.editMessageText('❌ **حدث خطأ أثناء إنشاء سجل النشاط**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})/**
   * Export Reports Handler
   */
reportsHandler.callbackQuery(/^reports:export:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const exportType = ctx.match![1]

    await ctx.reply('🔄 **جاري تصدير التقرير...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    let fileName: string
    let fileContent: Buffer

    if (exportType === 'csv') {
      // Generate analytics report and export as CSV
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

      const analyticsData = await ReportsService.generateAnalyticsReport({
        start: startDate,
        end: endDate,
      })

      fileContent = ReportsService.exportReportAsCSV(analyticsData)
      fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
    }
    else if (exportType === 'xlsx') {
      const endDate = new Date()
      const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      const analyticsData = await ReportsService.generateAnalyticsReport({ start: startDate, end: endDate })
      fileContent = await ReportsService.exportReportAsXLSX(analyticsData)
      fileName = `analytics-report-${new Date().toISOString().split('T')[0]}.xlsx`
    }
    else if (exportType === 'activity') {
      // Export activity log as text
      const activityData = 'Activity Log Export\n\nThis is a mock activity log export.\nIn a real implementation, this would contain actual activity data.'
      fileContent = Buffer.from(activityData, 'utf-8')
      fileName = `activity-log-${new Date().toISOString().split('T')[0]}.txt`
    }
    else {
      throw new Error('Invalid export type')
    }

    // Send file
    const { InputFile } = await import('grammy')
    const file = new InputFile(fileContent, fileName)

    await ctx.replyWithDocument(file, {
      caption: `📤 **تم تصدير التقرير بنجاح!**\n\n📁 **اسم الملف:** ${fileName}\n📅 **تاريخ التصدير:** ${new Date().toLocaleString('ar-SA')}`,
      parse_mode: 'Markdown',
    })

    const keyboard = new InlineKeyboard()
      .text('📈 نظرة عامة', 'reports:analytics')
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply('🎉 تم تصدير التقرير بنجاح!', {
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error exporting report')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تصدير التقرير**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})
