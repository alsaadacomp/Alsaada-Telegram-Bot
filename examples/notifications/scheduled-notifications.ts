/**
 * Scheduled Notifications Example
 *
 * Demonstrates scheduling one-time and recurring notifications.
 */

import { NotificationService } from '../../src/modules/notifications/index.js'

const service = new NotificationService()

async function main() {
  console.log('⏰ Scheduled Notifications Example\n')

  // 1. Schedule for specific time (tomorrow at 9 AM)
  console.log('1. Scheduling notification for tomorrow at 9 AM...')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const notif1 = await service.schedule(
    {
      message: '☀️ Good morning! Daily standup meeting in 30 minutes',
      type: 'reminder',
      priority: 'normal',
    },
    { audience: 'all_admins' },
    { scheduledAt: tomorrow },
  )
  console.log(`   ✅ Scheduled notification ID: ${notif1}\n`)

  // 2. Daily recurring notification
  console.log('2. Setting up daily recurring notification...')
  const notif2 = await service.scheduleRecurring(
    {
      message: '🌅 Good morning! Have a productive day ahead',
      type: 'announcement',
      priority: 'normal',
    },
    { audience: 'all_users' },
    {
      recurring: {
        frequency: 'daily',
        time: '09:00',
      },
    },
  )
  console.log(`   ✅ Daily notification ID: ${notif2}\n`)

  // 3. Weekly recurring notification (Mon, Wed, Fri at 10 AM)
  console.log('3. Setting up weekly recurring notification...')
  const notif3 = await service.scheduleRecurring(
    {
      message: '📊 Weekly Report: Check your performance stats',
      type: 'info',
      priority: 'normal',
    },
    { audience: 'all_admins' },
    {
      recurring: {
        frequency: 'weekly',
        daysOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
        time: '10:00',
      },
    },
  )
  console.log(`   ✅ Weekly notification ID: ${notif3}\n`)

  // 4. Monthly recurring notification (15th of each month at noon)
  console.log('4. Setting up monthly recurring notification...')
  const notif4 = await service.scheduleRecurring(
    {
      message: '💰 Monthly billing statement is ready',
      type: 'info',
      priority: 'important',
    },
    { audience: 'all_users' },
    {
      recurring: {
        frequency: 'monthly',
        dayOfMonth: 15,
        time: '12:00',
      },
    },
  )
  console.log(`   ✅ Monthly notification ID: ${notif4}\n`)

  // 5. Weekly notification with end date
  console.log('5. Setting up time-limited weekly notification...')
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + 30) // Ends in 30 days

  const notif5 = await service.scheduleRecurring(
    {
      message: '🎓 Weekly training session reminder',
      type: 'reminder',
      priority: 'normal',
    },
    { audience: 'role', role: 'EMPLOYEE' },
    {
      recurring: {
        frequency: 'weekly',
        daysOfWeek: [2], // Every Tuesday
        time: '14:00',
        endDate,
      },
    },
  )
  console.log(`   ✅ Time-limited notification ID: ${notif5}`)
  console.log(`   📅 Will run until: ${endDate.toLocaleDateString()}\n`)

  // 6. Custom interval (every 3 days)
  console.log('6. Setting up custom interval notification...')
  const notif6 = await service.scheduleRecurring(
    {
      message: '🔔 Reminder: Complete your pending tasks',
      type: 'reminder',
      priority: 'normal',
    },
    { audience: 'all_users' },
    {
      recurring: {
        frequency: 'custom',
        interval: 3, // Every 3 days
      },
    },
  )
  console.log(`   ✅ Custom interval notification ID: ${notif6}\n`)

  // Wait for a moment to demonstrate cancellation
  console.log('⏳ Waiting 2 seconds...\n')
  await new Promise(resolve => setTimeout(resolve, 2000))

  // 7. Cancel a scheduled notification
  console.log('7. Cancelling a scheduled notification...')
  const cancelled = service.cancelScheduled(notif1)
  if (cancelled) {
    console.log(`   ✅ Successfully cancelled notification ${notif1}\n`)
  }
  else {
    console.log(`   ❌ Failed to cancel notification ${notif1}\n`)
  }

  // View all scheduled notifications in history
  console.log('📜 Scheduled Notifications History:')
  const history = service.getHistory()
  const scheduled = history.filter(h => h.status === 'scheduled')
  scheduled.forEach((record, index) => {
    console.log(`   ${index + 1}. ${record.message}`)
    if (record.scheduledAt) {
      console.log(`      Scheduled for: ${record.scheduledAt.toLocaleString()}`)
    }
    if (record.recurring) {
      console.log(`      Recurring: Yes`)
    }
  })

  console.log('\n💡 Tip: These scheduled notifications will continue running')
  console.log('   in the background until cancelled or completed.\n')

  // Don't cleanup yet - scheduled notifications are running
  console.log('⚠️  Note: Call service.cleanup() to cancel all scheduled notifications')
  console.log('   when shutting down your application.\n')

  console.log('✅ Example completed!')
}

// Run example
main().catch(console.error)
