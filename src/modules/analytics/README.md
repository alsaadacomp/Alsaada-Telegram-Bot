# 📊 Analytics & Reports Module

A simplified yet powerful analytics and reporting system for tracking metrics, generating reports, and analyzing data.

## ✨ Features

### 📈 Metric Tracking
- **Counters** - Track incremental values
- **Gauges** - Monitor current values
- **Rates** - Calculate rates over time
- **Aggregations** - Sum, average, min, max, median, percentiles

### 📋 Report Generation
- **Multiple Formats** - JSON, CSV, HTML, Markdown
- **Time Ranges** - Flexible date ranges
- **Metric Queries** - Filter and aggregate data
- **Automatic Summaries** - Stats and trends

### 👥 User Analytics
- Session tracking
- Event counting
- Activity days
- Engagement scores
- Retention rates

### 🔔 Notification Analytics
- Delivery rates
- Sending patterns (by hour)
- Type and priority distribution
- Top recipients

## 🚀 Quick Start

### Register Metrics

```typescript
import { AnalyticsService } from './modules/analytics/index.js'

const analytics = new AnalyticsService()

// Register metrics
analytics.registerMetric({
  id: 'total_users',
  name: 'Total Users',
  type: 'counter',
  category: 'user',
  description: 'Total number of registered users',
})

analytics.registerMetric({
  id: 'active_sessions',
  name: 'Active Sessions',
  type: 'gauge',
  category: 'system',
})
```

### Track Data

```typescript
// Increment counter
analytics.increment('total_users')

// Set gauge value
analytics.gauge('active_sessions', 42)

// Track with metadata
analytics.track('page_views', 1, {
  page: '/dashboard',
  userId: 123,
})

// Track events
analytics.trackEvent('user.login', { userId: 123 })
analytics.trackEvent('notification.sent', {
  type: 'announcement',
  priority: 'normal',
  userId: 123,
})
```

### Query Metrics

```typescript
const result = analytics.query({
  metricId: 'total_users',
  timeRange: {
    start: new Date('2025-01-01'),
    end: new Date('2025-01-31'),
  },
  aggregation: 'sum',
})

console.log(result.summary)
// {
//   total: 150,
//   average: 5,
//   min: 0,
//   max: 20,
//   count: 30,
//   trend: 'up'
// }
```

### Generate Reports

```typescript
const report = await analytics.generateReport({
  id: 'monthly_report',
  name: 'Monthly Analytics Report',
  description: 'Complete analytics for January 2025',
  metrics: ['total_users', 'active_sessions', 'page_views'],
  timeRange: {
    start: new Date('2025-01-01'),
    end: new Date('2025-01-31'),
  },
  format: 'html',
})

console.log(report.status) // 'completed'
console.log(report.metrics.length) // 3
```

### Export Reports

```typescript
// Export as JSON
const json = analytics.exportReport('monthly_report', 'json')

// Export as CSV
const csv = analytics.exportReport('monthly_report', 'csv')

// Export as HTML
const html = analytics.exportReport('monthly_report', 'html')

// Export as Markdown
const md = analytics.exportReport('monthly_report', 'markdown')
```

### User Analytics

```typescript
const userStats = analytics.getUserAnalytics(123, {
  start: new Date('2025-01-01'),
  end: new Date('2025-01-31'),
})

console.log(userStats)
// {
//   userId: 123,
//   totalSessions: 25,
//   totalEvents: 150,
//   firstSeen: Date,
//   lastSeen: Date,
//   averageSessionDuration: 300, // seconds
//   activityDays: 20,
//   engagementScore: 85,
//   retentionRate: 100
// }
```

### Notification Analytics

```typescript
const notifStats = analytics.getNotificationAnalytics({
  start: new Date('2025-01-01'),
  end: new Date('2025-01-31'),
})

console.log(notifStats)
// {
//   totalSent: 1000,
//   totalDelivered: 950,
//   totalFailed: 50,
//   deliveryRate: 95,
//   byType: { announcement: 500, alert: 300, ... },
//   byPriority: { normal: 700, important: 200, ... },
//   byHour: [10, 25, 40, ...], // 24 values
//   topRecipients: [{ userId: 123, count: 50 }, ...]
// }
```

### Analytics Summary

```typescript
const summary = analytics.getSummary('month', {
  start: new Date('2025-01-01'),
  end: new Date('2025-01-31'),
})

console.log(summary)
// {
//   period: 'month',
//   timeRange: { start: Date, end: Date },
//   totalMetrics: 5,
//   totalEvents: 2500,
//   activeUsers: 150,
//   newUsers: 25,
//   topMetrics: [
//     { metricId: 'total_users', value: 200 },
//     ...
//   ],
//   trends: {
//     total_users: 'up',
//     active_sessions: 'stable',
//     ...
//   }
// }
```

## 📊 Metric Types

### Counter
Tracks cumulative values that only increase.

```typescript
analytics.registerMetric({
  id: 'total_orders',
  type: 'counter',
  // ...
})

analytics.increment('total_orders') // +1
analytics.increment('total_orders', 5) // +5
```

### Gauge
Tracks current value that can go up or down.

```typescript
analytics.registerMetric({
  id: 'active_connections',
  type: 'gauge',
  // ...
})

analytics.gauge('active_connections', 42)
analytics.gauge('active_connections', 38)
```

### Rate
Calculates rate of change over time.

```typescript
analytics.registerMetric({
  id: 'requests_per_second',
  type: 'rate',
  // ...
})

analytics.track('requests_per_second', 100)
```

## 📋 Report Formats

### JSON
```typescript
const json = analytics.exportReport('report_id', 'json')
// Full structured data
```

### CSV
```typescript
const csv = analytics.exportReport('report_id', 'csv')
// Metric ID,Timestamp,Value,Total,Average,Min,Max
// total_users,2025-01-15T10:00:00Z,5,150,5,0,20
```

### HTML
```typescript
const html = analytics.exportReport('report_id', 'html')
// Beautiful HTML report with tables and styling
```

### Markdown
```typescript
const md = analytics.exportReport('report_id', 'markdown')
// # Monthly Report
// ## Summary
// ...
```

## 🎯 Use Cases

### 1. Dashboard Metrics
```typescript
// Track real-time system metrics
analytics.gauge('cpu_usage', cpuPercent)
analytics.gauge('memory_usage', memoryMB)
analytics.gauge('active_users_now', userCount)
```

### 2. Business Metrics
```typescript
// Track business KPIs
analytics.increment('total_revenue', orderAmount)
analytics.increment('new_customers')
analytics.track('average_order_value', orderAmount)
```

### 3. Performance Monitoring
```typescript
// Track application performance
analytics.track('api_response_time', responseMs)
analytics.increment('api_errors')
analytics.gauge('database_connections', connCount)
```

### 4. User Behavior
```typescript
// Track user actions
analytics.trackEvent('page.view', { page: '/dashboard', userId })
analytics.trackEvent('button.click', { button: 'submit', userId })
analytics.trackEvent('feature.used', { feature: 'export', userId })
```

## 🔧 Advanced Features

### Aggregations

```typescript
const metric = analytics.getMetric('total_users')

// Different aggregation functions
const sum = metric?.aggregate('sum')
const avg = metric?.aggregate('avg')
const min = metric?.aggregate('min')
const max = metric?.aggregate('max')
const median = metric?.aggregate('median')
const p95 = metric?.aggregate('percentile') // 95th percentile
```

### Grouping by Period

```typescript
const metric = analytics.getMetric('page_views')
const grouped = metric?.groupByPeriod('day')

// Returns Map<string, MetricDataPoint[]>
// '2025-01-01' => [...]
// '2025-01-02' => [...]
```

### Filtering

```typescript
const metric = analytics.getMetric('page_views')
const dashboardViews = metric?.filterByMetadata('page', '/dashboard')
```

### Trends

```typescript
const metric = analytics.getMetric('total_users')
const trend = metric?.calculateTrend() // 'up' | 'down' | 'stable'
```

## 💡 Best Practices

1. **Register metrics on startup**
   ```typescript
   // Initialize all metrics when app starts
   const metrics = [
     { id: 'users', name: 'Users', type: 'counter', category: 'user' },
     // ...
   ]
   metrics.forEach(m => analytics.registerMetric(m))
   ```

2. **Use meaningful metric IDs**
   ```typescript
   // ✅ Good
   'total_active_users'
   'notification_delivery_rate'

   // ❌ Bad
   'metric1'
   'temp'
   ```

3. **Track events consistently**
   ```typescript
   // Use standard event naming
   'user.login'
   'user.logout'
   'notification.sent'
   'notification.delivered'
   ```

4. **Generate reports regularly**
   ```typescript
   // Daily reports
   setInterval(async () => {
     await analytics.generateReport(dailyReportConfig)
   }, 24 * 60 * 60 * 1000)
   ```

5. **Clean old data periodically**
   ```typescript
   // Clear old metric data
   analytics.clearMetric('old_metric_id')
   ```

## 🧪 Testing

```bash
npm test tests/modules/analytics/
```

## 📚 Further Reading

- [Complete Documentation](../../docs/ANALYTICS-MODULE.md)
- [Examples](../../examples/analytics/)
- [Tests](../../tests/modules/analytics/)

---

**Happy Analyzing! 📊**
