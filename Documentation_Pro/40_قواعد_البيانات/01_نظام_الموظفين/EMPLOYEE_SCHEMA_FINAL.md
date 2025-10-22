# 📋 Schema النهائي لجدول العاملين - محدث

## ✅ التعديلات:
1. ✅ إضافة حالة "في مأمورية" (ON_MISSION)
2. ✅ إضافة Telegram ID للربط بالبوت
3. ✅ جميع الحقول الإضافية اختيارية (Optional)

---

## 🎯 الحقول الإجبارية (13 حقل فقط):

```typescript
// الحقول الإجبارية (Required - بدون علامة ?)
code              // كود العامل
fullName          // الاسم الكامل
positionId        // الوظيفة
departmentId      // القسم
nationalId        // الرقم القومي
dateOfBirth       // تاريخ الميلاد
gender            // النوع
governorateId     // المحافظة
mobilePhone       // رقم الموبايل
hireDate          // تاريخ التعيين
basicSalary       // الراتب الأساسي
status            // حالة الموظف
contractType      // نوع العقد
```

---

## 📄 Schema الكامل:

```prisma
model Employee {
  id                      Int       @id @default(autoincrement())
  
  // ═══════════════════════════════════════════════════════════
  // ✅ معلومات إجبارية (REQUIRED)
  // ═══════════════════════════════════════════════════════════
  
  // 1. كود العامل (تلقائي)
  code                    String    @unique
  
  // 2. الاسم الكامل
  fullName                String
  
  // 3. الوظيفة (إجباري)
  positionId              Int
  position                Position  @relation(fields: [positionId], references: [id], onDelete: Restrict)
  
  // 4. القسم (يُملأ تلقائياً من Position)
  departmentId            Int
  department              Department @relation(fields: [departmentId], references: [id], onDelete: Restrict)
  
  // 5. الرقم القومي (14 رقم - فريد)
  nationalId              String    @unique
  
  // 6. تاريخ الميلاد (يُستخرج من الرقم القومي)
  dateOfBirth             DateTime
  
  // 7. النوع
  gender                  Gender
  
  // 8. المحافظة
  governorateId           Int
  governorate             Governorate @relation(fields: [governorateId], references: [id])
  
  // 9. رقم الموبايل
  mobilePhone             String
  
  // 10. تاريخ التعيين
  hireDate                DateTime  @default(now())
  
  // 11. الراتب الأساسي
  basicSalary             Decimal   @db.Decimal(10, 2)
  
  // 12. حالة الموظف
  status                  EmployeeStatus @default(ACTIVE)
  
  // 13. نوع العقد
  contractType            ContractType   @default(PERMANENT)
  
  // ═══════════════════════════════════════════════════════════
  // ⚠️ معلومات اختيارية (OPTIONAL)
  // ═══════════════════════════════════════════════════════════
  
  // --- معلومات شخصية إضافية ---
  nickname                String?
  nationality             String?   @default("مصري")
  maritalStatus           MaritalStatus?
  numberOfChildren        Int?      @default(0)
  bloodType               String?
  address                 String?
  postalCode              String?
  
  // --- جواز السفر ---
  passportNumber          String?
  passportExpiryDate      DateTime?
  
  // --- الرخصة ---
  licenseNumber           String?
  licenseType             LicenseType?
  licenseExpiryDate       DateTime?
  
  // --- اتصال إضافي ---
  alternativePhone        String?
  email                   String?
  
  // --- معلومات التوظيف الإضافية ---
  terminationDate         DateTime?
  terminationReason       String?
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
  
  // ═══════════════════════════════════════════════════════════
  // 🔗 ربط بحساب البوت (OPTIONAL)
  // ═══════════════════════════════════════════════════════════
  
  // خيار 1: ربط بجدول User (إذا كان لديه حساب)
  userId                  Int?       @unique
  user                    User?      @relation(fields: [userId], references: [id])
  
  // خيار 2: Telegram ID مباشر (أسهل للربط)
  telegramId              BigInt?    @unique
  telegramUsername        String?
  
  // ═══════════════════════════════════════════════════════════
  // 📝 معلومات إدارية
  // ═══════════════════════════════════════════════════════════
  
  notes                   String?
  isActive                Boolean    @default(true)
  
  createdAt               DateTime   @default(now())
  updatedAt               DateTime   @updatedAt
  createdBy               Int?
  updatedBy               Int?
  
  // ═══════════════════════════════════════════════════════════
  // 🔗 العلاقات
  // ═══════════════════════════════════════════════════════════
  
  positionHistory         EmployeePositionHistory[]
  projectAssignments      ProjectEmployee[]
  
  // ═══════════════════════════════════════════════════════════
  // 📊 Indexes للأداء
  // ═══════════════════════════════════════════════════════════
  
  @@index([code])
  @@index([nationalId])
  @@index([positionId])
  @@index([departmentId])
  @@index([status])
  @@index([hireDate])
  @@index([isActive])
  @@index([fullName])
  @@index([governorateId])
  @@index([telegramId])
  @@index([userId])
  @@map("HR_Employee")
}

// ═══════════════════════════════════════════════════════════
// 📋 Enums
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
  ON_MISSION   // في مأمورية ✨ جديد
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

## 🔗 جدول المحافظات (Governorate):

```prisma
model Governorate {
  id         Int        @id @default(autoincrement())
  name       String     @unique
  nameEn     String?
  code       String?    @unique
  orderIndex Int        @default(0)
  isActive   Boolean    @default(true)
  
  employees  Employee[]
  
  @@index([code])
  @@index([name])
  @@map("Location_Governorate")
}
```

---

## 📜 جدول سجل تغيير الوظائف (EmployeePositionHistory):

```prisma
model EmployeePositionHistory {
  id              Int       @id @default(autoincrement())
  
  employeeId      Int
  employee        Employee  @relation(fields: [employeeId], references: [id], onDelete: Cascade)
  
  oldPositionId   Int?
  oldPosition     Position? @relation("OldPosition", fields: [oldPositionId], references: [id])
  
  newPositionId   Int
  newPosition     Position  @relation("NewPosition", fields: [newPositionId], references: [id])
  
  oldCode         String?   // الكود القديم للموظف
  newCode         String    // الكود الجديد للموظف
  
  oldDepartmentId Int?
  newDepartmentId Int
  
  reason          String?   // سبب التغيير
  changedAt       DateTime  @default(now())
  changedBy       Int?
  
  @@index([employeeId])
  @@index([changedAt])
  @@index([oldPositionId])
  @@index([newPositionId])
  @@map("HR_EmployeePositionHistory")
}
```

---

## 🔄 تحديث جدول Position:

```prisma
model Position {
  id            Int        @id @default(autoincrement())
  title         String
  titleAr       String
  code          String     @unique
  description   String?
  
  departmentId  Int
  department    Department @relation(fields: [departmentId], references: [id], onDelete: Restrict)
  
  orderIndex    Int        @default(0)
  isActive      Boolean    @default(true)
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  createdBy     Int?
  updatedBy     Int?

  // العلاقات
  employees                Employee[]
  positionHistoryOld       EmployeePositionHistory[] @relation("OldPosition")
  positionHistoryNew       EmployeePositionHistory[] @relation("NewPosition")

  @@index([code])
  @@index([departmentId])
  @@index([isActive])
  @@index([title])
  @@index([titleAr])
  @@index([createdAt])
  @@map("HR_Position")
}
```

---

## 🔄 تحديث جدول Department:

```prisma
model Department {
  id          Int        @id @default(autoincrement())
  name        String
  nameEn      String?
  code        String     @unique
  description String?
  managerId   Int?
  orderIndex  Int        @default(0)
  isActive    Boolean    @default(true)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  createdBy   Int?
  updatedBy   Int?

  // Relations
  positions   Position[]
  employees   Employee[]  // ✨ جديد

  @@index([code])
  @@index([isActive])
  @@index([orderIndex])
  @@index([name])
  @@index([createdAt])
  @@map("HR_Department")
}
```

---

## 🔄 تحديث جدول User:

```prisma
model User {
  id                                       Int                      @id @default(autoincrement())
  telegramId                               BigInt                   @unique
  username                                 String?                  @unique
  firstName                                String?
  lastName                                 String?
  fullName                                 String?
  nickname                                 String?
  phone                                    String?
  email                                    String?
  role                                     Role                     @default(GUEST)
  isActive                                 Boolean                  @default(true)
  isBanned                                 Boolean                  @default(false)
  bannedAt                                 DateTime?
  bannedReason                             String?
  bannedBy                                 Int?
  customPermissions                        String?
  department                               String?
  position                                 String?
  notes                                    String?
  lastActiveAt                             DateTime?                @updatedAt
  createdAt                                DateTime                 @default(now())
  updatedAt                                DateTime                 @updatedAt
  
  // العلاقات الموجودة
  JoinRequest_JoinRequest_userIdToUser     JoinRequest?             @relation("JoinRequest_userIdToUser")
  JoinRequest_JoinRequest_rejectedByToUser JoinRequest[]            @relation("JoinRequest_rejectedByToUser")
  JoinRequest_JoinRequest_approvedByToUser JoinRequest[]            @relation("JoinRequest_approvedByToUser")
  notificationPreferences                  NotificationPreferences?
  receivedNotifications                    NotificationRecipient[]
  createdTemplates                         NotificationTemplate[]   @relation("TemplateCreator")
  roleChangedBy                            RoleChange[]             @relation("ChangedByUser")
  roleChanges                              RoleChange[]             @relation("UserRoleChanges")
  
  // ✨ ربط بالموظف (جديد)
  employee                                 Employee?

  @@index([isActive])
  @@index([role])
  @@index([telegramId])
  @@index([username])
  @@index([bannedBy])
  @@index([department])
  @@index([position])
  @@index([lastActiveAt])
  @@index([email])
  @@index([phone])
  @@index([createdAt])
  @@index([role, isActive])
}
```

---

## 🔄 تحديث جدول Branch (إذا كنت تستخدمه):

```prisma
model Branch {
  id           Int       @id @default(autoincrement())
  companyId    Int
  name         String
  nameEn       String?
  code         String?
  address      String?
  addressEn    String?
  city         String?
  country      String?
  postalCode   String?
  region       String?
  phone        String?
  phone2       String?
  fax          String?
  mobile       String?
  email        String?
  email2       String?
  website      String?
  manager      String?
  managerPhone String?
  type         String?
  capacity     Int?
  openingDate  DateTime?
  isActive     Boolean   @default(true)
  notes        String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  createdBy    Int?
  updatedBy    Int?
  
  Company      Company   @relation(fields: [companyId], references: [id], onDelete: Cascade)
  
  // ✨ ربط بالموظفين (جديد)
  employees    Employee[]

  @@index([isActive])
  @@index([name])
  @@index([companyId])
  @@index([createdBy])
  @@index([updatedBy])
  @@index([type])
  @@index([capacity])
  @@index([city])
  @@index([country])
  @@index([createdAt])
  @@index([companyId, isActive])
}
```

---

## 📊 ملخص التعديلات:

### ✅ ما تم إضافته:
1. ✅ `ON_MISSION` في enum EmployeeStatus
2. ✅ `telegramId` و `telegramUsername` في Employee
3. ✅ علاقة `employee` في User
4. ✅ علاقة `employees` في Department
5. ✅ علاقة `employees` في Branch
6. ✅ جميع الحقول الإضافية أصبحت اختيارية (?)

### ✅ الحقول الإجبارية فقط (13):
- code, fullName, positionId, departmentId
- nationalId, dateOfBirth, gender
- governorateId, mobilePhone
- hireDate, basicSalary
- status, contractType

### ✅ كل الباقي اختياري!

---

## 🎯 فوائد الربط بـ Telegram:

### **الخيار 1: استخدام userId (ربط بجدول User)**
```typescript
// الموظف مربوط بحساب User كامل
const employee = await prisma.employee.findUnique({
  where: { id: 1 },
  include: { user: true }
})

console.log(employee.user.telegramId)
console.log(employee.user.role)
```

### **الخيار 2: استخدام telegramId مباشر** (أبسط ✅)
```typescript
// الموظف لديه Telegram ID مباشر
const employee = await prisma.employee.findUnique({
  where: { telegramId: 123456789 }
})

// البحث عن موظف من Telegram ID
const employee = await prisma.employee.findUnique({
  where: { telegramId: ctx.from.id }
})
```

**التوصية:** استخدم كلاهما!
- `userId` للربط الكامل مع نظام الصلاحيات
- `telegramId` للبحث السريع والربط المباشر

---

**هل التصميم المحدث مناسب الآن؟** 🚀
