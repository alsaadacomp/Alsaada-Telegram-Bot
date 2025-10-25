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
}
