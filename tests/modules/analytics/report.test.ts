/**
 * Tests for Report class
 */

import type { MetricResult, ReportConfig } from '../../../src/modules/analytics/types.js'
import { describe, expect, test } from '@jest/globals'
import { Report } from '../../../src/modules/analytics/core/report.js'

describe('Report', () => {
  const createConfig = (): ReportConfig => ({
    id: 'test_report',
    name: 'Test Report',
    description: 'A test report',
    metrics: ['metric1', 'metric2'],
    timeRange: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
    format: 'json',
  })

  const createMetricResult = (metricId: string): MetricResult => ({
    metricId,
    timeRange: {
      start: new Date('2025-01-01'),
      end: new Date('2025-01-31'),
    },
    dataPoints: [
      { timestamp: new Date('2025-01-15'), value: 10 },
      { timestamp: new Date('2025-01-20'), value: 20 },
    ],
    summary: {
      total: 30,
      average: 15,
      min: 10,
      max: 20,
      count: 2,
      trend: 'up',
    },
  })

  describe('Constructor', () => {
    test('should create report with config', () => {
      const config = createConfig()
      const report = new Report(config)

      expect(report.getConfig()).toEqual(config)
      expect(report.getStatus()).toBe('pending')
    })
  })

  describe('Add Metric Results', () => {
    test('should add metric result', () => {
      const report = new Report(createConfig())
      const result = createMetricResult('metric1')

      report.addMetricResult(result)

      expect(report.getMetrics()).toHaveLength(1)
      expect(report.getMetrics()[0]).toEqual(result)
    })

    test('should add multiple metric results', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))
      report.addMetricResult(createMetricResult('metric2'))

      expect(report.getMetrics()).toHaveLength(2)
    })
  })

  describe('Status Management', () => {
    test('should set status', () => {
      const report = new Report(createConfig())
      report.setStatus('generating')

      expect(report.getStatus()).toBe('generating')
    })

    test('should set generated date when completed', () => {
      const report = new Report(createConfig())
      report.setStatus('completed')

      const data = report.getData()
      expect(data.generatedAt).toBeInstanceOf(Date)
    })

    test('should check if completed', () => {
      const report = new Report(createConfig())
      expect(report.isCompleted()).toBe(false)

      report.setStatus('completed')
      expect(report.isCompleted()).toBe(true)
    })

    test('should set error', () => {
      const report = new Report(createConfig())
      report.setError('Test error')

      expect(report.hasError()).toBe(true)
      expect(report.getError()).toBe('Test error')
      expect(report.getStatus()).toBe('failed')
    })
  })

  describe('Get Report Data', () => {
    test('should get complete report data', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))
      report.setStatus('completed')

      const data = report.getData()

      expect(data.id).toBe('test_report')
      expect(data.config).toBeDefined()
      expect(data.metrics).toHaveLength(1)
      expect(data.status).toBe('completed')
      expect(data.summary).toBeDefined()
    })

    test('should include summary', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const data = report.getData()
      expect(data.summary).toHaveProperty('totalMetrics')
      expect(data.summary?.totalMetrics).toBe(1)
    })
  })

  describe('Export JSON', () => {
    test('should export as JSON', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const json = report.exportJSON()
      expect(() => JSON.parse(json)).not.toThrow()

      const parsed = JSON.parse(json)
      expect(parsed.id).toBe('test_report')
    })

    test('should export pretty JSON by default', () => {
      const report = new Report(createConfig())
      const json = report.exportJSON()

      expect(json).toContain('\n')
      expect(json).toContain('  ')
    })

    test('should export compact JSON when not pretty', () => {
      const report = new Report(createConfig())
      const json = report.exportJSON(false)

      expect(json).not.toContain('\n  ')
    })
  })

  describe('Export CSV', () => {
    test('should export as CSV', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const csv = report.exportCSV()
      const lines = csv.split('\n')

      expect(lines[0]).toContain('Metric ID')
      expect(lines[0]).toContain('Timestamp')
      expect(lines[0]).toContain('Value')
    })

    test('should include all data points in CSV', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const csv = report.exportCSV()
      const lines = csv.split('\n')

      // Header + 2 data points
      expect(lines.length).toBe(3)
    })

    test('should format CSV correctly', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const csv = report.exportCSV()
      const lines = csv.split('\n')

      expect(lines[1]).toContain('metric1')
      expect(lines[1]).toContain('10')
    })
  })

  describe('Export Markdown', () => {
    test('should export as Markdown', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const md = report.exportMarkdown()

      expect(md).toContain('# Test Report')
      expect(md).toContain('## Summary')
      expect(md).toContain('### metric1')
    })

    test('should include description if provided', () => {
      const report = new Report(createConfig())
      const md = report.exportMarkdown()

      expect(md).toContain('A test report')
    })

    test('should include metric statistics', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const md = report.exportMarkdown()

      expect(md).toContain('Total')
      expect(md).toContain('Average')
      expect(md).toContain('Min')
      expect(md).toContain('Max')
    })

    test('should include trend with emoji', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const md = report.exportMarkdown()

      expect(md).toContain('up')
      expect(md).toContain('📈')
    })
  })

  describe('Export HTML', () => {
    test('should export as HTML', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const html = report.exportHTML()

      expect(html).toContain('<!DOCTYPE html>')
      expect(html).toContain('<html>')
      expect(html).toContain('</html>')
    })

    test('should include report name in HTML', () => {
      const report = new Report(createConfig())
      const html = report.exportHTML()

      expect(html).toContain('Test Report')
    })

    test('should include CSS styling', () => {
      const report = new Report(createConfig())
      const html = report.exportHTML()

      expect(html).toContain('<style>')
      expect(html).toContain('</style>')
    })

    test('should include metric data in table', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      const html = report.exportHTML()

      expect(html).toContain('<table>')
      expect(html).toContain('metric1')
      expect(html).toContain('30') // total
    })
  })

  describe('Export Method', () => {
    test('should export in JSON format', () => {
      const report = new Report(createConfig())
      const output = report.export('json')

      expect(() => JSON.parse(output)).not.toThrow()
    })

    test('should export in CSV format', () => {
      const report = new Report(createConfig())
      const output = report.export('csv')

      expect(output).toContain('Metric ID')
    })

    test('should export in Markdown format', () => {
      const report = new Report(createConfig())
      const output = report.export('markdown')

      expect(output).toContain('#')
    })

    test('should export in HTML format', () => {
      const report = new Report(createConfig())
      const output = report.export('html')

      expect(output).toContain('<!DOCTYPE html>')
    })

    test('should throw error for unsupported format', () => {
      const report = new Report(createConfig())

      expect(() => report.export('pdf' as any)).toThrow('Unsupported export format')
    })
  })

  describe('Getters', () => {
    test('should get config', () => {
      const config = createConfig()
      const report = new Report(config)

      expect(report.getConfig()).toEqual(config)
    })

    test('should get status', () => {
      const report = new Report(createConfig())
      report.setStatus('completed')

      expect(report.getStatus()).toBe('completed')
    })

    test('should get metrics', () => {
      const report = new Report(createConfig())
      report.addMetricResult(createMetricResult('metric1'))

      expect(report.getMetrics()).toHaveLength(1)
    })

    test('should get error', () => {
      const report = new Report(createConfig())
      report.setError('Test error')

      expect(report.getError()).toBe('Test error')
    })
  })
})
