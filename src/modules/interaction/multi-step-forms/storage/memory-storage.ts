/**
 * In-Memory Multi-Step Form Storage
 * تخزين النماذج متعددة الخطوات في الذاكرة
 */

import type {
  MultiStepFormState,
  MultiStepFormStorage,
} from '../types.js'

/**
 * In-Memory Storage Implementation
 * Simple storage for development and testing
 */
export class InMemoryMultiStepFormStorage implements MultiStepFormStorage {
  private storage: Map<string, MultiStepFormState>

  constructor() {
    this.storage = new Map()
  }

  /**
   * Generate storage key
   */
  private getKey(userId: number, formId: string): string {
    return `${userId}:${formId}`
  }

  /**
   * Save form state
   */
  async save(state: MultiStepFormState): Promise<void> {
    const key = this.getKey(state.userId, state.formId)
    // Deep clone to prevent mutations
    this.storage.set(key, JSON.parse(JSON.stringify(state)))
  }

  /**
   * Load form state
   */
  async load(userId: number, formId: string): Promise<MultiStepFormState | null> {
    const key = this.getKey(userId, formId)
    const state = this.storage.get(key)

    if (!state) {
      return null
    }

    // Deep clone and restore dates
    const cloned = JSON.parse(JSON.stringify(state))
    cloned.startedAt = new Date(cloned.startedAt)
    cloned.lastUpdatedAt = new Date(cloned.lastUpdatedAt)
    if (cloned.completedAt) {
      cloned.completedAt = new Date(cloned.completedAt)
    }

    // Restore dates in steps
    cloned.steps = cloned.steps.map((step: any) => {
      if (step?.visitedAt) {
        step.visitedAt = new Date(step.visitedAt)
      }
      if (step?.completedAt) {
        step.completedAt = new Date(step.completedAt)
      }
      return step
    })

    return cloned
  }

  /**
   * Delete form state
   */
  async delete(userId: number, formId: string): Promise<void> {
    const key = this.getKey(userId, formId)
    this.storage.delete(key)
  }

  /**
   * Clear all forms for a user
   */
  async clear(userId: number): Promise<void> {
    const keysToDelete: string[] = []

    for (const key of this.storage.keys()) {
      if (key.startsWith(`${userId}:`)) {
        keysToDelete.push(key)
      }
    }

    for (const key of keysToDelete) {
      this.storage.delete(key)
    }
  }

  /**
   * Get all active forms for a user
   */
  async getAllActive(userId: number): Promise<MultiStepFormState[]> {
    const states: MultiStepFormState[] = []

    for (const [key, state] of this.storage.entries()) {
      if (key.startsWith(`${userId}:`) && !state.isComplete) {
        // Restore dates
        const cloned = JSON.parse(JSON.stringify(state))
        cloned.startedAt = new Date(cloned.startedAt)
        cloned.lastUpdatedAt = new Date(cloned.lastUpdatedAt)

        cloned.steps = cloned.steps.map((step: any) => {
          if (step?.visitedAt) {
            step.visitedAt = new Date(step.visitedAt)
          }
          if (step?.completedAt) {
            step.completedAt = new Date(step.completedAt)
          }
          return step
        })

        states.push(cloned)
      }
    }

    return states
  }

  /**
   * Get storage size
   */
  getSize(): number {
    return this.storage.size
  }

  /**
   * Clear all storage (for testing)
   */
  clearAll(): void {
    this.storage.clear()
  }
}
