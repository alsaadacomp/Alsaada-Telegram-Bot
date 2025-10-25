/**
 * Test Utilities Index
 * Export all test utilities for easy importing
 */

export {
  createMockUser,
  createMockContext,
  createMockPrisma,
  wait,
  dateOffset,
  randomString,
  randomNumber,
  createMockFile,
  createMockPhoto,
  assertThrows,
  createTestEmployee,
  createTestCompany,
  createTestNotification,
} from './test-utils.js'

// Re-export Jest globals for convenience
export {
  describe,
  it,
  test,
  expect,
  jest,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
} from '@jest/globals'
