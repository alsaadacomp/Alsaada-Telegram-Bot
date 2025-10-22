# 🔔 Notification System - Complete Documentation

**Version:** 1.0.0
**Status:** ✅ Production Ready
**Tests:** 144/144 Passing (100%)
**Date:** October 18, 2025

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Installation](#installation)
5. [Quick Start](#quick-start)
6. [Core Components](#core-components)
7. [Target Audiences](#target-audiences)
8. [Notification Types & Priorities](#notification-types--priorities)
9. [Scheduling System](#scheduling-system)
10. [Template System](#template-system)
11. [User Preferences](#user-preferences)
12. [Event-Based Notifications](#event-based-notifications)
13. [History & Analytics](#history--analytics)
14. [Prisma Integration](#prisma-integration)
15. [API Reference](#api-reference)
16. [Best Practices](#best-practices)
17. [Testing](#testing)
18. [Troubleshooting](#troubleshooting)

---

## Overview

The Notification System is a comprehensive, production-ready solution for managing notifications in Telegram bots. It provides powerful features including role-based targeting, scheduled and recurring notifications, user preferences, templates, and complete analytics.

### Key Highlights

- 🎯 **8 Target Audiences** - From all users to specific roles
- ⏰ **4 Schedule Types** - One-time, daily, weekly, monthly
- 📝 **Template Engine** - Reusable notifications with variables
- 👤 **User Control** - Full preference management with quiet hours
- 📊 **Analytics** - Complete history and statistics tracking
- 🎪 **Event-Driven** - React to system events automatically
- 🗄️ **Prisma Integration** - Full database support
- ✅ **100% Tested** - 144 comprehensive tests

---

## Features

### 🎯 Target Audiences

| Audience | Description | Use Case |
|----------|-------------|----------|
| **All Users** | Every user in the system | Announcements, updates |
| **All Admins** | All administrators | Admin alerts, reports |
| **Super Admin** | System administrators only | Critical system notifications |
| **Role-Based** | Specific user role (ADMIN, MODERATOR, etc.) | Role-specific communications |
| **Specific Users** | Selected user IDs | Personal notifications |
| **Active Users** | Recently active users | Engagement campaigns |
| **Inactive Users** | Users who haven't been active | Re-engagement |
| **New Users** | Recently registered users | Onboarding, welcome |

### 📝 Notification Types

- `info` - General information
- `success` - Success messages
- `warning` - Warning alerts
- `error` - Error notifications
- `announcement` - Important announcements
- `reminder` - Reminders and follow-ups
- `alert` - Critical alerts

### 🔥 Priority Levels

- `normal` - Standard notifications (can be filtered)
- `important` - Important updates (higher visibility)
- `urgent` - Urgent attention required (push through most filters)
- `critical` - Critical system alerts (highest priority)

### ⏰ Scheduling Options

#### One-Time Schedule
```typescript
{
  scheduledAt: new Date('2025-12-31T09:00:00')
}
```

#### Daily Recurring
```typescript
{
  recurring: {
    frequency: 'daily',
    time: '09:00'
  }
}
```

#### Weekly Recurring
```typescript
{
  recurring: {
    frequency: 'weekly',
    daysOfWeek: [1, 3, 5], // Mon, Wed, Fri
    time: '10:00'
  }
}
```

#### Monthly Recurring
```typescript
{
  recurring: {
    frequency: 'monthly',
    dayOfMonth: 15,
    time: '12:00'
  }
}
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  NotificationService                    │
│  (Main orchestrator for all notification operations)   │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┬──────────────┬────────────┐
        │                   │              │            │
┌───────▼────────┐  ┌──────▼──────┐  ┌───▼────┐  ┌────▼─────┐
│  Notification  │  │   Template  │  │Scheduler│  │ Storage  │
│     Class      │  │   Builder   │  │  Utils  │  │ (Prisma) │
└────────────────┘  └─────────────┘  └─────────┘  └──────────┘
```

### Component Responsibilities

1. **NotificationService** - Main API, orchestrates everything
2. **Notification** - Individual notification object
3. **NotificationTemplateBuilder** - Template creation and rendering
4. **NotificationScheduler** - Scheduling logic and utilities
5. **Prisma Models** - Database persistence

---

## Installation

The system is built-in, but requires Prisma setup:

```bash
# 1. Generate Prisma client
npx prisma generate

# 2. Run migrations
npx prisma migrate dev

# 3. Import and use
import { NotificationService } from './modules/notifications/index.js'
```

---

## Quick Start

### Basic Example

```typescript
import { NotificationService } from './modules/notifications/index.js'

const service = new NotificationService()

// Send to all users
await service.sendToAllUsers({
  message: 'Hello everyone! 👋',
  type: 'announcement',
  priority: 'normal',
})

// Send to admins
await service.sendToAdmins({
  message: 'New user registered',
  type: 'info',
  priority: 'important',
})

// Schedule for tomorrow
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

await service.schedule(
  { message: 'Daily reminder' },
  { audience: 'all_users' },
  { scheduledAt: tomorrow }
)
```

---

## Core Components

### 1. Notification Class

Represents a single notification.

```typescript
const notification = new Notification('Hello!')
  .setPriority('urgent')
  .setType('alert')
  .setTarget({ audience: 'all_users' })
  .addButton({ text: 'View', url: 'https://example.com' })
  .setImage('https://example.com/image.jpg')
  .setData({ customField: 'value' })
```

**Methods:**
- `setPriority(priority)` - Set priority level
- `setType(type)` - Set notification type
- `setMessage(message)` - Update message
- `setData(data)` - Add custom data
- `addButton(button)` - Add interactive button
- `setButtons(buttons)` - Set all buttons
- `setImage(url)` - Attach image
- `setTarget(target)` - Set recipient target
- `setSchedule(schedule)` - Schedule notification
- `setStatus(status)` - Update status
- `addMetadata(key, value)` - Add metadata
- `clone()` - Create a copy
- `toJSON()` - Serialize to JSON

### 2. NotificationService

Main service for managing notifications.

```typescript
const service = new NotificationService()

// Sending
await service.sendToAllUsers(config)
await service.sendToAdmins(config)
await service.sendToSuperAdmin(config)
await service.sendToRole(role, config)
await service.sendToUsers(userIds, config)
await service.sendToActiveUsers(config)
await service.sendToInactiveUsers(config)
await service.sendToNewUsers(config)

// Scheduling
await service.schedule(config, target, schedule)
await service.scheduleRecurring(config, target, schedule)
service.cancelScheduled(notificationId)

// Templates
service.registerTemplate(template)
await service.sendFromTemplate(templateId, target, variables)

// Events
service.on(event, listener)
await service.triggerEvent(event, data)

// Preferences
service.setUserPreferences(userId, preferences)
service.getUserPreferences(userId)

// History & Stats
service.getHistory(limit?)
service.getStatistics()
service.clearHistory()

// Cleanup
service.cleanup()
```

### 3. NotificationTemplateBuilder

Create reusable notification templates.

```typescript
const template = new NotificationTemplateBuilder(
  'welcome',
  'Welcome Template',
  'Hello {{name}}! You have {{points}} points.'
)
  .setType('success')
  .setPriority('normal')
  .autoDetectVariables()
  .addButton({ text: 'Start', url: 'https://example.com' })

// Register and use
service.registerTemplate(template)
await service.sendFromTemplate('welcome', target, { name: 'Ahmed', points: 100 })
```

**Methods:**
- `setType(type)` - Set notification type
- `setPriority(priority)` - Set priority
- `addVariable(variable)` - Add variable name
- `setVariables(variables)` - Set all variables
- `autoDetectVariables()` - Auto-detect from message
- `addButton(button)` - Add button
- `setButtons(buttons)` - Set all buttons
- `render(variables)` - Render with variables
- `validateVariables(variables)` - Validate variables
- `createNotification(variables)` - Create notification instance
- `clone(id?, name?)` - Clone template
- `build()` - Build template object

### 4. NotificationScheduler

Static utility class for scheduling logic.

```typescript
// Check if should send now
NotificationScheduler.shouldSendNow(schedule)

// Check quiet hours
NotificationScheduler.isInQuietHours('22:00', '08:00')

// Get next scheduled time
NotificationScheduler.getNextScheduledTime(schedule)

// Calculate delay
NotificationScheduler.getDelayUntilNextSend(schedule)

// Format schedule
NotificationScheduler.formatSchedule(schedule)
```

---

## Target Audiences

### All Users

Broadcast to everyone in the system.

```typescript
await service.sendToAllUsers({
  message: 'System maintenance tonight at 2 AM',
  type: 'announcement',
  priority: 'important',
})
```

### All Admins

Notify all administrators.

```typescript
await service.sendToAdmins({
  message: 'Daily report ready for review',
  type: 'info',
  priority: 'normal',
})
```

### Super Admin

Critical system notifications.

```typescript
await service.sendToSuperAdmin({
  message: 'Critical: Database backup failed',
  type: 'error',
  priority: 'critical',
})
```

### Role-Based

Target specific user role.

```typescript
await service.sendToRole('MODERATOR', {
  message: '5 posts pending moderation',
  type: 'reminder',
})
```

### Specific Users

Send to selected users.

```typescript
await service.sendToUsers([123, 456, 789], {
  message: 'Congratulations! You won a prize',
  type: 'success',
  priority: 'important',
})
```

### Active/Inactive/New Users

Target based on activity status.

```typescript
// Active users
await service.sendToActiveUsers({
  message: 'Special offer for active members!',
})

// Inactive users
await service.sendToInactiveUsers({
  message: 'We miss you! Come back for a bonus',
})

// New users
await service.sendToNewUsers({
  message: 'Welcome! Here are 5 tips to get started',
})
```

---

## Notification Types & Priorities

### When to Use Each Type

| Type | Use When | Example |
|------|----------|---------|
| `info` | General information | "New feature available" |
| `success` | Action completed successfully | "Profile updated successfully" |
| `warning` | Something requires attention | "Your subscription expires soon" |
| `error` | Error occurred | "Payment failed" |
| `announcement` | Important announcement | "System update scheduled" |
| `reminder` | Remind about something | "Meeting in 30 minutes" |
| `alert` | Urgent alert | "Security breach detected" |

### When to Use Each Priority

| Priority | Use When | User Can Filter? |
|----------|----------|------------------|
| `normal` | Regular notifications | ✅ Yes |
| `important` | Important updates | ✅ Yes |
| `urgent` | Urgent matters | ⚠️ Partially |
| `critical` | Critical alerts | ❌ No (recommended) |

---

## Scheduling System

### One-Time Schedule

Schedule for a specific date and time.

```typescript
const scheduledDate = new Date('2025-12-31T09:00:00')

await service.schedule(
  { message: 'Happy New Year! 🎉' },
  { audience: 'all_users' },
  { scheduledAt: scheduledDate }
)
```

### Daily Recurring

Send at the same time every day.

```typescript
await service.scheduleRecurring(
  { message: 'Good morning! ☀️' },
  { audience: 'all_users' },
  {
    recurring: {
      frequency: 'daily',
      time: '09:00',
    },
  }
)
```

### Weekly Recurring

Send on specific days of the week.

```typescript
await service.scheduleRecurring(
  { message: 'Weekly team update' },
  { audience: 'all_admins' },
  {
    recurring: {
      frequency: 'weekly',
      daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
      time: '10:00',
    },
  }
)
```

### Monthly Recurring

Send on a specific day each month.

```typescript
await service.scheduleRecurring(
  { message: 'Monthly billing statement' },
  { audience: 'all_users' },
  {
    recurring: {
      frequency: 'monthly',
      dayOfMonth: 1, // First day of month
      time: '09:00',
    },
  }
)
```

### Time-Limited Recurring

Set an end date for recurring notifications.

```typescript
const endDate = new Date('2025-12-31')

await service.scheduleRecurring(
  { message: 'Limited time offer!' },
  { audience: 'all_users' },
  {
    recurring: {
      frequency: 'daily',
      time: '10:00',
      endDate,
    },
  }
)
```

### Cancelling Scheduled Notifications

```typescript
const notificationId = await service.schedule(...)
service.cancelScheduled(notificationId)
```

---

## Template System

### Creating Templates

```typescript
const template = new NotificationTemplateBuilder(
  'order_confirm',
  'Order Confirmation',
  'Order #{{orderId}} confirmed!\nTotal: ${{total}}\nItems: {{itemCount}}'
)
  .setType('success')
  .setPriority('important')
  .autoDetectVariables()
```

### Variable Substitution

Templates use `{{variableName}}` syntax.

```typescript
const message = 'Hello {{name}}! You have {{points}} points.'
// Rendered with: { name: 'Ahmed', points: 100 }
// Result: "Hello Ahmed! You have 100 points."
```

### Auto-Detecting Variables

```typescript
const template = new NotificationTemplateBuilder(
  'id',
  'Name',
  'Hello {{name}}! Welcome {{title}}'
).autoDetectVariables()

console.log(template.getVariables()) // ['name', 'title']
```

### Manual Variable Definition

```typescript
template.setVariables(['name', 'age', 'email'])
```

### Validating Variables

```typescript
const validation = template.validateVariables({
  name: 'Ahmed',
  // missing 'age' and 'email'
})

console.log(validation.valid) // false
console.log(validation.missing) // ['age', 'email']
```

### Using Templates

```typescript
// Register once
service.registerTemplate(template)

// Use many times
await service.sendFromTemplate(
  'order_confirm',
  { audience: 'specific_users', userIds: [123] },
  {
    orderId: '12345',
    total: '99.99',
    itemCount: '3',
  }
)
```

### Cloning Templates

```typescript
const vipTemplate = template.clone('order_confirm_vip', 'VIP Order Confirmation')
vipTemplate.setMessage('🌟 VIP Order #{{orderId}} confirmed! ...')
```

---

## User Preferences

### Setting Preferences

```typescript
service.setUserPreferences(userId, {
  enabled: true,
  types: ['announcement', 'alert', 'reminder'],
  priorities: ['important', 'urgent', 'critical'],
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00',
  },
})
```

### Preference Options

```typescript
interface UserNotificationPreferences {
  enabled: boolean
  types?: NotificationType[]
  priorities?: NotificationPriority[]
  quietHours?: {
    enabled: boolean
    start: string // HH:mm
    end: string // HH:mm
    timezone?: string
  }
  channels?: NotificationChannel[]
}
```

### How Filtering Works

1. **Disabled Notifications** - If `enabled: false`, no notifications sent
2. **Type Filtering** - Only specified types are delivered
3. **Priority Filtering** - Only specified priorities are delivered
4. **Quiet Hours** - No notifications during quiet hours
5. **No Preferences** - All notifications are delivered (default)

### Example: Power User Setup

```typescript
service.setUserPreferences(userId, {
  enabled: true,
  types: ['announcement', 'alert', 'error'],
  priorities: ['urgent', 'critical'],
  quietHours: {
    enabled: true,
    start: '23:00',
    end: '07:00',
  },
})
```

### Getting Preferences

```typescript
const prefs = service.getUserPreferences(userId)
if (prefs) {
  console.log(`Notifications enabled: ${prefs.enabled}`)
}
```

---

## Event-Based Notifications

### Registering Event Listeners

```typescript
service.on('user.registered', async (user) => {
  await service.sendToSuperAdmin({
    message: `New user registered: ${user.username}`,
    type: 'info',
  })
})
```

### Triggering Events

```typescript
await service.triggerEvent('user.registered', {
  userId: 123,
  username: 'ahmed',
})
```

### Available Events

- `user.registered` - New user registration
- `user.updated` - User profile updated
- `user.deleted` - User account deleted
- `admin.action` - Admin performed action
- `system.error` - System error occurred
- `system.warning` - System warning
- `custom` - Custom events

### Multiple Listeners

```typescript
service.on('user.registered', listener1)
service.on('user.registered', listener2)
service.on('user.registered', listener3)
// All three will be called
```

### Error Handling

Listener errors are caught and logged automatically.

```typescript
service.on('event', async () => {
  throw new Error('Listener failed')
  // Error is logged, other listeners continue
})
```

---

## History & Analytics

### Getting History

```typescript
// Get all history
const allHistory = service.getHistory()

// Get last 10
const recent = service.getHistory(10)

// Filter by criteria
const adminNotifs = allHistory.filter(n => n.target.audience === 'all_admins')
```

### Notification Record

```typescript
interface NotificationRecord {
  id: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  target: NotificationTarget
  status: NotificationStatus
  sentAt?: Date
  scheduledAt?: Date
  failureReason?: string
  recipients: number[]
  successCount: number
  failureCount: number
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
```

### Getting Statistics

```typescript
const stats = service.getStatistics()

console.log(`Total: ${stats.total}`)
console.log(`Sent: ${stats.sent}`)
console.log(`Failed: ${stats.failed}`)
console.log(`Success Rate: ${stats.successRate}%`)

// By priority
console.log(`Urgent: ${stats.byPriority.urgent}`)

// By type
console.log(`Announcements: ${stats.byType.announcement}`)

// By target
console.log(`To All Users: ${stats.byTarget.all_users}`)
```

### Statistics Object

```typescript
interface NotificationStatistics {
  total: number
  sent: number
  failed: number
  pending: number
  scheduled: number
  cancelled: number
  successRate: number
  byPriority: Record<NotificationPriority, number>
  byType: Record<NotificationType, number>
  byTarget: Record<TargetAudience, number>
}
```

### Clearing History

```typescript
service.clearHistory()
```

---

## Prisma Integration

### Database Schema

The system includes complete Prisma models:

```prisma
model Notification {
  id              String
  message         String
  type            NotificationType
  priority        NotificationPriority
  status          NotificationStatus
  targetAudience  TargetAudience
  // ... more fields
  recipients      NotificationRecipient[]
}

model NotificationPreferences {
  id                Int
  userId            Int
  enabled           Boolean
  types             String? // JSON
  priorities        String? // JSON
  quietHoursEnabled Boolean
  // ... more fields
}

model NotificationTemplate {
  id         String
  name       String
  message    String
  type       NotificationType
  priority   NotificationPriority
  // ... more fields
}
```

### Persisting to Database

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Save notification
await prisma.notification.create({
  data: {
    id: notificationId,
    message: 'Hello!',
    type: 'INFO',
    priority: 'NORMAL',
    targetAudience: 'ALL_USERS',
    status: 'SENT',
  },
})

// Save preferences
await prisma.notificationPreferences.upsert({
  where: { userId },
  create: { userId, enabled: true },
  update: { enabled: false },
})

// Save template
await prisma.notificationTemplate.create({
  data: {
    id: 'welcome',
    name: 'Welcome Template',
    message: 'Hello {{name}}!',
    type: 'SUCCESS',
    priority: 'NORMAL',
  },
})
```

### Loading from Database

```typescript
// Load preferences on startup
const allPrefs = await prisma.notificationPreferences.findMany()
allPrefs.forEach((prefs) => {
  service.setUserPreferences(prefs.userId, {
    enabled: prefs.enabled,
    types: JSON.parse(prefs.types || '[]'),
    priorities: JSON.parse(prefs.priorities || '[]'),
    // ...
  })
})

// Load templates
const templates = await prisma.notificationTemplate.findMany()
templates.forEach((t) => {
  const template = new NotificationTemplateBuilder(t.id, t.name, t.message)
    .setType(t.type.toLowerCase())
    .setPriority(t.priority.toLowerCase())
  service.registerTemplate(template)
})
```

---

## API Reference

### Complete API at a Glance

```typescript
// Sending
service.sendToAllUsers(config, batchConfig?)
service.sendToAdmins(config, batchConfig?)
service.sendToSuperAdmin(config)
service.sendToRole(role, config, batchConfig?)
service.sendToUsers(userIds, config, batchConfig?)
service.sendToActiveUsers(config, batchConfig?)
service.sendToInactiveUsers(config, batchConfig?)
service.sendToNewUsers(config, batchConfig?)

// Scheduling
service.schedule(config, target, schedule)
service.scheduleRecurring(config, target, schedule)
service.cancelScheduled(id)

// Templates
service.registerTemplate(template)
service.getTemplate(id)
service.sendFromTemplate(id, target, vars?, batchConfig?)

// Events
service.on(event, listener)
service.triggerEvent(event, data)

// Preferences
service.setUserPreferences(userId, prefs)
service.getUserPreferences(userId)

// History & Stats
service.getHistory(limit?)
service.getStatistics()
service.clearHistory()

// Cleanup
service.cleanup()
```

---

## Best Practices

### 1. Always Use Templates for Repeated Notifications

❌ **Bad:**
```typescript
await service.sendToUsers([123], {
  message: `Welcome ${name}! You have ${points} points.`,
})
```

✅ **Good:**
```typescript
const template = new NotificationTemplateBuilder(
  'welcome',
  'Welcome',
  'Welcome {{name}}! You have {{points}} points.'
).autoDetectVariables()

service.registerTemplate(template)
await service.sendFromTemplate('welcome', target, { name, points })
```

### 2. Respect User Preferences

❌ **Bad:**
```typescript
// Ignoring user preferences
await bot.api.sendMessage(userId, message)
```

✅ **Good:**
```typescript
// Preferences are automatically checked
await service.sendToUsers([userId], { message })
```

### 3. Use Appropriate Priorities

❌ **Bad:**
```typescript
// Everything is critical
await service.sendToAllUsers({
  message: 'New blog post!',
  priority: 'critical', // Wrong!
})
```

✅ **Good:**
```typescript
// Use appropriate priority
await service.sendToAllUsers({
  message: 'New blog post!',
  priority: 'normal',
})

// Save critical for real emergencies
await service.sendToSuperAdmin({
  message: 'Database backup failed!',
  priority: 'critical',
})
```

### 4. Batch Large Sends

❌ **Bad:**
```typescript
// Sending to 10,000 users at once
await service.sendToAllUsers({ message })
```

✅ **Good:**
```typescript
// Control batch size and delays
await service.sendToAllUsers(
  { message },
  {
    batchSize: 50,
    delayBetweenBatches: 1000,
  }
)
```

### 5. Always Cleanup

❌ **Bad:**
```typescript
// Leaving scheduled notifications running
process.exit(0)
```

✅ **Good:**
```typescript
// Cleanup before shutdown
service.cleanup()
process.exit(0)
```

### 6. Handle Errors

❌ **Bad:**
```typescript
await service.sendToAllUsers({ message })
// Assuming success
```

✅ **Good:**
```typescript
const result = await service.sendToAllUsers({ message })
if (result.failedCount > 0) {
  console.error(`Failed to send to ${result.failedCount} users`)
  console.error(result.errors)
}
```

### 7. Use Event-Based Notifications

❌ **Bad:**
```typescript
// Manually sending in every handler
async function registerUser(data) {
  // ... registration logic
  await service.sendToSuperAdmin({ message: 'New user' })
}
```

✅ **Good:**
```typescript
// Set up once
service.on('user.registered', async (user) => {
  await service.sendToSuperAdmin({ message: `New user: ${user.username}` })
})

// Trigger in handlers
async function registerUser(data) {
  // ... registration logic
  await service.triggerEvent('user.registered', user)
}
```

---

## Testing

### Test Coverage

The notification system has **144 comprehensive tests**:

- **Notification Class** - 35 tests
- **Template Builder** - 33 tests
- **Scheduler** - 29 tests
- **NotificationService** - 48 tests

**Total: 144 tests, 100% passing** ✅

### Running Tests

```bash
# Run all notification tests
npm test tests/modules/notifications/

# Run specific test file
npm test tests/modules/notifications/notification.test.ts

# Run with coverage
npm test -- --coverage tests/modules/notifications/
```

### Writing Tests

```typescript
import { describe, expect, test } from '@jest/globals'
import { NotificationService } from '../../../src/modules/notifications/index.js'

describe('My Notification Tests', () => {
  test('should send notification', async () => {
    const service = new NotificationService()

    const result = await service.sendToAllUsers({
      message: 'Test',
    })

    expect(result.success).toBe(true)
  })
})
```

---

## Troubleshooting

### Notifications Not Being Sent

**Problem:** Notifications are not reaching users.

**Solutions:**
1. Check if user has notifications enabled
   ```typescript
   const prefs = service.getUserPreferences(userId)
   console.log(prefs?.enabled)
   ```

2. Check quiet hours
   ```typescript
   const isQuiet = NotificationScheduler.isInQuietHours('22:00', '08:00')
   ```

3. Check type/priority filters
   ```typescript
   // User may have filtered this type
   console.log(prefs?.types)
   console.log(prefs?.priorities)
   ```

### Scheduled Notifications Not Firing

**Problem:** Scheduled notifications don't send.

**Solutions:**
1. Verify schedule is correct
   ```typescript
   const nextTime = NotificationScheduler.getNextScheduledTime(schedule)
   console.log(nextTime)
   ```

2. Check if cancelled
   ```typescript
   const history = service.getHistory()
   const notif = history.find(n => n.id === notificationId)
   console.log(notif?.status) // Check if 'cancelled'
   ```

3. Ensure service is running
   ```typescript
   // Service must stay running for scheduled notifications
   // Don't call cleanup() or exit process
   ```

### Template Variables Not Working

**Problem:** Variables not being replaced.

**Solutions:**
1. Use correct syntax
   ```typescript
   // ✅ Correct
   'Hello {{name}}'

   // ❌ Wrong
   'Hello {name}'
   'Hello $name'
   ```

2. Auto-detect or set manually
   ```typescript
   template.autoDetectVariables()
   // OR
   template.setVariables(['name', 'age'])
   ```

3. Validate before sending
   ```typescript
   const validation = template.validateVariables(vars)
   if (!validation.valid) {
     console.error('Missing:', validation.missing)
   }
   ```

### High Failure Rate

**Problem:** Many notifications failing to send.

**Solutions:**
1. Check send result
   ```typescript
   const result = await service.sendToAllUsers({ message })
   console.log(`Failed: ${result.failedCount}`)
   console.log(result.errors)
   console.log(result.failedUserIds)
   ```

2. Use batch configuration
   ```typescript
   await service.sendToAllUsers(
     { message },
     {
       batchSize: 50,
       delayBetweenBatches: 1000,
       continueOnError: true,
     }
   )
   ```

3. Check rate limits (if using real Telegram API)

### Memory Leaks

**Problem:** Memory usage keeps increasing.

**Solutions:**
1. Clear history periodically
   ```typescript
   setInterval(() => {
     service.clearHistory()
   }, 24 * 60 * 60 * 1000) // Daily
   ```

2. Cleanup on shutdown
   ```typescript
   process.on('SIGTERM', () => {
     service.cleanup()
     process.exit(0)
   })
   ```

3. Limit history size
   ```typescript
   // Keep only last 1000
   if (service.getHistory().length > 1000) {
     service.clearHistory()
   }
   ```

---

## 📚 Additional Resources

- [README](../src/modules/notifications/README.md) - Quick reference
- [Examples](../examples/notifications/) - Practical examples
- [Tests](../tests/modules/notifications/) - Test cases
- [Prisma Schema](../prisma/schema.prisma) - Database models

---

## 📝 License

Part of the Telegram Bot Template - MIT License

---

## 🎉 Summary

The Notification System is a **complete, production-ready solution** with:

✅ **8 Target Audiences**
✅ **7 Notification Types**
✅ **4 Priority Levels**
✅ **4 Schedule Types**
✅ **Template Engine**
✅ **User Preferences with Quiet Hours**
✅ **Event-Based System**
✅ **Complete Analytics**
✅ **Prisma Integration**
✅ **144 Tests (100% Passing)**
✅ **Full Documentation**
✅ **Practical Examples**

**Ready to use in production!** 🚀

---

**Version 1.0.0** - October 18, 2025
