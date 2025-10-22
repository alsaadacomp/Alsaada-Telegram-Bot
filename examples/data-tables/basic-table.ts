/**
 * Example: Basic Data Table
 *
 * This example demonstrates basic table creation with columns, rows,
 * pagination, and formatting.
 */

import { Bot } from 'grammy'
import { Column, DataTable } from '../../src/modules/interaction/data-tables/index.js'

// Create bot instance
const bot = new Bot(process.env.BOT_TOKEN || '')

// Sample data
const products = [
  { id: 1, name: 'Laptop', price: 15000, stock: 5, available: true },
  { id: 2, name: 'Mouse', price: 200, stock: 50, available: true },
  { id: 3, name: 'Keyboard', price: 500, stock: 30, available: true },
  { id: 4, name: 'Monitor', price: 3000, stock: 0, available: false },
  { id: 5, name: 'Headset', price: 800, stock: 20, available: true },
  { id: 6, name: 'Webcam', price: 1200, stock: 10, available: true },
  { id: 7, name: 'USB Cable', price: 50, stock: 100, available: true },
  { id: 8, name: 'Hard Drive', price: 2000, stock: 15, available: true },
]

// Command: /products
bot.command('products', async (ctx) => {
  const table = new DataTable()
    // Add columns with custom configuration
    .addColumn(
      new Column('id', '#')
        .setWidth(5)
        .setDataType('number'),
    )
    .addColumn(
      new Column('name', 'Product')
        .setWidth(15),
    )
    .addColumn(
      new Column('price', 'Price')
        .setDataType('number')
        .setAlignment('right')
        .setFormatter(value => `${value} EGP`),
    )
    .addColumn(
      new Column('stock', 'Stock')
        .setDataType('number')
        .setAlignment('center'),
    )
    .addColumn(
      new Column('available', 'Available')
        .setDataType('boolean')
        .setAlignment('center'),
    )
    // Add data
    .addRows(products)
    // Enable pagination
    .setPagination(5)

  const formatted = table.format()
  const keyboard = table.getKeyboard('products')

  await ctx.reply(formatted, {
    reply_markup: keyboard,
    parse_mode: 'Markdown',
  })
})

// Command: /sorted_products
bot.command('sorted_products', async (ctx) => {
  const table = new DataTable()
    .addColumns([
      { key: 'name', label: 'Product' },
      { key: 'price', label: 'Price (EGP)' },
      { key: 'stock', label: 'In Stock' },
    ])
    .addRows(products)
    .setSort('price', 'desc') // Sort by price descending
    .setPagination(5)

  await ctx.reply(table.format(), {
    reply_markup: table.getKeyboard('sorted'),
    parse_mode: 'Markdown',
  })
})

// Command: /filtered_products
bot.command('filtered_products', async (ctx) => {
  const table = new DataTable()
    .addColumns([
      { key: 'name', label: 'Product' },
      { key: 'price', label: 'Price' },
      { key: 'available', label: 'Status' },
    ])
    .addRows(products)
    .addFilter('available', 'equals', true) // Only available products
    .addFilter('price', 'less_than', 2000) // Price under 2000
    .setPagination(5)

  const stats = table.getStats()
  const message = `📦 **Available Products (Under 2000 EGP)**\n\n`
    + `Showing ${stats.filteredRows} of ${stats.totalRows} products\n\n${
      table.format()}`

  await ctx.reply(message, {
    reply_markup: table.getKeyboard('filtered'),
    parse_mode: 'Markdown',
  })
})

// Command: /custom_format
bot.command('custom_format', async (ctx) => {
  const table = new DataTable()
    .addColumns([
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'price', label: 'Price' },
    ])
    .addRows(products.slice(0, 3))
    .setFormatOptions({
      showBorders: true,
      showHeaders: true,
      maxColumnWidth: 15,
      columnSeparator: ' | ',
      rowSeparator: '─',
    })

  await ctx.reply(table.format(), { parse_mode: 'Markdown' })
})

// Handle pagination
bot.callbackQuery(/^products:page:(\d+)$/, async (ctx) => {
  const page = Number.parseInt(ctx.match[1])

  const table = new DataTable()
    .addColumn('id', '#')
    .addColumn('name', 'Product')
    .addColumn('price', 'Price')
    .addRows(products)
    .setPagination(5)
    .setPage(page)

  await ctx.editMessageText(table.format(), {
    reply_markup: table.getKeyboard('products'),
    parse_mode: 'Markdown',
  })

  await ctx.answerCallbackQuery(`Page ${page}`)
})

// Handle sorting
bot.callbackQuery(/^products:sort:(\w+)$/, async (ctx) => {
  const column = ctx.match[1]

  const table = new DataTable()
    .addColumns([
      { key: 'name', label: 'Product' },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock' },
    ])
    .addRows(products)
    .setSort(column, 'asc')
    .setPagination(5)

  await ctx.editMessageText(table.format(), {
    reply_markup: table.getKeyboard('products'),
    parse_mode: 'Markdown',
  })

  await ctx.answerCallbackQuery(`Sorted by ${column}`)
})

// Handle clear filters
bot.callbackQuery(/^(products|sorted|filtered):clear_filters$/, async (ctx) => {
  const table = new DataTable()
    .addColumns([
      { key: 'name', label: 'Product' },
      { key: 'price', label: 'Price' },
      { key: 'available', label: 'Available' },
    ])
    .addRows(products)
    .setPagination(5)

  await ctx.editMessageText(table.format(), {
    reply_markup: table.getKeyboard('products'),
    parse_mode: 'Markdown',
  })

  await ctx.answerCallbackQuery('Filters cleared')
})

// Handle refresh
bot.callbackQuery(/^(products|sorted|filtered):refresh$/, async (ctx) => {
  await ctx.answerCallbackQuery('Refreshed!')
})

// Export command
bot.command('export', async (ctx) => {
  const table = new DataTable()
    .addColumns([
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Product' },
      { key: 'price', label: 'Price' },
      { key: 'stock', label: 'Stock' },
    ])
    .addRows(products)

  // Export as CSV
  const csv = table.export('csv')

  await ctx.replyWithDocument({
    source: Buffer.from(csv),
    filename: 'products.csv',
  }, {
    caption: '📊 Products exported as CSV',
  })
})

// Statistics command
bot.command('stats', async (ctx) => {
  const table = new DataTable()
    .addColumn('name', 'Product')
    .addColumn('price', 'Price')
    .addRows(products)
    .setPagination(5)

  const stats = table.getStats()

  const message = `📊 **Table Statistics**\n\n`
    + `Total Rows: ${stats.totalRows}\n`
    + `Total Columns: ${stats.totalColumns}\n`
    + `Filtered Rows: ${stats.filteredRows}\n`
    + `Current Page: ${stats.currentPage}\n`
    + `Total Pages: ${stats.totalPages}`

  await ctx.reply(message, { parse_mode: 'Markdown' })
})

// Start the bot
console.log('Bot started with basic table examples...')
bot.start()
