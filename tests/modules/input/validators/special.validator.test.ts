/**
 * Special Validators Tests
 */

import {
  extractIBANCountry,
  formatIBAN,
  isValidBase64,
  isValidCreditCard,
  isValidEgyptIBAN,
  isValidHexColor,
  isValidIBAN,
  isValidIPv4,
  isValidJSON,
  isValidMACAddress,
  isValidSaudiIBAN,
  isValidUrl,
  isValidUUID,
} from '../../../../src/modules/input/validators/special.validator.js'

describe('special Validators', () => {
  // ==================== isValidUrl ====================
  describe('isValidUrl', () => {
    it('should accept valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
      expect(isValidUrl('http://www.example.com')).toBe(true)
      expect(isValidUrl('https://sub.example.com/page')).toBe(true)
      expect(isValidUrl('https://example.com/path?query=value')).toBe(true)
    })

    it('should reject URLs without protocol', () => {
      expect(isValidUrl('example.com')).toBe(false)
      expect(isValidUrl('www.example.com')).toBe(false)
    })

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
      expect(isValidUrl('ftp://example.com')).toBe(false) // only http/https
    })

    it('should reject empty or null input', () => {
      expect(isValidUrl('')).toBe(false)
      expect(isValidUrl('   ')).toBe(false)
      expect(isValidUrl(null as any)).toBe(false)
    })

    it('should handle whitespace', () => {
      expect(isValidUrl('  https://example.com  ')).toBe(true)
    })
  })

  // ==================== isValidIBAN ====================
  describe('isValidIBAN', () => {
    it('should accept valid Saudi IBAN', () => {
      expect(isValidIBAN('SA0380000000608010167519')).toBe(true)
    })

    it('should accept valid Egyptian IBAN', () => {
      expect(isValidIBAN('EG380019000500000000263180002')).toBe(true)
    })

    it('should accept IBAN with spaces', () => {
      expect(isValidIBAN('SA03 8000 0000 6080 1016 7519')).toBe(true)
    })

    it('should accept IBAN with dashes', () => {
      expect(isValidIBAN('SA03-8000-0000-6080-1016-7519')).toBe(true)
    })

    it('should reject invalid IBAN', () => {
      expect(isValidIBAN('invalid')).toBe(false)
      expect(isValidIBAN('SA0000000000000000000000')).toBe(false)
    })

    it('should reject IBAN with invalid length', () => {
      expect(isValidIBAN('SA03')).toBe(false) // too short
      expect(isValidIBAN(`SA${'0'.repeat(50)}`)).toBe(false) // too long
    })

    it('should reject IBAN without country code', () => {
      expect(isValidIBAN('0380000000608010167519')).toBe(false)
    })

    it('should reject empty or null input', () => {
      expect(isValidIBAN('')).toBe(false)
      expect(isValidIBAN('   ')).toBe(false)
      expect(isValidIBAN(null as any)).toBe(false)
    })
  })

  // ==================== isValidSaudiIBAN ====================
  describe('isValidSaudiIBAN', () => {
    it('should accept valid Saudi IBAN', () => {
      expect(isValidSaudiIBAN('SA0380000000608010167519')).toBe(true)
    })

    it('should reject non-Saudi IBAN', () => {
      expect(isValidSaudiIBAN('EG380019000500000000263180002')).toBe(false)
    })

    it('should reject invalid Saudi IBAN', () => {
      expect(isValidSaudiIBAN('SA0000000000000000000000')).toBe(false)
    })
  })

  // ==================== isValidEgyptIBAN ====================
  describe('isValidEgyptIBAN', () => {
    it('should accept valid Egyptian IBAN', () => {
      expect(isValidEgyptIBAN('EG380019000500000000263180002')).toBe(true)
    })

    it('should reject non-Egyptian IBAN', () => {
      expect(isValidEgyptIBAN('SA0380000000608010167519')).toBe(false)
    })

    it('should reject invalid Egyptian IBAN', () => {
      expect(isValidEgyptIBAN('EG00000000000000000000000000000')).toBe(false)
    })
  })

  // ==================== extractIBANCountry ====================
  describe('extractIBANCountry', () => {
    it('should extract country code from IBAN', () => {
      expect(extractIBANCountry('SA0380000000608010167519')).toBe('SA')
      expect(extractIBANCountry('EG380019000500000000263180002')).toBe('EG')
    })

    it('should handle IBAN with spaces', () => {
      expect(extractIBANCountry('SA03 8000 0000 6080 1016 7519')).toBe('SA')
    })

    it('should return null for invalid IBAN', () => {
      expect(extractIBANCountry('invalid')).toBeNull()
    })
  })

  // ==================== formatIBAN ====================
  describe('formatIBAN', () => {
    it('should format IBAN with spaces every 4 characters', () => {
      expect(formatIBAN('SA0380000000608010167519')).toBe('SA03 8000 0000 6080 1016 7519')
      expect(formatIBAN('EG380019000500000000263180002')).toBe('EG38 0019 0005 0000 0000 2631 8000 2')
    })

    it('should handle already formatted IBAN', () => {
      expect(formatIBAN('SA03 8000 0000 6080 1016 7519')).toBe('SA03 8000 0000 6080 1016 7519')
    })

    it('should return null for invalid IBAN', () => {
      expect(formatIBAN('invalid')).toBeNull()
    })
  })

  // ==================== isValidIPv4 ====================
  describe('isValidIPv4', () => {
    it('should accept valid IPv4 addresses', () => {
      expect(isValidIPv4('192.168.1.1')).toBe(true)
      expect(isValidIPv4('255.255.255.0')).toBe(true)
      expect(isValidIPv4('0.0.0.0')).toBe(true)
      expect(isValidIPv4('10.0.0.1')).toBe(true)
    })

    it('should reject IPv4 with out-of-range values', () => {
      expect(isValidIPv4('256.1.1.1')).toBe(false)
      expect(isValidIPv4('1.256.1.1')).toBe(false)
      expect(isValidIPv4('1.1.256.1')).toBe(false)
      expect(isValidIPv4('1.1.1.256')).toBe(false)
    })

    it('should reject incomplete IPv4', () => {
      expect(isValidIPv4('192.168.1')).toBe(false)
      expect(isValidIPv4('192.168')).toBe(false)
      expect(isValidIPv4('192')).toBe(false)
    })

    it('should reject invalid format', () => {
      expect(isValidIPv4('invalid')).toBe(false)
      expect(isValidIPv4('192.168.1.1.1')).toBe(false)
    })

    it('should reject empty or null input', () => {
      expect(isValidIPv4('')).toBe(false)
      expect(isValidIPv4('   ')).toBe(false)
      expect(isValidIPv4(null as any)).toBe(false)
    })
  })

  // ==================== isValidMACAddress ====================
  describe('isValidMACAddress', () => {
    it('should accept valid MAC addresses with colons', () => {
      expect(isValidMACAddress('00:1B:44:11:3A:B7')).toBe(true)
      expect(isValidMACAddress('FF:FF:FF:FF:FF:FF')).toBe(true)
    })

    it('should accept valid MAC addresses with dashes', () => {
      expect(isValidMACAddress('00-1B-44-11-3A-B7')).toBe(true)
    })

    it('should accept valid MAC addresses without separators', () => {
      expect(isValidMACAddress('001B44113AB7')).toBe(true)
    })

    it('should reject invalid MAC addresses', () => {
      expect(isValidMACAddress('invalid')).toBe(false)
      expect(isValidMACAddress('00:1B:44:11:3A')).toBe(false) // too short
      expect(isValidMACAddress('GG:1B:44:11:3A:B7')).toBe(false) // invalid hex
    })

    it('should reject empty or null input', () => {
      expect(isValidMACAddress('')).toBe(false)
      expect(isValidMACAddress('   ')).toBe(false)
      expect(isValidMACAddress(null as any)).toBe(false)
    })
  })

  // ==================== isValidHexColor ====================
  describe('isValidHexColor', () => {
    it('should accept valid hex colors with #', () => {
      expect(isValidHexColor('#FF5733')).toBe(true)
      expect(isValidHexColor('#FFF')).toBe(true)
      expect(isValidHexColor('#000000')).toBe(true)
    })

    it('should accept valid hex colors without #', () => {
      expect(isValidHexColor('FF5733')).toBe(true)
      expect(isValidHexColor('FFF')).toBe(true)
    })

    it('should reject invalid hex colors', () => {
      expect(isValidHexColor('#GG5733')).toBe(false) // invalid hex
      expect(isValidHexColor('#FF57')).toBe(false) // wrong length
      expect(isValidHexColor('#FFFF')).toBe(false) // wrong length
    })

    it('should reject empty or null input', () => {
      expect(isValidHexColor('')).toBe(false)
      expect(isValidHexColor('   ')).toBe(false)
      expect(isValidHexColor(null as any)).toBe(false)
    })
  })

  // ==================== isValidUUID ====================
  describe('isValidUUID', () => {
    it('should accept valid UUID v4', () => {
      expect(isValidUUID('123e4567-e89b-42d3-a456-426614174000')).toBe(true)
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
    })

    it('should reject invalid UUID', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false)
      expect(isValidUUID('123e4567-e89b-12d3-a456')).toBe(false) // too short
      expect(isValidUUID('123e4567-e89b-52d3-a456-426614174000')).toBe(false) // wrong version
    })

    it('should reject empty or null input', () => {
      expect(isValidUUID('')).toBe(false)
      expect(isValidUUID('   ')).toBe(false)
      expect(isValidUUID(null as any)).toBe(false)
    })
  })

  // ==================== isValidJSON ====================
  describe('isValidJSON', () => {
    it('should accept valid JSON objects', () => {
      expect(isValidJSON('{"name": "test"}')).toBe(true)
      expect(isValidJSON('{"age": 25, "active": true}')).toBe(true)
    })

    it('should accept valid JSON arrays', () => {
      expect(isValidJSON('[1, 2, 3]')).toBe(true)
      expect(isValidJSON('["a", "b", "c"]')).toBe(true)
    })

    it('should accept valid JSON primitives', () => {
      expect(isValidJSON('true')).toBe(true)
      expect(isValidJSON('false')).toBe(true)
      expect(isValidJSON('null')).toBe(true)
      expect(isValidJSON('123')).toBe(true)
      expect(isValidJSON('"string"')).toBe(true)
    })

    it('should reject invalid JSON', () => {
      expect(isValidJSON('invalid json')).toBe(false)
      expect(isValidJSON('{name: "test"}')).toBe(false) // unquoted key
      expect(isValidJSON('{\'name\': \'test\'}')).toBe(false) // single quotes
    })

    it('should reject empty or null input', () => {
      expect(isValidJSON('')).toBe(false)
      expect(isValidJSON('   ')).toBe(false)
      expect(isValidJSON(null as any)).toBe(false)
    })
  })

  // ==================== isValidBase64 ====================
  describe('isValidBase64', () => {
    it('should accept valid Base64 strings', () => {
      expect(isValidBase64('SGVsbG8gV29ybGQh')).toBe(true)
      expect(isValidBase64('dGVzdA==')).toBe(true)
      expect(isValidBase64('YWJjZA==')).toBe(true)
    })

    it('should accept Base64 with proper length', () => {
      expect(isValidBase64('SGVsbG93')).toBe(true) // length multiple of 4
    })

    it('should reject invalid Base64', () => {
      expect(isValidBase64('invalid base64!')).toBe(false)
      expect(isValidBase64('SGVs@G8=')).toBe(false) // invalid character
    })

    it('should reject Base64 with wrong length', () => {
      expect(isValidBase64('SGV')).toBe(false) // not multiple of 4
    })

    it('should reject empty or null input', () => {
      expect(isValidBase64('')).toBe(false)
      expect(isValidBase64(null as any)).toBe(false)
    })
  })

  // ==================== isValidCreditCard ====================
  describe('isValidCreditCard', () => {
    it('should accept valid credit card numbers', () => {
      expect(isValidCreditCard('4532015112830366')).toBe(true) // Visa
      expect(isValidCreditCard('6011111111111117')).toBe(true) // Discover
      expect(isValidCreditCard('5555555555554444')).toBe(true) // Mastercard
    })

    it('should accept credit cards with spaces', () => {
      expect(isValidCreditCard('4532 0151 1283 0366')).toBe(true)
    })

    it('should accept credit cards with dashes', () => {
      expect(isValidCreditCard('4532-0151-1283-0366')).toBe(true)
    })

    it('should reject invalid credit card numbers', () => {
      expect(isValidCreditCard('1234567890123456')).toBe(false) // fails Luhn
      expect(isValidCreditCard('1111111111111111')).toBe(false) // fails Luhn
    })

    it('should reject credit cards with wrong length', () => {
      expect(isValidCreditCard('123456')).toBe(false) // too short
      expect(isValidCreditCard('12345678901234567890')).toBe(false) // too long
    })

    it('should reject credit cards with letters', () => {
      expect(isValidCreditCard('453201511283036A')).toBe(false)
    })

    it('should reject empty or null input', () => {
      expect(isValidCreditCard('')).toBe(false)
      expect(isValidCreditCard('   ')).toBe(false)
      expect(isValidCreditCard(null as any)).toBe(false)
    })
  })
})
