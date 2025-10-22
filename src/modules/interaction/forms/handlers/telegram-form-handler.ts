/**
 * Telegram Form Handler
 * معالج النماذج في Telegram
 */

import type { Context } from 'grammy'
import type { Form } from '../form-builder.js'
import type { FormHandlerContext, FormStorage } from '../types.js'
import { InMemoryFormStorage } from '../storage/index.js'

/**
 * Telegram Form Handler
 * Handles form interactions in Telegram bot
 */
export class TelegramFormHandler {
  private storage: FormStorage
  private activeForms: Map<string, Form> = new Map()

  constructor(storage?: FormStorage) {
    this.storage = storage || new InMemoryFormStorage()
  }

  /**
   * Start form interaction
   */
  async startForm(ctx: Context, form: Form): Promise<void> {
    if (!ctx.from || !ctx.chat) {
      throw new Error('Invalid context: missing user or chat')
    }

    const formId = form.getConfig().id
    const userId = ctx.from.id
    const chatId = ctx.chat.id

    // Store active form
    const key = this.getFormKey(userId, formId)
    this.activeForms.set(key, form)

    // Save initial state
    const context: FormHandlerContext = {
      userId,
      chatId,
      formId,
    }

    await this.storage.save(context, form.getState())

    // Send form introduction
    await this.sendFormIntro(ctx, form)

    // Start with first field
    await this.sendNextField(ctx, form)
  }

  /**
   * Handle user input for current field
   */
  async handleInput(ctx: Context, formId: string, input: string): Promise<void> {
    if (!ctx.from || !ctx.chat) {
      throw new Error('Invalid context: missing user or chat')
    }

    const userId = ctx.from.id
    const chatId = ctx.chat.id

    // Get active form
    const key = this.getFormKey(userId, formId)
    const form = this.activeForms.get(key)

    if (!form) {
      await ctx.reply('❌ Form session expired. Please start again.')
      return
    }

    // Get current field
    const context: FormHandlerContext = {
      userId,
      chatId,
      formId,
    }

    const state = await this.storage.load(context)
    if (!state) {
      await ctx.reply('❌ Form state not found. Please start again.')
      return
    }

    // Find the next empty field
    const fields = form.getFields()
    const currentField = fields.find(f => f.getValue() === null || f.getValue() === undefined)

    if (!currentField) {
      await ctx.reply('❌ No more fields to fill.')
      return
    }

    // Set field value
    currentField.setValue(input)
    currentField.setTouched(true)

    // Validate
    const validation = currentField.validate()

    if (!validation.isValid) {
      await ctx.reply(`❌ ${validation.error}\n\nPlease try again:`)
      return
    }

    // Save state
    await this.storage.save(context, form.getState())

    // Check if form is complete
    const allFieldsFilled = fields.every(f => f.getValue() !== null && f.getValue() !== undefined)

    if (allFieldsFilled) {
      await this.completeForm(ctx, form)
    }
    else {
      await this.sendNextField(ctx, form)
    }
  }

  /**
   * Send form introduction
   */
  private async sendFormIntro(ctx: Context, form: Form): Promise<void> {
    const config = form.getConfig()
    let message = `📋 **${config.title}**\n\n`

    if (config.description) {
      message += `${config.description}\n\n`
    }

    const fields = form.getFields()
    message += `Total fields: ${fields.length}\n\n`
    message += `Let's start! 🚀`

    await ctx.reply(message, { parse_mode: 'Markdown' })
  }

  /**
   * Send next field prompt
   */
  private async sendNextField(ctx: Context, form: Form): Promise<void> {
    const fields = form.getFields()
    const currentField = fields.find(f => f.getValue() === null || f.getValue() === undefined)

    if (!currentField) {
      return
    }

    const config = currentField.getConfig()
    let message = `📝 **${config.label}**`

    if (config.required) {
      message += ' *'
    }

    message += '\n\n'

    if (config.description) {
      message += `${config.description}\n\n`
    }

    if (config.placeholder) {
      message += `_Example: ${config.placeholder}_\n\n`
    }

    // Add type-specific hints
    switch (config.type) {
      case 'email':
        message += '📧 Please enter a valid email address'
        break
      case 'phone':
        message += '📱 Please enter a valid phone number'
        break
      case 'number':
        message += '🔢 Please enter a number'
        if (config.min !== undefined || config.max !== undefined) {
          message += ` (${config.min ?? 'any'} - ${config.max ?? 'any'})`
        }
        break
      case 'date':
        message += '📅 Please enter a date (YYYY-MM-DD)'
        break
      case 'url':
        message += '🔗 Please enter a valid URL'
        break
      case 'select':
        if (config.options) {
          message += '\n\nPlease choose one:\n'
          config.options.forEach((opt, i) => {
            message += `${i + 1}. ${opt}\n`
          })
        }
        break
    }

    await ctx.reply(message, { parse_mode: 'Markdown' })
  }

  /**
   * Complete form submission
   */
  private async completeForm(ctx: Context, form: Form): Promise<void> {
    // Submit form
    const result = await form.submit()

    if (result.success) {
      await ctx.reply('✅ Form submitted successfully!\n\nThank you! 🎉')

      // Show summary
      const data = form.getData()
      let summary = '\n📋 **Summary:**\n\n'

      for (const field of form.getFields()) {
        const config = field.getConfig()
        const value = data[config.name]
        summary += `• **${config.label}:** ${value}\n`
      }

      await ctx.reply(summary, { parse_mode: 'Markdown' })

      // Clean up
      if (ctx.from) {
        const key = this.getFormKey(ctx.from.id, form.getConfig().id)
        this.activeForms.delete(key)

        await this.storage.delete({
          userId: ctx.from.id,
          chatId: ctx.chat!.id,
          formId: form.getConfig().id,
        })
      }
    }
    else {
      let errorMessage = '❌ Form submission failed:\n\n'

      if (result.errors) {
        for (const [field, error] of Object.entries(result.errors)) {
          errorMessage += `• **${field}:** ${error}\n`
        }
      }

      await ctx.reply(errorMessage, { parse_mode: 'Markdown' })
    }
  }

  /**
   * Cancel form
   */
  async cancelForm(ctx: Context, formId: string): Promise<void> {
    if (!ctx.from) {
      return
    }

    const key = this.getFormKey(ctx.from.id, formId)
    this.activeForms.delete(key)

    await this.storage.delete({
      userId: ctx.from.id,
      chatId: ctx.chat!.id,
      formId,
    })

    await ctx.reply('❌ Form cancelled.')
  }

  /**
   * Get form key for storage
   */
  private getFormKey(userId: number, formId: string): string {
    return `${userId}:${formId}`
  }

  /**
   * Check if user has active form
   */
  hasActiveForm(userId: number, formId: string): boolean {
    const key = this.getFormKey(userId, formId)
    return this.activeForms.has(key)
  }

  /**
   * Get active form
   */
  getActiveForm(userId: number, formId: string): Form | undefined {
    const key = this.getFormKey(userId, formId)
    return this.activeForms.get(key)
  }
}
