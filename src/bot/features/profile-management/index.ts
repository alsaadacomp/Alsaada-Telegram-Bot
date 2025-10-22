/**
 * User Profile Feature
 * ميزة الملف الشخصي للمستخدمين
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { profileConfig } from './config.js'
import { profileHandler } from './handlers/profile.js'

// Export config for feature registry
export { profileConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(profileHandler)
