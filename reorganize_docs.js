const fs = require('fs-extra');
const path = require('path');

const BASE_PATH = 'F:\\_Alsaada_Telegram_Bot\\telegram-bot-template-main\\Documentation_Pro';

// خريطة نقل المجلدات
const FOLDER_MAPPING = {
  '10_دليل_المطور': '03_دليل_المطور',
  '20_دليل_المستخدم': '02_البدء_السريع',
  '30_التشغيل': '98_التشغيل_والنشر',
  '40_واجهة_المستخدم': '05_واجهات_المستخدم',
  '50_HowTo': '95_أدلة_عملية',
  '60_أدلة_التصميم': '06_أدلة_التصميم',
  '70_أمثلة_تدفقات': '07_أمثلة_وتدفقات',
  '80_وحدات_جاهزة': '08_وحدات_جاهزة',
  '11_API_Reference': '09_API_Reference',
  '90_تقييم': '99_تقييم_وتحليل',
};

// الملفات المتفرقة
const SCATTERED_FILES = {
  'EMPLOYEE_SCHEMA_FINAL.md': '04_قواعد_البيانات/01_نظام_الموظفين',
  'EMPLOYEE_SCHEMA_PROPOSAL.md': '04_قواعد_البيانات/01_نظام_الموظفين',
  'EMPLOYEE_SCHEMA_SIMPLIFIED.md': '04_قواعد_البيانات/01_نظام_الموظفين',
  'DEPARTMENT_SETUP.md': '04_قواعد_البيانات/05_البيانات_الأساسية',
  'POSITION_SETUP.md': '04_قواعد_البيانات/05_البيانات_الأساسية',
  'GOVERNORATES_DATA.md': '04_قواعد_البيانات/05_البيانات_الأساسية',
};

// مجلدات الأنظمة
const SYSTEM_FOLDERS = {
  'Equipment': '04_قواعد_البيانات/02_نظام_المعدات',
  'Warehouse': '04_قواعد_البيانات/03_نظام_المخازن',
  'Cost_Calculation': '04_قواعد_البيانات/04_نظام_التكاليف',
};

async function copyFolder(srcFolder, destFolder) {
  const srcPath = path.join(BASE_PATH, srcFolder);
  const destPath = path.join(BASE_PATH, destFolder);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`❌ المجلد غير موجود: ${srcFolder}`);
    return false;
  }
  
  await fs.ensureDir(destPath);
  await fs.copy(srcPath, destPath, { overwrite: true });
  console.log(`✅ نُسخ: ${srcFolder} → ${destFolder}`);
  return true;
}

async function copyFile(file, destFolder) {
  const srcFile = path.join(BASE_PATH, file);
  const destPath = path.join(BASE_PATH, destFolder);
  
  if (!fs.existsSync(srcFile)) {
    console.log(`⚠️  الملف غير موجود: ${file}`);
    return false;
  }
  
  await fs.ensureDir(destPath);
  await fs.copy(srcFile, path.join(destPath, file));
  console.log(`✅ نُقل: ${file} → ${destFolder}`);
  return true;
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 بدء إعادة تنظيم Documentation_Pro');
  console.log('='.repeat(60));
  
  let totalOperations = 0;
  
  // المرحلة 1: نسخ المجلدات
  console.log('\n📁 المرحلة 1: نسخ المجلدات');
  console.log('-'.repeat(60));
  for (const [oldFolder, newFolder] of Object.entries(FOLDER_MAPPING)) {
    if (await copyFolder(oldFolder, newFolder)) {
      totalOperations++;
    }
  }
  
  // المرحلة 2: نقل الملفات المتفرقة
  console.log('\n📁 المرحلة 2: نقل الملفات المتفرقة');
  console.log('-'.repeat(60));
  for (const [file, destFolder] of Object.entries(SCATTERED_FILES)) {
    if (await copyFile(file, destFolder)) {
      totalOperations++;
    }
  }
  
  // المرحلة 3: نقل مجلدات الأنظمة
  console.log('\n📁 المرحلة 3: نقل مجلدات الأنظمة');
  console.log('-'.repeat(60));
  for (const [oldFolder, newFolder] of Object.entries(SYSTEM_FOLDERS)) {
    if (await copyFolder(oldFolder, newFolder)) {
      totalOperations++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ اكتمل! تم تنفيذ ${totalOperations} عملية`);
  console.log('='.repeat(60));
  
  console.log('\n📝 الخطوات التالية:');
  console.log('1. راجع المجلدات الجديدة');
  console.log('2. احذف المجلدات القديمة بعد التأكد');
  console.log('3. أضف ملفات README لكل مجلد');
}

main().catch(console.error);
