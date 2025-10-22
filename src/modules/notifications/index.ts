/**
 * Notification System - Main Entry Point
 *
 * A comprehensive notification system for Telegram bots with support for:
 * - Role-based notifications (admin, user, super admin)
 * - Scheduled and recurring notifications
 * - User preferences and quiet hours
 * - Notification templates
 * - Event-based notifications
 * - Notification history and statistics
 */

export { Notification, NotificationScheduler, NotificationTemplateBuilder } from './core/index.js'
// Core exports
export { NotificationService } from './notification-service.js'

// Type exports
export type {
  BatchSendConfig,
  EventCondition,
  EventListenerConfig,
  NotificationButton,
  NotificationChannel,
  NotificationConfig,
  NotificationEvent,
  NotificationPriority,
  NotificationRecord,
  NotificationStatistics,
  NotificationStatus,
  NotificationTarget,
  NotificationTemplate,
  NotificationType,
  QuietHours,
  RecurrenceFrequency,
  RecurringConfig,
  ScheduleConfig,
  SendResult,
  TargetAudience,
  TemplateVariable,
  UserFilter,
  UserNotificationPreferences,
  UserRole,
} from './types.js'
