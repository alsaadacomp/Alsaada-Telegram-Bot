/**
 * Template Management Service
 * خدمة إدارة قوالب الإشعارات
 */

import type { NotificationPriority, NotificationType } from './types.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'

export interface TemplateData {
  id?: string
  name: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  variables?: string[]
  buttons?: any[]
  isActive?: boolean
  createdBy?: number | null
}

export interface TemplateSearchOptions {
  isActive?: boolean
  createdBy?: number
  type?: NotificationType
  priority?: NotificationPriority
  search?: string
  limit?: number
  offset?: number
}

export class TemplateManagementService {
  /**
   * Create a new template
   */
  async createTemplate(data: TemplateData): Promise<string> {
    try {
      const template = await Database.prisma.notificationTemplate.create({
        data: {
          name: data.name,
          message: data.message,
          type: data.type.toUpperCase() as any,
          priority: data.priority.toUpperCase() as any,
          variables: data.variables ? JSON.stringify(data.variables) as any : undefined,
          buttons: data.buttons ? JSON.stringify(data.buttons) as any : undefined,
          isActive: data.isActive ?? true,
          createdBy: data.createdBy || null,
        },
      })

      logger.info(`Template created: ${template.id}`)
      return template.id
    }
    catch (error) {
      logger.error({ error }, 'Failed to create template')
      throw error
    }
  }

  /**
   * Get template by ID
   */
  async getTemplate(id: string): Promise<TemplateData | null> {
    try {
      const template = await Database.prisma.notificationTemplate.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              nickname: true,
            },
          },
        },
      })

      if (!template)
        return null

      return {
        id: template.id,
        name: template.name,
        message: template.message,
        type: template.type.toLowerCase() as NotificationType,
        priority: template.priority.toLowerCase() as NotificationPriority,
        variables: template.variables ? JSON.parse(String(template.variables)) : [],
        buttons: template.buttons ? JSON.parse(String(template.buttons)) : [],
        isActive: template.isActive,
        createdBy: template.createdBy,
      }
    }
    catch (error) {
      logger.error({ error, templateId: id }, 'Failed to get template')
      throw error
    }
  }

  /**
   * Update template
   */
  async updateTemplate(id: string, data: Partial<TemplateData>): Promise<void> {
    try {
      await Database.prisma.notificationTemplate.update({
        where: { id },
        data: {
          name: data.name,
          message: data.message,
          type: data.type ? data.type.toUpperCase() as any : undefined,
          priority: data.priority ? data.priority.toUpperCase() as any : undefined,
          variables: data.variables ? JSON.stringify(data.variables) : undefined,
          buttons: data.buttons ? JSON.stringify(data.buttons) : undefined,
          isActive: data.isActive,
          updatedAt: new Date(),
        },
      })

      logger.info(`Template updated: ${id}`)
    }
    catch (error) {
      logger.error({ error, templateId: id }, 'Failed to update template')
      throw error
    }
  }

  /**
   * Delete template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await Database.prisma.notificationTemplate.delete({
        where: { id },
      })

      logger.info(`Template deleted: ${id}`)
    }
    catch (error) {
      logger.error({ error, templateId: id }, 'Failed to delete template')
      throw error
    }
  }

  /**
   * Search templates
   */
  async searchTemplates(options: TemplateSearchOptions = {}): Promise<TemplateData[]> {
    try {
      const where: any = {}

      if (options.isActive !== undefined) {
        where.isActive = options.isActive
      }

      if (options.createdBy !== undefined) {
        where.createdBy = options.createdBy
      }

      if (options.type) {
        where.type = options.type.toUpperCase() as any
      }

      if (options.priority) {
        where.priority = options.priority.toUpperCase() as any
      }

      if (options.search) {
        where.OR = [
          { name: { contains: options.search } },
          { message: { contains: options.search } },
        ]
      }

      const templates = await Database.prisma.notificationTemplate.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              nickname: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: options.limit || 50,
        skip: options.offset || 0,
      })

      return templates.map(template => ({
        id: template.id,
        name: template.name,
        message: template.message,
        type: template.type.toLowerCase() as NotificationType,
        priority: template.priority.toLowerCase() as NotificationPriority,
        variables: template.variables ? JSON.parse(String(template.variables)) : [],
        buttons: template.buttons ? JSON.parse(String(template.buttons)) : [],
        isActive: template.isActive,
        createdBy: template.createdBy,
      }))
    }
    catch (error) {
      logger.error({ error }, 'Failed to search templates')
      throw error
    }
  }

  /**
   * Get template statistics
   */
  async getTemplateStats(): Promise<{
    total: number
    active: number
    inactive: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }> {
    try {
      const [total, active, inactive, byType, byPriority] = await Promise.all([
        Database.prisma.notificationTemplate.count(),
        Database.prisma.notificationTemplate.count({ where: { isActive: true } }),
        Database.prisma.notificationTemplate.count({ where: { isActive: false } }),
        Database.prisma.notificationTemplate.groupBy({
          by: ['type'],
          _count: { type: true },
        }),
        Database.prisma.notificationTemplate.groupBy({
          by: ['priority'],
          _count: { priority: true },
        }),
      ])

      return {
        total,
        active,
        inactive,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.type
          return acc
        }, {} as Record<string, number>),
        byPriority: byPriority.reduce((acc, item) => {
          acc[item.priority] = item._count.priority
          return acc
        }, {} as Record<string, number>),
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to get template stats')
      throw error
    }
  }

  /**
   * Duplicate template
   */
  async duplicateTemplate(id: string, newName: string, createdBy?: number): Promise<string> {
    try {
      const originalTemplate = await this.getTemplate(id)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }

      return await this.createTemplate({
        name: newName,
        message: originalTemplate.message,
        type: originalTemplate.type,
        priority: originalTemplate.priority,
        variables: originalTemplate.variables,
        buttons: originalTemplate.buttons,
        isActive: true,
        createdBy,
      })
    }
    catch (error) {
      logger.error({ error, templateId: id }, 'Failed to duplicate template')
      throw error
    }
  }
}

export const templateManagementService = new TemplateManagementService()
