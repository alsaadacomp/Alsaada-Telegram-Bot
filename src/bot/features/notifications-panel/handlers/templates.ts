import type { Context } from '#root/bot/context.js'
import { NotificationTemplateBuilder } from '#root/modules/notifications/core/notification-template.js'
import { NotificationService } from '#root/modules/notifications/notification-service.js'
import { smartVariableService } from '#root/modules/notifications/smart-variable-service.js'
import { templateManagementService } from '#root/modules/notifications/template-management-service.js'
import { Composer, InlineKeyboard } from 'grammy'

export const templatesHandler = new Composer<Context>()
const notificationService = new NotificationService()

// Predefined templates
const predefinedTemplates = [
  {
    id: 'welcome',
    name: 'ترحيب بالمستخدمين الجدد',
    message: 'مرحباً {{fullName}}! 🎉\n\nأهلاً وسهلاً بك في {{companyName}}.\nنتمنى لك تجربة ممتعة معنا.',
    type: 'success' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'companyName'],
  },
  {
    id: 'announcement',
    name: 'إعلان عام',
    message: '📢 **إعلان مهم**\n\n{{message}}\n\n{{companyName}}',
    type: 'announcement' as const,
    priority: 'important' as const,
    variables: ['message', 'companyName'],
  },
  {
    id: 'reminder',
    name: 'تذكير',
    message: '🔔 **تذكير**\n\n{{message}}\n\nالتاريخ: {{date}}\nالوقت: {{time}}',
    type: 'reminder' as const,
    priority: 'normal' as const,
    variables: ['message', 'date', 'time'],
  },
  {
    id: 'meeting',
    name: 'إشعار اجتماع',
    message: '📅 **اجتماع قادم**\n\nالموضوع: {{subject}}\nالتاريخ: {{date}}\nالوقت: {{time}}\nالمكان: {{location}}',
    type: 'info' as const,
    priority: 'important' as const,
    variables: ['subject', 'date', 'time', 'location'],
  },
  {
    id: 'maintenance',
    name: 'إشعار صيانة',
    message: '🔧 **إشعار صيانة**\n\nسيتم إجراء صيانة على النظام في:\nالتاريخ: {{date}}\nالوقت: {{time}}\nالمدة المتوقعة: {{duration}}\n\nنعتذر عن الإزعاج.',
    type: 'warning' as const,
    priority: 'urgent' as const,
    variables: ['date', 'time', 'duration'],
  },
  {
    id: 'birthday',
    name: 'تهنئة عيد الميلاد',
    message: '🎂 **عيد ميلاد سعيد!**\n\n{{fullName}}، نتمنى لك عيد ميلاد سعيد مليء بالفرح والسعادة! 🎉\n\n{{companyName}}',
    type: 'success' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'companyName'],
  },
  {
    id: 'personal-message',
    name: 'رسالة شخصية',
    message: '👤 **رسالة شخصية**\n\n{{fullName}}،\n\n{{message}}\n\nمع أطيب التحيات،\n{{companyName}}',
    type: 'info' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'message', 'companyName'],
  },
]

/**
 * Templates menu
 */
templatesHandler.callbackQuery('settings:notifications:templates', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📋 القوالب الجاهزة', 'notif:templates:predefined')
    .row()
    .text('➕ إنشاء قالب جديد', 'notif:templates:create')
    .row()
    .text('📝 إدارة القوالب', 'notif:templates:manage')
    .row()
    .text('🔙 رجوع لإعدادات الإشعارات', 'settings:notifications')

  await ctx.editMessageText(
    '📋 **قوالب الإشعارات**\n\n'
    + 'اختر ما تريد فعله:\n\n'
    + '📋 **القوالب الجاهزة**: قوالب مُعدة مسبقاً\n'
    + '➕ **إنشاء قالب جديد**: قالب مخصص\n'
    + '📝 **إدارة القوالب**: تعديل أو حذف القوالب',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Predefined templates
 */
templatesHandler.callbackQuery('notif:templates:predefined', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()

  predefinedTemplates.forEach((template, index) => {
    const typeEmojis: Record<string, string> = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      announcement: '📢',
      reminder: '🔔',
      alert: '🚨',
    }

    const priorityEmojis: Record<string, string> = {
      normal: '🔵',
      important: '🟡',
      urgent: '🟠',
      critical: '🔴',
    }

    const typeEmoji = typeEmojis[template.type] || 'ℹ️'
    const priorityEmoji = priorityEmojis[template.priority] || '🔵'

    keyboard.text(
      `${index + 1}. ${typeEmoji} ${priorityEmoji} ${template.name}`,
      `notif:template:predefined:${template.id}`,
    ).row()
  })

  keyboard.text('🔙 رجوع', 'settings:notifications:templates')

  await ctx.editMessageText(
    '📋 **القوالب الجاهزة**\n\n'
    + 'اختر قالباً لإرساله:\n\n'
    + `تم العثور على ${predefinedTemplates.length} قالب جاهز:`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Send predefined template
 */
templatesHandler.callbackQuery(/^notif:template:predefined:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  // Map predefined template IDs to actual database template IDs
  const templateIdMap: Record<string, string> = {
    'welcome': 'welcome-template-id', // Will be replaced with actual ID
    'announcement': 'announcement-template-id',
    'reminder': 'reminder-template-id',
    'meeting': 'meeting-template-id',
    'maintenance': 'maintenance-template-id',
    'birthday': 'birthday-template-id',
    'personal-message': 'personal-message-template-id',
  }

  // Find template by name in database
  const templateNameMap: Record<string, string> = {
    'welcome': 'ترحيب بالمستخدمين الجدد',
    'announcement': 'إعلان عام',
    'reminder': 'تذكير',
    'meeting': 'إشعار اجتماع',
    'maintenance': 'إشعار صيانة',
    'birthday': 'تهنئة عيد الميلاد',
    'personal-message': 'رسالة شخصية',
  }

  const templateName = templateNameMap[templateId]
  if (!templateName) {
    await ctx.answerCallbackQuery('❌ القالب غير موجود')
    return
  }

  try {
    // Find template by name in database
    const templates = await templateManagementService.searchTemplates({ search: templateName, limit: 1 })
    if (templates.length === 0) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود في قاعدة البيانات')
      return
    }

    const template = templates[0]

    // Use the new system
    console.log(`Getting template with ID: ${template.id}`)
    console.log(`Template found: ${template.name}`)
    console.log(`Template message: ${template.message}`)

    // Get available variables for this template
    const availableVariables = await smartVariableService.getAvailableVariables(template.id!)
    console.log(`Available variables count: ${availableVariables.length}`)
    console.log(`Available variables: ${JSON.stringify(availableVariables.map(v => v.key))}`)

    if (availableVariables.length === 0) {
      // No variables needed, send directly
      const keyboard = new InlineKeyboard()
        .text('📤 إرسال مباشر', `notif:template:send-direct:${template.id}`)
        .row()
        .text('🔙 رجوع', 'notif:templates:predefined')

      await ctx.editMessageText(
        `📤 **إرسال القالب: ${template.name}**\n\n`
        + `**الرسالة:**\n${template.message}\n\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + '✅ **لا توجد متغيرات مطلوبة** - يمكن الإرسال مباشرة.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    else {
      // Variables needed, show variable selection
      const keyboard = new InlineKeyboard()
        .text('🔧 ملء المتغيرات', `notif:template:fill-variables:${template.id}`)
        .row()
        .text('📤 إرسال مباشر', `notif:template:send-direct:${template.id}`)
        .row()
        .text('🔙 رجوع', 'notif:templates:predefined')

      const variablesList = availableVariables.map(v => `• **{{${v.key}}}** - ${v.description}`).join('\n')

      await ctx.editMessageText(
        `📤 **إرسال القالب: ${template.name}**\n\n`
        + `**الرسالة:**\n${template.message}\n\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + `**المتغيرات المطلوبة:**\n${variablesList}\n\n`
        + '🔧 **ملء المتغيرات**: ملء تلقائي من قاعدة البيانات\n'
        + '📤 **إرسال مباشر**: إرسال كما هو مع المتغيرات غير مملوءة',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
  }
  catch (error) {
    console.error('Error handling predefined template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Create new template (legacy handler - redirect to management)
 */
templatesHandler.callbackQuery('notif:templates:create', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'settings:notifications:templates')

  await ctx.editMessageText(
    '➕ **إنشاء قالب جديد**\n\n'
    + 'تم نقل وظيفة إنشاء القوالب إلى إدارة القوالب.\n\n'
    + 'يرجى استخدام: إدارة القوالب → إنشاء قالب جديد',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Manage templates
 */
templatesHandler.callbackQuery('notif:templates:manage', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📋 قائمة القوالب', 'notif:templates:list')
    .text('➕ إنشاء قالب جديد', 'notif:templates:create-new')
    .row()
    .text('📊 إحصائيات القوالب', 'notif:templates:stats')
    .row()
    .text('🔙 رجوع', 'settings:notifications:templates')

  await ctx.editMessageText(
    '📝 **إدارة القوالب**\n\n'
    + 'اختر الإجراء المطلوب:\n\n'
    + '📋 **قائمة القوالب**: عرض وإدارة القوالب الموجودة\n'
    + '➕ **إنشاء قالب جديد**: قالب مخصص\n'
    + '📊 **إحصائيات القوالب**: معلومات عن القوالب',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * List templates
 */
templatesHandler.callbackQuery('notif:templates:list', async (ctx) => {
  await ctx.answerCallbackQuery()

  try {
    const templates = await templateManagementService.searchTemplates({ limit: 20 })

    if (templates.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('➕ إنشاء قالب جديد', 'notif:templates:create-new')
        .row()
        .text('🔙 رجوع', 'notif:templates:manage')

      await ctx.editMessageText(
        '📋 **قائمة القوالب**\n\n'
        + '⚠️ لا توجد قوالب في النظام.\n\n'
        + 'يمكنك إنشاء قالب جديد أو استخدام القوالب الجاهزة.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    templates.forEach((template, index) => {
      const typeEmojis: Record<string, string> = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        announcement: '📢',
        reminder: '🔔',
        alert: '🚨',
      }

      const priorityEmojis: Record<string, string> = {
        normal: '🔵',
        important: '🟡',
        urgent: '🟠',
        critical: '🔴',
      }

      const typeEmoji = typeEmojis[template.type] || 'ℹ️'
      const priorityEmoji = priorityEmojis[template.priority] || '🔵'
      const statusEmoji = template.isActive ? '✅' : '❌'

      keyboard.text(
        `${index + 1}. ${typeEmoji} ${priorityEmoji} ${template.name} ${statusEmoji}`,
        `notif:template:manage:${template.id}`,
      ).row()
    })

    keyboard.text('🔙 رجوع', 'notif:templates:manage')

    await ctx.editMessageText(
      '📋 **قائمة القوالب**\n\n'
      + `تم العثور على ${templates.length} قالب:\n\n`
      + 'اختر قالباً لإدارته:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error listing templates:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Manage individual template
 */
templatesHandler.callbackQuery(/^notif:template:manage:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('✏️ تعديل', `notif:template:edit:${templateId}`)
      .text('📋 نسخ', `notif:template:duplicate:${templateId}`)
      .row()
      .text('📤 إرسال', `notif:template:send:${templateId}`)
      .text('🗑️ حذف', `notif:template:delete:${templateId}`)
      .row()
      .text('🔙 رجوع', 'notif:templates:list')

    await ctx.editMessageText(
      '📋 **إدارة القالب**\n\n'
      + `**الاسم:** ${template.name}\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n`
      + `**الحالة:** ${template.isActive ? 'نشط' : 'غير نشط'}\n\n`
      + `**الرسالة:**\n${template.message.substring(0, 200)}${template.message.length > 200 ? '...' : ''}\n\n`
      + 'اختر الإجراء المطلوب:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error managing template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Create new template - start
 */
templatesHandler.callbackQuery('notif:templates:create-new', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('📝 قالب مخصص', 'notif:template:create:custom')
    .row()
    .text('📋 من قالب جاهز', 'notif:template:create:from-existing')
    .row()
    .text('🔙 رجوع', 'notif:templates:manage')

  await ctx.editMessageText(
    '➕ **إنشاء قالب جديد**\n\n'
    + 'اختر طريقة إنشاء القالب:\n\n'
    + '📝 **قالب مخصص**: إنشاء قالب جديد من الصفر\n'
    + '📋 **من قالب جاهز**: نسخ وتعديل قالب موجود',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Create custom template - step 1: name
 */
templatesHandler.callbackQuery('notif:template:create:custom', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  // Store creation mode in session
  ctx.session.templateCreationMode = 'custom'
  ctx.session.templateCreationData = {} as any

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'notif:templates:create-new')

  await ctx.editMessageText(
    '📝 **إنشاء قالب مخصص**\n\n'
    + '**الخطوة 1/5: اسم القالب**\n\n'
    + 'أدخل اسم القالب الجديد:\n\n'
    + '💡 **نصائح:**\n'
    + '• استخدم اسم واضح ومفهوم\n'
    + '• تجنب الأسماء الطويلة\n'
    + '• مثال: "ترحيب المستخدمين الجدد"',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  // Set conversation state
  ctx.session.conversationState = 'template:create:name'
})

/**
 * Create template from existing - select template
 */
templatesHandler.callbackQuery('notif:template:create:from-existing', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const templates = await templateManagementService.searchTemplates({ limit: 20 })

    if (templates.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('📝 إنشاء قالب مخصص', 'notif:template:create:custom')
        .row()
        .text('🔙 رجوع', 'notif:templates:create-new')

      await ctx.editMessageText(
        '📋 **إنشاء من قالب جاهز**\n\n'
        + '⚠️ لا توجد قوالب في النظام.\n\n'
        + 'يمكنك إنشاء قالب جديد من الصفر.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    templates.forEach((template, index) => {
      const typeEmojis: Record<string, string> = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        announcement: '📢',
        reminder: '🔔',
        alert: '🚨',
      }

      const priorityEmojis: Record<string, string> = {
        normal: '🔵',
        important: '🟡',
        urgent: '🟠',
        critical: '🔴',
      }

      const typeEmoji = typeEmojis[template.type] || 'ℹ️'
      const priorityEmoji = priorityEmojis[template.priority] || '🔵'

      keyboard.text(
        `${index + 1}. ${typeEmoji} ${priorityEmoji} ${template.name}`,
        `notif:template:create:from:${template.id}`,
      ).row()
    })

    keyboard.text('🔙 رجوع', 'notif:templates:create-new')

    await ctx.editMessageText(
      '📋 **إنشاء من قالب جاهز**\n\n'
      + `اختر القالب الذي تريد نسخه وتعديله:\n\n`
      + `تم العثور على ${templates.length} قالب:`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error loading templates for creation:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Create template from existing - confirm
 */
templatesHandler.callbackQuery(/^notif:template:create:from:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Store template data for creation
    ctx.session.templateCreationMode = 'from-existing'
    ctx.session.templateCreationData = {
      baseTemplate: template,
    } as any

    const keyboard = new InlineKeyboard()
      .text('✅ تأكيد النسخ', 'notif:template:create:confirm-copy')
      .row()
      .text('🔙 رجوع', 'notif:template:create:from-existing')

    await ctx.editMessageText(
      '📋 **تأكيد نسخ القالب**\n\n'
      + `**القالب المحدد:** ${template.name}\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n\n`
      + `**الرسالة:**\n${template.message.substring(0, 200)}${template.message.length > 200 ? '...' : ''}\n\n`
      + 'سيتم إنشاء نسخة جديدة من هذا القالب يمكنك تعديلها.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error preparing template copy:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Confirm template copy and start creation
 */
templatesHandler.callbackQuery('notif:template:create:confirm-copy', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateCreationData?.baseTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  const baseTemplate = ctx.session.templateCreationData.baseTemplate

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'notif:templates:create-new')

  await ctx.editMessageText(
    '📝 **إنشاء قالب جديد**\n\n'
    + '**الخطوة 1/5: اسم القالب**\n\n'
    + 'أدخل اسم القالب الجديد:\n\n'
    + `**القالب الأساسي:** ${baseTemplate.name}\n\n`
    + '💡 **نصائح:**\n'
    + '• استخدم اسم مختلف عن القالب الأساسي\n'
    + '• مثال: "ترحيب المستخدمين الجدد - نسخة معدلة"',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  // Set conversation state
  ctx.session.conversationState = 'template:create:name'
})

/**
 * Edit template - start
 */
templatesHandler.callbackQuery(/^notif:template:edit:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  if (!ctx.dbUser || !['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Store template data for editing
    ctx.session.templateEditMode = true
    ctx.session.templateEditData = {
      templateId,
      originalTemplate: template,
    } as any

    const keyboard = new InlineKeyboard()
      .text('📝 تعديل الاسم', 'notif:template:edit:name')
      .text('📄 تعديل الرسالة', 'notif:template:edit:message')
      .row()
      .text('🏷️ تعديل النوع', 'notif:template:edit:type')
      .text('⚡ تعديل الأولوية', 'notif:template:edit:priority')
      .row()
      .text('✅ حفظ التعديلات', 'notif:template:edit:save')
      .row()
      .text('🔙 رجوع', `notif:template:manage:${templateId}`)

    await ctx.editMessageText(
      '✏️ **تعديل القالب**\n\n'
      + `**القالب:** ${template.name}\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n\n`
      + `**الرسالة:**\n${template.message.substring(0, 200)}${template.message.length > 200 ? '...' : ''}\n\n`
      + 'اختر ما تريد تعديله:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error preparing template edit:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Edit template name
 */
templatesHandler.callbackQuery('notif:template:edit:name', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '✏️ **تعديل اسم القالب**\n\n'
    + `**الاسم الحالي:** ${ctx.session.templateEditData.originalTemplate.name}\n\n`
    + 'أدخل الاسم الجديد للقالب:\n\n'
    + '💡 **نصائح:**\n'
    + '• استخدم اسم واضح ومفهوم\n'
    + '• تجنب الأسماء الطويلة\n'
    + '• يجب أن يكون الاسم فريداً',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  // Set conversation state
  ctx.session.conversationState = 'template:edit:name'
})

/**
 * Edit template message
 */
templatesHandler.callbackQuery('notif:template:edit:message', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '✏️ **تعديل رسالة القالب**\n\n'
    + `**الرسالة الحالية:**\n${ctx.session.templateEditData.originalTemplate.message}\n\n`
    + 'أدخل الرسالة الجديدة:\n\n'
    + '💡 **نصائح:**\n'
    + '• يمكنك استخدام Markdown للتنسيق\n'
    + '• استخدم {{variableName}} للمتغيرات\n'
    + '• مثال: {{fullName}}، {{companyName}}',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  // Set conversation state
  ctx.session.conversationState = 'template:edit:message'
})

/**
 * Edit template type
 */
templatesHandler.callbackQuery('notif:template:edit:type', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('ℹ️ معلومة', 'notif:template:edit:type:info')
    .text('✅ نجاح', 'notif:template:edit:type:success')
    .row()
    .text('⚠️ تحذير', 'notif:template:edit:type:warning')
    .text('❌ خطأ', 'notif:template:edit:type:error')
    .row()
    .text('📢 إعلان', 'notif:template:edit:type:announcement')
    .text('🔔 تذكير', 'notif:template:edit:type:reminder')
    .row()
    .text('🚨 تنبيه', 'notif:template:edit:type:alert')
    .row()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '🏷️ **تعديل نوع القالب**\n\n'
    + `**النوع الحالي:** ${ctx.session.templateEditData.originalTemplate.type}\n\n`
    + 'اختر النوع الجديد للقالب:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Edit template priority
 */
templatesHandler.callbackQuery('notif:template:edit:priority', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔵 عادي', 'notif:template:edit:priority:normal')
    .text('🟡 مهم', 'notif:template:edit:priority:important')
    .row()
    .text('🟠 عاجل', 'notif:template:edit:priority:urgent')
    .text('🔴 حرج', 'notif:template:edit:priority:critical')
    .row()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '⚡ **تعديل أولوية القالب**\n\n'
    + `**الأولوية الحالية:** ${ctx.session.templateEditData.originalTemplate.priority}\n\n`
    + 'اختر الأولوية الجديدة للقالب:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Save template edits
 */
templatesHandler.callbackQuery('notif:template:edit:save', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  try {
    const templateId = ctx.session.templateEditData.templateId
    const originalTemplate = ctx.session.templateEditData.originalTemplate

    // Get current template to check for changes
    const currentTemplate = await templateManagementService.getTemplate(templateId)
    if (!currentTemplate) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Check if there are any changes
    const hasChanges
      = currentTemplate.name !== originalTemplate.name
        || currentTemplate.message !== originalTemplate.message
        || currentTemplate.type !== originalTemplate.type
        || currentTemplate.priority !== originalTemplate.priority

    if (!hasChanges) {
      await ctx.answerCallbackQuery('⚠️ لا توجد تغييرات لحفظها')
      return
    }

    // Update template
    await templateManagementService.updateTemplate(templateId, {
      name: currentTemplate.name,
      message: currentTemplate.message,
      type: currentTemplate.type,
      priority: currentTemplate.priority,
    })

    // Clear session data
    ctx.session.templateEditMode = false
    ctx.session.templateEditData = undefined

    const keyboard = new InlineKeyboard()
      .text('📋 عرض القالب', `notif:template:manage:${templateId}`)
      .row()
      .text('🔙 رجوع', 'notif:templates:list')

    await ctx.editMessageText(
      '✅ **تم حفظ التعديلات بنجاح!**\n\n'
      + `**القالب:** ${currentTemplate.name}\n`
      + `**النوع:** ${currentTemplate.type}\n`
      + `**الأولوية:** ${currentTemplate.priority}\n\n`
      + 'تم تحديث القالب في قاعدة البيانات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error saving template edits:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء حفظ التعديلات')
  }
})

/**
 * Handle template type selection for editing
 */
templatesHandler.callbackQuery(/^notif:template:edit:type:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const type = ctx.match![1]

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  // Update template data in session
  if (!ctx.session.templateEditData.currentTemplate) {
    ctx.session.templateEditData.currentTemplate = { ...ctx.session.templateEditData.originalTemplate }
  }
  ctx.session.templateEditData.currentTemplate.type = type as any

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '✅ **تم تحديث نوع القالب**\n\n'
    + `**النوع الجديد:** ${type}\n\n`
    + 'يمكنك المتابعة لتعديل خصائص أخرى أو حفظ التعديلات.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle template priority selection for editing
 */
templatesHandler.callbackQuery(/^notif:template:edit:priority:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const priority = ctx.match![1]

  if (!ctx.session.templateEditData?.originalTemplate) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  // Update template data in session
  if (!ctx.session.templateEditData.currentTemplate) {
    ctx.session.templateEditData.currentTemplate = { ...ctx.session.templateEditData.originalTemplate }
  }
  ctx.session.templateEditData.currentTemplate.priority = priority as any

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

  await ctx.editMessageText(
    '✅ **تم تحديث أولوية القالب**\n\n'
    + `**الأولوية الجديدة:** ${priority}\n\n`
    + 'يمكنك المتابعة لتعديل خصائص أخرى أو حفظ التعديلات.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle template type selection for creation
 */
templatesHandler.callbackQuery(/^notif:template:create:type:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const type = ctx.match![1]

  if (!ctx.session.templateCreationData) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  // Store type and move to priority selection
  ctx.session.templateCreationData.type = type as any

  const keyboard = new InlineKeyboard()
    .text('🔵 عادي', 'notif:template:create:priority:normal')
    .text('🟡 مهم', 'notif:template:create:priority:important')
    .row()
    .text('🟠 عاجل', 'notif:template:create:priority:urgent')
    .text('🔴 حرج', 'notif:template:create:priority:critical')
    .row()
    .text('🔙 رجوع', 'notif:templates:create-new')

  await ctx.editMessageText(
    '📝 **إنشاء قالب مخصص**\n\n'
    + '**الخطوة 4/5: أولوية القالب**\n\n'
    + `**النوع المحدد:** ${type}\n\n`
    + 'اختر أولوية القالب:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  ctx.session.conversationState = 'template:create:priority'
})

/**
 * Handle template priority selection for creation
 */
templatesHandler.callbackQuery(/^notif:template:create:priority:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const priority = ctx.match![1]

  if (!ctx.session.templateCreationData) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  // Store priority and show confirmation
  ctx.session.templateCreationData.priority = priority as any

  const keyboard = new InlineKeyboard()
    .text('✅ إنشاء القالب', 'notif:template:create:confirm')
    .row()
    .text('🔙 رجوع', 'notif:templates:create-new')

  await ctx.editMessageText(
    '📝 **إنشاء قالب مخصص**\n\n'
    + '**الخطوة 5/5: تأكيد القالب**\n\n'
    + `**الاسم:** ${ctx.session.templateCreationData.name}\n`
    + `**النوع:** ${ctx.session.templateCreationData.type}\n`
    + `**الأولوية:** ${ctx.session.templateCreationData.priority}\n\n`
    + `**الرسالة:**\n${ctx.session.templateCreationData.message.substring(0, 200)}${ctx.session.templateCreationData.message.length > 200 ? '...' : ''}\n\n`
    + 'هل تريد إنشاء هذا القالب؟',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )

  ctx.session.conversationState = 'template:create:confirm'
})

/**
 * Confirm template creation
 */
templatesHandler.callbackQuery('notif:template:create:confirm', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.session.templateCreationData) {
    await ctx.answerCallbackQuery('❌ بيانات القالب غير موجودة')
    return
  }

  try {
    const templateData = ctx.session.templateCreationData

    // Create template
    const templateId = await templateManagementService.createTemplate({
      name: templateData.name,
      message: templateData.message,
      type: templateData.type,
      priority: templateData.priority,
      createdBy: ctx.dbUser?.userId,
    })

    // Clear session data
    ctx.session.templateCreationMode = undefined
    ctx.session.templateCreationData = {}
    ctx.session.conversationState = undefined

    const keyboard = new InlineKeyboard()
      .text('📋 عرض القالب', `notif:template:manage:${templateId}`)
      .row()
      .text('🔙 رجوع', 'notif:templates:list')

    await ctx.editMessageText(
      '✅ **تم إنشاء القالب بنجاح!**\n\n'
      + `**الاسم:** ${templateData.name}\n`
      + `**النوع:** ${templateData.type}\n`
      + `**الأولوية:** ${templateData.priority}\n\n`
      + 'تم حفظ القالب في قاعدة البيانات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error creating template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء إنشاء القالب')
  }
})

/**
 * Duplicate template
 */
templatesHandler.callbackQuery(/^notif:template:duplicate:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Duplicate template
    const duplicatedTemplateId = await templateManagementService.createTemplate({
      name: `${template.name} - نسخة`,
      message: template.message,
      type: template.type,
      priority: template.priority,
      createdBy: ctx.dbUser?.userId,
    })

    const keyboard = new InlineKeyboard()
      .text('📋 عرض القالب الجديد', `notif:template:manage:${duplicatedTemplateId}`)
      .row()
      .text('🔙 رجوع', 'notif:templates:list')

    await ctx.editMessageText(
      '✅ **تم نسخ القالب بنجاح!**\n\n'
      + `**القالب الأصلي:** ${template.name}\n`
      + `**القالب الجديد:** ${template.name} - نسخة\n\n`
      + 'تم إنشاء نسخة جديدة من القالب.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error duplicating template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء نسخ القالب')
  }
})

/**
 * Send template
 */
templatesHandler.callbackQuery(/^notif:template:send:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    console.log(`Getting template with ID: ${templateId}`)
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      console.log(`Template not found: ${templateId}`)
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    console.log(`Template found: ${template.name}`)
    console.log(`Template message: ${template.message}`)

    // Get available variables for this template
    const availableVariables = await smartVariableService.getAvailableVariables(templateId)
    console.log(`Available variables count: ${availableVariables.length}`)
    console.log(`Available variables: ${JSON.stringify(availableVariables.map(v => v.key))}`)

    if (availableVariables.length === 0) {
      // No variables needed, send directly
      const keyboard = new InlineKeyboard()
        .text('📤 إرسال مباشر', `notif:template:send-direct:${templateId}`)
        .row()
        .text('🔙 رجوع', `notif:template:manage:${templateId}`)

      await ctx.editMessageText(
        `📤 **إرسال القالب: ${template.name}**\n\n`
        + `**الرسالة:**\n${template.message}\n\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + '✅ **لا توجد متغيرات مطلوبة** - يمكن الإرسال مباشرة.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    else {
      // Variables needed, show variable selection
      const keyboard = new InlineKeyboard()
        .text('🔧 ملء المتغيرات', `notif:template:fill-variables:${templateId}`)
        .row()
        .text('📤 إرسال مباشر', `notif:template:send-direct:${templateId}`)
        .row()
        .text('🔙 رجوع', `notif:template:manage:${templateId}`)

      const variablesList = availableVariables.map(v => `• **{{${v.key}}}** - ${v.description}`).join('\n')

      await ctx.editMessageText(
        `📤 **إرسال القالب: ${template.name}**\n\n`
        + `**الرسالة:**\n${template.message}\n\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + `**المتغيرات المطلوبة:**\n${variablesList}\n\n`
        + '🔧 **ملء المتغيرات**: ملء تلقائي من قاعدة البيانات\n'
        + '📤 **إرسال مباشر**: إرسال كما هو مع المتغيرات غير مملوءة',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
  }
  catch (error) {
    console.error('Error preparing template send:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Fill template variables
 */
templatesHandler.callbackQuery(/^notif:template:fill-variables:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Get available variables
    const availableVariables = await smartVariableService.getAvailableVariables(templateId)

    if (availableVariables.length === 0) {
      await ctx.answerCallbackQuery('⚠️ لا توجد متغيرات في هذا القالب')
      return
    }

    // Show audience selection first
    const keyboard = new InlineKeyboard()
      .text('👥 جميع المستخدمين', `notif:fill:${templateId}:all`)
      .row()
      .text('🛡️ الإداريين فقط', `notif:fill:${templateId}:admins`)
      .row()
      .text('👤 المستخدمين العاديين', `notif:fill:${templateId}:users`)
      .row()
      .text('👑 السوبر أدمن فقط', `notif:fill:${templateId}:super`)
      .row()
      .text('🔙 رجوع', `notif:template:send:${templateId}`)

    const variablesList = availableVariables.map(v => `• **{{${v.key}}}** - ${v.description}`).join('\n')

    await ctx.editMessageText(
      `🔧 **ملء المتغيرات: ${template.name}**\n\n`
      + `**الرسالة:**\n${template.message}\n\n`
      + `**المتغيرات المطلوبة:**\n${variablesList}\n\n`
      + '🎯 **اختر الفئة المستهدفة:**\n\n'
      + 'سيتم ملء المتغيرات حسب كل مستخدم في الفئة المختارة.\n'
      + 'مثلاً: {{fullName}} سيظهر اسم كل مستخدم في رسالته الخاصة.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error filling template variables:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء ملء المتغيرات')
  }
})

/**
 * Fill template variables for specific audience
 */
templatesHandler.callbackQuery(/^notif:fill:(.+):(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]
  const audience = ctx.match![2]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Get available variables
    const availableVariables = await smartVariableService.getAvailableVariables(templateId)

    if (availableVariables.length === 0) {
      await ctx.answerCallbackQuery('⚠️ لا توجد متغيرات في هذا القالب')
      return
    }

    // Get company variables (same for all users)
    const companyVariables = await smartVariableService.getCompanyVariableValues()

    // Get system variables (same for all users)
    const systemVariables = {
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      datetime: new Date().toLocaleString('ar-EG'),
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString(),
      day: new Date().getDate().toString(),
    }

    // Combine static variables
    const staticVariables = { ...companyVariables, ...systemVariables }

    // Create preview with static variables only
    let previewMessage = template.message
    for (const [key, value] of Object.entries(staticVariables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
      previewMessage = previewMessage.replace(regex, value)
    }

    const audienceNames: Record<string, string> = {
      all: 'جميع المستخدمين',
      admins: 'الإداريين',
      users: 'المستخدمين العاديين',
      super: 'السوبر أدمن',
    }

    const keyboard = new InlineKeyboard()
      .text('📤 إرسال الإشعار', `notif:send:${templateId}:${audience}`)
      .row()
      .text('✏️ تعديل المتغيرات', `notif:edit:${templateId}`)
      .row()
      .text('🔙 رجوع', `notif:template:fill-variables:${templateId}`)

    await ctx.editMessageText(
      `🔧 **ملء المتغيرات: ${template.name}**\n\n`
      + `**الفئة المستهدفة:** ${audienceNames[audience]}\n\n`
      + `**الرسالة الأصلية:**\n${template.message}\n\n`
      + `**معاينة الرسالة:**\n${previewMessage}\n\n`
      + `**المتغيرات المملوءة تلقائياً:**\n${Object.entries(staticVariables).map(([key, value]) => `• **{{${key}}}** = ${value}`).join('\n')}\n\n`
      + `**المتغيرات المطلوبة يدوياً:**\n${availableVariables.filter(v => !(v.key in staticVariables)).map(v => `• **{{${v.key}}}** - ${v.description}`).join('\n')}\n\n`
      + '💡 **ملاحظة**: المتغيرات الشخصية (مثل {{fullName}}) ستظهر اسم كل مستخدم في رسالته الخاصة.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error filling template variables for audience:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء ملء المتغيرات')
  }
})

/**
 * Send template with filled variables to specific audience
 */
templatesHandler.callbackQuery(/^notif:send:(.+):(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]
  const audience = ctx.match![2]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Map audience to target audience
    const targetAudienceMap: Record<string, string> = {
      all: 'all_users',
      admins: 'all_admins',
      users: 'role',
      super: 'super_admin',
    }

    const targetAudience = targetAudienceMap[audience] || 'all_users'
    const targetRole = audience === 'users' ? 'USER' : undefined

    // Create notification data
    const notificationData = {
      type: template.type,
      priority: template.priority,
      targetAudience,
      targetRole,
      message: template.message,
    }

    // Get static variables
    const companyVariables = await smartVariableService.getCompanyVariableValues()
    const systemVariables = {
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      datetime: new Date().toLocaleString('ar-EG'),
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString(),
      day: new Date().getDate().toString(),
    }

    const staticVariables = { ...companyVariables, ...systemVariables }

    // Send notification with smart variables
    const { NotificationService } = await import('#root/modules/notifications/notification-service.js')
    const notificationService = new NotificationService()
    const result = await notificationService.sendNotificationWithSmartVariables(notificationData, staticVariables)

    const audienceNames: Record<string, string> = {
      all: 'جميع المستخدمين',
      admins: 'الإداريين',
      users: 'المستخدمين العاديين',
      super: 'السوبر أدمن',
    }

    if (result.success) {
      await ctx.editMessageText(
        `✅ **تم إرسال الإشعار بنجاح!**\n\n`
        + `**القالب:** ${template.name}\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n`
        + `**الفئة المستهدفة:** ${audienceNames[audience]}\n\n`
        + `**النتائج:**\n`
        + `📤 تم الإرسال: ${result.sentCount}\n`
        + `❌ فشل: ${result.failedCount}\n\n`
        + 'تم إرسال رسالة مخصصة لكل مستخدم مع المتغيرات الشخصية.',
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('🔙 رجوع', `notif:template:manage:${templateId}`),
        },
      )
    }
    else {
      await ctx.editMessageText(
        `❌ **فشل في إرسال الإشعار**\n\n`
        + `**القالب:** ${template.name}\n`
        + `**الفئة المستهدفة:** ${audienceNames[audience]}\n\n`
        + `**النتائج:**\n`
        + `📤 تم الإرسال: ${result.sentCount}\n`
        + `❌ فشل: ${result.failedCount}\n\n`
        + `**الأخطاء:**\n${result.errors.map((e: Error) => `• ${e.message}`).join('\n')}`,
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('🔙 رجوع', `notif:template:manage:${templateId}`),
        },
      )
    }
  }
  catch (error) {
    console.error('Error sending template to audience:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء الإرسال')
  }
})

/**
 * Send template directly (without filling variables)
 */
templatesHandler.callbackQuery(/^notif:template:send-direct:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('📤 إرسال الإشعار', `notif:template:send-filled:${templateId}`)
      .row()
      .text('🔙 رجوع', `notif:template:send:${templateId}`)

    await ctx.editMessageText(
      `📤 **إرسال مباشر: ${template.name}**\n\n`
      + `**الرسالة:**\n${template.message}\n\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n\n`
      + '⚠️ **ملاحظة**: سيتم إرسال الرسالة كما هي مع المتغيرات غير مملوءة.\n\n'
      + 'هل تريد إرسال هذا الإشعار؟',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error preparing direct send:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Send filled template to specific audience
 */
templatesHandler.callbackQuery(/^notif:template:send-filled-audience:(.+):(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]
  const audience = ctx.match![2]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Get company and system variables
    const companyVariables = await smartVariableService.getCompanyVariableValues()
    const systemVariables = {
      date: new Date().toLocaleDateString('ar-EG'),
      time: new Date().toLocaleTimeString('ar-EG'),
      datetime: new Date().toLocaleString('ar-EG'),
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString(),
      day: new Date().getDate().toString(),
    }

    const staticVariables = { ...companyVariables, ...systemVariables }

    // Create notification data based on audience
    let notificationData: any = {
      message: template.message, // Will be filled per user
      type: template.type,
      priority: template.priority,
    }

    // Set target audience
    switch (audience) {
      case 'all_users':
        notificationData.targetAudience = 'all_users'
        break
      case 'admins':
        notificationData.targetAudience = 'all_admins'
        break
      case 'users':
        notificationData.targetAudience = 'role'
        notificationData.targetRole = 'USER'
        break
      case 'super_admin':
        notificationData.targetAudience = 'super_admin'
        break
      default:
        notificationData.targetAudience = 'all_users'
    }

    // Send notification with smart variable filling
    await notificationService.sendNotificationWithSmartVariables(notificationData, staticVariables)

    const audienceNames: Record<string, string> = {
      all: 'جميع المستخدمين',
      admins: 'الإداريين',
      users: 'المستخدمين العاديين',
      super: 'السوبر أدمن',
    }

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', `notif:template:manage:${templateId}`)

    await ctx.editMessageText(
      '✅ **تم إرسال الإشعار بنجاح!**\n\n'
      + `**القالب:** ${template.name}\n`
      + `**الفئة المستهدفة:** ${audienceNames[audience]}\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n\n`
      + '💡 **ملاحظة**: تم ملء المتغيرات الشخصية حسب كل مستخدم.\n'
      + 'مثلاً: {{fullName}} ظهر اسم كل مستخدم في رسالته الخاصة.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error sending filled template to audience:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء إرسال الإشعار')
  }
})

/**
 * Send filled template
 */
templatesHandler.callbackQuery(/^notif:template:send-filled:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Get available variables
    const availableVariables = await smartVariableService.getAvailableVariables(templateId)

    if (availableVariables.length === 0) {
      // No variables needed, send directly to all users
      const notificationData = {
        type: template.type,
        priority: template.priority,
        targetAudience: 'all_users',
        message: template.message,
      }

      const { NotificationService } = await import('#root/modules/notifications/notification-service.js')
      const notificationService = new NotificationService()
      const result = await notificationService.sendNotificationWithSmartVariables(notificationData, {})

      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع', `notif:template:manage:${templateId}`)

      await ctx.editMessageText(
        '✅ **تم إرسال الإشعار بنجاح!**\n\n'
        + `**القالب:** ${template.name}\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + `**النتائج:**\n`
        + `📤 تم الإرسال: ${result.sentCount}\n`
        + `❌ فشل: ${result.failedCount}\n\n`
        + 'تم إرسال الإشعار إلى جميع المستخدمين النشطين.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    else {
      // Variables needed, redirect to audience selection
      const keyboard = new InlineKeyboard()
        .text('🔧 ملء المتغيرات', `notif:template:fill-variables:${templateId}`)
        .row()
        .text('🔙 رجوع', `notif:template:send:${templateId}`)

      const variablesList = availableVariables.map(v => `• **{{${v.key}}}** - ${v.description}`).join('\n')

      await ctx.editMessageText(
        `📤 **إرسال القالب: ${template.name}**\n\n`
        + `**الرسالة:**\n${template.message}\n\n`
        + `**النوع:** ${template.type}\n`
        + `**الأولوية:** ${template.priority}\n\n`
        + `**المتغيرات المطلوبة:**\n${variablesList}\n\n`
        + '🔧 **ملء المتغيرات**: ملء تلقائي من قاعدة البيانات مع اختيار الفئة المستهدفة\n'
        + '📤 **إرسال مباشر**: إرسال كما هو مع المتغيرات غير مملوءة',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
  }
  catch (error) {
    console.error('Error handling send-filled template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Edit template variables manually
 */
templatesHandler.callbackQuery(/^notif:template:edit-variables:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    // Get available variables
    const availableVariables = await smartVariableService.getAvailableVariables(templateId)

    if (availableVariables.length === 0) {
      await ctx.answerCallbackQuery('⚠️ لا توجد متغيرات في هذا القالب')
      return
    }

    // Store template ID for variable editing
    ctx.session.templateVariableEdit = {
      templateId,
      variables: availableVariables,
      selectedVariableIndex: undefined,
    }

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', `notif:template:fill-variables:${templateId}`)

    await ctx.editMessageText(
      `✏️ **تعديل المتغيرات: ${template.name}**\n\n`
      + `**المتغيرات المتاحة:**\n${availableVariables.map((v, index) => `${index + 1}. **{{${v.key}}}** - ${v.description}`).join('\n')}\n\n`
      + 'أدخل رقم المتغير الذي تريد تعديله:\n\n'
      + '💡 **مثال**: اكتب "1" لتعديل المتغير الأول',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    // Set conversation state
    ctx.session.conversationState = 'template:edit-variable'
  }
  catch (error) {
    console.error('Error preparing variable edit:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Delete template
 */
templatesHandler.callbackQuery(/^notif:template:delete:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('✅ تأكيد الحذف', `notif:template:confirm-delete:${templateId}`)
      .row()
      .text('🔙 رجوع', `notif:template:manage:${templateId}`)

    await ctx.editMessageText(
      '🗑️ **حذف القالب**\n\n'
      + `**القالب:** ${template.name}\n`
      + `**النوع:** ${template.type}\n`
      + `**الأولوية:** ${template.priority}\n\n`
      + `**الرسالة:** ${template.message.substring(0, 100)}${template.message.length > 100 ? '...' : ''}\n\n`
      + '⚠️ **تحذير**: هذا الإجراء لا يمكن التراجع عنه!\n\n'
      + 'هل أنت متأكد من حذف هذا القالب؟',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error preparing template deletion:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Confirm template deletion
 */
templatesHandler.callbackQuery(/^notif:template:confirm-delete:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const templateId = ctx.match![1]

  try {
    const template = await templateManagementService.getTemplate(templateId)
    if (!template) {
      await ctx.answerCallbackQuery('❌ القالب غير موجود')
      return
    }

    await templateManagementService.deleteTemplate(templateId)

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'notif:templates:list')

    await ctx.editMessageText(
      `✅ **تم حذف القالب بنجاح!**\n\n`
      + `**الاسم المحذوف:** ${template.name}\n\n`
      + 'تم حذف القالب نهائياً من النظام.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    console.error('Error deleting template:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء حذف القالب')
  }
})

/**
 * Template statistics
 */
templatesHandler.callbackQuery('notif:templates:stats', async (ctx) => {
  await ctx.answerCallbackQuery()

  try {
    const stats = await templateManagementService.getTemplateStats()

    const typeNames: Record<string, string> = {
      info: 'معلومة',
      success: 'نجاح',
      warning: 'تحذير',
      error: 'خطأ',
      announcement: 'إعلان',
      reminder: 'تذكير',
      alert: 'تنبيه',
    }

    const priorityNames: Record<string, string> = {
      normal: 'عادي',
      important: 'مهم',
      urgent: 'عاجل',
      critical: 'حرج',
    }

    let message = '📊 **إحصائيات القوالب**\n\n'
    message += `📋 **المجموع:** ${stats.total}\n`
    message += `✅ **النشطة:** ${stats.active}\n`
    message += `❌ **غير النشطة:** ${stats.inactive}\n\n`

    message += '**حسب النوع:**\n'
    Object.entries(stats.byType).forEach(([type, count]) => {
      message += `• ${typeNames[type] || type}: ${count}\n`
    })

    message += '\n**حسب الأولوية:**\n'
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
      message += `• ${priorityNames[priority] || priority}: ${count}\n`
    })

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'notif:templates:manage')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    console.error('Error getting template stats:', error)
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

/**
 * Handle text input for template creation and editing
 */
templatesHandler.on('message:text', async (ctx) => {
  if (!ctx.message?.text)
    return

  const conversationState = ctx.session.conversationState
  if (!conversationState?.startsWith('template:'))
    return

  const text = ctx.message.text.trim()

  // Handle template creation
  if (conversationState === 'template:create:name') {
    if (!ctx.session.templateCreationData) {
      ctx.session.templateCreationData = {} as any
    }

    // Validate name
    if (text.length < 3) {
      await ctx.reply('❌ اسم القالب قصير جداً. يجب أن يكون 3 أحرف على الأقل.')
      return
    }

    if (text.length > 50) {
      await ctx.reply('❌ اسم القالب طويل جداً. يجب أن يكون أقل من 50 حرف.')
      return
    }

    // Store name and move to next step
    ctx.session.templateCreationData.name = text

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', 'notif:templates:create-new')

    await ctx.reply(
      '📝 **إنشاء قالب مخصص**\n\n'
      + '**الخطوة 2/5: رسالة القالب**\n\n'
      + 'أدخل رسالة القالب:\n\n'
      + '💡 **نصائح:**\n'
      + '• يمكنك استخدام Markdown للتنسيق\n'
      + '• استخدم {{variableName}} للمتغيرات\n'
      + '• مثال: {{fullName}}، {{companyName}}\n'
      + '• للإلغاء: /cancel',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    ctx.session.conversationState = 'template:create:message'
    return
  }

  if (conversationState === 'template:create:message') {
    if (!ctx.session.templateCreationData) {
      await ctx.reply('❌ بيانات القالب غير موجودة')
      return
    }

    // Validate message
    if (text.length < 10) {
      await ctx.reply('❌ رسالة القالب قصيرة جداً. يجب أن تكون 10 أحرف على الأقل.')
      return
    }

    if (text.length > 1000) {
      await ctx.reply('❌ رسالة القالب طويلة جداً. يجب أن تكون أقل من 1000 حرف.')
      return
    }

    // Store message and move to type selection
    ctx.session.templateCreationData.message = text

    const keyboard = new InlineKeyboard()
      .text('ℹ️ معلومة', 'notif:template:create:type:info')
      .text('✅ نجاح', 'notif:template:create:type:success')
      .row()
      .text('⚠️ تحذير', 'notif:template:create:type:warning')
      .text('❌ خطأ', 'notif:template:create:type:error')
      .row()
      .text('📢 إعلان', 'notif:template:create:type:announcement')
      .text('🔔 تذكير', 'notif:template:create:type:reminder')
      .row()
      .text('🚨 تنبيه', 'notif:template:create:type:alert')
      .row()
      .text('🔙 رجوع', 'notif:templates:create-new')

    await ctx.reply(
      '📝 **إنشاء قالب مخصص**\n\n'
      + '**الخطوة 3/5: نوع القالب**\n\n'
      + 'اختر نوع القالب:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    ctx.session.conversationState = 'template:create:type'
    return
  }

  // Handle template editing
  if (conversationState === 'template:edit:name') {
    if (!ctx.session.templateEditData?.originalTemplate) {
      await ctx.reply('❌ بيانات القالب غير موجودة')
      return
    }

    // Validate name
    if (text.length < 3) {
      await ctx.reply('❌ اسم القالب قصير جداً. يجب أن يكون 3 أحرف على الأقل.')
      return
    }

    if (text.length > 50) {
      await ctx.reply('❌ اسم القالب طويل جداً. يجب أن يكون أقل من 50 حرف.')
      return
    }

    // Update template data in session
    if (!ctx.session.templateEditData.currentTemplate) {
      ctx.session.templateEditData.currentTemplate = { ...ctx.session.templateEditData.originalTemplate }
    }
    ctx.session.templateEditData.currentTemplate.name = text

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

    await ctx.reply(
      '✅ **تم تحديث اسم القالب**\n\n'
      + `**الاسم الجديد:** ${text}\n\n`
      + 'يمكنك المتابعة لتعديل خصائص أخرى أو حفظ التعديلات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    ctx.session.conversationState = undefined
    return
  }

  if (conversationState === 'template:edit:message') {
    if (!ctx.session.templateEditData?.originalTemplate) {
      await ctx.reply('❌ بيانات القالب غير موجودة')
      return
    }

    // Validate message
    if (text.length < 10) {
      await ctx.reply('❌ رسالة القالب قصيرة جداً. يجب أن تكون 10 أحرف على الأقل.')
      return
    }

    if (text.length > 1000) {
      await ctx.reply('❌ رسالة القالب طويلة جداً. يجب أن تكون أقل من 1000 حرف.')
      return
    }

    // Update template data in session
    if (!ctx.session.templateEditData.currentTemplate) {
      ctx.session.templateEditData.currentTemplate = { ...ctx.session.templateEditData.originalTemplate }
    }
    ctx.session.templateEditData.currentTemplate.message = text

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', `notif:template:edit:${ctx.session.templateEditData.templateId}`)

    await ctx.reply(
      '✅ **تم تحديث رسالة القالب**\n\n'
      + `**الرسالة الجديدة:**\n${text.substring(0, 200)}${text.length > 200 ? '...' : ''}\n\n`
      + 'يمكنك المتابعة لتعديل خصائص أخرى أو حفظ التعديلات.',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    ctx.session.conversationState = undefined
    return
  }

  // Handle template variable editing
  if (conversationState === 'template:edit-variable') {
    if (!ctx.session.templateVariableEdit) {
      await ctx.reply('❌ بيانات تعديل المتغيرات غير موجودة')
      return
    }

    const variableIndex = Number.parseInt(text) - 1
    const variables = ctx.session.templateVariableEdit.variables

    if (isNaN(variableIndex) || variableIndex < 0 || variableIndex >= variables.length) {
      await ctx.reply('❌ رقم المتغير غير صحيح. يرجى إدخال رقم صحيح.')
      return
    }

    const selectedVariable = variables[variableIndex]
    ctx.session.templateVariableEdit.selectedVariableIndex = variableIndex

    const keyboard = new InlineKeyboard()
      .text('🔙 رجوع', `notif:template:edit-variables:${ctx.session.templateVariableEdit.templateId}`)

    await ctx.reply(
      `✏️ **تعديل المتغير: {{${selectedVariable.key}}}**\n\n`
      + `**الوصف:** ${selectedVariable.description}\n`
      + `**القيمة الحالية:** ${selectedVariable.value}\n\n`
      + 'أدخل القيمة الجديدة للمتغير:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    ctx.session.conversationState = 'template:edit-variable-value'
    return
  }

  if (conversationState === 'template:edit-variable-value') {
    if (!ctx.session.templateVariableEdit) {
      await ctx.reply('❌ بيانات تعديل المتغيرات غير موجودة')
      return
    }

    const { templateId, variables, selectedVariableIndex } = ctx.session.templateVariableEdit
    const variable = variables[selectedVariableIndex!]

    // Update variable value
    variable.value = text

    // Fill template with updated variables
    const variableValues: Record<string, string> = {}
    variables.forEach((v) => {
      variableValues[v.key] = v.value
    })

    const filledMessage = await smartVariableService.fillTemplate(templateId, variableValues)

    const keyboard = new InlineKeyboard()
      .text('📤 إرسال الإشعار', `notif:template:send-filled:${templateId}`)
      .row()
      .text('✏️ تعديل متغير آخر', `notif:template:edit-variables:${templateId}`)
      .row()
      .text('🔙 رجوع', `notif:template:fill-variables:${templateId}`)

    await ctx.reply(
      `✅ **تم تحديث المتغير: {{${variable.key}}}**\n\n`
      + `**القيمة الجديدة:** ${text}\n\n`
      + `**الرسالة المحدثة:**\n${filledMessage}\n\n`
      + 'هل تريد إرسال هذه الرسالة؟',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    // Clear session data
    ctx.session.conversationState = undefined
    ctx.session.templateVariableEdit = undefined
  }
})
