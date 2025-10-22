/**
 * User Preferences Example
 *
 * Demonstrates managing user notification preferences.
 */

import { NotificationService } from '../../src/modules/notifications/index.js'

const service = new NotificationService()

async function main() {
  console.log('👤 User Preferences Example\n')

  // Simulate different user scenarios
  const userId1 = 101 // User who wants all notifications
  const userId2 = 102 // User who only wants important notifications
  const userId3 = 103 // User with quiet hours
  const userId4 = 104 // User who disabled notifications

  // 1. User who wants all notifications (default behavior)
  console.log('1. User 101: Default preferences (all notifications)...')
  // No preferences set - receives everything
  const result1 = await service.sendToUsers([userId1], {
    message: 'Regular notification',
    type: 'info',
    priority: 'normal',
  })
  console.log(`   ✅ Sent: ${result1.sentCount}, Failed: ${result1.failedCount}\n`)

  // 2. User who only wants important and urgent notifications
  console.log('2. User 102: Only important and urgent notifications...')
  service.setUserPreferences(userId2, {
    enabled: true,
    priorities: ['important', 'urgent', 'critical'],
  })

  // Send normal notification (should be filtered)
  const result2a = await service.sendToUsers([userId2], {
    message: 'Normal notification',
    priority: 'normal',
  })
  console.log(`   Normal priority - Sent: ${result2a.sentCount}`)

  // Send important notification (should go through)
  const result2b = await service.sendToUsers([userId2], {
    message: 'Important notification',
    priority: 'important',
  })
  console.log(`   Important priority - Sent: ${result2b.sentCount}\n`)

  // 3. User who only wants specific types
  console.log('3. User 103: Only announcements and alerts...')
  service.setUserPreferences(userId3, {
    enabled: true,
    types: ['announcement', 'alert', 'error'],
  })

  // Send info notification (should be filtered)
  const result3a = await service.sendToUsers([userId3], {
    message: 'Info notification',
    type: 'info',
  })
  console.log(`   Info type - Sent: ${result3a.sentCount}`)

  // Send announcement (should go through)
  const result3b = await service.sendToUsers([userId3], {
    message: 'Announcement notification',
    type: 'announcement',
  })
  console.log(`   Announcement type - Sent: ${result3b.sentCount}\n`)

  // 4. User with quiet hours (22:00 - 08:00)
  console.log('4. User 104: With quiet hours (22:00 - 08:00)...')
  service.setUserPreferences(userId4, {
    enabled: true,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
    },
  })

  // Check current time
  const now = new Date()
  const currentHour = now.getHours()
  const inQuietHours = currentHour >= 22 || currentHour < 8

  console.log(`   Current time: ${now.toLocaleTimeString()}`)
  console.log(`   In quiet hours: ${inQuietHours}`)

  const result4 = await service.sendToUsers([userId4], {
    message: 'Test notification',
  })
  console.log(`   Sent: ${result4.sentCount} (blocked if in quiet hours)\n`)

  // 5. User who disabled all notifications
  console.log('5. User 105: Notifications disabled...')
  const userId5 = 105
  service.setUserPreferences(userId5, {
    enabled: false,
  })

  const result5 = await service.sendToUsers([userId5], {
    message: 'This should not be sent',
    priority: 'urgent', // Even urgent won't go through
  })
  console.log(`   Sent: ${result5.sentCount}, Failed: ${result5.failedCount}\n`)

  // 6. Combined filters (type + priority)
  console.log('6. User 106: Combined filters...')
  const userId6 = 106
  service.setUserPreferences(userId6, {
    enabled: true,
    types: ['announcement', 'alert'],
    priorities: ['important', 'urgent', 'critical'],
  })

  // Should be filtered (wrong type)
  const result6a = await service.sendToUsers([userId6], {
    message: 'Important info',
    type: 'info',
    priority: 'important',
  })
  console.log(`   Info + Important - Sent: ${result6a.sentCount}`)

  // Should be filtered (wrong priority)
  const result6b = await service.sendToUsers([userId6], {
    message: 'Normal announcement',
    type: 'announcement',
    priority: 'normal',
  })
  console.log(`   Announcement + Normal - Sent: ${result6b.sentCount}`)

  // Should go through (both match)
  const result6c = await service.sendToUsers([userId6], {
    message: 'Important announcement',
    type: 'announcement',
    priority: 'important',
  })
  console.log(`   Announcement + Important - Sent: ${result6c.sentCount}\n`)

  // 7. Get user preferences
  console.log('7. Reading user preferences...')
  const prefs2 = service.getUserPreferences(userId2)
  console.log(`   User ${userId2} preferences:`)
  console.log(`   - Enabled: ${prefs2?.enabled}`)
  console.log(`   - Priorities: ${prefs2?.priorities?.join(', ')}\n`)

  // 8. Update existing preferences
  console.log('8. Updating user preferences...')
  service.setUserPreferences(userId2, {
    enabled: true,
    priorities: ['urgent', 'critical'], // More restrictive
    types: ['error', 'alert'], // Add type filter
  })
  console.log(`   ✅ Updated preferences for user ${userId2}\n`)

  // 9. Demonstration with multiple users
  console.log('9. Sending to multiple users with different preferences...')
  const result9 = await service.sendToUsers(
    [userId1, userId2, userId3, userId4, userId5, userId6],
    {
      message: '📢 Important announcement for everyone',
      type: 'announcement',
      priority: 'important',
    },
  )
  console.log(`   Total users: 6`)
  console.log(`   Successfully sent: ${result9.sentCount}`)
  console.log(`   Filtered out: ${6 - result9.sentCount}\n`)

  // 10. Best practices example
  console.log('10. Best Practices:\n')
  console.log('    ✓ Always respect user preferences')
  console.log('    ✓ Provide option to disable notifications')
  console.log('    ✓ Support quiet hours for better UX')
  console.log('    ✓ Allow filtering by type and priority')
  console.log('    ✓ Store preferences in database (Prisma)')
  console.log('    ✓ Load preferences on bot startup\n')

  // Example: Complete preference management
  console.log('11. Complete Preference Setup Example:\n')
  const completePrefs = {
    enabled: true,
    types: ['announcement', 'alert', 'reminder'],
    priorities: ['important', 'urgent', 'critical'],
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00',
      timezone: 'Asia/Riyadh',
    },
    channels: ['telegram'], // Could support email, SMS, etc.
  }
  console.log('   Example preferences object:')
  console.log(JSON.stringify(completePrefs, null, 2))
  console.log()

  // Cleanup
  service.cleanup()
  console.log('✅ Example completed!')
}

// Run example
main().catch(console.error)
