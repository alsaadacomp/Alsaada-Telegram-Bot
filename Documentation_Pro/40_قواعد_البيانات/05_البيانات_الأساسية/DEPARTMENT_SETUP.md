# 🚀 تعليمات تشغيل جدول الأقسام

تم إنشاء جدول الأقسام (Department) بنجاح! ✅

## 📋 الملفات التي تم إنشاؤها:

1. ✅ **schema.prisma** - تم تحديثه بـ Model جديد
2. ✅ **migration.sql** - ملف Migration للجدول
3. ✅ **seed-departments.ts** - سكريبت إدخال البيانات

---

## 🔧 خطوات التنفيذ:

### 1️⃣ تطبيق Migration على قاعدة البيانات:

```bash
cd F:\_Alsaada_Telegram_Bot\telegram-bot-template-main
npx prisma migrate deploy
```

أو إذا كنت في وضع التطوير:

```bash
npx prisma migrate dev
```

### 2️⃣ توليد Prisma Client:

```bash
npx prisma generate
```

### 3️⃣ إدخال البيانات الـ 11 قسم:

```bash
npx tsx prisma/seed-departments.ts
```

أو:

```bash
npx ts-node prisma/seed-departments.ts
```

### 4️⃣ التحقق من البيانات في Prisma Studio:

```bash
npx prisma studio
```

---

## 📊 الأقسام التي سيتم إدخالها (11 قسم):

1. الإدارة العليا - TMG
2. الإدارة العامة - ADM
3. الإدارة الهندسية - ENG
4. إدارة المشاريع والإشراف - PRJ
5. إدارة المركبات - VEH
6. إدارة المعدات - EQP
7. إدارة الصيانة - MNT
8. إدارة الخدمات العامة - SER
9. إدارة الأمن والسلامة - SEC
10. إدارة التغذية - CAT
11. إدارة المالية والمحاسبة - FIN

---

## 🎯 الأعمدة في الجدول:

- id (المعرف الفريد)
- name (الاسم بالعربي)
- nameEn (الاسم بالإنجليزي)
- code (الكود - فريد)
- description (الوصف)
- managerId (مدير القسم)
- orderIndex (الترتيب)
- isActive (نشط/غير نشط)
- createdAt (تاريخ الإنشاء)
- updatedAt (آخر تحديث)
- createdBy (من أنشأ السجل)
- updatedBy (من حدّث السجل)

---

## 📝 استخدام الجدول في الكود:

```typescript
import { Database } from '#root/modules/database/index.js'

// الحصول على جميع الأقسام
const departments = await Database.prisma.department.findMany({
  where: { isActive: true },
  orderBy: { orderIndex: 'asc' }
})

// الحصول على قسم معين
const department = await Database.prisma.department.findUnique({
  where: { code: 'ENG' }
})

// إنشاء قسم جديد
const newDept = await Database.prisma.department.create({
  data: {
    name: 'قسم جديد',
    nameEn: 'New Department',
    code: 'NEW',
    description: 'وصف القسم',
    orderIndex: 12
  }
})
```

---

## ✅ بعد التنفيذ:

الجدول جاهز للاستخدام! يمكنك الآن:
- عرض الأقسام في البوت
- إضافة أقسام جديدة
- تعديل بيانات الأقسام
- ربط الموظفين بالأقسام

---

## 🆘 في حالة حدوث مشاكل:

1. تأكد من وجود ملف `.env` مع `DATABASE_URL`
2. تأكد من تثبيت الـ dependencies:
   ```bash
   npm install
   ```
3. امسح المجلد `generated/prisma` وأعد التوليد:
   ```bash
   npx prisma generate
   ```

---

**✨ تم بنجاح! الآن نفّذ الخطوات أعلاه وستكون جاهزاً.**
