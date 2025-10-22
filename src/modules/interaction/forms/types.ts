/**
 * Form Builder Types
 * أنواع بيانات نظام بناء النماذج
 */

/**
 * Field validation result
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
  value?: any
}

/**
 * Field validator function type
 */
export type FieldValidator = (value: any) => boolean | ValidationResult

/**
 * Field type enumeration
 */
export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  DATE = 'date',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  BOOLEAN = 'boolean',
  URL = 'url',
  PASSWORD = 'password',
}

/**
 * Field configuration interface
 */
export interface FieldConfig {
  name: string
  type: FieldType
  label: string
  description?: string
  required?: boolean
  defaultValue?: any
  validator?: FieldValidator
  options?: string[] // For SELECT and MULTI_SELECT types
  placeholder?: string
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
}

/**
 * Field state interface
 */
export interface FieldState {
  value: any
  touched: boolean
  dirty: boolean
  valid: boolean
  error?: string
}

/**
 * Form state interface
 */
export interface FormState {
  fields: Map<string, FieldState>
  isValid: boolean
  isSubmitting: boolean
  isDirty: boolean
  errors: Map<string, string>
}

/**
 * Form submission result
 */
export interface FormSubmitResult {
  success: boolean
  data?: Record<string, any>
  errors?: Record<string, string>
}

/**
 * Form configuration interface
 */
export interface FormConfig {
  id: string
  title: string
  description?: string
  fields: FieldConfig[]
  onSubmit?: (data: Record<string, any>) => Promise<FormSubmitResult>
  onCancel?: () => void
}

/**
 * Form step interface (for multi-step forms)
 */
export interface FormStep {
  id: string
  title: string
  description?: string
  fields: FieldConfig[]
}

/**
 * Multi-step form configuration
 */
export interface MultiStepFormConfig {
  id: string
  title: string
  description?: string
  steps: FormStep[]
  onStepComplete?: (stepId: string, data: Record<string, any>) => Promise<boolean>
  onSubmit?: (data: Record<string, any>) => Promise<FormSubmitResult>
}

/**
 * Form handler context interface
 */
export interface FormHandlerContext {
  userId: number
  chatId: number
  messageId?: number
  formId: string
  currentField?: string
}

/**
 * Form storage interface
 */
export interface FormStorage {
  save: (context: FormHandlerContext, state: FormState) => Promise<void>
  load: (context: FormHandlerContext) => Promise<FormState | null>
  delete: (context: FormHandlerContext) => Promise<void>
  clear: (userId: number) => Promise<void>
}
