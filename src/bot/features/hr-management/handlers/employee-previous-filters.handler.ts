/**
 * Previous Employee Filters Handler
 * معالج تصفية العاملين السابقين
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const employeePreviousFiltersHandler = new Composer<Context>()

/**
 * تصفية العاملين السابقين حسب القسم - عرض قائمة الأقسام
 */
employeePreviousFiltersHandler.callbackQuery('filter:prev:by-department', async (ctx) => {
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
            .text('⬅️ رجوع', 'hr:employees:view-previous'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    departments.forEach((dept) => {
      keyboard
        .text(
          `${dept.name} (${dept.code})`,
          `filter:prev:dept:${dept.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'hr:employees:view-previous')

    await ctx.editMessageText(
      '🏢 **اختر القسم (العاملين السابقين):**\n\n'
      + `عدد الأقسام: ${departments.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing previous departments filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية العاملين السابقين حسب المحافظة - عرض قائمة المحافظات
 */
employeePreviousFiltersHandler.callbackQuery('filter:prev:by-governorate', async (ctx) => {
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
            .text('⬅️ رجوع', 'hr:employees:view-previous'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    governorates.forEach((gov) => {
      keyboard
        .text(
          `${gov.nameAr}`,
          `filter:prev:gov:${gov.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'hr:employees:view-previous')

    await ctx.editMessageText(
      '📍 **اختر المحافظة (العاملين السابقين):**\n\n'
      + `عدد المحافظات: ${governorates.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing previous governorates filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية العاملين السابقين حسب الوظيفة - عرض قائمة الوظائف
 */
employeePreviousFiltersHandler.callbackQuery('filter:prev:by-position', async (ctx) => {
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
            .text('⬅️ رجوع', 'hr:employees:view-previous'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    positions.forEach((pos) => {
      keyboard
        .text(
          `${pos.titleAr}`,
          `filter:prev:pos:${pos.id}`,
        )
        .row()
    })

    keyboard.text('⬅️ رجوع', 'hr:employees:view-previous')

    await ctx.editMessageText(
      '💼 **اختر الوظيفة (العاملين السابقين):**\n\n'
      + `عدد الوظائف: ${positions.length}`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing previous positions filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * تصفية العاملين السابقين حسب سبب الخروج
 */
employeePreviousFiltersHandler.callbackQuery('filter:prev:by-exit-reason', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const keyboard = new InlineKeyboard()
      .text('📤 مستقيل (RESIGNED)', 'filter:prev:status:RESIGNED')
      .row()
      .text('🚫 مفصول (TERMINATED)', 'filter:prev:status:TERMINATED')
      .row()
      .text('👴 متقاعد (RETIRED)', 'filter:prev:status:RETIRED')
      .row()
      .text('💼 مسوى (SETTLED)', 'filter:prev:status:SETTLED')
      .row()
      .text('⬅️ رجوع', 'hr:employees:view-previous')

    await ctx.editMessageText(
      '📊 **اختر سبب الخروج:**\n\n'
      + 'اختر الحالة لعرض العاملين السابقين',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing previous exit reasons filter')
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})
