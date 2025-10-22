# 📋 Schema المقترح لجدول العاملين

## جدول Employee الكامل:

```prisma
model Employee {
  id                      Int       @id @default(autoincrement())
  
  // ═══════════════════════════════════════
  // 1️⃣ معلومات التعريف
  // ═══════════════════════════════════════
  code                    String    @unique  // كود الموظف (تلقائي)
  fullName                String
  nickname                String?
  
  // ═══════════════════════════════════════
  // 2️⃣ الوظيفة والقسم
  // ═══════════════════════════════════════
  positionId              Int
  position                Position  @relation(fields: [positionId], references: [id], onDelete: Restrict)
  
  departmentId            Int       // يُملأ تلقائياً من Position
  department              Department @relation(fields: [departmentId], references: [id], onDelete: Restrict)
  
  // ═══════════════════════════════════════
  // 3️⃣ معلومات شخصية أساسية
  // ═══════════════════════════════════════
  nationalId              String    @unique  // 14 رقم
  dateOfBirth             DateTime  // يُستخرج من الرقم القومي
  gender                  Gender
  nationality             String    @default("مصري")
  maritalStatus           MaritalStatus?
  numberOfChildren        Int?      @default(0)
  bloodType               String?   // A+, B+, O+, AB+, ...
  
  // ═══════════════════════════════════════
  // 4️⃣ جواز السفر والرخصة
  // ═══════════════════════════════════════
  passportNumber          String?
  passportExpiryDate      DateTime?
  
  licenseNumber           String?
  licenseType             LicenseType?
  licenseExpiryDate       DateTime?
  
  // ═══════════════════════════════════════
  // 5️⃣ العنوان والاتصال
  // ═══════════════════════════════════════
  governorateId           Int
  governorate             Governorate @relation(fields: [governorateId], references: [id])
  
  address                 String?
  postalCode              String?
  
  mobilePhone             String
  alternativePhone        String?
  email                   String?
  
  // ═══════════════════════════════════════
  // 6️⃣ التوظيف والراتب
  // ═══════════════════════════════════════
  hireDate                DateTime  @default(now())
  terminationDate         DateTime?
  terminationReason       String?
  
  status                  EmployeeStatus @default(ACTIVE)
  contractType            ContractType   @default(PERMANENT)
  
  basicSalary             Decimal   @db.Decimal(10, 2)
  currency                String    @default("EGP")
  monthlyLeaveDays        Int       @default(2)
  
  // ═══════════════════════════════════════
  // 7️⃣ التحويلات المالية
  // ═══════════════════════════════════════
  paymentMethod           PaymentMethod  @default(CASH)
  paymentNumber           String?        // رقم InstaPay أو غيره
  
  // معلومات بنكية
  bankName                String?
  bankAccountNumber       String?
  iban                    String?
  
  // ═══════════════════════════════════════
  // 8️⃣ التأمينات والصحة
  // ═══════════════════════════════════════
  socialInsuranceNumber   String?
  healthInsuranceNumber   String?
  medicalCondition        String?   // حالة طبية خاصة
  
  // ═══════════════════════════════════════
  // 9️⃣ جهة الاتصال في الطوارئ
  // ═══════════════════════════════════════
  emergencyContactName    String?
  emergencyContactRelation String?  // أب، أم، أخ، زوج...
  emergencyContactPhone   String?
  
  // ═══════════════════════════════════════
  // 🔟 المدير والفرع
  // ═══════════════════════════════════════
  managerId               Int?
  manager                 Employee?  @relation("EmployeeManager", fields: [managerId], references: [id], onDelete: SetNull)
  subordinates            Employee[] @relation("EmployeeManager")
  
  branchId                Int?
  branch                  Branch?    @relation(fields: [branchId], references: [id])
  
  // ═══════════════════════════════════════
  // 1️⃣1️⃣ المؤهلات والخبرة
  // ═══════════════════════════════════════
  education               String?    // مؤهل دراسي
  major                   String?    // التخصص
  experienceYears         Int?
  languages               String?    // JSON
  skills                  String?    // JSON
  
  // ═══════════════════════════════════════
  // 1️⃣2️⃣ المستندات والصور
  // ═══════════════════════════════════════
  photoUrl                String?    // الصورة الشخصية
  nationalIdPhotoUrl      String?    // صورة البطاقة
  passportPhotoUrl        String?    // صورة جواز السفر
  licensePhotoUrl         String?    // صورة الرخصة
  cvUrl                   String?    // السيرة الذاتية
  contractUrl             String?    // العقد
  documents               String?    // JSON - مستندات أخرى
  
  // ═══════════════════════════════════════
  // 1️⃣3️⃣ ربط بحساب البوت (اختياري)
  // ═══════════════════════════════════════
  userId                  Int?       @unique
  user                    User?      @relation(fields: [userId], references: [id])
  
  // ═══════════════════════════════════════
  // 1️⃣4️⃣ معلومات إدارية
  // ═══════════════════════════════════════
  notes                   String?
  isActive                Boolean    @default(true)
  
  createdAt               DateTime   @default(now())
  updatedAt               DateTime   @updatedAt
  createdBy               Int?
  updatedBy               Int?
  
  // ═══════════════════════════════════════
  // العلاقات
  // ═══════════════════════════════════════
  positionHistory         EmployeePositionHistory[]
  projectAssignments      ProjectEmployee[]
  
  @@index([code])
  @@index([nationalId])
  @@index([positionId])
  @@index([departmentId])
  @@index([status])
  @@index([hireDate])
  @@index([isActive])
  @@index([fullName])
  @@index([governorateId])
  @@map("HR_Employee")
}

// ═══════════════════════════════════════
// Enums
// ═══════════════════════════════════════

enum Gender {
  MALE
  FEMALE
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
  CASH         // نقدي
  INSTAPAY     // InstaPay
  BANK_TRANSFER // تحويل بنكي
  VODAFONE_CASH // فودافون كاش
  ETISALAT_CASH // اتصالات كاش
  ORANGE_CASH  // أورانج كاش
}
```

## جداول إضافية:

### 1. جدول المحافظات:
```prisma
model Governorate {
  id        Int        @id @default(autoincrement())
  name      String     @unique
  nameEn    String?
  code      String?    @unique
  isActive  Boolean    @default(true)
  
  employees Employee[]
  
  @@map("Location_Governorate")
}
```

### 2. جدول سجل تغيير الوظائف:
```prisma
model EmployeePositionHistory {
  id              Int       @id @default(autoincrement())
  
  employeeId      Int
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  oldPositionId   Int?
  oldPosition     Position? @relation("OldPosition", fields: [oldPositionId], references: [id])
  
  newPositionId   Int
  newPosition     Position  @relation("NewPosition", fields: [newPositionId], references: [id])
  
  oldCode         String?   // الكود القديم
  newCode         String    // الكود الجديد
  oldDepartmentId Int?
  newDepartmentId Int
  
  reason          String?
  changedAt       DateTime  @default(now())
  changedBy       Int?
  
  @@index([employeeId])
  @@index([changedAt])
  @@map("HR_EmployeePositionHistory")
}
```

### 3. تحديث جدول Position:
```prisma
model Position {
  // ... الأعمدة الموجودة
  
  // إضافة العلاقات
  employees                Employee[]
  positionHistoryOld       EmployeePositionHistory[] @relation("OldPosition")
  positionHistoryNew       EmployeePositionHistory[] @relation("NewPosition")
}
```

## الدوال المساعدة:

### 1. استخراج تاريخ الميلاد من الرقم القومي:
```typescript
function extractBirthDateFromNationalId(nationalId: string): Date {
  // الرقم القومي: CYYMMDDPPSSSC
  // C = القرن (2=1900s, 3=2000s)
  // YY = السنة
  // MM = الشهر
  // DD = اليوم
  
  const century = nationalId[0] === '2' ? 1900 : 2000
  const year = century + parseInt(nationalId.substring(1, 3))
  const month = parseInt(nationalId.substring(3, 5))
  const day = parseInt(nationalId.substring(5, 7))
  
  return new Date(year, month - 1, day)
}
```

### 2. توليد كود الموظف:
```typescript
async function generateEmployeeCode(positionId: number): Promise<string> {
  const position = await prisma.position.findUnique({
    where: { id: positionId }
  })
  
  // عدد الموظفين الحاليين في نفس الوظيفة
  const count = await prisma.employee.count({
    where: { positionId }
  })
  
  // الكود = كود الوظيفة + رقم مسلسل
  return `${position.code}-${String(count + 1).padStart(3, '0')}`
  // مثال: CAT-01-001, ENG-02-005
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
