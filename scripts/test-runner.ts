#!/usr/bin/env node

/**
 * Test Runner Script
 * Runs different test suites with proper configuration
 */

import { spawn } from 'node:child_process'
import process from 'node:process'

const args = process.argv.slice(2)
const command = args[0] || 'all'

const testSuites = {
  all: ['npm', 'test'],
  unit: ['npm', 'test', '--', 'tests/modules'],
  integration: ['npm', 'test', '--', 'tests/integration'],
  e2e: ['npm', 'test', '--', 'tests/e2e'],
  performance: ['npm', 'test', '--', 'tests/performance'],
  coverage: ['npm', 'run', 'test:coverage'],
  watch: ['npm', 'run', 'test:watch'],
}

function runCommand(cmd: string[]) {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code)
      }
      else {
        reject(new Error(`Command failed with code ${code}`))
      }
    })

    child.on('error', reject)
  })
}

async function main() {
  console.log('🧪 Test Runner\n')

  if (command === 'help') {
    console.log('Available commands:')
    console.log('  all         - Run all tests (default)')
    console.log('  unit        - Run unit tests only')
    console.log('  integration - Run integration tests only')
    console.log('  e2e         - Run E2E tests only')
    console.log('  performance - Run performance tests only')
    console.log('  coverage    - Run tests with coverage report')
    console.log('  watch       - Run tests in watch mode')
    console.log('  help        - Show this help message')
    return
  }

  const suite = testSuites[command as keyof typeof testSuites]
  
  if (!suite) {
    console.error(`❌ Unknown command: ${command}`)
    console.error('Run "npm run test:runner help" for available commands')
    process.exit(1)
  }

  console.log(`Running: ${suite.join(' ')}\n`)

  try {
    await runCommand(suite)
    console.log('\n✅ Tests completed successfully!')
  }
  catch (error) {
    console.error('\n❌ Tests failed!')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error)
  process.exit(1)
})
