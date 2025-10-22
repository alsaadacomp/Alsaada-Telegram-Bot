/**
 * Branch Service
 * خدمة إدارة الفروع
 */

import type { Branch } from '../../../generated/prisma/index.js'
import { Database } from '../database/index.js'
import { logger } from '../services/logger/index.js'

export interface BranchCreateData {
  name: string
  code?: string
  address?: string
  city?: string
  region?: string
  phone?: string
  mobile?: string
  email?: string
  manager?: string
  managerPhone?: string
  type?: string
  capacity?: number
  openingDate?: Date
  notes?: string
  createdBy?: number
}

export interface BranchUpdateData extends Partial<BranchCreateData> {
  isActive?: boolean
  updatedBy?: number
}

export class BranchService {
  /**
   * Create a new branch
   */
  static async create(companyId: number, data: BranchCreateData): Promise<Branch> {
    try {
      const branch = await Database.prisma.branch.create({
        data: {
          companyId,
          ...data,
        },
      })
      logger.info({ branchId: branch.id, name: branch.name }, 'Branch created')
      return branch
    }
    catch (error) {
      logger.error({ error }, 'Failed to create branch')
      throw error
    }
  }

  /**
   * Get all branches for a company
   */
  static async getAll(companyId: number, activeOnly = true): Promise<Branch[]> {
    try {
      return await Database.prisma.branch.findMany({
        where: {
          ...(activeOnly ? { isActive: true } : {}),
        },
        orderBy: { name: 'asc' },
      })
    }
    catch (error) {
      logger.error({ error }, 'Failed to get branches')
      return []
    }
  }

  /**
   * Get branch by ID
   */
  static async getById(id: number): Promise<Branch | null> {
    try {
      return await Database.prisma.branch.findUnique({
        where: { id },
      })
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to get branch')
      return null
    }
  }

  /**
   * Update branch
   */
  static async update(id: number, data: BranchUpdateData): Promise<Branch> {
    try {
      const updated = await Database.prisma.branch.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
      logger.info({ branchId: updated.id }, 'Branch updated')
      return updated
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to update branch')
      throw error
    }
  }

  /**
   * Delete branch (soft delete)
   */
  static async delete(id: number, deletedBy?: number): Promise<void> {
    try {
      await Database.prisma.branch.update({
        where: { id },
        data: {
          isActive: false,
        },
      })
      logger.info({ branchId: id }, 'Branch deleted')
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to delete branch')
      throw error
    }
  }

  /**
   * Get formatted list for display
   */
  static async getFormattedList(companyId: number): Promise<string> {
    try {
      const branches = await this.getAll(companyId)

      if (branches.length === 0) {
        return 'لا توجد فروع مسجلة'
      }

      let list = '🏢 **قائمة الفروع:**\n\n'
      branches.forEach((branch, index) => {
        list += `${index + 1}. **${branch.name}**\n`
        if (branch.city)
          list += `   📍 المدينة: ${branch.city}\n`
        if (branch.phone)
          list += `   📞 التليفون: ${branch.phone}\n`
        if (branch.manager)
          list += `   👤 المدير: ${branch.manager}\n`
        list += '\n'
      })

      return list
    }
    catch (error) {
      logger.error({ error }, 'Failed to format branch list')
      return 'حدث خطأ أثناء عرض الفروع'
    }
  }
}
