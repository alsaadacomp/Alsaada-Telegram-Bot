# 📚 API Reference - نظرة عامة

## مرحباً بك في دليل API الشامل

هذا الدليل يوثق جميع الـ APIs والخدمات المتاحة في القالب بشكل تفصيلي ودقيق.

---

## 📋 المحتويات

### الوحدات الأساسية (Core Modules)
1. [Notification Service](./03_Modules/01_Notifications.md) - نظام الإشعارات الكامل
2. [Form Builder](./03_Modules/02_Forms.md) - بناء النماذج التفاعلية
3. [Data Tables](./03_Modules/03_DataTables.md) - جداول البيانات
4. [Permission System](./03_Modules/04_Permissions.md) - نظام الصلاحيات
5. [Database Service](./03_Modules/05_Database.md) - خدمات قاعدة البيانات
6. [Security Service](./03_Modules/06_Security.md) - الأمان والتشفير
7. [Analytics Service](./03_Modules/07_Analytics.md) - التحليلات والإحصائيات
8. [File Management](./03_Modules/08_FileManagement.md) - إدارة الملفات
9. [Barcode Scanner](./03_Modules/09_BarcodeScanner.md) - مسح الباركود

### الوظائف الأساسية (Core Functions)
- [Context Extensions](./02_Core_Functions.md#context-extensions)
- [Validators](./02_Core_Functions.md#validators)
- [Formatters](./02_Core_Functions.md#formatters)
- [Utilities](./02_Core_Functions.md#utilities)

### أنواع البيانات (Type Definitions)
- [Type Reference](./04_Type_Definitions.md)

---

## 🎯 كيف تستخدم هذا الدليل؟

### للمبتدئين:
1. ابدأ بقراءة [نظرة عامة](#نظرة-عامة) أدناه
2. اطلع على [أمثلة سريعة](#أمثلة-سريعة)
3. اقرأ توثيق الوحدة التي تريد استخدامها

### للمحترفين:
- استخدم البحث للوصول السريع
- راجع [Type Definitions](./04_Type_Definitions.md) للأنواع الكاملة
- اطلع على الأمثلة المتقدمة في كل وحدة

---

## 🌟 نظرة عامة

### هيكل الـ API

جميع الخدمات في المشروع منظمة في `src/modules/`:

```
src/modules/
├── notifications/      # نظام الإشعارات
├── interaction/        # النماذج والتفاعلات
├── permissions/        # نظام الصلاحيات
├── database/           # قاعدة البيانات
├── security/           # الأمان
├── analytics/          # التحليلات
├── services/           # خدمات مساعدة
└── settings/           # إدارة الإعدادات
```

### مبادئ التصميم

#### 1. Fluent API (سهل الاستخدام)
جميع الـ APIs مصممة لتكون سهلة القراءة والاستخدام:

```typescript
// ❌ طريقة معقدة
const notification = new Notification()
notification.setMessage('مرحباً')
notification.setType('info')
notification.setTarget({ audience: 'all_users' })
await notificationService.send(notification)

// ✅ طريقة سهلة (Fluent API)
await notificationService
  .sendToAllUsers({
    message: 'مرحباً',
    type: 'info'
  })
```

#### 2. Type Safety (أمان الأنواع)
جميع الوظائف مكتوبة بـ TypeScript مع أنواع واضحة:

```typescript
// TypeScript يساعدك بالـ Auto-complete
await notificationService.sendToUsers(
  [1, 2, 3],           // userIds: number[]
  {
    message: string,    // مطلوب
    type: NotificationType,  // info | success | warning...
    priority: NotificationPriority  // اختياري
  }
)
```

#### 3. Error Handling (معالجة الأخطاء)
جميع الوظائف ترجع نتائج واضحة:

```typescript
const result = await notificationService.sendToAllUsers({...})

if (result.success) {
  console.log(`تم الإرسال لـ ${result.sentCount} مستخدم`)
} else {
  console.log(`فشل الإرسال لـ ${result.failedCount} مستخدم`)
  console.log('الأخطاء:', result.errors)
}
```

---

## ⚡ أمثلة سريعة

### مثال 1: إرسال إشعار بسيط

```typescript
import { notificationService } from '#root/modules/notifications'

// إرسال لجميع المستخدمين
await notificationService.sendToAllUsers({
  message: '🎉 لدينا ميزة جديدة!',
  type: 'announcement',
  priority: 'important'
})
```

### مثال 2: بناء نموذج

```typescript
import { FormBuilder } from '#root/modules/interaction/forms'

const form = new FormBuilder('register', 'نموذج التسجيل')
  .addTextField('name', 'الاسم الكامل', { required: true })
  .addEmailField('email', 'البريد الإلكتروني', { required: true })
  .addPhoneField('phone', 'رقم الهاتف', { required: true })
  .onSubmit(async (data) => {
    // حفظ البيانات
    return { success: true }
  })
  .build()

// استخدام النموذج
const isValid = form.validate()
if (isValid) {
  const result = await form.submit()
}
```

### مثال 3: التحقق من الصلاحيات

```typescript
import { permissionService } from '#root/modules/permissions'

// التحقق من صلاحية المستخدم
const canEdit = await permissionService.hasPermission(
  userId,
  'users.edit'
)

if (canEdit) {
  // السماح بالتعديل
}
```

### مثال 4: التشفير

```typescript
import { encryptionService } from '#root/modules/services/security'

// تشفير بيانات حساسة
const encrypted = encryptionService.encrypt('01234567890')
// النتيجة: "iv:encrypted:authTag"

// فك التشفير
const decrypted = encryptionService.decrypt(encrypted)
// النتيجة: "01234567890"
```

---

## 🎨 أنماط الاستخدام الشائعة

### Pattern 1: Service Singleton

معظم الخدمات متاحة كـ Singleton:

```typescript
// ✅ استخدم الـ Instance الموجود
import { notificationService } from '#root/modules/notifications'

// ❌ لا تنشئ instance جديد
// const service = new NotificationService() // خطأ!
```

### Pattern 2: Builder Pattern

للكائنات المعقدة، استخدم Builder Pattern:

```typescript
const form = new FormBuilder('id', 'title')
  .addField(...)
  .addField(...)
  .onSubmit(...)
  .build()
```

### Pattern 3: Result Objects

جميع العمليات المهمة ترجع Result Object:

```typescript
interface SendResult {
  success: boolean
  sentCount: number
  failedCount: number
  failedUserIds: number[]
  errors: Error[]
}
```

### Pattern 4: Async/Await

جميع عمليات قاعدة البيانات والشبكة async:

```typescript
// ✅ دائماً استخدم await
const result = await notificationService.send(...)

// ❌ لا تنسى await
const result = notificationService.send(...) // Promise<SendResult>
```

---

## 📦 التثبيت والاستيراد

### كيف تستورد الخدمات؟

```typescript
// الطريقة المفضلة: استخدام الـ alias
import { notificationService } from '#root/modules/notifications'
import { FormBuilder } from '#root/modules/interaction/forms'
import { permissionService } from '#root/modules/permissions'

// الطريقة البديلة: المسار الكامل
import { notificationService } from '../../modules/notifications'
```

### الخدمات المتاحة مباشرة:

```typescript
// Notifications
import { notificationService } from '#root/modules/notifications'
import { templateManagementService } from '#root/modules/notifications'
import { smartVariableService } from '#root/modules/notifications'

// Forms
import { FormBuilder } from '#root/modules/interaction/forms'
import { TelegramFormHandler } from '#root/modules/interaction/forms/handlers'

// Permissions
import { permissionService } from '#root/modules/permissions'
import { roleManager } from '#root/modules/permissions'

// Security
import { encryptionService } from '#root/modules/services/security'
import { securityService } from '#root/modules/services/security'

// Database
import { Database } from '#root/modules/database'
import { cacheService } from '#root/modules/database/cache'

// Analytics
import { analyticsService } from '#root/modules/analytics'

// Settings
import { settingsManager } from '#root/modules/settings'
```

---

## 🔍 الاصطلاحات والمعايير

### تسمية الوظائف

```typescript
// ✅ أفعال واضحة
sendNotification()
createUser()
updateProfile()
deleteItem()
getUsers()
hasPermission()

// ❌ أسماء غامضة
notification()
user()
profile()
item()
```

### معايير البارامترات

```typescript
// الترتيب المعتاد:
function operation(
  id: number,              // 1. المعرف
  data: DataType,          // 2. البيانات
  options?: OptionsType    // 3. الخيارات (اختياري)
): Promise<Result>
```

### معايير القيم المرجعة

```typescript
// للعمليات البسيطة
Promise<boolean>
Promise<Data | null>

// للعمليات المعقدة
Promise<{
  success: boolean
  data?: any
  error?: string
  metadata?: any
}>
```

---

## ⚙️ الإعدادات العامة

بعض الخدمات تحتاج إعدادات في `.env`:

```env
# Database
DATABASE_URL="file:./dev.db"

# Bot
BOT_TOKEN="your-bot-token"

# Encryption (32 bytes hex)
ENCRYPTION_KEY="64 hex characters"

# Cache (اختياري)
REDIS_URL="redis://localhost:6379"

# Notifications
NOTIFICATIONS_ENABLED=true
DEFAULT_NOTIFICATION_PRIORITY=normal
```

---

## 🐛 التعامل مع الأخطاء

### الأخطاء الشائعة:

```typescript
// 1. عدم استخدام await
// ❌ خطأ
const result = notificationService.send(...)
if (result.success) { ... }  // result هو Promise!

// ✅ صحيح
const result = await notificationService.send(...)
if (result.success) { ... }

// 2. عدم معالجة الأخطاء
// ❌ خطأ
await notificationService.send(...)

// ✅ صحيح
try {
  const result = await notificationService.send(...)
  if (!result.success) {
    console.error('Errors:', result.errors)
  }
} catch (error) {
  console.error('Fatal error:', error)
}

// 3. استخدام services قبل التهيئة
// ❌ خطأ - في أول ملف يتم تنفيذه
import { Database } from '#root/modules/database'
const users = await Database.prisma.user.findMany()

// ✅ صحيح - في handler أو function
async function getUsers() {
  const { Database } = await import('#root/modules/database')
  return await Database.prisma.user.findMany()
}
```

---

## 📈 الأداء والتحسين

### نصائح للأداء:

#### 1. استخدم Batch Operations
```typescript
// ❌ بطيء - loop
for (const userId of userIds) {
  await notificationService.sendToUsers([userId], config)
}

// ✅ سريع - batch
await notificationService.sendToUsers(userIds, config, {
  batchSize: 50,
  delayBetweenBatches: 1000
})
```

#### 2. استخدم Cache
```typescript
// ❌ بطيء - كل مرة من Database
const user = await Database.prisma.user.findUnique({ where: { id } })

// ✅ سريع - مع Cache
const cached = await cacheService.get(`user:${id}`)
if (cached) return cached

const user = await Database.prisma.user.findUnique({ where: { id } })
await cacheService.set(`user:${id}`, user, { ttl: 300 })
```

#### 3. استخدم Select للحقول المطلوبة فقط
```typescript
// ❌ بطيء - جلب جميع الحقول
const users = await Database.prisma.user.findMany()

// ✅ سريع - جلب الحقول المطلوبة فقط
const users = await Database.prisma.user.findMany({
  select: { id: true, fullName: true }
})
```

---

## 🔗 روابط مهمة

### داخلية:
- [دليل المطور الكامل](../10_دليل_المطور/01_الهيكل_والهندسة.md)
- [Database Schema](../25_Database/01_Schema_Overview.md)
- [أمثلة عملية](../50_HowTo/)

### خارجية:
- [Grammy Documentation](https://grammy.dev)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 💡 ملاحظات مهمة

### ✅ افعل:
- استخدم TypeScript للـ type safety
- استخدم async/await للعمليات غير المتزامنة
- تحقق من النتائج دائماً
- استخدم try/catch للأخطاء الحرجة
- اقرأ التوثيق قبل الاستخدام

### ❌ لا تفعل:
- لا تنسى await
- لا تهمل معالجة الأخطاء
- لا تنشئ instances جديدة من Singletons
- لا تستخدم any type بدون سبب
- لا تخزن بيانات حساسة بدون تشفير

---

## 🚀 الخطوات التالية

1. **اختر الوحدة** التي تريد استخدامها من [المحتويات](#المحتويات)
2. **اقرأ التوثيق** الخاص بها
3. **جرّب الأمثلة** الموجودة
4. **ابدأ التطوير** 🎉

---

**آخر تحديث:** 21 أكتوبر 2025  
**الإصدار:** 1.0.0

للأسئلة والدعم، راجع [FAQ](../95_FAQ.md) أو [Contributing Guide](../../CONTRIBUTING.md)
