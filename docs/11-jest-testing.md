# Jest Testing Documentation

## 📋 Overview

This project uses **Jest** as the testing framework for unit testing all validators and modules. Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

---

## 🎯 What Was Accomplished

### ✅ Jest Setup & Configuration

1. **Installed Dependencies**
   ```bash
   npm install -D jest @types/jest ts-jest
   ```

2. **Created Jest Configuration** (`jest.config.cjs`)
   - Configured for TypeScript support with `ts-jest`
   - Set up ES Module support
   - Configured path mappings for `#root/*` imports
   - Set up coverage collection
   - Enabled verbose output

3. **Updated package.json Scripts**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

---

## 📂 Test Structure

```
tests/
├── modules/
│   └── input/
│       └── validators/
│           ├── number.validator.test.ts       (23 tests)
│           ├── phone.validator.test.ts        (10 tests)
│           └── national-id.validator.test.ts  (9 tests)
└── [other test files...]
```

---

## 🧪 Test Suites

### 1. Number Validator Tests (23 Tests)

**File:** `tests/modules/input/validators/number.validator.test.ts`

**Functions Tested:**
- `isValidNumber` - Validates if input is a valid number
- `isInteger` - Checks if number is an integer
- `isDecimal` - Validates decimal numbers
- `isPositiveNumber` - Checks for positive numbers
- `isNegativeNumber` - Checks for negative numbers
- `isInRange` - Validates number is within range
- `isBetween` - Checks if number is between two values
- `isEven` - Validates even numbers
- `isOdd` - Validates odd numbers
- `isNaturalNumber` - Checks for natural numbers
- `isPercentage` - Validates percentages (0-100)
- `toNumber` - Converts string to number
- `toInteger` - Converts to integer
- `roundToDecimal` - Rounds to specified decimal places

**Test Coverage:**
- Valid inputs (integers, decimals, negative numbers)
- Invalid inputs (strings, empty values, special characters)
- Edge cases (zero, boundary values)
- Conversion functions with error handling

---

### 2. Phone Validator Tests (10 Tests)

**File:** `tests/modules/input/validators/phone.validator.test.ts`

**Functions Tested:**
- `isValidEgyptPhone` - Validates Egyptian mobile numbers
- `validateEgyptPhoneWithInfo` - Returns detailed phone info
- `isValidInternationalPhone` - Validates international phone numbers

**Test Coverage:**
- Valid Egyptian mobile numbers (11 digits starting with 01)
- Numbers with spaces and dashes
- Numbers with country code (+20 or 0020)
- Network operator detection (Vodafone, Etisalat, Orange, WE)
- International phone numbers with various country codes
- Invalid formats and edge cases

**Supported Network Operators:**
- Vodafone (010)
- Etisalat (011)
- Orange (012)
- WE - We Telecom Egypt (015)

---

### 3. National ID Validator Tests (9 Tests)

**File:** `tests/modules/input/validators/national-id.validator.test.ts`

**Functions Tested:**
- `isValidNationalID` - Validates Egyptian National ID
- `validateNationalIDWithInfo` - Extracts detailed ID information

**Test Coverage:**
- Valid 14-digit Egyptian National IDs
- Length validation
- Century validation (2 for 1900-1999, 3 for 2000-2099)
- Birth date validation (year, month, day)
- Governorate code validation (01-35)
- Gender determination (odd sequence = male, even = female)
- Birth date calculation and formatting
- Invalid IDs and error cases

**ID Structure:**
```
Position:  1  2-3  4-5  6-7  8-9  10-14
Format:    C  YY   MM   DD   GG   SSSSS
           │   │    │    │    │     └─ Sequence number (odd=male, even=female)
           │   │    │    │    └─────── Governorate code (01-35)
           │   │    │    └──────────── Day of birth (01-31)
           │   │    └───────────────── Month of birth (01-12)
           │   └────────────────────── Year of birth (00-99)
           └────────────────────────── Century (2=1900s, 3=2000s)
```

---

## 🚀 Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage Report
```bash
npm run test:coverage
```

### Run Specific Test File
```bash
npm test number.validator.test
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should validate"
```

---

## 📊 Test Results Summary

```
Test Suites: 3 passed, 3 total
Tests:       42 passed, 42 total
Snapshots:   0 total
Time:        ~6s
Coverage:    Available with npm run test:coverage
```

**Test Breakdown:**
- ✅ Number Validator: 23/23 tests passed (100%)
- ✅ Phone Validator: 10/10 tests passed (100%)
- ✅ National ID Validator: 9/9 tests passed (100%)

---

## 🎨 Jest Configuration Details

**File:** `jest.config.cjs`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      useESM: true,
    }],
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^#root/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
}
```

**Key Configuration Options:**
- **preset:** Uses `ts-jest` for TypeScript support
- **testEnvironment:** Node.js environment for backend testing
- **roots:** Test files located in `tests/` directory
- **testMatch:** Matches files ending with `.test.ts` or `.spec.ts`
- **transform:** TypeScript transformation with ESM support
- **moduleNameMapper:** Resolves path aliases and `.js` extensions
- **collectCoverageFrom:** Includes all source files except type definitions
- **verbose:** Displays detailed test results

---

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { functionToTest } from '../../../../src/path/to/module.js'

describe('Module Name', () => {
  describe('functionToTest', () => {
    test('should describe expected behavior', () => {
      // Arrange
      const input = 'test value'

      // Act
      const result = functionToTest(input)

      // Assert
      expect(result).toBe(expectedValue)
    })
  })
})
```

### Common Jest Matchers

```typescript
// Equality
expect(value).toBe(expected) // Strict equality (===)
expect(value).toEqual(expected) // Deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()
expect(value).toBeDefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeGreaterThanOrEqual(3.5)
expect(value).toBeLessThan(5)
expect(value).toBeLessThanOrEqual(4.5)
expect(value).toBeCloseTo(0.3, 5) // Floating point comparison

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toMatchObject({ key: 'value' })

// Exceptions
expect(() => {
  throw new Error('error')
}).toThrow()
expect(() => {
  throw new Error('error')
}).toThrow('error')
```

---

## 🎯 Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use clear, descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)

### 2. Test Coverage
- Test happy paths (valid inputs)
- Test error cases (invalid inputs)
- Test edge cases (boundary values, empty values)
- Test error handling

### 3. Test Independence
- Each test should be independent
- Don't rely on test execution order
- Clean up after tests if needed

### 4. Meaningful Assertions
- Use specific matchers for better error messages
- Test one thing per test
- Avoid testing implementation details

### 5. Test Naming
- Use "should" in test descriptions
- Be specific about what is being tested
- Include the expected outcome

**Good Examples:**
```typescript
test('should return true for valid phone number')
test('should reject numbers shorter than 11 digits')
test('should format phone number with country code')
```

**Bad Examples:**
```typescript
test('phone test')
test('works')
test('test 1')
```

---

## 🔧 Troubleshooting

### Issue: Tests Not Running

**Solution:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: ES Module Errors

**Solution:** Ensure `jest.config.cjs` uses `.cjs` extension (not `.js`) when package.json has `"type": "module"`

### Issue: Path Resolution Errors

**Solution:** Check `moduleNameMapper` in jest.config.cjs matches your tsconfig.json paths

---

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [Jest Matchers](https://jestjs.io/docs/expect)
- [Testing Best Practices](https://jestjs.io/docs/testing-best-practices)

---

## 🔄 Migration from Custom Test Framework

### What Changed

1. **Test Framework:** Migrated from custom `TestSuite` to Jest
2. **Assertions:** Changed from custom assertions to Jest matchers
3. **Test Runner:** Changed from manual runner to Jest CLI
4. **Configuration:** Centralized in `jest.config.cjs`

### Before (Custom Framework)
```typescript
import { assertFalse, assertTrue, TestSuite } from '../../../test-helper.js'

const suite = new TestSuite('Number Validator')

suite.test('يقبل الأرقام الصحيحة', () => {
  assertTrue(isValidNumber('123'))
})

export default suite
```

### After (Jest)
```typescript
describe('Number Validator', () => {
  test('should accept valid integers', () => {
    expect(isValidNumber('123')).toBe(true)
  })
})
```

### Removed Files
- `tests/test-helper.ts` - Custom test helpers (replaced by Jest)
- `tests/run-tests.ts` - Manual test runner (replaced by Jest CLI)

---

## ✅ Summary

Jest testing is now fully integrated into the project with:
- ✅ 42 comprehensive tests across 3 test suites
- ✅ 100% test pass rate
- ✅ English-only test output for clarity
- ✅ Easy-to-use npm scripts
- ✅ Coverage reporting capability
- ✅ Watch mode for development
- ✅ TypeScript support with ts-jest
- ✅ ES Module compatibility

The testing infrastructure is production-ready and follows industry best practices.

---

**Last Updated:** October 2025
**Test Framework Version:** Jest 29.x
**Total Tests:** 42
**Test Success Rate:** 100%
