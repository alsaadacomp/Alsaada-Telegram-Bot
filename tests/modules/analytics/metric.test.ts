/**
 * Tests for Metric class
 */

import type { MetricDefinition } from '../../../src/modules/analytics/types.js'
import { describe, expect, test } from '@jest/globals'
import { Metric } from '../../../src/modules/analytics/core/metric.js'

describe('Metric', () => {
  const createMetric = (): Metric => {
    const definition: MetricDefinition = {
      id: 'test_metric',
      name: 'Test Metric',
      type: 'counter',
      category: 'user',
      description: 'A test metric',
    }
    return new Metric(definition)
  }

  describe('Constructor and Basic Properties', () => {
    test('should create metric with definition', () => {
      const metric = createMetric()

      expect(metric.getId()).toBe('test_metric')
      expect(metric.getName()).toBe('Test Metric')
      expect(metric.getType()).toBe('counter')
      expect(metric.getCategory()).toBe('user')
    })

    test('should start with zero data points', () => {
      const metric = createMetric()
      expect(metric.getCount()).toBe(0)
    })
  })

  describe('Add Data Points', () => {
    test('should add single data point', () => {
      const metric = createMetric()
      metric.addDataPoint(10)

      expect(metric.getCount()).toBe(1)
      expect(metric.getLatestValue()).toBe(10)
    })

    test('should add data point with metadata', () => {
      const metric = createMetric()
      metric.addDataPoint(20, { userId: 123 })

      const points = metric.getDataPoints()
      expect(points[0].value).toBe(20)
      expect(points[0].metadata).toEqual({ userId: 123 })
    })

    test('should add multiple data points', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.getCount()).toBe(3)
    })

    test('should add multiple data points at once', () => {
      const metric = createMetric()
      const points = [
        { timestamp: new Date(), value: 10 },
        { timestamp: new Date(), value: 20 },
      ]
      metric.addDataPoints(points)

      expect(metric.getCount()).toBe(2)
    })
  })

  describe('Get Data Points', () => {
    test('should get all data points', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)

      const points = metric.getDataPoints()
      expect(points).toHaveLength(2)
    })

    test('should get data points in time range', () => {
      const metric = createMetric()
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      metric.addDataPoints([
        { timestamp: yesterday, value: 10 },
        { timestamp: now, value: 20 },
        { timestamp: tomorrow, value: 30 },
      ])

      const points = metric.getDataPointsInRange(yesterday, now)
      expect(points).toHaveLength(2)
    })
  })

  describe('Calculate Summary', () => {
    test('should calculate summary for data points', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      const summary = metric.calculateSummary()
      expect(summary.total).toBe(60)
      expect(summary.average).toBe(20)
      expect(summary.min).toBe(10)
      expect(summary.max).toBe(30)
      expect(summary.count).toBe(3)
    })

    test('should return zero summary for empty metric', () => {
      const metric = createMetric()
      const summary = metric.calculateSummary()

      expect(summary.total).toBe(0)
      expect(summary.average).toBe(0)
      expect(summary.min).toBe(0)
      expect(summary.max).toBe(0)
      expect(summary.count).toBe(0)
    })
  })

  describe('Aggregations', () => {
    test('should aggregate sum', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.aggregate('sum')).toBe(60)
    })

    test('should aggregate average', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.aggregate('avg')).toBe(20)
    })

    test('should aggregate min', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.aggregate('min')).toBe(10)
    })

    test('should aggregate max', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.aggregate('max')).toBe(30)
    })

    test('should aggregate count', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)

      expect(metric.aggregate('count')).toBe(2)
    })

    test('should aggregate median', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.aggregate('median')).toBe(20)
    })

    test('should aggregate median for even count', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)
      metric.addDataPoint(40)

      expect(metric.aggregate('median')).toBe(25)
    })
  })

  describe('Calculate Trend', () => {
    test('should detect upward trend', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)
      metric.addDataPoint(40)

      expect(metric.calculateTrend()).toBe('up')
    })

    test('should detect downward trend', () => {
      const metric = createMetric()
      metric.addDataPoint(40)
      metric.addDataPoint(30)
      metric.addDataPoint(20)
      metric.addDataPoint(10)

      expect(metric.calculateTrend()).toBe('down')
    })

    test('should detect stable trend', () => {
      const metric = createMetric()
      metric.addDataPoint(20)
      metric.addDataPoint(21)
      metric.addDataPoint(20)
      metric.addDataPoint(19)

      expect(metric.calculateTrend()).toBe('stable')
    })

    test('should return stable for insufficient data', () => {
      const metric = createMetric()
      metric.addDataPoint(10)

      expect(metric.calculateTrend()).toBe('stable')
    })
  })

  describe('Calculate Change Percent', () => {
    test('should calculate positive change', () => {
      const metric = createMetric()
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      const previousPoints = [
        { timestamp: new Date(), value: 10 },
      ]

      const change = metric.calculateChangePercent(previousPoints)
      expect(change).toBe(150) // 150% increase
    })

    test('should calculate negative change', () => {
      const metric = createMetric()
      metric.addDataPoint(10)

      const previousPoints = [
        { timestamp: new Date(), value: 20 },
      ]

      const change = metric.calculateChangePercent(previousPoints)
      expect(change).toBe(-50) // 50% decrease
    })

    test('should return 0 for no change', () => {
      const metric = createMetric()
      metric.addDataPoint(10)

      const previousPoints = [
        { timestamp: new Date(), value: 10 },
      ]

      const change = metric.calculateChangePercent(previousPoints)
      expect(change).toBe(0)
    })
  })

  describe('Clear and Reset', () => {
    test('should clear all data points', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)

      metric.clear()
      expect(metric.getCount()).toBe(0)
    })
  })

  describe('Latest Value', () => {
    test('should get latest value', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)
      metric.addDataPoint(30)

      expect(metric.getLatestValue()).toBe(30)
    })

    test('should return null for empty metric', () => {
      const metric = createMetric()
      expect(metric.getLatestValue()).toBeNull()
    })
  })

  describe('Timestamps', () => {
    test('should get earliest timestamp', () => {
      const metric = createMetric()
      const timestamp1 = new Date()
      const timestamp2 = new Date(timestamp1.getTime() + 1000)

      metric.addDataPoints([
        { timestamp: timestamp1, value: 10 },
        { timestamp: timestamp2, value: 20 },
      ])

      expect(metric.getEarliestTimestamp()).toEqual(timestamp1)
    })

    test('should get latest timestamp', () => {
      const metric = createMetric()
      const timestamp1 = new Date()
      const timestamp2 = new Date(timestamp1.getTime() + 1000)

      metric.addDataPoints([
        { timestamp: timestamp1, value: 10 },
        { timestamp: timestamp2, value: 20 },
      ])

      expect(metric.getLatestTimestamp()).toEqual(timestamp2)
    })

    test('should return null for empty metric', () => {
      const metric = createMetric()
      expect(metric.getEarliestTimestamp()).toBeNull()
      expect(metric.getLatestTimestamp()).toBeNull()
    })
  })

  describe('Group By Period', () => {
    test('should group by day', () => {
      const metric = createMetric()
      const date1 = new Date('2025-01-01T10:00:00')
      const date2 = new Date('2025-01-01T15:00:00')
      const date3 = new Date('2025-01-02T10:00:00')

      metric.addDataPoints([
        { timestamp: date1, value: 10 },
        { timestamp: date2, value: 20 },
        { timestamp: date3, value: 30 },
      ])

      const grouped = metric.groupByPeriod('day')
      expect(grouped.size).toBe(2)
    })

    test('should group by hour', () => {
      const metric = createMetric()
      const date1 = new Date('2025-01-01T10:30:00')
      const date2 = new Date('2025-01-01T10:45:00')
      const date3 = new Date('2025-01-01T11:00:00')

      metric.addDataPoints([
        { timestamp: date1, value: 10 },
        { timestamp: date2, value: 20 },
        { timestamp: date3, value: 30 },
      ])

      const grouped = metric.groupByPeriod('hour')
      expect(grouped.size).toBe(2)
    })
  })

  describe('Filter By Metadata', () => {
    test('should filter data points by metadata', () => {
      const metric = createMetric()
      metric.addDataPoint(10, { userId: 123 })
      metric.addDataPoint(20, { userId: 456 })
      metric.addDataPoint(30, { userId: 123 })

      const filtered = metric.filterByMetadata('userId', 123)
      expect(filtered).toHaveLength(2)
    })
  })

  describe('Clone', () => {
    test('should clone metric with data', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)

      const clone = metric.clone()
      expect(clone.getCount()).toBe(2)
      expect(clone.getId()).toBe(metric.getId())
    })

    test('should create independent clone', () => {
      const metric = createMetric()
      metric.addDataPoint(10)

      const clone = metric.clone()
      metric.addDataPoint(20)

      expect(metric.getCount()).toBe(2)
      expect(clone.getCount()).toBe(1)
    })
  })

  describe('To JSON', () => {
    test('should convert to JSON', () => {
      const metric = createMetric()
      metric.addDataPoint(10)
      metric.addDataPoint(20)

      const json = metric.toJSON()
      expect(json).toHaveProperty('definition')
      expect(json).toHaveProperty('dataPoints')
      expect(json).toHaveProperty('summary')
      expect(json).toHaveProperty('count')
      expect(json.count).toBe(2)
    })
  })
})
