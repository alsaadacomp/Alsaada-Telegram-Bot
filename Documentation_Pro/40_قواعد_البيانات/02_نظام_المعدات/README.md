# 🚜 نظام المعدات - التوثيق الكامل

## 📋 نظرة عامة

نظام متكامل لإدارة المعدات والآليات الثقيلة، يشمل الصيانة، الاستخدام، التكاليف، والورديات.

---

## 📚 الملفات المتوفرة

### 1. **EQUIPMENT_SYSTEM.md** ⭐
**الوصف:** التوثيق الكامل والشامل

**المحتويات:**
- ✅ شرح تفصيلي لـ 10 جداول
- ✅ العلاقات بين الجداول
- ✅ أمثلة عملية كاملة
- ✅ سيناريوهات استخدام حقيقية
- ✅ أكواد TypeScript جاهزة

**حجم:** ~200 سطر  
**الوقت المقدر:** 15-20 دقيقة

---

### 2. **QUICK_START.md**
**الوصف:** دليل البدء السريع

**المحتويات:**
- ✅ خطوات التطبيق المباشرة
- ✅ إضافة الجداول للـ Schema
- ✅ أوامر Migration
- ✅ إعداد Seed للبيانات
- ✅ أمثلة سريعة

**حجم:** ~150 سطر  
**الوقت المقدر:** 10 دقائق

---

## 🎯 من أين تبدأ؟

### 🔰 إذا كنت مطوراً:
1. ابدأ بـ **QUICK_START.md** للتطبيق المباشر
2. ارجع لـ **EQUIPMENT_SYSTEM.md** للتفاصيل

### 👔 إذا كنت مديراً/مشرفاً:
1. اقرأ **EQUIPMENT_SYSTEM.md** لفهم النظام كاملاً
2. راجع الأمثلة في نهاية الملف

---

## 🗂️ هيكل النظام (10 جداول)

### 1. التصنيفات والأنواع
```
Equipment_Category          → التصنيف الرئيسي (شاحنات، حفارات، إلخ)
    ↓
Equipment_Type              → النوع الفرعي (شاحنة 10 طن، حفار كوماتسو)
    ↓
Equipment                   → المعدة نفسها (كود فريد لكل معدة)
```

### 2. الصيانة
```
Equipment_Maintenance              → سجل الصيانة الفعلية
Equipment_Scheduled_Maintenance ⭐  → الصيانة المجدولة التلقائية
```

### 3. التشغيل والاستخدام
```
Equipment_Usage            → سجل استخدام المعدة (أين ومتى)
Equipment_Fuel_Log         → سجل الوقود
Equipment_Cost             → التكاليف (صيانة، وقود، إلخ)
```

### 4. نظام الورديات ⭐
```
Equipment_Shift            → الوردية (صباحي، مسائي، ليلي)
    ↓
Equipment_Shift_Assignment → تعيين السائق/المشغل للوردية
```

---

## ✨ الميزات الرئيسية

### 1️⃣ **كود فريد لكل معدة**
```
EQ-2025-001
EQ-2025-002
```
يسهل التتبع والإدارة

### 2️⃣ **تتبع الزيوت والعدادات**
- تتبع بالكيلومتر (للسيارات والشاحنات)
- تتبع بالساعات (للحفارات والمعدات الثقيلة)
- تنبيهات تلقائية عند قرب موعد الصيانة

### 3️⃣ **الصيانة المجدولة التلقائية** ⭐
```prisma
// مثال: تغيير زيت المحرك كل 5000 كم
intervalKilometers: 5000
lastKilometers: 48000
nextDueKilometers: 53000  // تلقائي!
```

### 4️⃣ **نظام ورديات كامل**
- تعيين سائقين للمعدات
- تتبع ساعات العمل
- حساب أجر الورديات

### 5️⃣ **ربط شامل**
- ربط بالموظفين (السائقين)
- ربط بالمشاريع (أين تعمل المعدة)
- ربط بالشركة

---

## 📊 الجداول بالتفصيل

### 1. Equipment_Category
```prisma
model Equipment_Category {
  id          Int     @id @default(autoincrement())
  name        String  @unique        // "شاحنات"
  description String?                // وصف التصنيف
  isActive    Boolean @default(true)
}
```

**أمثلة:**
- شاحنات
- حفارات
- رافعات
- معدات خفيفة

---

### 2. Equipment_Type
```prisma
model Equipment_Type {
  id               Int     @id @default(autoincrement())
  categoryId       Int
  name             String               // "شاحنة 10 طن"
  needsOil         Boolean @default(false)
  oilMeasurementBy String?              // "km" أو "hours"
  
  category         Equipment_Category @relation(...)
}
```

**مثال:**
```typescript
{
  categoryId: 1,  // شاحنات
  name: "شاحنة 10 طن",
  needsOil: true,
  oilMeasurementBy: "km"  // تتبع بالكيلومتر
}
```

---

### 3. Equipment (المعدة نفسها)
```prisma
model Equipment {
  id                String   @id @default(autoincrement())
  equipmentCode     String   @unique  // "EQ-2025-001"
  typeId            Int
  name              String             // "شاحنة مرسيدس"
  model             String?            // "Actros 2024"
  serialNumber      String?
  plateNumber       String?            // "أ ب ج 1234"
  
  // العداد
  currentKilometers Float?
  currentHours      Float?
  
  // معلومات الشراء
  purchaseDate      DateTime?
  purchasePrice     Float?
  
  // الحالة
  status            String @default("متاح")
  // متاح، قيد الاستخدام، صيانة، معطل
  
  // التأمين والترخيص
  insuranceExpiry   DateTime?
  licenseExpiry     DateTime?
}
```

---

### 4. Equipment_Maintenance (الصيانة الفعلية)
```prisma
model Equipment_Maintenance {
  id              Int      @id @default(autoincrement())
  equipmentId     Int
  maintenanceDate DateTime
  type            String   // دورية، طارئة، وقائية
  description     String   // "تغيير زيت المحرك"
  
  // قراءة العداد عند الصيانة
  kilometersAt    Float?   // 48500
  hoursAt         Float?
  
  // التكلفة
  cost            Float?
  laborCost       Float?   // تكلفة العمالة
  partsCost       Float?   // تكلفة القطع
  
  performedBy     String?  // "ورشة الشركة"
  
  // الصيانة القادمة
  nextDueDate     DateTime?
  nextDueKilometers Float?  // 53500
  nextDueHours    Float?
  
  notes           String?
}
```

---

### 5. Equipment_Scheduled_Maintenance ⭐ (الصيانة المجدولة)
```prisma
model Equipment_Scheduled_Maintenance {
  id                  Int      @id @default(autoincrement())
  equipmentId         Int
  maintenanceType     String   // "زيت محرك"
  
  // الجدولة
  intervalKilometers  Int?     // كل 5000 كم
  intervalHours       Int?     // كل 250 ساعة
  intervalDays        Int?     // كل 180 يوم
  
  // آخر صيانة
  lastMaintenanceDate DateTime?
  lastKilometers      Float?
  lastHours           Float?
  
  // الصيانة القادمة (محسوبة تلقائياً)
  nextDueDate         DateTime?
  nextDueKilometers   Float?
  nextDueHours        Float?
  
  estimatedCost       Float?
  isActive            Boolean  @default(true)
}
```

**مثال عملي:**
```typescript
// إعداد صيانة دورية لتغيير الزيت
{
  equipmentId: 1,
  maintenanceType: "تغيير زيت المحرك",
  intervalKilometers: 5000,      // كل 5000 كم
  lastKilometers: 48000,         // آخر تغيير
  nextDueKilometers: 53000,      // القادم عند 53000
  estimatedCost: 500
}

// النظام سيحسب ويُنبه عند 52500 كم (قبل 500 كم)
```

---

### 6. Equipment_Usage (سجل الاستخدام)
```prisma
model Equipment_Usage {
  id              Int      @id @default(autoincrement())
  equipmentId     Int
  projectId       Int?     // المشروع الذي تعمل فيه
  employeeId      Int?     // السائق/المشغل
  
  startDate       DateTime
  endDate         DateTime?
  
  startKilometers Float?
  endKilometers   Float?
  startHours      Float?
  endHours        Float?
  
  location        String?  // موقع الاستخدام
  purpose         String?  // الغرض
  notes           String?
}
```

---

### 7. Equipment_Fuel_Log (سجل الوقود)
```prisma
model Equipment_Fuel_Log {
  id            Int      @id @default(autoincrement())
  equipmentId   Int
  fuelDate      DateTime
  liters        Float    // اللترات
  cost          Float    // التكلفة
  kilometersAt  Float?   // قراءة العداد
  hoursAt       Float?
  fuelType      String?  // ديزل، بنزين
  station       String?  // المحطة
  notes         String?
}
```

---

### 8-10. نظام الورديات ⭐

```prisma
// 8. الوردية
model Equipment_Shift {
  id          Int      @id @default(autoincrement())
  equipmentId Int
  shiftDate   DateTime
  shiftType   String   // صباحي، مسائي، ليلي
  startTime   DateTime
  endTime     DateTime
}

// 9. تعيين الموظف للوردية
model Equipment_Shift_Assignment {
  id         Int      @id @default(autoincrement())
  shiftId    Int
  employeeId Int      // السائق/المشغل
  role       String?  // "سائق"، "مشغل"
  hours      Float?   // عدد الساعات
  rate       Float?   // أجر الساعة
  totalPay   Float?   // الأجر الإجمالي
}
```

---

## 🚀 أمثلة عملية

### مثال 1: إضافة معدة جديدة
```typescript
const equipment = await prisma.equipment.create({
  data: {
    equipmentCode: "EQ-2025-001",
    typeId: 1,
    name: "شاحنة مرسيدس",
    model: "Actros 2024",
    plateNumber: "أ ب ج 1234",
    currentKilometers: 0,
    purchaseDate: new Date(),
    purchasePrice: 500000,
    status: "متاح",
    companyId: 1
  }
});
```

### مثال 2: تسجيل صيانة
```typescript
const maintenance = await prisma.equipment_Maintenance.create({
  data: {
    equipmentId: 1,
    maintenanceDate: new Date(),
    type: "دورية",
    description: "تغيير زيت المحرك والفلتر",
    kilometersAt: 5000,
    cost: 500,
    laborCost: 200,
    partsCost: 300,
    performedBy: "ورشة الشركة",
    nextDueKilometers: 10000
  }
});
```

### مثال 3: إنشاء وردية وتعيين سائق
```typescript
// 1. إنشاء الوردية
const shift = await prisma.equipment_Shift.create({
  data: {
    equipmentId: 1,
    shiftDate: new Date(),
    shiftType: "صباحي",
    startTime: new Date("2025-10-22T08:00:00"),
    endTime: new Date("2025-10-22T16:00:00")
  }
});

// 2. تعيين السائق
const assignment = await prisma.equipment_Shift_Assignment.create({
  data: {
    shiftId: shift.id,
    employeeId: 5,  // أحمد محمد
    role: "سائق",
    hours: 8,
    rate: 50,       // 50 جنيه للساعة
    totalPay: 400   // 8 × 50
  }
});
```

### مثال 4: إعداد صيانة مجدولة
```typescript
const scheduled = await prisma.equipment_Scheduled_Maintenance.create({
  data: {
    equipmentId: 1,
    maintenanceType: "تغيير زيت المحرك",
    intervalKilometers: 5000,
    lastKilometers: 5000,
    nextDueKilometers: 10000,
    estimatedCost: 500
  }
});
```

---

## 📊 تقارير مقترحة

1. **الصيانة القادمة** - معدات قريبة من موعد الصيانة
2. **تكاليف المعدات** - حسب المعدة أو المشروع
3. **استهلاك الوقود** - حسب المعدة أو الفترة
4. **ساعات التشغيل** - لكل معدة
5. **تقرير الورديات** - أجور السائقين

---

## ⚠️ ملاحظات مهمة

### Indexes المطلوبة:
```prisma
@@index([equipmentId])
@@index([status])
@@index([shiftDate])
```

### التنبيهات التلقائية:
- تنبيه قبل 500 كم من الصيانة
- تنبيه قبل 25 ساعة من الصيانة
- تنبيه قبل 7 أيام من انتهاء التأمين
- تنبيه قبل 7 أيام من انتهاء الترخيص

### أفضل الممارسات:
- ✅ حدّث قراءة العداد يومياً
- ✅ سجّل كل عملية وقود
- ✅ وثّق كل صيانة مهما كانت صغيرة
- ✅ راجع الصيانة المجدولة أسبوعياً

---

## 🔗 روابط ذات صلة

- [نظام الموظفين](../01_نظام_الموظفين/) - للسائقين
- [نظام المشاريع](../) - ربط المعدات بالمشاريع
- [نظام التكاليف](../04_نظام_حساب_التكاليف/) - تكاليف المعدات
- [العودة لقواعد البيانات](../README.md)

---

## 📞 الدعم

للمزيد من المساعدة:
- راجع **EQUIPMENT_SYSTEM.md** للتفاصيل الكاملة
- راجع **QUICK_START.md** للبدء السريع
- [الأعطال الشائعة](../../30_التشغيل_والنشر/02_الأعطال_الشائعة.md)

---

**آخر تحديث:** أكتوبر 2025  
**الحالة:** ✅ مكتمل ومطبق  
**الإصدار:** 2.0
