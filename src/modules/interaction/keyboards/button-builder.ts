/**
 * Inline Keyboards Builder Module - Button Builder
 *
 * Provides a fluent API for creating individual inline keyboard buttons.
 */

import type { InlineKeyboardButton } from 'grammy/types'
import type { ButtonConfig } from './types.js'

/**
 * Builder class for creating individual inline keyboard buttons
 *
 * @example
 * ```typescript
 * const button = new ButtonBuilder('Click Me')
 *   .callback('button_clicked')
 *   .build()
 * ```
 */
export class ButtonBuilder {
  private config: ButtonConfig

  /**
   * Creates a new button builder
   *
   * @param text - The button text to display
   */
  constructor(text: string) {
    this.config = { text }
  }

  /**
   * Creates a callback button
   *
   * @param data - Callback data to send when button is pressed
   * @returns This builder instance for chaining
   */
  callback(data: string): this {
    this.config.callback_data = data
    return this
  }

  /**
   * Creates a URL button
   *
   * @param url - URL to open when button is pressed
   * @returns This builder instance for chaining
   */
  url(url: string): this {
    this.config.url = url
    return this
  }

  /**
   * Creates a switch inline query button
   *
   * @param query - The inline query to insert
   * @returns This builder instance for chaining
   */
  switchInlineQuery(query: string): this {
    this.config.switch_inline_query = query
    return this
  }

  /**
   * Creates a switch inline query current chat button
   *
   * @param query - The inline query to insert in current chat
   * @returns This builder instance for chaining
   */
  switchInlineQueryCurrentChat(query: string): this {
    this.config.switch_inline_query_current_chat = query
    return this
  }

  /**
   * Builds the button
   *
   * @returns The inline keyboard button
   * @throws Error if no action (callback_data, url, etc.) is set
   */
  build(): InlineKeyboardButton {
    if (!this.config.callback_data
      && !this.config.url
      && this.config.switch_inline_query === undefined
      && this.config.switch_inline_query_current_chat === undefined) {
      throw new Error('Button must have at least one action (callback_data, url, switch_inline_query, or switch_inline_query_current_chat)')
    }

    const button: Partial<InlineKeyboardButton> = {
      text: this.config.text,
    }

    if (this.config.callback_data) {
      (button as any).callback_data = this.config.callback_data
    }

    if (this.config.url) {
      (button as any).url = this.config.url
    }

    if (this.config.switch_inline_query !== undefined) {
      (button as any).switch_inline_query = this.config.switch_inline_query
    }

    if (this.config.switch_inline_query_current_chat !== undefined) {
      (button as any).switch_inline_query_current_chat = this.config.switch_inline_query_current_chat
    }

    return button as InlineKeyboardButton
  }

  /**
   * Gets the button text
   *
   * @returns The button text
   */
  getText(): string {
    return this.config.text
  }

  /**
   * Gets the button configuration
   *
   * @returns The button configuration
   */
  getConfig(): ButtonConfig {
    return { ...this.config }
  }
}
