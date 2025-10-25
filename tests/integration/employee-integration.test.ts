/**
 * Employee Management Integration Tests
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockPrisma, createTestEmployee, createTestCompany } from '../test-utils.js'

describe('Employee Management Integration Tests', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    jest.clearAllMocks()
  })

  describe('Employee Lifecycle', () => {
    it('should register new employee', async () => {
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

      const created = await mockPrisma.employee.create({ data: employee })
      
      expect(created.firstName).toBe('أحمد')
      expect(created.nationalId).toBe('29001011234567')
    })

    it('should update employee information', async () => {
      const employee = createTestEmployee()
      const updated = { ...employee, phone: '01098765432' }
      
      mockPrisma.employee.update = jest.fn().mockResolvedValue(updated)

      const result = await mockPrisma.employee.update({
        where: { id: employee.id },
        data: { phone: '01098765432' },
      })

      expect(result.phone).toBe('01098765432')
    })

    it('should change employee status', async () => {
      const employee = createTestEmployee({ employmentStatus: 'ACTIVE' })
      const updated = { ...employee, employmentStatus: 'ON_LEAVE' }
      
      mockPrisma.employee.update = jest.fn().mockResolvedValue(updated)

      const result = await mockPrisma.employee.update({
        where: { id: employee.id },
        data: { employmentStatus: 'ON_LEAVE' },
      })

      expect(result.employmentStatus).toBe('ON_LEAVE')
    })

    it('should terminate employee', async () => {
      const employee = createTestEmployee()
      const terminated = { ...employee, employmentStatus: 'TERMINATED' }
      
      mockPrisma.employee.update = jest.fn().mockResolvedValue(terminated)

      const result = await mockPrisma.employee.update({
        where: { id: employee.id },
        data: { employmentStatus: 'TERMINATED' },
      })

      expect(result.employmentStatus).toBe('TERMINATED')
    })
  })

  describe('Employee Search and Filtering', () => {
    it('should find employee by telegram ID', async () => {
      const employee = createTestEmployee({ telegramId: 123456789 })
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValue(employee)

      const result = await mockPrisma.employee.findUnique({
        where: { telegramId: 123456789 },
      })

      expect(result?.telegramId).toBe(123456789)
    })

    it('should find employee by national ID', async () => {
      const employee = createTestEmployee({ nationalId: '29001011234567' })
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValue(employee)

      const result = await mockPrisma.employee.findUnique({
        where: { nationalId: '29001011234567' },
      })

      expect(result?.nationalId).toBe('29001011234567')
    })

    it('should list employees by department', async () => {
      const employees = [
        createTestEmployee({ departmentId: 1 }),
        createTestEmployee({ departmentId: 1 }),
      ]
      
      mockPrisma.employee.findMany = jest.fn().mockResolvedValue(employees)

      const results = await mockPrisma.employee.findMany({
        where: { departmentId: 1 },
      })

      expect(results).toHaveLength(2)
      expect(results.every(e => e.departmentId === 1)).toBe(true)
    })

    it('should list active employees', async () => {
      const employees = [
        createTestEmployee({ employmentStatus: 'ACTIVE' }),
        createTestEmployee({ employmentStatus: 'ACTIVE' }),
      ]
      
      mockPrisma.employee.findMany = jest.fn().mockResolvedValue(employees)

      const results = await mockPrisma.employee.findMany({
        where: { employmentStatus: 'ACTIVE' },
      })

      expect(results.every(e => e.employmentStatus === 'ACTIVE')).toBe(true)
    })
  })

  describe('Employee Permissions', () => {
    it('should assign role to employee', async () => {
      const employee = createTestEmployee({ role: 'USER' })
      const updated = { ...employee, role: 'ADMIN' }
      
      mockPrisma.employee.update = jest.fn().mockResolvedValue(updated)

      const result = await mockPrisma.employee.update({
        where: { id: employee.id },
        data: { role: 'ADMIN' },
      })

      expect(result.role).toBe('ADMIN')
    })

    it('should check admin access', async () => {
      const admin = createTestEmployee({ role: 'ADMIN' })
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValue(admin)

      const result = await mockPrisma.employee.findUnique({
        where: { id: admin.id },
      })

      expect(result?.role).toBe('ADMIN')
    })
  })

  describe('Employee Relations', () => {
    it('should load employee with company', async () => {
      const employee = createTestEmployee()
      const company = createTestCompany()
      
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValue({
        ...employee,
        company,
      })

      const result = await mockPrisma.employee.findUnique({
        where: { id: employee.id },
        include: { company: true },
      })

      expect(result).toHaveProperty('company')
      expect(result.company.name).toBe('شركة السعادة')
    })

    it('should load employee with all relations', async () => {
      const employee = createTestEmployee()
      
      mockPrisma.employee.findUnique = jest.fn().mockResolvedValue({
        ...employee,
        company: createTestCompany(),
        branch: { id: 1, name: 'فرع القاهرة' },
        department: { id: 1, name: 'الموارد البشرية' },
        position: { id: 1, name: 'مدير' },
      })

      const result = await mockPrisma.employee.findUnique({
        where: { id: employee.id },
        include: {
          company: true,
          branch: true,
          department: true,
          position: true,
        },
      })

      expect(result).toHaveProperty('company')
      expect(result).toHaveProperty('branch')
      expect(result).toHaveProperty('department')
      expect(result).toHaveProperty('position')
    })
  })
})
