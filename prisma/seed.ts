import { PrismaClient } from '../generated/prisma';
import { governorates } from './seeds/governorates';
import { equipmentCategories, equipmentTypes, defaultShifts } from './seeds/equipment-data';

const prisma = new PrismaClient();

async function seedGovernorates() {
  console.log('🌍 بدء إضافة بيانات المحافظات...');

  for (const gov of governorates) {
    await prisma.governorate.upsert({
      where: { code: gov.code },
      update: gov,
      create: gov,
    });
    console.log(`✅ تم إضافة: ${gov.nameAr} (${gov.nameEn})`);
  }

  console.log(`\n✨ تم إضافة ${governorates.length} محافظة بنجاح!`);
  
  // عرض الترتيب النهائي
  const allGovs = await prisma.governorate.findMany({
    orderBy: { orderIndex: 'asc' },
    select: { orderIndex: true, nameAr: true, nameEn: true },
  });
  
  console.log('\n📋 الترتيب النهائي:');
  allGovs.forEach(gov => {
    console.log(`${gov.orderIndex}. ${gov.nameAr} (${gov.nameEn})`);
  });
}

async function seedEquipment() {
  console.log('\n🚜 بدء إضافة بيانات المعدات...');

  // 1. إضافة التصنيفات
  console.log('\n📦 إضافة التصنيفات...');
  for (const category of equipmentCategories) {
    await prisma.equipmentCategory.upsert({
      where: { code: category.code },
      update: category,
      create: category,
    });
    console.log(`✅ ${category.nameAr} (${category.nameEn})`);
  }

  // 2. إضافة الأنواع
  console.log('\n🔧 إضافة أنواع المعدات...');
  for (const type of equipmentTypes) {
    const category = await prisma.equipmentCategory.findUnique({
      where: { code: type.categoryCode }
    });
    
    if (category) {
      const { categoryCode, ...typeData } = type;
      await prisma.equipmentType.upsert({
        where: { code: type.code },
        update: { ...typeData, categoryId: category.id },
        create: { ...typeData, categoryId: category.id },
      });
      console.log(`✅ ${type.nameAr} (${type.nameEn})`);
    }
  }

  // 3. إضافة الورديات
  console.log('\n⏰ إضافة الورديات...');
  const existingShifts = await prisma.shift.count();
  if (existingShifts === 0) {
    for (const shift of defaultShifts) {
      await prisma.shift.create({
        data: shift
      });
      console.log(`✅ ${shift.name} (${shift.startTime} - ${shift.endTime})`);
    }
  } else {
    console.log('⚠️ الورديات موجودة بالفعل، تم التخطي');
  }

  console.log('\n✨ تم إضافة بيانات المعدات بنجاح!');
  
  // عرض الملخص
  const categoriesCount = await prisma.equipmentCategory.count();
  const typesCount = await prisma.equipmentType.count();
  const shiftsCount = await prisma.shift.count();
  
  console.log('\n📊 الملخص:');
  console.log(`   - التصنيفات: ${categoriesCount}`);
  console.log(`   - أنواع المعدات: ${typesCount}`);
  console.log(`   - الورديات: ${shiftsCount}`);
}

async function main() {
  console.log('🚀 بدء عملية Seeding...\n');
  
  // تشغيل seed للمحافظات
  await seedGovernorates();
  
  console.log('\n✅ اكتملت عملية Seeding بنجاح!');
}

main()
  .catch((e) => {
    console.error('❌ خطأ في Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
