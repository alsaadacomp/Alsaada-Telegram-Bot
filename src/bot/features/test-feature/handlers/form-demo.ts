/**
 * Form Demo Handler - تدفق تفاعلي كامل
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const formDemoHandler = new Composer<Context>()

// تخزين مؤقت لبيانات النموذج
const formData = new Map<number, any>()

/**
 * عرض القائمة الرئيسية للنموذج
 */
formDemoHandler.callbackQuery(/^menu:sub:test-feature:form-demo$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const keyboard = new InlineKeyboard()
      .text('✍️ ابدأ ملء النموذج', 'form:start')
      .row()
      .text('📋 عرض البيانات المحفوظة', 'form:show')
      .row()
      .text('🗑️ حذف البيانات', 'form:clear')
      .row()
      .text('⬅️ رجوع', 'menu:back')

    await ctx.editMessageText(
      '📝 **نموذج تسجيل مستخدم - تجريبي**\n\n'
      + 'هذا نموذج تفاعلي كامل يستخدم:\n'
      + '✅ Form Builder Module\n'
      + '✅ التحقق من البيانات\n'
      + '✅ التخزين المؤقت\n\n'
      + '**الحقول المطلوبة:**\n'
      + '1️⃣ الاسم الكامل (3-50 حرف)\n'
      + '2️⃣ البريد الإلكتروني\n'
      + '3️⃣ رقم الهاتف المصري\n'
      + '4️⃣ العمر (18-100)\n'
      + '5️⃣ القسم\n\n'
      + 'اختر من القائمة:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error in form demo:', error)
  }
})

/**
 * بدء ملء النموذج - الخطوة 1: الاسم
 */
formDemoHandler.callbackQuery('form:start', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const userId = ctx.from?.id
    if (!userId)
      return

    // تهيئة البيانات
    formData.set(userId, { step: 'name' })

    await ctx.editMessageText(
      '📝 **الخطوة 1/5: الاسم الكامل**\n\n'
      + 'الرجاء إدخال اسمك الكامل (3-50 حرف):\n\n'
      + '✅ يجب أن يحتوي على 3 أحرف على الأقل\n'
      + '✅ بحد أقصى 50 حرف\n\n'
      + '_مثال: أحمد محمد علي_',
      { parse_mode: 'Markdown' },
    )
  }
  catch (error) {
    console.error('Error:', error)
  }
})

/**
 * استقبال الاسم
 */
formDemoHandler.on('message:text', async (ctx, next) => {
  const userId = ctx.from?.id
  if (!userId)
    return next()

  const data = formData.get(userId)
  if (!data)
    return next()

  const text = ctx.message.text

  switch (data.step) {
    case 'name':
      if (text.length < 3 || text.length > 50) {
        await ctx.reply('❌ الاسم يجب أن يكون بين 3 و 50 حرف. حاول مرة أخرى:')
        return
      }
      data.name = text
      data.step = 'email'
      formData.set(userId, data)

      await ctx.reply(
        '✅ تم حفظ الاسم!\n\n'
        + '📝 **الخطوة 2/5: البريد الإلكتروني**\n\n'
        + 'الرجاء إدخال بريدك الإلكتروني:\n\n'
        + '_مثال: example@domain.com_',
        { parse_mode: 'Markdown' },
      )
      break

    case 'email': {
      const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
      if (!emailRegex.test(text)) {
        await ctx.reply('❌ البريد الإلكتروني غير صالح. حاول مرة أخرى:')
        return
      }
      data.email = text
      data.step = 'phone'
      formData.set(userId, data)

      await ctx.reply(
        '✅ تم حفظ البريد!\n\n'
        + '📝 **الخطوة 3/5: رقم الهاتف**\n\n'
        + 'الرجاء إدخال رقم هاتفك المصري:\n\n'
        + '_مثال: 01012345678_',
        { parse_mode: 'Markdown' },
      )
      break
    }

    case 'phone': {
      const phoneRegex = /^(010|011|012|015)\d{8}$/
      if (!phoneRegex.test(text)) {
        await ctx.reply('❌ رقم الهاتف المصري غير صالح. حاول مرة أخرى:')
        return
      }
      data.phone = text
      data.step = 'age'
      formData.set(userId, data)

      await ctx.reply(
        '✅ تم حفظ رقم الهاتف!\n\n'
        + '📝 **الخطوة 4/5: العمر**\n\n'
        + 'الرجاء إدخال عمرك (18-100):\n\n'
        + '_مثال: 25_',
        { parse_mode: 'Markdown' },
      )
      break
    }

    case 'age': {
      const age = Number.parseInt(text)
      if (Number.isNaN(age) || age < 18 || age > 100) {
        await ctx.reply('❌ العمر يجب أن يكون بين 18 و 100. حاول مرة أخرى:')
        return
      }
      data.age = age
      data.step = 'department'
      formData.set(userId, data)

      const keyboard = new InlineKeyboard()
        .text('👥 الموارد البشرية', 'dept:hr')
        .row()
        .text('💰 المالية', 'dept:finance')
        .row()
        .text('💻 تقنية المعلومات', 'dept:it')
        .row()
        .text('📢 التسويق', 'dept:marketing')

      await ctx.reply(
        '✅ تم حفظ العمر!\n\n'
        + '📝 **الخطوة 5/5: القسم**\n\n'
        + 'اختر القسم الذي تعمل به:',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      break
    }

    default:
      return next()
  }
})

/**
 * اختيار القسم
 */
formDemoHandler.callbackQuery(/^dept:(.+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const userId = ctx.from?.id
    if (!userId)
      return

    const data = formData.get(userId)
    if (!data || data.step !== 'department')
      return

    const deptMap: any = {
      hr: 'الموارد البشرية',
      finance: 'المالية',
      it: 'تقنية المعلومات',
      marketing: 'التسويق',
    }

    const deptId = ctx.match![1]
    data.department = deptMap[deptId]
    data.step = 'completed'
    formData.set(userId, data)

    await ctx.editMessageText(
      '🎉 **تم إكمال النموذج بنجاح!**\n\n'
      + '**البيانات المُدخلة:**\n'
      + `👤 **الاسم:** ${data.name}\n`
      + `📧 **البريد:** ${data.email}\n`
      + `📱 **الهاتف:** ${data.phone}\n`
      + `🎂 **العمر:** ${data.age}\n`
      + `🏢 **القسم:** ${data.department}\n\n`
      + '✅ تم حفظ البيانات بنجاح!\n\n'
      + '_يمكنك عرض البيانات أو حذفها من القائمة الرئيسية._',
      { parse_mode: 'Markdown' },
    )
  }
  catch (error) {
    console.error('Error:', error)
  }
})

/**
 * عرض البيانات المحفوظة
 */
formDemoHandler.callbackQuery('form:show', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const userId = ctx.from?.id
    if (!userId)
      return

    const data = formData.get(userId)

    if (!data || data.step !== 'completed') {
      await ctx.editMessageText(
        '⚠️ **لا توجد بيانات محفوظة**\n\n'
        + 'الرجاء ملء النموذج أولاً.',
        { parse_mode: 'Markdown' },
      )
      return
    }

    const keyboard = new InlineKeyboard()
      .text('⬅️ رجوع', 'menu:sub:test-feature:form-demo')

    await ctx.editMessageText(
      '📋 **البيانات المحفوظة:**\n\n'
      + `👤 **الاسم:** ${data.name}\n`
      + `📧 **البريد:** ${data.email}\n`
      + `📱 **الهاتف:** ${data.phone}\n`
      + `🎂 **العمر:** ${data.age}\n`
      + `🏢 **القسم:** ${data.department}\n\n`
      + '✅ البيانات صالحة ومحفوظة',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error:', error)
  }
})

/**
 * حذف البيانات
 */
formDemoHandler.callbackQuery('form:clear', async (ctx) => {
  try {
    await ctx.answerCallbackQuery('تم حذف البيانات!')

    const userId = ctx.from?.id
    if (!userId)
      return

    formData.delete(userId)

    const keyboard = new InlineKeyboard()
      .text('⬅️ رجوع', 'menu:sub:test-feature:form-demo')

    await ctx.editMessageText(
      '🗑️ **تم حذف البيانات**\n\n'
      + 'تم حذف جميع البيانات المحفوظة بنجاح.\n\n'
      + 'يمكنك البدء من جديد.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error:', error)
  }
})
