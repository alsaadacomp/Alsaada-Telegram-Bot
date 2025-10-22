# 📋 خطة التنفيذ التفصيلية - Implementation Plan

**التاريخ:** 18 يناير 2025
**الحالة:** 📝 في مرحلة التخطيط

---

## 🎯 الهدف

بناء **12 وحدة برمجية جاهزة** للاستخدام المباشر في أي feature داخل البوت.

---

## 📊 جدول التنفيذ

| # | الوحدة | المدة | الحالة | الملفات المطلوبة |
|---|--------|------|--------|------------------|
| 1 | input/validators | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 2 | input/parsers | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 3 | input/collectors | 3 أيام | ⏳ قيد الانتظار | 5 ملفات |
| 4 | input/formatters | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 5 | database/repositories | 4 أيام | ⏳ قيد الانتظار | 6 ملفات |
| 6 | database/cache | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 7 | database/transactions | 1 يوم | ⏳ قيد الانتظار | 3 ملفات |
| 8 | database/backup | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 9 | interaction/confirmations | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 10 | interaction/navigation | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |
| 11 | reports/generators | 2 يوم | ⏳ قيد الانتظار | 5 ملفات |
| 12 | services/scheduler | 2 يوم | ⏳ قيد الانتظار | 4 ملفات |

**المدة الإجمالية:** ~28 يوم عمل (4 أسابيع)

---

## 📦 تفاصيل كل وحدة

### 1️⃣ input/validators

**المدة:** 2 يوم
**الأولوية:** 🔴 عالية جداً

**الملفات المطلوبة:**
```
src/modules/input/validators/
├── index.ts              (التصدير الرئيسي)
├── email.validator.ts    (التحقق من البريد)
├── phone.validator.ts    (التحقق من الهاتف)
├── text.validator.ts     (التحقق من النصوص)
├── number.validator.ts   (التحقق من الأرقام)
├── date.validator.ts     (التحقق من التواريخ)
└── README.md            (التوثيق)

tests/modules/input/validators/
├── email.test.ts
├── phone.test.ts
├── text.test.ts
├── number.test.ts
└── date.test.ts

examples/validators/
└── usage-examples.ts
```

**الدوال المطلوبة:**
- ✅ `isValidEmail(email: string): boolean`
- ✅ `isValidPhone(phone: string): boolean`
- ✅ `isValidUrl(url: string): boolean`
- ✅ `isValidUsername(username: string): boolean`
- ✅ `isValidPassword(password: string): boolean`
- ✅ `isValidDate(date: string): boolean`
- ✅ `isValidNumber(value: string, min?: number, max?: number): boolean`
- ✅ `isValidSaudiID(id: string): boolean`
- ✅ `isValidIBAN(iban: string): boolean`

**الاختبارات المطلوبة:**
- ✅ اختبار كل دالة مع حالات صحيحة
- ✅ اختبار كل دالة مع حالات خاطئة
- ✅ اختبار الحالات الحدية (edge cases)
- ✅ Coverage لا يقل عن 90%

---

### 2️⃣ input/parsers

**المدة:** 2 يوم
**الأولوية:** 🟠 عالية

**الملفات المطلوبة:**
```
src/modules/input/parsers/
├── index.ts
├── phone.parser.ts
├── date.parser.ts
├── number.parser.ts
├── text.parser.ts
└── README.md

tests/modules/input/parsers/
└── ...

examples/parsers/
└── usage-examples.ts
```

**الدوال المطلوبة:**
- ✅ `parsePhoneNumber(phone: string, defaultCountry?: string): string | null`
- ✅ `parseDate(dateString: string): Date | null`
- ✅ `parseNumber(value: string): number | null`
- ✅ `cleanText(text: string): string`
- ✅ `extractNumbers(text: string): number[]`
- ✅ `extractUrls(text: string): string[]`
- ✅ `parseList(text: string, separator?: string): string[]`
- ✅ `parseBoolean(text: string): boolean | null`

---

### 3️⃣ input/collectors

**المدة:** 3 أيام
**الأولوية:** 🔴 عالية جداً (الأهم!)

**الملفات المطلوبة:**
```
src/modules/input/collectors/
├── index.ts
├── text.collector.ts
├── email.collector.ts
├── phone.collector.ts
├── date.collector.ts
├── number.collector.ts
├── choice.collector.ts
├── confirmation.collector.ts
├── types.ts             (الأنواع المشتركة)
└── README.md

tests/modules/input/collectors/
└── ...

examples/collectors/
├── simple-usage.ts
└── advanced-usage.ts
```

**الدوال المطلوبة:**
- ✅ `collectText(conversation, ctx, prompt, options?): Promise<string>`
- ✅ `collectEmail(conversation, ctx, prompt?): Promise<string>`
- ✅ `collectPhone(conversation, ctx, prompt?): Promise<string>`
- ✅ `collectDate(conversation, ctx, prompt?): Promise<Date>`
- ✅ `collectNumber(conversation, ctx, prompt?, min?, max?): Promise<number>`
- ✅ `collectChoice(conversation, ctx, prompt, choices): Promise<string>`
- ✅ `collectConfirmation(conversation, ctx, prompt): Promise<boolean>`

**Options Interface:**
```typescript
interface CollectorOptions {
  maxAttempts?: number // عدد المحاولات
  timeout?: number // مهلة بالثواني
  validator?: (input: string) => boolean | Promise<boolean>
  errorMessage?: string // رسالة خطأ مخصصة
  retryMessage?: string // رسالة إعادة المحاولة
  cancelKeywords?: string[] // كلمات للإلغاء
}
```

---

### 4️⃣ input/formatters

**المدة:** 2 يوم
**الأولوية:** 🟡 متوسطة

**الملفات المطلوبة:**
```
src/modules/input/formatters/
├── index.ts
├── date.formatter.ts
├── number.formatter.ts
├── text.formatter.ts
└── README.md
```

**الدوال المطلوبة:**
- ✅ `formatDateArabic(date: Date): string`
- ✅ `formatDateEnglish(date: Date): string`
- ✅ `formatRelativeTime(date: Date, locale?: string): string`
- ✅ `formatNumber(num: number, locale?: string): string`
- ✅ `formatCurrency(amount: number, currency?: string): string`
- ✅ `formatPercentage(value: number, decimals?: number): string`
- ✅ `formatFileSize(bytes: number): string`
- ✅ `truncateText(text: string, maxLength: number): string`

---

### 5️⃣ database/repositories

**المدة:** 4 أيام
**الأولوية:** 🟠 عالية

**الملفات المطلوبة:**
```
src/modules/database/repositories/
├── index.ts
├── base.repository.ts    (Repository أساسي)
├── user.repository.ts    (CRUD للمستخدمين)
├── types.ts
└── README.md

tests/modules/database/repositories/
└── user.repository.test.ts

examples/repositories/
└── usage-examples.ts
```

**UserRepository Methods:**
```typescript
class UserRepository {
  // Create
  static async create(data: CreateUserInput): Promise<User>
  static async createMany(data: CreateUserInput[]): Promise<BatchResult>

  // Read
  static async findById(id: number): Promise<User | null>
  static async findByTelegramId(telegramId: number): Promise<User | null>
  static async findByUsername(username: string): Promise<User | null>
  static async findAll(filters?: UserFilters): Promise<User[]>
  static async findActive(): Promise<User[]>
  static async findByRole(role: Role): Promise<User[]>
  static async paginate(page: number, perPage: number): Promise<PaginatedResult<User>>

  // Update
  static async update(id: number, data: UpdateUserInput): Promise<User>
  static async updateMany(filters: UserFilters, data: UpdateUserInput): Promise<BatchResult>

  // Delete
  static async delete(id: number): Promise<User>
  static async deleteMany(filters: UserFilters): Promise<BatchResult>
  static async softDelete(id: number): Promise<User>

  // Special Operations
  static async activate(id: number): Promise<User>
  static async deactivate(id: number): Promise<User>
  static async promoteToAdmin(id: number): Promise<User>
  static async demoteToGuest(id: number): Promise<User>
  static async updateLastActive(telegramId: number): Promise<User>
  static async banUser(id: number, reason?: string): Promise<User>
  static async unbanUser(id: number): Promise<User>

  // Statistics
  static async count(filters?: UserFilters): Promise<number>
  static async getStats(): Promise<UserStats>
  static async getActiveCount(): Promise<number>
  static async getRoleDistribution(): Promise<Record<Role, number>>
}
```

---

### 6️⃣ database/cache

**المدة:** 2 يوم
**الأولوية:** 🟡 متوسطة

**الملفات المطلوبة:**
```
src/modules/database/cache/
├── index.ts
├── memory-cache.ts      (تخزين في الذاكرة)
├── types.ts
└── README.md
```

**الدوال المطلوبة:**
```typescript
class Cache {
  static async set(key: string, value: any, ttl?: number): Promise<void>
  static async get<T>(key: string): Promise<T | null>
  static async delete(key: string): Promise<void>
  static async clear(): Promise<void>
  static async has(key: string): Promise<boolean>
  static async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T>
  static async increment(key: string, amount?: number): Promise<number>
  static async decrement(key: string, amount?: number): Promise<number>
}
```

---

### 7️⃣ database/transactions

**المدة:** 1 يوم
**الأولوية:** 🟢 منخفضة

**الملفات المطلوبة:**
```
src/modules/database/transactions/
├── index.ts
├── user.transactions.ts
└── README.md
```

---

### 8️⃣ database/backup

**المدة:** 2 يوم
**الأولوية:** 🟢 منخفضة

**الملفات المطلوبة:**
```
src/modules/database/backup/
├── index.ts
├── backup.service.ts
├── types.ts
└── README.md
```

---

### 9️⃣ interaction/confirmations

**المدة:** 2 يوم
**الأولوية:** 🟠 عالية

**الملفات المطلوبة:**
```
src/modules/interaction/confirmations/
├── index.ts
├── confirm.ts
├── types.ts
└── README.md
```

**الدوال المطلوبة:**
```typescript
async function confirmAction(
  ctx: Context,
  message: string,
  options?: ConfirmOptions
): Promise<boolean>

async function confirmDelete(
  ctx: Context,
  itemName: string
): Promise<boolean>

async function confirmCustom(
  ctx: Context,
  message: string,
  buttons: ConfirmButton[]
): Promise<string>
```

---

### 🔟 interaction/navigation

**المدة:** 2 يوم
**الأولوية:** 🟡 متوسطة

---

### 1️⃣1️⃣ reports/generators

**المدة:** 2 يوم
**الأولوية:** 🟡 متوسطة

---

### 1️⃣2️⃣ services/scheduler

**المدة:** 2 يوم
**الأولوية:** 🟢 منخفضة

---

## ✅ معايير القبول لكل وحدة

قبل اعتبار الوحدة "مكتملة"، يجب أن تحقق:

### 1. الكود
- ✅ TypeScript كامل مع أنواع صحيحة
- ✅ معالجة شاملة للأخطاء
- ✅ JSDoc comments لكل دالة
- ✅ Linting بدون أخطاء
- ✅ كود نظيف ومنظم

### 2. الاختبارات
- ✅ Unit tests لكل دالة
- ✅ Integration tests (إذا لزم الأمر)
- ✅ Coverage لا يقل عن 85%
- ✅ كل الاختبارات تنجح

### 3. التوثيق
- ✅ README.md كامل للوحدة
- ✅ أمثلة استخدام واضحة
- ✅ شرح لكل parameter
- ✅ توضيح الحالات الخاصة

### 4. الأمثلة
- ✅ مثال بسيط قابل للتشغيل
- ✅ مثال متقدم (إذا لزم)
- ✅ مثال تكامل مع وحدات أخرى

---

## 🔄 عملية التنفيذ لكل وحدة

### المرحلة 1: التخطيط (30 دقيقة)
1. قراءة المتطلبات
2. تحديد الدوال المطلوبة
3. تصميم الواجهات (Interfaces)
4. تحديد الاختبارات المطلوبة

### المرحلة 2: الكتابة (60-70% من الوقت)
1. إنشاء الملفات الأساسية
2. كتابة الدوال مع JSDoc
3. معالجة الأخطاء
4. Types و Interfaces

### المرحلة 3: الاختبار (20% من الوقت)
1. كتابة Unit Tests
2. كتابة Integration Tests
3. اختبار الحالات الحدية
4. التحقق من Coverage

### المرحلة 4: التوثيق (10% من الوقت)
1. كتابة README.md
2. إنشاء أمثلة الاستخدام
3. تحديث التوثيق الرئيسي
4. Screenshots (إذا لزم)

### المرحلة 5: المراجعة
1. Code review
2. اختبار يدوي
3. التأكد من معايير القبول
4. ✅ الموافقة

---

## 📊 تتبع التقدم

سيتم تحديث هذا الجدول بعد كل وحدة:

| الوحدة | بدء | انتهاء | الحالة | الملاحظات |
|--------|-----|--------|--------|-----------|
| input/validators | - | - | ⏳ | - |
| input/parsers | - | - | ⏳ | - |
| input/collectors | - | - | ⏳ | - |
| ... | - | - | ⏳ | - |

---

## 🎯 المخرجات المتوقعة

بعد الانتهاء من جميع الوحدات:

### 1. ملفات الكود
- ~50 ملف TypeScript
- ~1500 سطر كود منتج
- ~800 سطر اختبارات

### 2. التوثيق
- 12 README.md للوحدات
- 1 دليل شامل (10-ready-modules.md)
- 20+ مثال استخدام

### 3. الاختبارات
- 100+ اختبار وحدة
- 30+ اختبار تكامل
- Coverage > 85%

---

## ✅ جاهز للبدء؟

انتظر موافقتك على:
- ✅ خطة الوحدات
- ✅ الأولويات
- ✅ معايير القبول
- ✅ عملية التنفيذ

**بعد الموافقة، نبدأ بـ `input/validators` مباشرة!** 🚀

---

[⬆️ العودة لدليل الوحدات الجاهزة](./10-ready-modules.md)
