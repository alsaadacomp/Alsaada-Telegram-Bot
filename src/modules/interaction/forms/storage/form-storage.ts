/**
 * Form Storage Implementation
 * تخزين حالة النماذج
 */

import type { FormHandlerContext, FormState, FormStorage } from '../types.js'

/**
 * In-Memory Form Storage
 * For development and testing
 */
export class InMemoryFormStorage implements FormStorage {
  private storage: Map<string, FormState> = new Map()

  /**
   * Generate storage key from context
   */
  private getKey(context: FormHandlerContext): string {
    return `${context.userId}:${context.formId}`
  }

  /**
   * Save form state
   */
  async save(context: FormHandlerContext, state: FormState): Promise<void> {
    const key = this.getKey(context)
    this.storage.set(key, JSON.parse(JSON.stringify(state)))
  }

  /**
   * Load form state
   */
  async load(context: FormHandlerContext): Promise<FormState | null> {
    const key = this.getKey(context)
    const state = this.storage.get(key)
    return state ? JSON.parse(JSON.stringify(state)) : null
  }

  /**
   * Delete form state
   */
  async delete(context: FormHandlerContext): Promise<void> {
    const key = this.getKey(context)
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
   * Get all stored keys (for debugging)
   */
  getKeys(): string[] {
    return Array.from(this.storage.keys())
  }

  /**
   * Clear all storage
   */
  clearAll(): void {
    this.storage.clear()
  }
}

/**
 * Database Form Storage
 * Using Prisma for persistent storage
 */
export class DatabaseFormStorage implements FormStorage {
  /**
   * Save form state to database
   */
  async save(context: FormHandlerContext, state: FormState): Promise<void> {
    // TODO: Implement with Prisma
    // This would store the form state in a database table
    // Example:
    // await prisma.formState.upsert({
    //   where: {
    //     userId_formId: {
    //       userId: context.userId,
    //       formId: context.formId,
    //     },
    //   },
    //   update: {
    //     state: JSON.stringify(state),
    //     updatedAt: new Date(),
    //   },
    //   create: {
    //     userId: context.userId,
    //     formId: context.formId,
    //     state: JSON.stringify(state),
    //   },
    // })
    throw new Error('DatabaseFormStorage not implemented yet')
  }

  /**
   * Load form state from database
   */
  async load(context: FormHandlerContext): Promise<FormState | null> {
    // TODO: Implement with Prisma
    throw new Error('DatabaseFormStorage not implemented yet')
  }

  /**
   * Delete form state from database
   */
  async delete(context: FormHandlerContext): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error('DatabaseFormStorage not implemented yet')
  }

  /**
   * Clear all forms for a user from database
   */
  async clear(userId: number): Promise<void> {
    // TODO: Implement with Prisma
    throw new Error('DatabaseFormStorage not implemented yet')
  }
}
