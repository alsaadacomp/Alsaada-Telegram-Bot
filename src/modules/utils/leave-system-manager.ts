import { Database } from '../database/index.js'

export class LeaveSystemManager {
  /**
   * حساب مواعيد الإجازات التالية بناءً على نظام الدورات
   */
  static async calculateNextLeaveDates(employeeId: number): Promise<{
    nextLeaveStartDate: Date | null
    nextLeaveEndDate: Date | null
  }> {
    try {
      const prisma = Database.prisma
      
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          workDaysPerCycle: true,
          leaveDaysPerCycle: true,
          currentWorkDays: true,
          currentLeaveDays: true,
          lastLeaveEndDate: true,
          nextLeaveStartDate: true,
          nextLeaveEndDate: true
        }
      })

      if (!employee || !employee.workDaysPerCycle || !employee.leaveDaysPerCycle) {
        return {
          nextLeaveStartDate: null,
          nextLeaveEndDate: null
        }
      }

      const today = new Date()
      let nextLeaveStartDate: Date
      let nextLeaveEndDate: Date

      // إذا كان هناك تاريخ إجازة قادمة محدد بالفعل ولم يمر بعد
      if (employee.nextLeaveStartDate && employee.nextLeaveStartDate > today) {
        return {
          nextLeaveStartDate: employee.nextLeaveStartDate,
          nextLeaveEndDate: employee.nextLeaveEndDate
        }
      }

      // حساب التاريخ بناءً على آخر إجازة
      if (employee.lastLeaveEndDate) {
        // حساب الأيام المتبقية من دورة العمل الحالية
        const daysSinceLastLeave = Math.floor(
          (today.getTime() - employee.lastLeaveEndDate.getTime()) / (1000 * 60 * 60 * 24)
        )
        
        const remainingWorkDays = employee.workDaysPerCycle - daysSinceLastLeave
        
        if (remainingWorkDays <= 0) {
          // وقت الإجازة القادمة
          nextLeaveStartDate = new Date(today)
          nextLeaveEndDate = new Date(today)
          nextLeaveEndDate.setDate(nextLeaveEndDate.getDate() + employee.leaveDaysPerCycle - 1)
        } else {
          // حساب موعد الإجازة القادمة
          nextLeaveStartDate = new Date(today)
          nextLeaveStartDate.setDate(nextLeaveStartDate.getDate() + remainingWorkDays)
          
          nextLeaveEndDate = new Date(nextLeaveStartDate)
          nextLeaveEndDate.setDate(nextLeaveEndDate.getDate() + employee.leaveDaysPerCycle - 1)
        }
      } else {
        // إذا لم تكن هناك إجازة سابقة، حساب بناءً على أيام العمل الحالية
        const remainingWorkDays = employee.workDaysPerCycle - (employee.currentWorkDays || 0)
        
        if (remainingWorkDays <= 0) {
          nextLeaveStartDate = new Date(today)
          nextLeaveEndDate = new Date(today)
          nextLeaveEndDate.setDate(nextLeaveEndDate.getDate() + employee.leaveDaysPerCycle - 1)
        } else {
          nextLeaveStartDate = new Date(today)
          nextLeaveStartDate.setDate(nextLeaveStartDate.getDate() + remainingWorkDays)
          
          nextLeaveEndDate = new Date(nextLeaveStartDate)
          nextLeaveEndDate.setDate(nextLeaveEndDate.getDate() + employee.leaveDaysPerCycle - 1)
        }
      }

      return {
        nextLeaveStartDate,
        nextLeaveEndDate
      }
    } catch (error) {
      console.error('Error calculating next leave dates:', error)
      return {
        nextLeaveStartDate: null,
        nextLeaveEndDate: null
      }
    }
  }

  /**
   * تحديث أيام العمل والإجازات الحالية
   */
  static async updateCurrentDays(employeeId: number): Promise<void> {
    try {
      const prisma = Database.prisma
      
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          workDaysPerCycle: true,
          leaveDaysPerCycle: true,
          lastLeaveEndDate: true,
          hireDate: true
        }
      })

      if (!employee || !employee.workDaysPerCycle || !employee.leaveDaysPerCycle) {
        return
      }

      const today = new Date()
      let currentWorkDays = 0
      let currentLeaveDays = 0

      // حساب الأيام منذ آخر إجازة أو منذ التعيين
      const referenceDate = employee.lastLeaveEndDate || employee.hireDate
      const daysSinceReference = Math.floor(
        (today.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      // حساب الدورة الحالية
      const cycleLength = employee.workDaysPerCycle + employee.leaveDaysPerCycle
      const cyclesCompleted = Math.floor(daysSinceReference / cycleLength)
      const daysInCurrentCycle = daysSinceReference % cycleLength

      if (daysInCurrentCycle < employee.workDaysPerCycle) {
        // في فترة العمل
        currentWorkDays = daysInCurrentCycle
        currentLeaveDays = 0
      } else {
        // في فترة الإجازة
        currentWorkDays = employee.workDaysPerCycle
        currentLeaveDays = daysInCurrentCycle - employee.workDaysPerCycle
      }

      // تحديث قاعدة البيانات
      await prisma.employee.update({
        where: { id: employeeId },
        data: {
          currentWorkDays,
          currentLeaveDays
        }
      })

      console.log(`✅ تم تحديث أيام العمل والإجازات للعامل ${employeeId}: ${currentWorkDays} يوم عمل، ${currentLeaveDays} يوم إجازة`)
    } catch (error) {
      console.error('Error updating current days:', error)
    }
  }

  /**
   * بدء إجازة جديدة
   */
  static async startLeave(employeeId: number, leaveStartDate: Date): Promise<boolean> {
    try {
      const prisma = Database.prisma
      
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId },
        select: {
          workDaysPerCycle: true,
          leaveDaysPerCycle: true,
          currentWorkDays: true
        }
      })

      if (!employee || !employee.workDaysPerCycle || !employee.leaveDaysPerCycle) {
        return false
      }

      // التحقق من أن العامل أكمل فترة العمل المطلوبة
      if ((employee.currentWorkDays || 0) < employee.workDaysPerCycle) {
        return false
      }

      const leaveEndDate = new Date(leaveStartDate)
      leaveEndDate.setDate(leaveEndDate.getDate() + employee.leaveDaysPerCycle - 1)

      // تحديث قاعدة البيانات
      await prisma.employee.update({
        where: { id: employeeId },
        data: {
          lastLeaveStartDate: leaveStartDate,
          lastLeaveEndDate: leaveEndDate,
          currentWorkDays: 0,
          currentLeaveDays: employee.leaveDaysPerCycle,
          nextLeaveStartDate: null,
          nextLeaveEndDate: null
        }
      })

      console.log(`✅ بدأت إجازة جديدة للعامل ${employeeId} من ${leaveStartDate.toLocaleDateString('ar-EG')} إلى ${leaveEndDate.toLocaleDateString('ar-EG')}`)
      return true
    } catch (error) {
      console.error('Error starting leave:', error)
      return false
    }
  }

  /**
   * إنهاء إجازة والعودة للعمل
   */
  static async endLeave(employeeId: number): Promise<void> {
    try {
      const prisma = Database.prisma
      
      await prisma.employee.update({
        where: { id: employeeId },
        data: {
          currentWorkDays: 0,
          currentLeaveDays: 0
        }
      })

      console.log(`✅ انتهت إجازة العامل ${employeeId} وعاد للعمل`)
    } catch (error) {
      console.error('Error ending leave:', error)
    }
  }

  /**
   * تحديث جميع العاملين
   */
  static async updateAllEmployees(): Promise<void> {
    try {
      const prisma = Database.prisma
      
      const employees = await prisma.employee.findMany({
        where: {
          isActive: true,
          workDaysPerCycle: { not: null },
          leaveDaysPerCycle: { not: null }
        },
        select: { id: true }
      })

      console.log(`🔄 بدء تحديث ${employees.length} عامل...`)

      for (const employee of employees) {
        await this.updateCurrentDays(employee.id)
        const nextDates = await this.calculateNextLeaveDates(employee.id)
        
        if (nextDates.nextLeaveStartDate && nextDates.nextLeaveEndDate) {
          await prisma.employee.update({
            where: { id: employee.id },
            data: {
              nextLeaveStartDate: nextDates.nextLeaveStartDate,
              nextLeaveEndDate: nextDates.nextLeaveEndDate
            }
          })
        }
      }

      console.log(`✅ تم تحديث جميع العاملين بنجاح`)
    } catch (error) {
      console.error('Error updating all employees:', error)
    }
  }
}
