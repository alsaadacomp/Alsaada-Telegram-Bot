import { Composer, InlineKeyboard } from 'grammy'
import { Context } from 'grammy'
import { logger } from '../../../../modules/services/logger/index.js'
import { BarcodeScannerService } from '../../../../modules/services/barcode-scanner/index.js'

export const barcodeScannerHandler = new Composer<Context>()

/**
 * Show barcode scanner menu
 */
barcodeScannerHandler.callbackQuery('barcode:scan-qr', async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('🔙 رجوع', 'menu:back')

  await ctx.editMessageText(
    '📱 **ماسح الباركود**\n\n📸 أرسل صورة تحتوي على باركود أو QR Code\n\n💡 **نصائح:**\n• تأكد من وضوح الصورة\n• اجعل الباركود في المنتصف\n• تجنب الظلال والانعكاسات',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

/**
 * Show scan history
 */
barcodeScannerHandler.callbackQuery('barcode:history', async (ctx) => {
  await ctx.answerCallbackQuery()

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
 * معطل مؤقتاً لتجنب التداخل مع إضافة الموظفين
 */
barcodeScannerHandler.on('message:photo', async (ctx, next) => {
  // تعطيل معالج الباركود سكانر مؤقتاً لتجنب التداخل مع إضافة الموظفين
  return next()
})

/**
 * Handle barcode copy callback
 */
barcodeScannerHandler.callbackQuery(/^barcode:copy:(.+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const encodedData = ctx.match[1]
  const data = Buffer.from(encodedData, 'base64').toString('utf-8')

  // Copy to clipboard (this is a simulation - actual clipboard access requires different approach)
  await ctx.reply(`📋 **تم نسخ البيانات:**\n\n\`${data}\``, {
    parse_mode: 'Markdown',
  })
})

export default barcodeScannerHandler