/**
 * Inline Keyboards Builder Module - Callback Data Parser
 *
 * Provides utilities for parsing and building callback data strings.
 */

import type { CallbackData } from './types.js'

/**
 * Builder for constructing callback data strings
 */
export class CallbackDataBuilder {
  private action: string
  private parameters: Record<string, string | number | boolean> = {}

  /**
   * Creates a new callback data builder
   *
   * @param action - The action name
   */
  constructor(action: string) {
    this.action = action
  }

  /**
   * Adds a parameter to the callback data
   *
   * @param key - Parameter key
   * @param value - Parameter value
   * @returns This builder instance for chaining
   */
  param(key: string, value: string | number | boolean): this {
    this.parameters[key] = value
    return this
  }

  /**
   * Adds multiple parameters at once
   *
   * @param params - Object containing multiple parameters
   * @returns This builder instance for chaining
   */
  setParams(params: Record<string, string | number | boolean>): this {
    this.parameters = { ...this.parameters, ...params }
    return this
  }

  /**
   * Builds the callback data string
   *
   * @returns The formatted callback data string
   */
  build(): string {
    const parts = [this.action]

    for (const [key, value] of Object.entries(this.parameters)) {
      parts.push(`${key}=${value}`)
    }

    return parts.join(':')
  }
}

/**
 * Utility class for parsing and building callback data
 *
 * @example
 * ```typescript
 * const parser = new CallbackDataParser()
 *
 * // Build callback data
 * const data = parser.builder('delete')
 *   .param('id', '123')
 *   .param('confirm', true)
 *   .build()
 * // Result: "delete:id=123:confirm=true"
 *
 * // Parse callback data
 * const parsed = parser.parse('delete:id=123:confirm=true')
 * // Result: { action: 'delete', params: { id: '123', confirm: 'true' } }
 * ```
 */
export class CallbackDataParser {
  /**
   * Creates a callback data builder
   *
   * @param action - The action name
   * @returns A new callback data builder
   */
  builder(action: string): CallbackDataBuilder {
    return new CallbackDataBuilder(action)
  }

  /**
   * Parses a callback data string
   *
   * @param data - The callback data string to parse
   * @returns Parsed callback data object
   */
  parse(data: string): CallbackData {
    const parts = data.split(':')
    const action = parts[0]
    const params: Record<string, string | number | boolean> = {}

    for (let i = 1; i < parts.length; i++) {
      const [key, value] = parts[i].split('=')
      if (key && value !== undefined) {
        // Try to parse as number or boolean
        if (value === 'true') {
          params[key] = true
        }
        else if (value === 'false') {
          params[key] = false
        }
        else if (!isNaN(Number(value))) {
          params[key] = Number(value)
        }
        else {
          params[key] = value
        }
      }
    }

    return { action, params }
  }

  /**
   * Gets the action from callback data
   *
   * @param data - The callback data string
   * @returns The action name
   */
  getAction(data: string): string {
    return data.split(':')[0]
  }

  /**
   * Gets a specific parameter from callback data
   *
   * @param data - The callback data string
   * @param key - The parameter key
   * @returns The parameter value or undefined if not found
   */
  getParam(data: string, key: string): string | number | boolean | undefined {
    const parsed = this.parse(data)
    return parsed.params[key]
  }
}
