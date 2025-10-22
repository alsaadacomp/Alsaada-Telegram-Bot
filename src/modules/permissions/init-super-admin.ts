/**
 * Initialize Super Admin
 *
 * Automatically creates/updates the super admin user from environment variables
 */

import type { Config } from '#root/config.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'

/**
 * Initialize super admin from config
 */
export async function initSuperAdmin(config: Config): Promise<void> {
  if (!config.superAdminId) {
    logger.warn('No SUPER_ADMIN_ID configured in environment')
    return
  }

  try {
    const telegramId = BigInt(config.superAdminId)

    // Check if user exists
    let user = await Database.prisma.user.findUnique({
      where: { telegramId },
    })

    if (!user) {
      // Create new super admin
      user = await Database.prisma.user.create({
        data: {
          telegramId,
          role: 'SUPER_ADMIN',
          isActive: true,
          firstName: 'Super Admin',
        },
      })

      logger.info({
        userId: user.id,
        telegramId: telegramId.toString(),
      }, 'Super Admin user created from environment')
    }
    else if (user.role !== 'SUPER_ADMIN') {
      // Update existing user to SUPER_ADMIN
      user = await Database.prisma.user.update({
        where: { telegramId },
        data: { role: 'SUPER_ADMIN', isActive: true },
      })

      // Log the role change
      await Database.prisma.roleChange.create({
        data: {
          userId: user.id,
          oldRole: user.role,
          newRole: 'SUPER_ADMIN',
          changedBy: user.id, // Self-assigned from environment
          reason: 'تعيين تلقائي من متغيرات البيئة (SUPER_ADMIN_ID)',
        },
      })

      logger.info({
        userId: user.id,
        telegramId: telegramId.toString(),
        oldRole: user.role,
      }, 'Existing user promoted to Super Admin from environment')
    }
    else {
      logger.info({
        userId: user.id,
        telegramId: telegramId.toString(),
      }, 'Super Admin user already exists with correct role')
    }
  }
  catch (error) {
    logger.error({ error }, 'Failed to initialize Super Admin')
    throw error
  }
}
