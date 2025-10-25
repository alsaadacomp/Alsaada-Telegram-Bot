import type { Context } from '#root/bot/context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const customReportsHandler = new Composer<Context>()

customReportsHandler.callbackQuery('customReportsHandler', async (ctx) => {
  await handleCustomReports(ctx)
})

customReportsHandler.callbackQuery(/^menu:sub:hr-management:custom-reports$/, async (ctx) => {
  await handleCustomReports(ctx)
})

async function handleCustomReports(ctx: Context) {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('👥 تقرير العاملين المخصص', 'custom-report:employee')
    .row()
    .text('⬅️ رجوع', 'menu:feature:hr-management')

  await ctx.editMessageText(
    '📊 **التقارير المخصصة**\n\n'
    + '🎯 **إنشاء تقارير احترافية متقدمة:**\n\n'
    + '• **تقرير العاملين المخصص** - اختر الحقول والفلاتر\n'
    + '• إحصائيات ذكية ومتقدمة\n'
    + '• تصدير Excel احترافي\n\n'
    + '📌 اختر نوع التقرير:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
}
