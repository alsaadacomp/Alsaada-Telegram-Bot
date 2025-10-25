# 📊 التقارير المتاحة - نظام إدارة الموظفين

## 🎯 نظرة عامة

هذا الدليل يحتوي على جميع التقارير المتاحة في نظام إدارة الموظفين مع أمثلة عملية للاستخدام.

---

## 1️⃣ تقارير دورات العمل

### 1.1 الدورات النشطة حالياً
**الوصف:** عرض جميع دورات العمل النشطة مع تفاصيل الموظفين

```typescript
const activeRotations = await prisma.hR_WorkRotation.findMany({
  where: { 
    status: 'active',
    endDate: { gte: new Date() }
  },
  include: { 
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        personalPhone: true,
        department: true,
        position: true
      }
    }
  },
  orderBy: { endDate: 'asc' }
})
```

### 1.2 الدورات المخططة (القادمة)
**الوصف:** عرض الدورات المخطط لها

```typescript
const plannedRotations = await prisma.hR_WorkRotation.findMany({
  where: { 
    status: 'planned',
    startDate: { gte: new Date() }
  },
  include: { employee: true },
  orderBy: { startDate: 'asc' }
})
```

### 1.3 دورات موظف معين
**الوصف:** سجل دورات عمل موظف

```typescript
const employeeRotations = await prisma.hR_WorkRotation.findMany({
  where: { employeeId: 123 },
  orderBy: { startDate: 'desc' },
  take: 10
})
```

### 1.4 الدورات المنتهية خلال فترة
**الوصف:** الدورات التي انتهت في فترة محددة

```typescript
const completedRotations = await prisma.hR_WorkRotation.findMany({
  where: {
    status: 'completed',
    endDate: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  include: { employee: true }
})
```

---

## 2️⃣ تقارير الإجازات

### 2.1 الإجازات المعلقة
**الوصف:** جميع طلبات الإجازات المنتظرة للموافقة

```typescript
const pendingLeaves = await prisma.hR_EmployeeLeave.findMany({
  where: { status: 'pending' },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        department: true,
        position: true
      }
    },
    replacement: {
      select: {
        fullName: true,
        employeeCode: true
      }
    }
  },
  orderBy: { createdAt: 'desc' }
})
```

### 2.2 الإجازات الموافق عليها
**الوصف:** الإجازات المعتمدة خلال فترة

```typescript
const approvedLeaves = await prisma.hR_EmployeeLeave.findMany({
  where: {
    status: 'approved',
    startDate: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-12-31')
    }
  },
  include: { employee: true },
  orderBy: { startDate: 'asc' }
})
```

### 2.3 رصيد إجازات موظف
**الوصف:** حساب رصيد الإجازات المتبقي

```typescript
const employee = await prisma.employee.findUnique({
  where: { id: 123 },
  select: {
    fullName: true,
    annualLeaveBalance: true,
    sickLeaveBalance: true,
    casualLeaveBalance: true
  }
})

const usedAnnualLeaves = await prisma.hR_EmployeeLeave.aggregate({
  where: {
    employeeId: 123,
    leaveType: 'annual',
    status: 'approved',
    startDate: {
      gte: new Date(new Date().getFullYear(), 0, 1) // بداية السنة
    }
  },
  _sum: { totalDays: true }
})

const remainingBalance = employee.annualLeaveBalance - (usedAnnualLeaves._sum.totalDays || 0)
```

### 2.4 إجازات حسب النوع
**الوصف:** تقرير الإجازات مجمعة حسب النوع

```typescript
const leavesByType = await prisma.hR_EmployeeLeave.groupBy({
  by: ['leaveType'],
  where: {
    status: 'approved',
    startDate: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-12-31')
    }
  },
  _sum: { totalDays: true },
  _count: { id: true }
})
```

---

## 3️⃣ تقارير السلف والمسحوبات

### 3.1 السلف المعلقة
**الوصف:** طلبات السلف قيد الانتظار

```typescript
const pendingAdvances = await prisma.hR_EmployeeAdvance.findMany({
  where: { approvalStatus: 'pending' },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        department: true,
        basicSalary: true
      }
    }
  },
  orderBy: { requestDate: 'asc' }
})
```

### 3.2 السلف المستحقة (غير المسددة)
**الوصف:** السلف الموافق عليها والمتبقي منها رصيد

```typescript
const unpaidAdvances = await prisma.hR_EmployeeAdvance.findMany({
  where: {
    approvalStatus: 'approved',
    remainingBalance: { gt: 0 }
  },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        personalPhone: true
      }
    }
  },
  orderBy: { remainingBalance: 'desc' }
})

// حساب إجمالي السلف المستحقة
const totalUnpaid = await prisma.hR_EmployeeAdvance.aggregate({
  where: {
    approvalStatus: 'approved',
    remainingBalance: { gt: 0 }
  },
  _sum: { remainingBalance: true }
})
```

### 3.3 سلف موظف معين
**الوصف:** سجل سلف موظف مع الرصيد المتبقي

```typescript
const employeeAdvances = await prisma.hR_EmployeeAdvance.findMany({
  where: { employeeId: 123 },
  orderBy: { requestDate: 'desc' }
})

const totalAdvances = await prisma.hR_EmployeeAdvance.aggregate({
  where: { 
    employeeId: 123,
    approvalStatus: 'approved'
  },
  _sum: { 
    amount: true,
    remainingBalance: true
  }
})
```

### 3.4 السلف حسب الشهر
**الوصف:** إحصائيات السلف شهرياً

```typescript
const monthlyAdvances = await prisma.hR_EmployeeAdvance.groupBy({
  by: ['approvalStatus'],
  where: {
    approvedAt: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  _sum: { amount: true },
  _count: { id: true }
})
```

---

## 4️⃣ تقارير الرواتب

### 4.1 كشف رواتب شهري
**الوصف:** كشف الرواتب لشهر معين

```typescript
const monthlyPayroll = await prisma.hR_MonthlyPayroll.findMany({
  where: {
    month: 1,
    year: 2025
  },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        department: { select: { name: true } },
        position: { select: { titleAr: true } }
      }
    }
  },
  orderBy: { netSalary: 'desc' }
})

// إجمالي الرواتب
const totals = await prisma.hR_MonthlyPayroll.aggregate({
  where: {
    month: 1,
    year: 2025
  },
  _sum: {
    grossSalary: true,
    totalDeductions: true,
    netSalary: true
  },
  _count: { id: true }
})
```

### 4.2 الرواتب المعلقة (غير المدفوعة)
**الوصف:** الرواتب التي لم يتم دفعها بعد

```typescript
const pendingPayrolls = await prisma.hR_MonthlyPayroll.findMany({
  where: { paymentStatus: 'pending' },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        personalPhone: true,
        bankAccountNumber: true
      }
    }
  },
  orderBy: [
    { year: 'asc' },
    { month: 'asc' }
  ]
})
```

### 4.3 تحليل البدلات
**الوصف:** تحليل البدلات المدفوعة

```typescript
const allowancesAnalysis = await prisma.hR_MonthlyPayroll.aggregate({
  where: {
    month: 1,
    year: 2025
  },
  _sum: {
    housingAllowance: true,
    transportAllowance: true,
    foodAllowance: true,
    fieldAllowance: true,
    otherAllowances: true
  }
})
```

### 4.4 تحليل الخصومات
**الوصف:** تحليل الخصومات المطبقة

```typescript
const deductionsAnalysis = await prisma.hR_MonthlyPayroll.aggregate({
  where: {
    month: 1,
    year: 2025
  },
  _sum: {
    advances: true,
    penalties: true,
    absences: true,
    otherDeductions: true
  }
})
```

### 4.5 راتب موظف - تاريخي
**الوصف:** سجل رواتب موظف

```typescript
const employeePayrollHistory = await prisma.hR_MonthlyPayroll.findMany({
  where: { employeeId: 123 },
  orderBy: [
    { year: 'desc' },
    { month: 'desc' }
  ],
  take: 12 // آخر 12 شهر
})
```

---

## 5️⃣ تقارير استثناءات الحضور

### 5.1 التأخيرات والانصرافات
**الوصف:** سجل التأخيرات والانصرافات المبكرة

```typescript
const lateAndEarly = await prisma.hR_AttendanceException.findMany({
  where: {
    exceptionType: { in: ['late', 'early_leave'] },
    date: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        department: true
      }
    }
  },
  orderBy: { date: 'asc' }
})
```

### 5.2 الغياب
**الوصف:** سجل الغياب خلال فترة

```typescript
const absences = await prisma.hR_AttendanceException.findMany({
  where: {
    exceptionType: 'absence',
    date: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  include: { employee: true }
})
```

### 5.3 العمل الإضافي
**الوصف:** ساعات العمل الإضافي

```typescript
const overtime = await prisma.hR_AttendanceException.findMany({
  where: {
    exceptionType: 'overtime',
    status: 'approved',
    date: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  include: { employee: true }
})

// إجمالي ساعات العمل الإضافي
const totalOvertimeHours = await prisma.hR_AttendanceException.aggregate({
  where: {
    exceptionType: 'overtime',
    status: 'approved',
    date: {
      gte: new Date('2025-01-01'),
      lte: new Date('2025-01-31')
    }
  },
  _sum: { hours: true }
})
```

### 5.4 استثناءات موظف
**الوصف:** سجل استثناءات موظف معين

```typescript
const employeeExceptions = await prisma.hR_AttendanceException.findMany({
  where: { employeeId: 123 },
  orderBy: { date: 'desc' },
  take: 30
})
```

---

## 6️⃣ تقارير شاملة

### 6.1 تقرير حالة الموظفين
**الوصف:** تقرير شامل عن حالة الموظفين

```typescript
const employeesStatus = await prisma.employee.groupBy({
  by: ['employmentStatus', 'isFieldWorker'],
  where: { isActive: true },
  _count: { id: true }
})
```

### 6.2 الموظفين في الإجازة حالياً
**الوصف:** الموظفين المتواجدين في إجازة الآن

```typescript
const today = new Date()
const onLeaveNow = await prisma.hR_EmployeeLeave.findMany({
  where: {
    status: 'approved',
    startDate: { lte: today },
    endDate: { gte: today }
  },
  include: {
    employee: {
      select: {
        fullName: true,
        employeeCode: true,
        department: true,
        personalPhone: true
      }
    },
    replacement: {
      select: {
        fullName: true,
        personalPhone: true
      }
    }
  }
})
```

### 6.3 الموظفين الميدانيين النشطين
**الوصف:** قائمة العاملين الميدانيين مع الدورات النشطة

```typescript
const activeFieldWorkers = await prisma.employee.findMany({
  where: {
    isFieldWorker: true,
    isActive: true,
    employmentStatus: 'ACTIVE'
  },
  include: {
    rotations: {
      where: { status: 'active' },
      take: 1
    },
    department: true,
    position: true
  }
})
```

### 6.4 تقرير مالي شامل
**الوصف:** تقرير مالي شامل لشهر معين

```typescript
const financialReport = {
  // إجمالي الرواتب
  payroll: await prisma.hR_MonthlyPayroll.aggregate({
    where: { month: 1, year: 2025 },
    _sum: {
      grossSalary: true,
      totalDeductions: true,
      netSalary: true
    }
  }),
  
  // إجمالي السلف المدفوعة
  advances: await prisma.hR_EmployeeAdvance.aggregate({
    where: {
      approvedAt: {
        gte: new Date('2025-01-01'),
        lte: new Date('2025-01-31')
      },
      approvalStatus: 'approved',
      isPaid: true
    },
    _sum: { amount: true }
  }),
  
  // عدد الموظفين النشطين
  activeEmployees: await prisma.employee.count({
    where: { 
      isActive: true,
      employmentStatus: 'ACTIVE'
    }
  })
}
```

---

## 📊 تصدير التقارير

### مثال: تصدير إلى CSV
```typescript
import { Parser } from 'json2csv'

async function exportPayrollToCSV(month: number, year: number) {
  const payrolls = await prisma.hR_MonthlyPayroll.findMany({
    where: { month, year },
    include: {
      employee: {
        select: {
          fullName: true,
          employeeCode: true
        }
      }
    }
  })
  
  const fields = [
    'employee.fullName',
    'employee.employeeCode',
    'basicSalary',
    'grossSalary',
    'totalDeductions',
    'netSalary'
  ]
  
  const parser = new Parser({ fields })
  const csv = parser.parse(payrolls)
  
  return csv
}
```

---

## 🎯 نصائح الأداء

1. **استخدم Indexes:** تأكد من وجود indexes على الحقول المستخدمة في WHERE
2. **استخدم Select:** حدد الحقول المطلوبة فقط
3. **استخدم Pagination:** للقوائم الطويلة
4. **استخدم Aggregations:** للحسابات بدلاً من جلب كل البيانات

---

**آخر تحديث:** 2025-10-23  
**الإصدار:** 1.0
