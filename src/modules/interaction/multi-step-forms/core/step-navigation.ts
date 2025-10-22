/**
 * Step Navigation
 * إدارة التنقل بين خطوات النموذج
 */

import type {
  MultiStepFormState,
  NavigationDirection,
  NavigationOptions,
  NavigationResult,
  StepConfig,
} from '../types.js'
import { StepDefinition } from './step-definition.js'

/**
 * Step Navigation Class
 * Manages navigation between form steps
 */
export class StepNavigation {
  private readonly steps: StepDefinition[]
  private readonly allowBackNavigation: boolean
  private readonly allowSkipSteps: boolean

  constructor(
    steps: StepConfig[],
    options: {
      allowBackNavigation?: boolean
      allowSkipSteps?: boolean
    } = {},
  ) {
    this.steps = steps.map(config => new StepDefinition(config))
    this.allowBackNavigation = options.allowBackNavigation ?? true
    this.allowSkipSteps = options.allowSkipSteps ?? false
  }

  /**
   * Get total number of steps
   */
  getTotalSteps(): number {
    return this.steps.length
  }

  /**
   * Get step by index
   */
  getStep(index: number): StepDefinition | undefined {
    return this.steps[index]
  }

  /**
   * Get step by ID
   */
  getStepById(id: string): StepDefinition | undefined {
    return this.steps.find(step => step.id === id)
  }

  /**
   * Get step index by ID
   */
  getStepIndex(id: string): number {
    return this.steps.findIndex(step => step.id === id)
  }

  /**
   * Get all steps
   */
  getAllSteps(): StepDefinition[] {
    return [...this.steps]
  }

  /**
   * Get visible steps based on conditions
   */
  getVisibleSteps(allData: Record<string, any>): StepDefinition[] {
    return this.steps.filter(step => step.shouldShow(allData))
  }

  /**
   * Get next visible step index
   */
  getNextVisibleStepIndex(currentIndex: number, allData: Record<string, any>): number | null {
    for (let i = currentIndex + 1; i < this.steps.length; i++) {
      if (this.steps[i].shouldShow(allData)) {
        return i
      }
    }
    return null
  }

  /**
   * Get previous visible step index
   */
  getPreviousVisibleStepIndex(currentIndex: number, allData: Record<string, any>): number | null {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (this.steps[i].shouldShow(allData)) {
        return i
      }
    }
    return null
  }

  /**
   * Check if navigation is allowed
   */
  canNavigate(
    state: MultiStepFormState,
    options: NavigationOptions,
  ): NavigationResult {
    const currentStep = this.steps[state.currentStepIndex]
    if (!currentStep) {
      return {
        allowed: false,
        reason: 'Current step not found',
      }
    }

    // Handle different navigation directions
    switch (options.direction) {
      case 'next':
        return this.canNavigateNext(state, options)

      case 'previous':
        return this.canNavigatePrevious(state, options)

      case 'jump':
        return this.canJumpToStep(state, options)

      default:
        return {
          allowed: false,
          reason: 'Invalid navigation direction',
        }
    }
  }

  /**
   * Check if can navigate to next step
   */
  private canNavigateNext(
    state: MultiStepFormState,
    options: NavigationOptions,
  ): NavigationResult {
    const currentStepState = state.steps[state.currentStepIndex]

    // Skip validation if explicitly requested
    if (!options.skipValidation) {
      // Check if current step is valid
      if (!currentStepState?.isValid) {
        return {
          allowed: false,
          reason: 'Current step is not valid',
        }
      }
    }

    // Find next visible step
    const nextIndex = this.getNextVisibleStepIndex(state.currentStepIndex, state.allData)

    if (nextIndex === null) {
      return {
        allowed: false,
        reason: 'No more steps available',
      }
    }

    return {
      allowed: true,
      targetStepIndex: nextIndex,
    }
  }

  /**
   * Check if can navigate to previous step
   */
  private canNavigatePrevious(
    state: MultiStepFormState,
    _options: NavigationOptions,
  ): NavigationResult {
    if (!this.allowBackNavigation) {
      return {
        allowed: false,
        reason: 'Back navigation is disabled',
      }
    }

    // Find previous visible step
    const prevIndex = this.getPreviousVisibleStepIndex(state.currentStepIndex, state.allData)

    if (prevIndex === null) {
      return {
        allowed: false,
        reason: 'No previous step available',
      }
    }

    return {
      allowed: true,
      targetStepIndex: prevIndex,
    }
  }

  /**
   * Check if can jump to specific step
   */
  private canJumpToStep(
    state: MultiStepFormState,
    options: NavigationOptions,
  ): NavigationResult {
    let targetIndex: number | undefined

    // Determine target index
    if (options.targetStepIndex !== undefined) {
      targetIndex = options.targetStepIndex
    }
    else if (options.targetStepId) {
      targetIndex = this.getStepIndex(options.targetStepId)
      if (targetIndex === -1) {
        return {
          allowed: false,
          reason: 'Target step not found',
        }
      }
    }
    else {
      return {
        allowed: false,
        reason: 'No target step specified',
      }
    }

    // Check if target index is valid
    if (targetIndex < 0 || targetIndex >= this.steps.length) {
      return {
        allowed: false,
        reason: 'Invalid target step index',
      }
    }

    // Check if target step is visible
    const targetStep = this.steps[targetIndex]
    if (!targetStep.shouldShow(state.allData)) {
      return {
        allowed: false,
        reason: 'Target step is not visible',
      }
    }

    // Check if jumping forward
    if (targetIndex > state.currentStepIndex) {
      // Can only skip if allowed and step is skippable
      if (!this.allowSkipSteps && !targetStep.canSkip) {
        return {
          allowed: false,
          reason: 'Skipping steps is not allowed',
        }
      }

      // Check if all steps between current and target are valid or skippable
      for (let i = state.currentStepIndex; i < targetIndex; i++) {
        const stepState = state.steps[i]
        const step = this.steps[i]

        if (!stepState?.isValid && !step.canSkip) {
          return {
            allowed: false,
            reason: `Step ${i + 1} must be completed first`,
          }
        }
      }
    }
    else if (targetIndex < state.currentStepIndex) {
      // Jumping backward
      if (!this.allowBackNavigation) {
        return {
          allowed: false,
          reason: 'Back navigation is disabled',
        }
      }
    }

    return {
      allowed: true,
      targetStepIndex: targetIndex,
    }
  }

  /**
   * Navigate to next step
   */
  async navigateNext(state: MultiStepFormState): Promise<MultiStepFormState | null> {
    const result = this.canNavigate(state, { direction: 'next' as NavigationDirection })

    if (!result.allowed || result.targetStepIndex === undefined) {
      return null
    }

    return this.updateCurrentStep(state, result.targetStepIndex)
  }

  /**
   * Navigate to previous step
   */
  async navigatePrevious(state: MultiStepFormState): Promise<MultiStepFormState | null> {
    const result = this.canNavigate(state, { direction: 'previous' as NavigationDirection })

    if (!result.allowed || result.targetStepIndex === undefined) {
      return null
    }

    return this.updateCurrentStep(state, result.targetStepIndex)
  }

  /**
   * Jump to specific step
   */
  async jumpToStep(
    state: MultiStepFormState,
    targetStepId: string,
  ): Promise<MultiStepFormState | null> {
    const result = this.canNavigate(state, {
      direction: 'jump' as NavigationDirection,
      targetStepId,
    })

    if (!result.allowed || result.targetStepIndex === undefined) {
      return null
    }

    return this.updateCurrentStep(state, result.targetStepIndex)
  }

  /**
   * Update current step in state
   */
  private updateCurrentStep(
    state: MultiStepFormState,
    newStepIndex: number,
  ): MultiStepFormState {
    return {
      ...state,
      currentStepIndex: newStepIndex,
      lastUpdatedAt: new Date(),
    }
  }

  /**
   * Check if form is complete
   */
  isFormComplete(state: MultiStepFormState): boolean {
    // Check if all visible steps are valid
    const visibleSteps = this.getVisibleSteps(state.allData)

    for (const step of visibleSteps) {
      const stepIndex = this.getStepIndex(step.id)
      const stepState = state.steps[stepIndex]

      if (!stepState?.isComplete) {
        return false
      }
    }

    return true
  }
}
