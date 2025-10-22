/**
 * Analytics & Reports - Metric Class
 *
 * Represents a single metric with data points and calculations.
 */

import type {
  AggregationFunction,
  MetricCategory,
  MetricDataPoint,
  MetricDefinition,
  MetricSummary,
  MetricType,
} from '../types.js'

export class Metric {
  private definition: MetricDefinition
  private dataPoints: MetricDataPoint[] = []

  constructor(definition: MetricDefinition) {
    this.definition = { ...definition }
  }

  /**
   * Add data point
   */
  addDataPoint(value: number, metadata?: Record<string, any>): this {
    this.dataPoints.push({
      timestamp: new Date(),
      value,
      metadata,
    })
    return this
  }

  /**
   * Add multiple data points
   */
  addDataPoints(points: MetricDataPoint[]): this {
    this.dataPoints.push(...points)
    return this
  }

  /**
   * Get all data points
   */
  getDataPoints(): MetricDataPoint[] {
    return [...this.dataPoints]
  }

  /**
   * Get data points in time range
   */
  getDataPointsInRange(start: Date, end: Date): MetricDataPoint[] {
    return this.dataPoints.filter(
      point => point.timestamp >= start && point.timestamp <= end,
    )
  }

  /**
   * Calculate summary
   */
  calculateSummary(dataPoints?: MetricDataPoint[]): MetricSummary {
    const points = dataPoints || this.dataPoints

    if (points.length === 0) {
      return {
        total: 0,
        average: 0,
        min: 0,
        max: 0,
        count: 0,
      }
    }

    const values = points.map(p => p.value)
    const total = values.reduce((sum, val) => sum + val, 0)
    const count = values.length

    return {
      total,
      average: total / count,
      min: Math.min(...values),
      max: Math.max(...values),
      count,
    }
  }

  /**
   * Calculate aggregation
   */
  aggregate(func: AggregationFunction, dataPoints?: MetricDataPoint[]): number {
    const points = dataPoints || this.dataPoints
    const values = points.map(p => p.value)

    if (values.length === 0)
      return 0

    switch (func) {
      case 'sum':
        return values.reduce((sum, val) => sum + val, 0)

      case 'avg':
        return values.reduce((sum, val) => sum + val, 0) / values.length

      case 'min':
        return Math.min(...values)

      case 'max':
        return Math.max(...values)

      case 'count':
        return values.length

      case 'median':
        return this.calculateMedian(values)

      case 'percentile':
        return this.calculatePercentile(values, 95)

      default:
        return 0
    }
  }

  /**
   * Calculate median
   */
  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2
    }
    return sorted[mid]
  }

  /**
   * Calculate percentile
   */
  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b)
    const index = Math.ceil((percentile / 100) * sorted.length) - 1
    return sorted[Math.max(0, index)]
  }

  /**
   * Calculate trend
   */
  calculateTrend(): 'up' | 'down' | 'stable' {
    if (this.dataPoints.length < 2)
      return 'stable'

    const halfPoint = Math.floor(this.dataPoints.length / 2)
    const firstHalf = this.dataPoints.slice(0, halfPoint)
    const secondHalf = this.dataPoints.slice(halfPoint)

    const firstAvg = this.aggregate('avg', firstHalf)
    const secondAvg = this.aggregate('avg', secondHalf)

    const threshold = 0.05 // 5% change threshold
    const change = (secondAvg - firstAvg) / firstAvg

    if (Math.abs(change) < threshold)
      return 'stable'
    return change > 0 ? 'up' : 'down'
  }

  /**
   * Calculate change percent
   */
  calculateChangePercent(previousPoints: MetricDataPoint[]): number {
    if (previousPoints.length === 0 || this.dataPoints.length === 0)
      return 0

    const currentAvg = this.aggregate('avg')
    const previousAvg = this.aggregate('avg', previousPoints)

    if (previousAvg === 0)
      return 0

    return ((currentAvg - previousAvg) / previousAvg) * 100
  }

  /**
   * Get metric ID
   */
  getId(): string {
    return this.definition.id
  }

  /**
   * Get metric name
   */
  getName(): string {
    return this.definition.name
  }

  /**
   * Get metric type
   */
  getType(): MetricType {
    return this.definition.type
  }

  /**
   * Get metric category
   */
  getCategory(): MetricCategory {
    return this.definition.category
  }

  /**
   * Get definition
   */
  getDefinition(): MetricDefinition {
    return { ...this.definition }
  }

  /**
   * Clear data points
   */
  clear(): this {
    this.dataPoints = []
    return this
  }

  /**
   * Get data point count
   */
  getCount(): number {
    return this.dataPoints.length
  }

  /**
   * Get latest value
   */
  getLatestValue(): number | null {
    if (this.dataPoints.length === 0)
      return null
    return this.dataPoints[this.dataPoints.length - 1].value
  }

  /**
   * Get earliest timestamp
   */
  getEarliestTimestamp(): Date | null {
    if (this.dataPoints.length === 0)
      return null
    return this.dataPoints[0].timestamp
  }

  /**
   * Get latest timestamp
   */
  getLatestTimestamp(): Date | null {
    if (this.dataPoints.length === 0)
      return null
    return this.dataPoints[this.dataPoints.length - 1].timestamp
  }

  /**
   * Group data points by period
   */
  groupByPeriod(period: 'hour' | 'day' | 'week' | 'month'): Map<string, MetricDataPoint[]> {
    const groups = new Map<string, MetricDataPoint[]>()

    for (const point of this.dataPoints) {
      const key = this.getPeriodKey(point.timestamp, period)
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(point)
    }

    return groups
  }

  /**
   * Get period key for grouping
   */
  private getPeriodKey(date: Date, period: 'hour' | 'day' | 'week' | 'month'): string {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()

    switch (period) {
      case 'hour':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:00`
      case 'day':
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      case 'week':
        const weekNum = this.getWeekNumber(date)
        return `${year}-W${weekNum.toString().padStart(2, '0')}`
      case 'month':
        return `${year}-${month.toString().padStart(2, '0')}`
      default:
        return date.toISOString()
    }
  }

  /**
   * Get week number
   */
  private getWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  }

  /**
   * Filter data points by metadata
   */
  filterByMetadata(key: string, value: any): MetricDataPoint[] {
    return this.dataPoints.filter(
      point => point.metadata && point.metadata[key] === value,
    )
  }

  /**
   * Clone metric
   */
  clone(): Metric {
    const metric = new Metric(this.definition)
    metric.addDataPoints(this.dataPoints)
    return metric
  }

  /**
   * Convert to JSON
   */
  toJSON(): Record<string, any> {
    return {
      definition: this.definition,
      dataPoints: this.dataPoints,
      summary: this.calculateSummary(),
      count: this.getCount(),
      latestValue: this.getLatestValue(),
      trend: this.calculateTrend(),
    }
  }
}
