/**
 * Form Storage Tests
 */

import type { FormHandlerContext, FormState } from '../../../../src/modules/interaction/forms/types.js'
import { InMemoryFormStorage } from '../../../../src/modules/interaction/forms/storage/index.js'

describe('inMemoryFormStorage', () => {
  let storage: InMemoryFormStorage

  beforeEach(() => {
    storage = new InMemoryFormStorage()
  })

  describe('save and Load', () => {
    it('should save and load form state', async () => {
      const context: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'test-form',
      }

      const state: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(context, state)
      const loaded = await storage.load(context)

      expect(loaded).toBeDefined()
      expect(loaded?.isValid).toBe(true)
    })

    it('should return null when loading non-existent state', async () => {
      const context: FormHandlerContext = {
        userId: 999,
        chatId: 888,
        formId: 'non-existent',
      }

      const loaded = await storage.load(context)

      expect(loaded).toBeNull()
    })

    it('should overwrite existing state on save', async () => {
      const context: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'test-form',
      }

      const state1: FormState = {
        fields: new Map(),
        isValid: false,
        isSubmitting: false,
        isDirty: true,
        errors: new Map(),
      }

      const state2: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(context, state1)
      await storage.save(context, state2)
      const loaded = await storage.load(context)

      expect(loaded?.isValid).toBe(true)
      expect(loaded?.isDirty).toBe(false)
    })
  })

  describe('delete', () => {
    it('should delete form state', async () => {
      const context: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'test-form',
      }

      const state: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(context, state)
      await storage.delete(context)
      const loaded = await storage.load(context)

      expect(loaded).toBeNull()
    })

    it('should not throw error when deleting non-existent state', async () => {
      const context: FormHandlerContext = {
        userId: 999,
        chatId: 888,
        formId: 'non-existent',
      }

      await expect(storage.delete(context)).resolves.not.toThrow()
    })
  })

  describe('clear User Forms', () => {
    it('should clear all forms for a user', async () => {
      const user123Form1: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'form1',
      }

      const user123Form2: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'form2',
      }

      const user456Form1: FormHandlerContext = {
        userId: 456,
        chatId: 789,
        formId: 'form1',
      }

      const state: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(user123Form1, state)
      await storage.save(user123Form2, state)
      await storage.save(user456Form1, state)

      await storage.clear(123)

      expect(await storage.load(user123Form1)).toBeNull()
      expect(await storage.load(user123Form2)).toBeNull()
      expect(await storage.load(user456Form1)).toBeDefined()
    })
  })

  describe('storage Isolation', () => {
    it('should isolate states by user and form ID', async () => {
      const user1Form1: FormHandlerContext = {
        userId: 1,
        chatId: 100,
        formId: 'form1',
      }

      const user2Form1: FormHandlerContext = {
        userId: 2,
        chatId: 200,
        formId: 'form1',
      }

      const state1: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      const state2: FormState = {
        fields: new Map(),
        isValid: false,
        isSubmitting: true,
        isDirty: true,
        errors: new Map(),
      }

      await storage.save(user1Form1, state1)
      await storage.save(user2Form1, state2)

      const loaded1 = await storage.load(user1Form1)
      const loaded2 = await storage.load(user2Form1)

      expect(loaded1?.isValid).toBe(true)
      expect(loaded2?.isValid).toBe(false)
    })
  })

  describe('utility Methods', () => {
    it('should get all storage keys', async () => {
      const context1: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'form1',
      }

      const context2: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'form2',
      }

      const state: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(context1, state)
      await storage.save(context2, state)

      const keys = storage.getKeys()

      expect(keys).toHaveLength(2)
      expect(keys).toContain('123:form1')
      expect(keys).toContain('123:form2')
    })

    it('should clear all storage', async () => {
      const context: FormHandlerContext = {
        userId: 123,
        chatId: 456,
        formId: 'test',
      }

      const state: FormState = {
        fields: new Map(),
        isValid: true,
        isSubmitting: false,
        isDirty: false,
        errors: new Map(),
      }

      await storage.save(context, state)
      storage.clearAll()

      const keys = storage.getKeys()
      expect(keys).toHaveLength(0)

      const loaded = await storage.load(context)
      expect(loaded).toBeNull()
    })
  })
})
