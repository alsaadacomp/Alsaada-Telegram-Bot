/**
 * Number Validator
 * التحقق من صحة الأرقام (صحيحة وعشرية)
 * يدعم الأرقام العربية والإنجليزية
 */

import type { NumberRange } from './types.js'
import { isValidNumberString, normalizeArabicNumbers } from '../formatters/number-formatter.js'

/**
 * يتحقق من أن القيمة رقم صحيح
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان رقم صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidNumber('123')      // true - رقم صحيح
 * isValidNumber('123.45')   // true - رقم عشري
 * isValidNumber('-123')     // true - رقم سالب
 * isValidNumber('0')        // true - صفر
 * isValidNumber('abc')      // false - ليس رقم
 * isValidNumber('12.34.56') // false - تنسيق خاطئ
 * isValidNumber('')         // false - فارغ
 * ```
 */
export function isValidNumber(value: string | number): boolean {
  // التحقق من أن المدخل موجود
  if (value === undefined || value === null || value === '') {
    return false
  }

  // إذا كان number بالفعل
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value)
  }

  // إذا كان string
  if (typeof value !== 'string') {
    return false
  }

  // إزالة المسافات وتحويل الأرقام العربية
  const cleanValue = normalizeArabicNumbers(value.trim().replace(/,/g, ''))

  // التحقق من أنه ليس فارغ بعد التنظيف
  if (cleanValue === '') {
    return false
  }

  // التحقق من أنه رقم صحيح
  const num = Number(cleanValue)
  return !isNaN(num) && isFinite(num)
}

/**
 * يتحقق من أن القيمة رقم صحيح (integer) - بدون كسور
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان رقم صحيح بدون كسور، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isInteger('123')    // true - رقم صحيح
 * isInteger('-123')   // true - رقم صحيح سالب
 * isInteger('0')      // true - صفر
 * isInteger('123.45') // false - رقم عشري
 * isInteger('abc')    // false - ليس رقم
 * ```
 */
export function isInteger(value: string | number): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())
  return Number.isInteger(num)
}

/**
 * يتحقق من أن القيمة رقم عشري (decimal/float)
 * @param value - القيمة المراد التحقق منها
 * @param decimalPlaces - عدد الخانات العشرية المسموحة (اختياري)
 * @returns true إذا كان رقم عشري، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isDecimal('123.45')      // true - رقم عشري
 * isDecimal('123.456', 2)  // false - أكثر من خانتين
 * isDecimal('123.45', 2)   // true - خانتين بالضبط
 * isDecimal('123')         // true - يعتبر 123.0
 * isDecimal('-123.45')     // true - رقم عشري سالب
 * ```
 */
export function isDecimal(value: string | number, decimalPlaces?: number): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())

  // إذا لم يحدد عدد الخانات، نقبل أي رقم عشري
  if (decimalPlaces === undefined) {
    return true
  }

  // التحقق من عدد الخانات العشرية
  const strValue = num.toString()
  const parts = strValue.split('.')

  if (parts.length === 1) {
    // رقم صحيح (بدون خانات عشرية)
    return decimalPlaces >= 0
  }

  const actualDecimalPlaces = parts[1].length
  return actualDecimalPlaces <= decimalPlaces
}

/**
 * يتحقق من أن الرقم موجب (أكبر من صفر)
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان موجب، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isPositiveNumber('123')    // true - موجب
 * isPositiveNumber('0.1')    // true - موجب صغير
 * isPositiveNumber('0')      // false - صفر
 * isPositiveNumber('-123')   // false - سالب
 * ```
 */
export function isPositiveNumber(value: string | number): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())
  return num > 0
}

/**
 * يتحقق من أن الرقم سالب (أقل من صفر)
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان سالب، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isNegativeNumber('-123')   // true - سالب
 * isNegativeNumber('-0.1')   // true - سالب صغير
 * isNegativeNumber('0')      // false - صفر
 * isNegativeNumber('123')    // false - موجب
 * ```
 */
export function isNegativeNumber(value: string | number): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())
  return num < 0
}

/**
 * يتحقق من أن الرقم في نطاق معين
 * @param value - القيمة المراد التحقق منها
 * @param min - الحد الأدنى (اختياري)
 * @param max - الحد الأقصى (اختياري)
 * @returns true إذا كان في النطاق، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isInRange('50', 0, 100)     // true - في النطاق
 * isInRange('150', 0, 100)    // false - أكبر من الحد الأقصى
 * isInRange('-10', 0, 100)    // false - أقل من الحد الأدنى
 * isInRange('50', 0)          // true - فقط حد أدنى
 * isInRange('50', undefined, 100) // true - فقط حد أقصى
 * ```
 */
export function isInRange(
  value: string | number,
  min?: number,
  max?: number,
): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())

  // التحقق من الحد الأدنى
  if (min !== undefined && num < min) {
    return false
  }

  // التحقق من الحد الأقصى
  if (max !== undefined && num > max) {
    return false
  }

  return true
}

/**
 * يتحقق من أن الرقم بين قيمتين (شامل الطرفين)
 * @param value - القيمة المراد التحقق منها
 * @param min - الحد الأدنى
 * @param max - الحد الأقصى
 * @returns true إذا كان بين القيمتين، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isBetween('50', 0, 100)   // true - بين 0 و 100
 * isBetween('0', 0, 100)    // true - الحد الأدنى (شامل)
 * isBetween('100', 0, 100)  // true - الحد الأقصى (شامل)
 * isBetween('150', 0, 100)  // false - أكبر
 * ```
 */
export function isBetween(
  value: string | number,
  min: number,
  max: number,
): boolean {
  return isInRange(value, min, max)
}

/**
 * يتحقق من أن الرقم زوجي (even)
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان زوجي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isEven('2')   // true - زوجي
 * isEven('4')   // true - زوجي
 * isEven('0')   // true - صفر زوجي
 * isEven('3')   // false - فردي
 * isEven('1.5') // false - ليس صحيح
 * ```
 */
export function isEven(value: string | number): boolean {
  if (!isInteger(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())
  return num % 2 === 0
}

/**
 * يتحقق من أن الرقم فردي (odd)
 * @param value - القيمة المراد التحقق منها
 * @returns true إذا كان فردي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isOdd('1')   // true - فردي
 * isOdd('3')   // true - فردي
 * isOdd('2')   // false - زوجي
 * isOdd('0')   // false - صفر زوجي
 * isOdd('1.5') // false - ليس صحيح
 * ```
 */
export function isOdd(value: string | number): boolean {
  if (!isInteger(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())
  return num % 2 !== 0
}

/**
 * يتحقق من أن الرقم عدد طبيعي (natural number: 1, 2, 3, ...)
 * @param value - القيمة المراد التحقق منها
 * @param includeZero - هل نعتبر الصفر عدد طبيعي؟ (افتراضي: false)
 * @returns true إذا كان عدد طبيعي، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isNaturalNumber('1')    // true - عدد طبيعي
 * isNaturalNumber('5')    // true - عدد طبيعي
 * isNaturalNumber('0')    // false - صفر (افتراضي)
 * isNaturalNumber('0', true) // true - صفر (مع includeZero)
 * isNaturalNumber('-1')   // false - سالب
 * isNaturalNumber('1.5')  // false - عشري
 * ```
 */
export function isNaturalNumber(value: string | number, includeZero = false): boolean {
  if (!isInteger(value)) {
    return false
  }

  const num = typeof value === 'number' ? value : Number(value.toString().trim())

  if (includeZero) {
    return num >= 0
  }

  return num > 0
}

/**
 * يتحقق من أن الرقم نسبة مئوية صحيحة (0-100)
 * @param value - القيمة المراد التحقق منها
 * @param allowDecimals - السماح بالخانات العشرية؟ (افتراضي: true)
 * @returns true إذا كان نسبة مئوية صحيحة، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isPercentage('50')      // true - نسبة صحيحة
 * isPercentage('0')       // true - صفر
 * isPercentage('100')     // true - مائة
 * isPercentage('50.5')    // true - مع عشري
 * isPercentage('50.5', false) // false - بدون عشري
 * isPercentage('150')     // false - أكبر من 100
 * isPercentage('-10')     // false - سالب
 * ```
 */
export function isPercentage(value: string | number, allowDecimals = true): boolean {
  if (!isValidNumber(value)) {
    return false
  }

  if (!allowDecimals && !isInteger(value)) {
    return false
  }

  return isInRange(value, 0, 100)
}

/**
 * يحول string إلى number مع التحقق
 * @param value - القيمة المراد تحويلها
 * @returns الرقم إذا كان صحيح، null إذا لم يكن
 *
 * @example
 * ```typescript
 * toNumber('123')    // 123
 * toNumber('123.45') // 123.45
 * toNumber('abc')    // null
 * toNumber('')       // null
 * ```
 */
export function toNumber(value: string | number): number | null {
  if (!isValidNumber(value)) {
    return null
  }

  if (typeof value === 'number') {
    return value
  }

  // تحويل الأرقام العربية وإزالة الفواصل
  const normalized = normalizeArabicNumbers(value.toString().trim().replace(/,/g, ''))
  const num = Number(normalized)
  return num
}

/**
 * يحول string إلى integer مع التحقق
 * @param value - القيمة المراد تحويلها
 * @returns الرقم الصحيح إذا كان صحيح، null إذا لم يكن
 *
 * @example
 * ```typescript
 * toInteger('123')    // 123
 * toInteger('123.45') // 123 (يحول إلى صحيح)
 * toInteger('123.99') // 123 (يحول إلى صحيح)
 * toInteger('abc')    // null
 * ```
 */
export function toInteger(value: string | number): number | null {
  const num = toNumber(value)
  if (num === null) {
    return null
  }

  return Math.floor(num)
}

/**
 * يقرب الرقم العشري إلى عدد معين من الخانات
 * @param value - القيمة المراد تقريبها
 * @param decimalPlaces - عدد الخانات العشرية (افتراضي: 2)
 * @returns الرقم بعد التقريب، null إذا لم يكن رقم صحيح
 *
 * @example
 * ```typescript
 * roundToDecimal('123.456', 2)  // 123.46
 * roundToDecimal('123.454', 2)  // 123.45
 * roundToDecimal('123.456')     // 123.46 (افتراضي 2)
 * roundToDecimal('123', 2)      // 123.00
 * ```
 */
export function roundToDecimal(
  value: string | number,
  decimalPlaces = 2,
): number | null {
  const num = toNumber(value)
  if (num === null) {
    return null
  }

  const multiplier = 10 ** decimalPlaces
  return Math.round(num * multiplier) / multiplier
}
