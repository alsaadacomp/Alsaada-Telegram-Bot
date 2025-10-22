/**
 * Security Feature Configuration
 * إعدادات ميزة الأمان
 */

import type { FeatureConfig } from '#root/bot/features/registry/types.js'

export const securityConfig: FeatureConfig = {
  id: 'security-management',
  name: '🛡️ الأمان والحماية',
  icon: '🛡️',
  description: 'مراقبة الأمان وحماية النظام',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية
  order: 11,
  permissions: ['SUPER_ADMIN', 'ADMIN'],
  subFeatures: [
    {
      id: 'security-dashboard',
      name: '📊 لوحة الأمان',
      icon: '📊',
      handler: 'security:dashboard',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'security-events',
      name: '📝 سجل الأحداث',
      icon: '📝',
      handler: 'security:events',
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      enabled: true,
    },
    {
      id: 'two-factor-auth',
      name: '🔐 المصادقة الثنائية',
      icon: '🔐',
      handler: 'security:2fa',
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      enabled: true,
    },
    {
      id: 'password-policy',
      name: '🔑 سياسة كلمات المرور',
      icon: '🔑',
      handler: 'security:password-policy',
      permissions: ['SUPER_ADMIN'],
      enabled: true,
    },
    {
      id: 'security-settings',
      name: '⚙️ إعدادات الأمان',
      icon: '⚙️',
      handler: 'security:settings',
      permissions: ['SUPER_ADMIN'],
      enabled: true,
    },
    {
      id: 'threat-detection',
      name: '🚨 كشف التهديدات',
      icon: '🚨',
      handler: 'security:threats',
      permissions: ['SUPER_ADMIN'],
      enabled: true,
    },
  ],
}
