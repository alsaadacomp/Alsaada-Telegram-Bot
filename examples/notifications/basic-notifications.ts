/**
 * Basic Notifications Example
 *
 * Demonstrates basic notification sending to different target audiences.
 */

import { NotificationService } from '../../src/modules/notifications/index.js'

const service = new NotificationService()

async function main() {
  console.log('🔔 Basic Notifications Example\n')

  // 1. Send to all users
  console.log('1. Sending to all users...')
  const result1 = await service.sendToAllUsers({
    message: 'Hello everyone! Welcome to our bot 👋',
    type: 'announcement',
    priority: 'normal',
  })
  console.log(`   ✅ Sent to ${result1.sentCount} users\n`)

  // 2. Send to all admins
  console.log('2. Sending to all admins...')
  const result2 = await service.sendToAdmins({
    message: '⚠️ Admin Alert: New user registration spike detected',
    type: 'warning',
    priority: 'important',
  })
  console.log(`   ✅ Sent to ${result2.sentCount} admins\n`)

  // 3. Send to super admin
  console.log('3. Sending to super admin...')
  const result3 = await service.sendToSuperAdmin({
    message: '🚨 Critical: System error in payment module',
    type: 'error',
    priority: 'critical',
  })
  console.log(`   ✅ Sent to super admin\n`)

  // 4. Send to specific role
  console.log('4. Sending to moderators...')
  const result4 = await service.sendToRole('MODERATOR', {
    message: '📝 Moderator: 5 new posts pending review',
    type: 'reminder',
    priority: 'normal',
  })
  console.log(`   ✅ Sent to ${result4.sentCount} moderators\n`)

  // 5. Send to specific users
  console.log('5. Sending to specific users...')
  const result5 = await service.sendToUsers([1, 2, 3], {
    message: '🎉 Congratulations! You have been selected for beta testing',
    type: 'success',
    priority: 'important',
  })
  console.log(`   ✅ Sent to ${result5.sentCount} users\n`)

  // 6. Send to active users
  console.log('6. Sending to active users...')
  const result6 = await service.sendToActiveUsers({
    message: '💎 Special offer for active users: 20% off!',
    type: 'announcement',
    priority: 'important',
  })
  console.log(`   ✅ Sent to ${result6.sentCount} active users\n`)

  // 7. Send to inactive users
  console.log('7. Sending to inactive users...')
  const result7 = await service.sendToInactiveUsers({
    message: '👋 We miss you! Come back and get 100 bonus points',
    type: 'reminder',
    priority: 'normal',
  })
  console.log(`   ✅ Sent to ${result7.sentCount} inactive users\n`)

  // 8. Send to new users
  console.log('8. Sending to new users...')
  const result8 = await service.sendToNewUsers({
    message: '🌟 Welcome! Here are 5 tips to get started',
    type: 'info',
    priority: 'normal',
  })
  console.log(`   ✅ Sent to ${result8.sentCount} new users\n`)

  // 9. Send with buttons
  console.log('9. Sending notification with buttons...')
  const result9 = await service.sendToAllUsers({
    message: '📢 New feature available! Check it out now',
    type: 'announcement',
    priority: 'normal',
    buttons: [
      { text: 'Learn More', url: 'https://example.com/new-feature' },
      { text: 'Try Now', callbackData: 'try_feature' },
    ],
  })
  console.log(`   ✅ Sent to ${result9.sentCount} users with interactive buttons\n`)

  // 10. Send with image
  console.log('10. Sending notification with image...')
  const result10 = await service.sendToAllUsers({
    message: '🖼️ Check out our latest update!',
    type: 'announcement',
    priority: 'normal',
    image: 'https://example.com/update-image.jpg',
  })
  console.log(`   ✅ Sent to ${result10.sentCount} users with image\n`)

  // View statistics
  console.log('📊 Statistics:')
  const stats = service.getStatistics()
  console.log(`   Total notifications: ${stats.total}`)
  console.log(`   Successfully sent: ${stats.sent}`)
  console.log(`   Failed: ${stats.failed}`)
  console.log(`   Success rate: ${stats.successRate.toFixed(2)}%\n`)

  // View history
  console.log('📜 Recent History:')
  const history = service.getHistory(3)
  history.forEach((record, index) => {
    console.log(`   ${index + 1}. ${record.message} (${record.type}, ${record.priority})`)
  })

  // Cleanup
  service.cleanup()
  console.log('\n✅ Example completed!')
}

// Run example
main().catch(console.error)
