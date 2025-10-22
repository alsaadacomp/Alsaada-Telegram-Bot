/**
 * Template Usage Example
 *
 * Demonstrates creating and using notification templates.
 */

import { NotificationService, NotificationTemplateBuilder } from '../../src/modules/notifications/index.js'

const service = new NotificationService()

async function main() {
  console.log('📝 Notification Templates Example\n')

  // 1. Create welcome template
  console.log('1. Creating welcome template...')
  const welcomeTemplate = new NotificationTemplateBuilder(
    'welcome',
    'Welcome Template',
    'Welcome {{name}}! 🎉\n\nYou are user #{{userId}} and have {{points}} points.',
  )
    .setType('success')
    .setPriority('normal')
    .autoDetectVariables()
    .addButton({ text: 'Get Started', url: 'https://example.com/start' })

  service.registerTemplate(welcomeTemplate)
  console.log(`   ✅ Template registered with ID: ${welcomeTemplate.getId()}`)
  console.log(`   📋 Variables: ${welcomeTemplate.getVariables().join(', ')}\n`)

  // 2. Create reminder template
  console.log('2. Creating reminder template...')
  const reminderTemplate = new NotificationTemplateBuilder(
    'task_reminder',
    'Task Reminder',
    '⏰ Reminder: {{taskName}}\n\nDue: {{dueDate}}\nPriority: {{priority}}',
  )
    .setType('reminder')
    .setPriority('important')
    .setVariables(['taskName', 'dueDate', 'priority'])
    .addButton({ text: 'View Task', callbackData: 'view_task_{{taskId}}' })

  service.registerTemplate(reminderTemplate)
  console.log(`   ✅ Template registered with ID: ${reminderTemplate.getId()}\n`)

  // 3. Create order confirmation template
  console.log('3. Creating order confirmation template...')
  const orderTemplate = new NotificationTemplateBuilder(
    'order_confirm',
    'Order Confirmation',
    '🛒 Order Confirmed!\n\nOrder #{{orderId}}\nTotal: ${{total}}\nItems: {{itemCount}}\n\nEstimated delivery: {{deliveryDate}}',
  )
    .setType('success')
    .setPriority('important')
    .autoDetectVariables()

  service.registerTemplate(orderTemplate)
  console.log(`   ✅ Template registered with ID: ${orderTemplate.getId()}\n`)

  // 4. Send using welcome template
  console.log('4. Sending welcome notification using template...')
  const result1 = await service.sendFromTemplate(
    'welcome',
    { audience: 'specific_users', userIds: [123] },
    {
      name: 'Ahmed',
      userId: 123,
      points: 1000,
    },
  )
  console.log(`   ✅ Sent to ${result1.sentCount} users\n`)

  // 5. Send using reminder template
  console.log('5. Sending task reminder using template...')
  const result2 = await service.sendFromTemplate(
    'task_reminder',
    { audience: 'specific_users', userIds: [456] },
    {
      taskName: 'Complete project documentation',
      dueDate: 'Tomorrow at 5 PM',
      priority: 'High',
      taskId: '789',
    },
  )
  console.log(`   ✅ Sent to ${result2.sentCount} users\n`)

  // 6. Send using order template
  console.log('6. Sending order confirmation using template...')
  const result3 = await service.sendFromTemplate(
    'order_confirm',
    { audience: 'specific_users', userIds: [789] },
    {
      orderId: '12345',
      total: '99.99',
      itemCount: '3',
      deliveryDate: '3-5 business days',
    },
  )
  console.log(`   ✅ Sent to ${result3.sentCount} users\n`)

  // 7. Template validation
  console.log('7. Validating template variables...')
  const validation = welcomeTemplate.validateVariables({
    name: 'Ahmed',
    userId: 123,
    // Missing 'points' variable
  })
  console.log(`   Valid: ${validation.valid}`)
  if (!validation.valid) {
    console.log(`   ❌ Missing variables: ${validation.missing.join(', ')}`)
  }
  console.log()

  // 8. Render template without sending
  console.log('8. Rendering template preview...')
  const rendered = welcomeTemplate.render({
    name: 'Test User',
    userId: 999,
    points: 500,
  })
  console.log('   Preview:')
  console.log(`   ${rendered.split('\n').join('\n   ')}\n`)

  // 9. Clone template for variation
  console.log('9. Creating template variation...')
  const vipWelcomeTemplate = welcomeTemplate.clone('welcome_vip', 'VIP Welcome')
  vipWelcomeTemplate.setMessage(
    'Welcome VIP Member {{name}}! 🌟\n\nYou are user #{{userId}} and have {{points}} points.\n\nEnjoy exclusive benefits!',
  )
  service.registerTemplate(vipWelcomeTemplate)
  console.log(`   ✅ VIP template created with ID: ${vipWelcomeTemplate.getId()}\n`)

  // 10. List all registered templates
  console.log('10. Registered Templates:')
  const templateIds = ['welcome', 'task_reminder', 'order_confirm', 'welcome_vip']
  templateIds.forEach((id) => {
    const template = service.getTemplate(id)
    if (template) {
      console.log(`    • ${template.getName()} (${id})`)
      console.log(`      Variables: ${template.getVariables().length}`)
      console.log(`      Type: ${template.build().type}`)
    }
  })
  console.log()

  // 11. Error handling - missing variables
  console.log('11. Testing error handling...')
  try {
    await service.sendFromTemplate(
      'welcome',
      { audience: 'specific_users', userIds: [123] },
      {
        name: 'Ahmed',
        // Missing required variables
      },
    )
  }
  catch (error) {
    console.log(`   ❌ Expected error: ${(error as Error).message}\n`)
  }

  // 12. Error handling - non-existent template
  console.log('12. Testing non-existent template...')
  try {
    await service.sendFromTemplate(
      'nonexistent',
      { audience: 'all_users' },
    )
  }
  catch (error) {
    console.log(`   ❌ Expected error: ${(error as Error).message}\n`)
  }

  // Cleanup
  service.cleanup()
  console.log('✅ Example completed!')
}

// Run example
main().catch(console.error)
