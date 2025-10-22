# 👥 نظام الموظفين - التوثيق الكامل

## 📋 نظرة عامة

نظام شامل ومتكامل لإدارة بيانات الموظفين يغطي جميع الجوانب من المعلومات الشخصية إلى بيانات الراتب والعقود.

---

## 📚 الملفات المتوفرة

### 1. **EMPLOYEE_SCHEMA_FINAL.md** ⭐ (الموصى به)
**الوصف:** Schema النهائي الكامل - 40+ حقل

**محتويات:**
- ✅ المعلومات الأساسية (الاسم، الكود، الرقم القومي)
- ✅ المعلومات الشخصية (تاريخ الميلاد، الجنسية، الحالة الاجتماعية)
- ✅ معلومات الاتصال (العنوان، الهاتف، البريد)
- ✅ معلومات الوظيفة (القسم، المنصب، تاريخ التعيين)
- ✅ معلومات الراتب (الأساسي، البدلات، الخصومات)
- ✅ معلومات البنك (رقم الحساب، البنك، الفرع)
- ✅ التأمينات الاجتماعية
- ✅ جهات الاتصال للطوارئ
- ✅ الوثائق والمستندات
- ✅ المهارات والشهادات
- ✅ العقوبات والإنذارات
- ✅ الإجازات

**الاستخدام:**
```bash
# انسخ الـ Schema من هذا الملف مباشرة إلى schema.prisma
```

---

### 2. **EMPLOYEE_SCHEMA_PROPOSAL.md**
**الوصف:** مقترحات بديلة ونماذج مختلفة

**يحتوي على:**
- نماذج مختلفة حسب حجم الشركة
- خيارات إضافية للحقول
- أفكار للتوسع المستقبلي
- مقارنة بين النماذج المختلفة

**متى تستخدمه:**
- إذا كنت تريد تخصيص النظام
- للشركات ذات المتطلبات الخاصة
- للبحث عن أفكار جديدة

---

### 3. **EMPLOYEE_SCHEMA_SIMPLIFIED.md**
**الوصف:** نسخة مبسطة للشركات الصغيرة

**يحتوي على:**
- الحقول الأساسية فقط (~20 حقل)
- مناسب للشركات الصغيرة
- سهل الفهم والتطبيق
- قابل للتوسع لاحقاً

**متى تستخدمه:**
- شركة صغيرة أو ناشئة
- تريد البدء سريعاً
- ليس لديك الكثير من البيانات

---

## 🎯 متى تستخدم أي ملف؟

| الحالة | الملف الموصى به | السبب |
|--------|-----------------|--------|
| شركة متوسطة/كبيرة | **FINAL** ⭐ | شامل ومتكامل |
| شركة صغيرة | **SIMPLIFIED** | بسيط وسريع |
| تطوير مخصص | **PROPOSAL** | أفكار ومقترحات |
| دراسة الخيارات | **الثلاثة** | للمقارنة |

---

## 📊 هيكل جدول Employee (النسخة النهائية)

### المعلومات الأساسية
```prisma
employeeCode      String   @unique  // كود الموظف الفريد
firstName         String             // الاسم الأول
secondName        String?            // الاسم الثاني
thirdName         String?            // الاسم الثالث
lastName          String             // اسم العائلة
fullName          String             // الاسم الكامل (محسوب)
nationalId        String   @unique  // الرقم القومي
```

### المعلومات الشخصية
```prisma
gender            Gender            // ذكر/أنثى
dateOfBirth       DateTime          // تاريخ الميلاد
placeOfBirth      String?           // مكان الميلاد
nationality       String            // الجنسية
maritalStatus     MaritalStatus     // الحالة الاجتماعية
religion          String?           // الديانة
bloodType         String?           // فصيلة الدم
```

### معلومات الاتصال
```prisma
address           String?           // العنوان
city              String?           // المدينة
governorate       String?           // المحافظة
phoneNumber       String?           // رقم الهاتف
mobileNumber      String            // رقم الموبايل
email             String?           // البريد الإلكتروني
```

### معلومات الوظيفة
```prisma
companyId         Int               // الشركة
departmentId      Int               // القسم
positionId        Int               // الوظيفة
hireDate          DateTime          // تاريخ التعيين
employmentType    String            // دائم/مؤقت/متعاقد
workLocation      String?           // مكان العمل
```

### معلومات الراتب
```prisma
basicSalary       Float             // الراتب الأساسي
housingAllowance  Float?            // بدل السكن
transportAllowance Float?           // بدل الانتقال
otherAllowances   Float?            // بدلات أخرى
totalSalary       Float             // إجمالي الراتب
```

### معلومات البنك
```prisma
bankName          String?           // اسم البنك
bankAccountNumber String?           // رقم الحساب
bankBranch        String?           // الفرع
iban              String?           // IBAN
```

### التأمينات
```prisma
socialInsuranceNumber String?       // رقم التأمينات
healthInsuranceNumber String?       // رقم التأمين الصحي
```

---

## 🔗 العلاقات (Relations)

```prisma
model Employee {
  // العلاقات الأساسية
  company      Company      @relation(fields: [companyId], references: [id])
  department   Department   @relation(fields: [departmentId], references: [id])
  position     Position     @relation(fields: [positionId], references: [id])
  
  // العلاقات المتقدمة
  projects     Project[]                    // المشاريع
  equipment    Equipment_Shift_Assignment[] // المعدات
  documents    Employee_Document[]          // الوثائق
  penalties    Employee_Penalty[]           // العقوبات
  leaves       Employee_Leave[]             // الإجازات
  skills       Employee_Skill[]             // المهارات
}
```

---

## 🚀 البدء السريع

### الخطوة 1: اختيار النموذج
```bash
# للشركات الكبيرة - استخدم FINAL
# للشركات الصغيرة - استخدم SIMPLIFIED
```

### الخطوة 2: النسخ إلى Schema
```bash
# انسخ محتوى الملف المختار إلى:
prisma/schema.prisma
```

### الخطوة 3: إنشاء Migration
```bash
npx prisma migrate dev --name add_employee_system
```

### الخطوة 4: توليد Prisma Client
```bash
npx prisma generate
```

### الخطوة 5: الاستخدام
```typescript
// إضافة موظف جديد
const employee = await prisma.employee.create({
  data: {
    employeeCode: "EMP001",
    firstName: "أحمد",
    lastName: "محمد",
    nationalId: "29801010101010",
    companyId: 1,
    departmentId: 1,
    positionId: 1,
    hireDate: new Date(),
    // ... باقي البيانات
  }
});
```

---

## 📝 أمثلة عملية

### 1. إضافة موظف كامل
```typescript
const newEmployee = await prisma.employee.create({
  data: {
    // معلومات أساسية
    employeeCode: "EMP001",
    firstName: "أحمد",
    secondName: "محمد",
    thirdName: "علي",
    lastName: "حسن",
    fullName: "أحمد محمد علي حسن",
    nationalId: "29801010101010",
    
    // معلومات شخصية
    gender: "MALE",
    dateOfBirth: new Date("1998-01-01"),
    nationality: "مصري",
    maritalStatus: "SINGLE",
    
    // معلومات اتصال
    mobileNumber: "01012345678",
    email: "ahmed@example.com",
    address: "القاهرة",
    
    // معلومات وظيفة
    companyId: 1,
    departmentId: 2,
    positionId: 3,
    hireDate: new Date(),
    employmentType: "دائم",
    
    // معلومات راتب
    basicSalary: 5000,
    housingAllowance: 1000,
    transportAllowance: 500,
    totalSalary: 6500,
  }
});
```

### 2. البحث عن موظف
```typescript
// بالكود
const employee = await prisma.employee.findUnique({
  where: { employeeCode: "EMP001" }
});

// بالرقم القومي
const employee = await prisma.employee.findUnique({
  where: { nationalId: "29801010101010" }
});

// مع العلاقات
const employee = await prisma.employee.findUnique({
  where: { employeeCode: "EMP001" },
  include: {
    company: true,
    department: true,
    position: true,
    projects: true
  }
});
```

### 3. تحديث بيانات موظف
```typescript
const updated = await prisma.employee.update({
  where: { employeeCode: "EMP001" },
  data: {
    basicSalary: 6000,
    totalSalary: 7500,
    phoneNumber: "0223456789"
  }
});
```

### 4. الموظفين حسب القسم
```typescript
const employees = await prisma.employee.findMany({
  where: {
    departmentId: 2,
    isActive: true
  },
  include: {
    position: true
  }
});
```

---

## 🎨 النماذج (Enums)

```prisma
enum Gender {
  MALE     // ذكر
  FEMALE   // أنثى
}

enum MaritalStatus {
  SINGLE    // أعزب
  MARRIED   // متزوج
  DIVORCED  // مطلق
  WIDOWED   // أرمل
}

enum EmploymentType {
  PERMANENT  // دائم
  CONTRACT   // متعاقد
  TEMPORARY  // مؤقت
  PART_TIME  // جزئي
}
```

---

## ⚠️ ملاحظات مهمة

### الحقول المطلوبة (Required):
- employeeCode
- firstName
- lastName
- nationalId
- companyId
- departmentId
- positionId
- hireDate
- mobileNumber
- basicSalary

### الحقول الفريدة (Unique):
- employeeCode
- nationalId

### الفهارس (Indexes):
```prisma
@@index([companyId])
@@index([departmentId])
@@index([positionId])
@@index([isActive])
```

---

## 🔐 الأمان والخصوصية

⚠️ **بيانات حساسة - يجب حمايتها:**
- الرقم القومي
- رقم الحساب البنكي
- رقم التأمينات
- الراتب

**أفضل الممارسات:**
- ✅ استخدم HTTPS دائماً
- ✅ شفّر البيانات الحساسة
- ✅ صلاحيات محدودة لعرض الرواتب
- ✅ سجلات Audit لكل تعديل

---

## 📊 التقارير المقترحة

1. **قائمة الموظفين** - حسب القسم/الوظيفة
2. **تقرير الرواتب** - إجمالي شهري
3. **الموظفين الجدد** - خلال فترة معينة
4. **انتهاء العقود** - التنبيهات
5. **توزيع الموظفين** - حسب الأقسام

---

## 🔗 روابط ذات صلة

- [نظام الأقسام](../05_البيانات_الأساسية/DEPARTMENT_SETUP.md)
- [نظام الوظائف](../05_البيانات_الأساسية/POSITION_SETUP.md)
- [نظام الشركات](../05_البيانات_الأساسية/)
- [العودة لقواعد البيانات](../README.md)

---

**آخر تحديث:** أكتوبر 2025  
**الحالة:** ✅ جاهز للتطبيق  
**الإصدار:** 2.0
