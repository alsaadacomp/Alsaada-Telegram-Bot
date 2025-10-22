/**
 * Basic Analytics Example
 *
 * Demonstrates basic metric tracking and analytics.
 */

import { AnalyticsService } from '../../src/modules/analytics/index.js'

const analytics = new AnalyticsService()

async function main() {
  console.log('📊 Basic Analytics Example\n')

  // 1. Register metrics
  console.log('1. Registering metrics...')
  analytics.registerMetric({
    id: 'total_users',
    name: 'Total Users',
    type: 'counter',
    category: 'user',
    description: 'Total registered users',
  })

  analytics.registerMetric({
    id: 'active_sessions',
    name: 'Active Sessions',
    type: 'gauge',
    category: 'system',
    description: 'Currently active sessions',
  })

  analytics.registerMetric({
    id: 'page_views',
    name: 'Page Views',
    type: 'counter',
    category: 'user',
    description: 'Total page views',
  })
  console.log('   ✅ 3 metrics registered\n')

  // 2. Track data
  console.log('2. Tracking data...')
  analytics.increment('total_users', 5)
  analytics.gauge('active_sessions', 12)
  analytics.track('page_views', 100)
  analytics.track('page_views', 150)
  analytics.track('page_views', 200)
  console.log('   ✅ Data tracked\n')

  // 3. Query metrics
  console.log('3. Querying metrics...')
  const result = analytics.query({
    metricId: 'page_views',
    timeRange: {
      start: new Date(Date.now() - 86400000),
      end: new Date(),
    },
  })

  console.log(`   Metric: ${result.metricId}`)
  console.log(`   Data Points: ${result.dataPoints.length}`)
  console.log(`   Total: ${result.summary.total}`)
  console.log(`   Average: ${result.summary.average.toFixed(2)}`)
  console.log(`   Min: ${result.summary.min}`)
  console.log(`   Max: ${result.summary.max}`)
  console.log(`   Trend: ${result.summary.trend}\n`)

  // 4. Track events
  console.log('4. Tracking events...')
  analytics.trackEvent('user.login', { userId: 123 })
  analytics.trackEvent('user.login', { userId: 456 })
  analytics.trackEvent('page.view', { userId: 123, page: '/dashboard' })
  analytics.trackEvent('button.click', { userId: 123, button: 'submit' })
  console.log(`   ✅ ${analytics.getEventCount()} events tracked\n`)

  // 5. Get summary
  console.log('5. Analytics Summary:')
  const summary = analytics.getSummary('day', {
    start: new Date(Date.now() - 86400000),
    end: new Date(),
  })

  console.log(`   Total Metrics: ${summary.totalMetrics}`)
  console.log(`   Total Events: ${summary.totalEvents}`)
  console.log(`   Active Users: ${summary.activeUsers}`)
  console.log(`   New Users: ${summary.newUsers}`)
  console.log('\n   Top Metrics:')
  summary.topMetrics.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.metricId}: ${m.value}`)
  })

  console.log('\n✅ Example completed!')
}

main().catch(console.error)
