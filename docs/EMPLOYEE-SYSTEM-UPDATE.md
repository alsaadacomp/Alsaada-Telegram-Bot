# 🚀 نظام إدارة الموظفين المحدث

## 📋 نظرة عامة

تم تحديث نظام إدارة الموظفين ليشمل تحسينات شاملة في إدارة البيانات والمرفقات وأكواد الموظفين.

## ✨ الميزات الجديدة

### 🗂️ تنظيف قاعدة البيانات
- **حذف الحقول غير المطلوبة:**
  - الأسماء المنفصلة (firstName, secondName, thirdName, lastName)
  - العمل الصحراوي (isFieldWorker, rotationSchedule)
  - البدلات (fieldAllowanceRate, housingAllowance, transportAllowance, foodAllowance)

### 💰 حقول الرواتب والمزايا الجديدة
- **رقم تحويل أول** (`transferNumber1`) - رقم موبايل 11 رقم
- **نوع التحويل الأول** (`transferType1`) - INSTAPAY أو CASH
- **رقم تحويل ثاني** (`transferNumber2`) - رقم موبايل 11 رقم
- **نوع التحويل الثاني** (`transferType2`) - INSTAPAY أو CASH

### 📞 معلومات الاتصال المحدثة
- **رقم Telegram ID** (`telegramId`) - للتواصل عبر Telegram

### 📁 نظام المرفقات الجديد
- **مجلدات منظمة لكل موظف:**
  - `attachments/employee-{CODE}-{NAME}/`
  - `id-cards/` - بطاقات الرقم القومي
  - `profile-photos/` - الصور الشخصية
  - `documents/` - المستندات العامة
  - `cv/` - السير الذاتية
  - `others/` - ملفات أخرى

### 🆔 نظام أكواد الموظفين الجديد
- **تنسيق الكود:** `{POSITION_CODE}-{SERIAL_NUMBER}`
- **مثال:** `CAT-01-001` (أول طباخ)
- **تغيير الوظيفة:** يحصل على كود جديد مع الاحتفاظ بالتاريخ

## 🛠️ الملفات الجديدة

### 1. `src/modules/utils/attachments-manager.ts`
```typescript
// إدارة المرفقات والملفات
AttachmentsManager.saveIdCard(employeeCode, employeeName, fileBuffer, fileName, side)
AttachmentsManager.saveProfilePhoto(employeeCode, employeeName, fileBuffer, fileName)
AttachmentsManager.saveCV(employeeCode, employeeName, fileBuffer, fileName)
AttachmentsManager.createEmployeeFolder(employeeCode, employeeName)
```

### 2. `src/modules/utils/employee-code-manager.ts`
```typescript
// إدارة أكواد الموظفين
EmployeeCodeManager.generateEmployeeCode(positionId)
EmployeeCodeManager.updateEmployeeCode(employeeId, newPositionId)
EmployeeCodeManager.validateEmployeeCode(employeeCode)
EmployeeCodeManager.getCodeStatistics(positionId?)
```

## 📊 التغييرات في قاعدة البيانات

### جدول Employee المحدث
```sql
-- الحقول المحذوفة
firstName, firstNameEn, secondName, secondNameEn, thirdName, thirdNameEn, lastName, lastNameEn
isFieldWorker, rotationSchedule, fieldAllowanceRate, housingAllowance, transportAllowance, foodAllowance
currentRotationId, lastRotationEndDate, nextRotationStartDate

-- الحقول المضافة
telegramId String?
transferNumber1 String?
transferType1 TransferType?
transferNumber2 String?
transferType2 TransferType?
nationalIdCardUrl String?
```

### Enum جديد
```sql
enum TransferType {
  INSTAPAY
  CASH
}
```

## 🔄 تدفق إضافة الموظف الجديد

### الخطوات المحدثة (7 خطوات)
1. **الاسم الكامل** - إدخال الاسم الكامل
2. **اسم الشهرة** - إدخال أو توليد تلقائي
3. **اختيار الوظيفة** - من قاعدة البيانات مع القسم التلقائي
4. **الرقم القومي** - مع التحقق من التكرار
5. **تاريخ الميلاد** - مع حساب العمر
6. **الجنس** - ذكر أو أنثى
7. **المحافظة** - من قاعدة البيانات
8. **رقم الموبايل** - مع تحديد الشبكة
9. **تاريخ بدء العمل** - اليوم أو تاريخ مخصص
10. **بطاقة الرقم القومي** - الوجه الأمامي والخلفي (اختياري)

### الميزات الجديدة في التدفق
- **توليد اسم الشهرة تلقائياً** - مع دعم الأسماء المركبة العربية
- **اختيار الوظيفة من قاعدة البيانات** - مع القسم التلقائي
- **نظام المرفقات المحسن** - مجلدات منظمة لكل موظف
- **كود موظف ذكي** - بناء على الوظيفة + رقم مسلسل
- **حذف الرسائل المؤقتة** - تنظيف الشات بعد الحفظ
- **أزرار التنقل** - العودة للقائمة الرئيسية أو إضافة موظف جديد

## 🎯 مثال على الاستخدام

### إنشاء موظف جديد
```typescript
// توليد كود الموظف
const codeInfo = await EmployeeCodeManager.generateEmployeeCode(positionId)
// النتيجة: { employeeCode: "CAT-01-001", positionCode: "CAT-01", serialNumber: 1 }

// حفظ بطاقة الرقم القومي
const attachment = await AttachmentsManager.saveIdCard(
  "CAT-01-001",
  "أحمد محمد علي",
  imageBuffer,
  "id-card-front.jpg",
  "front"
)
// النتيجة: مجلد attachments/employee-CAT-01-001-أحمد-محمد-علي/id-cards/CAT-01-001-id-card-front.jpg
```

## 📈 الإحصائيات

### البيانات المحذوفة
- **8 حقول أسماء** منفصلة
- **9 حقول عمل صحراوي** وبدلات
- **3 حقول دوارات** عمل

### البيانات المضافة
- **4 حقول تحويل** أموال
- **1 حقل Telegram ID**
- **1 حقل رابط بطاقة** الرقم القومي
- **نظام مرفقات** شامل
- **نظام أكواد** ذكي

## 🔧 التحديثات المطلوبة

### 1. تحديث ملفات Seed
```typescript
// إضافة أكواد للوظائف في seed-positions.ts
const positions = [
  { code: "CAT-01", titleAr: "طباخ", title: "Chef" },
  { code: "MNT-01", titleAr: "فني صيانة", title: "Maintenance Technician" },
  // ...
]
```

### 2. تحديث واجهات المستخدم
- إضافة حقول التحويل في نماذج الرواتب
- إضافة حقل Telegram ID في نماذج الاتصال
- تحديث عرض المرفقات في التقارير

### 3. تحديث التقارير
- عرض أكواد الموظفين الجديدة
- عرض معلومات المرفقات
- عرض إحصائيات الأكواد

## 🚀 الخطوات التالية

1. **اختبار النظام الجديد** - إضافة موظف تجريبي
2. **تحديث الواجهات** - نماذج الرواتب والاتصال
3. **إضافة ميزات إضافية** - رفع السيرة الذاتية والصور الشخصية
4. **تحسين التقارير** - عرض المرفقات والإحصائيات

## 📝 ملاحظات مهمة

- **البيانات القديمة** محفوظة في النسخ الاحتياطية
- **النظام متوافق** مع البيانات الموجودة
- **الأكواد الجديدة** تبدأ من 001 لكل وظيفة
- **المرفقات** محفوظة في مجلدات منظمة
- **النظام قابل للتوسع** لإضافة ميزات جديدة

---

**تم التحديث بنجاح! 🎉**

النظام الآن أكثر تنظيماً وفعالية مع ميزات متقدمة لإدارة الموظفين والمرفقات.
