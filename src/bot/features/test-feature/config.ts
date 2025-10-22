/**
 * Test Feature Configuration
 *
 * قسم تجريبي يستخدم جميع الوحدات المبنية سابقاً
 */

import type { FeatureConfig } from '../registry/types.js'

export const testFeatureConfig: FeatureConfig = {
  id: 'test-feature',
  name: 'قسم تجريبي',
  icon: '🧪',
  description: 'قسم تجريبي يستخدم جميع الوحدات المبنية (Forms, Multi-Step, Tables, Keyboards)',
  enabled: true,
  order: 1, // يظهر أولاً في القائمة
  permissions: ['ADMIN', 'USER'], // فقط المستخدمين المسجلين

  subFeatures: [
    {
      id: 'form-demo',
      name: 'نموذج تجريبي',
      icon: '📝',
      description: 'تجربة Form Builder مع التحقق من البيانات',
      handler: 'formDemoHandler',
      enabled: true, // false or true
      order: 1,
    },
    {
      id: 'multi-step-demo',
      name: 'نموذج متعدد الخطوات',
      icon: '🔄',
      description: 'تجربة Multi-Step Forms مع Conversations',
      handler: 'multiStepDemoHandler',
      enabled: true,
      order: 2,
    },
    {
      id: 'table-demo',
      name: 'جدول بيانات تجريبي',
      icon: '📊',
      description: 'تجربة Data Tables مع الترتيب والتصفية',
      handler: 'tableDemoHandler',
      enabled: true,
      order: 3,
    },
  ],
}
