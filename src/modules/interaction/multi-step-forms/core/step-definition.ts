/**
 * Step Definition
 * تعريف خطوة واحدة في النموذج متعدد الخطوات
 */

import type {
  ValidationResult,
} from '../../forms/types.js'
import type {
  StepAction,
  StepConfig,
  StepResult,
  StepState,
  StepValidator,
} from '../types.js'
import { Field } from '../../forms/field.js'

/**
 * Step Definition Class
 * Represents a single step in a multi-step form
 */
export class StepDefinition {
  public readonly id: string
  public readonly title: string
  public readonly description?: string
  public readonly fields: Field[]
  public readonly validator?: StepValidator
  public readonly onEnter?: StepAction
  public readonly onExit?: StepAction
  public readonly canSkip: boolean
  public readonly condition?: (allData: Record<string, any>) => boolean

  constructor(config: StepConfig) {
    this.id = config.id
    this.title = config.title
    this.description = config.description
    this.validator = config.validator
    this.onEnter = config.onEnter
    this.onExit = config.onExit
    this.canSkip = config.canSkip ?? false
    this.condition = config.condition

    // Create Field instances from FieldConfig
    this.fields = config.fields.map(fieldConfig => new Field(fieldConfig))
  }

  /**
   * Check if this step should be shown based on condition
   */
  shouldShow(allData: Record<string, any>): boolean {
    if (!this.condition)
      return true
    return this.condition(allData)
  }

  /**
   * Validate all fields in this step
   */
  async validate(data: Record<string, any>): Promise<ValidationResult> {
    const errors: string[] = []

    // Validate each field
    for (const field of this.fields) {
      const value = data[field.getName()]

      // Set and validate field value
      field.setValue(value)
      if (!field.isValid()) {
        errors.push(field.getError() || `Invalid value for ${field.getLabel()}`)
      }
    }

    // If there are field errors, return them
    if (errors.length > 0) {
      return {
        isValid: false,
        error: errors.join(', '),
      }
    }

    // Run custom validator if provided
    if (this.validator) {
      const result = await Promise.resolve(this.validator(data))
      return result
    }

    return { isValid: true }
  }

  /**
   * Execute step with data
   */
  async execute(data: Record<string, any>, context?: any): Promise<StepResult> {
    try {
      // Run onEnter hook
      if (this.onEnter) {
        await Promise.resolve(this.onEnter(data, context))
      }

      // Validate step data
      const validationResult = await this.validate(data)

      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error,
          shouldRetry: true,
        }
      }

      // Run onExit hook
      if (this.onExit) {
        await Promise.resolve(this.onExit(data, context))
      }

      return {
        success: true,
        data,
      }
    }
    catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        shouldRetry: false,
      }
    }
  }

  /**
   * Get field by name
   */
  getField(name: string): Field | undefined {
    return this.fields.find(field => field.getName() === name)
  }

  /**
   * Get all field names
   */
  getFieldNames(): string[] {
    return this.fields.map(field => field.getName())
  }

  /**
   * Create initial step state
   */
  createInitialState(stepIndex: number): StepState {
    return {
      stepId: this.id,
      stepIndex,
      data: {},
      isValid: false,
      isComplete: false,
      visitedAt: new Date(),
    }
  }

  /**
   * Update step state with new data
   */
  async updateState(state: StepState, data: Record<string, any>): Promise<StepState> {
    const validationResult = await this.validate(data)

    return {
      ...state,
      data: { ...state.data, ...data },
      isValid: validationResult.isValid,
      isComplete: validationResult.isValid,
      errors: validationResult.isValid ? undefined : { general: validationResult.error || 'Validation failed' },
      completedAt: validationResult.isValid ? new Date() : undefined,
    }
  }

  /**
   * Get step summary for display
   */
  getSummary(): string {
    const fieldCount = this.fields.length
    const requiredCount = this.fields.filter(f => f.isRequired()).length
    return `${this.title} (${fieldCount} fields, ${requiredCount} required)`
  }
}
