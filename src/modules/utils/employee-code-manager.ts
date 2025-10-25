import { Database } from '../database/index.js'

/**
 * نظام إدارة أكواد الموظفين
 * ينشئ أكواد فريدة بناء على كود الوظيفة + رقم مسلسل
 */

export interface EmployeeCodeInfo {
  employeeCode: string
  positionCode: string
  serialNumber: number
}

export class EmployeeCodeManager {
  /**
   * إنشاء كود موظف جديد
   * @param positionId معرف الوظيفة
   * @returns معلومات كود الموظف
   */
  static async generateEmployeeCode(positionId: number): Promise<EmployeeCodeInfo> {
    const prisma = Database.prisma

    try {
      // جلب معلومات الوظيفة
      const position = await prisma.position.findUnique({
        where: { id: positionId },
        select: { code: true, titleAr: true }
      })

      if (!position) {
        throw new Error('الوظيفة غير موجودة')
      }

      // البحث عن آخر موظف في نفس الوظيفة
      const lastEmployee = await prisma.employee.findFirst({
        where: {
          positionId: positionId,
          employeeCode: {
            startsWith: position.code
          }
        },
        orderBy: {
          employeeCode: 'desc'
        },
        select: {
          employeeCode: true
        }
      })

      // تحديد الرقم المسلسل التالي
      let serialNumber = 1
      if (lastEmployee) {
        // استخراج الرقم المسلسل من الكود الأخير
        const codeParts = lastEmployee.employeeCode.split('-')
        if (codeParts.length >= 3) {
          const lastSerial = parseInt(codeParts[codeParts.length - 1])
          if (!isNaN(lastSerial)) {
            serialNumber = lastSerial + 1
          }
        }
      }

      // إنشاء الكود الجديد
      const employeeCode = `${position.code}-${serialNumber.toString().padStart(3, '0')}`

      // التأكد من عدم وجود كود مكرر
      const existingEmployee = await prisma.employee.findUnique({
        where: { employeeCode: employeeCode }
      })

      if (existingEmployee) {
        // إذا كان الكود موجود، نزيد الرقم المسلسل
        return this.generateEmployeeCode(positionId)
      }

      return {
        employeeCode,
        positionCode: position.code,
        serialNumber
      }

    } catch (error) {
      console.error('❌ خطأ في إنشاء كود الموظف:', error)
      throw new Error('فشل في إنشاء كود الموظف')
    }
  }

  /**
   * تحديث كود الموظف عند تغيير الوظيفة
   * @param employeeId معرف الموظف
   * @param newPositionId معرف الوظيفة الجديدة
   * @returns الكود الجديد
   */
  static async updateEmployeeCode(employeeId: number, newPositionId: number): Promise<string> {
    const prisma = Database.prisma

    try {
      // جلب معلومات الموظف الحالية
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: { 
          employeeCode: true, 
          fullName: true,
          positionId: true 
        }
      })

      if (!employee) {
        throw new Error('الموظف غير موجود')
      }

      // إنشاء كود جديد للوظيفة الجديدة
      const newCodeInfo = await this.generateEmployeeCode(newPositionId)

      // حفظ الكود القديم في التاريخ الوظيفي (يمكن إضافة جدول منفصل لهذا)
      console.log(`📝 تم تغيير كود الموظف ${employee.fullName}:`)
      console.log(`   الكود القديم: ${employee.employeeCode}`)
      console.log(`   الكود الجديد: ${newCodeInfo.employeeCode}`)

      // تحديث كود الموظف
      await prisma.employee.update({
        where: { id: employeeId },
        data: { employeeCode: newCodeInfo.employeeCode }
      })

      return newCodeInfo.employeeCode

    } catch (error) {
      console.error('❌ خطأ في تحديث كود الموظف:', error)
      throw new Error('فشل في تحديث كود الموظف')
    }
  }

  /**
   * التحقق من صحة كود الموظف
   * @param employeeCode كود الموظف
   * @returns صحة الكود
   */
  static validateEmployeeCode(employeeCode: string): boolean {
    // تنسيق الكود: POSITION_CODE-XXX (مثل CAT-01-001)
    const codePattern = /^[A-Z0-9]+-\d{2}-\d{3}$/
    return codePattern.test(employeeCode)
  }

  /**
   * استخراج معلومات من كود الموظف
   * @param employeeCode كود الموظف
   * @returns معلومات الكود
   */
  static parseEmployeeCode(employeeCode: string): EmployeeCodeInfo | null {
    if (!this.validateEmployeeCode(employeeCode)) {
      return null
    }

    const parts = employeeCode.split('-')
    if (parts.length !== 3) {
      return null
    }

    const positionCode = `${parts[0]}-${parts[1]}`
    const serialNumber = parseInt(parts[2])

    return {
      employeeCode,
      positionCode,
      serialNumber
    }
  }

  /**
   * الحصول على إحصائيات الأكواد
   * @param positionId معرف الوظيفة (اختياري)
   * @returns إحصائيات الأكواد
   */
  static async getCodeStatistics(positionId?: number): Promise<{
    totalEmployees: number
    positionStats: Array<{
      positionId: number
      positionName: string
      positionCode: string
      employeeCount: number
      lastSerialNumber: number
    }>
  }> {
    const prisma = Database.prisma

    try {
      const whereClause = positionId ? { positionId } : {}

      const employees = await prisma.employee.findMany({
        where: whereClause,
        select: {
          employeeCode: true,
          positionId: true,
          position: {
            select: {
              titleAr: true,
              code: true
            }
          }
        }
      })

      const positionStatsMap = new Map<number, {
        positionId: number
        positionName: string
        positionCode: string
        employeeCount: number
        lastSerialNumber: number
      }>()

      employees.forEach(employee => {
        const codeInfo = this.parseEmployeeCode(employee.employeeCode)
        if (!codeInfo) return

        const existing = positionStatsMap.get(employee.positionId)
        if (existing) {
          existing.employeeCount++
          existing.lastSerialNumber = Math.max(existing.lastSerialNumber, codeInfo.serialNumber)
        } else {
          positionStatsMap.set(employee.positionId, {
            positionId: employee.positionId,
            positionName: employee.position.titleAr,
            positionCode: employee.position.code,
            employeeCount: 1,
            lastSerialNumber: codeInfo.serialNumber
          })
        }
      })

      return {
        totalEmployees: employees.length,
        positionStats: Array.from(positionStatsMap.values())
      }

    } catch (error) {
      console.error('❌ خطأ في الحصول على إحصائيات الأكواد:', error)
      throw new Error('فشل في الحصول على إحصائيات الأكواد')
    }
  }

  /**
   * البحث عن موظف بالكود
   * @param employeeCode كود الموظف
   * @returns معلومات الموظف
   */
  static async findEmployeeByCode(employeeCode: string) {
    const prisma = Database.prisma

    try {
      return await prisma.employee.findUnique({
        where: { employeeCode },
        include: {
          position: {
            select: {
              titleAr: true,
              code: true,
              department: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
    } catch (error) {
      console.error('❌ خطأ في البحث عن الموظف:', error)
      throw new Error('فشل في البحث عن الموظف')
    }
  }
}
