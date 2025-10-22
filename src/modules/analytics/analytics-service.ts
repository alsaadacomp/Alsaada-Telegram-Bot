/**
 * Analytics & Reports - Main Service
 *
 * Central service for tracking metrics, generating reports, and analytics.
 */

import type {
  AnalyticsSummary,
  MetricDataPoint,
  MetricDefinition,
  MetricQuery,
  MetricResult,
  NotificationAnalytics,
  ReportConfig,
  ReportData,
  ReportFormat,
  TimePeriod,
  TimeRange,
  UserAnalytics,
} from './types.js'
import { Metric } from './core/metric.js'
import { Report } from './core/report.js'

export class AnalyticsService {
  private metrics: Map<string, Metric> = new Map()
  private reports: Map<string, Report> = new Map()
  private events: Array<{ type: string, timestamp: Date, data: any }> = []

  /**
   * Register metric
   */
  registerMetric(definition: MetricDefinition): void {
    const metric = new Metric(definition)
    this.metrics.set(definition.id, metric)
  }

  /**
   * Track metric value
   */
  track(metricId: string, value: number, metadata?: Record<string, any>): void {
    const metric = this.metrics.get(metricId)
    if (!metric) {
      throw new Error(`Metric not found: ${metricId}`)
    }
    metric.addDataPoint(value, metadata)
  }

  /**
   * Track event
   */
  trackEvent(type: string, data?: any): void {
    this.events.push({
      type,
      timestamp: new Date(),
      data: data || {},
    })
  }

  /**
   * Increment counter metric
   */
  increment(metricId: string, amount: number = 1): void {
    const metric = this.metrics.get(metricId)
    if (!metric) {
      throw new Error(`Metric not found: ${metricId}`)
    }
    const currentValue = metric.getLatestValue() || 0
    metric.addDataPoint(currentValue + amount)
  }

  /**
   * Set gauge metric
   */
  gauge(metricId: string, value: number): void {
    this.track(metricId, value)
  }

  /**
   * Query metric
   */
  query(query: MetricQuery): MetricResult {
    const metric = this.metrics.get(query.metricId)
    if (!metric) {
      throw new Error(`Metric not found: ${query.metricId}`)
    }

    const dataPoints = metric.getDataPointsInRange(
      query.timeRange.start,
      query.timeRange.end,
    )

    const summary = metric.calculateSummary(dataPoints)

    // Add trend and change percent
    summary.trend = metric.calculateTrend()

    return {
      metricId: query.metricId,
      timeRange: query.timeRange,
      dataPoints,
      summary,
    }
  }

  /**
   * Get metric
   */
  getMetric(metricId: string): Metric | undefined {
    return this.metrics.get(metricId)
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Metric[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Create report
   */
  createReport(config: ReportConfig): Report {
    const report = new Report(config)
    this.reports.set(config.id, report)
    return report
  }

  /**
   * Generate report
   */
  async generateReport(config: ReportConfig): Promise<ReportData> {
    const report = this.createReport(config)

    try {
      report.setStatus('generating')

      // Query all metrics
      for (const metricId of config.metrics) {
        const result = this.query({
          metricId,
          timeRange: config.timeRange,
          aggregation: 'avg',
        })
        report.addMetricResult(result)
      }

      report.setStatus('completed')
    }
    catch (error) {
      report.setError((error as Error).message)
    }

    return report.getData()
  }

  /**
   * Get report
   */
  getReport(reportId: string): Report | undefined {
    return this.reports.get(reportId)
  }

  /**
   * Export report
   */
  exportReport(reportId: string, format: ReportFormat): string {
    const report = this.reports.get(reportId)
    if (!report) {
      throw new Error(`Report not found: ${reportId}`)
    }
    return report.export(format)
  }

  /**
   * Get user analytics
   */
  getUserAnalytics(userId: number, timeRange: TimeRange): UserAnalytics {
    // Filter events for this user
    const userEvents = this.events.filter(
      e => e.data.userId === userId
        && e.timestamp >= timeRange.start
        && e.timestamp <= timeRange.end,
    )

    // Calculate activity days
    const uniqueDays = new Set(
      userEvents.map(e => e.timestamp.toDateString()),
    )

    // Calculate engagement score (simple formula)
    const engagementScore = Math.min(100, (userEvents.length / 10) * 100)

    return {
      userId,
      totalSessions: this.countUserSessions(userId, timeRange),
      totalEvents: userEvents.length,
      firstSeen: this.getUserFirstSeen(userId),
      lastSeen: this.getUserLastSeen(userId),
      averageSessionDuration: this.calculateAverageSessionDuration(userId, timeRange),
      activityDays: uniqueDays.size,
      engagementScore,
      retentionRate: this.calculateRetentionRate(userId, timeRange),
    }
  }

  /**
   * Get notification analytics
   */
  getNotificationAnalytics(timeRange: TimeRange): NotificationAnalytics {
    // Get notification events
    const notifEvents = this.events.filter(
      e => e.type.startsWith('notification.')
        && e.timestamp >= timeRange.start
        && e.timestamp <= timeRange.end,
    )

    const sentEvents = notifEvents.filter(e => e.type === 'notification.sent')
    const deliveredEvents = notifEvents.filter(e => e.type === 'notification.delivered')
    const failedEvents = notifEvents.filter(e => e.type === 'notification.failed')

    // Count by type
    const byType: Record<string, number> = {}
    sentEvents.forEach((e) => {
      const type = e.data.type || 'unknown'
      byType[type] = (byType[type] || 0) + 1
    })

    // Count by priority
    const byPriority: Record<string, number> = {}
    sentEvents.forEach((e) => {
      const priority = e.data.priority || 'normal'
      byPriority[priority] = (byPriority[priority] || 0) + 1
    })

    // Count by hour
    const byHour = Array.from({ length: 24 }).fill(0) as number[]
    sentEvents.forEach((e) => {
      const hour = e.timestamp.getHours()
      byHour[hour]++
    })

    // Top recipients
    const recipientCounts = new Map<number, number>()
    sentEvents.forEach((e) => {
      if (e.data.userId) {
        recipientCounts.set(e.data.userId, (recipientCounts.get(e.data.userId) || 0) + 1)
      }
    })
    const topRecipients = Array.from(recipientCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([userId, count]) => ({ userId, count }))

    const totalSent = sentEvents.length
    const totalDelivered = deliveredEvents.length
    const totalFailed = failedEvents.length

    return {
      totalSent,
      totalDelivered,
      totalFailed,
      deliveryRate: totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0,
      averageDeliveryTime: 0, // Would need actual timing data
      byType,
      byPriority,
      byHour,
      topRecipients,
    }
  }

  /**
   * Get analytics summary
   */
  getSummary(period: TimePeriod, timeRange: TimeRange): AnalyticsSummary {
    const allEvents = this.events.filter(
      e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end,
    )

    // Count unique users
    const uniqueUsers = new Set(
      allEvents.filter(e => e.data.userId).map(e => e.data.userId),
    )

    // Count new users (registered in this period)
    const newUserEvents = allEvents.filter(e => e.type === 'user.registered')

    // Get top metrics
    const topMetrics: Array<{ metricId: string, value: number }> = []
    for (const [metricId, metric] of this.metrics) {
      const latest = metric.getLatestValue()
      if (latest !== null) {
        topMetrics.push({ metricId, value: latest })
      }
    }
    topMetrics.sort((a, b) => b.value - a.value)

    // Calculate trends
    const trends: Record<string, 'up' | 'down' | 'stable'> = {}
    for (const [metricId, metric] of this.metrics) {
      trends[metricId] = metric.calculateTrend()
    }

    return {
      period,
      timeRange,
      totalMetrics: this.metrics.size,
      totalEvents: allEvents.length,
      activeUsers: uniqueUsers.size,
      newUsers: newUserEvents.length,
      topMetrics: topMetrics.slice(0, 5),
      trends,
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.metrics.clear()
    this.reports.clear()
    this.events = []
  }

  /**
   * Clear metric data
   */
  clearMetric(metricId: string): void {
    const metric = this.metrics.get(metricId)
    if (metric) {
      metric.clear()
    }
  }

  /**
   * Helper: Count user sessions
   */
  private countUserSessions(userId: number, timeRange: TimeRange): number {
    const sessionEvents = this.events.filter(
      e => e.type === 'session.start'
        && e.data.userId === userId
        && e.timestamp >= timeRange.start
        && e.timestamp <= timeRange.end,
    )
    return sessionEvents.length
  }

  /**
   * Helper: Get user first seen
   */
  private getUserFirstSeen(userId: number): Date {
    const userEvents = this.events.filter(e => e.data.userId === userId)
    if (userEvents.length === 0)
      return new Date()
    return userEvents[0].timestamp
  }

  /**
   * Helper: Get user last seen
   */
  private getUserLastSeen(userId: number): Date {
    const userEvents = this.events.filter(e => e.data.userId === userId)
    if (userEvents.length === 0)
      return new Date()
    return userEvents[userEvents.length - 1].timestamp
  }

  /**
   * Helper: Calculate average session duration
   */
  private calculateAverageSessionDuration(userId: number, timeRange: TimeRange): number {
    const sessionEvents = this.events.filter(
      e => (e.type === 'session.start' || e.type === 'session.end')
        && e.data.userId === userId
        && e.timestamp >= timeRange.start
        && e.timestamp <= timeRange.end,
    )

    if (sessionEvents.length < 2)
      return 0

    let totalDuration = 0
    let sessionCount = 0

    for (let i = 0; i < sessionEvents.length - 1; i++) {
      if (sessionEvents[i].type === 'session.start'
        && sessionEvents[i + 1].type === 'session.end') {
        const duration = sessionEvents[i + 1].timestamp.getTime() - sessionEvents[i].timestamp.getTime()
        totalDuration += duration
        sessionCount++
      }
    }

    return sessionCount > 0 ? totalDuration / sessionCount / 1000 : 0 // in seconds
  }

  /**
   * Helper: Calculate retention rate
   */
  private calculateRetentionRate(userId: number, timeRange: TimeRange): number {
    const firstWeekEnd = new Date(timeRange.start)
    firstWeekEnd.setDate(firstWeekEnd.getDate() + 7)

    const firstWeekEvents = this.events.filter(
      e => e.data.userId === userId
        && e.timestamp >= timeRange.start
        && e.timestamp <= firstWeekEnd,
    )

    const laterEvents = this.events.filter(
      e => e.data.userId === userId
        && e.timestamp > firstWeekEnd
        && e.timestamp <= timeRange.end,
    )

    if (firstWeekEvents.length === 0)
      return 0
    return laterEvents.length > 0 ? 100 : 0
  }

  /**
   * Get event count
   */
  getEventCount(): number {
    return this.events.length
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string, timeRange?: TimeRange): Array<{ type: string, timestamp: Date, data: any }> {
    let filtered = this.events.filter(e => e.type === type)

    if (timeRange) {
      filtered = filtered.filter(
        e => e.timestamp >= timeRange.start && e.timestamp <= timeRange.end,
      )
    }

    return filtered
  }
}
