/**
 * Email Validator
 * التحقق من صحة البريد الإلكتروني
 */

/**
 * يتحقق من صحة البريد الإلكتروني
 * @param email - البريد المراد التحقق منه
 * @returns true إذا كان البريد صحيح، false إذا كان خاطئ
 *
 * @example
 * ```typescript
 * isValidEmail('test@example.com')       // true - صحيح
 * isValidEmail('user.name@domain.co.uk') // true - صحيح
 * isValidEmail('user+tag@domain.com')    // true - صحيح مع +
 * isValidEmail('invalid')                // false - بدون @
 * isValidEmail('invalid@')               // false - بدون domain
 * isValidEmail('@domain.com')            // false - بدون username
 * isValidEmail('test @example.com')      // false - مسافة
 * ```
 */
export function isValidEmail(email: string): boolean {
  // التحقق من أن المدخل موجود
  if (!email || typeof email !== 'string') {
    return false
  }

  // إزالة المسافات من البداية والنهاية
  const cleanEmail = email.trim()

  // التحقق من أنه ليس فارغ بعد التنظيف
  if (cleanEmail === '') {
    return false
  }

  // التحقق من عدم وجود مسافات في المنتصف
  if (cleanEmail.includes(' ')) {
    return false
  }

  // Regular Expression للتحقق من البريد الإلكتروني
  // يدعم: letters, numbers, dots, hyphens, underscores, plus signs
  const emailRegex = /^[\w.+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

  if (!emailRegex.test(cleanEmail)) {
    return false
  }

  // التحقق من أن @ موجودة مرة واحدة فقط
  const atCount = (cleanEmail.match(/@/g) || []).length
  if (atCount !== 1) {
    return false
  }

  // فصل username و domain
  const [username, domain] = cleanEmail.split('@')

  // التحقق من username
  if (!username || username.length === 0) {
    return false
  }

  // التحقق من أن username لا يبدأ أو ينتهي بنقطة
  if (username.startsWith('.') || username.endsWith('.')) {
    return false
  }

  // التحقق من عدم وجود نقطتين متتاليتين في username
  if (username.includes('..')) {
    return false
  }

  // التحقق من domain
  if (!domain || domain.length === 0) {
    return false
  }

  // التحقق من أن domain يحتوي على نقطة واحدة على الأقل
  if (!domain.includes('.')) {
    return false
  }

  // التحقق من أن domain لا يبدأ أو ينتهي بنقطة أو شرطة
  if (
    domain.startsWith('.')
    || domain.endsWith('.')
    || domain.startsWith('-')
    || domain.endsWith('-')
  ) {
    return false
  }

  // التحقق من عدم وجود نقطتين متتاليتين في domain
  if (domain.includes('..')) {
    return false
  }

  // فصل domain إلى أجزاء
  const domainParts = domain.split('.')

  // التحقق من أن كل جزء في domain صحيح
  for (const part of domainParts) {
    if (part.length === 0) {
      return false
    }

    // التحقق من أن الجزء الأخير (TLD) لا يحتوي على أرقام فقط
    if (part === domainParts[domainParts.length - 1]) {
      if (/^\d+$/.test(part)) {
        return false
      }
    }
  }

  return true
}

/**
 * يتحقق من صحة قائمة من البريد الإلكتروني
 * @param emails - قائمة البريد الإلكتروني المراد التحقق منها
 * @returns { valid: string[], invalid: string[] } - البريد الصحيح والخاطئ
 *
 * @example
 * ```typescript
 * validateEmailList(['test@example.com', 'invalid', 'user@domain.com'])
 * // {
 * //   valid: ['test@example.com', 'user@domain.com'],
 * //   invalid: ['invalid']
 * // }
 * ```
 */
export function validateEmailList(emails: string[]): {
  valid: string[]
  invalid: string[]
} {
  const valid: string[] = []
  const invalid: string[] = []

  for (const email of emails) {
    if (isValidEmail(email)) {
      valid.push(email.trim())
    }
    else {
      invalid.push(email)
    }
  }

  return { valid, invalid }
}

/**
 * يستخرج username من البريد الإلكتروني
 * @param email - البريد الإلكتروني
 * @returns username أو null إذا كان البريد خاطئ
 *
 * @example
 * ```typescript
 * extractUsername('test@example.com')  // 'test'
 * extractUsername('user.name@domain.com') // 'user.name'
 * extractUsername('invalid')           // null
 * ```
 */
export function extractUsername(email: string): string | null {
  if (!isValidEmail(email)) {
    return null
  }

  const [username] = email.trim().split('@')
  return username
}

/**
 * يستخرج domain من البريد الإلكتروني
 * @param email - البريد الإلكتروني
 * @returns domain أو null إذا كان البريد خاطئ
 *
 * @example
 * ```typescript
 * extractDomain('test@example.com')     // 'example.com'
 * extractDomain('user@subdomain.example.com') // 'subdomain.example.com'
 * extractDomain('invalid')              // null
 * ```
 */
export function extractDomain(email: string): string | null {
  if (!isValidEmail(email)) {
    return null
  }

  const [, domain] = email.trim().split('@')
  return domain
}

/**
 * يتحقق من أن البريد الإلكتروني من domain معين
 * @param email - البريد الإلكتروني
 * @param allowedDomains - قائمة الـ domains المسموحة
 * @returns true إذا كان من domain مسموح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isEmailFromDomain('test@gmail.com', ['gmail.com', 'yahoo.com'])  // true
 * isEmailFromDomain('test@outlook.com', ['gmail.com', 'yahoo.com']) // false
 * ```
 */
export function isEmailFromDomain(email: string, allowedDomains: string[]): boolean {
  const domain = extractDomain(email)
  if (!domain) {
    return false
  }

  return allowedDomains.some(
    allowedDomain => domain.toLowerCase() === allowedDomain.toLowerCase(),
  )
}

/**
 * يتحقق من أن البريد الإلكتروني ليس من domain محظور
 * @param email - البريد الإلكتروني
 * @param blockedDomains - قائمة الـ domains المحظورة
 * @returns true إذا كان ليس من domain محظور، false إذا كان محظور
 *
 * @example
 * ```typescript
 * isEmailNotBlocked('test@gmail.com', ['tempmail.com'])  // true
 * isEmailNotBlocked('test@tempmail.com', ['tempmail.com']) // false
 * ```
 */
export function isEmailNotBlocked(email: string, blockedDomains: string[]): boolean {
  const domain = extractDomain(email)
  if (!domain) {
    return false
  }

  return !blockedDomains.some(
    blockedDomain => domain.toLowerCase() === blockedDomain.toLowerCase(),
  )
}

/**
 * ينظف البريد الإلكتروني ويعيده بصيغة صحيحة
 * @param email - البريد الإلكتروني
 * @returns البريد بعد التنظيف أو null إذا كان خاطئ
 *
 * @example
 * ```typescript
 * normalizeEmail('  TEST@EXAMPLE.COM  ')  // 'test@example.com'
 * normalizeEmail('User@Domain.Com')       // 'user@domain.com'
 * normalizeEmail('invalid')               // null
 * ```
 */
export function normalizeEmail(email: string): string | null {
  if (!isValidEmail(email)) {
    return null
  }

  // تحويل إلى lowercase وإزالة المسافات
  return email.trim().toLowerCase()
}
