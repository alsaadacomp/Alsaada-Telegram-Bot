/**
 * Employee Filters Handler
 * معالج تصفية العاملين
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

const employeeFiltersHandler = new Composer<Context>()

// No longer needed - filters are now shown directly in employees-list.handler
// This handler is kept for backwards compatibility if needed

// REMOVED: This menu is now integrated into employees-list.handler
// Keeping the handler registration for filter type selection only

/**
 * تصفية حسب القسم - عرض قائمة الأقسام
 */
employeeFiltersHandler.callbackQuery('filter:by-department', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const departments = await Database.prisma.department.findMany({
      orderBy: { name: 'asc' },
    })

    if (departments.length === 0) {
      await ctx.editMessageText(
        '⚠️ **لا توجد أقسام مسجلة**\n\n'
        + 'يرجى إضافة أقسام أولاً',
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('⬅️ رجوع', 'employeesListHandler'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    departments.forEach((dept) => {
      keyboard
        .text(
          `${dept.name} (${dept.code})`,
          `filter:dept:${dept.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'employeesListHandler')

    await ctx.editMessageText(
      '🏢 **اختر القسم:**\n\n'
      + `عدد الأقسام: ${departments.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing departments filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية حسب المحافظة - عرض قائمة المحافظات
 */
employeeFiltersHandler.callbackQuery('filter:by-governorate', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const governorates = await Database.prisma.governorate.findMany({
      orderBy: { orderIndex: 'asc' },
    })

    if (governorates.length === 0) {
      await ctx.editMessageText(
        '⚠️ **لا توجد محافظات مسجلة**',
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('⬅️ رجوع', 'employeesListHandler'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    governorates.forEach((gov) => {
      keyboard
        .text(
          `${gov.nameAr}`,
          `filter:gov:${gov.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'employeesListHandler')

    await ctx.editMessageText(
      '📍 **اختر المحافظة:**\n\n'
      + `عدد المحافظات: ${governorates.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing governorates filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية حسب الوظيفة - عرض قائمة الوظائف
 */
employeeFiltersHandler.callbackQuery('filter:by-position', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const positions = await Database.prisma.position.findMany({
      include: {
        department: true,
      },
      orderBy: { titleAr: 'asc' },
    })

    if (positions.length === 0) {
      await ctx.editMessageText(
        '⚠️ **لا توجد وظائف مسجلة**',
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('⬅️ رجوع', 'employeesListHandler'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    positions.forEach((pos) => {
      keyboard
        .text(
          `${pos.titleAr}`,
          `filter:pos:${pos.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'employeesListHandler')

    await ctx.editMessageText(
      '💼 **اختر الوظيفة:**\n\n'
      + `عدد الوظائف: ${positions.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing positions filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية حسب حالة العمل
 */
employeeFiltersHandler.callbackQuery('filter:by-status', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const keyboard = new InlineKeyboard()
      .text('✅ نشط (ACTIVE)', 'filter:status:ACTIVE')
      .row()
      .text('🏖️ في إجازة (ON_LEAVE)', 'filter:status:ON_LEAVE')
      .row()
      .text('⏸️ موقوف (SUSPENDED)', 'filter:status:SUSPENDED')
      .row()
      .text('📤 مستقيل (RESIGNED)', 'filter:status:RESIGNED')
      .row()
      .text('🚫 مفصول (TERMINATED)', 'filter:status:TERMINATED')
      .row()
      .text('👴 متقاعد (RETIRED)', 'filter:status:RETIRED')
      .row()
      .text('✈️ في مأمورية (ON_MISSION)', 'filter:status:ON_MISSION')
      .row()
      .text('💼 مسوى (SETTLED)', 'filter:status:SETTLED')
      .row()
      .text('⬅️ رجوع', 'employeesListHandler')

    await ctx.editMessageText(
      '📊 **اختر حالة العمل:**',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing status filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

export { employeeFiltersHandler }
