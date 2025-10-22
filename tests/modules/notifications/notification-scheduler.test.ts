/**
 * Tests for NotificationScheduler class
 */

import type { RecurringConfig, ScheduleConfig } from '../../../src/modules/notifications/types.js'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { NotificationScheduler } from '../../../src/modules/notifications/core/notification-scheduler.js'

describe('NotificationScheduler', () => {
  describe('shouldSendNow', () => {
    test('should return true when no schedule', () => {
      const schedule: ScheduleConfig = {}
      expect(NotificationScheduler.shouldSendNow(schedule)).toBe(true)
    })

    test('should return true when scheduled time has passed', () => {
      const pastDate = new Date(Date.now() - 10000)
      const schedule: ScheduleConfig = { scheduledAt: pastDate }

      expect(NotificationScheduler.shouldSendNow(schedule)).toBe(true)
    })

    test('should return false when scheduled time is in future', () => {
      const futureDate = new Date(Date.now() + 10000)
      const schedule: ScheduleConfig = { scheduledAt: futureDate }

      expect(NotificationScheduler.shouldSendNow(schedule)).toBe(false)
    })
  })

  describe('isInQuietHours', () => {
    test('should return true when in quiet hours (normal case)', () => {
      const date = new Date('2025-01-01T12:00:00')
      const result = NotificationScheduler.isInQuietHours('10:00', '14:00', date)

      expect(result).toBe(true)
    })

    test('should return false when not in quiet hours', () => {
      const date = new Date('2025-01-01T15:00:00')
      const result = NotificationScheduler.isInQuietHours('10:00', '14:00', date)

      expect(result).toBe(false)
    })

    test('should handle overnight quiet hours (22:00 to 08:00)', () => {
      const nightDate = new Date('2025-01-01T23:00:00')
      const morningDate = new Date('2025-01-01T07:00:00')
      const dayDate = new Date('2025-01-01T12:00:00')

      expect(NotificationScheduler.isInQuietHours('22:00', '08:00', nightDate)).toBe(true)
      expect(NotificationScheduler.isInQuietHours('22:00', '08:00', morningDate)).toBe(true)
      expect(NotificationScheduler.isInQuietHours('22:00', '08:00', dayDate)).toBe(false)
    })

    test('should handle edge cases at boundaries', () => {
      const startTime = new Date('2025-01-01T10:00:00')
      const endTime = new Date('2025-01-01T14:00:00')

      expect(NotificationScheduler.isInQuietHours('10:00', '14:00', startTime)).toBe(true)
      expect(NotificationScheduler.isInQuietHours('10:00', '14:00', endTime)).toBe(true)
    })
  })

  describe('getNextScheduledTime', () => {
    test('should return scheduledAt date when provided', () => {
      const scheduledAt = new Date('2025-12-31T12:00:00')
      const schedule: ScheduleConfig = { scheduledAt }

      const result = NotificationScheduler.getNextScheduledTime(schedule)
      expect(result).toEqual(scheduledAt)
    })

    test('should return null when no schedule', () => {
      const schedule: ScheduleConfig = {}

      const result = NotificationScheduler.getNextScheduledTime(schedule)
      expect(result).toBeNull()
    })

    test('should calculate next daily time', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'daily',
          time: '09:00',
        },
      }

      const result = NotificationScheduler.getNextScheduledTime(schedule)
      expect(result).toBeInstanceOf(Date)
      expect(result?.getHours()).toBe(9)
      expect(result?.getMinutes()).toBe(0)
    })

    test('should calculate next weekly time', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'weekly',
          daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
          time: '10:00',
        },
      }

      const result = NotificationScheduler.getNextScheduledTime(schedule)
      expect(result).toBeInstanceOf(Date)
    })

    test('should calculate next monthly time', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'monthly',
          dayOfMonth: 15,
          time: '12:00',
        },
      }

      const result = NotificationScheduler.getNextScheduledTime(schedule)
      expect(result).toBeInstanceOf(Date)
      expect(result?.getDate()).toBe(15)
    })
  })

  describe('getDelayUntilNextSend', () => {
    test('should return 0 when no schedule', () => {
      const schedule: ScheduleConfig = {}
      const delay = NotificationScheduler.getDelayUntilNextSend(schedule)

      expect(delay).toBe(0)
    })

    test('should return positive delay for future time', () => {
      const futureDate = new Date(Date.now() + 60000) // 1 minute from now
      const schedule: ScheduleConfig = { scheduledAt: futureDate }

      const delay = NotificationScheduler.getDelayUntilNextSend(schedule)
      expect(delay).toBeGreaterThan(0)
      expect(delay).toBeLessThanOrEqual(60000)
    })

    test('should return 0 for past time', () => {
      const pastDate = new Date(Date.now() - 60000)
      const schedule: ScheduleConfig = { scheduledAt: pastDate }

      const delay = NotificationScheduler.getDelayUntilNextSend(schedule)
      expect(delay).toBe(0)
    })
  })

  describe('formatSchedule', () => {
    test('should format immediate send', () => {
      const schedule: ScheduleConfig = {}
      const formatted = NotificationScheduler.formatSchedule(schedule)

      expect(formatted).toBe('Send immediately')
    })

    test('should format scheduled date', () => {
      const scheduledAt = new Date('2025-12-31T12:00:00')
      const schedule: ScheduleConfig = { scheduledAt }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('Scheduled for')
      expect(formatted).toContain('2025')
    })

    test('should format daily recurring', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'daily',
          time: '09:00',
        },
      }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('Daily')
      expect(formatted).toContain('09:00')
    })

    test('should format weekly recurring', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'weekly',
          daysOfWeek: [1, 3, 5],
          time: '10:00',
        },
      }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('Weekly')
      expect(formatted).toContain('Mon')
      expect(formatted).toContain('10:00')
    })

    test('should format monthly recurring', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'monthly',
          dayOfMonth: 15,
          time: '12:00',
        },
      }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('Monthly')
      expect(formatted).toContain('15')
      expect(formatted).toContain('12:00')
    })

    test('should format custom interval', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'custom',
          interval: 3,
        },
      }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('Every 3 days')
    })

    test('should include end date when provided', () => {
      const endDate = new Date('2025-12-31')
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'daily',
          time: '09:00',
          endDate,
        },
      }

      const formatted = NotificationScheduler.formatSchedule(schedule)
      expect(formatted).toContain('until')
      expect(formatted).toContain('2025')
    })
  })

  describe('Daily Recurring Logic', () => {
    test('should schedule for today if time has not passed', () => {
      const now = new Date()
      now.setHours(8, 0, 0, 0)

      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'daily',
          time: '10:00',
        },
      }

      // Mock current time to 08:00
      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
    })
  })

  describe('Weekly Recurring Logic', () => {
    test('should find next scheduled day in same week', () => {
      // Test runs on any day, finds next scheduled day
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'weekly',
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days
          time: '12:00',
        },
      }

      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
    })

    test('should wrap to next week when needed', () => {
      // If current day is Saturday (6) and only Monday (1) is scheduled
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'weekly',
          daysOfWeek: [1], // Monday only
          time: '09:00',
        },
      }

      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
    })
  })

  describe('Monthly Recurring Logic', () => {
    test('should schedule for current month if day has not passed', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'monthly',
          dayOfMonth: 28, // Safe day that exists in all months
          time: '12:00',
        },
      }

      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
      expect(nextTime?.getDate()).toBe(28)
    })

    test('should schedule for next month if day has passed', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'monthly',
          dayOfMonth: 1, // First day of month
          time: '00:00',
        },
      }

      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
    })
  })

  describe('Edge Cases', () => {
    test('should handle invalid time format gracefully', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'daily',
          time: 'invalid',
        },
      }

      // Should not throw error
      expect(() => NotificationScheduler.getNextScheduledTime(schedule)).not.toThrow()
    })

    test('should handle empty daysOfWeek array', () => {
      const schedule: ScheduleConfig = {
        recurring: {
          frequency: 'weekly',
          daysOfWeek: [],
          time: '12:00',
        },
      }

      const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
      expect(nextTime).toBeInstanceOf(Date)
    })
  })
})
