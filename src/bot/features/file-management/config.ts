/**
 * File Management Feature Configuration
 * إعدادات ميزة إدارة الملفات
 */

import type { FeatureConfig } from '#root/bot/features/registry/types.js'

export const fileManagementConfig: FeatureConfig = {
  id: 'file-management',
  name: '📁 إدارة الملفات',
  icon: '📁',
  description: 'رفع وتنظيم ومشاركة الملفات',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية
  order: 9,
  permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  subFeatures: [
    {
      id: 'upload-file',
      name: '📤 رفع ملف',
      icon: '📤',
      handler: 'files:upload',
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      enabled: true,
    },
    {
      id: 'my-files',
      name: '📋 ملفاتي',
      icon: '📋',
      handler: 'files:my-files',
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      enabled: true,
    },
    {
      id: 'search-files',
      name: '🔍 البحث',
      icon: '🔍',
      handler: 'files:search',
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      enabled: true,
    },
    {
      id: 'public-files',
      name: '🌐 الملفات العامة',
      icon: '🌐',
      handler: 'files:public',
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      enabled: true,
    },
    {
      id: 'file-statistics',
      name: '📊 إحصائيات الملفات',
      icon: '📊',
      handler: 'files:statistics',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'file-settings',
      name: '⚙️ إعدادات الملفات',
      icon: '⚙️',
      handler: 'files:settings',
      permissions: ['SUPER_ADMIN'],
      enabled: true,
    },
  ],
}
