/**
 * Basic Contact Form Example
 * Simple contact form with name, email, and message
 */

import { FormBuilder } from '../../src/modules/interaction/forms/index.js'

// Create a basic contact form
export function createContactForm() {
  return new FormBuilder('contact', 'Contact Us')
    .setDescription('We would love to hear from you!')
    .addTextField('name', 'Full Name', {
      required: true,
      minLength: 2,
      maxLength: 100,
      placeholder: 'John Doe',
      description: 'Enter your full name',
    })
    .addEmailField('email', 'Email Address', {
      required: true,
      placeholder: 'john@example.com',
      description: 'We will respond to this email',
    })
    .addTextField('subject', 'Subject', {
      required: true,
      minLength: 5,
      maxLength: 200,
      placeholder: 'Question about your service',
    })
    .addTextField('message', 'Message', {
      required: true,
      minLength: 10,
      maxLength: 1000,
      description: 'Please provide as much detail as possible',
    })
    .addPhoneField('phone', 'Phone Number (Optional)', {
      required: false,
      placeholder: '+1234567890',
    })
    .onSubmit(async (data) => {
      // In real application, send email or save to database
      console.log('📧 New contact form submission:')
      console.log(JSON.stringify(data, null, 2))

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        data: {
          ...data,
          submittedAt: new Date().toISOString(),
          id: Math.random().toString(36).substr(2, 9),
        },
      }
    })
    .build()
}

// Usage Example
async function example() {
  const form = createContactForm()

  // Fill form
  form.setData({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Question about your product',
    message: 'I am interested in learning more about your product features and pricing.',
  })

  // Validate
  if (form.validate()) {
    console.log('✅ Form is valid')

    // Submit
    const result = await form.submit()

    if (result.success) {
      console.log('✅ Form submitted successfully!')
      console.log('Response:', result.data)
    }
  }
  else {
    console.log('❌ Form has errors')
    const state = form.getState()
    state.errors.forEach((error, field) => {
      console.log(`  - ${field}: ${error}`)
    })
  }
}

// Uncomment to run
// example()
