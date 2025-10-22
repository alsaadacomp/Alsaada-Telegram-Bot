/**
 * Main Menu Feature
 *
 * Handles the main menu navigation and feature routing.
 */

import type { Context } from '../context.js'
import { Composer } from 'grammy'
import { logger } from '../../modules/services/logger/index.js'
import { featureRegistry } from './registry/feature-registry.js'
import { MenuBuilder } from './registry/menu-builder.js'

export const mainMenuComposer = new Composer<Context>()

/**
 * Handle main menu command
 * ⚠️ فقط للمستخدمين المسجلين (ليس GUEST)
 */
mainMenuComposer.command('menu', async (ctx) => {
  try {
    const userRole = ctx.dbUser?.role ?? 'GUEST'

    // منع الزوار من الوصول للقائمة
    if (!ctx.dbUser || userRole === 'GUEST') {
      await ctx.reply('⛔ يجب عليك تقديم طلب انضمام أولاً.\n\nاستخدم /start للبدء.')
      return
    }

    const keyboard = MenuBuilder.buildMainMenu(userRole as any)

    await ctx.reply('📋 **القائمة الرئيسية**\n\nاختر القسم المطلوب:', {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error showing main menu')
    await ctx.reply('حدث خطأ أثناء عرض القائمة.')
  }
})

/**
 * Handle "القائمة الرئيسية" keyboard button
 * ⚠️ فقط للمستخدمين المسجلين (ليس GUEST)
 */
mainMenuComposer.hears('📋 القائمة الرئيسية', async (ctx) => {
  try {
    const userRole = ctx.dbUser?.role ?? 'GUEST'

    // منع الزوار من الوصول للقائمة
    if (!ctx.dbUser || userRole === 'GUEST') {
      await ctx.reply('⛔ يجب عليك تقديم طلب انضمام أولاً.\n\nاستخدم /start للبدء.')
      return
    }

    const keyboard = MenuBuilder.buildMainMenu(userRole as any)

    await ctx.reply('📋 **القائمة الرئيسية**\n\nاختر القسم المطلوب:', {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error showing main menu')
    await ctx.reply('حدث خطأ أثناء عرض القائمة.')
  }
})

/**
 * Handle feature selection callback
 */
mainMenuComposer.callbackQuery(/^menu:feature:(.+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const match = ctx.match
    if (!match || !match[1])
      return

    const featureId = match[1]
    const userRole = ctx.dbUser?.role ?? 'GUEST'

    // Check if user can access this feature
    if (!featureRegistry.canAccess(featureId, userRole as any)) {
      await ctx.answerCallbackQuery('⛔ ليس لديك صلاحية الوصول لهذا القسم')
      return
    }

    const feature = featureRegistry.get(featureId)
    if (!feature) {
      await ctx.answerCallbackQuery('⚠️ القسم غير موجود')
      return
    }

    // Build sub-menu
    const keyboard = MenuBuilder.buildSubMenu(featureId, userRole as any)
    if (!keyboard) {
      await ctx.answerCallbackQuery('⚠️ لا توجد أقسام فرعية متاحة')
      return
    }

    const description = MenuBuilder.getFeatureDescription(featureId)

    await ctx.editMessageText(description || feature.config.name, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error handling feature selection')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})

/**
 * Handle sub-feature selection callback
 */
mainMenuComposer.callbackQuery(/^menu:sub:([^:]+):([^:]+)$/, async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const match = ctx.match
    if (!match || !match[1] || !match[2])
      return

    const featureId = match[1]
    const subFeatureId = match[2]
    const userRole = ctx.dbUser?.role ?? 'GUEST'

    // Check permissions
    if (!featureRegistry.canAccessSubFeature(featureId, subFeatureId, userRole as any)) {
      await ctx.answerCallbackQuery('⛔ ليس لديك صلاحية الوصول لهذا القسم')
      return
    }

    const subFeature = featureRegistry.getSubFeature(featureId, subFeatureId)
    if (!subFeature) {
      await ctx.answerCallbackQuery('⚠️ القسم الفرعي غير موجود')
      return
    }

    // Here you would call the actual handler
    // For now, just show a message
    await ctx.editMessageText(
      `✅ تم اختيار: ${subFeature.name}\n\n`
      + `Handler: \`${subFeature.handler}\`\n\n`
      + `سيتم تنفيذ الوظيفة المرتبطة بهذا القسم.`,
      {
        parse_mode: 'Markdown',
        reply_markup: MenuBuilder.buildSubMenu(featureId, userRole as any) || undefined,
      },
    )
  }
  catch (error) {
    logger.error({ error }, 'Error handling sub-feature selection')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})

/**
 * Handle back button
 */
mainMenuComposer.callbackQuery('menu:back', async (ctx) => {
  try {
    await ctx.answerCallbackQuery()

    const userRole = ctx.dbUser?.role ?? 'GUEST'
    const keyboard = MenuBuilder.buildMainMenu(userRole as any)

    await ctx.editMessageText('📋 **القائمة الرئيسية**\n\nاختر القسم المطلوب:', {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    })
  }
  catch (error) {
    logger.error({ error }, 'Error handling back button')
    await ctx.answerCallbackQuery('حدث خطأ')
  }
})
