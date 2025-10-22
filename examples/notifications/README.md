# 📚 Notification System Examples

This directory contains practical examples demonstrating all features of the Notification System.

## 📋 Examples Overview

### 1. **basic-notifications.ts**
Learn the fundamentals of sending notifications to different target audiences.

**Topics Covered:**
- Sending to all users
- Sending to admins and super admin
- Role-based notifications
- Targeting specific users
- Active, inactive, and new user targeting
- Adding buttons and images
- Viewing statistics and history

**Run:**
```bash
npx tsx examples/notifications/basic-notifications.ts
```

---

### 2. **scheduled-notifications.ts**
Master scheduling and recurring notifications.

**Topics Covered:**
- One-time scheduled notifications
- Daily recurring notifications
- Weekly recurring (specific days)
- Monthly recurring notifications
- Time-limited recurring notifications
- Custom interval notifications
- Cancelling scheduled notifications

**Run:**
```bash
npx tsx examples/notifications/scheduled-notifications.ts
```

---

### 3. **template-usage.ts**
Work with reusable notification templates.

**Topics Covered:**
- Creating templates
- Variable substitution
- Auto-detecting variables
- Template validation
- Sending from templates
- Template rendering
- Cloning templates
- Error handling

**Run:**
```bash
npx tsx examples/notifications/template-usage.ts
```

---

### 4. **user-preferences.ts**
Implement user notification preferences.

**Topics Covered:**
- Setting user preferences
- Filtering by priority
- Filtering by type
- Quiet hours
- Disabling notifications
- Combined filters
- Updating preferences
- Best practices

**Run:**
```bash
npx tsx examples/notifications/user-preferences.ts
```

---

## 🚀 Running Examples

### Prerequisites

Make sure you have the project set up:

```bash
npm install
npm run build
```

### Run All Examples

```bash
# Run all examples
npx tsx examples/notifications/basic-notifications.ts
npx tsx examples/notifications/scheduled-notifications.ts
npx tsx examples/notifications/template-usage.ts
npx tsx examples/notifications/user-preferences.ts
```

---

## 📖 Learning Path

For best learning experience, follow this order:

1. **Start with `basic-notifications.ts`** - Learn the basics
2. **Move to `template-usage.ts`** - Learn to reuse notification patterns
3. **Then `scheduled-notifications.ts`** - Learn timing and automation
4. **Finally `user-preferences.ts`** - Learn to respect user choices

---

## 🎯 Key Takeaways

After completing these examples, you'll know how to:

- ✅ Send notifications to any target audience
- ✅ Schedule notifications for specific times
- ✅ Create recurring notifications (daily, weekly, monthly)
- ✅ Build and use reusable templates
- ✅ Respect user notification preferences
- ✅ Implement quiet hours
- ✅ Add interactive buttons
- ✅ Track notification history and statistics
- ✅ Handle errors gracefully

---

## 🔧 Customization

Feel free to modify these examples to fit your use case:

- Change target audiences
- Adjust schedules and timings
- Create your own templates
- Test different preference combinations
- Add your custom logic

---

## 📚 Further Reading

- [Main Documentation](../../src/modules/notifications/README.md)
- [API Reference](../../docs/NOTIFICATION-SYSTEM-MODULE.md)
- [Tests](../../tests/modules/notifications/)

---

## 💡 Need Help?

- Check the inline comments in each example
- Read the error messages carefully
- Review the main documentation
- Look at the comprehensive tests for more usage patterns

---

**Happy Learning! 🎓**
