# 📘 توثيق تكامل Prisma مع مشروع Telegram Bot Template

## 🧩 نظرة عامة
تم في هذا الدليل توثيق عملية إعداد وتكامل قاعدة البيانات عبر **Prisma ORM** باستخدام **SQLite** داخل مشروع **Telegram Bot Template**.

يهدف هذا التوثيق إلى توضيح خطوات الإنشاء، التهيئة، إنشاء الجداول، وإدارة المهاجرات (migrations)، بالإضافة إلى آلية استدعاء العميل (Prisma Client) داخل المشروع.

---

## 🏗️ الخطوة 1: إنشاء ملف التهيئة الأساسية
تم إنشاء ملف Prisma Schema داخل المسار التالي:
```
prisma/schema.prisma
```
ويحتوي على الإعدادات التالية:
```prisma
// This is your Prisma schema file
// Learn more: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

- **generator client:** يقوم بإنشاء عميل Prisma داخل مجلد `generated/prisma`.
- **datasource db:** يحدد نوع قاعدة البيانات (SQLite) ومصدر الاتصال من متغير البيئة `DATABASE_URL`.

---

## ⚙️ الخطوة 2: إنشاء قاعدة البيانات والمهاجرة الأولى
تم تنفيذ الأمر التالي لإنشاء القاعدة ومزامنتها لأول مرة:
```bash
npx prisma migrate dev --name init
```

📋 **الناتج:**
- تم إنشاء قاعدة البيانات `dev.db` داخل مجلد `prisma`.
- تم إنشاء مجلد المهاجرات: `prisma/migrations/20251016235836_add_user_roles/`
- تم إنشاء العميل في المسار: `generated/prisma`

---

## 🔁 الخطوة 3: إنشاء مهاجرة جديدة (إضافة جدول أو تعديل هيكل)
عند إجراء أي تعديل على ملف `schema.prisma` (مثل إضافة جدول أو حقل جديد)، يتم تنفيذ:
```bash
npx prisma migrate dev --name add_user_roles
```

📌 هذا الأمر يقوم بـ:
1. إنشاء مجلد جديد داخل `prisma/migrations` باسم التعديل.
2. تطبيق التعديلات تلقائيًا على قاعدة البيانات.
3. تحديث عميل Prisma.

---

## 🧱 الخطوة 4: توليد عميل Prisma يدويًا
في حال الحاجة لإعادة توليد العميل بعد أي تعديل، يُستخدم:
```bash
npx prisma generate
```

📋 **الوظيفة:**
- يعيد إنشاء ملفات العميل في المسار المحدد في قسم `generator`.
- يتيح استدعاء الكائنات الخاصة بقاعدة البيانات من الكود البرمجي مباشرة.

---

## 🧩 الخطوة 5: استدعاء Prisma Client في الكود البرمجي
للاستخدام داخل أي ملف JavaScript:
```js
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

// مثال على إدخال مستخدم جديد
await prisma.user.create({
  data: {
    name: 'Saleh Osman',
    role: 'Admin'
  }
});

// استعلام بسيط
const allUsers = await prisma.user.findMany();
console.log(allUsers);
```

---

## 🧰 ملفات المشروع ذات الصلة
| الملف | الوصف |
|--------|--------|
| `.env` | يحتوي على إعداد `DATABASE_URL` المستخدم من Prisma |
| `prisma/schema.prisma` | تعريف الجداول والعلاقات |
| `generated/prisma` | المجلد الناتج عن توليد عميل Prisma |
| `prisma/migrations/` | يحتوي على كل التعديلات الهيكلية (migrations) |

---

## 🧾 ملاحظات تشغيلية
- تأكد من أن مسار القاعدة في `.env` هو:
  ```env
  DATABASE_URL="file:./dev.db"
  ```
- عند تغيير نوع القاعدة إلى PostgreSQL أو MySQL، يتم تعديل `provider` و`url` داخل `schema.prisma` فقط.
- يُفضل إضافة المجلد `generated/prisma` إلى نظام المراقبة git.

---

## ✅ النتيجة النهائية
تم إعداد وتكامل Prisma بنجاح داخل مشروع Telegram Bot Template، مع دعم توليد تلقائي للعميل وتطبيق المهاجرات على قاعدة بيانات SQLite. الآن يمكن إدارة البيانات بسهولة ومرونة ضمن أي وحدة أو ميزة داخل البوت.

