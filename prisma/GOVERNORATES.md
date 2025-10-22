# 🌍 دليل استخدام بيانات المحافظات

## البنية المضافة:

### 1. جدول Governorate (Location_Governorate)
- يحتوي على 27 محافظة مصرية
- ترتيب مخصص: القاهرة، الجيزة، شمال سيناء، الشرقية، ثم الباقي
- يدعم العربية والإنجليزية
- يحتوي على أكواد فريدة لكل محافظة

### 2. التعديلات على Employee
- إضافة حقل `governorateId` للربط مع جدول المحافظات
- حقل `city` للمدينة/الحي (نص حر)

### 3. التعديلات على Company
- إضافة حقل `governorateId` للربط مع جدول المحافظات

## الخطوات المطلوبة:

### 1. إنشاء Migration:
```bash
cd F:\_Alsaada_Telegram_Bot\telegram-bot-template-main
npx prisma migrate dev --name add_governorate_table
```

### 2. إضافة بيانات المحافظات:
```bash
npx tsx prisma/seeds/governorates.ts
```

أو من خلال seed الرئيسي:
```bash
npx tsx prisma/seed.ts
```

## الترتيب النهائي:

1. القاهرة (Cairo)
2. الجيزة (Giza)
3. شمال سيناء (North Sinai)
4. الشرقية (Sharqia)
5. الإسكندرية (Alexandria)
6. الإسماعيلية (Ismailia)
7. الأقصر (Luxor)
8. البحر الأحمر (Red Sea)
9. البحيرة (Beheira)
10. الدقهلية (Dakahlia)
... إلخ (27 محافظة)

## الاستخدام في الكود:

### الحصول على المحافظات بالترتيب:
```typescript
const governorates = await prisma.governorate.findMany({
  where: { isActive: true },
  orderBy: { orderIndex: 'asc' }
});
```

### إضافة موظف مع محافظة:
```typescript
const employee = await prisma.employee.create({
  data: {
    employeeCode: "EMP001",
    firstName: "أحمد",
    lastName: "محمد",
    // ... باقي البيانات
    governorateId: 1, // القاهرة
    city: "مدينة نصر",
    // ...
  }
});
```

### البحث عن موظفين في محافظة معينة:
```typescript
const employees = await prisma.employee.findMany({
  where: { 
    governorateId: 1, // القاهرة
    isActive: true 
  },
  include: {
    governorate: true
  }
});
```

## المناطق المتوفرة:
- Greater Cairo (القاهرة الكبرى)
- Delta (الدلتا)
- Upper Egypt (الصعيد)
- Canal (قناة السويس)
- Sinai (سيناء)
- Mediterranean (البحر المتوسط)
- Red Sea (البحر الأحمر)
- Middle Egypt (مصر الوسطى)
- Western Desert (الصحراء الغربية)

## ملاحظات:
- حقل `governorateId` اختياري (nullable) حتى لا يتطلب تعديل البيانات الموجودة
- يمكن إضافة محافظات جديدة من خلال Prisma Studio
- الأكواد فريدة لكل محافظة (مثل: CAI, ALX, GIZ)
