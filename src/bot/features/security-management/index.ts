/**
 * Security Management Feature
 * ميزة إدارة الأمان
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { securityConfig } from './config.js'
import { securityHandler } from './handlers/security.js'

// Export config for feature registry
export { securityConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(securityHandler)
