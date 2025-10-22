/**
 * Analytics & Reports - Type Definitions
 *
 * Comprehensive analytics and reporting system with support for
 * metrics tracking, report generation, data visualization, and exports.
 */

/**
 * Metric types
 */
export type MetricType =
  | 'counter' // Simple counter (e.g., total users)
  | 'gauge' // Current value (e.g., active users now)
  | 'histogram' // Distribution of values
  | 'rate' // Rate over time (e.g., users per hour)
  | 'percentage' // Percentage value

/**
 * Time period for analytics
 */
export type TimePeriod =
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

/**
 * Report format
 */
export type ReportFormat =
  | 'json'
  | 'csv'
  | 'excel'
  | 'pdf'
  | 'html'
  | 'markdown'

/**
 * Chart type
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'doughnut'
  | 'area'
  | 'scatter'
  | 'radar'

/**
 * Aggregation function
 */
export type AggregationFunction =
  | 'sum'
  | 'avg'
  | 'min'
  | 'max'
  | 'count'
  | 'median'
  | 'percentile'

/**
 * Metric category
 */
export type MetricCategory =
  | 'user'
  | 'notification'
  | 'system'
  | 'business'
  | 'custom'

/**
 * Report status
 */
export type ReportStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed'
  | 'scheduled'

/**
 * Metric definition
 */
export interface MetricDefinition {
  id: string
  name: string
  type: MetricType
  category: MetricCategory
  description?: string
  unit?: string
  tags?: string[]
}

/**
 * Metric data point
 */
export interface MetricDataPoint {
  timestamp: Date
  value: number
  metadata?: Record<string, any>
}

/**
 * Time range
 */
export interface TimeRange {
  start: Date
  end: Date
  period?: TimePeriod
}

/**
 * Metric query
 */
export interface MetricQuery {
  metricId: string
  timeRange: TimeRange
  aggregation?: AggregationFunction
  groupBy?: string[]
  filters?: MetricFilter[]
}

/**
 * Metric filter
 */
export interface MetricFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'in' | 'not_in'
  value: any
}

/**
 * Metric result
 */
export interface MetricResult {
  metricId: string
  timeRange: TimeRange
  dataPoints: MetricDataPoint[]
  summary: MetricSummary
}

/**
 * Metric summary
 */
export interface MetricSummary {
  total: number
  average: number
  min: number
  max: number
  count: number
  trend?: 'up' | 'down' | 'stable'
  changePercent?: number
}

/**
 * Report configuration
 */
export interface ReportConfig {
  id: string
  name: string
  description?: string
  metrics: string[]
  timeRange: TimeRange
  format: ReportFormat
  includeCharts?: boolean
  chartTypes?: Record<string, ChartType>
  groupBy?: string[]
  filters?: MetricFilter[]
  schedule?: ReportSchedule
}

/**
 * Report schedule
 */
export interface ReportSchedule {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  time?: string // HH:mm format
  dayOfWeek?: number // 0-6
  dayOfMonth?: number // 1-31
  recipients?: ReportRecipient[]
  enabled: boolean
}

/**
 * Report recipient
 */
export interface ReportRecipient {
  type: 'user' | 'role' | 'email'
  identifier: string | number
}

/**
 * Report data
 */
export interface ReportData {
  id: string
  config: ReportConfig
  generatedAt: Date
  status: ReportStatus
  metrics: MetricResult[]
  charts?: ChartData[]
  summary?: Record<string, any>
  exportUrl?: string
  error?: string
}

/**
 * Chart data
 */
export interface ChartData {
  type: ChartType
  title: string
  labels: string[]
  datasets: ChartDataset[]
  options?: ChartOptions
}

/**
 * Chart dataset
 */
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  fill?: boolean
}

/**
 * Chart options
 */
export interface ChartOptions {
  responsive?: boolean
  legend?: {
    display: boolean
    position?: 'top' | 'bottom' | 'left' | 'right'
  }
  scales?: {
    yAxes?: Array<{
      ticks?: {
        beginAtZero?: boolean
      }
    }>
  }
}

/**
 * Dashboard configuration
 */
export interface DashboardConfig {
  id: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  layout?: DashboardLayout
  refreshInterval?: number // in seconds
}

/**
 * Dashboard widget
 */
export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'stat'
  title: string
  metricId?: string
  chartType?: ChartType
  size?: 'small' | 'medium' | 'large'
  position?: { x: number, y: number }
  query?: MetricQuery
}

/**
 * Dashboard layout
 */
export interface DashboardLayout {
  columns: number
  rows: number
  gap?: number
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  id: string
  type: string
  category: string
  action: string
  label?: string
  value?: number
  userId?: number
  sessionId?: string
  metadata?: Record<string, any>
  timestamp: Date
}

/**
 * User analytics
 */
export interface UserAnalytics {
  userId: number
  totalSessions: number
  totalEvents: number
  firstSeen: Date
  lastSeen: Date
  averageSessionDuration: number
  activityDays: number
  engagementScore: number
  retentionRate: number
}

/**
 * Notification analytics
 */
export interface NotificationAnalytics {
  totalSent: number
  totalDelivered: number
  totalFailed: number
  deliveryRate: number
  averageDeliveryTime: number
  byType: Record<string, number>
  byPriority: Record<string, number>
  byHour: number[]
  topRecipients: Array<{ userId: number, count: number }>
}

/**
 * System analytics
 */
export interface SystemAnalytics {
  uptime: number
  responseTime: number
  errorRate: number
  requestsPerSecond: number
  activeUsers: number
  memoryUsage: number
  cpuUsage: number
  databaseConnections: number
}

/**
 * Cohort analysis
 */
export interface CohortAnalysis {
  cohortDate: Date
  userCount: number
  retentionByPeriod: Record<string, number>
  engagement: number[]
  churnRate: number
}

/**
 * Funnel analysis
 */
export interface FunnelAnalysis {
  name: string
  steps: FunnelStep[]
  conversionRate: number
  dropoffRates: number[]
}

/**
 * Funnel step
 */
export interface FunnelStep {
  name: string
  userCount: number
  conversionFromPrevious: number
}

/**
 * Export options
 */
export interface ExportOptions {
  format: ReportFormat
  filename?: string
  includeCharts?: boolean
  includeMetadata?: boolean
  compression?: boolean
}

/**
 * Comparison result
 */
export interface ComparisonResult {
  current: MetricResult
  previous: MetricResult
  change: number
  changePercent: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * Alert rule
 */
export interface AlertRule {
  id: string
  name: string
  metricId: string
  condition: AlertCondition
  actions: AlertAction[]
  enabled: boolean
  cooldown?: number // minutes
}

/**
 * Alert condition
 */
export interface AlertCondition {
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals'
  threshold: number
  duration?: number // minutes
}

/**
 * Alert action
 */
export interface AlertAction {
  type: 'notification' | 'email' | 'webhook'
  target: string
  message?: string
}

/**
 * Analytics summary
 */
export interface AnalyticsSummary {
  period: TimePeriod
  timeRange: TimeRange
  totalMetrics: number
  totalEvents: number
  activeUsers: number
  newUsers: number
  topMetrics: Array<{ metricId: string, value: number }>
  trends: Record<string, 'up' | 'down' | 'stable'>
}
