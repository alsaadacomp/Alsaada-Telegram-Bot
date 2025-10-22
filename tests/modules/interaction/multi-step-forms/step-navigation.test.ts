/**
 * Step Navigation Tests
 * اختبارات التنقل بين الخطوات
 */

import type { MultiStepFormState, StepConfig } from '../../../../src/modules/interaction/multi-step-forms/types.js'
import { describe, expect, test } from '@jest/globals'
import { FieldType } from '../../../../src/modules/interaction/forms/types.js'
import { StepNavigation } from '../../../../src/modules/interaction/multi-step-forms/core/step-navigation.js'
import { NavigationDirection } from '../../../../src/modules/interaction/multi-step-forms/types.js'

describe('StepNavigation', () => {
  const createTestSteps = (): StepConfig[] => [
    {
      id: 'step1',
      title: 'Step 1',
      fields: [{ name: 'field1', type: FieldType.TEXT, label: 'Field 1' }],
    },
    {
      id: 'step2',
      title: 'Step 2',
      fields: [{ name: 'field2', type: FieldType.TEXT, label: 'Field 2' }],
    },
    {
      id: 'step3',
      title: 'Step 3',
      fields: [{ name: 'field3', type: FieldType.TEXT, label: 'Field 3' }],
    },
  ]

  const createTestState = (): MultiStepFormState => ({
    formId: 'test-form',
    userId: 123,
    chatId: 456,
    currentStepIndex: 0,
    steps: [
      { stepId: 'step1', stepIndex: 0, data: {}, isValid: true, isComplete: true, visitedAt: new Date() },
      { stepId: 'step2', stepIndex: 1, data: {}, isValid: false, isComplete: false },
      { stepId: 'step3', stepIndex: 2, data: {}, isValid: false, isComplete: false },
    ],
    allData: {},
    isComplete: false,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
  })

  describe('Constructor', () => {
    test('should create navigation with default options', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getTotalSteps()).toBe(3)
    })

    test('should create navigation with custom options', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, {
        allowBackNavigation: false,
        allowSkipSteps: true,
      })

      expect(navigation.getTotalSteps()).toBe(3)
    })
  })

  describe('getTotalSteps', () => {
    test('should return correct number of steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getTotalSteps()).toBe(3)
    })
  })

  describe('getStep', () => {
    test('should get step by index', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const step = navigation.getStep(0)
      expect(step).toBeDefined()
      expect(step?.id).toBe('step1')

      const step2 = navigation.getStep(1)
      expect(step2?.id).toBe('step2')
    })

    test('should return undefined for invalid index', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getStep(-1)).toBeUndefined()
      expect(navigation.getStep(99)).toBeUndefined()
    })
  })

  describe('getStepById', () => {
    test('should get step by ID', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const step = navigation.getStepById('step2')
      expect(step).toBeDefined()
      expect(step?.id).toBe('step2')
    })

    test('should return undefined for non-existent ID', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getStepById('nonexistent')).toBeUndefined()
    })
  })

  describe('getStepIndex', () => {
    test('should get step index by ID', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getStepIndex('step1')).toBe(0)
      expect(navigation.getStepIndex('step2')).toBe(1)
      expect(navigation.getStepIndex('step3')).toBe(2)
    })

    test('should return -1 for non-existent ID', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      expect(navigation.getStepIndex('nonexistent')).toBe(-1)
    })
  })

  describe('getAllSteps', () => {
    test('should return all steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const allSteps = navigation.getAllSteps()
      expect(allSteps).toHaveLength(3)
      expect(allSteps[0].id).toBe('step1')
      expect(allSteps[1].id).toBe('step2')
      expect(allSteps[2].id).toBe('step3')
    })
  })

  describe('getVisibleSteps', () => {
    test('should return all steps when no conditions', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const visibleSteps = navigation.getVisibleSteps({})
      expect(visibleSteps).toHaveLength(3)
    })

    test('should filter steps by condition', () => {
      const steps: StepConfig[] = [
        { id: 'step1', title: 'Step 1', fields: [] },
        { id: 'step2', title: 'Step 2', fields: [], condition: data => data.showStep2 === true },
        { id: 'step3', title: 'Step 3', fields: [] },
      ]

      const navigation = new StepNavigation(steps)

      const visibleWithout = navigation.getVisibleSteps({ showStep2: false })
      expect(visibleWithout).toHaveLength(2)
      expect(visibleWithout.find(s => s.id === 'step2')).toBeUndefined()

      const visibleWith = navigation.getVisibleSteps({ showStep2: true })
      expect(visibleWith).toHaveLength(3)
    })
  })

  describe('getNextVisibleStepIndex', () => {
    test('should return next step index', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const nextIndex = navigation.getNextVisibleStepIndex(0, {})
      expect(nextIndex).toBe(1)

      const nextIndex2 = navigation.getNextVisibleStepIndex(1, {})
      expect(nextIndex2).toBe(2)
    })

    test('should return null when no next step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const nextIndex = navigation.getNextVisibleStepIndex(2, {})
      expect(nextIndex).toBeNull()
    })

    test('should skip invisible steps', () => {
      const steps: StepConfig[] = [
        { id: 'step1', title: 'Step 1', fields: [] },
        { id: 'step2', title: 'Step 2', fields: [], condition: data => data.show === true },
        { id: 'step3', title: 'Step 3', fields: [] },
      ]

      const navigation = new StepNavigation(steps)

      // With step2 hidden, should jump to step3
      const nextIndex = navigation.getNextVisibleStepIndex(0, { show: false })
      expect(nextIndex).toBe(2)

      // With step2 visible
      const nextIndex2 = navigation.getNextVisibleStepIndex(0, { show: true })
      expect(nextIndex2).toBe(1)
    })
  })

  describe('getPreviousVisibleStepIndex', () => {
    test('should return previous step index', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const prevIndex = navigation.getPreviousVisibleStepIndex(2, {})
      expect(prevIndex).toBe(1)

      const prevIndex2 = navigation.getPreviousVisibleStepIndex(1, {})
      expect(prevIndex2).toBe(0)
    })

    test('should return null when no previous step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)

      const prevIndex = navigation.getPreviousVisibleStepIndex(0, {})
      expect(prevIndex).toBeNull()
    })
  })

  describe('canNavigate - Next', () => {
    test('should allow navigation to next when current step is valid', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()

      const result = navigation.canNavigate(state, { direction: NavigationDirection.NEXT })

      expect(result.allowed).toBe(true)
      expect(result.targetStepIndex).toBe(1)
    })

    test('should not allow navigation to next when current step is invalid', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isValid = false

      const result = navigation.canNavigate(state, { direction: NavigationDirection.NEXT })

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('not valid')
    })

    test('should allow skip validation when requested', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isValid = false

      const result = navigation.canNavigate(state, {
        direction: NavigationDirection.NEXT,
        skipValidation: true,
      })

      expect(result.allowed).toBe(true)
    })
  })

  describe('canNavigate - Previous', () => {
    test('should allow navigation to previous when enabled', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowBackNavigation: true })
      const state = createTestState()
      state.currentStepIndex = 1

      const result = navigation.canNavigate(state, { direction: NavigationDirection.PREVIOUS })

      expect(result.allowed).toBe(true)
      expect(result.targetStepIndex).toBe(0)
    })

    test('should not allow navigation to previous when disabled', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowBackNavigation: false })
      const state = createTestState()
      state.currentStepIndex = 1

      const result = navigation.canNavigate(state, { direction: NavigationDirection.PREVIOUS })

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('Back navigation is disabled')
    })
  })

  describe('canNavigate - Jump', () => {
    test('should allow jump to specific step by ID', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowSkipSteps: true })
      const state = createTestState()

      const result = navigation.canNavigate(state, {
        direction: NavigationDirection.JUMP,
        targetStepId: 'step2',
      })

      expect(result.allowed).toBe(true)
      expect(result.targetStepIndex).toBe(1)
    })

    test('should allow jump to specific step by index', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowSkipSteps: true })
      const state = createTestState()
      // Mark intermediate steps as valid or complete
      state.steps[0].isValid = true
      state.steps[1].isValid = true

      const result = navigation.canNavigate(state, {
        direction: NavigationDirection.JUMP,
        targetStepIndex: 2,
      })

      expect(result.allowed).toBe(true)
      expect(result.targetStepIndex).toBe(2)
    })

    test('should not allow jump without target', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()

      const result = navigation.canNavigate(state, {
        direction: NavigationDirection.JUMP,
      })

      expect(result.allowed).toBe(false)
      expect(result.reason).toContain('No target step specified')
    })
  })

  describe('navigateNext', () => {
    test('should navigate to next step', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()

      const newState = await navigation.navigateNext(state)

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(1)
      expect(newState?.lastUpdatedAt).toBeInstanceOf(Date)
    })

    test('should return null when cannot navigate next', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isValid = false

      const newState = await navigation.navigateNext(state)

      expect(newState).toBeNull()
    })
  })

  describe('navigatePrevious', () => {
    test('should navigate to previous step', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowBackNavigation: true })
      const state = createTestState()
      state.currentStepIndex = 1

      const newState = await navigation.navigatePrevious(state)

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(0)
    })

    test('should return null when back navigation disabled', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowBackNavigation: false })
      const state = createTestState()
      state.currentStepIndex = 1

      const newState = await navigation.navigatePrevious(state)

      expect(newState).toBeNull()
    })
  })

  describe('jumpToStep', () => {
    test('should jump to specific step', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps, { allowSkipSteps: true })
      const state = createTestState()
      // Mark intermediate steps as valid
      state.steps[0].isValid = true
      state.steps[1].isValid = true

      const newState = await navigation.jumpToStep(state, 'step3')

      expect(newState).not.toBeNull()
      expect(newState?.currentStepIndex).toBe(2)
    })

    test('should return null for non-existent step', async () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()

      const newState = await navigation.jumpToStep(state, 'nonexistent')

      expect(newState).toBeNull()
    })
  })

  describe('isFormComplete', () => {
    test('should return true when all steps complete', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true
      state.steps[2].isComplete = true

      expect(navigation.isFormComplete(state)).toBe(true)
    })

    test('should return false when any step incomplete', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = false
      state.steps[2].isComplete = true

      expect(navigation.isFormComplete(state)).toBe(false)
    })

    test('should only check visible steps', () => {
      const steps: StepConfig[] = [
        { id: 'step1', title: 'Step 1', fields: [] },
        { id: 'step2', title: 'Step 2', fields: [], condition: () => false },
        { id: 'step3', title: 'Step 3', fields: [] },
      ]

      const navigation = new StepNavigation(steps)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = false // This step is hidden
      state.steps[2].isComplete = true

      expect(navigation.isFormComplete(state)).toBe(true)
    })
  })
})
