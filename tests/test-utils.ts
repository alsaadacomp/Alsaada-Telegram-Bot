/**
 * Test Utilities and Helpers
 * Shared utilities for all tests
 */

import type { Context } from '#root/bot/context.js'
import type { User } from '@grammyjs/types'

/**
 * Create a mock Telegram user
 */
export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 123456789,
    is_bot: false,
    first_name: 'Test',
    last_name: 'User',
    username: 'testuser',
    language_code: 'ar',
    ...overrides,
  }
}

/**
 * Create a mock bot context
 */
export function createMockContext(overrides: Partial<Context> = {}): Partial<Context> {
  const user = createMockUser()
  
  return {
    from: user,
    chat: {
      id: user.id,
      type: 'private',
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    },
    message: {
      message_id: 1,
      date: Math.floor(Date.now() / 1000),
      chat: {
        id: user.id,
        type: 'private',
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
      },
      from: user,
      text: '/start',
    },
    reply: jest.fn().mockResolvedValue({ message_id: 2 }),
    replyWithPhoto: jest.fn().mockResolvedValue({ message_id: 3 }),
    replyWithDocument: jest.fn().mockResolvedValue({ message_id: 4 }),
    editMessageText: jest.fn().mockResolvedValue(true),
    deleteMessage: jest.fn().mockResolvedValue(true),
    answerCallbackQuery: jest.fn().mockResolvedValue(true),
    ...overrides,
  } as Partial<Context>
}

/**
 * Mock Prisma Client
 */
export function createMockPrisma() {
  return {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    branch: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    department: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    notification: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn((fn) => fn()),
    $disconnect: jest.fn(),
  }
}

/**
 * Wait for async operations
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Create a date offset from now
 */
export function dateOffset(days: number): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

/**
 * Generate random string
 */
export function randomString(length = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Generate random number in range
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Mock file upload
 */
export function createMockFile(name: string, size: number, type: string) {
  return {
    file_id: randomString(20),
    file_unique_id: randomString(10),
    file_name: name,
    file_size: size,
    mime_type: type,
  }
}

/**
 * Mock photo upload
 */
export function createMockPhoto(width = 1920, height = 1080) {
  return {
    file_id: randomString(20),
    file_unique_id: randomString(10),
    width,
    height,
    file_size: width * height * 3,
  }
}

/**
 * Assert error thrown
 */
export async function assertThrows(
  fn: () => Promise<any> | any,
  errorMessage?: string,
): Promise<void> {
  try {
    await fn()
    throw new Error('Expected function to throw')
  }
  catch (error: any) {
    if (errorMessage && !error.message.includes(errorMessage)) {
      throw new Error(`Expected error message to include "${errorMessage}", got "${error.message}"`)
    }
  }
}

/**
 * Create test employee data
 */
export function createTestEmployee(overrides: Record<string, any> = {}) {
  return {
    id: randomNumber(1, 10000),
    telegramId: randomNumber(100000000, 999999999),
    firstName: 'أحمد',
    lastName: 'محمد',
    firstNameEn: 'Ahmed',
    lastNameEn: 'Mohamed',
    nationalId: '29001011234567',
    phone: '01012345678',
    email: 'ahmed@example.com',
    companyId: 1,
    branchId: 1,
    departmentId: 1,
    positionId: 1,
    employmentStatus: 'ACTIVE',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Create test company data
 */
export function createTestCompany(overrides: Record<string, any> = {}) {
  return {
    id: randomNumber(1, 100),
    name: 'شركة السعادة',
    nameEn: 'Alsaada Company',
    commercialRegister: '1234567890',
    taxId: 'TAX123456',
    phone: '0221234567',
    email: 'info@alsaada.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

/**
 * Create test notification data
 */
export function createTestNotification(overrides: Record<string, any> = {}) {
  return {
    id: randomNumber(1, 10000),
    type: 'INFO',
    title: 'إشعار تجريبي',
    message: 'هذا إشعار تجريبي للاختبار',
    recipientId: randomNumber(100000000, 999999999),
    status: 'PENDING',
    priority: 'NORMAL',
    createdAt: new Date(),
    scheduledAt: new Date(),
    ...overrides,
  }
}
