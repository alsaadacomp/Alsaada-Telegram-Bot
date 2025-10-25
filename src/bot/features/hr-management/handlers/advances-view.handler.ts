import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const viewAdvancesHandler = new Composer<Context>()

viewAdvancesHandler.callbackQuery(/^hr:advances:view$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:hr-management:advances')

  await ctx.editMessageText(
    '📊 **عرض مسحوبات عامل**\n\n⏳ الوظيفة قيد التطوير...',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})
