# 1️⃣ البدء السريع - Getting Started

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من توفر التالي على جهازك:

### البرامج المطلوبة

| البرنامج | الإصدار المطلوب | رابط التحميل |
|---------|-----------------|---------------|
| **Node.js** | >= 20.0.0 | [nodejs.org](https://nodejs.org) |
| **npm** | >= 8.0.0 | يأتي مع Node.js |
| **Git** | أحدث إصدار | [git-scm.com](https://git-scm.com) |
| **محرر نصوص** | VS Code (موصى به) | [code.visualstudio.com](https://code.visualstudio.com) |

### الحسابات المطلوبة

- ✅ حساب Telegram
- ✅ بوت Token من [@BotFather](https://t.me/BotFather)

---

## 🚀 خطوات التثبيت

### 1. استنساخ المشروع

```bash
# استنساخ المستودع
git clone <repository-url>

# الانتقال إلى مجلد المشروع
cd telegram-bot-template-main
```

### 2. تثبيت الحزم

```bash
# تثبيت جميع الحزم المطلوبة
npm install
```

سيتم تثبيت:
- ✅ grammY وملحقاته
- ✅ Prisma ORM
- ✅ TypeScript
- ✅ Hono Server
- ✅ Pino Logger
- ✅ وجميع الحزم الأخرى

### 3. إنشاء ملف البيئة

```bash
# نسخ ملف .env المثالي
cp .env.example .env
```

### 4. تعديل ملف .env

افتح ملف `.env` وأضف معلوماتك:

```env
# ════════════════════════════════════════
# Bot Configuration
# ════════════════════════════════════════
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz  # من @BotFather
BOT_MODE=polling                                 # أو webhook
BOT_ADMINS=[123456789]                          # معرفات المسؤولين

# ════════════════════════════════════════
# Database Configuration
# ════════════════════════════════════════
DATABASE_URL="file:./dev.db"                    # مسار قاعدة البيانات

# ════════════════════════════════════════
# Application Settings
# ════════════════════════════════════════
LOG_LEVEL=info                                  # trace, debug, info, warn, error
DEBUG=false                                     # true للتطوير

# ════════════════════════════════════════
# Server Settings (للـ Webhook فقط)
# ════════════════════════════════════════
# BOT_WEBHOOK=https://yourdomain.com/webhook
# BOT_WEBHOOK_SECRET=your-secret-token-min-12-chars
# SERVER_HOST=0.0.0.0
# SERVER_PORT=80
```

### 5. إعداد قاعدة البيانات

```bash
# إنشاء قاعدة البيانات والجداول
npm run prisma:migrate

# (اختياري) ملء البيانات التجريبية
npm run db:seed
```

---

## 🎯 تشغيل البوت

### وضع التطوير (Development)

#### الطريقة 1: البوت + Prisma Studio معاً

```bash
npm run dev
```

هذا الأمر يشغل:
- ✅ البوت في وضع المراقبة (auto-reload)
- ✅ Prisma Studio على http://localhost:5555
- ✅ TypeScript Compiler في وضع المراقبة

#### الطريقة 2: البوت فقط

```bash
npm run dev:bot
```

يشغل البوت فقط بدون Prisma Studio

#### الطريقة 3: Prisma Studio فقط

```bash
npm run prisma:studio
```

### وضع الإنتاج (Production)

```bash
# بناء المشروع
npm run build

# تشغيل البوت
npm start
```

أو التشغيل السريع (بدون فحص الأنواع):

```bash
npm run start:force
```

---

## ✅ التحقق من التثبيت

### 1. تحقق من تشغيل البوت

عند التشغيل الناجح، سترى:

```
[23:26:18.253] INFO: Database connected successfully
[23:26:18.625] INFO: Bot running...
    username: "your_bot_username"
```

### 2. اختبر البوت في Telegram

1. افتح Telegram
2. ابحث عن البوت الخاص بك
3. أرسل الأمر `/start`
4. يجب أن يرد البوت بـ "Welcome!"

### 3. تحقق من Prisma Studio

افتح المتصفح على: http://localhost:5555

يجب أن ترى واجهة Prisma Studio مع جداول قاعدة البيانات.

---

## 🛠️ الأوامر المتاحة

### أوامر التطوير

```bash
# تشغيل البوت في وضع التطوير
npm run dev              # البوت + Prisma Studio
npm run dev:bot          # البوت فقط

# فحص الكود
npm run lint             # فحص الأخطاء
npm run format           # تنسيق الكود
npm run typecheck        # فحص الأنواع TypeScript
```

### أوامر قاعدة البيانات

```bash
npm run prisma:generate  # توليد Prisma Client
npm run prisma:migrate   # تنفيذ Migration جديد
npm run prisma:studio    # فتح Prisma Studio
npm run db:push          # دفع التغييرات للقاعدة
npm run db:seed          # ملء بيانات تجريبية
```

### أوامر الإنتاج

```bash
npm run build            # بناء المشروع
npm start                # تشغيل البوت (مع فحص الأنواع)
npm run start:force      # تشغيل سريع (بدون فحص)
```

---

## 🐛 حل المشاكل الشائعة

### ❌ خطأ: "Cannot find module"

**الحل:**
```bash
# إعادة تثبيت الحزم
rm -rf node_modules package-lock.json
npm install

# توليد Prisma Client
npm run prisma:generate
```

### ❌ خطأ: "Invalid token"

**السبب:** Token البوت غير صحيح

**الحل:**
1. تحقق من ملف `.env`
2. تأكد من أن `BOT_TOKEN` صحيح
3. احصل على Token جديد من [@BotFather](https://t.me/BotFather)

### ❌ خطأ: "Database not connected"

**الحل:**
```bash
# تأكد من تشغيل Migration
npm run prisma:migrate

# أو دفع Schema مباشرة
npm run db:push
```

### ❌ خطأ: "Port already in use"

**السبب:** Prisma Studio أو البوت يعمل بالفعل

**الحل:**
```bash
# Windows
netstat -ano | findstr :5555
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5555 | xargs kill -9
```

### ❌ البوت لا يستجيب

**تحقق من:**
1. ✅ البوت يعمل بدون أخطاء
2. ✅ Token صحيح
3. ✅ الاتصال بالإنترنت
4. ✅ البوت ليس محظوراً

---

## 📝 ملاحظات هامة

### حول وضع Polling vs Webhook

**Polling Mode** (الوضع الافتراضي):
- ✅ سهل الإعداد للتطوير
- ✅ لا يحتاج خادم عام
- ✅ مثالي للتطوير المحلي
- ❌ استهلاك موارد أكثر

**Webhook Mode**:
- ✅ أفضل للإنتاج
- ✅ استهلاك موارد أقل
- ❌ يحتاج HTTPS ودومين
- ❌ إعداد أكثر تعقيداً

### حول قاعدة البيانات

- افتراضياً: SQLite (ملف محلي)
- يمكن تغييرها إلى PostgreSQL أو MySQL
- الملف: `prisma/schema.prisma`

### حول Prisma Studio

- أداة مرئية لإدارة القاعدة
- تعمل على: http://localhost:5555
- تشغل تلقائياً مع `npm run dev`

---

## 🎓 الخطوات التالية

بعد إتمام التثبيت بنجاح:

1. [📂 تعرف على بنية المشروع](./02-project-structure.md)
2. [⚙️ فهم الإعدادات والتكوين](./03-configuration.md)
3. [🗄️ تعلم كيفية استخدام قاعدة البيانات](./04-database.md)
4. [🤖 اكتشف ميزات البوت](./05-bot-features.md)

---

[⬅️ العودة للفهرس](./README.md) | [➡️ التالي: بنية المشروع](./02-project-structure.md)
