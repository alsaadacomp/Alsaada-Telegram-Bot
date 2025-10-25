import { Database } from '#root/modules/database/index.js'
import ExcelJS from 'exceljs'

export interface ReportTemplate {
  id: string
  name: string
  fields: string[]
  filters: Record<string, any>
  createdBy: number
  createdAt: Date
}

export class CustomReportsService {
  private static templates: Map<string, ReportTemplate> = new Map()

  static async saveTemplate(name: string, fields: string[], filters: Record<string, any>, userId: number): Promise<string> {
    const id = `template_${Date.now()}_${userId}`
    const template: ReportTemplate = {
      id,
      name,
      fields,
      filters,
      createdBy: userId,
      createdAt: new Date(),
    }
    this.templates.set(id, template)
    return id
  }

  static getTemplatesByUser(userId: number): ReportTemplate[] {
    return Array.from(this.templates.values()).filter(t => t.createdBy === userId)
  }

  static getTemplate(id: string): ReportTemplate | undefined {
    return this.templates.get(id)
  }

  static deleteTemplate(id: string): boolean {
    return this.templates.delete(id)
  }

  static async addSummarySheet(workbook: ExcelJS.Workbook, employees: any[], fields: string[]): Promise<void> {
    const summarySheet = workbook.addWorksheet('الملخص التنفيذي')
    summarySheet.views = [{ rightToLeft: true }]

    // العنوان
    summarySheet.mergeCells('A1:D1')
    const titleCell = summarySheet.getCell('A1')
    titleCell.value = '📊 الملخص التنفيذي'
    titleCell.font = { size: 18, bold: true, name: 'Arial' }
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } }
    titleCell.font = { ...titleCell.font, color: { argb: 'FFFFFFFF' } }
    summarySheet.getRow(1).height = 35

    let currentRow = 3

    // إحصائيات عامة
    summarySheet.getCell(`A${currentRow}`).value = '📈 الإحصائيات العامة'
    summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 }
    currentRow += 2

    const stats = [
      ['إجمالي العاملين', employees.length],
      ['نشطين', employees.filter(e => e.employmentStatus === 'ACTIVE').length],
      ['في إجازة', employees.filter(e => e.employmentStatus === 'ON_LEAVE').length],
      ['ذكور', employees.filter(e => e.gender === 'MALE').length],
      ['إناث', employees.filter(e => e.gender === 'FEMALE').length],
    ]

    stats.forEach(([label, value]) => {
      summarySheet.getCell(`A${currentRow}`).value = label
      summarySheet.getCell(`B${currentRow}`).value = value
      summarySheet.getCell(`A${currentRow}`).font = { bold: true }
      currentRow++
    })

    currentRow += 2

    // توزيع الأقسام
    summarySheet.getCell(`A${currentRow}`).value = '🏢 توزيع الأقسام'
    summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 }
    currentRow += 2

    const deptCounts = employees.reduce((acc, emp) => {
      const dept = emp.department?.name || 'غير محدد'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    summarySheet.getCell(`A${currentRow}`).value = 'القسم'
    summarySheet.getCell(`B${currentRow}`).value = 'العدد'
    summarySheet.getCell(`C${currentRow}`).value = 'النسبة %'
    summarySheet.getRow(currentRow).font = { bold: true }
    currentRow++

    Object.entries(deptCounts).forEach(([dept, count]) => {
      const countNum = count as number
      const percentage = ((countNum / employees.length) * 100).toFixed(1)
      summarySheet.getCell(`A${currentRow}`).value = dept
      summarySheet.getCell(`B${currentRow}`).value = countNum
      summarySheet.getCell(`C${currentRow}`).value = `${percentage}%`
      currentRow++
    })

    currentRow += 2

    // إحصائيات الرواتب
    if (fields.includes('basicSalary') || fields.includes('totalSalary')) {
      summarySheet.getCell(`A${currentRow}`).value = '💰 إحصائيات الرواتب'
      summarySheet.getCell(`A${currentRow}`).font = { bold: true, size: 14 }
      currentRow += 2

      const salaries = employees.map(e => e.totalSalary || e.basicSalary || 0).filter(s => s > 0)
      if (salaries.length > 0) {
        const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length
        const maxSalary = Math.max(...salaries)
        const minSalary = Math.min(...salaries)

        const salaryStats = [
          ['متوسط الراتب', avgSalary.toFixed(2)],
          ['أعلى راتب', maxSalary],
          ['أقل راتب', minSalary],
        ]

        salaryStats.forEach(([label, value]) => {
          summarySheet.getCell(`A${currentRow}`).value = label
          summarySheet.getCell(`B${currentRow}`).value = value
          summarySheet.getCell(`A${currentRow}`).font = { bold: true }
          currentRow++
        })
      }
    }

    // تنسيق الأعمدة
    summarySheet.getColumn('A').width = 30
    summarySheet.getColumn('B').width = 15
    summarySheet.getColumn('C').width = 15
    summarySheet.getColumn('D').width = 15
  }

  static generateTextChart(data: Record<string, number>, maxWidth: number = 20): string {
    const maxValue = Math.max(...Object.values(data))
    let chart = ''

    Object.entries(data).forEach(([label, value]) => {
      const barLength = Math.round((value / maxValue) * maxWidth)
      const bar = '█'.repeat(barLength)
      const percentage = ((value / Object.values(data).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
      chart += `${label}: ${bar} ${value} (${percentage}%)\n`
    })

    return chart
  }

  static async addChartsToWorkbook(workbook: ExcelJS.Workbook, employees: any[]): Promise<void> {
    const chartSheet = workbook.addWorksheet('الرسوم البيانية')
    chartSheet.views = [{ rightToLeft: true }]

    // بيانات توزيع الأقسام
    const deptCounts = employees.reduce((acc, emp) => {
      const dept = emp.department?.name || 'غير محدد'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    let row = 2
    chartSheet.getCell('A1').value = 'القسم'
    chartSheet.getCell('B1').value = 'العدد'
    
    Object.entries(deptCounts).forEach(([dept, count]) => {
      chartSheet.getCell(`A${row}`).value = dept
      chartSheet.getCell(`B${row}`).value = count as number
      row++
    })

    // بيانات توزيع الجنس
    row += 2
    chartSheet.getCell(`A${row}`).value = 'الجنس'
    chartSheet.getCell(`B${row}`).value = 'العدد'
    row++
    
    const maleCount = employees.filter(e => e.gender === 'MALE').length
    const femaleCount = employees.filter(e => e.gender === 'FEMALE').length
    
    chartSheet.getCell(`A${row}`).value = 'ذكور'
    chartSheet.getCell(`B${row}`).value = maleCount
    row++
    chartSheet.getCell(`A${row}`).value = 'إناث'
    chartSheet.getCell(`B${row}`).value = femaleCount
  }

  static generateSmartInsights(employees: any[]): string {
    let insights = '🤖 **تحليلات ذكية:**\n\n'

    // تحليل الرواتب
    const salaries = employees.map(e => e.totalSalary || e.basicSalary || 0).filter(s => s > 0)
    if (salaries.length > 0) {
      const avgSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length
      const outliers = salaries.filter(s => s > avgSalary * 1.5 || s < avgSalary * 0.5)
      
      if (outliers.length > 0) {
        insights += `⚠️ وجدت ${outliers.length} رواتب شاذة (بعيدة عن المتوسط)\n`
      }
    }

    // تحليل الأعمار
    const today = new Date()
    const ages = employees.map(e => {
      const birthDate = new Date(e.dateOfBirth)
      return today.getFullYear() - birthDate.getFullYear()
    }).filter(age => age > 0 && age < 100)

    if (ages.length > 0) {
      const nearRetirement = ages.filter(age => age >= 55).length
      if (nearRetirement > 0) {
        insights += `👴 ${nearRetirement} عامل قريب من سن التقاعد (55+)\n`
      }

      const avgAge = (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1)
      insights += `🎂 متوسط العمر: ${avgAge} سنة\n`
    }

    // تحليل مدة الخدمة
    const serviceDurations = employees.map(e => {
      const hireDate = new Date(e.hireDate)
      const years = (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365)
      return years
    }).filter(y => y > 0)

    if (serviceDurations.length > 0) {
      const avgService = (serviceDurations.reduce((a, b) => a + b, 0) / serviceDurations.length).toFixed(1)
      const longService = serviceDurations.filter(y => y >= 10).length
      
      insights += `🏆 متوسط مدة الخدمة: ${avgService} سنة\n`
      if (longService > 0) {
        insights += `⭐ ${longService} عامل لديه خدمة 10+ سنوات\n`
      }
    }

    // تحليل التعليم
    const educationCounts = employees.reduce((acc, emp) => {
      const edu = emp.educationLevel || 'OTHER'
      acc[edu] = (acc[edu] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topEducation = Object.entries(educationCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]
    if (topEducation) {
      const eduNames: Record<string, string> = {
        BACHELOR: 'بكالوريوس',
        MASTER: 'ماجستير',
        PHD: 'دكتوراه',
        DIPLOMA: 'دبلوم',
        HIGH_SCHOOL: 'ثانوية'
      }
      insights += `🎓 أكثر مستوى تعليمي: ${eduNames[topEducation[0]] || topEducation[0]}\n`
    }

    // تحليل التوظيف
    const recentHires = employees.filter(e => {
      const hireDate = new Date(e.hireDate)
      const monthsAgo = (today.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      return monthsAgo <= 6
    }).length

    if (recentHires > 0) {
      insights += `🆕 ${recentHires} موظف جديد في آخر 6 أشهر\n`
    }

    return insights
  }
}
