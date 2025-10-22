/**
 * Data Tables Module - DataTable Class
 *
 * Main class for creating and managing data tables with support for
 * sorting, filtering, pagination, and Prisma integration.
 */

import type { InlineKeyboardMarkup } from 'grammy/types'
import type {
  ExportFormat,
  ExportOptions,
  FilterConfig,
  FilterOperator,
  PaginationConfig,
  RowData,
  SortConfig,
  TableFormatOptions,
  TableStats,
} from './types.js'
import { InlineKeyboardBuilder } from '../keyboards/index.js'
import { Column } from './column.js'
import { Row } from './row.js'

/**
 * DataTable class for managing tabular data
 *
 * @example
 * ```typescript
 * const table = new DataTable()
 *   .addColumn('id', 'ID')
 *   .addColumn('name', 'Name')
 *   .addColumn('email', 'Email')
 *   .addRows([
 *     { id: 1, name: 'John', email: 'john@example.com' },
 *     { id: 2, name: 'Jane', email: 'jane@example.com' }
 *   ])
 *   .setPagination(10)
 *
 * const formatted = table.format()
 * const keyboard = table.getKeyboard()
 * ```
 */
export class DataTable {
  private columns: Column[] = []
  private rows: Row[] = []
  private originalRows: Row[] = []
  private sortConfig?: SortConfig
  private filters: FilterConfig[] = []
  private pagination?: PaginationConfig
  private formatOptions: TableFormatOptions = {
    showBorders: true,
    showHeaders: true,
    maxColumnWidth: 20,
    ellipsis: '...',
    emptyCell: '-',
    columnSeparator: ' │ ',
    rowSeparator: '─',
  }

  /**
   * Adds a column to the table
   *
   * @param keyOrColumn - Column key or Column instance
   * @param label - Column label (if key is string)
   * @returns This table instance for chaining
   */
  addColumn(keyOrColumn: string | Column, label?: string): this {
    if (keyOrColumn instanceof Column) {
      this.columns.push(keyOrColumn)
    }
    else if (typeof keyOrColumn === 'string' && label) {
      this.columns.push(new Column(keyOrColumn, label))
    }
    else {
      throw new Error('Invalid column parameters')
    }
    return this
  }

  /**
   * Adds multiple columns to the table
   *
   * @param columns - Array of columns or column configs
   * @returns This table instance for chaining
   */
  addColumns(columns: Column[] | Array<{ key: string, label: string }>): this {
    columns.forEach((col) => {
      if (col instanceof Column) {
        this.columns.push(col)
      }
      else {
        this.columns.push(new Column(col.key, col.label))
      }
    })
    return this
  }

  /**
   * Adds a row to the table
   *
   * @param data - Row data
   * @returns This table instance for chaining
   */
  addRow(data: RowData): this {
    const row = new Row(data)
    this.rows.push(row)
    this.originalRows.push(row)
    return this
  }

  /**
   * Adds multiple rows to the table
   *
   * @param dataArray - Array of row data
   * @returns This table instance for chaining
   */
  addRows(dataArray: RowData[]): this {
    const newRows = Row.fromArray(dataArray)
    this.rows.push(...newRows)
    this.originalRows.push(...newRows)
    return this
  }

  /**
   * Loads data from Prisma query result
   *
   * @param prismaResult - Result from Prisma query
   * @param autoColumns - Auto-generate columns from first row
   * @returns This table instance for chaining
   *
   * @example
   * ```typescript
   * const users = await prisma.user.findMany()
   * table.fromPrisma(users, true)
   * ```
   */
  fromPrisma(prismaResult: any[], autoColumns: boolean = false): this {
    if (!Array.isArray(prismaResult) || prismaResult.length === 0) {
      return this
    }

    // Auto-generate columns from first row if requested
    if (autoColumns && this.columns.length === 0) {
      const firstRow = prismaResult[0]
      Object.keys(firstRow).forEach((key) => {
        // Skip internal Prisma fields and relations (objects/arrays)
        const value = firstRow[key]
        if (typeof value !== 'object' || value instanceof Date) {
          const label = key.charAt(0).toUpperCase() + key.slice(1)
          this.addColumn(key, label)
        }
      })
    }

    // Add rows
    this.addRows(prismaResult)

    return this
  }

  /**
   * Sets pagination configuration
   *
   * @param itemsPerPage - Items per page
   * @param currentPage - Current page (default: 1)
   * @returns This table instance for chaining
   */
  setPagination(itemsPerPage: number, currentPage: number = 1): this {
    this.pagination = {
      currentPage,
      itemsPerPage,
      totalItems: this.rows.length,
    }
    return this
  }

  /**
   * Sets the current page
   *
   * @param page - Page number
   * @returns This table instance for chaining
   */
  setPage(page: number): this {
    if (this.pagination) {
      const totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)
      this.pagination.currentPage = Math.max(1, Math.min(page, totalPages))
    }
    return this
  }

  /**
   * Sets sorting configuration
   *
   * @param column - Column key
   * @param direction - Sort direction
   * @returns This table instance for chaining
   */
  setSort(column: string, direction: 'asc' | 'desc' = 'asc'): this {
    const col = this.columns.find(c => c.getKey() === column)
    if (!col || !col.isSortable()) {
      throw new Error(`Column '${column}' is not sortable`)
    }

    this.sortConfig = { column, direction }
    this.applySort()
    return this
  }

  /**
   * Adds a filter
   *
   * @param column - Column key
   * @param operator - Filter operator
   * @param value - Filter value
   * @returns This table instance for chaining
   */
  addFilter(column: string, operator: FilterOperator, value: any): this {
    const col = this.columns.find(c => c.getKey() === column)
    if (!col || !col.isFilterable()) {
      throw new Error(`Column '${column}' is not filterable`)
    }

    this.filters.push({ column, operator, value })
    this.applyFilters()
    return this
  }

  /**
   * Clears all filters
   *
   * @returns This table instance for chaining
   */
  clearFilters(): this {
    this.filters = []
    this.rows = [...this.originalRows]
    if (this.sortConfig) {
      this.applySort()
    }
    return this
  }

  /**
   * Sets format options
   *
   * @param options - Format options
   * @returns This table instance for chaining
   */
  setFormatOptions(options: Partial<TableFormatOptions>): this {
    this.formatOptions = { ...this.formatOptions, ...options }
    return this
  }

  /**
   * Applies sorting to rows
   */
  private applySort(): void {
    if (!this.sortConfig)
      return

    const { column, direction } = this.sortConfig
    const col = this.columns.find(c => c.getKey() === column)
    if (!col)
      return

    const dataType = col.getDataType()
    const multiplier = direction === 'asc' ? 1 : -1

    this.rows.sort((a, b) => {
      const aVal = a.get(column)
      const bVal = b.get(column)

      // Handle null/undefined
      if (aVal == null && bVal == null)
        return 0
      if (aVal == null)
        return 1
      if (bVal == null)
        return -1

      switch (dataType) {
        case 'number':
          return (Number(aVal) - Number(bVal)) * multiplier
        case 'date':
          const aDate = aVal instanceof Date ? aVal : new Date(aVal)
          const bDate = bVal instanceof Date ? bVal : new Date(bVal)
          return (aDate.getTime() - bDate.getTime()) * multiplier
        case 'boolean':
          return (aVal === bVal ? 0 : aVal ? -1 : 1) * multiplier
        default:
          return String(aVal).localeCompare(String(bVal)) * multiplier
      }
    })
  }

  /**
   * Applies filters to rows
   */
  private applyFilters(): void {
    if (this.filters.length === 0) {
      this.rows = [...this.originalRows]
      if (this.sortConfig)
        this.applySort()
      return
    }

    this.rows = this.originalRows.filter((row) => {
      return this.filters.every((filter) => {
        const value = row.get(filter.column)
        return this.matchesFilter(value, filter.operator, filter.value)
      })
    })

    if (this.sortConfig)
      this.applySort()

    // Update pagination total
    if (this.pagination) {
      this.pagination.totalItems = this.rows.length
    }
  }

  /**
   * Checks if a value matches a filter
   */
  private matchesFilter(value: any, operator: FilterOperator, filterValue: any): boolean {
    if (value == null)
      return false

    const strValue = String(value).toLowerCase()
    const strFilter = String(filterValue).toLowerCase()

    switch (operator) {
      case 'equals':
        return value === filterValue
      case 'not_equals':
        return value !== filterValue
      case 'contains':
        return strValue.includes(strFilter)
      case 'not_contains':
        return !strValue.includes(strFilter)
      case 'starts_with':
        return strValue.startsWith(strFilter)
      case 'ends_with':
        return strValue.endsWith(strFilter)
      case 'greater_than':
        return Number(value) > Number(filterValue)
      case 'less_than':
        return Number(value) < Number(filterValue)
      default:
        return false
    }
  }

  /**
   * Gets the rows for the current page
   *
   * @returns Array of rows for current page
   */
  private getPageRows(): Row[] {
    if (!this.pagination) {
      return this.rows
    }

    const { currentPage, itemsPerPage } = this.pagination
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage

    return this.rows.slice(start, end)
  }

  /**
   * Formats the table as a string
   *
   * @returns Formatted table string
   */
  format(): string {
    const pageRows = this.getPageRows()

    if (pageRows.length === 0) {
      return '📋 No data available'
    }

    const lines: string[] = []
    const opts = this.formatOptions

    // Calculate column widths
    const columnWidths = this.calculateColumnWidths(pageRows)

    // Add header
    if (opts.showHeaders) {
      const headerLine = this.formatRow(
        this.columns.map(col => col.getLabel()),
        columnWidths,
      )
      lines.push(headerLine)

      // Add header separator
      if (opts.showBorders && opts.rowSeparator) {
        lines.push(opts.rowSeparator.repeat(headerLine.length))
      }
    }

    // Add data rows
    pageRows.forEach((row) => {
      const formattedValues = row.format(this.columns)
      const rowLine = this.formatRow(formattedValues, columnWidths)
      lines.push(rowLine)
    })

    // Add pagination info
    if (this.pagination) {
      const stats = this.getStats()
      lines.push('')
      lines.push(`📄 Page ${stats.currentPage} of ${stats.totalPages} | Total: ${stats.totalRows} rows`)
    }

    return `\`\`\`\n${lines.join('\n')}\n\`\`\``
  }

  /**
   * Calculates column widths
   */
  private calculateColumnWidths(rows: Row[]): number[] {
    const opts = this.formatOptions
    const maxWidth = opts.maxColumnWidth || 20

    return this.columns.map((col) => {
      // Start with header width
      let width = col.getLabel().length

      // Check all row values
      rows.forEach((row) => {
        const value = col.format(row.get(col.getKey()))
        width = Math.max(width, value.length)
      })

      // Apply column-specific width or max width
      const colWidth = col.getWidth()
      if (colWidth) {
        return Math.min(colWidth, maxWidth)
      }

      return Math.min(width, maxWidth)
    })
  }

  /**
   * Formats a single row
   */
  private formatRow(values: string[], widths: number[]): string {
    const opts = this.formatOptions
    const separator = opts.columnSeparator || ' '

    const formatted = values.map((value, index) => {
      const width = widths[index]
      const column = this.columns[index]
      const alignment = column?.getAlignment() || 'left'

      // Truncate if needed
      let displayValue = value
      if (value.length > width) {
        const ellipsis = opts.ellipsis || '...'
        displayValue = value.substring(0, width - ellipsis.length) + ellipsis
      }

      // Apply alignment
      return this.alignText(displayValue, width, alignment)
    })

    return formatted.join(separator)
  }

  /**
   * Aligns text within a width
   */
  private alignText(text: string, width: number, alignment: 'left' | 'center' | 'right'): string {
    const padding = width - text.length

    if (padding <= 0)
      return text

    switch (alignment) {
      case 'right':
        return ' '.repeat(padding) + text
      case 'center':
        const leftPad = Math.floor(padding / 2)
        const rightPad = padding - leftPad
        return ' '.repeat(leftPad) + text + ' '.repeat(rightPad)
      default:
        return text + ' '.repeat(padding)
    }
  }

  /**
   * Gets table statistics
   *
   * @returns Table stats
   */
  getStats(): TableStats {
    const totalPages = this.pagination
      ? Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage)
      : 1

    return {
      totalRows: this.originalRows.length,
      totalColumns: this.columns.length,
      filteredRows: this.rows.length,
      currentPage: this.pagination?.currentPage || 1,
      totalPages,
    }
  }

  /**
   * Gets an inline keyboard for table navigation
   *
   * @param callbackPrefix - Prefix for callback data
   * @returns Inline keyboard markup
   */
  getKeyboard(callbackPrefix: string = 'table'): InlineKeyboardMarkup {
    const builder = new InlineKeyboardBuilder()

    if (!this.pagination) {
      return builder.build()
    }

    const stats = this.getStats()

    // Add pagination
    builder.pagination(stats.currentPage, stats.totalPages, `${callbackPrefix}:page`)

    // Add sort buttons for sortable columns
    const sortableColumns = this.columns.filter(col => col.isSortable())
    if (sortableColumns.length > 0) {
      builder.row()
      sortableColumns.slice(0, 3).forEach((col) => {
        const icon = this.sortConfig?.column === col.getKey()
          ? this.sortConfig.direction === 'asc' ? '↑' : '↓'
          : '⇅'
        builder.add(
          `${icon} ${col.getLabel()}`,
          `${callbackPrefix}:sort:${col.getKey()}`,
        )
      })
    }

    // Add filter/refresh row
    builder.row()
    if (this.filters.length > 0) {
      builder.add('🔍 Clear Filters', `${callbackPrefix}:clear_filters`)
    }
    builder.add('🔄 Refresh', `${callbackPrefix}:refresh`)

    return builder.build()
  }

  /**
   * Exports the table data
   *
   * @param format - Export format
   * @param options - Export options
   * @returns Exported data as string
   */
  export(format: ExportFormat, options?: Partial<ExportOptions>): string {
    const opts: ExportOptions = {
      format,
      includeHeaders: true,
      ...options,
    }

    switch (format) {
      case 'csv':
        return this.exportCSV(opts)
      case 'json':
        return this.exportJSON(opts)
      case 'markdown':
        return this.exportMarkdown(opts)
      case 'html':
        return this.exportHTML(opts)
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }
  }

  /**
   * Exports as CSV
   */
  private exportCSV(options: ExportOptions): string {
    const delimiter = options.delimiter || ','
    const lines: string[] = []

    // Add headers
    if (options.includeHeaders) {
      lines.push(this.columns.map(col => col.getLabel()).join(delimiter))
    }

    // Add rows
    this.rows.forEach((row) => {
      const values = this.columns.map((col) => {
        const value = col.format(row.get(col.getKey()))
        // Escape quotes and wrap in quotes if contains delimiter
        return value.includes(delimiter) || value.includes('"')
          ? `"${value.replace(/"/g, '""')}"`
          : value
      })
      lines.push(values.join(delimiter))
    })

    return lines.join('\n')
  }

  /**
   * Exports as JSON
   */
  private exportJSON(options: ExportOptions): string {
    const data = this.rows.map(row => row.getData())
    return options.pretty
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
  }

  /**
   * Exports as Markdown
   */
  private exportMarkdown(options: ExportOptions): string {
    const lines: string[] = []

    // Add headers
    if (options.includeHeaders) {
      lines.push(`| ${this.columns.map(col => col.getLabel()).join(' | ')} |`)
      lines.push(`| ${this.columns.map(() => '---').join(' | ')} |`)
    }

    // Add rows
    this.rows.forEach((row) => {
      const values = row.format(this.columns)
      lines.push(`| ${values.join(' | ')} |`)
    })

    return lines.join('\n')
  }

  /**
   * Exports as HTML
   */
  private exportHTML(options: ExportOptions): string {
    const lines: string[] = []

    lines.push('<table>')

    // Add headers
    if (options.includeHeaders) {
      lines.push('  <thead>')
      lines.push('    <tr>')
      this.columns.forEach((col) => {
        lines.push(`      <th>${this.escapeHtml(col.getLabel())}</th>`)
      })
      lines.push('    </tr>')
      lines.push('  </thead>')
    }

    // Add rows
    lines.push('  <tbody>')
    this.rows.forEach((row) => {
      lines.push('    <tr>')
      row.format(this.columns).forEach((value: string) => {
        lines.push(`      <td>${this.escapeHtml(value)}</td>`)
      })
      lines.push('    </tr>')
    })
    lines.push('  </tbody>')

    lines.push('</table>')

    return lines.join('\n')
  }

  /**
   * Escapes HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\'': '&#39;',
    }
    return text.replace(/[&<>"']/g, (char: string) => map[char])
  }

  /**
   * Gets all rows (unfiltered)
   *
   * @returns Array of all rows
   */
  getAllRows(): Row[] {
    return [...this.originalRows]
  }

  /**
   * Gets filtered rows
   *
   * @returns Array of filtered rows
   */
  getRows(): Row[] {
    return [...this.rows]
  }

  /**
   * Gets all columns
   *
   * @returns Array of columns
   */
  getColumns(): Column[] {
    return [...this.columns]
  }

  /**
   * Clears all data
   *
   * @returns This table instance for chaining
   */
  clear(): this {
    this.rows = []
    this.originalRows = []
    this.filters = []
    this.sortConfig = undefined
    if (this.pagination) {
      this.pagination.currentPage = 1
      this.pagination.totalItems = 0
    }
    return this
  }
}
