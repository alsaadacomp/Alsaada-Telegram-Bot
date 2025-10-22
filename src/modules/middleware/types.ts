/**
 * Middleware Builder Types
 *
 * Type definitions for the advanced middleware management system.
 */

import type { Context } from '#root/bot/context.js'
import type { Middleware, NextFunction } from 'grammy'

/**
 * Middleware function type
 */
export type MiddlewareFn = Middleware<Context>

/**
 * Middleware condition function
 */
export type MiddlewareCondition = (ctx: Context) => boolean | Promise<boolean>

/**
 * Middleware lifecycle phase
 */
export type MiddlewarePhase =
  | 'pre-authentication' // Before user authentication
  | 'authentication' // During user authentication
  | 'post-authentication' // After user authentication
  | 'pre-processing' // Before main processing
  | 'processing' // Main processing phase
  | 'post-processing' // After main processing
  | 'error-handling' // Error handling phase
  | 'cleanup' // Cleanup phase

/**
 * Middleware category for organization
 */
export type MiddlewareCategory =
  | 'security'
  | 'logging'
  | 'validation'
  | 'rate-limiting'
  | 'caching'
  | 'transformation'
  | 'feature'
  | 'utility'
  | 'custom'

/**
 * Middleware definition
 */
export interface MiddlewareDefinition {
  id: string
  name: string
  description?: string
  category: MiddlewareCategory
  phase: MiddlewarePhase
  priority: number // Lower number = higher priority
  enabled: boolean
  handler: MiddlewareFn
  conditions?: MiddlewareCondition[]
  dependencies?: string[] // IDs of required middlewares
  conflictsWith?: string[] // IDs of conflicting middlewares
  settings?: Record<string, unknown>
  isAsync?: boolean
  timeout?: number // Timeout in milliseconds
  retryOnError?: boolean
  maxRetries?: number
  order?: number // Display order in UI
  group?: string // For grouping in UI
}

/**
 * Middleware execution context
 */
export interface MiddlewareExecutionContext {
  middlewareId: string
  startTime: number
  endTime?: number
  duration?: number
  error?: Error
  skipped?: boolean
  skipReason?: string
}

/**
 * Middleware execution result
 */
export interface MiddlewareExecutionResult {
  success: boolean
  middlewareId: string
  duration: number
  error?: Error
  skipped?: boolean
  skipReason?: string
}

/**
 * Middleware performance metrics
 */
export interface MiddlewareMetrics {
  middlewareId: string
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  skippedExecutions: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  lastExecutionTime: Date
  errors: Array<{
    timestamp: Date
    error: string
    context?: any
  }>
}

/**
 * Middleware chain configuration
 */
export interface MiddlewareChainConfig {
  phase?: MiddlewarePhase
  category?: MiddlewareCategory
  enabled?: boolean
  sortByPriority?: boolean
}

/**
 * Middleware registration options
 */
export interface MiddlewareRegistrationOptions {
  override?: boolean // Override existing middleware with same ID
  validateDependencies?: boolean
  validateConflicts?: boolean
}

/**
 * Middleware update options
 */
export interface MiddlewareUpdateOptions {
  enabled?: boolean
  priority?: number
  settings?: Record<string, unknown>
  conditions?: MiddlewareCondition[]
}

/**
 * Middleware query filters
 */
export interface MiddlewareQueryFilters {
  id?: string
  ids?: string[]
  category?: MiddlewareCategory
  phase?: MiddlewarePhase
  enabled?: boolean
  group?: string
}

/**
 * Middleware export format
 */
export interface MiddlewareExport {
  id: string
  name: string
  description?: string
  category: MiddlewareCategory
  phase: MiddlewarePhase
  priority: number
  enabled: boolean
  settings?: Record<string, unknown>
  dependencies?: string[]
  conflictsWith?: string[]
}

/**
 * Middleware import result
 */
export interface MiddlewareImportResult {
  success: boolean
  imported: number
  failed: number
  errors: Array<{
    id: string
    error: string
  }>
}

/**
 * Middleware builder interface
 */
export interface IMiddlewareBuilder {
  /**
   * Set middleware ID
   */
  id: (id: string) => IMiddlewareBuilder

  /**
   * Set middleware name
   */
  name: (name: string) => IMiddlewareBuilder

  /**
   * Set middleware description
   */
  description: (description: string) => IMiddlewareBuilder

  /**
   * Set middleware category
   */
  category: (category: MiddlewareCategory) => IMiddlewareBuilder

  /**
   * Set middleware phase
   */
  phase: (phase: MiddlewarePhase) => IMiddlewareBuilder

  /**
   * Set middleware priority
   */
  priority: (priority: number) => IMiddlewareBuilder

  /**
   * Set middleware enabled state
   */
  enabled: (enabled: boolean) => IMiddlewareBuilder

  /**
   * Set middleware handler
   */
  handler: (handler: MiddlewareFn) => IMiddlewareBuilder

  /**
   * Add a condition
   */
  condition: (condition: MiddlewareCondition) => IMiddlewareBuilder

  /**
   * Add multiple conditions
   */
  conditions: (conditions: MiddlewareCondition[]) => IMiddlewareBuilder

  /**
   * Add a dependency
   */
  dependsOn: (middlewareId: string) => IMiddlewareBuilder

  /**
   * Add a conflict
   */
  conflictsWith: (middlewareId: string) => IMiddlewareBuilder

  /**
   * Set settings
   */
  settings: (settings: Record<string, unknown>) => IMiddlewareBuilder

  /**
   * Set timeout
   */
  timeout: (milliseconds: number) => IMiddlewareBuilder

  /**
   * Enable retry on error
   */
  retryOnError: (enabled: boolean, maxRetries?: number) => IMiddlewareBuilder

  /**
   * Set group
   */
  group: (group: string) => IMiddlewareBuilder

  /**
   * Build the middleware definition
   */
  build: () => MiddlewareDefinition
}

/**
 * Middleware event types
 */
export type MiddlewareEvent =
  | 'registered'
  | 'unregistered'
  | 'enabled'
  | 'disabled'
  | 'updated'
  | 'executed'
  | 'error'
  | 'timeout'

/**
 * Middleware event data
 */
export interface MiddlewareEventData {
  middlewareId: string
  event: MiddlewareEvent
  timestamp: Date
  data?: any
  error?: Error
}

/**
 * Middleware listener
 */
export type MiddlewareListener = (data: MiddlewareEventData) => void | Promise<void>
