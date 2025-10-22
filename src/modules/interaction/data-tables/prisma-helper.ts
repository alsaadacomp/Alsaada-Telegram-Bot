/**
 * Data Tables Module - Prisma Integration Helper
 *
 * Helper functions for integrating DataTable with Prisma
 */

import type { ColumnDataType } from './types.js'
import { Column } from './column.js'
import { DataTable } from './data-table.js'

/**
 * Prisma field type mapping
 */
const PRISMA_TYPE_MAP: Record<string, ColumnDataType> = {
  Int: 'number',
  Float: 'number',
  Decimal: 'number',
  BigInt: 'number',
  Boolean: 'boolean',
  DateTime: 'date',
  Date: 'date',
  String: 'string',
  Json: 'string',
  Bytes: 'string',
}

/**
 * Configuration for Prisma table integration
 */
export interface PrismaTableConfig {
  /**
   * Column configurations
   * Maps Prisma field names to display configurations
   */
  columns?: Record<string, {
    label?: string
    hide?: boolean
    width?: number
    sortable?: boolean
    filterable?: boolean
    formatter?: (value: any) => string
  }>

  /**
   * Fields to exclude from the table
   */
  exclude?: string[]

  /**
   * Fields to include (if specified, only these will be shown)
   */
  include?: string[]

  /**
   * Default items per page
   */
  itemsPerPage?: number

  /**
   * Auto-detect column types from data
   */
  autoDetectTypes?: boolean
}

/**
 * Creates a DataTable from Prisma query result with automatic configuration
 *
 * @param prismaResult - Result from Prisma query
 * @param config - Configuration options
 * @returns Configured DataTable instance
 *
 * @example
 * ```typescript
 * const users = await prisma.user.findMany({
 *   select: { id: true, name: true, email: true, createdAt: true }
 * })
 *
 * const table = createPrismaTable(users, {
 *   columns: {
 *     id: { label: 'ID', width: 5 },
 *     name: { label: 'Full Name', width: 20 },
 *     email: { label: 'Email Address', width: 25 },
 *     createdAt: { label: 'Registered', formatter: (date) => date.toLocaleDateString() }
 *   },
 *   itemsPerPage: 10
 * })
 * ```
 */
export function createPrismaTable(
  prismaResult: any[],
  config: PrismaTableConfig = {},
): DataTable {
  const table = new DataTable()

  if (!Array.isArray(prismaResult) || prismaResult.length === 0) {
    return table
  }

  const firstRow = prismaResult[0]
  const fieldNames = Object.keys(firstRow)

  // Filter fields based on include/exclude
  let visibleFields = fieldNames

  if (config.include && config.include.length > 0) {
    visibleFields = visibleFields.filter(field => config.include!.includes(field))
  }

  if (config.exclude && config.exclude.length > 0) {
    visibleFields = visibleFields.filter(field => !config.exclude!.includes(field))
  }

  // Add columns
  visibleFields.forEach((fieldName) => {
    const value = firstRow[fieldName]
    const columnConfig = config.columns?.[fieldName] || {}

    // Skip if explicitly hidden
    if (columnConfig.hide)
      return

    // Skip relation objects and arrays
    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      return
    }

    // Create column
    const label = columnConfig.label || formatFieldName(fieldName)
    const column = new Column(fieldName, label)

    // Auto-detect or set data type
    if (config.autoDetectTypes !== false) {
      const dataType = detectDataType(value)
      column.setDataType(dataType)
    }

    // Apply configuration
    if (columnConfig.width) {
      column.setWidth(columnConfig.width)
    }

    if (columnConfig.sortable !== undefined) {
      column.setSortable(columnConfig.sortable)
    }

    if (columnConfig.filterable !== undefined) {
      column.setFilterable(columnConfig.filterable)
    }

    if (columnConfig.formatter) {
      column.setFormatter(columnConfig.formatter)
    }

    table.addColumn(column)
  })

  // Add rows
  table.addRows(prismaResult)

  // Set pagination if specified
  if (config.itemsPerPage) {
    table.setPagination(config.itemsPerPage)
  }

  return table
}

/**
 * Creates a DataTable directly from Prisma with pagination support
 *
 * @param prismaModel - Prisma model (e.g., prisma.user)
 * @param config - Configuration options
 * @returns Configured DataTable instance
 *
 * @example
 * ```typescript
 * const table = await createPrismaTableWithQuery(
 *   prisma.user,
 *   {
 *     where: { active: true },
 *     orderBy: { createdAt: 'desc' },
 *     take: 10,
 *     skip: 0
 *   },
 *   {
 *     exclude: ['password'],
 *     itemsPerPage: 10
 *   }
 * )
 * ```
 */
export async function createPrismaTableWithQuery(
  prismaModel: any,
  query: any = {},
  config: PrismaTableConfig = {},
): Promise<DataTable> {
  const result = await prismaModel.findMany(query)
  return createPrismaTable(result, config)
}

/**
 * Formats a field name to a readable label
 *
 * @param fieldName - Field name
 * @returns Formatted label
 *
 * @example
 * formatFieldName('createdAt') // 'Created At'
 * formatFieldName('user_id') // 'User Id'
 */
function formatFieldName(fieldName: string): string {
  return fieldName
    // Split on capital letters
    .replace(/([A-Z])/g, ' $1')
    // Split on underscores
    .replace(/_/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, char => char.toUpperCase())
    .trim()
}

/**
 * Detects the data type from a value
 *
 * @param value - Value to detect type from
 * @returns Detected data type
 */
function detectDataType(value: any): ColumnDataType {
  if (value === null || value === undefined) {
    return 'string'
  }

  if (value instanceof Date) {
    return 'date'
  }

  if (typeof value === 'boolean') {
    return 'boolean'
  }

  if (typeof value === 'number' || typeof value === 'bigint') {
    return 'number'
  }

  return 'string'
}

/**
 * Creates pagination parameters for Prisma from table state
 *
 * @param currentPage - Current page number
 * @param itemsPerPage - Items per page
 * @returns Prisma pagination parameters (skip, take)
 *
 * @example
 * ```typescript
 * const pagination = getPrismaPagination(2, 10)
 * // { skip: 10, take: 10 }
 *
 * const users = await prisma.user.findMany({
 *   ...pagination
 * })
 * ```
 */
export function getPrismaPagination(
  currentPage: number,
  itemsPerPage: number,
): { skip: number, take: number } {
  return {
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
  }
}

/**
 * Creates Prisma orderBy from table sort configuration
 *
 * @param column - Column to sort by
 * @param direction - Sort direction
 * @returns Prisma orderBy parameter
 *
 * @example
 * ```typescript
 * const orderBy = getPrismaOrderBy('createdAt', 'desc')
 * // { createdAt: 'desc' }
 *
 * const users = await prisma.user.findMany({
 *   orderBy
 * })
 * ```
 */
export function getPrismaOrderBy(
  column: string,
  direction: 'asc' | 'desc',
): Record<string, 'asc' | 'desc'> {
  return { [column]: direction }
}

/**
 * Creates Prisma where clause from table filters
 *
 * @param filters - Array of filter configurations
 * @returns Prisma where parameter
 *
 * @example
 * ```typescript
 * const where = getPrismaWhere([
 *   { column: 'name', operator: 'contains', value: 'John' },
 *   { column: 'age', operator: 'greater_than', value: 18 }
 * ])
 *
 * const users = await prisma.user.findMany({ where })
 * ```
 */
export function getPrismaWhere(
  filters: Array<{ column: string, operator: string, value: any }>,
): any {
  const where: any = {}

  filters.forEach((filter) => {
    const { column, operator, value } = filter

    switch (operator) {
      case 'equals':
        where[column] = value
        break
      case 'not_equals':
        where[column] = { not: value }
        break
      case 'contains':
        where[column] = { contains: value, mode: 'insensitive' }
        break
      case 'not_contains':
        where[column] = { not: { contains: value, mode: 'insensitive' } }
        break
      case 'starts_with':
        where[column] = { startsWith: value, mode: 'insensitive' }
        break
      case 'ends_with':
        where[column] = { endsWith: value, mode: 'insensitive' }
        break
      case 'greater_than':
        where[column] = { gt: value }
        break
      case 'less_than':
        where[column] = { lt: value }
        break
    }
  })

  return where
}
