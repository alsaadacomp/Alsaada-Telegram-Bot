/**
 * Data Tables Module - Type Definitions
 *
 * This module provides types for building interactive data tables
 * with sorting, filtering, and pagination support.
 */

/**
 * Column alignment options
 */
export type ColumnAlignment = 'left' | 'center' | 'right'

/**
 * Data types for columns
 */
export type ColumnDataType = 'string' | 'number' | 'boolean' | 'date'

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc'

/**
 * Filter operator
 */
export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'starts_with'
  | 'ends_with'

/**
 * Column configuration
 */
export interface ColumnConfig {
  key: string
  label: string
  dataType?: ColumnDataType
  alignment?: ColumnAlignment
  width?: number
  sortable?: boolean
  filterable?: boolean
  formatter?: (value: any) => string
}

/**
 * Row data
 */
export interface RowData {
  [key: string]: any
}

/**
 * Sort configuration
 */
export interface SortConfig {
  column: string
  direction: SortDirection
}

/**
 * Filter configuration
 */
export interface FilterConfig {
  column: string
  operator: FilterOperator
  value: any
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

/**
 * Table formatting options
 */
export interface TableFormatOptions {
  showBorders?: boolean
  showHeaders?: boolean
  maxColumnWidth?: number
  ellipsis?: string
  emptyCell?: string
  columnSeparator?: string
  rowSeparator?: string
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'json' | 'markdown' | 'html'

/**
 * Export options
 */
export interface ExportOptions {
  format: ExportFormat
  includeHeaders?: boolean
  delimiter?: string // For CSV
  pretty?: boolean // For JSON
}

/**
 * Table statistics
 */
export interface TableStats {
  totalRows: number
  totalColumns: number
  filteredRows: number
  currentPage: number
  totalPages: number
}

/**
 * Data table configuration
 */
export interface DataTableConfig {
  columns: ColumnConfig[]
  rows: RowData[]
  pagination?: {
    enabled: boolean
    itemsPerPage: number
  }
  sorting?: {
    enabled: boolean
    defaultSort?: SortConfig
  }
  filtering?: {
    enabled: boolean
    filters?: FilterConfig[]
  }
  formatting?: TableFormatOptions
}
