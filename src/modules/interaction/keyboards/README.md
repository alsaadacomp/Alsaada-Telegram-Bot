# Inline Keyboards Builder Module

A powerful and flexible module for building interactive inline keyboards for Telegram bots with a fluent, chainable API.

## 📋 Overview

This module provides an intuitive way to create inline keyboards with various button types, layouts, and interactive features. It simplifies the process of building complex keyboard structures while maintaining type safety and code clarity.

## ✨ Features

- **Fluent API**: Chain methods for clean, readable code
- **Multiple Button Types**: Callback, URL, Switch Inline Query, and more
- **Layout Helpers**: Grid, rows, columns, pagination
- **Built-in Patterns**: Confirmation dialogs, navigation, pagination
- **Callback Data Management**: Parse and build callback data easily
- **Type-Safe**: Full TypeScript support with proper types
- **Lightweight**: No external dependencies beyond Grammy types

## 🚀 Quick Start

### Basic Example

```typescript
import { InlineKeyboardBuilder } from './modules/interaction/keyboards'

// Create a simple menu
const keyboard = new InlineKeyboardBuilder()
  .row()
  .add('✅ Confirm', 'confirm')
  .add('❌ Cancel', 'cancel')
  .build()

await ctx.reply('Are you sure?', { reply_markup: keyboard })
```

### Complex Example

```typescript
const keyboard = new InlineKeyboardBuilder()
  // Actions row
  .row()
  .add('Create', 'create')
  .add('Edit', 'edit')
  .add('Delete', 'delete')
  // External link
  .row()
  .url('📚 Documentation', 'https://docs.example.com')
  // Pagination
  .pagination(2, 5, 'page')
  .build()

await ctx.reply('Menu', { reply_markup: keyboard })
```

## 📦 Components

### 1. ButtonBuilder

Creates individual inline keyboard buttons.

```typescript
import { ButtonBuilder } from './modules/interaction/keyboards'

// Callback button
const button = new ButtonBuilder('Click Me')
  .callback('button_clicked')
  .build()

// URL button
const urlButton = new ButtonBuilder('Visit Site')
  .url('https://example.com')
  .build()

// Switch inline query button
const searchButton = new ButtonBuilder('Search')
  .switchInlineQuery('query text')
  .build()
```

### 2. InlineKeyboardBuilder

Builds complete keyboards with multiple buttons and layouts.

```typescript
import { InlineKeyboardBuilder } from './modules/interaction/keyboards'

const keyboard = new InlineKeyboardBuilder()
  // Manual rows
  .row()
  .add('Button 1', 'data1')
  .add('Button 2', 'data2')

  // Grid layout
  .grid([
    ['Item 1', 'item:1'],
    ['Item 2', 'item:2'],
    ['Item 3', 'item:3'],
    ['Item 4', 'item:4'],
  ], { columns: 2 })

  // Pagination
  .pagination(currentPage, totalPages, 'page')

  // Confirmation
  .confirm('delete', { id: 123 })

  .build()
```

### 3. CallbackDataParser

Parse and build callback data strings.

```typescript
import { CallbackDataParser } from './modules/interaction/keyboards'

const parser = new CallbackDataParser()

// Build callback data
const data = parser.builder('delete')
  .param('id', '123')
  .param('confirm', true)
  .build()
// Result: "delete:id=123:confirm=true"

// Parse callback data
const parsed = parser.parse('delete:id=123:confirm=true')
// Result: { action: 'delete', params: { id: 123, confirm: true } }

// Get specific parameter
const id = parser.getParam('delete:id=123:confirm=true', 'id')
// Result: 123
```

## 🎯 Button Types

### Callback Button
```typescript
builder.add('Button Text', 'callback_data')
```

### URL Button
```typescript
builder.url('Visit Website', 'https://example.com')
```

### Switch Inline Query
```typescript
builder.switchInlineQuery('Search', 'query text')
```

### Switch Inline Query Current Chat
```typescript
builder.switchInlineQueryCurrentChat('Share', 'share text')
```

## 📐 Layout Helpers

### Manual Rows
```typescript
const keyboard = new InlineKeyboardBuilder()
  .row()
  .add('Button 1', 'data1')
  .add('Button 2', 'data2')
  .row()
  .add('Button 3', 'data3')
  .build()
```

### Grid Layout
```typescript
const buttons: [string, string][] = [
  ['Item 1', 'item:1'],
  ['Item 2', 'item:2'],
  ['Item 3', 'item:3'],
  ['Item 4', 'item:4'],
]

const keyboard = new InlineKeyboardBuilder()
  .grid(buttons, { columns: 2 })
  .build()
```

### Pagination
```typescript
// Shows: [« Previous] [2 / 5] [Next »]
const keyboard = new InlineKeyboardBuilder()
  .pagination(2, 5, 'page')
  .build()

// Handle pagination callbacks
bot.callbackQuery(/^page:(\d+)$/, async (ctx) => {
  const page = Number.parseInt(ctx.match[1])
  // Update content with new page
})
```

### Confirmation Dialog
```typescript
const keyboard = new InlineKeyboardBuilder()
  .confirm('delete', { id: 123 })
  .build()

// Callback data: "delete:yes:id=123" or "delete:no:id=123"
```

## 🔧 Advanced Usage

### Custom Button Configuration
```typescript
const customButton = new ButtonBuilder('Advanced')
  .callback('advanced_action')
  .build()

const keyboard = new InlineKeyboardBuilder()
  .row()
  .addButton(customButton)
  .build()
```

### Complex Callback Data
```typescript
const parser = new CallbackDataParser()

const callbackData = parser.builder('update_user')
  .param('id', '456')
  .param('action', 'ban')
  .param('permanent', true)
  .param('reason', 'spam')
  .build()
// Result: "update_user:id=456:action=ban:permanent=true:reason=spam"
```

### Dynamic Keyboards
```typescript
function createItemsKeyboard(items: Item[], currentPage: number) {
  const builder = new InlineKeyboardBuilder()

  // Add items grid
  const buttons: [string, string][] = items.map(item => [
    item.name,
    `item:${item.id}`
  ])
  builder.grid(buttons, { columns: 2 })

  // Add pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  builder.pagination(currentPage, totalPages, 'page')

  // Add action row
  builder.row()
    .add('« Back', 'back')
    .add('🔄 Refresh', 'refresh')

  return builder.build()
}
```

## 📊 Helper Methods

```typescript
const builder = new InlineKeyboardBuilder()
  .row()
  .add('Button 1', 'data1')
  .row()
  .add('Button 2', 'data2')

// Get row count
builder.getRowCount() // 2

// Get button count in specific row
builder.getButtonCount(0) // 1

// Clear all buttons
builder.clear()

// Build after clearing
builder.add('New Button', 'new_data').build()
```

## 🎨 Best Practices

1. **Keep callback data short**: Telegram has a 64-byte limit for callback data
2. **Use meaningful prefixes**: Makes callback handling easier
3. **Chain methods**: Use fluent API for cleaner code
4. **Reuse builders**: Create helper functions for common patterns
5. **Handle errors**: Always check if navigation is possible

## 📝 Examples

See the `examples/keyboards/` directory for complete working examples:
- Basic menu creation
- Pagination implementation
- Confirmation dialogs
- Dynamic keyboards
- Complex navigation

## 🧪 Testing

The module includes comprehensive tests (63 tests) covering:
- Button creation
- Keyboard layouts
- Callback data parsing
- Edge cases
- Complex scenarios

Run tests:
```bash
npm test -- keyboards
```

## 📄 API Reference

See the full API documentation in `/docs/INLINE-KEYBOARDS-MODULE.md`

## 🤝 Integration

### With Grammar Bot

```typescript
import { Bot } from 'grammy'
import { CallbackDataParser, InlineKeyboardBuilder } from './modules/interaction/keyboards'

const bot = new Bot(process.env.BOT_TOKEN)
const parser = new CallbackDataParser()

bot.command('menu', async (ctx) => {
  const keyboard = new InlineKeyboardBuilder()
    .row()
    .add('Option 1', 'opt:1')
    .add('Option 2', 'opt:2')
    .build()

  await ctx.reply('Choose an option:', { reply_markup: keyboard })
})

bot.callbackQuery(/^opt:/, async (ctx) => {
  const parsed = parser.parse(ctx.callbackQuery.data)
  await ctx.answerCallbackQuery(`You selected option ${parsed.params[0]}`)
})
```

## 🚀 Performance

- **Zero runtime overhead**: Builds keyboards efficiently
- **Memory efficient**: No unnecessary object creation
- **Type-safe**: Catch errors at compile time

## 📚 Related Modules

- **Form Builder**: For multi-field input forms
- **Multi-Step Forms**: For complex multi-step processes
- **Validators**: For input validation

---

**Module Version**: 1.0.0
**Last Updated**: October 18, 2025
**Status**: ✅ Production Ready
