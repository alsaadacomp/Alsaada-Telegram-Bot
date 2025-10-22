import { describe, expect, it } from '@jest/globals'
import InventoryService, { InMemoryInventoryRepository } from '../../src/modules/services/inventory/index.js'

describe('InventoryService (in-memory)', () => {
  it('records IN movement and updates stock', async () => {
    const service = new InventoryService(new InMemoryInventoryRepository())
    const { stock, movement } = await service.scanAndRecordFromBarcode('1234567890', {
      type: 'IN',
      quantity: 5,
      productNameFallback: 'Test Product',
      userId: 1,
    })
    expect(movement.type).toBe('IN')
    expect(stock.quantity).toBe(5)
  })

  it('records OUT movement and reduces stock', async () => {
    const service = new InventoryService(new InMemoryInventoryRepository())
    await service.scanAndRecordFromBarcode('1234567890', { type: 'IN', quantity: 10 })
    const { stock } = await service.scanAndRecordFromBarcode('1234567890', { type: 'OUT', quantity: 3 })
    expect(stock.quantity).toBe(7)
  })

  it('ADJUST sets stock to exact quantity', async () => {
    const service = new InventoryService(new InMemoryInventoryRepository())
    await service.scanAndRecordFromBarcode('A', { type: 'IN', quantity: 10 })
    const { stock } = await service.scanAndRecordFromBarcode('A', { type: 'ADJUST', quantity: 2 })
    expect(stock.quantity).toBe(2)
  })
})
