#!/usr/bin/env tsx
/**
 * Seed Branches and Projects
 * إضافة بيانات تجريبية للفروع والمشاريع
 */

import { BranchService, CompanyService, ProjectService } from '../src/modules/company/index.js'
import { Database } from '../src/modules/database/index.js'

async function seedData() {
  console.log('🌱 بدء إضافة البيانات التجريبية...\n')

  try {
    // Connect to database
    await Database.connect()
    console.log('✅ اتصال قاعدة البيانات نجح\n')

    // Get or create company
    const company = await CompanyService.getOrCreate()
    console.log(`✅ الشركة: ${company.name} (ID: ${company.id})\n`)

    // Seed Branches
    console.log('📍 إضافة الفروع...')

    const branches = [
      {
        name: 'الفرع الرئيسي',
        code: 'MAIN-001',
        address: 'شارع الجمهورية، وسط البلد',
        city: 'القاهرة',
        region: 'القاهرة',
        phone: '0223456789',
        mobile: '01012345678',
        email: 'main@company.com',
        manager: 'أحمد محمد',
        managerPhone: '01098765432',
        type: 'مكتب رئيسي',
        capacity: 50,
        notes: 'المقر الرئيسي للشركة',
      },
      {
        name: 'فرع الإسكندرية',
        code: 'ALEX-002',
        address: 'طريق الكورنيش، محطة الرمل',
        city: 'الإسكندرية',
        region: 'الإسكندرية',
        phone: '0334567890',
        mobile: '01123456789',
        email: 'alex@company.com',
        manager: 'محمد علي',
        managerPhone: '01187654321',
        type: 'مكتب إقليمي',
        capacity: 30,
        notes: 'فرع الساحل الشمالي',
      },
      {
        name: 'مخزن المعادي',
        code: 'WARE-003',
        address: 'منطقة المعادي الصناعية',
        city: 'القاهرة',
        region: 'المعادي',
        phone: '0225678901',
        mobile: '01234567890',
        type: 'مخزن',
        capacity: 200,
        notes: 'مخزن المواد والمعدات',
      },
    ]

    for (const branchData of branches) {
      const branch = await BranchService.create(company.id, branchData)
      console.log(`  ✅ ${branch.name}`)
    }

    console.log('\n🏗️ إضافة المشاريع...')

    const projects = [
      {
        name: 'مشروع برج النهضة',
        code: 'PRJ-2025-001',
        description: 'بناء برج سكني 20 طابق',
        clientName: 'شركة التطوير العقاري',
        clientPhone: '0223334444',
        clientEmail: 'dev@realestate.com',
        location: 'منطقة التجمع الخامس',
        city: 'القاهرة',
        region: 'القاهرة الجديدة',
        contractValue: 50000000,
        currency: 'EGP',
        paidAmount: 25000000,
        remainingAmount: 25000000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-12-31'),
        projectManager: 'م. خالد أحمد',
        engineer: 'م. سارة محمد',
        supervisor: 'م. عمر حسن',
        status: 'قيد التنفيذ',
        progress: 45,
        priority: 'عالية',
        type: 'إنشاءات',
        category: 'سكني',
        notes: 'مشروع استراتيجي',
      },
      {
        name: 'مشروع صيانة شبكة الطرق',
        code: 'PRJ-2025-002',
        description: 'صيانة وتطوير 50 كم من الطرق',
        clientName: 'وزارة النقل',
        clientPhone: '0223335555',
        location: 'محور الجيش',
        city: 'القاهرة',
        contractValue: 15000000,
        currency: 'EGP',
        paidAmount: 10000000,
        remainingAmount: 5000000,
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-12-31'),
        projectManager: 'م. أحمد سعيد',
        engineer: 'م. فاطمة علي',
        status: 'قيد التنفيذ',
        progress: 60,
        priority: 'متوسطة',
        type: 'بنية تحتية',
        category: 'طرق',
      },
      {
        name: 'مشروع مصنع الأدوية',
        code: 'PRJ-2024-015',
        description: 'بناء وتجهيز مصنع أدوية',
        clientName: 'شركة الدواء الدولية',
        clientPhone: '0224445555',
        clientEmail: 'info@pharma.com',
        location: 'المنطقة الصناعية بالسادس من أكتوبر',
        city: '6 أكتوبر',
        region: 'الجيزة',
        contractValue: 80000000,
        currency: 'EGP',
        paidAmount: 80000000,
        remainingAmount: 0,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2025-06-30'),
        actualEndDate: new Date('2025-05-15'),
        projectManager: 'م. ياسر محمود',
        engineer: 'م. نور الدين',
        supervisor: 'م. هالة إبراهيم',
        status: 'منتهي',
        progress: 100,
        priority: 'عالية',
        type: 'صناعي',
        category: 'مصانع',
        notes: 'تم الانتهاء مبكراً عن الموعد',
      },
      {
        name: 'مشروع فندق الساحل',
        code: 'PRJ-2025-010',
        description: 'بناء فندق 5 نجوم',
        clientName: 'مجموعة الفنادق المصرية',
        clientPhone: '0223336666',
        location: 'مارينا العلمين',
        city: 'العلمين',
        region: 'مطروح',
        contractValue: 120000000,
        currency: 'EGP',
        paidAmount: 30000000,
        remainingAmount: 90000000,
        startDate: new Date('2025-02-01'),
        endDate: new Date('2027-01-31'),
        projectManager: 'م. رامي صلاح',
        engineer: 'م. دينا فاروق',
        status: 'قيد التنفيذ',
        progress: 25,
        priority: 'عالية',
        type: 'سياحي',
        category: 'فنادق',
      },
      {
        name: 'مشروع محطة الطاقة الشمسية',
        code: 'PRJ-2025-005',
        description: 'إنشاء محطة طاقة شمسية 50 ميجاوات',
        clientName: 'هيئة الطاقة المتجددة',
        clientPhone: '0224447777',
        location: 'أسوان',
        city: 'أسوان',
        region: 'أسوان',
        contractValue: 200000000,
        currency: 'EGP',
        paidAmount: 50000000,
        remainingAmount: 150000000,
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-12-31'),
        projectManager: 'م. طارق فتحي',
        engineer: 'م. ريم حسين',
        supervisor: 'م. وائل سمير',
        status: 'قيد التنفيذ',
        progress: 15,
        priority: 'عالية',
        type: 'طاقة',
        category: 'طاقة متجددة',
        notes: 'مشروع قومي',
      },
    ]

    for (const projectData of projects) {
      const project = await ProjectService.create(company.id, projectData)
      console.log(`  ✅ ${project.name}`)
    }

    console.log('\n✅ تم إضافة جميع البيانات بنجاح!')
    console.log(`📊 الإحصائيات:`)
    console.log(`   - ${branches.length} فروع`)
    console.log(`   - ${projects.length} مشاريع`)

    const stats = await ProjectService.getStatistics(company.id)
    console.log(`\n💰 القيم المالية:`)
    console.log(`   - إجمالي القيمة: ${stats.totalValue.toLocaleString()} جنيه`)
    console.log(`   - إجمالي المدفوع: ${stats.paidTotal.toLocaleString()} جنيه`)
    console.log(`   - إجمالي المتبقي: ${stats.remainingTotal.toLocaleString()} جنيه`)
  }
  catch (error) {
    console.error('❌ خطأ:', error)
  }
  finally {
    await Database.disconnect()
    console.log('\n👋 تم إغلاق الاتصال بقاعدة البيانات')
  }
}

seedData()
