/**
 * Example: Confirmation Dialogs with Inline Keyboards
 *
 * This example demonstrates how to create confirmation dialogs
 * with Yes/No buttons and additional data handling.
 */

import { Bot } from 'grammy'
import { CallbackDataParser, InlineKeyboardBuilder } from '../../src/modules/interaction/keyboards/index.js'

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN || '')
const parser = new CallbackDataParser()

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
]

// Simple confirmation
bot.command('delete', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('⚠️ This action cannot be undone', 'noop')
    .confirm('delete')
    .row()
    .add('← Cancel', 'cancel')
    .build()

  await ctx.reply(
    '🗑️ **Delete Item**\n\nAre you sure you want to delete this item?',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )
})

// Confirmation with data
bot.command('users', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()

  users.forEach((user) => {
    keyboard.row().add(
      `${user.name} (${user.email})`,
      parser.builder('user').param('id', user.id).build(),
    )
  })

  keyboard.row().add('← Close', 'close')

  await ctx.reply('👥 Select a user to delete:', { reply_markup: keyboard })
})

// Handle user selection
bot.callbackQuery(/^user:/, async (ctx) => {
  const parsed = parser.parse(ctx.callbackQuery.data)
  const userId = parsed.params.id as number
  const user = users.find(u => u.id === userId)

  if (!user) {
    await ctx.answerCallbackQuery('❌ User not found')
    return
  }

  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('⚠️ This will permanently delete the user', 'noop')
    .confirm('delete_user', { id: userId })
    .row()
    .add('← Back to List', 'back:users')
    .build()

  await ctx.editMessageText(
    `🗑️ **Delete User**\n\n`
    + `Name: ${user.name}\n`
    + `Email: ${user.email}\n\n`
    + `Are you sure you want to delete this user?`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )

  await ctx.answerCallbackQuery()
})

// Handle simple delete confirmation
bot.callbackQuery(/^delete:(yes|no)$/, async (ctx) => {
  const choice = ctx.match[1]

  if (choice === 'yes') {
    await ctx.editMessageText('✅ Item deleted successfully')
    await ctx.answerCallbackQuery('Deleted!')
  }
  else {
    await ctx.editMessageText('❌ Deletion cancelled')
    await ctx.answerCallbackQuery('Cancelled')
  }
})

// Handle user delete confirmation
bot.callbackQuery(/^delete_user:(yes|no):/, async (ctx) => {
  const parsed = parser.parse(ctx.callbackQuery.data)
  const choice = parsed.action.split(':')[1] // 'yes' or 'no'
  const userId = parsed.params.id as number
  const user = users.find(u => u.id === userId)

  if (!user) {
    await ctx.answerCallbackQuery('❌ User not found')
    return
  }

  if (choice === 'yes') {
    // In real app, delete from database
    const index = users.findIndex(u => u.id === userId)
    if (index > -1) {
      users.splice(index, 1)
    }

    await ctx.editMessageText(`✅ User "${user.name}" has been deleted`)
    await ctx.answerCallbackQuery('User deleted!')
  }
  else {
    await ctx.editMessageText('❌ User deletion cancelled')
    await ctx.answerCallbackQuery('Cancelled')
  }
})

// Multi-step confirmation
bot.command('critical', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('🚨 CRITICAL ACTION', 'noop')
    .row()
    .add('⚠️ This will delete ALL data', 'noop')
    .row()
    .add('⚠️ This cannot be undone', 'noop')
    .row()
    .add('I understand, proceed', 'critical:step1')
    .row()
    .add('← Cancel', 'cancel')
    .build()

  await ctx.reply(
    '🚨 **CRITICAL ACTION WARNING**\n\n'
    + 'You are about to perform a critical action that will delete all data.\n\n'
    + '**Please read the warnings carefully.**',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )
})

// Step 1: First confirmation
bot.callbackQuery('critical:step1', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('Type the word "DELETE" to confirm', 'noop')
    .row()
    .add('✅ Yes, DELETE ALL', 'critical:step2')
    .add('❌ No, Cancel', 'cancel')
    .build()

  await ctx.editMessageText(
    '🚨 **FINAL WARNING**\n\n'
    + 'This is your last chance to cancel.\n\n'
    + 'Are you absolutely sure?',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )

  await ctx.answerCallbackQuery('⚠️ Proceeding to final confirmation')
})

// Step 2: Final confirmation
bot.callbackQuery('critical:step2', async (ctx) => {
  // Perform the critical action
  await ctx.editMessageText(
    '✅ **Action Completed**\n\n'
    + 'All data has been deleted.\n\n'
    + 'This action has been logged.',
  )

  await ctx.answerCallbackQuery('Action completed', { show_alert: true })
})

// Dynamic confirmation based on conditions
bot.command('conditional', async (ctx) => {
  const hasChanges = true // Example condition
  const isAdmin = true // Example condition

  if (!hasChanges) {
    await ctx.reply('ℹ️ No changes to save')
    return
  }

  if (!isAdmin) {
    await ctx.reply('⚠️ You need admin privileges')
    return
  }

  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('✅ Save Changes', 'save:yes')
    .add('❌ Discard', 'save:no')
    .row()
    .add('👁️ Review Changes', 'review')
    .build()

  await ctx.reply(
    '💾 **Save Changes?**\n\n'
    + 'You have unsaved changes.\n\n'
    + 'Would you like to save them?',
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )
})

// Handle cancel
bot.callbackQuery('cancel', async (ctx) => {
  await ctx.editMessageText('❌ Action cancelled')
  await ctx.answerCallbackQuery('Cancelled')
})

// Handle noop (no operation)
bot.callbackQuery('noop', async (ctx) => {
  await ctx.answerCallbackQuery()
})

// Handle close
bot.callbackQuery('close', async (ctx) => {
  await ctx.deleteMessage()
  await ctx.answerCallbackQuery('Closed')
})

// Handle back to users list
bot.callbackQuery('back:users', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()

  users.forEach((user) => {
    keyboard.row().add(
      `${user.name} (${user.email})`,
      parser.builder('user').param('id', user.id).build(),
    )
  })

  keyboard.row().add('← Close', 'close')

  await ctx.editMessageText('👥 Select a user to delete:', { reply_markup: keyboard })
  await ctx.answerCallbackQuery()
})

// Start the bot
console.log('Bot started with confirmation dialog examples...')
bot.start()
