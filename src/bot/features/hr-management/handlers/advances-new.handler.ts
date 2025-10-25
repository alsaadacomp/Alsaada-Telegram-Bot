import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const newAdvanceHandler = new Composer<Context>()

newAdvanceHandler.callbackQuery(/^hr:advances:new$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:hr-management:advances')

  await ctx.editMessageText(
    '➕ **تسجيل مسحوب جديد**\n\n⏳ الوظيفة قيد التطوير...',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})
