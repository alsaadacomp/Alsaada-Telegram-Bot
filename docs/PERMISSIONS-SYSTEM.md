# 🔐 نظام الصلاحيات والأدوار - Permissions & Roles System

## 📋 نظرة عامة

تم إنشاء نظام صلاحيات وأدوار متكامل مع قاعدة البيانات Prisma.

**تاريخ الإنجاز:** 18 أكتوبر 2025
**الحالة:** ✅ مكتمل وجاهز

---

## 🎯 الأدوار المتاحة

### 1. 👑 SUPER_ADMIN (مدير أعلى)
- **الصلاحيات:** كاملة بدون قيود
- **الاستخدام:** صاحب البوت أو المدير الرئيسي
- **العدد الموصى به:** 1-2 فقط

### 2. 🛡️ ADMIN (مدير)
- **الصلاحيات:** إدارة المستخدمين، الأقسام، التقارير
- **الاستخدام:** المديرون والمشرفون
- **القيود:** لا يمكنه تغيير دور مدير آخر

### 3. 👤 USER (مستخدم)
- **الصلاحيات:** استخدام الأقسام المسموح بها
- **الاستخدام:** الموظفون والمستخدمون العاديون
- **القيود:** لا يمكنه الوصول للوحة التحكم

### 4. 🌐 GUEST (زائر)
- **الصلاحيات:** محدودة جداً (عرض فقط)
- **الاستخدام:** الدور الافتراضي لأي مستخدم جديد
- **القيود:** لا يمكنه تنفيذ أي إجراءات

---

## 📦 المكونات المُنفذة

### 1. Prisma Schema
```prisma
model User {
  id                Int       @id @default(autoincrement())
  telegramId        BigInt    @unique
  role              Role      @default(GUEST)
  isActive          Boolean   @default(true)
  isBanned          Boolean   @default(false)
  customPermissions String?   // JSON array
  // ... more fields
}

enum Role {
  SUPER_ADMIN
  ADMIN
  USER
  GUEST
}
```

### 2. Permission Service
```typescript
PermissionService.hasPermission(userContext, 'users.create')
PermissionService.hasRole(userContext, 'ADMIN')
PermissionService.hasMinRole(userContext, 'USER')
PermissionService.canAccessFeature(userContext, ['ADMIN'])
```

### 3. Role Manager
```typescript
RoleManager.changeRole({ userId, newRole, changedBy, reason })
RoleManager.banUser(userId, bannedBy, reason)
RoleManager.unbanUser(userId, unbannedBy)
RoleManager.getRoleStatistics()
RoleManager.getOrCreateUser(telegramId, userData)
```

### 4. Middleware
```typescript
import { requireMinRole, requirePermission, requireRole } from '#root/modules/permissions'

// في معالج معين
composer.use(requireRole('ADMIN'), async (ctx) => {
  // فقط للأدمن
})

composer.use(requireMinRole('USER'), async (ctx) => {
  // للمستخدم وما فوق
})

composer.use(requirePermission('users.create'), async (ctx) => {
  // فقط من لديه صلاحية إنشاء مستخدمين
})
```

---

## 🚀 الاستخدام

### تحميل الصلاحيات تلقائياً
الصلاحيات تُحمل تلقائياً في `src/bot/index.ts`:

```typescript
// يُنفذ لكل update
protectedBot.use(async (ctx, next) => {
  // إنشاء/جلب المستخدم من DB
  await RoleManager.getOrCreateUser(BigInt(ctx.from.id), {...})
  await next()
})

// تحميل الصلاحيات إلى ctx.dbUser
protectedBot.use(loadUserPermissions())
```

### استخدام الصلاحيات في الأقسام
```typescript
// في config.ts
export const myFeatureConfig: FeatureConfig = {
  id: 'my-feature',
  name: 'قسمي',
  permissions: ['ADMIN', 'USER'], // ← هنا

  subFeatures: [
    {
      id: 'sensitive-action',
      name: 'إجراء حساس',
      permissions: ['SUPER_ADMIN'], // ← فقط للسوبر أدمن
    },
  ],
}
```

### التحقق يدوياً في المعالج
```typescript
composer.callbackQuery('my-action', async (ctx) => {
  if (!ctx.dbUser) {
    await ctx.reply('⛔ يجب تسجيل الدخول')
    return
  }

  if (ctx.dbUser.isBanned) {
    await ctx.reply('⛔ تم حظرك')
    return
  }

  if (!PermissionService.hasMinRole(ctx.dbUser, 'ADMIN')) {
    await ctx.reply('⛔ صلاحية غير كافية')
  }

  // تنفيذ الإجراء
})
```

---

## 🛡️ لوحة التحكم (Admin Panel)

### الوصول
```
القائمة الرئيسية → 🛡️ لوحة التحكم
```

### الأقسام الفرعية
1. **👥 قائمة المستخدمين** - عرض وإدارة جميع المستخدمين ✅
2. **🔄 تغيير الأدوار** - تغيير دور المستخدمين ✅
3. **🚫 حظر مستخدم** - حظر/إلغاء حظر ✅
4. **📊 الإحصائيات** - إحصائيات شاملة ✅

**جميع المعالجات مُنفذة وجاهزة! 🎉**

---

## 📊 الإحصائيات المتاحة

```typescript
const stats = await RoleManager.getRoleStatistics()

// النتيجة:
{
  superAdmins: 1,
  admins: 3,
  users: 45,
  guests: 12,
  total: 61,
  active: 58,
  banned: 2,
  inactive: 3
}
```

---

## 🔒 الأمان

### 1. القواعد الافتراضية
- ✅ أي مستخدم جديد يُسجل كـ `GUEST`
- ✅ المحظورون لا يمكنهم الوصول لأي شيء
- ✅ غير النشطين لا يمكنهم الوصول

### 2. تغيير الأدوار
- ✅ فقط دور أعلى يمكنه تغيير دور أقل
- ✅ لا يمكن تعيين دور أعلى من دورك
- ✅ يُسجل كل تغيير في `RoleChange` model

### 3. الصلاحيات المخصصة
```typescript
// إضافة صلاحية مخصصة
await PermissionService.addCustomPermission(userId, 'reports.delete')

// إزالة صلاحية
await PermissionService.removeCustomPermission(userId, 'reports.delete')
```

---

## 📝 نماذج البيانات

### User Model
```typescript
{
  id: number
  telegramId: bigint
  username: string | null
  firstName: string | null
  lastName: string | null
  role: Role
  isActive: boolean
  isBanned: boolean
  bannedAt: Date | null
  bannedReason: string | null
  customPermissions: string | null // JSON
  department: string | null
  position: string | null
}
```

### RoleChange Model
```typescript
{
  id: number
  userId: number
  oldRole: Role
  newRole: Role
  changedBy: number
  reason: string | null
  createdAt: Date
}
```

---

## ✅ الخلاصة

**تم إنجازه:**
- ✅ Prisma Schema مع 4 أدوار
- ✅ Permission Service كامل
- ✅ Role Manager لإدارة الأدوار
- ✅ Middleware للتحقق (8 functions)
- ✅ تكامل مع Features System
- ✅ Admin Panel كامل (4 معالجات)
- ✅ تحميل تلقائي للمستخدمين

**جاهز للاستخدام:** 🚀

---

## 🎯 Admin Panel - التفاصيل الكاملة

### 1️⃣ قائمة المستخدمين (`users-list.ts`)

**المميزات:**
- ✅ عرض مُقسم لصفحات (5 مستخدمين/صفحة)
- ✅ فلترة حسب الدور (مديرين، مستخدمين)
- ✅ فلترة حسب الحالة (نشطين، محظورين)
- ✅ عرض تفاصيل كامل لكل مستخدم
- ✅ تاريخ تغيير الأدوار (آخر 3 تغييرات)
- ✅ أزرار سريعة للإجراءات (تغيير دور، حظر)

**التدفق:**
```
قائمة المستخدمين → اختر مستخدم → عرض التفاصيل → [تغيير الدور | حظر]
```

---

### 2️⃣ تغيير الأدوار (`change-role.ts`)

**المميزات:**
- ✅ اختيار مستخدم من قائمة
- ✅ عرض الدور الحالي
- ✅ اختيار الدور الجديد (مع فحص الصلاحيات)
- ✅ إدخال سبب التغيير (اختياري)
- ✅ تأكيد قبل التنفيذ
- ✅ تسجيل تلقائي في `RoleChange` table

**الحماية:**
- 🔒 فقط دور أعلى يمكنه تغيير دور أقل
- 🔒 لا يمكن تعيين دور أعلى من دورك
- 🔒 الأدوار غير المسموحة تظهر مع 🔒

**التدفق:**
```
تغيير الأدوار → اختر مستخدم → اختر دور جديد → [أدخل سبب] → تأكيد → ✅
```

---

### 3️⃣ حظر المستخدمين (`ban-user.ts`)

**المميزات:**
- ✅ حظر مستخدم جديد
- ✅ إلغاء حظر مستخدم محظور
- ✅ عرض قائمة المحظورين
- ✅ 4 أسباب جاهزة + سبب مخصص
- ✅ حفظ سبب الحظر وتاريخه

**الأسباب الجاهزة:**
1. انتهاك شروط الاستخدام
2. سلوك غير لائق
3. استخدام خاطئ للبوت
4. إرسال رسائل مزعجة

**التدفق:**
```
حظر مستخدم → اختر [حظر | إلغاء حظر | قائمة المحظورين]
→ اختر مستخدم → [اختر سبب] → تأكيد → ✅
```

---

### 4️⃣ الإحصائيات (`index.ts`)

**المميزات:**
- ✅ إجمالي المستخدمين
- ✅ النشطون / غير النشطين
- ✅ المحظورون
- ✅ توزيع الأدوار (مديرين، مستخدمين، زوار)
- ✅ زر تحديث

---

## 📊 الإحصائيات

**الكود المُضاف:**
- 3 ملفات handlers جديدة
- ~800 سطر كود
- 15+ معالج callback
- 10+ helper functions

**الوقت المُستغرق:** ~3 ساعات

---

**المرجع الكامل:** `src/modules/permissions/`
**Admin Panel:** `src/bot/features/admin-panel/`
**المعالجات:** `src/bot/features/admin-panel/handlers/`
