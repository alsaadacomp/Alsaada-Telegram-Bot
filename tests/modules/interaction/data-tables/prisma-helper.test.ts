/**
 * Tests for Prisma Helper functions
 */

import { describe, expect, test } from '@jest/globals'
import {
  createPrismaTable,
  getPrismaOrderBy,
  getPrismaPagination,
  getPrismaWhere,
} from '../../../../src/modules/interaction/data-tables/prisma-helper.js'

describe('Prisma Helper', () => {
  describe('createPrismaTable', () => {
    test('should create table from Prisma result', () => {
      const prismaResult = [
        { id: 1, name: 'John', email: 'john@example.com' },
        { id: 2, name: 'Jane', email: 'jane@example.com' },
      ]

      const table = createPrismaTable(prismaResult)

      expect(table.getRows()).toHaveLength(2)
    })

    test('should handle empty result', () => {
      const table = createPrismaTable([])

      expect(table.getRows()).toHaveLength(0)
      expect(table.getColumns()).toHaveLength(0)
    })

    test('should exclude specified fields', () => {
      const prismaResult = [
        { id: 1, name: 'John', password: 'secret' },
      ]

      const table = createPrismaTable(prismaResult, {
        exclude: ['password'],
      })

      const columns = table.getColumns()
      expect(columns.some(col => col.getKey() === 'password')).toBe(false)
    })

    test('should include only specified fields', () => {
      const prismaResult = [
        { id: 1, name: 'John', email: 'john@example.com', password: 'secret' },
      ]

      const table = createPrismaTable(prismaResult, {
        include: ['id', 'name'],
      })

      const columns = table.getColumns()
      expect(columns).toHaveLength(2)
      expect(columns[0].getKey()).toBe('id')
      expect(columns[1].getKey()).toBe('name')
    })

    test('should apply custom column configuration', () => {
      const prismaResult = [
        { id: 1, name: 'John' },
      ]

      const table = createPrismaTable(prismaResult, {
        columns: {
          id: { label: 'User ID', width: 5 },
          name: { label: 'Full Name', width: 20 },
        },
      })

      const columns = table.getColumns()
      expect(columns[0].getLabel()).toBe('User ID')
      expect(columns[0].getWidth()).toBe(5)
    })

    test('should hide specified columns', () => {
      const prismaResult = [
        { id: 1, name: 'John', internal: 'data' },
      ]

      const table = createPrismaTable(prismaResult, {
        columns: {
          internal: { hide: true },
        },
      })

      const columns = table.getColumns()
      expect(columns.some(col => col.getKey() === 'internal')).toBe(false)
    })

    test('should apply custom formatter', () => {
      const prismaResult = [
        { id: 1, price: 100 },
      ]

      const table = createPrismaTable(prismaResult, {
        columns: {
          price: {
            formatter: value => `$${value}`,
          },
        },
      })

      const rows = table.getRows()
      const columns = table.getColumns()
      const priceColumn = columns.find(col => col.getKey() === 'price')!

      expect(priceColumn.format(rows[0].get('price'))).toBe('$100')
    })

    test('should set pagination', () => {
      const prismaResult = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))

      const table = createPrismaTable(prismaResult, {
        itemsPerPage: 10,
      })

      const stats = table.getStats()
      expect(stats.totalPages).toBe(3)
    })

    test('should skip relation objects', () => {
      const prismaResult = [
        {
          id: 1,
          name: 'John',
          profile: { bio: 'Test' },
          posts: [{ id: 1 }],
        },
      ]

      const table = createPrismaTable(prismaResult)
      const columns = table.getColumns()

      expect(columns.some(col => col.getKey() === 'profile')).toBe(false)
      expect(columns.some(col => col.getKey() === 'posts')).toBe(false)
    })

    test('should keep Date objects', () => {
      const date = new Date('2024-01-01')
      const prismaResult = [
        { id: 1, createdAt: date },
      ]

      const table = createPrismaTable(prismaResult)
      const columns = table.getColumns()

      expect(columns.some(col => col.getKey() === 'createdAt')).toBe(true)
    })

    test('should auto-detect column types', () => {
      const prismaResult = [
        {
          id: 1,
          name: 'John',
          age: 25,
          active: true,
          createdAt: new Date(),
        },
      ]

      const table = createPrismaTable(prismaResult, {
        autoDetectTypes: true,
      })

      const columns = table.getColumns()
      const ageCol = columns.find(col => col.getKey() === 'age')
      const activeCol = columns.find(col => col.getKey() === 'active')

      expect(ageCol?.getDataType()).toBe('number')
      expect(activeCol?.getDataType()).toBe('boolean')
    })

    test('should format field names nicely', () => {
      const prismaResult = [
        { userId: 1, createdAt: new Date(), user_name: 'John' },
      ]

      const table = createPrismaTable(prismaResult)
      const columns = table.getColumns()

      const userIdCol = columns.find(col => col.getKey() === 'userId')
      const createdCol = columns.find(col => col.getKey() === 'createdAt')
      const nameCol = columns.find(col => col.getKey() === 'user_name')

      expect(userIdCol?.getLabel()).toBe('User Id')
      expect(createdCol?.getLabel()).toBe('Created At')
      expect(nameCol?.getLabel()).toBe('User Name')
    })
  })

  describe('getPrismaPagination', () => {
    test('should return skip and take for page 1', () => {
      const pagination = getPrismaPagination(1, 10)

      expect(pagination).toEqual({ skip: 0, take: 10 })
    })

    test('should return skip and take for page 2', () => {
      const pagination = getPrismaPagination(2, 10)

      expect(pagination).toEqual({ skip: 10, take: 10 })
    })

    test('should return skip and take for page 3', () => {
      const pagination = getPrismaPagination(3, 10)

      expect(pagination).toEqual({ skip: 20, take: 10 })
    })

    test('should handle different page sizes', () => {
      const pagination = getPrismaPagination(2, 25)

      expect(pagination).toEqual({ skip: 25, take: 25 })
    })
  })

  describe('getPrismaOrderBy', () => {
    test('should return orderBy for ascending', () => {
      const orderBy = getPrismaOrderBy('name', 'asc')

      expect(orderBy).toEqual({ name: 'asc' })
    })

    test('should return orderBy for descending', () => {
      const orderBy = getPrismaOrderBy('createdAt', 'desc')

      expect(orderBy).toEqual({ createdAt: 'desc' })
    })

    test('should work with any column name', () => {
      const orderBy = getPrismaOrderBy('customField', 'asc')

      expect(orderBy).toEqual({ customField: 'asc' })
    })
  })

  describe('getPrismaWhere', () => {
    test('should convert equals filter', () => {
      const where = getPrismaWhere([
        { column: 'status', operator: 'equals', value: 'active' },
      ])

      expect(where).toEqual({ status: 'active' })
    })

    test('should convert not_equals filter', () => {
      const where = getPrismaWhere([
        { column: 'status', operator: 'not_equals', value: 'inactive' },
      ])

      expect(where).toEqual({ status: { not: 'inactive' } })
    })

    test('should convert contains filter', () => {
      const where = getPrismaWhere([
        { column: 'name', operator: 'contains', value: 'john' },
      ])

      expect(where).toEqual({
        name: { contains: 'john', mode: 'insensitive' },
      })
    })

    test('should convert not_contains filter', () => {
      const where = getPrismaWhere([
        { column: 'name', operator: 'not_contains', value: 'spam' },
      ])

      expect(where).toEqual({
        name: { not: { contains: 'spam', mode: 'insensitive' } },
      })
    })

    test('should convert starts_with filter', () => {
      const where = getPrismaWhere([
        { column: 'email', operator: 'starts_with', value: 'admin' },
      ])

      expect(where).toEqual({
        email: { startsWith: 'admin', mode: 'insensitive' },
      })
    })

    test('should convert ends_with filter', () => {
      const where = getPrismaWhere([
        { column: 'email', operator: 'ends_with', value: '@example.com' },
      ])

      expect(where).toEqual({
        email: { endsWith: '@example.com', mode: 'insensitive' },
      })
    })

    test('should convert greater_than filter', () => {
      const where = getPrismaWhere([
        { column: 'age', operator: 'greater_than', value: 18 },
      ])

      expect(where).toEqual({ age: { gt: 18 } })
    })

    test('should convert less_than filter', () => {
      const where = getPrismaWhere([
        { column: 'age', operator: 'less_than', value: 65 },
      ])

      expect(where).toEqual({ age: { lt: 65 } })
    })

    test('should handle multiple filters', () => {
      const where = getPrismaWhere([
        { column: 'age', operator: 'greater_than', value: 18 },
        { column: 'status', operator: 'equals', value: 'active' },
      ])

      expect(where).toEqual({
        age: { gt: 18 },
        status: 'active',
      })
    })

    test('should handle empty filters array', () => {
      const where = getPrismaWhere([])

      expect(where).toEqual({})
    })
  })
})
