/**
 * Admin Panel Feature Configuration
 *
 * لوحة التحكم الإدارية لإدارة المستخدمين والأدوار
 */

import type { FeatureConfig } from '../registry/types.js'

export const adminPanelConfig: FeatureConfig = {
  id: 'admin-panel',
  name: 'لوحة التحكم',
  icon: '🛡️',
  description: 'إدارة المستخدمين والأدوار والصلاحيات',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية
  order: 10,
  permissions: ['SUPER_ADMIN', 'ADMIN'],

  subFeatures: [
    {
      id: 'users-list',
      name: 'قائمة المستخدمين',
      icon: '👥',
      description: 'عرض وإدارة جميع المستخدمين',
      handler: 'usersListHandler',
      enabled: true,
      order: 1,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'change-role',
      name: 'تغيير الأدوار',
      icon: '🔄',
      description: 'تغيير دور المستخدمين',
      handler: 'changeRoleHandler',
      enabled: true,
      order: 2,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'ban-user',
      name: 'حظر مستخدم',
      icon: '🚫',
      description: 'حظر أو إلغاء حظر المستخدمين',
      handler: 'banUserHandler',
      enabled: true,
      order: 3,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'statistics',
      name: 'الإحصائيات',
      icon: '📊',
      description: 'إحصائيات المستخدمين والأدوار',
      handler: 'statisticsHandler',
      enabled: true,
      order: 4,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'join-requests',
      name: 'طلبات الانضمام',
      icon: '📝',
      description: 'مراجعة وإدارة طلبات الانضمام',
      handler: 'joinRequestsHandler',
      enabled: true,
      order: 5,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'settings',
      name: 'إعدادات البوت',
      icon: '⚙️',
      description: 'إدارة إعدادات البوت المركزية',
      handler: 'settingsManagerHandler',
      enabled: true,
      order: 6,
      permissions: ['SUPER_ADMIN'],
    },
  ],
}
