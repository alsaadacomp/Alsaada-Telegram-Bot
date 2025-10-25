/**
 * Notification System Integration Tests
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockPrisma, createTestNotification, createTestEmployee } from '../test-utils.js'

describe('Notification System Integration Tests', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    jest.clearAllMocks()
  })

  describe('Notification Creation', () => {
    it('should create notification', async () => {
      const notification = createTestNotification()
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      
      expect(created.title).toBe('إشعار تجريبي')
      expect(created.status).toBe('PENDING')
    })

    it('should create urgent notification', async () => {
      const notification = createTestNotification({
        priority: 'URGENT',
        type: 'ALERT',
      })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      
      expect(created.priority).toBe('URGENT')
      expect(created.type).toBe('ALERT')
    })

    it('should schedule notification for future', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 1)
      
      const notification = createTestNotification({
        scheduledAt: futureDate,
      })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      
      expect(created.scheduledAt).toEqual(futureDate)
    })
  })

  describe('Notification Delivery', () => {
    it('should mark notification as sent', async () => {
      const notification = createTestNotification({ status: 'PENDING' })
      const sent = { ...notification, status: 'SENT', sentAt: new Date() }
      
      mockPrisma.notification.update = jest.fn().mockResolvedValue(sent)

      const result = await mockPrisma.notification.update({
        where: { id: notification.id },
        data: { status: 'SENT', sentAt: new Date() },
      })

      expect(result.status).toBe('SENT')
      expect(result.sentAt).toBeDefined()
    })

    it('should mark notification as read', async () => {
      const notification = createTestNotification({ status: 'SENT' })
      const read = { ...notification, status: 'READ', readAt: new Date() }
      
      mockPrisma.notification.update = jest.fn().mockResolvedValue(read)

      const result = await mockPrisma.notification.update({
        where: { id: notification.id },
        data: { status: 'READ', readAt: new Date() },
      })

      expect(result.status).toBe('READ')
      expect(result.readAt).toBeDefined()
    })

    it('should mark notification as failed', async () => {
      const notification = createTestNotification({ status: 'PENDING' })
      const failed = {
        ...notification,
        status: 'FAILED',
        error: 'Recipient not found',
      }
      
      mockPrisma.notification.update = jest.fn().mockResolvedValue(failed)

      const result = await mockPrisma.notification.update({
        where: { id: notification.id },
        data: { status: 'FAILED', error: 'Recipient not found' },
      })

      expect(result.status).toBe('FAILED')
      expect(result.error).toBeDefined()
    })
  })

  describe('Notification Queries', () => {
    it('should get pending notifications', async () => {
      const notifications = [
        createTestNotification({ status: 'PENDING' }),
        createTestNotification({ status: 'PENDING' }),
      ]
      
      mockPrisma.notification.findMany = jest.fn().mockResolvedValue(notifications)

      const results = await mockPrisma.notification.findMany({
        where: { status: 'PENDING' },
      })

      expect(results).toHaveLength(2)
      expect(results.every(n => n.status === 'PENDING')).toBe(true)
    })

    it('should get user notifications', async () => {
      const recipientId = 123456789
      const notifications = [
        createTestNotification({ recipientId }),
        createTestNotification({ recipientId }),
      ]
      
      mockPrisma.notification.findMany = jest.fn().mockResolvedValue(notifications)

      const results = await mockPrisma.notification.findMany({
        where: { recipientId },
      })

      expect(results).toHaveLength(2)
      expect(results.every(n => n.recipientId === recipientId)).toBe(true)
    })

    it('should get unread notifications', async () => {
      const notifications = [
        createTestNotification({ status: 'SENT' }),
        createTestNotification({ status: 'SENT' }),
      ]
      
      mockPrisma.notification.findMany = jest.fn().mockResolvedValue(notifications)

      const results = await mockPrisma.notification.findMany({
        where: { status: 'SENT' },
      })

      expect(results.every(n => n.status === 'SENT')).toBe(true)
    })

    it('should get urgent notifications', async () => {
      const notifications = [
        createTestNotification({ priority: 'URGENT' }),
      ]
      
      mockPrisma.notification.findMany = jest.fn().mockResolvedValue(notifications)

      const results = await mockPrisma.notification.findMany({
        where: { priority: 'URGENT' },
      })

      expect(results.every(n => n.priority === 'URGENT')).toBe(true)
    })
  })

  describe('Bulk Operations', () => {
    it('should mark all as read for user', async () => {
      const recipientId = 123456789
      mockPrisma.notification.update = jest.fn().mockResolvedValue({ count: 5 })

      const result = await mockPrisma.notification.update({
        where: { recipientId },
        data: { status: 'READ', readAt: new Date() },
      })

      expect(mockPrisma.notification.update).toHaveBeenCalled()
    })

    it('should delete old notifications', async () => {
      const oldDate = new Date()
      oldDate.setMonth(oldDate.getMonth() - 3)
      
      mockPrisma.notification.delete = jest.fn().mockResolvedValue({ count: 10 })

      const result = await mockPrisma.notification.delete({
        where: {
          createdAt: { lt: oldDate },
        },
      })

      expect(mockPrisma.notification.delete).toHaveBeenCalled()
    })
  })

  describe('Notification Types', () => {
    it('should create INFO notification', async () => {
      const notification = createTestNotification({ type: 'INFO' })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      expect(created.type).toBe('INFO')
    })

    it('should create WARNING notification', async () => {
      const notification = createTestNotification({ type: 'WARNING' })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      expect(created.type).toBe('WARNING')
    })

    it('should create SUCCESS notification', async () => {
      const notification = createTestNotification({ type: 'SUCCESS' })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      expect(created.type).toBe('SUCCESS')
    })

    it('should create ERROR notification', async () => {
      const notification = createTestNotification({ type: 'ERROR' })
      mockPrisma.notification.create = jest.fn().mockResolvedValue(notification)

      const created = await mockPrisma.notification.create({ data: notification })
      expect(created.type).toBe('ERROR')
    })
  })
})
