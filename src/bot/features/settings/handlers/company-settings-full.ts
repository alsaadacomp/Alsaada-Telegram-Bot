/**
 * Company Settings Handler (Full Version)
 * معالج إعدادات الشركة الشامل
 */

import type { Context } from '#root/bot/context.js'
import { BranchService, CompanyService, ProjectService } from '#root/modules/company/index.js'
import { formatNumber } from '#root/modules/input/formatters/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const companySettingsFullHandler = new Composer<Context>()

/**
 * Show company settings menu
 */
companySettingsFullHandler.callbackQuery('settings:company', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const _company = await CompanyService.get()
  const _formattedInfo = await CompanyService.getFormattedInfo()

  const keyboard = new InlineKeyboard()
    .text('📝 البيانات الأساسية', 'company:basic')
    .row()
    .text('📍 بيانات الاتصال', 'company:contact')
    .row()
    .text('💼 البيانات القانونية', 'company:legal')
    .row()
    .text('🏦 الحسابات البنكية', 'company:banks')
    .row()
    .text('🏢 الفروع', 'company:branches')
    .row()
    .text('🏗️ المشاريع', 'company:projects')
    .row()
    .text('👥 البيانات الإدارية', 'company:management')
    .row()
    .text('📊 عرض كل البيانات', 'company:view-all')
    .row()
    .text('🔙 رجوع للإعدادات', 'settings:main')

  await ctx.editMessageText(
    '🏢 **إعدادات الشركة**\n\n'
    + 'اختر القسم الذي تريد تعديله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * View all company data
 */
companySettingsFullHandler.callbackQuery('company:view-all', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const formattedInfo = await CompanyService.getFormattedInfo()

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'settings:company')

  await ctx.editMessageText(
    formattedInfo,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Basic company data menu
 */
companySettingsFullHandler.callbackQuery('company:basic', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const company = await CompanyService.get()

  const keyboard = new InlineKeyboard()
    .text('✏️ اسم الشركة (عربي)', 'company:edit:name')
    .row()
    .text('✏️ اسم الشركة (English)', 'company:edit:nameEn')
    .row()
    .text('✏️ الوصف', 'company:edit:description')
    .row()
    .text('✏️ سنة التأسيس', 'company:edit:establishedYear')
    .row()
    .text('✏️ الشكل القانوني', 'company:edit:legalForm')
    .row()
    .text('✏️ رأس المال', 'company:edit:capital')
    .row()
    .text('🔙 رجوع', 'settings:company')

  let info = '📝 **البيانات الأساسية**\n\n'
  info += `📌 الاسم: ${company?.name || 'غير محدد'}\n`
  info += `📌 الاسم (EN): ${company?.nameEn || 'غير محدد'}\n`
  info += `📄 الوصف: ${company?.description || 'غير محدد'}\n`
  info += `📅 سنة التأسيس: ${company?.establishedYear || 'غير محدد'}\n`
  info += `🏛️ الشكل القانوني: ${company?.legalForm || 'غير محدد'}\n`
  info += `💰 رأس المال: ${company?.capital ? `${formatNumber(company.capital)} ${company.currency || ''}` : 'غير محدد'}\n`

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

/**
 * Contact data menu
 */
companySettingsFullHandler.callbackQuery('company:contact', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const company = await CompanyService.get()

  const keyboard = new InlineKeyboard()
    .text('✏️ العنوان', 'company:edit:address')
    .row()
    .text('✏️ المدينة', 'company:edit:city')
    .row()
    .text('✏️ الدولة', 'company:edit:country')
    .row()
    .text('✏️ التليفون', 'company:edit:phone')
    .row()
    .text('✏️ الموبايل', 'company:edit:mobile')
    .row()
    .text('✏️ الإيميل', 'company:edit:email')
    .row()
    .text('✏️ الموقع الإلكتروني', 'company:edit:website')
    .row()
    .text('🔙 رجوع', 'settings:company')

  let info = '📍 **بيانات الاتصال**\n\n'
  info += `📍 العنوان: ${company?.address || 'غير محدد'}\n`
  info += `🏙️ المدينة: ${company?.city || 'غير محدد'}\n`
  info += `🌍 الدولة: ${company?.country || 'غير محدد'}\n`
  info += `📞 التليفون: ${company?.phone || 'غير محدد'}\n`
  info += `📱 الموبايل: ${company?.mobile || 'غير محدد'}\n`
  info += `✉️ الإيميل: ${company?.email || 'غير محدد'}\n`
  info += `🌐 الموقع: ${company?.website || 'غير محدد'}\n`

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

/**
 * Legal data menu
 */
companySettingsFullHandler.callbackQuery('company:legal', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const company = await CompanyService.get()

  const keyboard = new InlineKeyboard()
    .text('✏️ السجل التجاري', 'company:edit:commercialRegister')
    .row()
    .text('✏️ البطاقة الضريبية', 'company:edit:taxId')
    .row()
    .text('✏️ الرقم التأميني', 'company:edit:insuranceNumber')
    .row()
    .text('✏️ مأمورية الضرائب', 'company:edit:taxOffice')
    .row()
    .text('✏️ الغرفة التجارية', 'company:edit:chamberOfCommerce')
    .row()
    .text('🔙 رجوع', 'settings:company')

  let info = '💼 **البيانات القانونية**\n\n'
  info += `📋 السجل التجاري: ${company?.commercialRegister || 'غير محدد'}\n`
  info += `💳 البطاقة الضريبية: ${company?.taxId || 'غير محدد'}\n`
  info += `🛡️ الرقم التأميني: ${company?.insuranceNumber || 'غير محدد'}\n`
  info += `🏛️ مأمورية الضرائب: ${company?.taxOffice || 'غير محدد'}\n`
  info += `🏢 الغرفة التجارية: ${company?.chamberOfCommerce || 'غير محدد'}\n`

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

/**
 * Edit field handler
 */
companySettingsFullHandler.callbackQuery(/^company:edit:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const field = ctx.match[1]
  const fieldNames: Record<string, string> = {
    name: 'اسم الشركة (عربي)',
    nameEn: 'اسم الشركة (English)',
    description: 'وصف الشركة',
    establishedYear: 'سنة التأسيس',
    legalForm: 'الشكل القانوني',
    capital: 'رأس المال',
    address: 'العنوان',
    city: 'المدينة',
    country: 'الدولة',
    phone: 'التليفون',
    mobile: 'الموبايل',
    email: 'الإيميل',
    website: 'الموقع الإلكتروني',
    commercialRegister: 'السجل التجاري',
    taxId: 'البطاقة الضريبية',
    insuranceNumber: 'الرقم التأميني',
    taxOffice: 'مأمورية الضرائب',
    chamberOfCommerce: 'الغرفة التجارية',
  }

  await ctx.editMessageText(
    `✏️ **تعديل ${fieldNames[field] || field}**\n\n`
    + `أرسل القيمة الجديدة:\n\n`
    + `_(يمكنك إلغاء العملية بإرسال /cancel)_`,
    {
      parse_mode: 'Markdown',
    },
  )

  ctx.session.awaitingInput = {
    type: 'company_field',
    data: { field },
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Handle text input for company fields
 */
companySettingsFullHandler.on('message:text', async (ctx, next) => {
  if (ctx.session.awaitingInput?.type === 'company_field') {
    const field = ctx.session.awaitingInput.data?.field
    const newValue = ctx.message.text.trim()

    if (newValue === '/cancel') {
      ctx.session.awaitingInput = undefined
      await ctx.reply('❌ تم إلغاء العملية.')
      return
    }

    try {
      const updateData: any = {
        [field]: field === 'establishedYear' || field === 'capital'
          ? Number.parseFloat(newValue)
          : newValue,
        updatedBy: ctx.dbUser?.userId,
      }

      await CompanyService.update(updateData)

      ctx.session.awaitingInput = undefined

      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع لإعدادات الشركة', 'settings:company')

      await ctx.reply(
        `✅ **تم التحديث بنجاح!**\n\n`
        + `القيمة الجديدة: **${newValue}**`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
    }
    catch (error) {
      ctx.logger.error({ error, field, newValue }, 'Failed to update company field')
      await ctx.reply('❌ حدث خطأ أثناء حفظ البيانات.\n\n' + `_${error instanceof Error ? error.message : String(error)}_`, {
        parse_mode: 'Markdown',
      })
    }
  }
  else {
    await next()
  }
})

// ====================================
// Branches Management (inside Company)
// ====================================

companySettingsFullHandler.callbackQuery('company:branches', async (ctx) => {
  await ctx.answerCallbackQuery()

  const company = await CompanyService.get()
  if (!company) {
    await ctx.editMessageText('❌ لم يتم العثور على بيانات الشركة')
    return
  }

  const branches = await BranchService.getAll(company.id, false)
  const branchList = await BranchService.getFormattedList(company.id)

  const keyboard = new InlineKeyboard()
    .text('➕ إضافة فرع جديد', 'company:branch:add')
    .row()

  if (branches.length > 0) {
    keyboard.text('📋 عرض جميع الفروع', 'company:branch:list').row()
  }

  keyboard.text('🔙 رجوع', 'settings:company')

  await ctx.editMessageText(
    `🏢 **إدارة الفروع**\n\n`
    + `عدد الفروع: **${branches.length}**\n`
    + `الفروع النشطة: **${branches.filter(b => b.isActive).length}**\n\n${
      branchList}`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

companySettingsFullHandler.callbackQuery('company:branch:list', async (ctx) => {
  await ctx.answerCallbackQuery()

  const company = await CompanyService.get()
  if (!company) {
    await ctx.answerCallbackQuery('❌ خطأ في تحميل البيانات')
    return
  }

  const branches = await BranchService.getAll(company.id, false)

  const keyboard = new InlineKeyboard()

  branches.forEach((branch) => {
    const status = branch.isActive ? '✅' : '🚫'
    keyboard.text(`${status} ${branch.name}`, `company:branch:view:${branch.id}`).row()
  })

  keyboard.text('🔙 رجوع', 'company:branches')

  await ctx.editMessageText(
    '🏢 **قائمة الفروع**\n\n'
    + 'اختر فرع لعرض تفاصيله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

companySettingsFullHandler.callbackQuery(/^company:branch:view:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const branchId = Number.parseInt(ctx.match[1])
  const branch = await BranchService.getById(branchId)

  if (!branch) {
    await ctx.answerCallbackQuery('❌ لم يتم العثور على الفرع')
    return
  }

  let info = `🏢 **${branch.name}**\n\n`
  if (branch.address)
    info += `📍 العنوان: ${branch.address}\n`
  if (branch.city)
    info += `🏙️ المدينة: ${branch.city}\n`
  if (branch.phone)
    info += `📞 التليفون: ${branch.phone}\n`
  if (branch.mobile)
    info += `📱 الموبايل: ${branch.mobile}\n`
  if (branch.email)
    info += `📧 الإيميل: ${branch.email}\n`
  if (branch.manager)
    info += `👤 المدير: ${branch.manager}\n`
  if (branch.managerPhone)
    info += `📞 تليفون المدير: ${branch.managerPhone}\n`
  if (branch.notes)
    info += `📝 ملاحظات: ${branch.notes}\n`
  info += `\n📊 الحالة: ${branch.isActive ? '✅ نشط' : '🚫 معطل'}\n`

  const keyboard = new InlineKeyboard()
    .text(branch.isActive ? '🚫 تعطيل' : '✅ تفعيل', `company:branch:toggle:${branch.id}`)
    .row()
    .text('🔙 رجوع للقائمة', 'company:branch:list')

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

companySettingsFullHandler.callbackQuery(/^company:branch:toggle:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const branchId = Number.parseInt(ctx.match[1])
  const branch = await BranchService.getById(branchId)

  if (!branch) {
    await ctx.answerCallbackQuery('❌ لم يتم العثور على الفرع')
    return
  }

  await BranchService.update(branchId, {
    isActive: !branch.isActive,
    updatedBy: ctx.dbUser?.userId,
  })

  await ctx.answerCallbackQuery(`✅ تم ${!branch.isActive ? 'تفعيل' : 'تعطيل'} الفرع`)

  // Refresh view
  const updatedBranch = await BranchService.getById(branchId)
  if (!updatedBranch)
    return

  let info = `🏢 **${updatedBranch.name}**\n\n`
  if (updatedBranch.address)
    info += `📍 العنوان: ${updatedBranch.address}\n`
  if (updatedBranch.city)
    info += `🏙️ المدينة: ${updatedBranch.city}\n`
  if (updatedBranch.phone)
    info += `📞 التليفون: ${updatedBranch.phone}\n`
  if (updatedBranch.mobile)
    info += `📱 الموبايل: ${updatedBranch.mobile}\n`
  if (updatedBranch.email)
    info += `📧 الإيميل: ${updatedBranch.email}\n`
  if (updatedBranch.manager)
    info += `👤 المدير: ${updatedBranch.manager}\n`
  if (updatedBranch.managerPhone)
    info += `📞 تليفون المدير: ${updatedBranch.managerPhone}\n`
  if (updatedBranch.notes)
    info += `📝 ملاحظات: ${updatedBranch.notes}\n`
  info += `\n📊 الحالة: ${updatedBranch.isActive ? '✅ نشط' : '🚫 معطل'}\n`

  const keyboard = new InlineKeyboard()
    .text(updatedBranch.isActive ? '🚫 تعطيل' : '✅ تفعيل', `company:branch:toggle:${updatedBranch.id}`)
    .row()
    .text('🔙 رجوع للقائمة', 'company:branch:list')

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

companySettingsFullHandler.callbackQuery('company:branch:add', async (ctx) => {
  await ctx.answerCallbackQuery('🚧 هذه الميزة قيد التطوير')
  // TODO: Implement add branch flow using conversations
})

// ====================================
// Projects Management (inside Company)
// ====================================

companySettingsFullHandler.callbackQuery('company:projects', async (ctx) => {
  await ctx.answerCallbackQuery()

  const company = await CompanyService.get()
  if (!company) {
    await ctx.editMessageText('❌ لم يتم العثور على بيانات الشركة')
    return
  }

  const projects = await ProjectService.getAll(company.id, false)
  const stats = await ProjectService.getStatistics(company.id)

  const keyboard = new InlineKeyboard()
    .text('➕ إضافة مشروع جديد', 'company:project:add')
    .row()

  if (projects.length > 0) {
    keyboard.text('📋 عرض جميع المشاريع', 'company:project:list').row()
    keyboard.text('📊 الإحصائيات', 'company:project:stats').row()
  }

  keyboard.text('🔙 رجوع', 'settings:company')

  await ctx.editMessageText(
    '🏗️ **إدارة المشاريع**\n\n'
    + `📊 إجمالي المشاريع: **${stats.total}**\n`
    + `⚙️ قيد التنفيذ: **${stats.active}**\n`
    + `✅ منتهية: **${stats.completed}**\n`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

companySettingsFullHandler.callbackQuery('company:project:list', async (ctx) => {
  await ctx.answerCallbackQuery()

  const company = await CompanyService.get()
  if (!company) {
    await ctx.answerCallbackQuery('❌ خطأ في تحميل البيانات')
    return
  }

  const projects = await ProjectService.getAll(company.id, false)

  const keyboard = new InlineKeyboard()

  projects.forEach((project) => {
    const status = project.isActive ? '✅' : '🚫'
    keyboard.text(`${status} ${project.name}`, `company:project:view:${project.id}`).row()
  })

  keyboard.text('🔙 رجوع', 'company:projects')

  await ctx.editMessageText(
    '🏗️ **قائمة المشاريع**\n\n'
    + 'اختر مشروع لعرض تفاصيله:',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

companySettingsFullHandler.callbackQuery(/^company:project:view:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const projectId = Number.parseInt(ctx.match[1])
  const project = await ProjectService.getById(projectId)

  if (!project) {
    await ctx.answerCallbackQuery('❌ لم يتم العثور على المشروع')
    return
  }

  let info = `🏗️ **${project.name}**\n\n`
  if (project.description)
    info += `📄 الوصف: ${project.description}\n\n`

  if (project.startDate || project.endDate) {
    info += `**📅 التواريخ:**\n`
    if (project.startDate)
      info += `▶️ البداية: ${project.startDate.toLocaleDateString('ar-EG')}\n`
    if (project.endDate)
      info += `🏁 الانتهاء المتوقع: ${project.endDate.toLocaleDateString('ar-EG')}\n\n`
  }

  info += `**📊 الحالة:**\n`
  if (project.status)
    info += `📌 ${project.status}\n`
  info += `\n${project.isActive ? '✅ نشط' : '🚫 معطل'}\n`

  if (project.notes)
    info += `\n📝 **ملاحظات:** ${project.notes}\n`

  const keyboard = new InlineKeyboard()
    .text(project.isActive ? '🚫 تعطيل' : '✅ تفعيل', `company:project:toggle:${project.id}`)
    .row()
    .text('🔙 رجوع للقائمة', 'company:project:list')

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

companySettingsFullHandler.callbackQuery(/^company:project:toggle:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const projectId = Number.parseInt(ctx.match[1])
  const project = await ProjectService.getById(projectId)

  if (!project) {
    await ctx.answerCallbackQuery('❌ لم يتم العثور على المشروع')
    return
  }

  await ProjectService.update(projectId, {
    isActive: !project.isActive,
    updatedBy: ctx.dbUser?.userId,
  })

  await ctx.answerCallbackQuery(`✅ تم ${!project.isActive ? 'تفعيل' : 'تعطيل'} المشروع`)

  // Refresh view
  const updatedProject = await ProjectService.getById(projectId)
  if (!updatedProject)
    return

  let info = `🏗️ **${updatedProject.name}**\n\n`
  if (updatedProject.description)
    info += `📄 الوصف: ${updatedProject.description}\n\n`

  if (updatedProject.startDate || updatedProject.endDate) {
    info += `**📅 التواريخ:**\n`
    if (updatedProject.startDate)
      info += `▶️ البداية: ${updatedProject.startDate.toLocaleDateString('ar-EG')}\n`
    if (updatedProject.endDate)
      info += `🏁 الانتهاء المتوقع: ${updatedProject.endDate.toLocaleDateString('ar-EG')}\n\n`
  }

  if (updatedProject.projectManager) {
    info += `**👥 الفريق:**\n`
    info += `👤 مدير المشروع: ${updatedProject.projectManager}\n`
    if (updatedProject.engineer)
      info += `🔧 المهندس: ${updatedProject.engineer}\n`
    if (updatedProject.supervisor)
      info += `👨‍💼 المشرف: ${updatedProject.supervisor}\n\n`
  }

  if (updatedProject.contractValue) {
    info += `**💰 الميزانية:**\n`
    const currency = updatedProject.currency || 'EGP'
    info += `💵 قيمة العقد: ${updatedProject.contractValue.toLocaleString()} ${currency}\n`
    if (updatedProject.paidAmount)
      info += `✅ المدفوع: ${updatedProject.paidAmount.toLocaleString()} ${currency}\n`
    if (updatedProject.remainingAmount)
      info += `⏳ المتبقي: ${updatedProject.remainingAmount.toLocaleString()} ${currency}\n\n`
  }

  info += `**📊 الحالة:**\n`
  if (updatedProject.status)
    info += `📌 ${updatedProject.status}\n`
  info += `\n${updatedProject.isActive ? '✅ نشط' : '🚫 معطل'}\n`

  if (updatedProject.notes)
    info += `\n📝 **ملاحظات:** ${updatedProject.notes}\n`

  const keyboard = new InlineKeyboard()
    .text(updatedProject.isActive ? '🚫 تعطيل' : '✅ تفعيل', `company:project:toggle:${updatedProject.id}`)
    .row()
    .text('🔙 رجوع للقائمة', 'company:project:list')

  await ctx.editMessageText(info, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})

companySettingsFullHandler.callbackQuery('company:project:stats', async (ctx) => {
  await ctx.answerCallbackQuery()

  const company = await CompanyService.get()
  if (!company) {
    await ctx.answerCallbackQuery('❌ خطأ في تحميل البيانات')
    return
  }

  const stats = await ProjectService.getStatistics(company.id)

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'company:projects')

  await ctx.editMessageText(
    '📊 **إحصائيات المشاريع**\n\n'
    + `📋 إجمالي المشاريع: **${stats.total}**\n`
    + `⚙️ قيد التنفيذ: **${stats.active}**\n`
    + `✅ منتهية: **${stats.completed}**\n\n`
    + `💰 **المعلومات المالية:**\n`
    + `💵 إجمالي القيمة: **${stats.totalValue.toLocaleString()}**\n`
    + `✅ إجمالي المدفوع: **${stats.paidTotal.toLocaleString()}**\n`
    + `⏳ إجمالي المتبقي: **${stats.remainingTotal.toLocaleString()}**\n`,
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

companySettingsFullHandler.callbackQuery('company:project:add', async (ctx) => {
  await ctx.answerCallbackQuery('🚧 هذه الميزة قيد التطوير')
  // TODO: Implement add project flow using conversations
})
