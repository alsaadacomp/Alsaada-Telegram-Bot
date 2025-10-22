# 6️⃣ الوحدات والخدمات - Modules & Services

## 📦 نظرة عامة

الوحدات هي مكونات مستقلة قابلة لإعادة الاستخدام توفر وظائف محددة للتطبيق.

---

## 🗄️ وحدة قاعدة البيانات

### Database Class

**الملف:** `src/modules/database/index.ts`

#### الدوال المتاحة

```typescript
// الاتصال بالقاعدة
await Database.connect()

// الحصول على Prisma Client
const prisma = Database.getClient()

// قطع الاتصال
await Database.disconnect()

// التحقق من الاتصال
const isConnected = Database.isConnected() // true/false
```

#### الاستخدام في البوت

```typescript
// في main.ts - عند بدء البوت
await Database.connect()

// في أي feature أو handler
const prisma = Database.getClient()
const users = await prisma.user.findMany()

// عند الإغلاق
await Database.disconnect()
```

---

## 📝 خدمة السجلات (Logger)

### Pino Logger

**الملف:** `src/modules/services/logger/index.ts`

#### المستويات المتاحة

```typescript
logger.trace('تفاصيل دقيقة جداً - للتصحيح العميق')
logger.debug('معلومات تصحيح - للتطوير')
logger.info('معلومات عامة - للإنتاج')
logger.warn('تحذير - قد تكون مشكلة')
logger.error('خطأ - يجب المعالجة')
logger.fatal('خطأ خطير - قد يتوقف التطبيق')
```

#### الاستخدام الأساسي

```typescript
// سجل بسيط
ctx.logger.info('User logged in')

// مع بيانات إضافية (structured logging)
ctx.logger.info({
  userId: ctx.from.id,
  username: ctx.from.username,
  action: 'login'
}, 'User action performed')

// تسجيل أخطاء
ctx.logger.error({
  err: error,
  context: 'payment_processing',
  userId: ctx.from.id
}, 'Payment processing failed')
```

#### Child Logger

```typescript
// إنشاء logger فرعي مع context إضافي
const userLogger = logger.child({
  userId: 123,
  username: 'john_doe'
})

// كل السجلات ستحتوي على userId و username تلقائياً
userLogger.info('User logged in')
userLogger.warn('Invalid action attempted')
```

---

## 🌍 التعدد اللغوي (i18n)

### نظام الترجمة

**الملف:** `src/modules/services/i18n-extended/i18n.ts`

#### بنية ملفات الترجمة

```
locales/
├── ar.ftl  # اللغة العربية
└── en.ftl  # اللغة الإنجليزية
```

#### صيغة Fluent (.ftl)

```fluent
# en.ftl
welcome = Welcome to our bot!
greeting-ask-name = What is your name?
greeting-welcome-name = Hello, { $name }! Nice to meet you.
items-count = You have { $count ->
    [one] 1 item
    *[other] { $count } items
}

# ar.ftl
welcome = مرحباً بك في بوتنا!
greeting-ask-name = ما اسمك؟
greeting-welcome-name = مرحباً، { $name }! سعيد بلقائك.
items-count = لديك { $count ->
    [one] عنصر واحد
    [two] عنصران
    [few] { $count } عناصر
    *[other] { $count } عنصر
}
```

#### الاستخدام في الكود

```typescript
// ترجمة بسيطة
await ctx.reply(ctx.t('welcome'))

// ترجمة مع متغيرات
await ctx.reply(ctx.t('greeting-welcome-name', {
  name: 'أحمد'
}))

// ترجمة مع عدد (plurals)
await ctx.reply(ctx.t('items-count', {
  count: 5
}))

// الحصول على اللغة الحالية
const currentLang = ctx.i18n.getLocale() // 'ar' أو 'en'

// تغيير اللغة
await ctx.i18n.setLocale('ar')
```

#### إضافة لغة جديدة

1. أنشئ ملف جديد في `locales/`:
```bash
touch locales/fr.ftl  # الفرنسية
```

2. أضف الترجمات:
```fluent
# fr.ftl
welcome = Bienvenue dans notre bot!
greeting-ask-name = Quel est votre nom?
```

3. أعد تشغيل البوت

---

## 🔐 نظام الصلاحيات

### الأدوار (Roles)

**الملف:** `prisma/schema.prisma`

```prisma
enum Role {
  SUPER_ADMIN  // صلاحيات كاملة
  ADMIN        // إدارة عامة
  EMPLOYEE     // موظف عادي
  GUEST        // زائر (افتراضي)
}
```

#### التحقق من الصلاحيات

```typescript
// في الكود
const prisma = Database.getClient()

// الحصول على المستخدم
const user = await prisma.user.findUnique({
  where: { telegramId: ctx.from.id }
})

// التحقق من دور محدد
if (user.role === 'ADMIN') {
  // منطق للمسؤولين فقط
  await showAdminPanel(ctx)
}

// التحقق من عدة أدوار
const allowedRoles: Role[] = ['ADMIN', 'SUPER_ADMIN']
if (allowedRoles.includes(user.role)) {
  // منطق للمسؤولين والسوبر أدمن
}

// منع GUEST من الوصول
if (user.role === 'GUEST') {
  return ctx.reply('يجب التسجيل أولاً!')
}
```

#### استخدام الفلتر

```typescript
// src/bot/filters/is-admin.filter.ts
export function isAdmin(ctx: Context) {
  return ctx.config.botAdmins.includes(ctx.from!.id)
}

// الاستخدام
bot.command('admin-panel', isAdmin, (ctx) => {
  // يُنفذ فقط للمسؤولين
})
```

---

## 🎭 وحدة التفاعلات (Interactions)

### Wizards - المحادثات التفاعلية

**المجلد:** `src/modules/interaction/wizards/`

#### إنشاء Wizard جديد

```typescript
// src/modules/interaction/wizards/registration.ts

import type { MyContext, MyConversation } from '#root/bot/context.js'
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'

export const REGISTRATION = 'registration'

async function registration(
  conversation: MyConversation,
  ctx: MyContext
) {
  // خطوة 1: الاسم
  await ctx.reply('مرحباً! ما اسمك؟')
  const nameCtx = await conversation.wait()
  const name = nameCtx.message?.text

  if (!name) {
    await ctx.reply('يرجى إرسال اسمك')
    return
  }

  // خطوة 2: العمر
  await ctx.reply('كم عمرك؟')
  const ageCtx = await conversation.wait()
  const age = Number.parseInt(ageCtx.message?.text || '0')

  if (!age || age < 1) {
    await ctx.reply('عمر غير صحيح')
    return
  }

  // خطوة 3: البريد
  await ctx.reply('ما بريدك الإلكتروني؟')
  const emailCtx = await conversation.wait()
  const email = emailCtx.message?.text

  // حفظ البيانات
  const prisma = Database.getClient()
  await prisma.user.update({
    where: { telegramId: ctx.from.id },
    data: { firstName: name }
  })

  await ctx.reply(`شكراً ${name}! تم تسجيلك بنجاح.`)
}

export function registrationConversation() {
  const composer = new Composer<MyContext>()
  composer.use(createConversation(registration, REGISTRATION))
  return composer
}
```

#### تسجيل الـ Wizard

```typescript
// src/bot/index.ts
import { registrationConversation } from '#root/modules/interaction/wizards/registration.js'

// ...
protectedBot.use(conversations())
protectedBot.use(registrationConversation())
```

#### بدء الـ Wizard

```typescript
// في أي feature
feature.command('register', (ctx) => {
  return ctx.conversation.enter('registration')
})
```

---

### Menus - القوائم التفاعلية

**المجلد:** `src/modules/interaction/menus/`

#### إنشاء قائمة رئيسية

```typescript
// src/modules/interaction/menus/main-menu.ts

import { InlineKeyboard } from 'grammy'

export function createMainMenu(ctx: Context) {
  return new InlineKeyboard()
    .text('👤 الملف الشخصي', 'menu:profile')
    .text('⚙️ الإعدادات', 'menu:settings')
    .row()
    .text('📊 الإحصائيات', 'menu:stats')
    .text('❓ المساعدة', 'menu:help')
}

// عرض القائمة
feature.command('menu', async (ctx) => {
  await ctx.reply(
    'القائمة الرئيسية:',
    { reply_markup: createMainMenu(ctx) }
  )
})

// معالجة النقرات
bot.callbackQuery(/^menu:/, async (ctx) => {
  const action = ctx.callbackQuery.data.split(':')[1]

  switch (action) {
    case 'profile':
      await showProfile(ctx)
      break
    case 'settings':
      await showSettings(ctx)
      break
    case 'stats':
      await showStats(ctx)
      break
    case 'help':
      await showHelp(ctx)
      break
  }

  await ctx.answerCallbackQuery()
})
```

---

### Confirmations - التأكيدات

**المجلد:** `src/modules/interaction/confirmations/`

```typescript
// src/modules/interaction/confirmations/delete-confirmation.ts

export async function confirmDelete(
  ctx: Context,
  itemId: number,
  itemName: string
) {
  const keyboard = new InlineKeyboard()
    .text('✅ نعم، احذف', `confirm:delete:${itemId}`)
    .text('❌ إلغاء', 'confirm:cancel')

  await ctx.reply(
    `⚠️ هل أنت متأكد من حذف "${itemName}"؟\n\nهذا الإجراء لا يمكن التراجع عنه.`,
    { reply_markup: keyboard }
  )
}

// معالجة التأكيد
bot.callbackQuery(/^confirm:delete:/, async (ctx) => {
  const itemId = Number.parseInt(ctx.callbackQuery.data.split(':')[2])

  try {
    await deleteItem(itemId)
    await ctx.editMessageText('✅ تم الحذف بنجاح')
  }
  catch (error) {
    await ctx.answerCallbackQuery('❌ حدث خطأ')
  }
})

// معالجة الإلغاء
bot.callbackQuery('confirm:cancel', async (ctx) => {
  await ctx.editMessageText('تم الإلغاء')
  await ctx.answerCallbackQuery()
})
```

---

## 📊 التقارير (Reports)

### Report Generators

**المجلد:** `src/modules/reports/generators/`

```typescript
// src/modules/reports/generators/user-stats.ts

export async function generateUserStatsReport(userId: number) {
  const prisma = Database.getClient()

  const user = await prisma.user.findUnique({
    where: { telegramId: userId }
  })

  if (!user) {
    return 'المستخدم غير موجود'
  }

  const report = `
📊 **تقرير إحصائيات المستخدم**
━━━━━━━━━━━━━━━━━━━━━━━━

👤 **المعلومات الأساسية:**
   • الاسم: ${user.firstName || 'غير محدد'}
   • اسم المستخدم: @${user.username || 'لا يوجد'}
   • المعرف: \`${user.telegramId}\`

👑 **الصلاحيات:**
   • الدور: ${getRoleEmoji(user.role)} ${user.role}

📅 **التواريخ:**
   • تاريخ التسجيل: ${formatDate(user.createdAt)}
   • آخر نشاط: ${formatDate(user.lastActiveAt)}

✅ **الحالة:**
   • ${user.isActive ? '🟢 نشط' : '🔴 غير نشط'}

━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim()

  return report
}

function getRoleEmoji(role: string): string {
  const emojis = {
    SUPER_ADMIN: '👑',
    ADMIN: '⭐',
    EMPLOYEE: '👨‍💼',
    GUEST: '👤'
  }
  return emojis[role] || '👤'
}

function formatDate(date: Date | null): string {
  if (!date)
    return 'غير محدد'
  return new Intl.DateTimeFormat('ar-SA', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}

// الاستخدام
feature.command('mystats', async (ctx) => {
  const report = await generateUserStatsReport(ctx.from.id)
  await ctx.reply(report, { parse_mode: 'Markdown' })
})
```

---

## 🔧 معالجة المدخلات (Input Processing)

### Parsers - المحللات

**المجلد:** `src/modules/input/parsers/`

```typescript
// src/modules/input/parsers/phone-parser.ts

export function parsePhoneNumber(text: string): string | null {
  // إزالة كل شيء ما عدا الأرقام و +
  const cleaned = text.replace(/[^\d+]/g, '')

  // التحقق من التنسيق الدولي
  const regex = /^\+?[1-9]\d{1,14}$/
  if (!regex.test(cleaned)) {
    return null
  }

  // إضافة + إذا لم تكن موجودة
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

// الاستخدام
const phone = parsePhoneNumber(ctx.message.text)
if (!phone) {
  await ctx.reply('❌ رقم هاتف غير صحيح\nالرجاء إدخال رقم بالتنسيق: +966501234567')
}
```

```typescript
// src/modules/input/parsers/date-parser.ts

export function parseDate(text: string): Date | null {
  // محاولة تحليل تنسيقات مختلفة
  const formats = [
    /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
    /^(\d{2})\/(\d{2})\/(\d{4})$/, // DD/MM/YYYY
  ]

  for (const format of formats) {
    const match = text.match(format)
    if (match) {
      // ... منطق التحليل
      return new Date(/* ... */)
    }
  }

  return null
}
```

### Validators - المحققات

**المجلد:** `src/modules/input/validators/`

```typescript
// src/modules/input/validators/email-validator.ts

export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  return regex.test(email)
}

// الاستخدام
const email = ctx.message.text
if (!isValidEmail(email)) {
  await ctx.reply('❌ بريد إلكتروني غير صحيح')
}
```

```typescript
// src/modules/input/validators/username-validator.ts

export function isValidUsername(username: string): boolean {
  // طول من 3-20 حرف، حروف وأرقام و_ فقط
  const regex = /^\w{3,20}$/
  return regex.test(username)
}

export function isValidPassword(password: string): boolean {
  // 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم
  return password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
}
```

---

## 🎯 أفضل الممارسات

### 1. فصل المسؤوليات (Separation of Concerns)

✅ **جيد:**
```
modules/
├── database/      # قاعدة البيانات فقط
├── logger/        # السجلات فقط
├── i18n/          # الترجمة فقط
└── interaction/   # التفاعلات فقط
```

❌ **سيء:**
```
// كل شيء في ملف واحد
modules/everything.ts
```

### 2. استخدام TypeScript بشكل صحيح

✅ **جيد:**
```typescript
interface UserData {
  name: string
  email: string
  age: number
}

async function saveUser(data: UserData): Promise<void> {
  // ...
}
```

❌ **سيء:**
```typescript
async function saveUser(data: any) {
  // ...
}
```

### 3. معالجة الأخطاء

✅ **جيد:**
```typescript
try {
  await riskyOperation()
}
catch (error) {
  ctx.logger.error({ err: error }, 'Operation failed')
  await ctx.reply('حدث خطأ، يرجى المحاولة لاحقاً')
}
```

❌ **سيء:**
```typescript
// بدون معالجة أخطاء
await riskyOperation()
```

### 4. التوثيق

✅ **جيد:**
```typescript
/**
 * يرسل تقرير يومي لجميع المسؤولين
 * @param date - التاريخ المطلوب للتقرير
 * @returns عدد المسؤولين الذين تم الإرسال لهم
 */
async function sendDailyReport(date: Date): Promise<number> {
  // ...
}
```

---

[⬅️ السابق: ميزات البوت](./05-bot-features.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: دليل التطوير](./07-development-guide.md)
