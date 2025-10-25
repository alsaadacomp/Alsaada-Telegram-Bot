/**
 * إدارة التوقيت المحلي للشركة
 * يستخدم إعدادات التوقيت من معلومات الشركة في قاعدة البيانات
 */

import { Database } from '../database/index.js'

/**
 * يحصل على التوقيت المحلي للشركة
 * @returns التوقيت المحلي للشركة أو توقيت القاهرة كافتراضي
 */
export async function getCompanyTimezone(): Promise<string> {
  try {
    const prisma = Database.prisma
    const company = await prisma.company.findFirst({
      where: { isActive: true },
      select: { timezone: true }
    })

    return company?.timezone || 'Africa/Cairo'
  } catch (error) {
    console.error('Error getting company timezone:', error)
    return 'Africa/Cairo' // توقيت القاهرة كافتراضي
  }
}

/**
 * يحصل على التاريخ والوقت الحالي بالتوقيت المحلي للشركة
 * @returns التاريخ والوقت الحالي بالتوقيت المحلي
 */
export async function getCurrentDateTime(): Promise<Date> {
  const timezone = await getCompanyTimezone()
  
  // إنشاء تاريخ جديد بالتوقيت المحلي
  const now = new Date()
  
  // تحويل التاريخ إلى التوقيت المحلي
  const localTime = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
  
  return localTime
}

/**
 * يحصل على التاريخ الحالي بالتوقيت المحلي للشركة
 * @returns التاريخ الحالي بصيغة YYYY-MM-DD
 */
export async function getCurrentDate(): Promise<string> {
  const currentDateTime = await getCurrentDateTime()
  return currentDateTime.toISOString().split('T')[0]
}

/**
 * يحصل على الوقت الحالي بالتوقيت المحلي للشركة
 * @returns الوقت الحالي بصيغة HH:MM:SS
 */
export async function getCurrentTime(): Promise<string> {
  const currentDateTime = await getCurrentDateTime()
  return currentDateTime.toTimeString().split(' ')[0]
}

/**
 * يحصل على التاريخ والوقت الحالي بالتوقيت المحلي للشركة بصيغة قابلة للقراءة
 * @returns التاريخ والوقت بصيغة قابلة للقراءة
 */
export async function getCurrentDateTimeFormatted(): Promise<string> {
  const timezone = await getCompanyTimezone()
  const currentDateTime = await getCurrentDateTime()
  
  return currentDateTime.toLocaleString('ar-EG', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * يحصل على التاريخ الحالي بالتوقيت المحلي للشركة بصيغة قابلة للقراءة
 * @returns التاريخ بصيغة قابلة للقراءة
 */
export async function getCurrentDateFormatted(): Promise<string> {
  const timezone = await getCompanyTimezone()
  const currentDateTime = await getCurrentDateTime()
  
  return currentDateTime.toLocaleDateString('ar-EG', {
    timeZone: timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * يحصل على الوقت الحالي بالتوقيت المحلي للشركة بصيغة قابلة للقراءة
 * @returns الوقت بصيغة قابلة للقراءة
 */
export async function getCurrentTimeFormatted(): Promise<string> {
  const timezone = await getCompanyTimezone()
  const currentDateTime = await getCurrentDateTime()
  
  return currentDateTime.toLocaleTimeString('ar-EG', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

/**
 * يحول تاريخ إلى التوقيت المحلي للشركة
 * @param date التاريخ المراد تحويله
 * @returns التاريخ المحول
 */
export async function convertToCompanyTimezone(date: Date): Promise<Date> {
  const timezone = await getCompanyTimezone()
  
  // تحويل التاريخ إلى التوقيت المحلي
  const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  
  return localTime
}

/**
 * يحول تاريخ من التوقيت المحلي للشركة إلى UTC
 * @param date التاريخ المراد تحويله
 * @returns التاريخ المحول إلى UTC
 */
export async function convertFromCompanyTimezone(date: Date): Promise<Date> {
  const timezone = await getCompanyTimezone()
  
  // إنشاء تاريخ جديد بالتوقيت المحلي
  const localTime = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
  
  // حساب الفرق بين التوقيت المحلي و UTC
  const offset = localTime.getTime() - date.getTime()
  
  // إضافة الفرق للحصول على UTC
  return new Date(date.getTime() + offset)
}

/**
 * قائمة بالتوقيتات المدعومة
 */
export const SUPPORTED_TIMEZONES = {
  'Africa/Cairo': 'القاهرة، مصر',
  'Asia/Riyadh': 'الرياض، السعودية',
  'Asia/Dubai': 'دبي، الإمارات',
  'Asia/Kuwait': 'الكويت',
  'Asia/Qatar': 'قطر',
  'Asia/Bahrain': 'البحرين',
  'Asia/Muscat': 'مسقط، عمان',
  'Africa/Tunis': 'تونس',
  'Africa/Algiers': 'الجزائر',
  'Africa/Casablanca': 'الدار البيضاء، المغرب',
  'Africa/Tripoli': 'طرابلس، ليبيا',
  'Africa/Khartoum': 'الخرطوم، السودان',
  'Africa/Juba': 'جوبا، جنوب السودان',
  'Africa/Nairobi': 'نيروبي، كينيا',
  'Africa/Addis_Ababa': 'أديس أبابا، إثيوبيا',
  'Europe/London': 'لندن، المملكة المتحدة',
  'Europe/Paris': 'باريس، فرنسا',
  'Europe/Berlin': 'برلين، ألمانيا',
  'Europe/Rome': 'روما، إيطاليا',
  'Europe/Madrid': 'مدريد، إسبانيا',
  'America/New_York': 'نيويورك، الولايات المتحدة',
  'America/Los_Angeles': 'لوس أنجلوس، الولايات المتحدة',
  'America/Chicago': 'شيكاغو، الولايات المتحدة',
  'Asia/Tokyo': 'طوكيو، اليابان',
  'Asia/Shanghai': 'شنغهاي، الصين',
  'Asia/Mumbai': 'مومباي، الهند',
  'Australia/Sydney': 'سيدني، أستراليا'
}

/**
 * يحصل على قائمة بالتوقيتات المدعومة
 * @returns قائمة بالتوقيتات المدعومة
 */
export function getSupportedTimezones(): Record<string, string> {
  return SUPPORTED_TIMEZONES
}

/**
 * يتحقق من أن التوقيت مدعوم
 * @param timezone التوقيت المراد التحقق منه
 * @returns true إذا كان مدعوماً
 */
export function isTimezoneSupported(timezone: string): boolean {
  return timezone in SUPPORTED_TIMEZONES
}
