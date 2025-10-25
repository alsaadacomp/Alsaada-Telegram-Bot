/**
 * Jest Setup File
 * Runs before all tests
 */

// Set test timeout
jest.setTimeout(30000) // 30 seconds

// Suppress console logs during tests (optional)
if (process.env.SUPPRESS_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    // Keep error for debugging
    error: console.error,
  }
}

// Add custom matchers (optional)
expect.extend({
  toBeWithinRange(received: number, floor: number, ceiling: number) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      }
    }
    else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      }
    }
  },
})

// Global test setup
beforeAll(() => {
  // Setup code that runs once before all tests
})

// Global test teardown
afterAll(() => {
  // Cleanup code that runs once after all tests
})
