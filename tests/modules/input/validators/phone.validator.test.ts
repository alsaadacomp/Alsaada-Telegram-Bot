/**
 * Phone Validator Tests (Egyptian)
 */

import {
  isValidEgyptPhone,
  isValidInternationalPhone,
  validateEgyptPhoneWithInfo,
} from '../../../../src/modules/input/validators/phone.validator.js'

describe('phone Validator (Egyptian)', () => {
  // ==================== isValidEgyptPhone ====================
  describe('isValidEgyptPhone', () => {
    it('should accept valid Egyptian mobile numbers', () => {
      expect(isValidEgyptPhone('01012345678')).toBe(true)
      expect(isValidEgyptPhone('01112345678')).toBe(true)
      expect(isValidEgyptPhone('01212345678')).toBe(true)
      expect(isValidEgyptPhone('01512345678')).toBe(true)
    })

    it('should accept numbers with spaces and dashes', () => {
      expect(isValidEgyptPhone('010 1234 5678')).toBe(true)
      expect(isValidEgyptPhone('010-1234-5678')).toBe(true)
      expect(isValidEgyptPhone('010 12345678')).toBe(true)
    })

    it('should accept numbers with country code', () => {
      expect(isValidEgyptPhone('+201012345678')).toBe(true)
      expect(isValidEgyptPhone('00201012345678')).toBe(true)
    })

    it('should reject invalid numbers', () => {
      expect(isValidEgyptPhone('0212345678')).toBe(false) // doesn't start with 01
      expect(isValidEgyptPhone('010123456')).toBe(false) // less than 11 digits
      expect(isValidEgyptPhone('0101234567890')).toBe(false) // more than 11 digits
      expect(isValidEgyptPhone('01A12345678')).toBe(false) // contains letters
      expect(isValidEgyptPhone('01312345678')).toBe(false) // invalid operator code
      expect(isValidEgyptPhone('')).toBe(false)
      expect(isValidEgyptPhone('invalid')).toBe(false)
    })
  })

  // ==================== validateEgyptPhoneWithInfo ====================
  describe('validateEgyptPhoneWithInfo', () => {
    it('should return complete information for valid number', () => {
      const result = validateEgyptPhoneWithInfo('01012345678')
      expect(result.isValid).toBe(true)
      expect(result.formatted).toBe('01012345678')
      expect(result.international).toBe('+201012345678')
      expect(result.operator).toBe('Vodafone')
    })

    it('should recognize all network operators', () => {
      const vodafone = validateEgyptPhoneWithInfo('01012345678')
      expect(vodafone.operator).toBe('Vodafone')

      const etisalat = validateEgyptPhoneWithInfo('01112345678')
      expect(etisalat.operator).toBe('Etisalat')

      const orange = validateEgyptPhoneWithInfo('01212345678')
      expect(orange.operator).toBe('Orange')

      const we = validateEgyptPhoneWithInfo('01512345678')
      expect(we.operator).toBe('WE (We Telecom Egypt)')
    })

    it('should reject invalid numbers', () => {
      const result = validateEgyptPhoneWithInfo('invalid')
      expect(result.isValid).toBe(false)
      expect(result.formatted).toBeUndefined()
      expect(result.international).toBeUndefined()
      expect(result.operator).toBeUndefined()
    })
  })

  // ==================== isValidInternationalPhone ====================
  describe('isValidInternationalPhone', () => {
    it('should accept valid international numbers', () => {
      expect(isValidInternationalPhone('+201012345678')).toBe(true) // Egypt
      expect(isValidInternationalPhone('+966501234567')).toBe(true) // Saudi Arabia
      expect(isValidInternationalPhone('+971501234567')).toBe(true) // UAE
      expect(isValidInternationalPhone('+12025551234')).toBe(true) // USA
    })

    it('should accept numbers with spaces and dashes', () => {
      expect(isValidInternationalPhone('+20 10 1234 5678')).toBe(true)
      expect(isValidInternationalPhone('+20-10-1234-5678')).toBe(true)
    })

    it('should reject invalid numbers', () => {
      expect(isValidInternationalPhone('01012345678')).toBe(false) // without +
      expect(isValidInternationalPhone('+20')).toBe(false) // too short
      expect(isValidInternationalPhone('123')).toBe(false) // without +
      expect(isValidInternationalPhone('+')).toBe(false) // + only
      expect(isValidInternationalPhone('')).toBe(false)
    })
  })
})
