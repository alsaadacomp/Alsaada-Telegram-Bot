import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const advancesHandler = new Composer<Context>()

// Pattern من handler name (MenuBuilder يستخدمه)
advancesHandler.callbackQuery('advancesHandler', async (ctx) => {
  await handleAdvances(ctx)
})

// Pattern من MenuBuilder (الصيغة القياسية)
advancesHandler.callbackQuery(/^menu:sub:hr-management:advances$/, async (ctx) => {
  await handleAdvances(ctx)
})

async function handleAdvances(ctx: Context) {
  await ctx.answerCallbackQuery()
  
  const keyboard = new InlineKeyboard()
    .text('➕ تسجيل مسحوب جديد', 'hr:advances:new')
    .row()
    .text('📊 عرض مسحوبات عامل', 'hr:advances:view')
    .row()
    .text('📈 تقارير المسحوبات', 'hr:advances:reports')
    .row()
    .text('⬅️ رجوع', 'menu:feature:hr-management')

  await ctx.editMessageText(
    '💰 **السلف والمسحوبات**\n\n'
    + 'إدارة السلف والمسحوبات المالية\n\n'
    + 'اختر من الخيارات التالية:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
}
