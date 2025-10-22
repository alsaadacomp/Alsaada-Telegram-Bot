/**
 * Reports Feature Configuration
 * إعدادات ميزة التقارير والإحصائيات
 */

import type { FeatureConfig } from '#root/bot/features/registry/types.js'

export const reportsConfig: FeatureConfig = {
  id: 'reports-analytics',
  name: '📊 التقارير والإحصائيات',
  icon: '📊',
  description: 'تقارير شاملة وإحصائيات مفصلة للنظام والمستخدمين',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية
  order: 8,
  permissions: ['SUPER_ADMIN', 'ADMIN'],
  subFeatures: [
    {
      id: 'analytics-overview',
      name: '📈 نظرة عامة',
      icon: '📈',
      handler: 'reports:analytics',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'user-reports',
      name: '👥 تقارير المستخدمين',
      icon: '👥',
      handler: 'reports:users',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'system-performance',
      name: '⚙️ أداء النظام',
      icon: '⚙️',
      handler: 'reports:system',
      permissions: ['SUPER_ADMIN'],
      enabled: true,
    },
    {
      id: 'activity-logs',
      name: '📝 سجل النشاط',
      icon: '📝',
      handler: 'reports:activity',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'export-reports',
      name: '📤 تصدير التقارير',
      icon: '📤',
      handler: 'reports:export',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
  ],
}
