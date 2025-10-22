/**
 * Email Validator Tests
 */

import {
  extractDomain,
  extractUsername,
  isEmailFromDomain,
  isEmailNotBlocked,
  isValidEmail,
  normalizeEmail,
  validateEmailList,
} from '../../../../src/modules/input/validators/email.validator.js'

describe('email Validator', () => {
  // ==================== isValidEmail ====================
  describe('isValidEmail', () => {
    it('should accept valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@domain.com')).toBe(true)
      expect(isValidEmail('user_name@domain.com')).toBe(true)
      expect(isValidEmail('user-name@domain.com')).toBe(true)
      expect(isValidEmail('123@domain.com')).toBe(true)
    })

    it('should accept emails with subdomains', () => {
      expect(isValidEmail('user@sub.domain.com')).toBe(true)
      expect(isValidEmail('user@mail.sub.domain.com')).toBe(true)
    })

    it('should reject emails without @ symbol', () => {
      expect(isValidEmail('invalid')).toBe(false)
      expect(isValidEmail('invalid.com')).toBe(false)
      expect(isValidEmail('user.domain.com')).toBe(false)
    })

    it('should reject emails without username', () => {
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
    })

    it('should reject emails without domain', () => {
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
    })

    it('should reject emails with spaces', () => {
      expect(isValidEmail('test @example.com')).toBe(false)
      expect(isValidEmail('test@ example.com')).toBe(false)
      expect(isValidEmail('test @exam ple.com')).toBe(false)
    })

    it('should reject emails with multiple @ symbols', () => {
      expect(isValidEmail('test@@example.com')).toBe(false)
      expect(isValidEmail('test@domain@example.com')).toBe(false)
    })

    it('should reject emails starting or ending with dot', () => {
      expect(isValidEmail('.test@example.com')).toBe(false)
      expect(isValidEmail('test.@example.com')).toBe(false)
      expect(isValidEmail('test@.example.com')).toBe(false)
      expect(isValidEmail('test@example.com.')).toBe(false)
    })

    it('should reject emails with consecutive dots', () => {
      expect(isValidEmail('test..name@example.com')).toBe(false)
      expect(isValidEmail('test@example..com')).toBe(false)
    })

    it('should reject emails without domain extension', () => {
      expect(isValidEmail('test@domain')).toBe(false)
      expect(isValidEmail('test@localhost')).toBe(false)
    })

    it('should reject emails with numeric TLD', () => {
      expect(isValidEmail('test@domain.123')).toBe(false)
    })

    it('should reject empty or invalid inputs', () => {
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('   ')).toBe(false)
      expect(isValidEmail(null as any)).toBe(false)
      expect(isValidEmail(undefined as any)).toBe(false)
    })

    it('should trim and validate emails with whitespace', () => {
      expect(isValidEmail('  test@example.com  ')).toBe(true)
    })
  })

  // ==================== validateEmailList ====================
  describe('validateEmailList', () => {
    it('should separate valid and invalid emails', () => {
      const result = validateEmailList([
        'test@example.com',
        'invalid',
        'user@domain.com',
        'bad@',
        'good@test.co.uk',
      ])

      expect(result.valid).toHaveLength(3)
      expect(result.invalid).toHaveLength(2)
      expect(result.valid).toContain('test@example.com')
      expect(result.valid).toContain('user@domain.com')
      expect(result.valid).toContain('good@test.co.uk')
      expect(result.invalid).toContain('invalid')
      expect(result.invalid).toContain('bad@')
    })

    it('should handle empty array', () => {
      const result = validateEmailList([])
      expect(result.valid).toHaveLength(0)
      expect(result.invalid).toHaveLength(0)
    })

    it('should handle array with all valid emails', () => {
      const result = validateEmailList([
        'test1@example.com',
        'test2@example.com',
        'test3@example.com',
      ])

      expect(result.valid).toHaveLength(3)
      expect(result.invalid).toHaveLength(0)
    })

    it('should handle array with all invalid emails', () => {
      const result = validateEmailList([
        'invalid1',
        'invalid2@',
        '@invalid3',
      ])

      expect(result.valid).toHaveLength(0)
      expect(result.invalid).toHaveLength(3)
    })
  })

  // ==================== extractUsername ====================
  describe('extractUsername', () => {
    it('should extract username from valid email', () => {
      expect(extractUsername('test@example.com')).toBe('test')
      expect(extractUsername('user.name@domain.com')).toBe('user.name')
      expect(extractUsername('user+tag@domain.com')).toBe('user+tag')
    })

    it('should return null for invalid email', () => {
      expect(extractUsername('invalid')).toBeNull()
      expect(extractUsername('@domain.com')).toBeNull()
      expect(extractUsername('test@')).toBeNull()
    })

    it('should handle emails with whitespace', () => {
      expect(extractUsername('  test@example.com  ')).toBe('test')
    })
  })

  // ==================== extractDomain ====================
  describe('extractDomain', () => {
    it('should extract domain from valid email', () => {
      expect(extractDomain('test@example.com')).toBe('example.com')
      expect(extractDomain('user@subdomain.example.com')).toBe('subdomain.example.com')
      expect(extractDomain('test@mail.google.com')).toBe('mail.google.com')
    })

    it('should return null for invalid email', () => {
      expect(extractDomain('invalid')).toBeNull()
      expect(extractDomain('@domain.com')).toBeNull()
      expect(extractDomain('test@')).toBeNull()
    })

    it('should handle emails with whitespace', () => {
      expect(extractDomain('  test@example.com  ')).toBe('example.com')
    })
  })

  // ==================== isEmailFromDomain ====================
  describe('isEmailFromDomain', () => {
    it('should accept email from allowed domain', () => {
      expect(isEmailFromDomain('test@gmail.com', ['gmail.com', 'yahoo.com'])).toBe(true)
      expect(isEmailFromDomain('user@yahoo.com', ['gmail.com', 'yahoo.com'])).toBe(true)
    })

    it('should reject email from non-allowed domain', () => {
      expect(isEmailFromDomain('test@outlook.com', ['gmail.com', 'yahoo.com'])).toBe(false)
      expect(isEmailFromDomain('user@test.com', ['gmail.com', 'yahoo.com'])).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(isEmailFromDomain('test@GMAIL.COM', ['gmail.com'])).toBe(true)
      expect(isEmailFromDomain('test@gmail.com', ['GMAIL.COM'])).toBe(true)
    })

    it('should return false for invalid email', () => {
      expect(isEmailFromDomain('invalid', ['gmail.com'])).toBe(false)
    })

    it('should handle empty allowed domains list', () => {
      expect(isEmailFromDomain('test@gmail.com', [])).toBe(false)
    })
  })

  // ==================== isEmailNotBlocked ====================
  describe('isEmailNotBlocked', () => {
    it('should accept email from non-blocked domain', () => {
      expect(isEmailNotBlocked('test@gmail.com', ['tempmail.com'])).toBe(true)
      expect(isEmailNotBlocked('user@yahoo.com', ['tempmail.com', 'disposable.com'])).toBe(true)
    })

    it('should reject email from blocked domain', () => {
      expect(isEmailNotBlocked('test@tempmail.com', ['tempmail.com'])).toBe(false)
      expect(isEmailNotBlocked('user@disposable.com', ['tempmail.com', 'disposable.com'])).toBe(false)
    })

    it('should be case-insensitive', () => {
      expect(isEmailNotBlocked('test@TEMPMAIL.COM', ['tempmail.com'])).toBe(false)
      expect(isEmailNotBlocked('test@tempmail.com', ['TEMPMAIL.COM'])).toBe(false)
    })

    it('should return false for invalid email', () => {
      expect(isEmailNotBlocked('invalid', ['tempmail.com'])).toBe(false)
    })

    it('should handle empty blocked domains list', () => {
      expect(isEmailNotBlocked('test@gmail.com', [])).toBe(true)
    })
  })

  // ==================== normalizeEmail ====================
  describe('normalizeEmail', () => {
    it('should normalize email to lowercase', () => {
      expect(normalizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com')
      expect(normalizeEmail('User@Domain.Com')).toBe('user@domain.com')
    })

    it('should trim whitespace', () => {
      expect(normalizeEmail('  test@example.com  ')).toBe('test@example.com')
    })

    it('should return null for invalid email', () => {
      expect(normalizeEmail('invalid')).toBeNull()
      expect(normalizeEmail('@domain.com')).toBeNull()
      expect(normalizeEmail('test@')).toBeNull()
    })

    it('should handle already normalized emails', () => {
      expect(normalizeEmail('test@example.com')).toBe('test@example.com')
    })
  })
})
