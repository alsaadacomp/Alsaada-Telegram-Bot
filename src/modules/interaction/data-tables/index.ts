/**
 * Data Tables Module
 *
 * Provides tools for creating and managing interactive data tables
 * with sorting, filtering, pagination, and Prisma integration.
 *
 * @module data-tables
 */

export { Column } from './column.js'
export { DataTable } from './data-table.js'
export {
  createPrismaTable,
  createPrismaTableWithQuery,
  getPrismaOrderBy,
  getPrismaPagination,
  getPrismaWhere,
} from './prisma-helper.js'
export type { PrismaTableConfig } from './prisma-helper.js'
export { Row } from './row.js'
export type {
  ColumnAlignment,
  ColumnConfig,
  ColumnDataType,
  DataTableConfig,
  ExportFormat,
  ExportOptions,
  FilterConfig,
  FilterOperator,
  PaginationConfig,
  RowData,
  SortConfig,
  SortDirection,
  TableFormatOptions,
  TableStats,
} from './types.js'
