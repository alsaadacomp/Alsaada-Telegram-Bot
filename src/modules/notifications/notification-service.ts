/**
 * Notification System - Main Service
 *
 * Central service for managing all notification operations.
 */

import type { Context } from 'grammy'
import type { NotificationTemplateBuilder } from './core/notification-template.js'
import type {
  BatchSendConfig,
  EventListenerConfig,
  NotificationConfig,
  NotificationEvent,
  NotificationRecord,
  NotificationStatistics,
  NotificationTarget,
  ScheduleConfig,
  SendResult,
  TargetAudience,
  TemplateVariable,
  UserNotificationPreferences,
  UserRole,
} from './types.js'
import { Database } from '../database/index.js'
import { logger } from '../services/logger/index.js'
import { settingsManager } from '../settings/index.js'
import { NotificationScheduler } from './core/notification-scheduler.js'
import { Notification } from './core/notification.js'
import { NotificationDatabaseService } from './notification-database-service.js'

type EventListener = (data: any) => Promise<void> | void

export class NotificationService {
  private templates: Map<string, NotificationTemplateBuilder> = new Map()
  private eventListeners: Map<NotificationEvent, EventListener[]> = new Map()
  private userPreferences: Map<number, UserNotificationPreferences> = new Map()
  private history: NotificationRecord[] = []
  private scheduledNotifications: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Send notification to all users
   */
  async sendToAllUsers(
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'all_users' })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification with smart variable filling per user
   */
  async sendNotificationWithSmartVariables(
    notificationData: any,
    staticVariables: Record<string, string>,
  ): Promise<SendResult> {
    try {
      // Import smart variable service dynamically
      const { smartVariableService } = await import('./smart-variable-service.js')

      // Get recipient IDs based on target audience
      const target = {
        audience: notificationData.targetAudience,
        role: notificationData.targetRole,
        userIds: notificationData.targetUserIds,
      }

      const recipientIds = await this.getRecipientIds(target)

      if (recipientIds.length === 0) {
        return {
          success: true,
          sentCount: 0,
          failedCount: 0,
          failedUserIds: [],
          errors: [],
        }
      }

      let sentCount = 0
      let failedCount = 0
      const failedUserIds: number[] = []
      const errors: Error[] = []

      // Send to each user with personalized variables
      for (const userId of recipientIds) {
        try {
          // Get user-specific variables
          const userVariables = await smartVariableService.getUserVariableValues(userId)

          // Combine static and user variables
          const allVariables = { ...staticVariables, ...userVariables }

          // Fill template message for this user
          let personalizedMessage = notificationData.message
          for (const [key, value] of Object.entries(allVariables)) {
            const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
            personalizedMessage = personalizedMessage.replace(regex, value)
          }

          // Create notification for this user
          const userNotification = new Notification(personalizedMessage, {
            type: notificationData.type,
            priority: notificationData.priority,
          })
          userNotification.setTarget({ audience: 'specific_users', userIds: [userId] })

          // Send to this specific user
          const result = await this.send(userNotification)

          if (result.success) {
            sentCount += result.sentCount
            failedCount += result.failedCount
            failedUserIds.push(...result.failedUserIds)
            errors.push(...result.errors)
          }
          else {
            failedCount++
            failedUserIds.push(userId)
            errors.push(new Error(`Failed to send to user ${userId}`))
          }
        }
        catch (error) {
          failedCount++
          failedUserIds.push(userId)
          errors.push(error as Error)
          logger.error({ error, userId }, 'Failed to send personalized notification')
        }
      }

      return {
        success: failedCount === 0,
        sentCount,
        failedCount,
        failedUserIds,
        errors,
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to send notification with smart variables')
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        failedUserIds: [],
        errors: [error as Error],
      }
    }
  }

  /**
   * Send notification to all admins
   */
  async sendToAdmins(
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'all_admins' })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification to super admin
   */
  async sendToSuperAdmin(
    config: NotificationConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'super_admin' })

    return this.send(notification)
  }

  /**
   * Send notification to specific role
   */
  async sendToRole(
    role: UserRole,
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'role', role })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification to specific users
   */
  async sendToUsers(
    userIds: number[],
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'specific_users', userIds })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification to active users
   */
  async sendToActiveUsers(
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'active_users' })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification to inactive users
   */
  async sendToInactiveUsers(
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'inactive_users' })

    return this.send(notification, batchConfig)
  }

  /**
   * Send notification to new users
   */
  async sendToNewUsers(
    config: NotificationConfig,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const notification = new Notification(config.message, config)
    notification.setTarget({ audience: 'new_users' })

    return this.send(notification, batchConfig)
  }

  /**
   * Schedule a notification
   */
  async schedule(
    config: NotificationConfig,
    target: NotificationTarget,
    schedule: ScheduleConfig,
  ): Promise<string> {
    const notification = new Notification(config.message, config)
    notification.setTarget(target)
    notification.setSchedule(schedule)

    const notificationId = this.generateId()
    notification.addMetadata('id', notificationId)

    // Schedule the notification
    if (schedule.scheduledAt) {
      const delay = schedule.scheduledAt.getTime() - Date.now()
      if (delay > 0) {
        const timeout = setTimeout(() => {
          this.send(notification).catch(console.error)
          this.scheduledNotifications.delete(notificationId)
        }, delay)

        this.scheduledNotifications.set(notificationId, timeout)
      }
    }

    // Store in history
    this.addToHistory(notification, [], 0, 0)

    return notificationId
  }

  /**
   * Schedule recurring notification
   */
  async scheduleRecurring(
    config: NotificationConfig,
    target: NotificationTarget,
    schedule: ScheduleConfig,
  ): Promise<string> {
    if (!schedule.recurring) {
      throw new Error('Recurring configuration is required')
    }

    const notification = new Notification(config.message, config)
    notification.setTarget(target)
    notification.setSchedule(schedule)

    const notificationId = this.generateId()
    notification.addMetadata('id', notificationId)

    // Set up recurring check (every minute)
    const checkInterval = setInterval(() => {
      if (NotificationScheduler.shouldSendNow(schedule)) {
        this.send(notification.clone()).catch(console.error)
      }
    }, 60000) // Check every minute

    this.scheduledNotifications.set(notificationId, checkInterval as any)

    // Store in history
    this.addToHistory(notification, [], 0, 0)

    return notificationId
  }

  /**
   * Cancel scheduled notification
   */
  cancelScheduled(notificationId: string): boolean {
    const timeout = this.scheduledNotifications.get(notificationId)
    if (timeout) {
      clearTimeout(timeout)
      this.scheduledNotifications.delete(notificationId)
      return true
    }
    return false
  }

  /**
   * Send from template
   */
  async sendFromTemplate(
    templateId: string,
    target: NotificationTarget,
    variables?: TemplateVariable,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    if (variables) {
      const validation = template.validateVariables(variables)
      if (!validation.valid) {
        throw new Error(`Missing template variables: ${validation.missing.join(', ')}`)
      }
    }

    const notification = template.createNotification(variables)
    notification.setTarget(target)

    return this.send(notification, batchConfig)
  }

  /**
   * Register notification template
   */
  registerTemplate(template: NotificationTemplateBuilder): void {
    this.templates.set(template.getId(), template)
  }

  /**
   * Get template
   */
  getTemplate(templateId: string): NotificationTemplateBuilder | undefined {
    return this.templates.get(templateId)
  }

  /**
   * Register event listener
   */
  on(event: NotificationEvent, listener: EventListener): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(listener)
  }

  /**
   * Trigger event
   */
  async triggerEvent(event: NotificationEvent, data: any): Promise<void> {
    const listeners = this.eventListeners.get(event) || []

    for (const listener of listeners) {
      try {
        await listener(data)
      }
      catch (error) {
        console.error(`Error in event listener for ${event}:`, error)
      }
    }
  }

  /**
   * Set user preferences
   */
  setUserPreferences(userId: number, preferences: UserNotificationPreferences): void {
    this.userPreferences.set(userId, preferences)
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId: number): UserNotificationPreferences | undefined {
    return this.userPreferences.get(userId)
  }

  /**
   * Check if user can receive notification
   */
  private canUserReceiveNotification(
    userId: number,
    notification: Notification,
  ): boolean {
    const preferences = this.userPreferences.get(userId)

    // If no preferences set, user can receive all notifications
    if (!preferences) {
      return true
    }

    // Check if notifications are enabled
    if (!preferences.enabled) {
      return false
    }

    // Check notification type filter
    if (preferences.types && preferences.types.length > 0) {
      if (!preferences.types.includes(notification.getType())) {
        return false
      }
    }

    // Check priority filter
    if (preferences.priorities && preferences.priorities.length > 0) {
      if (!preferences.priorities.includes(notification.getPriority())) {
        return false
      }
    }

    // Check quiet hours
    if (preferences.quietHours && preferences.quietHours.enabled) {
      if (NotificationScheduler.isInQuietHours(
        preferences.quietHours.start,
        preferences.quietHours.end,
      )) {
        return false
      }
    }

    return true
  }

  /**
   * Main send method (to be implemented with actual sending logic)
   */
  private async send(
    notification: Notification,
    batchConfig?: BatchSendConfig,
  ): Promise<SendResult> {
    // Check if notifications are globally enabled
    const notificationsEnabled = await settingsManager.get('notifications.enabled') as boolean
    if (!notificationsEnabled) {
      logger.info('Notifications are disabled globally. Skipping send.')
      return {
        success: false,
        sentCount: 0,
        failedCount: 0,
        failedUserIds: [],
        errors: [new Error('Notifications are disabled')],
      }
    }

    const target = notification.getTarget()
    if (!target) {
      throw new Error('Notification target is required')
    }

    // Apply default priority from settings if not set
    if (!notification.getPriority()) {
      const defaultPriority = await settingsManager.get('notifications.default_priority') as string
      notification.setPriority(defaultPriority as any)
    }

    // Get recipient user IDs based on target
    const recipientIds = await this.getRecipientIds(target)

    // Filter by user preferences
    const filteredIds = recipientIds.filter(id =>
      this.canUserReceiveNotification(id, notification),
    )

    if (filteredIds.length === 0) {
      const result: SendResult = {
        success: true,
        sentCount: 0,
        failedCount: 0,
        failedUserIds: [],
        errors: [],
      }
      this.addToHistory(notification, [], 0, 0)
      return result
    }

    // Send notifications (mock implementation)
    const result = await this.sendBatch(
      notification,
      filteredIds,
      batchConfig,
    )

    // Store in history
    this.addToHistory(notification, filteredIds, result.sentCount, result.failedCount)

    // Log notification stats
    logger.info({
      type: notification.getType(),
      priority: notification.getPriority(),
      target: target.audience,
      recipients: filteredIds.length,
      sentCount: result.sentCount,
      failedCount: result.failedCount,
    }, 'Notification sent')

    return result
  }

  /**
   * Send notifications in batches
   */
  private async sendBatch(
    notification: Notification,
    userIds: number[],
    config?: BatchSendConfig,
  ): Promise<SendResult> {
    const batchSize = config?.batchSize ?? 50
    const delayBetweenBatches = config?.delayBetweenBatches ?? 1000
    const continueOnError = config?.continueOnError ?? true

    let sentCount = 0
    let failedCount = 0
    const failedUserIds: number[] = []
    const errors: Error[] = []

    // Process in batches
    for (let i = 0; i < userIds.length; i += batchSize) {
      const batch = userIds.slice(i, i + batchSize)

      for (const userId of batch) {
        try {
          // Mock send - in real implementation, this would send via Telegram/etc
          await this.sendToUser(userId, notification)
          sentCount++
        }
        catch (error) {
          failedCount++
          failedUserIds.push(userId)
          errors.push(error as Error)

          if (!continueOnError) {
            break
          }
        }
      }

      // Delay between batches
      if (i + batchSize < userIds.length) {
        await this.delay(delayBetweenBatches)
      }
    }

    notification.setStatus(failedCount === 0 ? 'sent' : 'failed')

    return {
      success: failedCount === 0,
      sentCount,
      failedCount,
      failedUserIds,
      errors,
    }
  }

  /**
   * Send to individual user
   */
  private async sendToUser(userId: number, notification: Notification): Promise<void> {
    // Import Database dynamically to avoid circular dependency
    const { Database } = await import('../database/index.js')
    const { Api } = await import('grammy')

    // Get user's telegramId from database
    const user = await Database.prisma.user.findUnique({
      where: { id: userId },
      select: { telegramId: true, isActive: true, isBanned: true },
    })

    if (!user || !user.isActive || user.isBanned) {
      throw new Error(`User ${userId} not found or inactive`)
    }

    // Create a standalone API instance
    const api = new Api(process.env.BOT_TOKEN!)

    // Format message with type emoji
    const typeEmojis: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      announcement: '📢',
      reminder: '🔔',
      alert: '🚨',
    }

    const priorityEmojis: Record<string, string> = {
      normal: '🔵',
      important: '🟡',
      urgent: '🟠',
      critical: '🔴',
    }

    const typeEmoji = typeEmojis[notification.getType() || 'info'] || 'ℹ️'
    const priorityEmoji = priorityEmojis[notification.getPriority() || 'normal'] || '🔵'

    const formattedMessage = `${typeEmoji} ${priorityEmoji}\n\n${notification.getMessage()}`

    console.log(`Sending notification to user ${Number(user.telegramId)}:`, notification.getMessage())

    // Send via Telegram
    await api.sendMessage(
      Number(user.telegramId),
      formattedMessage,
      { parse_mode: 'Markdown' },
    )
  }

  /**
   * Get recipient IDs based on target
   */
  private async getRecipientIds(target: NotificationTarget): Promise<number[]> {
    // Import Database dynamically to avoid circular dependency
    const { Database } = await import('../database/index.js')

    switch (target.audience) {
      case 'all_users': {
        const users = await Database.prisma.user.findMany({
          where: { isActive: true, isBanned: false },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'all_admins': {
        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            role: { in: ['ADMIN', 'SUPER_ADMIN'] },
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'super_admin': {
        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            role: 'SUPER_ADMIN',
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'role': {
        if (!target.role)
          return []
        // Map UserRole to Prisma Role enum
        const roleMap: Record<string, any> = {
          USER: 'USER',
          ADMIN: 'ADMIN',
          SUPER_ADMIN: 'SUPER_ADMIN',
          GUEST: 'GUEST',
          MODERATOR: 'ADMIN', // Map MODERATOR to ADMIN
        }
        const prismaRole = roleMap[target.role] || target.role

        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            role: prismaRole,
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'specific_users':
        return target.userIds || []

      case 'active_users': {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            lastActiveAt: { gte: sevenDaysAgo },
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'inactive_users': {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            OR: [
              { lastActiveAt: { lt: sevenDaysAgo } },
              { lastActiveAt: null },
            ],
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      case 'new_users': {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const users = await Database.prisma.user.findMany({
          where: {
            isActive: true,
            isBanned: false,
            createdAt: { gte: thirtyDaysAgo },
          },
          select: { id: true },
        })
        return users.map(u => u.id)
      }

      default:
        return []
    }
  }

  /**
   * Add notification to history (database)
   */
  private async addToHistory(
    notification: Notification,
    recipients: number[],
    successCount: number,
    failureCount: number,
  ): Promise<void> {
    const record: Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      message: notification.getMessage(),
      type: notification.getType(),
      priority: notification.getPriority(),
      target: notification.getTarget()!,
      status: notification.getStatus(),
      sentAt: notification.getSentAt(),
      scheduledAt: notification.getSchedule()?.scheduledAt,
      recipients,
      successCount,
      failureCount,
      metadata: notification.getAllMetadata(),
    }

    try {
      await NotificationDatabaseService.saveNotification(record)
    }
    catch (error) {
      logger.error({ error }, 'Failed to save notification to history')
      // Fallback to in-memory storage
      this.history.push({
        id: this.generateId(),
        ...record,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
  }

  /**
   * Get notification history (from database)
   */
  async getHistory(limit?: number): Promise<NotificationRecord[]> {
    try {
      return await NotificationDatabaseService.getRecentNotifications(limit || 10)
    }
    catch (error) {
      logger.error({ error }, 'Failed to get notification history from database')
      // Fallback to in-memory storage
      const sorted = [...this.history].sort((a, b) =>
        b.createdAt.getTime() - a.createdAt.getTime(),
      )
      return limit ? sorted.slice(0, limit) : sorted
    }
  }

  /**
   * Get statistics (from database)
   */
  async getStatistics(): Promise<NotificationStatistics> {
    return NotificationDatabaseService.getStatistics()
  }

  /**
   * Clear history (from database)
   */
  async clearHistory(): Promise<void> {
    try {
      await NotificationDatabaseService.clearAllNotifications()
      // Also clear in-memory
      this.history = []
    }
    catch (error) {
      logger.error({ error }, 'Failed to clear notification history from database')
      // Fallback to in-memory only
      this.history = []
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    // Clear all scheduled notifications
    for (const [id, timeout] of this.scheduledNotifications) {
      clearTimeout(timeout)
    }
    this.scheduledNotifications.clear()
  }
}
