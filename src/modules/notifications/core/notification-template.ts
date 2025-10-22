/**
 * Notification System - Template Class
 *
 * Provides reusable notification templates with variable substitution.
 */

import type {
  NotificationButton,
  NotificationPriority,
  NotificationTemplate,
  NotificationType,
  TemplateVariable,
} from '../types.js'
import { Notification } from './notification.js'

export class NotificationTemplateBuilder {
  private id: string
  private name: string
  private message: string
  private type: NotificationType = 'info'
  private priority: NotificationPriority = 'normal'
  private variables: string[] = []
  private buttons: NotificationButton[] = []
  private readonly createdAt: Date
  private updatedAt: Date

  constructor(id: string, name: string, message: string) {
    this.id = id
    this.name = name
    this.message = message
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  /**
   * Set template type
   */
  setType(type: NotificationType): this {
    this.type = type
    this.updatedAt = new Date()
    return this
  }

  /**
   * Set template priority
   */
  setPriority(priority: NotificationPriority): this {
    this.priority = priority
    this.updatedAt = new Date()
    return this
  }

  /**
   * Add a variable
   */
  addVariable(variable: string): this {
    if (!this.variables.includes(variable)) {
      this.variables.push(variable)
      this.updatedAt = new Date()
    }
    return this
  }

  /**
   * Set variables
   */
  setVariables(variables: string[]): this {
    this.variables = [...variables]
    this.updatedAt = new Date()
    return this
  }

  /**
   * Add a button
   */
  addButton(button: NotificationButton): this {
    this.buttons.push(button)
    this.updatedAt = new Date()
    return this
  }

  /**
   * Set buttons
   */
  setButtons(buttons: NotificationButton[]): this {
    this.buttons = [...buttons]
    this.updatedAt = new Date()
    return this
  }

  /**
   * Auto-detect variables from message
   */
  autoDetectVariables(): this {
    const regex = /\{\{(\w+)\}\}/g
    const matches = this.message.matchAll(regex)
    const detectedVars = new Set<string>()

    for (const match of matches) {
      detectedVars.add(match[1])
    }

    this.variables = Array.from(detectedVars)
    this.updatedAt = new Date()
    return this
  }

  /**
   * Render template with variables
   */
  render(variables: TemplateVariable): string {
    let rendered = this.message

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      rendered = rendered.replace(regex, String(value))
    }

    return rendered
  }

  /**
   * Create notification from template
   */
  createNotification(variables?: TemplateVariable): Notification {
    const message = variables ? this.render(variables) : this.message

    const notification = new Notification(message, {
      type: this.type,
      priority: this.priority,
      buttons: this.buttons,
    })

    notification.addMetadata('templateId', this.id)
    notification.addMetadata('templateName', this.name)

    return notification
  }

  /**
   * Validate variables
   */
  validateVariables(variables: TemplateVariable): { valid: boolean, missing: string[] } {
    const missing: string[] = []

    for (const variable of this.variables) {
      if (!(variable in variables)) {
        missing.push(variable)
      }
    }

    return {
      valid: missing.length === 0,
      missing,
    }
  }

  /**
   * Build template object
   */
  build(): NotificationTemplate {
    return {
      id: this.id,
      name: this.name,
      message: this.message,
      type: this.type,
      priority: this.priority,
      variables: [...this.variables],
      buttons: [...this.buttons],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  /**
   * Get template ID
   */
  getId(): string {
    return this.id
  }

  /**
   * Get template name
   */
  getName(): string {
    return this.name
  }

  /**
   * Get template message
   */
  getMessage(): string {
    return this.message
  }

  /**
   * Get variables
   */
  getVariables(): string[] {
    return [...this.variables]
  }

  /**
   * Get buttons
   */
  getButtons(): NotificationButton[] {
    return [...this.buttons]
  }

  /**
   * Get type
   */
  getType(): NotificationType {
    return this.type
  }

  /**
   * Get priority
   */
  getPriority(): NotificationPriority {
    return this.priority
  }

  /**
   * Clone template
   */
  clone(newId?: string, newName?: string): NotificationTemplateBuilder {
    const template = new NotificationTemplateBuilder(
      newId ?? this.id,
      newName ?? this.name,
      this.message,
    )
    template.setType(this.type)
    template.setPriority(this.priority)
    template.setVariables(this.variables)
    template.setButtons(this.buttons)
    return template
  }
}
