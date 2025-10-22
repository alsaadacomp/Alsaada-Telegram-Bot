/**
 * Tests for CallbackDataParser class
 */

import { describe, expect, test } from '@jest/globals'
import { CallbackDataParser } from '../../../../src/modules/interaction/keyboards/callback-data-parser.js'

describe('CallbackDataParser', () => {
  describe('Builder - Basic Usage', () => {
    test('should create callback data with action only', () => {
      const parser = new CallbackDataParser()
      const builder = parser.builder('action')
      const data = builder.build()

      expect(data).toBe('action')
    })

    test('should create callback data with single parameter', () => {
      const parser = new CallbackDataParser()
      const builder = parser.builder('action')
      builder.param('id', '123')
      const data = builder.build()

      expect(data).toBe('action:id=123')
    })

    test('should create callback data with multiple parameters', () => {
      const parser = new CallbackDataParser()
      const builder = parser.builder('action')
      builder.param('id', '123')
      builder.param('page', 2)
      const data = builder.build()

      expect(data).toContain('id=123')
      expect(data).toContain('page=2')
    })

    test('should add multiple parameters at once', () => {
      const parser = new CallbackDataParser()
      const builder = parser.builder('action')

      // Use setParams method
      builder.setParams({ id: '123', page: 2, name: 'test' })
      const data = builder.build()

      expect(data).toContain('id=123')
      expect(data).toContain('page=2')
      expect(data).toContain('name=test')
    })
  })

  describe('Builder - Different Data Types', () => {
    test('should handle string parameters', () => {
      const parser = new CallbackDataParser()
      const data = parser.builder('action')
        .param('name', 'John Doe')
        .build()

      expect(data).toContain('name=John Doe')
    })

    test('should handle number parameters', () => {
      const parser = new CallbackDataParser()
      const data = parser.builder('action')
        .param('count', 42)
        .build()

      expect(data).toContain('count=42')
    })

    test('should handle boolean parameters', () => {
      const parser = new CallbackDataParser()
      const data = parser.builder('action')
        .param('confirmed', true)
        .param('active', false)
        .build()

      expect(data).toContain('confirmed=true')
      expect(data).toContain('active=false')
    })
  })

  describe('Builder - Method Chaining', () => {
    test('should support method chaining', () => {
      const parser = new CallbackDataParser()
      const data = parser.builder('delete')
        .param('id', '123')
        .param('confirm', true)
        .build()

      expect(data).toContain('delete')
      expect(data).toContain('id=123')
      expect(data).toContain('confirm=true')
    })

    test('should support mixed param and setParams chaining', () => {
      const parser = new CallbackDataParser()
      const data = parser.builder('action')
        .param('first', 'value1')
        .setParams({ second: 'value2', third: 3 })
        .param('fourth', true)
        .build()

      expect(data).toContain('first=value1')
      expect(data).toContain('second=value2')
      expect(data).toContain('third=3')
      expect(data).toContain('fourth=true')
    })
  })

  describe('Parser - Basic Parsing', () => {
    test('should parse action-only callback data', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action')

      expect(result.action).toBe('action')
      expect(result.params).toEqual({})
    })

    test('should parse callback data with single parameter', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action:id=123')

      expect(result.action).toBe('action')
      expect(result.params.id).toBe(123)
    })

    test('should parse callback data with multiple parameters', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action:id=123:page=2:name=test')

      expect(result.action).toBe('action')
      expect(result.params.id).toBe(123)
      expect(result.params.page).toBe(2)
      expect(result.params.name).toBe('test')
    })
  })

  describe('Parser - Data Type Conversion', () => {
    test('should convert string parameters', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action:name=John')

      expect(result.params.name).toBe('John')
      expect(typeof result.params.name).toBe('string')
    })

    test('should convert number parameters', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action:count=42:price=99.99')

      expect(result.params.count).toBe(42)
      expect(result.params.price).toBe(99.99)
      expect(typeof result.params.count).toBe('number')
      expect(typeof result.params.price).toBe('number')
    })

    test('should convert boolean parameters', () => {
      const parser = new CallbackDataParser()
      const result = parser.parse('action:confirmed=true:active=false')

      expect(result.params.confirmed).toBe(true)
      expect(result.params.active).toBe(false)
      expect(typeof result.params.confirmed).toBe('boolean')
      expect(typeof result.params.active).toBe('boolean')
    })
  })

  describe('Helper Methods', () => {
    test('should get action from callback data', () => {
      const parser = new CallbackDataParser()
      const action = parser.getAction('delete:id=123:confirm=true')

      expect(action).toBe('delete')
    })

    test('should get specific parameter from callback data', () => {
      const parser = new CallbackDataParser()
      const id = parser.getParam('action:id=123:page=2', 'id')
      const page = parser.getParam('action:id=123:page=2', 'page')

      expect(id).toBe(123)
      expect(page).toBe(2)
    })

    test('should return undefined for non-existent parameter', () => {
      const parser = new CallbackDataParser()
      const result = parser.getParam('action:id=123', 'missing')

      expect(result).toBeUndefined()
    })
  })

  describe('Round-Trip Testing', () => {
    test('should build and parse simple data correctly', () => {
      const parser = new CallbackDataParser()
      const original = parser.builder('action')
        .param('id', '123')
        .build()

      const parsed = parser.parse(original)

      expect(parsed.action).toBe('action')
      expect(parsed.params.id).toBe(123)
    })

    test('should build and parse complex data correctly', () => {
      const parser = new CallbackDataParser()
      const original = parser.builder('update')
        .param('id', '456')
        .param('page', 3)
        .param('confirmed', true)
        .param('name', 'test')
        .build()

      const parsed = parser.parse(original)

      expect(parsed.action).toBe('update')
      expect(parsed.params.id).toBe(456)
      expect(parsed.params.page).toBe(3)
      expect(parsed.params.confirmed).toBe(true)
      expect(parsed.params.name).toBe('test')
    })
  })
})
