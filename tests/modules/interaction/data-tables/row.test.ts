/**
 * Tests for Row class
 */

import { describe, expect, test } from '@jest/globals'
import { Column } from '../../../../src/modules/interaction/data-tables/column.js'
import { Row } from '../../../../src/modules/interaction/data-tables/row.js'

describe('Row', () => {
  describe('Constructor', () => {
    test('should create row with data', () => {
      const row = new Row({ id: 1, name: 'John' })

      expect(row.get('id')).toBe(1)
      expect(row.get('name')).toBe('John')
    })

    test('should copy data object', () => {
      const data = { id: 1, name: 'John' }
      const row = new Row(data)

      data.name = 'Jane'

      expect(row.get('name')).toBe('John')
    })
  })

  describe('Get and Set', () => {
    test('should get value by key', () => {
      const row = new Row({ id: 1, name: 'John' })

      expect(row.get('id')).toBe(1)
      expect(row.get('name')).toBe('John')
    })

    test('should return undefined for non-existent key', () => {
      const row = new Row({ id: 1 })

      expect(row.get('missing')).toBeUndefined()
    })

    test('should set value by key', () => {
      const row = new Row({ id: 1, name: 'John' })

      row.set('name', 'Jane')

      expect(row.get('name')).toBe('Jane')
    })

    test('should add new key with set', () => {
      const row = new Row({ id: 1 })

      row.set('name', 'John')

      expect(row.get('name')).toBe('John')
    })
  })

  describe('Has Method', () => {
    test('should check if key exists', () => {
      const row = new Row({ id: 1, name: 'John' })

      expect(row.has('id')).toBe(true)
      expect(row.has('name')).toBe(true)
      expect(row.has('missing')).toBe(false)
    })
  })

  describe('Get Data', () => {
    test('should return all data', () => {
      const row = new Row({ id: 1, name: 'John' })
      const data = row.getData()

      expect(data).toEqual({ id: 1, name: 'John' })
    })

    test('should return copy of data', () => {
      const row = new Row({ id: 1, name: 'John' })
      const data = row.getData()

      data.name = 'Jane'

      expect(row.get('name')).toBe('John')
    })
  })

  describe('Get Keys', () => {
    test('should return all keys', () => {
      const row = new Row({ id: 1, name: 'John', email: 'john@example.com' })
      const keys = row.getKeys()

      expect(keys).toContain('id')
      expect(keys).toContain('name')
      expect(keys).toContain('email')
      expect(keys).toHaveLength(3)
    })
  })

  describe('Selection State', () => {
    test('should set and check selected state', () => {
      const row = new Row({ id: 1 })

      expect(row.isSelected()).toBe(false)

      row.setSelected(true)
      expect(row.isSelected()).toBe(true)

      row.setSelected(false)
      expect(row.isSelected()).toBe(false)
    })
  })

  describe('Highlight State', () => {
    test('should set and check highlighted state', () => {
      const row = new Row({ id: 1 })

      expect(row.isHighlighted()).toBe(false)

      row.setHighlighted(true)
      expect(row.isHighlighted()).toBe(true)

      row.setHighlighted(false)
      expect(row.isHighlighted()).toBe(false)
    })
  })

  describe('Index', () => {
    test('should set and get index', () => {
      const row = new Row({ id: 1 })

      expect(row.getIndex()).toBeUndefined()

      row.setIndex(5)
      expect(row.getIndex()).toBe(5)
    })
  })

  describe('Format Method', () => {
    test('should format row values using columns', () => {
      const columns = [
        new Column('id', 'ID'),
        new Column('name', 'Name'),
        new Column('active', 'Active').setDataType('boolean'),
      ]

      const row = new Row({ id: 1, name: 'John', active: true })
      const formatted = row.format(columns)

      expect(formatted).toEqual(['1', 'John', '✓'])
    })

    test('should handle missing values', () => {
      const columns = [
        new Column('id', 'ID'),
        new Column('missing', 'Missing'),
      ]

      const row = new Row({ id: 1 })
      const formatted = row.format(columns)

      expect(formatted).toEqual(['1', ''])
    })
  })

  describe('To JSON', () => {
    test('should convert to JSON object', () => {
      const row = new Row({ id: 1, name: 'John' })
      row.setSelected(true)
      row.setIndex(5)

      const json = row.toJSON()

      expect(json.data).toEqual({ id: 1, name: 'John' })
      expect(json.metadata.selected).toBe(true)
      expect(json.metadata.index).toBe(5)
    })
  })

  describe('Static Methods', () => {
    test('should create row from data', () => {
      const row = Row.fromData({ id: 1, name: 'John' })

      expect(row).toBeInstanceOf(Row)
      expect(row.get('id')).toBe(1)
    })

    test('should create rows from array', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ]

      const rows = Row.fromArray(data)

      expect(rows).toHaveLength(2)
      expect(rows[0].get('name')).toBe('John')
      expect(rows[1].get('name')).toBe('Jane')
    })
  })

  describe('Method Chaining', () => {
    test('should support method chaining', () => {
      const row = new Row({ id: 1 })
        .set('name', 'John')
        .setSelected(true)
        .setHighlighted(true)
        .setIndex(5)

      expect(row.get('name')).toBe('John')
      expect(row.isSelected()).toBe(true)
      expect(row.isHighlighted()).toBe(true)
      expect(row.getIndex()).toBe(5)
    })
  })
})
