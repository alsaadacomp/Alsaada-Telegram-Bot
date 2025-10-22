/**
 * Reports and Analytics Service
 * خدمة التقارير والإحصائيات
 */

import { Buffer } from 'node:buffer'
import process from 'node:process'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'

export interface ReportData {
  id: string
  title: string
  description: string
  type: 'USER' | 'SYSTEM' | 'ACTIVITY' | 'PERFORMANCE' | 'SECURITY'
  data: Record<string, any>
  generatedAt: Date
  generatedBy: string
  period: {
    start: Date
    end: Date
  }
}

export interface AnalyticsData {
  users: {
    total: number
    active: number
    new: number
    byRole: Record<string, number>
  }
  activity: {
    totalMessages: number
    totalCommands: number
    totalCallbacks: number
    byHour: Record<string, number>
    byDay: Record<string, number>
  }
  system: {
    uptime: number
    memoryUsage: number
    cpuUsage: number
    errors: number
  }
  features: {
    mostUsed: Array<{ name: string, count: number }>
    leastUsed: Array<{ name: string, count: number }>
  }
}

export class ReportsService {
  /**
   * Generate comprehensive analytics report
   */
  static async generateAnalyticsReport(period: { start: Date, end: Date }): Promise<AnalyticsData> {
    try {
      logger.info({ period }, 'Generating analytics report')

      // Get user statistics
      const userStats = await this.getUserStatistics(period)

      // Get activity statistics
      const activityStats = await this.getActivityStatistics(period)

      // Get system statistics
      const systemStats = await this.getSystemStatistics()

      // Get feature usage statistics
      const featureStats = await this.getFeatureUsageStatistics(period)

      const report: AnalyticsData = {
        users: userStats,
        activity: activityStats,
        system: systemStats,
        features: featureStats,
      }

      logger.info({ reportId: 'analytics' }, 'Analytics report generated successfully')
      return report
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating analytics report')
      throw error
    }
  }

  /**
   * Get user statistics
   */
  private static async getUserStatistics(period: { start: Date, end: Date }) {
    const prisma = Database.prisma
    const totalUsers = await prisma.user.count()
    const activeUsers = await prisma.user.count({
      where: {
        lastActiveAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    })
    const newUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: period.start,
          lte: period.end,
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

    const byRole = usersByRole.reduce((acc: Record<string, number>, item: any) => {
      acc[item.role] = item._count.role
      return acc
    }, {})

    return {
      total: totalUsers,
      active: activeUsers,
      new: newUsers,
      byRole,
    }
  }

  /**
   * Get activity statistics
   */
  private static async getActivityStatistics(_period: { start: Date, end: Date }) {
    // This would typically come from a logging system
    // For now, we'll return mock data
    const totalMessages = Math.floor(Math.random() * 10000) + 5000
    const totalCommands = Math.floor(Math.random() * 1000) + 500
    const totalCallbacks = Math.floor(Math.random() * 2000) + 1000

    // Generate hourly distribution (mock data)
    const byHour: Record<string, number> = {}
    for (let i = 0; i < 24; i++) {
      byHour[i.toString()] = Math.floor(Math.random() * 100) + 10
    }

    // Generate daily distribution (mock data)
    const byDay: Record<string, number> = {}
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    days.forEach((day) => {
      byDay[day] = Math.floor(Math.random() * 500) + 100
    })

    return {
      totalMessages,
      totalCommands,
      totalCallbacks,
      byHour,
      byDay,
    }
  }

  /**
   * Get system statistics
   */
  private static async getSystemStatistics() {
    const uptime = process.uptime()
    const memoryUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()

    return {
      uptime: Math.floor(uptime),
      memoryUsage: Math.floor(memoryUsage.heapUsed / 1024 / 1024), // MB
      cpuUsage: Math.floor(cpuUsage.user / 1000000), // Convert to seconds
      errors: 0, // This would come from error tracking
    }
  }

  /**
   * Get feature usage statistics
   */
  private static async getFeatureUsageStatistics(_period: { start: Date, end: Date }) {
    // Mock feature usage data
    const features = [
      { name: 'الملف الشخصي', count: Math.floor(Math.random() * 500) + 200 },
      { name: 'الإشعارات', count: Math.floor(Math.random() * 300) + 150 },
      { name: 'الإعدادات', count: Math.floor(Math.random() * 200) + 100 },
      { name: 'ماسح الباركود', count: Math.floor(Math.random() * 100) + 50 },
      { name: 'لوحة الإدارة', count: Math.floor(Math.random() * 80) + 30 },
    ]

    const sortedFeatures = features.sort((a, b) => b.count - a.count)

    return {
      mostUsed: sortedFeatures.slice(0, 3),
      leastUsed: sortedFeatures.slice(-2),
    }
  }

  /**
   * Generate user activity report
   */
  static async generateUserActivityReport(userId: string, period: { start: Date, end: Date }) {
    try {
      const prisma = Database.prisma
      const user = await prisma.user.findUnique({
        where: { id: Number.parseInt(userId) },
        include: {
          roleChanges: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      })

      if (!user) {
        throw new Error('User not found')
      }

      return {
        user: {
          id: user.id,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
          lastActiveAt: user.lastActiveAt,
        },
        activity: {
          roleChanges: user.roleChanges.length,
          notificationsReceived: 0, // Mock data
          lastActivity: user.lastActiveAt,
        },
        period,
      }
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating user activity report')
      throw error
    }
  }

  /**
   * Generate system performance report
   */
  static async generateSystemPerformanceReport() {
    try {
      const memoryUsage = process.memoryUsage()
      const cpuUsage = process.cpuUsage()
      const uptime = process.uptime()

      // Get database statistics
      const dbStats = await this.getDatabaseStatistics()

      return {
        system: {
          uptime: Math.floor(uptime),
          memoryUsage: {
            rss: Math.floor(memoryUsage.rss / 1024 / 1024), // MB
            heapTotal: Math.floor(memoryUsage.heapTotal / 1024 / 1024), // MB
            heapUsed: Math.floor(memoryUsage.heapUsed / 1024 / 1024), // MB
            external: Math.floor(memoryUsage.external / 1024 / 1024), // MB
          },
          cpuUsage: {
            user: Math.floor(cpuUsage.user / 1000000), // seconds
            system: Math.floor(cpuUsage.system / 1000000), // seconds
          },
        },
        database: dbStats,
        timestamp: new Date(),
      }
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating system performance report')
      throw error
    }
  }

  /**
   * Get database statistics
   */
  private static async getDatabaseStatistics() {
    try {
      const prisma = Database.prisma
      const userCount = await prisma.user.count()
      const companyCount = await prisma.company.count()
      const branchCount = await prisma.branch.count()
      const projectCount = await prisma.project.count()
      const notificationCount = await prisma.notification.count()

      return {
        users: userCount,
        companies: companyCount,
        branches: branchCount,
        projects: projectCount,
        notifications: notificationCount,
      }
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error getting database statistics')
      return {
        users: 0,
        companies: 0,
        branches: 0,
        projects: 0,
        notifications: 0,
      }
    }
  }

  /**
   * Format report data for display
   */
  static formatReportData(data: AnalyticsData): string {
    let formatted = '📊 **تقرير الإحصائيات الشامل**\n\n'

    // User statistics
    formatted += '👥 **إحصائيات المستخدمين:**\n'
    formatted += `• إجمالي المستخدمين: ${data.users.total}\n`
    formatted += `• المستخدمين النشطين: ${data.users.active}\n`
    formatted += `• المستخدمين الجدد: ${data.users.new}\n\n`

    // Activity statistics
    formatted += '📈 **إحصائيات النشاط:**\n'
    formatted += `• إجمالي الرسائل: ${data.activity.totalMessages.toLocaleString()}\n`
    formatted += `• إجمالي الأوامر: ${data.activity.totalCommands.toLocaleString()}\n`
    formatted += `• إجمالي التفاعلات: ${data.activity.totalCallbacks.toLocaleString()}\n\n`

    // System statistics
    formatted += '⚙️ **إحصائيات النظام:**\n'
    formatted += `• وقت التشغيل: ${Math.floor(data.system.uptime / 3600)} ساعة\n`
    formatted += `• استخدام الذاكرة: ${data.system.memoryUsage} ميجابايت\n`
    formatted += `• الأخطاء: ${data.system.errors}\n\n`

    // Feature usage
    formatted += '🔧 **أكثر الميزات استخداماً:**\n'
    data.features.mostUsed.forEach((feature, index) => {
      formatted += `${index + 1}. ${feature.name}: ${feature.count} استخدام\n`
    })

    return formatted
  }

  /**
   * Export report as CSV
   */
  static exportReportAsCSV(data: AnalyticsData): Buffer {
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', data.users.total.toString()],
      ['Active Users', data.users.active.toString()],
      ['New Users', data.users.new.toString()],
      ['Total Messages', data.activity.totalMessages.toString()],
      ['Total Commands', data.activity.totalCommands.toString()],
      ['Total Callbacks', data.activity.totalCallbacks.toString()],
      ['System Uptime (hours)', Math.floor(data.system.uptime / 3600).toString()],
      ['Memory Usage (MB)', data.system.memoryUsage.toString()],
      ['Errors', data.system.errors.toString()],
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    return Buffer.from(csvContent, 'utf-8')
  }

  /**
   * Export report as XLSX (Excel)
   */
  static async exportReportAsXLSX(data: AnalyticsData): Promise<Buffer> {
    const { default: ExcelJS } = await import('exceljs')
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Analytics')

    sheet.columns = [
      { header: 'Metric', key: 'metric', width: 30 },
      { header: 'Value', key: 'value', width: 20 },
    ] as any

    const rows: Array<{ metric: string, value: string | number }> = [
      { metric: 'Total Users', value: data.users.total },
      { metric: 'Active Users', value: data.users.active },
      { metric: 'New Users', value: data.users.new },
      { metric: 'Total Messages', value: data.activity.totalMessages },
      { metric: 'Total Commands', value: data.activity.totalCommands },
      { metric: 'Total Callbacks', value: data.activity.totalCallbacks },
      { metric: 'System Uptime (hours)', value: Math.floor(data.system.uptime / 3600) },
      { metric: 'Memory Usage (MB)', value: data.system.memoryUsage },
      { metric: 'Errors', value: data.system.errors },
    ]

    rows.forEach(r => sheet.addRow(r))

    // Basic styling
    sheet.getRow(1).font = { bold: true }
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' } as any
    sheet.columns?.forEach((col: any) => { (col as any).alignment = { vertical: 'middle' } })

    const buffer: Buffer = await workbook.xlsx.writeBuffer() as any
    return Buffer.from(buffer)
  }
}
