import { logger } from '#root/modules/services/logger/index.js'
import { PrismaClient } from '../../../generated/prisma/index.js'

let prismaInstance: PrismaClient | null = null

export class Database {
  /**
   * Get the Prisma Client instance (static getter)
   */
  static get prisma(): PrismaClient {
    if (!prismaInstance) {
      throw new Error('Database not connected. Call Database.connect() first.')
    }
    return prismaInstance
  }

  /**
   * Get the Prisma Client instance (method)
   */
  static getClient(): PrismaClient {
    return this.prisma
  }

  /**
   * Connect to the database
   */
  static async connect(): Promise<void> {
    if (prismaInstance) {
      logger.warn('Database already connected')
      return
    }

    try {
      prismaInstance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ],
      })

      // Test the connection
      await prismaInstance.$connect()

      logger.info('Database connected successfully')
    }
    catch (error) {
      logger.error({ err: error }, 'Failed to connect to database')
      throw error
    }
  }

  /**
   * Disconnect from the database
   */
  static async disconnect(): Promise<void> {
    if (!prismaInstance) {
      logger.warn('Database not connected')
      return
    }

    try {
      await prismaInstance.$disconnect()
      prismaInstance = null
      logger.info('Database disconnected successfully')
    }
    catch (error) {
      logger.error({ err: error }, 'Failed to disconnect from database')
      throw error
    }
  }

  /**
   * Check if database is connected
   */
  static isConnected(): boolean {
    return prismaInstance !== null
  }
}

// Export the prisma instance for direct access if needed
export { prismaInstance as prisma }

// Export backup service
export { BackupService } from './backup-service.js'
