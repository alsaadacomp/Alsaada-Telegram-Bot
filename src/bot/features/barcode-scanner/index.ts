/**
 * Barcode Scanner Feature
 * ميزة ماسح الباركود
 */

import type { Context } from '#root/bot/context.js'
import { Composer } from 'grammy'
import { barcodeScannerConfig } from './config.js'
import { barcodeScannerHandler } from './handlers/scanner.js'

// Export config for feature registry
export { barcodeScannerConfig as config }

export const composer = new Composer<Context>()

// Register all handlers
composer.use(barcodeScannerHandler)
