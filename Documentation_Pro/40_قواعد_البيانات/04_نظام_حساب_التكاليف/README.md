# 💰 نظام حساب التكاليف - التوثيق الكامل

## 📋 نظرة عامة

نظام دقيق وشامل لحساب تكاليف المشاريع، يشمل تكاليف العمالة، المواد، المعدات، والمصاريف الإضافية.

---

## 📚 سيتم إضافة الملفات التالية:

### 1. **COST_SYSTEM.md** (قيد الإنشاء)
- التوثيق الكامل للنظام
- شرح تفصيلي لـ 7 جداول
- أمثلة عملية وحسابات

### 2. **QUICK_START.md** (قيد الإنشاء)
- دليل البدء السريع
- معادلات حساب التكاليف

---

## 🗂️ هيكل النظام (7 جداول)

### 1. التصنيفات
```
Cost_Category               → تصنيف التكلفة (مباشرة، غير مباشرة)
```

### 2. أنواع التكاليف
```
Cost_Labor                  → تكاليف العمالة
Cost_Material               → تكاليف المواد
Cost_Equipment              → تكاليف المعدات
Cost_Overhead               → المصاريف الإضافية
```

### 3. التلخيص والتقارير
```
Cost_Summary                → ملخص تكاليف المشروع
Cost_Report                 → التقارير التفصيلية
```

---

## ✨ الميزات الرئيسية

### 1️⃣ **تكاليف العمالة**
- أجور الموظفين
- ساعات العمل
- الساعات الإضافية
- البدلات

### 2️⃣ **تكاليف المواد**
- سعر المادة
- الكمية المستخدمة
- نسبة الهدر
- التكلفة الإجمالية

### 3️⃣ **تكاليف المعدات**
- إيجار المعدات
- الوقود
- الصيانة
- الاستهلاك

### 4️⃣ **المصاريف الإضافية** (Overhead)
- الكهرباء والماء
- النقل
- الإدارة
- التأمينات

### 5️⃣ **التحليل والمقارنة**
- التكلفة المتوقعة vs الفعلية
- نسبة الانحراف
- تحليل الأداء
- توقعات المشروع

---

## 📊 الجداول بالتفصيل

### 1. Cost_Category (تصنيف التكلفة)
```prisma
model Cost_Category {
  id          Int     @id @default(autoincrement())
  name        String  @unique
  type        String  // مباشرة، غير_مباشرة
  description String?
  isActive    Boolean @default(true)
}
```

**أمثلة:**
- عمالة مباشرة (مباشرة)
- مواد بناء (مباشرة)
- إدارة (غير مباشرة)
- نقل (غير مباشرة)

---

### 2. Cost_Labor (تكاليف العمالة)
```prisma
model Cost_Labor {
  id              Int      @id @default(autoincrement())
  projectId       Int
  employeeId      Int
  date            DateTime @default(now())
  
  // الساعات
  regularHours    Float             // ساعات عادية
  overtimeHours   Float?            // ساعات إضافية
  
  // المعدلات
  hourlyRate      Float             // أجر الساعة العادية
  overtimeRate    Float?            // أجر الساعة الإضافية
  
  // البدلات
  allowances      Float?            // بدلات
  
  // الحسابات
  regularPay      Float             // الأجر العادي
  overtimePay     Float?            // أجر الإضافي
  totalPay        Float             // الإجمالي
  
  notes           String?
}
```

**المعادلات:**
```
regularPay = regularHours × hourlyRate
overtimePay = overtimeHours × overtimeRate
totalPay = regularPay + overtimePay + allowances
```

---

### 3. Cost_Material (تكاليف المواد)
```prisma
model Cost_Material {
  id              Int      @id @default(autoincrement())
  projectId       Int
  itemId          Int               // من المخزون
  date            DateTime @default(now())
  
  // الكمية
  quantity        Float             // المستخدمة
  wastePercent    Float?            // نسبة الهدر
  actualQuantity  Float             // بعد الهدر
  
  // السعر
  unitPrice       Float             // سعر الوحدة
  totalCost       Float             // التكلفة الإجمالية
  
  supplier        String?           // المورد
  invoiceNumber   String?           // رقم الفاتورة
  notes           String?
}
```

**المعادلات:**
```
actualQuantity = quantity × (1 + wastePercent/100)
totalCost = actualQuantity × unitPrice
```

---

### 4. Cost_Equipment (تكاليف المعدات)
```prisma
model Cost_Equipment {
  id              Int      @id @default(autoincrement())
  projectId       Int
  equipmentId     Int
  date            DateTime @default(now())
  
  // الاستخدام
  hours           Float             // عدد ساعات التشغيل
  days            Float?            // عدد الأيام
  
  // التكاليف
  rentalRate      Float?            // سعر الإيجار (ساعة/يوم)
  fuelCost        Float?            // تكلفة الوقود
  maintenanceCost Float?            // تكلفة الصيانة
  operatorCost    Float?            // أجر المشغل
  
  // الإجمالي
  totalCost       Float
  
  notes           String?
}
```

**المعادلات:**
```
totalCost = (hours × rentalRate) + fuelCost + maintenanceCost + operatorCost
```

---

### 5. Cost_Overhead (المصاريف الإضافية)
```prisma
model Cost_Overhead {
  id          Int      @id @default(autoincrement())
  projectId   Int
  categoryId  Int
  date        DateTime @default(now())
  
  description String            // وصف المصروف
  amount      Float             // المبلغ
  
  // التفاصيل
  invoiceNumber String?
  supplier      String?
  notes         String?
}
```

**أمثلة:**
- كهرباء: 500 جنيه
- نقل عمال: 300 جنيه
- أدوات يدوية: 200 جنيه
- تأمينات: 1000 جنيه

---

### 6. Cost_Summary (ملخص التكاليف)
```prisma
model Cost_Summary {
  id                    Int      @id @default(autoincrement())
  projectId             Int      @unique
  
  // التكاليف الفعلية
  actualLaborCost       Float    @default(0)
  actualMaterialCost    Float    @default(0)
  actualEquipmentCost   Float    @default(0)
  actualOverheadCost    Float    @default(0)
  actualTotalCost       Float    @default(0)
  
  // التكاليف المتوقعة
  estimatedLaborCost    Float?
  estimatedMaterialCost Float?
  estimatedEquipmentCost Float?
  estimatedOverheadCost Float?
  estimatedTotalCost    Float?
  
  // الانحراف
  laborVariance         Float?   // الفرق
  materialVariance      Float?
  equipmentVariance     Float?
  overheadVariance      Float?
  totalVariance         Float?
  
  // النسب
  laborVariancePercent  Float?   // نسبة الانحراف
  materialVariancePercent Float?
  
  lastUpdated           DateTime @updatedAt
}
```

**المعادلات:**
```
actualTotalCost = actualLaborCost + actualMaterialCost + 
                  actualEquipmentCost + actualOverheadCost

totalVariance = actualTotalCost - estimatedTotalCost

totalVariancePercent = (totalVariance / estimatedTotalCost) × 100
```

---

### 7. Cost_Report (التقارير)
```prisma
model Cost_Report {
  id          Int      @id @default(autoincrement())
  projectId   Int
  reportType  String   // يومي، أسبوعي، شهري، نهائي
  startDate   DateTime
  endDate     DateTime
  
  data        Json     // بيانات التقرير التفصيلية
  summary     Json     // الملخص
  
  createdBy   Int?
  createdAt   DateTime @default(now())
}
```

---

## 🚀 أمثلة عملية

### مثال 1: تسجيل تكلفة عمالة
```typescript
const laborCost = await prisma.cost_Labor.create({
  data: {
    projectId: 1,
    employeeId: 5,
    date: new Date(),
    regularHours: 8,
    overtimeHours: 2,
    hourlyRate: 50,
    overtimeRate: 75,
    allowances: 50,
    regularPay: 400,     // 8 × 50
    overtimePay: 150,    // 2 × 75
    totalPay: 600        // 400 + 150 + 50
  }
});
```

### مثال 2: تسجيل تكلفة مواد
```typescript
const materialCost = await prisma.cost_Material.create({
  data: {
    projectId: 1,
    itemId: 10,  // أسمنت
    quantity: 100,
    wastePercent: 5,
    actualQuantity: 105,  // 100 + 5%
    unitPrice: 85,
    totalCost: 8925,      // 105 × 85
    supplier: "شركة الأسمنت"
  }
});
```

### مثال 3: حساب ملخص المشروع
```typescript
// جمع كل التكاليف
const laborTotal = await prisma.cost_Labor.aggregate({
  where: { projectId: 1 },
  _sum: { totalPay: true }
});

const materialTotal = await prisma.cost_Material.aggregate({
  where: { projectId: 1 },
  _sum: { totalCost: true }
});

// تحديث الملخص
const summary = await prisma.cost_Summary.upsert({
  where: { projectId: 1 },
  update: {
    actualLaborCost: laborTotal._sum.totalPay || 0,
    actualMaterialCost: materialTotal._sum.totalCost || 0,
    actualTotalCost: (laborTotal._sum.totalPay || 0) + 
                     (materialTotal._sum.totalCost || 0)
  },
  create: {
    projectId: 1,
    actualLaborCost: laborTotal._sum.totalPay || 0,
    actualMaterialCost: materialTotal._sum.totalCost || 0
  }
});
```

### مثال 4: حساب الانحراف
```typescript
const summary = await prisma.cost_Summary.findUnique({
  where: { projectId: 1 }
});

// حساب الانحراف
const variance = summary.actualTotalCost - summary.estimatedTotalCost;
const variancePercent = (variance / summary.estimatedTotalCost) × 100;

// تحديث
await prisma.cost_Summary.update({
  where: { projectId: 1 },
  data: {
    totalVariance: variance,
    totalVariancePercent: variancePercent
  }
});
```

---

## 📊 تقارير مقترحة

1. **تقرير التكاليف اليومية** - تكاليف اليوم
2. **ملخص أسبوعي** - تكاليف الأسبوع بالتفصيل
3. **مقارنة المتوقع vs الفعلي** - تحليل الانحراف
4. **توزيع التكاليف** - pie chart للتوزيع
5. **اتجاه التكاليف** - line chart للاتجاه

---

## 📈 مؤشرات الأداء (KPIs)

```typescript
// 1. نسبة الانحراف الإجمالية
totalVariancePercent = (actualTotal - estimatedTotal) / estimatedTotal × 100

// 2. التكلفة لكل وحدة إنتاج
costPerUnit = totalCost / unitsProduced

// 3. كفاءة العمالة
laborEfficiency = (estimatedLaborHours / actualLaborHours) × 100

// 4. نسبة هدر المواد
materialWastePercent = (wastedMaterials / totalMaterials) × 100

// 5. معدل استغلال المعدات
equipmentUtilization = (hoursUsed / hoursAvailable) × 100
```

---

## ⚠️ ملاحظات مهمة

### أفضل الممارسات:
- ✅ سجّل التكاليف يومياً
- ✅ راجع الملخصات أسبوعياً
- ✅ حدّث التقديرات عند الحاجة
- ✅ حلل الانحرافات فوراً

### التنبيهات:
- تنبيه عند تجاوز 10% من التكلفة المتوقعة
- تنبيه عند زيادة هدر المواد عن 5%
- تنبيه عند انخفاض كفاءة العمالة

### التكامل:
- يعمل مع نظام المخازن (المواد)
- يعمل مع نظام الموظفين (العمالة)
- يعمل مع نظام المعدات (المعدات)
- يعمل مع نظام المشاريع

---

## 🔗 روابط ذات صلة

- [نظام المشاريع](../) - ربط التكاليف بالمشاريع
- [نظام الموظفين](../01_نظام_الموظفين/) - تكاليف العمالة
- [نظام المعدات](../02_نظام_المعدات/) - تكاليف المعدات
- [نظام المخازن](../03_نظام_المخازن/) - تكاليف المواد
- [العودة لقواعد البيانات](../README.md)

---

**الحالة:** 🔄 قيد الإنشاء - سيتم إضافة التوثيق الكامل قريباً  
**آخر تحديث:** أكتوبر 2025
