/**
 * Join Requests Management
 *
 * معالجات إدارة طلبات الانضمام
 */

import type { Context } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { RoleManager } from '#root/modules/permissions/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const joinRequestsHandler = new Composer<Context>()

/**
 * عرض قائمة طلبات الانضمام
 */
joinRequestsHandler.callbackQuery(/^menu:sub:admin-panel:join-requests$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const pendingRequests = await Database.prisma.joinRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { requestedAt: 'desc' },
      take: 10,
    })

    if (pendingRequests.length === 0) {
      await ctx.editMessageText(
        '📋 **طلبات الانضمام**\n\n'
        + '✅ لا توجد طلبات قيد المراجعة',
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('⬅️ رجوع', 'menu:feature:admin-panel'),
        },
      )
      return
    }

    const keyboard = new InlineKeyboard()

    pendingRequests.forEach((request) => {
      keyboard.text(
        `👤 ${request.fullName} (${request.phone})`,
        `join:details:${request.id}`,
      )
      keyboard.row()
    })

    keyboard.text('⬅️ رجوع', 'menu:feature:admin-panel')

    await ctx.editMessageText(
      `📋 **طلبات الانضمام قيد المراجعة (${pendingRequests.length})**\n\n`
      + 'اختر طلباً لعرض التفاصيل:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error showing join requests list')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})

/**
 * عرض تفاصيل طلب
 */
joinRequestsHandler.callbackQuery(/^join:details:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const requestId = Number(ctx.match[1])
    const request = await Database.prisma.joinRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      await ctx.answerCallbackQuery('⚠️ الطلب غير موجود')
      return
    }

    const statusEmoji = {
      PENDING: '⏳',
      APPROVED: '✅',
      REJECTED: '❌',
      CANCELLED: '🚫',
    }

    const statusText = {
      PENDING: 'قيد المراجعة',
      APPROVED: 'تم القبول',
      REJECTED: 'تم الرفض',
      CANCELLED: 'تم الإلغاء',
    }

    let message
      = `📋 **تفاصيل طلب الانضمام #${request.id}**\n\n`
        + `👤 **الاسم الكامل:** ${request.fullName}\n`
        + `🏷️ **اسم الشهرة:** ${request.nickname || '_غير محدد_'}\n`
        + `📱 **رقم الموبايل:** ${request.phone}\n`
        + `🆔 **Telegram ID:** \`${request.telegramId}\`\n`
        + `📅 **تاريخ الطلب:** ${request.requestedAt.toLocaleString('ar-EG')}\n`
        + `${statusEmoji[request.status as keyof typeof statusEmoji]} **الحالة:** ${statusText[request.status as keyof typeof statusText]}\n`

    if (request.respondedAt) {
      message += `📅 **تاريخ الرد:** ${request.respondedAt.toLocaleString('ar-EG')}\n`
    }

    if (request.notes) {
      message += `📝 **ملاحظات:** ${request.notes}\n`
    }

    const keyboard = new InlineKeyboard()

    if (request.status === 'PENDING') {
      keyboard
        .text('✅ قبول', `join:approve:${request.id}`)
        .text('❌ رفض', `join:reject:${request.id}`)
        .row()
    }

    keyboard.text('⬅️ رجوع', 'menu:sub:admin-panel:join-requests')

    await ctx.editMessageText(message, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error showing join request details')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})

/**
 * قبول طلب انضمام
 */
joinRequestsHandler.callbackQuery(/^join:approve:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const requestId = Number(ctx.match[1])
    const adminId = ctx.dbUser?.userId

    if (!adminId) {
      await ctx.answerCallbackQuery('⚠️ خطأ في تحديد هويتك')
      return
    }

    const request = await Database.prisma.joinRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      await ctx.answerCallbackQuery('⚠️ الطلب غير موجود')
      return
    }

    if (request.status !== 'PENDING') {
      await ctx.answerCallbackQuery('⚠️ تم معالجة هذا الطلب مسبقاً')
      return
    }

    // تحديث حالة الطلب
    await Database.prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: 'APPROVED',
        respondedAt: new Date(),
        approvedBy: adminId,
      },
    })

    // إنشاء/تحديث المستخدم في النظام
    try {
      const user = await RoleManager.getOrCreateUser(request.telegramId, {
        firstName: request.fullName,
        lastName: request.nickname || undefined,
      })

      // تغيير الدور إلى USER مباشرة في قاعدة البيانات
      await Database.prisma.user.update({
        where: { id: user.id },
        data: { role: 'USER' },
      })

      // تسجيل التغيير في السجل
      await Database.prisma.roleChange.create({
        data: {
          userId: user.id,
          oldRole: 'GUEST',
          newRole: 'USER',
          changedBy: adminId,
          reason: 'تمت الموافقة على طلب الانضمام',
        },
      })

      // تحديث رقم الهاتف
      await Database.prisma.user.update({
        where: { id: user.id },
        data: {
          phone: request.phone,
        },
      })

      // ربط الطلب بالمستخدم
      await Database.prisma.joinRequest.update({
        where: { id: requestId },
        data: { userId: user.id },
      })

      // إرسال إشعار للمستخدم
      try {
        await ctx.api.sendMessage(
          request.telegramId.toString(),
          '🎉 **تهانينا!**\n\n'
          + 'تمت الموافقة على طلب انضمامك.\n'
          + 'يمكنك الآن استخدام البوت والوصول إلى جميع الميزات.\n\n'
          + 'اضغط /start للبدء',
          { parse_mode: 'Markdown' },
        )
      }
      catch (error) {
        logger.error({ error }, 'Failed to notify user of approval')
      }

      await ctx.editMessageText(
        `✅ **تم قبول الطلب بنجاح!**\n\n`
        + `👤 **المستخدم:** ${request.fullName}\n`
        + `🆔 **ID:** ${user.id}\n`
        + `📱 **الهاتف:** ${request.phone}\n\n`
        + `تم تفعيل حساب المستخدم وإرسال إشعار له.`,
        {
          parse_mode: 'Markdown',
          reply_markup: new InlineKeyboard()
            .text('⬅️ رجوع', 'menu:sub:admin-panel:join-requests'),
        },
      )

      logger.info({
        requestId,
        userId: user.id,
        approvedBy: adminId,
      }, 'Join request approved')
    }
    catch (error) {
      logger.error({ error }, 'Error creating user after approval')
      await ctx.reply('⚠️ تمت الموافقة على الطلب لكن حدث خطأ في إنشاء الحساب')
    }
  }
  catch (error) {
    logger.error({ error }, 'Error approving join request')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})

/**
 * رفض طلب انضمام
 */
joinRequestsHandler.callbackQuery(/^join:reject:(\d+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const requestId = Number(ctx.match[1])
    const adminId = ctx.dbUser?.userId

    if (!adminId) {
      await ctx.answerCallbackQuery('⚠️ خطأ في تحديد هويتك')
      return
    }

    const request = await Database.prisma.joinRequest.findUnique({
      where: { id: requestId },
    })

    if (!request) {
      await ctx.answerCallbackQuery('⚠️ الطلب غير موجود')
      return
    }

    if (request.status !== 'PENDING') {
      await ctx.answerCallbackQuery('⚠️ تم معالجة هذا الطلب مسبقاً')
      return
    }

    // طلب سبب الرفض (اختياري - يمكن تطويره لاحقاً)
    const rejectionReason = 'تم رفض الطلب من قبل الإدارة'

    // تحديث حالة الطلب
    await Database.prisma.joinRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        respondedAt: new Date(),
        rejectedBy: adminId,
        rejectionReason,
      },
    })

    // إرسال إشعار للمستخدم
    try {
      await ctx.api.sendMessage(
        request.telegramId.toString(),
        '❌ **عذراً**\n\n'
        + 'تم رفض طلب انضمامك.\n\n'
        + `**السبب:** ${rejectionReason}\n\n`
        + 'يمكنك التواصل مع الإدارة للمزيد من المعلومات.',
        { parse_mode: 'Markdown' },
      )
    }
    catch (error) {
      logger.error({ error }, 'Failed to notify user of rejection')
    }

    await ctx.editMessageText(
      `❌ **تم رفض الطلب**\n\n`
      + `👤 **المستخدم:** ${request.fullName}\n`
      + `📱 **الهاتف:** ${request.phone}\n\n`
      + `تم إرسال إشعار للمستخدم.`,
      {
        parse_mode: 'Markdown',
        reply_markup: new InlineKeyboard()
          .text('⬅️ رجوع', 'menu:sub:admin-panel:join-requests'),
      },
    )

    logger.info({
      requestId,
      rejectedBy: adminId,
    }, 'Join request rejected')
  }
  catch (error) {
    logger.error({ error }, 'Error rejecting join request')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})
