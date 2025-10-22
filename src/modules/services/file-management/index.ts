/**
 * File Management Service
 * خدمة إدارة الملفات
 */

import type { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { logger } from '#root/modules/services/logger/index.js'

export interface FileInfo {
  id: string
  name: string
  originalName: string
  size: number
  type: string
  mimeType: string
  hash: string
  uploadedBy: number
  uploadedAt: Date
  isPublic: boolean
  downloadCount: number
  description?: string
  tags?: string[]
}

export interface FileUploadResult {
  success: boolean
  fileId?: string
  error?: string
  fileInfo?: FileInfo
}

export interface FileSearchOptions {
  query?: string
  type?: string
  uploadedBy?: number
  isPublic?: boolean
  tags?: string[]
  limit?: number
  offset?: number
}

export class FileManagementService {
  private static readonly UPLOAD_DIR = 'uploads'
  private static readonly MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
  private static readonly ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
    'application/zip',
    'application/x-rar-compressed',
  ]

  /**
   * Initialize file management system
   */
  static async initialize(): Promise<void> {
    try {
      // Create upload directory if it doesn't exist
      if (!fs.existsSync(this.UPLOAD_DIR)) {
        fs.mkdirSync(this.UPLOAD_DIR, { recursive: true })
        logger.info('Created upload directory')
      }

      // Create subdirectories for different file types
      const subdirs = ['images', 'documents', 'archives', 'others']
      for (const subdir of subdirs) {
        const dirPath = path.join(this.UPLOAD_DIR, subdir)
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }
      }

      logger.info('File management system initialized')
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Failed to initialize file management system')
      throw error
    }
  }

  /**
   * Upload a file
   */
  static async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    mimeType: string,
    uploadedBy: number,
    options: {
      description?: string
      tags?: string[]
      isPublic?: boolean
    } = {},
  ): Promise<FileUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(fileBuffer, mimeType)
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        }
      }

      // Generate file hash and ID
      const hash = createHash('sha256').update(fileBuffer).digest('hex')
      const fileId = `${Date.now()}-${hash.substring(0, 8)}`
      const extension = path.extname(originalName)
      const fileName = `${fileId}${extension}`

      // Determine subdirectory based on file type
      const subdir = this.getFileSubdirectory(mimeType)
      const filePath = path.join(this.UPLOAD_DIR, subdir, fileName)

      // Save file to disk
      fs.writeFileSync(filePath, fileBuffer)

      // Create file info
      const fileInfo: FileInfo = {
        id: fileId,
        name: fileName,
        originalName,
        size: fileBuffer.length,
        type: this.getFileType(mimeType),
        mimeType,
        hash,
        uploadedBy,
        uploadedAt: new Date(),
        isPublic: options.isPublic ?? false,
        downloadCount: 0,
        description: options.description,
        tags: options.tags || [],
      }

      // Save file info to database (mock for now)
      // In a real implementation, you would save this to a database
      logger.info({ fileId, originalName, size: fileBuffer.length }, 'File uploaded successfully')

      return {
        success: true,
        fileId,
        fileInfo,
      }
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error uploading file')
      return {
        success: false,
        error: 'Failed to upload file',
      }
    }
  }

  /**
   * Get file information
   */
  static async getFileInfo(fileId: string): Promise<FileInfo | null> {
    try {
      // Mock implementation - in real app, query database
      const mockFile: FileInfo = {
        id: fileId,
        name: `file-${fileId}.pdf`,
        originalName: 'document.pdf',
        size: 1024000,
        type: 'document',
        mimeType: 'application/pdf',
        hash: 'mock-hash',
        uploadedBy: 1,
        uploadedAt: new Date(),
        isPublic: true,
        downloadCount: 5,
        description: 'Sample document',
        tags: ['important', 'document'],
      }

      return mockFile
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error getting file info')
      return null
    }
  }

  /**
   * Download a file
   */
  static async downloadFile(fileId: string): Promise<Buffer | null> {
    try {
      const fileInfo = await this.getFileInfo(fileId)
      if (!fileInfo) {
        return null
      }

      const subdir = this.getFileSubdirectory(fileInfo.mimeType)
      const filePath = path.join(this.UPLOAD_DIR, subdir, fileInfo.name)

      if (!fs.existsSync(filePath)) {
        logger.warn({ fileId, filePath }, 'File not found on disk')
        return null
      }

      const fileBuffer = fs.readFileSync(filePath)

      // Update download count (mock)
      logger.info({ fileId }, 'File downloaded')

      return fileBuffer
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error downloading file')
      return null
    }
  }

  /**
   * Search files
   */
  static async searchFiles(options: FileSearchOptions): Promise<FileInfo[]> {
    try {
      // Mock implementation - in real app, query database
      const mockFiles: FileInfo[] = [
        {
          id: '1',
          name: 'file-1.pdf',
          originalName: 'report.pdf',
          size: 1024000,
          type: 'document',
          mimeType: 'application/pdf',
          hash: 'hash1',
          uploadedBy: 1,
          uploadedAt: new Date(),
          isPublic: true,
          downloadCount: 10,
          description: 'Monthly report',
          tags: ['report', 'monthly'],
        },
        {
          id: '2',
          name: 'file-2.jpg',
          originalName: 'photo.jpg',
          size: 512000,
          type: 'image',
          mimeType: 'image/jpeg',
          hash: 'hash2',
          uploadedBy: 2,
          uploadedAt: new Date(),
          isPublic: false,
          downloadCount: 3,
          description: 'Team photo',
          tags: ['photo', 'team'],
        },
      ]

      // Apply filters
      let filteredFiles = mockFiles

      if (options.query) {
        const query = options.query.toLowerCase()
        filteredFiles = filteredFiles.filter(file =>
          file.originalName.toLowerCase().includes(query)
          || file.description?.toLowerCase().includes(query)
          || file.tags?.some(tag => tag.toLowerCase().includes(query)),
        )
      }

      if (options.type) {
        filteredFiles = filteredFiles.filter(file => file.type === options.type)
      }

      if (options.uploadedBy) {
        filteredFiles = filteredFiles.filter(file => file.uploadedBy === options.uploadedBy)
      }

      if (options.isPublic !== undefined) {
        filteredFiles = filteredFiles.filter(file => file.isPublic === options.isPublic)
      }

      if (options.tags && options.tags.length > 0) {
        filteredFiles = filteredFiles.filter(file =>
          file.tags?.some(tag => options.tags!.includes(tag)),
        )
      }

      // Apply pagination
      const offset = options.offset || 0
      const limit = options.limit || 10
      const paginatedFiles = filteredFiles.slice(offset, offset + limit)

      return paginatedFiles
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error searching files')
      return []
    }
  }

  /**
   * Delete a file
   */
  static async deleteFile(fileId: string, deletedBy: number): Promise<boolean> {
    try {
      const fileInfo = await this.getFileInfo(fileId)
      if (!fileInfo) {
        return false
      }

      // Check permissions (mock)
      if (fileInfo.uploadedBy !== deletedBy) {
        logger.warn({ fileId, deletedBy, uploadedBy: fileInfo.uploadedBy }, 'Unauthorized file deletion attempt')
        return false
      }

      // Delete file from disk
      const subdir = this.getFileSubdirectory(fileInfo.mimeType)
      const filePath = path.join(this.UPLOAD_DIR, subdir, fileInfo.name)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }

      // Delete from database (mock)
      logger.info({ fileId }, 'File deleted successfully')

      return true
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error deleting file')
      return false
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStatistics(): Promise<{
    totalFiles: number
    totalSize: number
    filesByType: Record<string, number>
    recentUploads: number
  }> {
    try {
      // Mock implementation
      return {
        totalFiles: 150,
        totalSize: 1024 * 1024 * 1024, // 1GB
        filesByType: {
          image: 80,
          document: 50,
          archive: 15,
          other: 5,
        },
        recentUploads: 12, // Last 24 hours
      }
    }
    catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error getting file statistics')
      return {
        totalFiles: 0,
        totalSize: 0,
        filesByType: {},
        recentUploads: 0,
      }
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(fileBuffer: Buffer, mimeType: string): { valid: boolean, error?: string } {
    // Check file size
    if (fileBuffer.length > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      }
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: 'File type not allowed',
      }
    }

    // Check if file is empty
    if (fileBuffer.length === 0) {
      return {
        valid: false,
        error: 'File is empty',
      }
    }

    return { valid: true }
  }

  /**
   * Get subdirectory based on file type
   */
  private static getFileSubdirectory(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return 'images'
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'documents'
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
      return 'archives'
    }
    return 'others'
  }

  /**
   * Get file type category
   */
  private static getFileType(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return 'image'
    }
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) {
      return 'document'
    }
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) {
      return 'archive'
    }
    return 'other'
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0)
      return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${Math.round(bytes / 1024 ** i * 100) / 100} ${sizes[i]}`
  }

  /**
   * Get file icon based on type
   */
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) {
      return '🖼️'
    }
    if (mimeType.includes('pdf')) {
      return '📄'
    }
    if (mimeType.includes('document') || mimeType.includes('text')) {
      return '📝'
    }
    if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return '📦'
    }
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return '📊'
    }
    return '📁'
  }
}
