/**
 * Multi-Step Forms Module
 * نظام النماذج متعددة الخطوات
 *
 * @module multi-step-forms
 *
 * This module provides a complete system for building and managing
 * multi-step forms with Telegram bots using grammy's conversations plugin.
 *
 * ## Features:
 * - 📝 Step-by-step form building
 * - ✅ Field validation per step
 * - 🔄 Navigation (next, previous, jump)
 * - 📊 Progress tracking
 * - 💾 State persistence
 * - 🎯 Conditional steps
 * - ⏱️ Time tracking
 * - 🌍 Multi-language support
 *
 * ## Usage:
 * ```typescript
 * import { MultiStepForm, ConversationFormHandler } from './multi-step-forms'
 *
 * const form = new MultiStepForm({
 *   id: 'user-registration',
 *   title: 'User Registration',
 *   steps: [
 *     {
 *       id: 'personal',
 *       title: 'Personal Information',
 *       fields: [...]
 *     },
 *     {
 *       id: 'contact',
 *       title: 'Contact Details',
 *       fields: [...]
 *     }
 *   ]
 * })
 *
 * const handler = new ConversationFormHandler(form, storage)
 * await handler.handle(ctx, conversation)
 * ```
 */

// Core components
export {
  MultiStepForm,
  ProgressTracker,
  StepDefinition,
  StepNavigation,
} from './core/index.js'

// Handlers
export {
  ConversationFormHandler,
  type FormContext,
} from './handlers/index.js'

// Storage
export { InMemoryMultiStepFormStorage } from './storage/index.js'

// Types
export type {
  FormCompletionResult,
  FormConversation,
  FormConversationContext,
  MultiStepFormConfig,
  MultiStepFormState,
  MultiStepFormStorage,
  NavigationDirection,
  NavigationOptions,
  NavigationResult,
  ProgressInfo,
  StepAction,
  StepConfig,
  StepResult,
  StepState,
  StepValidator,
} from './types.js'
