# 📋 Form Builder Module

A powerful and flexible form building system for Telegram bots with built-in validation and state management.

## ✨ Features

- 🎯 **Fluent API** - Easy-to-use chainable methods
- ✅ **Built-in Validators** - 10 field types with automatic validation
- 🎨 **Custom Validators** - Add your own validation logic
- 💾 **State Management** - Track form and field states
- 🗄️ **Storage Options** - In-memory or database storage
- 🤖 **Telegram Ready** - Built-in Telegram bot handlers
- 📝 **TypeScript** - Full type safety
- 🧪 **Well Tested** - 73 tests with 100% success rate

## 🚀 Quick Start

```typescript
import { FormBuilder } from './forms'

// Create a form
const contactForm = new FormBuilder('contact', 'Contact Us')
  .addTextField('name', 'Full Name', { required: true })
  .addEmailField('email', 'Email', { required: true })
  .addTextField('message', 'Message', { required: true, minLength: 10 })
  .build()

// Use the form
contactForm.setData({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello, I have a question about your product.'
})

// Validate
if (contactForm.validate()) {
  // Submit
  const result = await contactForm.submit()
  console.log(result.success ? 'Success!' : 'Failed')
}
```

## 📦 What's Included

```
forms/
├── types.ts              # TypeScript types and interfaces
├── field.ts              # Field class with validation
├── form-builder.ts       # FormBuilder and Form classes
├── storage/
│   ├── form-storage.ts   # Storage implementations
│   └── index.ts
├── handlers/
│   ├── telegram-form-handler.ts  # Telegram bot integration
│   └── index.ts
├── index.ts              # Main exports
└── README.md             # This file
```

## 🎯 Field Types

- `text` - Text input
- `email` - Email address
- `phone` - Phone number
- `number` - Numeric input
- `date` - Date input
- `url` - URL input
- `password` - Password input
- `select` - Single selection
- `multi_select` - Multiple selection
- `boolean` - Yes/No checkbox

## 📚 Documentation

For complete documentation, see: [docs/FORM-BUILDER-MODULE.md](../../../docs/FORM-BUILDER-MODULE.md)

## 🧪 Tests

```bash
# Run form builder tests only
npm test -- tests/modules/interaction/forms

# Run all tests
npm test
```

**Test Results:**
- Total Tests: 73
- Success Rate: 100%
- Coverage: Complete

## 🎓 Examples

### Registration Form

```typescript
const form = new FormBuilder('registration', 'Sign Up')
  .addTextField('username', 'Username', { required: true, minLength: 3 })
  .addEmailField('email', 'Email', { required: true })
  .addPasswordField('password', 'Password', { required: true, minLength: 8 })
  .addPhoneField('phone', 'Phone Number', { required: true })
  .addSelectField('country', 'Country', ['USA', 'UK', 'Canada'])
  .build()
```

### Survey Form

```typescript
const form = new FormBuilder('survey', 'Customer Survey')
  .addSelectField('rating', 'Rate our service', [
    'Excellent',
    'Good',
    'Fair',
    'Poor'
  ], { required: true })
  .addMultiSelectField('features', 'Which features do you use?', [
    'Feature A',
    'Feature B',
    'Feature C'
  ])
  .addTextField('feedback', 'Feedback', { minLength: 10 })
  .build()
```

## 🤖 Telegram Integration

```typescript
import { TelegramFormHandler } from './forms'

const handler = new TelegramFormHandler()

// Start form
bot.command('contact', async (ctx) => {
  await handler.startForm(ctx, contactForm)
})

// Handle input
bot.on('message:text', async (ctx) => {
  if (handler.hasActiveForm(ctx.from.id, 'contact')) {
    await handler.handleInput(ctx, 'contact', ctx.message.text)
  }
})
```

## 🔗 Integration

Seamlessly integrates with existing validators:

```typescript
import { isValidEmail, isValidPhone } from '../validators'

const form = new FormBuilder('test', 'Test')
  .addEmailField('email', 'Email', { validator: isValidEmail })
  .addPhoneField('phone', 'Phone', { validator: isValidPhone })
  .build()
```

## ✅ Status

- [x] Core functionality
- [x] All field types
- [x] Validation system
- [x] State management
- [x] Storage system
- [x] Telegram integration
- [x] Comprehensive tests (73 tests)
- [x] Complete documentation

## 📊 Statistics

- **Files:** 8
- **Tests:** 73 (100% passing)
- **Field Types:** 10
- **Lines of Code:** ~1500
- **Documentation:** Complete

---

**Ready to use in production! 🚀**
