/**
 * Step Definition Tests
 * اختبارات تعريف الخطوة
 */

import type { StepConfig } from '../../../../src/modules/interaction/multi-step-forms/types.js'
import { describe, expect, test } from '@jest/globals'
import { FieldType } from '../../../../src/modules/interaction/forms/types.js'
import { StepDefinition } from '../../../../src/modules/interaction/multi-step-forms/core/step-definition.js'

describe('StepDefinition', () => {
  describe('Constructor', () => {
    test('should create step with basic configuration', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Personal Information',
        description: 'Enter your personal details',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)

      expect(step.id).toBe('step1')
      expect(step.title).toBe('Personal Information')
      expect(step.description).toBe('Enter your personal details')
      expect(step.fields).toHaveLength(1)
      expect(step.canSkip).toBe(false)
    })

    test('should create step with skippable option', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Optional Step',
        fields: [],
        canSkip: true,
      }

      const step = new StepDefinition(config)

      expect(step.canSkip).toBe(true)
    })

    test('should create fields from field configs', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Contact',
        fields: [
          {
            name: 'email',
            type: FieldType.EMAIL,
            label: 'Email',
            required: true,
          },
          {
            name: 'phone',
            type: FieldType.PHONE,
            label: 'Phone',
            required: false,
          },
        ],
      }

      const step = new StepDefinition(config)

      expect(step.fields).toHaveLength(2)
      expect(step.fields[0].getName()).toBe('email')
      expect(step.fields[1].getName()).toBe('phone')
    })
  })

  describe('shouldShow', () => {
    test('should return true when no condition is provided', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
      }

      const step = new StepDefinition(config)

      expect(step.shouldShow({})).toBe(true)
      expect(step.shouldShow({ any: 'data' })).toBe(true)
    })

    test('should return true when condition is met', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
        condition: data => data.age >= 18,
      }

      const step = new StepDefinition(config)

      expect(step.shouldShow({ age: 20 })).toBe(true)
      expect(step.shouldShow({ age: 18 })).toBe(true)
    })

    test('should return false when condition is not met', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
        condition: data => data.age >= 18,
      }

      const step = new StepDefinition(config)

      expect(step.shouldShow({ age: 17 })).toBe(false)
      expect(step.shouldShow({ age: 0 })).toBe(false)
    })
  })

  describe('validate', () => {
    test('should validate required field', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)

      const validResult = await step.validate({ name: 'John' })
      expect(validResult.isValid).toBe(true)

      const invalidResult = await step.validate({ name: '' })
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.error).toContain('required')
    })

    test('should validate multiple fields', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'email',
            type: FieldType.EMAIL,
            label: 'Email',
            required: true,
          },
          {
            name: 'age',
            type: FieldType.NUMBER,
            label: 'Age',
            required: true,
            min: 18,
          },
        ],
      }

      const step = new StepDefinition(config)

      const validResult = await step.validate({
        email: 'test@example.com',
        age: 25,
      })
      expect(validResult.isValid).toBe(true)

      const invalidResult = await step.validate({
        email: 'invalid-email',
        age: 17,
      })
      expect(invalidResult.isValid).toBe(false)
    })

    test('should use custom validator if provided', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'password',
            type: FieldType.PASSWORD,
            label: 'Password',
            required: true,
          },
        ],
        validator: (data) => {
          if (data.password.length < 8) {
            return {
              isValid: false,
              error: 'Password must be at least 8 characters',
            }
          }
          return { isValid: true }
        },
      }

      const step = new StepDefinition(config)

      const validResult = await step.validate({ password: 'LongPassword123' })
      expect(validResult.isValid).toBe(true)

      const invalidResult = await step.validate({ password: 'short' })
      expect(invalidResult.isValid).toBe(false)
      expect(invalidResult.error).toBe('Password must be at least 8 characters')
    })

    test('should run custom validator after field validation', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'password',
            type: FieldType.PASSWORD,
            label: 'Password',
            required: true,
          },
        ],
        validator: async (data) => {
          // This shouldn't run if field validation fails
          return { isValid: true }
        },
      }

      const step = new StepDefinition(config)

      // Field validation should fail first
      const result = await step.validate({ password: '' })
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('required')
    })
  })

  describe('execute', () => {
    test('should execute step successfully', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)
      const result = await step.execute({ name: 'John' })

      expect(result.success).toBe(true)
      expect(result.data).toEqual({ name: 'John' })
      expect(result.error).toBeUndefined()
    })

    test('should fail execution with invalid data', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)
      const result = await step.execute({ name: '' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.shouldRetry).toBe(true)
    })

    test('should call onEnter hook', async () => {
      let hookCalled = false

      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
        onEnter: (data, context) => {
          hookCalled = true
        },
      }

      const step = new StepDefinition(config)
      await step.execute({})

      expect(hookCalled).toBe(true)
    })

    test('should call onExit hook', async () => {
      let hookCalled = false

      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
        onExit: (data, context) => {
          hookCalled = true
        },
      }

      const step = new StepDefinition(config)
      await step.execute({})

      expect(hookCalled).toBe(true)
    })
  })

  describe('getField', () => {
    test('should get field by name', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'email',
            type: FieldType.EMAIL,
            label: 'Email',
          },
          {
            name: 'phone',
            type: FieldType.PHONE,
            label: 'Phone',
          },
        ],
      }

      const step = new StepDefinition(config)

      const emailField = step.getField('email')
      expect(emailField).toBeDefined()
      expect(emailField?.getName()).toBe('email')

      const phoneField = step.getField('phone')
      expect(phoneField).toBeDefined()
      expect(phoneField?.getName()).toBe('phone')
    })

    test('should return undefined for non-existent field', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
      }

      const step = new StepDefinition(config)

      expect(step.getField('nonexistent')).toBeUndefined()
    })
  })

  describe('getFieldNames', () => {
    test('should return all field names', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          { name: 'email', type: FieldType.EMAIL, label: 'Email' },
          { name: 'phone', type: FieldType.PHONE, label: 'Phone' },
          { name: 'age', type: FieldType.NUMBER, label: 'Age' },
        ],
      }

      const step = new StepDefinition(config)

      expect(step.getFieldNames()).toEqual(['email', 'phone', 'age'])
    })

    test('should return empty array for step with no fields', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
      }

      const step = new StepDefinition(config)

      expect(step.getFieldNames()).toEqual([])
    })
  })

  describe('createInitialState', () => {
    test('should create initial step state', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [],
      }

      const step = new StepDefinition(config)
      const state = step.createInitialState(0)

      expect(state.stepId).toBe('step1')
      expect(state.stepIndex).toBe(0)
      expect(state.data).toEqual({})
      expect(state.isValid).toBe(false)
      expect(state.isComplete).toBe(false)
      expect(state.visitedAt).toBeInstanceOf(Date)
    })
  })

  describe('updateState', () => {
    test('should update state with valid data', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)
      const initialState = step.createInitialState(0)
      const updatedState = await step.updateState(initialState, { name: 'John' })

      expect(updatedState.data).toEqual({ name: 'John' })
      expect(updatedState.isValid).toBe(true)
      expect(updatedState.isComplete).toBe(true)
      expect(updatedState.completedAt).toBeInstanceOf(Date)
      expect(updatedState.errors).toBeUndefined()
    })

    test('should update state with invalid data', async () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Step 1',
        fields: [
          {
            name: 'name',
            type: FieldType.TEXT,
            label: 'Name',
            required: true,
          },
        ],
      }

      const step = new StepDefinition(config)
      const initialState = step.createInitialState(0)
      const updatedState = await step.updateState(initialState, { name: '' })

      expect(updatedState.isValid).toBe(false)
      expect(updatedState.isComplete).toBe(false)
      expect(updatedState.completedAt).toBeUndefined()
      expect(updatedState.errors).toBeDefined()
    })
  })

  describe('getSummary', () => {
    test('should return step summary', () => {
      const config: StepConfig = {
        id: 'step1',
        title: 'Contact Information',
        fields: [
          { name: 'email', type: FieldType.EMAIL, label: 'Email', required: true },
          { name: 'phone', type: FieldType.PHONE, label: 'Phone', required: true },
          { name: 'address', type: FieldType.TEXT, label: 'Address', required: false },
        ],
      }

      const step = new StepDefinition(config)
      const summary = step.getSummary()

      expect(summary).toContain('Contact Information')
      expect(summary).toContain('3 fields')
      expect(summary).toContain('2 required')
    })
  })
})
