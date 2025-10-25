/**
 * User Display Helper
 * مساعد عرض المستخدمين - استخدام البيانات المحلية بدلاً من Telegram
 */

import type { User } from '../../../../generated/prisma/index.js'

/**
 * Get display name for user
 * الحصول على اسم العرض للمستخدم
 */
export function getUserDisplayName(user: Partial<User>): string {
  // Priority: fullName > nickname > username > ID
  if (user.fullName) {
    return user.fullName
  }

  if (user.nickname) {
    return user.nickname
  }

  if (user.username) {
    return user.username
  }

  return `مستخدم ${user.id || 'غير معروف'}`
}

/**
 * Get user info for display
 * الحصول على معلومات المستخدم للعرض
 */
export function getUserInfo(user: Partial<User>): {
  displayName: string
  phone: string | null
  email: string | null
  role: string
  isActive: boolean
} {
  return {
    displayName: getUserDisplayName(user),
    phone: user.phone || null,
    email: user.email || null,
    role: user.role || 'GUEST',
    isActive: user.isActive ?? true,
  }
}

/**
 * Format user for admin display
 * تنسيق المستخدم للعرض في لوحة الإدارة
 */
export function formatUserForAdmin(user: Partial<User>): string {
  const info = getUserInfo(user)
  const statusEmoji = info.isActive ? '✅' : '❌'
  const roleEmojis: Record<string, string> = {
    SUPER_ADMIN: '👑',
    ADMIN: '🛡️',
    USER: '👤',
    GUEST: '👥',
    MODERATOR: '🔧',
  }
  const roleEmoji = roleEmojis[info.role] || '👤'

  let result = `${roleEmoji} ${statusEmoji} **${info.displayName}**`

  if (info.phone) {
    result += `\n📱 ${info.phone}`
  }

  if (info.email) {
    result += `\n📧 ${info.email}`
  }

  result += `\n🆔 ID: ${user.id}`

  return result
}
