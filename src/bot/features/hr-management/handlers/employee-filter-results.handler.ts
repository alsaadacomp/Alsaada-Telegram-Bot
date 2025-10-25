/**
 * Employee Filter Results Handler
 * معالج عرض نتائج التصفية
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

const employeeFilterResultsHandler = new Composer<Context>()

/**
 * عرض العاملين حسب القسم
 */
employeeFilterResultsHandler.callbackQuery(/^filter:dept:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const departmentId = Number.parseInt(ctx.match[1])

    const department = await Database.prisma.department.findUnique({
      where: { id: departmentId },
    })

    if (!department) {
      await ctx.answerCallbackQuery('⚠️ القسم غير موجود')
      return
    }

    const employees = await Database.prisma.employee.findMany({
      where: {
        departmentId,
        isActive: true,
      },
      include: {
        position: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    // Statistics
    const totalCount = employees.length
    const activeCount = employees.filter(e => e.employmentStatus === 'ACTIVE').length
    const onLeaveCount = employees.filter(e => e.employmentStatus === 'ON_LEAVE').length

    let message = `🏢 **القسم: ${department.name}**\n\n`
    message += `📊 **الإحصائيات:**\n`
    message += `• إجمالي العاملين: ${totalCount}\n`
    message += `• نشطين: ${activeCount}\n`
    message += `• في إجازة: ${onLeaveCount}\n\n`

    if (employees.length === 0) {
      message += '⚠️ لا يوجد عاملين في هذا القسم'
      
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'filter:by-department')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
      return
    }

    // Build clickable employee list (max 10 per page)
    const page = 1
    const itemsPerPage = 10
    const totalPages = Math.ceil(employees.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentPageEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

    message += `👥 **قائمة العاملين** (الصفحة ${page}/${totalPages}):\n\n`

    const keyboard = new InlineKeyboard()

    currentPageEmployees.forEach((emp) => {
      const displayName = emp.nickname || emp.fullName
      const positionTitle = emp.position?.titleAr || 'غير محدد'
      
      keyboard.text(
        `${displayName} (${positionTitle})`,
        `hr:employee:details:${emp.id}`,
      ).row()
    })

    // Pagination if needed
    if (totalPages > 1) {
      const paginationRow: any[] = []
      if (page > 1) {
        paginationRow.push({ text: '◀️ السابق', callback_data: `filter:dept:${departmentId}:page:${page - 1}` })
      }
      paginationRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' })
      if (page < totalPages) {
        paginationRow.push({ text: 'التالي ▶️', callback_data: `filter:dept:${departmentId}:page:${page + 1}` })
      }
      keyboard.row(...paginationRow)
    }

    keyboard
      .text('📥 تصدير Excel', `export:dept:${departmentId}`)
      .row()
      .text('⬅️ رجوع', 'filter:by-department')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })

    // Save filter for export
    ctx.session.lastFilter = {
      type: 'department',
      value: departmentId,
      name: department.name,
    }
  }
  catch (error) {
    logger.error({ error }, 'Error showing department employees')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * عرض العاملين حسب المحافظة
 */
employeeFilterResultsHandler.callbackQuery(/^filter:gov:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const governorateId = Number.parseInt(ctx.match[1])

    const governorate = await Database.prisma.governorate.findUnique({
      where: { id: governorateId },
    })

    if (!governorate) {
      await ctx.answerCallbackQuery('⚠️ المحافظة غير موجودة')
      return
    }

    const employees = await Database.prisma.employee.findMany({
      where: {
        governorateId,
        isActive: true,
      },
      include: {
        position: true,
        department: true,
      },
      orderBy: { fullName: 'asc' },
    })

    // Statistics
    const totalCount = employees.length
    const activeCount = employees.filter(e => e.employmentStatus === 'ACTIVE').length
    const departmentCounts = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'غير محدد'
      acc[deptName] = (acc[deptName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    let message = `📍 **المحافظة: ${governorate.nameAr}**\n\n`
    message += `📊 **الإحصائيات:**\n`
    message += `• إجمالي العاملين: ${totalCount}\n`
    message += `• نشطين: ${activeCount}\n\n`

    message += `🏢 **توزيع الأقسام:**\n`
    Object.entries(departmentCounts).forEach(([dept, count]) => {
      message += `• ${dept}: ${count}\n`
    })
    message += '\n'

    if (employees.length === 0) {
      message += '⚠️ لا يوجد عاملين في هذه المحافظة'
      
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'filter:by-governorate')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
      return
    }

    // Build clickable employee list
    const page = 1
    const itemsPerPage = 10
    const totalPages = Math.ceil(employees.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentPageEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

    message += `👥 **قائمة العاملين** (الصفحة ${page}/${totalPages}):\n\n`

    const keyboard = new InlineKeyboard()

    currentPageEmployees.forEach((emp) => {
      const displayName = emp.nickname || emp.fullName
      const positionTitle = emp.position?.titleAr || 'غير محدد'
      
      keyboard.text(
        `${displayName} (${positionTitle})`,
        `hr:employee:details:${emp.id}`,
      ).row()
    })

    // Pagination if needed
    if (totalPages > 1) {
      const paginationRow: any[] = []
      if (page > 1) {
        paginationRow.push({ text: '◀️ السابق', callback_data: `filter:gov:${governorateId}:page:${page - 1}` })
      }
      paginationRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' })
      if (page < totalPages) {
        paginationRow.push({ text: 'التالي ▶️', callback_data: `filter:gov:${governorateId}:page:${page + 1}` })
      }
      keyboard.row(...paginationRow)
    }

    keyboard
      .text('📥 تصدير Excel', `export:gov:${governorateId}`)
      .row()
      .text('⬅️ رجوع', 'filter:by-governorate')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })

    // Save filter for export
    ctx.session.lastFilter = {
      type: 'governorate',
      value: governorateId,
      name: governorate.nameAr,
    }
  }
  catch (error) {
    logger.error({ error }, 'Error showing governorate employees')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * عرض العاملين حسب الوظيفة
 */
employeeFilterResultsHandler.callbackQuery(/^filter:pos:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const positionId = Number.parseInt(ctx.match[1])

    const position = await Database.prisma.position.findUnique({
      where: { id: positionId },
      include: {
        department: true,
      },
    })

    if (!position) {
      await ctx.answerCallbackQuery('⚠️ الوظيفة غير موجودة')
      return
    }

    const employees = await Database.prisma.employee.findMany({
      where: {
        positionId,
        isActive: true,
      },
      include: {
        governorate: true,
        department: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const totalCount = employees.length
    const activeCount = employees.filter(e => e.employmentStatus === 'ACTIVE').length

    let message = `💼 **الوظيفة: ${position.titleAr}**\n`
    message += `🏢 **القسم: ${position.department.name}**\n\n`
    message += `📊 **الإحصائيات:**\n`
    message += `• إجمالي العاملين: ${totalCount}\n`
    message += `• نشطين: ${activeCount}\n\n`

    if (employees.length === 0) {
      message += '⚠️ لا يوجد عاملين في هذه الوظيفة'
      
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'filter:by-position')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
      return
    }

    // Build clickable employee list
    const page = 1
    const itemsPerPage = 10
    const totalPages = Math.ceil(employees.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentPageEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

    message += `👥 **قائمة العاملين** (الصفحة ${page}/${totalPages}):\n\n`

    const keyboard = new InlineKeyboard()

    currentPageEmployees.forEach((emp) => {
      const displayName = emp.nickname || emp.fullName
      const positionTitle = position.titleAr
      
      keyboard.text(
        `${displayName} (${positionTitle})`,
        `hr:employee:details:${emp.id}`,
      ).row()
    })

    // Pagination if needed
    if (totalPages > 1) {
      const paginationRow: any[] = []
      if (page > 1) {
        paginationRow.push({ text: '◀️ السابق', callback_data: `filter:pos:${positionId}:page:${page - 1}` })
      }
      paginationRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' })
      if (page < totalPages) {
        paginationRow.push({ text: 'التالي ▶️', callback_data: `filter:pos:${positionId}:page:${page + 1}` })
      }
      keyboard.row(...paginationRow)
    }

    keyboard
      .text('📥 تصدير Excel', `export:pos:${positionId}`)
      .row()
      .text('⬅️ رجوع', 'filter:by-position')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })

    // Save filter for export
    ctx.session.lastFilter = {
      type: 'position',
      value: positionId,
      name: position.titleAr,
    }
  }
  catch (error) {
    logger.error({ error }, 'Error showing position employees')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * عرض العاملين حسب الحالة
 */
employeeFilterResultsHandler.callbackQuery(/^filter:status:(.+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

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
        position: true,
        department: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const totalCount = employees.length

    // Department distribution
    const departmentCounts = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'غير محدد'
      acc[deptName] = (acc[deptName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    let message = `📊 **الحالة: ${statusNames[status] || status}**\n\n`
    message += `📈 **الإحصائيات:**\n`
    message += `• إجمالي العاملين: ${totalCount}\n\n`

    if (totalCount > 0) {
      message += `🏢 **توزيع الأقسام:**\n`
      Object.entries(departmentCounts).forEach(([dept, count]) => {
        message += `• ${dept}: ${count}\n`
      })
      message += '\n'
    }

    if (employees.length === 0) {
      message += '⚠️ لا يوجد عاملين بهذه الحالة'
      
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'filter:by-status')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
      return
    }

    // Build clickable employee list
    const page = 1
    const itemsPerPage = 10
    const totalPages = Math.ceil(employees.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentPageEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

    message += `👥 **قائمة العاملين** (الصفحة ${page}/${totalPages}):\n\n`

    const keyboard = new InlineKeyboard()

    currentPageEmployees.forEach((emp) => {
      const statusEmoji = emp.employmentStatus === 'ACTIVE' ? '✅' : '⏸️'
      const displayName = `${statusEmoji} ${emp.nickname || emp.fullName}`
      const positionTitle = emp.position?.titleAr || 'غير محدد'
      
      keyboard.text(
        `${displayName} (${positionTitle})`,
        `hr:employee:details:${emp.id}`,
      ).row()
    })

    // Pagination if needed
    if (totalPages > 1) {
      const paginationRow: any[] = []
      if (page > 1) {
        paginationRow.push({ text: '◀️ السابق', callback_data: `filter:status:${status}:page:${page - 1}` })
      }
      paginationRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' })
      if (page < totalPages) {
        paginationRow.push({ text: 'التالي ▶️', callback_data: `filter:status:${status}:page:${page + 1}` })
      }
      keyboard.row(...paginationRow)
    }

    keyboard
      .text('📥 تصدير Excel', `export:status:${status}`)
      .row()
      .text('⬅️ رجوع', 'filter:by-status')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })

    // Save filter for export
    ctx.session.lastFilter = {
      type: 'status',
      value: status,
      name: statusNames[status],
    }
  }
  catch (error) {
    logger.error({ error }, 'Error showing status employees')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * عرض جميع العاملين (بدون تصفية)
 */
employeeFilterResultsHandler.callbackQuery('filter:all', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const employees = await Database.prisma.employee.findMany({
      where: {
        isActive: true,
      },
      include: {
        position: true,
        department: true,
        governorate: true,
      },
      orderBy: { fullName: 'asc' },
    })

    const totalCount = employees.length
    const activeCount = employees.filter(e => e.employmentStatus === 'ACTIVE').length
    const onLeaveCount = employees.filter(e => e.employmentStatus === 'ON_LEAVE').length

    // Department distribution
    const departmentCounts = employees.reduce((acc, emp) => {
      const deptName = emp.department?.name || 'غير محدد'
      acc[deptName] = (acc[deptName] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    let message = `👥 **جميع العاملين**\n\n`
    message += `📊 **الإحصائيات العامة:**\n`
    message += `• إجمالي العاملين: ${totalCount}\n`
    message += `• نشطين: ${activeCount}\n`
    message += `• في إجازة: ${onLeaveCount}\n\n`

    message += `🏢 **توزيع الأقسام:**\n`
    Object.entries(departmentCounts).slice(0, 5).forEach(([dept, count]) => {
      message += `• ${dept}: ${count}\n`
    })

    if (Object.keys(departmentCounts).length > 5) {
      message += `• _...و ${Object.keys(departmentCounts).length - 5} قسم آخر_\n`
    }
    message += '\n'

    if (employees.length === 0) {
      message += '⚠️ لا يوجد عاملين في النظام'
      
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'employeesListHandler')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
      return
    }

    // Build clickable employee list
    const page = 1
    const itemsPerPage = 10
    const totalPages = Math.ceil(employees.length / itemsPerPage)
    const startIndex = (page - 1) * itemsPerPage
    const currentPageEmployees = employees.slice(startIndex, startIndex + itemsPerPage)

    message += `👥 **قائمة العاملين** (الصفحة ${page}/${totalPages}):\n\n`

    const keyboard = new InlineKeyboard()

    currentPageEmployees.forEach((emp) => {
      const statusEmoji = emp.employmentStatus === 'ACTIVE' ? '✅' : '⏸️'
      const displayName = `${statusEmoji} ${emp.nickname || emp.fullName}`
      const positionTitle = emp.position?.titleAr || 'غير محدد'
      
      keyboard.text(
        `${displayName} (${positionTitle})`,
        `hr:employee:details:${emp.id}`,
      ).row()
    })

    // Pagination if needed
    if (totalPages > 1) {
      const paginationRow: any[] = []
      if (page > 1) {
        paginationRow.push({ text: '◀️ السابق', callback_data: `filter:all:page:${page - 1}` })
      }
      paginationRow.push({ text: `${page}/${totalPages}`, callback_data: 'noop' })
      if (page < totalPages) {
        paginationRow.push({ text: 'التالي ▶️', callback_data: `filter:all:page:${page + 1}` })
      }
      keyboard.row(...paginationRow)
    }

    keyboard
      .text('📥 تصدير الكل Excel', 'export:all-employees')
      .row()
      .text('⬅️ رجوع', 'employeesListHandler')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })

    // Save filter for export
    ctx.session.lastFilter = {
      type: 'all',
      value: null,
      name: 'جميع العاملين',
    }
  }
  catch (error) {
    logger.error({ error }, 'Error showing all employees')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

export { employeeFilterResultsHandler }
