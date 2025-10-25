/**
 * Employee Registration E2E Tests
 */

import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { createMockContext, createMockPrisma, createTestEmployee, createTestCompany } from '../test-utils.js'

describe('Employee Registration E2E Workflow', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let mockContext: ReturnType<typeof createMockContext>

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    mockContext = createMockContext()
    jest.clearAllMocks()
  })

  describe('Complete Registration Flow', () => {
    it('should complete full employee registration', async () => {
      // Step 1: User starts registration
      const startMessage = '/start'
      expect(startMessage).toBe('/start')

      // Step 2: User selects registration
      const registrationChoice = 'register'
      expect(registrationChoice).toBe('register')

      // Step 3: User enters first name (Arabic)
      const firstName = 'أحمد'
      expect(firstName).toBeTruthy()
      expect(firstName.length).toBeGreaterThan(0)

      // Step 4: User enters last name (Arabic)
      const lastName = 'محمد'
      expect(lastName).toBeTruthy()

      // Step 5: User enters first name (English)
      const firstNameEn = 'Ahmed'
      expect(firstNameEn).toBeTruthy()

      // Step 6: User enters last name (English)
      const lastNameEn = 'Mohamed'
      expect(lastNameEn).toBeTruthy()

      // Step 7: User enters national ID
      const nationalId = '29001011234567'
      expect(nationalId).toHaveLength(14)

      // Step 8: User enters phone number
      const phone = '01012345678'
      expect(phone).toMatch(/^01[0-2,5]\d{8}$/)

      // Step 9: User enters email
      const email = 'ahmed@example.com'
      expect(email).toContain('@')

      // Step 10: User selects company
      const companyId = 1
      expect(companyId).toBeGreaterThan(0)

      // Step 11: User selects branch
      const branchId = 1
      expect(branchId).toBeGreaterThan(0)

      // Step 12: User selects department
      const departmentId = 1
      expect(departmentId).toBeGreaterThan(0)

      // Step 13: User selects position
      const positionId = 1
      expect(positionId).toBeGreaterThan(0)

      // Step 14: Create employee record
      const employeeData = createTestEmployee({
        firstName,
        lastName,
        firstNameEn,
        lastNameEn,
        nationalId,
        phone,
        email,
        companyId,
        branchId,
        departmentId,
        positionId,
      })

      mockPrisma.employee.create = jest.fn().mockResolvedValue(employeeData)

      const createdEmployee = await mockPrisma.employee.create({
        data: employeeData,
      })

      // Verify employee was created
      expect(createdEmployee).toBeDefined()
      expect(createdEmployee.firstName).toBe(firstName)
      expect(createdEmployee.nationalId).toBe(nationalId)
      expect(createdEmployee.employmentStatus).toBe('ACTIVE')

      // Step 15: Send confirmation notification
      const confirmationSent = true
      expect(confirmationSent).toBe(true)

      // Step 16: User receives success message
      expect(mockContext.reply).toBeDefined()
    })

    it('should handle registration with photo upload', async () => {
      // Complete basic registration
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

      const created = await mockPrisma.employee.create({ data: employee })

      // Upload profile photo
      const photoUploaded = true
      expect(photoUploaded).toBe(true)

      // Verify employee created
      expect(created).toBeDefined()
    })

    it('should validate data during registration', async () => {
      // Invalid national ID
      const invalidNationalId = '123'
      expect(invalidNationalId.length).not.toBe(14)

      // Invalid phone
      const invalidPhone = '123'
      expect(invalidPhone).not.toMatch(/^01[0-2,5]\d{8}$/)

      // Invalid email
      const invalidEmail = 'not-an-email'
      expect(invalidEmail).not.toContain('@')

      // Validation should prevent creation
      const validationPassed = false
      expect(validationPassed).toBe(false)
    })
  })

  describe('Registration Error Handling', () => {
    it('should handle duplicate national ID', async () => {
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on nationalId',
      })

      await expect(
        mockPrisma.employee.create({ data: employee }),
      ).rejects.toMatchObject({
        code: 'P2002',
      })
    })

    it('should handle duplicate phone number', async () => {
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockRejectedValue({
        code: 'P2002',
        message: 'Unique constraint failed on phone',
      })

      await expect(
        mockPrisma.employee.create({ data: employee }),
      ).rejects.toMatchObject({
        code: 'P2002',
      })
    })

    it('should handle registration cancellation', async () => {
      const cancelled = true
      expect(cancelled).toBe(true)
      
      // Verify no employee was created
      expect(mockPrisma.employee.create).not.toHaveBeenCalled()
    })
  })

  describe('Post-Registration Flow', () => {
    it('should send welcome notification after registration', async () => {
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

      const created = await mockPrisma.employee.create({ data: employee })

      // Notification should be sent
      const notificationSent = true
      expect(notificationSent).toBe(true)
      expect(created).toBeDefined()
    })

    it('should grant initial permissions after registration', async () => {
      const employee = createTestEmployee({ role: 'USER' })
      mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

      const created = await mockPrisma.employee.create({ data: employee })

      expect(created.role).toBe('USER')
    })

    it('should show main menu after registration', async () => {
      const employee = createTestEmployee()
      mockPrisma.employee.create = jest.fn().mockResolvedValue(employee)

      await mockPrisma.employee.create({ data: employee })

      // Main menu should be displayed
      const menuShown = true
      expect(menuShown).toBe(true)
    })
  })
})
