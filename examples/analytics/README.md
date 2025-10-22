# 📊 Analytics Module Examples

Practical examples demonstrating all features of the Analytics & Reports Module.

## 📋 Examples Overview

### 1. **basic-analytics.ts**
Learn the fundamentals of metric tracking and analytics.

**Topics Covered:**
- Registering metrics
- Tracking data (counters, gauges)
- Querying metrics
- Tracking events
- Getting analytics summary

**Run:**
```bash
npx tsx examples/analytics/basic-analytics.ts
```

---

### 2. **reports-example.ts**
Master report generation and export.

**Topics Covered:**
- Setting up metrics
- Generating reports
- Exporting in multiple formats (JSON, CSV, HTML, Markdown)
- Saving reports to files

**Run:**
```bash
npx tsx examples/analytics/reports-example.ts
```

**Output Files:**
- `monthly-report.json`
- `monthly-report.csv`
- `monthly-report.html`
- `monthly-report.md`

---

### 3. **user-analytics-example.ts**
Track and analyze user behavior.

**Topics Covered:**
- Tracking user sessions
- Recording user events
- Calculating engagement scores
- Analyzing user retention
- Getting user analytics

**Run:**
```bash
npx tsx examples/analytics/user-analytics-example.ts
```

---

### 4. **notification-analytics-example.ts**
Analyze notification performance and delivery.

**Topics Covered:**
- Tracking notification events
- Calculating delivery rates
- Analyzing sending patterns
- Identifying top recipients
- Generating notification reports

**Run:**
```bash
npx tsx examples/analytics/notification-analytics-example.ts
```

---

## 🚀 Quick Start

### Run All Examples

```bash
# Run each example
npx tsx examples/analytics/basic-analytics.ts
npx tsx examples/analytics/reports-example.ts
npx tsx examples/analytics/user-analytics-example.ts
npx tsx examples/analytics/notification-analytics-example.ts
```

---

## 📖 Learning Path

For best learning experience, follow this order:

1. **Start with `basic-analytics.ts`** - Learn metric tracking basics
2. **Then `reports-example.ts`** - Learn report generation
3. **Move to `user-analytics-example.ts`** - Learn user tracking
4. **Finally `notification-analytics-example.ts`** - Learn notification analytics

---

## 🎯 Key Concepts

### Metrics
Track quantitative data over time:
- **Counters** - Values that only increase
- **Gauges** - Values that can go up or down
- **Rates** - Calculate rates over time

### Events
Track discrete occurrences:
```typescript
analytics.trackEvent('user.login', { userId: 123 })
analytics.trackEvent('button.click', { button: 'submit' })
```

### Reports
Generate comprehensive reports:
- Multiple metrics
- Time ranges
- Multiple export formats
- Automatic summaries

### Analytics
Analyze patterns:
- User behavior
- Engagement scores
- Retention rates
- Delivery rates

---

## 💡 Common Patterns

### 1. Dashboard Metrics
```typescript
// Track real-time dashboard metrics
analytics.gauge('active_users_now', userCount)
analytics.gauge('cpu_usage', cpuPercent)
analytics.increment('api_requests')
```

### 2. Business KPIs
```typescript
// Track business metrics
analytics.increment('total_revenue', amount)
analytics.increment('new_customers')
analytics.track('average_order_value', orderValue)
```

### 3. User Behavior
```typescript
// Track user actions
analytics.trackEvent('page.view', { page, userId })
analytics.trackEvent('feature.used', { feature, userId })
```

### 4. Daily Reports
```typescript
// Generate daily reports
const report = await analytics.generateReport({
  id: 'daily_report',
  name: 'Daily Analytics',
  metrics: ['users', 'revenue', 'orders'],
  timeRange: { start: yesterday, end: today },
  format: 'html',
})
```

---

## 📚 Further Reading

- [Main Documentation](../../src/modules/analytics/README.md)
- [API Reference](../../docs/ANALYTICS-MODULE.md)
- [Tests](../../tests/modules/analytics/)

---

## 🔧 Customization

Feel free to modify these examples:
- Add your own metrics
- Track custom events
- Create custom reports
- Export in your preferred format

---

**Happy Analyzing! 📊**
