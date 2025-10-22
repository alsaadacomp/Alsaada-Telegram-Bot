# 7️⃣ دليل التطوير - Development Guide

## 🚀 إضافة ميزة جديدة

### خطوات إضافة Feature

#### 1. إنشاء ملف Feature

```bash
# أنشئ ملف جديد في src/bot/features/
touch src/bot/features/subscription.ts
```

#### 2. كتابة الكود

```typescript
// src/bot/features/subscription.ts

import type { Context } from '#root/bot/context.js'
import { logHandle } from '#root/bot/helpers/logging.js'
import { Database } from '#root/modules/database/index.js'
import { Composer } from 'grammy'

const composer = new Composer<Context>()

// تقييد على المحادثات الخاصة فقط
const feature = composer.chatType('private')

// أمر الاشتراك
feature.command('subscribe', logHandle('command-subscribe'), async (ctx) => {
  const prisma = Database.getClient()

  // تحديث حالة المستخدم
  await prisma.user.update({
    where: { telegramId: ctx.from.id },
    data: { isActive: true }
  })

  await ctx.reply('✅ تم تفعيل اشتراكك بنجاح!')
})

// أمر إلغاء الاشتراك
feature.command('unsubscribe', logHandle('command-unsubscribe'), async (ctx) => {
  const prisma = Database.getClient()

  await prisma.user.update({
    where: { telegramId: ctx.from.id },
    data: { isActive: false }
  })

  await ctx.reply('❌ تم إلغاء اشتراكك')
})

export { composer as subscriptionFeature }
```

#### 3. تسجيل Feature

```typescript
// src/bot/index.ts

import { subscriptionFeature } from '#root/bot/features/subscription.js'

// ...
protectedBot.use(subscriptionFeature)
```

#### 4. اختبار Feature

```bash
npm run dev
```

أرسل `/subscribe` في Telegram

---

## 📝 إنشاء أمر جديد

### أمر بسيط

```typescript
feature.command('hello', async (ctx) => {
  await ctx.reply('مرحباً! 👋')
})
```

### أمر مع معاملات

```typescript
feature.command('greet', async (ctx) => {
  // النص بعد الأمر
  const name = ctx.match

  if (!name) {
    await ctx.reply('الاستخدام: /greet <اسمك>')
    return
  }

  await ctx.reply(`مرحباً ${name}! 🎉`)
})

// الاستخدام: /greet أحمد
```

### أمر للمسؤولين فقط

```typescript
import { isAdmin } from '#root/bot/filters/is-admin.filter.js'

feature.command('broadcast', isAdmin, async (ctx) => {
  const message = ctx.match

  if (!message) {
    await ctx.reply('الاستخدام: /broadcast <رسالتك>')
    return
  }

  // إرسال لجميع المستخدمين
  await broadcastMessage(message)
  await ctx.reply('✅ تم الإرسال لجميع المستخدمين')
})
```

---

## 💬 بناء محادثة تفاعلية

### مثال: استبيان كامل

```typescript
// src/modules/interaction/wizards/survey.ts

import type { MyContext, MyConversation } from '#root/bot/context.js'
import { Database } from '#root/modules/database/index.js'
import { createConversation } from '@grammyjs/conversations'
import { Composer } from 'grammy'

export const SURVEY_CONVERSATION = 'survey'

async function survey(conversation: MyConversation, ctx: MyContext) {
  // خطوة 1: الاسم
  await ctx.reply('📝 **استبيان رضا العملاء**\n\nما اسمك؟')

  const nameCtx = await conversation.wait()
  const name = nameCtx.message?.text

  if (!name) {
    await ctx.reply('❌ يجب إدخال الاسم')
    return
  }

  // خطوة 2: التقييم
  await ctx.reply('كيف تقيم خدماتنا؟ (1-5)')

  const ratingCtx = await conversation.wait()
  const rating = Number.parseInt(ratingCtx.message?.text || '0')

  if (rating < 1 || rating > 5) {
    await ctx.reply('❌ يجب إدخال رقم بين 1 و 5')
    return
  }

  // خطوة 3: الملاحظات
  await ctx.reply('هل لديك أي ملاحظات إضافية؟')

  const notesCtx = await conversation.wait()
  const notes = notesCtx.message?.text || 'لا توجد'

  // حفظ النتائج
  const prisma = Database.getClient()
  // ... حفظ في القاعدة

  // الشكر
  await ctx.reply(`
✅ **شكراً لك ${name}!**

تم تسجيل استبيانك:
━━━━━━━━━━━━━━━
⭐ التقييم: ${rating}/5
📝 الملاحظات: ${notes}

نقدر وقتك! 🙏
  `.trim())
}

export function surveyConversation() {
  const composer = new Composer<MyContext>()
  composer.use(createConversation(survey, SURVEY_CONVERSATION))
  return composer
}
```

### تسجيل المحادثة

```typescript
// src/bot/index.ts
import { surveyConversation } from '#root/modules/interaction/wizards/survey.js'

protectedBot.use(conversations())
protectedBot.use(surveyConversation())
```

### بدء المحادثة

```typescript
// في أي feature
feature.command('survey', (ctx) => {
  return ctx.conversation.enter('survey')
})
```

---

## ⌨️ إنشاء Keyboard مخصص

### Inline Keyboard

```typescript
// src/bot/keyboards/actions.keyboard.ts

import { InlineKeyboard } from 'grammy'

export function createActionsKeyboard() {
  return new InlineKeyboard()
    .text('✅ قبول', 'action:accept')
    .text('❌ رفض', 'action:reject')
    .row()
    .text('ℹ️ معلومات', 'action:info')
}

// الاستخدام
feature.command('actions', async (ctx) => {
  await ctx.reply(
    'اختر إجراء:',
    { reply_markup: createActionsKeyboard() }
  )
})

// معالجة الضغطات
bot.callbackQuery(/^action:/, async (ctx) => {
  const action = ctx.callbackQuery.data.split(':')[1]

  switch (action) {
    case 'accept':
      await ctx.answerCallbackQuery('تم القبول')
      await ctx.editMessageText('✅ تم القبول')
      break
    case 'reject':
      await ctx.answerCallbackQuery('تم الرفض')
      await ctx.editMessageText('❌ تم الرفض')
      break
    case 'info':
      await ctx.answerCallbackQuery()
      await ctx.reply('معلومات إضافية...')
      break
  }
})
```

### Reply Keyboard

```typescript
import { Keyboard } from 'grammy'

export function createMainKeyboard() {
  return new Keyboard()
    .text('📊 الإحصائيات')
    .text('⚙️ الإعدادات')
    .row()
    .text('👤 الملف الشخصي')
    .text('❓ المساعدة')
    .resized() // تصغير الحجم
    .oneTime() // إخفاء بعد الضغط
}

// الاستخدام
await ctx.reply('القائمة:', {
  reply_markup: createMainKeyboard()
})
```

---

## 🗄️ العمل مع القاعدة

### إنشاء Model جديد

#### 1. تعديل Schema

```prisma
// prisma/schema.prisma

model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  price       Float
  stock       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 2. إنشاء Migration

```bash
npm run prisma:migrate
# اسم Migration: add_product_model
```

#### 3. استخدام Model

```typescript
const prisma = Database.getClient()

// إنشاء منتج
const product = await prisma.product.create({
  data: {
    name: 'iPhone 15',
    description: 'Latest iPhone model',
    price: 999.99,
    stock: 50
  }
})

// قراءة المنتجات
const products = await prisma.product.findMany({
  where: { stock: { gt: 0 } },
  orderBy: { price: 'asc' }
})

// تحديث المخزون
await prisma.product.update({
  where: { id: 1 },
  data: { stock: { decrement: 1 } }
})
```

---

## 🎨 إدارة الحالة (State)

### استخدام Session

```typescript
// تعريف نوع Session
interface SessionData {
  counter: number
  lastCommand?: string
  cart: number[]
}

// الاستخدام
feature.command('count', (ctx) => {
  ctx.session.counter = (ctx.session.counter || 0) + 1
  ctx.reply(`العدد: ${ctx.session.counter}`)
})

feature.command('addtocart', (ctx) => {
  const productId = Number.parseInt(ctx.match || '0')

  if (!ctx.session.cart) {
    ctx.session.cart = []
  }

  ctx.session.cart.push(productId)
  ctx.reply(`تمت الإضافة! العربة: ${ctx.session.cart.length} منتجات`)
})
```

---

## 📨 إرسال رسائل متقدمة

### رسالة مع صورة

```typescript
await ctx.replyWithPhoto(
  'https://example.com/image.jpg',
  { caption: 'وصف الصورة' }
)

// أو ملف محلي
await ctx.replyWithPhoto(
  new InputFile('/path/to/image.jpg'),
  { caption: 'صورة محلية' }
)
```

### رسالة مع ملف

```typescript
await ctx.replyWithDocument(
  new InputFile('/path/to/file.pdf'),
  { caption: 'تقرير PDF' }
)
```

### رسالة مع Markdown

```typescript
await ctx.reply(
  '*نص غامق* _نص مائل_ `كود`',
  { parse_mode: 'Markdown' }
)

// أو HTML (الأفضل)
await ctx.reply(
  '<b>نص غامق</b> <i>نص مائل</i> <code>كود</code>',
  { parse_mode: 'HTML' }
)
```

---

## 🔔 إشعارات للمسؤولين

```typescript
// src/modules/services/notifications/admin-notifier.ts

import type { Config } from '#root/config.js'
import { Bot } from 'grammy'

export async function notifyAdmins(
  bot: Bot,
  config: Config,
  message: string
) {
  const promises = config.botAdmins.map(adminId =>
    bot.api.sendMessage(adminId, message).catch(() => {
      // تجاهل الأخطاء (قد يكون المسؤول حظر البوت)
    })
  )

  await Promise.all(promises)
}

// الاستخدام
await notifyAdmins(
  bot,
  config,
  '⚠️ تنبيه: تم اكتشاف نشاط مشبوه'
)
```

---

## ⏰ جدولة مهام

```typescript
// src/modules/services/scheduler/daily-tasks.ts

import { Bot } from 'grammy'
import schedule from 'node-schedule'
import { notifyAdmins } from './notifications/admin-notifier.js'

export function setupDailyTasks(bot: Bot, config: Config) {
  // مهمة يومية الساعة 9 صباحاً
  schedule.scheduleJob('0 9 * * *', async () => {
    const report = await generateDailyReport()
    await notifyAdmins(bot, config, report)
  })

  // مهمة كل ساعة
  schedule.scheduleJob('0 * * * *', async () => {
    await cleanupOldSessions()
  })
}
```

---

## 🧪 اختبار الميزات

### اختبار يدوي

```typescript
// أضف أمر للاختبار
feature.command('test', isAdmin, async (ctx) => {
  try {
    // اختبر ميزتك هنا
    const result = await myNewFeature()

    await ctx.reply(`✅ النتيجة: ${result}`)
  }
  catch (error) {
    ctx.logger.error({ err: error }, 'Test failed')
    await ctx.reply(`❌ خطأ: ${error.message}`)
  }
})
```

### السجلات للتصحيح

```typescript
// استخدم مستويات مختلفة
ctx.logger.debug('تفاصيل دقيقة')
ctx.logger.info('معلومة عامة')
ctx.logger.warn('تحذير')
ctx.logger.error({ err: error }, 'خطأ')
```

---

## 🎯 أفضل الممارسات

### 1. تنظيم الكود

✅ **افصل المنطق عن الواجهة**

```typescript
// ❌ سيء
feature.command('process', async (ctx) => {
  const data = ctx.message.text
  // 100 سطر من المنطق هنا...
})

// ✅ جيد
feature.command('process', async (ctx) => {
  const result = await processData(ctx.message.text)
  await ctx.reply(result)
})

async function processData(text: string): Promise<string> {
  // المنطق هنا
}
```

### 2. معالجة الأخطاء

✅ **دائماً استخدم try-catch**

```typescript
feature.command('risky', async (ctx) => {
  try {
    await riskyOperation()
    await ctx.reply('✅ نجح')
  }
  catch (error) {
    ctx.logger.error({ err: error }, 'Operation failed')
    await ctx.reply('❌ حدث خطأ')
  }
})
```

### 3. التحقق من المدخلات

✅ **تحقق من كل المدخلات**

```typescript
feature.command('setage', async (ctx) => {
  const ageStr = ctx.match

  if (!ageStr) {
    return ctx.reply('الاستخدام: /setage <عمرك>')
  }

  const age = Number.parseInt(ageStr)

  if (isNaN(age) || age < 1 || age > 150) {
    return ctx.reply('❌ عمر غير صحيح')
  }

  // المعالجة...
})
```

### 4. استخدام TypeScript

✅ **حدد الأنواع دائماً**

```typescript
// ❌ سيء
async function saveUser(data: any) {
  // ...
}

// ✅ جيد
interface UserInput {
  name: string
  age: number
  email: string
}

async function saveUser(data: UserInput): Promise<void> {
  // ...
}
```

---

## 📚 موارد مفيدة

- [grammY Documentation](https://grammy.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

[⬅️ السابق: الوحدات](./06-modules.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: النشر](./08-deployment.md)
