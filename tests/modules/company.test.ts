import { describe, expect, it, jest } from '@jest/globals'

import { BranchService } from '../../src/modules/company/branch-service.js'
import { CompanyService } from '../../src/modules/company/company-service.js'
import { ProjectService } from '../../src/modules/company/project-service.js'

// Mock dependencies
jest.mock('../../src/modules/database/index.js', () => ({
  Database: {
    connect: jest.fn().mockResolvedValue(undefined),
    disconnect: jest.fn().mockResolvedValue(undefined),
    prisma: {
      company: {
        create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Company' }),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Company' }),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
      },
      branch: {
        create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Branch' }),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Branch' }),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
      },
      project: {
        create: jest.fn().mockResolvedValue({ id: 1, name: 'Test Project' }),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({ id: 1, name: 'Updated Project' }),
        delete: jest.fn().mockResolvedValue({ id: 1 }),
      },
    },
  },
}))

jest.mock('../../src/modules/services/logger/index.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

jest.mock('../../src/config.js', () => ({
  config: {
    debug: false,
    logLevel: 'error',
    botToken: '123456789:test-token-for-testing',
    botAllowedUpdates: [],
    botAdmins: [],
    superAdminId: 1,
    botMode: 'polling',
    isDebug: false,
    isWebhookMode: false,
    isPollingMode: true,
  },
}))

describe('Company Management Services', () => {
  describe('CompanyService', () => {
    it('should be defined', () => {
      expect(CompanyService).toBeDefined()
    })

    it('should have basic structure', () => {
      expect(typeof CompanyService).toBe('function')
    })
  })

  describe('BranchService', () => {
    it('should be defined', () => {
      expect(BranchService).toBeDefined()
    })

    it('should have basic structure', () => {
      expect(typeof BranchService).toBe('function')
    })
  })

  describe('ProjectService', () => {
    it('should be defined', () => {
      expect(ProjectService).toBeDefined()
    })

    it('should have basic structure', () => {
      expect(typeof ProjectService).toBe('function')
    })
  })
})
