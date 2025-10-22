#!/usr/bin/env tsx
/**
 * Migration Script: Transfer Join Request Data to User Profile
 * نقل بيانات طلبات الانضمام إلى ملف المستخدم الشخصي
 */

import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'

async function migrateJoinRequestData() {
  try {
    logger.info('Starting migration: Join Request Data to User Profile')

    // Get all approved join requests that have associated users
    const joinRequests = await Database.prisma.joinRequest.findMany({
      where: {
        status: 'APPROVED',
        user: {
          isNot: null,
        },
      },
      include: {
        user: true,
      },
    })

    logger.info(`Found ${joinRequests.length} approved join requests with users`)

    let updatedCount = 0
    let skippedCount = 0

    for (const joinRequest of joinRequests) {
      if (!joinRequest.user) {
        skippedCount++
        continue
      }

      // Check if user already has profile data
      if (joinRequest.user.fullName || joinRequest.user.nickname) {
        logger.info(`User ${joinRequest.user.id} already has profile data, skipping`)
        skippedCount++
        continue
      }

      // Update user with join request data
      await Database.prisma.user.update({
        where: { id: joinRequest.user.id },
        data: {
          fullName: joinRequest.fullName,
          nickname: joinRequest.nickname,
          phone: joinRequest.phone,
          // Keep existing firstName/lastName if they exist, otherwise use fullName
          firstName: joinRequest.user.firstName || joinRequest.fullName.split(' ')[0] || null,
          lastName: joinRequest.user.lastName || joinRequest.fullName.split(' ').slice(1).join(' ') || null,
        },
      })

      updatedCount++
      logger.info(`Updated user ${joinRequest.user.id} with profile data from join request ${joinRequest.id}`)
    }

    logger.info('Migration completed successfully', {
      total: joinRequests.length,
      updated: updatedCount,
      skipped: skippedCount,
    })
  }
  catch (error) {
    logger.error({ error }, 'Migration failed')
    throw error
  }
}

async function main() {
  try {
    await Database.connect()
    await migrateJoinRequestData()
    await Database.disconnect()
    logger.info('Migration script completed')
  }
  catch (error) {
    logger.error({ error }, 'Migration script failed')
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { migrateJoinRequestData }
