/**
 * Inline Keyboards Builder Module - Type Definitions
 *
 * This module provides types for building interactive inline keyboards
 * for Telegram bots.
 */

import type { InlineKeyboardButton, InlineKeyboardMarkup } from 'grammy/types'

/**
 * Button configuration options
 */
export interface ButtonConfig {
  text: string
  callback_data?: string
  url?: string
  switch_inline_query?: string
  switch_inline_query_current_chat?: string
}

/**
 * Layout options for organizing buttons
 */
export interface LayoutOptions {
  columns?: number
  maxButtonsPerRow?: number
}

/**
 * Callback data structure for parsing
 */
export interface CallbackData {
  action: string
  params: Record<string, string | number | boolean>
}

/**
 * Re-export types from grammy
 */
export type { InlineKeyboardButton, InlineKeyboardMarkup }
