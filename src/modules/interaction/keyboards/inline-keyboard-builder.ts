/**
 * Inline Keyboards Builder Module - Inline Keyboard Builder
 *
 * Provides a fluent API for building complete inline keyboards with
 * multiple buttons and flexible layouts.
 */

import type { InlineKeyboardButton, InlineKeyboardMarkup } from 'grammy/types'
import type { LayoutOptions } from './types.js'
import { ButtonBuilder } from './button-builder.js'

/**
 * Builder class for creating inline keyboards with multiple buttons
 *
 * @example
 * ```typescript
 * const keyboard = new InlineKeyboardBuilder()
 *   .row()
 *     .add('Button 1', 'callback1')
 *     .add('Button 2', 'callback2')
 *   .row()
 *     .url('Visit Website', 'https://example.com')
 *   .build()
 * ```
 */
export class InlineKeyboardBuilder {
  private rows: InlineKeyboardButton[][] = []
  private currentRow: InlineKeyboardButton[] = []

  /**
   * Starts a new row of buttons
   *
   * @returns This builder instance for chaining
   */
  row(): this {
    if (this.currentRow.length > 0) {
      this.rows.push([...this.currentRow])
      this.currentRow = []
    }
    return this
  }

  /**
   * Adds a callback button to the current row
   *
   * @param text - Button text
   * @param callbackData - Callback data
   * @returns This builder instance for chaining
   */
  add(text: string, callbackData: string): this {
    const button = new ButtonBuilder(text).callback(callbackData).build()
    this.currentRow.push(button)
    return this
  }

  /**
   * Adds a URL button to the current row
   *
   * @param text - Button text
   * @param url - URL to open
   * @returns This builder instance for chaining
   */
  url(text: string, url: string): this {
    const button = new ButtonBuilder(text).url(url).build()
    this.currentRow.push(button)
    return this
  }

  /**
   * Adds a switch inline query button to the current row
   *
   * @param text - Button text
   * @param query - Inline query
   * @returns This builder instance for chaining
   */
  switchInlineQuery(text: string, query: string): this {
    const button = new ButtonBuilder(text).switchInlineQuery(query).build()
    this.currentRow.push(button)
    return this
  }

  /**
   * Adds a switch inline query current chat button to the current row
   *
   * @param text - Button text
   * @param query - Inline query
   * @returns This builder instance for chaining
   */
  switchInlineQueryCurrentChat(text: string, query: string): this {
    const button = new ButtonBuilder(text).switchInlineQueryCurrentChat(query).build()
    this.currentRow.push(button)
    return this
  }

  /**
   * Adds a custom button to the current row
   *
   * @param button - The button to add
   * @returns This builder instance for chaining
   */
  addButton(button: InlineKeyboardButton): this {
    this.currentRow.push(button)
    return this
  }

  /**
   * Adds multiple buttons in a grid layout
   *
   * @param buttons - Array of button configurations [text, callback_data]
   * @param options - Layout options (columns, maxButtonsPerRow)
   * @returns This builder instance for chaining
   */
  grid(buttons: [string, string][], options?: LayoutOptions): this {
    const columns = options?.columns || 2
    const maxPerRow = options?.maxButtonsPerRow || columns

    for (let i = 0; i < buttons.length; i += maxPerRow) {
      this.row()
      const rowButtons = buttons.slice(i, i + maxPerRow)
      rowButtons.forEach(([text, data]) => {
        this.add(text, data)
      })
    }

    return this
  }

  /**
   * Creates a pagination row with previous and next buttons
   *
   * @param currentPage - Current page number
   * @param totalPages - Total number of pages
   * @param callbackPrefix - Prefix for callback data (e.g., "page")
   * @returns This builder instance for chaining
   */
  pagination(currentPage: number, totalPages: number, callbackPrefix: string = 'page'): this {
    this.row()

    if (currentPage > 1) {
      this.add('« Previous', `${callbackPrefix}:${currentPage - 1}`)
    }

    this.add(`${currentPage} / ${totalPages}`, `${callbackPrefix}:current`)

    if (currentPage < totalPages) {
      this.add('Next »', `${callbackPrefix}:${currentPage + 1}`)
    }

    return this
  }

  /**
   * Creates a confirmation row with Yes/No buttons
   *
   * @param action - The action to confirm
   * @param data - Additional data to include
   * @returns This builder instance for chaining
   */
  confirm(action: string, data?: Record<string, string | number>): this {
    this.row()

    const yesData = data
      ? `${action}:yes:${Object.entries(data).map(([k, v]) => `${k}=${v}`).join(':')}`
      : `${action}:yes`

    const noData = data
      ? `${action}:no:${Object.entries(data).map(([k, v]) => `${k}=${v}`).join(':')}`
      : `${action}:no`

    this.add('✅ Yes', yesData)
    this.add('❌ No', noData)

    return this
  }

  /**
   * Builds the inline keyboard
   *
   * @returns The inline keyboard markup
   */
  build(): InlineKeyboardMarkup {
    // Add any remaining buttons in current row
    if (this.currentRow.length > 0) {
      this.rows.push([...this.currentRow])
    }

    return {
      inline_keyboard: this.rows,
    }
  }

  /**
   * Gets the current number of rows
   *
   * @returns Number of rows
   */
  getRowCount(): number {
    let count = this.rows.length
    if (this.currentRow.length > 0) {
      count++
    }
    return count
  }

  /**
   * Gets the number of buttons in a specific row
   *
   * @param rowIndex - The row index
   * @returns Number of buttons in the row
   */
  getButtonCount(rowIndex: number): number {
    if (rowIndex < this.rows.length) {
      return this.rows[rowIndex].length
    }
    if (rowIndex === this.rows.length && this.currentRow.length > 0) {
      return this.currentRow.length
    }
    return 0
  }

  /**
   * Clears all buttons and rows
   *
   * @returns This builder instance for chaining
   */
  clear(): this {
    this.rows = []
    this.currentRow = []
    return this
  }
}
