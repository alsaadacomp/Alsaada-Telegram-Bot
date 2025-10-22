/**
 * Inventory (Barcode-based) - Prepared Service (No DB schema required)
 * خدمة مخزون معتمدة على الباركود - جاهزة للاستخدام بدون جداول
 *
 * الهدف: واجهة وبرمجيات جاهزة ليستدعيها مستخدم القالب لاحقاً.
 * - افتراض: البيانات مؤقتة (In-Memory) ويمكن لاحقاً وصلها بقاعدة بيانات.
 */

export type MovementType = 'IN' | 'OUT' | 'ADJUST'

export interface ProductRef {
  barcode: string
  name?: string
  sku?: string
  unit?: string
}

export interface WarehouseRef {
  id: string
  name?: string
}

export interface InventoryMovementInput {
  product: ProductRef
  warehouse?: WarehouseRef
  type: MovementType
  quantity: number
  note?: string
  userId?: number | string
  at?: Date
}

export interface InventoryMovementRecord extends InventoryMovementInput {
  id: string
  at: Date
}

export interface StockLevel {
  product: ProductRef
  warehouse?: WarehouseRef
  quantity: number
  updatedAt: Date
}

export interface InventoryRepository {
  recordMovement: (input: InventoryMovementInput) => Promise<InventoryMovementRecord>
  getStock: (product: ProductRef, warehouse?: WarehouseRef) => Promise<StockLevel>
  getHistory: (product: ProductRef, warehouse?: WarehouseRef, limit?: number) => Promise<InventoryMovementRecord[]>
}

/**
 * Simple in-memory repository (default)
 */
export class InMemoryInventoryRepository implements InventoryRepository {
  private readonly stockKey = (p: ProductRef, w?: WarehouseRef) => `${p.barcode}::${w?.id ?? 'default'}`
  private stock = new Map<string, StockLevel>()
  private history = new Map<string, InventoryMovementRecord[]>()

  async recordMovement(input: InventoryMovementInput): Promise<InventoryMovementRecord> {
    const key = this.stockKey(input.product, input.warehouse)
    const current = this.stock.get(key) ?? {
      product: input.product,
      warehouse: input.warehouse,
      quantity: 0,
      updatedAt: new Date(),
    }

    let newQty = current.quantity
    if (input.type === 'IN')
      newQty += input.quantity
    else if (input.type === 'OUT')
      newQty -= input.quantity
    else if (input.type === 'ADJUST')
      newQty = input.quantity

    const movement: InventoryMovementRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      product: input.product,
      warehouse: input.warehouse,
      type: input.type,
      quantity: input.quantity,
      note: input.note,
      userId: input.userId,
      at: input.at ?? new Date(),
    }

    this.stock.set(key, {
      product: input.product,
      warehouse: input.warehouse,
      quantity: newQty,
      updatedAt: movement.at,
    })

    const arr = this.history.get(key) ?? []
    arr.unshift(movement)
    this.history.set(key, arr.slice(0, 500))

    return movement
  }

  async getStock(product: ProductRef, warehouse?: WarehouseRef): Promise<StockLevel> {
    const key = this.stockKey(product, warehouse)
    return this.stock.get(key) ?? {
      product,
      warehouse,
      quantity: 0,
      updatedAt: new Date(0),
    }
  }

  async getHistory(product: ProductRef, warehouse?: WarehouseRef, limit = 50): Promise<InventoryMovementRecord[]> {
    const key = this.stockKey(product, warehouse)
    const items = this.history.get(key) ?? []
    return items.slice(0, limit)
  }
}

/**
 * Facade service – pluggable repository
 */
export class InventoryService {
  constructor(private readonly repo: InventoryRepository = new InMemoryInventoryRepository()) {}

  recordMovement = (input: InventoryMovementInput) => this.repo.recordMovement(input)
  getStock = (product: ProductRef, warehouse?: WarehouseRef) => this.repo.getStock(product, warehouse)
  getHistory = (product: ProductRef, warehouse?: WarehouseRef, limit?: number) => this.repo.getHistory(product, warehouse, limit)

  /**
   * Shortcut to handle scanned barcode directly
   */
  async scanAndRecordFromBarcode(barcode: string, options: {
    type: MovementType
    quantity: number
    productNameFallback?: string
    warehouseId?: string
    warehouseName?: string
    note?: string
    userId?: number | string
  }): Promise<{ stock: StockLevel, movement: InventoryMovementRecord }> {
    const product: ProductRef = { barcode, name: options.productNameFallback }
    const warehouse: WarehouseRef | undefined = options.warehouseId ? { id: options.warehouseId, name: options.warehouseName } : undefined

    const movement = await this.repo.recordMovement({
      product,
      warehouse,
      type: options.type,
      quantity: options.quantity,
      note: options.note,
      userId: options.userId,
    })
    const stock = await this.repo.getStock(product, warehouse)
    return { stock, movement }
  }
}

export default InventoryService
