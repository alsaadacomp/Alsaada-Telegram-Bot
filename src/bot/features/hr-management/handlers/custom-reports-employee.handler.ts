import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard, InputFile } from 'grammy'
import ExcelJS from 'exceljs'
import fs from 'node:fs/promises'
import path from 'node:path'

export const customReportsEmployeeHandler = new Composer<Context>()

const FIELD_NAMES: Record<string, string> = {
  employeeCode: 'كود العامل',
  fullName: 'الاسم الكامل',
  fullNameEn: 'الاسم بالإنجليزية',
  nickname: 'اللقب',
  nationalId: 'الرقم القومي',
  passportNumber: 'رقم الجواز',
  gender: 'النوع',
  dateOfBirth: 'تاريخ الميلاد',
  placeOfBirth: 'مكان الميلاد',
  nationality: 'الجنسية',
  maritalStatus: 'الحالة الاجتماعية',
  religion: 'الديانة',
  bloodType: 'فصيلة الدم',
  personalEmail: 'البريد الشخصي',
  workEmail: 'بريد العمل',
  personalPhone: 'الموبايل الشخصي',
  workPhone: 'هاتف العمل',
  telegramId: 'معرف تليجرام',
  emergencyContactName: 'اسم جهة الاتصال للطوارئ',
  emergencyContactPhone: 'هاتف الطوارئ',
  emergencyContactRelation: 'صلة القرابة',
  currentAddress: 'العنوان الحالي',
  currentAddressEn: 'العنوان بالإنجليزية',
  permanentAddress: 'العنوان الدائم',
  governorate: 'المحافظة',
  city: 'المدينة',
  region: 'المنطقة',
  country: 'الدولة',
  postalCode: 'الرمز البريدي',
  company: 'الشركة',
  department: 'القسم',
  position: 'الوظيفة',
  employmentType: 'نوع التوظيف',
  contractType: 'نوع العقد',
  employmentStatus: 'حالة العمل',
  hireDate: 'تاريخ التعيين',
  confirmationDate: 'تاريخ التثبيت',
  resignationDate: 'تاريخ الاستقالة',
  terminationDate: 'تاريخ الفصل',
  terminationReason: 'سبب الفصل',
  basicSalary: 'الراتب الأساسي',
  allowances: 'البدلات',
  totalSalary: 'إجمالي الراتب',
  currency: 'العملة',
  paymentMethod: 'طريقة الدفع',
  bankName: 'اسم البنك',
  bankAccountNumber: 'رقم الحساب البنكي',
  iban: 'رقم الآيبان',
  transferNumber1: 'رقم التحويل 1',
  transferType1: 'نوع التحويل 1',
  transferNumber2: 'رقم التحويل 2',
  transferType2: 'نوع التحويل 2',
  socialInsuranceNumber: 'رقم التأمينات',
  taxNumber: 'الرقم الضريبي',
  insuranceStartDate: 'تاريخ بدء التأمين',
  directManager: 'المدير المباشر',
  workSchedule: 'جدول العمل',
  workLocation: 'موقع العمل',
  educationLevel: 'المستوى التعليمي',
  major: 'التخصص',
  university: 'الجامعة',
  graduationYear: 'سنة التخرج',
  yearsOfExperience: 'سنوات الخبرة',
  annualLeaveBalance: 'رصيد الإجازة السنوية',
  sickLeaveBalance: 'رصيد الإجازة المرضية',
  casualLeaveBalance: 'رصيد الإجازة العارضة',
  attendanceRequired: 'يتطلب حضور',
  workDaysPerCycle: 'أيام العمل بالدورة',
  leaveDaysPerCycle: 'أيام الإجازة بالدورة',
  currentWorkDays: 'أيام العمل الحالية',
  currentLeaveDays: 'أيام الإجازة الحالية',
  lastLeaveStartDate: 'تاريخ بداية آخر إجازة',
  lastLeaveEndDate: 'تاريخ نهاية آخر إجازة',
  nextLeaveStartDate: 'تاريخ بداية الإجازة القادمة',
  nextLeaveEndDate: 'تاريخ نهاية الإجازة القادمة',
  fingerprintId: 'معرف البصمة',
  notes: 'ملاحظات',
  createdAt: 'تاريخ الإنشاء',
  updatedAt: 'تاريخ آخر تحديث',
}

customReportsEmployeeHandler.callbackQuery('custom-report:employee', async (ctx) => {
  await ctx.answerCallbackQuery()
  
  if (!ctx.session.customReport) {
    ctx.session.customReport = { fields: [], filters: {} }
  }

  const keyboard = new InlineKeyboard()
    .text('📋 اختيار الحقول', 'custom-report:select-fields')
    .row()
    .text('🔍 إضافة فلاتر', 'custom-report:add-filters')
    .row()
    .text('📊 إنشاء التقرير', 'custom-report:generate')
    .row()
    .text('🔄 إعادة تعيين', 'custom-report:reset')
    .row()
    .text('⬅️ رجوع', 'customReportsHandler')

  const selectedFields = ctx.session.customReport.fields.length
  const activeFilters = Object.keys(ctx.session.customReport.filters).length

  await ctx.editMessageText(
    '👥 **تقرير العاملين المخصص**\n\n'
    + `📋 الحقول المختارة: ${selectedFields}\n`
    + `🔍 الفلاتر النشطة: ${activeFilters}\n\n`
    + '📌 اختر الإجراء:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:select-fields', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
  const selected = ctx.session.customReport?.fields || []

  Object.entries(FIELD_NAMES).forEach(([key, name]) => {
    const isSelected = selected.includes(key)
    keyboard.text(
      `${isSelected ? '✅' : '⬜'} ${name}`,
      `custom-report:toggle-field:${key}`
    ).row()
  })

  keyboard
    .text('✅ تحديد الكل', 'custom-report:select-all')
    .text('❌ إلغاء الكل', 'custom-report:deselect-all')
    .row()
    .text('⬅️ رجوع', 'custom-report:employee')

  await ctx.editMessageText(
    '📋 **اختيار الحقول**\n\n'
    + `المحدد: ${selected.length}/${Object.keys(FIELD_NAMES).length}\n\n`
    + 'اضغط على الحقل لتحديده/إلغائه:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery(/^custom-report:toggle-field:(.+)$/, async (ctx) => {
  const field = ctx.match[1]
  
  if (!ctx.session.customReport) {
    ctx.session.customReport = { fields: [], filters: {} }
  }

  const index = ctx.session.customReport.fields.indexOf(field)
  if (index > -1) {
    ctx.session.customReport.fields.splice(index, 1)
  } else {
    ctx.session.customReport.fields.push(field)
  }

  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
  const selected = ctx.session.customReport.fields

  Object.entries(FIELD_NAMES).forEach(([key, name]) => {
    const isSelected = selected.includes(key)
    keyboard.text(
      `${isSelected ? '✅' : '⬜'} ${name}`,
      `custom-report:toggle-field:${key}`
    ).row()
  })

  keyboard
    .text('✅ تحديد الكل', 'custom-report:select-all')
    .text('❌ إلغاء الكل', 'custom-report:deselect-all')
    .row()
    .text('⬅️ رجوع', 'custom-report:employee')

  await ctx.editMessageText(
    '📋 **اختيار الحقول**\n\n'
    + `المحدد: ${selected.length}/${Object.keys(FIELD_NAMES).length}\n\n`
    + 'اضغط على الحقل لتحديده/إلغائه:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:select-all', async (ctx) => {
  await ctx.answerCallbackQuery()
  
  if (!ctx.session.customReport) {
    ctx.session.customReport = { fields: [], filters: {} }
  }

  ctx.session.customReport.fields = Object.keys(FIELD_NAMES)

  const keyboard = new InlineKeyboard()
  Object.entries(FIELD_NAMES).forEach(([key, name]) => {
    keyboard.text(`✅ ${name}`, `custom-report:toggle-field:${key}`).row()
  })

  keyboard
    .text('✅ تحديد الكل', 'custom-report:select-all')
    .text('❌ إلغاء الكل', 'custom-report:deselect-all')
    .row()
    .text('⬅️ رجوع', 'custom-report:employee')

  await ctx.editMessageText(
    '📋 **اختيار الحقول**\n\n'
    + `المحدد: ${ctx.session.customReport.fields.length}/${Object.keys(FIELD_NAMES).length}\n\n`
    + 'اضغط على الحقل لتحديده/إلغائه:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:deselect-all', async (ctx) => {
  await ctx.answerCallbackQuery()
  
  if (!ctx.session.customReport) {
    ctx.session.customReport = { fields: [], filters: {} }
  }

  ctx.session.customReport.fields = []

  const keyboard = new InlineKeyboard()
  Object.entries(FIELD_NAMES).forEach(([key, name]) => {
    keyboard.text(`⬜ ${name}`, `custom-report:toggle-field:${key}`).row()
  })

  keyboard
    .text('✅ تحديد الكل', 'custom-report:select-all')
    .text('❌ إلغاء الكل', 'custom-report:deselect-all')
    .row()
    .text('⬅️ رجوع', 'custom-report:employee')

  await ctx.editMessageText(
    '📋 **اختيار الحقول**\n\n'
    + `المحدد: 0/${Object.keys(FIELD_NAMES).length}\n\n`
    + 'اضغط على الحقل لتحديده/إلغائه:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:add-filters', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('🏢 حسب القسم', 'custom-report:filter:department')
    .row()
    .text('📍 حسب المحافظة', 'custom-report:filter:governorate')
    .row()
    .text('💼 حسب الوظيفة', 'custom-report:filter:position')
    .row()
    .text('📊 حسب الحالة', 'custom-report:filter:status')
    .row()
    .text('🔄 مسح الفلاتر', 'custom-report:clear-filters')
    .row()
    .text('⬅️ رجوع', 'custom-report:employee')

  const filters = ctx.session.customReport?.filters || {}
  let filterText = ''
  
  if (filters.departmentId) filterText += '• القسم ✅\n'
  if (filters.governorateId) filterText += '• المحافظة ✅\n'
  if (filters.positionId) filterText += '• الوظيفة ✅\n'
  if (filters.employmentStatus) filterText += '• الحالة ✅\n'

  await ctx.editMessageText(
    '🔍 **إضافة فلاتر**\n\n'
    + (filterText || 'لا توجد فلاتر نشطة\n\n')
    + '\nاختر الفلتر:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:filter:department', async (ctx) => {
  await ctx.answerCallbackQuery()

  const departments = await Database.prisma.department.findMany({
    orderBy: { name: 'asc' },
  })

  const keyboard = new InlineKeyboard()
  departments.forEach((dept) => {
    keyboard.text(dept.name, `custom-report:set-filter:dept:${dept.id}`).row()
  })
  keyboard.text('⬅️ رجوع', 'custom-report:add-filters')

  await ctx.editMessageText(
    '🏢 **اختر القسم:**',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:filter:governorate', async (ctx) => {
  await ctx.answerCallbackQuery()

  const governorates = await Database.prisma.governorate.findMany({
    orderBy: { orderIndex: 'asc' },
  })

  const keyboard = new InlineKeyboard()
  governorates.forEach((gov) => {
    keyboard.text(gov.nameAr, `custom-report:set-filter:gov:${gov.id}`).row()
  })
  keyboard.text('⬅️ رجوع', 'custom-report:add-filters')

  await ctx.editMessageText(
    '📍 **اختر المحافظة:**',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:filter:position', async (ctx) => {
  await ctx.answerCallbackQuery()

  const positions = await Database.prisma.position.findMany({
    orderBy: { titleAr: 'asc' },
  })

  const keyboard = new InlineKeyboard()
  positions.forEach((pos) => {
    keyboard.text(pos.titleAr, `custom-report:set-filter:pos:${pos.id}`).row()
  })
  keyboard.text('⬅️ رجوع', 'custom-report:add-filters')

  await ctx.editMessageText(
    '💼 **اختر الوظيفة:**',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery('custom-report:filter:status', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('✅ نشط', 'custom-report:set-filter:status:ACTIVE')
    .row()
    .text('🏖️ في إجازة', 'custom-report:set-filter:status:ON_LEAVE')
    .row()
    .text('⏸️ موقوف', 'custom-report:set-filter:status:SUSPENDED')
    .row()
    .text('⬅️ رجوع', 'custom-report:add-filters')

  await ctx.editMessageText(
    '📊 **اختر الحالة:**',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})

customReportsEmployeeHandler.callbackQuery(/^custom-report:set-filter:dept:(\d+)$/, async (ctx) => {
  const deptId = Number.parseInt(ctx.match[1])
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.filters.departmentId = deptId
  await ctx.answerCallbackQuery('✅ تم إضافة الفلتر')
  await ctx.editMessageText('✅ تم إضافة فلتر القسم', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:add-filters')
  })
})

customReportsEmployeeHandler.callbackQuery(/^custom-report:set-filter:gov:(\d+)$/, async (ctx) => {
  const govId = Number.parseInt(ctx.match[1])
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.filters.governorateId = govId
  await ctx.answerCallbackQuery('✅ تم إضافة الفلتر')
  await ctx.editMessageText('✅ تم إضافة فلتر المحافظة', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:add-filters')
  })
})

customReportsEmployeeHandler.callbackQuery(/^custom-report:set-filter:pos:(\d+)$/, async (ctx) => {
  const posId = Number.parseInt(ctx.match[1])
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.filters.positionId = posId
  await ctx.answerCallbackQuery('✅ تم إضافة الفلتر')
  await ctx.editMessageText('✅ تم إضافة فلتر الوظيفة', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:add-filters')
  })
})

customReportsEmployeeHandler.callbackQuery(/^custom-report:set-filter:status:(.+)$/, async (ctx) => {
  const status = ctx.match[1]
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.filters.employmentStatus = status
  await ctx.answerCallbackQuery('✅ تم إضافة الفلتر')
  await ctx.editMessageText('✅ تم إضافة فلتر الحالة', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:add-filters')
  })
})

customReportsEmployeeHandler.callbackQuery('custom-report:clear-filters', async (ctx) => {
  await ctx.answerCallbackQuery()
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.filters = {}
  await ctx.editMessageText('✅ تم مسح جميع الفلاتر', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:add-filters')
  })
})

customReportsEmployeeHandler.callbackQuery('custom-report:reset', async (ctx) => {
  await ctx.answerCallbackQuery()
  ctx.session.customReport = { fields: [], filters: {} }
  await ctx.editMessageText('✅ تم إعادة التعيين', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:employee')
  })
})

customReportsEmployeeHandler.callbackQuery('custom-report:generate', async (ctx) => {
  try {
    await ctx.answerCallbackQuery('⏳ جاري إنشاء التقرير...')

    const config = ctx.session.customReport
    if (!config || config.fields.length === 0) {
      await ctx.reply('⚠️ يجب اختيار حقل واحد على الأقل')
      return
    }

    const where: any = { isActive: true, ...config.filters }

    const employees = await Database.prisma.employee.findMany({
      where,
      include: {
        department: true,
        position: true,
        governorate: true,
        company: true,
        directManager: true,
      },
      orderBy: { fullName: 'asc' },
    })

    if (employees.length === 0) {
      await ctx.reply('⚠️ لا توجد بيانات تطابق الفلاتر المحددة')
      return
    }

    const filePath = await generateCustomExcel(employees, config.fields)
    const stats = calculateStats(employees, config.filters)

    await ctx.replyWithDocument(new InputFile(filePath), {
      caption: `📊 **تقرير العاملين المخصص**\n\n${stats}`,
      parse_mode: 'Markdown',
    })

    await fs.unlink(filePath)

    logger.info({
      fields: config.fields.length,
      filters: Object.keys(config.filters).length,
      employeeCount: employees.length,
      userId: ctx.from?.id,
    }, 'Custom employee report generated')
  }
  catch (error) {
    logger.error({ error }, 'Error generating custom report')
    await ctx.reply('❌ حدث خطأ أثناء إنشاء التقرير')
  }
})

async function generateCustomExcel(employees: any[], fields: string[]): Promise<string> {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('التقرير المخصص')

  worksheet.views = [{ rightToLeft: true }]

  const columns = fields.map(field => ({
    header: FIELD_NAMES[field] || field,
    key: field,
    width: 20,
  }))

  worksheet.columns = columns

  const headerRow = worksheet.getRow(1)
  headerRow.font = { bold: true, size: 12, name: 'Arial' }
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  }
  headerRow.font = { ...headerRow.font, color: { argb: 'FFFFFFFF' } }
  headerRow.height = 25

  employees.forEach((emp) => {
    const rowData: any = {}
    fields.forEach((field) => {
      if (field === 'department') rowData[field] = emp.department?.name || ''
      else if (field === 'position') rowData[field] = emp.position?.titleAr || ''
      else if (field === 'governorate') rowData[field] = emp.governorate?.nameAr || ''
      else if (field === 'company') rowData[field] = emp.company?.name || ''
      else if (field === 'directManager') {
        rowData[field] = emp.directManager ? (emp.directManager.nickname || emp.directManager.fullName) : ''
      }
      else if (['dateOfBirth', 'hireDate', 'confirmationDate', 'resignationDate', 'terminationDate', 
                'insuranceStartDate', 'lastLeaveStartDate', 'lastLeaveEndDate', 
                'nextLeaveStartDate', 'nextLeaveEndDate', 'createdAt', 'updatedAt'].includes(field)) {
        rowData[field] = emp[field] ? new Date(emp[field]).toLocaleDateString('ar-EG') : ''
      }
      else if (['basicSalary', 'allowances', 'totalSalary'].includes(field)) {
        rowData[field] = emp[field] ? `${emp[field]} ${emp.currency || 'EGP'}` : ''
      }
      else if (field === 'gender') {
        rowData[field] = emp[field] === 'MALE' ? 'ذكر' : 'أنثى'
      }
      else if (field === 'maritalStatus') {
        const status: Record<string, string> = {
          SINGLE: 'أعزب', MARRIED: 'متزوج', DIVORCED: 'مطلق', WIDOWED: 'أرمل'
        }
        rowData[field] = status[emp[field]] || emp[field]
      }
      else if (field === 'employmentType') {
        const types: Record<string, string> = {
          FULL_TIME: 'دوام كامل', PART_TIME: 'دوام جزئي', CONTRACT: 'عقد', 
          TEMPORARY: 'مؤقت', INTERN: 'متدرب', FREELANCE: 'حر'
        }
        rowData[field] = types[emp[field]] || emp[field]
      }
      else if (field === 'contractType') {
        const types: Record<string, string> = {
          PERMANENT: 'دائم', FIXED_TERM: 'محدد المدة', PROBATION: 'تحت الاختبار', SEASONAL: 'موسمي'
        }
        rowData[field] = types[emp[field]] || emp[field]
      }
      else if (field === 'employmentStatus') {
        const statuses: Record<string, string> = {
          ACTIVE: 'نشط', ON_LEAVE: 'في إجازة', SUSPENDED: 'موقوف',
          RESIGNED: 'مستقيل', TERMINATED: 'مفصول', RETIRED: 'متقاعد',
          ON_MISSION: 'في مأمورية', SETTLED: 'مسوى'
        }
        rowData[field] = statuses[emp[field]] || emp[field]
      }
      else if (field === 'paymentMethod') {
        const methods: Record<string, string> = {
          CASH: 'نقدي', BANK_TRANSFER: 'تحويل بنكي', CHEQUE: 'شيك', MOBILE_WALLET: 'محفظة إلكترونية'
        }
        rowData[field] = methods[emp[field]] || emp[field]
      }
      else if (field === 'educationLevel') {
        const levels: Record<string, string> = {
          HIGH_SCHOOL: 'ثانوية عامة', DIPLOMA: 'دبلوم', BACHELOR: 'بكالوريوس',
          MASTER: 'ماجستير', PHD: 'دكتوراه', VOCATIONAL: 'مهني', OTHER: 'أخرى'
        }
        rowData[field] = levels[emp[field]] || emp[field]
      }
      else if (field === 'attendanceRequired') {
        rowData[field] = emp[field] ? 'نعم' : 'لا'
      }
      else rowData[field] = emp[field] || ''
    })
    worksheet.addRow(rowData)
  })

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        }
        cell.alignment = { vertical: 'middle', horizontal: 'right' }
      })
    }
  })

  const uploadsDir = path.join(process.cwd(), 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })

  const fileName = `custom_report_${Date.now()}.xlsx`
  const filePath = path.join(uploadsDir, fileName)

  await workbook.xlsx.writeFile(filePath)

  return filePath
}

function calculateStats(employees: any[], filters: any): string {
  let stats = `📈 **الإحصائيات:**\n`
  stats += `• إجمالي العاملين: ${employees.length}\n`
  
  const activeCount = employees.filter(e => e.employmentStatus === 'ACTIVE').length
  stats += `• نشطين: ${activeCount}\n`

  const maleCount = employees.filter(e => e.gender === 'MALE').length
  const femaleCount = employees.filter(e => e.gender === 'FEMALE').length
  stats += `• ذكور: ${maleCount} | إناث: ${femaleCount}\n`

  if (!filters.departmentId) {
    const deptCounts = employees.reduce((acc, emp) => {
      const dept = emp.department?.name || 'غير محدد'
      acc[dept] = (acc[dept] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const topDepts = Object.entries(deptCounts).slice(0, 3)
    if (topDepts.length > 0) {
      stats += `\n🏢 **أكثر الأقسام:**\n`
      topDepts.forEach(([dept, count]) => {
        stats += `• ${dept}: ${count}\n`
      })
    }
  }

  return stats
}
