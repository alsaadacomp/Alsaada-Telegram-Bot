# Data Tables Module

A powerful module for creating interactive data tables with sorting, filtering, pagination, and seamless Prisma integration.

## 📋 Overview

This module provides an easy way to display and manage tabular data in Telegram bots with:

- ✅ **Prisma Integration** - Direct support for Prisma query results
- ✅ **Sorting** - Sort by any column
- ✅ **Filtering** - Multiple filter operators
- ✅ **Pagination** - Built-in pagination with inline keyboards
- ✅ **Formatting** - Customizable table formatting
- ✅ **Export** - Export to CSV, JSON, Markdown, HTML
- ✅ **Type-Safe** - Full TypeScript support

## 🚀 Quick Start

### Basic Example

```typescript
import { DataTable } from './modules/interaction/data-tables'

const table = new DataTable()
  .addColumn('id', 'ID')
  .addColumn('name', 'Name')
  .addColumn('email', 'Email')
  .addRows([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ])
  .setPagination(10)

const formatted = table.format()
const keyboard = table.getKeyboard()

await ctx.reply(formatted, { reply_markup: keyboard, parse_mode: 'Markdown' })
```

### Prisma Integration

```typescript
import { createPrismaTable } from './modules/interaction/data-tables'

// Simple usage
const users = await prisma.user.findMany()
const table = createPrismaTable(users, {
  exclude: ['password'], // Hide sensitive fields
  itemsPerPage: 10
})

// Advanced configuration
const table = createPrismaTable(users, {
  columns: {
    id: { label: 'ID', width: 5 },
    name: { label: 'Full Name', width: 20 },
    email: { label: 'Email', width: 25 },
    createdAt: {
      label: 'Registered',
      formatter: date => date.toLocaleDateString('ar-EG')
    }
  },
  exclude: ['password', 'resetToken'],
  itemsPerPage: 10
})

await ctx.reply(table.format(), {
  reply_markup: table.getKeyboard('users'),
  parse_mode: 'Markdown'
})
```

## 📦 Components

### 1. DataTable

Main class for creating and managing tables.

```typescript
const table = new DataTable()
  .addColumn('id', 'ID')
  .addColumn('name', 'Name')
  .addRows(data)
  .setPagination(10)
  .setSort('name', 'asc')
  .addFilter('status', 'equals', 'active')
```

### 2. Column

Represents a table column with configuration.

```typescript
const column = new Column('price', 'Price')
  .setDataType('number')
  .setAlignment('right')
  .setWidth(10)
  .setFormatter(value => `$${value.toFixed(2)}`)
```

### 3. Row

Represents a table row with data.

```typescript
const row = new Row({ id: 1, name: 'John' })
row.get('name') // 'John'
row.set('name', 'Jane')
```

### 4. Prisma Helpers

Helper functions for Prisma integration.

```typescript
import {
  createPrismaTable,
  getPrismaOrderBy,
  getPrismaPagination,
  getPrismaWhere
} from './modules/interaction/data-tables'

// Create table from Prisma
const table = createPrismaTable(await prisma.user.findMany())

// Get pagination params
const { skip, take } = getPrismaPagination(page, perPage)

// Get orderBy param
const orderBy = getPrismaOrderBy('createdAt', 'desc')

// Get where clause from filters
const where = getPrismaWhere([
  { column: 'name', operator: 'contains', value: 'John' }
])
```

## 🎯 Features

### Sorting

```typescript
table.setSort('name', 'asc') // Sort by name ascending
table.setSort('createdAt', 'desc') // Sort by date descending
```

### Filtering

```typescript
// Single filter
table.addFilter('status', 'equals', 'active')

// Multiple filters
table
  .addFilter('age', 'greater_than', 18)
  .addFilter('name', 'contains', 'john')

// Clear filters
table.clearFilters()
```

**Filter Operators**:
- `equals` - Exact match
- `not_equals` - Not equal
- `contains` - Contains text
- `not_contains` - Doesn't contain
- `starts_with` - Starts with
- `ends_with` - Ends with
- `greater_than` - Greater than (numbers)
- `less_than` - Less than (numbers)

### Pagination

```typescript
table.setPagination(10) // 10 items per page
table.setPage(2) // Go to page 2

// Get keyboard with pagination
const keyboard = table.getKeyboard('table')
```

### Formatting

```typescript
table.setFormatOptions({
  showBorders: true,
  showHeaders: true,
  maxColumnWidth: 20,
  ellipsis: '...',
  columnSeparator: ' │ ',
  rowSeparator: '─'
})
```

### Export

```typescript
// Export as CSV
const csv = table.export('csv', { delimiter: ',' })

// Export as JSON
const json = table.export('json', { pretty: true })

// Export as Markdown
const markdown = table.export('markdown')

// Export as HTML
const html = table.export('html')
```

## 📱 Telegram Bot Integration

### Complete Example

```typescript
bot.command('users', async (ctx) => {
  const users = await prisma.user.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' }
  })

  const table = createPrismaTable(users, {
    columns: {
      id: { label: '#', width: 5 },
      name: { label: 'Name', width: 20 },
      email: { label: 'Email', width: 25 },
      role: {
        label: 'Role',
        formatter: role => role === 'admin' ? '👑 Admin' : '👤 User'
      }
    },
    exclude: ['password'],
    itemsPerPage: 10
  })

  await ctx.reply(table.format(), {
    reply_markup: table.getKeyboard('users'),
    parse_mode: 'Markdown'
  })
})

// Handle pagination
bot.callbackQuery(/^users:page:(\d+)$/, async (ctx) => {
  const page = Number.parseInt(ctx.match[1])

  const users = await prisma.user.findMany({
    ...getPrismaPagination(page, 10),
    orderBy: { createdAt: 'desc' }
  })

  const table = createPrismaTable(users, { /* config */ })
  table.setPage(page)

  await ctx.editMessageText(table.format(), {
    reply_markup: table.getKeyboard('users'),
    parse_mode: 'Markdown'
  })
  await ctx.answerCallbackQuery()
})

// Handle sorting
bot.callbackQuery(/^users:sort:(\w+)$/, async (ctx) => {
  const column = ctx.match[1]
  // Toggle sort direction or implement your logic

  await ctx.answerCallbackQuery(`Sorted by ${column}`)
})
```

## 🎨 Column Data Types

```typescript
// String (default)
.addColumn('name', 'Name')

// Number
new Column('age', 'Age').setDataType('number')

// Boolean (displays ✓/✗)
new Column('active', 'Active').setDataType('boolean')

// Date
new Column('createdAt', 'Created').setDataType('date')
```

## 🔧 Advanced Usage

### Custom Formatters

```typescript
const table = new DataTable()
  .addColumn(
    new Column('price', 'Price')
      .setDataType('number')
      .setFormatter(value => `$${value.toLocaleString()}`)
  )
  .addColumn(
    new Column('status', 'Status')
      .setFormatter(value =>
        value === 'active' ? '✅ Active' : '❌ Inactive'
      )
  )
```

### Prisma with Relations

```typescript
const users = await prisma.user.findMany({
  include: {
    profile: true,
    posts: { select: { id: true } }
  }
})

const table = createPrismaTable(users, {
  columns: {
    'name': { label: 'Name' },
    'email': { label: 'Email' },
    'profile.bio': {
      label: 'Bio',
      formatter: bio => `${bio?.substring(0, 50)}...`
    },
    'posts': {
      label: 'Posts',
      formatter: posts => posts.length
    }
  }
})
```

### Dynamic Column Configuration

```typescript
function createUserTable(users: any[], userRole: string) {
  const config: PrismaTableConfig = {
    columns: {
      id: { label: 'ID', width: 5 },
      name: { label: 'Name' },
      email: { label: 'Email' }
    },
    exclude: ['password']
  }

  // Add admin-only columns
  if (userRole === 'admin') {
    config.columns!.role = { label: 'Role' }
    config.columns!.createdAt = {
      label: 'Registered',
      formatter: date => date.toLocaleDateString()
    }
  }

  return createPrismaTable(users, config)
}
```

## 📊 Statistics

```typescript
const stats = table.getStats()

console.log(`Total rows: ${stats.totalRows}`)
console.log(`Filtered rows: ${stats.filteredRows}`)
console.log(`Current page: ${stats.currentPage} of ${stats.totalPages}`)
```

## 🎓 Best Practices

1. **Exclude Sensitive Data**: Always exclude password and token fields
2. **Limit Query Size**: Use Prisma `take` to limit results
3. **Use Pagination**: Don't load all data at once
4. **Custom Formatters**: Format dates, numbers, and enums properly
5. **Column Widths**: Set appropriate widths to avoid truncation
6. **Error Handling**: Handle empty results gracefully

## 🔗 Related Modules

- **Inline Keyboards** - Used for table navigation
- **Validators** - For input validation
- **Prisma** - For database queries

---

**Module Version**: 1.0.0
**Status**: ✅ Production Ready
