/**
 * Form Field Class
 * فئة حقل النموذج
 */

import type { FieldConfig, FieldState, FieldType, FieldValidator, ValidationResult } from './types.js'

/**
 * Form Field Class
 * Represents a single field in a form with validation
 */
export class Field {
  private config: FieldConfig
  private state: FieldState

  constructor(config: FieldConfig) {
    this.config = config
    this.state = {
      value: config.defaultValue ?? null,
      touched: false,
      dirty: false,
      valid: !config.required, // If not required, it's valid by default
      error: undefined,
    }
  }

  /**
   * Get field configuration
   */
  getConfig(): FieldConfig {
    return { ...this.config }
  }

  /**
   * Get field state
   */
  getState(): FieldState {
    return { ...this.state }
  }

  /**
   * Get field name
   */
  getName(): string {
    return this.config.name
  }

  /**
   * Get field type
   */
  getType(): FieldType {
    return this.config.type
  }

  /**
   * Get field label
   */
  getLabel(): string {
    return this.config.label
  }

  /**
   * Get field value
   */
  getValue(): any {
    return this.state.value
  }

  /**
   * Set field value
   */
  setValue(value: any): void {
    this.state.value = value
    this.state.dirty = true
    this.validate()
  }

  /**
   * Mark field as touched
   */
  setTouched(touched = true): void {
    this.state.touched = touched
  }

  /**
   * Check if field is required
   */
  isRequired(): boolean {
    return this.config.required ?? false
  }

  /**
   * Check if field is valid
   */
  isValid(): boolean {
    return this.state.valid
  }

  /**
   * Get validation error message
   */
  getError(): string | undefined {
    return this.state.error
  }

  /**
   * Validate field value
   */
  validate(): ValidationResult {
    // Reset error
    this.state.error = undefined
    this.state.valid = true

    // Check if required
    if (this.config.required && (this.state.value === null || this.state.value === undefined || this.state.value === '')) {
      this.state.valid = false
      this.state.error = `${this.config.label} is required`
      return { isValid: false, error: this.state.error }
    }

    // Skip validation if empty and not required
    if (!this.config.required && (this.state.value === null || this.state.value === undefined || this.state.value === '')) {
      return { isValid: true, value: this.state.value }
    }

    // Run custom validator if provided
    if (this.config.validator) {
      const result = this.config.validator(this.state.value)

      if (typeof result === 'boolean') {
        this.state.valid = result
        if (!result) {
          this.state.error = `Invalid ${this.config.label}`
        }
        return { isValid: result, error: this.state.error, value: this.state.value }
      }
      else {
        this.state.valid = result.isValid
        this.state.error = result.error
        return result
      }
    }

    // Built-in validations based on field type
    const builtInValidation = this.validateByType()
    this.state.valid = builtInValidation.isValid
    this.state.error = builtInValidation.error

    return builtInValidation
  }

  /**
   * Built-in validation based on field type
   */
  private validateByType(): ValidationResult {
    const value = this.state.value

    switch (this.config.type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          return { isValid: false, error: 'Invalid email format' }
        }
        break

      case 'phone':
        const phoneRegex = /^\+?[\d\s-()]+$/
        if (!phoneRegex.test(value)) {
          return { isValid: false, error: 'Invalid phone number' }
        }
        break

      case 'number':
        const num = Number(value)
        if (isNaN(num)) {
          return { isValid: false, error: 'Must be a valid number' }
        }
        if (this.config.min !== undefined && num < this.config.min) {
          return { isValid: false, error: `Must be at least ${this.config.min}` }
        }
        if (this.config.max !== undefined && num > this.config.max) {
          return { isValid: false, error: `Must be at most ${this.config.max}` }
        }
        break

      case 'text':
      case 'password':
        const text = String(value)
        if (this.config.minLength !== undefined && text.length < this.config.minLength) {
          return { isValid: false, error: `Must be at least ${this.config.minLength} characters` }
        }
        if (this.config.maxLength !== undefined && text.length > this.config.maxLength) {
          return { isValid: false, error: `Must be at most ${this.config.maxLength} characters` }
        }
        break

      case 'url':
        try {
          const url = new URL(value)
          if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return { isValid: false, error: 'URL must use http or https protocol' }
          }
        }
        catch {
          return { isValid: false, error: 'Invalid URL format' }
        }
        break

      case 'select':
        if (this.config.options && !this.config.options.includes(value)) {
          return { isValid: false, error: 'Invalid selection' }
        }
        break

      case 'multi_select':
        if (this.config.options && Array.isArray(value)) {
          for (const item of value) {
            if (!this.config.options.includes(item)) {
              return { isValid: false, error: 'Invalid selection' }
            }
          }
        }
        else {
          return { isValid: false, error: 'Must be an array' }
        }
        break
    }

    return { isValid: true, value }
  }

  /**
   * Reset field to initial state
   */
  reset(): void {
    this.state = {
      value: this.config.defaultValue ?? null,
      touched: false,
      dirty: false,
      valid: !this.config.required,
      error: undefined,
    }
  }

  /**
   * Get field as plain object
   */
  toJSON(): { config: FieldConfig, state: FieldState } {
    return {
      config: this.getConfig(),
      state: this.getState(),
    }
  }
}
