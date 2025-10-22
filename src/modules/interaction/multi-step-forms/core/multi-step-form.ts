/**
 * Multi-Step Form
 * إدارة النموذج متعدد الخطوات
 */

import type {
  FormCompletionResult,
  MultiStepFormConfig,
  MultiStepFormState,
  StepState,
} from '../types.js'
import { ProgressTracker } from './progress-tracker.js'
import { StepDefinition } from './step-definition.js'
import { StepNavigation } from './step-navigation.js'

/**
 * Multi-Step Form Class
 * Main class for managing multi-step forms
 */
export class MultiStepForm {
  public readonly id: string
  public readonly title: string
  public readonly description?: string
  public readonly navigation: StepNavigation
  public readonly progressTracker: ProgressTracker
  private readonly steps: StepDefinition[]
  private readonly config: MultiStepFormConfig

  constructor(config: MultiStepFormConfig) {
    this.config = config
    this.id = config.id
    this.title = config.title
    this.description = config.description

    // Create step definitions
    this.steps = config.steps.map(stepConfig => new StepDefinition(stepConfig))

    // Initialize navigation
    this.navigation = new StepNavigation(config.steps, {
      allowBackNavigation: config.allowBackNavigation,
      allowSkipSteps: config.allowSkipSteps,
    })

    // Initialize progress tracker
    this.progressTracker = new ProgressTracker(this.navigation)
  }

  /**
   * Create initial form state
   */
  createInitialState(userId: number, chatId: number): MultiStepFormState {
    const steps: StepState[] = this.steps.map((step, index) => step.createInitialState(index))

    return {
      formId: this.id,
      userId,
      chatId,
      currentStepIndex: 0,
      steps,
      allData: {},
      isComplete: false,
      startedAt: new Date(),
      lastUpdatedAt: new Date(),
    }
  }

  /**
   * Get current step
   */
  getCurrentStep(state: MultiStepFormState): StepDefinition | undefined {
    return this.steps[state.currentStepIndex]
  }

  /**
   * Get current step state
   */
  getCurrentStepState(state: MultiStepFormState): StepState | undefined {
    return state.steps[state.currentStepIndex]
  }

  /**
   * Update current step with new data
   */
  async updateCurrentStep(
    state: MultiStepFormState,
    data: Record<string, any>,
  ): Promise<MultiStepFormState> {
    const currentStep = this.getCurrentStep(state)
    if (!currentStep) {
      throw new Error('Current step not found')
    }

    const currentStepState = state.steps[state.currentStepIndex]
    if (!currentStepState) {
      throw new Error('Current step state not found')
    }

    // Update step state
    const updatedStepState = await currentStep.updateState(currentStepState, data)

    // Update steps array
    const updatedSteps = [...state.steps]
    updatedSteps[state.currentStepIndex] = updatedStepState

    // Merge data into allData
    const allData = { ...state.allData, ...data }

    return {
      ...state,
      steps: updatedSteps,
      allData,
      lastUpdatedAt: new Date(),
    }
  }

  /**
   * Move to next step
   */
  async moveToNextStep(state: MultiStepFormState): Promise<MultiStepFormState | null> {
    // Check if current step is valid
    const currentStepState = state.steps[state.currentStepIndex]
    if (!currentStepState?.isValid) {
      return null
    }

    // Call onStepChange hook if provided
    if (this.config.onStepChange) {
      const nextIndex = this.navigation.getNextVisibleStepIndex(
        state.currentStepIndex,
        state.allData,
      )
      if (nextIndex !== null) {
        await Promise.resolve(
          this.config.onStepChange(state.currentStepIndex, nextIndex, state.allData),
        )
      }
    }

    // Navigate to next step
    const newState = await this.navigation.navigateNext(state)
    if (!newState) {
      return null
    }

    // Mark new step as visited if not already
    if (!newState.steps[newState.currentStepIndex]?.visitedAt) {
      const updatedSteps = [...newState.steps]
      const currentStep = this.steps[newState.currentStepIndex]
      updatedSteps[newState.currentStepIndex] = currentStep.createInitialState(
        newState.currentStepIndex,
      )

      return {
        ...newState,
        steps: updatedSteps,
      }
    }

    return newState
  }

  /**
   * Move to previous step
   */
  async moveToPreviousStep(state: MultiStepFormState): Promise<MultiStepFormState | null> {
    // Call onStepChange hook if provided
    if (this.config.onStepChange) {
      const prevIndex = this.navigation.getPreviousVisibleStepIndex(
        state.currentStepIndex,
        state.allData,
      )
      if (prevIndex !== null) {
        await Promise.resolve(
          this.config.onStepChange(state.currentStepIndex, prevIndex, state.allData),
        )
      }
    }

    return await this.navigation.navigatePrevious(state)
  }

  /**
   * Jump to specific step
   */
  async jumpToStep(state: MultiStepFormState, stepId: string): Promise<MultiStepFormState | null> {
    const targetIndex = this.navigation.getStepIndex(stepId)
    if (targetIndex === -1) {
      return null
    }

    // Call onStepChange hook if provided
    if (this.config.onStepChange) {
      await Promise.resolve(
        this.config.onStepChange(state.currentStepIndex, targetIndex, state.allData),
      )
    }

    return await this.navigation.jumpToStep(state, stepId)
  }

  /**
   * Check if form can be completed
   */
  canComplete(state: MultiStepFormState): boolean {
    return this.navigation.isFormComplete(state)
  }

  /**
   * Complete the form
   */
  async complete(state: MultiStepFormState): Promise<FormCompletionResult> {
    // Check if form is complete
    if (!this.canComplete(state)) {
      return {
        success: false,
        data: state.allData,
        errors: { form: 'Not all required steps are completed' },
        message: 'Please complete all required steps',
      }
    }

    try {
      // Call onComplete hook if provided
      if (this.config.onComplete) {
        const result = await Promise.resolve(this.config.onComplete(state.allData))

        if (!result.success) {
          return {
            success: false,
            data: state.allData,
            errors: result.errors,
            message: 'Form submission failed',
          }
        }
      }

      return {
        success: true,
        data: state.allData,
        message: 'Form completed successfully',
      }
    }
    catch (error) {
      return {
        success: false,
        data: state.allData,
        errors: { form: error instanceof Error ? error.message : 'Unknown error' },
        message: 'An error occurred while completing the form',
      }
    }
  }

  /**
   * Cancel the form
   */
  async cancel(state: MultiStepFormState): Promise<void> {
    if (this.config.onCancel) {
      await Promise.resolve(this.config.onCancel(state.allData))
    }
  }

  /**
   * Get form summary
   */
  getSummary(state: MultiStepFormState): string {
    const progress = this.progressTracker.getProgress(state)
    const stats = this.progressTracker.getTimeStats(state)

    return `${this.title}
Progress: ${progress.completedSteps}/${progress.totalSteps} (${progress.percentage}%)
Time: ${this.progressTracker.formatDuration(stats.totalTime)}`
  }

  /**
   * Get all form data
   */
  getAllData(state: MultiStepFormState): Record<string, any> {
    return { ...state.allData }
  }

  /**
   * Get step data
   */
  getStepData(state: MultiStepFormState, stepId: string): Record<string, any> | null {
    const stepIndex = this.navigation.getStepIndex(stepId)
    if (stepIndex === -1) {
      return null
    }

    return state.steps[stepIndex]?.data ?? null
  }

  /**
   * Reset form to initial state
   */
  reset(state: MultiStepFormState): MultiStepFormState {
    return this.createInitialState(state.userId, state.chatId)
  }

  /**
   * Validate entire form
   */
  async validateAll(state: MultiStepFormState): Promise<{
    isValid: boolean
    errors: Record<string, string>
  }> {
    const errors: Record<string, string> = {}

    for (let i = 0; i < this.steps.length; i++) {
      const step = this.steps[i]
      const stepState = state.steps[i]

      if (!stepState) {
        errors[step.id] = 'Step not found'
        continue
      }

      const validationResult = await step.validate(stepState.data)
      if (!validationResult.isValid) {
        errors[step.id] = validationResult.error || 'Validation failed'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  }
}
