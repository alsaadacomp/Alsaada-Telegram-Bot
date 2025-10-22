/**
 * Middleware Builder
 *
 * Fluent API for building middleware definitions.
 */

import type {
  IMiddlewareBuilder,
  MiddlewareCategory,
  MiddlewareCondition,
  MiddlewareDefinition,
  MiddlewareFn,
  MiddlewarePhase,
} from './types.js'

export class MiddlewareBuilder implements IMiddlewareBuilder {
  private definition: Partial<MiddlewareDefinition> = {
    enabled: true,
    priority: 100,
    conditions: [],
    dependencies: [],
    conflictsWith: [],
    settings: {},
    isAsync: true,
    retryOnError: false,
    maxRetries: 0,
  }

  id(id: string): IMiddlewareBuilder {
    this.definition.id = id
    return this
  }

  name(name: string): IMiddlewareBuilder {
    this.definition.name = name
    return this
  }

  description(description: string): IMiddlewareBuilder {
    this.definition.description = description
    return this
  }

  category(category: MiddlewareCategory): IMiddlewareBuilder {
    this.definition.category = category
    return this
  }

  phase(phase: MiddlewarePhase): IMiddlewareBuilder {
    this.definition.phase = phase
    return this
  }

  priority(priority: number): IMiddlewareBuilder {
    this.definition.priority = priority
    return this
  }

  enabled(enabled: boolean): IMiddlewareBuilder {
    this.definition.enabled = enabled
    return this
  }

  handler(handler: MiddlewareFn): IMiddlewareBuilder {
    this.definition.handler = handler
    return this
  }

  condition(condition: MiddlewareCondition): IMiddlewareBuilder {
    if (!this.definition.conditions) {
      this.definition.conditions = []
    }
    this.definition.conditions.push(condition)
    return this
  }

  conditions(conditions: MiddlewareCondition[]): IMiddlewareBuilder {
    this.definition.conditions = conditions
    return this
  }

  dependsOn(middlewareId: string): IMiddlewareBuilder {
    if (!this.definition.dependencies) {
      this.definition.dependencies = []
    }
    this.definition.dependencies.push(middlewareId)
    return this
  }

  conflictsWith(middlewareId: string): IMiddlewareBuilder {
    if (!this.definition.conflictsWith) {
      this.definition.conflictsWith = []
    }
    this.definition.conflictsWith.push(middlewareId)
    return this
  }

  settings(settings: Record<string, unknown>): IMiddlewareBuilder {
    this.definition.settings = settings
    return this
  }

  timeout(milliseconds: number): IMiddlewareBuilder {
    this.definition.timeout = milliseconds
    return this
  }

  retryOnError(enabled: boolean, maxRetries = 3): IMiddlewareBuilder {
    this.definition.retryOnError = enabled
    this.definition.maxRetries = maxRetries
    return this
  }

  group(group: string): IMiddlewareBuilder {
    this.definition.group = group
    return this
  }

  build(): MiddlewareDefinition {
    // Validate required fields
    if (!this.definition.id) {
      throw new Error('Middleware ID is required')
    }
    if (!this.definition.name) {
      throw new Error('Middleware name is required')
    }
    if (!this.definition.category) {
      throw new Error('Middleware category is required')
    }
    if (!this.definition.phase) {
      throw new Error('Middleware phase is required')
    }
    if (!this.definition.handler) {
      throw new Error('Middleware handler is required')
    }

    return this.definition as MiddlewareDefinition
  }

  /**
   * Create a new builder instance
   */
  static create(): MiddlewareBuilder {
    return new MiddlewareBuilder()
  }
}
