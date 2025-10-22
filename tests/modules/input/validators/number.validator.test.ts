/**
 * Number Validator Tests
 */

import {
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
} from '../../../../src/modules/input/validators/number.validator.js'

describe('number Validator', () => {
  // ==================== isValidNumber ====================
  describe('isValidNumber', () => {
    it('should accept valid integers', () => {
      expect(isValidNumber('123')).toBe(true)
      expect(isValidNumber('0')).toBe(true)
      expect(isValidNumber('-123')).toBe(true)
      expect(isValidNumber(123)).toBe(true)
    })

    it('should accept valid decimals', () => {
      expect(isValidNumber('123.45')).toBe(true)
      expect(isValidNumber('-123.45')).toBe(true)
      expect(isValidNumber('0.5')).toBe(true)
      expect(isValidNumber(123.45)).toBe(true)
    })

    it('should reject invalid values', () => {
      expect(isValidNumber('abc')).toBe(false)
      expect(isValidNumber('12.34.56')).toBe(false)
      expect(isValidNumber('')).toBe(false)
      expect(isValidNumber('  ')).toBe(false)
    })
  })

  // ==================== isInteger ====================
  describe('isInteger', () => {
    it('should accept valid integers', () => {
      expect(isInteger('123')).toBe(true)
      expect(isInteger('0')).toBe(true)
      expect(isInteger('-123')).toBe(true)
      expect(isInteger(100)).toBe(true)
    })

    it('should reject decimals', () => {
      expect(isInteger('123.45')).toBe(false)
      expect(isInteger('0.5')).toBe(false)
      expect(isInteger(123.45)).toBe(false)
    })
  })

  // ==================== isDecimal ====================
  describe('isDecimal', () => {
    it('should accept valid decimals', () => {
      expect(isDecimal('123.45')).toBe(true)
      expect(isDecimal('123')).toBe(true)
      expect(isDecimal(123.456)).toBe(true)
    })

    it('should validate decimal places count', () => {
      expect(isDecimal('123.45', 2)).toBe(true)
      expect(isDecimal('123.456', 2)).toBe(false)
      expect(isDecimal('123.45', 3)).toBe(true)
    })
  })

  // ==================== isPositiveNumber ====================
  describe('isPositiveNumber', () => {
    it('should accept positive numbers', () => {
      expect(isPositiveNumber('123')).toBe(true)
      expect(isPositiveNumber('0.1')).toBe(true)
      expect(isPositiveNumber(100)).toBe(true)
    })

    it('should reject zero and negative numbers', () => {
      expect(isPositiveNumber('0')).toBe(false)
      expect(isPositiveNumber('-123')).toBe(false)
      expect(isPositiveNumber(-10)).toBe(false)
    })
  })

  // ==================== isNegativeNumber ====================
  describe('isNegativeNumber', () => {
    it('should accept negative numbers', () => {
      expect(isNegativeNumber('-123')).toBe(true)
      expect(isNegativeNumber('-0.1')).toBe(true)
      expect(isNegativeNumber(-100)).toBe(true)
    })

    it('should reject zero and positive numbers', () => {
      expect(isNegativeNumber('0')).toBe(false)
      expect(isNegativeNumber('123')).toBe(false)
      expect(isNegativeNumber(10)).toBe(false)
    })
  })

  // ==================== isInRange ====================
  describe('isInRange', () => {
    it('should validate number range', () => {
      expect(isInRange('50', 0, 100)).toBe(true)
      expect(isInRange('0', 0, 100)).toBe(true)
      expect(isInRange('100', 0, 100)).toBe(true)
      expect(isInRange('150', 0, 100)).toBe(false)
      expect(isInRange('-10', 0, 100)).toBe(false)
    })

    it('should work with single boundary', () => {
      expect(isInRange('50', 0)).toBe(true)
      expect(isInRange('50', undefined, 100)).toBe(true)
    })
  })

  // ==================== isBetween ====================
  describe('isBetween', () => {
    it('should validate number is between two values', () => {
      expect(isBetween('50', 0, 100)).toBe(true)
      expect(isBetween('0', 0, 100)).toBe(true)
      expect(isBetween('100', 0, 100)).toBe(true)
      expect(isBetween('150', 0, 100)).toBe(false)
    })
  })

  // ==================== isEven ====================
  describe('isEven', () => {
    it('should validate even numbers', () => {
      expect(isEven('2')).toBe(true)
      expect(isEven('4')).toBe(true)
      expect(isEven('0')).toBe(true)
      expect(isEven('3')).toBe(false)
      expect(isEven('1')).toBe(false)
    })
  })

  // ==================== isOdd ====================
  describe('isOdd', () => {
    it('should validate odd numbers', () => {
      expect(isOdd('1')).toBe(true)
      expect(isOdd('3')).toBe(true)
      expect(isOdd('2')).toBe(false)
      expect(isOdd('0')).toBe(false)
    })
  })

  // ==================== isNaturalNumber ====================
  describe('isNaturalNumber', () => {
    it('should validate natural numbers', () => {
      expect(isNaturalNumber('1')).toBe(true)
      expect(isNaturalNumber('5')).toBe(true)
      expect(isNaturalNumber('0')).toBe(false)
      expect(isNaturalNumber('-1')).toBe(false)
    })

    it('should include zero when specified', () => {
      expect(isNaturalNumber('0', true)).toBe(true)
      expect(isNaturalNumber('1', true)).toBe(true)
      expect(isNaturalNumber('-1', true)).toBe(false)
    })
  })

  // ==================== isPercentage ====================
  describe('isPercentage', () => {
    it('should validate percentages', () => {
      expect(isPercentage('50')).toBe(true)
      expect(isPercentage('0')).toBe(true)
      expect(isPercentage('100')).toBe(true)
      expect(isPercentage('50.5')).toBe(true)
      expect(isPercentage('150')).toBe(false)
      expect(isPercentage('-10')).toBe(false)
    })

    it('should validate integer percentages only', () => {
      expect(isPercentage('50', false)).toBe(true)
      expect(isPercentage('50.5', false)).toBe(false)
    })
  })

  // ==================== toNumber ====================
  describe('toNumber', () => {
    it('should convert to number', () => {
      expect(toNumber('123')).toBe(123)
      expect(toNumber('123.45')).toBe(123.45)
      expect(toNumber('-123')).toBe(-123)
      expect(toNumber('abc')).toBeNull()
      expect(toNumber('')).toBeNull()
    })
  })

  // ==================== toInteger ====================
  describe('toInteger', () => {
    it('should convert to integer', () => {
      expect(toInteger('123')).toBe(123)
      expect(toInteger('123.45')).toBe(123)
      expect(toInteger('123.99')).toBe(123)
      expect(toInteger('abc')).toBeNull()
    })
  })

  // ==================== roundToDecimal ====================
  describe('roundToDecimal', () => {
    it('should round to decimal places', () => {
      expect(roundToDecimal('123.456', 2)).toBe(123.46)
      expect(roundToDecimal('123.454', 2)).toBe(123.45)
      expect(roundToDecimal('123.456')).toBe(123.46)
      expect(roundToDecimal('abc')).toBeNull()
    })
  })
})
