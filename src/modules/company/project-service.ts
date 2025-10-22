/**
 * Project Service
 * خدمة إدارة المشاريع
 */

import type { Project } from '../../../generated/prisma/index.js'
import { Database } from '../database/index.js'
import { formatCurrency, formatNumber } from '../input/formatters/index.js'
import { logger } from '../services/logger/index.js'

export interface ProjectCreateData {
  name: string
  code?: string
  description?: string
  clientName?: string
  clientPhone?: string
  clientEmail?: string
  location?: string
  city?: string
  region?: string
  contractValue?: number
  currency?: string
  paidAmount?: number
  remainingAmount?: number
  startDate?: Date
  endDate?: Date
  actualEndDate?: Date
  projectManager?: string
  engineer?: string
  supervisor?: string
  status?: string
  progress?: number
  priority?: string
  type?: string
  category?: string
  notes?: string
  createdBy?: number
}

export interface ProjectUpdateData extends Partial<ProjectCreateData> {
  isActive?: boolean
  updatedBy?: number
}

export class ProjectService {
  /**
   * Create a new project
   */
  static async create(companyId: number, data: ProjectCreateData): Promise<Project> {
    try {
      const project = await Database.prisma.project.create({
        data: {
          companyId,
          ...data,
        },
      })
      logger.info({ projectId: project.id, name: project.name }, 'Project created')
      return project
    }
    catch (error) {
      logger.error({ error }, 'Failed to create project')
      throw error
    }
  }

  /**
   * Get all projects for a company
   */
  static async getAll(companyId: number, activeOnly = true): Promise<Project[]> {
    try {
      return await Database.prisma.project.findMany({
        where: {
          ...(activeOnly ? { isActive: true } : {}),
        },
        orderBy: { createdAt: 'desc' },
      })
    }
    catch (error) {
      logger.error({ error }, 'Failed to get projects')
      return []
    }
  }

  /**
   * Get project by ID
   */
  static async getById(id: number): Promise<Project | null> {
    try {
      return await Database.prisma.project.findUnique({
        where: { id },
      })
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to get project')
      return null
    }
  }

  /**
   * Update project
   */
  static async update(id: number, data: ProjectUpdateData): Promise<Project> {
    try {
      const updated = await Database.prisma.project.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
      logger.info({ projectId: updated.id }, 'Project updated')
      return updated
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to update project')
      throw error
    }
  }

  /**
   * Delete project (soft delete)
   */
  static async delete(id: number, deletedBy?: number): Promise<void> {
    try {
      await Database.prisma.project.update({
        where: { id },
        data: {
          isActive: false,
        },
      })
      logger.info({ projectId: id }, 'Project deleted')
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to delete project')
      throw error
    }
  }

  /**
   * Get projects by status
   */
  static async getByStatus(companyId: number, status: string): Promise<Project[]> {
    try {
      return await Database.prisma.project.findMany({
        where: {
          status,
          isActive: true,
        },
        orderBy: { startDate: 'desc' },
      })
    }
    catch (error) {
      logger.error({ error, status }, 'Failed to get projects by status')
      return []
    }
  }

  /**
   * Calculate project statistics
   */
  static async getStatistics(companyId: number): Promise<{
    total: number
    active: number
    completed: number
    totalValue: number
    paidTotal: number
    remainingTotal: number
  }> {
    try {
      const projects = await this.getAll(companyId, false)

      const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'قيد التنفيذ').length,
        completed: projects.filter(p => p.status === 'منتهي').length,
        totalValue: projects.reduce((sum, p) => sum + (p.contractValue || 0), 0),
        paidTotal: projects.reduce((sum, p) => sum + (p.paidAmount || 0), 0),
        remainingTotal: projects.reduce((sum, p) => sum + (p.remainingAmount || 0), 0),
      }

      return stats
    }
    catch (error) {
      logger.error({ error }, 'Failed to calculate project statistics')
      return {
        total: 0,
        active: 0,
        completed: 0,
        totalValue: 0,
        paidTotal: 0,
        remainingTotal: 0,
      }
    }
  }

  /**
   * Get formatted list for display
   */
  static async getFormattedList(companyId: number): Promise<string> {
    try {
      const projects = await this.getAll(companyId)

      if (projects.length === 0) {
        return 'لا توجد مشاريع مسجلة'
      }

      let list = '🏗️ **قائمة المشاريع:**\n\n'
      projects.forEach((project, index) => {
        list += `${index + 1}. **${project.name}**\n`
        if (project.status)
          list += `   📊 الحالة: ${project.status}\n`
        if (project.contractValue) {
          const currency = project.currency || 'EGP'
          list += `   💰 قيمة العقد: ${formatCurrency(project.contractValue, currency)}\n`
        }
        if (project.projectManager)
          list += `   🧑‍💼 مدير المشروع: ${project.projectManager}\n`
        list += '\n'
      })

      return list
    }
    catch (error) {
      logger.error({ error }, 'Failed to format project list')
      return 'حدث خطأ أثناء عرض المشاريع'
    }
  }
}
