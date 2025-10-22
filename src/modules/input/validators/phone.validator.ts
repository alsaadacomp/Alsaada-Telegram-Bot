/**
 * Phone Validator
 * التحقق من صحة رقم الموبايل المصري
 * يدعم الأرقام العربية والإنجليزية
 */

import { normalizeArabicNumbers } from '../formatters/number-formatter.js'

/**
 * يتحقق من صحة رقم الموبايل المصري (11 رقم، يبدأ بـ 01)
 * @param phone - رقم الموبايل المراد التحقق منه
 * @returns true إذا كان الرقم صحيح، false إذا كان خاطئ
 *
 * @example
 * ```typescript
 * isValidEgyptPhone('01012345678')  // true - صحيح
 * isValidEgyptPhone('01112345678')  // true - صحيح
 * isValidEgyptPhone('01212345678')  // true - صحيح
 * isValidEgyptPhone('01512345678')  // true - صحيح
 * isValidEgyptPhone('0212345678')   // false - لا يبدأ بـ 01
 * isValidEgyptPhone('010123456')    // false - أقل من 11 رقم
 * isValidEgyptPhone('010123456789') // false - أكثر من 11 رقم
 * isValidEgyptPhone('01A12345678')  // false - يحتوي حروف
 * ```
 */
export function isValidEgyptPhone(phone: string): boolean {
  // التحقق من أن المدخل موجود
  if (!phone || typeof phone !== 'string') {
    return false
  }

  // إزالة المسافات والشرطات والأقواس وتحويل الأرقام العربية
  let cleanPhone = normalizeArabicNumbers(phone.trim().replace(/[\s\-()]/g, ''))

  // إزالة +20 أو 0020 إذا وجدت
  if (cleanPhone.startsWith('+20')) {
    cleanPhone = `0${cleanPhone.substring(3)}`
  }
  else if (cleanPhone.startsWith('0020')) {
    cleanPhone = `0${cleanPhone.substring(4)}`
  }

  // التحقق من الطول (يجب أن يكون 11 رقم)
  if (cleanPhone.length !== 11) {
    return false
  }

  // التحقق من أنه يبدأ بـ 01
  if (!cleanPhone.startsWith('01')) {
    return false
  }

  // التحقق من أنه أرقام فقط
  const numberRegex = /^\d{11}$/
  if (!numberRegex.test(cleanPhone)) {
    return false
  }

  // التحقق من رقم الشبكة (الرقم الثالث: 0, 1, 2, 5)
  const network = cleanPhone[2]
  const validNetworks = ['0', '1', '2', '5']
  if (!validNetworks.includes(network)) {
    return false
  }

  return true
}

/**
 * يتحقق من صحة رقم موبايل ويعيد معلومات إضافية
 * @param phone - رقم الموبايل
 * @returns كائن يحتوي على صحة الرقم ومعلومات الشبكة
 *
 * @example
 * ```typescript
 * validateEgyptPhoneWithInfo('01012345678')
 * // {
 * //   isValid: true,
 * //   formatted: '01012345678',
 * //   international: '+201012345678',
 * //   operator: 'Vodafone'
 * // }
 * ```
 */
export function validateEgyptPhoneWithInfo(phone: string): {
  isValid: boolean
  formatted?: string
  international?: string
  operator?: string
} {
  if (!isValidEgyptPhone(phone)) {
    return { isValid: false }
  }

  // تنظيف الرقم
  let cleanPhone = phone.trim().replace(/[\s\-()]/g, '')
  if (cleanPhone.startsWith('+20')) {
    cleanPhone = `0${cleanPhone.substring(3)}`
  }
  else if (cleanPhone.startsWith('0020')) {
    cleanPhone = `0${cleanPhone.substring(4)}`
  }

  // تحديد الشبكة
  const networkCode = cleanPhone.substring(0, 3)
  let operator = 'Unknown'

  switch (networkCode) {
    case '010':
      operator = 'Vodafone'
      break
    case '011':
      operator = 'Etisalat'
      break
    case '012':
      operator = 'Orange'
      break
    case '015':
      operator = 'WE (We Telecom Egypt)'
      break
  }

  return {
    isValid: true,
    formatted: cleanPhone,
    international: `+20${cleanPhone.substring(1)}`,
    operator,
  }
}

/**
 * يتحقق من رقم موبايل دولي (صيغة عامة)
 * @param phone - رقم الموبايل الدولي
 * @returns true إذا كان الرقم صحيح
 *
 * @example
 * ```typescript
 * isValidInternationalPhone('+201012345678')  // true
 * isValidInternationalPhone('+966501234567')  // true
 * isValidInternationalPhone('123')            // false
 * ```
 */
export function isValidInternationalPhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false
  }

  // إزالة المسافات والشرطات
  const cleanPhone = phone.trim().replace(/[\s\-()]/g, '')

  // التحقق من التنسيق الدولي: + ثم 1-3 أرقام للكود ثم 4-14 رقم
  const internationalRegex = /^\+[1-9]\d{5,16}$/

  return internationalRegex.test(cleanPhone)
}
