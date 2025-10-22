/**
 * Notification System - Notification Class
 *
 * Represents a single notification with all its properties and metadata.
 */

import type {
  NotificationButton,
  NotificationConfig,
  NotificationPriority,
  NotificationStatus,
  NotificationTarget,
  NotificationType,
  ScheduleConfig,
} from '../types.js'

export class Notification {
  private config: Required<NotificationConfig>
  private target?: NotificationTarget
  private schedule?: ScheduleConfig
  private status: NotificationStatus = 'pending'
  private metadata: Map<string, any>
  private readonly createdAt: Date
  private sentAt?: Date

  constructor(message: string, config?: Partial<NotificationConfig>) {
    this.createdAt = new Date()
    this.metadata = new Map()

    this.config = {
      message,
      priority: config?.priority ?? 'normal',
      type: config?.type ?? 'info',
      data: config?.data ?? {},
      buttons: config?.buttons ?? [],
      image: config?.image ?? '',
      parseMode: config?.parseMode ?? 'HTML',
    }
  }

  /**
   * Set notification priority
   */
  setPriority(priority: NotificationPriority): this {
    this.config.priority = priority
    return this
  }

  /**
   * Set notification type
   */
  setType(type: NotificationType): this {
    this.config.type = type
    return this
  }

  /**
   * Set notification message
   */
  setMessage(message: string): this {
    this.config.message = message
    return this
  }

  /**
   * Add custom data
   */
  setData(data: Record<string, any>): this {
    this.config.data = { ...this.config.data, ...data }
    return this
  }

  /**
   * Add a button
   */
  addButton(button: NotificationButton): this {
    this.config.buttons.push(button)
    return this
  }

  /**
   * Set buttons
   */
  setButtons(buttons: NotificationButton[]): this {
    this.config.buttons = buttons
    return this
  }

  /**
   * Set image
   */
  setImage(image: string): this {
    this.config.image = image
    return this
  }

  /**
   * Set parse mode
   */
  setParseMode(parseMode: 'Markdown' | 'HTML'): this {
    this.config.parseMode = parseMode
    return this
  }

  /**
   * Set target audience
   */
  setTarget(target: NotificationTarget): this {
    this.target = target
    return this
  }

  /**
   * Schedule notification
   */
  setSchedule(schedule: ScheduleConfig): this {
    this.schedule = schedule
    this.status = 'scheduled'
    return this
  }

  /**
   * Set notification status
   */
  setStatus(status: NotificationStatus): this {
    this.status = status
    if (status === 'sent') {
      this.sentAt = new Date()
    }
    return this
  }

  /**
   * Add metadata
   */
  addMetadata(key: string, value: any): this {
    this.metadata.set(key, value)
    return this
  }

  /**
   * Get metadata
   */
  getMetadata(key: string): any {
    return this.metadata.get(key)
  }

  /**
   * Get all metadata
   */
  getAllMetadata(): Record<string, any> {
    return Object.fromEntries(this.metadata)
  }

  /**
   * Get notification configuration
   */
  getConfig(): Required<NotificationConfig> {
    return { ...this.config }
  }

  /**
   * Get message
   */
  getMessage(): string {
    return this.config.message
  }

  /**
   * Get priority
   */
  getPriority(): NotificationPriority {
    return this.config.priority
  }

  /**
   * Get type
   */
  getType(): NotificationType {
    return this.config.type
  }

  /**
   * Get buttons
   */
  getButtons(): NotificationButton[] {
    return [...this.config.buttons]
  }

  /**
   * Get target
   */
  getTarget(): NotificationTarget | undefined {
    return this.target ? { ...this.target } : undefined
  }

  /**
   * Get schedule
   */
  getSchedule(): ScheduleConfig | undefined {
    return this.schedule ? { ...this.schedule } : undefined
  }

  /**
   * Get status
   */
  getStatus(): NotificationStatus {
    return this.status
  }

  /**
   * Get created at
   */
  getCreatedAt(): Date {
    return this.createdAt
  }

  /**
   * Get sent at
   */
  getSentAt(): Date | undefined {
    return this.sentAt
  }

  /**
   * Check if notification is scheduled
   */
  isScheduled(): boolean {
    return this.status === 'scheduled' && !!this.schedule
  }

  /**
   * Check if notification is sent
   */
  isSent(): boolean {
    return this.status === 'sent'
  }

  /**
   * Check if notification is failed
   */
  isFailed(): boolean {
    return this.status === 'failed'
  }

  /**
   * Check if notification is pending
   */
  isPending(): boolean {
    return this.status === 'pending'
  }

  /**
   * Check if notification is cancelled
   */
  isCancelled(): boolean {
    return this.status === 'cancelled'
  }

  /**
   * Clone notification
   */
  clone(): Notification {
    const notification = new Notification(this.config.message, this.config)
    if (this.target) {
      notification.setTarget(this.target)
    }
    if (this.schedule) {
      notification.setSchedule(this.schedule)
    }
    notification.setStatus(this.status)
    this.metadata.forEach((value, key) => {
      notification.addMetadata(key, value)
    })
    return notification
  }

  /**
   * Convert to plain object
   */
  toJSON(): Record<string, any> {
    return {
      config: this.config,
      target: this.target,
      schedule: this.schedule,
      status: this.status,
      metadata: this.getAllMetadata(),
      createdAt: this.createdAt,
      sentAt: this.sentAt,
    }
  }
}
