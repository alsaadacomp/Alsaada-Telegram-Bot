# 🧪 Complete Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [Test Structure](#test-structure)
3. [Test Categories](#test-categories)
4. [Writing Tests](#writing-tests)
5. [Test Utilities](#test-utilities)
6. [Best Practices](#best-practices)
7. [CI/CD Integration](#cicd-integration)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This project has a comprehensive testing system with **1070+ tests** covering:
- ✅ Unit Tests (901 tests)
- ✅ Integration Tests (78 tests)
- ✅ E2E Tests (40 tests)
- ✅ Performance Tests (33 tests)

**Test Coverage:** 85%+ | **Success Rate:** 100%

---

## Test Structure

```
tests/
├── test-utils.ts                    # Shared test utilities
├── modules/                         # Unit tests (901 tests)
│   ├── input/validators/            # Input validation tests
│   ├── notifications/               # Notification system tests
│   ├── analytics/                   # Analytics tests
│   └── interaction/                 # UI interaction tests
├── integration/                     # Integration tests (78 tests)
│   ├── company-integration.test.ts
│   ├── employee-integration.test.ts
│   ├── notification-integration.test.ts
│   └── permission-integration.test.ts
├── e2e/                            # End-to-end tests (40 tests)
│   ├── employee-registration.test.ts
│   ├── admin-panel.test.ts
│   └── workflow.test.ts
└── performance/                    # Performance tests (33 tests)
    ├── database-performance.test.ts
    └── bot-performance.test.ts
```

---

## Test Categories

### 1. Unit Tests (`tests/modules/`)

**Purpose:** Test individual functions and classes in isolation.

**Coverage:**
- ✅ Input Validators (294 tests)
- ✅ Notification System (145 tests)
- ✅ Analytics & Reports (101 tests)
- ✅ Forms & Interactions (361 tests)

**Example:**
```typescript
describe('Email Validator', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
  })
})
```

### 2. Integration Tests (`tests/integration/`)

**Purpose:** Test how different modules work together.

**Coverage:**
- ✅ Company Management (15 tests)
- ✅ Employee Management (20 tests)
- ✅ Notification System (25 tests)
- ✅ Permission System (18 tests)

**Example:**
```typescript
describe('Employee Integration', () => {
  it('should load employee with relations', async () => {
    const employee = await prisma.employee.findUnique({
      where: { id: 1 },
      include: { company: true, department: true }
    })
    expect(employee.company).toBeDefined()
  })
})
```

### 3. E2E Tests (`tests/e2e/`)

**Purpose:** Test complete user workflows from start to finish.

**Coverage:**
- ✅ Employee Registration Flow (12 tests)
- ✅ Admin Panel Workflow (28 tests)

**Example:**
```typescript
describe('Employee Registration E2E', () => {
  it('should complete full registration', async () => {
    // Step 1: Start command
    // Step 2: Enter data
    // Step 3: Submit
    // Step 4: Verify
  })
})
```

### 4. Performance Tests (`tests/performance/`)

**Purpose:** Ensure system performs well under load.

**Coverage:**
- ✅ Database Performance (18 tests)
- ✅ Bot Response Performance (15 tests)

**Example:**
```typescript
describe('Database Performance', () => {
  it('should handle 1000 records quickly', async () => {
    const start = Date.now()
    await prisma.employee.findMany({ take: 1000 })
    expect(Date.now() - start).toBeLessThan(1000)
  })
})
```

---

## Writing Tests

### Basic Test Template

```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockPrisma, createTestEmployee } from '../test-utils.js'

describe('Feature Name', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    jest.clearAllMocks()
  })

  describe('Functionality', () => {
    it('should do something', async () => {
      // Arrange
      const data = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(data)

      // Act
      const result = await mockPrisma.employee.create({ data })

      // Assert
      expect(result).toBeDefined()
      expect(result.firstName).toBe('أحمد')
    })
  })
})
```

### Test Structure (AAA Pattern)

1. **Arrange:** Set up test data and mocks
2. **Act:** Execute the code being tested
3. **Assert:** Verify the results

```typescript
it('should create employee', async () => {
  // Arrange
  const employee = createTestEmployee()
  mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

  // Act
  const created = await mockPrisma.employee.create({ data: employee })

  // Assert
  expect(created.id).toBeDefined()
  expect(created.firstName).toBe('أحمد')
})
```

---

## Test Utilities

### Available Utilities (`test-utils.ts`)

#### 1. Mock Context
```typescript
const mockContext = createMockContext({
  from: { id: 123456789 }
})

await mockContext.reply?.('Hello')
expect(mockContext.reply).toHaveBeenCalled()
```

#### 2. Mock Prisma
```typescript
const mockPrisma = createMockPrisma()

mockPrisma.employee.findMany = jest.fn().mockResolvedValue([])
const results = await mockPrisma.employee.findMany()
```

#### 3. Test Data Generators
```typescript
const employee = createTestEmployee({
  firstName: 'Custom Name',
  role: 'ADMIN'
})

const company = createTestCompany({
  name: 'شركة مخصصة'
})

const notification = createTestNotification({
  type: 'URGENT',
  priority: 'HIGH'
})
```

#### 4. Helper Functions
```typescript
// Wait for async operations
await wait(1000)

// Date manipulation
const futureDate = dateOffset(7) // 7 days from now
const pastDate = dateOffset(-7) // 7 days ago

// Random data
const randomStr = randomString(10)
const randomNum = randomNumber(1, 100)

// Mock files
const file = createMockFile('document.pdf', 1024, 'application/pdf')
const photo = createMockPhoto(1920, 1080)
```

---

## Best Practices

### 1. Test Naming
✅ **Good:**
```typescript
it('should return true for valid Egyptian phone number')
it('should throw error when employee not found')
```

❌ **Bad:**
```typescript
it('test phone')
it('employee test')
```

### 2. One Assertion Per Concept
```typescript
// ✅ Good - focused test
it('should create employee', () => {
  expect(employee).toBeDefined()
  expect(employee.id).toBeGreaterThan(0)
})

it('should validate employee data', () => {
  expect(employee.nationalId).toHaveLength(14)
  expect(employee.phone).toMatch(/^01[0-2,5]\d{8}$/)
})
```

### 3. Use Descriptive Variables
```typescript
// ✅ Good
const validEgyptianPhone = '01012345678'
const invalidShortPhone = '123'

// ❌ Bad
const phone1 = '01012345678'
const phone2 = '123'
```

### 4. Test Edge Cases
```typescript
describe('Age Validation', () => {
  it('should accept valid age', () => {
    expect(isValidAge(25)).toBe(true)
  })

  it('should reject negative age', () => {
    expect(isValidAge(-1)).toBe(false)
  })

  it('should reject age over 150', () => {
    expect(isValidAge(151)).toBe(false)
  })

  it('should accept boundary ages', () => {
    expect(isValidAge(0)).toBe(true)
    expect(isValidAge(150)).toBe(true)
  })
})
```

### 5. Clean Up After Tests
```typescript
afterEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

---

## CI/CD Integration

### GitHub Actions Example

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
          
      - name: Install dependencies
        run: npm install
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type checking
        run: npm run typecheck
        
      - name: Run tests
        run: npm test
        
      - name: Run tests with coverage
        run: npm run test:coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

### Pre-commit Hook

```json
// package.json
{
  "lint-staged": {
    "*.ts": [
      "eslint",
      "npm test -- --findRelatedTests --passWithNoTests"
    ]
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Not Running
```bash
# Clear Jest cache
npm test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 2. Import Errors
Ensure imports use `.js` extension:
```typescript
// ❌ Wrong
import { fn } from './module'

// ✅ Correct
import { fn } from './module.js'
```

#### 3. Async Test Timeout
```typescript
// Increase timeout for slow tests
it('slow operation', async () => {
  // test code
}, 10000) // 10 second timeout
```

#### 4. Mock Not Working
```typescript
// Clear mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
})
```

### Debugging Tests

```bash
# Run specific test file
npm test -- employee-integration.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should create employee"

# Run in verbose mode
npm test -- --verbose

# Run with debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Coverage Reports

### Generate Coverage
```bash
npm run test:coverage
```

### View Coverage
```bash
# HTML report
open coverage/lcov-report/index.html

# Terminal summary
npm test -- --coverage --coverageReporters=text
```

### Coverage Thresholds
```javascript
// jest.config.cjs
module.exports = {
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
}
```

---

## Performance Testing Tips

### 1. Measure Execution Time
```typescript
it('should complete quickly', async () => {
  const start = Date.now()
  await someOperation()
  const duration = Date.now() - start
  expect(duration).toBeLessThan(1000)
})
```

### 2. Test Memory Usage
```typescript
it('should not leak memory', async () => {
  const before = process.memoryUsage().heapUsed
  await largeOperation()
  const after = process.memoryUsage().heapUsed
  const increase = after - before
  expect(increase).toBeLessThan(50 * 1024 * 1024) // 50MB
})
```

### 3. Concurrent Testing
```typescript
it('should handle concurrent requests', async () => {
  const promises = Array.from({ length: 100 }, () => 
    performRequest()
  )
  await Promise.all(promises)
})
```

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Project Test README](./README.md)

---

**Last Updated:** 2025-01-25
**Test Count:** 1070+
**Coverage:** 85%+
