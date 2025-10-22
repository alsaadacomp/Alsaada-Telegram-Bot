/**
 * Tests for DataTable class
 */

import { describe, expect, test } from '@jest/globals'
import { Column } from '../../../../src/modules/interaction/data-tables/column.js'
import { DataTable } from '../../../../src/modules/interaction/data-tables/data-table.js'

describe('DataTable', () => {
  describe('Add Columns', () => {
    test('should add column by key and label', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addColumn('name', 'Name')

      const columns = table.getColumns()
      expect(columns).toHaveLength(2)
      expect(columns[0].getKey()).toBe('id')
      expect(columns[1].getKey()).toBe('name')
    })

    test('should add column instance', () => {
      const column = new Column('price', 'Price').setDataType('number')
      const table = new DataTable().addColumn(column)

      const columns = table.getColumns()
      expect(columns).toHaveLength(1)
      expect(columns[0].getDataType()).toBe('number')
    })

    test('should throw error for invalid parameters', () => {
      const table = new DataTable()

      expect(() => table.addColumn('invalid' as any)).toThrow()
    })

    test('should add multiple columns at once', () => {
      const table = new DataTable().addColumns([
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
      ])

      expect(table.getColumns()).toHaveLength(2)
    })
  })

  describe('Add Rows', () => {
    test('should add single row', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRow({ id: 1, name: 'John' })

      expect(table.getRows()).toHaveLength(1)
    })

    test('should add multiple rows', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRows([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ])

      expect(table.getRows()).toHaveLength(2)
    })
  })

  describe('Pagination', () => {
    test('should set pagination', () => {
      const table = new DataTable().setPagination(10)
      const stats = table.getStats()

      expect(stats.currentPage).toBe(1)
    })

    test('should set current page', () => {
      const table = new DataTable()
        .addRows(Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })))
        .setPagination(10)
        .setPage(2)

      const stats = table.getStats()
      expect(stats.currentPage).toBe(2)
    })

    test('should not exceed max page', () => {
      const table = new DataTable()
        .addRows(Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })))
        .setPagination(10)
        .setPage(999)

      const stats = table.getStats()
      expect(stats.currentPage).toBe(3) // Max is 3 (25/10 = 3)
    })

    test('should not go below page 1', () => {
      const table = new DataTable()
        .setPagination(10)
        .setPage(-5)

      const stats = table.getStats()
      expect(stats.currentPage).toBe(1)
    })
  })

  describe('Sorting', () => {
    test('should sort by number ascending', () => {
      const table = new DataTable()
        .addColumn('age', 'Age')
        .addRows([
          { age: 30 },
          { age: 20 },
          { age: 25 },
        ])
        .setSort('age', 'asc')

      const rows = table.getRows()
      expect(rows[0].get('age')).toBe(20)
      expect(rows[1].get('age')).toBe(25)
      expect(rows[2].get('age')).toBe(30)
    })

    test('should sort by number descending', () => {
      const table = new DataTable()
        .addColumn('age', 'Age')
        .addRows([
          { age: 20 },
          { age: 30 },
          { age: 25 },
        ])
        .setSort('age', 'desc')

      const rows = table.getRows()
      expect(rows[0].get('age')).toBe(30)
      expect(rows[1].get('age')).toBe(25)
      expect(rows[2].get('age')).toBe(20)
    })

    test('should sort by string', () => {
      const table = new DataTable()
        .addColumn('name', 'Name')
        .addRows([
          { name: 'Charlie' },
          { name: 'Alice' },
          { name: 'Bob' },
        ])
        .setSort('name', 'asc')

      const rows = table.getRows()
      expect(rows[0].get('name')).toBe('Alice')
      expect(rows[1].get('name')).toBe('Bob')
      expect(rows[2].get('name')).toBe('Charlie')
    })

    test('should sort by boolean', () => {
      const table = new DataTable()
        .addColumn('active', 'Active')
        .addRows([
          { active: false },
          { active: true },
          { active: false },
        ])
        .setSort('active', 'desc')

      const rows = table.getRows()
      expect(rows[0].get('active')).toBe(true)
    })

    test('should handle null values in sorting', () => {
      const table = new DataTable()
        .addColumn('age', 'Age')
        .addRows([
          { age: 30 },
          { age: null },
          { age: 20 },
        ])
        .setSort('age', 'asc')

      const rows = table.getRows()
      expect(rows[2].get('age')).toBe(null) // Nulls should be last
    })

    test('should throw error for non-sortable column', () => {
      const table = new DataTable()
        .addColumn(new Column('field', 'Field').setSortable(false))

      expect(() => table.setSort('field', 'asc')).toThrow()
    })
  })

  describe('Filtering', () => {
    test('should filter with equals operator', () => {
      const table = new DataTable()
        .addColumn('status', 'Status')
        .addRows([
          { status: 'active' },
          { status: 'inactive' },
          { status: 'active' },
        ])
        .addFilter('status', 'equals', 'active')

      expect(table.getRows()).toHaveLength(2)
    })

    test('should filter with contains operator', () => {
      const table = new DataTable()
        .addColumn('name', 'Name')
        .addRows([
          { name: 'John Doe' },
          { name: 'Jane Smith' },
          { name: 'John Smith' },
        ])
        .addFilter('name', 'contains', 'john')

      expect(table.getRows()).toHaveLength(2)
    })

    test('should filter with greater_than operator', () => {
      const table = new DataTable()
        .addColumn('age', 'Age')
        .addRows([
          { age: 18 },
          { age: 25 },
          { age: 30 },
        ])
        .addFilter('age', 'greater_than', 20)

      expect(table.getRows()).toHaveLength(2)
    })

    test('should filter with less_than operator', () => {
      const table = new DataTable()
        .addColumn('age', 'Age')
        .addRows([
          { age: 18 },
          { age: 25 },
          { age: 30 },
        ])
        .addFilter('age', 'less_than', 25)

      expect(table.getRows()).toHaveLength(1)
    })

    test('should filter with starts_with operator', () => {
      const table = new DataTable()
        .addColumn('email', 'Email')
        .addRows([
          { email: 'john@example.com' },
          { email: 'jane@example.com' },
          { email: 'admin@test.com' },
        ])
        .addFilter('email', 'starts_with', 'john')

      expect(table.getRows()).toHaveLength(1)
    })

    test('should apply multiple filters', () => {
      const table = new DataTable()
        .addColumns([
          { key: 'age', label: 'Age' },
          { key: 'status', label: 'Status' },
        ])
        .addRows([
          { age: 25, status: 'active' },
          { age: 30, status: 'active' },
          { age: 20, status: 'inactive' },
        ])
        .addFilter('age', 'greater_than', 20)
        .addFilter('status', 'equals', 'active')

      expect(table.getRows()).toHaveLength(2)
    })

    test('should clear filters', () => {
      const table = new DataTable()
        .addColumn('status', 'Status')
        .addRows([
          { status: 'active' },
          { status: 'inactive' },
        ])
        .addFilter('status', 'equals', 'active')

      expect(table.getRows()).toHaveLength(1)

      table.clearFilters()
      expect(table.getRows()).toHaveLength(2)
    })

    test('should throw error for non-filterable column', () => {
      const table = new DataTable()
        .addColumn(new Column('field', 'Field').setFilterable(false))

      expect(() => table.addFilter('field', 'equals', 'value')).toThrow()
    })
  })

  describe('Formatting', () => {
    test('should format table with data', () => {
      const table = new DataTable()
        .addColumns([
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
        ])
        .addRows([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ])

      const formatted = table.format()

      expect(formatted).toContain('ID')
      expect(formatted).toContain('Name')
      expect(formatted).toContain('John')
      expect(formatted).toContain('Jane')
    })

    test('should show no data message for empty table', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')

      const formatted = table.format()

      expect(formatted).toContain('No data available')
    })

    test('should apply custom format options', () => {
      const table = new DataTable()
        .addColumn('name', 'Name')
        .addRow({ name: 'John' })
        .setFormatOptions({
          showHeaders: false,
          showBorders: false,
        })

      const formatted = table.format()

      expect(formatted).toContain('John')
    })
  })

  describe('Statistics', () => {
    test('should return correct stats', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRows(Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })))
        .setPagination(10)

      const stats = table.getStats()

      expect(stats.totalRows).toBe(25)
      expect(stats.totalColumns).toBe(1)
      expect(stats.filteredRows).toBe(25)
      expect(stats.totalPages).toBe(3)
      expect(stats.currentPage).toBe(1)
    })

    test('should reflect filtered rows in stats', () => {
      const table = new DataTable()
        .addColumn('status', 'Status')
        .addRows([
          { status: 'active' },
          { status: 'inactive' },
          { status: 'active' },
        ])
        .addFilter('status', 'equals', 'active')

      const stats = table.getStats()

      expect(stats.totalRows).toBe(3)
      expect(stats.filteredRows).toBe(2)
    })
  })

  describe('Keyboard', () => {
    test('should generate pagination keyboard', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRows(Array.from({ length: 25 }, (_, i) => ({ id: i + 1 })))
        .setPagination(10)

      const keyboard = table.getKeyboard('test')

      expect(keyboard.inline_keyboard.length).toBeGreaterThan(0)
    })

    test('should include sort buttons for sortable columns', () => {
      const table = new DataTable()
        .addColumns([
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
        ])
        .addRow({ id: 1, name: 'John' })
        .setPagination(10)

      const keyboard = table.getKeyboard('test')

      // Should have pagination + sort + actions rows
      expect(keyboard.inline_keyboard.length).toBeGreaterThan(1)
    })
  })

  describe('Export', () => {
    test('should export as CSV', () => {
      const table = new DataTable()
        .addColumns([
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
        ])
        .addRows([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ])

      const csv = table.export('csv')

      expect(csv).toContain('ID,Name')
      expect(csv).toContain('1,John')
      expect(csv).toContain('2,Jane')
    })

    test('should export as JSON', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRows([{ id: 1 }, { id: 2 }])

      const json = table.export('json')
      const parsed = JSON.parse(json)

      expect(parsed).toHaveLength(2)
      expect(parsed[0].id).toBe(1)
    })

    test('should export as Markdown', () => {
      const table = new DataTable()
        .addColumns([
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' },
        ])
        .addRow({ id: 1, name: 'John' })

      const markdown = table.export('markdown')

      expect(markdown).toContain('| ID')
      expect(markdown).toContain('| Name')
      expect(markdown).toContain('| ---')
      expect(markdown).toContain('| 1')
    })

    test('should export as HTML', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRow({ id: 1 })

      const html = table.export('html')

      expect(html).toContain('<table>')
      expect(html).toContain('<thead>')
      expect(html).toContain('<tbody>')
      expect(html).toContain('</table>')
    })

    test('should handle export options', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRow({ id: 1 })

      const json = table.export('json', { pretty: true })

      expect(json).toContain('\n') // Pretty printed
    })
  })

  describe('Prisma Integration', () => {
    test('should load data from Prisma result', () => {
      const prismaResult = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ]

      const table = new DataTable().fromPrisma(prismaResult, true)

      expect(table.getRows()).toHaveLength(2)
      expect(table.getColumns().length).toBeGreaterThan(0)
    })

    test('should auto-generate columns from data', () => {
      const prismaResult = [
        { id: 1, name: 'John', createdAt: new Date() },
      ]

      const table = new DataTable().fromPrisma(prismaResult, true)
      const columns = table.getColumns()

      expect(columns.some(col => col.getKey() === 'id')).toBe(true)
      expect(columns.some(col => col.getKey() === 'name')).toBe(true)
      expect(columns.some(col => col.getKey() === 'createdAt')).toBe(true)
    })

    test('should skip relation objects', () => {
      const prismaResult = [
        {
          id: 1,
          name: 'John',
          profile: { bio: 'Test' }, // Relation object
        },
      ]

      const table = new DataTable().fromPrisma(prismaResult, true)
      const columns = table.getColumns()

      expect(columns.some(col => col.getKey() === 'profile')).toBe(false)
    })

    test('should handle empty Prisma result', () => {
      const table = new DataTable().fromPrisma([], true)

      expect(table.getRows()).toHaveLength(0)
      expect(table.getColumns()).toHaveLength(0)
    })
  })

  describe('Clear Method', () => {
    test('should clear all data', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addRows([{ id: 1 }, { id: 2 }])
        .setPagination(10)
        .addFilter('id', 'equals', 1)

      table.clear()

      expect(table.getRows()).toHaveLength(0)
      expect(table.getAllRows()).toHaveLength(0)
    })
  })

  describe('Method Chaining', () => {
    test('should support full method chaining', () => {
      const table = new DataTable()
        .addColumn('id', 'ID')
        .addColumn('name', 'Name')
        .addRows([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ])
        .setPagination(10)
        .setSort('name', 'asc')

      expect(table.getRows()).toHaveLength(2)
    })
  })
})
