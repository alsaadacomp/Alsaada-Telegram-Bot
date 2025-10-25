/**
 * Join Request Conversation
 *
 * تدفق طلب الانضمام للشركة
 */

import type { Context } from '#root/bot/context.js'
import { RequestStatus, Role } from '../../../../generated/prisma/index.js'
import type { Conversation } from '@grammyjs/conversations'
import type { Context as DefaultContext } from 'grammy'
import { Database } from '#root/modules/database/index.js'
import { isValidEgyptPhone } from '#root/modules/input/validators/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { createConversation } from '@grammyjs/conversations'
import { InlineKeyboard } from 'grammy'

export const JOIN_REQUEST_CONVERSATION = 'join-request'

type ConversationContext = DefaultContext

export function joinRequestConversation() {
  return createConversation(
    async (conversation: Conversation<Context, ConversationContext>, ctx: ConversationContext) => {
      try {
        const telegramId = BigInt(ctx.from!.id)
        const username = ctx.from!.username

        // التحقق من وجود طلب سابق
        const existingRequest = await Database.prisma.joinRequest.findUnique({
          where: { telegramId },
        })

        if (existingRequest) {
          if (existingRequest.status === RequestStatus.PENDING) {
            await ctx.reply(
              '⏳ **لديك طلب انضمام قيد المراجعة**\n\n'
              + 'يرجى انتظار موافقة الإدارة على طلبك.',
              { parse_mode: 'Markdown' },
            )
            return
          }
          else if (existingRequest.status === RequestStatus.APPROVED) {
            await ctx.reply(
              '✅ **تم قبول طلبك مسبقاً**\n\n'
              + 'أنت الآن عضو في النظام!',
              { parse_mode: 'Markdown' },
            )
            return
          }
          else if (existingRequest.status === RequestStatus.REJECTED) {
            await ctx.reply(
              '❌ **تم رفض طلب انضمامك مسبقاً**\n\n'
              + `**السبب:** ${existingRequest.rejectionReason || 'لم يتم تحديد سبب'}\n\n`
              + 'للمزيد من المعلومات، يرجى التواصل مع الإدارة.',
              { parse_mode: 'Markdown' },
            )
            return
          }
        }

        // البدء في جمع البيانات
        await ctx.reply(
          '📝 **طلب انضمام للشركة**\n\n'
          + 'سنحتاج لبعض المعلومات الأساسية.\n'
          + 'يمكنك الإلغاء في أي وقت بكتابة /cancel',
          { parse_mode: 'Markdown' },
        )

        // 1. الاسم الكامل
        await ctx.reply('👤 **من فضلك أدخل اسمك الكامل:**', {
          parse_mode: 'Markdown',
        })

        const fullNameMsg = await conversation.wait()

        if (fullNameMsg.message?.text === '/cancel') {
          await ctx.reply('❌ تم إلغاء الطلب.')
          return
        }

        const fullName = fullNameMsg.message?.text?.trim()

        if (!fullName || fullName.length < 3) {
          await ctx.reply('⚠️ الاسم قصير جداً. تم إلغاء الطلب.')
          return
        }

        if (fullName.length > 100) {
          await ctx.reply('⚠️ الاسم طويل جداً. تم إلغاء الطلب.')
          return
        }

        // 2. اسم الشهرة
        let nickname: string | null = null

        const nicknameKeyboard = new InlineKeyboard()
          .text('⏭️ تخطي', 'join:skip-nickname')

        await ctx.reply('🏷️ **من فضلك أدخل اسم الشهرة:**', {
          parse_mode: 'Markdown',
          reply_markup: nicknameKeyboard,
        })

        const nicknameCtx = await conversation.waitFor(['message:text', 'callback_query:data'])

        if ('message' in nicknameCtx.update) {
        // المستخدم كتب نص
          if (nicknameCtx.message?.text === '/cancel') {
            await ctx.reply('❌ تم إلغاء الطلب.')
            return
          }

          nickname = nicknameCtx.message?.text?.trim() || null
        }
        else if ('callback_query' in nicknameCtx.update) {
        // المستخدم ضغط زر تخطي
          await nicknameCtx.answerCallbackQuery('تم التخطي')

          // توليد اسم الشهرة تلقائياً من أول كلمتين (مع مراعاة الأسماء المركبة)
          const nameParts = fullName.trim().split(/\s+/)

          if (nameParts.length === 1) {
          // اسم واحد فقط
            nickname = nameParts[0]
          }
          else if (nameParts.length === 2) {
          // اسمين فقط
            nickname = `${nameParts[0]} ${nameParts[1]}`
          }
          else {
          // ثلاثة أسماء أو أكثر - نتحقق من الأسماء المركبة
            const firstName = nameParts[0]
            const secondName = nameParts[1]

            // قائمة بالكلمات المركبة الشائعة
            const compoundPrefixes = ['عبد', 'أبو', 'أم', 'ابن', 'بنت']

            if (compoundPrefixes.includes(firstName)) {
            // إذا كان الاسم الأول مركب (مثل عبد)، نأخذ 3 كلمات
              if (nameParts.length >= 3) {
                nickname = `${nameParts[0]} ${nameParts[1]} ${nameParts[2]}`
              }
              else {
                nickname = `${nameParts[0]} ${nameParts[1]}`
              }
            }
            else {
            // اسم عادي - نأخذ أول كلمتين
              nickname = `${nameParts[0]} ${nameParts[1]}`
            }
          }

          await nicknameCtx.editMessageText(
            `🏷️ **اسم الشهرة:** ${nickname}\n\n_تم التوليد تلقائياً_`,
            { parse_mode: 'Markdown' },
          )
        }

        // 3. رقم الموبايل (مع إعادة المحاولة)
        let phone: string | undefined
        let phoneValid = false
        let phoneAttempts = 0
        const maxPhoneAttempts = 3

        while (!phoneValid && phoneAttempts < maxPhoneAttempts) {
          phoneAttempts++

          const attemptText = phoneAttempts > 1
            ? `\n\n⚠️ **محاولة ${phoneAttempts} من ${maxPhoneAttempts}**`
            : ''

          await ctx.reply(
            `📱 **من فضلك أدخل رقم موبايلك:**\n\n`
            + `_مثال: 01012345678_${
              attemptText}`,
            { parse_mode: 'Markdown' },
          )

          const phoneMsg = await conversation.wait()

          if (phoneMsg.message?.text === '/cancel') {
            await ctx.reply('❌ تم إلغاء الطلب.')
            return
          }

          phone = phoneMsg.message?.text?.trim()

          if (phone && isValidEgyptPhone(phone)) {
            phoneValid = true
          }
          else {
            if (phoneAttempts < maxPhoneAttempts) {
              await ctx.reply(
                '⚠️ **رقم الموبايل غير صحيح.**\n\n'
                + 'يجب أن يكون رقم مصري صحيح:\n'
                + '• 11 رقم\n'
                + '• يبدأ بـ 010, 011, 012, أو 015\n\n'
                + '🔄 يرجى المحاولة مرة أخرى...',
                { parse_mode: 'Markdown' },
              )
            }
            else {
              await ctx.reply(
                '❌ **تم تجاوز عدد المحاولات المسموحة.**\n\n'
                + 'لم يتم قبول رقم الموبايل بعد 3 محاولات.\n'
                + 'يرجى البدء من جديد بإرسال /start',
              )
              return
            }
          }
        }

        // التأكد من أن phone ليس undefined
        if (!phone) {
          await ctx.reply('❌ حدث خطأ في معالجة رقم الموبايل.')
          return
        }

        // 4. التأكيد
        const keyboard = new InlineKeyboard()
          .text('✅ تأكيد الاشتراك', 'join:confirm')
          .text('❌ إلغاء', 'join:cancel')

        await ctx.reply(
          '📋 **تأكيد بيانات طلب الانضمام:**\n\n'
          + `👤 **الاسم الكامل:** ${fullName}\n`
          + `🏷️ **اسم الشهرة:** ${nickname || '_غير محدد_'}\n`
          + `📱 **رقم الموبايل:** ${phone}\n`
          + `🆔 **معرف Telegram:** \`${telegramId}\`\n\n`
          + 'هل تريد تأكيد الطلب؟',
          {
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          },
        )

        // انتظار الرد
        const confirmCtx = await conversation.waitForCallbackQuery(/^join:(confirm|cancel)$/)

        await confirmCtx.answerCallbackQuery()

        if (confirmCtx.match[1] === 'cancel') {
          await confirmCtx.editMessageText('❌ تم إلغاء الطلب.')
          return
        }

        // حفظ الطلب في قاعدة البيانات
        try {
          logger.info({
            telegramId: telegramId.toString(),
            username,
            fullName,
            nickname,
            phone,
          }, 'Attempting to create join request')

          const joinRequest = await Database.prisma.joinRequest.create({
            data: {
              telegramId,
              fullName,
              nickname,
              phone,
              status: RequestStatus.PENDING,
            },
          })

          // Fetch the complete request with all fields including createdAt
          const completeRequest = await Database.prisma.joinRequest.findUnique({
            where: { id: joinRequest.id },
          })

          await confirmCtx.editMessageText(
            '✅ **تم تقديم طلبك بنجاح!**\n\n'
            + '⏳ **الحالة:** قيد المراجعة\n\n'
            + 'سيتم مراجعة طلبك من قبل الإدارة وسنقوم بإخطارك بالقرار قريباً.\n\n'
            + `📋 **رقم الطلب:** \`${joinRequest.id}\``,
            { parse_mode: 'Markdown' },
          )

          // إرسال إشعار للأدمن
          if (completeRequest) {
            await notifyAdminsOfNewRequest(completeRequest)
          }

          logger.info({
            requestId: joinRequest.id,
            telegramId: joinRequest.telegramId.toString(),
            fullName: joinRequest.fullName,
          }, 'New join request created')
        }
        catch (error) {
          logger.error({
            error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
          }, 'Failed to create join request')

          await confirmCtx.reply(
            '❌ **حدث خطأ أثناء حفظ الطلب**\n\n'
            + 'يرجى المحاولة مرة أخرى لاحقاً أو التواصل مع الإدارة.\n\n'
            + `_الخطأ: ${error instanceof Error ? error.message : String(error)}_`,
            { parse_mode: 'Markdown' },
          )
        }
      }
      catch (error) {
        logger.error({ error }, 'Error in join request conversation')
        await ctx.reply(
          '❌ حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
        )
      }
    },
    JOIN_REQUEST_CONVERSATION,
  )
}

/**
 * إرسال إشعار للأدمن عن طلب جديد
 */
async function notifyAdminsOfNewRequest(request: any) {
  try {
    const admins = await Database.prisma.user.findMany({
      where: {
        role: {
          in: [Role.SUPER_ADMIN, Role.ADMIN],
        },
        isActive: true,
        isBanned: false,
      },
    })

    logger.info({
      requestId: request.id,
      adminsCount: admins.length,
      createdAt: request.createdAt,
      createdAtType: typeof request.createdAt,
    }, 'Sending notification to admins for new join request')

    // Get bot instance from context
    const { createBot } = await import('#root/bot/index.js')
    const { config } = await import('#root/config.js')

    // Import InlineKeyboard
    const { InlineKeyboard } = await import('grammy')

    // إنشاء لوحة مفاتيح للموافقة/الرفض
    const keyboard = new InlineKeyboard()
      .text('✅ الموافقة', `join:approve:${request.id}`)
      .text('❌ الرفض', `join:reject:${request.id}`)

    // Format date properly - use current time since request was just created
    const now = new Date()
    const formattedDate = now.toLocaleString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

    const message
      = '🔔 **طلب انضمام جديد!**\n\n'
        + `👤 **الاسم الكامل:** ${request.fullName}\n`
        + `🏷️ **اسم الشهرة:** ${request.nickname || 'غير محدد'}\n`
        + `📱 **رقم الموبايل:** ${request.phone}\n`
        + `🆔 **Telegram ID:** \`${request.telegramId}\`\n`
        + `📋 **رقم الطلب:** \`${request.id}\`\n\n`
        + `📅 **تاريخ التقديم:** ${formattedDate}\n\n`
        + '⬇️ اختر إجراء:'

    // إرسال إشعار لكل أدمن
    for (const admin of admins) {
      try {
        // Note: We need to get the bot instance from somewhere
        // For now, we'll use the bot API directly
        const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: admin.telegramId.toString(),
            text: message,
            parse_mode: 'Markdown',
            reply_markup: keyboard,
          }),
        })

        if (response.ok) {
          logger.info({
            adminId: admin.id,
            adminTelegramId: admin.telegramId.toString(),
          }, 'Notification sent to admin')
        }
        else {
          const errorData = await response.json()
          logger.error({
            adminId: admin.id,
            error: errorData,
          }, 'Failed to send notification to admin')
        }
      }
      catch (error) {
        logger.error({
          adminId: admin.id,
          error,
        }, 'Error sending notification to admin')
      }
    }
  }
  catch (error) {
    logger.error({ error }, 'Failed to notify admins')
  }
}
