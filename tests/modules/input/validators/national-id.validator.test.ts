/**
 * National ID Validator Tests (Egyptian)
 */

import {
  isValidNationalID,
  validateNationalIDWithInfo,
} from '../../../../src/modules/input/validators/national-id.validator.js'

describe('national ID Validator (Egyptian)', () => {
  // ==================== isValidNationalID ====================
  describe('isValidNationalID', () => {
    it('should accept valid Egyptian national IDs', () => {
      expect(isValidNationalID('29501011234567')).toBe(true) // 1995 = century 20
      expect(isValidNationalID('30001011234567')).toBe(true) // 2000 = century 21
      expect(isValidNationalID('29912311234567')).toBe(true) // December 31
      expect(isValidNationalID('30001010135678')).toBe(true) // Cairo governorate
    })

    it('should validate length (14 digits)', () => {
      expect(isValidNationalID('29501011234567')).toBe(true) // valid 14 digits
      expect(isValidNationalID('123456789')).toBe(false) // less than 14
      expect(isValidNationalID('123456789012345')).toBe(false) // more than 14
    })

    it('should reject invalid IDs', () => {
      expect(isValidNationalID('1234567890123A')).toBe(false) // contains letters
      expect(isValidNationalID('19501011234567')).toBe(false) // invalid century (starts with 1)
      expect(isValidNationalID('29513011234567')).toBe(false) // invalid month (13)
      expect(isValidNationalID('29501321234567')).toBe(false) // invalid day (32)
      expect(isValidNationalID('29501013612345')).toBe(false) // invalid governorate (36)
      expect(isValidNationalID('')).toBe(false)
      expect(isValidNationalID('   ')).toBe(false)
    })

    it('should validate date correctness', () => {
      expect(isValidNationalID('29501011234567')).toBe(true) // January 1, 1995
      expect(isValidNationalID('29512311234567')).toBe(true) // December 31, 1995
      expect(isValidNationalID('29500011234567')).toBe(false) // month 00
      expect(isValidNationalID('29501001234567')).toBe(false) // day 00
    })

    it('should validate century correctness', () => {
      expect(isValidNationalID('29501011234567')).toBe(true) // century 2 (1900-1999)
      expect(isValidNationalID('30001011234567')).toBe(true) // century 3 (2000-2099)
      expect(isValidNationalID('19501011234567')).toBe(false) // century 1 (invalid)
      expect(isValidNationalID('49501011234567')).toBe(false) // century 4 (invalid)
    })
  })

  // ==================== validateNationalIDWithInfo ====================
  describe('validateNationalIDWithInfo', () => {
    it('should return complete information for valid ID', () => {
      const result = validateNationalIDWithInfo('29501011234567')

      expect(result.isValid).toBe(true)
      expect(result.century).toBe(2)
      expect(result.year).toBe(95)
      expect(result.month).toBe(1)
      expect(result.day).toBe(1)
      expect(result.governorate).toBe(12)
      expect(result.gender).toBe('female') // sequence 3456 is even = female
      expect(result.birthDate).toBe('1995-01-01')
    })

    it('should determine gender correctly', () => {
      // odd sequence = male
      const male = validateNationalIDWithInfo('29501011234577') // 3457 is odd
      expect(male.gender).toBe('male')

      // even sequence = female
      const female = validateNationalIDWithInfo('29501011234568') // 3456 is even
      expect(female.gender).toBe('female')
    })

    it('should calculate birth date correctly', () => {
      // century 20 (1900-1999)
      const id1995 = validateNationalIDWithInfo('29506151234567')
      expect(id1995.birthDate).toBe('1995-06-15')

      // century 21 (2000-2099)
      const id2000 = validateNationalIDWithInfo('30003201234567')
      expect(id2000.birthDate).toBe('2000-03-20')
    })

    it('should reject invalid IDs', () => {
      const result = validateNationalIDWithInfo('invalid')

      expect(result.isValid).toBe(false)
      expect(result.century).toBeUndefined()
      expect(result.year).toBeUndefined()
      expect(result.month).toBeUndefined()
      expect(result.day).toBeUndefined()
      expect(result.governorate).toBeUndefined()
      expect(result.gender).toBeUndefined()
      expect(result.birthDate).toBeUndefined()
    })
  })
})
