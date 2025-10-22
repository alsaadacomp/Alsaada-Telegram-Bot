/**
 * Example: Prisma Integration with Data Tables
 *
 * This example demonstrates how to use Data Tables with Prisma
 * for seamless database integration.
 */

import { Bot } from 'grammy'
import { PrismaClient } from '../../generated/prisma/index.js'
import {
  createPrismaTable,
  getPrismaOrderBy,
  getPrismaPagination,
  getPrismaWhere,
} from '../../src/modules/interaction/data-tables/index.js'

// Create instances
const bot = new Bot(process.env.BOT_TOKEN || '')
const prisma = new PrismaClient()

// Store user states
interface UserState {
  page: number
  sortColumn: string
  sortDirection: 'asc' | 'desc'
  filters: Array<{ column: string, operator: string, value: any }>
}

const userStates = new Map<number, UserState>()

function getUserState(userId: number): UserState {
  if (!userStates.has(userId)) {
    userStates.set(userId, {
      page: 1,
      sortColumn: 'createdAt',
      sortDirection: 'desc',
      filters: [],
    })
  }
  return userStates.get(userId)!
}

// Command: /users - Show all users
bot.command('users', async (ctx) => {
  try {
    const state = getUserState(ctx.from.id)

    // Fetch users from Prisma
    const users = await prisma.user.findMany({
      ...getPrismaPagination(state.page, 10),
      orderBy: getPrismaOrderBy(state.sortColumn, state.sortDirection),
    })

    // Count total users
    const totalUsers = await prisma.user.count()

    // Create table with Prisma data
    const table = createPrismaTable(users, {
      columns: {
        id: {
          label: '#',
          width: 5,
        },
        username: {
          label: 'Username',
          width: 15,
        },
        role: {
          label: 'Role',
          formatter: role => role === 'ADMIN' ? '👑 Admin' : '👤 User',
        },
        createdAt: {
          label: 'Joined',
          formatter: date => date
            ? new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'N/A',
        },
      },
      itemsPerPage: 10,
    })

    table.setPage(state.page)
    if (state.sortColumn) {
      table.setSort(state.sortColumn, state.sortDirection)
    }

    const stats = table.getStats()
    const message = `👥 **Users List**\n\n`
      + `Total: ${totalUsers} users\n`
      + `Page ${stats.currentPage} of ${stats.totalPages}\n\n${
        table.format()}`

    await ctx.reply(message, {
      reply_markup: table.getKeyboard('users'),
      parse_mode: 'Markdown',
    })
  }
  catch (error) {
    console.error('Error fetching users:', error)
    await ctx.reply('❌ Error loading users')
  }
})

// Command: /admins - Show only admins
bot.command('admins', async (ctx) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      orderBy: { createdAt: 'desc' },
    })

    const table = createPrismaTable(admins, {
      columns: {
        id: { label: '#', width: 5 },
        username: { label: 'Username', width: 20 },
        createdAt: {
          label: 'Admin Since',
          formatter: date => date ? new Date(date).toLocaleDateString() : 'N/A',
        },
      },
      itemsPerPage: 10,
    })

    await ctx.reply(`👑 **Admins** (${admins.length})\n\n${table.format()}`, {
      reply_markup: table.getKeyboard('admins'),
      parse_mode: 'Markdown',
    })
  }
  catch (error) {
    console.error('Error fetching admins:', error)
    await ctx.reply('❌ Error loading admins')
  }
})

// Command: /search <username>
bot.command('search', async (ctx) => {
  const query = ctx.message.text.split(' ').slice(1).join(' ')

  if (!query) {
    await ctx.reply('Usage: /search <username>')
    return
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
    })

    if (users.length === 0) {
      await ctx.reply(`No users found matching "${query}"`)
      return
    }

    const table = createPrismaTable(users, {
      columns: {
        id: { label: '#', width: 5 },
        username: { label: 'Username', width: 20 },
        role: {
          label: 'Role',
          formatter: role => role === 'ADMIN' ? '👑' : '👤',
        },
      },
      itemsPerPage: 10,
    })

    await ctx.reply(
      `🔍 Search results for "${query}"\n\n`
      + `Found ${users.length} user(s)\n\n${
        table.format()}`,
      {
        reply_markup: table.getKeyboard('search'),
        parse_mode: 'Markdown',
      },
    )
  }
  catch (error) {
    console.error('Error searching users:', error)
    await ctx.reply('❌ Error searching users')
  }
})

// Handle pagination
bot.callbackQuery(/^users:page:(\d+)$/, async (ctx) => {
  const page = Number.parseInt(ctx.match[1])
  const state = getUserState(ctx.from.id)
  state.page = page

  try {
    const users = await prisma.user.findMany({
      ...getPrismaPagination(page, 10),
      orderBy: getPrismaOrderBy(state.sortColumn, state.sortDirection),
    })

    const table = createPrismaTable(users, {
      columns: {
        id: { label: '#', width: 5 },
        username: { label: 'Username', width: 15 },
        role: {
          label: 'Role',
          formatter: role => role === 'ADMIN' ? '👑 Admin' : '👤 User',
        },
      },
      itemsPerPage: 10,
    })

    table.setPage(page)

    await ctx.editMessageText(table.format(), {
      reply_markup: table.getKeyboard('users'),
      parse_mode: 'Markdown',
    })

    await ctx.answerCallbackQuery(`Page ${page}`)
  }
  catch (error) {
    await ctx.answerCallbackQuery('❌ Error loading page')
  }
})

// Handle sorting
bot.callbackQuery(/^users:sort:(\w+)$/, async (ctx) => {
  const column = ctx.match[1]
  const state = getUserState(ctx.from.id)

  // Toggle sort direction
  if (state.sortColumn === column) {
    state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc'
  }
  else {
    state.sortColumn = column
    state.sortDirection = 'asc'
  }

  try {
    const users = await prisma.user.findMany({
      ...getPrismaPagination(state.page, 10),
      orderBy: getPrismaOrderBy(state.sortColumn, state.sortDirection),
    })

    const table = createPrismaTable(users, {
      columns: {
        id: { label: '#', width: 5 },
        username: { label: 'Username', width: 15 },
        role: { label: 'Role' },
      },
      itemsPerPage: 10,
    })

    table.setPage(state.page)
    table.setSort(state.sortColumn, state.sortDirection)

    await ctx.editMessageText(table.format(), {
      reply_markup: table.getKeyboard('users'),
      parse_mode: 'Markdown',
    })

    const icon = state.sortDirection === 'asc' ? '↑' : '↓'
    await ctx.answerCallbackQuery(`Sorted by ${column} ${icon}`)
  }
  catch (error) {
    await ctx.answerCallbackQuery('❌ Error sorting')
  }
})

// Handle clear filters
bot.callbackQuery('users:clear_filters', async (ctx) => {
  const state = getUserState(ctx.from.id)
  state.filters = []
  state.page = 1

  try {
    const users = await prisma.user.findMany({
      ...getPrismaPagination(1, 10),
      orderBy: getPrismaOrderBy(state.sortColumn, state.sortDirection),
    })

    const table = createPrismaTable(users, { itemsPerPage: 10 })

    await ctx.editMessageText(table.format(), {
      reply_markup: table.getKeyboard('users'),
      parse_mode: 'Markdown',
    })

    await ctx.answerCallbackQuery('Filters cleared')
  }
  catch (error) {
    await ctx.answerCallbackQuery('❌ Error clearing filters')
  }
})

// Handle refresh
bot.callbackQuery('users:refresh', async (ctx) => {
  const state = getUserState(ctx.from.id)

  try {
    const users = await prisma.user.findMany({
      ...getPrismaPagination(state.page, 10),
      orderBy: getPrismaOrderBy(state.sortColumn, state.sortDirection),
    })

    const table = createPrismaTable(users, { itemsPerPage: 10 })
    table.setPage(state.page)

    await ctx.editMessageText(table.format(), {
      reply_markup: table.getKeyboard('users'),
      parse_mode: 'Markdown',
    })

    await ctx.answerCallbackQuery('✅ Refreshed')
  }
  catch (error) {
    await ctx.answerCallbackQuery('❌ Error refreshing')
  }
})

// Export users
bot.command('export_users', async (ctx) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    })

    const table = createPrismaTable(users, {
      columns: {
        id: { label: 'ID' },
        username: { label: 'Username' },
        role: { label: 'Role' },
        createdAt: {
          label: 'Created At',
          formatter: date => date ? new Date(date).toISOString() : '',
        },
      },
    })

    // Export as CSV
    const csv = table.export('csv')

    await ctx.replyWithDocument({
      source: Buffer.from(csv),
      filename: `users_${Date.now()}.csv`,
    }, {
      caption: `📊 Exported ${users.length} users`,
    })
  }
  catch (error) {
    console.error('Error exporting users:', error)
    await ctx.reply('❌ Error exporting users')
  }
})

// Cleanup on bot stop
process.once('SIGINT', async () => {
  await prisma.$disconnect()
  bot.stop()
})

process.once('SIGTERM', async () => {
  await prisma.$disconnect()
  bot.stop()
})

// Start the bot
console.log('Bot started with Prisma integration...')
bot.start()
