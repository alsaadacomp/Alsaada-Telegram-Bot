/**
 * Data Tables Module - Row Class
 *
 * Represents a single row in a data table.
 */

import type { Column } from './column.js'
import type { RowData } from './types.js'

/**
 * Row metadata interface
 */
interface RowMetadata {
  selected?: boolean
  highlighted?: boolean
  index?: number
}

/**
 * Row class representing a table row
 *
 * @example
 * ```typescript
 * const row = new Row({ id: 1, name: 'John', email: 'john@example.com' })
 * const value = row.get('name') // 'John'
 * ```
 */
export class Row {
  private data: RowData
  private metadata: RowMetadata

  /**
   * Creates a new row
   *
   * @param data - Row data
   */
  constructor(data: RowData) {
    this.data = { ...data }
    this.metadata = {}
  }

  /**
   * Gets a value from the row
   *
   * @param key - Column key
   * @returns Value or undefined
   */
  get(key: string): any {
    return this.data[key]
  }

  /**
   * Sets a value in the row
   *
   * @param key - Column key
   * @param value - Value to set
   * @returns This row instance for chaining
   */
  set(key: string, value: any): this {
    this.data[key] = value
    return this
  }

  /**
   * Checks if the row has a value for a key
   *
   * @param key - Column key
   * @returns Has value
   */
  has(key: string): boolean {
    return key in this.data
  }

  /**
   * Gets all row data
   *
   * @returns Row data
   */
  getData(): RowData {
    return { ...this.data }
  }

  /**
   * Gets all keys in the row
   *
   * @returns Array of keys
   */
  getKeys(): string[] {
    return Object.keys(this.data)
  }

  /**
   * Marks the row as selected
   *
   * @param selected - Is selected
   * @returns This row instance for chaining
   */
  setSelected(selected: boolean): this {
    this.metadata.selected = selected
    return this
  }

  /**
   * Checks if the row is selected
   *
   * @returns Is selected
   */
  isSelected(): boolean {
    return this.metadata.selected === true
  }

  /**
   * Marks the row as highlighted
   *
   * @param highlighted - Is highlighted
   * @returns This row instance for chaining
   */
  setHighlighted(highlighted: boolean): this {
    this.metadata.highlighted = highlighted
    return this
  }

  /**
   * Checks if the row is highlighted
   *
   * @returns Is highlighted
   */
  isHighlighted(): boolean {
    return this.metadata.highlighted === true
  }

  /**
   * Sets the row index
   *
   * @param index - Row index
   * @returns This row instance for chaining
   */
  setIndex(index: number): this {
    this.metadata.index = index
    return this
  }

  /**
   * Gets the row index
   *
   * @returns Row index or undefined
   */
  getIndex(): number | undefined {
    return this.metadata.index
  }

  /**
   * Formats the row values using columns
   *
   * @param columns - Array of columns
   * @returns Array of formatted values
   */
  format(columns: Column[]): string[] {
    return columns.map((column) => {
      const value = this.get(column.getKey())
      return column.format(value)
    })
  }

  /**
   * Converts the row to a plain object
   *
   * @returns Plain object with data and metadata
   */
  toJSON(): { data: RowData, metadata: RowMetadata } {
    return {
      data: this.getData(),
      metadata: { ...this.metadata },
    }
  }

  /**
   * Creates a row from plain data
   *
   * @param data - Row data
   * @returns Row instance
   */
  static fromData(data: RowData): Row {
    return new Row(data)
  }

  /**
   * Creates multiple rows from an array of data
   *
   * @param dataArray - Array of row data
   * @returns Array of row instances
   */
  static fromArray(dataArray: RowData[]): Row[] {
    return dataArray.map((data: RowData) => new Row(data))
  }
}
