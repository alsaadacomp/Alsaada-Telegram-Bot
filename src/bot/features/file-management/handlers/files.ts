/**
 * File Management Handlers
 * معالجات إدارة الملفات
 */

import type { Context } from '#root/bot/context.js'
import { Buffer } from 'node:buffer'
import { FileManagementService } from '#root/modules/services/file-management/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const fileManagementHandler = new Composer<Context>()

/**
 * Upload File Handler
 */
fileManagementHandler.callbackQuery('files:upload', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '📤 **رفع ملف**\n\n'
    + '📎 أرسل الملف الذي تريد رفعه\n\n'
    + '📋 **الأنواع المدعومة:**\n'
    + '• الصور: JPG, PNG, GIF, WebP\n'
    + '• المستندات: PDF, DOC, DOCX, TXT\n'
    + '• الجداول: XLS, XLSX, CSV\n'
    + '• الأرشيف: ZIP, RAR\n\n'
    + '📏 **الحد الأقصى:** 50 ميجابايت\n\n'
    + '💡 **نصائح:**\n'
    + '• تأكد من وضوح الملف\n'
    + '• استخدم أسماء ملفات واضحة\n'
    + '• أضف وصف للملف إذا لزم الأمر',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle file uploads
 */
fileManagementHandler.on('message:document', async (ctx, next) => {
  if (!ctx.dbUser) {
    return next()
  }

  try {
    const document = ctx.message.document

    // Check file size
    if (document.file_size && document.file_size > 50 * 1024 * 1024) {
      await ctx.reply('❌ **الملف كبير جداً**\n\n📏 الحد الأقصى: 50 ميجابايت\n\n💡 جرب ضغط الملف أو استخدام ملف أصغر', {
        parse_mode: 'Markdown',
      })
      return
    }

    await ctx.reply('🔄 **جاري رفع الملف...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Download file
    const file = await ctx.api.getFile(document.file_id)
    const fileUrl = `https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`
    const response = await fetch(fileUrl)
    const fileBuffer = Buffer.from(await response.arrayBuffer())

    // Upload file
    const uploadResult = await FileManagementService.uploadFile(
      fileBuffer,
      document.file_name || 'unknown',
      document.mime_type || 'application/octet-stream',
      ctx.dbUser!.userId,
      {
        description: `تم رفع الملف بواسطة ${ctx.dbUser!.userId}`,
        tags: ['telegram-upload'],
        isPublic: false,
      },
    )

    if (uploadResult.success && uploadResult.fileInfo) {
      const fileInfo = uploadResult.fileInfo
      const fileIcon = FileManagementService.getFileIcon(fileInfo.mimeType)
      const fileSize = FileManagementService.formatFileSize(fileInfo.size)

      let message = `✅ **تم رفع الملف بنجاح!**\n\n`
      message += `${fileIcon} **اسم الملف:** ${fileInfo.originalName}\n`
      message += `📏 **الحجم:** ${fileSize}\n`
      message += `📅 **تاريخ الرفع:** ${fileInfo.uploadedAt.toLocaleString('ar-SA')}\n`
      message += `🆔 **معرف الملف:** \`${fileInfo.id}\`\n\n`

      if (fileInfo.description) {
        message += `📝 **الوصف:** ${fileInfo.description}\n\n`
      }

      if (fileInfo.tags && fileInfo.tags.length > 0) {
        message += `🏷️ **العلامات:** ${fileInfo.tags.map(tag => `#${tag}`).join(' ')}\n\n`
      }

      const keyboard = new InlineKeyboard()
        .text('📥 تحميل', `files:download:${fileInfo.id}`)
        .text('📋 ملفاتي', 'files:my-files')
        .row()
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText(message, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
    }
    else {
      await ctx.editMessageText(
        `❌ **فشل في رفع الملف**\n\n${uploadResult.error || 'حدث خطأ غير متوقع'}\n\n💡 جرب مرة أخرى`,
        { parse_mode: 'Markdown' },
      )
    }
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error uploading file')
    await ctx.editMessageText('❌ **حدث خطأ أثناء رفع الملف**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * My Files Handler
 */
fileManagementHandler.callbackQuery('files:my-files', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحميل ملفاتك...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Get user's files
    const files = await FileManagementService.searchFiles({
      uploadedBy: ctx.dbUser!.userId,
      limit: 10,
    })

    if (files.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('📤 رفع ملف', 'files:upload')
        .row()
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText(
        '📋 **ملفاتي**\n\n📭 لا توجد ملفات مرفوعة بعد\n\n💡 ابدأ برفع ملفك الأول!',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    let message = '📋 **ملفاتي**\n\n'

    files.forEach((file, index) => {
      const fileIcon = FileManagementService.getFileIcon(file.mimeType)
      const fileSize = FileManagementService.formatFileSize(file.size)
      const isPublic = file.isPublic ? '🌐' : '🔒'

      message += `${index + 1}. ${fileIcon} **${file.originalName}**\n`
      message += `   📏 ${fileSize} • ${isPublic} • 📥 ${file.downloadCount}\n`
      message += `   📅 ${file.uploadedAt.toLocaleDateString('ar-SA')}\n\n`
    })

    const keyboard = new InlineKeyboard()
    files.slice(0, 5).forEach((file, index) => {
      keyboard.text(`${index + 1}. ${file.originalName}`, `files:view:${file.id}`)
    })
    keyboard.row()
    keyboard.text('📤 رفع ملف جديد', 'files:upload')
    keyboard.text('🔍 البحث', 'files:search')
    keyboard.row()
    keyboard.text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading user files')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل الملفات**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Search Files Handler
 */
fileManagementHandler.callbackQuery('files:search', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '🔍 **البحث في الملفات**\n\n'
    + '📝 أرسل كلمة البحث أو اسم الملف\n\n'
    + '💡 **يمكنك البحث عن:**\n'
    + '• اسم الملف\n'
    + '• وصف الملف\n'
    + '• العلامات (Tags)\n'
    + '• نوع الملف\n\n'
    + '🔍 **أمثلة:**\n'
    + '• "تقرير"\n'
    + '• "صورة"\n'
    + '• "PDF"\n'
    + '• "#مهم"',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle search queries
 */
fileManagementHandler.on('message:text', async (ctx, next) => {
  if (!ctx.dbUser || !ctx.message.text.startsWith('/')) {
    return next()
  }

  const searchQuery = ctx.message.text.trim()

  try {
    await ctx.reply('🔍 **جاري البحث...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const files = await FileManagementService.searchFiles({
      query: searchQuery,
      limit: 10,
    })

    if (files.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('🔍 بحث آخر', 'files:search')
        .row()
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText(
        `🔍 **نتائج البحث لـ "${searchQuery}"**\n\n📭 لم يتم العثور على نتائج\n\n💡 جرب كلمات بحث مختلفة`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    let message = `🔍 **نتائج البحث لـ "${searchQuery}"**\n\n`

    files.forEach((file, index) => {
      const fileIcon = FileManagementService.getFileIcon(file.mimeType)
      const fileSize = FileManagementService.formatFileSize(file.size)
      const isPublic = file.isPublic ? '🌐' : '🔒'

      message += `${index + 1}. ${fileIcon} **${file.originalName}**\n`
      message += `   📏 ${fileSize} • ${isPublic} • 📥 ${file.downloadCount}\n`
      message += `   👤 ${file.uploadedBy} • 📅 ${file.uploadedAt.toLocaleDateString('ar-SA')}\n\n`
    })

    const keyboard = new InlineKeyboard()
    files.slice(0, 5).forEach((file, index) => {
      keyboard.text(`${index + 1}. ${file.originalName}`, `files:view:${file.id}`)
    })
    keyboard.row()
    keyboard.text('🔍 بحث آخر', 'files:search')
    keyboard.text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error searching files')
    await ctx.editMessageText('❌ **حدث خطأ أثناء البحث**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Public Files Handler
 */
fileManagementHandler.callbackQuery('files:public', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحميل الملفات العامة...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const files = await FileManagementService.searchFiles({
      isPublic: true,
      limit: 10,
    })

    if (files.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText(
        '🌐 **الملفات العامة**\n\n📭 لا توجد ملفات عامة متاحة\n\n💡 الملفات العامة متاحة للجميع',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    let message = '🌐 **الملفات العامة**\n\n'

    files.forEach((file, index) => {
      const fileIcon = FileManagementService.getFileIcon(file.mimeType)
      const fileSize = FileManagementService.formatFileSize(file.size)

      message += `${index + 1}. ${fileIcon} **${file.originalName}**\n`
      message += `   📏 ${fileSize} • 📥 ${file.downloadCount}\n`
      message += `   👤 ${file.uploadedBy} • 📅 ${file.uploadedAt.toLocaleDateString('ar-SA')}\n\n`
    })

    const keyboard = new InlineKeyboard()
    files.slice(0, 5).forEach((file, index) => {
      keyboard.text(`${index + 1}. ${file.originalName}`, `files:view:${file.id}`)
    })
    keyboard.row()
    keyboard.text('🔍 البحث', 'files:search')
    keyboard.text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading public files')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل الملفات العامة**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * File Statistics Handler
 */
fileManagementHandler.callbackQuery('files:statistics', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || (ctx.dbUser.role !== 'SUPER_ADMIN' && ctx.dbUser.role !== 'ADMIN')) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    await ctx.reply('🔄 **جاري تحضير الإحصائيات...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const stats = await FileManagementService.getFileStatistics()

    let message = '📊 **إحصائيات الملفات**\n\n'
    message += `📁 **إجمالي الملفات:** ${stats.totalFiles}\n`
    message += `💾 **إجمالي الحجم:** ${FileManagementService.formatFileSize(stats.totalSize)}\n`
    message += `📤 **رفعات اليوم:** ${stats.recentUploads}\n\n`

    message += `📋 **التوزيع حسب النوع:**\n`
    Object.entries(stats.filesByType).forEach(([type, count]) => {
      const icon = type === 'image' ? '🖼️' : type === 'document' ? '📄' : type === 'archive' ? '📦' : '📁'
      message += `${icon} ${type}: ${count} ملف\n`
    })

    const keyboard = new InlineKeyboard()
      .text('🔄 تحديث', 'files:statistics')
      .text('📋 ملفاتي', 'files:my-files')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error loading file statistics')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل الإحصائيات**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * File Settings Handler
 */
fileManagementHandler.callbackQuery('files:settings', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser || ctx.dbUser.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '⚙️ **إعدادات الملفات**\n\n'
    + '🔧 **الإعدادات المتاحة:**\n'
    + '• الحد الأقصى لحجم الملف: 50 ميجابايت\n'
    + '• الأنواع المدعومة: الصور، المستندات، الأرشيف\n'
    + '• التخزين: محلي\n'
    + '• النسخ الاحتياطي: يومي\n\n'
    + '📋 **إحصائيات النظام:**\n'
    + '• مساحة التخزين المستخدمة\n'
    + '• عدد الملفات المرفوعة\n'
    + '• معدل الرفع اليومي\n\n'
    + '💡 **ملاحظة:** هذه الإعدادات قابلة للتخصيص من قبل المطور',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Download File Handler
 */
fileManagementHandler.callbackQuery(/^files:download:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const fileId = ctx.match![1]

    await ctx.reply('🔄 **جاري تحميل الملف...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    const fileBuffer = await FileManagementService.downloadFile(fileId)
    const fileInfo = await FileManagementService.getFileInfo(fileId)

    if (!fileBuffer || !fileInfo) {
      await ctx.editMessageText('❌ **الملف غير موجود**\n\n💡 قد يكون الملف محذوفاً أو غير متاح', {
        parse_mode: 'Markdown',
      })
      return
    }

    // Send file
    const { InputFile } = await import('grammy')
    const file = new InputFile(fileBuffer, fileInfo.originalName)

    await ctx.replyWithDocument(file, {
      caption: `📥 **تم تحميل الملف بنجاح!**\n\n${FileManagementService.getFileIcon(fileInfo.mimeType)} **${fileInfo.originalName}**\n📏 **الحجم:** ${FileManagementService.formatFileSize(fileInfo.size)}\n📅 **تاريخ الرفع:** ${fileInfo.uploadedAt.toLocaleString('ar-SA')}`,
      parse_mode: 'Markdown',
    })

    const keyboard = new InlineKeyboard()
      .text('📋 ملفاتي', 'files:my-files')
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply('🎉 تم تحميل الملف بنجاح!', {
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error downloading file')
    await ctx.editMessageText('❌ **حدث خطأ أثناء تحميل الملف**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * View File Details Handler
 */
fileManagementHandler.callbackQuery(/^files:view:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const fileId = ctx.match![1]
    const fileInfo = await FileManagementService.getFileInfo(fileId)

    if (!fileInfo) {
      await ctx.reply('❌ **الملف غير موجود**\n\n💡 قد يكون الملف محذوفاً أو غير متاح', {
        parse_mode: 'Markdown',
      })
      return
    }

    const fileIcon = FileManagementService.getFileIcon(fileInfo.mimeType)
    const fileSize = FileManagementService.formatFileSize(fileInfo.size)
    const isPublic = fileInfo.isPublic ? '🌐 عام' : '🔒 خاص'

    let message = `${fileIcon} **تفاصيل الملف**\n\n`
    message += `📄 **اسم الملف:** ${fileInfo.originalName}\n`
    message += `📏 **الحجم:** ${fileSize}\n`
    message += `🔒 **الخصوصية:** ${isPublic}\n`
    message += `📥 **عدد التحميلات:** ${fileInfo.downloadCount}\n`
    message += `👤 **رفع بواسطة:** ${fileInfo.uploadedBy}\n`
    message += `📅 **تاريخ الرفع:** ${fileInfo.uploadedAt.toLocaleString('ar-SA')}\n\n`

    if (fileInfo.description) {
      message += `📝 **الوصف:** ${fileInfo.description}\n\n`
    }

    if (fileInfo.tags && fileInfo.tags.length > 0) {
      message += `🏷️ **العلامات:** ${fileInfo.tags.map(tag => `#${tag}`).join(' ')}\n\n`
    }

    const keyboard = new InlineKeyboard()
      .text('📥 تحميل', `files:download:${fileInfo.id}`)
      .text('🗑️ حذف', `files:delete:${fileInfo.id}`)
      .row()
      .text('📋 ملفاتي', 'files:my-files')
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error viewing file details')
    await ctx.reply('❌ **حدث خطأ أثناء عرض تفاصيل الملف**\n\n💡 جرب مرة أخرى لاحقاً', {
      parse_mode: 'Markdown',
    })
  }
})

/**
 * Delete File Handler
 */
fileManagementHandler.callbackQuery(/^files:delete:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const fileId = ctx.match![1]
    const fileInfo = await FileManagementService.getFileInfo(fileId)

    if (!fileInfo) {
      await ctx.answerCallbackQuery('❌ الملف غير موجود')
      return
    }

    // Check if user owns the file
    if (fileInfo.uploadedBy !== ctx.dbUser!.userId) {
      await ctx.answerCallbackQuery('❌ لا يمكنك حذف هذا الملف')
      return
    }

    const deleted = await FileManagementService.deleteFile(fileId, ctx.dbUser!.userId)

    if (deleted) {
      await ctx.answerCallbackQuery('✅ تم حذف الملف')

      const keyboard = new InlineKeyboard()
        .text('📋 ملفاتي', 'files:my-files')
        .text('🔙 رجوع', 'menu:back')

      await ctx.editMessageText('✅ **تم حذف الملف بنجاح!**\n\n🗑️ الملف محذوف نهائياً من النظام', {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
    }
    else {
      await ctx.answerCallbackQuery('❌ فشل في حذف الملف')
    }
  }
  catch (error) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error deleting file')
    await ctx.answerCallbackQuery('❌ حدث خطأ أثناء حذف الملف')
  }
})
