# 📘 دليل إنشاء الأقسام والأقسام الفرعية - Feature Creation Guide

## 📑 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية الأساسية](#البنية-الأساسية)
3. [إنشاء قسم جديد من الصفر](#إنشاء-قسم-جديد-من-الصفر)
4. [إضافة أقسام فرعية](#إضافة-أقسام-فرعية)
5. [معالجات التدفقات (Handlers)](#معالجات-التدفقات-handlers)
6. [الصلاحيات والتحكم](#الصلاحيات-والتحكم)
7. [أمثلة عملية](#أمثلة-عملية)
8. [أفضل الممارسات](#أفضل-الممارسات)
9. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🎯 نظرة عامة

### ما هو القسم (Feature)?
**القسم** هو مجموعة وظائف مترابطة تظهر في القائمة الرئيسية للبوت.

**مثال:** قسم الموارد البشرية، قسم المالية، قسم المبيعات.

### ما هو القسم الفرعي (Sub-Feature)?
**القسم الفرعي** هو وظيفة محددة داخل قسم رئيسي.

**مثال:** داخل قسم الموارد البشرية:
- قائمة الموظفين (sub-feature)
- الحضور والغياب (sub-feature)
- الإجازات (sub-feature)

---

## 🏗️ البنية الأساسية

### 📁 هيكل المجلدات

```
src/bot/features/
└── your-feature-name/          ← اسم القسم
    ├── config.ts               ← تكوين القسم (إجباري)
    ├── index.ts                ← نقطة الدخول (إجباري)
    ├── handlers/               ← معالجات التدفقات (اختياري)
    │   ├── subfeature1.ts
    │   ├── subfeature2.ts
    │   └── subfeature3.ts
    └── utils/                  ← وظائف مساعدة (اختياري)
        └── helpers.ts
```

### 📝 الملفات الإجبارية

| الملف | الغرض | إجباري؟ |
|-------|-------|---------|
| `config.ts` | تكوين القسم والأقسام الفرعية | ✅ نعم |
| `index.ts` | تصدير config و composer | ✅ نعم |
| `handlers/` | معالجات التدفقات التفاعلية | ⚠️ حسب الحاجة |

---

## 🚀 إنشاء قسم جديد من الصفر

### الخطوة 1: إنشاء المجلد

```bash
mkdir src/bot/features/hr-department
cd src/bot/features/hr-department
```

أو يدوياً عبر المتصفح:
```
src/bot/features/hr-department/
```

---

### الخطوة 2: إنشاء ملف `config.ts`

هذا الملف يحدد **كل شيء** عن القسم:

```typescript
/**
 * HR Department Feature Configuration
 *
 * قسم الموارد البشرية - إدارة الموظفين والحضور والإجازات
 */

import type { FeatureConfig } from '../registry/types.js'

export const hrDepartmentConfig: FeatureConfig = {
  // ═══════════════════════════════════════
  // المعرف الفريد (ID)
  // ═══════════════════════════════════════
  // ⚠️ يجب أن يكون فريداً في كل البوت
  // ✅ استخدم kebab-case (أحرف صغيرة وشرطات)
  id: 'hr-department',

  // ═══════════════════════════════════════
  // الاسم المعروض
  // ═══════════════════════════════════════
  // يظهر في القائمة الرئيسية
  name: 'الموارد البشرية',

  // ═══════════════════════════════════════
  // الأيقونة (اختياري)
  // ═══════════════════════════════════════
  // استخدم emoji مناسب
  icon: '👥',

  // ═══════════════════════════════════════
  // الوصف (اختياري)
  // ═══════════════════════════════════════
  // يظهر عند فتح القسم
  description: 'إدارة الموظفين، الحضور والغياب، الإجازات، والرواتب',

  // ═══════════════════════════════════════
  // التفعيل
  // ═══════════════════════════════════════
  // true = القسم يظهر | false = القسم مخفي
  enabled: true,

  // ═══════════════════════════════════════
  // الترتيب (اختياري)
  // ═══════════════════════════════════════
  // رقم أقل = يظهر أولاً
  // 1 = أول قسم، 99 = آخر قسم
  order: 2,

  // ═══════════════════════════════════════
  // الصلاحيات (اختياري)
  // ═══════════════════════════════════════
  // إذا لم تُحدد، الجميع يمكنه الوصول
  // القيم المتاحة: 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'GUEST'
  permissions: ['SUPER_ADMIN', 'ADMIN'],

  // ═══════════════════════════════════════
  // التصنيف (اختياري)
  // ═══════════════════════════════════════
  category: 'management',

  // ═══════════════════════════════════════
  // الأقسام الفرعية
  // ═══════════════════════════════════════
  subFeatures: [
    {
      id: 'employees-list',
      name: 'قائمة الموظفين',
      icon: '📋',
      description: 'عرض وإدارة بيانات الموظفين',
      handler: 'employeesListHandler',
      enabled: true,
      order: 1,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'attendance',
      name: 'الحضور والغياب',
      icon: '⏰',
      description: 'تسجيل ومتابعة حضور الموظفين',
      handler: 'attendanceHandler',
      enabled: true,
      order: 2,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'vacations',
      name: 'الإجازات',
      icon: '🏖️',
      description: 'طلب وإدارة الإجازات',
      handler: 'vacationsHandler',
      enabled: true,
      order: 3,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'salaries',
      name: 'الرواتب',
      icon: '💰',
      description: 'إدارة رواتب الموظفين',
      handler: 'salariesHandler',
      enabled: true,
      order: 4,
      permissions: ['SUPER_ADMIN'], // فقط المدير الأعلى
    },
  ],
}
```

---

### الخطوة 3: إنشاء ملف `index.ts`

هذا الملف يربط كل شيء معاً:

```typescript
/**
 * HR Department Module
 *
 * نقطة الدخول لقسم الموارد البشرية
 */

import type { Context } from '../../context.js'
import { Composer } from 'grammy'
import { hrDepartmentConfig } from './config.js'

import { attendanceHandler } from './handlers/attendance.js'
// استيراد المعالجات (إذا كانت موجودة)
import { employeesListHandler } from './handlers/employees-list.js'
import { salariesHandler } from './handlers/salaries.js'
import { vacationsHandler } from './handlers/vacations.js'

// ═══════════════════════════════════════
// Composer - يجمع كل معالجات القسم
// ═══════════════════════════════════════
export const composer = new Composer<Context>()

// ═══════════════════════════════════════
// تسجيل جميع المعالجات
// ═══════════════════════════════════════
composer.use(employeesListHandler)
composer.use(attendanceHandler)
composer.use(vacationsHandler)
composer.use(salariesHandler)

// ═══════════════════════════════════════
// تصدير التكوين (إجباري للاكتشاف التلقائي)
// ═══════════════════════════════════════
export { hrDepartmentConfig as config }

// ═══════════════════════════════════════
// دالة التهيئة (اختياري)
// ═══════════════════════════════════════
// تُستدعى مرة واحدة عند تحميل القسم
export async function init() {
  console.log('✅ HR Department initialized')

  // يمكنك هنا:
  // - تحميل البيانات من قاعدة البيانات
  // - إعداد اتصالات
  // - جدولة مهام
}

// ═══════════════════════════════════════
// دالة التنظيف (اختياري)
// ═══════════════════════════════════════
// تُستدعى عند إغلاق البوت
export async function cleanup() {
  console.log('🔄 HR Department cleaned up')

  // يمكنك هنا:
  // - حفظ البيانات
  // - إغلاق الاتصالات
  // - إلغاء المهام المجدولة
}
```

---

### الخطوة 4: إنشاء المعالجات (Handlers)

أنشئ مجلد `handlers` وملف لكل قسم فرعي:

#### 📄 `handlers/employees-list.ts`

```typescript
/**
 * Employees List Handler
 * معالج قائمة الموظفين
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const employeesListHandler = new Composer<Context>()

/**
 * معالج القسم الفرعي الرئيسي
 * Pattern: menu:sub:FEATURE_ID:SUBFEATURE_ID
 */
employeesListHandler.callbackQuery(
  /^menu:sub:hr-department:employees-list$/,
  async (ctx) => {
    try {
      await ctx.answerCallbackQuery()

      // هنا تضع منطق التدفق الخاص بك
      // مثال: جلب قائمة الموظفين من قاعدة البيانات

      const keyboard = new InlineKeyboard()
        .text('➕ إضافة موظف', 'hr:emp:add')
        .row()
        .text('🔍 البحث عن موظف', 'hr:emp:search')
        .row()
        .text('📊 إحصائيات', 'hr:emp:stats')
        .row()
        .text('⬅️ رجوع', 'menu:feature:hr-department')

      await ctx.editMessageText(
        '📋 **قائمة الموظفين**\n\n'
        + '**إجمالي الموظفين:** 45\n'
        + '**الموظفون النشطون:** 42\n'
        + '**في إجازة:** 3\n\n'
        + 'اختر العملية المطلوبة:',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      )
    }
    catch (error) {
      console.error('Error in employees list:', error)
      await ctx.answerCallbackQuery('حدث خطأ')
    }
  }
)

/**
 * معالج إضافة موظف
 */
employeesListHandler.callbackQuery('hr:emp:add', async (ctx) => {
  await ctx.answerCallbackQuery('جاري فتح نموذج إضافة موظف...')

  await ctx.editMessageText(
    '➕ **إضافة موظف جديد**\n\n'
    + 'الرجاء إرسال اسم الموظف الكامل:',
    { parse_mode: 'Markdown' }
  )

  // هنا يمكنك استخدام:
  // - Conversations plugin للمحادثات التفاعلية
  // - Form Builder للنماذج
  // - Multi-Step Forms للنماذج متعددة الخطوات
})

/**
 * معالج البحث
 */
employeesListHandler.callbackQuery('hr:emp:search', async (ctx) => {
  await ctx.answerCallbackQuery('جاري فتح نموذج البحث...')

  await ctx.editMessageText(
    '🔍 **البحث عن موظف**\n\n'
    + 'أرسل اسم الموظف أو رقمه:',
    { parse_mode: 'Markdown' }
  )
})

/**
 * معالج الإحصائيات
 */
employeesListHandler.callbackQuery('hr:emp:stats', async (ctx) => {
  await ctx.answerCallbackQuery()

  // استخدم Data Tables Module لعرض الإحصائيات
  await ctx.editMessageText(
    '📊 **إحصائيات الموظفين**\n\n'
    + '**حسب القسم:**\n'
    + '• IT: 15 موظف\n'
    + '• المبيعات: 12 موظف\n'
    + '• الإدارة: 8 موظفين\n'
    + '• المالية: 10 موظفين\n\n'
    + '**حسب الحالة:**\n'
    + '• نشط: 42\n'
    + '• إجازة: 3\n',
    { parse_mode: 'Markdown' }
  )
})
```

#### 📄 `handlers/attendance.ts`

```typescript
/**
 * Attendance Handler
 * معالج الحضور والغياب
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const attendanceHandler = new Composer<Context>()

employeesListHandler.callbackQuery(
  /^menu:sub:hr-department:attendance$/,
  async (ctx) => {
    try {
      await ctx.answerCallbackQuery()

      const keyboard = new InlineKeyboard()
        .text('✅ تسجيل حضور', 'hr:att:checkin')
        .text('❌ تسجيل انصراف', 'hr:att:checkout')
        .row()
        .text('📊 تقرير اليوم', 'hr:att:today')
        .row()
        .text('📅 تقرير الشهر', 'hr:att:month')
        .row()
        .text('⬅️ رجوع', 'menu:feature:hr-department')

      await ctx.editMessageText(
        `⏰ **الحضور والغياب**\n\n`
        + `**التاريخ:** ${new Date().toLocaleDateString('ar-EG')}\n`
        + `**الحاضرون اليوم:** 38/45\n`
        + `**نسبة الحضور:** 84%\n\n`
        + `اختر العملية المطلوبة:`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      )
    }
    catch (error) {
      console.error('Error in attendance:', error)
      await ctx.answerCallbackQuery('حدث خطأ')
    }
  }
)

// معالجات إضافية...
employeesListHandler.callbackQuery('hr:att:checkin', async (ctx) => {
  await ctx.answerCallbackQuery('✅ تم تسجيل الحضور')
  // منطق تسجيل الحضور
})
```

#### 📄 `handlers/vacations.ts`

```typescript
/**
 * Vacations Handler
 * معالج الإجازات
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const vacationsHandler = new Composer<Context>()

vacationsHandler.callbackQuery(
  /^menu:sub:hr-department:vacations$/,
  async (ctx) => {
    try {
      await ctx.answerCallbackQuery()

      const keyboard = new InlineKeyboard()
        .text('📝 طلب إجازة جديد', 'hr:vac:request')
        .row()
        .text('📋 طلباتي', 'hr:vac:my-requests')
        .row()
        .text('✅ الموافقة على الطلبات', 'hr:vac:approve')
        .row()
        .text('⬅️ رجوع', 'menu:feature:hr-department')

      await ctx.editMessageText(
        '🏖️ **إدارة الإجازات**\n\n'
        + '**رصيدك المتاح:** 15 يوم\n'
        + '**المُستهلك:** 5 أيام\n'
        + '**الطلبات المعلقة:** 2\n\n'
        + 'اختر العملية المطلوبة:',
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      )
    }
    catch (error) {
      console.error('Error in vacations:', error)
      await ctx.answerCallbackQuery('حدث خطأ')
    }
  }
)

// معالجات إضافية...
```

#### 📄 `handlers/salaries.ts`

```typescript
/**
 * Salaries Handler
 * معالج الرواتب
 */

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const salariesHandler = new Composer<Context>()

salariesHandler.callbackQuery(
  /^menu:sub:hr-department:salaries$/,
  async (ctx) => {
    try {
      await ctx.answerCallbackQuery()

      // التحقق من الصلاحيات
      if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
        await ctx.answerCallbackQuery('⛔ ليس لديك صلاحية الوصول', { show_alert: true })
        return
      }

      const keyboard = new InlineKeyboard()
        .text('💰 رواتب هذا الشهر', 'hr:sal:current')
        .row()
        .text('📊 تقرير الرواتب', 'hr:sal:report')
        .row()
        .text('⚙️ إعدادات الرواتب', 'hr:sal:settings')
        .row()
        .text('⬅️ رجوع', 'menu:feature:hr-department')

      await ctx.editMessageText(
        `💰 **إدارة الرواتب**\n\n`
        + `**الشهر الحالي:** ${new Date().toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}\n`
        + `**إجمالي الرواتب:** 450,000 ج.م\n`
        + `**تم الصرف:** 420,000 ج.م\n`
        + `**المتبقي:** 30,000 ج.م\n\n`
        + `اختر العملية المطلوبة:`,
        {
          parse_mode: 'Markdown',
          reply_markup: keyboard,
        }
      )
    }
    catch (error) {
      console.error('Error in salaries:', error)
      await ctx.answerCallbackQuery('حدث خطأ')
    }
  }
)

// معالجات إضافية...
```

---

### الخطوة 5: اختبار القسم الجديد

#### 1. أعد تشغيل البوت

```bash
npm run dev
```

#### 2. راقب اللوج

يجب أن ترى:

```
[INFO] Feature loaded: الموارد البشرية
  id: "hr-department"
  enabled: true

[INFO] Registered composer for: hr-department

[INFO] Features loaded
  loaded: 3
  failed: 0
  features: ["settings", "test-feature", "hr-department"]
```

#### 3. افتح البوت

1. اضغط على زر **"📋 القائمة الرئيسية"**
2. يجب أن يظهر **"👥 الموارد البشرية"**
3. اضغط عليه لرؤية الأقسام الفرعية

---

## 🎛️ الصلاحيات والتحكم

### أنواع الصلاحيات

```typescript
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'GUEST'
```

| الصلاحية | الوصف | الاستخدام |
|----------|-------|-----------|
| `SUPER_ADMIN` | المدير الأعلى | كامل الصلاحيات |
| `ADMIN` | مدير | معظم الصلاحيات |
| `EMPLOYEE` | موظف | صلاحيات محدودة |
| `GUEST` | ضيف | صلاحيات قراءة فقط |

### أمثلة الصلاحيات

#### 1. قسم متاح للجميع

```typescript
permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'GUEST'],
// أو
permissions: [], // فارغ = الجميع
// أو
// لا تُحدد permissions أصلاً
```

#### 2. قسم للإداريين فقط

```typescript
permissions: ['SUPER_ADMIN', 'ADMIN'],
```

#### 3. صلاحيات مختلفة للأقسام الفرعية

```typescript
subFeatures: [
  {
    id: 'view-reports',
    name: 'عرض التقارير',
    permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'], // الجميع
  },
  {
    id: 'edit-reports',
    name: 'تعديل التقارير',
    permissions: ['SUPER_ADMIN', 'ADMIN'], // الإداريون فقط
  },
  {
    id: 'delete-reports',
    name: 'حذف التقارير',
    permissions: ['SUPER_ADMIN'], // المدير الأعلى فقط
  },
]
```

---

## 🎨 أمثلة عملية

### مثال 1: قسم المبيعات

```typescript
export const salesConfig: FeatureConfig = {
  id: 'sales',
  name: 'المبيعات',
  icon: '💼',
  enabled: true,
  order: 3,
  permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE'],
  subFeatures: [
    {
      id: 'new-sale',
      name: 'بيع جديد',
      icon: '➕',
      handler: 'newSaleHandler',
      enabled: true,
    },
    {
      id: 'sales-list',
      name: 'قائمة المبيعات',
      icon: '📋',
      handler: 'salesListHandler',
      enabled: true,
    },
    {
      id: 'sales-report',
      name: 'تقرير المبيعات',
      icon: '📊',
      handler: 'salesReportHandler',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
  ],
}
```

### مثال 2: قسم المخزون

```typescript
export const inventoryConfig: FeatureConfig = {
  id: 'inventory',
  name: 'المخزون',
  icon: '📦',
  enabled: true,
  order: 4,
  subFeatures: [
    {
      id: 'products-list',
      name: 'قائمة المنتجات',
      icon: '📝',
      handler: 'productsListHandler',
      enabled: true,
    },
    {
      id: 'add-product',
      name: 'إضافة منتج',
      icon: '➕',
      handler: 'addProductHandler',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'stock-alerts',
      name: 'تنبيهات المخزون',
      icon: '⚠️',
      handler: 'stockAlertsHandler',
      enabled: true,
    },
  ],
}
```

### مثال 3: قسم التقارير

```typescript
export const reportsConfig: FeatureConfig = {
  id: 'reports',
  name: 'التقارير',
  icon: '📊',
  enabled: true,
  order: 5,
  permissions: ['SUPER_ADMIN', 'ADMIN'],
  subFeatures: [
    {
      id: 'daily-report',
      name: 'تقرير يومي',
      icon: '📅',
      handler: 'dailyReportHandler',
      enabled: true,
    },
    {
      id: 'monthly-report',
      name: 'تقرير شهري',
      icon: '📆',
      handler: 'monthlyReportHandler',
      enabled: true,
    },
    {
      id: 'custom-report',
      name: 'تقرير مخصص',
      icon: '⚙️',
      handler: 'customReportHandler',
      enabled: true,
      permissions: ['SUPER_ADMIN'],
    },
  ],
}
```

---

## ✅ أفضل الممارسات

### 1. التسمية

✅ **جيد:**
```typescript
id: 'hr-department' // kebab-case
id: 'sales-reports'
id: 'inventory-management'
```

❌ **سيء:**
```typescript
id: 'HR Department' // مسافات
id: 'sales_reports' // underscores
id: 'InventoryManagement' // PascalCase
```

### 2. الترتيب المنطقي

```typescript
// رتب الأقسام حسب الأهمية
{ id: 'dashboard', order: 1 }      // الأهم
{ id: 'hr-department', order: 2 }
{ id: 'sales', order: 3 }
{ id: 'reports', order: 4 }
{ id: 'settings', order: 99 }      // الأقل
```

### 3. الأيقونات المناسبة

```typescript
// استخدم emojis واضحة ومعبرة
icon: '👥' // للموارد البشرية
icon: '💼' // للمبيعات
icon: '📦' // للمخزون
icon: '💰' // للمالية
icon: '⚙️' // للإعدادات
```

### 4. الوصف الواضح

```typescript
description: 'إدارة الموظفين، الحضور والغياب، الإجازات، والرواتب'
// ✅ واضح ومحدد

description: 'قسم الموارد البشرية'
// ⚠️ غير كافٍ
```

### 5. معالجة الأخطاء

```typescript
try {
  // منطق التدفق
}
catch (error) {
  console.error('Error:', error)
  await ctx.answerCallbackQuery('حدث خطأ. حاول مرة أخرى.')
}
```

### 6. التحقق من الصلاحيات

```typescript
// في المعالج
if (ctx.dbUser?.role !== 'SUPER_ADMIN') {
  await ctx.answerCallbackQuery(
    '⛔ ليس لديك صلاحية الوصول',
    { show_alert: true }
  )
}
```

### 7. زر الرجوع دائماً

```typescript
const keyboard = new InlineKeyboard()
  .text('خيار 1', 'action1')
  .text('خيار 2', 'action2')
  .row()
  .text('⬅️ رجوع', 'menu:feature:your-feature-id') // ✅ دائماً
```

---

## 🐛 استكشاف الأخطاء

### المشكلة 1: القسم لا يظهر في القائمة

**الأسباب المحتملة:**

1. ✅ تحقق من `enabled: true`
2. ✅ تحقق من الصلاحيات `permissions`
3. ✅ تحقق من اسم المجلد
4. ✅ تحقق من وجود `index.ts`
5. ✅ تحقق من تصدير `config`

**الحل:**

```typescript
// config.ts
export const myConfig: FeatureConfig = {
  enabled: true, // ✅
  // ...
}

// index.ts
export { myConfig as config } // ✅
```

---

### المشكلة 2: خطأ "Feature already registered"

**السبب:** استخدام نفس الـ `id` في أكثر من قسم.

**الحل:**

```typescript
// feature1/config.ts
id: 'feature-one',  // ✅ فريد

// feature2/config.ts
id: 'feature-two',  // ✅ فريد مختلف
```

---

### المشكلة 3: المعالج لا يعمل

**الأسباب:**

1. ❌ Pattern خاطئ في `callbackQuery`
2. ❌ المعالج غير مُسجل في `index.ts`
3. ❌ خطأ في الكود

**الحل:**

```typescript
// 1. Pattern صحيح
employeesListHandler.callbackQuery(
  /^menu:sub:hr-department:employees-list$/,
  //      ^^^^^^ ^^^^^^^^^^^^^ ^^^^^^^^^^^^^^
  //      fixed  feature-id    subfeature-id
  async (ctx) => { /* ... */ }
)

// 2. تسجيل في index.ts
composer.use(employeesListHandler) // ✅

// 3. تحقق من الأخطاء في console
```

---

### المشكلة 4: لا يظهر للمستخدم

**السبب:** الصلاحيات.

**الحل:**

```typescript
// للاختبار، افتح للجميع
permissions: [],  // أو لا تُحدد

// أو أضف جميع الأدوار
permissions: ['SUPER_ADMIN', 'ADMIN', 'EMPLOYEE', 'GUEST'],
```

---

## 📚 موارد إضافية

### الوثائق ذات الصلة
- [Feature Auto-Discovery System](./FEATURE-SYSTEM-SUMMARY.md)
- [Interactive Flows Guide](./INTERACTIVE-FLOWS-GUIDE.md)
- [Form Builder Module](./FORM-BUILDER-MODULE.md)
- [Multi-Step Forms](./MULTI-STEP-FORMS-MODULE.md)
- [Data Tables](./DATA-TABLES-MODULE.md)

### أمثلة جاهزة
- `src/bot/features/test-feature/` - قسم تجريبي كامل
- `src/bot/features/settings/` - قسم إعدادات بسيط

---

## 🎓 ملخص سريع

### ✅ خطوات إنشاء قسم جديد:

1. أنشئ مجلد في `src/bot/features/your-feature/`
2. أنشئ `config.ts` مع `FeatureConfig` كامل
3. أنشئ `index.ts` مع `composer` و `export { config }`
4. أنشئ `handlers/` لكل قسم فرعي
5. سجل المعالجات في `index.ts`
6. أعد تشغيل البوت

### ✅ النقاط الأساسية:

- ✅ `id` فريد لكل قسم
- ✅ `enabled: true` للتفعيل
- ✅ `permissions` حسب الحاجة
- ✅ Pattern صحيح: `menu:sub:FEATURE_ID:SUBFEATURE_ID`
- ✅ معالجة الأخطاء دائماً
- ✅ زر رجوع في كل شاشة

---

## 🚀 جاهز للإنشاء!

**الآن لديك كل ما تحتاجه لإنشاء أقسام احترافية! 🎉**

ابدأ بقسم بسيط، ثم أضف المزيد من الميزات تدريجياً.

**حظاً موفقاً! 💪**
