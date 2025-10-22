/**
 * Tests for InlineKeyboardBuilder class
 */

import { describe, expect, test } from '@jest/globals'
import { InlineKeyboardBuilder } from '../../../../src/modules/interaction/keyboards/inline-keyboard-builder.js'

describe('InlineKeyboardBuilder', () => {
  describe('Basic Row Management', () => {
    test('should create empty keyboard', () => {
      const builder = new InlineKeyboardBuilder()
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(0)
    })

    test('should create single row with one button', () => {
      const builder = new InlineKeyboardBuilder()
      builder.add('Button', 'data')
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      expect(keyboard.inline_keyboard[0]).toHaveLength(1)
    })

    test('should create single row with multiple buttons', () => {
      const builder = new InlineKeyboardBuilder()
      builder.add('Button 1', 'data1')
      builder.add('Button 2', 'data2')
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      expect(keyboard.inline_keyboard[0]).toHaveLength(2)
    })

    test('should create multiple rows', () => {
      const builder = new InlineKeyboardBuilder()
      builder.row().add('Button 1', 'data1')
      builder.row().add('Button 2', 'data2')
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(2)
      expect(keyboard.inline_keyboard[0]).toHaveLength(1)
      expect(keyboard.inline_keyboard[1]).toHaveLength(1)
    })
  })

  describe('Button Types', () => {
    test('should add callback button', () => {
      const builder = new InlineKeyboardBuilder()
      builder.add('Callback', 'callback_data')
      const keyboard = builder.build()

      const button = keyboard.inline_keyboard[0][0] as any
      expect(button.text).toBe('Callback')
      expect(button.callback_data).toBe('callback_data')
    })

    test('should add URL button', () => {
      const builder = new InlineKeyboardBuilder()
      builder.url('Website', 'https://example.com')
      const keyboard = builder.build()

      const button = keyboard.inline_keyboard[0][0] as any
      expect(button.text).toBe('Website')
      expect(button.url).toBe('https://example.com')
    })

    test('should add switch inline query button', () => {
      const builder = new InlineKeyboardBuilder()
      builder.switchInlineQuery('Search', 'query')
      const keyboard = builder.build()

      const button = keyboard.inline_keyboard[0][0] as any
      expect(button.text).toBe('Search')
      expect(button.switch_inline_query).toBe('query')
    })

    test('should add switch inline query current chat button', () => {
      const builder = new InlineKeyboardBuilder()
      builder.switchInlineQueryCurrentChat('Share', 'share')
      const keyboard = builder.build()

      const button = keyboard.inline_keyboard[0][0] as any
      expect(button.text).toBe('Share')
      expect(button.switch_inline_query_current_chat).toBe('share')
    })
  })

  describe('Grid Layout', () => {
    test('should create grid with default 2 columns', () => {
      const builder = new InlineKeyboardBuilder()
      const buttons: [string, string][] = [
        ['Button 1', 'data1'],
        ['Button 2', 'data2'],
        ['Button 3', 'data3'],
        ['Button 4', 'data4'],
      ]
      builder.grid(buttons)
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(2)
      expect(keyboard.inline_keyboard[0]).toHaveLength(2)
      expect(keyboard.inline_keyboard[1]).toHaveLength(2)
    })

    test('should create grid with custom columns', () => {
      const builder = new InlineKeyboardBuilder()
      const buttons: [string, string][] = [
        ['Button 1', 'data1'],
        ['Button 2', 'data2'],
        ['Button 3', 'data3'],
      ]
      builder.grid(buttons, { columns: 3 })
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      expect(keyboard.inline_keyboard[0]).toHaveLength(3)
    })

    test('should handle incomplete rows in grid', () => {
      const builder = new InlineKeyboardBuilder()
      const buttons: [string, string][] = [
        ['Button 1', 'data1'],
        ['Button 2', 'data2'],
        ['Button 3', 'data3'],
      ]
      builder.grid(buttons, { columns: 2 })
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(2)
      expect(keyboard.inline_keyboard[0]).toHaveLength(2)
      expect(keyboard.inline_keyboard[1]).toHaveLength(1)
    })
  })

  describe('Pagination', () => {
    test('should create pagination for first page', () => {
      const builder = new InlineKeyboardBuilder()
      builder.pagination(1, 5)
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      const buttons = keyboard.inline_keyboard[0]
      expect(buttons).toHaveLength(2) // Current + Next
      expect((buttons[0] as any).text).toContain('1 / 5')
      expect((buttons[1] as any).text).toContain('Next')
    })

    test('should create pagination for middle page', () => {
      const builder = new InlineKeyboardBuilder()
      builder.pagination(3, 5)
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      const buttons = keyboard.inline_keyboard[0]
      expect(buttons).toHaveLength(3) // Previous + Current + Next
      expect((buttons[0] as any).text).toContain('Previous')
      expect((buttons[1] as any).text).toContain('3 / 5')
      expect((buttons[2] as any).text).toContain('Next')
    })

    test('should create pagination for last page', () => {
      const builder = new InlineKeyboardBuilder()
      builder.pagination(5, 5)
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      const buttons = keyboard.inline_keyboard[0]
      expect(buttons).toHaveLength(2) // Previous + Current
      expect((buttons[0] as any).text).toContain('Previous')
      expect((buttons[1] as any).text).toContain('5 / 5')
    })

    test('should use custom callback prefix', () => {
      const builder = new InlineKeyboardBuilder()
      builder.pagination(2, 3, 'custom')
      const keyboard = builder.build()

      const buttons = keyboard.inline_keyboard[0]
      expect((buttons[0] as any).callback_data).toContain('custom:')
      expect((buttons[2] as any).callback_data).toContain('custom:')
    })
  })

  describe('Confirmation Buttons', () => {
    test('should create confirmation row without data', () => {
      const builder = new InlineKeyboardBuilder()
      builder.confirm('delete')
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      const buttons = keyboard.inline_keyboard[0]
      expect(buttons).toHaveLength(2)
      expect((buttons[0] as any).text).toContain('Yes')
      expect((buttons[1] as any).text).toContain('No')
      expect((buttons[0] as any).callback_data).toBe('delete:yes')
      expect((buttons[1] as any).callback_data).toBe('delete:no')
    })

    test('should create confirmation row with data', () => {
      const builder = new InlineKeyboardBuilder()
      builder.confirm('delete', { id: 123 })
      const keyboard = builder.build()

      const buttons = keyboard.inline_keyboard[0]
      expect((buttons[0] as any).callback_data).toContain('delete:yes:id=123')
      expect((buttons[1] as any).callback_data).toContain('delete:no:id=123')
    })

    test('should create confirmation row with multiple data fields', () => {
      const builder = new InlineKeyboardBuilder()
      builder.confirm('update', { id: 123, type: 'user' })
      const keyboard = builder.build()

      const buttons = keyboard.inline_keyboard[0]
      expect((buttons[0] as any).callback_data).toContain('id=123')
      expect((buttons[0] as any).callback_data).toContain('type=user')
    })
  })

  describe('Method Chaining', () => {
    test('should support full method chaining', () => {
      const builder = new InlineKeyboardBuilder()
      const result = builder
        .row()
        .add('Button 1', 'data1')
        .add('Button 2', 'data2')
        .row()
        .url('Website', 'https://example.com')

      expect(result).toBe(builder)
    })

    test('should build complex keyboard with chaining', () => {
      const builder = new InlineKeyboardBuilder()
      const keyboard = builder
        .row()
        .add('Action 1', 'action1')
        .add('Action 2', 'action2')
        .row()
        .url('Website', 'https://example.com')
        .row()
        .switchInlineQuery('Search', 'query')
        .build()

      expect(keyboard.inline_keyboard).toHaveLength(3)
      expect(keyboard.inline_keyboard[0]).toHaveLength(2)
      expect(keyboard.inline_keyboard[1]).toHaveLength(1)
      expect(keyboard.inline_keyboard[2]).toHaveLength(1)
    })
  })

  describe('Helper Methods', () => {
    test('should get row count', () => {
      const builder = new InlineKeyboardBuilder()
      builder.row().add('Button 1', 'data1')
      builder.row().add('Button 2', 'data2')

      expect(builder.getRowCount()).toBe(2)
    })

    test('should get row count with pending buttons', () => {
      const builder = new InlineKeyboardBuilder()
      builder.row().add('Button 1', 'data1')
      builder.add('Button 2', 'data2') // Same row

      expect(builder.getRowCount()).toBe(1)
    })

    test('should get button count for specific row', () => {
      const builder = new InlineKeyboardBuilder()
      builder.row()
        .add('Button 1', 'data1')
        .add('Button 2', 'data2')
        .add('Button 3', 'data3')

      expect(builder.getButtonCount(0)).toBe(3)
    })

    test('should return 0 for invalid row index', () => {
      const builder = new InlineKeyboardBuilder()
      builder.add('Button', 'data')

      expect(builder.getButtonCount(5)).toBe(0)
    })

    test('should clear all buttons and rows', () => {
      const builder = new InlineKeyboardBuilder()
      builder.row().add('Button 1', 'data1')
      builder.row().add('Button 2', 'data2')

      builder.clear()
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(0)
    })

    test('should allow building after clear', () => {
      const builder = new InlineKeyboardBuilder()
      builder.add('Button 1', 'data1')
      builder.clear()
      builder.add('Button 2', 'data2')
      const keyboard = builder.build()

      expect(keyboard.inline_keyboard).toHaveLength(1)
      expect(keyboard.inline_keyboard[0]).toHaveLength(1)
      expect((keyboard.inline_keyboard[0][0] as any).text).toBe('Button 2')
    })
  })

  describe('Complex Scenarios', () => {
    test('should build menu with multiple sections', () => {
      const builder = new InlineKeyboardBuilder()
      const keyboard = builder
        // Main actions
        .row()
        .add('Create', 'create')
        .add('Edit', 'edit')
        .add('Delete', 'delete')
        // Navigation
        .row()
        .add('← Back', 'back')
        .add('Home', 'home')
        .add('Next →', 'next')
        // External links
        .row()
        .url('Documentation', 'https://docs.example.com')
        .build()

      expect(keyboard.inline_keyboard).toHaveLength(3)
      expect(keyboard.inline_keyboard[0]).toHaveLength(3)
      expect(keyboard.inline_keyboard[1]).toHaveLength(3)
      expect(keyboard.inline_keyboard[2]).toHaveLength(1)
    })

    test('should build list with pagination', () => {
      const builder = new InlineKeyboardBuilder()
      const keyboard = builder
        .grid([
          ['Item 1', 'item:1'],
          ['Item 2', 'item:2'],
          ['Item 3', 'item:3'],
          ['Item 4', 'item:4'],
        ], { columns: 2 })
        .pagination(2, 5, 'page')
        .build()

      expect(keyboard.inline_keyboard).toHaveLength(3) // 2 rows of items + 1 pagination row
    })

    test('should build confirmation dialog', () => {
      const builder = new InlineKeyboardBuilder()
      const keyboard = builder
        .row()
        .add('⚠️ Are you sure?', 'noop')
        .confirm('delete', { id: 123, type: 'permanent' })
        .row()
        .add('← Cancel', 'cancel')
        .build()

      expect(keyboard.inline_keyboard).toHaveLength(3)
      expect((keyboard.inline_keyboard[1][0] as any).text).toContain('Yes')
      expect((keyboard.inline_keyboard[1][1] as any).text).toContain('No')
    })
  })
})
