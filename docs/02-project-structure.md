# 2️⃣ بنية المشروع - Project Structure

## 📂 نظرة عامة على الهيكل

```
telegram-bot-template-main/
│
├── 📁 src/                          # الكود المصدري الرئيسي
│   ├── 📁 bot/                      # كل ما يتعلق بالبوت
│   ├── 📁 modules/                  # الوحدات والخدمات
│   ├── 📁 server/                   # خادم الويب (Webhook)
│   ├── 📄 config.ts                 # إعدادات التطبيق
│   └── 📄 main.ts                   # نقطة الدخول الرئيسية
│
├── 📁 prisma/                       # قاعدة البيانات
│   ├── 📄 schema.prisma            # مخطط القاعدة
│   └── 📄 seed.ts                  # بيانات أولية
│
├── 📁 generated/                    # ملفات مولدة تلقائياً
│   └── 📁 prisma/                  # Prisma Client
│
├── 📁 locales/                      # ملفات الترجمة
│   ├── 📄 ar.ftl                   # العربية
│   └── 📄 en.ftl                   # الإنجليزية
│
├── 📁 docs/                         # التوثيق (هذا المجلد)
│
├── 📄 .env                          # متغيرات البيئة (غير مضمن في Git)
├── 📄 .env.example                  # مثال لملف .env
├── 📄 package.json                  # معلومات المشروع والحزم
├── 📄 tsconfig.json                 # إعدادات TypeScript
└── 📄 README.md                     # الملف التعريفي

```

---

## 📁 شرح المجلدات الرئيسية

### 1. مجلد `src/` - الكود المصدري

#### 📁 `src/bot/` - منطق البوت

```
src/bot/
├── 📁 callback-data/        # بناة بيانات Callback
│   └── language.data.ts     # بيانات تغيير اللغة
│
├── 📁 conversations/         # المحادثات التفاعلية
│   └── index.ts             # تصدير المحادثات
│
├── 📁 features/             # ميزات البوت
│   ├── admin.ts             # ميزات المسؤولين
│   ├── language.ts          # تغيير اللغة
│   ├── unhandled.ts         # معالجة الرسائل غير المعروفة
│   └── welcome.ts           # الترحيب والأوامر الأساسية
│
├── 📁 filters/              # فلاتر التحديثات
│   └── is-admin.filter.ts   # فلتر المسؤولين
│
├── 📁 handlers/             # معالجات الأحداث
│   └── error.ts             # معالجة الأخطاء
│
├── 📁 helpers/              # دوال مساعدة
│   └── logging.ts           # سجلات التصحيح
│
├── 📁 keyboards/            # لوحات المفاتيح
│   ├── language.keyboard.ts # لوحة اختيار اللغة
│   └── remove.keyboard.ts   # إزالة اللوحة
│
├── 📁 middlewares/          # Middlewares البوت
│   ├── session.ts           # إدارة الجلسات
│   └── update-logger.ts     # تسجيل التحديثات
│
├── 📄 context.ts            # تعريف Context
└── 📄 index.ts              # إنشاء وإعداد البوت
```

**الوظيفة:**
- يحتوي على كل ما يتعلق بمنطق البوت
- منظم حسب الوظائف (features)
- يستخدم نمط Composer لتنظيم الأوامر

#### 📁 `src/modules/` - الوحدات والخدمات

```
src/modules/
├── 📁 database/              # وحدة قاعدة البيانات
│   ├── 📁 backup/           # نسخ احتياطية
│   ├── 📁 cache/            # التخزين المؤقت
│   ├── 📁 repositories/     # نمط Repository
│   ├── 📁 transactions/     # المعاملات المعقدة
│   └── 📄 index.ts          # Database Class الرئيسي
│
├── 📁 input/                 # معالجة المدخلات
│   ├── 📁 parsers/          # محللات البيانات
│   └── 📁 validators/       # محققات الصحة
│
├── 📁 interaction/           # التفاعلات
│   ├── 📁 confirmations/    # رسائل التأكيد
│   ├── 📁 menus/            # القوائم
│   ├── 📁 navigation/       # التنقل
│   └── 📁 wizards/          # المعالجات التفاعلية
│       └── greeting.ts      # مثال: محادثة الترحيب
│
├── 📁 reports/               # التقارير
│   └── 📁 generators/       # مولدات التقارير
│
└── 📁 services/              # الخدمات
    ├── 📁 i18n-extended/    # التعدد اللغوي
    │   ├── i18n.ts          # إعداد i18n
    │   └── helpers.ts       # دوال مساعدة
    ├── 📁 logger/           # خدمة السجلات
    │   └── index.ts         # Pino Logger
    ├── 📁 permissions/      # الصلاحيات
    │   └── role-manager.ts  # إدارة الأدوار
    └── 📁 scheduler/        # المهام المجدولة
        └── task-manager.ts  # إدارة المهام
```

**الوظيفة:**
- وحدات مستقلة قابلة لإعادة الاستخدام
- خدمات مشتركة عبر التطبيق
- منطق العمل الأساسي

#### 📁 `src/server/` - خادم الويب

```
src/server/
├── 📁 middlewares/          # Middlewares الخادم
│   └── telegram-auth.ts     # مصادقة Telegram
│
└── 📄 index.ts              # إعداد خادم Hono
```

**الوظيفة:**
- خادم HTTP لوضع Webhook
- مبني على Hono (سريع وخفيف)
- يستقبل تحديثات Telegram

---

## 📄 الملفات الرئيسية

### `src/main.ts` - نقطة البداية

```typescript
// ملف main.ts هو نقطة الدخول الرئيسية للتطبيق
// يقوم بـ:
// 1. تحميل الإعدادات
// 2. الاتصال بقاعدة البيانات
// 3. إنشاء البوت
// 4. بدء التشغيل (Polling أو Webhook)
// 5. إعداد Graceful Shutdown
```

**المسؤوليات:**
- ✅ تهيئة التطبيق
- ✅ إدارة دورة حياة البوت
- ✅ معالجة الإغلاق الآمن

### `src/config.ts` - الإعدادات

```typescript
// تحميل وتحقق من متغيرات البيئة
// يستخدم مكتبة Valibot للتحقق
// يوفر أنواع TypeScript قوية
```

**المسؤوليات:**
- ✅ تحميل `.env`
- ✅ التحقق من صحة المتغيرات
- ✅ توفير إعدادات مكتوبة

### `src/bot/context.ts` - سياق البوت

```typescript
export interface Context extends GrammyContext {
  // إضافات مخصصة للـ Context
  config: Config
  logger: Logger
  // ... المزيد
}
```

**الوظيفة:**
- يحدد نوع Context المستخدم في كل معالجات البوت
- يضيف خصائص مخصصة (config, logger, etc.)
- يستخدم في كل دالة معالجة

---

## 🗄️ مجلد `prisma/`

### `prisma/schema.prisma` - المخطط

```prisma
// تعريف نماذج قاعدة البيانات
// مثال: User, Role, etc.

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  telegramId   BigInt    @unique
  username     String?   @unique
  firstName    String?
  role         Role      @default(GUEST)
  // ...
}
```

**الوظيفة:**
- يحدد بنية قاعدة البيانات
- يستخدم لتوليد Migrations
- يولد Prisma Client

### `prisma/seed.ts` - البيانات الأولية

```typescript
// ملء قاعدة البيانات ببيانات تجريبية
// يُشغل بأمر: npm run db:seed
```

---

## 🌍 مجلد `locales/` - الترجمات

```
locales/
├── ar.ftl    # اللغة العربية
└── en.ftl    # اللغة الإنجليزية
```

**صيغة الملفات (Fluent):**

```fluent
# en.ftl
welcome = Welcome!
language-select = Please select your language:

# ar.ftl
welcome = مرحباً!
language-select = الرجاء اختيار لغتك:
```

---

## ⚙️ ملفات الإعداد

### `package.json`

```json
{
  "name": "telegram-bot-template",
  "type": "module", // مهم: ES Modules
  "imports": {
    "#root/*": "./src/*" // مسارات مختصرة
  },
  "scripts": {
    // أوامر المشروع
  }
}
```

**ملاحظات:**
- `"type": "module"` لدعم ES Modules
- `imports` للمسارات المختصرة (#root)

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "paths": {
      "#root/*": ["./src/*"] // مطابق لـ package.json
    }
    // ...
  }
}
```

**ملاحظات:**
- `NodeNext` لدعم ES Modules
- `paths` يجب أن يطابق package.json

---

## 🎯 نمط التنظيم المتبع

### 1. **Feature-Based Organization**

الميزات منظمة في مجلدات منفصلة:
- ✅ كل ميزة في ملف مستقل
- ✅ سهولة الإضافة/الحذف
- ✅ عزل المسؤوليات

### 2. **Modular Architecture**

الوحدات مستقلة وقابلة لإعادة الاستخدام:
- ✅ Database module
- ✅ Logger service
- ✅ i18n service
- ✅ Permissions system

### 3. **Type Safety**

TypeScript في كل مكان:
- ✅ أنواع قوية للـ Context
- ✅ أنواع Prisma المولدة
- ✅ أنواع للإعدادات

### 4. **Separation of Concerns**

فصل واضح بين:
- 🔵 Bot Logic (src/bot)
- 🟢 Business Logic (src/modules)
- 🟡 Infrastructure (src/server, prisma)

---

## 🔄 تدفق التطبيق

```
1. main.ts يبدأ التطبيق
   ↓
2. تحميل config.ts (الإعدادات)
   ↓
3. Database.connect() (الاتصال بالقاعدة)
   ↓
4. createBot() (إنشاء البوت)
   ↓
5. تسجيل Features & Middlewares
   ↓
6. بدء Polling أو Webhook
   ↓
7. استقبال ومعالجة التحديثات
```

---

## 📝 أفضل الممارسات

### عند إضافة ملفات جديدة:

1. **Features** → `src/bot/features/`
2. **Middlewares** → `src/bot/middlewares/`
3. **Services** → `src/modules/services/`
4. **Database Logic** → `src/modules/database/`
5. **Conversations** → `src/modules/interaction/wizards/`

### القواعد العامة:

✅ **استخدم TypeScript دائماً**
✅ **اتبع نمط Composer لتنظيم الأوامر**
✅ **افصل منطق العمل عن منطق البوت**
✅ **استخدم async/await للعمليات غير المتزامنة**
✅ **أضف تعليقات للكود المعقد**
✅ **اتبع نمط التسمية المتبع**

---

## 🎓 الخطوات التالية

الآن بعد فهم بنية المشروع:

1. [⚙️ تعرف على الإعدادات](./03-configuration.md)
2. [🗄️ تعلم استخدام قاعدة البيانات](./04-database.md)
3. [🤖 استكشف ميزات البوت](./05-bot-features.md)

---

[⬅️ السابق: البدء السريع](./01-getting-started.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: الإعدادات](./03-configuration.md)
