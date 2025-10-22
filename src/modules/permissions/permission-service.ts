/**
 * Permission Service
 *
 * Centralized service for checking and managing permissions
 */

import type { Role } from '../../../generated/prisma/index.js'
import type {
  PermissionCheckResult,
  PermissionDefinition,
  UserPermissionContext,
} from './types.js'
import { Database } from '#root/modules/database/index.js'
import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from './types.js'

export class PermissionService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    userContext: UserPermissionContext,
    permission: string,
  ): boolean {
    // Banned users have no permissions
    if (userContext.isBanned) {
      return false
    }

    // Inactive users have no permissions
    if (!userContext.isActive) {
      return false
    }

    // SUPER_ADMIN has all permissions
    if (userContext.role === 'SUPER_ADMIN') {
      return true
    }

    // Check role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[userContext.role] || []

    // Check wildcard permission
    if (rolePermissions.includes('*')) {
      return true
    }

    // Check exact permission
    if (rolePermissions.includes(permission)) {
      return true
    }

    // Check category wildcard (e.g., "users.*" matches "users.view")
    const [category] = permission.split('.')
    if (rolePermissions.includes(`${category}.*`)) {
      return true
    }

    // Check custom permissions
    if (userContext.customPermissions && userContext.customPermissions.includes(permission)) {
      return true
    }

    return false
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(
    userContext: UserPermissionContext,
    permissions: string[],
  ): boolean {
    return permissions.some(permission => this.hasPermission(userContext, permission))
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(
    userContext: UserPermissionContext,
    permissions: string[],
  ): boolean {
    return permissions.every(permission => this.hasPermission(userContext, permission))
  }

  /**
   * Check if a user has a specific role
   */
  static hasRole(userContext: UserPermissionContext, role: Role): boolean {
    return userContext.role === role
  }

  /**
   * Check if a user has any of the specified roles
   */
  static hasAnyRole(userContext: UserPermissionContext, roles: Role[]): boolean {
    return roles.includes(userContext.role)
  }

  /**
   * Check if a user's role is at least the specified role
   * (e.g., ADMIN is at least USER)
   */
  static hasMinRole(userContext: UserPermissionContext, minRole: Role): boolean {
    const userLevel = ROLE_HIERARCHY[userContext.role] || 0
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0
    return userLevel >= requiredLevel
  }

  /**
   * Check if user can access a feature
   */
  static canAccessFeature(
    userContext: UserPermissionContext,
    requiredRoles?: Role[],
  ): PermissionCheckResult {
    // Banned or inactive users cannot access anything
    if (userContext.isBanned) {
      return {
        allowed: false,
        reason: 'User is banned',
        userRole: userContext.role,
      }
    }

    if (!userContext.isActive) {
      return {
        allowed: false,
        reason: 'User is inactive',
        userRole: userContext.role,
      }
    }

    // If no specific roles required, allow all active users
    if (!requiredRoles || requiredRoles.length === 0) {
      return { allowed: true, userRole: userContext.role }
    }

    // Check if user has any of the required roles
    const allowed = requiredRoles.includes(userContext.role)

    return {
      allowed,
      reason: allowed ? undefined : 'Insufficient role',
      required: requiredRoles,
      userRole: userContext.role,
    }
  }

  /**
   * Get all permissions for a role
   */
  static getRolePermissions(role: Role): string[] {
    return ROLE_PERMISSIONS[role] || []
  }

  /**
   * Check if one role is higher than another
   */
  static isRoleHigher(role1: Role, role2: Role): boolean {
    const level1 = ROLE_HIERARCHY[role1] || 0
    const level2 = ROLE_HIERARCHY[role2] || 0
    return level1 > level2
  }

  /**
   * Get user permission context from database by database ID
   */
  static async getUserContext(userId: number): Promise<UserPermissionContext | null> {
    const user = await Database.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        telegramId: true,
        role: true,
        isActive: true,
        isBanned: true,
        customPermissions: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      telegramId: user.telegramId,
      role: user.role,
      isActive: user.isActive,
      isBanned: user.isBanned,
      customPermissions: user.customPermissions
        ? JSON.parse(user.customPermissions)
        : undefined,
    }
  }

  /**
   * Get user permission context from database by Telegram ID
   */
  static async getUserContextByTelegramId(telegramId: number): Promise<UserPermissionContext | null> {
    const user = await Database.prisma.user.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: {
        id: true,
        telegramId: true,
        role: true,
        isActive: true,
        isBanned: true,
        customPermissions: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      telegramId: user.telegramId,
      role: user.role,
      isActive: user.isActive,
      isBanned: user.isBanned,
      customPermissions: user.customPermissions
        ? JSON.parse(user.customPermissions)
        : undefined,
    }
  }

  /**
   * Add custom permission to user
   */
  static async addCustomPermission(userId: number, permission: string): Promise<void> {
    const user = await Database.prisma.user.findUnique({
      where: { id: userId },
      select: { customPermissions: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const currentPermissions: string[] = user.customPermissions
      ? JSON.parse(user.customPermissions)
      : []

    if (!currentPermissions.includes(permission)) {
      currentPermissions.push(permission)
      await Database.prisma.user.update({
        where: { id: userId },
        data: {
          customPermissions: JSON.stringify(currentPermissions),
        },
      })
    }
  }

  /**
   * Remove custom permission from user
   */
  static async removeCustomPermission(userId: number, permission: string): Promise<void> {
    const user = await Database.prisma.user.findUnique({
      where: { id: userId },
      select: { customPermissions: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const currentPermissions: string[] = user.customPermissions
      ? JSON.parse(user.customPermissions)
      : []

    const filteredPermissions = currentPermissions.filter(p => p !== permission)

    await Database.prisma.user.update({
      where: { id: userId },
      data: {
        customPermissions: JSON.stringify(filteredPermissions),
      },
    })
  }

  /**
   * Get all custom permissions for a user
   */
  static async getUserCustomPermissions(userId: number): Promise<string[]> {
    const user = await Database.prisma.user.findUnique({
      where: { id: userId },
      select: { customPermissions: true },
    })

    if (!user || !user.customPermissions) {
      return []
    }

    return JSON.parse(user.customPermissions)
  }
}
