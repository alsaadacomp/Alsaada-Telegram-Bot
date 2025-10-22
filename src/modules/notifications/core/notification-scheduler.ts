/**
 * Notification System - Scheduler
 *
 * Handles scheduled and recurring notifications.
 */

import type {
  RecurrenceFrequency,
  RecurringConfig,
  ScheduleConfig,
} from '../types.js'

export class NotificationScheduler {
  /**
   * Check if notification should be sent now
   */
  static shouldSendNow(schedule: ScheduleConfig): boolean {
    if (!schedule.scheduledAt && !schedule.recurring) {
      return true
    }

    const now = new Date()

    // Check scheduled date
    if (schedule.scheduledAt) {
      return now >= schedule.scheduledAt
    }

    // Check recurring schedule
    if (schedule.recurring) {
      return this.shouldSendRecurring(schedule.recurring, now)
    }

    return false
  }

  /**
   * Check if recurring notification should be sent
   */
  private static shouldSendRecurring(config: RecurringConfig, now: Date): boolean {
    // Check if recurring has ended
    if (config.endDate && now > config.endDate) {
      return false
    }

    switch (config.frequency) {
      case 'daily':
        return this.shouldSendDaily(config, now)
      case 'weekly':
        return this.shouldSendWeekly(config, now)
      case 'monthly':
        return this.shouldSendMonthly(config, now)
      case 'custom':
        return this.shouldSendCustom(config, now)
      default:
        return false
    }
  }

  /**
   * Check if daily notification should be sent
   */
  private static shouldSendDaily(config: RecurringConfig, now: Date): boolean {
    if (!config.time)
      return false

    const [hours, minutes] = config.time.split(':').map(Number)
    const scheduledTime = new Date(now)
    scheduledTime.setHours(hours, minutes, 0, 0)

    // Check if current time matches scheduled time (within 1 minute tolerance)
    const diff = Math.abs(now.getTime() - scheduledTime.getTime())
    return diff < 60000 // 1 minute in milliseconds
  }

  /**
   * Check if weekly notification should be sent
   */
  private static shouldSendWeekly(config: RecurringConfig, now: Date): boolean {
    if (!config.daysOfWeek || !config.time)
      return false

    const currentDay = now.getDay()
    if (!config.daysOfWeek.includes(currentDay)) {
      return false
    }

    return this.shouldSendDaily(config, now)
  }

  /**
   * Check if monthly notification should be sent
   */
  private static shouldSendMonthly(config: RecurringConfig, now: Date): boolean {
    if (!config.dayOfMonth || !config.time)
      return false

    const currentDay = now.getDate()
    if (currentDay !== config.dayOfMonth) {
      return false
    }

    return this.shouldSendDaily(config, now)
  }

  /**
   * Check if custom notification should be sent
   */
  private static shouldSendCustom(config: RecurringConfig, now: Date): boolean {
    // Custom interval logic (e.g., every N days)
    if (!config.interval)
      return false

    // This would need to track last sent time
    // For now, return false - to be implemented with persistence
    return false
  }

  /**
   * Get next scheduled time
   */
  static getNextScheduledTime(schedule: ScheduleConfig): Date | null {
    if (schedule.scheduledAt) {
      return schedule.scheduledAt
    }

    if (schedule.recurring) {
      return this.getNextRecurringTime(schedule.recurring)
    }

    return null
  }

  /**
   * Get next recurring time
   */
  private static getNextRecurringTime(config: RecurringConfig): Date {
    const now = new Date()

    switch (config.frequency) {
      case 'daily':
        return this.getNextDailyTime(config, now)
      case 'weekly':
        return this.getNextWeeklyTime(config, now)
      case 'monthly':
        return this.getNextMonthlyTime(config, now)
      default:
        return now
    }
  }

  /**
   * Get next daily time
   */
  private static getNextDailyTime(config: RecurringConfig, now: Date): Date {
    if (!config.time)
      return now

    const [hours, minutes] = config.time.split(':').map(Number)
    const next = new Date(now)
    next.setHours(hours, minutes, 0, 0)

    // If time has passed today, schedule for tomorrow
    if (next <= now) {
      next.setDate(next.getDate() + 1)
    }

    return next
  }

  /**
   * Get next weekly time
   */
  private static getNextWeeklyTime(config: RecurringConfig, now: Date): Date {
    if (!config.daysOfWeek || !config.time)
      return now

    const [hours, minutes] = config.time.split(':').map(Number)
    const currentDay = now.getDay()

    // Find next scheduled day
    const sortedDays = [...config.daysOfWeek].sort((a, b) => a - b)
    let nextDay = sortedDays.find(day => day > currentDay)

    // If no day found this week, use first day of next week
    if (!nextDay) {
      nextDay = sortedDays[0]
    }

    const next = new Date(now)
    const daysToAdd = nextDay > currentDay
      ? nextDay - currentDay
      : 7 - currentDay + nextDay

    next.setDate(next.getDate() + daysToAdd)
    next.setHours(hours, minutes, 0, 0)

    return next
  }

  /**
   * Get next monthly time
   */
  private static getNextMonthlyTime(config: RecurringConfig, now: Date): Date {
    if (!config.dayOfMonth || !config.time)
      return now

    const [hours, minutes] = config.time.split(':').map(Number)
    const next = new Date(now)
    next.setDate(config.dayOfMonth)
    next.setHours(hours, minutes, 0, 0)

    // If date has passed this month, schedule for next month
    if (next <= now) {
      next.setMonth(next.getMonth() + 1)
    }

    return next
  }

  /**
   * Check if schedule is in quiet hours
   */
  static isInQuietHours(
    quietStart: string,
    quietEnd: string,
    now: Date = new Date(),
  ): boolean {
    const [startHours, startMinutes] = quietStart.split(':').map(Number)
    const [endHours, endMinutes] = quietEnd.split(':').map(Number)

    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes

    if (startTotalMinutes <= endTotalMinutes) {
      // Normal case: e.g., 09:00 to 17:00
      return currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes
    }
    else {
      // Overnight case: e.g., 22:00 to 08:00
      return currentMinutes >= startTotalMinutes || currentMinutes <= endTotalMinutes
    }
  }

  /**
   * Calculate delay until next send time
   */
  static getDelayUntilNextSend(schedule: ScheduleConfig): number {
    const nextTime = this.getNextScheduledTime(schedule)
    if (!nextTime)
      return 0

    const now = new Date()
    const delay = nextTime.getTime() - now.getTime()

    return Math.max(0, delay)
  }

  /**
   * Format schedule as human-readable string
   */
  static formatSchedule(schedule: ScheduleConfig): string {
    if (schedule.scheduledAt) {
      return `Scheduled for ${schedule.scheduledAt.toLocaleString()}`
    }

    if (schedule.recurring) {
      return this.formatRecurring(schedule.recurring)
    }

    return 'Send immediately'
  }

  /**
   * Format recurring schedule
   */
  private static formatRecurring(config: RecurringConfig): string {
    const parts: string[] = []

    switch (config.frequency) {
      case 'daily':
        parts.push('Daily')
        if (config.time)
          parts.push(`at ${config.time}`)
        break
      case 'weekly':
        parts.push('Weekly')
        if (config.daysOfWeek) {
          const days = config.daysOfWeek.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d])
          parts.push(`on ${days.join(', ')}`)
        }
        if (config.time)
          parts.push(`at ${config.time}`)
        break
      case 'monthly':
        parts.push('Monthly')
        if (config.dayOfMonth)
          parts.push(`on day ${config.dayOfMonth}`)
        if (config.time)
          parts.push(`at ${config.time}`)
        break
      case 'custom':
        if (config.interval)
          parts.push(`Every ${config.interval} days`)
        break
    }

    if (config.endDate) {
      parts.push(`until ${config.endDate.toLocaleDateString()}`)
    }

    return parts.join(' ')
  }
}
