/**
 * User Registration Form Example
 * Complete registration form with multiple field types
 */

import { FormBuilder } from '../../src/modules/interaction/forms/index.js'

// Create user registration form
export function createRegistrationForm() {
  return new FormBuilder('registration', 'User Registration')
    .setDescription('Create your account to get started')
    .addTextField('username', 'Username', {
      required: true,
      minLength: 3,
      maxLength: 20,
      placeholder: 'john_doe',
      description: '3-20 characters, letters and numbers only',
    })
    .addEmailField('email', 'Email Address', {
      required: true,
      placeholder: 'john@example.com',
      description: 'We will send you a confirmation email',
    })
    .addPasswordField('password', 'Password', {
      required: true,
      minLength: 8,
      maxLength: 50,
      description: 'At least 8 characters with uppercase, lowercase, and numbers',
    })
    .addTextField('fullName', 'Full Name', {
      required: true,
      minLength: 2,
      maxLength: 100,
      placeholder: 'John Doe',
    })
    .addPhoneField('phone', 'Phone Number', {
      required: true,
      placeholder: '+1234567890',
      description: 'Include country code',
    })
    .addDateField('birthdate', 'Date of Birth', {
      required: true,
      description: 'You must be 18 or older',
    })
    .addSelectField('gender', 'Gender', [
      'Male',
      'Female',
      'Other',
      'Prefer not to say',
    ], {
      required: false,
    })
    .addSelectField('country', 'Country', [
      'United States',
      'United Kingdom',
      'Canada',
      'Australia',
      'Germany',
      'France',
      'Other',
    ], {
      required: true,
    })
    .addMultiSelectField('interests', 'Interests (Select all that apply)', [
      'Technology',
      'Sports',
      'Music',
      'Art',
      'Travel',
      'Food',
      'Books',
      'Gaming',
    ], {
      required: false,
      defaultValue: [],
    })
    .addBooleanField('newsletter', 'Subscribe to newsletter', {
      required: false,
      defaultValue: true,
      description: 'Receive updates and special offers',
    })
    .addBooleanField('terms', 'I accept the Terms & Conditions', {
      required: true,
      description: 'You must accept to continue',
    })
    .onSubmit(async (data) => {
      // Validate age (18+)
      const birthdate = new Date(data.birthdate)
      const age = new Date().getFullYear() - birthdate.getFullYear()

      if (age < 18) {
        return {
          success: false,
          errors: {
            birthdate: 'You must be 18 or older to register',
          },
        }
      }

      // Validate terms acceptance
      if (!data.terms) {
        return {
          success: false,
          errors: {
            terms: 'You must accept the Terms & Conditions',
          },
        }
      }

      // In real application: hash password, save to database, send verification email
      console.log('👤 New user registration:')
      console.log({
        ...data,
        password: '[HIDDEN]', // Don't log passwords!
        registeredAt: new Date().toISOString(),
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      return {
        success: true,
        data: {
          userId: Math.random().toString(36).substr(2, 9),
          username: data.username,
          email: data.email,
          message: 'Registration successful! Please check your email to verify your account.',
        },
      }
    })
    .build()
}

// Usage Example
async function example() {
  const form = createRegistrationForm()

  // Fill form with sample data
  form.setData({
    username: 'john_doe',
    email: 'john@example.com',
    password: 'SecurePass123!',
    fullName: 'John Doe',
    phone: '+12345678900',
    birthdate: new Date('1990-01-15'),
    gender: 'Male',
    country: 'United States',
    interests: ['Technology', 'Sports', 'Gaming'],
    newsletter: true,
    terms: true,
  })

  // Validate
  if (form.validate()) {
    console.log('✅ Registration form is valid')

    // Submit
    const result = await form.submit()

    if (result.success) {
      console.log('✅ Registration successful!')
      console.log('User ID:', result.data?.userId)
      console.log('Message:', result.data?.message)
    }
    else {
      console.log('❌ Registration failed')
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, error]) => {
          console.log(`  - ${field}: ${error}`)
        })
      }
    }
  }
  else {
    console.log('❌ Form validation failed')
    const state = form.getState()
    state.errors.forEach((error, field) => {
      console.log(`  - ${field}: ${error}`)
    })
  }
}

// Uncomment to run
// example()
