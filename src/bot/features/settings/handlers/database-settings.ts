/**
 * Database Settings Handler
 * معالج إعدادات قاعدة البيانات
 */

import type { Context } from '#root/bot/context.js'
import { BackupService } from '#root/modules/database/backup-service.js'
import { settingsManager } from '#root/modules/settings/index.js'
import { Composer, InlineKeyboard } from 'grammy'

export const databaseSettingsHandler = new Composer<Context>()

/**
 * Auto Backup Settings
 */
databaseSettingsHandler.callbackQuery('settings:database:backup', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const isEnabled = await settingsManager.get('database.auto_backup_enabled') as boolean
  const interval = await settingsManager.get('database.backup_interval') as number

  const keyboard = new InlineKeyboard()
    .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:database:backup:toggle')
    .row()
    .text('✏️ تعديل الفترة الزمنية', 'settings:database:backup:interval')
    .row()
    .text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

  await ctx.editMessageText(
    '💾 **النسخ الاحتياطي التلقائي**\n\n'
    + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
    + `الفترة الزمنية: **${interval / 3600000} ساعة**\n\n`
    + 'عند التفعيل، سيتم إنشاء نسخة احتياطية تلقائياً حسب الفترة المحددة.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

databaseSettingsHandler.callbackQuery('settings:database:backup:toggle', async (ctx) => {
  await ctx.answerCallbackQuery()

  const currentValue = await settingsManager.get('database.auto_backup_enabled') as boolean
  const newValue = !currentValue

  await settingsManager.set(
    'database.auto_backup_enabled',
    newValue,
    { updatedBy: ctx.dbUser?.userId },
  )

  await ctx.answerCallbackQuery(
    newValue ? '✅ تم تفعيل النسخ الاحتياطي التلقائي' : '⬜ تم تعطيل النسخ الاحتياطي التلقائي',
  )

  // Refresh the view
  const interval = await settingsManager.get('database.backup_interval') as number

  const keyboard = new InlineKeyboard()
    .text(newValue ? '✅ مفعل' : '⬜ معطل', 'settings:database:backup:toggle')
    .row()
    .text('✏️ تعديل الفترة الزمنية', 'settings:database:backup:interval')
    .row()
    .text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

  await ctx.editMessageText(
    '💾 **النسخ الاحتياطي التلقائي**\n\n'
    + `الحالة: ${newValue ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
    + `الفترة الزمنية: **${interval / 3600000} ساعة**\n\n`
    + 'عند التفعيل، سيتم إنشاء نسخة احتياطية تلقائياً حسب الفترة المحددة.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

databaseSettingsHandler.callbackQuery('settings:database:backup:interval', async (ctx) => {
  await ctx.answerCallbackQuery()

  const interval = await settingsManager.get('database.backup_interval') as number

  await ctx.editMessageText(
    '✏️ **تعديل الفترة الزمنية للنسخ الاحتياطي**\n\n'
    + `القيمة الحالية: ${interval / 3600000} ساعة\n\n`
    + 'أرسل القيمة الجديدة (بالساعات):',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'backup_interval',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Max Backups Settings
 */
databaseSettingsHandler.callbackQuery('settings:database:max-backups', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const maxBackups = await settingsManager.get('database.max_backups') as number

  const keyboard = new InlineKeyboard()
    .text('✏️ تعديل العدد', 'settings:database:max-backups:edit')
    .row()
    .text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

  await ctx.editMessageText(
    '🗄️ **حد النسخ الاحتياطية المحفوظة**\n\n'
    + `العدد الحالي: **${maxBackups}** نسخة\n\n`
    + 'عند الوصول للحد الأقصى، سيتم حذف أقدم نسخة احتياطية تلقائياً.',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    },
  )
})

databaseSettingsHandler.callbackQuery('settings:database:max-backups:edit', async (ctx) => {
  await ctx.answerCallbackQuery()

  const maxBackups = await settingsManager.get('database.max_backups') as number

  await ctx.editMessageText(
    '✏️ **تعديل حد النسخ الاحتياطية**\n\n'
    + `القيمة الحالية: ${maxBackups}\n\n`
    + 'أرسل القيمة الجديدة (رقم من 1 إلى 30):',
    { parse_mode: 'Markdown' },
  )

  ctx.session.awaitingInput = {
    type: 'max_backups',
    messageId: ctx.callbackQuery.message?.message_id,
  }
})

/**
 * Handle text input for database settings
 */
databaseSettingsHandler.on('message:text', async (ctx, next) => {
  if (!ctx.session.awaitingInput || ctx.dbUser?.role !== 'SUPER_ADMIN') {
    return next()
  }

  const { type, messageId } = ctx.session.awaitingInput
  const newValue = ctx.message.text.trim()

  if (newValue === '/cancel') {
    ctx.session.awaitingInput = undefined
    await ctx.reply('❌ تم إلغاء العملية.')
    return
  }

  try {
    let settingKey: string | undefined
    let valueToSet: any = newValue

    if (type === 'backup_interval') {
      settingKey = 'database.backup_interval'
      const hours = Number.parseInt(newValue, 10)
      if (Number.isNaN(hours) || hours < 1 || hours > 168) {
        await ctx.reply('❌ القيمة يجب أن تكون رقماً بين 1 و 168 ساعة.')
        return
      }
      valueToSet = hours * 3600000 // Convert hours to milliseconds
    }
    else if (type === 'max_backups') {
      settingKey = 'database.max_backups'
      valueToSet = Number.parseInt(newValue, 10)
      if (Number.isNaN(valueToSet) || valueToSet < 1 || valueToSet > 30) {
        await ctx.reply('❌ القيمة يجب أن تكون رقماً بين 1 و 30.')
        return
      }
    }

    if (settingKey) {
      const result = await settingsManager.set(
        settingKey,
        valueToSet,
        { updatedBy: ctx.dbUser.userId },
      )

      ctx.session.awaitingInput = undefined

      if (result) {
        await ctx.reply(
          '✅ **تم تحديث الإعداد بنجاح!**',
          { parse_mode: 'Markdown' },
        )

        // Refresh the view based on setting type
        if (type === 'backup_interval') {
          const isEnabled = await settingsManager.get('database.auto_backup_enabled') as boolean
          const interval = await settingsManager.get('database.backup_interval') as number

          const keyboard = new InlineKeyboard()
            .text(isEnabled ? '✅ مفعل' : '⬜ معطل', 'settings:database:backup:toggle')
            .row()
            .text('✏️ تعديل الفترة الزمنية', 'settings:database:backup:interval')
            .row()
            .text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

          if (messageId) {
            await ctx.api.editMessageText(
              ctx.chat.id,
              messageId,
              '💾 **النسخ الاحتياطي التلقائي**\n\n'
              + `الحالة: ${isEnabled ? '✅ **مفعل**' : '⬜ **معطل**'}\n`
              + `الفترة الزمنية: **${interval / 3600000} ساعة**\n\n`
              + 'عند التفعيل، سيتم إنشاء نسخة احتياطية تلقائياً حسب الفترة المحددة.',
              {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
              },
            )
          }
        }
        else if (type === 'max_backups') {
          const maxBackups = await settingsManager.get('database.max_backups') as number

          const keyboard = new InlineKeyboard()
            .text('✏️ تعديل العدد', 'settings:database:max-backups:edit')
            .row()
            .text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

          if (messageId) {
            await ctx.api.editMessageText(
              ctx.chat.id,
              messageId,
              '🗄️ **حد النسخ الاحتياطية المحفوظة**\n\n'
              + `العدد الحالي: **${maxBackups}** نسخة\n\n`
              + 'عند الوصول للحد الأقصى، سيتم حذف أقدم نسخة احتياطية تلقائياً.',
              {
                parse_mode: 'Markdown',
                reply_markup: keyboard,
              },
            )
          }
        }
      }
      else {
        await ctx.reply('❌ حدث خطأ أثناء حفظ الإعداد.')
      }
    }
    else {
      return next()
    }
  }
  catch (error) {
    ctx.logger.error({ error, type, newValue }, 'Failed to update database setting')
    await ctx.reply('❌ حدث خطأ أثناء حفظ الإعداد.')
  }
})

/**
 * Backup Management
 */
databaseSettingsHandler.callbackQuery('settings:database:manage-backups', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const backups = await BackupService.listBackups()

    const keyboard = new InlineKeyboard()
      .text('💾 إنشاء نسخة احتياطية الآن', 'settings:database:create-backup')
      .row()

    if (backups.length > 0) {
      keyboard.text('📂 عرض النسخ الاحتياطية', 'settings:database:list-backups').row()
    }

    keyboard.text('🔙 رجوع لإعدادات قاعدة البيانات', 'settings:database')

    await ctx.editMessageText(
      '💾 **إدارة النسخ الاحتياطية**\n\n'
      + `عدد النسخ المتاحة: **${backups.length}**\n\n`
      + 'اختر العملية المطلوبة:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    }, 'Failed to load backup management')
    await ctx.reply(
      '❌ حدث خطأ أثناء تحميل إدارة النسخ الاحتياطية.\n\n'
      + `التفاصيل: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
})

/**
 * Create backup now
 */
databaseSettingsHandler.callbackQuery('settings:database:create-backup', async (ctx) => {
  await ctx.answerCallbackQuery('⏳ جاري إنشاء النسخة الاحتياطية...')

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const backup = await BackupService.createBackup()

    const keyboard = new InlineKeyboard()
      .text('📂 عرض النسخ الاحتياطية', 'settings:database:list-backups')
      .row()
      .text('🔙 رجوع', 'settings:database:manage-backups')

    await ctx.editMessageText(
      '✅ **تم إنشاء النسخة الاحتياطية بنجاح!**\n\n'
      + `📄 اسم الملف: ${backup.filename}\n`
      + `📊 الحجم: ${BackupService.formatSize(backup.size)}\n`
      + `📅 التاريخ: ${BackupService.formatDate(backup.createdAt)}\n\n`
      + '✨ تم حفظ النسخة الاحتياطية في مجلد backups',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({ error }, 'Failed to create backup')
    await ctx.editMessageText(
      '❌ **فشل إنشاء النسخة الاحتياطية**\n\n'
      + 'حدث خطأ أثناء إنشاء النسخة الاحتياطية. يرجى المحاولة مرة أخرى.',
      { parse_mode: 'Markdown' },
    )
  }
})

/**
 * List backups
 */
databaseSettingsHandler.callbackQuery('settings:database:list-backups', async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  try {
    const backups = await BackupService.listBackups()

    if (backups.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('💾 إنشاء نسخة احتياطية', 'settings:database:create-backup')
        .row()
        .text('🔙 رجوع', 'settings:database:manage-backups')

      await ctx.editMessageText(
        '📂 **النسخ الاحتياطية**\n\n'
        + 'لا توجد نسخ احتياطية متاحة حالياً.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    // Show first 5 backups
    const keyboard = new InlineKeyboard()
    const displayBackups = backups.slice(0, 5)

    for (let i = 0; i < displayBackups.length; i++) {
      const backup = displayBackups[i]
      keyboard
        .text(
          `📄 ${BackupService.formatDate(backup.createdAt)} (${BackupService.formatSize(backup.size)})`,
          `settings:database:backup-actions:${i}`,
        )
        .row()
    }

    keyboard
      .text('🔙 رجوع', 'settings:database:manage-backups')

    await ctx.editMessageText(
      '📂 **النسخ الاحتياطية المتاحة**\n\n'
      + `عدد النسخ: **${backups.length}**\n`
      + `عرض: **${displayBackups.length}** نسخة\n\n`
      + 'اختر نسخة للعرض أو الاستعادة:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    }, 'Failed to list backups')
    await ctx.reply(
      '❌ حدث خطأ أثناء تحميل النسخ الاحتياطية.\n\n'
      + `التفاصيل: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
})

/**
 * Backup actions
 */
databaseSettingsHandler.callbackQuery(/^settings:database:backup-actions:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const index = Number.parseInt(ctx.match[1], 10)

  try {
    const backups = await BackupService.listBackups()
    const backup = backups[index]

    if (!backup) {
      await ctx.reply('❌ النسخة الاحتياطية غير موجودة.')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('♻️ استعادة هذه النسخة', `settings:database:restore-confirm:${index}`)
      .row()
      .text('🗑️ حذف هذه النسخة', `settings:database:delete-confirm:${index}`)
      .row()
      .text('🔙 رجوع للقائمة', 'settings:database:list-backups')

    await ctx.editMessageText(
      '📄 **تفاصيل النسخة الاحتياطية**\n\n'
      + `📄 اسم الملف: ${backup.filename}\n`
      + `📊 الحجم: ${BackupService.formatSize(backup.size)}\n`
      + `📅 التاريخ: ${BackupService.formatDate(backup.createdAt)}\n\n`
      + 'اختر العملية المطلوبة:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({ error, index }, 'Failed to show backup actions')
    await ctx.reply('❌ حدث خطأ أثناء عرض تفاصيل النسخة الاحتياطية.')
  }
})

/**
 * Confirm restore
 */
databaseSettingsHandler.callbackQuery(/^settings:database:restore-confirm:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const index = Number.parseInt(ctx.match[1], 10)

  try {
    const backups = await BackupService.listBackups()
    const backup = backups[index]

    if (!backup) {
      await ctx.reply('❌ النسخة الاحتياطية غير موجودة.')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('✅ نعم، استعد الآن', `settings:database:restore:${index}`)
      .row()
      .text('❌ إلغاء', `settings:database:backup-actions:${index}`)

    await ctx.editMessageText(
      '⚠️ **تأكيد استعادة النسخة الاحتياطية**\n\n'
      + '⚠️ **تحذير هام:**\n'
      + '• سيتم حفظ نسخة احتياطية من البيانات الحالية تلقائياً\n'
      + '• سيتم استبدال قاعدة البيانات الحالية بالنسخة المحددة\n'
      + '• قد تحتاج لإعادة تشغيل البوت\n\n'
      + `📄 النسخة المحددة: ${backup.filename}\n\n`
      + 'هل أنت متأكد من المتابعة؟',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({ error, index }, 'Failed to confirm restore')
    await ctx.reply('❌ حدث خطأ.')
  }
})

/**
 * Restore backup
 */
databaseSettingsHandler.callbackQuery(/^settings:database:restore:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery('⏳ جاري استعادة النسخة الاحتياطية...')

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const index = Number.parseInt(ctx.match[1], 10)

  try {
    const backups = await BackupService.listBackups()
    const backup = backups[index]

    if (!backup) {
      await ctx.reply('❌ النسخة الاحتياطية غير موجودة.')
      return
    }

    await BackupService.restoreBackup(backup.filename)

    const keyboard = new InlineKeyboard()
      .text('🔄 إعادة تشغيل البوت', 'settings:database:restart-bot')
      .row()
      .text('🔙 رجوع', 'settings:database:manage-backups')

    await ctx.editMessageText(
      '✅ **تم استعادة النسخة الاحتياطية بنجاح!**\n\n'
      + `📄 النسخة: ${backup.filename}\n\n`
      + '✨ تم استعادة البيانات بنجاح\n'
      + '💡 يُنصح بإعادة تشغيل البوت للتأكد من عمل كل شيء بشكل صحيح',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )

    // Log the restore operation
    ctx.logger.info({
      filename: backup.filename,
      restoredBy: ctx.dbUser?.userId,
    }, 'Backup restored successfully')
  }
  catch (error) {
    ctx.logger.error({ error, index }, 'Failed to restore backup')
    await ctx.editMessageText(
      '❌ **فشل استعادة النسخة الاحتياطية**\n\n'
      + 'حدث خطأ أثناء استعادة النسخة الاحتياطية.\n'
      + 'يرجى التحقق من السجلات والمحاولة مرة أخرى.',
      { parse_mode: 'Markdown' },
    )
  }
})

/**
 * Confirm delete
 */
databaseSettingsHandler.callbackQuery(/^settings:database:delete-confirm:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const index = Number.parseInt(ctx.match[1], 10)

  try {
    const backups = await BackupService.listBackups()
    const backup = backups[index]

    if (!backup) {
      await ctx.reply('❌ النسخة الاحتياطية غير موجودة.')
      return
    }

    const keyboard = new InlineKeyboard()
      .text('✅ نعم، احذف', `settings:database:delete:${index}`)
      .row()
      .text('❌ إلغاء', `settings:database:backup-actions:${index}`)

    await ctx.editMessageText(
      '⚠️ **تأكيد حذف النسخة الاحتياطية**\n\n'
      + `📄 النسخة: ${backup.filename}\n\n`
      + '⚠️ لن تتمكن من استعادة هذه النسخة بعد الحذف.\n\n'
      + 'هل أنت متأكد من الحذف؟',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({ error, index }, 'Failed to confirm delete')
    await ctx.reply('❌ حدث خطأ.')
  }
})

/**
 * Delete backup
 */
databaseSettingsHandler.callbackQuery(/^settings:database:delete:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery('⏳ جاري حذف النسخة...')

  if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
    await ctx.answerCallbackQuery('⛔ غير مصرح')
    return
  }

  const index = Number.parseInt(ctx.match[1], 10)

  try {
    const backups = await BackupService.listBackups()
    const backup = backups[index]

    if (!backup) {
      await ctx.reply('❌ النسخة الاحتياطية غير موجودة.')
      return
    }

    await BackupService.deleteBackup(backup.filename)

    await ctx.answerCallbackQuery('✅ تم حذف النسخة بنجاح')

    // Return to list
    const updatedBackups = await BackupService.listBackups()

    if (updatedBackups.length === 0) {
      const keyboard = new InlineKeyboard()
        .text('💾 إنشاء نسخة احتياطية', 'settings:database:create-backup')
        .row()
        .text('🔙 رجوع', 'settings:database:manage-backups')

      await ctx.editMessageText(
        '📂 **النسخ الاحتياطية**\n\n'
        + 'لا توجد نسخ احتياطية متاحة حالياً.',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        },
      )
      return
    }

    // Show backups list
    const keyboard = new InlineKeyboard()
    const displayBackups = updatedBackups.slice(0, 5)

    for (let i = 0; i < displayBackups.length; i++) {
      const backup = displayBackups[i]
      keyboard
        .text(
          `📄 ${BackupService.formatDate(backup.createdAt)} (${BackupService.formatSize(backup.size)})`,
          `settings:database:backup-actions:${i}`,
        )
        .row()
    }

    keyboard.text('🔙 رجوع', 'settings:database:manage-backups')

    await ctx.editMessageText(
      '📂 **النسخ الاحتياطية المتاحة**\n\n'
      + `عدد النسخ: **${updatedBackups.length}**\n`
      + `عرض: **${displayBackups.length}** نسخة\n\n`
      + 'اختر نسخة للعرض أو الاستعادة:',
      {
        parse_mode: 'Markdown',
        reply_markup: keyboard,
      },
    )
  }
  catch (error) {
    ctx.logger.error({
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      index,
    }, 'Failed to delete backup')
    await ctx.editMessageText(
      '❌ **فشل حذف النسخة الاحتياطية**\n\n'
      + 'حدث خطأ أثناء حذف النسخة الاحتياطية.\n\n'
      + `التفاصيل: ${error instanceof Error ? error.message : String(error)}`,
      { parse_mode: 'Markdown' },
    )
  }
})
