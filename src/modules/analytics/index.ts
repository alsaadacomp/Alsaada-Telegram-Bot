/**
 * Analytics & Reports Module - Main Entry Point
 *
 * A simplified yet powerful analytics and reporting system with:
 * - Metric tracking (counters, gauges, rates)
 * - Report generation with multiple formats
 * - User analytics (activity, engagement, retention)
 * - Notification analytics (delivery, rates, trends)
 * - Export capabilities (JSON, CSV, HTML, Markdown)
 */

// Core exports
export { AnalyticsService } from './analytics-service.js'
export { Metric, Report } from './core/index.js'

// Type exports
export type {
  AggregationFunction,
  AnalyticsEvent,
  AnalyticsSummary,
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  ExportOptions,
  MetricCategory,
  MetricDataPoint,
  MetricDefinition,
  MetricFilter,
  MetricQuery,
  MetricResult,
  MetricSummary,
  MetricType,
  NotificationAnalytics,
  ReportConfig,
  ReportData,
  ReportFormat,
  ReportRecipient,
  ReportSchedule,
  ReportStatus,
  TimePeriod,
  TimeRange,
  UserAnalytics,
} from './types.js'
