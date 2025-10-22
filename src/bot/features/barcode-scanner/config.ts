/**
 * Barcode Scanner Feature Configuration
 * إعدادات ميزة ماسح الباركود
 */

import type { FeatureConfig } from '../registry/types.js'

export const barcodeScannerConfig: FeatureConfig = {
  id: 'barcode-scanner',
  name: 'ماسح الباركود',
  icon: '📱',
  description: 'قراءة وتحليل الباركود والرموز المربعة',
  category: 'system',
  enabled: false, // إخفاء من القائمة الرئيسية
  order: 6,
  permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
  subFeatures: [
    {
      id: 'scan-qr',
      name: 'مسح QR Code',
      icon: '🔲',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'barcode:scan-qr',
    },
    {
      id: 'scan-barcode',
      name: 'مسح الباركود',
      icon: '📊',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'barcode:scan-barcode',
    },
    {
      id: 'generate-qr',
      name: 'إنشاء QR Code',
      icon: '➕',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN', 'USER'],
      handler: 'barcode:generate-qr',
    },
    {
      id: 'barcode-history',
      name: 'سجل المسح',
      icon: '📋',
      enabled: true,
      permissions: ['SUPER_ADMIN', 'ADMIN'],
      handler: 'barcode:history',
    },
  ],
}
