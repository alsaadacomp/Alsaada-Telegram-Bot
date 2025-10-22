# 📋 Form Builder Examples

This directory contains comprehensive examples of using the Form Builder Module.

## 📁 Available Examples

### 1. Basic Contact Form (`basic-contact-form.ts`)
A simple contact form with:
- Name field
- Email field
- Subject field
- Message field
- Optional phone field
- Submit handler

**Use Case:** Contact pages, support requests, general inquiries

### 2. User Registration Form (`user-registration-form.ts`)
Complete registration form with:
- Username validation
- Email validation
- Password field
- Full name
- Phone number
- Date of birth with age validation
- Gender selection
- Country selection
- Multi-select interests
- Newsletter subscription
- Terms & conditions checkbox
- Custom validation logic

**Use Case:** User onboarding, account creation, sign-up flows

### 3. Telegram Bot Integration (`telegram-bot-integration.ts`)
Real-world Telegram bot integration showing:
- Multiple forms in one bot
- Command handlers
- Form state management
- Input handling
- Custom submit handlers
- Error handling

**Use Case:** Production Telegram bots with interactive forms

## 🚀 Running Examples

### TypeScript Execution

```bash
# Install dependencies (if not already done)
npm install

# Run an example with tsx
npx tsx examples/forms/basic-contact-form.ts

# Or with node (if compiled)
npm run build
node dist/examples/forms/basic-contact-form.js
```

### In Your Bot

```typescript
import { createContactForm } from './examples/forms/basic-contact-form'

const form = createContactForm()
// Use the form in your bot
```

## 📚 Learning Path

1. **Start with** `basic-contact-form.ts` - Learn the basics
2. **Move to** `user-registration-form.ts` - Learn advanced features
3. **Finish with** `telegram-bot-integration.ts` - Learn production integration

## 🎯 Key Concepts Demonstrated

### Form Building
- Creating forms with fluent API
- Adding different field types
- Setting field validations
- Configuring field options

### Validation
- Required fields
- Length constraints (min/max)
- Format validation (email, phone, URL)
- Value constraints (min/max for numbers)
- Custom validation logic
- Multi-field validation

### State Management
- Setting form data
- Getting form state
- Tracking field changes
- Error handling

### Submission
- Custom submit handlers
- Async operations
- Success/error responses
- Data transformation

### Telegram Integration
- Form handler setup
- Command handlers
- Input processing
- User state management
- Multiple forms per bot

## 💡 Tips

### 1. Always Validate Before Submit
```typescript
if (form.validate()) {
  await form.submit()
}
```

### 2. Handle Errors Gracefully
```typescript
const result = await form.submit()
if (!result.success) {
  // Show errors to user
  for (const [field, error] of Object.entries(result.errors || {})) {
    console.log(`${field}: ${error}`)
  }
}
```

### 3. Use Type-Appropriate Fields
```typescript
// Good
.addEmailField('email', 'Email')

// Less optimal
.addTextField('email', 'Email', { validator: emailValidator })
```

### 4. Provide Clear Feedback
```typescript
.addTextField('username', 'Username', {
  description: '3-20 characters, letters and numbers only',
  placeholder: 'john_doe'
})
```

## 🔗 Related Documentation

- [Form Builder Module Documentation](../../docs/FORM-BUILDER-MODULE.md)
- [Module README](../../src/modules/interaction/forms/README.md)
- [Test Files](../../tests/modules/interaction/forms/)

## 🎨 Customization Ideas

Based on these examples, you can create:

- **Survey forms** - Collect user feedback
- **Order forms** - E-commerce orders
- **Booking forms** - Appointments, reservations
- **Application forms** - Job applications, registrations
- **Settings forms** - User preferences
- **Report forms** - Bug reports, feature requests

## ✅ Checklist for Your Forms

- [ ] All required fields clearly marked
- [ ] Validation messages are user-friendly
- [ ] Placeholders provided for guidance
- [ ] Descriptions explain what's needed
- [ ] Submit handler includes error handling
- [ ] Success messages are clear
- [ ] Form can be cancelled
- [ ] State is properly managed

## 🆘 Troubleshooting

### Form not validating?
- Check required fields have values
- Verify field types match data types
- Review custom validators

### Submit not working?
- Ensure validation passes first
- Check submit handler for errors
- Verify async operations complete

### Telegram integration issues?
- Confirm bot token is correct
- Check form handler is initialized
- Verify command handlers are registered
- Ensure message handler isn't conflicting

## 📊 Example Statistics

- **Total Examples:** 3
- **Lines of Code:** ~500
- **Field Types Covered:** 10/10
- **Features Demonstrated:** All major features
- **Real-world Ready:** Yes

---

**Happy Form Building! 🚀**
