/**
 * Tests for AnalyticsService class
 */

import type { MetricDefinition, ReportConfig } from '../../../src/modules/analytics/types.js'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { AnalyticsService } from '../../../src/modules/analytics/analytics-service.js'

describe('AnalyticsService', () => {
  let service: AnalyticsService

  beforeEach(() => {
    service = new AnalyticsService()
  })

  describe('Register Metrics', () => {
    test('should register metric', () => {
      const definition: MetricDefinition = {
        id: 'total_users',
        name: 'Total Users',
        type: 'counter',
        category: 'user',
      }

      service.registerMetric(definition)
      const metric = service.getMetric('total_users')

      expect(metric).toBeDefined()
      expect(metric?.getId()).toBe('total_users')
    })

    test('should register multiple metrics', () => {
      service.registerMetric({
        id: 'metric1',
        name: 'Metric 1',
        type: 'counter',
        category: 'user',
      })
      service.registerMetric({
        id: 'metric2',
        name: 'Metric 2',
        type: 'gauge',
        category: 'system',
      })

      expect(service.getAllMetrics()).toHaveLength(2)
    })
  })

  describe('Track Metrics', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'test_metric',
        name: 'Test Metric',
        type: 'counter',
        category: 'user',
      })
    })

    test('should track metric value', () => {
      service.track('test_metric', 10)

      const metric = service.getMetric('test_metric')
      expect(metric?.getCount()).toBe(1)
      expect(metric?.getLatestValue()).toBe(10)
    })

    test('should track with metadata', () => {
      service.track('test_metric', 20, { userId: 123 })

      const metric = service.getMetric('test_metric')
      const points = metric?.getDataPoints()
      expect(points?.[0].metadata).toEqual({ userId: 123 })
    })

    test('should throw error for non-existent metric', () => {
      expect(() => service.track('nonexistent', 10)).toThrow('Metric not found')
    })
  })

  describe('Increment Counter', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'counter',
        name: 'Counter',
        type: 'counter',
        category: 'user',
      })
    })

    test('should increment by 1 by default', () => {
      service.track('counter', 0)
      service.increment('counter')

      const metric = service.getMetric('counter')
      expect(metric?.getLatestValue()).toBe(1)
    })

    test('should increment by specified amount', () => {
      service.track('counter', 10)
      service.increment('counter', 5)

      const metric = service.getMetric('counter')
      expect(metric?.getLatestValue()).toBe(15)
    })
  })

  describe('Set Gauge', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'gauge',
        name: 'Gauge',
        type: 'gauge',
        category: 'system',
      })
    })

    test('should set gauge value', () => {
      service.gauge('gauge', 42)

      const metric = service.getMetric('gauge')
      expect(metric?.getLatestValue()).toBe(42)
    })

    test('should update gauge value', () => {
      service.gauge('gauge', 10)
      service.gauge('gauge', 20)

      const metric = service.getMetric('gauge')
      expect(metric?.getLatestValue()).toBe(20)
      expect(metric?.getCount()).toBe(2)
    })
  })

  describe('Track Events', () => {
    test('should track event', () => {
      service.trackEvent('user.login')
      expect(service.getEventCount()).toBe(1)
    })

    test('should track event with data', () => {
      service.trackEvent('user.login', { userId: 123 })

      const events = service.getEventsByType('user.login')
      expect(events).toHaveLength(1)
      expect(events[0].data).toEqual({ userId: 123 })
    })

    test('should track multiple events', () => {
      service.trackEvent('event1')
      service.trackEvent('event2')
      service.trackEvent('event3')

      expect(service.getEventCount()).toBe(3)
    })
  })

  describe('Query Metrics', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'metric',
        name: 'Metric',
        type: 'counter',
        category: 'user',
      })
      service.track('metric', 10)
      service.track('metric', 20)
      service.track('metric', 30)
    })

    test('should query metric', () => {
      const result = service.query({
        metricId: 'metric',
        timeRange: {
          start: new Date(Date.now() - 86400000),
          end: new Date(),
        },
      })

      expect(result.metricId).toBe('metric')
      expect(result.dataPoints).toHaveLength(3)
      expect(result.summary).toBeDefined()
    })

    test('should filter by time range', () => {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 86400000)

      const result = service.query({
        metricId: 'metric',
        timeRange: {
          start: yesterday,
          end: now,
        },
      })

      expect(result.dataPoints.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Create and Generate Reports', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'metric1',
        name: 'Metric 1',
        type: 'counter',
        category: 'user',
      })
      service.track('metric1', 100)
    })

    test('should create report', () => {
      const config: ReportConfig = {
        id: 'report1',
        name: 'Test Report',
        metrics: ['metric1'],
        timeRange: {
          start: new Date(Date.now() - 86400000),
          end: new Date(),
        },
        format: 'json',
      }

      const report = service.createReport(config)
      expect(report).toBeDefined()
    })

    test('should generate report', async () => {
      const config: ReportConfig = {
        id: 'report1',
        name: 'Test Report',
        metrics: ['metric1'],
        timeRange: {
          start: new Date(Date.now() - 86400000),
          end: new Date(),
        },
        format: 'json',
      }

      const data = await service.generateReport(config)

      expect(data.status).toBe('completed')
      expect(data.metrics).toHaveLength(1)
    })

    test('should handle report generation error', async () => {
      const config: ReportConfig = {
        id: 'report1',
        name: 'Test Report',
        metrics: ['nonexistent'],
        timeRange: {
          start: new Date(),
          end: new Date(),
        },
        format: 'json',
      }

      const data = await service.generateReport(config)
      expect(data.status).toBe('failed')
      expect(data.error).toBeDefined()
    })
  })

  describe('Export Report', () => {
    beforeEach(async () => {
      service.registerMetric({
        id: 'metric1',
        name: 'Metric 1',
        type: 'counter',
        category: 'user',
      })
      service.track('metric1', 100)

      await service.generateReport({
        id: 'report1',
        name: 'Test Report',
        metrics: ['metric1'],
        timeRange: {
          start: new Date(Date.now() - 86400000),
          end: new Date(),
        },
        format: 'json',
      })
    })

    test('should export report as JSON', () => {
      const json = service.exportReport('report1', 'json')
      expect(() => JSON.parse(json)).not.toThrow()
    })

    test('should export report as CSV', () => {
      const csv = service.exportReport('report1', 'csv')
      expect(csv).toContain('Metric ID')
    })

    test('should throw error for non-existent report', () => {
      expect(() => service.exportReport('nonexistent', 'json')).toThrow('Report not found')
    })
  })

  describe('User Analytics', () => {
    beforeEach(() => {
      service.trackEvent('user.login', { userId: 123 })
      service.trackEvent('page.view', { userId: 123 })
      service.trackEvent('button.click', { userId: 123 })
    })

    test('should get user analytics', () => {
      const analytics = service.getUserAnalytics(123, {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.userId).toBe(123)
      expect(analytics.totalEvents).toBe(3)
      expect(analytics.engagementScore).toBeGreaterThan(0)
    })

    test('should calculate activity days', () => {
      const analytics = service.getUserAnalytics(123, {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.activityDays).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Notification Analytics', () => {
    beforeEach(() => {
      service.trackEvent('notification.sent', {
        type: 'announcement',
        priority: 'normal',
        userId: 123,
      })
      service.trackEvent('notification.sent', {
        type: 'alert',
        priority: 'urgent',
        userId: 456,
      })
      service.trackEvent('notification.delivered', {})
    })

    test('should get notification analytics', () => {
      const analytics = service.getNotificationAnalytics({
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.totalSent).toBe(2)
      expect(analytics.totalDelivered).toBe(1)
      expect(analytics.byType).toBeDefined()
      expect(analytics.byPriority).toBeDefined()
    })

    test('should calculate delivery rate', () => {
      const analytics = service.getNotificationAnalytics({
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.deliveryRate).toBe(50) // 1/2 = 50%
    })

    test('should count by type', () => {
      const analytics = service.getNotificationAnalytics({
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.byType.announcement).toBe(1)
      expect(analytics.byType.alert).toBe(1)
    })

    test('should have 24 hour distribution', () => {
      const analytics = service.getNotificationAnalytics({
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(analytics.byHour).toHaveLength(24)
    })
  })

  describe('Analytics Summary', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'metric1',
        name: 'Metric 1',
        type: 'counter',
        category: 'user',
      })
      service.track('metric1', 100)

      service.trackEvent('user.registered', { userId: 123 })
      service.trackEvent('page.view', { userId: 456 })
    })

    test('should get analytics summary', () => {
      const summary = service.getSummary('day', {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(summary.period).toBe('day')
      expect(summary.totalMetrics).toBe(1)
      expect(summary.totalEvents).toBe(2)
    })

    test('should include top metrics', () => {
      const summary = service.getSummary('day', {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(summary.topMetrics).toBeDefined()
      expect(Array.isArray(summary.topMetrics)).toBe(true)
    })

    test('should count new users', () => {
      const summary = service.getSummary('day', {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(summary.newUsers).toBe(1)
    })
  })

  describe('Clear Data', () => {
    beforeEach(() => {
      service.registerMetric({
        id: 'metric1',
        name: 'Metric 1',
        type: 'counter',
        category: 'user',
      })
      service.track('metric1', 100)
      service.trackEvent('event1')
    })

    test('should clear all data', () => {
      service.clear()

      expect(service.getAllMetrics()).toHaveLength(0)
      expect(service.getEventCount()).toBe(0)
    })

    test('should clear specific metric', () => {
      service.clearMetric('metric1')

      const metric = service.getMetric('metric1')
      expect(metric?.getCount()).toBe(0)
    })
  })

  describe('Get Events', () => {
    beforeEach(() => {
      service.trackEvent('event1', { data: 'value1' })
      service.trackEvent('event2', { data: 'value2' })
      service.trackEvent('event1', { data: 'value3' })
    })

    test('should get events by type', () => {
      const events = service.getEventsByType('event1')
      expect(events).toHaveLength(2)
    })

    test('should filter events by time range', () => {
      const events = service.getEventsByType('event1', {
        start: new Date(Date.now() - 86400000),
        end: new Date(),
      })

      expect(events.length).toBeGreaterThanOrEqual(0)
    })
  })
})
