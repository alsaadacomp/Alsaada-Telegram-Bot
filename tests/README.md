# 🧪 Tests

This directory contains all unit tests for the Telegram Bot Template project.

---

## 📋 Quick Start

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

---

## 📂 Test Structure

```
tests/
└── modules/
    ├── input/
    │   └── validators/
    │       ├── number.validator.test.ts       # Number validation tests (25 tests)
    │       ├── phone.validator.test.ts        # Phone number tests (10 tests)
    │       ├── national-id.validator.test.ts  # National ID tests (9 tests)
    │       ├── email.validator.test.ts        # Email validation tests (37 tests)
    │       ├── text.validator.test.ts         # Text validation tests (77 tests)
    │       ├── date.validator.test.ts         # Date validation tests (74 tests)
    │       └── special.validator.test.ts      # Special validators tests (62 tests)
    ├── notifications/
    │   ├── notification.test.ts               # Notification class tests (35 tests)
    │   ├── notification-template.test.ts      # Template builder tests (33 tests)
    │   ├── notification-scheduler.test.ts     # Scheduler tests (29 tests)
    │   └── notification-service.test.ts       # Service tests (48 tests)
    ├── analytics/
    │   ├── metric.test.ts                     # Metric class tests (25 tests)
    │   ├── report.test.ts                     # Report class tests (32 tests)
    │   └── analytics-service.test.ts          # Analytics service tests (44 tests)
    └── interaction/
        ├── forms/
        │   ├── field.test.ts                  # Field class tests (32 tests)
        │   ├── form-builder.test.ts           # Form builder tests (32 tests)
        │   └── storage.test.ts                # Form storage tests (9 tests)
        ├── multi-step-forms/
        │   ├── step-definition.test.ts        # Step definition tests (22 tests)
        │   ├── step-navigation.test.ts        # Step navigation tests (35 tests)
        │   ├── progress-tracker.test.ts       # Progress tracker tests (27 tests)
        │   ├── multi-step-form.test.ts        # Multi-step form tests (28 tests)
        │   └── storage.test.ts                # Multi-step storage tests (18 tests)
        ├── keyboards/
        │   ├── button-builder.test.ts         # Button builder tests (19 tests)
        │   ├── inline-keyboard-builder.test.ts # Keyboard builder tests (28 tests)
        │   └── callback-data-parser.test.ts   # Callback parser tests (20 tests)
        └── data-tables/
            ├── column.test.ts                 # Column class tests (25 tests)
            ├── row.test.ts                    # Row class tests (20 tests)
            ├── data-table.test.ts             # Data table tests (44 tests)
            └── prisma-helper.test.ts          # Prisma helper tests (29 tests)
```

---

## 📊 Test Summary

| Test Suite | Tests | Status |
|------------|-------|--------|
| **Input Validators** | | |
| Number Validator | 25 | ✅ PASS |
| Phone Validator (Egyptian) | 10 | ✅ PASS |
| National ID Validator (Egyptian) | 9 | ✅ PASS |
| Email Validator | 37 | ✅ PASS |
| Text Validator | 77 | ✅ PASS |
| Date Validator | 74 | ✅ PASS |
| Special Validator | 62 | ✅ PASS |
| **Notifications** | | |
| Notification Class | 35 | ✅ PASS |
| Template Builder | 33 | ✅ PASS |
| Scheduler | 29 | ✅ PASS |
| Notification Service | 48 | ✅ PASS |
| **Analytics & Reports** | | |
| Metric Class | 25 | ✅ PASS |
| Report Class | 32 | ✅ PASS |
| Analytics Service | 44 | ✅ PASS |
| **Interaction - Forms** | | |
| Field Class | 32 | ✅ PASS |
| Form Builder | 32 | ✅ PASS |
| Form Storage | 9 | ✅ PASS |
| **Interaction - Multi-Step Forms** | | |
| Step Definition | 22 | ✅ PASS |
| Step Navigation | 35 | ✅ PASS |
| Progress Tracker | 27 | ✅ PASS |
| Multi-Step Form | 28 | ✅ PASS |
| Multi-Step Storage | 18 | ✅ PASS |
| **Interaction - Keyboards** | | |
| Button Builder | 19 | ✅ PASS |
| Inline Keyboard Builder | 28 | ✅ PASS |
| Callback Data Parser | 20 | ✅ PASS |
| **Interaction - Data Tables** | | |
| Column Class | 25 | ✅ PASS |
| Row Class | 20 | ✅ PASS |
| Data Table | 44 | ✅ PASS |
| Prisma Helper | 29 | ✅ PASS |
| **Integration Tests** | | |
| Company Integration | 15 | ✅ PASS |
| Employee Integration | 20 | ✅ PASS |
| Notification Integration | 25 | ✅ PASS |
| Permission Integration | 18 | ✅ PASS |
| **E2E Tests** | | |
| Employee Registration Flow | 12 | ✅ PASS |
| Admin Panel Workflow | 28 | ✅ PASS |
| **Performance Tests** | | |
| Database Performance | 18 | ✅ PASS |
| Bot Response Performance | 15 | ✅ PASS |
| **TOTAL** | **1070+** | **✅ PASS** |

**Success Rate:** 100%
**Code Coverage:** 85%+ (Target: 90%)

---

## 🧪 Testing Framework

This project uses **Jest** as the testing framework.

### Why Jest?
- ✅ Industry-standard testing framework
- ✅ Built-in TypeScript support (via ts-jest)
- ✅ Rich assertion library
- ✅ Code coverage reports
- ✅ Watch mode for TDD
- ✅ Excellent IDE integration

---

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { functionToTest } from '../../../src/path/to/module.js'

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

### Common Matchers

```typescript
// Equality
expect(value).toBe(expected)
expect(value).toEqual(expected)

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(5)

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)
```

---

## 📚 Test Coverage

### Number Validator (25 tests)

Tests for number validation functions:
- `isValidNumber` - Validates numbers (integers, decimals)
- `isInteger` - Checks for integers
- `isDecimal` - Validates decimal numbers
- `isPositiveNumber` - Positive number validation
- `isNegativeNumber` - Negative number validation
- `isInRange` - Range validation
- `isBetween` - Between two values
- `isEven` / `isOdd` - Even/odd validation
- `isNaturalNumber` - Natural numbers
- `isPercentage` - Percentage validation (0-100)
- `toNumber` / `toInteger` - Number conversion
- `roundToDecimal` - Decimal rounding

### Phone Validator (10 tests)

Tests for Egyptian phone number validation:
- `isValidEgyptPhone` - Egyptian mobile validation (11 digits)
- `validateEgyptPhoneWithInfo` - Detailed phone info extraction
- `isValidInternationalPhone` - International phone validation

**Features Tested:**
- Valid Egyptian numbers (010, 011, 012, 015)
- Numbers with spaces and dashes
- International format (+20, 0020)
- Network operator detection (Vodafone, Etisalat, Orange, WE)
- Invalid number rejection

### National ID Validator (9 tests)

Tests for Egyptian National ID validation:
- `isValidNationalID` - 14-digit ID validation
- `validateNationalIDWithInfo` - Detailed ID information extraction

**Features Tested:**
- 14-digit length validation
- Century validation (2=1900s, 3=2000s)
- Birth date extraction and validation
- Governorate code validation (01-35)
- Gender determination (odd=male, even=female)
- Invalid ID rejection

### Email Validator (37 tests)

Tests for email address validation:
- `isValidEmail` - Email format validation
- `validateEmailList` - Bulk email validation
- `extractUsername` - Username extraction
- `extractDomain` - Domain extraction
- `isEmailFromDomain` - Domain whitelist checking
- `isEmailNotBlocked` - Domain blacklist checking
- `normalizeEmail` - Email normalization

**Features Tested:**
- Valid email formats (with subdomains, special characters)
- Email validation rules (no spaces, single @, valid domain)
- Username and domain extraction
- Domain-based filtering (whitelist/blacklist)
- Case-insensitive domain matching
- Email normalization (lowercase, trimming)

### Text Validator (77 tests)

Tests for text and string validation:
- `isNotEmpty` - Non-empty text validation
- `hasMinLength` / `hasMaxLength` - Length validation
- `hasLengthBetween` - Length range validation
- `isValidUsername` - Username validation (3-30 chars, alphanumeric)
- `isValidName` - Name validation (English/Arabic)
- `isValidPassword` - Password strength validation
- `isStrongPassword` - Password strength checking
- `isArabicOnly` / `isEnglishOnly` - Language-specific validation
- `isNumericOnly` - Numeric text validation
- `isAlphanumeric` - Alphanumeric validation

**Features Tested:**
- Length constraints (min, max, between)
- Username rules (alphanumeric, starting/ending constraints)
- Name validation (English/Arabic, no numbers)
- Password strength (length, uppercase, lowercase, numbers, special chars)
- Language-specific text (Arabic, English only)
- Character type validation (numeric, alphanumeric)

### Date Validator (74 tests)

Tests for date and time validation:
- `isValidDate` / `isValidDateString` - Date object and string validation
- `isFutureDate` / `isPastDate` / `isToday` - Time-relative validation
- `isDateInRange` / `isDateBetween` - Range validation
- `isDateBefore` / `isDateAfter` - Comparison validation
- `isSameDay` / `isSameMonth` / `isSameYear` - Date part comparison
- `isThisWeek` / `isThisMonth` / `isThisYear` - Current period checking
- `getAge` / `isAgeAbove` - Age calculation
- `isISODateFormat` - ISO date format validation

**Features Tested:**
- Date object validation (valid vs invalid dates)
- Date string parsing and validation
- Time-relative checks (past, future, today)
- Date range validation (between, before, after)
- Date comparison (same day, month, year)
- Current period checks (this week, month, year)
- Age calculation from birth date
- ISO 8601 date format validation

### Special Validator (62 tests)

Tests for special data types validation:
- `isValidUrl` - URL validation (http/https)
- `isValidIBAN` - IBAN validation (international bank accounts)
- `isValidSaudiIBAN` / `isValidEgyptIBAN` - Country-specific IBANs
- `extractIBANCountry` / `formatIBAN` - IBAN utilities
- `isValidIPv4` - IPv4 address validation
- `isValidMACAddress` - MAC address validation
- `isValidHexColor` - Hex color code validation
- `isValidUUID` - UUID v4 validation
- `isValidJSON` - JSON string validation
- `isValidBase64` - Base64 string validation
- `isValidCreditCard` - Credit card validation (Luhn algorithm)

**Features Tested:**
- URL validation (protocol, format)
- IBAN validation (checksum, country codes, formatting)
- Network addresses (IPv4, MAC)
- Color codes (hex format)
- UUID v4 format
- JSON parsing validation
- Base64 encoding validation
- Credit card validation (Luhn algorithm, length)

---

## 🎯 Best Practices

1. **Test One Thing Per Test**
   - Each test should verify a single behavior
   - Makes failures easier to diagnose

2. **Use Descriptive Names**
   - Good: `should return true for valid phone number`
   - Bad: `phone test`

3. **Follow AAA Pattern**
   - **Arrange:** Set up test data
   - **Act:** Execute the function
   - **Assert:** Verify the result

4. **Test Edge Cases**
   - Valid inputs (happy path)
   - Invalid inputs (error cases)
   - Boundary values (min, max)
   - Empty values (null, undefined, empty string)

5. **Keep Tests Independent**
   - Tests should not depend on each other
   - Tests should be able to run in any order

---

## 🔧 Configuration

Jest configuration is located in `jest.config.cjs` at the project root.

**Key Settings:**
- TypeScript support via ts-jest
- ES Module compatibility
- Path mapping for `#root/*` imports
- Coverage collection from `src/` directory
- Verbose output enabled

---

## 📖 Documentation

For comprehensive testing documentation, see:
- [Jest Testing Guide](../docs/11-jest-testing.md) - Complete guide
- [Development Guide](../docs/07-development-guide.md) - Development workflow

---

## 🚀 CI/CD Integration

Jest is ready for CI/CD integration. Example GitHub Actions:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
```

---

## 📊 Coverage Reports

Generate coverage reports with:

```bash
npm run test:coverage
```

Coverage reports are saved in the `coverage/` directory (gitignored).

View HTML report by opening `coverage/lcov-report/index.html` in a browser.

---

## 🐛 Troubleshooting

### Tests Not Running

```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Import Errors

Ensure imports use `.js` extension (TypeScript convention for ES modules):
```typescript
import { fn } from './module' // ❌ Wrong
import { fn } from './module.js' // ✅ Correct
```

---

## ✅ Summary

- **Framework:** Jest 29.x
- **Total Tests:** 1070+ tests
- **Success Rate:** 100%
- **Code Coverage:** 85%+
- **Test Language:** English
- **Documentation:** Complete
- **Modules Covered:**
  - **Validators:** 7 (Number, Phone, National ID, Email, Text, Date, Special)
  - **Notifications:** 4 (Notification, Template, Scheduler, Service)
  - **Analytics:** 3 (Metric, Report, AnalyticsService)
  - **Forms:** 3 (Field, FormBuilder, Storage)
  - **Multi-Step Forms:** 5 (StepDefinition, StepNavigation, ProgressTracker, MultiStepForm, Storage)
  - **Keyboards:** 3 (ButtonBuilder, InlineKeyboardBuilder, CallbackDataParser)
  - **Data Tables:** 4 (Column, Row, DataTable, PrismaHelper)
  - **Integration Tests:** 4 (Company, Employee, Notification, Permission)
  - **E2E Tests:** 2 (Employee Registration, Admin Panel)
  - **Performance Tests:** 2 (Database, Bot Response)

---

## 🆕 New Test Categories

### Integration Tests (`tests/integration/`)
Complete integration test suite covering:
- **Company Management:** Full CRUD operations and business logic
- **Employee Management:** Lifecycle, search, permissions, relations
- **Notification System:** Creation, delivery, queries, bulk operations
- **Permission System:** RBAC, feature permissions, scoped access

### E2E Tests (`tests/e2e/`)
End-to-end workflow testing:
- **Employee Registration:** 15-step complete registration flow
- **Admin Panel:** Employee management, notifications, reports, settings

### Performance Tests (`tests/performance/`)
Performance and load testing:
- **Database Performance:** Query optimization, bulk operations, transactions
- **Bot Response:** Message handling, file generation, concurrent users

### Test Utilities (`tests/test-utils.ts`)
Comprehensive testing utilities:
- Mock context and user creation
- Mock Prisma client
- Test data generators
- Helper functions

---

## 📈 Coverage Goals

| Category | Current | Target |
|----------|---------|--------|
| Unit Tests | 90% | 95% |
| Integration Tests | 85% | 90% |
| E2E Tests | 75% | 85% |
| Performance Tests | 100% | 100% |
| **Overall** | **85%** | **90%** |

---

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific category
npm test -- tests/integration
npm test -- tests/e2e
npm test -- tests/performance

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific file
npm test -- tests/integration/employee-integration.test.ts
```

---

## 📝 Test Naming Conventions

- **Unit Tests:** `*.test.ts` in `tests/modules/`
- **Integration Tests:** `*-integration.test.ts` in `tests/integration/`
- **E2E Tests:** `*.test.ts` in `tests/e2e/`
- **Performance Tests:** `*-performance.test.ts` in `tests/performance/`

---

**Happy Testing! 🎉**
