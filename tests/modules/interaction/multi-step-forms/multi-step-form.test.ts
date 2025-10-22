/**
 * Multi-Step Form Tests
 * اختبارات النموذج متعدد الخطوات
 */

import type { MultiStepFormConfig } from '../../../../src/modules/interaction/multi-step-forms/types.js'
import { describe, expect, test } from '@jest/globals'
import { FieldType } from '../../../../src/modules/interaction/forms/types.js'
import { MultiStepForm } from '../../../../src/modules/interaction/multi-step-forms/core/multi-step-form.js'

describe('MultiStepForm', () => {
  const createTestForm = (): MultiStepFormConfig => ({
    id: 'test-form',
    title: 'Test Form',
    description: 'A test multi-step form',
    steps: [
      {
        id: 'step1',
        title: 'Personal Information',
        fields: [
          { name: 'name', type: FieldType.TEXT, label: 'Name', required: true },
          { name: 'age', type: FieldType.NUMBER, label: 'Age', required: true, min: 18 },
        ],
      },
      {
        id: 'step2',
        title: 'Contact Information',
        fields: [
          { name: 'email', type: FieldType.EMAIL, label: 'Email', required: true },
          { name: 'phone', type: FieldType.PHONE, label: 'Phone', required: false },
        ],
      },
    ],
  })

  describe('Constructor', () => {
    test('should create form with configuration', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)

      expect(form.id).toBe('test-form')
      expect(form.title).toBe('Test Form')
      expect(form.description).toBe('A test multi-step form')
      expect(form.navigation).toBeDefined()
      expect(form.progressTracker).toBeDefined()
    })
  })

  describe('createInitialState', () => {
    test('should create initial form state', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      expect(state.formId).toBe('test-form')
      expect(state.userId).toBe(123)
      expect(state.chatId).toBe(456)
      expect(state.currentStepIndex).toBe(0)
      expect(state.steps).toHaveLength(2)
      expect(state.allData).toEqual({})
      expect(state.isComplete).toBe(false)
      expect(state.startedAt).toBeInstanceOf(Date)
      expect(state.lastUpdatedAt).toBeInstanceOf(Date)
    })
  })

  describe('getCurrentStep', () => {
    test('should return current step', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const currentStep = form.getCurrentStep(state)

      expect(currentStep).toBeDefined()
      expect(currentStep?.id).toBe('step1')
    })

    test('should return undefined for invalid index', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.currentStepIndex = 99

      const currentStep = form.getCurrentStep(state)

      expect(currentStep).toBeUndefined()
    })
  })

  describe('getCurrentStepState', () => {
    test('should return current step state', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const stepState = form.getCurrentStepState(state)

      expect(stepState).toBeDefined()
      expect(stepState?.stepId).toBe('step1')
    })
  })

  describe('updateCurrentStep', () => {
    test('should update current step with data', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const updatedState = await form.updateCurrentStep(state, { name: 'John', age: 25 })

      expect(updatedState.steps[0].data).toEqual({ name: 'John', age: 25 })
      expect(updatedState.allData).toEqual({ name: 'John', age: 25 })
      expect(updatedState.lastUpdatedAt).toBeInstanceOf(Date)
    })

    test('should mark step as valid when data is correct', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const updatedState = await form.updateCurrentStep(state, { name: 'John', age: 25 })

      expect(updatedState.steps[0].isValid).toBe(true)
      expect(updatedState.steps[0].isComplete).toBe(true)
    })

    test('should mark step as invalid when data is incorrect', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const updatedState = await form.updateCurrentStep(state, { name: '', age: 25 })

      expect(updatedState.steps[0].isValid).toBe(false)
      expect(updatedState.steps[0].isComplete).toBe(false)
    })
  })

  describe('moveToNextStep', () => {
    test('should move to next step when current is valid', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)

      // Update first step with valid data
      state = await form.updateCurrentStep(state, { name: 'John', age: 25 })

      const newState = await form.moveToNextStep(state)

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(1)
    })

    test('should not move to next step when current is invalid', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const newState = await form.moveToNextStep(state)

      expect(newState).toBeNull()
    })

    test('should call onStepChange hook if provided', async () => {
      let hookCalled = false
      let fromStep: number | undefined
      let toStep: number | undefined

      const config = createTestForm()
      config.onStepChange = async (from, to, data) => {
        hookCalled = true
        fromStep = from
        toStep = to
      }

      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)
      state = await form.updateCurrentStep(state, { name: 'John', age: 25 })

      await form.moveToNextStep(state)

      expect(hookCalled).toBe(true)
      expect(fromStep).toBe(0)
      expect(toStep).toBe(1)
    })
  })

  describe('moveToPreviousStep', () => {
    test('should move to previous step', async () => {
      const config = createTestForm()
      config.allowBackNavigation = true
      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)
      state.currentStepIndex = 1

      const newState = await form.moveToPreviousStep(state)

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(0)
    })

    test('should not move to previous step when disabled', async () => {
      const config = createTestForm()
      config.allowBackNavigation = false
      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)
      state.currentStepIndex = 1

      const newState = await form.moveToPreviousStep(state)

      expect(newState).toBeNull()
    })
  })

  describe('jumpToStep', () => {
    test('should jump to specific step', async () => {
      const config = createTestForm()
      config.allowSkipSteps = true
      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)
      state.steps[0].isValid = true

      const newState = await form.jumpToStep(state, 'step2')

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(1)
    })

    test('should return null for non-existent step', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const newState = await form.jumpToStep(state, 'nonexistent')

      expect(newState).toBeNull()
    })
  })

  describe('canComplete', () => {
    test('should return false when not all steps complete', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      expect(form.canComplete(state)).toBe(false)
    })

    test('should return true when all steps complete', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true

      expect(form.canComplete(state)).toBe(true)
    })
  })

  describe('complete', () => {
    test('should complete form successfully', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true

      const result = await form.complete(state)

      expect(result.success).toBe(true)
      expect(result.message).toContain('completed successfully')
    })

    test('should fail when not all steps complete', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const result = await form.complete(state)

      expect(result.success).toBe(false)
      expect(result.message).toContain('complete all required steps')
    })

    test('should call onComplete hook if provided', async () => {
      let hookCalled = false

      const config = createTestForm()
      config.onComplete = async (data) => {
        hookCalled = true
        return { success: true, data }
      }

      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true

      await form.complete(state)

      expect(hookCalled).toBe(true)
    })
  })

  describe('cancel', () => {
    test('should call onCancel hook if provided', async () => {
      let hookCalled = false

      const config = createTestForm()
      config.onCancel = async (data) => {
        hookCalled = true
      }

      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      await form.cancel(state)

      expect(hookCalled).toBe(true)
    })
  })

  describe('getSummary', () => {
    test('should return form summary', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const summary = form.getSummary(state)

      expect(summary).toContain('Test Form')
      expect(summary).toContain('Progress')
      expect(summary).toContain('Time')
    })
  })

  describe('getAllData', () => {
    test('should return all form data', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.allData = { name: 'John', age: 25, email: 'john@example.com' }

      const data = form.getAllData(state)

      expect(data).toEqual({ name: 'John', age: 25, email: 'john@example.com' })
    })
  })

  describe('getStepData', () => {
    test('should return specific step data', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].data = { name: 'John', age: 25 }

      const data = form.getStepData(state, 'step1')

      expect(data).toEqual({ name: 'John', age: 25 })
    })

    test('should return null for non-existent step', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)

      const data = form.getStepData(state, 'nonexistent')

      expect(data).toBeNull()
    })
  })

  describe('reset', () => {
    test('should reset form to initial state', () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      let state = form.createInitialState(123, 456)
      state.allData = { name: 'John' }
      state.currentStepIndex = 1

      const resetState = form.reset(state)

      expect(resetState.currentStepIndex).toBe(0)
      expect(resetState.allData).toEqual({})
      expect(resetState.isComplete).toBe(false)
    })
  })

  describe('validateAll', () => {
    test('should validate all steps', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].data = { name: 'John', age: 25 }
      state.steps[1].data = { email: 'john@example.com' }

      const result = await form.validateAll(state)

      expect(result.isValid).toBe(true)
      expect(Object.keys(result.errors)).toHaveLength(0)
    })

    test('should return errors for invalid steps', async () => {
      const config = createTestForm()
      const form = new MultiStepForm(config)
      const state = form.createInitialState(123, 456)
      state.steps[0].data = { name: '', age: 17 } // Invalid
      state.steps[1].data = { email: 'invalid-email' } // Invalid

      const result = await form.validateAll(state)

      expect(result.isValid).toBe(false)
      expect(Object.keys(result.errors).length).toBeGreaterThan(0)
    })
  })
})
