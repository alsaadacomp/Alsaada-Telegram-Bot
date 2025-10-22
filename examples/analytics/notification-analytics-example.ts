/**
 * Notification Analytics Example
 *
 * Demonstrates notification delivery analytics and patterns.
 */

import { AnalyticsService } from '../../src/modules/analytics/index.js'

const analytics = new AnalyticsService()

async function main() {
  console.log('🔔 Notification Analytics Example\n')

  // Simulate notification sending
  console.log('1. Simulating notification activity...')

  // Morning notifications
  for (let i = 0; i < 10; i++) {
    analytics.trackEvent('notification.sent', {
      type: 'announcement',
      priority: 'normal',
      userId: 100 + i,
    })
    analytics.trackEvent('notification.delivered', {})
  }

  // Afternoon alerts
  for (let i = 0; i < 5; i++) {
    analytics.trackEvent('notification.sent', {
      type: 'alert',
      priority: 'urgent',
      userId: 200 + i,
    })
    analytics.trackEvent('notification.delivered', {})
  }

  // Some failed notifications
  for (let i = 0; i < 2; i++) {
    analytics.trackEvent('notification.sent', {
      type: 'reminder',
      priority: 'normal',
      userId: 300 + i,
    })
    analytics.trackEvent('notification.failed', {})
  }

  // Evening notifications
  for (let i = 0; i < 8; i++) {
    analytics.trackEvent('notification.sent', {
      type: 'info',
      priority: 'normal',
      userId: 400 + i,
    })
    if (i < 7) {
      analytics.trackEvent('notification.delivered', {})
    }
  }

  console.log('   ✅ Simulated 25 notifications\n')

  // Get notification analytics
  console.log('2. Notification Analytics:\n')

  const notifStats = analytics.getNotificationAnalytics({
    start: new Date(Date.now() - 86400000),
    end: new Date(),
  })

  console.log('   📊 Overall Statistics:')
  console.log(`   - Total Sent: ${notifStats.totalSent}`)
  console.log(`   - Total Delivered: ${notifStats.totalDelivered}`)
  console.log(`   - Total Failed: ${notifStats.totalFailed}`)
  console.log(`   - Delivery Rate: ${notifStats.deliveryRate.toFixed(2)}%`)

  console.log('\n   📋 By Type:')
  Object.entries(notifStats.byType).forEach(([type, count]) => {
    console.log(`   - ${type}: ${count}`)
  })

  console.log('\n   🔥 By Priority:')
  Object.entries(notifStats.byPriority).forEach(([priority, count]) => {
    console.log(`   - ${priority}: ${count}`)
  })

  console.log('\n   ⏰ Hourly Distribution:')
  console.log(`   - Total hours tracked: ${notifStats.byHour.length}`)
  const maxHour = Math.max(...notifStats.byHour)
  const peakHour = notifStats.byHour.indexOf(maxHour)
  console.log(`   - Peak hour: ${peakHour}:00 (${maxHour} notifications)`)

  console.log('\n   👥 Top Recipients:')
  notifStats.topRecipients.slice(0, 5).forEach((recipient, i) => {
    console.log(`   ${i + 1}. User ${recipient.userId}: ${recipient.count} notifications`)
  })

  // Generate report
  console.log('\n3. Generating notification report...')

  analytics.registerMetric({
    id: 'notification_delivery_rate',
    name: 'Notification Delivery Rate',
    type: 'percentage',
    category: 'notification',
  })

  analytics.track('notification_delivery_rate', notifStats.deliveryRate)

  const report = await analytics.generateReport({
    id: 'notification_report',
    name: 'Notification Performance Report',
    description: 'Comprehensive notification delivery and performance metrics',
    metrics: ['notification_delivery_rate'],
    timeRange: {
      start: new Date(Date.now() - 86400000),
      end: new Date(),
    },
    format: 'json',
  })

  console.log(`   Status: ${report.status}`)
  console.log('   ✅ Report generated')

  console.log('\n✅ Example completed!')
}

main().catch(console.error)
