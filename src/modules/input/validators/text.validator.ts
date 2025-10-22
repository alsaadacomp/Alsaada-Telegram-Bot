/**
 * Text Validator
 * التحقق من صحة النصوص والأسماء وكلمات المرور
 */

import type { PasswordStrength, PasswordValidationResult } from './types.js'

/**
 * يتحقق من أن النص ليس فارغ
 * @param text - النص المراد التحقق منه
 * @returns true إذا كان النص غير فارغ، false إذا كان فارغ
 *
 * @example
 * ```typescript
 * isNotEmpty('Hello')     // true - يوجد محتوى
 * isNotEmpty('   ')       // false - مسافات فقط
 * isNotEmpty('')          // false - فارغ
 * isNotEmpty(null)        // false - null
 * ```
 */
export function isNotEmpty(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false
  }

  return text.trim().length > 0
}

/**
 * يتحقق من أن النص له طول أدنى معين
 * @param text - النص المراد التحقق منه
 * @param minLength - الطول الأدنى المطلوب
 * @returns true إذا كان الطول مناسب، false إذا لم يكن
 *
 * @example
 * ```typescript
 * hasMinLength('Hello', 3)      // true - 5 أحرف
 * hasMinLength('Hi', 3)         // false - حرفين فقط
 * hasMinLength('Hello', 5)      // true - بالضبط 5
 * ```
 */
export function hasMinLength(text: string, minLength: number): boolean {
  if (!isNotEmpty(text)) {
    return false
  }

  return text.trim().length >= minLength
}

/**
 * يتحقق من أن النص لا يتجاوز طول أقصى معين
 * @param text - النص المراد التحقق منه
 * @param maxLength - الطول الأقصى المسموح
 * @returns true إذا كان الطول مناسب، false إذا لم يكن
 *
 * @example
 * ```typescript
 * hasMaxLength('Hello', 10)     // true - 5 أحرف
 * hasMaxLength('Hello World!', 10) // false - 12 حرف
 * hasMaxLength('Hello', 5)      // true - بالضبط 5
 * ```
 */
export function hasMaxLength(text: string, maxLength: number): boolean {
  if (!text || typeof text !== 'string') {
    return true // نص فارغ يعتبر صحيح
  }

  return text.trim().length <= maxLength
}

/**
 * يتحقق من أن النص له طول محدد بين حدين
 * @param text - النص المراد التحقق منه
 * @param minLength - الطول الأدنى
 * @param maxLength - الطول الأقصى
 * @returns true إذا كان الطول في النطاق، false إذا لم يكن
 *
 * @example
 * ```typescript
 * hasLengthBetween('Hello', 3, 10)    // true - 5 أحرف
 * hasLengthBetween('Hi', 3, 10)       // false - حرفين فقط
 * hasLengthBetween('Hello World!', 3, 10) // false - 12 حرف
 * ```
 */
export function hasLengthBetween(
  text: string,
  minLength: number,
  maxLength: number,
): boolean {
  return hasMinLength(text, minLength) && hasMaxLength(text, maxLength)
}

/**
 * يتحقق من صحة اسم المستخدم (username)
 * @param username - اسم المستخدم المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidUsername('john_doe')      // true - صحيح
 * isValidUsername('user123')       // true - مع أرقام
 * isValidUsername('user-name')     // true - مع شرطة
 * isValidUsername('ab')            // false - قصير جداً (أقل من 3)
 * isValidUsername('user name')     // false - مسافة
 * isValidUsername('user@name')     // false - رموز خاصة
 * ```
 *
 * الشروط:
 * - من 3 إلى 30 حرف
 * - حروف إنجليزية وأرقام فقط
 * - يمكن استخدام _ و -
 * - لا يبدأ أو ينتهي برقم أو رمز
 */
export function isValidUsername(username: string): boolean {
  if (!isNotEmpty(username)) {
    return false
  }

  const cleanUsername = username.trim()

  // التحقق من الطول (3-30 حرف)
  if (!hasLengthBetween(cleanUsername, 3, 30)) {
    return false
  }

  // يجب أن يحتوي على حروف وأرقام و _ و - فقط
  const usernameRegex = /^[\w-]+$/
  if (!usernameRegex.test(cleanUsername)) {
    return false
  }

  // يجب أن يبدأ بحرف
  if (!/^[a-z]/i.test(cleanUsername)) {
    return false
  }

  // يجب أن ينتهي بحرف أو رقم (ليس _ أو -)
  if (!/[a-z0-9]$/i.test(cleanUsername)) {
    return false
  }

  // لا يجب أن يحتوي على _ أو - متتاليين
  if (cleanUsername.includes('__') || cleanUsername.includes('--') || cleanUsername.includes('_-') || cleanUsername.includes('-_')) {
    return false
  }

  return true
}

/**
 * يتحقق من صحة الاسم (الاسم الحقيقي)
 * @param name - الاسم المراد التحقق منه
 * @param allowArabic - السماح بالحروف العربية؟ (افتراضي: true)
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidName('John Doe')          // true - اسم إنجليزي
 * isValidName('أحمد محمد')         // true - اسم عربي
 * isValidName('أحمد محمد', false)  // false - عربي غير مسموح
 * isValidName('John123')           // false - يحتوي أرقام
 * isValidName('J')                 // false - قصير جداً
 * ```
 */
export function isValidName(name: string, allowArabic = true): boolean {
  if (!isNotEmpty(name)) {
    return false
  }

  const cleanName = name.trim()

  // التحقق من الطول (2-100 حرف)
  if (!hasLengthBetween(cleanName, 2, 100)) {
    return false
  }

  // Regular Expression حسب السماح بالعربي
  let nameRegex: RegExp
  if (allowArabic) {
    // حروف إنجليزية وعربية ومسافات
    nameRegex = /^[a-z\u0600-\u06FF\s]+$/i
  }
  else {
    // حروف إنجليزية ومسافات فقط
    nameRegex = /^[a-z\s]+$/i
  }

  if (!nameRegex.test(cleanName)) {
    return false
  }

  // لا يجب أن يبدأ أو ينتهي بمسافة
  if (cleanName.startsWith(' ') || cleanName.endsWith(' ')) {
    return false
  }

  // لا يجب أن يحتوي على مسافات متتالية
  if (cleanName.includes('  ')) {
    return false
  }

  return true
}

/**
 * يتحقق من قوة كلمة المرور
 * @param password - كلمة المرور المراد التحقق منها
 * @returns كائن يحتوي على صحة كلمة المرور وقوتها وملاحظات
 *
 * @example
 * ```typescript
 * isValidPassword('Pass123!')
 * // {
 * //   isValid: true,
 * //   strength: 'strong',
 * //   score: 80,
 * //   suggestions: []
 * // }
 *
 * isValidPassword('weak')
 * // {
 * //   isValid: false,
 * //   strength: 'weak',
 * //   score: 20,
 * //   suggestions: ['يجب أن تحتوي على حرف كبير', ...]
 * // }
 * ```
 *
 * الشروط:
 * - لا تقل عن 8 أحرف
 * - تحتوي على حرف كبير
 * - تحتوي على حرف صغير
 * - تحتوي على رقم
 * - تحتوي على رمز خاص (اختياري لكن يزيد القوة)
 */
export function isValidPassword(password: string): PasswordValidationResult {
  const result: PasswordValidationResult = {
    isValid: false,
    strength: 'weak',
    score: 0,
    suggestions: [],
  }

  if (!password || typeof password !== 'string') {
    result.suggestions.push('كلمة المرور مطلوبة')
    return result
  }

  let score = 0

  // التحقق من الطول
  if (password.length < 8) {
    result.suggestions.push('يجب أن تحتوي على 8 أحرف على الأقل')
  }
  else {
    score += 20
    if (password.length >= 12) {
      score += 10
    }
    if (password.length >= 16) {
      score += 10
    }
  }

  // التحقق من الحروف الكبيرة
  if (!/[A-Z]/.test(password)) {
    result.suggestions.push('يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)')
  }
  else {
    score += 15
  }

  // التحقق من الحروف الصغيرة
  if (!/[a-z]/.test(password)) {
    result.suggestions.push('يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)')
  }
  else {
    score += 15
  }

  // التحقق من الأرقام
  if (!/\d/.test(password)) {
    result.suggestions.push('يجب أن تحتوي على رقم واحد على الأقل (0-9)')
  }
  else {
    score += 15
  }

  // التحقق من الرموز الخاصة
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\/`~]/.test(password)) {
    result.suggestions.push('يُفضل أن تحتوي على رمز خاص (!@#$%...)')
  }
  else {
    score += 25
  }

  // تحديد القوة
  result.score = score

  if (score < 40) {
    result.strength = 'weak'
  }
  else if (score < 60) {
    result.strength = 'medium'
  }
  else if (score < 80) {
    result.strength = 'strong'
  }
  else {
    result.strength = 'very-strong'
  }

  // كلمة المرور صحيحة إذا كانت الشروط الأساسية متحققة
  result.isValid = password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)

  return result
}

/**
 * يتحقق من أن كلمة المرور قوية بما يكفي
 * @param password - كلمة المرور
 * @param minStrength - الحد الأدنى للقوة المطلوبة (افتراضي: 'medium')
 * @returns true إذا كانت قوية بما يكفي، false إذا لم تكن
 *
 * @example
 * ```typescript
 * isStrongPassword('Pass123!')              // true
 * isStrongPassword('Pass123!', 'strong')    // true/false حسب القوة
 * isStrongPassword('weak')                  // false
 * ```
 */
export function isStrongPassword(
  password: string,
  minStrength: PasswordStrength = 'medium',
): boolean {
  const result = isValidPassword(password)

  if (!result.isValid) {
    return false
  }

  const strengthLevels: PasswordStrength[] = ['weak', 'medium', 'strong', 'very-strong']
  const minIndex = strengthLevels.indexOf(minStrength)
  const currentIndex = strengthLevels.indexOf(result.strength!)

  return currentIndex >= minIndex
}

/**
 * يتحقق من أن النص يحتوي على حروف عربية فقط
 * @param text - النص المراد التحقق منه
 * @param allowSpaces - السماح بالمسافات؟ (افتراضي: true)
 * @returns true إذا كان عربي فقط، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isArabicOnly('مرحبا')          // true - عربي
 * isArabicOnly('مرحبا بك')       // true - عربي مع مسافة
 * isArabicOnly('مرحبا بك', false) // false - مسافة غير مسموحة
 * isArabicOnly('Hello')          // false - إنجليزي
 * isArabicOnly('مرحبا123')       // false - مع أرقام
 * ```
 */
export function isArabicOnly(text: string, allowSpaces = true): boolean {
  if (!isNotEmpty(text)) {
    return false
  }

  const arabicRegex = allowSpaces
    ? /^[\u0600-\u06FF\s]+$/
    : /^[\u0600-\u06FF]+$/

  return arabicRegex.test(text.trim())
}

/**
 * يتحقق من أن النص يحتوي على حروف إنجليزية فقط
 * @param text - النص المراد التحقق منه
 * @param allowSpaces - السماح بالمسافات؟ (افتراضي: true)
 * @returns true إذا كان إنجليزي فقط، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isEnglishOnly('Hello')          // true - إنجليزي
 * isEnglishOnly('Hello World')    // true - إنجليزي مع مسافة
 * isEnglishOnly('Hello World', false) // false - مسافة غير مسموحة
 * isEnglishOnly('مرحبا')          // false - عربي
 * isEnglishOnly('Hello123')       // false - مع أرقام
 * ```
 */
export function isEnglishOnly(text: string, allowSpaces = true): boolean {
  if (!isNotEmpty(text)) {
    return false
  }

  const englishRegex = allowSpaces ? /^[a-z\s]+$/i : /^[a-z]+$/i

  return englishRegex.test(text.trim())
}

/**
 * يتحقق من أن النص يحتوي على أرقام فقط
 * @param text - النص المراد التحقق منه
 * @returns true إذا كان أرقام فقط، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isNumericOnly('12345')   // true - أرقام فقط
 * isNumericOnly('123abc')  // false - مع حروف
 * isNumericOnly('123 456') // false - مع مسافة
 * ```
 */
export function isNumericOnly(text: string): boolean {
  if (!isNotEmpty(text)) {
    return false
  }

  return /^\d+$/.test(text.trim())
}

/**
 * يتحقق من أن النص يحتوي على أحرف وأرقام فقط (alphanumeric)
 * @param text - النص المراد التحقق منه
 * @param allowSpaces - السماح بالمسافات؟ (افتراضي: false)
 * @returns true إذا كان alphanumeric، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isAlphanumeric('abc123')        // true - حروف وأرقام
 * isAlphanumeric('abc 123')       // false - مع مسافة
 * isAlphanumeric('abc 123', true) // true - مسافة مسموحة
 * isAlphanumeric('abc@123')       // false - رموز خاصة
 * ```
 */
export function isAlphanumeric(text: string, allowSpaces = false): boolean {
  if (!isNotEmpty(text)) {
    return false
  }

  const alphanumericRegex = allowSpaces
    ? /^[a-z0-9\s]+$/i
    : /^[a-z0-9]+$/i

  return alphanumericRegex.test(text.trim())
}
