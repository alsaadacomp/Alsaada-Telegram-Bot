/**
 * Tests for NotificationTemplateBuilder class
 */

import { describe, expect, test } from '@jest/globals'
import { NotificationTemplateBuilder } from '../../../src/modules/notifications/core/notification-template.js'

describe('NotificationTemplateBuilder', () => {
  describe('Constructor and Basic Properties', () => {
    test('should create template with basic info', () => {
      const template = new NotificationTemplateBuilder(
        'welcome',
        'Welcome Template',
        'Welcome {{name}}!',
      )

      expect(template.getId()).toBe('welcome')
      expect(template.getName()).toBe('Welcome Template')
      expect(template.getMessage()).toBe('Welcome {{name}}!')
    })

    test('should have default type and priority', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Message',
      )

      const built = template.build()
      expect(built.type).toBe('info')
      expect(built.priority).toBe('normal')
    })

    test('should have creation and update dates', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
      const built = template.build()

      expect(built.createdAt).toBeInstanceOf(Date)
      expect(built.updatedAt).toBeInstanceOf(Date)
    })
  })

  describe('Fluent API', () => {
    test('should set type', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .setType('success')

      expect(template.build().type).toBe('success')
    })

    test('should set priority', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .setPriority('urgent')

      expect(template.build().priority).toBe('urgent')
    })

    test('should add variable', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .addVariable('name')
        .addVariable('age')

      const variables = template.getVariables()
      expect(variables).toContain('name')
      expect(variables).toContain('age')
      expect(variables).toHaveLength(2)
    })

    test('should not add duplicate variables', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .addVariable('name')
        .addVariable('name')

      expect(template.getVariables()).toHaveLength(1)
    })

    test('should set variables', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .setVariables(['var1', 'var2', 'var3'])

      const variables = template.getVariables()
      expect(variables).toEqual(['var1', 'var2', 'var3'])
    })

    test('should add button', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .addButton({ text: 'Click me', url: 'https://example.com' })

      const buttons = template.getButtons()
      expect(buttons).toHaveLength(1)
      expect(buttons[0].text).toBe('Click me')
    })

    test('should set buttons', () => {
      const buttons = [
        { text: 'Button 1', url: 'url1' },
        { text: 'Button 2', callbackData: 'data2' },
      ]
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .setButtons(buttons)

      expect(template.getButtons()).toEqual(buttons)
    })

    test('should chain methods', () => {
      const template = new NotificationTemplateBuilder('test', 'Test', 'Message')
        .setType('success')
        .setPriority('important')
        .addVariable('name')
        .addButton({ text: 'OK', url: 'url' })

      const built = template.build()
      expect(built.type).toBe('success')
      expect(built.priority).toBe('important')
      expect(built.variables).toContain('name')
      expect(built.buttons).toHaveLength(1)
    })
  })

  describe('Auto-detect Variables', () => {
    test('should detect single variable', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Hello {{name}}!',
      ).autoDetectVariables()

      expect(template.getVariables()).toEqual(['name'])
    })

    test('should detect multiple variables', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Hello {{firstName}} {{lastName}}, you are {{age}} years old',
      ).autoDetectVariables()

      const variables = template.getVariables()
      expect(variables).toContain('firstName')
      expect(variables).toContain('lastName')
      expect(variables).toContain('age')
      expect(variables).toHaveLength(3)
    })

    test('should detect duplicate variables only once', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        '{{name}} is {{name}}',
      ).autoDetectVariables()

      expect(template.getVariables()).toEqual(['name'])
    })

    test('should detect no variables when none present', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Static message',
      ).autoDetectVariables()

      expect(template.getVariables()).toHaveLength(0)
    })

    test('should handle complex variable patterns', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'User: {{userName123}}, ID: {{user_id}}, Value: {{value1}}',
      ).autoDetectVariables()

      const variables = template.getVariables()
      expect(variables).toContain('userName123')
      expect(variables).toContain('user_id')
      expect(variables).toContain('value1')
    })
  })

  describe('Render Template', () => {
    test('should render template with single variable', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Hello {{name}}!',
      )

      const rendered = template.render({ name: 'John' })
      expect(rendered).toBe('Hello John!')
    })

    test('should render template with multiple variables', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        '{{firstName}} {{lastName}} is {{age}} years old',
      )

      const rendered = template.render({
        firstName: 'John',
        lastName: 'Doe',
        age: 30,
      })
      expect(rendered).toBe('John Doe is 30 years old')
    })

    test('should handle missing variables', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Hello {{name}}!',
      )

      const rendered = template.render({})
      expect(rendered).toBe('Hello {{name}}!')
    })

    test('should render with boolean values', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Active: {{isActive}}',
      )

      const rendered = template.render({ isActive: true })
      expect(rendered).toBe('Active: true')
    })

    test('should render with date values', () => {
      const date = new Date('2025-01-01')
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Date: {{date}}',
      )

      const rendered = template.render({ date })
      expect(rendered).toContain('2025')
    })

    test('should replace all occurrences of variable', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        '{{name}} loves {{name}}',
      )

      const rendered = template.render({ name: 'John' })
      expect(rendered).toBe('John loves John')
    })
  })

  describe('Validate Variables', () => {
    test('should validate when all variables provided', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Hello {{name}}!',
      ).autoDetectVariables()

      const result = template.validateVariables({ name: 'John' })
      expect(result.valid).toBe(true)
      expect(result.missing).toHaveLength(0)
    })

    test('should fail validation when variables missing', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        '{{firstName}} {{lastName}}',
      ).autoDetectVariables()

      const result = template.validateVariables({ firstName: 'John' })
      expect(result.valid).toBe(false)
      expect(result.missing).toContain('lastName')
    })

    test('should validate with manually set variables', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Message',
      ).setVariables(['name', 'age'])

      const result1 = template.validateVariables({ name: 'John', age: 30 })
      expect(result1.valid).toBe(true)

      const result2 = template.validateVariables({ name: 'John' })
      expect(result2.valid).toBe(false)
      expect(result2.missing).toEqual(['age'])
    })

    test('should validate when no variables required', () => {
      const template = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Static message',
      )

      const result = template.validateVariables({})
      expect(result.valid).toBe(true)
    })
  })

  describe('Create Notification', () => {
    test('should create notification from template', () => {
      const template = new NotificationTemplateBuilder(
        'welcome',
        'Welcome',
        'Welcome {{name}}!',
      )
        .setType('success')
        .setPriority('important')
        .addButton({ text: 'Start', url: 'start' })

      const notification = template.createNotification({ name: 'John' })

      expect(notification.getMessage()).toBe('Welcome John!')
      expect(notification.getType()).toBe('success')
      expect(notification.getPriority()).toBe('important')
      expect(notification.getButtons()).toHaveLength(1)
    })

    test('should create notification without variables', () => {
      const template = new NotificationTemplateBuilder(
        'info',
        'Info',
        'Static message',
      )

      const notification = template.createNotification()
      expect(notification.getMessage()).toBe('Static message')
    })

    test('should add template metadata to notification', () => {
      const template = new NotificationTemplateBuilder(
        'welcome',
        'Welcome Template',
        'Message',
      )

      const notification = template.createNotification()
      expect(notification.getMetadata('templateId')).toBe('welcome')
      expect(notification.getMetadata('templateName')).toBe('Welcome Template')
    })
  })

  describe('Clone Template', () => {
    test('should clone template with same ID and name', () => {
      const original = new NotificationTemplateBuilder(
        'test',
        'Test',
        'Message {{name}}',
      )
        .setType('success')
        .setPriority('urgent')
        .setVariables(['name'])

      const clone = original.clone()

      expect(clone.getId()).toBe(original.getId())
      expect(clone.getName()).toBe(original.getName())
      expect(clone.getMessage()).toBe(original.getMessage())
      expect(clone.getVariables()).toEqual(original.getVariables())
    })

    test('should clone template with new ID', () => {
      const original = new NotificationTemplateBuilder('test', 'Test', 'Message')
      const clone = original.clone('test2')

      expect(clone.getId()).toBe('test2')
      expect(clone.getName()).toBe('Test')
    })

    test('should clone template with new ID and name', () => {
      const original = new NotificationTemplateBuilder('test', 'Test', 'Message')
      const clone = original.clone('test2', 'Test 2')

      expect(clone.getId()).toBe('test2')
      expect(clone.getName()).toBe('Test 2')
    })
  })

  describe('Build Template', () => {
    test('should build complete template object', () => {
      const template = new NotificationTemplateBuilder(
        'welcome',
        'Welcome',
        'Hello {{name}}',
      )
        .setType('success')
        .setPriority('important')
        .setVariables(['name'])
        .addButton({ text: 'OK', url: 'ok' })

      const built = template.build()

      expect(built.id).toBe('welcome')
      expect(built.name).toBe('Welcome')
      expect(built.message).toBe('Hello {{name}}')
      expect(built.type).toBe('success')
      expect(built.priority).toBe('important')
      expect(built.variables).toEqual(['name'])
      expect(built.buttons).toHaveLength(1)
      expect(built.createdAt).toBeInstanceOf(Date)
      expect(built.updatedAt).toBeInstanceOf(Date)
    })
  })
})
