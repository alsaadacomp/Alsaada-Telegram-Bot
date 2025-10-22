# 🚀 تعليمات تشغيل جدول الوظائف

تم إنشاء جدول الوظائف (Position) بنجاح! ✅

## 📋 الملفات التي تم إنشاؤها:

1. ✅ **schema.prisma** - تم تحديثه بـ Model Position
2. ✅ **migration.sql** - ملف Migration للجدول
3. ✅ **seed-positions.ts** - سكريبت إدخال الوظائف (23 وظيفة)

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

### 3️⃣ إدخال البيانات (23 وظيفة):

```bash
npx tsx prisma/seed-positions.ts
```

### 4️⃣ التحقق من البيانات في Prisma Studio:

```bash
npx prisma studio
```

---

## 📊 الوظائف التي سيتم إدخالها (23 وظيفة):

### 🍳 إدارة التغذية (CAT) - 2 وظيفة:
- CAT-01: Cook / طباخ
- CAT-02: Catering Chef / رئيس طهاة

### 🔧 إدارة الصيانة (MNT) - 4 وظائف:
- MNT-01: General Maintenance Assistant / مساعد صيانة عامة
- MNT-02: Equipment Maintenance Technician / فني صيانة معدات
- MNT-03: Loader Maintenance Technician / فني صيانة لودر
- MNT-04: Car Maintenance Technician / فني صيانة سيارات

### ⚙️ إدارة المعدات (EQP) - 3 وظائف:
- EQP-01: Excavator Driver / سائق حفار
- EQP-02: Bulldozer Driver / سائق بلدوزر
- EQP-03: Loader Driver / سائق لودر

### 🚗 إدارة المركبات (VEH) - 2 وظيفة:
- VEH-01: Site Service Car Driver / سائق سيارة خدمة
- VEH-02: Dump Truck Driver / سائق قلاب

### 📐 إدارة المشاريع والإشراف (PRJ) - 2 وظيفة:
- PRJ-01: Site Clerk / كاتب موقع
- PRJ-02: Site Supervisor / مشرف موقع

### 🏗️ الإدارة الهندسية (ENG) - 3 وظائف:
- ENG-01: Assistant Surveyor / مساعد مساح
- ENG-02: Surveyor / مساح
- ENG-03: Survey Engineer / مهندس مساحة

### 📁 الإدارة العامة (ADM) - 4 وظائف:
- ADM-01: Office Officer / إداري
- ADM-02: Executive Administrator / مدير تنفيذي إداري
- ADM-03: Admin & HR Manager / مدير الإدارة والموارد البشرية
- ADM-04: Project & Operations Manager / مدير المشاريع والعمليات

### 👔 الإدارة العليا (TMG) - 2 وظيفة:
- TMG-01: Chairman & CEO / رئيس مجلس الإدارة والرئيس التنفيذي
- TMG-02: General Manager (GM) / المدير العام

### 💰 إدارة المالية والمحاسبة (FIN) - 1 وظيفة:
- FIN-01: Accountant / محاسب

---

## 🎯 الأعمدة في الجدول:

- id (المعرف الفريد)
- title (المسمى بالإنجليزي)
- titleAr (المسمى بالعربي)
- code (الكود - فريد)
- description (الوصف)
- **departmentId (القسم - إجباري)**
- orderIndex (الترتيب)
- isActive (نشط/غير نشط)
- createdAt (تاريخ الإنشاء)
- updatedAt (آخر تحديث)
- createdBy (من أنشأ السجل)
- updatedBy (من حدّث السجل)

---

## 🔗 العلاقات:

```
Department (القسم)
    ↓ (واحد لأكثر)
Position (الوظيفة)
```

**مثال:**
- القسم: "إدارة التغذية" (CAT)
  - الوظيفة 1: "طباخ" (CAT-01)
  - الوظيفة 2: "رئيس طهاة" (CAT-02)

---

## 📝 استخدام الجدول في الكود:

```typescript
import { Database } from '#root/modules/database/index.js'

// الحصول على جميع الوظائف مع الأقسام
const positions = await Database.prisma.position.findMany({
  where: { isActive: true },
  include: { department: true },
  orderBy: { orderIndex: 'asc' }
})

// الحصول على وظيفة معينة مع القسم
const engineer = await Database.prisma.position.findUnique({
  where: { code: 'ENG-03' },
  include: { department: true }
})

console.log(engineer.titleAr)         // "مهندس مساحة"
console.log(engineer.department.name) // "الإدارة الهندسية"

// الحصول على جميع وظائف قسم معين
const engPositions = await Database.prisma.position.findMany({
  where: { 
    department: { code: 'ENG' },
    isActive: true 
  }
})
```

---

## 🎯 إنشاء كود تلقائي لوظيفة جديدة:

```typescript
async function generatePositionCode(departmentCode: string): Promise<string> {
  // الحصول على القسم
  const department = await Database.prisma.department.findUnique({
    where: { code: departmentCode }
  })

  if (!department) throw new Error('القسم غير موجود')

  // الحصول على آخر وظيفة في القسم
  const lastPosition = await Database.prisma.position.findFirst({
    where: { departmentId: department.id },
    orderBy: { code: 'desc' }
  })

  // حساب الرقم التالي
  let nextNumber = 1
  if (lastPosition) {
    const match = lastPosition.code.match(/(\d+)$/)
    if (match) {
      nextNumber = parseInt(match[1]) + 1
    }
  }

  // إنشاء الكود الجديد
  return `${departmentCode}-${String(nextNumber).padStart(2, '0')}`
}

// استخدام
const newCode = await generatePositionCode('ENG') // "ENG-04"
```

---

## ✅ بعد التنفيذ:

الجدول جاهز للاستخدام! يمكنك الآن:
- عرض الوظائف حسب القسم
- إضافة وظائف جديدة
- ربط الموظفين بالوظائف (الخطوة التالية)

---

## 🆘 في حالة حدوث مشاكل:

1. تأكد من تطبيق Migration للأقسام أولاً
2. تأكد من وجود بيانات الأقسام في قاعدة البيانات
3. إذا فشل الـ seed، تحقق من أكواد الأقسام

---

**✨ تم بنجاح! الآن نفّذ الخطوات أعلاه وستكون جاهزاً.**
