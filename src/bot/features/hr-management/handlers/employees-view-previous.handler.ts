import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'
import { Database } from '../../../../modules/database/index.js'

export const viewPreviousEmployeesHandler = new Composer<Context>()

// معالج عرض العاملين السابقين
viewPreviousEmployeesHandler.callbackQuery(/^hr:employees:view-previous(:\d+)?$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  
  const page = parseInt(ctx.match[1]?.slice(1) || '0')
  const pageSize = 15
  
  try {
    const prisma = Database.prisma
    
    // جلب العاملين السابقين
    const employees = await prisma.employee.findMany({
      where: {
        OR: [
          { isActive: false },
          { employmentStatus: { not: 'ACTIVE' } },
          { resignationDate: { not: null } },
          { terminationDate: { not: null } }
        ]
      },
      include: {
        position: {
          select: {
            titleAr: true,
            title: true
          }
        }
      },
      orderBy: {
        fullName: 'asc'
      },
      skip: page * pageSize,
      take: pageSize + 1 // +1 لمعرفة إذا كان هناك المزيد
    })

    const hasNextPage = employees.length > pageSize
    const currentPageEmployees = hasNextPage ? employees.slice(0, pageSize) : employees

    if (currentPageEmployees.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('⬅️ رجوع', 'menu:sub:hr-management:employees-list')

      await ctx.editMessageText(
        '📂 عرض العاملين السابقين\n\n❌ لا يوجد عاملين سابقين في النظام.',
        { reply_markup: keyboard }
      )
      return
    }

    // إنشاء لوحة المفاتيح
    const keyboard = new InlineKeyboard()
    
    // إضافة أزرار العاملين (عمود واحد)
    for (const emp of currentPageEmployees) {
      const empText = `${emp.nickname || emp.fullName} (${emp.position?.titleAr || emp.position?.title || 'غير محدد'})`
      keyboard.text(
        empText.length > 30 ? empText.substring(0, 27) + '...' : empText,
        `hr:employee:details:${emp.id}`
      ).row()
    }

    // إضافة أزرار التنقل
    const navigationRow = []
    
    if (page > 0) {
      navigationRow.push({
        text: '⬅️ السابق',
        callback_data: `hr:employees:view-previous:${page - 1}`
      })
    }
    
    navigationRow.push({
      text: '⬅️ رجوع',
      callback_data: 'menu:sub:hr-management:employees-list'
    })
    
    if (hasNextPage) {
      navigationRow.push({
        text: 'التالي ➡️',
        callback_data: `hr:employees:view-previous:${page + 1}`
      })
    }
    
    keyboard.row(...navigationRow)

    const startIndex = page * pageSize + 1
    const endIndex = startIndex + currentPageEmployees.length - 1
    const totalText = hasNextPage ? `${startIndex}-${endIndex}+` : `${startIndex}-${endIndex}`

    await ctx.editMessageText(
      `📂 عرض العاملين السابقين\n\n` +
      `📊 الصفحة ${page + 1} - العاملين ${totalText}\n\n` +
      `اختر العامل لعرض تفاصيله:`,
      { reply_markup: keyboard }
    )

  } catch (error) {
    console.error('Error loading previous employees:', error)
    
    const keyboard = new InlineKeyboard()
      .text('⬅️ رجوع', 'menu:sub:hr-management:employees-list')
    
    await ctx.editMessageText(
      '❌ حدث خطأ في تحميل بيانات العاملين السابقين.\n\n' +
      'يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.',
      { reply_markup: keyboard }
    )
  }
})