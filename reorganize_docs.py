#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكريبت إعادة تنظيم Documentation_Pro
يقوم بنقل الملفات من المجلدات القديمة إلى الجديدة
"""

import os
import shutil
from pathlib import Path

# المسار الأساسي
BASE_PATH = Path(r"F:\_Alsaada_Telegram_Bot\telegram-bot-template-main\Documentation_Pro")

# خريطة النقل: (مجلد_قديم, مجلد_جديد)
FOLDER_MAPPING = {
    "10_دليل_المطور": "03_دليل_المطور",
    "20_دليل_المستخدم": "02_البدء_السريع",
    "30_التشغيل": "98_التشغيل_والنشر",
    "40_واجهة_المستخدم": "05_واجهات_المستخدم",
    "50_HowTo": "95_أدلة_عملية",
    "60_أدلة_التصميم": "06_أدلة_التصميم",
    "70_أمثلة_تدفقات": "07_أمثلة_وتدفقات",
    "80_وحدات_جاهزة": "08_وحدات_جاهزة",
    "11_API_Reference": "09_API_Reference",
    "90_تقييم": "99_تقييم_وتحليل",
}

def copy_files(src_folder, dest_folder):
    """نسخ جميع الملفات من مجلد إلى آخر"""
    src_path = BASE_PATH / src_folder
    dest_path = BASE_PATH / dest_folder
    
    if not src_path.exists():
        print(f"❌ المجلد غير موجود: {src_folder}")
        return False
    
    if not dest_path.exists():
        dest_path.mkdir(parents=True, exist_ok=True)
    
    files_copied = 0
    for item in src_path.iterdir():
        if item.is_file():
            dest_file = dest_path / item.name
            shutil.copy2(item, dest_file)
            print(f"✅ نُسخ: {item.name} → {dest_folder}/")
            files_copied += 1
        elif item.is_dir():
            # نسخ المجلدات الفرعية أيضاً
            dest_subdir = dest_path / item.name
            if dest_subdir.exists():
                shutil.rmtree(dest_subdir)
            shutil.copytree(item, dest_subdir)
            print(f"✅ نُسخ المجلد: {item.name}/ → {dest_folder}/")
            files_copied += 1
    
    return files_copied > 0

def main():
    print("=" * 60)
    print("🚀 بدء إعادة تنظيم Documentation_Pro")
    print("=" * 60)
    
    total_operations = 0
    
    # نسخ الملفات من المجلدات القديمة
    print("\n📁 المرحلة 1: نسخ الملفات من المجلدات القديمة")
    print("-" * 60)
    
    for old_folder, new_folder in FOLDER_MAPPING.items():
        print(f"\n📂 معالجة: {old_folder} → {new_folder}")
        if copy_files(old_folder, new_folder):
            total_operations += 1
    
    # نقل الملفات المتفرقة
    print("\n" + "=" * 60)
    print("📁 المرحلة 2: نقل الملفات المتفرقة")
    print("-" * 60)
    
    scattered_files = {
        "EMPLOYEE_SCHEMA_FINAL.md": "04_قواعد_البيانات/01_نظام_الموظفين/",
        "EMPLOYEE_SCHEMA_PROPOSAL.md": "04_قواعد_البيانات/01_نظام_الموظفين/",
        "EMPLOYEE_SCHEMA_SIMPLIFIED.md": "04_قواعد_البيانات/01_نظام_الموظفين/",
        "DEPARTMENT_SETUP.md": "04_قواعد_البيانات/05_البيانات_الأساسية/",
        "POSITION_SETUP.md": "04_قواعد_البيانات/05_البيانات_الأساسية/",
        "GOVERNORATES_DATA.md": "04_قواعد_البيانات/05_البيانات_الأساسية/",
    }
    
    for file, dest_folder in scattered_files.items():
        src_file = BASE_PATH / file
        dest_path = BASE_PATH / dest_folder
        dest_path.mkdir(parents=True, exist_ok=True)
        
        if src_file.exists():
            shutil.copy2(src_file, dest_path / file)
            print(f"✅ نُقل: {file} → {dest_folder}")
            total_operations += 1
        else:
            print(f"⚠️  الملف غير موجود: {file}")
    
    # نقل مجلدات Equipment و Warehouse
    print("\n" + "=" * 60)
    print("📁 المرحلة 3: نقل مجلدات الأنظمة")
    print("-" * 60)
    
    system_folders = {
        "Equipment": "04_قواعد_البيانات/02_نظام_المعدات",
        "Warehouse": "04_قواعد_البيانات/03_نظام_المخازن",
        "Cost_Calculation": "04_قواعد_البيانات/04_نظام_التكاليف",
    }
    
    for old_folder, new_folder in system_folders.items():
        src_path = BASE_PATH / old_folder
        dest_path = BASE_PATH / new_folder
        
        if src_path.exists() and any(src_path.iterdir()):
            dest_path.mkdir(parents=True, exist_ok=True)
            for item in src_path.iterdir():
                if item.is_file():
                    shutil.copy2(item, dest_path / item.name)
                    print(f"✅ نُقل: {old_folder}/{item.name}")
                    total_operations += 1
        else:
            print(f"⚠️  المجلد فارغ أو غير موجود: {old_folder}")
    
    print("\n" + "=" * 60)
    print(f"✅ اكتمل! تم تنفيذ {total_operations} عملية")
    print("=" * 60)
    
    print("\n📝 الخطوات التالية:")
    print("1. راجع المجلدات الجديدة")
    print("2. احذف المجلدات القديمة يدوياً بعد التأكد")
    print("3. أضف ملفات README لكل مجلد")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ حدث خطأ: {e}")
        import traceback
        traceback.print_exc()
