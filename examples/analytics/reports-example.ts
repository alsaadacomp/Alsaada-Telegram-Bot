/**
 * Reports Example
 *
 * Demonstrates report generation and export.
 */

import { writeFileSync } from 'node:fs'
import { AnalyticsService } from '../../src/modules/analytics/index.js'

const analytics = new AnalyticsService()

async function main() {
  console.log('📋 Reports Example\n')

  // Setup metrics
  console.log('1. Setting up metrics...')
  analytics.registerMetric({
    id: 'revenue',
    name: 'Total Revenue',
    type: 'counter',
    category: 'business',
  })

  analytics.registerMetric({
    id: 'orders',
    name: 'Total Orders',
    type: 'counter',
    category: 'business',
  })

  // Track data
  analytics.track('revenue', 1000)
  analytics.track('revenue', 1500)
  analytics.track('revenue', 2000)
  analytics.increment('orders', 15)
  analytics.increment('orders', 20)
  console.log('   ✅ Data tracked\n')

  // Generate report
  console.log('2. Generating report...')
  const report = await analytics.generateReport({
    id: 'monthly_report',
    name: 'Monthly Business Report',
    description: 'Complete business analytics for the month',
    metrics: ['revenue', 'orders'],
    timeRange: {
      start: new Date(Date.now() - 30 * 86400000),
      end: new Date(),
    },
    format: 'json',
  })

  console.log(`   Status: ${report.status}`)
  console.log(`   Metrics: ${report.metrics.length}`)
  console.log('   ✅ Report generated\n')

  // Export in different formats
  console.log('3. Exporting report...\n')

  // JSON
  console.log('   Exporting as JSON...')
  const json = analytics.exportReport('monthly_report', 'json')
  writeFileSync('monthly-report.json', json)
  console.log('   ✅ Saved to monthly-report.json')

  // CSV
  console.log('   Exporting as CSV...')
  const csv = analytics.exportReport('monthly_report', 'csv')
  writeFileSync('monthly-report.csv', csv)
  console.log('   ✅ Saved to monthly-report.csv')

  // HTML
  console.log('   Exporting as HTML...')
  const html = analytics.exportReport('monthly_report', 'html')
  writeFileSync('monthly-report.html', html)
  console.log('   ✅ Saved to monthly-report.html')

  // Markdown
  console.log('   Exporting as Markdown...')
  const md = analytics.exportReport('monthly_report', 'markdown')
  writeFileSync('monthly-report.md', md)
  console.log('   ✅ Saved to monthly-report.md')

  console.log('\n4. Report Preview (Markdown):\n')
  console.log(`${md.substring(0, 500)}...`)

  console.log('\n✅ Example completed!')
  console.log('\n📁 Files created:')
  console.log('   - monthly-report.json')
  console.log('   - monthly-report.csv')
  console.log('   - monthly-report.html')
  console.log('   - monthly-report.md')
}

main().catch(console.error)
