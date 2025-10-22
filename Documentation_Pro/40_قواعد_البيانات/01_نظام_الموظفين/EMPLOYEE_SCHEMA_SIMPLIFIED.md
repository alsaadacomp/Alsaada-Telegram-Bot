# 📋 Schema النهائي لجدول العاملين - نسخة مبسطة

## ✅ الحقول الإجبارية (3 فقط):
1. **fullName** - الاسم الكامل
2. **positionId** - الوظيفة
3. **nationalId** - رقم البطاقة (14 رقم)

## ✅ الحقول التلقائية:
- **code** - كود العامل (من الوظيفة + مسلسل)
- **departmentId** - القسم (من الوظيفة)
- **dateOfBirth** - تاريخ الميلاد (من الرقم القومي)
- **gender** - النوع (من الرقم القومي)
- **nickname** - اسم الشهرة (من الاسم الكامل - يراعي الأسماء المركبة)
- **id**, **createdAt**, **updatedAt**

## ⚠️ كل الباقي اختياري!

---

```prisma
model Employee {
  id                      Int       @id @default(autoincrement())
  
  // ═══════════════════════════════════════════════════════════
  // ✅ حقول إجبارية (3 فقط)
  // ═══════════════════════════════════════════════════════════
  
  fullName                String    // الاسم الكامل
  positionId              Int       // الوظيفة
  nationalId              String    @unique  // رقم البطاقة (14 رقم)
  
  // ═══════════════════════════════════════════════════════════
  // ✅ حقول تُنشأ تلقائياً
  // ═══════════════════════════════════════════════════════════
  
  code                    String    @unique  // كود العامل (تلقائي)
  departmentId            Int       // القسم (تلقائي من Position)
  dateOfBirth             DateTime  // تاريخ الميلاد (تلقائي من الرقم القومي)
  gender                  Gender    // النوع (تلقائي من الرقم القومي)
  nickname                String    // اسم الشهرة (تلقائي من fullName)
  
  // ═══════════════════════════════════════════════════════════
  // ⚠️ جميع الحقول الأخرى اختيارية
  // ═══════════════════════════════════════════════════════════
  
  // --- معلومات شخصية ---
  nationality             String?   @default("مصري")
  maritalStatus           MaritalStatus?
  numberOfChildren        Int?      @default(0)
  bloodType               String?
  address                 String?
  postalCode              String?
  
  // --- المحافظة ---
  governorateId           Int?
  governorate             Governorate? @relation(fields: [governorateId], references: [id])
  
  // --- جواز السفر ---
  passportNumber          String?
  passportExpiryDate      DateTime?
  
  // --- الرخصة ---
  licenseNumber           String?
  licenseType             LicenseType?
  licenseExpiryDate       DateTime?
  
  // --- الاتصال ---
  mobilePhone             String?
  alternativePhone        String?
  email                   String?
  
  // --- التوظيف ---
  hireDate                DateTime? @default(now())
  terminationDate         DateTime?
  terminationReason       String?
  status                  EmployeeStatus? @default(ACTIVE)
  contractType            ContractType?   @default(PERMANENT)
  
  // --- الراتب ---
  basicSalary             Decimal?  @db.Decimal(10, 2)
  currency                String?   @default("EGP")
  monthlyLeaveDays        Int?      @default(2)
  
  // --- التحويلات المالية ---
  paymentMethod           PaymentMethod?  @default(CASH)
  paymentNumber           String?
  
  // --- معلومات بنكية ---
  bankName                String?
  bankAccountNumber       String?
  iban                    String?
  
  // --- التأمينات والصحة ---
  socialInsuranceNumber   String?
  healthInsuranceNumber   String?
  medicalCondition        String?
  
  // --- جهة الاتصال في الطوارئ ---
  emergencyContactName    String?
  emergencyContactRelation String?
  emergencyContactPhone   String?
  
  // --- المدير والفرع ---
  managerId               Int?
  manager                 Employee?  @relation("EmployeeManager", fields: [managerId], references: [id], onDelete: SetNull)
  subordinates            Employee[] @relation("EmployeeManager")
  
  branchId                Int?
  branch                  Branch?    @relation(fields: [branchId], references: [id])
  
  // --- المؤهلات والخبرة ---
  education               String?
  major                   String?
  experienceYears         Int?
  languages               String?    // JSON
  skills                  String?    // JSON
  
  // --- المستندات والصور ---
  photoUrl                String?
  nationalIdPhotoUrl      String?
  passportPhotoUrl        String?
  licensePhotoUrl         String?
  cvUrl                   String?
  contractUrl             String?
  documents               String?    // JSON
  
  // --- ربط بالبوت ---
  userId                  Int?       @unique
  user                    User?      @relation(fields: [userId], references: [id])
  
  telegramId              BigInt?    @unique
  telegramUsername        String?
  
  // --- إداري ---
  notes                   String?
  isActive                Boolean    @default(true)
  
  createdAt               DateTime   @default(now())
  updatedAt               DateTime   @updatedAt
  createdBy               Int?
  updatedBy               Int?
  
  // --- العلاقات ---
  position                Position   @relation(fields: [positionId], references: [id], onDelete: Restrict)
  department              Department @relation(fields: [departmentId], references: [id], onDelete: Restrict)
  positionHistory         EmployeePositionHistory[]
  projectAssignments      ProjectEmployee[]
  
  // --- Indexes ---
  @@index([code])
  @@index([nationalId])
  @@index([positionId])
  @@index([departmentId])
  @@index([status])
  @@index([hireDate])
  @@index([isActive])
  @@index([fullName])
  @@index([nickname])
  @@index([governorateId])
  @@index([telegramId])
  @@index([userId])
  @@map("HR_Employee")
}

// ═══════════════════════════════════════════════════════════
// Enums
// ═══════════════════════════════════════════════════════════

enum Gender {
  MALE      // ذكر
  FEMALE    // أنثى
}

enum MaritalStatus {
  SINGLE     // أعزب
  MARRIED    // متزوج
  DIVORCED   // مطلق
  WIDOWED    // أرمل
}

enum LicenseType {
  FIRST      // أولى
  SECOND     // ثانية
  THIRD      // ثالثة
  MOTORCYCLE // دراجة نارية
  HEAVY      // ثقيل
  TRAILER    // مقطورة
}

enum EmployeeStatus {
  ACTIVE       // نشط
  ON_LEAVE     // في إجازة
  ON_MISSION   // في مأمورية
  SUSPENDED    // موقوف
  TERMINATED   // منتهي الخدمة
}

enum ContractType {
  PERMANENT    // دائم
  TEMPORARY    // مؤقت
  SEASONAL     // موسمي
  PROBATION    // تحت الاختبار
}

enum PaymentMethod {
  CASH           // نقدي
  INSTAPAY       // InstaPay
  BANK_TRANSFER  // تحويل بنكي
  VODAFONE_CASH  // فودافون كاش
  ETISALAT_CASH  // اتصالات كاش
  ORANGE_CASH    // أورانج كاش
}
```

---

## 🔧 الدوال المساعدة:

### 1. توليد اسم الشهرة (nickname):

```typescript
function generateNickname(fullName: string): string {
  const cleanName = fullName.trim().replace(/\s+/g, ' ')
  const parts = cleanName.split(' ')
  
  if (parts.length === 1) {
    return parts[0]
  }
  
  // قائمة الأسماء المركبة
  const compoundNames = [
    'عبد الله', 'عبد الرحمن', 'عبد الحميد', 'عبد العزيز',
    'عبد الرحيم', 'عبد الكريم', 'عبد الملك', 'عبد الناصر',
    'عبد السلام', 'عبد المجيد', 'عبد الرؤوف', 'عبد الباسط',
    'عبد الفتاح', 'عبد الحليم', 'عبد الستار', 'عبد القادر',
    'عبد الوهاب', 'عبد المنعم', 'عبد اللطيف', 'عبد العليم',
    'أبو بكر', 'أبو الفضل', 'بنت الله'
  ]
  
  let firstNameEnd = 1
  
  // فحص الاسم الأول المركب
  for (const compound of compoundNames) {
    const compoundParts = compound.split(' ')
    if (parts.length >= compoundParts.length) {
      const testName = parts.slice(0, compoundParts.length).join(' ')
      if (testName === compound) {
        firstNameEnd = compoundParts.length
        break
      }
    }
  }
  
  const firstName = parts.slice(0, firstNameEnd).join(' ')
  
  if (parts.length <= firstNameEnd) {
    return firstName
  }
  
  // فحص الاسم الثاني المركب
  let secondNameEnd = firstNameEnd + 1
  for (const compound of compoundNames) {
    const compoundParts = compound.split(' ')
    if (parts.length >= firstNameEnd + compoundParts.length) {
      const testName = parts.slice(firstNameEnd, firstNameEnd + compoundParts.length).join(' ')
      if (testName === compound) {
        secondNameEnd = firstNameEnd + compoundParts.length
        break
      }
    }
  }
  
  const secondName = parts.slice(firstNameEnd, secondNameEnd).join(' ')
  
  return `${firstName} ${secondName}`
}
```

### 2. استخراج معلومات من الرقم القومي:

```typescript
function extractInfoFromNationalId(nationalId: string) {
  // التحقق من صحة الرقم القومي (14 رقم)
  if (!/^\d{14}$/.test(nationalId)) {
    throw new Error('رقم البطاقة يجب أن يكون 14 رقم')
  }
  
  // استخراج القرن
  const centuryDigit = nationalId[0]
  const century = centuryDigit === '2' ? 1900 : 2000
  
  // استخراج التاريخ
  const year = century + parseInt(nationalId.substring(1, 3))
  const month = parseInt(nationalId.substring(3, 5))
  const day = parseInt(nationalId.substring(5, 7))
  
  // التحقق من صحة التاريخ
  const dateOfBirth = new Date(year, month - 1, day)
  if (isNaN(dateOfBirth.getTime())) {
    throw new Error('تاريخ الميلاد غير صحيح في الرقم القومي')
  }
  
  // استخراج النوع من الرقم 13
  const genderDigit = parseInt(nationalId[12])
  const gender = genderDigit % 2 === 0 ? 'FEMALE' : 'MALE'
  
  return {
    dateOfBirth,
    gender,
    age: calculateAge(dateOfBirth)
  }
}
```

### 3. حساب العمر:

```typescript
function calculateAge(birthDate: Date): number {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}
```

### 4. توليد كود العامل:

```typescript
async function generateEmployeeCode(positionId: number, hireDate?: Date): Promise<string> {
  const position = await prisma.position.findUnique({
    where: { id: positionId },
    select: { code: true }
  })
  
  if (!position) {
    throw new Error('الوظيفة غير موجودة')
  }
  
  // الحصول على جميع الموظفين في نفس الوظيفة
  const employees = await prisma.employee.findMany({
    where: { positionId },
    select: { hireDate: true, createdAt: true },
    orderBy: [
      { hireDate: 'asc' },
      { createdAt: 'asc' }
    ]
  })
  
  // رقم الموظف = عدد الموظفين الحاليين + 1
  const serialNumber = employees.length + 1
  
  // الكود = كود الوظيفة + رقم مسلسل (3 أرقام)
  return `${position.code}-${String(serialNumber).padStart(3, '0')}`
  
  // مثال: CAT-01-001, ENG-02-015
}
```

### 5. إنشاء موظف جديد (مع جميع الحقول التلقائية):

```typescript
async function createEmployee(data: {
  fullName: string
  positionId: number
  nationalId: string
  // ... باقي الحقول الاختيارية
}) {
  // 1. استخراج المعلومات من الرقم القومي
  const { dateOfBirth, gender } = extractInfoFromNationalId(data.nationalId)
  
  // 2. توليد اسم الشهرة (إذا لم يُدخل)
  const nickname = data.nickname || generateNickname(data.fullName)
  
  // 3. الحصول على القسم من الوظيفة
  const position = await prisma.position.findUnique({
    where: { id: data.positionId },
    select: { departmentId: true }
  })
  
  if (!position) {
    throw new Error('الوظيفة غير موجودة')
  }
  
  // 4. توليد كود العامل
  const code = await generateEmployeeCode(data.positionId, data.hireDate)
  
  // 5. إنشاء الموظف
  const employee = await prisma.employee.create({
    data: {
      ...data,
      code,
      nickname,
      departmentId: position.departmentId,
      dateOfBirth,
      gender,
    },
    include: {
      position: true,
      department: true,
      governorate: true
    }
  })
  
  return employee
}

// مثال على الاستخدام:
const newEmployee = await createEmployee({
  fullName: 'عبد الله محمد أحمد علي',
  positionId: 5,  // مثلاً: طباخ
  nationalId: '29501012345678',
  mobilePhone: '01234567890',
  basicSalary: 5000,
  governorateId: 1  // القاهرة
})

// النتيجة:
// {
//   code: "CAT-01-001",
//   fullName: "عبد الله محمد أحمد علي",
//   nickname: "عبد الله محمد",  // تلقائي
//   dateOfBirth: 1995-01-01,      // تلقائي من الرقم القومي
//   gender: "MALE",               // تلقائي من الرقم القومي
//   departmentId: 10,             // تلقائي من الوظيفة
//   ...
// }
```

---

## 🧪 اختبارات اسم الشهرة:

```typescript
// اختبار الدالة
const tests = [
  { input: "عبد الله محمد أحمد علي", expected: "عبد الله محمد" },
  { input: "محمد أحمد علي حسن", expected: "محمد أحمد" },
  { input: "عبد الرحمن عبد العزيز أحمد", expected: "عبد الرحمن عبد العزيز" },
  { input: "أحمد علي", expected: "أحمد علي" },
  { input: "محمد", expected: "محمد" },
  { input: "أبو بكر الصديق محمد", expected: "أبو بكر الصديق" },
  { input: "عبد الفتاح السيسي", expected: "عبد الفتاح السيسي" },
  { input: "أحمد", expected: "أحمد" }
]

tests.forEach(test => {
  const result = generateNickname(test.input)
  console.log(`✓ ${test.input} → ${result}`)
  console.assert(result === test.expected, `Expected ${test.expected}, got ${result}`)
})
```

---

## 📊 ملخص الحقول:

| التصنيف | العدد | الحقول |
|---------|------|--------|
| **إجبارية** | 3 | fullName, positionId, nationalId |
| **تلقائية** | 6 | code, departmentId, dateOfBirth, gender, nickname, id/timestamps |
| **اختيارية** | 60+ | جميع الباقي |

---

## ✅ المزايا:

1. ✅ **بساطة الإدخال** - 3 حقول فقط مطلوبة
2. ✅ **ذكاء تلقائي** - استخراج المعلومات من الرقم القومي
3. ✅ **أسماء مركبة** - يراعي الأسماء العربية المركبة
4. ✅ **مرونة** - جميع المعلومات الإضافية اختيارية
5. ✅ **توسع مستقبلي** - يمكن إضافة حقول لاحقاً

---

**هل هذا التصميم نهائي؟ ابدأ الآن؟** 🚀
