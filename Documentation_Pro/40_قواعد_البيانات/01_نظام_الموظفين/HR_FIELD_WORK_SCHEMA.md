# 🏜️ نظام إدارة العمل الميداني والدورات

## 📋 نظرة عامة

هذا النظام مصمم خصيصاً لإدارة **العاملين الميدانيين في المشاريع الصحراوية** حيث يتم العمل بنظام **الدورات** (28/7، 21/7، 14/7) مع تتبع شامل للإجازات والسلف والرواتب.

---

## 🎯 المميزات الرئيسية

### ✅ نظام الدورات (Work Rotations)
- تتبع دورات العمل (28 يوم عمل / 7 أيام راحة)
- إدارة الدورات النشطة والمخططة
- تسجيل مواقع العمل لكل دورة

### ✅ إدارة الإجازات
- إجازات سنوية، مرضية، طارئة، بدون راتب
- نظام موافقات متكامل
- تعيين بديل للموظف في الإجازة

### ✅ السلف والمسحوبات
- تسجيل طلبات السلف
- نظام موافقات
- تتبع الخصومات الشهرية

### ✅ الرواتب الشهرية
- حساب تلقائي للرواتب والبدلات
- خصومات متعددة (سلف، غرامات، غياب)
- تتبع حالة الدفع

### ✅ استثناءات الحضور
- تسجيل التأخير والانصراف المبكر
- الغياب والعمل الإضافي
- نظام موافقات

---

## 📊 تحديثات جدول الموظف (Employee)

### الحقول الجديدة للعمل الميداني:

```prisma
model Employee {
  // ... الحقول الموجودة ...
  
  // 🆕 معلومات العمل الصحراوي
  isFieldWorker         Boolean          @default(true)  // عامل ميداني؟
  rotationSchedule      String?          // نظام الدورة (28/7, 21/7)
  fieldAllowanceRate    Float?           @default(0)     // بدل العمل الصحراوي
  housingAllowance      Float?           @default(0)     // بدل سكن
  transportAllowance    Float?           @default(0)     // بدل مواصلات
  foodAllowance         Float?           @default(0)     // بدل طعام
  currentRotationId     Int?             // الدورة الحالية
  lastRotationEndDate   DateTime?        // آخر دورة
  nextRotationStartDate DateTime?        // بداية الدورة القادمة
  
  // الحضور والانصراف
  attendanceRequired    Boolean          @default(false) // ليس مطلوب في العمل الصحراوي
  
  // Relations - HR
  rotations             HR_WorkRotation[]       @relation("EmployeeRotations")
  leaves                HR_EmployeeLeave[]      @relation("EmployeeLeaves")
  leaveReplacements     HR_EmployeeLeave[]      @relation("LeaveReplacements")
  advances              HR_EmployeeAdvance[]    @relation("EmployeeAdvances")
  payrolls              HR_MonthlyPayroll[]     @relation("EmployeePayrolls")
  attendanceExceptions  HR_AttendanceException[]
  
  // ... باقي الحقول ...
  
  @@index([isFieldWorker])
  @@index([currentRotationId])
}
```

### 📝 وصف الحقول:

| الحقل | النوع | الوصف |
|------|------|-------|
| `isFieldWorker` | Boolean | هل الموظف عامل ميداني؟ (افتراضي: true) |
| `rotationSchedule` | String | نظام الدورة مثل "28/7" أو "21/7" |
| `fieldAllowanceRate` | Float | بدل العمل الصحراوي الشهري |
| `housingAllowance` | Float | بدل السكن |
| `transportAllowance` | Float | بدل المواصلات |
| `foodAllowance` | Float | بدل الطعام |
| `currentRotationId` | Int | معرف الدورة الحالية النشطة |
| `lastRotationEndDate` | DateTime | تاريخ انتهاء آخر دورة |
| `nextRotationStartDate` | DateTime | تاريخ بداية الدورة القادمة |
| `attendanceRequired` | Boolean | هل الحضور مطلوب؟ (false للعمل الميداني) |

---

## 🔄 جدول دورات العمل (HR_WorkRotation)

### الغرض:
تتبع دورات عمل العاملين الميدانيين في المشاريع الصحراوية.

### Schema:

```prisma
model HR_WorkRotation {
  id                Int       @id @default(autoincrement())
  employeeId        Int
  rotationType      String    // نوع الدورة: "28/7", "21/7", "14/7"
  startDate         DateTime
  endDate           DateTime
  status            String    @default("planned") // planned, active, completed, cancelled
  location          String?   // موقع العمل
  notes             String?
  
  // Relations
  employee          Employee @relation("EmployeeRotations", fields: [employeeId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([employeeId])
  @@index([status])
  @@index([startDate, endDate])
}
```

### 📋 الحقول:

| الحقل | النوع | الوصف | مثال |
|------|------|-------|------|
| `id` | Int | المعرف الفريد | 1 |
| `employeeId` | Int | معرف الموظف | 123 |
| `rotationType` | String | نظام الدورة | "28/7", "21/7", "14/7" |
| `startDate` | DateTime | تاريخ بداية الدورة | 2025-01-01 |
| `endDate` | DateTime | تاريخ نهاية الدورة | 2025-01-28 |
| `status` | String | حالة الدورة | planned, active, completed, cancelled |
| `location` | String | موقع العمل | "مشروع الواحات" |
| `notes` | String | ملاحظات | - |

### 🔄 حالات الدورة (Status):

- **planned** 📅 - مخططة (لم تبدأ بعد)
- **active** 🟢 - نشطة (جارية حالياً)
- **completed** ✅ - مكتملة (انتهت)
- **cancelled** ❌ - ملغاة

### 💡 أمثلة الاستخدام:

```typescript
// إنشاء دورة جديدة
const rotation = await prisma.hR_WorkRotation.create({
  data: {
    employeeId: 123,
    rotationType: "28/7",
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-01-28"),
    status: "planned",
    location: "مشروع الواحات"
  }
})

// جلب الدورة النشطة للموظف
const activeRotation = await prisma.hR_WorkRotation.findFirst({
  where: {
    employeeId: 123,
    status: "active"
  },
  include: {
    employee: true
  }
})

// جلب جميع دورات موظف
const rotations = await prisma.hR_WorkRotation.findMany({
  where: { employeeId: 123 },
  orderBy: { startDate: 'desc' }
})
```

---

## 🏖️ جدول الإجازات (HR_EmployeeLeave)

### الغرض:
إدارة جميع أنواع إجازات الموظفين مع نظام موافقات متكامل.

### Schema:

```prisma
model HR_EmployeeLeave {
  id                Int       @id @default(autoincrement())
  employeeId        Int
  leaveType         String    // annual, sick, emergency, unpaid
  startDate         DateTime
  endDate           DateTime
  totalDays         Int
  reason            String?
  status            String    @default("pending") // pending, approved, rejected, cancelled
  replacementId     Int?      // من يحل محله
  approvedBy        Int?
  approvedAt        DateTime?
  rejectionReason   String?
  
  // Relations
  employee          Employee @relation("EmployeeLeaves", fields: [employeeId], references: [id], onDelete: Cascade)
  replacement       Employee? @relation("LeaveReplacements", fields: [replacementId], references: [id])
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([employeeId])
  @@index([status])
  @@index([startDate, endDate])
}
```

### 📋 الحقول:

| الحقل | النوع | الوصف |
|------|------|-------|
| `id` | Int | المعرف الفريد |
| `employeeId` | Int | معرف الموظف |
| `leaveType` | String | نوع الإجازة (annual, sick, emergency, unpaid) |
| `startDate` | DateTime | تاريخ بداية الإجازة |
| `endDate` | DateTime | تاريخ نهاية الإجازة |
| `totalDays` | Int | عدد الأيام |
| `reason` | String | سبب الإجازة |
| `status` | String | حالة الطلب (pending, approved, rejected, cancelled) |
| `replacementId` | Int | معرف البديل |
| `approvedBy` | Int | من وافق على الطلب |
| `approvedAt` | DateTime | تاريخ الموافقة |
| `rejectionReason` | String | سبب الرفض |

### 📝 أنواع الإجازات:

- **annual** 🏖️ - إجازة سنوية
- **sick** 🤒 - إجازة مرضية
- **emergency** 🚨 - إجازة طارئة
- **unpaid** 💰 - إجازة بدون راتب

### 🔄 حالات الطلب:

- **pending** ⏳ - قيد الانتظار
- **approved** ✅ - موافق عليها
- **rejected** ❌ - مرفوضة
- **cancelled** 🚫 - ملغاة

### 💡 أمثلة الاستخدام:

```typescript
// طلب إجازة سنوية
const leave = await prisma.hR_EmployeeLeave.create({
  data: {
    employeeId: 123,
    leaveType: "annual",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-02-07"),
    totalDays: 7,
    reason: "إجازة عائلية",
    replacementId: 456 // البديل
  }
})

// الموافقة على إجازة
const approvedLeave = await prisma.hR_EmployeeLeave.update({
  where: { id: 1 },
  data: {
    status: "approved",
    approvedBy: 999,
    approvedAt: new Date()
  }
})

// جلب الإجازات المعلقة
const pendingLeaves = await prisma.hR_EmployeeLeave.findMany({
  where: { status: "pending" },
  include: {
    employee: true,
    replacement: true
  }
})
```

---

## 💰 جدول السلف والمسحوبات (HR_EmployeeAdvance)

### الغرض:
إدارة سلف ومسحوبات الموظفين مع تتبع الخصومات الشهرية.

### Schema:

```prisma
model HR_EmployeeAdvance {
  id                Int       @id @default(autoincrement())
  employeeId        Int
  amount            Float
  reason            String?
  requestDate       DateTime  @default(now())
  approvalStatus    String    @default("pending") // pending, approved, rejected
  approvedBy        Int?
  approvedAt        DateTime?
  deductionStartDate DateTime?
  monthlyDeduction  Float?
  remainingBalance  Float?
  isPaid            Boolean   @default(false)
  notes             String?
  
  // Relations
  employee          Employee @relation("EmployeeAdvances", fields: [employeeId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([employeeId])
  @@index([approvalStatus])
  @@index([isPaid])
}
```

### 📋 الحقول:

| الحقل | النوع | الوصف |
|------|------|-------|
| `id` | Int | المعرف الفريد |
| `employeeId` | Int | معرف الموظف |
| `amount` | Float | مبلغ السلفة |
| `reason` | String | سبب السلفة |
| `requestDate` | DateTime | تاريخ الطلب |
| `approvalStatus` | String | حالة الموافقة (pending, approved, rejected) |
| `approvedBy` | Int | من وافق على الطلب |
| `approvedAt` | DateTime | تاريخ الموافقة |
| `deductionStartDate` | DateTime | تاريخ بدء الخصم |
| `monthlyDeduction` | Float | قيمة الخصم الشهري |
| `remainingBalance` | Float | الرصيد المتبقي |
| `isPaid` | Boolean | هل تم دفع السلفة؟ |
| `notes` | String | ملاحظات |

### 💡 أمثلة الاستخدام:

```typescript
// طلب سلفة جديدة
const advance = await prisma.hR_EmployeeAdvance.create({
  data: {
    employeeId: 123,
    amount: 5000,
    reason: "ظروف عائلية",
    monthlyDeduction: 500
  }
})

// الموافقة على سلفة
const approvedAdvance = await prisma.hR_EmployeeAdvance.update({
  where: { id: 1 },
  data: {
    approvalStatus: "approved",
    approvedBy: 999,
    approvedAt: new Date(),
    deductionStartDate: new Date("2025-02-01"),
    remainingBalance: 5000,
    isPaid: true
  }
})

// حساب الرصيد المتبقي بعد خصم شهري
const updateBalance = await prisma.hR_EmployeeAdvance.update({
  where: { id: 1 },
  data: {
    remainingBalance: {
      decrement: 500
    }
  }
})
```

---

## 💵 جدول الرواتب الشهرية (HR_MonthlyPayroll)

### الغرض:
إدارة رواتب الموظفين الشهرية مع البدلات والخصومات.

### Schema:

```prisma
model HR_MonthlyPayroll {
  id                Int       @id @default(autoincrement())
  employeeId        Int
  month             Int       // 1-12
  year              Int
  
  // الراتب الأساسي والبدلات
  basicSalary       Float
  housingAllowance  Float     @default(0)
  transportAllowance Float    @default(0)
  foodAllowance     Float     @default(0)
  fieldAllowance    Float     @default(0)
  otherAllowances   Float     @default(0)
  
  // الخصومات
  advances          Float     @default(0)
  penalties         Float     @default(0)
  absences          Float     @default(0)
  otherDeductions   Float     @default(0)
  
  // الإجمالي
  grossSalary       Float
  totalDeductions   Float
  netSalary         Float
  
  // حالة الدفع
  paymentStatus     String    @default("pending") // pending, paid, cancelled
  paymentDate       DateTime?
  paymentMethod     String?   // cash, bank_transfer
  
  notes             String?
  
  // Relations
  employee          Employee @relation("EmployeePayrolls", fields: [employeeId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@unique([employeeId, month, year])
  @@index([employeeId])
  @@index([month, year])
  @@index([paymentStatus])
}
```

### 📋 الحقول:

| القسم | الحقول |
|------|--------|
| **الراتب** | basicSalary, housingAllowance, transportAllowance, foodAllowance, fieldAllowance, otherAllowances |
| **الخصومات** | advances, penalties, absences, otherDeductions |
| **الإجمالي** | grossSalary, totalDeductions, netSalary |
| **الدفع** | paymentStatus, paymentDate, paymentMethod |

### 📊 المعادلات:

```typescript
// الراتب الإجمالي
grossSalary = basicSalary + 
              housingAllowance + 
              transportAllowance + 
              foodAllowance + 
              fieldAllowance + 
              otherAllowances

// إجمالي الخصومات
totalDeductions = advances + 
                  penalties + 
                  absences + 
                  otherDeductions

// الراتب الصافي
netSalary = grossSalary - totalDeductions
```

### 💡 مثال كامل لحساب راتب:

```typescript
// حساب راتب شهر يناير 2025
const employee = await prisma.employee.findUnique({
  where: { id: 123 }
})

// جلب السلف المستحقة
const monthlyAdvances = await prisma.hR_EmployeeAdvance.findMany({
  where: {
    employeeId: 123,
    remainingBalance: { gt: 0 }
  }
})

const totalAdvances = monthlyAdvances.reduce((sum, adv) => 
  sum + (adv.monthlyDeduction || 0), 0
)

// حساب الراتب
const grossSalary = 
  employee.basicSalary +
  (employee.housingAllowance || 0) +
  (employee.transportAllowance || 0) +
  (employee.foodAllowance || 0) +
  (employee.fieldAllowanceRate || 0)

const totalDeductions = totalAdvances + 0 + 0 + 0 // سلف + غرامات + غياب + أخرى

const netSalary = grossSalary - totalDeductions

// إنشاء سجل الراتب
const payroll = await prisma.hR_MonthlyPayroll.create({
  data: {
    employeeId: 123,
    month: 1,
    year: 2025,
    basicSalary: employee.basicSalary,
    housingAllowance: employee.housingAllowance || 0,
    transportAllowance: employee.transportAllowance || 0,
    foodAllowance: employee.foodAllowance || 0,
    fieldAllowance: employee.fieldAllowanceRate || 0,
    advances: totalAdvances,
    grossSalary,
    totalDeductions,
    netSalary,
    paymentStatus: "pending"
  }
})
```

---

## 📋 جدول استثناءات الحضور (HR_AttendanceException)

### الغرض:
تسجيل استثناءات الحضور (تأخير، انصراف مبكر، غياب، عمل إضافي).

### Schema:

```prisma
model HR_AttendanceException {
  id                Int       @id @default(autoincrement())
  employeeId        Int
  date              DateTime
  exceptionType     String    // late, early_leave, absence, overtime
  hours             Float?
  reason            String?
  status            String    @default("pending") // pending, approved, rejected
  approvedBy        Int?
  
  // Relations
  employee          Employee @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  @@index([employeeId])
  @@index([date])
  @@index([status])
}
```

### 📋 أنواع الاستثناءات:

- **late** ⏰ - تأخير
- **early_leave** 🏃 - انصراف مبكر
- **absence** ❌ - غياب
- **overtime** ⏱️ - عمل إضافي

### 💡 أمثلة الاستخدام:

```typescript
// تسجيل تأخير
const lateException = await prisma.hR_AttendanceException.create({
  data: {
    employeeId: 123,
    date: new Date("2025-01-15"),
    exceptionType: "late",
    hours: 1.5,
    reason: "ظروف طارئة"
  }
})

// تسجيل عمل إضافي
const overtime = await prisma.hR_AttendanceException.create({
  data: {
    employeeId: 123,
    date: new Date("2025-01-20"),
    exceptionType: "overtime",
    hours: 3,
    status: "approved",
    approvedBy: 999
  }
})
```

---

## 🔗 العلاقات بين الجداول

```
Employee (الموظف)
    ↓
    ├── HR_WorkRotation (دورات العمل) - One to Many
    ├── HR_EmployeeLeave (الإجازات) - One to Many
    ├── HR_EmployeeAdvance (السلف) - One to Many
    ├── HR_MonthlyPayroll (الرواتب) - One to Many
    └── HR_AttendanceException (استثناءات الحضور) - One to Many
```

---

## 📊 التقارير الممكنة

### 1. تقرير الدورات النشطة
```typescript
const activeRotations = await prisma.hR_WorkRotation.findMany({
  where: { status: 'active' },
  include: { employee: true }
})
```

### 2. تقرير الإجازات المعلقة
```typescript
const pendingLeaves = await prisma.hR_EmployeeLeave.findMany({
  where: { status: 'pending' },
  include: { 
    employee: true,
    replacement: true
  }
})
```

### 3. تقرير السلف المستحقة
```typescript
const unpaidAdvances = await prisma.hR_EmployeeAdvance.findMany({
  where: { 
    approvalStatus: 'approved',
    remainingBalance: { gt: 0 }
  },
  include: { employee: true }
})
```

### 4. تقرير الرواتب الشهرية
```typescript
const monthlyPayrolls = await prisma.hR_MonthlyPayroll.findMany({
  where: { 
    month: 1,
    year: 2025 
  },
  include: { employee: true },
  orderBy: { netSalary: 'desc' }
})
```

---

## 🎯 ملاحظات مهمة

### ✅ التحقق من البيانات:
1. تأكد من أن تواريخ الدورات لا تتداخل
2. تحقق من رصيد الإجازات قبل الموافقة
3. احسب السلف بشكل صحيح لتجنب الأخطاء

### ✅ الأمان:
- استخدم transactions عند إنشاء رواتب متعددة
- تحقق من الصلاحيات قبل الموافقات
- سجل جميع التعديلات مع معرف المستخدم

### ✅ الأداء:
- استخدم indexes للبحث السريع
- استخدم pagination للقوائم الطويلة
- استخدم select() لتحديد الحقول المطلوبة فقط

---

## 🚀 الخطوات القادمة

1. ✅ إنشاء الـ Handlers للتدفقات
2. ✅ بناء واجهات المستخدم
3. ✅ إنشاء التقارير
4. ✅ إضافة الإشعارات التلقائية
5. ✅ اختبار النظام بالكامل

---

**تم التوثيق بواسطة:** نظام التوثيق الاحترافي  
**التاريخ:** 2025-10-23  
**الإصدار:** 1.0
