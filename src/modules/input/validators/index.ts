/**
 * Input Validators Module
 *
 * وحدة محققات الإدخال - للتحقق من صحة المدخلات
 *
 * @module input/validators
 */

// ==================== Date Validators ====================
export {
  getAge,
  isAgeAbove,
  isDateAfter,
  isDateBefore,
  isDateBetween,
  isDateInRange,
  isFutureDate,
  isISODateFormat,
  isPastDate,
  isSameDay,
  isSameMonth,
  isSameYear,
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isValidDate,
  isValidDateString,
} from './date.validator.js'

// ==================== Email Validators ====================
export {
  extractDomain,
  extractUsername,
  isEmailFromDomain,
  isEmailNotBlocked,
  isValidEmail,
  normalizeEmail,
  validateEmailList,
} from './email.validator.js'

// ==================== National ID Validators ====================
export {
  isValidNationalID,
  validateNationalIDWithInfo,
} from './national-id.validator.js'

// ==================== Number Validators ====================
export {
  isBetween,
  isDecimal,
  isEven,
  isInRange,
  isInteger,
  isNaturalNumber,
  isNegativeNumber,
  isOdd,
  isPercentage,
  isPositiveNumber,
  isValidNumber,
  roundToDecimal,
  toInteger,
  toNumber,
} from './number.validator.js'

// ==================== Phone Validators ====================
export {
  isValidEgyptPhone,
  isValidInternationalPhone,
  validateEgyptPhoneWithInfo,
} from './phone.validator.js'

// ==================== Special Validators ====================
export {
  extractIBANCountry,
  formatIBAN,
  isValidBase64,
  isValidCreditCard,
  isValidEgyptIBAN,
  isValidHexColor,
  isValidIBAN,
  isValidIPv4,
  isValidJSON,
  isValidMACAddress,
  isValidSaudiIBAN,
  isValidUrl,
  isValidUUID,
} from './special.validator.js'

// ==================== Text Validators ====================
export {
  hasLengthBetween,
  hasMaxLength,
  hasMinLength,
  isAlphanumeric,
  isArabicOnly,
  isEnglishOnly,
  isNotEmpty,
  isNumericOnly,
  isStrongPassword,
  isValidName,
  isValidPassword,
  isValidUsername,
} from './text.validator.js'

// ==================== Types ====================
export type {
  DateRange,
  NumberRange,
  PasswordStrength,
  PasswordValidationResult,
  ValidationResult,
  ValidatorOptions,
} from './types.js'
