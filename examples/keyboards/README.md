# Inline Keyboards Examples

This directory contains practical examples of using the Inline Keyboards Builder Module.

## 📚 Examples

### 1. Basic Menu (`basic-menu.ts`)

Demonstrates:
- Simple menu creation
- Callback buttons
- URL buttons
- Basic navigation
- Settings menu

**Run**:
```bash
npx tsx examples/keyboards/basic-menu.ts
```

**Commands**:
- `/menu` - Show main menu
- `/confirm` - Simple yes/no confirmation
- `/settings` - Settings menu with navigation

### 2. Pagination (`pagination.ts`)

Demonstrates:
- Paginated item lists
- Grid layout for items
- Page navigation (previous/next)
- Item selection
- Advanced filters

**Run**:
```bash
npx tsx examples/keyboards/pagination.ts
```

**Commands**:
- `/list` - Show paginated list (25 items, 4 per page)
- `/advanced` - Advanced list with filters

### 3. Confirmation Dialogs (`confirmation.ts`)

Demonstrates:
- Simple yes/no confirmation
- Confirmation with data
- Multi-step confirmations
- Critical action warnings
- Conditional confirmations

**Run**:
```bash
npx tsx examples/keyboards/confirmation.ts
```

**Commands**:
- `/delete` - Simple delete confirmation
- `/users` - User selection and delete confirmation
- `/critical` - Multi-step critical action
- `/conditional` - Conditional confirmation

## 🚀 Running Examples

### Prerequisites

1. Create a Telegram bot with [@BotFather](https://t.me/BotFather)
2. Get your bot token
3. Set the `BOT_TOKEN` environment variable

### Run an Example

```bash
# Set your bot token
export BOT_TOKEN="your_bot_token_here"

# Run an example
npx tsx examples/keyboards/basic-menu.ts
```

Or create a `.env` file:

```env
BOT_TOKEN=your_bot_token_here
```

Then run:

```bash
npx tsx examples/keyboards/basic-menu.ts
```

## 📖 Learning Path

1. **Start with Basic Menu** - Learn the fundamentals
2. **Try Pagination** - Understand layouts and navigation
3. **Explore Confirmations** - Handle user decisions

## 🎓 Key Concepts

### Button Types

```typescript
// Callback button
.add('Text', 'callback_data')

// URL button
.url('Text', 'https://example.com')

// Switch inline query
.switchInlineQuery('Text', 'query')
```

### Layout Patterns

```typescript
// Manual rows
.row()
  .add('Button 1', 'data1')
  .add('Button 2', 'data2')

// Grid layout
.grid(buttons, { columns: 2 })

// Pagination
.pagination(currentPage, totalPages, 'page')

// Confirmation
.confirm('action', { id: 123 })
```

### Callback Data

```typescript
// Build
const data = parser.builder('action')
  .param('id', 123)
  .param('confirmed', true)
  .build()
// Result: "action:id=123:confirmed=true"

// Parse
const parsed = parser.parse(data)
// Result: { action: 'action', params: { id: 123, confirmed: true } }
```

## 💡 Tips

1. **Keep callback data short** - Telegram has a 64-byte limit
2. **Use prefixes** - Organize callbacks with prefixes (e.g., `action:`, `page:`)
3. **Handle errors** - Always check for invalid data
4. **Answer callbacks** - Always call `ctx.answerCallbackQuery()`
5. **Use helpers** - Leverage built-in methods like `pagination()` and `confirm()`

## 🔗 Related Documentation

- [Module README](../../src/modules/interaction/keyboards/README.md)
- [API Reference](../../docs/INLINE-KEYBOARDS-MODULE.md)
- [Grammy Documentation](https://grammy.dev)

## 🐛 Troubleshooting

### Bot not responding
- Check if `BOT_TOKEN` is set correctly
- Verify bot is running (`console.log` should show "Bot started...")
- Check Telegram for errors

### Callbacks not working
- Ensure you're calling `ctx.answerCallbackQuery()`
- Check callback data matches your regex pattern
- Verify button callback_data is set correctly

### Keyboard not showing
- Check if `reply_markup` is passed to `ctx.reply()`
- Verify keyboard has at least one button
- Build the keyboard before sending

## 📝 Next Steps

After trying these examples:

1. **Modify the code** - Change button text, add new actions
2. **Combine patterns** - Mix pagination with confirmations
3. **Build your own** - Create custom keyboard patterns
4. **Test thoroughly** - Handle edge cases and errors

## 🎯 Challenge Tasks

1. Create a shopping cart with add/remove items and checkout
2. Build a multi-level navigation menu (3+ levels)
3. Implement a settings panel with toggles
4. Create a search interface with filters and results

---

**Happy Coding! 🚀**
