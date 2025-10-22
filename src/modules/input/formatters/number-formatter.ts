/**
 * Number Formatter
 *
 * Utilities for normalizing and formatting numbers in Arabic/English
 */

/**
 * Map of Arabic digits to English digits
 */
const ARABIC_TO_ENGLISH_DIGITS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
}

/**
 * Convert Arabic digits to English digits
 * @example
 * normalizeArabicNumbers('١٢٣٤٥') // '12345'
 * normalizeArabicNumbers('12345') // '12345'
 * normalizeArabicNumbers('١٢٣.٤٥') // '123.45'
 */
export function normalizeArabicNumbers(input: string): string {
  return input.replace(/[٠-٩]/g, match => ARABIC_TO_ENGLISH_DIGITS[match] || match)
}

/**
 * Format number with thousands separators
 * @example
 * formatNumberWithCommas(1000) // '1,000'
 * formatNumberWithCommas(1234567.89) // '1,234,567.89'
 */
export function formatNumberWithCommas(value: number | string): string {
  const num = typeof value === 'string' ? Number.parseFloat(value) : value

  if (isNaN(num)) {
    return '0'
  }

  // Split into integer and decimal parts
  const parts = num.toString().split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]

  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Combine with decimal part if exists
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

/**
 * Parse number from string (handles Arabic digits and commas)
 * @example
 * parseNumber('١,٢٣٤') // 1234
 * parseNumber('1,234.56') // 1234.56
 */
export function parseNumber(input: string): number {
  // Normalize Arabic digits
  let normalized = normalizeArabicNumbers(input)

  // Remove commas
  normalized = normalized.replace(/,/g, '')

  // Parse
  return Number.parseFloat(normalized)
}

/**
 * Format currency amount (with thousands separators)
 * @example
 * formatCurrency(1234.5) // '1,234.50'
 * formatCurrency(1234.5, 'EGP') // '1,234.50 EGP'
 */
export function formatCurrency(amount: number, currency?: string): string {
  const formatted = formatNumberWithCommas(amount.toFixed(2))
  return currency ? `${formatted} ${currency}` : formatted
}

/**
 * Validate if string contains valid number (Arabic or English digits)
 * @example
 * isValidNumberString('١٢٣') // true
 * isValidNumberString('123.45') // true
 * isValidNumberString('abc') // false
 */
export function isValidNumberString(input: string): boolean {
  const normalized = normalizeArabicNumbers(input).replace(/,/g, '')
  return /^-?\d+(\.\d+)?$/.test(normalized)
}

/**
 * Format number for display (with commas, handles Arabic input)
 * @example
 * formatNumber('١٢٣٤٥٦٧') // '1,234,567'
 * formatNumber(1234567) // '1,234,567'
 */
export function formatNumber(input: number | string): string {
  if (typeof input === 'string') {
    const normalized = normalizeArabicNumbers(input).replace(/,/g, '')
    const num = Number.parseFloat(normalized)
    return isNaN(num) ? '0' : formatNumberWithCommas(num)
  }
  return formatNumberWithCommas(input)
}
