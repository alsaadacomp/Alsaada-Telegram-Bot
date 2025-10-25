# 🤝 Contributing to Tests

## Adding New Tests

### 1. Choose Test Category

Determine which category your test belongs to:

- **Unit Test** (`tests/modules/`) - Testing individual functions
- **Integration Test** (`tests/integration/`) - Testing module interactions
- **E2E Test** (`tests/e2e/`) - Testing complete workflows
- **Performance Test** (`tests/performance/`) - Testing performance

### 2. Create Test File

Follow naming conventions:
```
Unit:        feature-name.test.ts
Integration: feature-integration.test.ts
E2E:         workflow-name.test.ts
Performance: feature-performance.test.ts
```

### 3. Use Test Template

```typescript
import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockPrisma, createTestEmployee } from '../test-utils.js'

describe('Feature Name', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Functionality Group', () => {
    it('should describe expected behavior', async () => {
      // Arrange
      const testData = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(testData)

      // Act
      const result = await mockPrisma.employee.create({ data: testData })

      // Assert
      expect(result).toBeDefined()
      expect(result.firstName).toBe('أحمد')
    })

    it('should handle error cases', async () => {
      // Arrange
      mockPrisma.employee.create = jest.fn().mockRejectedValue(
        new Error('Creation failed')
      )

      // Act & Assert
      await expect(
        mockPrisma.employee.create({ data: {} })
      ).rejects.toThrow('Creation failed')
    })
  })
})
```

### 4. Run Your Tests

```bash
# Run your new test file
npm test -- path/to/your-test.test.ts

# Run in watch mode while developing
npm run test:watch -- path/to/your-test.test.ts
```

### 5. Check Coverage

```bash
npm run test:coverage
```

Ensure your tests maintain or improve coverage.

## Test Checklist

Before submitting your tests, ensure:

- [ ] Tests follow AAA pattern (Arrange-Act-Assert)
- [ ] Test names are descriptive
- [ ] Edge cases are covered
- [ ] Tests are independent (no shared state)
- [ ] Mocks are properly cleaned up
- [ ] All tests pass
- [ ] Coverage is maintained or improved
- [ ] Performance benchmarks included (if applicable)
- [ ] Documentation updated (if needed)

## Common Patterns

### Testing Async Operations

```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction()
  expect(result).toBeDefined()
})
```

### Testing Errors

```typescript
it('should throw error on invalid input', async () => {
  await expect(functionThatThrows()).rejects.toThrow('Error message')
})
```

### Testing with Mocks

```typescript
it('should call dependency', async () => {
  const mockFn = jest.fn().mockResolvedValue('result')
  await functionUsingMock(mockFn)
  expect(mockFn).toHaveBeenCalledWith(expectedArgs)
})
```

### Testing Database Operations

```typescript
it('should create record', async () => {
  const data = createTestEmployee()
  mockPrisma.employee.create = jest.fn().mockResolvedValue(data)
  
  const result = await mockPrisma.employee.create({ data })
  
  expect(result).toEqual(data)
  expect(mockPrisma.employee.create).toHaveBeenCalledTimes(1)
})
```

### Testing Performance

```typescript
it('should complete within time limit', async () => {
  const start = Date.now()
  await performOperation()
  const duration = Date.now() - start
  
  expect(duration).toBeLessThan(1000) // 1 second
})
```

## Using Test Utilities

### Mock Context

```typescript
const ctx = createMockContext({
  from: { id: 123456789, first_name: 'Test' }
})

await ctx.reply?.('Message')
expect(ctx.reply).toHaveBeenCalledWith('Message')
```

### Mock Prisma

```typescript
const prisma = createMockPrisma()

prisma.employee.findUnique = jest.fn().mockResolvedValue(employee)
const result = await prisma.employee.findUnique({ where: { id: 1 } })
```

### Test Data Generators

```typescript
// Default values
const employee = createTestEmployee()

// Custom values
const admin = createTestEmployee({
  role: 'ADMIN',
  firstName: 'Custom Name'
})

// Multiple records
const employees = Array.from({ length: 10 }, (_, i) => 
  createTestEmployee({ id: i + 1 })
)
```

### Helper Functions

```typescript
// Wait for operations
await wait(1000)

// Date manipulation
const tomorrow = dateOffset(1)
const yesterday = dateOffset(-1)

// Random data
const id = randomString(10)
const num = randomNumber(1, 100)

// Mock files
const file = createMockFile('test.pdf', 1024, 'application/pdf')
const photo = createMockPhoto(1920, 1080)
```

## Testing Best Practices

### 1. Test Isolation

```typescript
// ✅ Good - Each test is independent
describe('Feature', () => {
  let data
  
  beforeEach(() => {
    data = createTestData()
  })
  
  it('test 1', () => {
    // Uses fresh data
  })
  
  it('test 2', () => {
    // Uses fresh data
  })
})
```

### 2. Descriptive Names

```typescript
// ✅ Good
it('should return true for valid Egyptian phone number')
it('should throw error when employee not found')

// ❌ Bad
it('phone test')
it('error test')
```

### 3. One Concept Per Test

```typescript
// ✅ Good - Tests one thing
it('should create employee', async () => {
  const result = await createEmployee(data)
  expect(result).toBeDefined()
})

it('should validate employee data', () => {
  expect(isValid(data)).toBe(true)
})

// ❌ Bad - Tests multiple things
it('should create and validate employee', async () => {
  const result = await createEmployee(data)
  expect(result).toBeDefined()
  expect(isValid(result)).toBe(true)
})
```

### 4. Clear Assertions

```typescript
// ✅ Good - Clear what's being tested
expect(result.firstName).toBe('أحمد')
expect(result.nationalId).toHaveLength(14)

// ❌ Bad - Unclear
expect(result).toBeTruthy()
```

### 5. Test Edge Cases

```typescript
describe('Age Validation', () => {
  it('should accept valid age', () => {
    expect(isValidAge(25)).toBe(true)
  })
  
  it('should reject negative age', () => {
    expect(isValidAge(-1)).toBe(false)
  })
  
  it('should accept boundary values', () => {
    expect(isValidAge(0)).toBe(true)
    expect(isValidAge(150)).toBe(true)
  })
  
  it('should reject out of range', () => {
    expect(isValidAge(151)).toBe(false)
  })
})
```

## Code Review Checklist

When reviewing test code:

- [ ] Tests are well-named and descriptive
- [ ] Tests follow AAA pattern
- [ ] Edge cases are covered
- [ ] No flaky tests (random failures)
- [ ] No test interdependencies
- [ ] Proper mock cleanup
- [ ] Performance considerations
- [ ] Documentation updated
- [ ] Coverage maintained/improved

## Getting Help

- Check [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed guide
- Review existing test examples
- Ask in project discussions
- Consult [Jest documentation](https://jestjs.io/)

## Example Contributions

### Adding Unit Test

```typescript
// tests/modules/feature/new-feature.test.ts
import { describe, expect, it } from '@jest/globals'
import { newFeature } from '#root/modules/feature/new-feature.js'

describe('New Feature', () => {
  it('should work correctly', () => {
    const result = newFeature('input')
    expect(result).toBe('expected output')
  })
})
```

### Adding Integration Test

```typescript
// tests/integration/new-feature-integration.test.ts
import { describe, expect, it, beforeEach } from '@jest/globals'
import { createMockPrisma } from '../test-utils.js'

describe('New Feature Integration', () => {
  let mockPrisma
  
  beforeEach(() => {
    mockPrisma = createMockPrisma()
  })
  
  it('should integrate with database', async () => {
    mockPrisma.model.create = jest.fn().mockResolvedValue({ id: 1 })
    const result = await mockPrisma.model.create({ data: {} })
    expect(result.id).toBe(1)
  })
})
```

---

**Happy Testing! 🧪**
