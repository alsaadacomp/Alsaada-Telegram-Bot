/**
 * Data Tables Module - Column Class
 *
 * Represents a single column in a data table.
 */

import type { ColumnAlignment, ColumnConfig, ColumnDataType } from './types.js'

/**
 * Column class representing a table column
 *
 * @example
 * ```typescript
 * const column = new Column('id', 'User ID')
 *   .setDataType('number')
 *   .setAlignment('right')
 *   .setSortable(true)
 * ```
 */
export class Column {
  private config: ColumnConfig

  /**
   * Creates a new column
   *
   * @param key - Unique key for the column
   * @param label - Display label for the column
   */
  constructor(key: string, label: string) {
    this.config = {
      key,
      label,
      dataType: 'string',
      alignment: 'left',
      sortable: true,
      filterable: true,
    }
  }

  /**
   * Sets the data type for the column
   *
   * @param dataType - Data type
   * @returns This column instance for chaining
   */
  setDataType(dataType: ColumnDataType): this {
    this.config.dataType = dataType
    return this
  }

  /**
   * Sets the alignment for the column
   *
   * @param alignment - Column alignment
   * @returns This column instance for chaining
   */
  setAlignment(alignment: ColumnAlignment): this {
    this.config.alignment = alignment
    return this
  }

  /**
   * Sets the width for the column
   *
   * @param width - Column width in characters
   * @returns This column instance for chaining
   */
  setWidth(width: number): this {
    this.config.width = width
    return this
  }

  /**
   * Sets whether the column is sortable
   *
   * @param sortable - Is sortable
   * @returns This column instance for chaining
   */
  setSortable(sortable: boolean): this {
    this.config.sortable = sortable
    return this
  }

  /**
   * Sets whether the column is filterable
   *
   * @param filterable - Is filterable
   * @returns This column instance for chaining
   */
  setFilterable(filterable: boolean): this {
    this.config.filterable = filterable
    return this
  }

  /**
   * Sets a custom formatter function
   *
   * @param formatter - Formatter function
   * @returns This column instance for chaining
   */
  setFormatter(formatter: (value: any) => string): this {
    this.config.formatter = formatter
    return this
  }

  /**
   * Formats a value using the column's formatter
   *
   * @param value - Value to format
   * @returns Formatted string
   */
  format(value: any): string {
    if (this.config.formatter) {
      return this.config.formatter(value)
    }

    // Default formatting based on data type
    if (value === null || value === undefined) {
      return ''
    }

    switch (this.config.dataType) {
      case 'boolean':
        return value ? '✓' : '✗'
      case 'date':
        return value instanceof Date ? value.toLocaleDateString() : String(value)
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value)
      default:
        return String(value)
    }
  }

  /**
   * Gets the column key
   *
   * @returns Column key
   */
  getKey(): string {
    return this.config.key
  }

  /**
   * Gets the column label
   *
   * @returns Column label
   */
  getLabel(): string {
    return this.config.label
  }

  /**
   * Gets the column data type
   *
   * @returns Data type
   */
  getDataType(): ColumnDataType {
    return this.config.dataType || 'string'
  }

  /**
   * Gets the column alignment
   *
   * @returns Alignment
   */
  getAlignment(): ColumnAlignment {
    return this.config.alignment || 'left'
  }

  /**
   * Gets the column width
   *
   * @returns Width or undefined
   */
  getWidth(): number | undefined {
    return this.config.width
  }

  /**
   * Checks if the column is sortable
   *
   * @returns Is sortable
   */
  isSortable(): boolean {
    return this.config.sortable !== false
  }

  /**
   * Checks if the column is filterable
   *
   * @returns Is filterable
   */
  isFilterable(): boolean {
    return this.config.filterable !== false
  }

  /**
   * Gets the column configuration
   *
   * @returns Column configuration
   */
  getConfig(): ColumnConfig {
    return { ...this.config }
  }

  /**
   * Creates a column from configuration
   *
   * @param config - Column configuration
   * @returns Column instance
   */
  static fromConfig(config: ColumnConfig): Column {
    const column = new Column(config.key, config.label)

    if (config.dataType)
      column.setDataType(config.dataType)
    if (config.alignment)
      column.setAlignment(config.alignment)
    if (config.width)
      column.setWidth(config.width)
    if (config.sortable !== undefined)
      column.setSortable(config.sortable)
    if (config.filterable !== undefined)
      column.setFilterable(config.filterable)
    if (config.formatter)
      column.setFormatter(config.formatter)

    return column
  }
}
