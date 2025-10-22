/**
 * Form Builder Tests
 */

import { describe, expect, jest, test } from '@jest/globals'
import { FormBuilder } from '../../../../src/modules/interaction/forms/form-builder.js'

describe('FormBuilder Class', () => {
  describe('Constructor and Configuration', () => {
    test('should create form builder with id and title', () => {
      const builder = new FormBuilder('registration', 'User Registration')
      const config = builder.getConfig()

      expect(config.id).toBe('registration')
      expect(config.title).toBe('User Registration')
    })

    test('should set description', () => {
      const builder = new FormBuilder('test', 'Test Form')
        .setDescription('This is a test form')

      const config = builder.getConfig()

      expect(config.description).toBe('This is a test form')
    })
  })

  describe('Adding Fields - Fluent API', () => {
    test('should add text field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('username', 'Username', { required: true })

      const fields = builder.getFields()

      expect(fields).toHaveLength(1)
      expect(fields[0].getName()).toBe('username')
      expect(fields[0].getType()).toBe('text')
    })

    test('should add email field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addEmailField('email', 'Email Address', { required: true })

      const field = builder.getField('email')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('email')
    })

    test('should add phone field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addPhoneField('phone', 'Phone Number', { required: true })

      const field = builder.getField('phone')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('phone')
    })

    test('should add number field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addNumberField('age', 'Age', { required: true, min: 18, max: 100 })

      const field = builder.getField('age')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('number')
    })

    test('should add date field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addDateField('birthdate', 'Birth Date', { required: true })

      const field = builder.getField('birthdate')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('date')
    })

    test('should add select field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addSelectField('country', 'Country', ['USA', 'UK', 'Canada'])

      const field = builder.getField('country')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('select')
    })

    test('should add multi-select field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addMultiSelectField('languages', 'Languages', ['English', 'Spanish', 'French'])

      const field = builder.getField('languages')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('multi_select')
    })

    test('should add boolean field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addBooleanField('terms', 'Accept Terms', { required: true })

      const field = builder.getField('terms')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('boolean')
    })

    test('should add URL field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addUrlField('website', 'Website', { required: false })

      const field = builder.getField('website')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('url')
    })

    test('should add password field', () => {
      const builder = new FormBuilder('test', 'Test')
        .addPasswordField('password', 'Password', { required: true, minLength: 8 })

      const field = builder.getField('password')

      expect(field).toBeDefined()
      expect(field?.getType()).toBe('password')
    })
  })

  describe('Chaining Multiple Fields', () => {
    test('should chain multiple fields', () => {
      const builder = new FormBuilder('registration', 'User Registration')
        .addTextField('username', 'Username', { required: true })
        .addEmailField('email', 'Email', { required: true })
        .addPhoneField('phone', 'Phone', { required: false })
        .addNumberField('age', 'Age', { min: 18 })

      const fields = builder.getFields()

      expect(fields).toHaveLength(4)
      expect(fields[0].getName()).toBe('username')
      expect(fields[1].getName()).toBe('email')
      expect(fields[2].getName()).toBe('phone')
      expect(fields[3].getName()).toBe('age')
    })
  })

  describe('Form State Management', () => {
    test('should get initial form state', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: false })

      const state = builder.getState()

      expect(state.isValid).toBe(false) // required field is empty
      expect(state.isDirty).toBe(false)
      expect(state.isSubmitting).toBe(false)
    })

    test('should update state when field value is set', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })

      builder.setFieldValue('name', 'John Doe')
      const state = builder.getState()

      expect(state.isValid).toBe(true)
      expect(state.isDirty).toBe(true)
    })
  })

  describe('Get and Set Field Values', () => {
    test('should set and get field value', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('username', 'Username')

      builder.setFieldValue('username', 'john_doe')
      const field = builder.getField('username')

      expect(field?.getValue()).toBe('john_doe')
    })

    test('should get all form data', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name')
        .addEmailField('email', 'Email')

      builder.setFieldValue('name', 'John')
      builder.setFieldValue('email', 'john@example.com')

      const data = builder.getData()

      expect(data.name).toBe('John')
      expect(data.email).toBe('john@example.com')
    })

    test('should set form data from object', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name')
        .addEmailField('email', 'Email')
        .addNumberField('age', 'Age')

      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
      }

      builder.setData(data)

      expect(builder.getField('name')?.getValue()).toBe('John Doe')
      expect(builder.getField('email')?.getValue()).toBe('john@example.com')
      expect(builder.getField('age')?.getValue()).toBe(30)
    })
  })

  describe('Form Validation', () => {
    test('should validate form with all valid fields', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: true })

      builder.setFieldValue('name', 'John')
      builder.setFieldValue('email', 'john@example.com')

      const isValid = builder.validate()

      expect(isValid).toBe(true)
    })

    test('should fail validation with invalid fields', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: true })

      builder.setFieldValue('name', 'John')
      builder.setFieldValue('email', 'invalid-email')

      const isValid = builder.validate()

      expect(isValid).toBe(false)
    })

    test('should fail validation with empty required fields', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: true })

      const isValid = builder.validate()

      expect(isValid).toBe(false)
    })
  })

  describe('Form Submission', () => {
    test('should submit form with valid data', async () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: true })

      builder.setFieldValue('name', 'John')
      builder.setFieldValue('email', 'john@example.com')

      const result = await builder.submit()

      expect(result.success).toBe(true)
      expect(result.data).toEqual({
        name: 'John',
        email: 'john@example.com',
      })
    })

    test('should fail submission with invalid data', async () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .addEmailField('email', 'Email', { required: true })

      builder.setFieldValue('email', 'invalid-email')

      const result = await builder.submit()

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
    })

    test('should call custom submit handler', async () => {
      const mockSubmitHandler = jest.fn().mockResolvedValue({
        success: true,
        data: { message: 'Submitted!' },
      })

      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .onSubmit(mockSubmitHandler)

      builder.setFieldValue('name', 'John')
      const result = await builder.submit()

      expect(mockSubmitHandler).toHaveBeenCalledWith({ name: 'John' })
      expect(result.success).toBe(true)
    })
  })

  describe('Form Reset', () => {
    test('should reset all fields to initial state', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { defaultValue: 'Default' })
        .addEmailField('email', 'Email')

      builder.setFieldValue('name', 'Changed')
      builder.setFieldValue('email', 'test@example.com')

      builder.reset()

      expect(builder.getField('name')?.getValue()).toBe('Default')
      expect(builder.getField('email')?.getValue()).toBeNull()
      expect(builder.getState().isDirty).toBe(false)
    })
  })

  describe('Build Method', () => {
    test('should build and return Form instance', () => {
      const builder = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name')

      const form = builder.build()

      expect(form).toBeDefined()
      expect(form.getConfig().id).toBe('test')
      expect(form.getFields()).toHaveLength(1)
    })
  })

  describe('Form Instance Methods', () => {
    test('should access form configuration', () => {
      const form = new FormBuilder('test', 'Test Form')
        .setDescription('Test description')
        .build()

      const config = form.getConfig()

      expect(config.id).toBe('test')
      expect(config.title).toBe('Test Form')
      expect(config.description).toBe('Test description')
    })

    test('should access and modify field values', () => {
      const form = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name')
        .build()

      form.setFieldValue('name', 'John')

      expect(form.getField('name')?.getValue()).toBe('John')
    })

    test('should validate form through Form instance', () => {
      const form = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .build()

      expect(form.validate()).toBe(false)

      form.setFieldValue('name', 'John')

      expect(form.validate()).toBe(true)
    })

    test('should submit form through Form instance', async () => {
      const form = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { required: true })
        .build()

      form.setFieldValue('name', 'John')
      const result = await form.submit()

      expect(result.success).toBe(true)
    })

    test('should reset form through Form instance', () => {
      const form = new FormBuilder('test', 'Test')
        .addTextField('name', 'Name', { defaultValue: 'Default' })
        .build()

      form.setFieldValue('name', 'Changed')
      form.reset()

      expect(form.getField('name')?.getValue()).toBe('Default')
    })
  })

  describe('Complex Form Scenarios', () => {
    test('should handle multi-step registration form', () => {
      const form = new FormBuilder('registration', 'User Registration')
        .setDescription('Please fill out all fields')
        .addTextField('username', 'Username', { required: true, minLength: 3, maxLength: 20 })
        .addEmailField('email', 'Email Address', { required: true })
        .addPasswordField('password', 'Password', { required: true, minLength: 8 })
        .addPhoneField('phone', 'Phone Number', { required: true })
        .addDateField('birthdate', 'Birth Date', { required: true })
        .addSelectField('country', 'Country', ['USA', 'UK', 'Canada', 'Other'], { required: true })
        .addBooleanField('terms', 'Accept Terms & Conditions', { required: true })
        .build()

      const fields = form.getFields()

      expect(fields).toHaveLength(7)
      expect(form.getConfig().title).toBe('User Registration')
    })

    test('should handle contact form with optional fields', () => {
      const form = new FormBuilder('contact', 'Contact Us')
        .addTextField('name', 'Full Name', { required: true })
        .addEmailField('email', 'Email', { required: true })
        .addTextField('subject', 'Subject', { required: true })
        .addTextField('message', 'Message', { required: true, minLength: 10 })
        .addPhoneField('phone', 'Phone', { required: false })
        .addUrlField('website', 'Website', { required: false })
        .build()

      form.setData({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question',
        message: 'This is my question about your product.',
      })

      expect(form.validate()).toBe(true)
    })
  })
})
