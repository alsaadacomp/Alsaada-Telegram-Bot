import type { FeatureConfig } from '../registry/types.js'

export const notificationsPanelConfig: FeatureConfig = {
  id: 'notifications-panel',
  name: 'لوحة الإشعارات',
  icon: '🔔',
  enabled: false, // معطل لأنه الآن جزء من إعدادات الإشعارات
  order: 5,
  permissions: ['SUPER_ADMIN', 'ADMIN'],
  subFeatures: [],
}
