# 💼 أمثلة عملية - الاستخدام اليومي لنظام إدارة الموظفين

## 📋 السيناريوهات الشائعة

---

## 1️⃣ سيناريو: تعيين موظف ميداني جديد

### الخطوات:
1. إنشاء سجل الموظف
2. تحديد نظام الدورة
3. إنشاء أول دورة عمل

```typescript
// الخطوة 1: إنشاء الموظف
const newEmployee = await prisma.employee.create({
  data: {
    employeeCode: "FW001",
    firstName: "أحمد",
    secondName: "محمد",
    lastName: "علي",
    fullName: "أحمد محمد علي",
    nationalId: "29801010101010",
    gender: "MALE",
    dateOfBirth: new Date("1998-01-01"),
    
    // معلومات الوظيفة
    companyId: 1,
    departmentId: 2,
    positionId: 3,
    hireDate: new Date(),
    employmentType: "FULL_TIME",
    contractType: "PERMANENT",
    
    // معلومات الاتصال
    personalPhone: "01012345678",
    currentAddress: "القاهرة",
    governorateId: 1,
    city: "القاهرة",
    
    // معلومات العمل الميداني
    isFieldWorker: true,
    rotationSchedule: "28/7",
    basicSalary: 5000,
    fieldAllowanceRate: 2000,
    housingAllowance: 1000,
    transportAllowance: 500,
    foodAllowance: 300
  }
})

// الخطوة 2: إنشاء أول دورة عمل
const firstRotation = await prisma.hR_WorkRotation.create({
  data: {
    employeeId: newEmployee.id,
    rotationType: "28/7",
    startDate: new Date("2025-02-01"),
    endDate: new Date("2025-02-28"),
    status: "planned",
    location: "مشروع الواحات الجديدة"
  }
})

// الخطوة 3: تحديث الموظف بمعرف الدورة
await prisma.employee.update({
  where: { id: newEmployee.id },
  data: {
    currentRotationId: firstRotation.id,
    nextRotationStartDate: new Date("2025-02-01")
  }
})

console.log("✅ تم تعيين الموظف الميداني بنجاح!")
```

---

## 2️⃣ سيناريو: بدء دورة عمل جديدة

```typescript
async function startNewRotation(employeeId: number) {
  // جلب بيانات الموظف
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      rotations: {
        where: { status: 'active' },
        take: 1
      }
    }
  })
  
  if (!employee) {
    throw new Error("الموظف غير موجود")
  }
  
  // إنهاء الدورة السابقة إن وجدت
  if (employee.rotations.length > 0) {
    await prisma.hR_WorkRotation.update({
      where: { id: employee.rotations[0].id },
      data: {
        status: 'completed',
        endDate: new Date()
      }
    })
  }
  
  // حساب تواريخ الدورة الجديدة
  const startDate = new Date()
  const rotationDays = parseInt(employee.rotationSchedule?.split('/')[0] || '28')
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + rotationDays)
  
  // إنشاء دورة جديدة
  const newRotation = await prisma.hR_WorkRotation.create({
    data: {
      employeeId: employeeId,
      rotationType: employee.rotationSchedule || "28/7",
      startDate: startDate,
      endDate: endDate,
      status: 'active',
      location: "مشروع الواحات"
    }
  })
  
  // تحديث بيانات الموظف
  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      currentRotationId: newRotation.id,
      lastRotationEndDate: employee.rotations[0]?.endDate || null,
      employmentStatus: 'ACTIVE'
    }
  })
  
  return newRotation
}
```

---

## 3️⃣ سيناريو: طلب إجازة سنوية

```typescript
async function requestAnnualLeave(
  employeeId: number,
  startDate: Date,
  endDate: Date,
  reason: string,
  replacementId?: number
) {
  // جلب بيانات الموظف
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      annualLeaveBalance: true,
      fullName: true
    }
  })
  
  if (!employee) {
    throw new Error("الموظف غير موجود")
  }
  
  // حساب عدد الأيام
  const totalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  // التحقق من الرصيد
  if (totalDays > employee.annualLeaveBalance) {
    throw new Error(`رصيد الإجازة غير كافٍ. الرصيد المتاح: ${employee.annualLeaveBalance} يوم`)
  }
  
  // التحقق من عدم التداخل مع إجازات أخرى
  const overlapping = await prisma.hR_EmployeeLeave.findFirst({
    where: {
      employeeId: employeeId,
      status: { in: ['pending', 'approved'] },
      OR: [
        {
          AND: [
            { startDate: { lte: startDate } },
            { endDate: { gte: startDate } }
          ]
        },
        {
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: endDate } }
          ]
        }
      ]
    }
  })
  
  if (overlapping) {
    throw new Error("يوجد تداخل مع إجازة أخرى")
  }
  
  // إنشاء طلب الإجازة
  const leave = await prisma.hR_EmployeeLeave.create({
    data: {
      employeeId: employeeId,
      leaveType: 'annual',
      startDate: startDate,
      endDate: endDate,
      totalDays: totalDays,
      reason: reason,
      replacementId: replacementId,
      status: 'pending'
    }
  })
  
  console.log(`✅ تم تسجيل طلب إجازة لـ ${employee.fullName}`)
  return leave
}
```

---

## 4️⃣ سيناريو: الموافقة على إجازة

```typescript
async function approveLeave(leaveId: number, approvedById: number) {
  // جلب بيانات الإجازة
  const leave = await prisma.hR_EmployeeLeave.findUnique({
    where: { id: leaveId },
    include: {
      employee: {
        select: {
          id: true,
          fullName: true,
          annualLeaveBalance: true
        }
      }
    }
  })
  
  if (!leave) {
    throw new Error("طلب الإجازة غير موجود")
  }
  
  if (leave.status !== 'pending') {
    throw new Error("هذا الطلب تمت معالجته مسبقاً")
  }
  
  // الموافقة على الإجازة
  await prisma.hR_EmployeeLeave.update({
    where: { id: leaveId },
    data: {
      status: 'approved',
      approvedBy: approvedById,
      approvedAt: new Date()
    }
  })
  
  // خصم الأيام من رصيد الموظف (للإجازات السنوية)
  if (leave.leaveType === 'annual') {
    await prisma.employee.update({
      where: { id: leave.employeeId },
      data: {
        annualLeaveBalance: {
          decrement: leave.totalDays
        },
        employmentStatus: 'ON_LEAVE'
      }
    })
  }
  
  console.log(`✅ تمت الموافقة على إجازة ${leave.employee.fullName}`)
}
```

---

## 5️⃣ سيناريو: طلب سلفة

```typescript
async function requestAdvance(
  employeeId: number,
  amount: number,
  reason: string,
  monthlyDeduction: number
) {
  // جلب بيانات الموظف
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: {
      basicSalary: true,
      fullName: true
    }
  })
  
  if (!employee) {
    throw new Error("الموظف غير موجود")
  }
  
  // التحقق من أن السلفة لا تتجاوز راتب شهرين
  const maxAdvance = employee.basicSalary * 2
  if (amount > maxAdvance) {
    throw new Error(`السلفة تتجاوز الحد الأقصى (${maxAdvance} جنيه)`)
  }
  
  // التحقق من أن الخصم الشهري معقول
  if (monthlyDeduction > employee.basicSalary * 0.3) {
    throw new Error("الخصم الشهري يتجاوز 30% من الراتب الأساسي")
  }
  
  // التحقق من عدم وجود سلف مستحقة كثيرة
  const existingAdvances = await prisma.hR_EmployeeAdvance.aggregate({
    where: {
      employeeId: employeeId,
      approvalStatus: 'approved',
      remainingBalance: { gt: 0 }
    },
    _sum: { remainingBalance: true }
  })
  
  if ((existingAdvances._sum.remainingBalance || 0) + amount > employee.basicSalary * 3) {
    throw new Error("مجموع السلف المستحقة يتجاوز الحد الأقصى")
  }
  
  // إنشاء طلب السلفة
  const advance = await prisma.hR_EmployeeAdvance.create({
    data: {
      employeeId: employeeId,
      amount: amount,
      reason: reason,
      monthlyDeduction: monthlyDeduction,
      remainingBalance: amount,
      approvalStatus: 'pending'
    }
  })
  
  console.log(`✅ تم تسجيل طلب سلفة لـ ${employee.fullName}`)
  return advance
}
```

---

## 6️⃣ سيناريو: حساب راتب شهري

```typescript
async function calculateMonthlyPayroll(
  employeeId: number,
  month: number,
  year: number
) {
  // جلب بيانات الموظف
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId }
  })
  
  if (!employee) {
    throw new Error("الموظف غير موجود")
  }
  
  // حساب البدلات
  const housingAllowance = employee.housingAllowance || 0
  const transportAllowance = employee.transportAllowance || 0
  const foodAllowance = employee.foodAllowance || 0
  const fieldAllowance = employee.fieldAllowanceRate || 0
  
  const grossSalary = 
    employee.basicSalary +
    housingAllowance +
    transportAllowance +
    foodAllowance +
    fieldAllowance
  
  // حساب خصومات السلف
  const monthlyAdvances = await prisma.hR_EmployeeAdvance.findMany({
    where: {
      employeeId: employeeId,
      approvalStatus: 'approved',
      remainingBalance: { gt: 0 }
    }
  })
  
  const advancesDeduction = monthlyAdvances.reduce(
    (sum, adv) => sum + (adv.monthlyDeduction || 0),
    0
  )
  
  // حساب خصومات الغياب
  const absences = await prisma.hR_AttendanceException.count({
    where: {
      employeeId: employeeId,
      exceptionType: 'absence',
      status: 'approved',
      date: {
        gte: new Date(year, month - 1, 1),
        lte: new Date(year, month, 0)
      }
    }
  })
  
  const dailySalary = employee.basicSalary / 30
  const absencesDeduction = absences * dailySalary
  
  // حساب الإجمالي
  const totalDeductions = advancesDeduction + absencesDeduction
  const netSalary = grossSalary - totalDeductions
  
  // التحقق من عدم وجود راتب مسجل مسبقاً
  const existing = await prisma.hR_MonthlyPayroll.findUnique({
    where: {
      employeeId_month_year: {
        employeeId: employeeId,
        month: month,
        year: year
      }
    }
  })
  
  if (existing) {
    throw new Error("تم حساب الراتب لهذا الشهر مسبقاً")
  }
  
  // إنشاء سجل الراتب
  const payroll = await prisma.hR_MonthlyPayroll.create({
    data: {
      employeeId: employeeId,
      month: month,
      year: year,
      basicSalary: employee.basicSalary,
      housingAllowance: housingAllowance,
      transportAllowance: transportAllowance,
      foodAllowance: foodAllowance,
      fieldAllowance: fieldAllowance,
      grossSalary: grossSalary,
      advances: advancesDeduction,
      absences: absencesDeduction,
      totalDeductions: totalDeductions,
      netSalary: netSalary,
      paymentStatus: 'pending'
    }
  })
  
  // تحديث رصيد السلف
  for (const advance of monthlyAdvances) {
    const newBalance = (advance.remainingBalance || 0) - (advance.monthlyDeduction || 0)
    await prisma.hR_EmployeeAdvance.update({
      where: { id: advance.id },
      data: {
        remainingBalance: Math.max(0, newBalance)
      }
    })
  }
  
  return payroll
}
```

---

## 7️⃣ سيناريو: حساب رواتب جميع الموظفين

```typescript
async function calculateAllPayrolls(month: number, year: number) {
  // جلب جميع الموظفين النشطين
  const employees = await prisma.employee.findMany({
    where: {
      isActive: true,
      employmentStatus: { in: ['ACTIVE', 'ON_LEAVE'] }
    }
  })
  
  const results = {
    success: [] as number[],
    failed: [] as { employeeId: number; error: string }[]
  }
  
  // حساب راتب كل موظف
  for (const employee of employees) {
    try {
      await calculateMonthlyPayroll(employee.id, month, year)
      results.success.push(employee.id)
    } catch (error: any) {
      results.failed.push({
        employeeId: employee.id,
        error: error.message
      })
    }
  }
  
  console.log(`✅ تم حساب ${results.success.length} راتب`)
  console.log(`❌ فشل حساب ${results.failed.length} راتب`)
  
  return results
}
```

---

## 8️⃣ سيناريو: تسجيل تأخير

```typescript
async function recordLate(
  employeeId: number,
  date: Date,
  hours: number,
  reason?: string
) {
  const exception = await prisma.hR_AttendanceException.create({
    data: {
      employeeId: employeeId,
      date: date,
      exceptionType: 'late',
      hours: hours,
      reason: reason,
      status: 'pending'
    }
  })
  
  return exception
}
```

---

## 9️⃣ سيناريو: التحقق من الموظفين في الدورات

```typescript
async function checkRotationsStatus() {
  const today = new Date()
  
  // الدورات التي انتهت ولم يتم تحديثها
  const expiredRotations = await prisma.hR_WorkRotation.findMany({
    where: {
      status: 'active',
      endDate: { lt: today }
    },
    include: {
      employee: {
        select: {
          fullName: true,
          personalPhone: true
        }
      }
    }
  })
  
  // الدورات التي ستبدأ قريباً
  const upcoming = new Date()
  upcoming.setDate(upcoming.getDate() + 7)
  
  const upcomingRotations = await prisma.hR_WorkRotation.findMany({
    where: {
      status: 'planned',
      startDate: {
        gte: today,
        lte: upcoming
      }
    },
    include: {
      employee: true
    }
  })
  
  return {
    expired: expiredRotations,
    upcoming: upcomingRotations
  }
}
```

---

## 🔟 سيناريو: تقرير يومي

```typescript
async function getDailyReport() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return {
    // الموظفين في إجازة اليوم
    onLeaveToday: await prisma.hR_EmployeeLeave.count({
      where: {
        status: 'approved',
        startDate: { lte: today },
        endDate: { gte: today }
      }
    }),
    
    // الدورات النشطة
    activeRotations: await prisma.hR_WorkRotation.count({
      where: { status: 'active' }
    }),
    
    // طلبات الموافقة المعلقة
    pendingApprovals: {
      leaves: await prisma.hR_EmployeeLeave.count({
        where: { status: 'pending' }
      }),
      advances: await prisma.hR_EmployeeAdvance.count({
        where: { approvalStatus: 'pending' }
      })
    },
    
    // الرواتب المستحقة
    pendingPayrolls: await prisma.hR_MonthlyPayroll.count({
      where: { paymentStatus: 'pending' }
    })
  }
}
```

---

## 💡 نصائح للاستخدام اليومي

### 1. استخدم Transactions للعمليات المتعددة
```typescript
await prisma.$transaction(async (tx) => {
  // عدة عمليات هنا
})
```

### 2. التحقق من البيانات قبل الحفظ
```typescript
if (!data || !data.employeeId) {
  throw new Error("بيانات غير صحيحة")
}
```

### 3. معالجة الأخطاء
```typescript
try {
  // العملية
} catch (error) {
  console.error("خطأ:", error)
  // إرسال إشعار
}
```

---

**آخر تحديث:** 2025-10-23  
**الإصدار:** 1.0
