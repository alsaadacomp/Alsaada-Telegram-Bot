# 🆔 نظام أكواد الموظفين - Employee Code System

## 🎯 الهدف
نظام ذكي لتوليد وإدارة أكواد الموظفين بناء على الوظيفة والرقم المسلسل.

## 📋 تنسيق الكود

### البنية العامة
```
{POSITION_CODE}-{SERIAL_NUMBER}
```

### أمثلة
- `CAT-01-001` - أول طباخ
- `CAT-01-002` - ثاني طباخ
- `MNT-01-001` - أول فني صيانة
- `ADM-01-001` - أول مدير إداري

## 🔧 الاستخدام

### توليد كود جديد
```typescript
import { EmployeeCodeManager } from './employee-code-manager'

const codeInfo = await EmployeeCodeManager.generateEmployeeCode(positionId)
// النتيجة: { employeeCode: "CAT-01-001", positionCode: "CAT-01", serialNumber: 1 }
```

### تحديث الكود عند تغيير الوظيفة
```typescript
const newCode = await EmployeeCodeManager.updateEmployeeCode(
  employeeId,
  newPositionId
)
// النتيجة: "MNT-01-001" (كود جديد للوظيفة الجديدة)
```

### التحقق من صحة الكود
```typescript
const isValid = EmployeeCodeManager.validateEmployeeCode("CAT-01-001")
// النتيجة: true
```

### تحليل الكود
```typescript
const codeInfo = EmployeeCodeManager.parseEmployeeCode("CAT-01-001")
// النتيجة: { employeeCode: "CAT-01-001", positionCode: "CAT-01", serialNumber: 1 }
```

## 📊 معلومات الكود
```typescript
interface EmployeeCodeInfo {
  employeeCode: string    // الكود الكامل
  positionCode: string    // كود الوظيفة
  serialNumber: number    // الرقم المسلسل
}
```

## 🛠️ الوظائف المتاحة

- `generateEmployeeCode()` - توليد كود جديد
- `updateEmployeeCode()` - تحديث الكود
- `validateEmployeeCode()` - التحقق من صحة الكود
- `parseEmployeeCode()` - تحليل الكود
- `getCodeStatistics()` - إحصائيات الأكواد
- `findEmployeeByCode()` - البحث بالكود

## 📈 إحصائيات الأكواد

### مثال على الإحصائيات
```typescript
const stats = await EmployeeCodeManager.getCodeStatistics()
// النتيجة:
{
  totalEmployees: 15,
  positionStats: [
    {
      positionId: 1,
      positionName: "طباخ",
      positionCode: "CAT-01",
      employeeCount: 5,
      lastSerialNumber: 5
    },
    {
      positionId: 2,
      positionName: "فني صيانة",
      positionCode: "MNT-01",
      employeeCount: 3,
      lastSerialNumber: 3
    }
  ]
}
```

## 🔄 منطق التوليد

### 1. البحث عن آخر موظف
```sql
SELECT employeeCode 
FROM HR_Employee 
WHERE positionId = ? AND employeeCode LIKE 'POSITION_CODE-%'
ORDER BY employeeCode DESC
LIMIT 1
```

### 2. استخراج الرقم المسلسل
```typescript
const codeParts = lastEmployee.employeeCode.split('-')
const lastSerial = parseInt(codeParts[codeParts.length - 1])
const nextSerial = lastSerial + 1
```

### 3. إنشاء الكود الجديد
```typescript
const employeeCode = `${positionCode}-${nextSerial.toString().padStart(3, '0')}`
```

## 🎯 قواعد التسمية

### أكواد الوظائف
- **CAT-01** - طباخ
- **MNT-01** - فني صيانة
- **ADM-01** - مدير إداري
- **SEC-01** - حارس أمن
- **CLN-01** - عامل نظافة

### الأرقام المسلسلة
- **001** - أول موظف
- **002** - ثاني موظف
- **999** - أقصى رقم مسلسل

## 🔒 الأمان

- **منع التكرار** - التحقق من عدم وجود كود مكرر
- **التحقق من الصحة** - تنسيق صحيح للكود
- **التتبع** - حفظ تاريخ تغيير الأكواد
- **النسخ الاحتياطية** - حفظ الأكواد القديمة

## 📝 أمثلة عملية

### سيناريو 1: إضافة أول طباخ
```typescript
// الوظيفة: CAT-01 (طباخ)
// النتيجة: CAT-01-001
```

### سيناريو 2: إضافة ثاني طباخ
```typescript
// الوظيفة: CAT-01 (طباخ)
// آخر كود: CAT-01-001
// النتيجة: CAT-01-002
```

### سيناريو 3: تغيير وظيفة موظف
```typescript
// الموظف: CAT-01-002 (طباخ)
// الوظيفة الجديدة: MNT-01 (فني صيانة)
// النتيجة: MNT-01-001
// الكود القديم: محفوظ في التاريخ
```

## 🚀 الميزات المتقدمة

### البحث بالكود
```typescript
const employee = await EmployeeCodeManager.findEmployeeByCode("CAT-01-001")
// النتيجة: معلومات الموظف مع الوظيفة والقسم
```

### إحصائيات مفصلة
```typescript
const stats = await EmployeeCodeManager.getCodeStatistics(1) // positionId
// النتيجة: إحصائيات وظيفة معينة
```

## 📊 قاعدة البيانات

### جدول الموظفين
```sql
CREATE TABLE HR_Employee (
  id INT PRIMARY KEY,
  employeeCode VARCHAR(50) UNIQUE NOT NULL,
  positionId INT NOT NULL,
  -- باقي الحقول
);
```

### فهرس الأداء
```sql
CREATE INDEX idx_employee_code ON HR_Employee(employeeCode);
CREATE INDEX idx_position_code ON HR_Employee(positionId, employeeCode);
```

## 🔧 التحديثات المستقبلية

1. **دعم الأكواد المركبة** - مثل `CAT-01-A-001`
2. **أكواد المؤقتين** - مثل `TMP-001`
3. **أكواد المتدربين** - مثل `TRN-001`
4. **أكواد الاستشاريين** - مثل `CON-001`

---

**تم إنشاء النظام بنجاح! 🎉**

النظام الآن يدعم توليد أكواد ذكية ومنظمة للموظفين.
