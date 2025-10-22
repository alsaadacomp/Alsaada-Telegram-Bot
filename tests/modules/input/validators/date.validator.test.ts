/**
 * Date Validator Tests
 */

import {
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
} from '../../../../src/modules/input/validators/date.validator.js'

describe('date Validator', () => {
  // ==================== isValidDate ====================
  describe('isValidDate', () => {
    it('should accept valid Date objects', () => {
      expect(isValidDate(new Date())).toBe(true)
      expect(isValidDate(new Date('2025-01-18'))).toBe(true)
      expect(isValidDate(new Date(2025, 0, 18))).toBe(true)
    })

    it('should reject invalid Date objects', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false)
      expect(isValidDate(new Date('not a date'))).toBe(false)
    })

    it('should reject non-Date objects', () => {
      expect(isValidDate('2025-01-18' as any)).toBe(false)
      expect(isValidDate(123456789 as any)).toBe(false)
      expect(isValidDate(null as any)).toBe(false)
      expect(isValidDate(undefined as any)).toBe(false)
    })
  })

  // ==================== isValidDateString ====================
  describe('isValidDateString', () => {
    it('should accept valid date strings', () => {
      expect(isValidDateString('2025-01-18')).toBe(true)
      expect(isValidDateString('01/18/2025')).toBe(true)
      expect(isValidDateString('Jan 18, 2025')).toBe(true)
    })

    it('should reject invalid date strings', () => {
      expect(isValidDateString('invalid')).toBe(false)
      expect(isValidDateString('not a date')).toBe(false)
      expect(isValidDateString('2025-13-01')).toBe(false) // invalid month
      expect(isValidDateString('2025-01-32')).toBe(false) // invalid day
    })

    it('should reject empty or null strings', () => {
      expect(isValidDateString('')).toBe(false)
      expect(isValidDateString('   ')).toBe(false)
      expect(isValidDateString(null as any)).toBe(false)
      expect(isValidDateString(undefined as any)).toBe(false)
    })

    it('should handle whitespace', () => {
      expect(isValidDateString('  2025-01-18  ')).toBe(true)
    })
  })

  // ==================== isFutureDate ====================
  describe('isFutureDate', () => {
    it('should accept future dates', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      expect(isFutureDate(futureDate)).toBe(true)
    })

    it('should reject past dates', () => {
      const pastDate = new Date('2020-01-01')
      expect(isFutureDate(pastDate)).toBe(false)
    })

    it('should reject current date', () => {
      const now = new Date()
      expect(isFutureDate(now)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isFutureDate(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isPastDate ====================
  describe('isPastDate', () => {
    it('should accept past dates', () => {
      const pastDate = new Date('2020-01-01')
      expect(isPastDate(pastDate)).toBe(true)
    })

    it('should reject future dates', () => {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)
      expect(isPastDate(futureDate)).toBe(false)
    })

    it('should reject current date', () => {
      const now = new Date()
      expect(isPastDate(now)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isPastDate(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isToday ====================
  describe('isToday', () => {
    it('should accept today\'s date', () => {
      const today = new Date()
      expect(isToday(today)).toBe(true)
    })

    it('should reject yesterday', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      expect(isToday(yesterday)).toBe(false)
    })

    it('should reject tomorrow', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      expect(isToday(tomorrow)).toBe(false)
    })

    it('should accept today with different time', () => {
      const todayMorning = new Date()
      todayMorning.setHours(8, 0, 0, 0)
      expect(isToday(todayMorning)).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isToday(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isDateInRange ====================
  describe('isDateInRange', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2025-12-31')
    const date = new Date('2023-06-15')

    it('should accept date in range', () => {
      expect(isDateInRange(date, start, end)).toBe(true)
    })

    it('should accept date at start boundary', () => {
      expect(isDateInRange(start, start, end)).toBe(true)
    })

    it('should accept date at end boundary', () => {
      expect(isDateInRange(end, start, end)).toBe(true)
    })

    it('should reject date before start', () => {
      const before = new Date('2019-12-31')
      expect(isDateInRange(before, start, end)).toBe(false)
    })

    it('should reject date after end', () => {
      const after = new Date('2026-01-01')
      expect(isDateInRange(after, start, end)).toBe(false)
    })

    it('should work with only start date', () => {
      expect(isDateInRange(date, start)).toBe(true)
    })

    it('should work with only end date', () => {
      expect(isDateInRange(date, undefined, end)).toBe(true)
    })

    it('should reject invalid dates', () => {
      expect(isDateInRange(new Date('invalid'), start, end)).toBe(false)
    })
  })

  // ==================== isDateBetween ====================
  describe('isDateBetween', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2025-12-31')

    it('should accept date between start and end', () => {
      const date = new Date('2023-06-15')
      expect(isDateBetween(date, start, end)).toBe(true)
    })

    it('should accept date at boundaries', () => {
      expect(isDateBetween(start, start, end)).toBe(true)
      expect(isDateBetween(end, start, end)).toBe(true)
    })

    it('should reject date outside range', () => {
      const before = new Date('2019-12-31')
      const after = new Date('2026-01-01')
      expect(isDateBetween(before, start, end)).toBe(false)
      expect(isDateBetween(after, start, end)).toBe(false)
    })
  })

  // ==================== isDateBefore ====================
  describe('isDateBefore', () => {
    const date1 = new Date('2020-01-01')
    const date2 = new Date('2025-01-01')

    it('should return true when date1 is before date2', () => {
      expect(isDateBefore(date1, date2)).toBe(true)
    })

    it('should return false when date1 is after date2', () => {
      expect(isDateBefore(date2, date1)).toBe(false)
    })

    it('should return false when dates are equal', () => {
      expect(isDateBefore(date1, date1)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isDateBefore(new Date('invalid'), date2)).toBe(false)
      expect(isDateBefore(date1, new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isDateAfter ====================
  describe('isDateAfter', () => {
    const date1 = new Date('2020-01-01')
    const date2 = new Date('2025-01-01')

    it('should return true when date1 is after date2', () => {
      expect(isDateAfter(date2, date1)).toBe(true)
    })

    it('should return false when date1 is before date2', () => {
      expect(isDateAfter(date1, date2)).toBe(false)
    })

    it('should return false when dates are equal', () => {
      expect(isDateAfter(date1, date1)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isDateAfter(new Date('invalid'), date2)).toBe(false)
      expect(isDateAfter(date1, new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isSameDay ====================
  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2025-01-18 10:00')
      const date2 = new Date('2025-01-18 15:00')
      expect(isSameDay(date1, date2)).toBe(true)
    })

    it('should return false for different days', () => {
      const date1 = new Date('2025-01-18')
      const date2 = new Date('2025-01-19')
      expect(isSameDay(date1, date2)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isSameDay(new Date('invalid'), new Date())).toBe(false)
    })
  })

  // ==================== isSameMonth ====================
  describe('isSameMonth', () => {
    it('should return true for same month', () => {
      const date1 = new Date('2025-01-10')
      const date2 = new Date('2025-01-20')
      expect(isSameMonth(date1, date2)).toBe(true)
    })

    it('should return false for different months', () => {
      const date1 = new Date('2025-01-10')
      const date2 = new Date('2025-02-10')
      expect(isSameMonth(date1, date2)).toBe(false)
    })

    it('should return false for same month but different year', () => {
      const date1 = new Date('2024-01-10')
      const date2 = new Date('2025-01-10')
      expect(isSameMonth(date1, date2)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isSameMonth(new Date('invalid'), new Date())).toBe(false)
    })
  })

  // ==================== isSameYear ====================
  describe('isSameYear', () => {
    it('should return true for same year', () => {
      const date1 = new Date('2025-01-10')
      const date2 = new Date('2025-12-20')
      expect(isSameYear(date1, date2)).toBe(true)
    })

    it('should return false for different years', () => {
      const date1 = new Date('2024-01-10')
      const date2 = new Date('2025-01-10')
      expect(isSameYear(date1, date2)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isSameYear(new Date('invalid'), new Date())).toBe(false)
    })
  })

  // ==================== isThisWeek ====================
  describe('isThisWeek', () => {
    it('should return true for current week', () => {
      const today = new Date()
      expect(isThisWeek(today)).toBe(true)
    })

    it('should return false for last week', () => {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 8)
      expect(isThisWeek(lastWeek)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isThisWeek(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isThisMonth ====================
  describe('isThisMonth', () => {
    it('should return true for current month', () => {
      const today = new Date()
      expect(isThisMonth(today)).toBe(true)
    })

    it('should return false for last month', () => {
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      expect(isThisMonth(lastMonth)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isThisMonth(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== isThisYear ====================
  describe('isThisYear', () => {
    it('should return true for current year', () => {
      const today = new Date()
      expect(isThisYear(today)).toBe(true)
    })

    it('should return false for last year', () => {
      const lastYear = new Date()
      lastYear.setFullYear(lastYear.getFullYear() - 1)
      expect(isThisYear(lastYear)).toBe(false)
    })

    it('should reject invalid dates', () => {
      expect(isThisYear(new Date('invalid'))).toBe(false)
    })
  })

  // ==================== getAge ====================
  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      expect(getAge(birthDate)).toBe(25)
    })

    it('should handle birthday not yet this year', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      birthDate.setMonth(birthDate.getMonth() + 1) // birthday next month
      expect(getAge(birthDate)).toBe(24)
    })

    it('should return null for invalid date', () => {
      expect(getAge(new Date('invalid'))).toBeNull()
    })
  })

  // ==================== isAgeAbove ====================
  describe('isAgeAbove', () => {
    it('should return true for age above minimum', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 25)
      expect(isAgeAbove(birthDate, 18)).toBe(true)
    })

    it('should return false for age below minimum', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 15)
      expect(isAgeAbove(birthDate, 18)).toBe(false)
    })

    it('should return true for age exactly at minimum', () => {
      const birthDate = new Date()
      birthDate.setFullYear(birthDate.getFullYear() - 18)
      expect(isAgeAbove(birthDate, 18)).toBe(true)
    })

    it('should return false for invalid date', () => {
      expect(isAgeAbove(new Date('invalid'), 18)).toBe(false)
    })
  })

  // ==================== isISODateFormat ====================
  describe('isISODateFormat', () => {
    it('should accept valid ISO date format', () => {
      expect(isISODateFormat('2025-01-18')).toBe(true)
      expect(isISODateFormat('2020-12-31')).toBe(true)
    })

    it('should reject non-ISO formats', () => {
      expect(isISODateFormat('18/01/2025')).toBe(false)
      expect(isISODateFormat('01-18-2025')).toBe(false)
      expect(isISODateFormat('Jan 18, 2025')).toBe(false)
    })

    it('should reject incomplete dates', () => {
      expect(isISODateFormat('2025-1-18')).toBe(false) // month not padded
      expect(isISODateFormat('2025-01-8')).toBe(false) // day not padded
    })

    it('should reject invalid dates in ISO format', () => {
      expect(isISODateFormat('2025-13-01')).toBe(false) // invalid month
      expect(isISODateFormat('2025-01-32')).toBe(false) // invalid day
    })

    it('should reject empty or null strings', () => {
      expect(isISODateFormat('')).toBe(false)
      expect(isISODateFormat('   ')).toBe(false)
      expect(isISODateFormat(null as any)).toBe(false)
    })

    it('should handle whitespace', () => {
      expect(isISODateFormat('  2025-01-18  ')).toBe(true)
    })
  })
})
