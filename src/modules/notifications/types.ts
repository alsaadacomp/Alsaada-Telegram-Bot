/**
 * Notification System - Type Definitions
 *
 * This module provides types for a comprehensive notification system
 * with support for role-based, scheduled, recurring, and event-based notifications.
 */

/**
 * User role types
 */
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR'

/**
 * Notification priority levels
 */
export type NotificationPriority = 'normal' | 'important' | 'urgent' | 'critical'

/**
 * Notification status
 */
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'cancelled' | 'scheduled'

/**
 * Notification type
 */
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'announcement'
  | 'reminder'
  | 'alert'

/**
 * Recurrence frequency
 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'

/**
 * Target audience type
 */
export type TargetAudience =
  | 'all_users'
  | 'all_admins'
  | 'super_admin'
  | 'role'
  | 'specific_users'
  | 'active_users'
  | 'inactive_users'
  | 'new_users'

/**
 * Notification configuration
 */
export interface NotificationConfig {
  message: string
  priority?: NotificationPriority
  type?: NotificationType
  data?: Record<string, any>
  buttons?: NotificationButton[]
  image?: string
  parseMode?: 'Markdown' | 'HTML'
}

/**
 * Notification button
 */
export interface NotificationButton {
  text: string
  url?: string
  callbackData?: string
}

/**
 * Target configuration
 */
export interface NotificationTarget {
  audience: TargetAudience
  role?: UserRole
  userIds?: number[]
  filters?: UserFilter[]
}

/**
 * User filter
 */
export interface UserFilter {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

/**
 * Schedule configuration
 */
export interface ScheduleConfig {
  scheduledAt?: Date
  recurring?: RecurringConfig
  timezone?: string
}

/**
 * Recurring notification configuration
 */
export interface RecurringConfig {
  frequency: RecurrenceFrequency
  interval?: number
  time?: string // HH:mm format
  daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
  dayOfMonth?: number // 1-31
  endDate?: Date
  maxOccurrences?: number
}

/**
 * User preferences for notifications
 */
export interface UserNotificationPreferences {
  enabled: boolean
  types?: NotificationType[]
  priorities?: NotificationPriority[]
  quietHours?: QuietHours
  channels?: NotificationChannel[]
}

/**
 * Quiet hours configuration
 */
export interface QuietHours {
  enabled: boolean
  start: string // HH:mm format
  end: string // HH:mm format
  timezone?: string
}

/**
 * Notification channels
 */
export type NotificationChannel = 'telegram' | 'email' | 'sms' | 'webhook'

/**
 * Template variable
 */
export interface TemplateVariable {
  [key: string]: string | number | boolean | Date
}

/**
 * Notification template
 */
export interface NotificationTemplate {
  id: string
  name: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  variables?: string[]
  buttons?: NotificationButton[]
  createdAt: Date
  updatedAt: Date
}

/**
 * Notification event
 */
export type NotificationEvent =
  | 'user.registered'
  | 'user.updated'
  | 'user.deleted'
  | 'admin.action'
  | 'system.error'
  | 'system.warning'
  | 'custom'

/**
 * Event listener configuration
 */
export interface EventListenerConfig {
  event: NotificationEvent
  target: NotificationTarget
  notification: NotificationConfig
  conditions?: EventCondition[]
}

/**
 * Event condition
 */
export interface EventCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
  value: any
}

/**
 * Notification record for history
 */
export interface NotificationRecord {
  id: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  target: NotificationTarget
  status: NotificationStatus
  sentAt?: Date
  scheduledAt?: Date
  failureReason?: string
  recipients: number[]
  successCount: number
  failureCount: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

/**
 * Notification statistics
 */
export interface NotificationStatistics {
  total: number
  sent: number
  failed: number
  pending: number
  scheduled: number
  cancelled: number
  successRate: number
  byPriority: Record<NotificationPriority, number>
  byType: Record<NotificationType, number>
  byTarget: Record<TargetAudience, number>
}

/**
 * Send result
 */
export interface SendResult {
  success: boolean
  sentCount: number
  failedCount: number
  failedUserIds: number[]
  errors: Error[]
}

/**
 * Batch send configuration
 */
export interface BatchSendConfig {
  batchSize?: number
  delayBetweenBatches?: number
  continueOnError?: boolean
  retryFailed?: boolean
  maxRetries?: number
}
