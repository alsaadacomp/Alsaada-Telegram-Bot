# 📦 نظام المخازن - التوثيق الكامل

## 📋 نظرة عامة

نظام متكامل لإدارة المخزون والمواد، يشمل المخازن المتعددة، حركات المخزون، الجرد، وطلبات الشراء.

---

## 📚 سيتم إضافة الملفات التالية:

### 1. **WAREHOUSE_SYSTEM.md** (قيد الإنشاء)
- التوثيق الكامل للنظام
- شرح تفصيلي لـ 10 جداول
- أمثلة عملية

### 2. **QUICK_START.md** (قيد الإنشاء)
- دليل البدء السريع
- خطوات التطبيق

---

## 🗂️ هيكل النظام (10 جداول)

### 1. المخازن والتصنيفات
```
Warehouse                   → المخزن (اسم، موقع، مسؤول)
    ↓
Warehouse_Category          → تصنيف المواد (مواد بناء، كهرباء، إلخ)
    ↓
Warehouse_Item              → الصنف (اسم، كود، وحدة قياس)
```

### 2. حركات المخزون
```
Warehouse_Movement          → حركة (إضافة، صرف، نقل، إرجاع)
Warehouse_Transfer          → نقل بين مخزنين
```

### 3. الجرد والطلبات
```
Warehouse_Inventory         → عملية الجرد
Warehouse_Purchase_Request  → طلب شراء
```

### 4. الباركود والتنبيهات
```
Warehouse_Barcode          → ربط الصنف بالباركود
Warehouse_Alert            → تنبيهات (حد أدنى، انتهاء صلاحية)
Warehouse_Report           → التقارير
```

---

## ✨ الميزات الرئيسية

### 1️⃣ **مخازن متعددة**
- دعم عدد غير محدود من المخازن
- كل مخزن له مسؤول ومكان
- نقل المواد بين المخازن

### 2️⃣ **تصنيف المواد**
```
- مواد بناء (أسمنت، حديد، طوب)
- كهرباء (أسلاك، لمبات، مفاتيح)
- سباكة (مواسير، وصلات، صنابير)
- أدوات (شواكيش، مفكات، مثاقب)
```

### 3️⃣ **حركات المخزون**
- **إضافة:** استلام بضاعة جديدة
- **صرف:** صرف لمشروع أو موظف
- **نقل:** نقل بين مخزنين
- **إرجاع:** إرجاع مواد غير مستخدمة

### 4️⃣ **نظام الباركود**
- ربط كل صنف بباركود فريد
- مسح الباركود للصرف السريع
- طباعة ملصقات الباركود

### 5️⃣ **التنبيهات الذكية**
- تنبيه عند الوصول للحد الأدنى
- تنبيه قبل انتهاء الصلاحية
- تنبيه عند نفاد الصنف

---

## 📊 الجداول بالتفصيل

### 1. Warehouse (المخزن)
```prisma
model Warehouse {
  id          Int     @id @default(autoincrement())
  name        String  @unique        // "مخزن القاهرة"
  code        String  @unique        // "WH-CAI-01"
  location    String?                // "القاهرة - المعادي"
  managerId   Int?                   // مسؤول المخزن
  isActive    Boolean @default(true)
  
  manager     Employee? @relation(...)
}
```

### 2. Warehouse_Category (تصنيف المواد)
```prisma
model Warehouse_Category {
  id          Int     @id @default(autoincrement())
  name        String  @unique        // "مواد بناء"
  description String?
  isActive    Boolean @default(true)
}
```

### 3. Warehouse_Item (الصنف)
```prisma
model Warehouse_Item {
  id              Int     @id @default(autoincrement())
  itemCode        String  @unique        // "ITEM-001"
  name            String                 // "أسمنت حلوان"
  categoryId      Int
  unit            String                 // "شيكارة"
  unitPrice       Float?                 // السعر
  
  // الكمية
  currentStock    Float   @default(0)    // الرصيد الحالي
  minStock        Float?                 // الحد الأدنى
  maxStock        Float?                 // الحد الأقصى
  
  // معلومات إضافية
  description     String?
  barcode         String? @unique
  expiryDate      DateTime?              // تاريخ الانتهاء
  supplier        String?                // المورد
  
  isActive        Boolean @default(true)
}
```

### 4. Warehouse_Movement (الحركة)
```prisma
model Warehouse_Movement {
  id          Int      @id @default(autoincrement())
  warehouseId Int
  itemId      Int
  movementType String  // إضافة، صرف، نقل، إرجاع
  quantity    Float
  
  // التفاصيل
  date        DateTime @default(now())
  projectId   Int?                 // للمشروع (إن وجد)
  employeeId  Int?                 // الموظف المستلم
  reference   String?              // رقم مرجعي
  notes       String?
  
  // المستخدم
  createdBy   Int?
  createdAt   DateTime @default(now())
}
```

### 5. Warehouse_Transfer (النقل بين المخازن)
```prisma
model Warehouse_Transfer {
  id              Int      @id @default(autoincrement())
  itemId          Int
  fromWarehouseId Int
  toWarehouseId   Int
  quantity        Float
  transferDate    DateTime @default(now())
  
  status          String   @default("قيد الانتظار")
  // قيد الانتظار، تم الإرسال، تم الاستلام
  
  sentBy          Int?     // من أرسل
  receivedBy      Int?     // من استلم
  notes           String?
}
```

### 6. Warehouse_Inventory (الجرد)
```prisma
model Warehouse_Inventory {
  id              Int      @id @default(autoincrement())
  warehouseId     Int
  inventoryDate   DateTime @default(now())
  
  // النتائج
  totalItems      Int?
  totalValue      Float?
  
  status          String   @default("جاري")
  // جاري، مكتمل، ملغي
  
  performedBy     Int?     // من قام بالجرد
  notes           String?
  
  // التفاصيل (JSON)
  items           Json?    // [{itemId, expected, actual, diff}]
}
```

### 7. Warehouse_Purchase_Request (طلب شراء)
```prisma
model Warehouse_Purchase_Request {
  id          Int      @id @default(autoincrement())
  itemId      Int
  quantity    Float
  urgency     String   @default("عادي")
  // عاجل، عادي، منخفض
  
  requestDate DateTime @default(now())
  requestedBy Int
  
  status      String   @default("قيد الانتظار")
  // قيد الانتظار، موافق عليه، مرفوض، تم الشراء
  
  notes       String?
  approvedBy  Int?
  approvedAt  DateTime?
}
```

### 8. Warehouse_Barcode (الباركود)
```prisma
model Warehouse_Barcode {
  id        Int     @id @default(autoincrement())
  itemId    Int     @unique
  barcode   String  @unique
  createdAt DateTime @default(now())
}
```

### 9. Warehouse_Alert (التنبيهات)
```prisma
model Warehouse_Alert {
  id        Int      @id @default(autoincrement())
  itemId    Int
  alertType String   // حد_أدنى، انتهاء_صلاحية، نفاد
  message   String
  createdAt DateTime @default(now())
  isRead    Boolean  @default(false)
}
```

### 10. Warehouse_Report (التقارير)
```prisma
model Warehouse_Report {
  id          Int      @id @default(autoincrement())
  reportType  String   // جرد، حركات، تكاليف
  startDate   DateTime
  endDate     DateTime
  data        Json     // بيانات التقرير
  createdAt   DateTime @default(now())
}
```

---

## 🚀 أمثلة عملية

### مثال 1: إضافة مخزن جديد
```typescript
const warehouse = await prisma.warehouse.create({
  data: {
    name: "مخزن القاهرة الرئيسي",
    code: "WH-CAI-01",
    location: "القاهرة - المعادي",
    managerId: 5
  }
});
```

### مثال 2: إضافة صنف
```typescript
const item = await prisma.warehouse_Item.create({
  data: {
    itemCode: "ITEM-001",
    name: "أسمنت حلوان",
    categoryId: 1,  // مواد بناء
    unit: "شيكارة",
    unitPrice: 85,
    currentStock: 1000,
    minStock: 100,
    barcode: "1234567890123"
  }
});
```

### مثال 3: تسجيل حركة (صرف)
```typescript
const movement = await prisma.warehouse_Movement.create({
  data: {
    warehouseId: 1,
    itemId: 1,
    movementType: "صرف",
    quantity: 100,
    projectId: 5,  // لمشروع معين
    employeeId: 10, // الموظف المستلم
    notes: "صرف لمشروع برج النيل"
  }
});

// تحديث المخزون تلقائياً
await prisma.warehouse_Item.update({
  where: { id: 1 },
  data: {
    currentStock: { decrement: 100 }
  }
});
```

### مثال 4: نقل بين مخزنين
```typescript
const transfer = await prisma.warehouse_Transfer.create({
  data: {
    itemId: 1,
    fromWarehouseId: 1,  // مخزن القاهرة
    toWarehouseId: 2,    // مخزن الإسكندرية
    quantity: 50,
    sentBy: 5
  }
});
```

---

## 📊 تقارير مقترحة

1. **تقرير المخزون الحالي** - كل الأصناف بكمياتها
2. **الأصناف قليلة المخزون** - أقل من الحد الأدنى
3. **حركات المخزون** - خلال فترة معينة
4. **قيمة المخزون** - حساب إجمالي القيمة
5. **أكثر الأصناف صرفاً** - تحليل الاستهلاك

---

## ⚠️ ملاحظات مهمة

### أفضل الممارسات:
- ✅ سجّل كل حركة فوراً
- ✅ اعمل جرد دوري (شهري أو ربع سنوي)
- ✅ راجع التنبيهات يومياً
- ✅ حدّث أسعار الأصناف باستمرار

### التنبيهات التلقائية:
- عند الوصول لـ 80% من الحد الأدنى
- قبل 30 يوم من انتهاء الصلاحية
- عند نفاد أي صنف

---

## 🔗 روابط ذات صلة

- [نظام المشاريع](../) - ربط المخزون بالمشاريع
- [نظام التكاليف](../04_نظام_حساب_التكاليف/) - تكاليف المواد
- [نظام الباركود](../../90_وحدات_جاهزة/02_الباركود.md)
- [العودة لقواعد البيانات](../README.md)

---

**الحالة:** 🔄 قيد الإنشاء - سيتم إضافة التوثيق الكامل قريباً  
**آخر تحديث:** أكتوبر 2025
