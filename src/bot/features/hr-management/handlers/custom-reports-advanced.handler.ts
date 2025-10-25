import type { Context } from '#root/bot/context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const customReportsAdvancedHandler = new Composer<Context>()

customReportsAdvancedHandler.callbackQuery('custom-report:advanced-filters', async (ctx) => {
  await ctx.answerCallbackQuery()

  const advFilters = ctx.session.customReport?.advancedFilters || {}
  let filterText = '✨ **الفلاتر المتقدمة:**\n\n'
  
  if (advFilters.hireDateFrom || advFilters.hireDateTo) {
    filterText += `📅 تاريخ التعيين: ${advFilters.hireDateFrom || '...'} → ${advFilters.hireDateTo || '...'}\n`
  }
  if (advFilters.salaryFrom || advFilters.salaryTo) {
    filterText += `💵 الراتب: ${advFilters.salaryFrom || '...'} → ${advFilters.salaryTo || '...'}\n`
  }
  if (advFilters.ageFrom || advFilters.ageTo) {
    filterText += `🎂 العمر: ${advFilters.ageFrom || '...'} → ${advFilters.ageTo || '...'}\n`
  }
  if (advFilters.experienceFrom || advFilters.experienceTo) {
    filterText += `🏆 الخبرة: ${advFilters.experienceFrom || '...'} → ${advFilters.experienceTo || '...'}\n`
  }

  if (!advFilters.hireDateFrom && !advFilters.salaryFrom && !advFilters.ageFrom && !advFilters.experienceFrom) {
    filterText += 'لا توجد فلاتر متقدمة\n'
  }

  const keyboard = new InlineKeyboard()
    .text('📅 نطاق تاريخ التعيين', 'custom-report:adv:hire-date')
    .row()
    .text('💵 نطاق الراتب', 'custom-report:adv:salary')
    .row()
    .text('🎂 نطاق العمر', 'custom-report:adv:age')
    .row()
    .text('🏆 نطاق الخبرة', 'custom-report:adv:experience')
    .row()
    .text('🗑️ مسح الفلاتر المتقدمة', 'custom-report:clear-adv-filters')
    .row()
    .text('⬅️ رجوع', 'custom-report:add-filters')

  await ctx.editMessageText(filterText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard
  })
})

customReportsAdvancedHandler.callbackQuery('custom-report:clear-adv-filters', async (ctx) => {
  await ctx.answerCallbackQuery('✅ تم مسح الفلاتر المتقدمة')
  if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
  ctx.session.customReport.advancedFilters = {}
  await ctx.editMessageText('✅ تم مسح جميع الفلاتر المتقدمة', {
    reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:advanced-filters')
  })
})

customReportsAdvancedHandler.callbackQuery(/^custom-report:adv:(hire-date|salary|age|experience)$/, async (ctx) => {
  const filterType = ctx.match[1]
  await ctx.answerCallbackQuery()

  const messages: Record<string, string> = {
    'hire-date': '📅 أرسل نطاق تاريخ التعيين\nمثال: 2020-01-01 2023-12-31',
    'salary': '💵 أرسل نطاق الراتب\nمثال: 5000 15000',
    'age': '🎂 أرسل نطاق العمر\nمثال: 25 50',
    'experience': '🏆 أرسل نطاق سنوات الخبرة\nمثال: 2 10'
  }

  ctx.session.awaitingInput = {
    type: `adv-filter-${filterType}`,
    data: {}
  }

  await ctx.editMessageText(messages[filterType])
})

customReportsAdvancedHandler.on('message:text', async (ctx, next) => {
  const inputType = ctx.session.awaitingInput?.type
  
  if (inputType?.startsWith('adv-filter-')) {
    const filterType = inputType.replace('adv-filter-', '')
    const text = ctx.message.text.trim()
    
    if (!ctx.session.customReport) ctx.session.customReport = { fields: [], filters: {} }
    if (!ctx.session.customReport.advancedFilters) ctx.session.customReport.advancedFilters = {}

    if (filterType === 'hire-date') {
      const dates = text.split(' ')
      if (dates.length === 2) {
        ctx.session.customReport.advancedFilters.hireDateFrom = dates[0]
        ctx.session.customReport.advancedFilters.hireDateTo = dates[1]
        await ctx.reply('✅ تم إضافة فلتر تاريخ التعيين', {
          reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:advanced-filters')
        })
      }
    } else if (filterType === 'salary') {
      const range = text.split(' ').map(Number)
      if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
        ctx.session.customReport.advancedFilters.salaryFrom = range[0]
        ctx.session.customReport.advancedFilters.salaryTo = range[1]
        await ctx.reply('✅ تم إضافة فلتر الراتب', {
          reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:advanced-filters')
        })
      }
    } else if (filterType === 'age') {
      const range = text.split(' ').map(Number)
      if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
        ctx.session.customReport.advancedFilters.ageFrom = range[0]
        ctx.session.customReport.advancedFilters.ageTo = range[1]
        await ctx.reply('✅ تم إضافة فلتر العمر', {
          reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:advanced-filters')
        })
      }
    } else if (filterType === 'experience') {
      const range = text.split(' ').map(Number)
      if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
        ctx.session.customReport.advancedFilters.experienceFrom = range[0]
        ctx.session.customReport.advancedFilters.experienceTo = range[1]
        await ctx.reply('✅ تم إضافة فلتر الخبرة', {
          reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'custom-report:advanced-filters')
        })
      }
    }

    ctx.session.awaitingInput = undefined
    return
  }
  
  return next()
})
