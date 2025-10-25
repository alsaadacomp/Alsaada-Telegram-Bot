import { InlineKeyboard } from 'grammy'

/**
 * إنشاء تقويم تفاعلي لاختيار التاريخ
 * يعرض الأيام السبعة الماضية مع أسماء الأيام بالعربية
 * 
 * @param callbackPrefix - البادئة لـ callback data (مثال: "hr:employee:date")
 * @param backCallback - callback للرجوع (مثال: "hr:employee:edit:123")
 * @param showToday - هل يعرض اليوم الحالي (افتراضي: true)
 * @param daysCount - عدد الأيام الماضية لعرضها (افتراضي: 7)
 * @returns InlineKeyboard مع التقويم
 */
export function createDatePickerCalendar(
  callbackPrefix: string,
  backCallback: string,
  showToday: boolean = true,
  daysCount: number = 7
): InlineKeyboard {
  const keyboard = new InlineKeyboard()
  const today = new Date()
  
  // تحديد عدد الأيام للعرض
  const startDay = showToday ? 0 : 1
  const endDay = showToday ? daysCount : daysCount + 1
  
  // إضافة الأيام المحددة
  for (let i = startDay; i < endDay; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    
    // تحديد اسم اليوم
    let dayName: string
    if (i === 0 && showToday) {
      dayName = 'اليوم'
    } else if (i === 1 && showToday) {
      dayName = 'أمس'
    } else {
      dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' })
    }
    
    // تنسيق التاريخ للعرض
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
    const displayDate = date.toLocaleDateString('ar-EG')
    
    // إضافة الزر
    keyboard.text(
      `${dayName} (${displayDate})`, 
      `${callbackPrefix}:${dateStr}`
    ).row()
  }
  
  // إضافة زر الرجوع
  keyboard.text('⬅️ رجوع', backCallback)
  
  return keyboard
}

/**
 * إنشاء تقويم مبسط للأيام السبعة الماضية (مثل المستخدم حالياً)
 * 
 * @param callbackPrefix - البادئة لـ callback data
 * @param backCallback - callback للرجوع
 * @returns InlineKeyboard مع التقويم المبسط
 */
export function createSimpleDatePicker(
  callbackPrefix: string,
  backCallback: string
): InlineKeyboard {
  return createDatePickerCalendar(callbackPrefix, backCallback, true, 7)
}

/**
 * إنشاء تقويم للأيام الماضية فقط (بدون اليوم الحالي)
 * مفيد للحالات التي لا يمكن أن تكون اليوم الحالي
 * 
 * @param callbackPrefix - البادئة لـ callback data
 * @param backCallback - callback للرجوع
 * @param daysCount - عدد الأيام الماضية (افتراضي: 7)
 * @returns InlineKeyboard مع التقويم
 */
export function createPastDatePicker(
  callbackPrefix: string,
  backCallback: string,
  daysCount: number = 7
): InlineKeyboard {
  return createDatePickerCalendar(callbackPrefix, backCallback, false, daysCount)
}

/**
 * إنشاء تقويم للأيام المستقبلية فقط
 * مفيد للحالات التي يجب أن تكون في المستقبل
 * 
 * @param callbackPrefix - البادئة لـ callback data
 * @param backCallback - callback للرجوع
 * @param daysCount - عدد الأيام المستقبلية (افتراضي: 7)
 * @returns InlineKeyboard مع التقويم
 */
export function createFutureDatePicker(
  callbackPrefix: string,
  backCallback: string,
  daysCount: number = 7
): InlineKeyboard {
  const keyboard = new InlineKeyboard()
  const today = new Date()
  
  // إضافة الأيام المستقبلية
  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    // تحديد اسم اليوم
    const dayName = date.toLocaleDateString('ar-EG', { weekday: 'short' })
    
    // تنسيق التاريخ للعرض
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
    const displayDate = date.toLocaleDateString('ar-EG')
    
    // إضافة الزر
    keyboard.text(
      `${dayName} (${displayDate})`, 
      `${callbackPrefix}:${dateStr}`
    ).row()
  }
  
  // إضافة زر الرجوع
  keyboard.text('⬅️ رجوع', backCallback)
  
  return keyboard
}

/**
 * إنشاء تقويم مرن مع خيارات متعددة
 * 
 * @param callbackPrefix - البادئة لـ callback data
 * @param backCallback - callback للرجوع
 * @param options - خيارات التقويم
 * @returns InlineKeyboard مع التقويم المرن
 */
export function createFlexibleDatePicker(
  callbackPrefix: string,
  backCallback: string,
  options: {
    showToday?: boolean
    showPast?: boolean
    showFuture?: boolean
    pastDays?: number
    futureDays?: number
    customDates?: Date[]
  } = {}
): InlineKeyboard {
  const {
    showToday = true,
    showPast = true,
    showFuture = false,
    pastDays = 7,
    futureDays = 7,
    customDates = []
  } = options

  const keyboard = new InlineKeyboard()
  const today = new Date()
  const dates: { date: Date; label: string }[] = []

  // إضافة التواريخ المخصصة
  customDates.forEach(date => {
    const label = date.toLocaleDateString('ar-EG', { weekday: 'short' })
    dates.push({ date, label })
  })

  // إضافة الأيام الماضية
  if (showPast) {
    const startDay = showToday ? 0 : 1
    for (let i = startDay; i < pastDays; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      
      let label: string
      if (i === 0 && showToday) {
        label = 'اليوم'
      } else if (i === 1 && showToday) {
        label = 'أمس'
      } else {
        label = date.toLocaleDateString('ar-EG', { weekday: 'short' })
      }
      
      dates.push({ date, label })
    }
  }

  // إضافة الأيام المستقبلية
  if (showFuture) {
    for (let i = 1; i <= futureDays; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const label = date.toLocaleDateString('ar-EG', { weekday: 'short' })
      dates.push({ date, label })
    }
  }

  // ترتيب التواريخ من الأقدم للأحدث
  dates.sort((a, b) => a.date.getTime() - b.date.getTime())

  // إضافة الأزرار
  dates.forEach(({ date, label }) => {
    const dateStr = date.toISOString().split('T')[0]
    const displayDate = date.toLocaleDateString('ar-EG')
    
    keyboard.text(
      `${label} (${displayDate})`, 
      `${callbackPrefix}:${dateStr}`
    ).row()
  })

  // إضافة زر الرجوع
  keyboard.text('⬅️ رجوع', backCallback)
  
  return keyboard
}

/**
 * مساعد لتحليل التاريخ من callback data
 * 
 * @param dateStr - التاريخ بصيغة YYYY-MM-DD
 * @returns Date object أو null إذا كان التاريخ غير صحيح
 */
export function parseDateFromCallback(dateStr: string): Date | null {
  try {
    const date = new Date(dateStr + 'T00:00:00')
    if (isNaN(date.getTime())) {
      return null
    }
    return date
  } catch {
    return null
  }
}

/**
 * مساعد لتنسيق التاريخ للعرض
 * 
 * @param date - التاريخ
 * @returns التاريخ منسق للعرض بالعربية
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('ar-EG')
}

/**
 * مساعد للتحقق من صحة التاريخ
 * 
 * @param date - التاريخ للتحقق
 * @param minDate - الحد الأدنى للتاريخ (اختياري)
 * @param maxDate - الحد الأقصى للتاريخ (اختياري)
 * @returns true إذا كان التاريخ صحيح
 */
export function isValidDate(
  date: Date, 
  minDate?: Date, 
  maxDate?: Date
): boolean {
  if (isNaN(date.getTime())) {
    return false
  }
  
  if (minDate && date < minDate) {
    return false
  }
  
  if (maxDate && date > maxDate) {
    return false
  }
  
  return true
}
