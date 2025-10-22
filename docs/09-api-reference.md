# 9️⃣ المرجع البرمجي - API Reference

## 📚 نظرة عامة

مرجع شامل لجميع الواجهات البرمجية والأنواع المستخدمة في المشروع.

---

## 🎯 Context API

### Context Interface

```typescript
interface Context extends GrammyContext {
  // الإعدادات
  config: Config

  // السجلات
  logger: Logger

  // الجلسة
  session: SessionData

  // الترجمة
  t: TranslateFunction
  i18n: I18n

  // المحادثات
  conversation: ConversationFlavor
}
```

### Context Methods

#### `ctx.reply()`

```typescript
// رسالة بسيطة
await ctx.reply('مرحباً!')

// مع خيارات
await ctx.reply('نص الرسالة', {
  parse_mode: 'HTML',
  reply_markup: keyboard,
  disable_web_page_preview: true,
  protect_content: true
})
```

#### `ctx.replyWithPhoto()`

```typescript
// من URL
// من ملف محلي
import { InputFile } from 'grammy'

await ctx.replyWithPhoto('https://example.com/image.jpg', {
  caption: 'وصف الصورة'
})

await ctx.replyWithPhoto(new InputFile('/path/to/image.jpg'))
```

#### `ctx.replyWithDocument()`

```typescript
await ctx.replyWithDocument(new InputFile('/path/to/file.pdf'), {
  caption: 'ملف PDF',
  thumb: new InputFile('/path/to/thumbnail.jpg')
})
```

#### `ctx.editMessageText()`

```typescript
// تعديل رسالة
await ctx.editMessageText('نص جديد')

// مع keyboard
await ctx.editMessageText('نص جديد', {
  reply_markup: newKeyboard
})
```

#### `ctx.answerCallbackQuery()`

```typescript
// إشعار بسيط
await ctx.answerCallbackQuery()

// مع نص
await ctx.answerCallbackQuery('تم الحفظ!')

// مع تنبيه
await ctx.answerCallbackQuery({
  text: 'تحذير!',
  show_alert: true
})
```

---

## 🤖 Bot API

### Creating Bot

```typescript
import { createBot } from '#root/bot/index.js'

const bot = createBot(token, {
  config,
  logger
})
```

### Bot Methods

#### `bot.command()`

```typescript
// أمر بسيط
bot.command('start', async (ctx) => {
  await ctx.reply('مرحباً!')
})

// مع معالج
bot.command('help', helpHandler)

// مع middleware
bot.command('admin', isAdmin, adminHandler)
```

#### `bot.on()`

```typescript
// رسالة نصية
bot.on('message:text', async (ctx) => {
  const text = ctx.message.text
  // ...
})

// صورة
bot.on('message:photo', async (ctx) => {
  const photos = ctx.message.photo
  // ...
})

// مستند
bot.on('message:document', async (ctx) => {
  const doc = ctx.message.document
  // ...
})

// callback query
bot.on('callback_query:data', async (ctx) => {
  const data = ctx.callbackQuery.data
  // ...
})
```

#### `bot.callbackQuery()`

```typescript
// pattern محدد
bot.callbackQuery(/^action:/, async (ctx) => {
  const data = ctx.callbackQuery.data
  // ...
})

// data محدد
bot.callbackQuery('button_clicked', async (ctx) => {
  // ...
})
```

#### `bot.api`

```typescript
// إرسال رسالة لمستخدم محدد
await bot.api.sendMessage(chatId, 'رسالة')

// إرسال صورة
await bot.api.sendPhoto(chatId, photoUrl)

// حذف webhook
await bot.api.deleteWebhook()

// تعيين webhook
await bot.api.setWebhook(webhookUrl, {
  secret_token: secret
})

// الحصول على معلومات البوت
const botInfo = await bot.api.getMe()
```

---

## 🗄️ Database API

### Database Class

```typescript
class Database {
  static async connect(): Promise<void>
  static async disconnect(): Promise<void>
  static getClient(): PrismaClient
  static isConnected(): boolean
}
```

### Usage

```typescript
import { Database } from '#root/modules/database/index.js'

// الاتصال
await Database.connect()

// الحصول على Client
const prisma = Database.getClient()

// استخدام Prisma
const users = await prisma.user.findMany()

// قطع الاتصال
await Database.disconnect()
```

---

## 📝 Prisma Client API

### User Model

```typescript
interface User {
  id: number
  telegramId: bigint
  username: string | null
  firstName: string | null
  role: Role
  isActive: boolean
  lastActiveAt: Date | null
  createdAt: Date
}

enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST'
}
```

### CRUD Operations

#### Create

```typescript
// إنشاء مستخدم واحد
const user = await prisma.user.create({
  data: {
    telegramId: 123456789,
    username: 'john_doe',
    firstName: 'John',
    role: 'GUEST'
  }
})

// إنشاء عدة مستخدمين
const result = await prisma.user.createMany({
  data: [
    { telegramId: 111, username: 'user1' },
    { telegramId: 222, username: 'user2' }
  ]
})
```

#### Read

```typescript
// قراءة كل المستخدمين
const users = await prisma.user.findMany()

// مع شروط
const admins = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  orderBy: { createdAt: 'desc' }
})

// قراءة واحد
const user = await prisma.user.findUnique({
  where: { telegramId: 123456789 }
})

// أول نتيجة
const firstAdmin = await prisma.user.findFirst({
  where: { role: 'ADMIN' }
})
```

#### Update

```typescript
// تحديث واحد
const user = await prisma.user.update({
  where: { id: 1 },
  data: { firstName: 'John Updated' }
})

// تحديث عدة
const result = await prisma.user.updateMany({
  where: { role: 'GUEST' },
  data: { isActive: false }
})

// Upsert (تحديث أو إنشاء)
const user = await prisma.user.upsert({
  where: { telegramId: 123 },
  update: { firstName: 'John' },
  create: { telegramId: 123, username: 'john' }
})
```

#### Delete

```typescript
// حذف واحد
const user = await prisma.user.delete({
  where: { id: 1 }
})

// حذف عدة
const result = await prisma.user.deleteMany({
  where: { isActive: false }
})
```

---

## 📊 Logger API

### Logger Interface

```typescript
interface Logger {
  trace: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  debug: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  info: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  warn: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  error: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  fatal: ((msg: string) => void) & ((obj: object, msg?: string) => void)

  child: (bindings: object) => Logger
}
```

### Usage

```typescript
import { logger } from '#root/modules/services/logger/index.js'

// سجل بسيط
logger.info('Application started')

// مع بيانات
logger.info({
  userId: 123,
  action: 'login'
}, 'User logged in')

// خطأ
logger.error({
  err: error,
  context: 'payment'
}, 'Payment failed')

// Child logger
const userLogger = logger.child({ userId: 123 })
userLogger.info('Action performed')
```

---

## 🌍 i18n API

### Translation Function

```typescript
type TranslateFunction = (
  key: string,
  params?: Record<string, any>
) => string
```

### Usage

```typescript
// ترجمة بسيطة
const text = ctx.t('welcome')

// مع متغيرات
const text = ctx.t('greeting', { name: 'أحمد' })

// مع عدد
const text = ctx.t('items-count', { count: 5 })
```

### i18n Methods

```typescript
// الحصول على اللغة الحالية
const locale = ctx.i18n.getLocale() // 'ar' | 'en'

// تغيير اللغة
await ctx.i18n.setLocale('ar')

// اللغات المتاحة
const locales = ctx.i18n.locales // ['ar', 'en']
```

---

## ⌨️ Keyboard API

### InlineKeyboard

```typescript
import { InlineKeyboard } from 'grammy'

// إنشاء keyboard
const keyboard = new InlineKeyboard()
  .text('زر 1', 'callback_data_1')
  .text('زر 2', 'callback_data_2')
  .row()
  .text('زر 3', 'callback_data_3')
  .url('رابط', 'https://example.com')

// استخدام
await ctx.reply('اختر:', { reply_markup: keyboard })
```

### Keyboard (Reply Keyboard)

```typescript
// إزالة keyboard
import { removeKeyboard } from '#root/bot/keyboards/remove.keyboard.js'

import { Keyboard } from 'grammy'

// إنشاء keyboard
const keyboard = new Keyboard()
  .text('زر 1')
  .text('زر 2')
  .row()
  .text('زر 3')
  .resized() // تصغير الحجم
  .oneTime() // إخفاء بعد الضغط
  .persistent() // بقاء دائم

// استخدام
await ctx.reply('اختر:', { reply_markup: keyboard })
await ctx.reply('تم', { reply_markup: removeKeyboard })
```

---

## 💬 Conversations API

### Creating Conversation

```typescript
import type { MyContext, MyConversation } from '#root/bot/context.js'
import { createConversation } from '@grammyjs/conversations'

async function myConversation(
  conversation: MyConversation,
  ctx: MyContext
) {
  // إرسال رسالة
  await ctx.reply('ما اسمك؟')

  // انتظار رد
  const response = await conversation.wait()
  const name = response.message?.text

  // رد
  await ctx.reply(`مرحباً ${name}!`)
}
```

### Conversation Methods

```typescript
interface Conversation {
  // انتظار أي تحديث
  wait: () => Promise<Context>

  // انتظار تحديث محدد
  waitFor: (filter: string) => Promise<Context>

  // تخطي تحديث
  skip: () => Promise<Context>

  // إيقاف المحادثة
  halt: () => never

  // الانتظار مع timeout
  waitWithTimeout: (ms: number) => Promise<Context | undefined>
}
```

### Usage

```typescript
// انتظار رسالة نصية فقط
const ctx = await conversation.waitFor('message:text')

// انتظار صورة
const ctx = await conversation.waitFor('message:photo')

// مع timeout
const ctx = await conversation.waitWithTimeout(30000) // 30 ثانية
if (!ctx) {
  await ctx.reply('انتهى الوقت!')
}
```

---

## 🔧 Helpers & Utilities

### logHandle()

```typescript
import { logHandle } from '#root/bot/helpers/logging.js'

// استخدام
bot.command('start', logHandle('command-start'), handler)

// سيسجل في اللوج:
// [INFO] Handle "command-start"
```

### Filters

```typescript
// is-admin.filter.ts
import type { Context } from '#root/bot/context.js'

export function isAdmin(ctx: Context): boolean {
  return ctx.config.botAdmins.includes(ctx.from!.id)
}

// الاستخدام
bot.command('admin', isAdmin, adminHandler)
```

---

## 🎨 Types & Interfaces

### Config Types

```typescript
interface Config {
  // Bot
  botToken: string
  botMode: 'polling' | 'webhook'
  botAdmins: number[]
  botAllowedUpdates: string[]

  // App
  debug: boolean
  isDebug: boolean
  logLevel: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

  // Mode flags
  isPollingMode: boolean
  isWebhookMode: boolean

  // Webhook (if mode is webhook)
  botWebhook?: string
  botWebhookSecret?: string
  serverHost?: string
  serverPort?: number
}
```

### Session Types

```typescript
interface SessionData {
  // أضف حقولك هنا
  counter?: number
  lastCommand?: string
  cart?: number[]
}
```

### Custom Types

```typescript
// إنشاء نوع مخصص
interface MyCustomType {
  id: number
  name: string
  active: boolean
}

// استخدام
const data: MyCustomType = {
  id: 1,
  name: 'Test',
  active: true
}
```

---

## 📦 CallbackData Builder

### Creating Builder

```typescript
import { CallbackData } from 'callback-data'

export const myData = new CallbackData('prefix')
  .string('action')
  .number('id')
```

### Usage

```typescript
// بناء data
const data = myData.pack({
  action: 'delete',
  id: 123
})
// النتيجة: "prefix:delete:123"

// تحليل data
const parsed = myData.unpack(ctx.callbackQuery.data)
// النتيجة: { action: 'delete', id: 123 }

// في keyboard
const keyboard = new InlineKeyboard()
  .text('حذف', myData.pack({ action: 'delete', id: 123 }))

// في handler
bot.callbackQuery(/^prefix:/, async (ctx) => {
  const { action, id } = myData.unpack(ctx.callbackQuery.data)

  if (action === 'delete') {
    await deleteItem(id)
  }
})
```

---

## 🎯 Error Handling

### Error Handler

```typescript
import { BotError } from 'grammy'

export async function errorHandler(error: BotError) {
  const { ctx, error: e } = error

  ctx.logger.error({
    err: e,
    update_id: ctx.update.update_id
  }, 'Error in bot')

  // إرسال للمستخدم (اختياري)
  await ctx.reply('حدث خطأ، يرجى المحاولة لاحقاً')
}
```

### Custom Errors

```typescript
class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// الاستخدام
throw new ValidationError('Invalid input')
```

---

## 📚 موارد إضافية

### الوثائق الرسمية

- [grammY API Reference](https://doc.deno.land/https://deno.land/x/grammy/mod.ts)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [Pino API](https://getpino.io/#/docs/api)

---

[⬅️ السابق: النشر](./08-deployment.md) | [⬆️ العودة للفهرس](./README.md)
