/**
 * Tests for Notification class
 */

import type { NotificationButton } from '../../../src/modules/notifications/types.js'
import { describe, expect, test } from '@jest/globals'
import { Notification } from '../../../src/modules/notifications/core/notification.js'

describe('Notification', () => {
  describe('Constructor and Basic Properties', () => {
    test('should create notification with message only', () => {
      const notification = new Notification('Test message')

      expect(notification.getMessage()).toBe('Test message')
      expect(notification.getPriority()).toBe('normal')
      expect(notification.getType()).toBe('info')
      expect(notification.getStatus()).toBe('pending')
    })

    test('should create notification with full config', () => {
      const notification = new Notification('Test message', {
        priority: 'urgent',
        type: 'error',
        data: { key: 'value' },
        parseMode: 'Markdown',
      })

      expect(notification.getMessage()).toBe('Test message')
      expect(notification.getPriority()).toBe('urgent')
      expect(notification.getType()).toBe('error')
      expect(notification.getConfig().parseMode).toBe('Markdown')
    })

    test('should have created date', () => {
      const notification = new Notification('Test')
      const createdAt = notification.getCreatedAt()

      expect(createdAt).toBeInstanceOf(Date)
      expect(createdAt.getTime()).toBeLessThanOrEqual(Date.now())
    })
  })

  describe('Fluent API', () => {
    test('should set priority', () => {
      const notification = new Notification('Test')
        .setPriority('critical')

      expect(notification.getPriority()).toBe('critical')
    })

    test('should set type', () => {
      const notification = new Notification('Test')
        .setType('warning')

      expect(notification.getType()).toBe('warning')
    })

    test('should set message', () => {
      const notification = new Notification('Test')
        .setMessage('Updated message')

      expect(notification.getMessage()).toBe('Updated message')
    })

    test('should set data', () => {
      const notification = new Notification('Test')
        .setData({ foo: 'bar' })
        .setData({ baz: 'qux' })

      const config = notification.getConfig()
      expect(config.data).toEqual({ foo: 'bar', baz: 'qux' })
    })

    test('should set image', () => {
      const notification = new Notification('Test')
        .setImage('https://example.com/image.jpg')

      expect(notification.getConfig().image).toBe('https://example.com/image.jpg')
    })

    test('should set parse mode', () => {
      const notification = new Notification('Test')
        .setParseMode('Markdown')

      expect(notification.getConfig().parseMode).toBe('Markdown')
    })

    test('should chain methods', () => {
      const notification = new Notification('Test')
        .setPriority('urgent')
        .setType('alert')
        .setMessage('Alert!')
        .setData({ level: 5 })

      expect(notification.getMessage()).toBe('Alert!')
      expect(notification.getPriority()).toBe('urgent')
      expect(notification.getType()).toBe('alert')
    })
  })

  describe('Buttons', () => {
    test('should add button', () => {
      const button: NotificationButton = { text: 'Click me', url: 'https://example.com' }
      const notification = new Notification('Test')
        .addButton(button)

      const buttons = notification.getButtons()
      expect(buttons).toHaveLength(1)
      expect(buttons[0]).toEqual(button)
    })

    test('should add multiple buttons', () => {
      const notification = new Notification('Test')
        .addButton({ text: 'Button 1', url: 'https://example.com/1' })
        .addButton({ text: 'Button 2', callbackData: 'action_2' })

      const buttons = notification.getButtons()
      expect(buttons).toHaveLength(2)
    })

    test('should set buttons', () => {
      const buttons: NotificationButton[] = [
        { text: 'Button 1', url: 'https://example.com/1' },
        { text: 'Button 2', callbackData: 'action_2' },
      ]
      const notification = new Notification('Test')
        .setButtons(buttons)

      expect(notification.getButtons()).toEqual(buttons)
    })

    test('should replace buttons when using setButtons', () => {
      const notification = new Notification('Test')
        .addButton({ text: 'Old', url: 'old' })
        .setButtons([{ text: 'New', url: 'new' }])

      const buttons = notification.getButtons()
      expect(buttons).toHaveLength(1)
      expect(buttons[0].text).toBe('New')
    })
  })

  describe('Target', () => {
    test('should set target', () => {
      const notification = new Notification('Test')
        .setTarget({ audience: 'all_users' })

      const target = notification.getTarget()
      expect(target).toBeDefined()
      expect(target?.audience).toBe('all_users')
    })

    test('should set target with role', () => {
      const notification = new Notification('Test')
        .setTarget({ audience: 'role', role: 'ADMIN' })

      const target = notification.getTarget()
      expect(target?.audience).toBe('role')
      expect(target?.role).toBe('ADMIN')
    })

    test('should set target with user IDs', () => {
      const notification = new Notification('Test')
        .setTarget({ audience: 'specific_users', userIds: [1, 2, 3] })

      const target = notification.getTarget()
      expect(target?.audience).toBe('specific_users')
      expect(target?.userIds).toEqual([1, 2, 3])
    })

    test('should return undefined when no target set', () => {
      const notification = new Notification('Test')
      expect(notification.getTarget()).toBeUndefined()
    })
  })

  describe('Schedule', () => {
    test('should set schedule with date', () => {
      const scheduledAt = new Date('2025-12-31')
      const notification = new Notification('Test')
        .setSchedule({ scheduledAt })

      const schedule = notification.getSchedule()
      expect(schedule).toBeDefined()
      expect(schedule?.scheduledAt).toEqual(scheduledAt)
      expect(notification.getStatus()).toBe('scheduled')
    })

    test('should set schedule with recurring config', () => {
      const notification = new Notification('Test')
        .setSchedule({
          recurring: {
            frequency: 'daily',
            time: '09:00',
          },
        })

      const schedule = notification.getSchedule()
      expect(schedule?.recurring).toBeDefined()
      expect(schedule?.recurring?.frequency).toBe('daily')
      expect(notification.getStatus()).toBe('scheduled')
    })

    test('should return undefined when no schedule set', () => {
      const notification = new Notification('Test')
      expect(notification.getSchedule()).toBeUndefined()
    })
  })

  describe('Status', () => {
    test('should set status', () => {
      const notification = new Notification('Test')
        .setStatus('sent')

      expect(notification.getStatus()).toBe('sent')
    })

    test('should set sentAt when status is sent', () => {
      const notification = new Notification('Test')
        .setStatus('sent')

      expect(notification.getSentAt()).toBeInstanceOf(Date)
    })

    test('should check if pending', () => {
      const notification = new Notification('Test')
      expect(notification.isPending()).toBe(true)
    })

    test('should check if sent', () => {
      const notification = new Notification('Test')
        .setStatus('sent')

      expect(notification.isSent()).toBe(true)
      expect(notification.isPending()).toBe(false)
    })

    test('should check if failed', () => {
      const notification = new Notification('Test')
        .setStatus('failed')

      expect(notification.isFailed()).toBe(true)
    })

    test('should check if cancelled', () => {
      const notification = new Notification('Test')
        .setStatus('cancelled')

      expect(notification.isCancelled()).toBe(true)
    })

    test('should check if scheduled', () => {
      const notification = new Notification('Test')
        .setSchedule({ scheduledAt: new Date() })

      expect(notification.isScheduled()).toBe(true)
    })
  })

  describe('Metadata', () => {
    test('should add metadata', () => {
      const notification = new Notification('Test')
        .addMetadata('key1', 'value1')
        .addMetadata('key2', 42)

      expect(notification.getMetadata('key1')).toBe('value1')
      expect(notification.getMetadata('key2')).toBe(42)
    })

    test('should get all metadata', () => {
      const notification = new Notification('Test')
        .addMetadata('key1', 'value1')
        .addMetadata('key2', 42)

      const metadata = notification.getAllMetadata()
      expect(metadata).toEqual({ key1: 'value1', key2: 42 })
    })

    test('should return undefined for non-existent metadata', () => {
      const notification = new Notification('Test')
      expect(notification.getMetadata('nonexistent')).toBeUndefined()
    })
  })

  describe('Clone', () => {
    test('should clone notification', () => {
      const original = new Notification('Test')
        .setPriority('urgent')
        .setType('alert')
        .setTarget({ audience: 'all_users' })
        .addMetadata('key', 'value')

      const clone = original.clone()

      expect(clone.getMessage()).toBe(original.getMessage())
      expect(clone.getPriority()).toBe(original.getPriority())
      expect(clone.getType()).toBe(original.getType())
      expect(clone.getTarget()).toEqual(original.getTarget())
      expect(clone.getMetadata('key')).toBe('value')
    })

    test('should create independent clone', () => {
      const original = new Notification('Test')
      const clone = original.clone()

      clone.setMessage('Modified')

      expect(original.getMessage()).toBe('Test')
      expect(clone.getMessage()).toBe('Modified')
    })
  })

  describe('JSON Serialization', () => {
    test('should convert to JSON', () => {
      const notification = new Notification('Test', {
        priority: 'urgent',
        type: 'alert',
      })
        .setTarget({ audience: 'all_users' })
        .addMetadata('key', 'value')

      const json = notification.toJSON()

      expect(json).toHaveProperty('config')
      expect(json).toHaveProperty('target')
      expect(json).toHaveProperty('status')
      expect(json).toHaveProperty('metadata')
      expect(json).toHaveProperty('createdAt')
      expect(json.config.message).toBe('Test')
      expect(json.metadata).toEqual({ key: 'value' })
    })
  })
})
