/**
 * Progress Tracker
 * تتبع تقدم المستخدم في النموذج
 */

import type {
  MultiStepFormState,
  ProgressInfo,
} from '../types.js'
import type { StepNavigation } from './step-navigation.js'

/**
 * Progress Tracker Class
 * Tracks user progress through a multi-step form
 */
export class ProgressTracker {
  private readonly navigation: StepNavigation

  constructor(navigation: StepNavigation) {
    this.navigation = navigation
  }

  /**
   * Get current progress information
   */
  getProgress(state: MultiStepFormState): ProgressInfo {
    const visibleSteps = this.navigation.getVisibleSteps(state.allData)
    const totalSteps = visibleSteps.length
    const currentStep = state.currentStepIndex + 1

    // Count completed steps
    let completedSteps = 0
    for (const step of visibleSteps) {
      const stepIndex = this.navigation.getStepIndex(step.id)
      const stepState = state.steps[stepIndex]
      if (stepState?.isComplete) {
        completedSteps++
      }
    }

    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0
    const remainingSteps = totalSteps - completedSteps

    return {
      currentStep,
      totalSteps,
      completedSteps,
      percentage,
      remainingSteps,
    }
  }

  /**
   * Get progress bar string
   */
  getProgressBar(state: MultiStepFormState, length: number = 10): string {
    const progress = this.getProgress(state)
    const filledLength = Math.round((progress.percentage / 100) * length)
    const emptyLength = length - filledLength

    const filled = '█'.repeat(filledLength)
    const empty = '░'.repeat(emptyLength)

    return `${filled}${empty} ${progress.percentage}%`
  }

  /**
   * Get progress text
   */
  getProgressText(state: MultiStepFormState, language: 'en' | 'ar' = 'en'): string {
    const progress = this.getProgress(state)

    if (language === 'ar') {
      return `الخطوة ${progress.currentStep} من ${progress.totalSteps}`
    }

    return `Step ${progress.currentStep} of ${progress.totalSteps}`
  }

  /**
   * Get detailed progress message
   */
  getProgressMessage(state: MultiStepFormState, language: 'en' | 'ar' = 'en'): string {
    const progress = this.getProgress(state)

    if (language === 'ar') {
      return `📊 التقدم: ${progress.completedSteps}/${progress.totalSteps} خطوة مكتملة (${progress.percentage}%)\n${this.getProgressBar(state)}`
    }

    return `📊 Progress: ${progress.completedSteps}/${progress.totalSteps} steps completed (${progress.percentage}%)\n${this.getProgressBar(state)}`
  }

  /**
   * Check if user is on first step
   */
  isFirstStep(state: MultiStepFormState): boolean {
    const visibleSteps = this.navigation.getVisibleSteps(state.allData)
    if (visibleSteps.length === 0)
      return true

    const firstVisibleStepIndex = this.navigation.getStepIndex(visibleSteps[0].id)
    return state.currentStepIndex === firstVisibleStepIndex
  }

  /**
   * Check if user is on last step
   */
  isLastStep(state: MultiStepFormState): boolean {
    const visibleSteps = this.navigation.getVisibleSteps(state.allData)
    if (visibleSteps.length === 0)
      return true

    const lastVisibleStepIndex = this.navigation.getStepIndex(
      visibleSteps[visibleSteps.length - 1].id,
    )
    return state.currentStepIndex === lastVisibleStepIndex
  }

  /**
   * Get time statistics
   */
  getTimeStats(state: MultiStepFormState): {
    totalTime: number
    averageTimePerStep: number
    currentStepTime: number
  } {
    const now = new Date()
    const totalTime = now.getTime() - state.startedAt.getTime()

    // Calculate completed steps time
    let completedStepsTime = 0
    let completedCount = 0

    for (const stepState of state.steps) {
      if (stepState?.isComplete && stepState.visitedAt && stepState.completedAt) {
        completedStepsTime += stepState.completedAt.getTime() - stepState.visitedAt.getTime()
        completedCount++
      }
    }

    const averageTimePerStep = completedCount > 0 ? completedStepsTime / completedCount : 0

    // Current step time
    const currentStepState = state.steps[state.currentStepIndex]
    const currentStepTime = currentStepState?.visitedAt
      ? now.getTime() - currentStepState.visitedAt.getTime()
      : 0

    return {
      totalTime: Math.round(totalTime / 1000), // in seconds
      averageTimePerStep: Math.round(averageTimePerStep / 1000), // in seconds
      currentStepTime: Math.round(currentStepTime / 1000), // in seconds
    }
  }

  /**
   * Format time duration
   */
  formatDuration(seconds: number, language: 'en' | 'ar' = 'en'): string {
    if (seconds < 60) {
      return language === 'ar' ? `${seconds} ثانية` : `${seconds}s`
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (language === 'ar') {
      return `${minutes} دقيقة ${remainingSeconds > 0 ? `و ${remainingSeconds} ثانية` : ''}`
    }

    return `${minutes}m ${remainingSeconds > 0 ? `${remainingSeconds}s` : ''}`
  }

  /**
   * Get estimated completion time
   */
  getEstimatedCompletionTime(state: MultiStepFormState): number | null {
    const stats = this.getTimeStats(state)
    const progress = this.getProgress(state)

    if (stats.averageTimePerStep === 0 || progress.remainingSteps === 0) {
      return null
    }

    return stats.averageTimePerStep * progress.remainingSteps
  }

  /**
   * Get completion estimate message
   */
  getEstimateMessage(state: MultiStepFormState, language: 'en' | 'ar' = 'en'): string | null {
    const estimatedTime = this.getEstimatedCompletionTime(state)

    if (estimatedTime === null) {
      return null
    }

    const formatted = this.formatDuration(estimatedTime, language)

    if (language === 'ar') {
      return `⏱️ الوقت المتوقع للإنتهاء: ${formatted}`
    }

    return `⏱️ Estimated time to complete: ${formatted}`
  }

  /**
   * Get summary of visited steps
   */
  getVisitedStepsSummary(state: MultiStepFormState): {
    visited: number
    completed: number
    pending: number
  } {
    let visited = 0
    let completed = 0
    let pending = 0

    for (const stepState of state.steps) {
      if (stepState) {
        if (stepState.visitedAt) {
          visited++
        }
        if (stepState.isComplete) {
          completed++
        }
        else {
          pending++
        }
      }
    }

    return { visited, completed, pending }
  }
}
