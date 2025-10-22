/**
 * Multi-Step Form Storage Tests
 * اختبارات تخزين النماذج متعددة الخطوات
 */

import type { MultiStepFormState } from '../../../../src/modules/interaction/multi-step-forms/types.js'
import { beforeEach, describe, expect, test } from '@jest/globals'
import { InMemoryMultiStepFormStorage } from '../../../../src/modules/interaction/multi-step-forms/storage/memory-storage.js'

describe('InMemoryMultiStepFormStorage', () => {
  let storage: InMemoryMultiStepFormStorage

  beforeEach(() => {
    storage = new InMemoryMultiStepFormStorage()
  })

  const createTestState = (userId: number = 123, formId: string = 'test-form'): MultiStepFormState => ({
    formId,
    userId,
    chatId: 456,
    currentStepIndex: 0,
    steps: [
      {
        stepId: 'step1',
        stepIndex: 0,
        data: { name: 'John' },
        isValid: true,
        isComplete: true,
        visitedAt: new Date(),
        completedAt: new Date(),
      },
    ],
    allData: { name: 'John' },
    isComplete: false,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
  })

  describe('save', () => {
    test('should save form state', async () => {
      const state = createTestState()

      await storage.save(state)

      expect(storage.getSize()).toBe(1)
    })

    test('should overwrite existing state', async () => {
      const state1 = createTestState()
      const state2 = { ...createTestState(), currentStepIndex: 1 }

      await storage.save(state1)
      await storage.save(state2)

      expect(storage.getSize()).toBe(1)

      const loaded = await storage.load(123, 'test-form')
      expect(loaded?.currentStepIndex).toBe(1)
    })

    test('should save multiple states for different forms', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = createTestState(123, 'form2')

      await storage.save(state1)
      await storage.save(state2)

      expect(storage.getSize()).toBe(2)
    })

    test('should save multiple states for different users', async () => {
      const state1 = createTestState(123, 'test-form')
      const state2 = createTestState(456, 'test-form')

      await storage.save(state1)
      await storage.save(state2)

      expect(storage.getSize()).toBe(2)
    })
  })

  describe('load', () => {
    test('should load saved form state', async () => {
      const state = createTestState()

      await storage.save(state)
      const loaded = await storage.load(123, 'test-form')

      expect(loaded).not.toBeNull()
      expect(loaded?.userId).toBe(123)
      expect(loaded?.formId).toBe('test-form')
      expect(loaded?.currentStepIndex).toBe(0)
    })

    test('should return null for non-existent state', async () => {
      const loaded = await storage.load(999, 'nonexistent')

      expect(loaded).toBeNull()
    })

    test('should restore dates properly', async () => {
      const state = createTestState()

      await storage.save(state)
      const loaded = await storage.load(123, 'test-form')

      expect(loaded?.startedAt).toBeInstanceOf(Date)
      expect(loaded?.lastUpdatedAt).toBeInstanceOf(Date)
      expect(loaded?.steps[0]?.visitedAt).toBeInstanceOf(Date)
      expect(loaded?.steps[0]?.completedAt).toBeInstanceOf(Date)
    })

    test('should not affect original when modifying loaded state', async () => {
      const state = createTestState()

      await storage.save(state)
      const loaded = await storage.load(123, 'test-form')

      // Modify loaded state
      if (loaded) {
        loaded.currentStepIndex = 5
      }

      // Load again and check
      const loadedAgain = await storage.load(123, 'test-form')
      expect(loadedAgain?.currentStepIndex).toBe(0)
    })
  })

  describe('delete', () => {
    test('should delete form state', async () => {
      const state = createTestState()

      await storage.save(state)
      expect(storage.getSize()).toBe(1)

      await storage.delete(123, 'test-form')
      expect(storage.getSize()).toBe(0)

      const loaded = await storage.load(123, 'test-form')
      expect(loaded).toBeNull()
    })

    test('should not affect other states', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = createTestState(123, 'form2')

      await storage.save(state1)
      await storage.save(state2)

      await storage.delete(123, 'form1')

      expect(storage.getSize()).toBe(1)

      const loaded = await storage.load(123, 'form2')
      expect(loaded).not.toBeNull()
    })
  })

  describe('clear', () => {
    test('should clear all forms for a user', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = createTestState(123, 'form2')
      const state3 = createTestState(456, 'form1')

      await storage.save(state1)
      await storage.save(state2)
      await storage.save(state3)

      await storage.clear(123)

      expect(storage.getSize()).toBe(1)

      const loaded1 = await storage.load(123, 'form1')
      expect(loaded1).toBeNull()

      const loaded2 = await storage.load(123, 'form2')
      expect(loaded2).toBeNull()

      const loaded3 = await storage.load(456, 'form1')
      expect(loaded3).not.toBeNull()
    })

    test('should handle clearing non-existent user', async () => {
      await storage.clear(999)

      expect(storage.getSize()).toBe(0)
    })
  })

  describe('getAllActive', () => {
    test('should return all active forms for a user', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = createTestState(123, 'form2')
      const state3 = createTestState(456, 'form1')

      await storage.save(state1)
      await storage.save(state2)
      await storage.save(state3)

      const active = await storage.getAllActive(123)

      expect(active).toHaveLength(2)
      expect(active.map(s => s.formId)).toContain('form1')
      expect(active.map(s => s.formId)).toContain('form2')
    })

    test('should not return completed forms', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = { ...createTestState(123, 'form2'), isComplete: true }

      await storage.save(state1)
      await storage.save(state2)

      const active = await storage.getAllActive(123)

      expect(active).toHaveLength(1)
      expect(active[0].formId).toBe('form1')
    })

    test('should return empty array for user with no forms', async () => {
      const active = await storage.getAllActive(999)

      expect(active).toHaveLength(0)
    })

    test('should restore dates in all active forms', async () => {
      const state1 = createTestState(123, 'form1')
      const state2 = createTestState(123, 'form2')

      await storage.save(state1)
      await storage.save(state2)

      const active = await storage.getAllActive(123)

      expect(active[0].startedAt).toBeInstanceOf(Date)
      expect(active[1].startedAt).toBeInstanceOf(Date)
    })
  })

  describe('getSize', () => {
    test('should return correct storage size', async () => {
      expect(storage.getSize()).toBe(0)

      await storage.save(createTestState(123, 'form1'))
      expect(storage.getSize()).toBe(1)

      await storage.save(createTestState(123, 'form2'))
      expect(storage.getSize()).toBe(2)

      await storage.save(createTestState(456, 'form1'))
      expect(storage.getSize()).toBe(3)
    })
  })

  describe('clearAll', () => {
    test('should clear all storage', async () => {
      await storage.save(createTestState(123, 'form1'))
      await storage.save(createTestState(123, 'form2'))
      await storage.save(createTestState(456, 'form1'))

      storage.clearAll()

      expect(storage.getSize()).toBe(0)

      const loaded = await storage.load(123, 'form1')
      expect(loaded).toBeNull()
    })
  })
})
