/**
 * Tests for ButtonBuilder class
 */

import { describe, expect, test } from '@jest/globals'
import { ButtonBuilder } from '../../../../src/modules/interaction/keyboards/button-builder.js'

describe('ButtonBuilder', () => {
  describe('Constructor', () => {
    test('should create button with text', () => {
      const builder = new ButtonBuilder('Test Button')

      expect(builder.getText()).toBe('Test Button')
    })

    test('should create multiple buttons with different text', () => {
      const builder1 = new ButtonBuilder('Button 1')
      const builder2 = new ButtonBuilder('Button 2')

      expect(builder1.getText()).toBe('Button 1')
      expect(builder2.getText()).toBe('Button 2')
    })
  })

  describe('Callback Buttons', () => {
    test('should create callback button', () => {
      const button = new ButtonBuilder('Button').callback('data').build() as any

      expect(button.text).toBe('Button')
      expect(button.callback_data).toBe('data')
    })

    test('should create callback button with complex data', () => {
      const button = new ButtonBuilder('Delete').callback('delete:id=123:confirm=true').build() as any

      expect(button.text).toBe('Delete')
      expect(button.callback_data).toBe('delete:id=123:confirm=true')
    })

    test('should allow method chaining', () => {
      const builder = new ButtonBuilder('Test')
      const result = builder.callback('data')

      expect(result).toBe(builder)
    })
  })

  describe('URL Buttons', () => {
    test('should create URL button', () => {
      const button = new ButtonBuilder('Website').url('https://example.com').build() as any

      expect(button.text).toBe('Website')
      expect(button.url).toBe('https://example.com')
    })

    test('should create URL button with HTTPS', () => {
      const button = new ButtonBuilder('Secure Link').url('https://secure.example.com').build() as any

      expect(button.text).toBe('Secure Link')
      expect(button.url).toBe('https://secure.example.com')
    })
  })

  describe('Switch Inline Query Buttons', () => {
    test('should create switch inline query button', () => {
      const button = new ButtonBuilder('Search').switchInlineQuery('query').build() as any

      expect(button.text).toBe('Search')
      expect(button.switch_inline_query).toBe('query')
    })

    test('should create switch inline query button with empty query', () => {
      const button = new ButtonBuilder('Search').switchInlineQuery('').build() as any

      expect(button.text).toBe('Search')
      expect(button.switch_inline_query).toBe('')
    })
  })

  describe('Switch Inline Query Current Chat Buttons', () => {
    test('should create switch inline query current chat button', () => {
      const button = new ButtonBuilder('Share')
        .switchInlineQueryCurrentChat('share')
        .build() as any

      expect(button.text).toBe('Share')
      expect(button.switch_inline_query_current_chat).toBe('share')
    })

    test('should create switch inline query current chat button with empty query', () => {
      const button = new ButtonBuilder('Share')
        .switchInlineQueryCurrentChat('')
        .build() as any

      expect(button.text).toBe('Share')
      expect(button.switch_inline_query_current_chat).toBe('')
    })
  })

  describe('Error Handling', () => {
    test('should throw error if no action is set', () => {
      const builder = new ButtonBuilder('Button')

      expect(() => builder.build()).toThrow('Button must have at least one action')
    })
  })

  describe('Get Configuration', () => {
    test('should return button configuration', () => {
      const builder = new ButtonBuilder('Test').callback('data')
      const config = builder.getConfig()

      expect(config.text).toBe('Test')
      expect(config.callback_data).toBe('data')
    })

    test('should return immutable configuration', () => {
      const builder = new ButtonBuilder('Test').callback('data')
      const config = builder.getConfig()

      config.text = 'Modified'

      expect(builder.getText()).toBe('Test')
    })
  })
})
