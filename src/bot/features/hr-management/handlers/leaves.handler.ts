import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const leavesHandler = new Composer<Context>()

// Pattern من handler name (MenuBuilder يستخدمه)
leavesHandler.callbackQuery('leavesHandler', async (ctx) => {
  await handleLeaves(ctx)
})

// Pattern من MenuBuilder (الصيغة القياسية)
leavesHandler.callbackQuery(/^menu:sub:hr-management:leaves$/, async (ctx) => {
  await handleLeaves(ctx)
})

async function handleLeaves(ctx: Context) {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:feature:hr-management')

  await ctx.editMessageText(
    '🏖️ **الإجازات والماموريات**\n\n⏳ الوظيفة قيد التطوير...',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
}
