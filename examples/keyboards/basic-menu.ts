/**
 * Example: Basic Menu with Inline Keyboards
 *
 * This example demonstrates how to create simple inline keyboard menus
 * with callback buttons, URL buttons, and basic navigation.
 */

import { Bot } from 'grammy'
import { InlineKeyboardBuilder } from '../../src/modules/interaction/keyboards/index.js'

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN || '')

// Main menu command
bot.command('menu', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('📝 Create', 'action:create')
    .add('✏️ Edit', 'action:edit')
    .row()
    .add('🗑️ Delete', 'action:delete')
    .add('📋 List', 'action:list')
    .row()
    .url('📚 Documentation', 'https://docs.example.com')
    .build()

  await ctx.reply('Choose an action:', { reply_markup: keyboard })
})

// Simple confirmation menu
bot.command('confirm', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('✅ Yes', 'confirm:yes')
    .add('❌ No', 'confirm:no')
    .build()

  await ctx.reply('Are you sure?', { reply_markup: keyboard })
})

// Settings menu
bot.command('settings', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('🔔 Notifications', 'settings:notifications')
    .row()
    .add('🌐 Language', 'settings:language')
    .row()
    .add('🔒 Privacy', 'settings:privacy')
    .row()
    .add('← Back to Menu', 'back:menu')
    .build()

  await ctx.reply('⚙️ Settings', { reply_markup: keyboard })
})

// Handle action callbacks
bot.callbackQuery(/^action:(\w+)$/, async (ctx) => {
  const action = ctx.match[1]

  const messages: Record<string, string> = {
    create: '✅ Creating new item...',
    edit: '✏️ Edit mode activated',
    delete: '🗑️ Delete mode activated',
    list: '📋 Showing all items...',
  }

  await ctx.answerCallbackQuery(messages[action] || 'Action executed')
  await ctx.editMessageText(`${messages[action] || 'Action executed'}\n\nUse /menu to return.`)
})

// Handle confirmation callbacks
bot.callbackQuery(/^confirm:(yes|no)$/, async (ctx) => {
  const choice = ctx.match[1]

  if (choice === 'yes') {
    await ctx.answerCallbackQuery('✅ Confirmed!')
    await ctx.editMessageText('✅ Action confirmed')
  }
  else {
    await ctx.answerCallbackQuery('❌ Cancelled')
    await ctx.editMessageText('❌ Action cancelled')
  }
})

// Handle settings callbacks
bot.callbackQuery(/^settings:(\w+)$/, async (ctx) => {
  const setting = ctx.match[1]
  await ctx.answerCallbackQuery(`Opening ${setting} settings...`)

  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('✅ Enable', `toggle:${setting}:on`)
    .add('❌ Disable', `toggle:${setting}:off`)
    .row()
    .add('← Back', 'back:settings')
    .build()

  await ctx.editMessageText(`⚙️ ${setting.charAt(0).toUpperCase() + setting.slice(1)} Settings`, {
    reply_markup: keyboard,
  })
})

// Handle back navigation
bot.callbackQuery(/^back:(\w+)$/, async (ctx) => {
  const destination = ctx.match[1]

  if (destination === 'menu') {
    const keyboard = new InlineKeyboardBuilder()
      .row()
      .add('📝 Create', 'action:create')
      .add('✏️ Edit', 'action:edit')
      .row()
      .add('🗑️ Delete', 'action:delete')
      .add('📋 List', 'action:list')
      .build()

    await ctx.editMessageText('Choose an action:', { reply_markup: keyboard })
  }
  else if (destination === 'settings') {
    const keyboard = new InlineKeyboardBuilder()
      .row()
      .add('🔔 Notifications', 'settings:notifications')
      .row()
      .add('🌐 Language', 'settings:language')
      .row()
      .add('🔒 Privacy', 'settings:privacy')
      .row()
      .add('← Back to Menu', 'back:menu')
      .build()

    await ctx.editMessageText('⚙️ Settings', { reply_markup: keyboard })
  }

  await ctx.answerCallbackQuery()
})

// Start the bot
console.log('Bot started with basic menu examples...')
bot.start()
