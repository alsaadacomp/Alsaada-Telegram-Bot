import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const advancesReportsHandler = new Composer<Context>()

advancesReportsHandler.callbackQuery(/^hr:advances:reports$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:hr-management:advances')

  await ctx.editMessageText(
    '📈 **تقارير المسحوبات**\n\n⏳ الوظيفة قيد التطوير...',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})
