# 📋 Multi-Step Forms Module

> Complete system for building and managing multi-step forms with Telegram bots

[![Tests](https://img.shields.io/badge/tests-130%20passing-success)](../../tests/)
[![Coverage](https://img.shields.io/badge/coverage-100%25-success)](../../tests/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)

## ✨ Features

- 📝 **Step-by-Step Forms**: Build complex forms divided into manageable steps
- ✅ **Per-Step Validation**: Validate each step before moving forward
- 🔄 **Smart Navigation**: Navigate forward, backward, or jump to specific steps
- 📊 **Progress Tracking**: Track user progress with visual indicators
- 💾 **State Persistence**: Save and resume forms at any time
- 🎯 **Conditional Steps**: Show/hide steps based on previous answers
- ⏱️ **Time Tracking**: Monitor time spent on each step
- 🌍 **Multi-Language**: Built-in support for Arabic and English
- 🔌 **Conversations Integration**: Seamless integration with grammy conversations plugin

## 📦 Installation

The module is already included in this project. No additional installation needed.

## 🚀 Quick Start

### 1. Create a Multi-Step Form

```typescript
import { FieldType, MultiStepForm } from './multi-step-forms'

const registrationForm = new MultiStepForm({
  id: 'user-registration',
  title: 'User Registration',
  description: 'Complete your profile in 3 easy steps',
  steps: [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      fields: [
        {
          name: 'name',
          type: FieldType.TEXT,
          label: 'Full Name',
          required: true,
          minLength: 3,
        },
        {
          name: 'age',
          type: FieldType.NUMBER,
          label: 'Age',
          required: true,
          min: 18,
          max: 100,
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'How can we reach you?',
      fields: [
        {
          name: 'email',
          type: FieldType.EMAIL,
          label: 'Email Address',
          required: true,
        },
        {
          name: 'phone',
          type: FieldType.PHONE,
          label: 'Phone Number',
          required: false,
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Tell us your preferences',
      fields: [
        {
          name: 'interests',
          type: FieldType.MULTI_SELECT,
          label: 'Interests',
          options: ['Sports', 'Technology', 'Arts', 'Music'],
          required: false,
        },
      ],
    },
  ],
})
```

### 2. Use with Conversations Plugin

```typescript
import { conversations } from '@grammyjs/conversations'
import { ConversationFormHandler, InMemoryMultiStepFormStorage } from './multi-step-forms'

// Initialize storage
const storage = new InMemoryMultiStepFormStorage()

// Create handler
const formHandler = new ConversationFormHandler(registrationForm, storage)

// Define conversation
async function registrationConversation(conversation, ctx) {
  const result = await formHandler.handle(ctx, conversation)

  if (result.success) {
    await ctx.reply(`Welcome, ${result.data.name}!`)
  }
  else {
    await ctx.reply('Registration cancelled.')
  }
}

// Register conversation
bot.use(conversations())
bot.use(createConversation(registrationConversation))

// Handle command
bot.command('register', ctx => ctx.conversation.enter('registrationConversation'))
```

## 📚 Core Components

### 1. MultiStepForm

Main class for managing multi-step forms.

```typescript
const form = new MultiStepForm({
  id: 'my-form',
  title: 'My Form',
  steps: [...],
  allowBackNavigation: true,     // Allow going back
  allowSkipSteps: false,          // Prevent skipping
  saveProgress: true,             // Auto-save progress
  onComplete: async (data) => {   // Handle submission
    return { success: true, data }
  },
})
```

### 2. StepDefinition

Defines a single step in the form.

```typescript
{
  id: 'step-id',
  title: 'Step Title',
  description: 'Optional description',
  fields: [...],
  canSkip: false,
  condition: (allData) => allData.age >= 18,  // Show only if condition met
  onEnter: async (data, ctx) => {             // Before showing step
    console.log('Entering step')
  },
  onExit: async (data, ctx) => {              // After completing step
    console.log('Exiting step')
  },
}
```

### 3. StepNavigation

Manages navigation between steps.

```typescript
const navigation = form.navigation

// Navigate
await navigation.navigateNext(state)
await navigation.navigatePrevious(state)
await navigation.jumpToStep(state, 'step-id')

// Check navigation
const canGo = navigation.canNavigate(state, { direction: 'next' })

// Get step info
const currentStep = navigation.getStep(state.currentStepIndex)
const visibleSteps = navigation.getVisibleSteps(state.allData)
```

### 4. ProgressTracker

Tracks user progress through the form.

```typescript
const tracker = form.progressTracker

// Get progress
const progress = tracker.getProgress(state)
// { currentStep: 2, totalSteps: 3, completedSteps: 1, percentage: 33, remainingSteps: 2 }

// Display progress
const progressBar = tracker.getProgressBar(state)
// "███░░░░░░░ 33%"

const progressText = tracker.getProgressText(state, 'en')
// "Step 2 of 3"

// Time statistics
const stats = tracker.getTimeStats(state)
const estimate = tracker.getEstimatedCompletionTime(state)
```

### 5. InMemoryMultiStepFormStorage

Storage for form states.

```typescript
const storage = new InMemoryMultiStepFormStorage()

// Save state
await storage.save(state)

// Load state
const loadedState = await storage.load(userId, formId)

// Delete state
await storage.delete(userId, formId)

// Clear all user forms
await storage.clear(userId)

// Get active forms
const activeForms = await storage.getAllActive(userId)
```

## 🎨 Advanced Features

### Conditional Steps

Show steps based on previous answers:

```typescript
{
  id: 'company-info',
  title: 'Company Information',
  condition: (allData) => allData.employment === 'employed',
  fields: [...],
}
```

### Custom Validation

Add custom validation to steps:

```typescript
{
  id: 'password-step',
  title: 'Set Password',
  fields: [...],
  validator: async (data) => {
    if (data.password !== data.confirmPassword) {
      return {
        isValid: false,
        error: 'Passwords do not match',
      }
    }
    return { isValid: true }
  },
}
```

### Lifecycle Hooks

Execute code at specific points:

```typescript
{
  id: 'payment-step',
  title: 'Payment',
  onEnter: async (data, ctx) => {
    // Calculate total before showing step
    data.total = calculateTotal(data)
  },
  onExit: async (data, ctx) => {
    // Process payment after step completion
    await processPayment(data)
  },
  fields: [...],
}
```

### Form Completion

Handle form submission:

```typescript
const form = new MultiStepForm({
  id: 'registration',
  title: 'Registration',
  steps: [...],
  onComplete: async (data) => {
    try {
      // Save to database
      await saveUser(data)

      // Send welcome email
      await sendWelcomeEmail(data.email)

      return {
        success: true,
        data,
      }
    } catch (error) {
      return {
        success: false,
        errors: { general: error.message },
      }
    }
  },
})
```

## 🧪 Testing

The module includes comprehensive tests:

```bash
# Run all tests
npm test

# Run only multi-step forms tests
npm test -- tests/modules/interaction/multi-step-forms

# Watch mode
npm test:watch
```

**Test Coverage:**
- ✅ 130 tests
- ✅ 100% passing
- ✅ All components covered

## 📖 API Reference

### Types

```typescript
// Form Configuration
interface MultiStepFormConfig {
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

// Step Configuration
interface StepConfig {
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

// Form State
interface MultiStepFormState {
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

// Progress Info
interface ProgressInfo {
  currentStep: number
  totalSteps: number
  completedSteps: number
  percentage: number
  remainingSteps: number
}
```

## 🔗 Related Modules

- **[Form Builder](../forms/README.md)** - Single-step form builder (used internally)
- **[Input Validators](../../input/validators/README.md)** - Field validation functions
- **[@grammyjs/conversations](https://github.com/grammyjs/conversations)** - Conversations plugin for grammy

## 📝 License

This module is part of the Telegram Bot Template project.

## 🤝 Contributing

Contributions are welcome! Please ensure all tests pass before submitting PR:

```bash
npm test
npm run lint
npm run typecheck
```

---

**Built with ❤️ for Telegram Bot developers**
