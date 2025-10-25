/**
 * HR Management Feature Configuration
 */

import type { FeatureConfig } from '../registry/types.js'

export const hrManagementConfig: FeatureConfig = {
  id: 'hr-management',
  name: '👥 شئون العاملين',
  icon: '👥',
  description: 'إدارة شاملة للموارد البشرية',
  enabled: true,
  order: 2,
  permissions: ['SUPER_ADMIN', 'ADMIN'], // ❌ Removed USER - HR is admin-only

  subFeatures: [
    {
      id: 'employees-list',
      name: '📋 قوائم العاملين',
      icon: '📋',
      description: 'إدارة بيانات العاملين الحاليين والسابقين',
      handler: 'employeesListHandler', // اسم مرجعي فقط
      enabled: true,
      order: 1,
      permissions: ['SUPER_ADMIN', 'ADMIN'], // ❌ Removed USER - Admins only
    },
    {
      id: 'advances',
      name: '💰 السلف والمسحوبات',
      icon: '💰',
      description: 'إدارة السلف والمسحوبات المالية',
      handler: 'advancesHandler', // اسم مرجعي فقط
      enabled: true,
      order: 2,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'leaves',
      name: '🏖️ الإجازات والماموريات',
      icon: '🏖️',
      description: 'إدارة الإجازات والماموريات الرسمية',
      handler: 'leavesHandler', // اسم مرجعي فقط
      enabled: true,
      order: 3,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
    },
    {
      id: 'payroll',
      name: '💵 الرواتب والأجور',
      icon: '💵',
      description: 'إدارة الرواتب والأجور (SUPER_ADMIN فقط)',
      handler: 'payrollHandler', // اسم مرجعي فقط
      enabled: true,
      order: 4,
      permissions: ['SUPER_ADMIN'],
    },
    {
      id: 'custom-reports',
      name: '📊 التقارير المخصصة',
      icon: '📊',
      description: 'إنشاء تقارير احترافية مخصصة (SUPER_ADMIN فقط)',
      handler: 'customReportsHandler',
      enabled: true,
      order: 5,
      permissions: ['SUPER_ADMIN'],
    },
  ],
}
