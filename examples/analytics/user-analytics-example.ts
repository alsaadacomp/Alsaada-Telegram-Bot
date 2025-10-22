/**
 * User Analytics Example
 *
 * Demonstrates user behavior analytics and tracking.
 */

import { AnalyticsService } from '../../src/modules/analytics/index.js'

const analytics = new AnalyticsService()

async function main() {
  console.log('👥 User Analytics Example\n')

  // Simulate user activity
  console.log('1. Simulating user activity...')

  // User 123 activity
  analytics.trackEvent('session.start', { userId: 123 })
  analytics.trackEvent('page.view', { userId: 123, page: '/dashboard' })
  analytics.trackEvent('button.click', { userId: 123, button: 'export' })
  analytics.trackEvent('page.view', { userId: 123, page: '/settings' })
  analytics.trackEvent('session.end', { userId: 123 })

  // User 456 activity
  analytics.trackEvent('session.start', { userId: 456 })
  analytics.trackEvent('page.view', { userId: 456, page: '/home' })
  analytics.trackEvent('session.end', { userId: 456 })

  // User 789 activity (new user)
  analytics.trackEvent('user.registered', { userId: 789 })
  analytics.trackEvent('session.start', { userId: 789 })
  analytics.trackEvent('page.view', { userId: 789, page: '/welcome' })

  console.log('   ✅ Activity tracked for 3 users\n')

  // Get user analytics
  console.log('2. User Analytics:\n')

  const timeRange = {
    start: new Date(Date.now() - 86400000),
    end: new Date(),
  }

  // Analyze User 123
  console.log('   📊 User 123:')
  const user123 = analytics.getUserAnalytics(123, timeRange)
  console.log(`   - Total Sessions: ${user123.totalSessions}`)
  console.log(`   - Total Events: ${user123.totalEvents}`)
  console.log(`   - Activity Days: ${user123.activityDays}`)
  console.log(`   - Engagement Score: ${user123.engagementScore.toFixed(2)}`)
  console.log(`   - Retention Rate: ${user123.retentionRate}%`)
  console.log(`   - Average Session: ${user123.averageSessionDuration.toFixed(2)}s`)

  // Analyze User 456
  console.log('\n   📊 User 456:')
  const user456 = analytics.getUserAnalytics(456, timeRange)
  console.log(`   - Total Sessions: ${user456.totalSessions}`)
  console.log(`   - Total Events: ${user456.totalEvents}`)
  console.log(`   - Engagement Score: ${user456.engagementScore.toFixed(2)}`)

  // Analyze User 789 (new user)
  console.log('\n   📊 User 789 (New User):')
  const user789 = analytics.getUserAnalytics(789, timeRange)
  console.log(`   - Total Sessions: ${user789.totalSessions}`)
  console.log(`   - Total Events: ${user789.totalEvents}`)
  console.log(`   - First Seen: ${user789.firstSeen.toLocaleString()}`)
  console.log(`   - Engagement Score: ${user789.engagementScore.toFixed(2)}`)

  // Overall summary
  console.log('\n3. Overall Summary:')
  const summary = analytics.getSummary('day', timeRange)
  console.log(`   - Active Users: ${summary.activeUsers}`)
  console.log(`   - New Users: ${summary.newUsers}`)
  console.log(`   - Total Events: ${summary.totalEvents}`)

  console.log('\n✅ Example completed!')
}

main().catch(console.error)
