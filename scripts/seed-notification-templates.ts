#!/usr/bin/env tsx
/**
 * Seed Notification Templates Script
 * إضافة القوالب الجاهزة إلى قاعدة البيانات
 */

import process from 'node:process'
import { Database } from '#root/modules/database/index.js'
import { templateManagementService } from '#root/modules/notifications/template-management-service.js'
import { logger } from '#root/modules/services/logger/index.js'

const predefinedTemplates = [
  {
    name: 'ترحيب بالمستخدمين الجدد',
    message: 'مرحباً {{fullName}}! 🎉\n\nأهلاً وسهلاً بك في {{companyName}}.\nنتمنى لك تجربة ممتعة معنا.',
    type: 'success' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'companyName'],
  },
  {
    name: 'إعلان عام',
    message: '📢 **إعلان مهم**\n\n{{message}}\n\n{{companyName}}',
    type: 'announcement' as const,
    priority: 'important' as const,
    variables: ['message', 'companyName'],
  },
  {
    name: 'تذكير',
    message: '🔔 **تذكير**\n\n{{message}}\n\nالتاريخ: {{date}}\nالوقت: {{time}}',
    type: 'reminder' as const,
    priority: 'normal' as const,
    variables: ['message', 'date', 'time'],
  },
  {
    name: 'إشعار اجتماع',
    message: '📅 **اجتماع قادم**\n\nالموضوع: {{subject}}\nالتاريخ: {{date}}\nالوقت: {{time}}\nالمكان: {{location}}',
    type: 'info' as const,
    priority: 'important' as const,
    variables: ['subject', 'date', 'time', 'location'],
  },
  {
    name: 'إشعار صيانة',
    message: '🔧 **إشعار صيانة**\n\nسيتم إجراء صيانة على النظام في:\nالتاريخ: {{date}}\nالوقت: {{time}}\nالمدة المتوقعة: {{duration}}\n\nنعتذر عن الإزعاج.',
    type: 'warning' as const,
    priority: 'urgent' as const,
    variables: ['date', 'time', 'duration'],
  },
  {
    name: 'تهنئة عيد الميلاد',
    message: '🎂 **عيد ميلاد سعيد!**\n\n{{fullName}}، نتمنى لك عيد ميلاد سعيد مليء بالفرح والسعادة! 🎉\n\n{{companyName}}',
    type: 'success' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'companyName'],
  },
  {
    name: 'رسالة شخصية',
    message: '👤 **رسالة شخصية**\n\n{{fullName}}،\n\n{{message}}\n\nمع أطيب التحيات،\n{{companyName}}',
    type: 'info' as const,
    priority: 'normal' as const,
    variables: ['fullName', 'message', 'companyName'],
  },
]

async function seedTemplates() {
  try {
    console.log('Starting template seeding...')
    logger.info('Starting template seeding...')

    // Check if templates already exist
    const existingTemplates = await templateManagementService.searchTemplates({ limit: 1 })
    console.log(`Found ${existingTemplates.length} existing templates`)
    if (existingTemplates.length > 0) {
      console.log('Templates already exist, skipping seeding')
      logger.info('Templates already exist, skipping seeding')
      return
    }

    // Get first admin user as creator
    const adminUser = await Database.prisma.user.findFirst({
      where: {
        role: { in: ['SUPER_ADMIN', 'ADMIN'] },
        isActive: true,
      },
      select: { id: true },
    })

    const createdBy = adminUser?.id || null

    // Create templates
    let createdCount = 0
    for (const templateData of predefinedTemplates) {
      try {
        await templateManagementService.createTemplate({
          ...templateData,
          createdBy,
        })
        createdCount++
        logger.info(`Created template: ${templateData.name}`)
      }
      catch (error) {
        logger.error({ error, templateName: templateData.name }, 'Failed to create template')
      }
    }

    logger.info(`Template seeding completed. Created ${createdCount}/${predefinedTemplates.length} templates`)
  }
  catch (error) {
    logger.error({ error }, 'Template seeding failed')
    throw error
  }
}

async function main() {
  try {
    await Database.connect()
    await seedTemplates()
    await Database.disconnect()
    logger.info('Template seeding script completed')
  }
  catch (error) {
    logger.error({ error }, 'Template seeding script failed')
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { seedTemplates }
