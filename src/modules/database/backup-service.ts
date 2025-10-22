/**
 * Database Backup Service
 * خدمة النسخ الاحتياطي لقاعدة البيانات
 */

import { promises as fs } from 'node:fs'
import { dirname, join } from 'node:path'
import { logger } from '#root/modules/services/logger/index.js'
import { settingsManager } from '#root/modules/settings/index.js'

export interface BackupInfo {
  filename: string
  path: string
  size: number
  createdAt: Date
}

export class BackupService {
  private static backupDir = join(process.cwd(), 'backups')
  private static dbPath = join(process.cwd(), 'prisma', 'dev.db')

  /**
   * Initialize backup directory
   */
  static async init(): Promise<void> {
    try {
      await fs.mkdir(this.backupDir, { recursive: true })
      logger.info('Backup directory initialized')
    }
    catch (error) {
      logger.error({ error }, 'Failed to initialize backup directory')
      throw error
    }
  }

  /**
   * Create a backup now
   */
  static async createBackup(): Promise<BackupInfo> {
    try {
      await this.init()

      // Generate backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `backup-${timestamp}.db`
      const backupPath = join(this.backupDir, filename)

      // Copy database file
      await fs.copyFile(this.dbPath, backupPath)

      // Get file stats
      const stats = await fs.stat(backupPath)

      const backupInfo: BackupInfo = {
        filename,
        path: backupPath,
        size: stats.size,
        createdAt: new Date(),
      }

      logger.info({ filename, size: stats.size }, 'Backup created successfully')

      // Clean old backups if needed
      await this.cleanOldBackups()

      return backupInfo
    }
    catch (error) {
      logger.error({ error }, 'Failed to create backup')
      throw error
    }
  }

  /**
   * List all available backups
   */
  static async listBackups(): Promise<BackupInfo[]> {
    try {
      await this.init()

      const files = await fs.readdir(this.backupDir)
      const backups: BackupInfo[] = []

      for (const file of files) {
        if (file.endsWith('.db')) {
          const filePath = join(this.backupDir, file)
          const stats = await fs.stat(filePath)

          backups.push({
            filename: file,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
          })
        }
      }

      // Sort by date (newest first)
      backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      return backups
    }
    catch (error) {
      logger.error({ error }, 'Failed to list backups')
      throw error
    }
  }

  /**
   * Restore a backup
   */
  static async restoreBackup(filename: string): Promise<void> {
    try {
      const backupPath = join(this.backupDir, filename)

      // Check if backup exists
      try {
        await fs.access(backupPath)
      }
      catch {
        throw new Error(`Backup file not found: ${filename}`)
      }

      // Create a backup of current database before restoring
      const currentBackup = `backup-before-restore-${new Date().toISOString().replace(/[:.]/g, '-')}.db`
      const currentBackupPath = join(this.backupDir, currentBackup)
      await fs.copyFile(this.dbPath, currentBackupPath)

      logger.info({ currentBackup }, 'Created safety backup of current database')

      // Restore the backup
      await fs.copyFile(backupPath, this.dbPath)

      logger.info({ filename }, 'Backup restored successfully')
    }
    catch (error) {
      logger.error({ error, filename }, 'Failed to restore backup')
      throw error
    }
  }

  /**
   * Delete a backup
   */
  static async deleteBackup(filename: string): Promise<void> {
    try {
      const backupPath = join(this.backupDir, filename)

      // Check if file exists first
      try {
        await fs.access(backupPath)
      }
      catch {
        throw new Error(`Backup file not found: ${filename}`)
      }

      // Try to delete the file
      await fs.unlink(backupPath)
      logger.info({ filename, path: backupPath }, 'Backup deleted successfully')
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error({
        error: errorMessage,
        filename,
        backupPath: join(this.backupDir, filename),
      }, 'Failed to delete backup')
      throw new Error(`Failed to delete backup: ${errorMessage}`)
    }
  }

  /**
   * Clean old backups based on max_backups setting
   */
  static async cleanOldBackups(): Promise<void> {
    try {
      const maxBackups = await settingsManager.get<number>('database.max_backups') || 7
      const backups = await this.listBackups()

      if (backups.length > maxBackups) {
        const backupsToDelete = backups.slice(maxBackups)

        for (const backup of backupsToDelete) {
          await this.deleteBackup(backup.filename)
        }

        logger.info({
          deleted: backupsToDelete.length,
          remaining: maxBackups,
        }, 'Cleaned old backups')
      }
    }
    catch (error) {
      logger.error({ error }, 'Failed to clean old backups')
    }
  }

  /**
   * Format file size to human readable
   */
  static formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
  }

  /**
   * Format date to Arabic
   */
  static formatDate(date: Date): string {
    return date.toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}
