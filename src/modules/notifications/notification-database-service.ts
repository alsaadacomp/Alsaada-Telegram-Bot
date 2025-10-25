/**
 * Notification Database Service
 * يدير حفظ واسترجاع الإشعارات من قاعدة البيانات
 */

import type {
  NotificationPriority,
  NotificationRecord,
  NotificationStatistics,
  NotificationStatus,
  NotificationType,
  TargetAudience,
} from './types.js'
import { Database } from '../database/index.js'
import { logger } from '../services/logger/index.js'

export class NotificationDatabaseService {
  /**
   * حفظ إشعار في قاعدة البيانات
   */
  static async saveNotification(record: Omit<NotificationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const notification = await Database.prisma.notification.create({
        data: {
          id: crypto.randomUUID(),
          message: record.message,
          type: record.type.toUpperCase() as any,
          priority: record.priority.toUpperCase() as any,
          targetAudience: 'all_users',
          sentAt: record.sentAt,
          metadata: JSON.stringify(record.metadata || {}),
        },
      })

      logger.info({ notificationId: notification.id }, 'Notification saved to database')
      return notification.id.toString()
    }
    catch (error) {
      logger.error({ error }, 'Failed to save notification to database')
      throw error
    }
  }

  /**
   * الحصول على آخر N إشعار
   */
  static async getRecentNotifications(limit: number = 10): Promise<NotificationRecord[]> {
    try {
      const notifications = await Database.prisma.notification.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
      })

      return notifications.map(n => this.mapToNotificationRecord(n))
    }
    catch (error) {
      logger.error({ error }, 'Failed to get recent notifications')
      return []
    }
  }

  /**
   * الحصول على إحصائيات الإشعارات
   */
  static async getStatistics(): Promise<NotificationStatistics> {
    try {
      const notifications = await Database.prisma.notification.findMany()

      const stats: NotificationStatistics = {
        total: notifications.length,
        sent: 0,
        failed: 0,
        pending: 0,
        scheduled: 0,
        cancelled: 0,
        successRate: 0,
        byPriority: { normal: 0, important: 0, urgent: 0, critical: 0 },
        byType: {
          info: 0,
          success: 0,
          warning: 0,
          error: 0,
          announcement: 0,
          reminder: 0,
          alert: 0,
        },
        byTarget: {
          all_users: 0,
          all_admins: 0,
          super_admin: 0,
          role: 0,
          specific_users: 0,
          active_users: 0,
          inactive_users: 0,
          new_users: 0,
        },
      }

      for (const notification of notifications) {
        // Count by status
        if (notification.status === 'SENT') {
          stats.sent++
        }
        else if (notification.status === 'FAILED') {
          stats.failed++
        }
        else {
          stats.pending++
        }

        // Count by priority
        const priority = notification.priority.toLowerCase() as keyof NotificationStatistics['byPriority']
        stats.byPriority[priority]++

        // Count by type
        const type = notification.type.toLowerCase() as keyof NotificationStatistics['byType']
        stats.byType[type]++

        // Count by target - simplified since we don't have targetAudience field
        stats.byTarget.all_users++
      }

      // Calculate success rate
      const totalSent = stats.sent + stats.failed
      stats.successRate = totalSent > 0 ? (stats.sent / totalSent) * 100 : 0

      return stats
    }
    catch (error) {
      logger.error({ error }, 'Failed to get notification statistics')
      return {
        total: 0,
        sent: 0,
        failed: 0,
        pending: 0,
        scheduled: 0,
        cancelled: 0,
        successRate: 0,
        byPriority: { normal: 0, important: 0, urgent: 0, critical: 0 },
        byType: {
          info: 0,
          success: 0,
          warning: 0,
          error: 0,
          announcement: 0,
          reminder: 0,
          alert: 0,
        },
        byTarget: {
          all_users: 0,
          all_admins: 0,
          super_admin: 0,
          role: 0,
          specific_users: 0,
          active_users: 0,
          inactive_users: 0,
          new_users: 0,
        },
      }
    }
  }

  /**
   * مسح جميع الإشعارات
   */
  static async clearAllNotifications(): Promise<void> {
    try {
      await Database.prisma.notification.deleteMany()
      logger.info('All notifications cleared from database')
    }
    catch (error) {
      logger.error({ error }, 'Failed to clear notifications')
      throw error
    }
  }

  /**
   * تحديث حالة إشعار
   */
  static async updateNotificationStatus(
    id: string,
    status: NotificationStatus,
    successCount?: number,
    failureCount?: number,
  ): Promise<void> {
    try {
      await Database.prisma.notification.update({
        where: { id },
        data: {
          status: status.toUpperCase() as any,
          successCount,
          failureCount,
        },
      })
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to update notification status')
    }
  }

  /**
   * تحويل نوع الإشعار إلى Enum
   */
  private static mapTypeToEnum(type: NotificationType): string {
    return type.toUpperCase()
  }

  /**
   * تحويل أولوية الإشعار إلى Enum
   */
  private static mapPriorityToEnum(priority: NotificationPriority): string {
    return priority.toUpperCase()
  }

  /**
   * تحويل حالة الإشعار إلى Enum
   */
  private static mapStatusToEnum(status: NotificationStatus): string {
    return status.toUpperCase()
  }

  /**
   * تحويل الفئة المستهدفة إلى Enum
   */
  private static mapAudienceToEnum(audience: TargetAudience): string {
    return audience.toUpperCase()
  }

  /**
   * تحويل notification من قاعدة البيانات إلى NotificationRecord
   */
  private static mapToNotificationRecord(notification: any): NotificationRecord {
    return {
      id: notification.id,
      message: notification.message,
      type: notification.type.toLowerCase() as NotificationType,
      priority: notification.priority.toLowerCase() as NotificationPriority,
      status: notification.status.toLowerCase() as NotificationStatus,
      target: {
        audience: notification.targetAudience.toLowerCase() as TargetAudience,
        role: notification.targetRole as any,
        userIds: notification.targetUserIds ? notification.targetUserIds.split(',').map(Number) : undefined,
      },
      sentAt: notification.sentAt || undefined,
      scheduledAt: notification.scheduledAt || undefined,
      failureReason: notification.failureReason || undefined,
      recipients: [],
      successCount: notification.successCount,
      failureCount: notification.failureCount,
      metadata: notification.metadata ? JSON.parse(notification.metadata) : undefined,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }
  }
}
