/**
 * Telegram Bot Integration Example
 * Shows how to use forms in a Telegram bot
 */

import type { Bot } from 'grammy'
import { FormBuilder, TelegramFormHandler } from '../../src/modules/interaction/forms/index.js'

// Create bot instance (example - not for actual use)
// const bot = new Bot('YOUR_BOT_TOKEN')

// Create form handler
const formHandler = new TelegramFormHandler()

// Example 1: Contact Form
const contactForm = new FormBuilder('contact', '📨 Contact Us')
  .setDescription('Send us a message and we will get back to you soon!')
  .addTextField('name', 'Full Name', { required: true })
  .addEmailField('email', 'Email', { required: true })
  .addTextField('message', 'Message', { required: true, minLength: 10 })
  .onSubmit(async (data) => {
    // Save to database or send email
    console.log('New contact submission:', data)
    return { success: true }
  })
  .build()

// Example 2: Feedback Form
const feedbackForm = new FormBuilder('feedback', '⭐ Feedback')
  .setDescription('Help us improve our service!')
  .addSelectField('rating', 'Overall Rating', [
    '⭐⭐⭐⭐⭐ Excellent',
    '⭐⭐⭐⭐ Good',
    '⭐⭐⭐ Average',
    '⭐⭐ Poor',
    '⭐ Very Poor',
  ], { required: true })
  .addMultiSelectField('features', 'What features do you use?', [
    'Feature A',
    'Feature B',
    'Feature C',
    'Feature D',
  ])
  .addTextField('comments', 'Additional Comments', {
    required: false,
    maxLength: 500,
  })
  .onSubmit(async (data) => {
    console.log('New feedback:', data)
    return { success: true }
  })
  .build()

// Bot Commands Setup
export function setupFormCommands(bot: Bot) {
  // Start contact form
  bot.command('contact', async (ctx) => {
    await formHandler.startForm(ctx, contactForm)
  })

  // Start feedback form
  bot.command('feedback', async (ctx) => {
    await formHandler.startForm(ctx, feedbackForm)
  })

  // Cancel active form
  bot.command('cancel', async (ctx) => {
    const userId = ctx.from?.id
    if (!userId)
      return

    // Cancel all forms for user
    await formHandler.cancelForm(ctx, 'contact')
    await formHandler.cancelForm(ctx, 'feedback')

    await ctx.reply('❌ All forms cancelled.')
  })

  // Handle text input for active forms
  bot.on('message:text', async (ctx) => {
    const userId = ctx.from?.id
    const text = ctx.message.text

    if (!userId || !text)
      return

    // Skip if it's a command
    if (text.startsWith('/'))
      return

    // Check if user has active forms
    if (formHandler.hasActiveForm(userId, 'contact')) {
      await formHandler.handleInput(ctx, 'contact', text)
      return
    }

    if (formHandler.hasActiveForm(userId, 'feedback')) {
      await formHandler.handleInput(ctx, 'feedback', text)
      return
    }

    // No active form - show help
    await ctx.reply(
      '👋 Welcome! Use these commands:\n\n'
      + '/contact - Send us a message\n'
      + '/feedback - Share your feedback\n'
      + '/cancel - Cancel current form',
    )
  })
}

// Example with custom submit handlers
const customForm = new FormBuilder('custom', 'Custom Form')
  .addTextField('name', 'Name', { required: true })
  .addEmailField('email', 'Email', { required: true })
  .onSubmit(async (data) => {
    try {
      // Your custom logic here
      // - Save to database
      // - Send emails
      // - Call external APIs
      // - etc.

      console.log('Processing form:', data)

      // Example: Save to database (pseudo-code)
      // await prisma.contact.create({ data })

      // Example: Send email (pseudo-code)
      // await sendEmail(data.email, 'Thank you!')

      return {
        success: true,
        data: {
          message: 'Thank you! We will contact you soon.',
          reference: `REF-${Date.now()}`,
        },
      }
    }
    catch (error) {
      console.error('Form submission error:', error)
      return {
        success: false,
        errors: {
          _general: 'An error occurred. Please try again later.',
        },
      }
    }
  })
  .onCancel(() => {
    console.log('Form cancelled by user')
  })
  .build()

// Usage Notes:
// 1. Initialize bot with your token
// 2. Call setupFormCommands(bot)
// 3. Start bot with bot.start()

/*
Example full setup:

const bot = new Bot(process.env.BOT_TOKEN!)
setupFormCommands(bot)
bot.start()
console.log('Bot started with form support!')
*/
