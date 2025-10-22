# 🔔 Notification System

A comprehensive notification system for Telegram bots with advanced features including role-based targeting, scheduling, recurring notifications, templates, and user preferences.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
- [Usage Examples](#-usage-examples)
- [API Reference](#-api-reference)
- [Testing](#-testing)

## ✨ Features

### 🎯 Target Audiences
- **All Users** - Broadcast to everyone
- **All Admins** - Notify all administrators
- **Super Admin** - Critical system notifications
- **Role-Based** - Target specific user roles
- **Specific Users** - Send to selected users
- **Active Users** - Engage active community members
- **Inactive Users** - Re-engagement campaigns
- **New Users** - Welcome and onboarding

### ⏰ Scheduling
- **One-Time Schedule** - Send at specific date/time
- **Recurring Notifications**
  - Daily (specific time)
  - Weekly (specific days and time)
  - Monthly (specific day and time)
  - Custom intervals
- **Timezone Support** - Respect user timezones

### 📝 Templates
- **Reusable Templates** - Define once, use many times
- **Variable Substitution** - Dynamic content with `{{variable}}` syntax
- **Auto-Detection** - Automatically detect template variables
- **Validation** - Ensure all required variables are provided

### 👤 User Preferences
- **Enable/Disable** - Users control their notifications
- **Type Filtering** - Choose notification types to receive
- **Priority Filtering** - Control notification urgency levels
- **Quiet Hours** - Don't disturb during sleep time
- **Channel Preferences** - Choose notification channels

### 🎨 Notification Types
- `info` - General information
- `success` - Success messages
- `warning` - Warning alerts
- `error` - Error notifications
- `announcement` - Important announcements
- `reminder` - Reminders and follow-ups
- `alert` - Critical alerts

### 🔥 Priority Levels
- `normal` - Standard notifications
- `important` - Important updates
- `urgent` - Urgent attention required
- `critical` - Critical system alerts

### 📊 Analytics
- **Notification History** - Complete audit trail
- **Statistics** - Success rates, counts by type/priority
- **Delivery Status** - Track sent/failed/pending
- **User Engagement** - Track delivery and interactions

### 🎪 Event-Based Notifications
- **Trigger Conditions** - Send based on events
- **Custom Events** - Define your own triggers
- **Multiple Listeners** - Multiple actions per event

## 🚀 Installation

The notification system is built-in. No additional installation required.

```typescript
import { NotificationService } from './modules/notifications/index.js'

const notificationService = new NotificationService()
```

## 🏁 Quick Start

### Basic Usage

```typescript
// 1. Send to all users
await notificationService.sendToAllUsers({
  message: 'Hello everyone! 👋',
  type: 'announcement',
  priority: 'normal',
})

// 2. Send to admins
await notificationService.sendToAdmins({
  message: 'Admin: New user registered',
  type: 'info',
  priority: 'important',
})

// 3. Send to super admin
await notificationService.sendToSuperAdmin({
  message: 'Critical: System error detected',
  type: 'error',
  priority: 'critical',
})

// 4. Send to specific role
await notificationService.sendToRole('ADMIN', {
  message: 'Moderator action required',
  type: 'alert',
})

// 5. Send to specific users
await notificationService.sendToUsers([123, 456, 789], {
  message: 'Personal notification',
  priority: 'important',
})
```

### Scheduled Notifications

```typescript
// Schedule for specific time
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(9, 0, 0)

await notificationService.schedule(
  { message: 'Daily reminder' },
  { audience: 'all_users' },
  { scheduledAt: tomorrow }
)

// Recurring daily notification
await notificationService.scheduleRecurring(
  { message: 'Good morning! ☀️' },
  { audience: 'all_users' },
  {
    recurring: {
      frequency: 'daily',
      time: '09:00',
    },
  }
)

// Weekly notification
await notificationService.scheduleRecurring(
  { message: 'Weekly update' },
  { audience: 'all_users' },
  {
    recurring: {
      frequency: 'weekly',
      daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
      time: '10:00',
    },
  }
)
```

### Using Templates

```typescript
import { NotificationTemplateBuilder } from './modules/notifications/index.js'

// Create template
const welcomeTemplate = new NotificationTemplateBuilder(
  'welcome',
  'Welcome Template',
  'Welcome {{name}}! You have {{points}} points.'
)
  .setType('success')
  .setPriority('normal')
  .autoDetectVariables()

// Register template
notificationService.registerTemplate(welcomeTemplate)

// Use template
await notificationService.sendFromTemplate(
  'welcome',
  { audience: 'specific_users', userIds: [123] },
  { name: 'Ahmed', points: 100 }
)
```

### User Preferences

```typescript
// Set user preferences
notificationService.setUserPreferences(userId, {
  enabled: true,
  types: ['announcement', 'important'],
  priorities: ['important', 'urgent', 'critical'],
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
})

// Get user preferences
const prefs = notificationService.getUserPreferences(userId)
```

### Event-Based Notifications

```typescript
// Register event listener
notificationService.on('user.registered', async (user) => {
  await notificationService.sendToSuperAdmin({
    message: `New user registered: ${user.username}`,
    type: 'info',
    priority: 'normal',
  })
})

// Trigger event
await notificationService.triggerEvent('user.registered', {
  userId: 123,
  username: 'ahmed',
})
```

## 🧩 Core Concepts

### Notification

A single notification message with configuration:

```typescript
const notification = new Notification('Hello!')
  .setPriority('urgent')
  .setType('alert')
  .setTarget({ audience: 'all_users' })
  .addButton({ text: 'View', url: 'https://example.com' })
  .setImage('https://example.com/image.jpg')
```

### Target Audience

Defines who receives the notification:

```typescript
// All users
{ audience: 'all_users' }

// Specific role
{ audience: 'role', role: 'ADMIN' }

// Specific users
{ audience: 'specific_users', userIds: [1, 2, 3] }

// Active users (active in last 7 days)
{ audience: 'active_users' }
```

### Schedule Configuration

```typescript
// One-time schedule
{
  scheduledAt: new Date('2025-12-31T09:00:00')
}

// Daily recurring
{
  recurring: {
    frequency: 'daily',
    time: '09:00'
  }
}

// Weekly recurring
{
  recurring: {
    frequency: 'weekly',
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
    time: '10:00',
    endDate: new Date('2025-12-31')
  }
}

// Monthly recurring
{
  recurring: {
    frequency: 'monthly',
    dayOfMonth: 15,
    time: '12:00'
  }
}
```

## 📚 Usage Examples

See the [examples directory](../../../examples/notifications/) for complete, runnable examples:

- `basic-notifications.ts` - Basic notification sending
- `scheduled-notifications.ts` - Scheduling and recurring
- `template-usage.ts` - Working with templates
- `user-preferences.ts` - Managing user preferences
- `event-based.ts` - Event-driven notifications
- `batch-sending.ts` - Sending to large audiences

## 📖 API Reference

### NotificationService

#### Sending Methods

- `sendToAllUsers(config, batchConfig?)` - Send to all users
- `sendToAdmins(config, batchConfig?)` - Send to all admins
- `sendToSuperAdmin(config)` - Send to super admin
- `sendToRole(role, config, batchConfig?)` - Send to specific role
- `sendToUsers(userIds, config, batchConfig?)` - Send to specific users
- `sendToActiveUsers(config, batchConfig?)` - Send to active users
- `sendToInactiveUsers(config, batchConfig?)` - Send to inactive users
- `sendToNewUsers(config, batchConfig?)` - Send to new users

#### Scheduling Methods

- `schedule(config, target, schedule)` - Schedule one-time notification
- `scheduleRecurring(config, target, schedule)` - Schedule recurring notification
- `cancelScheduled(notificationId)` - Cancel scheduled notification

#### Template Methods

- `registerTemplate(template)` - Register a notification template
- `getTemplate(templateId)` - Get registered template
- `sendFromTemplate(templateId, target, variables?, batchConfig?)` - Send using template

#### Event Methods

- `on(event, listener)` - Register event listener
- `triggerEvent(event, data)` - Trigger event

#### Preferences Methods

- `setUserPreferences(userId, preferences)` - Set user notification preferences
- `getUserPreferences(userId)` - Get user preferences

#### History & Stats Methods

- `getHistory(limit?)` - Get notification history
- `clearHistory()` - Clear notification history
- `getStatistics()` - Get notification statistics

#### Cleanup

- `cleanup()` - Clean up resources (scheduled notifications)

### NotificationTemplateBuilder

```typescript
const template = new NotificationTemplateBuilder(id, name, message)
  .setType(type)
  .setPriority(priority)
  .addVariable(variable)
  .setVariables(variables)
  .autoDetectVariables()
  .addButton(button)
  .setButtons(buttons)
  .render(variables)
  .validateVariables(variables)
  .createNotification(variables?)
  .build()
```

### NotificationScheduler

Static utility class for scheduling:

- `shouldSendNow(schedule)` - Check if should send now
- `isInQuietHours(start, end, now?)` - Check if in quiet hours
- `getNextScheduledTime(schedule)` - Get next scheduled time
- `getDelayUntilNextSend(schedule)` - Calculate delay in ms
- `formatSchedule(schedule)` - Format schedule as string

## 🧪 Testing

The notification system has **144 comprehensive tests** covering all functionality:

```bash
npm test tests/modules/notifications/
```

### Test Coverage

- **Notification Class** (35 tests) - Core notification functionality
- **Template Builder** (33 tests) - Template creation and rendering
- **Scheduler** (29 tests) - Scheduling logic
- **NotificationService** (48 tests) - Main service functionality

**Total: 144 tests, 100% passing** ✅

## 🔧 Advanced Configuration

### Batch Sending

Control how notifications are sent to large audiences:

```typescript
await notificationService.sendToAllUsers(
  { message: 'Announcement' },
  {
    batchSize: 50, // Send 50 at a time
    delayBetweenBatches: 1000, // Wait 1s between batches
    continueOnError: true, // Continue even if some fail
    retryFailed: true, // Retry failed sends
    maxRetries: 3, // Maximum retry attempts
  }
)
```

### Notification Buttons

Add interactive buttons:

```typescript
await notificationService.sendToAllUsers({
  message: 'Check out our new feature!',
  buttons: [
    { text: 'Learn More', url: 'https://example.com' },
    { text: 'Dismiss', callbackData: 'dismiss' },
  ],
})
```

### Custom Data

Attach custom data to notifications:

```typescript
await notificationService.sendToAdmins({
  message: 'New order received',
  data: {
    orderId: 12345,
    amount: 99.99,
    customerId: 456,
  },
})
```

## 📝 Best Practices

1. **Use Templates** - For frequently sent notifications
2. **Set Priorities** - Help users filter important notifications
3. **Respect Preferences** - Always honor user notification settings
4. **Use Quiet Hours** - Don't disturb users during sleep time
5. **Batch Large Sends** - Use batch configuration for large audiences
6. **Monitor Statistics** - Track delivery rates and engagement
7. **Handle Errors** - Always check send results for failures
8. **Clean Up** - Call `cleanup()` when shutting down

## 🆘 Troubleshooting

### Notifications not being sent

1. Check user preferences - user may have disabled notifications
2. Check quiet hours - notification may be blocked by quiet hours
3. Check filters - user may have filtered this notification type/priority

### Scheduled notifications not firing

1. Verify schedule configuration
2. Check if notification was cancelled
3. Ensure service is running continuously

### Template variables not working

1. Use `autoDetectVariables()` or manually set variables
2. Validate variables before sending with `validateVariables()`
3. Ensure all required variables are provided when sending

## 📄 License

Part of the Telegram Bot Template - MIT License

---

**Need Help?** Check the [examples](../../../examples/notifications/) or documentation files.
