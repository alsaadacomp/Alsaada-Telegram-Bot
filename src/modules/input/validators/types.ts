/**
 * Types for Validators Module
 * أنواع TypeScript لوحدة التحقق
 */

/**
 * نتيجة التحقق من الصحة
 */
export interface ValidationResult {
  /** هل المدخل صحيح؟ */
  isValid: boolean
  /** رسالة الخطأ إن وجدت */
  error?: string
  /** القيمة بعد التنظيف/التنسيق */
  value?: any
}

/**
 * خيارات التحقق العامة
 */
export interface ValidatorOptions {
  /** رسالة خطأ مخصصة */
  customError?: string
  /** تنظيف القيمة تلقائياً؟ */
  autoClean?: boolean
  /** السماح بالقيم الفارغة؟ */
  allowEmpty?: boolean
}

/**
 * قوة كلمة المرور
 */
export type PasswordStrength = 'weak' | 'medium' | 'strong' | 'very-strong'

/**
 * نتيجة التحقق من كلمة المرور
 */
export interface PasswordValidationResult {
  /** هل كلمة المرور صحيحة؟ */
  isValid: boolean
  /** قوة كلمة المرور */
  strength: PasswordStrength
  /** النتيجة من 0-100 */
  score: number
  /** ملاحظات لتحسين كلمة المرور */
  suggestions: string[]
}

/**
 * نطاق الأرقام
 */
export interface NumberRange {
  /** الحد الأدنى (اختياري) */
  min?: number
  /** الحد الأقصى (اختياري) */
  max?: number
}

/**
 * نطاق التاريخ
 */
export interface DateRange {
  /** تاريخ البداية (اختياري) */
  start?: Date
  /** تاريخ النهاية (اختياري) */
  end?: Date
}
