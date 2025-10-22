#!/usr/bin/env tsx
/**
 * Additional Data Seeding Script
 * سكريبت إضافة بيانات إضافية
 */

import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()

async function addMoreData() {
  console.log('🌱 Adding more sample data...')

  try {
    // إضافة المزيد من المستخدمين
    const users = [
      {
        telegramId: BigInt(123456789),
        username: 'ahmed_mohamed',
        firstName: 'أحمد',
        lastName: 'محمد',
        fullName: 'أحمد محمد علي',
        nickname: 'أحمد',
        phone: '+966501234567',
        email: 'ahmed@alsaada.com',
        role: 'ADMIN',
        isActive: true,
        department: 'تكنولوجيا المعلومات',
        position: 'مدير تقني',
      },
      {
        telegramId: BigInt(987654321),
        username: 'sara_ahmed',
        firstName: 'سارة',
        lastName: 'أحمد',
        fullName: 'سارة أحمد حسن',
        nickname: 'سارة',
        phone: '+966502345678',
        email: 'sara@alsaada.com',
        role: 'USER',
        isActive: true,
        department: 'التسويق',
        position: 'أخصائية تسويق',
      },
      {
        telegramId: BigInt(456789123),
        username: 'mohamed_ali',
        firstName: 'محمد',
        lastName: 'علي',
        fullName: 'محمد علي سعد',
        nickname: 'محمد',
        phone: '+966503456789',
        email: 'mohamed@alsaada.com',
        role: 'USER',
        isActive: true,
        department: 'المبيعات',
        position: 'مندوب مبيعات',
      },
    ]

    for (const userData of users) {
      await prisma.user.upsert({
        where: { telegramId: userData.telegramId },
        update: {},
        create: userData,
      })
    }
    console.log('✅ Users created:', users.length)

    // إضافة المزيد من المشاريع
    const projects = [
      {
        companyId: 1,
        name: 'تطبيق الهاتف المحمول',
        code: 'MOB-003',
        description: 'تطبيق شامل للهواتف الذكية',
        clientName: 'شركة الاتصالات',
        clientPhone: '+966112345678',
        clientEmail: 'info@telecom.com',
        location: 'الرياض',
        contractValue: 750000,
        currency: 'SAR',
        paidAmount: 300000,
        remainingAmount: 450000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        projectManager: 'فاطمة حسن',
        engineer: 'خالد أحمد',
        supervisor: 'نورا محمد',
        status: 'قيد التنفيذ',
        progress: 30,
        priority: 'عالي',
        type: 'تطوير تطبيقات',
        category: 'تجاري',
        isActive: true,
      },
      {
        companyId: 1,
        name: 'نظام إدارة المستودعات',
        code: 'WMS-004',
        description: 'نظام متكامل لإدارة المستودعات والمخزون',
        clientName: 'شركة اللوجستيات',
        clientPhone: '+966126543210',
        clientEmail: 'info@logistics.com',
        location: 'جدة',
        contractValue: 400000,
        currency: 'SAR',
        paidAmount: 400000,
        remainingAmount: 0,
        startDate: new Date('2023-09-01'),
        endDate: new Date('2024-08-31'),
        actualEndDate: new Date('2024-08-15'),
        projectManager: 'عبدالله سعد',
        engineer: 'ريم أحمد',
        supervisor: 'محمد علي',
        status: 'منتهي',
        progress: 100,
        priority: 'متوسط',
        type: 'تطوير برمجيات',
        category: 'صناعي',
        isActive: true,
      },
    ]

    for (const projectData of projects) {
      await prisma.project.create({
        data: projectData,
      })
    }
    console.log('✅ Additional projects created:', projects.length)

    // إضافة المزيد من الإعدادات
    const additionalSettings = [
      {
        key: 'company.website',
        value: 'https://www.alsaada.com',
        scope: 'GLOBAL',
        category: 'COMPANY',
        type: 'STRING',
        description: 'الموقع الإلكتروني للشركة',
      },
      {
        key: 'company.address',
        value: 'الرياض، المملكة العربية السعودية',
        scope: 'GLOBAL',
        category: 'COMPANY',
        type: 'STRING',
        description: 'عنوان الشركة',
      },
      {
        key: 'bot.welcome_message',
        value: 'مرحباً بك في بوت شركة الصعدة! 🎉',
        scope: 'GLOBAL',
        category: 'BOT',
        type: 'STRING',
        description: 'رسالة الترحيب في البوت',
      },
      {
        key: 'bot.language',
        value: 'ar',
        scope: 'GLOBAL',
        category: 'BOT',
        type: 'STRING',
        description: 'لغة البوت الافتراضية',
      },
    ]

    for (const setting of additionalSettings) {
      await prisma.setting.upsert({
        where: {
          key_scope_userId_featureId: {
            key: setting.key,
            scope: setting.scope as any,
            userId: 0,
            featureId: '',
          },
        },
        update: {},
        create: setting as any,
      })
    }
    console.log('✅ Additional settings created:', additionalSettings.length)

    console.log('🎉 Additional data seeding completed successfully!')
  }
  catch (error) {
    console.error('❌ Error during additional seeding:', error)
    throw error
  }
}

async function main() {
  try {
    await addMoreData()
  }
  catch (error) {
    console.error('❌ Additional seeding failed:', error)
    process.exit(1)
  }
  finally {
    await prisma.$disconnect()
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { addMoreData }
