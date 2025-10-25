/**
 * Employee Excel Export Handler
 * معالج تصدير العاملين إلى Excel
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InputFile } from 'grammy'
import ExcelJS from 'exceljs'
import fs from 'node:fs/promises'
import path from 'node:path'

const employeeExportHandler = new Composer<Context>()

/**
 * تصدير جميع العاملين
 */
employeeExportHandler.callbackQuery('export:all-employees', async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري تجهيز الملف...')

    const employees = await Database.prisma.employee.findMany({
      where: { isActive: true },
      include: {
        company: true,
        department: true,
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const filePath = await generateExcelFile(employees, 'جميع العاملين')

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير جميع العاملين**\n\n`
        + `• عدد العاملين: ${employees.length}\n`
        + `• تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n\n`
        + `✅ تم إنشاء الملف بنجاح`,
      parse_mode: 'Markdown',
    })

    // Delete temp file
    await fs.unlink(filePath)

    logger.info({
      employeeCount: employees.length,
      exportedBy: ctx.from?.id,
    }, 'All employees exported to Excel')
  }
  catch (error) {
    logger.error({ error }, 'Error exporting all employees')
    await ctx.reply('❌ حدث خطأ أثناء تصدير الملف')
  }
})

/**
 * تصدير العاملين حسب القسم
 */
employeeExportHandler.callbackQuery(/^export:dept:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري تجهيز الملف...')

    const departmentId = Number.parseInt(ctx.match[1])

    const department = await Database.prisma.department.findUnique({
      where: { id: departmentId },
    })

    const employees = await Database.prisma.employee.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      include: {
        company: true,
        department: true,
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const filePath = await generateExcelFile(
      employees,
      `عاملي قسم ${department?.name || 'غير محدد'}`,
    )

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير عاملي قسم ${department?.name}**\n\n`
        + `• عدد العاملين: ${employees.length}\n`
        + `• تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n\n`
        + `✅ تم إنشاء الملف بنجاح`,
      parse_mode: 'Markdown',
    })

    await fs.unlink(filePath)

    logger.info({
      departmentId,
      employeeCount: employees.length,
      exportedBy: ctx.from?.id,
    }, 'Department employees exported to Excel')
  }
  catch (error) {
    logger.error({ error }, 'Error exporting department employees')
    await ctx.reply('❌ حدث خطأ أثناء تصدير الملف')
  }
})

/**
 * تصدير العاملين حسب المحافظة
 */
employeeExportHandler.callbackQuery(/^export:gov:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري تجهيز الملف...')

    const governorateId = Number.parseInt(ctx.match[1])

    const governorate = await Database.prisma.governorate.findUnique({
      where: { id: governorateId },
    })

    const employees = await Database.prisma.employee.findMany({
      where: {
        governorateId,
        isActive: true,
      },
      include: {
        company: true,
        department: true,
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const filePath = await generateExcelFile(
      employees,
      `عاملي محافظة ${governorate?.nameAr || 'غير محدد'}`,
    )

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير عاملي محافظة ${governorate?.nameAr}**\n\n`
        + `• عدد العاملين: ${employees.length}\n`
        + `• تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n\n`
        + `✅ تم إنشاء الملف بنجاح`,
      parse_mode: 'Markdown',
    })

    await fs.unlink(filePath)

    logger.info({
      governorateId,
      employeeCount: employees.length,
      exportedBy: ctx.from?.id,
    }, 'Governorate employees exported to Excel')
  }
  catch (error) {
    logger.error({ error }, 'Error exporting governorate employees')
    await ctx.reply('❌ حدث خطأ أثناء تصدير الملف')
  }
})

/**
 * تصدير العاملين حسب الوظيفة
 */
employeeExportHandler.callbackQuery(/^export:pos:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري تجهيز الملف...')

    const positionId = Number.parseInt(ctx.match[1])

    const position = await Database.prisma.position.findUnique({
      where: { id: positionId },
    })

    const employees = await Database.prisma.employee.findMany({
      where: {
        positionId,
        isActive: true,
      },
      include: {
        company: true,
        department: true,
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const filePath = await generateExcelFile(
      employees,
      `عاملي وظيفة ${position?.title || 'غير محدد'}`,
    )

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير عاملي وظيفة ${position?.title}**\n\n`
        + `• عدد العاملين: ${employees.length}\n`
        + `• تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n\n`
        + `✅ تم إنشاء الملف بنجاح`,
      parse_mode: 'Markdown',
    })

    await fs.unlink(filePath)

    logger.info({
      positionId,
      employeeCount: employees.length,
      exportedBy: ctx.from?.id,
    }, 'Position employees exported to Excel')
  }
  catch (error) {
    logger.error({ error }, 'Error exporting position employees')
    await ctx.reply('❌ حدث خطأ أثناء تصدير الملف')
  }
})

/**
 * تصدير العاملين حسب الحالة
 */
employeeExportHandler.callbackQuery(/^export:status:(.+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري تجهيز الملف...')

    const status = ctx.match[1]

    const statusNames: Record<string, string> = {
      ACTIVE: 'نشط',
      ON_LEAVE: 'في إجازة',
      SUSPENDED: 'موقوف',
      RESIGNED: 'مستقيل',
      TERMINATED: 'مفصول',
      RETIRED: 'متقاعد',
      ON_MISSION: 'في مأمورية',
      SETTLED: 'مسوى',
    }

    const employees = await Database.prisma.employee.findMany({
      where: {
        employmentStatus: status as any,
        isActive: true,
      },
      include: {
        company: true,
        department: true,
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const filePath = await generateExcelFile(
      employees,
      `العاملين - ${statusNames[status] || status}`,
    )

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير العاملين - ${statusNames[status]}**\n\n`
        + `• عدد العاملين: ${employees.length}\n`
        + `• تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n\n`
        + `✅ تم إنشاء الملف بنجاح`,
      parse_mode: 'Markdown',
    })

    await fs.unlink(filePath)

    logger.info({
      status,
      employeeCount: employees.length,
      exportedBy: ctx.from?.id,
    }, 'Status employees exported to Excel')
  }
  catch (error) {
    logger.error({ error }, 'Error exporting status employees')
    await ctx.reply('❌ حدث خطأ أثناء تصدير الملف')
  }
})

/**
 * Generate Excel file with employee data
 */
async function generateExcelFile(employees: any[], title: string): Promise<string> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('العاملين')

  // Set RTL
  worksheet.views = [{ rightToLeft: true }]

  // Set column widths
  worksheet.columns = [
    { width: 5 },  // #
    { width: 30 }, // الاسم الكامل
    { width: 15 }, // الكود
    { width: 20 }, // القسم
    { width: 25 }, // الوظيفة
    { width: 15 }, // المحافظة
    { width: 15 }, // الموبايل
    { width: 15 }, // الهاتف
    { width: 20 }, // البريد الإلكتروني
    { width: 12 }, // الحالة
    { width: 15 }, // تاريخ التعيين
    { width: 30 }, // العنوان
  ]

  // Title row
  worksheet.mergeCells('A1:L1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = title
  titleCell.font = { size: 16, bold: true, name: 'Arial' }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  }
  titleCell.font = { ...titleCell.font, color: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).height = 30

  // Date row
  worksheet.mergeCells('A2:L2')
  const dateCell = worksheet.getCell('A2')
  dateCell.value = `تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}`
  dateCell.font = { size: 12, name: 'Arial' }
  dateCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 20

  // Headers
  const headers = [
    '#',
    'الاسم الكامل',
    'الكود',
    'القسم',
    'الوظيفة',
    'المحافظة',
    'الموبايل',
    'الهاتف',
    'البريد الإلكتروني',
    'الحالة',
    'تاريخ التعيين',
    'العنوان',
  ]

  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.font = { bold: true, size: 12, name: 'Arial' }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    }
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    }
  })
  headerRow.height = 25

  // Data rows
  const statusNames: Record<string, string> = {
    ACTIVE: 'نشط',
    ON_LEAVE: 'في إجازة',
    SUSPENDED: 'موقوف',
    RESIGNED: 'مستقيل',
    TERMINATED: 'مفصول',
    RETIRED: 'متقاعد',
    ON_MISSION: 'في مأمورية',
    SETTLED: 'مسوى',
  }

  employees.forEach((emp, index) => {
    const row = worksheet.getRow(index + 4)

    row.getCell(1).value = index + 1
    row.getCell(2).value = emp.fullName || ''
    row.getCell(3).value = emp.employeeCode || ''
    row.getCell(4).value = emp.department?.name || ''
    row.getCell(5).value = emp.position?.title || ''
    row.getCell(6).value = emp.governorate?.nameAr || ''
    row.getCell(7).value = emp.personalPhone || ''
    row.getCell(8).value = emp.workPhone || ''
    row.getCell(9).value = emp.personalEmail || emp.workEmail || ''
    row.getCell(10).value = statusNames[emp.employmentStatus] || emp.employmentStatus
    row.getCell(11).value = emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('ar-EG') : ''
    row.getCell(12).value = emp.currentAddress || ''

    // Styling
    row.eachCell((cell) => {
      cell.font = { size: 11, name: 'Arial' }
      cell.alignment = { vertical: 'middle', horizontal: 'right' }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      }
    })

    // Alternate row colors
    if (index % 2 === 0) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF2F2F2' },
        }
      })
    }

    row.height = 20
  })

  // Summary row
  const summaryRow = worksheet.getRow(employees.length + 5)
  worksheet.mergeCells(`A${employees.length + 5}:L${employees.length + 5}`)
  const summaryCell = summaryRow.getCell(1)
  summaryCell.value = `إجمالي العاملين: ${employees.length}`
  summaryCell.font = { bold: true, size: 12, name: 'Arial' }
  summaryCell.alignment = { vertical: 'middle', horizontal: 'center' }
  summaryCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE7E6E6' },
  }
  summaryRow.height = 25

  // Save file
  const uploadsDir = path.join(process.cwd(), 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const fileName = `employees_${Date.now()}.xlsx`
  const filePath = path.join(uploadsDir, fileName)

  await workbook.xlsx.writeFile(filePath)

  return filePath
}

export { employeeExportHandler }
