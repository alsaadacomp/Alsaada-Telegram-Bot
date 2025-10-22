# 🔧 Feature Auto-Discovery System

**نظام الاكتشاف التلقائي للأقسام والوظائف**

---

## 📋 Overview

This is a powerful auto-discovery system that automatically loads and manages bot features from the `features/` directory.

### ✨ Key Features

- ✅ **Auto-Discovery** - Automatically discovers features in subdirectories
- ✅ **Enable/Disable** - Control features with a simple config flag
- ✅ **Permissions** - Per-feature and per-sub-feature role-based access control
- ✅ **Dynamic Menus** - Automatically generates inline keyboards
- ✅ **Multi-Level Navigation** - Main sections → Sub-sections
- ✅ **Zero Configuration** - Just add a folder and it appears!

---

## 🚀 Quick Start

### 1. Create a New Feature

```bash
src/bot/features/
└── your-feature/           ← Create this folder
    ├── config.ts           ← Feature configuration
    └── index.ts            ← Feature handlers
```

### 2. Define Configuration (`config.ts`)

```typescript
import type { FeatureConfig } from '../registry/types.js'

export const yourFeatureConfig: FeatureConfig = {
  id: 'your-feature',
  name: 'اسم القسم',
  icon: '🎯',
  description: 'وصف القسم',
  enabled: true, // ← Set to false to hide
  order: 1,
  permissions: ['ADMIN', 'SUPER_ADMIN'], // Who can access

  subFeatures: [
    {
      id: 'sub1',
      name: 'قسم فرعي 1',
      icon: '📝',
      handler: 'sub1Handler',
      permissions: ['ADMIN'], // Sub-feature permissions
      enabled: true,
    },
  ],
}
```

### 3. Export in `index.ts`

```typescript
import type { Context } from '../../context.js'
import { Composer } from 'grammy'
import { yourFeatureConfig } from './config.js'

export const composer = new Composer<Context>()
export { yourFeatureConfig as config }

// Your handlers here...
```

### 4. Done! ✅

The feature will automatically appear in the main menu!

---

## 📖 Configuration Reference

### FeatureConfig

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier |
| `name` | string | ✅ | Display name |
| `icon` | string | ❌ | Emoji icon |
| `description` | string | ❌ | Feature description |
| `enabled` | boolean | ✅ | Enable/disable feature |
| `order` | number | ❌ | Display order (lower = first) |
| `permissions` | UserRole[] | ❌ | Required roles |
| `category` | string | ❌ | Feature category |
| `subFeatures` | SubFeature[] | ❌ | Sub-sections |

### SubFeature

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier |
| `name` | string | ✅ | Display name |
| `icon` | string | ❌ | Emoji icon |
| `description` | string | ❌ | Description |
| `handler` | string | ✅ | Handler function name |
| `permissions` | UserRole[] | ❌ | Required roles |
| `enabled` | boolean | ❌ | Enable/disable (default: true) |
| `order` | number | ❌ | Display order |

### UserRole

```typescript
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'GUEST'
```

---

## 🎯 Usage Examples

### Example 1: Simple Feature (No Permissions)

```typescript
export const simpleFeature: FeatureConfig = {
  id: 'simple',
  name: 'Simple Feature',
  enabled: true,
  // No permissions = everyone can access
  subFeatures: [
    {
      id: 'action1',
      name: 'Action 1',
      handler: 'action1Handler',
    },
  ],
}
```

### Example 2: Admin-Only Feature

```typescript
export const adminFeature: FeatureConfig = {
  id: 'admin-panel',
  name: 'لوحة الإدارة',
  icon: '🔧',
  enabled: true,
  permissions: ['ADMIN', 'SUPER_ADMIN'],
  subFeatures: [
    {
      id: 'users',
      name: 'إدارة المستخدمين',
      handler: 'usersHandler',
      permissions: ['SUPER_ADMIN'], // Only super admin
    },
    {
      id: 'settings',
      name: 'الإعدادات',
      handler: 'settingsHandler',
      // Inherits parent permissions
    },
  ],
}
```

### Example 3: Multi-Level Structure

```typescript
export const hrFeature: FeatureConfig = {
  id: 'hr',
  name: '👥 شئون العاملين',
  enabled: true,
  order: 1,
  permissions: ['ADMIN', 'EMPLOYEE'],
  subFeatures: [
    {
      id: 'employees',
      name: '📋 قائمة العاملين',
      handler: 'employeesHandler',
      order: 1,
    },
    {
      id: 'vacations',
      name: '🏖️ الإجازات',
      handler: 'vacationsHandler',
      order: 2,
    },
    {
      id: 'salaries',
      name: '💵 الرواتب',
      handler: 'salariesHandler',
      order: 3,
      permissions: ['ADMIN'], // Only admins
    },
  ],
}
```

---

## 🔒 Permission System

### How It Works

1. **Feature-Level Permissions**: Check if user can access the main feature
2. **Sub-Feature Permissions**: Check if user can access specific sub-features
3. **Inheritance**: If sub-feature has no permissions, inherits from parent

### Permission Levels

- **GUEST**: Default role for new users
- **EMPLOYEE**: Regular employees
- **ADMIN**: Administrators
- **SUPER_ADMIN**: Super administrators

### Example

```typescript
{
  id: 'finance',
  permissions: ['ADMIN', 'SUPER_ADMIN'], // Parent
  subFeatures: [
    {
      id: 'view',
      // No permissions = inherits from parent
    },
    {
      id: 'edit',
      permissions: ['SUPER_ADMIN'], // Override
    },
  ],
}
```

---

## 🛠️ API Reference

### FeatureRegistry

```typescript
import { featureRegistry } from './registry/index.js'

// Get all features
const all = featureRegistry.getAll()

// Get enabled features
const enabled = featureRegistry.getEnabled()

// Get features by role
const forAdmin = featureRegistry.getByRole('ADMIN')

// Check permissions
const canAccess = featureRegistry.canAccess('feature-id', 'ADMIN')
```

### FeatureLoader

```typescript
import { featureLoader } from './registry/index.js'

// Load all features
const result = await featureLoader.loadAll()

// Reload features
await featureLoader.reload()
```

### MenuBuilder

```typescript
import { MenuBuilder } from './registry/index.js'

// Build main menu
const mainMenu = MenuBuilder.buildMainMenu(userRole)

// Build sub-menu
const subMenu = MenuBuilder.buildSubMenu('feature-id', userRole)
```

---

## 🎨 UI Components

### Main Menu Button

A keyboard button "📋 القائمة الرئيسية" is automatically added. Users can click it to open the main menu.

### Navigation Flow

```
User clicks "📋 القائمة الرئيسية"
    ↓
Shows inline menu with all accessible features
    ↓
User selects a feature
    ↓
Shows sub-features for that feature
    ↓
User selects a sub-feature
    ↓
Executes the handler
```

---

## 🧪 Testing

To test a new feature:

1. Create the feature folder
2. Set `enabled: true`
3. Restart the bot
4. Click "📋 القائمة الرئيسية"
5. Your feature should appear!

To disable:
1. Set `enabled: false` in `config.ts`
2. Restart the bot
3. Feature disappears!

---

## 📚 Best Practices

1. **Use descriptive IDs**: `hr-employees` not `emp`
2. **Add icons**: Makes menus more user-friendly
3. **Set proper permissions**: Don't expose sensitive features
4. **Order matters**: Use `order` to control display sequence
5. **Keep sub-features focused**: Each should do one thing
6. **Test permissions**: Verify different roles see correct menus

---

## 🔧 Troubleshooting

### Feature not appearing?

- ✅ Check `enabled: true` in config
- ✅ Check file is `index.ts` (not `.js`)
- ✅ Check you're exporting `config` and `composer`
- ✅ Check bot was restarted

### Permission denied?

- ✅ Check user role in database
- ✅ Check `permissions` array in config
- ✅ Check sub-feature permissions

### Callback not working?

- ✅ Check handler name matches
- ✅ Check feature ID is correct
- ✅ Check callback pattern in logs

---

## 🎓 Complete Example

See `src/bot/features/settings/` for a complete working example.

---

**Happy Coding! 🚀**
