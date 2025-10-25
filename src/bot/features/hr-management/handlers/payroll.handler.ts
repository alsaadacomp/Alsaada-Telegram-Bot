import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const payrollHandler = new Composer<Context>()

// Pattern من handler name (MenuBuilder يستخدمه)
payrollHandler.callbackQuery('payrollHandler', async (ctx) => {
  await handlePayroll(ctx)
})

// Pattern من MenuBuilder (الصيغة القياسية)
payrollHandler.callbackQuery(/^menu:sub:hr-management:payroll$/, async (ctx) => {
  await handlePayroll(ctx)
})

async function handlePayroll(ctx: Context) {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:feature:hr-management')

  await ctx.editMessageText(
    '💵 **الرواتب والأجور**\n\n⏳ الوظيفة قيد التطوير...',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
}
