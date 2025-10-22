/**
 * Settings Feature Configuration
 */

import type { FeatureConfig } from '../registry/types.js'

export const settingsConfig: FeatureConfig = {
  id: 'settings',
  name: '⚙️ الإعدادات',
  icon: '⚙️',
  description: 'إعدادات البوت الشاملة',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية، الوصول عبر زر خاص بالسوبر أدمن
  order: 99, // آخر قسم
  permissions: ['SUPER_ADMIN'], // فقط للسوبر ادمن
  subFeatures: [],
}
