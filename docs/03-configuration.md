# 3️⃣ الإعدادات والتكوين - Configuration

## 📝 نظرة عامة

المشروع يستخدم **متغيرات البيئة** (Environment Variables) لإدارة الإعدادات. هذا يسمح بـ:
- ✅ فصل الإعدادات عن الكود
- ✅ إعدادات مختلفة لكل بيئة (تطوير/إنتاج)
- ✅ حماية المعلومات الحساسة (Tokens, Secrets)

---

## 🔐 ملف `.env`

### إنشاء الملف

```bash
# نسخ المثال
cp .env.example .env
```

### البنية الكاملة

```env
# ════════════════════════════════════════════════════════════
# 🤖 إعدادات البوت - Bot Configuration
# ════════════════════════════════════════════════════════════

# Token البوت من @BotFather (مطلوب)
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# وضع التشغيل: polling أو webhook (مطلوب)
BOT_MODE=polling

# معرفات المسؤولين (اختياري)
# مصفوفة JSON تحتوي على Telegram User IDs
BOT_ADMINS=[123456789, 987654321]

# أنواع التحديثات المسموحة (اختياري)
# مصفوفة JSON - اتركها فارغة [] لاستقبال كل التحديثات
BOT_ALLOWED_UPDATES=["message", "callback_query", "inline_query"]

# ════════════════════════════════════════════════════════════
# 🗄️ إعدادات قاعدة البيانات - Database Configuration
# ════════════════════════════════════════════════════════════

# مسار قاعدة البيانات (مطلوب)
# SQLite (افتراضي للتطوير)
DATABASE_URL="file:./dev.db"

# PostgreSQL (للإنتاج)
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# MySQL (بديل)
# DATABASE_URL="mysql://user:password@localhost:3306/dbname"

# ════════════════════════════════════════════════════════════
# 📊 إعدادات التطبيق - Application Settings
# ════════════════════════════════════════════════════════════

# مستوى السجلات (اختياري)
# الخيارات: trace, debug, info, warn, error, fatal, silent
# افتراضي: info
LOG_LEVEL=info

# وضع التصحيح (اختياري)
# true = تفعيل السجلات التفصيلية والميزات التطويرية
# false = وضع الإنتاج
# افتراضي: false
DEBUG=false

# ════════════════════════════════════════════════════════════
# 🌐 إعدادات الخادم - Server Settings (Webhook فقط)
# ════════════════════════════════════════════════════════════

# عنوان Webhook (مطلوب في وضع webhook)
# يجب أن يكون HTTPS صحيح
# BOT_WEBHOOK=https://yourdomain.com/webhook

# مفتاح سري للـ Webhook (مطلوب في وضع webhook)
# يجب أن يكون 12 حرف على الأقل
# BOT_WEBHOOK_SECRET=my-super-secret-token-123

# عنوان IP للخادم (اختياري)
# افتراضي: 0.0.0.0
# SERVER_HOST=0.0.0.0

# منفذ الخادم (اختياري)
# افتراضي: 80
# SERVER_PORT=80

# ════════════════════════════════════════════════════════════
# 🌍 إعدادات أخرى - Other Settings
# ════════════════════════════════════════════════════════════

# المنطقة الزمنية (اختياري)
# TZ=Asia/Riyadh

# Node Environment (اختياري)
# NODE_ENV=development
```

---

## 📋 شرح المتغيرات

### 🤖 إعدادات البوت

#### `BOT_TOKEN` (مطلوب)

**الوصف:** Token البوت من BotFather

**الحصول عليه:**
1. افتح [@BotFather](https://t.me/BotFather)
2. أرسل `/newbot`
3. اتبع التعليمات
4. ستحصل على Token

**مثال:**
```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
```

**التنسيق:** `<bot_id>:<secret_token>`

**⚠️ تحذير:** لا تشارك هذا Token أبداً!

---

#### `BOT_MODE` (مطلوب)

**الوصف:** طريقة استقبال التحديثات

**الخيارات:**

| الوضع | الوصف | متى تستخدمه |
|------|-------|-------------|
| `polling` | البوت يسأل Telegram بشكل دوري | التطوير المحلي |
| `webhook` | Telegram يرسل التحديثات للخادم | الإنتاج |

**مثال:**
```env
# للتطوير
BOT_MODE=polling

# للإنتاج
BOT_MODE=webhook
```

**المقارنة:**

**Polling:**
- ✅ سهل الإعداد
- ✅ يعمل محلياً
- ❌ استهلاك موارد أكثر
- ❌ تأخير في الاستجابة

**Webhook:**
- ✅ استجابة فورية
- ✅ استهلاك أقل
- ❌ يحتاج HTTPS
- ❌ يحتاج دومين عام

---

#### `BOT_ADMINS` (اختياري)

**الوصف:** قائمة معرفات المسؤولين

**التنسيق:** مصفوفة JSON من الأرقام

**الحصول على User ID:**
1. أرسل أي رسالة للبوت
2. شغل البوت في DEBUG mode
3. ستجد User ID في السجلات

أو استخدم [@userinfobot](https://t.me/userinfobot)

**مثال:**
```env
# مسؤول واحد
BOT_ADMINS=[123456789]

# عدة مسؤولين
BOT_ADMINS=[123456789, 987654321, 555666777]

# بدون مسؤولين (افتراضي)
BOT_ADMINS=[]
```

**الاستخدام:**
- تنفيذ أوامر الإدارة
- الوصول للميزات الخاصة
- إدارة البوت

---

#### `BOT_ALLOWED_UPDATES` (اختياري)

**الوصف:** أنواع التحديثات التي يستقبلها البوت

**الخيارات المتاحة:**
- `message` - الرسائل العادية
- `edited_message` - رسائل معدلة
- `channel_post` - منشورات القنوات
- `edited_channel_post` - منشورات معدلة
- `inline_query` - استعلامات Inline
- `chosen_inline_result` - نتائج Inline مختارة
- `callback_query` - أزرار Callback
- `shipping_query` - استعلامات الشحن
- `pre_checkout_query` - استعلامات الدفع
- `poll` - استطلاعات رأي
- `poll_answer` - إجابات استطلاعات
- `my_chat_member` - تغييرات عضوية البوت
- `chat_member` - تغييرات الأعضاء
- `chat_join_request` - طلبات الانضمام

**مثال:**
```env
# كل التحديثات (افتراضي)
BOT_ALLOWED_UPDATES=[]

# رسائل وأزرار فقط
BOT_ALLOWED_UPDATES=["message", "callback_query"]

# كل شيء ما عدا الـ polls
BOT_ALLOWED_UPDATES=["message", "callback_query", "inline_query"]
```

**💡 نصيحة:** حدد فقط ما تحتاجه لتحسين الأداء

---

### 🗄️ إعدادات قاعدة البيانات

#### `DATABASE_URL` (مطلوب)

**الوصف:** عنوان الاتصال بقاعدة البيانات

**الأنواع المدعومة:**

##### 1. SQLite (افتراضي)
```env
DATABASE_URL="file:./dev.db"
```
- ✅ سهل للتطوير
- ✅ لا يحتاج تثبيت
- ❌ غير مناسب للإنتاج الكبير

##### 2. PostgreSQL (موصى به للإنتاج)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```
- ✅ قوي وموثوق
- ✅ مناسب للإنتاج
- ❌ يحتاج تثبيت خادم

##### 3. MySQL
```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```
- ✅ شائع الاستخدام
- ✅ جيد للإنتاج
- ❌ يحتاج تثبيت خادم

**تنسيق PostgreSQL/MySQL:**
```
protocol://user:password@host:port/database?options
```

**مثال مع خيارات:**
```env
DATABASE_URL="postgresql://myuser:mypass@localhost:5432/mydb?schema=public&connection_limit=5"
```

---

### 📊 إعدادات التطبيق

#### `LOG_LEVEL` (اختياري)

**الوصف:** مستوى تفاصيل السجلات

**الخيارات (من الأكثر إلى الأقل):**

| المستوى | الوصف | متى تستخدمه |
|---------|-------|-------------|
| `trace` | كل شيء | تصحيح عميق جداً |
| `debug` | معلومات تفصيلية | التطوير |
| `info` | معلومات عامة | الإنتاج (افتراضي) |
| `warn` | تحذيرات فقط | مراقبة خفيفة |
| `error` | أخطاء فقط | الحد الأدنى |
| `fatal` | أخطاء خطيرة فقط | حرجة جداً |
| `silent` | لا شيء | إيقاف السجلات |

**مثال:**
```env
# للتطوير - معلومات تفصيلية
LOG_LEVEL=debug

# للإنتاج - معلومات عامة
LOG_LEVEL=info

# للمراقبة - تحذيرات فقط
LOG_LEVEL=warn
```

**💡 نصيحة:** استخدم `debug` أثناء التطوير و `info` في الإنتاج

---

#### `DEBUG` (اختياري)

**الوصف:** تفعيل وضع التصحيح

**القيم:**
- `true` - تفعيل ميزات التصحيح
- `false` - وضع الإنتاج (افتراضي)

**ماذا يفعل:**
- ✅ يعرض سجلات مفصلة للتحديثات
- ✅ يفعل تسجيل API calls
- ✅ يظهر معلومات إضافية للمطورين

**مثال:**
```env
# للتطوير
DEBUG=true

# للإنتاج
DEBUG=false
```

**⚠️ تحذير:** لا تفعل DEBUG في الإنتاج (يسرب معلومات حساسة)

---

### 🌐 إعدادات الخادم (Webhook)

#### `BOT_WEBHOOK` (مطلوب في وضع webhook)

**الوصف:** عنوان URL الذي سيرسل له Telegram التحديثات

**المتطلبات:**
- ✅ يجب أن يكون HTTPS (وليس HTTP)
- ✅ شهادة SSL صحيحة
- ✅ متاح عبر الإنترنت (ليس localhost)
- ✅ يستجيب بسرعة

**مثال:**
```env
BOT_WEBHOOK=https://mybot.example.com/webhook
```

**⚠️ أخطاء شائعة:**
```env
# ❌ خطأ - HTTP بدلاً من HTTPS
BOT_WEBHOOK=http://mybot.com/webhook

# ❌ خطأ - localhost غير متاح
BOT_WEBHOOK=https://localhost:3000/webhook

# ✅ صحيح
BOT_WEBHOOK=https://mybot.com/webhook
```

---

#### `BOT_WEBHOOK_SECRET` (مطلوب في وضع webhook)

**الوصف:** مفتاح سري للتحقق من أن الطلبات من Telegram

**المتطلبات:**
- ✅ طول 12 حرف على الأقل
- ✅ عشوائي وفريد
- ✅ صعب التخمين

**توليد مفتاح قوي:**

**PowerShell:**
```powershell
# طريقة 1
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# طريقة 2
[guid]::NewGuid().ToString()
```

**Bash/Linux:**
```bash
# طريقة 1
openssl rand -base64 24

# طريقة 2
head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32
```

**مثال:**
```env
BOT_WEBHOOK_SECRET=3x4mpl3-s3cr3t-t0k3n-abc123xyz
```

---

#### `SERVER_HOST` (اختياري)

**الوصف:** عنوان IP الذي سيستمع عليه الخادم

**القيم الشائعة:**
- `0.0.0.0` - كل الواجهات (افتراضي)
- `127.0.0.1` - localhost فقط
- IP محدد - واجهة محددة

**مثال:**
```env
# كل الواجهات (افتراضي)
SERVER_HOST=0.0.0.0

# localhost فقط
SERVER_HOST=127.0.0.1
```

---

#### `SERVER_PORT` (اختياري)

**الوصف:** المنفذ الذي سيستمع عليه الخادم

**الافتراضي:** `80`

**منافذ شائعة:**
- `80` - HTTP (يحتاج صلاحيات root)
- `443` - HTTPS (يحتاج صلاحيات root)
- `3000` - منفذ تطوير شائع
- `8080` - بديل لـ 80

**مثال:**
```env
# المنفذ الافتراضي
SERVER_PORT=80

# منفذ تطوير
SERVER_PORT=3000
```

---

## 🔧 أمثلة تكوين كاملة

### 1. تطوير محلي (Development)

```env
# Bot
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_MODE=polling
BOT_ADMINS=[123456789]

# Database
DATABASE_URL="file:./dev.db"

# App
LOG_LEVEL=debug
DEBUG=true
```

### 2. إنتاج Polling

```env
# Bot
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_MODE=polling
BOT_ADMINS=[123456789]
BOT_ALLOWED_UPDATES=["message", "callback_query"]

# Database
DATABASE_URL="postgresql://botuser:strongpass@db.server.com:5432/botdb"

# App
LOG_LEVEL=info
DEBUG=false
```

### 3. إنتاج Webhook

```env
# Bot
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_MODE=webhook
BOT_WEBHOOK=https://bot.mycompany.com/webhook
BOT_WEBHOOK_SECRET=ultra-secure-secret-token-xyz123
BOT_ADMINS=[123456789, 987654321]
BOT_ALLOWED_UPDATES=["message", "callback_query"]

# Database
DATABASE_URL="postgresql://botuser:strongpass@db.server.com:5432/botdb"

# Server
SERVER_HOST=0.0.0.0
SERVER_PORT=80

# App
LOG_LEVEL=info
DEBUG=false
```

---

## 🔒 الأمان

### نصائح مهمة:

1. **لا تضع `.env` في Git**
```bash
# .gitignore
.env
.env.local
.env.*.local
```

2. **استخدم .env.example**
```bash
# أنشئ نموذج بدون قيم حساسة
cp .env .env.example
# احذف القيم الحساسة من .env.example
# أضف .env.example إلى Git
```

3. **استخدم أسرار قوية**
```bash
# ❌ ضعيف
BOT_WEBHOOK_SECRET=123456

# ✅ قوي
BOT_WEBHOOK_SECRET=3xAmpl3-5tr0ng-53cr3t-t0k3n-xyz
```

4. **لا تشارك الـ Tokens**
- ❌ لا ترسله في البريد
- ❌ لا تنشره على الإنترنت
- ❌ لا تضعه في الكود
- ✅ احفظه في `.env` فقط

---

## 🎓 الخطوات التالية

الآن بعد فهم الإعدادات:

1. [🗄️ تعلم استخدام قاعدة البيانات](./04-database.md)
2. [🤖 استكشف ميزات البوت](./05-bot-features.md)
3. [📦 تعرف على الوحدات](./06-modules.md)

---

[⬅️ السابق: بنية المشروع](./02-project-structure.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: قاعدة البيانات](./04-database.md)
