/**
 * Example: Pagination with Inline Keyboards
 *
 * This example demonstrates how to create paginated lists
 * with navigation controls.
 */

import { Bot } from 'grammy'
import { CallbackDataParser, InlineKeyboardBuilder } from '../../src/modules/interaction/keyboards/index.js'

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN || '')
const parser = new CallbackDataParser()

// Sample data
const items = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`,
}))

const ITEMS_PER_PAGE = 4

// Helper function to create paginated keyboard
function createPaginatedKeyboard(currentPage: number, totalItems: number, itemsPerPage: number) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const pageItems = items.slice(start, start + itemsPerPage)

  const builder = new InlineKeyboardBuilder()

  // Add item buttons in grid
  const buttons: [string, string][] = pageItems.map(item => [
    `${item.id}. ${item.name}`,
    parser.builder('item').param('id', item.id).build(),
  ])

  builder.grid(buttons, { columns: 2 })

  // Add pagination
  builder.pagination(currentPage, totalPages, 'page')

  // Add extra controls
  builder.row()
    .add('🔄 Refresh', 'refresh')
    .add('← Close', 'close')

  return builder.build()
}

// List command
bot.command('list', async (ctx) => {
  const keyboard = createPaginatedKeyboard(1, items.length, ITEMS_PER_PAGE)

  await ctx.reply(
    `📋 **Items List**\n\nTotal: ${items.length} items\nPage: 1 / ${Math.ceil(items.length / ITEMS_PER_PAGE)}`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )
})

// Handle pagination
bot.callbackQuery(/^page:(\d+)$/, async (ctx) => {
  const page = Number.parseInt(ctx.match[1])
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE)

  if (page < 1 || page > totalPages) {
    await ctx.answerCallbackQuery('⚠️ Invalid page number')
    return
  }

  const keyboard = createPaginatedKeyboard(page, items.length, ITEMS_PER_PAGE)

  await ctx.editMessageText(
    `📋 **Items List**\n\nTotal: ${items.length} items\nPage: ${page} / ${totalPages}`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )

  await ctx.answerCallbackQuery(`Page ${page}`)
})

// Handle page current (when user clicks on page indicator)
bot.callbackQuery('page:current', async (ctx) => {
  await ctx.answerCallbackQuery('ℹ️ You are on this page', { show_alert: false })
})

// Handle item selection
bot.callbackQuery(/^item:/, async (ctx) => {
  const parsed = parser.parse(ctx.callbackQuery.data)
  const itemId = parsed.params.id as number
  const item = items.find(i => i.id === itemId)

  if (!item) {
    await ctx.answerCallbackQuery('❌ Item not found')
    return
  }

  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('✏️ Edit', `edit:${item.id}`)
    .add('🗑️ Delete', `delete:${item.id}`)
    .row()
    .add('← Back to List', 'back:list')
    .build()

  await ctx.editMessageText(
    `**${item.name}**\n\n${item.description}\n\nID: ${item.id}`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )

  await ctx.answerCallbackQuery()
})

// Handle back to list
bot.callbackQuery('back:list', async (ctx) => {
  const keyboard = createPaginatedKeyboard(1, items.length, ITEMS_PER_PAGE)

  await ctx.editMessageText(
    `📋 **Items List**\n\nTotal: ${items.length} items\nPage: 1 / ${Math.ceil(items.length / ITEMS_PER_PAGE)}`,
    {
      reply_markup: keyboard,
      parse_mode: 'Markdown',
    },
  )

  await ctx.answerCallbackQuery()
})

// Handle refresh
bot.callbackQuery('refresh', async (ctx) => {
  // Extract current page from message (simplified)
  const currentPage = 1 // In real app, parse from message or store in state
  const keyboard = createPaginatedKeyboard(currentPage, items.length, ITEMS_PER_PAGE)

  await ctx.editMessageReplyMarkup({ reply_markup: keyboard })
  await ctx.answerCallbackQuery('✅ Refreshed')
})

// Handle close
bot.callbackQuery('close', async (ctx) => {
  await ctx.deleteMessage()
  await ctx.answerCallbackQuery('Closed')
})

// Advanced pagination example with filters
bot.command('advanced', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    // Filter buttons
    .row()
    .add('All', 'filter:all')
    .add('Active', 'filter:active')
    .add('Archived', 'filter:archived')
    // Items grid
    .grid([
      ['Item 1', 'item:1'],
      ['Item 2', 'item:2'],
      ['Item 3', 'item:3'],
      ['Item 4', 'item:4'],
    ], { columns: 2 })
    // Pagination
    .pagination(1, 5, 'page')
    // Actions
    .row()
    .add('➕ Add New', 'add')
    .add('🔄 Refresh', 'refresh')
    .build()

  await ctx.reply('📋 Advanced List with Filters', { reply_markup: keyboard })
})

// Start the bot
console.log('Bot started with pagination examples...')
bot.start()
