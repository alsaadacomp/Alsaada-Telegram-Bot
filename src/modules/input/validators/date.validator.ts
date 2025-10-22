/**
 * Date Validator
 * التحقق من صحة التواريخ
 */

/**
 * يتحقق من صحة كائن Date
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان التاريخ صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidDate(new Date())              // true - تاريخ صحيح
 * isValidDate(new Date('2025-01-18'))  // true - تاريخ صحيح
 * isValidDate(new Date('invalid'))     // false - تاريخ خاطئ
 * ```
 */
export function isValidDate(date: Date): boolean {
  if (!(date instanceof Date)) {
    return false
  }

  // التحقق من أن التاريخ ليس Invalid Date
  return !isNaN(date.getTime())
}

/**
 * يتحقق من صحة string تاريخ
 * @param dateString - string التاريخ المراد التحقق منه
 * @returns true إذا كان التاريخ صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidDateString('2025-01-18')         // true - صحيح
 * isValidDateString('18/01/2025')         // true - صحيح
 * isValidDateString('01-18-2025')         // true - صحيح
 * isValidDateString('invalid')            // false - خاطئ
 * isValidDateString('2025-13-01')         // false - شهر خاطئ
 * isValidDateString('2025-01-32')         // false - يوم خاطئ
 * ```
 */
export function isValidDateString(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false
  }

  const cleanDateString = dateString.trim()

  if (cleanDateString === '') {
    return false
  }

  // محاولة تحويل string إلى Date
  const date = new Date(cleanDateString)

  return isValidDate(date)
}

/**
 * يتحقق من أن التاريخ في المستقبل
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان في المستقبل، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isFutureDate(new Date('2030-01-01'))  // true - في المستقبل
 * isFutureDate(new Date('2020-01-01'))  // false - في الماضي
 * isFutureDate(new Date())              // false - الآن
 * ```
 */
export function isFutureDate(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  return date.getTime() > now.getTime()
}

/**
 * يتحقق من أن التاريخ في الماضي
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان في الماضي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isPastDate(new Date('2020-01-01'))  // true - في الماضي
 * isPastDate(new Date('2030-01-01'))  // false - في المستقبل
 * isPastDate(new Date())              // false - الآن
 * ```
 */
export function isPastDate(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  return date.getTime() < now.getTime()
}

/**
 * يتحقق من أن التاريخ اليوم
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان اليوم، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isToday(new Date())               // true - اليوم
 * isToday(new Date('2020-01-01'))   // false - ليس اليوم
 * ```
 */
export function isToday(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  return (
    date.getDate() === now.getDate()
    && date.getMonth() === now.getMonth()
    && date.getFullYear() === now.getFullYear()
  )
}

/**
 * يتحقق من أن التاريخ في نطاق معين
 * @param date - التاريخ المراد التحقق منه
 * @param start - تاريخ البداية (اختياري)
 * @param end - تاريخ النهاية (اختياري)
 * @returns true إذا كان في النطاق، false إذا لم يكن
 *
 * @example
 * ```typescript
 * const start = new Date('2020-01-01')
 * const end = new Date('2025-12-31')
 * const date = new Date('2023-06-15')
 *
 * isDateInRange(date, start, end)  // true - في النطاق
 * isDateInRange(date, start)       // true - بعد البداية فقط
 * isDateInRange(date, undefined, end) // true - قبل النهاية فقط
 * ```
 */
export function isDateInRange(date: Date, start?: Date, end?: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const dateTime = date.getTime()

  // التحقق من البداية
  if (start && isValidDate(start)) {
    if (dateTime < start.getTime()) {
      return false
    }
  }

  // التحقق من النهاية
  if (end && isValidDate(end)) {
    if (dateTime > end.getTime()) {
      return false
    }
  }

  return true
}

/**
 * يتحقق من أن التاريخ بين تاريخين (شامل الطرفين)
 * @param date - التاريخ المراد التحقق منه
 * @param start - تاريخ البداية
 * @param end - تاريخ النهاية
 * @returns true إذا كان بين التاريخين، false إذا لم يكن
 *
 * @example
 * ```typescript
 * const start = new Date('2020-01-01')
 * const end = new Date('2025-12-31')
 * const date = new Date('2023-06-15')
 *
 * isDateBetween(date, start, end)  // true - بين التاريخين
 * ```
 */
export function isDateBetween(date: Date, start: Date, end: Date): boolean {
  return isDateInRange(date, start, end)
}

/**
 * يتحقق من أن التاريخ قبل تاريخ معين
 * @param date - التاريخ المراد التحقق منه
 * @param targetDate - التاريخ المستهدف
 * @returns true إذا كان قبل التاريخ المستهدف، false إذا لم يكن
 *
 * @example
 * ```typescript
 * const date1 = new Date('2020-01-01')
 * const date2 = new Date('2025-01-01')
 *
 * isDateBefore(date1, date2)  // true - date1 قبل date2
 * isDateBefore(date2, date1)  // false - date2 بعد date1
 * ```
 */
export function isDateBefore(date: Date, targetDate: Date): boolean {
  if (!isValidDate(date) || !isValidDate(targetDate)) {
    return false
  }

  return date.getTime() < targetDate.getTime()
}

/**
 * يتحقق من أن التاريخ بعد تاريخ معين
 * @param date - التاريخ المراد التحقق منه
 * @param targetDate - التاريخ المستهدف
 * @returns true إذا كان بعد التاريخ المستهدف، false إذا لم يكن
 *
 * @example
 * ```typescript
 * const date1 = new Date('2020-01-01')
 * const date2 = new Date('2025-01-01')
 *
 * isDateAfter(date2, date1)  // true - date2 بعد date1
 * isDateAfter(date1, date2)  // false - date1 قبل date2
 * ```
 */
export function isDateAfter(date: Date, targetDate: Date): boolean {
  if (!isValidDate(date) || !isValidDate(targetDate)) {
    return false
  }

  return date.getTime() > targetDate.getTime()
}

/**
 * يتحقق من أن التاريخ يساوي تاريخ معين (نفس اليوم)
 * @param date1 - التاريخ الأول
 * @param date2 - التاريخ الثاني
 * @returns true إذا كانا نفس اليوم، false إذا لم يكونا
 *
 * @example
 * ```typescript
 * const date1 = new Date('2025-01-18 10:00')
 * const date2 = new Date('2025-01-18 15:00')
 *
 * isSameDay(date1, date2)  // true - نفس اليوم
 * ```
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false
  }

  return (
    date1.getDate() === date2.getDate()
    && date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * يتحقق من أن التاريخ في نفس الشهر
 * @param date1 - التاريخ الأول
 * @param date2 - التاريخ الثاني
 * @returns true إذا كانا في نفس الشهر، false إذا لم يكونا
 *
 * @example
 * ```typescript
 * const date1 = new Date('2025-01-10')
 * const date2 = new Date('2025-01-20')
 *
 * isSameMonth(date1, date2)  // true - نفس الشهر
 * ```
 */
export function isSameMonth(date1: Date, date2: Date): boolean {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false
  }

  return (
    date1.getMonth() === date2.getMonth()
    && date1.getFullYear() === date2.getFullYear()
  )
}

/**
 * يتحقق من أن التاريخ في نفس السنة
 * @param date1 - التاريخ الأول
 * @param date2 - التاريخ الثاني
 * @returns true إذا كانا في نفس السنة، false إذا لم يكونا
 *
 * @example
 * ```typescript
 * const date1 = new Date('2025-01-10')
 * const date2 = new Date('2025-12-20')
 *
 * isSameYear(date1, date2)  // true - نفس السنة
 * ```
 */
export function isSameYear(date1: Date, date2: Date): boolean {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return false
  }

  return date1.getFullYear() === date2.getFullYear()
}

/**
 * يتحقق من أن التاريخ في الأسبوع الحالي
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان في الأسبوع الحالي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isThisWeek(new Date())  // true - اليوم في الأسبوع الحالي
 * ```
 */
export function isThisWeek(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return isDateInRange(date, startOfWeek, endOfWeek)
}

/**
 * يتحقق من أن التاريخ في الشهر الحالي
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان في الشهر الحالي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isThisMonth(new Date())  // true - اليوم في الشهر الحالي
 * ```
 */
export function isThisMonth(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  return isSameMonth(date, now)
}

/**
 * يتحقق من أن التاريخ في السنة الحالية
 * @param date - التاريخ المراد التحقق منه
 * @returns true إذا كان في السنة الحالية، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isThisYear(new Date())  // true - اليوم في السنة الحالية
 * ```
 */
export function isThisYear(date: Date): boolean {
  if (!isValidDate(date)) {
    return false
  }

  const now = new Date()
  return isSameYear(date, now)
}

/**
 * يحسب العمر بالسنوات من تاريخ الميلاد
 * @param birthDate - تاريخ الميلاد
 * @returns العمر بالسنوات، null إذا كان التاريخ خاطئ
 *
 * @example
 * ```typescript
 * getAge(new Date('2000-01-01'))  // 25 (في 2025)
 * getAge(new Date('1995-06-15'))  // 29 (في 2025)
 * ```
 */
export function getAge(birthDate: Date): number | null {
  if (!isValidDate(birthDate)) {
    return null
  }

  const now = new Date()
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

/**
 * يتحقق من أن العمر فوق حد معين
 * @param birthDate - تاريخ الميلاد
 * @param minAge - الحد الأدنى للعمر
 * @returns true إذا كان العمر فوق الحد، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isAgeAbove(new Date('2000-01-01'), 18)  // true - فوق 18
 * isAgeAbove(new Date('2010-01-01'), 18)  // false - تحت 18
 * ```
 */
export function isAgeAbove(birthDate: Date, minAge: number): boolean {
  const age = getAge(birthDate)
  if (age === null) {
    return false
  }

  return age >= minAge
}

/**
 * يتحقق من أن التاريخ في صيغة ISO (YYYY-MM-DD)
 * @param dateString - string التاريخ
 * @returns true إذا كان في صيغة ISO، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isISODateFormat('2025-01-18')  // true - صيغة ISO
 * isISODateFormat('18/01/2025')  // false - ليست ISO
 * isISODateFormat('2025-1-18')   // false - شهر غير مكتمل
 * ```
 */
export function isISODateFormat(dateString: string): boolean {
  if (!dateString || typeof dateString !== 'string') {
    return false
  }

  // YYYY-MM-DD format
  const isoRegex = /^\d{4}-\d{2}-\d{2}$/

  if (!isoRegex.test(dateString.trim())) {
    return false
  }

  // التحقق من صحة التاريخ
  return isValidDateString(dateString)
}
