import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const employeesListHandler = new Composer<Context>()

// Pattern من handler name (MenuBuilder يستخدمه)
employeesListHandler.callbackQuery('employeesListHandler', async (ctx) => {
  await handleEmployeesList(ctx)
})

// Pattern من MenuBuilder (الصيغة القياسية)
employeesListHandler.callbackQuery(/^menu:sub:hr-management:employees-list$/, async (ctx) => {
  await handleEmployeesList(ctx)
})

async function handleEmployeesList(ctx: Context) {
  await ctx.answerCallbackQuery()
  
  // معالجة MODERATOR
  const dbRole = ctx.dbUser?.role ?? 'GUEST'
  const userRole = dbRole === 'MODERATOR' ? 'USER' : dbRole
  
  const keyboard = new InlineKeyboard()
  
  // خيار إضافة عامل جديد (ADMIN و SUPER_ADMIN فقط)
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    keyboard.text('➕ إضافة عامل جديد', 'hr:employees:add').row()
  }
  
  // خيار عرض العاملين الحاليين (متاح للجميع)
  keyboard.text('👷 عرض العاملين الحاليين', 'hr:employees:view-current').row()
  
  // خيار عرض العاملين السابقين (ADMIN و SUPER_ADMIN فقط)
  if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
    keyboard.text('📂 عرض العاملين السابقين', 'hr:employees:view-previous').row()
  }
  
  keyboard.text('⬅️ رجوع', 'menu:feature:hr-management')

  await ctx.editMessageText(
    '📋 **قوائم العاملين**\n\n'
    + 'إدارة بيانات العاملين الحاليين والسابقين\n\n'
    + 'اختر من الخيارات التالية:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
}
