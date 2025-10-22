/**
 * Field Class Tests
 */

import type { FieldConfig } from '../../../../src/modules/interaction/forms/types.js'
import { Field } from '../../../../src/modules/interaction/forms/field.js'

describe('field Class', () => {
  describe('constructor and Basic Methods', () => {
    it('should create a field with valid configuration', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        required: true,
      }

      const field = new Field(config)

      expect(field.getName()).toBe('username')
      expect(field.getLabel()).toBe('Username')
      expect(field.isRequired()).toBe(true)
      expect(field.getValue()).toBeNull()
    })

    it('should initialize with default value', () => {
      const config: FieldConfig = {
        name: 'email',
        type: 'email' as any,
        label: 'Email',
        defaultValue: 'test@example.com',
      }

      const field = new Field(config)

      expect(field.getValue()).toBe('test@example.com')
    })

    it('should initialize as valid if not required', () => {
      const config: FieldConfig = {
        name: 'bio',
        type: 'text' as any,
        label: 'Bio',
        required: false,
      }

      const field = new Field(config)

      expect(field.isValid()).toBe(true)
    })

    it('should initialize as invalid if required with no default', () => {
      const config: FieldConfig = {
        name: 'name',
        type: 'text' as any,
        label: 'Name',
        required: true,
      }

      const field = new Field(config)

      expect(field.isValid()).toBe(false)
    })
  })

  describe('setValue and getValue', () => {
    it('should set and get value', () => {
      const config: FieldConfig = {
        name: 'age',
        type: 'number' as any,
        label: 'Age',
      }

      const field = new Field(config)
      field.setValue(25)

      expect(field.getValue()).toBe(25)
    })

    it('should mark field as dirty after setting value', () => {
      const config: FieldConfig = {
        name: 'name',
        type: 'text' as any,
        label: 'Name',
      }

      const field = new Field(config)
      const initialState = field.getState()

      expect(initialState.dirty).toBe(false)

      field.setValue('John')
      const newState = field.getState()

      expect(newState.dirty).toBe(true)
    })
  })

  describe('validation - Required Fields', () => {
    it('should fail validation when required field is empty', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        required: true,
      }

      const field = new Field(config)
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('required')
    })

    it('should pass validation when required field has value', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        required: true,
      }

      const field = new Field(config)
      field.setValue('john_doe')
      const result = field.validate()

      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should pass validation when optional field is empty', () => {
      const config: FieldConfig = {
        name: 'bio',
        type: 'text' as any,
        label: 'Bio',
        required: false,
      }

      const field = new Field(config)
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })
  })

  describe('validation - Email Type', () => {
    it('should validate correct email format', () => {
      const config: FieldConfig = {
        name: 'email',
        type: 'email' as any,
        label: 'Email',
        required: true,
      }

      const field = new Field(config)
      field.setValue('test@example.com')
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should reject invalid email format', () => {
      const config: FieldConfig = {
        name: 'email',
        type: 'email' as any,
        label: 'Email',
        required: true,
      }

      const field = new Field(config)
      field.setValue('invalid-email')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('email')
    })
  })

  describe('validation - Phone Type', () => {
    it('should validate correct phone format', () => {
      const config: FieldConfig = {
        name: 'phone',
        type: 'phone' as any,
        label: 'Phone',
        required: true,
      }

      const field = new Field(config)
      field.setValue('+1234567890')
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should accept phone with spaces and dashes', () => {
      const config: FieldConfig = {
        name: 'phone',
        type: 'phone' as any,
        label: 'Phone',
        required: true,
      }

      const field = new Field(config)
      field.setValue('+1 (234) 567-890')
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })
  })

  describe('validation - Number Type', () => {
    it('should validate valid number', () => {
      const config: FieldConfig = {
        name: 'age',
        type: 'number' as any,
        label: 'Age',
        required: true,
      }

      const field = new Field(config)
      field.setValue(25)
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should reject non-numeric value', () => {
      const config: FieldConfig = {
        name: 'age',
        type: 'number' as any,
        label: 'Age',
        required: true,
      }

      const field = new Field(config)
      field.setValue('not a number')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('number')
    })

    it('should validate minimum value', () => {
      const config: FieldConfig = {
        name: 'age',
        type: 'number' as any,
        label: 'Age',
        required: true,
        min: 18,
      }

      const field = new Field(config)
      field.setValue(15)
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('18')
    })

    it('should validate maximum value', () => {
      const config: FieldConfig = {
        name: 'age',
        type: 'number' as any,
        label: 'Age',
        required: true,
        max: 100,
      }

      const field = new Field(config)
      field.setValue(105)
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('100')
    })
  })

  describe('validation - Text Type', () => {
    it('should validate minimum length', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        required: true,
        minLength: 3,
      }

      const field = new Field(config)
      field.setValue('ab')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('3')
    })

    it('should validate maximum length', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        required: true,
        maxLength: 20,
      }

      const field = new Field(config)
      field.setValue('a'.repeat(25))
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('20')
    })
  })

  describe('validation - URL Type', () => {
    it('should validate correct URL', () => {
      const config: FieldConfig = {
        name: 'website',
        type: 'url' as any,
        label: 'Website',
        required: true,
      }

      const field = new Field(config)
      field.setValue('https://example.com')
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should reject invalid URL', () => {
      const config: FieldConfig = {
        name: 'website',
        type: 'url' as any,
        label: 'Website',
        required: true,
      }

      const field = new Field(config)
      field.setValue('not-a-url')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('URL')
    })

    it('should reject non-http(s) protocols', () => {
      const config: FieldConfig = {
        name: 'website',
        type: 'url' as any,
        label: 'Website',
        required: true,
      }

      const field = new Field(config)
      field.setValue('ftp://example.com')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('http')
    })
  })

  describe('validation - Select Type', () => {
    it('should validate valid selection', () => {
      const config: FieldConfig = {
        name: 'country',
        type: 'select' as any,
        label: 'Country',
        required: true,
        options: ['USA', 'UK', 'Canada'],
      }

      const field = new Field(config)
      field.setValue('USA')
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should reject invalid selection', () => {
      const config: FieldConfig = {
        name: 'country',
        type: 'select' as any,
        label: 'Country',
        required: true,
        options: ['USA', 'UK', 'Canada'],
      }

      const field = new Field(config)
      field.setValue('Germany')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('selection')
    })
  })

  describe('validation - Multi-Select Type', () => {
    it('should validate valid multi-selection', () => {
      const config: FieldConfig = {
        name: 'languages',
        type: 'multi_select' as any,
        label: 'Languages',
        required: true,
        options: ['English', 'Spanish', 'French'],
      }

      const field = new Field(config)
      field.setValue(['English', 'Spanish'])
      const result = field.validate()

      expect(result.isValid).toBe(true)
    })

    it('should reject invalid item in multi-selection', () => {
      const config: FieldConfig = {
        name: 'languages',
        type: 'multi_select' as any,
        label: 'Languages',
        required: true,
        options: ['English', 'Spanish', 'French'],
      }

      const field = new Field(config)
      field.setValue(['English', 'German'])
      const result = field.validate()

      expect(result.isValid).toBe(false)
    })

    it('should reject non-array value for multi-select', () => {
      const config: FieldConfig = {
        name: 'languages',
        type: 'multi_select' as any,
        label: 'Languages',
        required: true,
        options: ['English', 'Spanish', 'French'],
      }

      const field = new Field(config)
      field.setValue('English')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toContain('array')
    })
  })

  describe('custom Validator', () => {
    it('should use custom validator when provided', () => {
      const customValidator = (value: any) => {
        return value.length >= 5 && value.length <= 10
      }

      const config: FieldConfig = {
        name: 'code',
        type: 'text' as any,
        label: 'Code',
        required: true,
        validator: customValidator,
      }

      const field = new Field(config)
      field.setValue('abc')
      const result = field.validate()

      expect(result.isValid).toBe(false)
    })

    it('should use custom validator that returns ValidationResult', () => {
      const customValidator = (value: any) => {
        if (value.length < 5) {
          return { isValid: false, error: 'Code must be at least 5 characters' }
        }
        return { isValid: true, value }
      }

      const config: FieldConfig = {
        name: 'code',
        type: 'text' as any,
        label: 'Code',
        required: true,
        validator: customValidator,
      }

      const field = new Field(config)
      field.setValue('abc')
      const result = field.validate()

      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Code must be at least 5 characters')
    })
  })

  describe('reset Method', () => {
    it('should reset field to initial state', () => {
      const config: FieldConfig = {
        name: 'username',
        type: 'text' as any,
        label: 'Username',
        defaultValue: 'default',
      }

      const field = new Field(config)
      field.setValue('changed')
      field.setTouched(true)

      expect(field.getValue()).toBe('changed')
      expect(field.getState().touched).toBe(true)

      field.reset()

      expect(field.getValue()).toBe('default')
      expect(field.getState().touched).toBe(false)
      expect(field.getState().dirty).toBe(false)
    })
  })

  describe('toJSON Method', () => {
    it('should return field as JSON object', () => {
      const config: FieldConfig = {
        name: 'email',
        type: 'email' as any,
        label: 'Email',
        required: true,
      }

      const field = new Field(config)
      field.setValue('test@example.com')

      const json = field.toJSON()

      expect(json).toHaveProperty('config')
      expect(json).toHaveProperty('state')
      expect(json.config.name).toBe('email')
      expect(json.state.value).toBe('test@example.com')
    })
  })
})
