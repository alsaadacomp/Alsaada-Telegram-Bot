/**
 * Tests for Column class
 */

import { describe, expect, test } from '@jest/globals'
import { Column } from '../../../../src/modules/interaction/data-tables/column.js'

describe('Column', () => {
  describe('Constructor', () => {
    test('should create column with key and label', () => {
      const column = new Column('id', 'ID')

      expect(column.getKey()).toBe('id')
      expect(column.getLabel()).toBe('ID')
    })

    test('should have default values', () => {
      const column = new Column('name', 'Name')

      expect(column.getDataType()).toBe('string')
      expect(column.getAlignment()).toBe('left')
      expect(column.isSortable()).toBe(true)
      expect(column.isFilterable()).toBe(true)
    })
  })

  describe('Data Type', () => {
    test('should set and get data type', () => {
      const column = new Column('age', 'Age')
        .setDataType('number')

      expect(column.getDataType()).toBe('number')
    })

    test('should support all data types', () => {
      const types = ['string', 'number', 'boolean', 'date'] as const

      types.forEach((type) => {
        const column = new Column('field', 'Field').setDataType(type)
        expect(column.getDataType()).toBe(type)
      })
    })
  })

  describe('Alignment', () => {
    test('should set and get alignment', () => {
      const column = new Column('price', 'Price')
        .setAlignment('right')

      expect(column.getAlignment()).toBe('right')
    })

    test('should support all alignments', () => {
      const alignments = ['left', 'center', 'right'] as const

      alignments.forEach((align) => {
        const column = new Column('field', 'Field').setAlignment(align)
        expect(column.getAlignment()).toBe(align)
      })
    })
  })

  describe('Width', () => {
    test('should set and get width', () => {
      const column = new Column('name', 'Name')
        .setWidth(20)

      expect(column.getWidth()).toBe(20)
    })

    test('should return undefined if no width set', () => {
      const column = new Column('name', 'Name')

      expect(column.getWidth()).toBeUndefined()
    })
  })

  describe('Sortable', () => {
    test('should set sortable to false', () => {
      const column = new Column('avatar', 'Avatar')
        .setSortable(false)

      expect(column.isSortable()).toBe(false)
    })

    test('should default to sortable', () => {
      const column = new Column('name', 'Name')

      expect(column.isSortable()).toBe(true)
    })
  })

  describe('Filterable', () => {
    test('should set filterable to false', () => {
      const column = new Column('avatar', 'Avatar')
        .setFilterable(false)

      expect(column.isFilterable()).toBe(false)
    })

    test('should default to filterable', () => {
      const column = new Column('name', 'Name')

      expect(column.isFilterable()).toBe(true)
    })
  })

  describe('Formatter', () => {
    test('should set custom formatter', () => {
      const column = new Column('price', 'Price')
        .setFormatter(value => `$${value}`)

      expect(column.format(100)).toBe('$100')
    })

    test('should use custom formatter over default', () => {
      const column = new Column('active', 'Active')
        .setDataType('boolean')
        .setFormatter(value => value ? 'YES' : 'NO')

      expect(column.format(true)).toBe('YES')
      expect(column.format(false)).toBe('NO')
    })
  })

  describe('Format Method', () => {
    test('should format null as empty string', () => {
      const column = new Column('field', 'Field')

      expect(column.format(null)).toBe('')
      expect(column.format(undefined)).toBe('')
    })

    test('should format boolean with checkmarks', () => {
      const column = new Column('active', 'Active')
        .setDataType('boolean')

      expect(column.format(true)).toBe('✓')
      expect(column.format(false)).toBe('✗')
    })

    test('should format date', () => {
      const column = new Column('createdAt', 'Created')
        .setDataType('date')

      const date = new Date('2024-01-01')
      const formatted = column.format(date)

      expect(formatted).toContain('2024')
    })

    test('should format number with locale', () => {
      const column = new Column('count', 'Count')
        .setDataType('number')

      const formatted = column.format(1000)

      expect(formatted).toContain('1')
    })

    test('should format string as is', () => {
      const column = new Column('name', 'Name')

      expect(column.format('John Doe')).toBe('John Doe')
    })
  })

  describe('Method Chaining', () => {
    test('should support method chaining', () => {
      const column = new Column('price', 'Price')
        .setDataType('number')
        .setAlignment('right')
        .setWidth(10)
        .setSortable(true)
        .setFilterable(true)

      expect(column.getDataType()).toBe('number')
      expect(column.getAlignment()).toBe('right')
      expect(column.getWidth()).toBe(10)
    })
  })

  describe('Get Configuration', () => {
    test('should return column configuration', () => {
      const column = new Column('price', 'Price')
        .setDataType('number')
        .setAlignment('right')

      const config = column.getConfig()

      expect(config.key).toBe('price')
      expect(config.label).toBe('Price')
      expect(config.dataType).toBe('number')
      expect(config.alignment).toBe('right')
    })

    test('should return immutable configuration', () => {
      const column = new Column('name', 'Name')
      const config = column.getConfig()

      config.label = 'Modified'

      expect(column.getLabel()).toBe('Name')
    })
  })

  describe('From Configuration', () => {
    test('should create column from config', () => {
      const config = {
        key: 'price',
        label: 'Price',
        dataType: 'number' as const,
        alignment: 'right' as const,
        width: 10,
        sortable: true,
        filterable: false,
      }

      const column = Column.fromConfig(config)

      expect(column.getKey()).toBe('price')
      expect(column.getLabel()).toBe('Price')
      expect(column.getDataType()).toBe('number')
      expect(column.getAlignment()).toBe('right')
      expect(column.getWidth()).toBe(10)
      expect(column.isSortable()).toBe(true)
      expect(column.isFilterable()).toBe(false)
    })

    test('should handle minimal config', () => {
      const config = {
        key: 'name',
        label: 'Name',
      }

      const column = Column.fromConfig(config)

      expect(column.getKey()).toBe('name')
      expect(column.getLabel()).toBe('Name')
      expect(column.getDataType()).toBe('string')
    })
  })
})
