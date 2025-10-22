/**
 * Analytics & Reports - Report Class
 *
 * Generates reports from metrics data with export capabilities.
 */

import type {
  MetricResult,
  ReportConfig,
  ReportData,
  ReportFormat,
  ReportStatus,
  TimeRange,
} from '../types.js'

export class Report {
  private config: ReportConfig
  private status: ReportStatus = 'pending'
  private generatedAt?: Date
  private metrics: MetricResult[] = []
  private error?: string

  constructor(config: ReportConfig) {
    this.config = { ...config }
  }

  /**
   * Add metric result
   */
  addMetricResult(result: MetricResult): this {
    this.metrics.push(result)
    return this
  }

  /**
   * Set status
   */
  setStatus(status: ReportStatus): this {
    this.status = status
    if (status === 'completed') {
      this.generatedAt = new Date()
    }
    return this
  }

  /**
   * Set error
   */
  setError(error: string): this {
    this.error = error
    this.status = 'failed'
    return this
  }

  /**
   * Get report data
   */
  getData(): ReportData {
    return {
      id: this.config.id,
      config: this.config,
      generatedAt: this.generatedAt || new Date(),
      status: this.status,
      metrics: this.metrics,
      summary: this.generateSummary(),
      error: this.error,
    }
  }

  /**
   * Generate summary
   */
  private generateSummary(): Record<string, any> {
    const summary: Record<string, any> = {
      totalMetrics: this.metrics.length,
      reportName: this.config.name,
      timeRange: this.config.timeRange,
    }

    // Add metric summaries
    for (const metric of this.metrics) {
      summary[metric.metricId] = metric.summary
    }

    return summary
  }

  /**
   * Export as JSON
   */
  exportJSON(pretty: boolean = true): string {
    const data = this.getData()
    return JSON.stringify(data, null, pretty ? 2 : 0)
  }

  /**
   * Export as CSV
   */
  exportCSV(): string {
    const lines: string[] = []

    // Header
    lines.push('Metric ID,Timestamp,Value,Total,Average,Min,Max')

    // Data rows
    for (const metric of this.metrics) {
      for (const point of metric.dataPoints) {
        lines.push([
          metric.metricId,
          point.timestamp.toISOString(),
          point.value,
          metric.summary.total,
          metric.summary.average.toFixed(2),
          metric.summary.min,
          metric.summary.max,
        ].join(','))
      }
    }

    return lines.join('\n')
  }

  /**
   * Export in specified format
   */
  export(format: ReportFormat): string {
    switch (format) {
      case 'json':
        return this.exportJSON()
      case 'csv':
        return this.exportCSV()
      case 'markdown':
        return this.exportMarkdown()
      case 'html':
        return this.exportHTML()
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Export as Markdown
   */
  exportMarkdown(): string {
    const data = this.getData()
    const lines: string[] = []

    lines.push(`# ${this.config.name}\n`)

    if (this.config.description) {
      lines.push(`${this.config.description}\n`)
    }

    lines.push(`**Generated:** ${data.generatedAt.toLocaleString()}`)
    lines.push(`**Period:** ${data.config.timeRange.start.toLocaleDateString()} - ${data.config.timeRange.end.toLocaleDateString()}\n`)

    lines.push(`## Summary\n`)
    lines.push(`- Total Metrics: ${this.metrics.length}`)
    lines.push(`- Status: ${this.status}\n`)

    for (const metric of this.metrics) {
      lines.push(`### ${metric.metricId}\n`)
      lines.push(`| Stat | Value |`)
      lines.push(`|------|-------|`)
      lines.push(`| Total | ${metric.summary.total} |`)
      lines.push(`| Average | ${metric.summary.average.toFixed(2)} |`)
      lines.push(`| Min | ${metric.summary.min} |`)
      lines.push(`| Max | ${metric.summary.max} |`)
      lines.push(`| Count | ${metric.summary.count} |`)
      if (metric.summary.trend) {
        lines.push(`| Trend | ${metric.summary.trend} ${this.getTrendEmoji(metric.summary.trend)} |`)
      }
      lines.push('')
    }

    return lines.join('\n')
  }

  /**
   * Export as HTML
   */
  exportHTML(): string {
    const data = this.getData()

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${this.config.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; }
        .metric { margin: 20px 0; }
        .trend-up { color: green; }
        .trend-down { color: red; }
        .trend-stable { color: gray; }
    </style>
</head>
<body>
    <h1>${this.config.name}</h1>
    ${this.config.description ? `<p>${this.config.description}</p>` : ''}
    
    <div class="summary">
        <p><strong>Generated:</strong> ${data.generatedAt.toLocaleString()}</p>
        <p><strong>Period:</strong> ${data.config.timeRange.start.toLocaleDateString()} - ${data.config.timeRange.end.toLocaleDateString()}</p>
        <p><strong>Total Metrics:</strong> ${this.metrics.length}</p>
        <p><strong>Status:</strong> ${this.status}</p>
    </div>
    
    ${this.metrics.map(metric => `
    <div class="metric">
        <h2>${metric.metricId}</h2>
        <table>
            <tr><th>Stat</th><th>Value</th></tr>
            <tr><td>Total</td><td>${metric.summary.total}</td></tr>
            <tr><td>Average</td><td>${metric.summary.average.toFixed(2)}</td></tr>
            <tr><td>Min</td><td>${metric.summary.min}</td></tr>
            <tr><td>Max</td><td>${metric.summary.max}</td></tr>
            <tr><td>Count</td><td>${metric.summary.count}</td></tr>
            ${metric.summary.trend ? `<tr><td>Trend</td><td class="trend-${metric.summary.trend}">${metric.summary.trend.toUpperCase()} ${this.getTrendEmoji(metric.summary.trend)}</td></tr>` : ''}
        </table>
    </div>
    `).join('')}
</body>
</html>
    `.trim()
  }

  /**
   * Get trend emoji
   */
  private getTrendEmoji(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
    }
  }

  /**
   * Get config
   */
  getConfig(): ReportConfig {
    return { ...this.config }
  }

  /**
   * Get status
   */
  getStatus(): ReportStatus {
    return this.status
  }

  /**
   * Get metrics
   */
  getMetrics(): MetricResult[] {
    return [...this.metrics]
  }

  /**
   * Is completed
   */
  isCompleted(): boolean {
    return this.status === 'completed'
  }

  /**
   * Has error
   */
  hasError(): boolean {
    return this.status === 'failed'
  }

  /**
   * Get error
   */
  getError(): string | undefined {
    return this.error
  }
}
