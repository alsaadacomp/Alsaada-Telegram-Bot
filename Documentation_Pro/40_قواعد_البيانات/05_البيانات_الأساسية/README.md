# 📊 البيانات الأساسية - التوثيق الكامل

## 📋 نظرة عامة

هذا القسم يحتوي على البيانات الثابتة والمرجعية التي يحتاجها النظام، مثل الشركات، الأقسام، الوظائف، والمحافظات.

---

## 📚 الملفات المتوفرة

### 1. **DEPARTMENT_SETUP.md**
**الوصف:** إعداد الأقسام والإدارات

**المحتوى:**
- قائمة الأقسام الشائعة
- الهيكل التنظيمي
- كيفية إضافة قسم جديد
- أمثلة عملية

**الأقسام المقترحة:**
```
- إدارة عليا
- الموارد البشرية
- المالية والمحاسبة
- المشتريات
- التشغيل والإنتاج
- المخازن
- الصيانة
- الأمن والسلامة
- خدمة العملاء
- تكنولوجيا المعلومات
```

---

### 2. **POSITION_SETUP.md**
**الوصف:** إعداد الوظائف والمناصب

**المحتوى:**
- قائمة الوظائف الشائعة
- المسميات الوظيفية
- المستويات الإدارية
- الراتب المبدئي لكل وظيفة

**الوظائف المقترحة:**
```
المستوى الإداري:
- مدير عام
- مدير إدارة
- رئيس قسم
- مشرف

المستوى التنفيذي:
- موظف إداري
- محاسب
- فني
- عامل
- سائق
- حارس أمن
```

---

### 3. **GOVERNORATES_DATA.md** ⭐
**الوصف:** بيانات المحافظات والمراكز المصرية

**المحتوى:**
- جميع محافظات مصر (27 محافظة)
- المراكز والمدن لكل محافظة
- أكواد المحافظات
- البيانات جاهزة للاستيراد في قاعدة البيانات

**المحافظات:**
```
القاهرة - الجيزة - الإسكندرية
القليوبية - الشرقية - الدقهلية
الغربية - المنوفية - البحيرة
الإسماعيلية - السويس - بورسعيد
دمياط - كفر الشيخ - الفيوم
بني سويف - المنيا - أسيوط
سوهاج - قنا - الأقصر - أسوان
البحر الأحمر - الوادي الجديد
مطروح - شمال سيناء - جنوب سيناء
```

---

## 🗂️ الجداول الأساسية

### 1. Company (الشركات)
```prisma
model Company {
  id          Int      @id @default(autoincrement())
  name        String   @unique
  code        String?  @unique
  taxNumber   String?
  address     String?
  phone       String?
  email       String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  departments Department[]
  employees   Employee[]
}
```

### 2. Department (الأقسام)
```prisma
model Department {
  id          Int      @id @default(autoincrement())
  companyId   Int
  name        String
  code        String?
  managerId   Int?     // مدير القسم
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  
  company     Company    @relation(...)
  manager     Employee?  @relation(...)
  employees   Employee[]
  
  @@unique([companyId, name])
}
```

### 3. Position (الوظائف)
```prisma
model Position {
  id             Int      @id @default(autoincrement())
  name           String   @unique
  level          String?  // إداري، تنفيذي، عامل
  baseSalary     Float?   // الراتب المبدئي
  description    String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  
  employees      Employee[]
}
```

### 4. Governorate (المحافظات)
```prisma
model Governorate {
  id        Int     @id @default(autoincrement())
  name      String  @unique
  nameEn    String?
  code      String? @unique
  region    String? // القاهرة الكبرى، الدلتا، الصعيد، إلخ
}
```

### 5. Bank (البنوك)
```prisma
model Bank {
  id        Int     @id @default(autoincrement())
  name      String  @unique
  code      String? @unique
  swiftCode String?
}
```

---

## 🚀 البدء السريع

### الخطوة 1: إضافة شركة
```typescript
const company = await prisma.company.create({
  data: {
    name: "شركة السعادة للمقاولات",
    code: "SAA-001",
    taxNumber: "123-456-789",
    address: "القاهرة - المعادي",
    phone: "0223456789",
    email: "info@alsaada.com"
  }
});
```

### الخطوة 2: إضافة أقسام
```typescript
const departments = await prisma.department.createMany({
  data: [
    { companyId: 1, name: "إدارة عليا", code: "TOP" },
    { companyId: 1, name: "الموارد البشرية", code: "HR" },
    { companyId: 1, name: "المالية", code: "FIN" },
    { companyId: 1, name: "التشغيل", code: "OPS" },
    { companyId: 1, name: "المخازن", code: "WH" }
  ]
});
```

### الخطوة 3: إضافة وظائف
```typescript
const positions = await prisma.position.createMany({
  data: [
    { name: "مدير عام", level: "إداري", baseSalary: 15000 },
    { name: "مدير إدارة", level: "إداري", baseSalary: 10000 },
    { name: "محاسب", level: "تنفيذي", baseSalary: 5000 },
    { name: "فني", level: "تنفيذي", baseSalary: 4000 },
    { name: "عامل", level: "عامل", baseSalary: 3000 }
  ]
});
```

### الخطوة 4: استيراد المحافظات
```typescript
// البيانات موجودة في GOVERNORATES_DATA.md
// يمكن استيرادها مباشرة
```

---

## 📝 أمثلة عملية

### مثال 1: البحث عن قسم معين
```typescript
const department = await prisma.department.findFirst({
  where: {
    companyId: 1,
    name: "الموارد البشرية"
  },
  include: {
    manager: true,
    employees: true
  }
});
```

### مثال 2: جميع الوظائف الإدارية
```typescript
const managerialPositions = await prisma.position.findMany({
  where: {
    level: "إداري",
    isActive: true
  },
  orderBy: {
    baseSalary: 'desc'
  }
});
```

### مثال 3: الأقسام مع عدد الموظفين
```typescript
const departments = await prisma.department.findMany({
  where: { companyId: 1 },
  include: {
    _count: {
      select: { employees: true }
    }
  }
});

// النتيجة:
// [
//   { name: "HR", _count: { employees: 5 } },
//   { name: "Finance", _count: { employees: 3 } }
// ]
```

---

## 🎯 Seed Data (بيانات أولية)

يُنصح بإنشاء ملف `seed.ts` لإضافة البيانات الأساسية:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // إضافة الشركة
  const company = await prisma.company.upsert({
    where: { code: "SAA-001" },
    update: {},
    create: {
      name: "شركة السعادة للمقاولات",
      code: "SAA-001",
      taxNumber: "123-456-789"
    }
  });

  // إضافة الأقسام
  const departments = [
    "إدارة عليا",
    "الموارد البشرية",
    "المالية والمحاسبة",
    "التشغيل"
  ];

  for (const name of departments) {
    await prisma.department.upsert({
      where: { companyId_name: { companyId: company.id, name } },
      update: {},
      create: { companyId: company.id, name }
    });
  }

  // إضافة الوظائف
  const positions = [
    { name: "مدير عام", baseSalary: 15000 },
    { name: "مدير إدارة", baseSalary: 10000 },
    { name: "محاسب", baseSalary: 5000 }
  ];

  for (const pos of positions) {
    await prisma.position.upsert({
      where: { name: pos.name },
      update: {},
      create: pos
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

**تشغيل Seed:**
```bash
npx prisma db seed
```

---

## 📊 تقارير مقترحة

1. **الهيكل التنظيمي** - شجرة الأقسام
2. **توزيع الموظفين** - حسب القسم/الوظيفة
3. **سلم الرواتب** - حسب الوظيفة
4. **الأقسام النشطة** - الأقسام وعدد موظفيها

---

## ⚠️ ملاحظات مهمة

### Unique Constraints:
```prisma
@@unique([companyId, name])  // لا يمكن تكرار اسم القسم في نفس الشركة
```

### Soft Delete:
بدلاً من حذف البيانات:
```typescript
// ❌ لا تفعل
await prisma.department.delete({ where: { id: 1 } });

// ✅ افعل
await prisma.department.update({
  where: { id: 1 },
  data: { isActive: false }
});
```

### التحقق من البيانات:
```typescript
// تحقق من وجود الشركة قبل إضافة قسم
const company = await prisma.company.findUnique({
  where: { id: companyId }
});

if (!company) {
  throw new Error("الشركة غير موجودة");
}
```

---

## 🔗 العلاقات مع الأنظمة الأخرى

```
Company → Department → Employee
Company → Employee
Position → Employee

Department → Equipment (مخزن تابع لقسم)
Department → Warehouse (مخزن تابع لقسم)
```

---

## 📞 روابط ذات صلة

- [نظام الموظفين](../01_نظام_الموظفين/) - يستخدم هذه البيانات
- [نظام المعدات](../02_نظام_المعدات/) - ربط بالشركة
- [العودة لقواعد البيانات](../README.md)

---

## 📝 قائمة المراجعة

عند إعداد نظام جديد:
- [ ] إنشاء الشركة الأساسية
- [ ] إضافة جميع الأقسام
- [ ] إضافة جميع الوظائف
- [ ] استيراد المحافظات (إن لزم)
- [ ] إضافة البنوك (للرواتب)
- [ ] تعيين مديري الأقسام
- [ ] مراجعة العلاقات
- [ ] اختبار البيانات

---

**الحالة:** ✅ جاهز للاستخدام  
**آخر تحديث:** أكتوبر 2025
