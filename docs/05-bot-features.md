# 5️⃣ ميزات البوت - Bot Features

## 🎯 نظرة عامة

هذا القسم يشرح جميع الميزات والأوامر المتاحة في البوت، وكيفية استخدامها وتخصيصها.

---

## 📜 الأوامر المتاحة

### الأوامر الأساسية

#### `/start` - بدء البوت

**الوصف:** أول أمر يُرسل عند بدء المحادثة مع البوت

**الاستخدام:**
```
/start
```

**الوظيفة:**
- ✅ تسجيل المستخدم في قاعدة البيانات (إذا لم يكن مسجلاً)
- ✅ عرض رسالة ترحيب
- ✅ عرض الأوامر المتاحة
- ✅ تحديث آخر نشاط للمستخدم

**الكود:**
```typescript
// src/bot/features/welcome.ts
feature.command('start', logHandle('command-start'), async (ctx) => {
  const prisma = Database.getClient()

  // تسجيل أو تحديث المستخدم
  await prisma.user.upsert({
    where: { telegramId: ctx.from.id },
    update: { lastActiveAt: new Date() },
    create: {
      telegramId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      role: 'GUEST'
    }
  })

  await ctx.reply(ctx.t('welcome'))
})
```

---

#### `/help` - المساعدة

**الوصف:** عرض قائمة الأوامر والمساعدة

**الاستخدام:**
```
/help
```

**مثال الرد:**
```
📚 الأوامر المتاحة:

الأساسية:
/start - بدء البوت
/help - عرض المساعدة
/language - تغيير اللغة
/greeting - محادثة تفاعلية

للمسؤولين:
/admin - لوحة المسؤول
/stats - الإحصائيات
```

---

#### `/language` - تغيير اللغة

**الوصف:** تغيير لغة واجهة البوت

**الاستخدام:**
```
/language
```

**اللغات المتاحة:**
- 🇸🇦 العربية (ar)
- 🇬🇧 الإنجليزية (en)

**الوظيفة:**
- عرض لوحة مفاتيح لاختيار اللغة
- حفظ اللغة المختارة في الجلسة
- تحديث جميع الرسائل للغة الجديدة

**الكود:**
```typescript
// src/bot/features/language.ts
import { createLanguageKeyboard } from '#root/bot/keyboards/language.keyboard.js'

feature.command('language', logHandle('command-language'), async (ctx) => {
  await ctx.reply(ctx.t('language-select'), {
    reply_markup: createLanguageKeyboard()
  })
})

// معالجة اختيار اللغة
bot.callbackQuery(/^language:/, async (ctx) => {
  const lang = ctx.callbackQuery.data.split(':')[1]

  await ctx.i18n.setLocale(lang)
  await ctx.answerCallbackQuery(ctx.t('language-changed'))
  await ctx.editMessageText(ctx.t('language-changed-message'))
})
```

---

### المحادثات التفاعلية (Conversations)

#### `/greeting` - محادثة الترحيب

**الوصف:** محادثة تفاعلية متعددة الخطوات لجمع معلومات المستخدم

**الاستخدام:**
```
/greeting
```

**خطوات المحادثة:**

1. **السؤال عن الاسم:**
   ```
   البوت: What is your name?
   المستخدم: أحمد
   ```

2. **التحية الشخصية:**
   ```
   البوت: Nice to meet you, أحمد!
   ```

**الكود:**
```typescript
// src/modules/interaction/wizards/greeting.ts

async function greeting(conversation: MyConversation, ctx: MyContext) {
  // طلب الاسم
  await ctx.reply(ctx.t('greeting-ask-name'))

  // انتظار الرد
  const { message } = await conversation.wait()
  const name = message?.text

  if (!name) {
    await ctx.reply('Please enter your name')
    return
  }

  // الترحيب
  await ctx.reply(ctx.t('greeting-welcome', { name }))
}
```

**المميزات:**
- ✅ تسلسل منطقي للأسئلة
- ✅ التحقق من صحة المدخلات
- ✅ رسائل خطأ واضحة
- ✅ إمكانية الإلغاء في أي وقت

---

### أوامر المسؤولين

#### `/admin` - لوحة المسؤول

**الوصف:** لوحة تحكم خاصة بالمسؤولين فقط

**الاستخدام:**
```
/admin
```

**الصلاحية:** يجب أن يكون User ID مسجل في `BOT_ADMINS`

**الوظائف المتاحة:**
- 📊 عرض إحصائيات المستخدمين
- 👥 إدارة المستخدمين
- 🔔 إرسال رسائل جماعية
- ⚙️ إعدادات البوت

**مثال:**
```typescript
import { isAdmin } from '#root/bot/filters/is-admin.filter.js'

feature.command('admin', isAdmin, logHandle('command-admin'), async (ctx) => {
  const keyboard = new InlineKeyboard()
    .text('📊 الإحصائيات', 'admin:stats')
    .text('👥 المستخدمين', 'admin:users')
    .row()
    .text('🔔 رسالة جماعية', 'admin:broadcast')
    .text('⚙️ الإعدادات', 'admin:settings')

  await ctx.reply('لوحة تحكم المسؤول:', {
    reply_markup: keyboard
  })
})
```

---

#### `/stats` - الإحصائيات

**الوصف:** عرض إحصائيات تفصيلية عن البوت

**الاستخدام:**
```
/stats
```

**الصلاحية:** للمسؤولين فقط

**المعلومات المعروضة:**

```
📊 إحصائيات البوت
━━━━━━━━━━━━━━━━━━━━

👥 المستخدمين:
   • إجمالي: 1,234
   • نشط: 856
   • غير نشط: 378

👑 حسب الدور:
   • مسؤولين: 5
   • موظفين: 23
   • زوار: 1,206

📅 اليوم:
   • مستخدمين جدد: 12
   • رسائل مستلمة: 3,456

⏰ آخر تحديث: 2025-01-18 15:30
```

**الكود:**
```typescript
feature.command('stats', isAdmin, async (ctx) => {
  const prisma = Database.getClient()

  const total = await prisma.user.count()
  const active = await prisma.user.count({ where: { isActive: true } })
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } })

  const message = `
📊 إحصائيات البوت
━━━━━━━━━━━━━━━━━━━━

👥 المستخدمين:
   • إجمالي: ${total}
   • نشط: ${active}
   • غير نشط: ${total - active}

👑 حسب الدور:
   • مسؤولين: ${admins}
   • موظفين: ${employees}
   • زوار: ${guests}
  `.trim()

  await ctx.reply(message)
})
```

---

## ⌨️ لوحات المفاتيح (Keyboards)

### Inline Keyboards

#### لوحة اختيار اللغة

```typescript
// src/bot/keyboards/language.keyboard.ts

import { languageData } from '#root/bot/callback-data/language.data.js'
import { InlineKeyboard } from 'grammy'

export function createLanguageKeyboard() {
  return new InlineKeyboard()
    .text('🇸🇦 العربية', languageData.create('ar'))
    .text('🇬🇧 English', languageData.create('en'))
}
```

**الاستخدام:**
```typescript
await ctx.reply('اختر لغتك:', {
  reply_markup: createLanguageKeyboard()
})
```

---

#### لوحة التأكيد

```typescript
export function createConfirmationKeyboard(action: string, itemId: number) {
  return new InlineKeyboard()
    .text('✅ نعم', `confirm:${action}:${itemId}`)
    .text('❌ لا', 'confirm:cancel')
}
```

**الاستخدام:**
```typescript
await ctx.reply(
  'هل أنت متأكد من الحذف؟',
  { reply_markup: createConfirmationKeyboard('delete', 123) }
)
```

---

### Reply Keyboards

#### لوحة القائمة الرئيسية

```typescript
export function createMainMenuKeyboard() {
  return new Keyboard()
    .text('📊 الإحصائيات')
    .text('⚙️ الإعدادات')
    .row()
    .text('👤 الملف الشخصي')
    .text('❓ المساعدة')
    .resized()
    .persistent()
}
```

**الاستخدام:**
```typescript
await ctx.reply('القائمة الرئيسية:', {
  reply_markup: createMainMenuKeyboard()
})
```

---

## 🔍 معالجة أنواع الرسائل

### الرسائل النصية

```typescript
// معالجة رسالة تحتوي على نص معين
bot.hears('مرحباً', async (ctx) => {
  await ctx.reply('مرحباً بك! 👋')
})

// معالجة رسالة بنمط معين
bot.hears(/^\/custom_(.+)/, async (ctx) => {
  const param = ctx.match[1]
  await ctx.reply(`معامل: ${param}`)
})
```

### الصور

```typescript
bot.on('message:photo', async (ctx) => {
  const photo = ctx.message.photo[ctx.message.photo.length - 1]
  const fileId = photo.file_id

  await ctx.reply(`تم استلام صورة! File ID: ${fileId}`)

  // معالجة الصورة...
})
```

### الملفات

```typescript
bot.on('message:document', async (ctx) => {
  const document = ctx.message.document
  const fileName = document.file_name
  const fileSize = document.file_size

  if (fileSize > 10 * 1024 * 1024) {
    return ctx.reply('❌ الملف كبير جداً (أكثر من 10MB)')
  }

  await ctx.reply(`تم استلام ملف: ${fileName}`)

  // معالجة الملف...
})
```

### الموقع

```typescript
bot.on('message:location', async (ctx) => {
  const { latitude, longitude } = ctx.message.location

  await ctx.reply(
    `تم استلام موقعك:\n`
    + `خط العرض: ${latitude}\n`
    + `خط الطول: ${longitude}`
  )
})
```

### جهات الاتصال

```typescript
bot.on('message:contact', async (ctx) => {
  const contact = ctx.message.contact

  await ctx.reply(
    `تم استلام جهة اتصال:\n`
    + `الاسم: ${contact.first_name} ${contact.last_name || ''}\n`
    + `الهاتف: ${contact.phone_number}`
  )
})
```

---

## 🎭 الفلاتر (Filters)

### فلتر المحادثات الخاصة

```typescript
// تنفيذ الأمر في المحادثات الخاصة فقط
const feature = composer.chatType('private')

feature.command('private_only', async (ctx) => {
  await ctx.reply('هذا الأمر يعمل في المحادثات الخاصة فقط')
})
```

### فلتر المجموعات

```typescript
// تنفيذ الأمر في المجموعات فقط
const groupFeature = composer.chatType(['group', 'supergroup'])

groupFeature.command('group_only', async (ctx) => {
  await ctx.reply('هذا الأمر يعمل في المجموعات فقط')
})
```

### فلتر المسؤولين

```typescript
// src/bot/filters/is-admin.filter.ts

export function isAdmin(ctx: Context) {
  return ctx.config.botAdmins.includes(ctx.from!.id)
}

// الاستخدام
feature.command('admin_command', isAdmin, async (ctx) => {
  await ctx.reply('مرحباً أيها المسؤول!')
})
```

### فلتر مخصص

```typescript
// فلتر للمستخدمين المشتركين فقط
async function isSubscribed(ctx: Context): Promise<boolean> {
  const prisma = Database.getClient()

  const user = await prisma.user.findUnique({
    where: { telegramId: ctx.from.id }
  })

  return user?.isActive === true
}

// الاستخدام
feature.command('premium', async (ctx, next) => {
  if (!await isSubscribed(ctx)) {
    return ctx.reply('⚠️ يجب الاشتراك أولاً!')
  }

  return next()
}, async (ctx) => {
  await ctx.reply('مرحباً بك في المحتوى الحصري!')
})
```

---

## 🔔 معالجة Callback Queries

### معالجة بسيطة

```typescript
bot.callbackQuery('button_id', async (ctx) => {
  await ctx.answerCallbackQuery('تم الضغط!')
  await ctx.editMessageText('تم اختيار الزر')
})
```

### معالجة بنمط (Pattern)

```typescript
// معالجة كل callback تبدأ بـ "action:"
bot.callbackQuery(/^action:/, async (ctx) => {
  const [_, action, id] = ctx.callbackQuery.data.split(':')

  await ctx.answerCallbackQuery()

  switch (action) {
    case 'view':
      await showItem(ctx, Number.parseInt(id))
      break
    case 'edit':
      await editItem(ctx, Number.parseInt(id))
      break
    case 'delete':
      await deleteItem(ctx, Number.parseInt(id))
      break
  }
})
```

### callback مع تأكيد

```typescript
bot.callbackQuery(/^delete:/, async (ctx) => {
  const itemId = Number.parseInt(ctx.callbackQuery.data.split(':')[1])

  // عرض رسالة تأكيد
  await ctx.editMessageText(
    '⚠️ هل أنت متأكد من الحذف؟',
    {
      reply_markup: new InlineKeyboard()
        .text('✅ نعم', `confirm_delete:${itemId}`)
        .text('❌ لا', 'cancel_delete')
    }
  )

  await ctx.answerCallbackQuery()
})

// معالجة التأكيد
bot.callbackQuery(/^confirm_delete:/, async (ctx) => {
  const itemId = Number.parseInt(ctx.callbackQuery.data.split(':')[1])

  // تنفيذ الحذف
  await deleteItemFromDatabase(itemId)

  await ctx.editMessageText('✅ تم الحذف بنجاح')
  await ctx.answerCallbackQuery('تم الحذف')
})

// معالجة الإلغاء
bot.callbackQuery('cancel_delete', async (ctx) => {
  await ctx.editMessageText('❌ تم الإلغاء')
  await ctx.answerCallbackQuery('تم الإلغاء')
})
```

---

## 🚫 معالجة الرسائل غير المعروفة

```typescript
// src/bot/features/unhandled.ts

const composer = new Composer<Context>()
const feature = composer.chatType('private')

// آخر handler - يُنفذ إذا لم يتطابق أي handler آخر
feature.on('message', logHandle('unhandled-message'), async (ctx) => {
  await ctx.reply(
    `${ctx.t('unhandled-message')}\n\n`
    + `استخدم /help لعرض الأوامر المتاحة.`
  )
})

export { composer as unhandledFeature }
```

---

## 🎯 ميزات متقدمة

### الرسائل الجماعية (Broadcast)

```typescript
async function broadcastMessage(
  bot: Bot,
  message: string,
  filter?: (user: User) => boolean
) {
  const prisma = Database.getClient()

  // الحصول على المستخدمين
  let users = await prisma.user.findMany({
    where: { isActive: true }
  })

  // تطبيق فلتر إضافي إذا وُجد
  if (filter) {
    users = users.filter(filter)
  }

  // إرسال الرسالة
  let sent = 0
  let failed = 0

  for (const user of users) {
    try {
      await bot.api.sendMessage(user.telegramId, message)
      sent++

      // تأخير بسيط لتجنب Rate Limiting
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    catch (error) {
      failed++
    }
  }

  return { sent, failed, total: users.length }
}

// الاستخدام
feature.command('broadcast', isAdmin, async (ctx) => {
  const message = ctx.match

  if (!message) {
    return ctx.reply('الاستخدام: /broadcast <رسالتك>')
  }

  await ctx.reply('⏳ جاري الإرسال...')

  const result = await broadcastMessage(ctx.bot, message)

  await ctx.reply(
    `✅ تم الإرسال:\n`
    + `• نجح: ${result.sent}\n`
    + `• فشل: ${result.failed}\n`
    + `• الإجمالي: ${result.total}`
  )
})
```

---

## 📊 التقارير

### تقرير المستخدم

```typescript
async function generateUserReport(userId: number): Promise<string> {
  const prisma = Database.getClient()

  const user = await prisma.user.findUnique({
    where: { telegramId: userId }
  })

  if (!user) {
    return '❌ المستخدم غير موجود'
  }

  return `
📊 **تقرير المستخدم**
━━━━━━━━━━━━━━━━━━━━━━━━

👤 **المعلومات:**
   • الاسم: ${user.firstName || 'غير محدد'}
   • المعرف: \`${user.telegramId}\`
   • اسم المستخدم: @${user.username || 'لا يوجد'}

👑 **الدور:** ${getRoleEmoji(user.role)} ${user.role}

📅 **التواريخ:**
   • التسجيل: ${formatDate(user.createdAt)}
   • آخر نشاط: ${formatDate(user.lastActiveAt)}

✅ **الحالة:** ${user.isActive ? '🟢 نشط' : '🔴 غير نشط'}
  `.trim()
}

// الاستخدام
feature.command('myinfo', async (ctx) => {
  const report = await generateUserReport(ctx.from.id)
  await ctx.reply(report, { parse_mode: 'Markdown' })
})
```

---

## 🎓 الخطوات التالية

بعد فهم ميزات البوت:

1. [📦 تعرف على الوحدات والخدمات](./06-modules.md)
2. [🛠️ ابدأ التطوير](./07-development-guide.md)
3. [🚀 تعلم كيفية النشر](./08-deployment.md)

---

[⬅️ السابق: قاعدة البيانات](./04-database.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: الوحدات](./06-modules.md)
