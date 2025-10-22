/**
 * Multi-Step Form Demo Handler - تدفق تفاعلي متعدد الخطوات
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const multiStepDemoHandler = new Composer<Context>()

// تخزين حالة التدفق
const formState = new Map<number, any>()

/**
 * القائمة الرئيسية
 */
multiStepDemoHandler.callbackQuery(/^menu:sub:test-feature:multi-step-demo$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const keyboard = new InlineKeyboard()
      .text('🚀 ابدأ الرحلة', 'multistep:start')
      .row()
      .text('📊 حالة التقدم', 'multistep:progress')
      .row()
      .text('⬅️ رجوع', 'menu:back')

    await ctx.editMessageText(
      '🔄 **نموذج متعدد الخطوات - تجريبي**\n\n'
      + 'رحلة تفاعلية من 5 خطوات:\n\n'
      + '1️⃣ الترحيب\n'
      + '2️⃣ المعلومات الشخصية\n'
      + '3️⃣ الاهتمامات\n'
      + '4️⃣ التفضيلات\n'
      + '5️⃣ التأكيد\n\n'
      + '**المميزات:**\n'
      + '✅ التنقل للأمام والخلف\n'
      + '✅ تتبع التقدم\n'
      + '✅ حفظ البيانات\n\n'
      + 'اختر من القائمة:',
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
 * بدء الرحلة
 */
multiStepDemoHandler.callbackQuery('multistep:start', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const userId = ctx.from?.id
    if (!userId)
      return

    formState.set(userId, {
      step: 1,
      totalSteps: 5,
      data: {},
    })

    showStep(ctx, userId, 1)
  }
  catch (error) {
    console.error('Error:', error)
  }
})

/**
 * عرض خطوة محددة
 */
async function showStep(ctx: Context, userId: number, step: number) {
  const state = formState.get(userId)
  if (!state)
    return

  const progress = Math.round((step / state.totalSteps) * 100)
  const progressBar = '▰'.repeat(step) + '▱'.repeat(state.totalSteps - step)

  let message = ''
  const keyboard = new InlineKeyboard()

  switch (step) {
    case 1:
      message
        = '🎉 **مرحباً بك!**\n\n'
          + `التقدم: ${progress}% ${progressBar}\n`
          + `الخطوة: ${step}/${state.totalSteps}\n\n`
          + '👋 هذه بداية رحلتك!\n\n'
          + 'سنقوم بجمع بعض المعلومات البسيطة عنك.\n'
          + 'لا تقلق، يمكنك العودة للخطوة السابقة في أي وقت.\n\n'
          + 'هل أنت مستعد للبدء؟'

      keyboard
        .text('التالي ➡️', 'multistep:next')
        .row()
        .text('❌ إلغاء', 'multistep:cancel')
      break

    case 2:
      message
        = '👤 **المعلومات الشخصية**\n\n'
          + `التقدم: ${progress}% ${progressBar}\n`
          + `الخطوة: ${step}/${state.totalSteps}\n\n`
          + 'الرجاء اختيار العمر:'

      keyboard
        .text('18-25', 'age:18-25')
        .text('26-35', 'age:26-35')
        .row()
        .text('36-50', 'age:36-50')
        .text('50+', 'age:50+')
        .row()
        .text('⬅️ السابق', 'multistep:prev')
        .text('❌ إلغاء', 'multistep:cancel')
      break

    case 3:
      message
        = '🎯 **الاهتمامات**\n\n'
          + `التقدم: ${progress}% ${progressBar}\n`
          + `الخطوة: ${step}/${state.totalSteps}\n\n`
          + `✅ العمر: ${state.data.age}\n\n`
          + 'ما هي اهتماماتك الرئيسية؟'

      keyboard
        .text('💻 التقنية', 'interest:tech')
        .text('🎨 الفن', 'interest:art')
        .row()
        .text('⚽ الرياضة', 'interest:sports')
        .text('📚 القراءة', 'interest:reading')
        .row()
        .text('⬅️ السابق', 'multistep:prev')
        .text('❌ إلغاء', 'multistep:cancel')
      break

    case 4:
      message
        = '⚙️ **التفضيلات**\n\n'
          + `التقدم: ${progress}% ${progressBar}\n`
          + `الخطوة: ${step}/${state.totalSteps}\n\n`
          + `✅ العمر: ${state.data.age}\n`
          + `✅ الاهتمام: ${state.data.interest}\n\n`
          + 'كيف تفضل التواصل؟'

      keyboard
        .text('📧 البريد', 'contact:email')
        .text('📱 الواتساب', 'contact:whatsapp')
        .row()
        .text('💬 تيليجرام', 'contact:telegram')
        .row()
        .text('⬅️ السابق', 'multistep:prev')
        .text('❌ إلغاء', 'multistep:cancel')
      break

    case 5:
      message
        = '✅ **التأكيد النهائي**\n\n'
          + `التقدم: ${progress}% ${progressBar}\n`
          + `الخطوة: ${step}/${state.totalSteps}\n\n`
          + '**ملخص بياناتك:**\n\n'
          + `🎂 العمر: ${state.data.age}\n`
          + `🎯 الاهتمام: ${state.data.interest}\n`
          + `📞 التواصل: ${state.data.contact}\n\n`
          + 'هل تريد تأكيد هذه البيانات؟'

      keyboard
        .text('✅ تأكيد وإنهاء', 'multistep:complete')
        .row()
        .text('⬅️ السابق', 'multistep:prev')
        .text('❌ إلغاء', 'multistep:cancel')
      break
  }

  await ctx.editMessageText(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
}

/**
 * معالج التالي
 */
multiStepDemoHandler.callbackQuery('multistep:next', async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  if (state.step < state.totalSteps) {
    state.step++
    formState.set(userId, state)
    await showStep(ctx, userId, state.step)
  }
})

/**
 * معالج السابق
 */
multiStepDemoHandler.callbackQuery('multistep:prev', async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  if (state.step > 1) {
    state.step--
    formState.set(userId, state)
    await showStep(ctx, userId, state.step)
  }
})

/**
 * معالجات البيانات
 */
multiStepDemoHandler.callbackQuery(/^age:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  state.data.age = ctx.match![1]
  state.step = 3
  formState.set(userId, state)
  await showStep(ctx, userId, 3)
})

multiStepDemoHandler.callbackQuery(/^interest:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  const interestMap: any = {
    tech: '💻 التقنية',
    art: '🎨 الفن',
    sports: '⚽ الرياضة',
    reading: '📚 القراءة',
  }

  state.data.interest = interestMap[ctx.match![1]]
  state.step = 4
  formState.set(userId, state)
  await showStep(ctx, userId, 4)
})

multiStepDemoHandler.callbackQuery(/^contact:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  const contactMap: any = {
    email: '📧 البريد الإلكتروني',
    whatsapp: '📱 الواتساب',
    telegram: '💬 تيليجرام',
  }

  state.data.contact = contactMap[ctx.match![1]]
  state.step = 5
  formState.set(userId, state)
  await showStep(ctx, userId, 5)
})

/**
 * إكمال النموذج
 */
multiStepDemoHandler.callbackQuery('multistep:complete', async (ctx) => {
  await ctx.answerCallbackQuery('🎉 تم بنجاح!')
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)
  if (!state)
    return

  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:test-feature:multi-step-demo')

  await ctx.editMessageText(
    '🎊 **تم إكمال الرحلة بنجاح!**\n\n'
    + '**بياناتك النهائية:**\n\n'
    + `🎂 العمر: ${state.data.age}\n`
    + `🎯 الاهتمام: ${state.data.interest}\n`
    + `📞 التواصل: ${state.data.contact}\n\n`
    + '✅ تم حفظ جميع البيانات!\n\n'
    + '_شكراً لاستكمال الرحلة 🚀_',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  formState.delete(userId)
})

/**
 * إلغاء النموذج
 */
multiStepDemoHandler.callbackQuery('multistep:cancel', async (ctx) => {
  await ctx.answerCallbackQuery('تم الإلغاء')
  const userId = ctx.from?.id
  if (!userId)
    return

  formState.delete(userId)

  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:test-feature:multi-step-demo')

  await ctx.editMessageText(
    '❌ **تم إلغاء العملية**\n\n'
    + 'يمكنك البدء من جديد في أي وقت.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * عرض التقدم
 */
multiStepDemoHandler.callbackQuery('multistep:progress', async (ctx) => {
  await ctx.answerCallbackQuery()
  const userId = ctx.from?.id
  if (!userId)
    return

  const state = formState.get(userId)

  const keyboard = new InlineKeyboard()
    .text('⬅️ رجوع', 'menu:sub:test-feature:multi-step-demo')

  if (!state) {
    await ctx.editMessageText(
      '📊 **حالة التقدم**\n\n'
      + '⚠️ لم تبدأ الرحلة بعد.\n\n'
      + 'ابدأ الآن للمتابعة!',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
    return
  }

  const progress = Math.round((state.step / state.totalSteps) * 100)
  const progressBar = '▰'.repeat(state.step) + '▱'.repeat(state.totalSteps - state.step)

  await ctx.editMessageText(
    `📊 **حالة التقدم**\n\n`
    + `${progressBar} ${progress}%\n\n`
    + `الخطوة الحالية: ${state.step}/${state.totalSteps}\n\n`
    + `**البيانات المُجمعة:**\n${
      state.data.age ? `✅ العمر: ${state.data.age}\n` : '⏳ العمر: غير محدد\n'
    }${state.data.interest ? `✅ الاهتمام: ${state.data.interest}\n` : '⏳ الاهتمام: غير محدد\n'
    }${state.data.contact ? `✅ التواصل: ${state.data.contact}\n` : '⏳ التواصل: غير محدد\n'}`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})
