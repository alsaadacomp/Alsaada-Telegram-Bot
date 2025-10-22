/**
 * Middleware Registry
 *
 * Central registry for managing bot middlewares with priority-based execution,
 * conditional loading, dependency management, and performance tracking.
 */

import type { Context } from '#root/bot/context.js'
import type {
  MiddlewareCategory,
  MiddlewareChainConfig,
  MiddlewareDefinition,
  MiddlewareEventData,
  MiddlewareExecutionResult,
  MiddlewareFn,
  MiddlewareListener,
  MiddlewareMetrics,
  MiddlewarePhase,
  MiddlewareQueryFilters,
  MiddlewareRegistrationOptions,
  MiddlewareUpdateOptions,
} from './types.js'
import { EventEmitter } from 'node:events'
import { logger } from '#root/modules/services/logger/index.js'

export class MiddlewareRegistry extends EventEmitter {
  private static instance: MiddlewareRegistry | null = null
  private middlewares = new Map<string, MiddlewareDefinition>()
  private metrics = new Map<string, MiddlewareMetrics>()
  private executionOrder: string[] = []

  private constructor() {
    super()
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MiddlewareRegistry {
    if (!MiddlewareRegistry.instance) {
      MiddlewareRegistry.instance = new MiddlewareRegistry()
    }
    return MiddlewareRegistry.instance
  }

  /**
   * Register a middleware
   */
  register(
    definition: MiddlewareDefinition,
    options: MiddlewareRegistrationOptions = {},
  ): boolean {
    const {
      override = false,
      validateDependencies = true,
      validateConflicts = true,
    } = options

    try {
      // Check if already registered
      if (this.middlewares.has(definition.id) && !override) {
        logger.warn(`Middleware '${definition.id}' already registered`)
        return false
      }

      // Validate dependencies
      if (validateDependencies && definition.dependencies) {
        for (const depId of definition.dependencies) {
          if (!this.middlewares.has(depId)) {
            logger.error(`Middleware '${definition.id}' depends on '${depId}' which is not registered`)
            return false
          }
        }
      }

      // Validate conflicts
      if (validateConflicts && definition.conflictsWith) {
        for (const conflictId of definition.conflictsWith) {
          if (this.middlewares.has(conflictId)) {
            logger.error(`Middleware '${definition.id}' conflicts with '${conflictId}' which is already registered`)
            return false
          }
        }
      }

      // Register middleware
      this.middlewares.set(definition.id, definition)

      // Initialize metrics
      this.metrics.set(definition.id, {
        middlewareId: definition.id,
        totalExecutions: 0,
        successfulExecutions: 0,
        failedExecutions: 0,
        skippedExecutions: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        lastExecutionTime: new Date(),
        errors: [],
      })

      // Rebuild execution order
      this.rebuildExecutionOrder()

      // Emit event
      this.emitEvent({
        middlewareId: definition.id,
        event: 'registered',
        timestamp: new Date(),
        data: definition,
      })

      logger.info({ id: definition.id, phase: definition.phase }, 'Middleware registered')
      return true
    }
    catch (error) {
      logger.error({ error, id: definition.id }, 'Failed to register middleware')
      return false
    }
  }

  /**
   * Unregister a middleware
   */
  unregister(id: string): boolean {
    try {
      if (!this.middlewares.has(id)) {
        logger.warn(`Middleware '${id}' not found`)
        return false
      }

      // Check if other middlewares depend on this one
      for (const [otherId, middleware] of this.middlewares.entries()) {
        if (middleware.dependencies?.includes(id)) {
          logger.error(`Cannot unregister '${id}': middleware '${otherId}' depends on it`)
          return false
        }
      }

      this.middlewares.delete(id)
      this.metrics.delete(id)

      // Rebuild execution order
      this.rebuildExecutionOrder()

      // Emit event
      this.emitEvent({
        middlewareId: id,
        event: 'unregistered',
        timestamp: new Date(),
      })

      logger.info({ id }, 'Middleware unregistered')
      return true
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to unregister middleware')
      return false
    }
  }

  /**
   * Get a middleware definition
   */
  get(id: string): MiddlewareDefinition | undefined {
    return this.middlewares.get(id)
  }

  /**
   * Get all middlewares matching filters
   */
  getAll(filters?: MiddlewareQueryFilters): MiddlewareDefinition[] {
    let result = Array.from(this.middlewares.values())

    if (filters?.id) {
      result = result.filter(m => m.id === filters.id)
    }

    if (filters?.ids) {
      result = result.filter(m => filters.ids!.includes(m.id))
    }

    if (filters?.category) {
      result = result.filter(m => m.category === filters.category)
    }

    if (filters?.phase) {
      result = result.filter(m => m.phase === filters.phase)
    }

    if (filters?.enabled !== undefined) {
      result = result.filter(m => m.enabled === filters.enabled)
    }

    if (filters?.group) {
      result = result.filter(m => m.group === filters.group)
    }

    return result
  }

  /**
   * Get enabled middlewares sorted by priority
   */
  getEnabled(config?: MiddlewareChainConfig): MiddlewareDefinition[] {
    let result = Array.from(this.middlewares.values()).filter(m => m.enabled)

    if (config?.phase) {
      result = result.filter(m => m.phase === config.phase)
    }

    if (config?.category) {
      result = result.filter(m => m.category === config.category)
    }

    if (config?.sortByPriority !== false) {
      result.sort((a, b) => a.priority - b.priority)
    }

    return result
  }

  /**
   * Update middleware settings
   */
  update(id: string, updates: MiddlewareUpdateOptions): boolean {
    try {
      const middleware = this.middlewares.get(id)
      if (!middleware) {
        logger.error(`Middleware '${id}' not found`)
        return false
      }

      // Apply updates
      if (updates.enabled !== undefined) {
        middleware.enabled = updates.enabled
      }

      if (updates.priority !== undefined) {
        middleware.priority = updates.priority
        this.rebuildExecutionOrder()
      }

      if (updates.settings) {
        middleware.settings = { ...middleware.settings, ...updates.settings }
      }

      if (updates.conditions) {
        middleware.conditions = updates.conditions
      }

      // Emit event
      this.emitEvent({
        middlewareId: id,
        event: 'updated',
        timestamp: new Date(),
        data: updates,
      })

      logger.info({ id, updates }, 'Middleware updated')
      return true
    }
    catch (error) {
      logger.error({ error, id }, 'Failed to update middleware')
      return false
    }
  }

  /**
   * Enable a middleware
   */
  enable(id: string): boolean {
    return this.update(id, { enabled: true })
  }

  /**
   * Disable a middleware
   */
  disable(id: string): boolean {
    return this.update(id, { enabled: false })
  }

  /**
   * Check if conditions are met for a middleware
   */
  async checkConditions(
    middleware: MiddlewareDefinition,
    ctx: Context,
  ): Promise<{ passed: boolean, reason?: string }> {
    if (!middleware.conditions || middleware.conditions.length === 0) {
      return { passed: true }
    }

    try {
      for (const condition of middleware.conditions) {
        const result = await condition(ctx)
        if (!result) {
          return {
            passed: false,
            reason: 'Condition not met',
          }
        }
      }

      return { passed: true }
    }
    catch (error) {
      logger.error({ error, middlewareId: middleware.id }, 'Error checking middleware conditions')
      return {
        passed: false,
        reason: 'Error evaluating conditions',
      }
    }
  }

  /**
   * Build middleware chain for grammy
   */
  buildChain(config?: MiddlewareChainConfig): MiddlewareFn[] {
    const middlewares = this.getEnabled(config)
    return middlewares.map(m => this.wrapMiddleware(m))
  }

  /**
   * Wrap middleware with execution tracking and error handling
   */
  private wrapMiddleware(middleware: MiddlewareDefinition): any {
    return async (ctx: Context, next: () => Promise<void>) => {
      const startTime = Date.now()
      const metrics = this.metrics.get(middleware.id)!

      try {
        // Check if middleware is enabled
        if (!middleware.enabled) {
          metrics.skippedExecutions++
          await next()
          return
        }

        // Check conditions
        const conditionCheck = await this.checkConditions(middleware, ctx)
        if (!conditionCheck.passed) {
          metrics.skippedExecutions++
          logger.debug({ middlewareId: middleware.id, reason: conditionCheck.reason }, 'Middleware skipped')

          this.emitEvent({
            middlewareId: middleware.id,
            event: 'executed',
            timestamp: new Date(),
            data: {
              skipped: true,
              reason: conditionCheck.reason,
            },
          })

          await next()
          return
        }

        // Execute middleware with optional timeout
        if (middleware.timeout) {
          await this.executeWithTimeout(middleware, ctx, next)
        }
        else {
          // Handle both function and object middleware types
          const handler = middleware.handler as any
          if (typeof handler === 'function') {
            await handler(ctx, next)
          }
          else if (handler && typeof handler.middleware === 'function') {
            await handler.middleware()(ctx, next)
          }
          else {
            throw new Error(`Invalid middleware handler for '${middleware.id}'`)
          }
        }

        // Update metrics
        const duration = Date.now() - startTime
        this.updateMetrics(middleware.id, duration, true)

        this.emitEvent({
          middlewareId: middleware.id,
          event: 'executed',
          timestamp: new Date(),
          data: { duration },
        })
      }
      catch (error) {
        const duration = Date.now() - startTime
        this.updateMetrics(middleware.id, duration, false, error as Error)

        this.emitEvent({
          middlewareId: middleware.id,
          event: 'error',
          timestamp: new Date(),
          error: error as Error,
        })

        logger.error({ error, middlewareId: middleware.id }, 'Middleware execution failed')

        // Retry if configured
        if (middleware.retryOnError && middleware.maxRetries && middleware.maxRetries > 0) {
          // TODO: Implement retry logic
          logger.debug({ middlewareId: middleware.id }, 'Retry logic not implemented yet')
        }

        throw error
      }
    }
  }

  /**
   * Execute middleware with timeout
   */
  private async executeWithTimeout(
    middleware: MiddlewareDefinition,
    ctx: Context,
    next: () => Promise<void>,
  ): Promise<void> {
    const timeout = middleware.timeout!

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Middleware '${middleware.id}' timed out after ${timeout}ms`))
      }, timeout)
    })

    // Handle both function and object middleware types
    const handler = middleware.handler as any
    let handlerPromise: Promise<void>

    if (typeof handler === 'function') {
      handlerPromise = handler(ctx, next)
    }
    else if (handler && typeof handler.middleware === 'function') {
      handlerPromise = handler.middleware()(ctx, next)
    }
    else {
      throw new Error(`Invalid middleware handler for '${middleware.id}'`)
    }

    await Promise.race([handlerPromise, timeoutPromise])
  }

  /**
   * Update middleware metrics
   */
  private updateMetrics(
    middlewareId: string,
    duration: number,
    success: boolean,
    error?: Error,
  ): void {
    const metrics = this.metrics.get(middlewareId)
    if (!metrics)
      return

    metrics.totalExecutions++
    metrics.lastExecutionTime = new Date()

    if (success) {
      metrics.successfulExecutions++
    }
    else {
      metrics.failedExecutions++
      if (error) {
        metrics.errors.push({
          timestamp: new Date(),
          error: error.message,
          context: error.stack,
        })
        // Keep only last 100 errors
        if (metrics.errors.length > 100) {
          metrics.errors.shift()
        }
      }
    }

    // Update duration metrics
    metrics.minDuration = Math.min(metrics.minDuration, duration)
    metrics.maxDuration = Math.max(metrics.maxDuration, duration)
    metrics.averageDuration
      = (metrics.averageDuration * (metrics.totalExecutions - 1) + duration)
        / metrics.totalExecutions
  }

  /**
   * Get middleware metrics
   */
  getMetrics(id: string): MiddlewareMetrics | undefined {
    return this.metrics.get(id)
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): MiddlewareMetrics[] {
    return Array.from(this.metrics.values())
  }

  /**
   * Reset metrics for a middleware
   */
  resetMetrics(id: string): boolean {
    const middleware = this.middlewares.get(id)
    if (!middleware)
      return false

    this.metrics.set(id, {
      middlewareId: id,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      skippedExecutions: 0,
      averageDuration: 0,
      minDuration: Infinity,
      maxDuration: 0,
      lastExecutionTime: new Date(),
      errors: [],
    })

    return true
  }

  /**
   * Rebuild execution order based on priorities and dependencies
   */
  private rebuildExecutionOrder(): void {
    const middlewares = Array.from(this.middlewares.values())

    // Sort by priority
    middlewares.sort((a, b) => a.priority - b.priority)

    // TODO: Topological sort based on dependencies

    this.executionOrder = middlewares.map(m => m.id)
  }

  /**
   * Get execution order
   */
  getExecutionOrder(): string[] {
    return [...this.executionOrder]
  }

  /**
   * Get middlewares by phase in execution order
   */
  getByPhase(phase: MiddlewarePhase): MiddlewareDefinition[] {
    return this.getEnabled({ phase, sortByPriority: true })
  }

  /**
   * Get middlewares by category
   */
  getByCategory(category: MiddlewareCategory): MiddlewareDefinition[] {
    return this.getAll({ category })
  }

  /**
   * Clear all middlewares
   */
  clear(): void {
    this.middlewares.clear()
    this.metrics.clear()
    this.executionOrder = []
    logger.info('All middlewares cleared')
  }

  /**
   * Get total count
   */
  count(): number {
    return this.middlewares.size
  }

  /**
   * Get enabled count
   */
  countEnabled(): number {
    return this.getEnabled().length
  }

  /**
   * Emit middleware event
   */
  private emitEvent(data: MiddlewareEventData): void {
    this.emit('middleware:event', data)
    this.emit(`middleware:${data.event}`, data)
  }

  /**
   * Add event listener
   */
  onEvent(event: string, listener: MiddlewareListener): void {
    this.on(`middleware:${event}`, listener)
  }

  /**
   * Remove event listener
   */
  offEvent(event: string, listener: MiddlewareListener): void {
    this.off(`middleware:${event}`, listener)
  }
}

// Export singleton instance
export const middlewareRegistry = MiddlewareRegistry.getInstance()
