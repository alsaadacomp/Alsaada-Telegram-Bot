/**
 * File Management Feature
 * ميزة إدارة الملفات
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { fileManagementConfig } from './config.js'
import { fileManagementHandler } from './handlers/files.js'

// Export config for feature registry
export { fileManagementConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(fileManagementHandler)
