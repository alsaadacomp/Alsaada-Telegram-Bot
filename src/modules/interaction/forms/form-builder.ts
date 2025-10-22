/**
 * Form Builder Class
 * فئة بناء النماذج
 */

import type { FieldConfig, FieldType, FieldValidator, FormConfig, FormState, FormSubmitResult } from './types.js'
import { Field } from './field.js'

/**
 * Form Builder Class
 * Fluent API for building forms with validation
 */
export class FormBuilder {
  private fields: Map<string, Field> = new Map()
  private config: Partial<FormConfig>

  constructor(id: string, title: string) {
    this.config = {
      id,
      title,
      fields: [],
    }
  }

  /**
   * Set form description
   */
  setDescription(description: string): this {
    this.config.description = description
    return this
  }

  /**
   * Add a field to the form
   */
  addField(config: FieldConfig): this {
    const field = new Field(config)
    this.fields.set(config.name, field)
    this.config.fields?.push(config)
    return this
  }

  /**
   * Add a text field
   */
  addTextField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: string
      validator?: FieldValidator
      placeholder?: string
      minLength?: number
      maxLength?: number
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'text' as FieldType,
      ...options,
    })
  }

  /**
   * Add an email field
   */
  addEmailField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: string
      validator?: FieldValidator
      placeholder?: string
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'email' as FieldType,
      ...options,
    })
  }

  /**
   * Add a phone field
   */
  addPhoneField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: string
      validator?: FieldValidator
      placeholder?: string
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'phone' as FieldType,
      ...options,
    })
  }

  /**
   * Add a number field
   */
  addNumberField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: number
      validator?: FieldValidator
      placeholder?: string
      min?: number
      max?: number
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'number' as FieldType,
      ...options,
    })
  }

  /**
   * Add a date field
   */
  addDateField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: Date
      validator?: FieldValidator
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'date' as FieldType,
      ...options,
    })
  }

  /**
   * Add a select field
   */
  addSelectField(
    name: string,
    label: string,
    options: string[],
    config?: {
      required?: boolean
      defaultValue?: string
      validator?: FieldValidator
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'select' as FieldType,
      options,
      ...config,
    })
  }

  /**
   * Add a multi-select field
   */
  addMultiSelectField(
    name: string,
    label: string,
    options: string[],
    config?: {
      required?: boolean
      defaultValue?: string[]
      validator?: FieldValidator
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'multi_select' as FieldType,
      options,
      ...config,
    })
  }

  /**
   * Add a boolean field
   */
  addBooleanField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: boolean
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'boolean' as FieldType,
      ...options,
    })
  }

  /**
   * Add a URL field
   */
  addUrlField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      defaultValue?: string
      validator?: FieldValidator
      placeholder?: string
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'url' as FieldType,
      ...options,
    })
  }

  /**
   * Add a password field
   */
  addPasswordField(
    name: string,
    label: string,
    options?: {
      required?: boolean
      validator?: FieldValidator
      minLength?: number
      maxLength?: number
      description?: string
    },
  ): this {
    return this.addField({
      name,
      label,
      type: 'password' as FieldType,
      ...options,
    })
  }

  /**
   * Set form submit handler
   */
  onSubmit(handler: (data: Record<string, any>) => Promise<FormSubmitResult>): this {
    this.config.onSubmit = handler
    return this
  }

  /**
   * Set form cancel handler
   */
  onCancel(handler: () => void): this {
    this.config.onCancel = handler
    return this
  }

  /**
   * Get field by name
   */
  getField(name: string): Field | undefined {
    return this.fields.get(name)
  }

  /**
   * Get all fields
   */
  getFields(): Field[] {
    return Array.from(this.fields.values())
  }

  /**
   * Get form configuration
   */
  getConfig(): FormConfig {
    return this.config as FormConfig
  }

  /**
   * Get form state
   */
  getState(): FormState {
    const fieldStates = new Map<string, any>()
    const errors = new Map<string, string>()
    let isValid = true
    let isDirty = false

    for (const [name, field] of this.fields) {
      const state = field.getState()
      fieldStates.set(name, state)

      if (!state.valid) {
        isValid = false
        if (state.error) {
          errors.set(name, state.error)
        }
      }

      if (state.dirty) {
        isDirty = true
      }
    }

    return {
      fields: fieldStates,
      isValid,
      isSubmitting: false,
      isDirty,
      errors,
    }
  }

  /**
   * Set field value
   */
  setFieldValue(name: string, value: any): void {
    const field = this.fields.get(name)
    if (field) {
      field.setValue(value)
    }
  }

  /**
   * Validate all fields
   */
  validate(): boolean {
    let isValid = true

    for (const field of this.fields.values()) {
      const result = field.validate()
      if (!result.isValid) {
        isValid = false
      }
    }

    return isValid
  }

  /**
   * Get form data
   */
  getData(): Record<string, any> {
    const data: Record<string, any> = {}

    for (const [name, field] of this.fields) {
      data[name] = field.getValue()
    }

    return data
  }

  /**
   * Set form data
   */
  setData(data: Record<string, any>): void {
    for (const [name, value] of Object.entries(data)) {
      this.setFieldValue(name, value)
    }
  }

  /**
   * Reset form
   */
  reset(): void {
    for (const field of this.fields.values()) {
      field.reset()
    }
  }

  /**
   * Submit form
   */
  async submit(): Promise<FormSubmitResult> {
    // Validate all fields
    const isValid = this.validate()

    if (!isValid) {
      const errors: Record<string, string> = {}
      for (const [name, field] of this.fields) {
        const error = field.getError()
        if (error) {
          errors[name] = error
        }
      }

      return {
        success: false,
        errors,
      }
    }

    // Call submit handler if provided
    if (this.config.onSubmit) {
      return await this.config.onSubmit(this.getData())
    }

    // Default success response
    return {
      success: true,
      data: this.getData(),
    }
  }

  /**
   * Build and return the form
   */
  build(): Form {
    return new Form(this)
  }
}

/**
 * Form Class
 * Represents a built form instance
 */
export class Form {
  private builder: FormBuilder

  constructor(builder: FormBuilder) {
    this.builder = builder
  }

  /**
   * Get form configuration
   */
  getConfig(): FormConfig {
    return this.builder.getConfig()
  }

  /**
   * Get form state
   */
  getState(): FormState {
    return this.builder.getState()
  }

  /**
   * Get field by name
   */
  getField(name: string): Field | undefined {
    return this.builder.getField(name)
  }

  /**
   * Get all fields
   */
  getFields(): Field[] {
    return this.builder.getFields()
  }

  /**
   * Set field value
   */
  setFieldValue(name: string, value: any): void {
    this.builder.setFieldValue(name, value)
  }

  /**
   * Validate form
   */
  validate(): boolean {
    return this.builder.validate()
  }

  /**
   * Get form data
   */
  getData(): Record<string, any> {
    return this.builder.getData()
  }

  /**
   * Set form data
   */
  setData(data: Record<string, any>): void {
    this.builder.setData(data)
  }

  /**
   * Reset form
   */
  reset(): void {
    this.builder.reset()
  }

  /**
   * Submit form
   */
  async submit(): Promise<FormSubmitResult> {
    return await this.builder.submit()
  }
}
