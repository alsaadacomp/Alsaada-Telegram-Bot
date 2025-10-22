#!/usr/bin/env tsx
/**
 * Test Cache Timeout Fix
 * اختبار إصلاح مدة الكاش
 */

import { Database } from '#root/modules/database/index.js'
import { logger } from '#root/modules/services/logger/index.js'
import { settingsManager } from '#root/modules/settings/settings-manager.js'

async function testCacheTimeout() {
  try {
    console.log('🔧 Testing cache timeout fix...')

    // Connect to database
    await Database.connect()
    console.log('✅ Database connected')

    // Initialize settings manager
    await settingsManager.initialize()
    console.log('✅ Settings manager initialized')

    // Test setting cache timeout
    console.log('\n📝 Setting cache timeout to 1000 minutes (60000000 ms)...')
    const success = await settingsManager.set('performance.cache_timeout', 60000000)

    if (success) {
      console.log('✅ Cache timeout set successfully')

      // Test getting cache timeout
      console.log('\n📖 Getting cache timeout...')
      const timeout = await settingsManager.get<number>('performance.cache_timeout', { useCache: false })
      const timeoutMinutes = Math.floor(timeout! / 60000)

      console.log(`📊 Cache timeout: ${timeout} ms (${timeoutMinutes} minutes)`)

      if (timeout === 60000000) {
        console.log('✅ Cache timeout is correct!')
      }
      else {
        console.log('❌ Cache timeout is incorrect!')
      }

      // Test cache stats
      console.log('\n📊 Cache statistics:')
      const stats = settingsManager.getCacheStats()
      const statsMinutes = Math.floor(stats.timeout / 60000)
      console.log(`• Timeout: ${stats.timeout} ms (${statsMinutes} minutes)`)
      console.log(`• Enabled: ${stats.enabled}`)
      console.log(`• Size: ${stats.size} entries`)
    }
    else {
      console.log('❌ Failed to set cache timeout')
    }

    await Database.disconnect()
    console.log('\n✅ Test completed')
  }
  catch (error) {
    console.error('❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the test
testCacheTimeout().catch(console.error)
