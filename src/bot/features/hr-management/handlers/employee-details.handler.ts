import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'
import { Database } from '../../../../modules/database/index.js'

export const employeeDetailsHandler = new Composer<Context>()

// معالج عرض تفاصيل العامل
employeeDetailsHandler.callbackQuery(/^hr:employee:details:(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const employeeId = Number.parseInt(ctx.match[1])

  try {
    const prisma = Database.prisma

    // جلب تفاصيل العامل
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        position: {
          select: {
            titleAr: true,
            title: true,
            code: true,
            defaultWorkDaysPerCycle: true,
            defaultLeaveDaysPerCycle: true,
          },
        },
        department: {
          select: {
            name: true,
            code: true,
          },
        },
        governorate: {
          select: {
            nameAr: true,
            nameEn: true,
            code: true,
            region: true,
          },
        },
        company: {
          select: {
            name: true,
            nameEn: true,
          },
        },
      },
    })

    if (!employee) {
      await ctx.editMessageText(
        '❌ العامل غير موجود في النظام.',
        { reply_markup: new InlineKeyboard().text('⬅️ رجوع', 'menu:sub:hr-management:employees-list') },
      )
      return
    }

    // تحديد نوع العامل (حالي أم سابق)
    const isCurrentEmployee = employee.isActive
      && employee.employmentStatus === 'ACTIVE'
      && !employee.resignationDate
      && !employee.terminationDate

    const employeeType = isCurrentEmployee ? 'حالي' : 'سابق'
    const statusIcon = isCurrentEmployee ? '👷' : '📂'

    // بناء رسالة التفاصيل
    let message = `${statusIcon} تفاصيل العامل ${employeeType}\n\n`
    message += '━━━━━━━━━━━━━━━━━━━━\n\n'

    // البيانات الأساسية
    message += '📝 البيانات الأساسية:\n'
    message += `🆔 الكود: ${employee.employeeCode}\n`
    message += `👤 الاسم الكامل: ${employee.fullName}\n`
    message += `📛 الشهرة: ${employee.nickname || 'غير محدد'}\n`
    message += `🆔 الرقم القومي: ${employee.nationalId}\n`
    message += `📅 تاريخ الميلاد: ${employee.dateOfBirth.toLocaleDateString('ar-EG')}\n`

    // حساب العمر
    const today = new Date()
    const birthDate = new Date(employee.dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    message += `🎂 العمر: ${age} سنة\n`
    message += `⚧️ الجنس: ${employee.gender === 'MALE' ? 'ذكر' : 'أنثى'}\n`
    message += `📱 الهاتف: ${employee.personalPhone}\n`
    message += `📧 البريد الإلكتروني: ${employee.personalEmail || 'غير محدد'}\n\n`

    // معلومات العمل
    message += '💼 معلومات العمل:\n'
    message += `💼 الوظيفة: ${employee.position ? (employee.position.titleAr || employee.position.title) : 'غير محدد'}\n`
    message += `🏢 كود الوظيفة: ${employee.position ? employee.position.code : 'غير محدد'}\n`
    message += `📋 القسم: ${employee.department ? employee.department.name : 'غير محدد'}\n`
    message += `🏢 كود القسم: ${employee.department ? employee.department.code : 'غير محدد'}\n`
    message += `🏢 الشركة: ${employee.company ? employee.company.name : 'غير محدد'}\n`
    message += `📅 تاريخ التعيين: ${employee.hireDate.toLocaleDateString('ar-EG')}\n`
    message += `📅 تاريخ التأكيد: ${employee.confirmationDate ? employee.confirmationDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📅 تاريخ الاستقالة: ${employee.resignationDate ? employee.resignationDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📅 تاريخ الفصل: ${employee.terminationDate ? employee.terminationDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📝 سبب الفصل: ${employee.terminationReason || 'غير محدد'}\n\n`

    // معلومات الإقامة
    message += '📍 معلومات الإقامة:\n'
    message += `📍 المحافظة: ${employee.governorate ? employee.governorate.nameAr : 'غير محدد'}\n`
    message += `🌍 الاسم الإنجليزي: ${employee.governorate ? employee.governorate.nameEn : 'غير محدد'}\n`
    message += `🏢 كود المحافظة: ${employee.governorate ? employee.governorate.code : 'غير محدد'}\n`
    message += `🗺️ المنطقة: ${employee.governorate ? (employee.governorate.region || 'غير محدد') : 'غير محدد'}\n`
    message += `🏠 العنوان: ${employee.currentAddress || 'غير محدد'}\n`
    message += `🏠 العنوان الدائم: ${employee.permanentAddress || 'غير محدد'}\n\n`

    // معلومات إضافية
    message += '📁 معلومات إضافية:\n'

    // عرض الحالة بطريقة مبسطة
    const statusMap: { [key: string]: string } = {
      ACTIVE: 'نشط',
      ON_LEAVE: 'في إجازة',
      SUSPENDED: 'معلق',
      RESIGNED: 'استقال',
      TERMINATED: 'فصل',
      RETIRED: 'تقاعد',
    }

    const employmentStatusText = statusMap[employee.employmentStatus] || employee.employmentStatus
    const employeeStatusText = isCurrentEmployee ? 'موظف حالى' : 'موظف سابق'

    message += `📊 الحالة الوظيفية: ${employmentStatusText}\n`
    message += `👤 نوع الموظف: ${employeeStatusText}\n`
    message += `📋 نوع التوظيف: ${employee.employmentType}\n`
    message += `📄 نوع العقد: ${employee.contractType}\n`
    message += `📱 معرف التليجرام: ${employee.telegramId || 'غير محدد'}\n`
    message += `📅 تاريخ الإنشاء: ${employee.createdAt.toLocaleString('ar-EG')}\n`
    message += `📅 آخر تحديث: ${employee.updatedAt.toLocaleString('ar-EG')}\n\n`

    // معلومات الرواتب والبدلات (SUPER_ADMIN فقط)
    if (ctx.dbUser?.role === 'SUPER_ADMIN') {
      message += '💰 معلومات الرواتب والبدلات:\n'
      message += `💵 الراتب الأساسي: ${employee.basicSalary || 0} جنيه\n`
      message += `💸 البدلات: ${employee.allowances || 0} جنيه\n`
      message += `💳 إجمالي الراتب: ${employee.totalSalary || 0} جنيه\n`
      message += `💱 العملة: ${employee.currency || 'EGP'}\n`
      message += `🏦 طريقة الدفع: ${employee.paymentMethod || 'غير محدد'}\n`
      message += `🏦 اسم البنك: ${employee.bankName || 'غير محدد'}\n`
      message += `💳 رقم الحساب: ${employee.bankAccountNumber || 'غير محدد'}\n`
      message += `🏦 رقم الآيبان: ${employee.iban || 'غير محدد'}\n`
      message += `📱 رقم التحويل الأول: ${employee.transferNumber1 ? `${employee.transferNumber1} (${employee.transferType1 === 'INSTAPAY' ? 'إنستاباي' : employee.transferType1 === 'CASH' ? 'كاش' : employee.transferType1 || 'غير محدد'})` : 'غير محدد'}\n`
      message += `📱 رقم التحويل الثاني: ${employee.transferNumber2 ? `${employee.transferNumber2} (${employee.transferType2 === 'INSTAPAY' ? 'إنستاباي' : employee.transferType2 === 'CASH' ? 'كاش' : employee.transferType2 || 'غير محدد'})` : 'غير محدد'}\n`
      message += `🏥 رقم التأمين الاجتماعي: ${employee.socialInsuranceNumber || 'غير محدد'}\n`
      message += `📊 الرقم الضريبي: ${employee.taxNumber || 'غير محدد'}\n`
      message += `📅 تاريخ بداية التأمين: ${employee.insuranceStartDate ? employee.insuranceStartDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n\n`
    }

    // معلومات الاتصال الطارئ
    message += '🚨 معلومات الاتصال الطارئ:\n'
    message += `👤 اسم جهة الاتصال: ${employee.emergencyContactName || 'غير محدد'}\n`
    message += `📱 هاتف جهة الاتصال: ${employee.emergencyContactPhone || 'غير محدد'}\n`
    message += `👥 صلة القرابة: ${employee.emergencyContactRelation || 'غير محدد'}\n\n`

    // معلومات التعليم
    message += '🎓 معلومات التعليم:\n'
    message += `📚 مستوى التعليم: ${employee.educationLevel || 'غير محدد'}\n`
    message += `🎯 التخصص: ${employee.major || 'غير محدد'}\n`
    message += `🏫 الجامعة: ${employee.university || 'غير محدد'}\n`
    message += `📅 سنة التخرج: ${employee.graduationYear || 'غير محدد'}\n`
    message += `🏆 الشهادات: ${employee.certifications || 'غير محدد'}\n`
    message += `🛠️ المهارات: ${employee.skills || 'غير محدد'}\n`
    message += `💼 الخبرة السابقة: ${employee.previousExperience || 'غير محدد'}\n`
    message += `📊 سنوات الخبرة: ${employee.yearsOfExperience || 0}\n\n`

    // معلومات العمل
    message += '⏰ معلومات العمل:\n'
    message += `📅 جدول العمل: ${employee.workSchedule || 'غير محدد'}\n`
    message += `📍 موقع العمل: ${employee.workLocation || 'غير محدد'}\n`
    message += `👨‍💼 المدير المباشر: ${employee.directManagerId ? 'موجود' : 'غير محدد'}\n\n`

    // معلومات الملفات
    message += '📁 الملفات والمرفقات:\n'
    message += `🖼️ الصورة الشخصية: ${employee.profilePhoto ? 'محفوظة' : 'غير محفوظة'}\n`
    message += `📄 السيرة الذاتية: ${employee.cv ? 'محفوظة' : 'غير محفوظة'}\n`
    message += `📋 المستندات: ${employee.documents ? 'محفوظة' : 'غير محفوظة'}\n`
    message += `🆔 بطاقة الرقم القومي: ${employee.nationalIdCardUrl ? 'محفوظة' : 'غير محفوظة'}\n\n`

    // نظام الإجازات
    message += '🏖️ نظام الإجازات:\n'
    const workDaysPerCycle = employee.workDaysPerCycle || employee.position?.defaultWorkDaysPerCycle || 'غير محدد'
    const leaveDaysPerCycle = employee.leaveDaysPerCycle || employee.position?.defaultLeaveDaysPerCycle || 'غير محدد'
    message += `📅 أيام العمل في الدورة: ${workDaysPerCycle}\n`
    message += `🏖️ أيام الإجازة في الدورة: ${leaveDaysPerCycle}\n`
    message += `⏰ أيام العمل الحالية: ${employee.currentWorkDays || 0}\n`
    message += `🎯 أيام الإجازة الحالية: ${employee.currentLeaveDays || 0}\n`
    message += `📅 تاريخ بداية آخر إجازة: ${employee.lastLeaveStartDate ? employee.lastLeaveStartDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📅 تاريخ نهاية آخر إجازة: ${employee.lastLeaveEndDate ? employee.lastLeaveEndDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📅 تاريخ بداية الإجازة القادمة: ${employee.nextLeaveStartDate ? employee.nextLeaveStartDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n`
    message += `📅 تاريخ نهاية الإجازة القادمة: ${employee.nextLeaveEndDate ? employee.nextLeaveEndDate.toLocaleDateString('ar-EG') : 'غير محدد'}\n\n`

    // معلومات إضافية
    message += '📝 ملاحظات:\n'
    message += `${employee.notes || 'لا توجد ملاحظات'}\n\n`

    message += '━━━━━━━━━━━━━━━━━━━━'

    // إنشاء لوحة المفاتيح
    const keyboard = new InlineKeyboard()

    // زر التعديل (متاح للـ ADMIN و SUPER_ADMIN)
    if (ctx.dbUser?.role === 'ADMIN' || ctx.dbUser?.role === 'SUPER_ADMIN') {
      keyboard.text('✏️ تعديل معلومات العامل', `hr:employee:edit:${employee.id}`)
    }

    // زر الرجوع
    const backButton = isCurrentEmployee
      ? 'hr:employees:view-current'
      : 'hr:employees:view-previous'

    keyboard.text('⬅️ رجوع', backButton)

    await ctx.editMessageText(message, {
      reply_markup: keyboard,
    })
  }
  catch (error) {
    console.error('Error loading employee details:', error)

    // إرسال رسالة خطأ مفصلة
    const keyboard = new InlineKeyboard()
      .text('⬅️ رجوع', 'menu:sub:hr-management:employees-list')

    await ctx.editMessageText(
      '❌ حدث خطأ في تحميل تفاصيل العامل.\n\n'
      + 'يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.',
      { reply_markup: keyboard },
    )
  }
})
