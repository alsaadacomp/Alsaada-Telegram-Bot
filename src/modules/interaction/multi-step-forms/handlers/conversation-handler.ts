/**
 * Conversation Form Handler
 * معالج النماذج مع conversations plugin
 */

import type { Context } from 'grammy'
import type { MultiStepForm } from '../core/multi-step-form.js'
import type { StepDefinition } from '../core/step-definition.js'
import type {
  FormCompletionResult,
  MultiStepFormState,
  MultiStepFormStorage,
  ProgressInfo,
} from '../types.js'

/**
 * Conversation context type (simplified)
 */
export type FormContext = Context

/**
 * Conversation Form Handler
 * Integrates multi-step forms with grammy conversations
 */
export class ConversationFormHandler {
  constructor(
    private readonly form: MultiStepForm,
    private readonly storage: MultiStepFormStorage,
  ) {}

  /**
   * Start or resume form conversation
   */
  async handle(ctx: FormContext, conversation: any): Promise<FormCompletionResult> {
    const userId = ctx.from?.id
    const chatId = ctx.chat?.id

    if (!userId || !chatId) {
      return {
        success: false,
        data: {},
        message: 'Invalid user or chat context',
      }
    }

    // Load or create form state
    let state = await this.storage.load(userId, this.form.id)

    if (!state) {
      state = this.form.createInitialState(userId, chatId)
      await ctx.reply(`📝 ${this.form.title}\n${this.form.description || ''}`)
    }
    else {
      await ctx.reply('📝 Resuming form...')
    }

    // Process form steps
    while (!state.isComplete) {
      const currentStep = this.form.getCurrentStep(state)
      if (!currentStep) {
        break
      }

      // Show step
      const stepResult = await this.processStep(ctx, conversation, state, currentStep)

      if (stepResult === 'cancel') {
        await this.form.cancel(state)
        await this.storage.delete(userId, this.form.id)
        return {
          success: false,
          data: state.allData,
          message: 'Form cancelled',
        }
      }

      if (stepResult === 'back') {
        // Move to previous step
        const newState = await this.form.moveToPreviousStep(state)
        if (newState) {
          state = newState
          await this.storage.save(state)
        }
        continue
      }

      // Update state with step data
      state = await this.form.updateCurrentStep(state, stepResult)
      await this.storage.save(state)

      // Check if this is the last step
      if (this.form.progressTracker.isLastStep(state)) {
        // Try to complete form
        const canComplete = this.form.canComplete(state)
        if (canComplete) {
          state.isComplete = true
          state.completedAt = new Date()
          break
        }
      }

      // Move to next step
      const newState = await this.form.moveToNextStep(state)
      if (!newState) {
        break
      }
      state = newState
      await this.storage.save(state)
    }

    // Complete form
    const result = await this.form.complete(state)

    if (result.success) {
      await this.storage.delete(userId, this.form.id)
      await ctx.reply('✅ Form completed successfully!')
    }

    return result
  }

  /**
   * Process a single step
   */
  private async processStep(
    ctx: FormContext,
    conversation: any,
    state: MultiStepFormState,
    step: StepDefinition,
  ): Promise<Record<string, any> | 'cancel' | 'back'> {
    // Show progress
    const progress = this.form.progressTracker.getProgress(state)
    await this.showProgress(ctx, progress)

    // Show step information
    await ctx.reply(`📋 ${step.title}\n${step.description || ''}`)

    // Collect data for each field
    const stepData: Record<string, any> = {}

    for (const field of step.fields) {
      const fieldValue = await this.collectFieldValue(ctx, conversation, field.getName(), field.getConfig())

      // Check for cancel/back commands
      if (fieldValue === 'cancel') {
        return 'cancel'
      }
      if (fieldValue === 'back') {
        return 'back'
      }

      stepData[field.getName()] = fieldValue
    }

    return stepData
  }

  /**
   * Collect value for a single field
   */
  private async collectFieldValue(
    ctx: FormContext,
    conversation: any,
    fieldName: string,
    fieldConfig: any,
  ): Promise<any> {
    const label = fieldConfig.label
    const required = fieldConfig.required ?? false
    const placeholder = fieldConfig.placeholder

    // Show field prompt
    let prompt = `${label}${required ? ' *' : ''}`
    if (placeholder) {
      prompt += `\n💡 ${placeholder}`
    }

    await ctx.reply(prompt)

    // Wait for user input
    const response = await conversation.wait()

    // Check for commands
    const text = response.message?.text?.trim()
    if (text === '/cancel') {
      return 'cancel'
    }
    if (text === '/back') {
      return 'back'
    }

    return text
  }

  /**
   * Show progress information
   */
  private async showProgress(ctx: FormContext, progress: ProgressInfo): Promise<void> {
    const message = this.form.progressTracker.getProgressMessage(
      { currentStepIndex: progress.currentStep - 1 } as any,
      'en',
    )
    await ctx.reply(message)
  }

  /**
   * Show form summary
   */
  async showSummary(ctx: FormContext, state: MultiStepFormState): Promise<void> {
    const summary = this.form.getSummary(state)
    await ctx.reply(`📊 Form Summary\n\n${summary}`)

    // Show all collected data
    let dataText = '\n📝 Collected Data:\n'
    for (const [key, value] of Object.entries(state.allData)) {
      dataText += `• ${key}: ${value}\n`
    }

    await ctx.reply(dataText)
  }
}
