#!/usr/bin/env tsx
/**
 * Test Feature Loading
 * اختبار تحميل الميزات
 */

import { featureLoader, featureRegistry } from '../src/bot/features/registry/index.js'

async function testFeatures() {
  console.log('🔍 Testing feature loading...')

  try {
    const result = await featureLoader.loadAll()

    console.log('📊 Load Results:')
    console.log(`✅ Loaded: ${result.loaded}`)
    console.log(`❌ Failed: ${result.failed}`)
    console.log(`📋 Loaded Features: ${result.loadedFeatures.join(', ')}`)

    if (result.failedFeatures.length > 0) {
      console.log('❌ Failed Features:')
      result.failedFeatures.forEach((f) => {
        console.log(`  - ${f.id}: ${f.error}`)
      })
    }

    console.log('\n📋 All Registered Features:')
    const allFeatures = featureRegistry.getAll()
    allFeatures.forEach((f) => {
      console.log(`  - ${f.config.id}: ${f.config.name} (enabled: ${f.config.enabled})`)
    })

    // Check specifically for profile-management
    const profileFeature = featureRegistry.get('profile-management')
    if (profileFeature) {
      console.log('\n✅ Profile Management Feature Found!')
      console.log(`  - Name: ${profileFeature.config.name}`)
      console.log(`  - Enabled: ${profileFeature.config.enabled}`)
      console.log(`  - Order: ${profileFeature.config.order}`)
      console.log(`  - Permissions: ${profileFeature.config.permissions?.join(', ')}`)
    }
    else {
      console.log('\n❌ Profile Management Feature NOT Found!')
    }
  }
  catch (error) {
    console.error('❌ Error testing features:', error)
  }
}

testFeatures()
