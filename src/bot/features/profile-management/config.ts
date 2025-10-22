/**
 * Profile Management Feature Configuration
 * إعدادات ميزة إدارة الملف الشخصي
 */

import type { FeatureConfig } from '#root/bot/features/registry/types.js'

export const profileConfig: FeatureConfig = {
  id: 'profile-management',
  name: 'الملف الشخصي',
  icon: '👤',
  category: 'system',
  enabled: false,
  order: 1, // أول عنصر في القائمة
  description: 'إدارة الملف الشخصي والمعلومات الشخصية',
  permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'], // متاح للجميع عدا GUEST
  subFeatures: [
    {
      id: 'view-profile',
      name: 'عرض الملف الشخصي',
      icon: '👁️',
      enabled: true,
      order: 1,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'profile:view',
    },
    {
      id: 'edit-profile',
      name: 'تعديل الملف الشخصي',
      icon: '✏️',
      enabled: true,
      order: 2,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'profile:edit',
    },
    {
      id: 'change-password',
      name: 'تغيير كلمة المرور',
      icon: '🔐',
      enabled: true,
      order: 3,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'profile:change-password',
    },
  ],
}
