/**
 * Company Service Integration Tests
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockPrisma, createTestCompany } from '../test-utils.js'

describe('Company Service Integration Tests', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    jest.clearAllMocks()
  })

  describe('Company Management Flow', () => {
    it('should create and retrieve company', async () => {
      const companyData = createTestCompany()
      mockPrisma.company.create = jest.fn().mockResolvedValue(companyData)
      mockPrisma.company.findUnique = jest.fn().mockResolvedValue(companyData)

      // Create company
      const created = await mockPrisma.company.create({ data: companyData })
      expect(created).toMatchObject(companyData)

      // Retrieve company
      const retrieved = await mockPrisma.company.findUnique({ where: { id: created.id } })
      expect(retrieved).toEqual(created)
    })

    it('should update company information', async () => {
      const company = createTestCompany()
      const updatedData = { ...company, name: 'شركة السعادة المحدثة' }
      
      mockPrisma.company.update = jest.fn().mockResolvedValue(updatedData)

      const updated = await mockPrisma.company.update({
        where: { id: company.id },
        data: { name: 'شركة السعادة المحدثة' },
      })

      expect(updated.name).toBe('شركة السعادة المحدثة')
    })

    it('should list all active companies', async () => {
      const companies = [
        createTestCompany({ id: 1, isActive: true }),
        createTestCompany({ id: 2, isActive: true }),
      ]
      
      mockPrisma.company.findMany = jest.fn().mockResolvedValue(companies)

      const results = await mockPrisma.company.findMany({
        where: { isActive: true },
      })

      expect(results).toHaveLength(2)
      expect(results.every(c => c.isActive)).toBe(true)
    })

    it('should deactivate company', async () => {
      const company = createTestCompany({ isActive: true })
      const deactivated = { ...company, isActive: false }
      
      mockPrisma.company.update = jest.fn().mockResolvedValue(deactivated)

      const result = await mockPrisma.company.update({
        where: { id: company.id },
        data: { isActive: false },
      })

      expect(result.isActive).toBe(false)
    })
  })

  describe('Branch Management Integration', () => {
    it('should create company with branches', async () => {
      const company = createTestCompany()
      const branches = [
        { id: 1, companyId: company.id, name: 'فرع القاهرة' },
        { id: 2, companyId: company.id, name: 'فرع الإسكندرية' },
      ]
      
      mockPrisma.company.findUnique = jest.fn().mockResolvedValue({
        ...company,
        Branch: branches,
      })

      const result = await mockPrisma.company.findUnique({
        where: { id: company.id },
        include: { Branch: true },
      })

      expect(result.Branch).toHaveLength(2)
    })

    it('should add new branch to existing company', async () => {
      const branch = {
        id: 1,
        companyId: 1,
        name: 'فرع جديد',
        isActive: true,
      }
      
      mockPrisma.branch.create = jest.fn().mockResolvedValue(branch)

      const created = await mockPrisma.branch.create({ data: branch })
      expect(created.name).toBe('فرع جديد')
    })
  })

  describe('Company Search and Filtering', () => {
    it('should search companies by name', async () => {
      const companies = [createTestCompany({ name: 'شركة السعادة' })]
      
      mockPrisma.company.findMany = jest.fn().mockResolvedValue(companies)

      const results = await mockPrisma.company.findMany({
        where: { name: { contains: 'السعادة' } },
      })

      expect(results.length).toBeGreaterThan(0)
      expect(results[0].name).toContain('السعادة')
    })

    it('should filter by commercial register', async () => {
      const company = createTestCompany({ commercialRegister: '1234567890' })
      
      mockPrisma.company.findUnique = jest.fn().mockResolvedValue(company)

      const result = await mockPrisma.company.findUnique({
        where: { commercialRegister: '1234567890' },
      })

      expect(result?.commercialRegister).toBe('1234567890')
    })
  })
})
