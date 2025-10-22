# Data Tables Examples

This directory contains practical examples of using the Data Tables Module.

## 📚 Examples

### 1. Basic Table (`basic-table.ts`)

Demonstrates:
- Creating tables from scratch
- Adding columns with custom configuration
- Adding rows of data
- Pagination
- Sorting
- Filtering
- Custom formatting
- Export to CSV
- Table statistics

**Run**:
```bash
npx tsx examples/data-tables/basic-table.ts
```

**Commands**:
- `/products` - Show products table with pagination
- `/sorted_products` - Show sorted products
- `/filtered_products` - Show filtered products
- `/custom_format` - Custom table formatting
- `/export` - Export table as CSV
- `/stats` - Show table statistics

### 2. Prisma Integration (`prisma-integration.ts`)

Demonstrates:
- Loading data from Prisma
- Auto-generating columns
- Prisma pagination helpers
- Prisma orderBy helpers
- Prisma where clause helpers
- State management per user
- Search functionality
- Export from database

**Run**:
```bash
npx tsx examples/data-tables/prisma-integration.ts
```

**Commands**:
- `/users` - Show all users with pagination
- `/admins` - Show only admin users
- `/search <username>` - Search users by username
- `/export_users` - Export all users to CSV

**Callbacks**:
- Pagination: `users:page:N`
- Sorting: `users:sort:column`
- Clear filters: `users:clear_filters`
- Refresh: `users:refresh`

## 🚀 Running Examples

### Prerequisites

1. Create a Telegram bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set up Prisma (for prisma-integration example)

### Setup

1. Set your bot token:
```bash
export BOT_TOKEN="your_bot_token_here"
```

Or create a `.env` file:
```env
BOT_TOKEN=your_bot_token_here
DATABASE_URL="file:./prisma/dev.db"
```

2. For Prisma example, ensure your database is set up:
```bash
npx prisma migrate dev
npx prisma generate
```

### Run an Example

```bash
# Basic table example
npx tsx examples/data-tables/basic-table.ts

# Prisma integration example
npx tsx examples/data-tables/prisma-integration.ts
```

## 📖 Learning Path

1. **Start with Basic Table** - Learn the fundamentals
   - Creating tables
   - Adding columns and rows
   - Pagination and sorting
   - Formatting options

2. **Try Prisma Integration** - Real database integration
   - Loading from Prisma
   - Auto-column generation
   - Pagination with database
   - Search and filtering

## 🎓 Key Concepts

### Creating a Table

```typescript
const table = new DataTable()
  .addColumn('id', 'ID')
  .addColumn('name', 'Name')
  .addRows(data)
  .setPagination(10)
```

### Prisma Integration

```typescript
const users = await prisma.user.findMany()

const table = createPrismaTable(users, {
  columns: {
    id: { label: '#', width: 5 },
    name: { label: 'Name', width: 20 }
  },
  exclude: ['password'],
  itemsPerPage: 10
})
```

### Custom Formatting

```typescript
new Column('price', 'Price')
  .setDataType('number')
  .setAlignment('right')
  .setFormatter(value => `$${value.toFixed(2)}`)
```

### Sorting & Filtering

```typescript
table
  .setSort('price', 'desc')
  .addFilter('category', 'equals', 'electronics')
  .addFilter('price', 'less_than', 1000)
```

### Export

```typescript
const csv = table.export('csv')
const json = table.export('json', { pretty: true })
const markdown = table.export('markdown')
const html = table.export('html')
```

## 💡 Tips

1. **Pagination** - Always use pagination for large datasets
2. **Exclude Sensitive Data** - Never include passwords or tokens
3. **Custom Formatters** - Format dates, currencies, and enums properly
4. **State Management** - Store user preferences (page, sort, filters)
5. **Error Handling** - Handle database errors gracefully
6. **Keyboard Integration** - Use built-in keyboard generation

## 🔧 Common Patterns

### Pattern 1: Paginated List with Sorting

```typescript
bot.command('items', async (ctx) => {
  const items = await prisma.item.findMany({
    ...getPrismaPagination(1, 10),
    orderBy: { createdAt: 'desc' }
  })

  const table = createPrismaTable(items, {
    itemsPerPage: 10
  })

  await ctx.reply(table.format(), {
    reply_markup: table.getKeyboard('items')
  })
})
```

### Pattern 2: Search with Filters

```typescript
const where = {
  name: { contains: query, mode: 'insensitive' },
  active: true
}

const results = await prisma.item.findMany({ where })
const table = createPrismaTable(results)
```

### Pattern 3: Export Data

```typescript
bot.command('export', async (ctx) => {
  const data = await prisma.item.findMany()
  const table = createPrismaTable(data)
  const csv = table.export('csv')

  await ctx.replyWithDocument({
    source: Buffer.from(csv),
    filename: 'data.csv'
  })
})
```

### Pattern 4: Statistics Dashboard

```typescript
const table = new DataTable()
  .addRows(data)
  .setPagination(10)

const stats = table.getStats()

await ctx.reply(
  `Total: ${stats.totalRows}\n`
  + `Page ${stats.currentPage} of ${stats.totalPages}`
)
```

## 🐛 Troubleshooting

### Bot not responding
- Check if `BOT_TOKEN` is set correctly
- Verify bot is running
- Check console for errors

### Prisma errors
- Ensure database is migrated: `npx prisma migrate dev`
- Generate Prisma client: `npx prisma generate`
- Check `DATABASE_URL` in `.env`

### Empty tables
- Verify data exists in database
- Check if filters are too restrictive
- Ensure query is correct

### Formatting issues
- Adjust column widths if text is truncated
- Use custom formatters for special formatting
- Check `maxColumnWidth` in format options

## 📝 Next Steps

After trying these examples:

1. **Modify the code** - Change column configurations
2. **Add new features** - Implement additional filters
3. **Build your own** - Create custom tables for your use case
4. **Test thoroughly** - Handle edge cases and errors

## 🎯 Challenge Tasks

1. Create a products catalog with categories and prices
2. Build a user management system with roles
3. Implement an inventory tracker with stock alerts
4. Create a sales report with date filtering
5. Build a dashboard with multiple tables

---

**Happy Coding! 🚀**
