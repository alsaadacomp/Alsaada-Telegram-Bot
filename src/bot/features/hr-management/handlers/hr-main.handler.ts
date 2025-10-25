import type { Context } from '../../../context.js'
import { Composer } from 'grammy'
import { MenuBuilder } from '../../registry/menu-builder.js'
import type { UserRole } from '../../registry/types.js'

export const hrMainHandler = new Composer<Context>()

/**
 * Handler للقائمة الرئيسية لشئون العاملين
 * يستخدم MenuBuilder لبناء القائمة تلقائياً
 */
hrMainHandler.callbackQuery(/^menu:feature:hr-management$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  
  // تحويل Role إلى UserRole (معالجة MODERATOR)
  const dbRole = ctx.dbUser?.role ?? 'GUEST'
  const userRole: UserRole = dbRole === 'MODERATOR' ? 'USER' : dbRole as UserRole
  
  // استخدام MenuBuilder لبناء القائمة تلقائياً من config.ts
  const keyboard = MenuBuilder.buildSubMenu('hr-management', userRole, {
    maxButtonsPerRow: 1,
    showBackButton: true,
    backButtonText: '⬅️ رجوع للقائمة الرئيسية'
  })
  
  if (!keyboard) {
    await ctx.answerCallbackQuery('⚠️ القسم غير متاح')
    return
  }

  await ctx.editMessageText(
    '👥 **شئون العاملين**\n\n'
    + 'إدارة شاملة للموارد البشرية\n\n'
    + '📌 اختر القسم المطلوب:',
    { parse_mode: 'Markdown', reply_markup: keyboard }
  )
})
