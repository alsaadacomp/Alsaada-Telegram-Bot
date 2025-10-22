# 🔧 الوحدات الجاهزة - Ready-to-Use Modules

## 🎯 الهدف من هذا الدليل

هذا الدليل يشرح **الوحدات البرمجية الجاهزة** التي يمكن استخدامها مباشرة عند بناء أي feature في البوت.

### 💡 الفكرة الأساسية

بدلاً من كتابة نفس الكود في كل مرة، استخدم **وحدات جاهزة** ومختبرة!

**مثال:**
```typescript
// ❌ بدون وحدات (تكتب الكود في كل مرة)
feature.command('register', async (ctx) => {
  await ctx.reply('ما بريدك الإلكتروني؟')
  // ... 20 سطر للتحقق من صحة البريد
  // ... 15 سطر لمعالجة الأخطاء
  // ... 10 سطر لحفظ البيانات
})

// ✅ مع وحدات جاهزة (استدعاء بسيط)
feature.command('register', async (ctx) => {
  const email = await collectEmail(conversation, ctx)
  await UserRepository.create({ email })
  await ctx.reply('✅ تم التسجيل!')
})
```

---

## 📦 قائمة الوحدات الجاهزة

### 1️⃣ **Input Modules** - وحدات الإدخال

#### 📥 `input/collectors` - جامعات البيانات
**الوظيفة:** جمع بيانات من المستخدم مع التحقق التلقائي

**الدوال المتاحة:**
```typescript
// جمع نص عادي
collectText(conversation, ctx, prompt, options?)

// جمع بريد إلكتروني مع تحقق
collectEmail(conversation, ctx, prompt?)

// جمع رقم هاتف مع تحقق
collectPhone(conversation, ctx, prompt?)

// جمع تاريخ مع تحقق
collectDate(conversation, ctx, prompt?)

// جمع رقم مع تحقق
collectNumber(conversation, ctx, prompt?, min?, max?)

// جمع اختيار من قائمة
collectChoice(conversation, ctx, prompt, choices)

// جمع تأكيد نعم/لا
collectConfirmation(conversation, ctx, prompt)
```

**مثال استخدام:**
```typescript
import { collectEmail, collectPhone } from '#root/modules/input/collectors'

async function registerUser(conversation, ctx) {
  const email = await collectEmail(conversation, ctx, 'ما بريدك؟')
  const phone = await collectPhone(conversation, ctx, 'ما رقم هاتفك؟')

  await ctx.reply(`شكراً! بريدك: ${email}`)
}
```

---

#### ✅ `input/validators` - محققات الصحة
**الوظيفة:** التحقق من صحة المدخلات

**الدوال المتاحة:**
```typescript
// بريد إلكتروني
isValidEmail(email: string): boolean

// رقم هاتف (صيغة دولية)
isValidPhone(phone: string): boolean

// تاريخ
isValidDate(date: string): boolean

// رقم في نطاق معين
isValidNumber(value: string, min?: number, max?: number): boolean

// URL
isValidUrl(url: string): boolean

// اسم مستخدم
isValidUsername(username: string): boolean

// كلمة مرور قوية
isValidPassword(password: string): boolean

// رقم بطاقة هوية سعودية
isValidSaudiID(id: string): boolean

// IBAN حساب بنكي
isValidIBAN(iban: string): boolean
```

**مثال استخدام:**
```typescript
import { isValidEmail, isValidPhone } from '#root/modules/input/validators'

feature.command('check', async (ctx) => {
  const email = ctx.match

  if (!isValidEmail(email)) {
    return ctx.reply('❌ بريد إلكتروني غير صحيح')
  }

  await ctx.reply('✅ البريد صحيح')
})
```

---

#### 🔄 `input/parsers` - محللات البيانات
**الوظيفة:** تحليل وتنظيف المدخلات

**الدوال المتاحة:**
```typescript
// تحليل رقم هاتف وإضافة الكود الدولي
parsePhoneNumber(phone: string, defaultCountry?: string): string | null

// تحليل تاريخ من صيغ مختلفة
parseDate(dateString: string): Date | null

// تحليل رقم
parseNumber(value: string): number | null

// تنظيف نص من مسافات زائدة
cleanText(text: string): string

// استخراج أرقام من نص
extractNumbers(text: string): number[]

// استخراج روابط من نص
extractUrls(text: string): string[]

// تحليل قائمة مفصولة بفاصلة
parseList(text: string, separator?: string): string[]

// تحليل نعم/لا
parseBoolean(text: string): boolean | null
```

**مثال استخدام:**
```typescript
import { parseDate, parsePhoneNumber } from '#root/modules/input/parsers'

const phone = parsePhoneNumber('0501234567', 'SA')
// النتيجة: '+966501234567'

const date = parseDate('2025-01-18')
// النتيجة: Date object
```

---

#### 🎨 `input/formatters` - منسقات البيانات
**الوظيفة:** تنسيق البيانات للعرض

**الدوال المتاحة:**
```typescript
// تنسيق تاريخ بالعربية
formatDateArabic(date: Date): string

// تنسيق تاريخ بالإنجليزية
formatDateEnglish(date: Date): string

// تنسيق وقت نسبي (منذ ساعة، منذ يومين)
formatRelativeTime(date: Date, locale?: string): string

// تنسيق رقم بفواصل
formatNumber(num: number, locale?: string): string

// تنسيق مبلغ مالي
formatCurrency(amount: number, currency?: string): string

// تنسيق نسبة مئوية
formatPercentage(value: number, decimals?: number): string

// تنسيق حجم ملف
formatFileSize(bytes: number): string

// اختصار نص طويل
truncateText(text: string, maxLength: number): string
```

**مثال استخدام:**
```typescript
import { formatCurrency, formatDateArabic } from '#root/modules/input/formatters'

const price = formatCurrency(1999.99, 'SAR')
// النتيجة: '١٬٩٩٩٫٩٩ ر.س'

const date = formatDateArabic(new Date())
// النتيجة: 'السبت، ١٨ يناير ٢٠٢٥'
```

---

### 2️⃣ **Database Modules** - وحدات قاعدة البيانات

#### 📚 `database/repositories` - المستودعات
**الوظيفة:** عمليات CRUD منظمة وجاهزة

**Repository Pattern:**
```typescript
class UserRepository {
  // إنشاء
  static async create(data: CreateUserInput): Promise<User>
  static async createMany(data: CreateUserInput[]): Promise<BatchResult>

  // قراءة
  static async findById(id: number): Promise<User | null>
  static async findByTelegramId(telegramId: number): Promise<User | null>
  static async findByUsername(username: string): Promise<User | null>
  static async findAll(filters?: UserFilters): Promise<User[]>
  static async findActive(): Promise<User[]>
  static async findByRole(role: Role): Promise<User[]>

  // تحديث
  static async update(id: number, data: UpdateUserInput): Promise<User>
  static async updateMany(filters: UserFilters, data: UpdateUserInput): Promise<BatchResult>

  // حذف
  static async delete(id: number): Promise<User>
  static async deleteMany(filters: UserFilters): Promise<BatchResult>

  // عمليات خاصة
  static async activate(id: number): Promise<User>
  static async deactivate(id: number): Promise<User>
  static async promoteToAdmin(id: number): Promise<User>
  static async updateLastActive(telegramId: number): Promise<User>

  // إحصائيات
  static async count(filters?: UserFilters): Promise<number>
  static async getStats(): Promise<UserStats>
}
```

**مثال استخدام:**
```typescript
import { UserRepository } from '#root/modules/database/repositories'

// إنشاء مستخدم
const user = await UserRepository.create({
  telegramId: ctx.from.id,
  username: ctx.from.username,
  firstName: ctx.from.first_name
})

// البحث
const admin = await UserRepository.findByTelegramId(123456789)
const allAdmins = await UserRepository.findByRole('ADMIN')

// تحديث
await UserRepository.promoteToAdmin(user.id)
await UserRepository.updateLastActive(ctx.from.id)

// إحصائيات
const stats = await UserRepository.getStats()
console.log(`Total users: ${stats.total}`)
```

---

#### 💾 `database/cache` - التخزين المؤقت
**الوظيفة:** تخزين مؤقت لتسريع الأداء

**الدوال المتاحة:**
```typescript
class Cache {
  // حفظ في الذاكرة المؤقتة
  static async set(key: string, value: any, ttl?: number): Promise<void>

  // جلب من الذاكرة المؤقتة
  static async get<T>(key: string): Promise<T | null>

  // حذف من الذاكرة المؤقتة
  static async delete(key: string): Promise<void>

  // حذف كل شيء
  static async clear(): Promise<void>

  // التحقق من وجود key
  static async has(key: string): Promise<boolean>

  // Cache wrapper للدوال
  static async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>
  ): Promise<T>
}
```

**مثال استخدام:**
```typescript
import { Cache } from '#root/modules/database/cache'

// حفظ بيانات
await Cache.set('user:123', userData, 3600) // ساعة واحدة

// جلب بيانات
const user = await Cache.get('user:123')

// Cache مع callback
const stats = await Cache.remember('stats', 300, async () => {
  return await UserRepository.getStats() // يُحسب مرة واحدة كل 5 دقائق
})
```

---

#### 🔄 `database/transactions` - المعاملات المعقدة
**الوظيفة:** عمليات قاعدة بيانات معقدة ومركبة

**الدوال المتاحة:**
```typescript
class Transactions {
  // تسجيل مستخدم كامل (مع سجلات إضافية)
  static async registerUser(data: RegistrationData): Promise<User>

  // نقل صلاحيات من مستخدم لآخر
  static async transferRole(fromUserId: number, toUserId: number): Promise<void>

  // حذف مستخدم وكل بياناته
  static async deleteUserCompletely(userId: number): Promise<void>

  // نسخ إعدادات مستخدم لآخر
  static async copyUserSettings(fromId: number, toId: number): Promise<void>
}
```

**مثال استخدام:**
```typescript
import { Transactions } from '#root/modules/database/transactions'

// تسجيل مع عمليات متعددة
await Transactions.registerUser({
  telegramId: ctx.from.id,
  username: ctx.from.username,
  preferences: { language: 'ar' },
  subscriptions: ['news', 'updates']
})
```

---

#### 💾 `database/backup` - النسخ الاحتياطي
**الوظيفة:** نسخ احتياطي تلقائي

**الدوال المتاحة:**
```typescript
class Backup {
  // إنشاء نسخة احتياطية
  static async create(name?: string): Promise<BackupInfo>

  // استعادة من نسخة احتياطية
  static async restore(backupId: string): Promise<void>

  // حذف نسخة احتياطية
  static async delete(backupId: string): Promise<void>

  // قائمة النسخ الاحتياطية
  static async list(): Promise<BackupInfo[]>

  // نسخ احتياطي تلقائي يومي
  static setupAutoBackup(schedule: string): void
}
```

---

### 3️⃣ **Interaction Modules** - وحدات التفاعل

#### ✅ `interaction/confirmations` - التأكيدات
**الوظيفة:** رسائل تأكيد جاهزة

**الدوال المتاحة:**
```typescript
// تأكيد بسيط نعم/لا
async function confirmAction(
  ctx: Context,
  message: string,
  yesText?: string,
  noText?: string
): Promise<boolean>

// تأكيد حذف
async function confirmDelete(
  ctx: Context,
  itemName: string
): Promise<boolean>

// تأكيد بنص مخصص
async function confirmCustom(
  ctx: Context,
  message: string,
  buttons: ConfirmButton[]
): Promise<string>

// إلغاء عملية
async function cancelAction(ctx: Context): Promise<void>
```

**مثال استخدام:**
```typescript
import { confirmAction, confirmDelete } from '#root/modules/interaction/confirmations'

// تأكيد حذف
const confirmed = await confirmDelete(ctx, 'المستخدم أحمد')
if (!confirmed) {
  return ctx.reply('تم الإلغاء')
}

await deleteUser(userId)
await ctx.reply('✅ تم الحذف')
```

---

#### 🧭 `interaction/navigation` - التنقل
**الوظيفة:** أنظمة تنقل جاهزة

**الدوال المتاحة:**
```typescript
// قائمة رئيسية قابلة للتخصيص
createMainMenu(items: MenuItem[]): InlineKeyboard

// ترقيم صفحات
createPagination(
  currentPage: number,
  totalPages: number,
  dataPrefix: string
): InlineKeyboard

// breadcrumbs (مسار التنقل)
createBreadcrumbs(path: string[]): InlineKeyboard

// زر رجوع
createBackButton(callbackData: string, text?: string): InlineKeyboard

// قائمة ديناميكية من قاعدة البيانات
createDynamicMenu<T>(
  items: T[],
  formatter: (item: T) => MenuButton
): InlineKeyboard
```

**مثال استخدام:**
```typescript
import { createMainMenu, createPagination } from '#root/modules/interaction/navigation'

// قائمة رئيسية
const menu = createMainMenu([
  { text: '👤 الملف الشخصي', callback: 'profile' },
  { text: '⚙️ الإعدادات', callback: 'settings' },
  { text: '📊 الإحصائيات', callback: 'stats' }
])

// ترقيم
const pagination = createPagination(currentPage, totalPages, 'users')
```

---

### 4️⃣ **Reports Modules** - وحدات التقارير

#### 📄 `reports/generators` - مولدات التقارير
**الوظيفة:** توليد تقارير بصيغ مختلفة

**الدوال المتاحة:**
```typescript
// توليد PDF
async function generatePDF(
  data: ReportData,
  template: PDFTemplate
): Promise<Buffer>

// توليد Excel
async function generateExcel(
  data: TableData,
  options?: ExcelOptions
): Promise<Buffer>

// توليد CSV
async function generateCSV(
  data: any[],
  headers?: string[]
): Promise<string>

// تقرير نصي منسق
function generateTextReport(
  data: ReportData,
  template: TextTemplate
): string

// تقرير مستخدم
async function generateUserReport(userId: number): Promise<string>

// تقرير إحصائيات
async function generateStatsReport(): Promise<string>
```

**مثال استخدام:**
```typescript
import { generateExcel, generateUserReport } from '#root/modules/reports/generators'

// تقرير نصي
const report = await generateUserReport(ctx.from.id)
await ctx.reply(report, { parse_mode: 'Markdown' })

// تقرير Excel
const excel = await generateExcel(usersData, { sheetName: 'Users' })
await ctx.replyWithDocument(new InputFile(excel, 'users.xlsx'))
```

---

#### 📋 `reports/templates` - قوالب التقارير
**الوظيفة:** قوالب جاهزة للتقارير

```typescript
// قالب تقرير مستخدم
const USER_REPORT_TEMPLATE = `...`

// قالب تقرير إحصائيات
const STATS_REPORT_TEMPLATE = `...`

// قالب فاتورة
const INVOICE_TEMPLATE = `...`
```

---

### 5️⃣ **Services Modules** - الخدمات

#### ⏰ `services/scheduler` - المهام المجدولة
**الوظيفة:** جدولة مهام تلقائية

**الدوال المتاحة:**
```typescript
class Scheduler {
  // جدولة مهمة
  static schedule(
    name: string,
    cronExpression: string,
    task: () => Promise<void>
  ): void

  // إيقاف مهمة
  static stop(name: string): void

  // مهام جاهزة شائعة
  static setupDailyBackup(): void
  static setupHourlyCleanup(): void
  static setupWeeklyReport(): void
}
```

**مثال استخدام:**
```typescript
import { Scheduler } from '#root/modules/services/scheduler'

// مهمة يومية الساعة 3 صباحاً
Scheduler.schedule('daily-backup', '0 3 * * *', async () => {
  await Backup.create()
  console.log('Backup created')
})

// مهام جاهزة
Scheduler.setupDailyBackup()
```

---

## 🔄 سير العمل الموصى به

### مثال كامل: تسجيل مستخدم

```typescript
import { UserRepository } from '#root/modules/database/repositories'
import { collectEmail, collectPhone, collectText } from '#root/modules/input/collectors'
import { confirmAction } from '#root/modules/interaction/confirmations'
import { generateUserReport } from '#root/modules/reports/generators'
import { createConversation } from '@grammyjs/conversations'

async function registration(conversation, ctx) {
  // 1️⃣ جمع البيانات (وحدات جاهزة)
  await ctx.reply('📝 سجل معنا!')

  const name = await collectText(
    conversation,
    ctx,
    'ما اسمك الكامل؟'
  )

  const email = await collectEmail(
    conversation,
    ctx,
    'ما بريدك الإلكتروني؟'
  )

  const phone = await collectPhone(
    conversation,
    ctx,
    'ما رقم هاتفك؟'
  )

  // 2️⃣ عرض ملخص وتأكيد (وحدة جاهزة)
  const summary = `
📋 **ملخص البيانات:**
الاسم: ${name}
البريد: ${email}
الهاتف: ${phone}
  `

  await ctx.reply(summary, { parse_mode: 'Markdown' })

  const confirmed = await confirmAction(
    ctx,
    'هل البيانات صحيحة؟'
  )

  if (!confirmed) {
    return ctx.reply('❌ تم الإلغاء')
  }

  // 3️⃣ حفظ في القاعدة (وحدة جاهزة)
  const user = await UserRepository.create({
    telegramId: ctx.from.id,
    username: ctx.from.username,
    firstName: name,
    // يمكن إضافة email و phone في Schema
  })

  // 4️⃣ إرسال تقرير (وحدة جاهزة)
  const report = await generateUserReport(user.id)

  await ctx.reply(
    `✅ تم التسجيل بنجاح!\n\n${report}`,
    { parse_mode: 'Markdown' }
  )
}
```

**لاحظ:**
- ✅ لا كتابة validation يدوية
- ✅ لا كتابة كود قاعدة بيانات معقد
- ✅ لا إنشاء keyboards من الصفر
- ✅ كل شيء جاهز ومختبر!

---

## 📊 جدول الأولويات

| # | الوحدة | الأولوية | السبب |
|---|--------|----------|-------|
| 1 | `input/collectors` | 🔴 عالية جداً | **الأهم** - تستخدم في كل feature |
| 2 | `input/validators` | 🔴 عالية جداً | **ضروري** - أمان البيانات |
| 3 | `database/repositories` | 🟠 عالية | **مهم** - تنظيم قاعدة البيانات |
| 4 | `interaction/confirmations` | 🟠 عالية | **مفيد جداً** - UX أفضل |
| 5 | `input/parsers` | 🟡 متوسطة | مفيد لتنسيق البيانات |
| 6 | `input/formatters` | 🟡 متوسطة | لعرض أفضل |
| 7 | `reports/generators` | 🟡 متوسطة | للتقارير |
| 8 | `interaction/navigation` | 🟢 منخفضة | إضافات جميلة |
| 9 | `database/cache` | 🟢 منخفضة | تحسين الأداء |
| 10 | `database/transactions` | 🟢 منخفضة | للعمليات المعقدة |
| 11 | `services/scheduler` | 🟢 منخفضة | للمهام التلقائية |
| 12 | `database/backup` | 🟢 منخفضة | للنسخ الاحتياطي |

---

## 🧪 خطة الاختبار

لكل وحدة سننشئ:

### 1. **Unit Tests** (اختبارات الوحدة)
```typescript
// tests/modules/input/validators.test.ts
describe('Email Validator', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false)
  })
})
```

### 2. **Integration Tests** (اختبارات التكامل)
```typescript
// tests/integration/collectors.test.ts
describe('Email Collector', () => {
  it('should collect and validate email', async () => {
    const email = await collectEmail(mockConversation, mockCtx)
    expect(email).toMatch(/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/)
  })
})
```

### 3. **Example Usage** (أمثلة الاستخدام)
```typescript
// examples/registration-example.ts
// مثال كامل قابل للتشغيل
```

---

## 📝 خطة التوثيق

لكل وحدة سننشئ:

### 1. **JSDoc Comments** في الكود
```typescript
/**
 * يتحقق من صحة البريد الإلكتروني
 * @param email - البريد المراد التحقق منه
 * @returns true إذا كان البريد صحيح، false إذا كان خاطئ
 * @example
 * ```typescript
 * isValidEmail('test@example.com') // true
 * isValidEmail('invalid') // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  // ...
}
```

### 2. **README.md** لكل وحدة
```
modules/input/validators/README.md
```

### 3. **أمثلة عملية** في ملفات منفصلة
```
examples/validators-usage.ts
```

---

## 🚀 خطة التنفيذ

### المرحلة 1: الأساسيات (أسبوع 1)
- ✅ `input/validators` - 2 أيام
- ✅ `input/parsers` - 2 أيام
- ✅ `input/collectors` - 3 أيام

### المرحلة 2: قاعدة البيانات (أسبوع 2)
- ✅ `database/repositories` - 4 أيام
- ✅ `database/cache` - 2 أيام
- ✅ `database/transactions` - 1 يوم

### المرحلة 3: التفاعل (أسبوع 3)
- ✅ `interaction/confirmations` - 2 أيام
- ✅ `interaction/navigation` - 2 أيام
- ✅ `input/formatters` - 2 أيام
- ✅ `reports/generators` - 1 يوم

### المرحلة 4: الخدمات (أسبوع 4)
- ✅ `services/scheduler` - 2 أيام
- ✅ `database/backup` - 2 أيام
- ✅ `reports/templates` - 1 يوم
- ✅ المراجعة النهائية - 2 أيام

---

## 📚 معايير الجودة

كل وحدة يجب أن تحقق:

- ✅ **Type Safety** - أنواع TypeScript كاملة
- ✅ **Error Handling** - معالجة شاملة للأخطاء
- ✅ **Documentation** - توثيق كامل مع أمثلة
- ✅ **Testing** - اختبارات وحدة وتكامل
- ✅ **Examples** - أمثلة عملية قابلة للتشغيل
- ✅ **Performance** - كود محسّن وسريع
- ✅ **Reusability** - قابل لإعادة الاستخدام
- ✅ **Maintainability** - سهل الصيانة والتطوير

---

## 🎯 النتيجة المتوقعة

بعد الانتهاء، سيكون لديك:

```typescript
// مثال: إنشاء feature كامل في 20 سطر فقط!

import { UserRepository } from '#root/modules/database/repositories'
import { collectEmail, collectPhone, collectText } from '#root/modules/input/collectors'
import { confirmAction } from '#root/modules/interaction/confirmations'
import { generateUserReport } from '#root/modules/reports/generators'

async function quickRegistration(conversation, ctx) {
  const name = await collectText(conversation, ctx, 'اسمك؟')
  const email = await collectEmail(conversation, ctx, 'بريدك؟')
  const phone = await collectPhone(conversation, ctx, 'هاتفك؟')

  if (!await confirmAction(ctx, 'تأكيد؟'))
    return

  const user = await UserRepository.create({
    telegramId: ctx.from.id,
    username: ctx.from.username,
    firstName: name
  })

  const report = await generateUserReport(user.id)
  await ctx.reply(`✅ تم!\n\n${report}`)
}
```

**كل شيء جاهز ومختبر! 🎉**

---

## ✅ الخطوات التالية

1. ✅ **مراجعة هذا التوثيق** - تأكد من أن كل شيء واضح
2. ⏳ **الموافقة على الخطة** - إذا كان كل شيء جيد
3. 🚀 **البدء في التنفيذ** - وحدة واحدة في كل مرة

---

[⬅️ السابق: المرجع البرمجي](./09-api-reference.md) | [⬆️ العودة للفهرس](./README.md)
