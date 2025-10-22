/**
 * Barcode Scanner Handlers
 * معالجات ماسح الباركود
 */

import type { Context } from '#root/bot/context.js'
import { Buffer } from 'node:buffer'
import { BarcodeScannerService } from '#root/modules/services/barcode-scanner/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const barcodeScannerHandler = new Composer<Context>()

/**
 * Scan QR Code Handler
 */
barcodeScannerHandler.callbackQuery('barcode:scan-qr', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '🔲 **مسح QR Code**\n\n📸 أرسل صورة تحتوي على QR Code للمسح\n\n💡 **نصائح:**\n• تأكد من وضوح الصورة\n• تجنب الظلال والانعكاسات\n• اجعل الكود في المنتصف',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Scan Barcode Handler
 */
barcodeScannerHandler.callbackQuery('barcode:scan-barcode', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '📊 **مسح الباركود**\n\n📸 أرسل صورة تحتوي على باركود للمسح\n\n💡 **نصائح:**\n• تأكد من وضوح الصورة\n• اجعل الباركود أفقي\n• تجنب الانحناء والتشويه',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Generate QR Code Handler
 */
barcodeScannerHandler.callbackQuery('barcode:generate-qr', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  // Set session for QR generation
  ctx.session.qrGenerationMode = true

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '➕ **إنشاء QR Code**\n\n📝 أرسل النص الذي تريد تحويله إلى QR Code\n\n💡 **أمثلة:**\n• رابط موقع: https://example.com\n• معلومات الاتصال: +966501234567\n• نص عادي: مرحباً بك',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Barcode History Handler
 */
barcodeScannerHandler.callbackQuery('barcode:history', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (!ctx.dbUser) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  // Check permissions
  if (!['SUPER_ADMIN', 'ADMIN'].includes(ctx.dbUser.role)) {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '📋 **سجل المسح**\n\n🚧 هذه الميزة قيد التطوير\n\nستشمل:\n• تاريخ المسح\n• إحصائيات الاستخدام\n• تصدير البيانات',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Handle photo messages for barcode scanning
 */
barcodeScannerHandler.on('message:photo', async (ctx, next) => {
  if (!ctx.dbUser) {
    return next()
  }

  try {
    // Show processing message
    await ctx.reply('🔄 **جاري معالجة الصورة...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Get the largest photo
    const photo = ctx.message.photo[ctx.message.photo.length - 1]

    // Validate photo size
    if (photo.file_size && photo.file_size > 20 * 1024 * 1024) {
      await ctx.editMessageText('❌ **الصورة كبيرة جداً**\n\n📏 الحد الأقصى: 20 ميجابايت\n\n💡 جرب ضغط الصورة أو استخدام صورة أصغر')
      return
    }

    // Download photo with timeout
    const downloadPromise = ctx.api.getFile(photo.file_id)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Download timeout')), 30000),
    )

    const file = await Promise.race([downloadPromise, timeoutPromise]) as any

    // Download image buffer
    const imageResponse = await fetch(`https://api.telegram.org/file/bot${ctx.api.token}/${file.file_path}`)

    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // Update processing message
    await ctx.editMessageText('🔍 **جاري مسح الباركود...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Try to scan QR code first
    let result = await BarcodeScannerService.scanQRCode(imageBuffer)

    if (!result) {
      // Try barcode scanning
      result = await BarcodeScannerService.scanBarcode(imageBuffer)
    }

    // Delete processing message
    try {
      await ctx.deleteMessage()
    }
    catch {
      // Ignore delete errors
    }

    if (result) {
      const formattedResult = BarcodeScannerService.formatBarcodeData(result)

      const keyboard = new InlineKeyboard()
        .text('📋 نسخ النص', `barcode:copy:${Buffer.from(result.data).toString('base64')}`)
        .row()
        .text('🔄 مسح آخر', 'barcode:scan-qr')
        .text('🔙 رجوع', 'menu:back')

      await ctx.reply(formattedResult, {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      })
    }
    else {
      await ctx.reply(
        '❌ **لم يتم العثور على باركود**\n\n💡 **نصائح للنجاح:**\n• تأكد من وضوح الصورة\n• اجعل الباركود في المنتصف\n• تجنب الظلال والانعكاسات\n• استخدم إضاءة جيدة\n• جرب صورة أخرى',
        { parse_mode: 'Markdown' },
      )
    }
  }
  catch (error: unknown) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error processing barcode scan')

    // Try to delete processing message
    try {
      await ctx.deleteMessage()
    }
    catch {
      // Ignore delete errors
    }

    let errorMessage = '❌ حدث خطأ أثناء معالجة الصورة'

    if (error instanceof Error && error.message?.includes('timeout')) {
      errorMessage = '⏰ انتهت مهلة المعالجة\n\n💡 جرب صورة أصغر أو أكثر وضوحاً'
    }
    else if (error instanceof Error && error.message?.includes('download')) {
      errorMessage = '📥 خطأ في تحميل الصورة\n\n💡 جرب إرسال الصورة مرة أخرى'
    }

    await ctx.reply(errorMessage)
  }
})

/**
 * Handle text messages for QR generation
 */
barcodeScannerHandler.on('message:text', async (ctx, next) => {
  if (!ctx.session.qrGenerationMode || !ctx.dbUser) {
    return next()
  }

  const text = ctx.message.text

  try {
    // Show processing message
    await ctx.reply('🔄 **جاري إنشاء QR Code...**\n\n⏳ يرجى الانتظار...', {
      parse_mode: 'Markdown',
    })

    // Validate text length
    if (text.length > 2000) {
      await ctx.editMessageText('❌ **النص طويل جداً**\n\n📏 الحد الأقصى: 2000 حرف\n\n💡 جرب نص أقصر')
      return
    }

    // Generate QR code
    const qrBuffer = await BarcodeScannerService.generateQRCode({
      text,
      size: 400,
      margin: 8,
      color: '#000000',
      backgroundColor: '#FFFFFF',
    })

    // Delete processing message
    try {
      await ctx.deleteMessage()
    }
    catch {
      // Ignore delete errors
    }

    // Send QR code as photo using InputFile
    const { InputFile } = await import('grammy')
    const qrFile = new InputFile(qrBuffer, `qr-code-${Date.now()}.png`)

    await ctx.replyWithPhoto(
      qrFile,
      {
        caption: `✅ **تم إنشاء QR Code بنجاح!**\n\n📝 **النص:** ${text}\n📏 **الحجم:** 400x400 بكسل\n\n💡 يمكنك حفظ الصورة أو مشاركتها`,
        parse_mode: 'Markdown',
      },
    )

    // Clear session
    ctx.session.qrGenerationMode = false

    const keyboard = new InlineKeyboard()
      .text('➕ إنشاء آخر', 'barcode:generate-qr')
      .row()
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply('🎉 تم إنشاء QR Code بنجاح!', {
      reply_markup: keyboard,
    })
  }
  catch (error: unknown) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating QR code')

    // Try to delete processing message
    try {
      await ctx.deleteMessage()
    }
    catch {
      // Ignore delete errors
    }

    let errorMessage = '❌ حدث خطأ أثناء إنشاء QR Code'

    if (error instanceof Error && error.message?.includes('empty')) {
      errorMessage = '❌ النص فارغ\n\n💡 أرسل نصاً صالحاً لإنشاء QR Code'
    }
    else if (error instanceof Error && error.message?.includes('too long')) {
      errorMessage = '❌ النص طويل جداً\n\n💡 جرب نص أقصر (أقل من 2000 حرف)'
    }
    else if (error instanceof Error && error.message?.includes('size')) {
      errorMessage = '❌ حجم غير صالح\n\n💡 جرب مرة أخرى'
    }

    await ctx.reply(errorMessage)
  }
})

/**
 * Copy barcode data handler
 */
barcodeScannerHandler.callbackQuery(/^barcode:copy:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery('📋 تم نسخ البيانات')

  try {
    const encodedData = ctx.match![1]
    const data = Buffer.from(encodedData, 'base64').toString()

    // Detect data type for better formatting
    let dataType = 'نص عادي'

    if (data.startsWith('http://') || data.startsWith('https://')) {
      dataType = 'رابط ويب'
    }
    else if (data.includes('@') && data.includes('.')) {
      dataType = 'بريد إلكتروني'
    }
    else if (/^\+?[\d\s\-()]+$/.test(data)) {
      dataType = 'رقم هاتف'
    }
    else if (data.includes('wifi') || data.includes('WIFI')) {
      dataType = 'شبكة WiFi'
    }

    const keyboard = new InlineKeyboard()
      .url('🔗 فتح الرابط', data)
      .row()
      .text('🔄 مسح آخر', 'barcode:scan-qr')
      .text('🔙 رجوع', 'menu:back')

    await ctx.reply(
      `📋 **البيانات المستخرجة:**\n\n`
      + `📊 **النوع:** ${dataType}\n`
      + `📝 **المحتوى:**\n\`\`\`\n${data}\n\`\`\`\n\n`
      + `💡 يمكنك نسخ النص من الأعلى`,
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error: unknown) {
    logger.error({ error: error instanceof Error ? error.message : error }, 'Error copying barcode data')
    await ctx.answerCallbackQuery('❌ خطأ في نسخ البيانات')
  }
})

/**
 * Help command for barcode scanner
 */
barcodeScannerHandler.command('barcode_help', async (ctx) => {
  if (!ctx.dbUser) {
    return
  }

  const helpText = `
📱 **دليل استخدام ماسح الباركود**

🔲 **مسح QR Code:**
• أرسل صورة تحتوي على QR Code
• تأكد من وضوح الصورة
• اجعل QR Code في المنتصف

📊 **مسح الباركود:**
• أرسل صورة تحتوي على باركود
• تجنب الظلال والانعكاسات
• استخدم إضاءة جيدة

➕ **إنشاء QR Code:**
• اضغط على "إنشاء QR Code"
• أرسل النص المطلوب
• احفظ الصورة المُنشأة

💡 **نصائح للنجاح:**
• استخدم صور عالية الجودة
• تجنب الصور المظلمة أو المشوشة
• اجعل الباركود في المنتصف
• استخدم إضاءة كافية

❓ **للحصول على المساعدة:** أرسل /help
  `

  const keyboard = new InlineKeyboard()
    .text('🔲 مسح QR', 'barcode:scan-qr')
    .text('📊 مسح باركود', 'barcode:scan-barcode')
    .row()
    .text('➕ إنشاء QR', 'barcode:generate-qr')
    .text('📜 السجل', 'barcode:history')
    .row()
    .text('🔙 رجوع', 'menu:back')

  await ctx.reply(helpText, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  })
})
