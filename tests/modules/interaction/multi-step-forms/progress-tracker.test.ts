/**
 * Progress Tracker Tests
 * اختبارات تتبع التقدم
 */

import type { MultiStepFormState, StepConfig } from '../../../../src/modules/interaction/multi-step-forms/types.js'
import { describe, expect, test } from '@jest/globals'
import { FieldType } from '../../../../src/modules/interaction/forms/types.js'
import { ProgressTracker } from '../../../../src/modules/interaction/multi-step-forms/core/progress-tracker.js'
import { StepNavigation } from '../../../../src/modules/interaction/multi-step-forms/core/step-navigation.js'

describe('ProgressTracker', () => {
  const createTestSteps = (): StepConfig[] => [
    { id: 'step1', title: 'Step 1', fields: [{ name: 'field1', type: FieldType.TEXT, label: 'Field 1' }] },
    { id: 'step2', title: 'Step 2', fields: [{ name: 'field2', type: FieldType.TEXT, label: 'Field 2' }] },
    { id: 'step3', title: 'Step 3', fields: [{ name: 'field3', type: FieldType.TEXT, label: 'Field 3' }] },
  ]

  const createTestState = (): MultiStepFormState => ({
    formId: 'test-form',
    userId: 123,
    chatId: 456,
    currentStepIndex: 1,
    steps: [
      { stepId: 'step1', stepIndex: 0, data: {}, isValid: true, isComplete: true, visitedAt: new Date(), completedAt: new Date() },
      { stepId: 'step2', stepIndex: 1, data: {}, isValid: false, isComplete: false, visitedAt: new Date() },
      { stepId: 'step3', stepIndex: 2, data: {}, isValid: false, isComplete: false },
    ],
    allData: {},
    isComplete: false,
    startedAt: new Date(Date.now() - 60000), // 1 minute ago
    lastUpdatedAt: new Date(),
  })

  describe('getProgress', () => {
    test('should return correct progress information', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const progress = tracker.getProgress(state)

      expect(progress.currentStep).toBe(2) // currentStepIndex + 1
      expect(progress.totalSteps).toBe(3)
      expect(progress.completedSteps).toBe(1)
      expect(progress.percentage).toBe(33) // 1/3 * 100 rounded
      expect(progress.remainingSteps).toBe(2)
    })

    test('should handle no completed steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = false

      const progress = tracker.getProgress(state)

      expect(progress.completedSteps).toBe(0)
      expect(progress.percentage).toBe(0)
      expect(progress.remainingSteps).toBe(3)
    })

    test('should handle all completed steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true
      state.steps[2].isComplete = true

      const progress = tracker.getProgress(state)

      expect(progress.completedSteps).toBe(3)
      expect(progress.percentage).toBe(100)
      expect(progress.remainingSteps).toBe(0)
    })
  })

  describe('getProgressBar', () => {
    test('should return progress bar string', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const progressBar = tracker.getProgressBar(state, 10)

      expect(progressBar).toContain('█')
      expect(progressBar).toContain('░')
      expect(progressBar).toContain('33%')
    })

    test('should show full progress bar when complete', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true
      state.steps[2].isComplete = true

      const progressBar = tracker.getProgressBar(state, 10)

      expect(progressBar).toContain('100%')
      expect(progressBar).toMatch(/█{10}/)
    })

    test('should show empty progress bar at start', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = false

      const progressBar = tracker.getProgressBar(state, 10)

      expect(progressBar).toContain('0%')
    })
  })

  describe('getProgressText', () => {
    test('should return progress text in English', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const text = tracker.getProgressText(state, 'en')

      expect(text).toBe('Step 2 of 3')
    })

    test('should return progress text in Arabic', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const text = tracker.getProgressText(state, 'ar')

      expect(text).toBe('الخطوة 2 من 3')
    })
  })

  describe('getProgressMessage', () => {
    test('should return detailed progress message in English', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const message = tracker.getProgressMessage(state, 'en')

      expect(message).toContain('Progress')
      expect(message).toContain('1/3')
      expect(message).toContain('33%')
      expect(message).toContain('█')
    })

    test('should return detailed progress message in Arabic', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const message = tracker.getProgressMessage(state, 'ar')

      expect(message).toContain('التقدم')
      expect(message).toContain('1/3')
      expect(message).toContain('33%')
    })
  })

  describe('isFirstStep', () => {
    test('should return true when on first step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.currentStepIndex = 0

      expect(tracker.isFirstStep(state)).toBe(true)
    })

    test('should return false when not on first step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.currentStepIndex = 1

      expect(tracker.isFirstStep(state)).toBe(false)
    })
  })

  describe('isLastStep', () => {
    test('should return true when on last step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.currentStepIndex = 2

      expect(tracker.isLastStep(state)).toBe(true)
    })

    test('should return false when not on last step', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.currentStepIndex = 1

      expect(tracker.isLastStep(state)).toBe(false)
    })
  })

  describe('getTimeStats', () => {
    test('should calculate time statistics', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const stats = tracker.getTimeStats(state)

      expect(stats.totalTime).toBeGreaterThan(0)
      expect(stats.averageTimePerStep).toBeGreaterThanOrEqual(0)
      expect(stats.currentStepTime).toBeGreaterThanOrEqual(0)
    })

    test('should handle no completed steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = false
      state.steps[0].completedAt = undefined

      const stats = tracker.getTimeStats(state)

      expect(stats.averageTimePerStep).toBe(0)
    })
  })

  describe('formatDuration', () => {
    test('should format seconds in English', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)

      expect(tracker.formatDuration(30, 'en')).toBe('30s')
      expect(tracker.formatDuration(45, 'en')).toBe('45s')
    })

    test('should format minutes and seconds in English', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)

      expect(tracker.formatDuration(90, 'en')).toBe('1m 30s')
      expect(tracker.formatDuration(120, 'en')).toBe('2m ')
      expect(tracker.formatDuration(185, 'en')).toBe('3m 5s')
    })

    test('should format duration in Arabic', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)

      expect(tracker.formatDuration(30, 'ar')).toBe('30 ثانية')
      expect(tracker.formatDuration(90, 'ar')).toContain('دقيقة')
      expect(tracker.formatDuration(90, 'ar')).toContain('ثانية')
    })
  })

  describe('getEstimatedCompletionTime', () => {
    test('should return null when no average time', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].completedAt = undefined

      const estimate = tracker.getEstimatedCompletionTime(state)

      expect(estimate).toBeNull()
    })

    test('should return null when no remaining steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true
      state.steps[2].isComplete = true

      const estimate = tracker.getEstimatedCompletionTime(state)

      expect(estimate).toBeNull()
    })

    test('should calculate estimated time', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      // Set up a completed step with time
      const now = new Date()
      state.steps[0].visitedAt = new Date(now.getTime() - 30000) // 30 seconds ago
      state.steps[0].completedAt = now
      state.steps[0].isComplete = true

      const estimate = tracker.getEstimatedCompletionTime(state)

      // Should be approximately 60 seconds (30 * 2 remaining steps)
      expect(estimate).toBeGreaterThan(0)
    })
  })

  describe('getEstimateMessage', () => {
    test('should return null when no estimate available', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].completedAt = undefined

      const message = tracker.getEstimateMessage(state)

      expect(message).toBeNull()
    })

    test('should return estimate message in English', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const now = new Date()
      state.steps[0].visitedAt = new Date(now.getTime() - 30000)
      state.steps[0].completedAt = now
      state.steps[0].isComplete = true

      const message = tracker.getEstimateMessage(state, 'en')

      expect(message).toContain('Estimated time')
      expect(message).toContain('⏱️')
    })

    test('should return estimate message in Arabic', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const now = new Date()
      state.steps[0].visitedAt = new Date(now.getTime() - 30000)
      state.steps[0].completedAt = now
      state.steps[0].isComplete = true

      const message = tracker.getEstimateMessage(state, 'ar')

      expect(message).toContain('الوقت المتوقع')
      expect(message).toContain('⏱️')
    })
  })

  describe('getVisitedStepsSummary', () => {
    test('should return summary of visited steps', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()

      const summary = tracker.getVisitedStepsSummary(state)

      expect(summary.visited).toBe(2) // step1 and step2
      expect(summary.completed).toBe(1) // step1
      expect(summary.pending).toBe(2) // step2 and step3
    })

    test('should handle all steps visited', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[2].visitedAt = new Date()

      const summary = tracker.getVisitedStepsSummary(state)

      expect(summary.visited).toBe(3)
    })

    test('should handle all steps completed', () => {
      const steps = createTestSteps()
      const navigation = new StepNavigation(steps)
      const tracker = new ProgressTracker(navigation)
      const state = createTestState()
      state.steps[0].isComplete = true
      state.steps[1].isComplete = true
      state.steps[2].isComplete = true

      const summary = tracker.getVisitedStepsSummary(state)

      expect(summary.completed).toBe(3)
      expect(summary.pending).toBe(0)
    })
  })
})
