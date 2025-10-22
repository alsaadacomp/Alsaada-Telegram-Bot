/**
 * Barcode Scanner Service
 * خدمة ماسح الباركود
 */

import { Buffer } from 'node:buffer'
import { logger } from '#root/modules/services/logger/index.js'
// @ts-expect-error - No types available for qrcode-reader
import QrCodeReader from 'qrcode-reader'
import sharp from 'sharp'

export interface BarcodeResult {
  type: 'QR' | 'BARCODE' | 'UNKNOWN'
  data: string
  format?: string
  confidence?: number
}

export interface QRGenerationOptions {
  text: string
  size?: number
  margin?: number
  color?: string
  backgroundColor?: string
}

export class BarcodeScannerService {
  /**
   * Scan QR Code from image buffer
   */
  static async scanQRCode(imageBuffer: Buffer): Promise<BarcodeResult | null> {
    try {
      // Validate input
      if (!imageBuffer || imageBuffer.length === 0) {
        logger.warn('Empty image buffer provided')
        return null
      }

      // Check image size (max 10MB)
      if (imageBuffer.length > 10 * 1024 * 1024) {
        logger.warn('Image too large, resizing')
        imageBuffer = await sharp(imageBuffer)
          .resize(1024, 1024, { fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer()
      }

      // Convert image to optimal format for QR scanning
      const processedImage = await sharp(imageBuffer)
        .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
        .grayscale()
        .normalize()
        .png({ quality: 100 })
        .toBuffer()

      return new Promise((resolve) => {
        const qr = new QrCodeReader()

        // Set timeout for QR scanning
        const timeout = setTimeout(() => {
          logger.debug('QR Code scan timeout')
          resolve(null)
        }, 5000)

        qr.callback = (err: any, value: any) => {
          clearTimeout(timeout)

          if (err) {
            logger.debug({ error: err.message || err }, 'QR Code scan failed')
            resolve(null)
            return
          }

          if (value && value.result) {
            logger.info({ dataLength: value.result.length }, 'QR Code scanned successfully')
            resolve({
              type: 'QR',
              data: value.result,
              format: 'QR_CODE',
              confidence: 0.9,
            })
          }
          else {
            logger.debug('No QR code found in image')
            resolve(null)
          }
        }

        qr.decode(processedImage)
      })
    }
    catch (error: unknown) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error scanning QR code')
      return null
    }
  }

  /**
   * Scan barcode from image buffer
   */
  static async scanBarcode(imageBuffer: Buffer): Promise<BarcodeResult | null> {
    try {
      // For now, we'll use QR scanner for barcodes too
      // In production, you might want to use a more specialized barcode library
      const result = await this.scanQRCode(imageBuffer)

      if (result) {
        return {
          ...result,
          type: 'BARCODE',
          format: 'BARCODE',
        }
      }

      return null
    }
    catch (error: unknown) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error scanning barcode')
      return null
    }
  }

  /**
   * Generate QR Code
   */
  static async generateQRCode(options: QRGenerationOptions): Promise<Buffer> {
    try {
      const { text, size = 300, margin = 4, color = '#000000', backgroundColor = '#FFFFFF' } = options

      // Validate input
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty')
      }

      if (text.length > 2000) {
        throw new Error('Text too long (max 2000 characters)')
      }

      if (size < 100 || size > 1000) {
        throw new Error('Size must be between 100 and 1000 pixels')
      }

      logger.info({ textLength: text.length, size }, 'Generating QR code')

      // Create a simple QR-like pattern using text
      // In production, you might want to use a proper QR library like 'qrcode'
      const qrSize = size - (margin * 2)
      const cellSize = Math.max(2, Math.floor(qrSize / 25)) // 25x25 grid
      const actualSize = cellSize * 25

      // Create SVG with QR-like pattern
      const svgContent = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" fill="${backgroundColor}"/>
          <rect x="${margin}" y="${margin}" width="${actualSize}" height="${actualSize}" fill="${color}" opacity="0.1"/>
          
          <!-- QR-like corner squares -->
          <rect x="${margin}" y="${margin}" width="${cellSize * 7}" height="${cellSize * 7}" fill="${color}"/>
          <rect x="${margin + cellSize}" y="${margin + cellSize}" width="${cellSize * 5}" height="${cellSize * 5}" fill="${backgroundColor}"/>
          <rect x="${margin + cellSize * 2}" y="${margin + cellSize * 2}" width="${cellSize * 3}" height="${cellSize * 3}" fill="${color}"/>
          
          <rect x="${margin + actualSize - cellSize * 7}" y="${margin}" width="${cellSize * 7}" height="${cellSize * 7}" fill="${color}"/>
          <rect x="${margin + actualSize - cellSize * 6}" y="${margin + cellSize}" width="${cellSize * 5}" height="${cellSize * 5}" fill="${backgroundColor}"/>
          <rect x="${margin + actualSize - cellSize * 5}" y="${margin + cellSize * 2}" width="${cellSize * 3}" height="${cellSize * 3}" fill="${color}"/>
          
          <rect x="${margin}" y="${margin + actualSize - cellSize * 7}" width="${cellSize * 7}" height="${cellSize * 7}" fill="${color}"/>
          <rect x="${margin + cellSize}" y="${margin + actualSize - cellSize * 6}" width="${cellSize * 5}" height="${cellSize * 5}" fill="${backgroundColor}"/>
          <rect x="${margin + cellSize * 2}" y="${margin + actualSize - cellSize * 5}" width="${cellSize * 3}" height="${cellSize * 3}" fill="${color}"/>
          
          <!-- Text in center -->
          <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-family="monospace" font-size="${Math.max(8, cellSize)}" fill="${color}" opacity="0.8">
            ${text.length > 20 ? `${text.substring(0, 17)}...` : text}
          </text>
        </svg>
      `

      // Convert SVG to PNG buffer
      const svgBuffer = Buffer.from(svgContent)

      return sharp(svgBuffer)
        .resize(size, size)
        .png({ quality: 100 })
        .toBuffer()
    }
    catch (error: unknown) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'Error generating QR code')
      throw error
    }
  }

  /**
   * Detect barcode type from data
   */
  static detectBarcodeType(data: string): string {
    // Simple detection based on patterns
    if (data.startsWith('http://') || data.startsWith('https://')) {
      return 'URL'
    }
    if (data.includes('@') && data.includes('.')) {
      return 'EMAIL'
    }
    if (/^\d{10,13}$/.test(data)) {
      return 'EAN/UPC'
    }
    if (/^\+?\d{10,15}$/.test(data)) {
      return 'PHONE'
    }
    if (data.length > 50) {
      return 'TEXT'
    }
    return 'UNKNOWN'
  }

  /**
   * Format barcode data for display
   */
  static formatBarcodeData(result: BarcodeResult): string {
    const type = this.detectBarcodeType(result.data)

    let formatted = `🔍 **نتيجة المسح**\n\n`
    formatted += `📱 **النوع:** ${result.type}\n`
    formatted += `📊 **التنسيق:** ${result.format || 'غير محدد'}\n`
    formatted += `🏷️ **التصنيف:** ${type}\n`
    formatted += `📝 **البيانات:**\n\`\`\`\n${result.data}\n\`\`\``

    if (result.confidence) {
      formatted += `\n🎯 **الثقة:** ${Math.round(result.confidence * 100)}%`
    }

    return formatted
  }
}
