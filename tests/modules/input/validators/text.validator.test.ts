/**
 * Text Validator Tests
 */

import {
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
} from '../../../../src/modules/input/validators/text.validator.js'

describe('text Validator', () => {
  // ==================== isNotEmpty ====================
  describe('isNotEmpty', () => {
    it('should accept non-empty text', () => {
      expect(isNotEmpty('Hello')).toBe(true)
      expect(isNotEmpty('Test')).toBe(true)
      expect(isNotEmpty('a')).toBe(true)
    })

    it('should reject empty text', () => {
      expect(isNotEmpty('')).toBe(false)
      expect(isNotEmpty('   ')).toBe(false)
      expect(isNotEmpty('\t\n')).toBe(false)
    })

    it('should reject null or undefined', () => {
      expect(isNotEmpty(null as any)).toBe(false)
      expect(isNotEmpty(undefined as any)).toBe(false)
    })

    it('should trim and validate', () => {
      expect(isNotEmpty('  Hello  ')).toBe(true)
    })
  })

  // ==================== hasMinLength ====================
  describe('hasMinLength', () => {
    it('should accept text with sufficient length', () => {
      expect(hasMinLength('Hello', 3)).toBe(true)
      expect(hasMinLength('Test', 4)).toBe(true)
      expect(hasMinLength('Hello World', 5)).toBe(true)
    })

    it('should reject text with insufficient length', () => {
      expect(hasMinLength('Hi', 3)).toBe(false)
      expect(hasMinLength('a', 2)).toBe(false)
    })

    it('should accept text with exact length', () => {
      expect(hasMinLength('Hello', 5)).toBe(true)
    })

    it('should reject empty text', () => {
      expect(hasMinLength('', 1)).toBe(false)
      expect(hasMinLength('   ', 1)).toBe(false)
    })
  })

  // ==================== hasMaxLength ====================
  describe('hasMaxLength', () => {
    it('should accept text within max length', () => {
      expect(hasMaxLength('Hello', 10)).toBe(true)
      expect(hasMaxLength('Test', 5)).toBe(true)
    })

    it('should reject text exceeding max length', () => {
      expect(hasMaxLength('Hello World!', 10)).toBe(false)
      expect(hasMaxLength('Very long text', 5)).toBe(false)
    })

    it('should accept text with exact length', () => {
      expect(hasMaxLength('Hello', 5)).toBe(true)
    })

    it('should accept empty text', () => {
      expect(hasMaxLength('', 10)).toBe(true)
      expect(hasMaxLength('   ', 10)).toBe(true)
    })
  })

  // ==================== hasLengthBetween ====================
  describe('hasLengthBetween', () => {
    it('should accept text within range', () => {
      expect(hasLengthBetween('Hello', 3, 10)).toBe(true)
      expect(hasLengthBetween('Test', 2, 8)).toBe(true)
    })

    it('should reject text outside range', () => {
      expect(hasLengthBetween('Hi', 3, 10)).toBe(false)
      expect(hasLengthBetween('Hello World!', 3, 10)).toBe(false)
    })

    it('should accept text at boundaries', () => {
      expect(hasLengthBetween('Hi!', 3, 10)).toBe(true)
      expect(hasLengthBetween('HelloWorld', 3, 10)).toBe(true)
    })
  })

  // ==================== isValidUsername ====================
  describe('isValidUsername', () => {
    it('should accept valid usernames', () => {
      expect(isValidUsername('john_doe')).toBe(true)
      expect(isValidUsername('user123')).toBe(true)
      expect(isValidUsername('user-name')).toBe(true)
      expect(isValidUsername('test_user')).toBe(true)
    })

    it('should reject usernames too short', () => {
      expect(isValidUsername('ab')).toBe(false)
      expect(isValidUsername('a')).toBe(false)
    })

    it('should reject usernames too long', () => {
      expect(isValidUsername('a'.repeat(31))).toBe(false)
    })

    it('should reject usernames with spaces', () => {
      expect(isValidUsername('user name')).toBe(false)
    })

    it('should reject usernames with special characters', () => {
      expect(isValidUsername('user@name')).toBe(false)
      expect(isValidUsername('user#name')).toBe(false)
      expect(isValidUsername('user.name')).toBe(false)
    })

    it('should reject usernames not starting with letter', () => {
      expect(isValidUsername('123user')).toBe(false)
      expect(isValidUsername('_user')).toBe(false)
      expect(isValidUsername('-user')).toBe(false)
    })

    it('should reject usernames not ending with letter or number', () => {
      expect(isValidUsername('user_')).toBe(false)
      expect(isValidUsername('user-')).toBe(false)
    })

    it('should reject usernames with consecutive special chars', () => {
      expect(isValidUsername('user__name')).toBe(false)
      expect(isValidUsername('user--name')).toBe(false)
      expect(isValidUsername('user_-name')).toBe(false)
    })
  })

  // ==================== isValidName ====================
  describe('isValidName', () => {
    it('should accept valid English names', () => {
      expect(isValidName('John Doe')).toBe(true)
      expect(isValidName('Mary Jane')).toBe(true)
      expect(isValidName('John')).toBe(true)
    })

    it('should accept valid Arabic names', () => {
      expect(isValidName('أحمد محمد')).toBe(true)
      expect(isValidName('محمد')).toBe(true)
      expect(isValidName('فاطمة الزهراء')).toBe(true)
    })

    it('should reject Arabic names when not allowed', () => {
      expect(isValidName('أحمد محمد', false)).toBe(false)
      expect(isValidName('محمد', false)).toBe(false)
    })

    it('should reject names with numbers', () => {
      expect(isValidName('John123')).toBe(false)
      expect(isValidName('User 123')).toBe(false)
    })

    it('should reject names too short', () => {
      expect(isValidName('J')).toBe(false)
    })

    it('should reject names too long', () => {
      expect(isValidName('a'.repeat(101))).toBe(false)
    })

    it('should reject names with special characters', () => {
      expect(isValidName('John@Doe')).toBe(false)
      expect(isValidName('John#123')).toBe(false)
    })

    it('should reject names with consecutive spaces', () => {
      expect(isValidName('John  Doe')).toBe(false)
    })

    it('should reject empty names', () => {
      expect(isValidName('')).toBe(false)
      expect(isValidName('   ')).toBe(false)
    })
  })

  // ==================== isValidPassword ====================
  describe('isValidPassword', () => {
    it('should validate strong passwords', () => {
      const result = isValidPassword('Pass123!')
      expect(result.isValid).toBe(true)
      expect(['strong', 'very-strong']).toContain(result.strength)
      expect(result.score).toBeGreaterThanOrEqual(60)
    })

    it('should validate very strong passwords', () => {
      const result = isValidPassword('SuperSecure123!@#')
      expect(result.isValid).toBe(true)
      expect(result.strength).toBe('very-strong')
      expect(result.score).toBeGreaterThanOrEqual(80)
    })

    it('should reject passwords without uppercase', () => {
      const result = isValidPassword('password123!')
      expect(result.isValid).toBe(false)
      expect(result.suggestions.some(s => s.includes('حرف كبير') || s.includes('A-Z'))).toBe(true)
    })

    it('should reject passwords without lowercase', () => {
      const result = isValidPassword('PASSWORD123!')
      expect(result.isValid).toBe(false)
      expect(result.suggestions.some(s => s.includes('حرف صغير') || s.includes('a-z'))).toBe(true)
    })

    it('should reject passwords without numbers', () => {
      const result = isValidPassword('Password!')
      expect(result.isValid).toBe(false)
      expect(result.suggestions.some(s => s.includes('رقم') || s.includes('0-9'))).toBe(true)
    })

    it('should reject passwords too short', () => {
      const result = isValidPassword('Pass1!')
      expect(result.isValid).toBe(false)
      expect(result.suggestions.some(s => s.includes('8'))).toBe(true)
    })

    it('should suggest special characters for stronger password', () => {
      const result = isValidPassword('Password123')
      expect(result.suggestions.some(s => s.includes('رمز') || s.includes('!@#'))).toBe(true)
    })

    it('should handle empty password', () => {
      const result = isValidPassword('')
      expect(result.isValid).toBe(false)
      expect(result.suggestions).toContain('كلمة المرور مطلوبة')
    })

    it('should calculate score correctly for length', () => {
      const short = isValidPassword('Pass123!')
      const medium = isValidPassword('Password123!')
      const long = isValidPassword('VeryLongPassword123!')

      expect(long.score).toBeGreaterThan(medium.score)
      expect(medium.score).toBeGreaterThan(short.score)
    })
  })

  // ==================== isStrongPassword ====================
  describe('isStrongPassword', () => {
    it('should accept strong passwords with default strength', () => {
      expect(isStrongPassword('Password123!')).toBe(true)
      expect(isStrongPassword('SecurePass123!')).toBe(true)
    })

    it('should accept very strong passwords', () => {
      expect(isStrongPassword('SuperSecure123!@#', 'very-strong')).toBe(true)
    })

    it('should reject weak passwords', () => {
      expect(isStrongPassword('Pass123')).toBe(false)
      expect(isStrongPassword('weak')).toBe(false)
    })

    it('should respect minimum strength requirement', () => {
      expect(isStrongPassword('Pass123', 'strong')).toBe(false)
      expect(isStrongPassword('SuperSecure123!@#', 'strong')).toBe(true)
    })
  })

  // ==================== isArabicOnly ====================
  describe('isArabicOnly', () => {
    it('should accept Arabic text', () => {
      expect(isArabicOnly('مرحبا')).toBe(true)
      expect(isArabicOnly('مرحبا بك')).toBe(true)
      expect(isArabicOnly('السلام عليكم')).toBe(true)
    })

    it('should reject Arabic with spaces when not allowed', () => {
      expect(isArabicOnly('مرحبا بك', false)).toBe(false)
    })

    it('should reject English text', () => {
      expect(isArabicOnly('Hello')).toBe(false)
      expect(isArabicOnly('Test')).toBe(false)
    })

    it('should reject Arabic with numbers', () => {
      expect(isArabicOnly('مرحبا123')).toBe(false)
    })

    it('should reject mixed Arabic and English', () => {
      expect(isArabicOnly('مرحبا Hello')).toBe(false)
    })

    it('should reject empty text', () => {
      expect(isArabicOnly('')).toBe(false)
      expect(isArabicOnly('   ')).toBe(false)
    })
  })

  // ==================== isEnglishOnly ====================
  describe('isEnglishOnly', () => {
    it('should accept English text', () => {
      expect(isEnglishOnly('Hello')).toBe(true)
      expect(isEnglishOnly('Hello World')).toBe(true)
      expect(isEnglishOnly('Test')).toBe(true)
    })

    it('should reject English with spaces when not allowed', () => {
      expect(isEnglishOnly('Hello World', false)).toBe(false)
    })

    it('should reject Arabic text', () => {
      expect(isEnglishOnly('مرحبا')).toBe(false)
    })

    it('should reject English with numbers', () => {
      expect(isEnglishOnly('Hello123')).toBe(false)
    })

    it('should reject mixed English and Arabic', () => {
      expect(isEnglishOnly('Hello مرحبا')).toBe(false)
    })

    it('should reject empty text', () => {
      expect(isEnglishOnly('')).toBe(false)
      expect(isEnglishOnly('   ')).toBe(false)
    })
  })

  // ==================== isNumericOnly ====================
  describe('isNumericOnly', () => {
    it('should accept numeric text', () => {
      expect(isNumericOnly('12345')).toBe(true)
      expect(isNumericOnly('0')).toBe(true)
      expect(isNumericOnly('999')).toBe(true)
    })

    it('should reject text with letters', () => {
      expect(isNumericOnly('123abc')).toBe(false)
      expect(isNumericOnly('abc123')).toBe(false)
    })

    it('should reject text with spaces', () => {
      expect(isNumericOnly('123 456')).toBe(false)
    })

    it('should reject text with special characters', () => {
      expect(isNumericOnly('123-456')).toBe(false)
      expect(isNumericOnly('123.456')).toBe(false)
    })

    it('should reject empty text', () => {
      expect(isNumericOnly('')).toBe(false)
      expect(isNumericOnly('   ')).toBe(false)
    })
  })

  // ==================== isAlphanumeric ====================
  describe('isAlphanumeric', () => {
    it('should accept alphanumeric text', () => {
      expect(isAlphanumeric('abc123')).toBe(true)
      expect(isAlphanumeric('Test123')).toBe(true)
      expect(isAlphanumeric('abc')).toBe(true)
      expect(isAlphanumeric('123')).toBe(true)
    })

    it('should accept alphanumeric with spaces when allowed', () => {
      expect(isAlphanumeric('abc 123', true)).toBe(true)
      expect(isAlphanumeric('Test 123', true)).toBe(true)
    })

    it('should reject alphanumeric with spaces when not allowed', () => {
      expect(isAlphanumeric('abc 123', false)).toBe(false)
      expect(isAlphanumeric('abc 123')).toBe(false) // default is false
    })

    it('should reject text with special characters', () => {
      expect(isAlphanumeric('abc@123')).toBe(false)
      expect(isAlphanumeric('test-123')).toBe(false)
      expect(isAlphanumeric('test.123')).toBe(false)
    })

    it('should reject empty text', () => {
      expect(isAlphanumeric('')).toBe(false)
      expect(isAlphanumeric('   ')).toBe(false)
    })
  })
})
