/**
 * Special Validators
 * محققات خاصة (URL, IBAN, وغيرها)
 */

/**
 * يتحقق من صحة URL
 * @param url - الرابط المراد التحقق منه
 * @returns true إذا كان الرابط صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidUrl('https://example.com')          // true - صحيح
 * isValidUrl('http://www.example.com')       // true - صحيح
 * isValidUrl('https://sub.example.com/page') // true - صحيح
 * isValidUrl('example.com')                  // false - بدون protocol
 * isValidUrl('not a url')                    // false - خاطئ
 * ```
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  const cleanUrl = url.trim()

  if (cleanUrl === '') {
    return false
  }

  try {
    const urlObject = new URL(cleanUrl)

    // التحقق من أن protocol صحيح (http أو https)
    return urlObject.protocol === 'http:' || urlObject.protocol === 'https:'
  }
  catch {
    return false
  }
}

/**
 * يتحقق من صحة IBAN (International Bank Account Number)
 * @param iban - رقم الحساب البنكي الدولي
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidIBAN('SA0380000000608010167519')  // true - IBAN سعودي صحيح
 * isValidIBAN('EG380019000500000000263180002') // true - IBAN مصري صحيح
 * isValidIBAN('invalid')                   // false - خاطئ
 * ```
 */
export function isValidIBAN(iban: string): boolean {
  if (!iban || typeof iban !== 'string') {
    return false
  }

  // إزالة المسافات والشرطات
  let cleanIBAN = iban.trim().replace(/[\s-]/g, '').toUpperCase()

  if (cleanIBAN === '') {
    return false
  }

  // التحقق من أن الطول بين 15 و 34 حرف
  if (cleanIBAN.length < 15 || cleanIBAN.length > 34) {
    return false
  }

  // التحقق من أنه يبدأ بحرفين (country code)
  if (!/^[A-Z]{2}/.test(cleanIBAN)) {
    return false
  }

  // التحقق من أن الحرفين الثالث والرابع أرقام (check digits)
  if (!/^[A-Z]{2}\d{2}/.test(cleanIBAN)) {
    return false
  }

  // نقل أول 4 أحرف إلى النهاية
  cleanIBAN = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4)

  // تحويل الحروف إلى أرقام (A=10, B=11, ..., Z=35)
  let numericIBAN = ''
  for (const char of cleanIBAN) {
    if (/[A-Z]/.test(char)) {
      numericIBAN += (char.charCodeAt(0) - 55).toString()
    }
    else {
      numericIBAN += char
    }
  }

  // التحقق من checksum باستخدام mod 97
  let remainder = 0
  for (const digit of numericIBAN) {
    remainder = (remainder * 10 + Number.parseInt(digit, 10)) % 97
  }

  return remainder === 1
}

/**
 * يتحقق من صحة IBAN سعودي
 * @param iban - رقم الحساب البنكي الدولي السعودي
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidSaudiIBAN('SA0380000000608010167519')  // true - صحيح
 * isValidSaudiIBAN('EG380019000500000000263180002') // false - مصري
 * ```
 */
export function isValidSaudiIBAN(iban: string): boolean {
  if (!isValidIBAN(iban)) {
    return false
  }

  // التحقق من أنه يبدأ بـ SA
  const cleanIBAN = iban.trim().replace(/[\s-]/g, '').toUpperCase()
  if (!cleanIBAN.startsWith('SA')) {
    return false
  }

  // IBAN سعودي يجب أن يكون 24 حرف
  return cleanIBAN.length === 24
}

/**
 * يتحقق من صحة IBAN مصري
 * @param iban - رقم الحساب البنكي الدولي المصري
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidEgyptIBAN('EG380019000500000000263180002')  // true - صحيح
 * isValidEgyptIBAN('SA0380000000608010167519') // false - سعودي
 * ```
 */
export function isValidEgyptIBAN(iban: string): boolean {
  if (!isValidIBAN(iban)) {
    return false
  }

  // التحقق من أنه يبدأ بـ EG
  const cleanIBAN = iban.trim().replace(/[\s-]/g, '').toUpperCase()
  if (!cleanIBAN.startsWith('EG')) {
    return false
  }

  // IBAN مصري يجب أن يكون 29 حرف
  return cleanIBAN.length === 29
}

/**
 * يستخرج country code من IBAN
 * @param iban - رقم الحساب البنكي الدولي
 * @returns country code أو null إذا كان خاطئ
 *
 * @example
 * ```typescript
 * extractIBANCountry('SA0380000000608010167519')  // 'SA'
 * extractIBANCountry('EG380019000500000000263180002') // 'EG'
 * extractIBANCountry('invalid')                   // null
 * ```
 */
export function extractIBANCountry(iban: string): string | null {
  if (!isValidIBAN(iban)) {
    return null
  }

  const cleanIBAN = iban.trim().replace(/[\s-]/g, '').toUpperCase()
  return cleanIBAN.slice(0, 2)
}

/**
 * ينسق IBAN بإضافة مسافات كل 4 أحرف
 * @param iban - رقم الحساب البنكي الدولي
 * @returns IBAN منسق أو null إذا كان خاطئ
 *
 * @example
 * ```typescript
 * formatIBAN('SA0380000000608010167519')
 * // 'SA03 8000 0000 6080 1016 7519'
 *
 * formatIBAN('EG380019000500000000263180002')
 * // 'EG38 0019 0005 0000 0000 2631 8000 2'
 * ```
 */
export function formatIBAN(iban: string): string | null {
  if (!isValidIBAN(iban)) {
    return null
  }

  const cleanIBAN = iban.trim().replace(/[\s-]/g, '').toUpperCase()

  // إضافة مسافة كل 4 أحرف
  return cleanIBAN.replace(/(.{4})/g, '$1 ').trim()
}

/**
 * يتحقق من صحة IPv4 address
 * @param ip - عنوان IP المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidIPv4('192.168.1.1')    // true - صحيح
 * isValidIPv4('255.255.255.0')  // true - صحيح
 * isValidIPv4('256.1.1.1')      // false - خارج النطاق
 * isValidIPv4('192.168.1')      // false - ناقص
 * ```
 */
export function isValidIPv4(ip: string): boolean {
  if (!ip || typeof ip !== 'string') {
    return false
  }

  const cleanIP = ip.trim()

  // التحقق من التنسيق الأساسي
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/
  const match = cleanIP.match(ipv4Regex)

  if (!match) {
    return false
  }

  // التحقق من أن كل جزء بين 0 و 255
  for (let i = 1; i <= 4; i++) {
    const num = Number.parseInt(match[i], 10)
    if (num < 0 || num > 255) {
      return false
    }
  }

  return true
}

/**
 * يتحقق من صحة MAC address
 * @param mac - عنوان MAC المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidMACAddress('00:1B:44:11:3A:B7')    // true - صحيح
 * isValidMACAddress('00-1B-44-11-3A-B7')    // true - صحيح
 * isValidMACAddress('001B44113AB7')         // true - صحيح
 * isValidMACAddress('invalid')              // false - خاطئ
 * ```
 */
export function isValidMACAddress(mac: string): boolean {
  if (!mac || typeof mac !== 'string') {
    return false
  }

  const cleanMAC = mac.trim().toUpperCase()

  // دعم صيغ مختلفة: XX:XX:XX:XX:XX:XX أو XX-XX-XX-XX-XX-XX أو XXXXXXXXXXXX
  const macRegex = /^([0-9A-F]{2}[:-]?){5}([0-9A-F]{2})$/

  return macRegex.test(cleanMAC)
}

/**
 * يتحقق من صحة Hex Color Code
 * @param color - كود اللون المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidHexColor('#FF5733')   // true - صحيح
 * isValidHexColor('#FFF')      // true - صحيح (shorthand)
 * isValidHexColor('FF5733')    // true - صحيح (بدون #)
 * isValidHexColor('#GG5733')   // false - حروف خاطئة
 * isValidHexColor('#FF57')     // false - طول خاطئ
 * ```
 */
export function isValidHexColor(color: string): boolean {
  if (!color || typeof color !== 'string') {
    return false
  }

  const cleanColor = color.trim()

  // دعم صيغ: #RGB, #RRGGBB, RGB, RRGGBB
  const hexRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i

  return hexRegex.test(cleanColor)
}

/**
 * يتحقق من صحة UUID (Universally Unique Identifier)
 * @param uuid - UUID المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidUUID('123e4567-e89b-12d3-a456-426614174000')  // true - صحيح
 * isValidUUID('invalid-uuid')                          // false - خاطئ
 * ```
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid || typeof uuid !== 'string') {
    return false
  }

  const cleanUUID = uuid.trim()

  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  return uuidRegex.test(cleanUUID)
}

/**
 * يتحقق من صحة JSON string
 * @param jsonString - JSON string المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidJSON('{"name": "test"}')  // true - صحيح
 * isValidJSON('[1, 2, 3]')         // true - صحيح
 * isValidJSON('invalid json')      // false - خاطئ
 * ```
 */
export function isValidJSON(jsonString: string): boolean {
  if (!jsonString || typeof jsonString !== 'string') {
    return false
  }

  try {
    JSON.parse(jsonString.trim())
    return true
  }
  catch {
    return false
  }
}

/**
 * يتحقق من صحة Base64 string
 * @param base64String - Base64 string المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidBase64('SGVsbG8gV29ybGQh')  // true - صحيح
 * isValidBase64('invalid base64!')   // false - خاطئ
 * ```
 */
export function isValidBase64(base64String: string): boolean {
  if (!base64String || typeof base64String !== 'string') {
    return false
  }

  const cleanBase64 = base64String.trim()

  // Base64 regex
  const base64Regex = /^[A-Z0-9+/]*={0,2}$/i

  if (!base64Regex.test(cleanBase64)) {
    return false
  }

  // التحقق من أن الطول صحيح (يجب أن يكون مضاعف 4)
  return cleanBase64.length % 4 === 0
}

/**
 * يتحقق من صحة Credit Card number (Luhn algorithm)
 * @param cardNumber - رقم البطاقة المراد التحقق منه
 * @returns true إذا كان صحيح، false إذا لم يكن
 *
 * @example
 * ```typescript
 * isValidCreditCard('4532015112830366')  // true - Visa صحيح
 * isValidCreditCard('1234567890123456')  // false - خاطئ
 * ```
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return false
  }

  // إزالة المسافات والشرطات
  const cleanNumber = cardNumber.trim().replace(/[\s-]/g, '')

  // التحقق من أنه أرقام فقط وطوله بين 13 و 19
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false
  }

  // Luhn algorithm
  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = Number.parseInt(cleanNumber[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}
