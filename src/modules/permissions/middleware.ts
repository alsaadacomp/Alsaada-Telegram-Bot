/**
 * Permission Middleware
 *
 * Middleware for checking permissions in Grammy bot
 */

import type { Context } from '#root/bot/context.js'
import type { NextFunction } from 'grammy'
import type { Role } from '../../../generated/prisma/index.js'
import { PermissionService } from './permission-service.js'

/**
 * Middleware to check if user has required role(s)
 */
export function requireRole(...roles: Role[]) {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser) {
      await ctx.reply('⛔ يجب تسجيل الدخول أولاً')
      return
    }

    if (!PermissionService.hasAnyRole(ctx.dbUser, roles)) {
      await ctx.reply('⛔ ليس لديك صلاحية الوصول لهذه الميزة')
      return
    }

    await next()
  }
}

/**
 * Middleware to check if user has at least minimum role
 */
export function requireMinRole(minRole: Role) {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser) {
      await ctx.reply('⛔ يجب تسجيل الدخول أولاً')
      return
    }

    if (!PermissionService.hasMinRole(ctx.dbUser, minRole)) {
      await ctx.reply('⛔ ليس لديك صلاحية الوصول لهذه الميزة')
      return
    }

    await next()
  }
}

/**
 * Middleware to check if user has specific permission
 */
export function requirePermission(permission: string) {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser) {
      await ctx.reply('⛔ يجب تسجيل الدخول أولاً')
      return
    }

    if (!PermissionService.hasPermission(ctx.dbUser, permission)) {
      await ctx.reply('⛔ ليس لديك صلاحية تنفيذ هذا الإجراء')
      return
    }

    await next()
  }
}

/**
 * Middleware to check if user has any of the specified permissions
 */
export function requireAnyPermission(...permissions: string[]) {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser) {
      await ctx.reply('⛔ يجب تسجيل الدخول أولاً')
      return
    }

    if (!PermissionService.hasAnyPermission(ctx.dbUser, permissions)) {
      await ctx.reply('⛔ ليس لديك صلاحية تنفيذ هذا الإجراء')
      return
    }

    await next()
  }
}

/**
 * Middleware to check if user has all specified permissions
 */
export function requireAllPermissions(...permissions: string[]) {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser) {
      await ctx.reply('⛔ يجب تسجيل الدخول أولاً')
      return
    }

    if (!PermissionService.hasAllPermissions(ctx.dbUser, permissions)) {
      await ctx.reply('⛔ ليس لديك صلاحية تنفيذ هذا الإجراء')
      return
    }

    await next()
  }
}

/**
 * Middleware to block banned users
 */
export function blockBanned() {
  return async (ctx: Context, next: NextFunction) => {
    if (ctx.dbUser?.isBanned) {
      await ctx.reply('⛔ تم حظرك من استخدام البوت')
      return
    }

    await next()
  }
}

/**
 * Middleware to check if user is active
 */
export function requireActive() {
  return async (ctx: Context, next: NextFunction) => {
    if (!ctx.dbUser?.isActive) {
      await ctx.reply('⛔ حسابك غير نشط. تواصل مع الإدارة.')
      return
    }

    await next()
  }
}

/**
 * Middleware to load user permissions into context
 */
export function loadUserPermissions() {
  return async (ctx: Context, next: NextFunction) => {
    const from = ctx.from
    if (!from) {
      await next()
      return
    }

    try {
      // استخدم getUserContextByTelegramId بدلاً من getUserContext
      const user = await PermissionService.getUserContextByTelegramId(from.id)
      if (user) {
        ctx.dbUser = user
      }
    }
    catch (error) {
      console.error('Error loading user permissions:', error)
    }

    await next()
  }
}

/**
 * Middleware to require user is not banned
 */
export function requireNotBanned() {
  return async (ctx: Context, next: NextFunction) => {
    if (ctx.dbUser?.isBanned) {
      await ctx.reply('⛔ تم حظرك من استخدام البوت')
      return
    }

    await next()
  }
}

/**
 * Middleware to allow only guests
 */
export function requireGuest() {
  return async (ctx: Context, next: NextFunction) => {
    if (ctx.dbUser && ctx.dbUser.role !== 'GUEST') {
      await ctx.reply('⚠️ هذه الميزة متاحة فقط للزوار')
      return
    }

    await next()
  }
}
