import { describe, expect, it, jest } from '@jest/globals'

import { ReportsService } from '../../src/modules/services/reports/index.js'

// Mock the database module
jest.mock('../../src/modules/database/index.js', () => ({
  Database: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    prisma: {
      user: {
        count: jest.fn().mockResolvedValue(10),
        groupBy: jest.fn().mockResolvedValue([{ role: 'USER', _count: { role: 7 } }, { role: 'ADMIN', _count: { role: 3 } }]),
        findMany: jest.fn().mockResolvedValue([]),
        findFirst: jest.fn().mockResolvedValue({ id: 1, role: 'ADMIN' }),
      },
      company: { count: jest.fn().mockResolvedValue(1) },
      branch: { count: jest.fn().mockResolvedValue(2) },
      project: { count: jest.fn().mockResolvedValue(3) },
      notification: {
        count: jest.fn().mockResolvedValue(4),
        findMany: jest.fn().mockResolvedValue([]),
      },
    },
  },
}))

// Mock the logger
jest.mock('../../src/modules/services/logger/index.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}))

describe('ReportsService', () => {
  it('should be defined', () => {
    expect(ReportsService).toBeDefined()
  })

  it('should have generateAnalyticsReport method', () => {
    expect(typeof ReportsService.generateAnalyticsReport).toBe('function')
  })

  it('should have getUserStatistics method', () => {
    expect(typeof ReportsService.getUserStatistics).toBe('function')
  })
})
