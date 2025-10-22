/**
 * Default Settings Definitions
 *
 * Pre-defined settings for the bot with their defaults and validation rules.
 */

import type { SettingDefinition } from './types.js'

/**
 * Bot general settings
 */
export const botSettings: SettingDefinition[] = [
  {
    key: 'bot.name',
    scope: 'global',
    category: 'bot',
    type: 'string',
    defaultValue: 'Telegram Bot',
    description: 'اسم البوت',
    validation: {
      required: true,
      min: 1,
      max: 100,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 1,
  },
  {
    key: 'bot.company_name',
    scope: 'global',
    category: 'bot',
    type: 'string',
    defaultValue: 'الشركة',
    description: 'اسم الشركة',
    validation: {
      required: true,
      min: 1,
      max: 100,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 2,
  },
  {
    key: 'bot.default_language',
    scope: 'global',
    category: 'bot',
    type: 'string',
    defaultValue: 'ar',
    description: 'اللغة الافتراضية للبوت',
    validation: {
      enum: ['ar', 'en'],
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 2,
  },
  {
    key: 'bot.maintenance_mode',
    scope: 'global',
    category: 'bot',
    type: 'boolean',
    defaultValue: false,
    description: 'وضع الصيانة - يوقف البوت مؤقتاً',
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 3,
  },
  {
    key: 'bot.maintenance_message',
    scope: 'global',
    category: 'bot',
    type: 'string',
    defaultValue: 'البوت تحت الصيانة حالياً. سنعود قريباً.',
    description: 'رسالة الصيانة',
    validation: {
      min: 1,
      max: 500,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 4,
  },
  {
    key: 'bot.welcome_message',
    scope: 'global',
    category: 'bot',
    type: 'string',
    defaultValue: 'مرحباً بك!',
    description: 'رسالة الترحيب',
    validation: {
      min: 1,
      max: 1000,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'messages',
    order: 5,
  },
]

/**
 * Security settings
 */
export const securitySettings: SettingDefinition[] = [
  {
    key: 'security.rate_limit_enabled',
    scope: 'global',
    category: 'security',
    type: 'boolean',
    defaultValue: true,
    description: 'تفعيل حد المعدل (Rate Limiting)',
    isEditable: true,
    requiresRestart: false,
    group: 'rate-limiting',
    order: 1,
  },
  {
    key: 'security.rate_limit_max_requests',
    scope: 'global',
    category: 'security',
    type: 'number',
    defaultValue: 30,
    description: 'الحد الأقصى للطلبات في النافذة الزمنية',
    validation: {
      min: 1,
      max: 1000,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'rate-limiting',
    order: 2,
  },
  {
    key: 'security.rate_limit_window',
    scope: 'global',
    category: 'security',
    type: 'number',
    defaultValue: 60000, // 1 minute in milliseconds
    description: 'النافذة الزمنية (بالميللي ثانية)',
    validation: {
      min: 1000,
      max: 3600000,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'rate-limiting',
    order: 3,
  },
  {
    key: 'security.auto_ban_on_spam',
    scope: 'global',
    category: 'security',
    type: 'boolean',
    defaultValue: false,
    description: 'حظر تلقائي عند اكتشاف السبام',
    isEditable: true,
    requiresRestart: false,
    group: 'anti-spam',
    order: 4,
  },
  {
    key: 'security.max_login_attempts',
    scope: 'global',
    category: 'security',
    type: 'number',
    defaultValue: 5,
    description: 'الحد الأقصى لمحاولات تسجيل الدخول',
    validation: {
      min: 1,
      max: 10,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'authentication',
    order: 5,
  },
]

/**
 * Notification settings
 */
export const notificationSettings: SettingDefinition[] = [
  {
    key: 'notifications.enabled',
    scope: 'global',
    category: 'notifications',
    type: 'boolean',
    defaultValue: true,
    description: 'تفعيل نظام الإشعارات',
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 1,
  },
  {
    key: 'notifications.default_priority',
    scope: 'global',
    category: 'notifications',
    type: 'string',
    defaultValue: 'normal',
    description: 'الأولوية الافتراضية للإشعارات',
    validation: {
      enum: ['normal', 'important', 'urgent', 'critical'],
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 2,
  },
  {
    key: 'notifications.retry_on_failure',
    scope: 'global',
    category: 'notifications',
    type: 'boolean',
    defaultValue: true,
    description: 'إعادة المحاولة عند فشل الإرسال',
    isEditable: true,
    requiresRestart: false,
    group: 'delivery',
    order: 3,
  },
  {
    key: 'notifications.max_retries',
    scope: 'global',
    category: 'notifications',
    type: 'number',
    defaultValue: 3,
    description: 'الحد الأقصى لإعادة المحاولات',
    validation: {
      min: 0,
      max: 10,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'delivery',
    order: 4,
  },
]

/**
 * Feature settings
 */
export const featureSettings: SettingDefinition[] = [
  {
    key: 'features.auto_discovery_enabled',
    scope: 'global',
    category: 'features',
    type: 'boolean',
    defaultValue: true,
    description: 'تفعيل التحميل التلقائي للميزات',
    isEditable: true,
    requiresRestart: true,
    group: 'discovery',
    order: 1,
  },
  {
    key: 'features.main_menu_enabled',
    scope: 'global',
    category: 'features',
    type: 'boolean',
    defaultValue: true,
    description: 'تفعيل القائمة الرئيسية',
    isEditable: true,
    requiresRestart: false,
    group: 'menu',
    order: 2,
  },
  {
    key: 'features.max_buttons_per_row',
    scope: 'global',
    category: 'features',
    type: 'number',
    defaultValue: 2,
    description: 'الحد الأقصى للأزرار في الصف الواحد',
    validation: {
      min: 1,
      max: 8,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'menu',
    order: 3,
  },
]

/**
 * Database settings
 */
export const databaseSettings: SettingDefinition[] = [
  {
    key: 'database.auto_backup_enabled',
    scope: 'global',
    category: 'database',
    type: 'boolean',
    defaultValue: false,
    description: 'تفعيل النسخ الاحتياطي التلقائي',
    isEditable: true,
    requiresRestart: false,
    group: 'backup',
    order: 1,
  },
  {
    key: 'database.backup_interval',
    scope: 'global',
    category: 'database',
    type: 'number',
    defaultValue: 86400000, // 24 hours in milliseconds
    description: 'فترة النسخ الاحتياطي (بالميللي ثانية)',
    validation: {
      min: 3600000, // 1 hour
      max: 604800000, // 1 week
    },
    isEditable: true,
    requiresRestart: false,
    group: 'backup',
    order: 2,
  },
  {
    key: 'database.max_backups',
    scope: 'global',
    category: 'database',
    type: 'number',
    defaultValue: 7,
    description: 'الحد الأقصى للنسخ الاحتياطية المحفوظة',
    validation: {
      min: 1,
      max: 30,
    },
    isEditable: true,
    requiresRestart: false,
    group: 'backup',
    order: 3,
  },
]

/**
 * Performance settings
 */
export const performanceSettings: SettingDefinition[] = [
  {
    key: 'performance.cache_enabled',
    scope: 'global',
    category: 'performance',
    type: 'boolean',
    defaultValue: true,
    description: 'تفعيل التخزين المؤقت',
    isEditable: true,
    requiresRestart: false,
    group: 'cache',
    order: 1,
  },
  {
    key: 'performance.cache_timeout',
    scope: 'global',
    category: 'performance',
    type: 'number',
    defaultValue: 60000, // 1 minute
    description: 'مدة صلاحية التخزين المؤقت (بالميللي ثانية)',
    validation: {
      min: 1000,
      max: 86400000, // 24 hours (1440 minutes)
    },
    isEditable: true,
    requiresRestart: false,
    group: 'cache',
    order: 2,
  },
  {
    key: 'performance.max_concurrent_requests',
    scope: 'global',
    category: 'performance',
    type: 'number',
    defaultValue: 100,
    description: 'الحد الأقصى للطلبات المتزامنة',
    validation: {
      min: 1,
      max: 1000,
    },
    isEditable: true,
    requiresRestart: true,
    group: 'concurrency',
    order: 3,
  },
]

/**
 * Logging settings
 */
export const loggingSettings: SettingDefinition[] = [
  {
    key: 'logging.level',
    scope: 'global',
    category: 'logging',
    type: 'string',
    defaultValue: 'info',
    description: 'مستوى التسجيل',
    validation: {
      enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
    },
    isEditable: true,
    requiresRestart: false,
    group: 'general',
    order: 1,
  },
  {
    key: 'logging.log_to_file',
    scope: 'global',
    category: 'logging',
    type: 'boolean',
    defaultValue: false,
    description: 'حفظ السجلات في ملف',
    isEditable: true,
    requiresRestart: true,
    group: 'output',
    order: 2,
  },
  {
    key: 'logging.log_queries',
    scope: 'global',
    category: 'logging',
    type: 'boolean',
    defaultValue: false,
    description: 'تسجيل استعلامات قاعدة البيانات',
    isEditable: true,
    requiresRestart: false,
    group: 'database',
    order: 3,
  },
]

/**
 * All default settings
 */
export const allDefaultSettings: SettingDefinition[] = [
  ...botSettings,
  ...securitySettings,
  ...notificationSettings,
  ...featureSettings,
  ...databaseSettings,
  ...performanceSettings,
  ...loggingSettings,
]

/**
 * Register all default settings with SettingsManager
 */
export function registerDefaultSettings(settingsManager: any): void {
  allDefaultSettings.forEach((setting) => {
    settingsManager.registerSetting(setting)
  })
}
