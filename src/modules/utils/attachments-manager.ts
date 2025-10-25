import { promises as fs } from 'fs'
import path from 'path'

/**
 * نظام إدارة المرفقات للموظفين
 * ينشئ مجلدات منظمة لكل موظف ويحفظ الملفات المرفقة
 */

export interface AttachmentInfo {
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  uploadedAt: Date
}

export class AttachmentsManager {
  private static readonly BASE_DIR = path.join(process.cwd(), 'attachments')
  private static readonly EMPLOYEE_DIR_PREFIX = 'employee'

  /**
   * إنشاء مجلد الموظف
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @returns مسار مجلد الموظف
   */
  static async createEmployeeFolder(employeeCode: string, employeeName: string): Promise<string> {
    const folderName = `${this.EMPLOYEE_DIR_PREFIX}-${employeeCode}-${employeeName.replace(/\s+/g, '-')}`
    const folderPath = path.join(this.BASE_DIR, folderName)

    try {
      await fs.mkdir(folderPath, { recursive: true })
      
      // إنشاء المجلدات الفرعية
      await fs.mkdir(path.join(folderPath, 'id-cards'), { recursive: true })
      await fs.mkdir(path.join(folderPath, 'profile-photos'), { recursive: true })
      await fs.mkdir(path.join(folderPath, 'documents'), { recursive: true })
      await fs.mkdir(path.join(folderPath, 'cv'), { recursive: true })
      await fs.mkdir(path.join(folderPath, 'others'), { recursive: true })

      console.log(`✅ تم إنشاء مجلد الموظف: ${folderPath}`)
      return folderPath
    } catch (error) {
      console.error('❌ خطأ في إنشاء مجلد الموظف:', error)
      throw new Error('فشل في إنشاء مجلد الموظف')
    }
  }

  /**
   * حفظ ملف بطاقة الرقم القومي
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @param fileBuffer محتوى الملف
   * @param fileName اسم الملف
   * @param side نوع البطاقة (front/back)
   * @returns معلومات الملف المحفوظ
   */
  static async saveIdCard(
    employeeCode: string,
    employeeName: string,
    fileBuffer: Buffer,
    fileName: string,
    side: 'front' | 'back'
  ): Promise<AttachmentInfo> {
    const folderPath = await this.createEmployeeFolder(employeeCode, employeeName)
    const idCardsPath = path.join(folderPath, 'id-cards')
    
    // إنشاء اسم ملف جديد بناء على كود الموظف
    const fileExtension = path.extname(fileName)
    const newFileName = `${employeeCode}-id-card-${side}${fileExtension}`
    const filePath = path.join(idCardsPath, newFileName)

    try {
      await fs.writeFile(filePath, fileBuffer)
      
      const stats = await fs.stat(filePath)
      
      return {
        fileName: newFileName,
        filePath: filePath,
        fileSize: stats.size,
        mimeType: this.getMimeType(fileExtension),
        uploadedAt: new Date()
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ بطاقة الرقم القومي:', error)
      throw new Error('فشل في حفظ بطاقة الرقم القومي')
    }
  }

  /**
   * حفظ صورة شخصية
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @param fileBuffer محتوى الملف
   * @param fileName اسم الملف
   * @returns معلومات الملف المحفوظ
   */
  static async saveProfilePhoto(
    employeeCode: string,
    employeeName: string,
    fileBuffer: Buffer,
    fileName: string
  ): Promise<AttachmentInfo> {
    const folderPath = await this.createEmployeeFolder(employeeCode, employeeName)
    const profilePhotosPath = path.join(folderPath, 'profile-photos')
    
    const fileExtension = path.extname(fileName)
    const newFileName = `${employeeCode}-profile-photo${fileExtension}`
    const filePath = path.join(profilePhotosPath, newFileName)

    try {
      await fs.writeFile(filePath, fileBuffer)
      
      const stats = await fs.stat(filePath)
      
      return {
        fileName: newFileName,
        filePath: filePath,
        fileSize: stats.size,
        mimeType: this.getMimeType(fileExtension),
        uploadedAt: new Date()
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ الصورة الشخصية:', error)
      throw new Error('فشل في حفظ الصورة الشخصية')
    }
  }

  /**
   * حفظ سيرة ذاتية
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @param fileBuffer محتوى الملف
   * @param fileName اسم الملف
   * @returns معلومات الملف المحفوظ
   */
  static async saveCV(
    employeeCode: string,
    employeeName: string,
    fileBuffer: Buffer,
    fileName: string
  ): Promise<AttachmentInfo> {
    const folderPath = await this.createEmployeeFolder(employeeCode, employeeName)
    const cvPath = path.join(folderPath, 'cv')
    
    const fileExtension = path.extname(fileName)
    const newFileName = `${employeeCode}-cv${fileExtension}`
    const filePath = path.join(cvPath, newFileName)

    try {
      await fs.writeFile(filePath, fileBuffer)
      
      const stats = await fs.stat(filePath)
      
      return {
        fileName: newFileName,
        filePath: filePath,
        fileSize: stats.size,
        mimeType: this.getMimeType(fileExtension),
        uploadedAt: new Date()
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ السيرة الذاتية:', error)
      throw new Error('فشل في حفظ السيرة الذاتية')
    }
  }

  /**
   * حفظ مستندات أخرى
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @param fileBuffer محتوى الملف
   * @param fileName اسم الملف
   * @param category فئة المستند
   * @returns معلومات الملف المحفوظ
   */
  static async saveDocument(
    employeeCode: string,
    employeeName: string,
    fileBuffer: Buffer,
    fileName: string,
    category: 'documents' | 'others' = 'documents'
  ): Promise<AttachmentInfo> {
    const folderPath = await this.createEmployeeFolder(employeeCode, employeeName)
    const documentsPath = path.join(folderPath, category)
    
    const fileExtension = path.extname(fileName)
    const timestamp = Date.now()
    const newFileName = `${employeeCode}-${category}-${timestamp}${fileExtension}`
    const filePath = path.join(documentsPath, newFileName)

    try {
      await fs.writeFile(filePath, fileBuffer)
      
      const stats = await fs.stat(filePath)
      
      return {
        fileName: newFileName,
        filePath: filePath,
        fileSize: stats.size,
        mimeType: this.getMimeType(fileExtension),
        uploadedAt: new Date()
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ المستند:', error)
      throw new Error('فشل في حفظ المستند')
    }
  }

  /**
   * الحصول على مسار مجلد الموظف
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @returns مسار مجلد الموظف
   */
  static getEmployeeFolderPath(employeeCode: string, employeeName: string): string {
    const folderName = `${this.EMPLOYEE_DIR_PREFIX}-${employeeCode}-${employeeName.replace(/\s+/g, '-')}`
    return path.join(this.BASE_DIR, folderName)
  }

  /**
   * الحصول على رابط الملف النسبي
   * @param filePath المسار الكامل للملف
   * @returns رابط الملف النسبي
   */
  static getRelativeFilePath(filePath: string): string {
    return path.relative(process.cwd(), filePath)
  }

  /**
   * تحديد نوع الملف بناء على الامتداد
   * @param extension امتداد الملف
   * @returns نوع الملف
   */
  private static getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.txt': 'text/plain',
      '.zip': 'application/zip',
      '.rar': 'application/x-rar-compressed'
    }
    
    return mimeTypes[extension.toLowerCase()] || 'application/octet-stream'
  }

  /**
   * حذف مجلد الموظف بالكامل
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   */
  static async deleteEmployeeFolder(employeeCode: string, employeeName: string): Promise<void> {
    const folderPath = this.getEmployeeFolderPath(employeeCode, employeeName)
    
    try {
      await fs.rm(folderPath, { recursive: true, force: true })
      console.log(`✅ تم حذف مجلد الموظف: ${folderPath}`)
    } catch (error) {
      console.error('❌ خطأ في حذف مجلد الموظف:', error)
      throw new Error('فشل في حذف مجلد الموظف')
    }
  }

  /**
   * الحصول على قائمة ملفات الموظف
   * @param employeeCode كود الموظف
   * @param employeeName اسم الموظف
   * @returns قائمة الملفات
   */
  static async getEmployeeFiles(employeeCode: string, employeeName: string): Promise<AttachmentInfo[]> {
    const folderPath = this.getEmployeeFolderPath(employeeCode, employeeName)
    const files: AttachmentInfo[] = []

    try {
      const entries = await fs.readdir(folderPath, { withFileTypes: true })
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          const subPath = path.join(folderPath, entry.name)
          const subEntries = await fs.readdir(subPath, { withFileTypes: true })
          
          for (const subEntry of subEntries) {
            if (subEntry.isFile()) {
              const filePath = path.join(subPath, subEntry.name)
              const stats = await fs.stat(filePath)
              
              files.push({
                fileName: subEntry.name,
                filePath: filePath,
                fileSize: stats.size,
                mimeType: this.getMimeType(path.extname(subEntry.name)),
                uploadedAt: stats.birthtime
              })
            }
          }
        }
      }
      
      return files
    } catch (error) {
      console.error('❌ خطأ في قراءة ملفات الموظف:', error)
      return []
    }
  }
}
