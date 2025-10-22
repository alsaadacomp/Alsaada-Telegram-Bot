/**
 * Multi-Step Forms Types
 * أنواع بيانات نظام النماذج متعددة الخطوات
 */

import type { Context } from 'grammy'
import type { FieldConfig, FormSubmitResult, ValidationResult } from '../forms/types.js'

/**
 * Step execution result
 */
export interface StepResult {
  success: boolean
  data?: Record<string, any>
  error?: string
  shouldRetry?: boolean
}

/**
 * Step validator function type
 */
export type StepValidator = (data: Record<string, any>) => Promise<ValidationResult> | ValidationResult

/**
 * Step action type - executed before or after step
 */
export type StepAction = (
  data: Record<string, any>,
  context: any,
) => Promise<void> | void

/**
 * Navigation direction
 */
export enum NavigationDirection {
  NEXT = 'next',
  PREVIOUS = 'previous',
  JUMP = 'jump',
}

/**
 * Navigation result
 */
export interface NavigationResult {
  allowed: boolean
  targetStepIndex?: number
  reason?: string
}

/**
 * Step definition configuration
 */
export interface StepConfig {
  id: string
  title: string
  description?: string
  fields: FieldConfig[]
  validator?: StepValidator
  onEnter?: StepAction
  onExit?: StepAction
  canSkip?: boolean
  condition?: (allData: Record<string, any>) => boolean
}

/**
 * Step state
 */
export interface StepState {
  stepId: string
  stepIndex: number
  data: Record<string, any>
  isValid: boolean
  isComplete: boolean
  errors?: Record<string, string>
  visitedAt?: Date
  completedAt?: Date
}

/**
 * Multi-step form state
 */
export interface MultiStepFormState {
  formId: string
  userId: number
  chatId: number
  currentStepIndex: number
  steps: StepState[]
  allData: Record<string, any>
  isComplete: boolean
  startedAt: Date
  lastUpdatedAt: Date
  completedAt?: Date
}

/**
 * Progress information
 */
export interface ProgressInfo {
  currentStep: number
  totalSteps: number
  completedSteps: number
  percentage: number
  remainingSteps: number
}

/**
 * Multi-step form configuration
 */
export interface MultiStepFormConfig {
  id: string
  title: string
  description?: string
  steps: StepConfig[]
  allowBackNavigation?: boolean
  allowSkipSteps?: boolean
  saveProgress?: boolean
  onComplete?: (data: Record<string, any>) => Promise<FormSubmitResult>
  onCancel?: (data: Record<string, any>) => Promise<void>
  onStepChange?: (fromStep: number, toStep: number, data: Record<string, any>) => Promise<void>
}

/**
 * Multi-step form storage interface
 */
export interface MultiStepFormStorage {
  save: (state: MultiStepFormState) => Promise<void>
  load: (userId: number, formId: string) => Promise<MultiStepFormState | null>
  delete: (userId: number, formId: string) => Promise<void>
  clear: (userId: number) => Promise<void>
  getAllActive: (userId: number) => Promise<MultiStepFormState[]>
}

/**
 * Conversation context (simplified, no ConversationFlavor needed for types)
 */
export type FormConversationContext = Context

/**
 * Conversation type for forms
 */
export type FormConversation = any

/**
 * Step navigation options
 */
export interface NavigationOptions {
  direction: NavigationDirection
  targetStepId?: string
  targetStepIndex?: number
  skipValidation?: boolean
}

/**
 * Form completion result
 */
export interface FormCompletionResult {
  success: boolean
  data: Record<string, any>
  errors?: Record<string, string>
  message?: string
}
