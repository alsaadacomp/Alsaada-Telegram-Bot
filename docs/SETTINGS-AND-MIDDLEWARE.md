# 📚 Settings Manager & Middleware Builder - دليل شامل

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [Settings Manager (نظام الإعدادات المركزي)](#settings-manager)
3. [Middleware Builder (نظام بناء Middlewares)](#middleware-builder)
4. [التكامل مع البوت](#التكامل-مع-البوت)
5. [أمثلة عملية](#أمثلة-عملية)

---

## 🎯 نظرة عامة

تم إضافة نظامين متقدمين لتحسين القالب:

### ✅ Settings Manager
نظام مركزي لإدارة إعدادات البوت مع:
- ✅ تخزين في قاعدة البيانات
- ✅ Caching ذكي
- ✅ Hot-reload بدون إعادة تشغيل
- ✅ Validation قوي
- ✅ Settings History
- ✅ واجهة Admin من Telegram

### ✅ Middleware Builder
نظام متقدم لإدارة Middlewares مع:
- ✅ Priority-based execution
- ✅ Conditional loading
- ✅ Dependency management
- ✅ Performance tracking
- ✅ Error handling & retry

---

## ⚙️ Settings Manager

### 📖 المفاهيم الأساسية

#### 1. Setting Definition
كل إعداد له تعريف (Definition) يحدد:
```typescript
interface SettingDefinition {
  key: string // المفتاح الفريد (e.g., 'bot.name')
  scope: 'global' | 'feature' | 'user' // النطاق
  category: SettingCategory // الفئة (bot, security, etc.)
  type: SettingValueType // النوع (string, number, boolean, json, array)
  defaultValue: unknown // القيمة الافتراضية
  description?: string // الوصف
  validation?: SettingValidation // قواعد التحقق
  isSecret?: boolean // للبيانات الحساسة
  requiresRestart?: boolean // يتطلب إعادة تشغيل
  isEditable?: boolean // قابل للتعديل من UI
  group?: string // للتجميع في UI
  order?: number // ترتيب العرض
}
```

#### 2. Setting Scopes
- **`global`**: إعدادات عامة للبوت بأكمله
- **`feature`**: إعدادات خاصة بميزة معينة
- **`user`**: إعدادات خاصة بكل مستخدم

#### 3. Setting Categories
```typescript
type SettingCategory =
  | 'general' // عام
  | 'bot' // البوت
  | 'security' // الأمان
  | 'notifications'// الإشعارات
  | 'features' // الميزات
  | 'database' // قاعدة البيانات
  | 'logging' // السجلات
  | 'performance' // الأداء
  | 'ui' // الواجهة
  | 'custom' // مخصص
```

### 🚀 الاستخدام

#### 1. تسجيل إعدادات جديدة

```typescript
import { settingsManager } from '#root/modules/settings/index.js'

// إعداد واحد
settingsManager.registerSetting({
  key: 'my_feature.max_items',
  scope: 'global',
  category: 'features',
  type: 'number',
  defaultValue: 10,
  description: 'الحد الأقصى للعناصر',
  validation: {
    required: true,
    min: 1,
    max: 100,
  },
  isEditable: true,
  group: 'my-feature',
  order: 1,
})

// إعدادات متعددة
settingsManager.registerSettings([
  { key: 'setting1', ... },
  { key: 'setting2', ... },
])
```

#### 2. قراءة الإعدادات

```typescript
// إعداد عام
const maxItems = await settingsManager.get<number>('my_feature.max_items')

// إعداد خاص بمستخدم
const userTheme = await settingsManager.get<string>('ui.theme', {
  userId: 123,
})

// إعداد خاص بميزة
const featureSetting = await settingsManager.get<boolean>('feature_enabled', {
  featureId: 'sales',
})
```

#### 3. تعديل الإعدادات

```typescript
// تعيين قيمة جديدة
await settingsManager.set('bot.maintenance_mode', true, {
  updatedBy: adminUserId,
  reason: 'صيانة دورية',
})

// تبديل boolean
const currentValue = await settingsManager.get<boolean>('notifications.enabled')
await settingsManager.set('notifications.enabled', !currentValue)

// إعادة تعيين للافتراضي
await settingsManager.reset('security.rate_limit_max_requests', {
  updatedBy: adminUserId,
})
```

#### 4. مراقبة التغييرات (Hot-reload)

```typescript
// الاستماع لتغيير إعداد معين
settingsManager.onChange('bot.maintenance_mode', async (event) => {
  console.log(`Maintenance mode changed: ${event.oldValue} -> ${event.newValue}`)

  if (event.newValue === true) {
    // تنفيذ إجراءات عند تفعيل وضع الصيانة
    await notifyAdmins('البوت في وضع الصيانة')
  }
})

// الاستماع لجميع التغييرات
settingsManager.on('change', (event) => {
  console.log(`Setting ${event.key} changed`)
})
```

#### 5. الإعدادات المتقدمة

```typescript
// عرض السجل
const history = await settingsManager.getHistory('bot.maintenance_mode', 10)
history.forEach((entry) => {
  console.log(`${entry.createdAt}: ${entry.oldValue} -> ${entry.newValue}`)
})

// تصدير الإعدادات
const exportedSettings = await settingsManager.export({
  category: 'security',
})

// استيراد الإعدادات
const result = await settingsManager.import(exportedSettings, {
  updatedBy: adminUserId,
  overwrite: true,
})

// إنشاء نسخة احتياطية
const snapshot = await settingsManager.createSnapshot()

// استعادة من نسخة احتياطية
await settingsManager.restoreSnapshot(snapshot, {
  updatedBy: adminUserId,
})

// مسح الـ cache
settingsManager.clearCache('bot.maintenance_mode')
```

### 🎨 واجهة Admin

تم دمج Settings Manager مع Admin Panel:

1. افتح البوت
2. اذهب إلى `📋 القائمة الرئيسية`
3. اختر `🛡️ لوحة التحكم`
4. اختر `⚙️ إعدادات البوت`
5. اختر الفئة (Bot, Security, Notifications, etc.)
6. اختر الإعداد الذي تريد تعديله

**المميزات:**
- ✅ تعديل الإعدادات مباشرة من Telegram
- ✅ تبديل سريع للـ boolean settings
- ✅ إعادة تعيين للقيمة الافتراضية
- ✅ عرض سجل التغييرات
- ✅ محدود للـ SUPER_ADMIN فقط

### 📦 الإعدادات الافتراضية

#### Bot Settings
```typescript
'bot.name' // اسم البوت
'bot.default_language' // اللغة الافتراضية (ar/en)
'bot.maintenance_mode' // وضع الصيانة
'bot.maintenance_message' // رسالة الصيانة
'bot.welcome_message' // رسالة الترحيب
```

#### Security Settings
```typescript
'security.rate_limit_enabled' // تفعيل حد المعدل
'security.rate_limit_max_requests' // الحد الأقصى للطلبات
'security.rate_limit_window' // النافذة الزمنية (ms)
'security.auto_ban_on_spam' // حظر تلقائي للسبام
'security.max_login_attempts' // محاولات تسجيل الدخول
```

#### Notification Settings
```typescript
'notifications.enabled' // تفعيل الإشعارات
'notifications.default_priority' // الأولوية الافتراضية
'notifications.retry_on_failure' // إعادة المحاولة
'notifications.max_retries' // الحد الأقصى للمحاولات
```

#### Feature Settings
```typescript
'features.auto_discovery_enabled' // التحميل التلقائي
'features.main_menu_enabled' // القائمة الرئيسية
'features.max_buttons_per_row' // الأزرار في الصف
```

#### Database Settings
```typescript
'database.auto_backup_enabled' // النسخ الاحتياطي التلقائي
'database.backup_interval' // فترة النسخ الاحتياطي (ms)
'database.max_backups' // الحد الأقصى للنسخ
```

#### Performance Settings
```typescript
'performance.cache_enabled' // تفعيل Cache
'performance.cache_timeout' // مدة صلاحية Cache (ms)
'performance.max_concurrent_requests' // الطلبات المتزامنة
```

#### Logging Settings
```typescript
'logging.level' // مستوى التسجيل
'logging.log_to_file' // حفظ في ملف
'logging.log_queries' // تسجيل استعلامات DB
```

---

## 🔧 Middleware Builder

### 📖 المفاهيم الأساسية

#### 1. Middleware Definition
```typescript
interface MiddlewareDefinition {
  id: string // المعرف الفريد
  name: string // الاسم
  description?: string // الوصف
  category: MiddlewareCategory // الفئة
  phase: MiddlewarePhase // المرحلة
  priority: number // الأولوية (أقل = أعلى)
  enabled: boolean // مفعل/معطل
  handler: MiddlewareFn // الـ handler
  conditions?: MiddlewareCondition[] // الشروط
  dependencies?: string[] // الاعتماديات
  conflictsWith?: string[] // التعارضات
  settings?: Record<string, unknown> // الإعدادات
  timeout?: number // Timeout (ms)
  retryOnError?: boolean // إعادة المحاولة
  maxRetries?: number // الحد الأقصى
}
```

#### 2. Middleware Phases
```typescript
type MiddlewarePhase =
  | 'pre-authentication' // قبل المصادقة
  | 'authentication' // أثناء المصادقة
  | 'post-authentication' // بعد المصادقة
  | 'pre-processing' // قبل المعالجة
  | 'processing' // المعالجة الرئيسية
  | 'post-processing' // بعد المعالجة
  | 'error-handling' // معالجة الأخطاء
  | 'cleanup' // التنظيف
```

#### 3. Middleware Categories
```typescript
type MiddlewareCategory =
  | 'security' // أمان
  | 'logging' // تسجيل
  | 'validation' // تحقق
  | 'rate-limiting' // حد المعدل
  | 'caching' // تخزين مؤقت
  | 'transformation' // تحويل
  | 'feature' // ميزة
  | 'utility' // أداة
  | 'custom' // مخصص
```

### 🚀 الاستخدام

#### 1. إنشاء Middleware باستخدام Builder

```typescript
import { MiddlewareBuilder, middlewareRegistry } from '#root/modules/middleware/index.js'

const rateLimitMiddleware = MiddlewareBuilder.create()
  .id('rate-limiter')
  .name('Rate Limiter')
  .description('حد معدل الطلبات لمنع السبام')
  .category('rate-limiting')
  .phase('pre-processing')
  .priority(10) // أولوية عالية
  .enabled(true)
  .handler(async (ctx, next) => {
    const userId = ctx.from?.id
    if (!userId)
      return await next()

    // منطق Rate Limiting هنا
    const requestCount = getRateLimitCount(userId)
    if (requestCount > maxRequests) {
      await ctx.reply('⚠️ تم تجاوز الحد الأقصى للطلبات. حاول لاحقاً.')
      return
    }

    incrementRateLimitCount(userId)
    await next()
  })
  .condition(async (ctx) => {
    // تنفيذ فقط للمستخدمين العاديين
    return ctx.dbUser?.role !== 'SUPER_ADMIN'
  })
  .timeout(5000) // 5 ثواني
  .retryOnError(true, 3) // 3 محاولات
  .settings({
    maxRequests: 30,
    window: 60000, // 1 دقيقة
  })
  .build()

// تسجيل Middleware
middlewareRegistry.register(rateLimitMiddleware)
```

#### 2. Middleware مع Dependencies

```typescript
const loggingMiddleware = MiddlewareBuilder.create()
  .id('request-logger')
  .name('Request Logger')
  .category('logging')
  .phase('pre-processing')
  .priority(5)
  .handler(async (ctx, next) => {
    const start = Date.now()
    logger.info({ update: ctx.update }, 'Request received')

    await next()

    const duration = Date.now() - start
    logger.info({ duration }, 'Request completed')
  })
  .build()

const authMiddleware = MiddlewareBuilder.create()
  .id('auth-checker')
  .name('Auth Checker')
  .category('security')
  .phase('authentication')
  .priority(20)
  .dependsOn('request-logger') // يعتمد على Logger
  .handler(async (ctx, next) => {
    // منطق المصادقة
    await next()
  })
  .build()

middlewareRegistry.register(loggingMiddleware)
middlewareRegistry.register(authMiddleware, {
  validateDependencies: true, // التحقق من الاعتماديات
})
```

#### 3. Conditional Middleware

```typescript
const maintenanceModeMiddleware = MiddlewareBuilder.create()
  .id('maintenance-check')
  .name('Maintenance Mode Check')
  .category('security')
  .phase('pre-processing')
  .priority(1) // أول شيء
  .handler(async (ctx, next) => {
    const maintenanceMode = await settingsManager.get<boolean>('bot.maintenance_mode')

    if (maintenanceMode && ctx.dbUser?.role !== 'SUPER_ADMIN') {
      const message = await settingsManager.get<string>('bot.maintenance_message')
      await ctx.reply(message || 'البوت تحت الصيانة')
      return
    }

    await next()
  })
  .conditions([
    ctx => ctx.chat?.type === 'private', // فقط المحادثات الخاصة
    ctx => ctx.message !== undefined, // فقط الرسائل
  ])
  .build()

middlewareRegistry.register(maintenanceModeMiddleware)
```

#### 4. إدارة Middlewares

```typescript
// تفعيل/تعطيل
middlewareRegistry.enable('rate-limiter')
middlewareRegistry.disable('rate-limiter')

// تحديث الإعدادات
middlewareRegistry.update('rate-limiter', {
  enabled: true,
  priority: 15,
  settings: { maxRequests: 50 },
})

// حذف middleware
middlewareRegistry.unregister('rate-limiter')

// عرض جميع Middlewares
const allMiddlewares = middlewareRegistry.getAll()
const enabledMiddlewares = middlewareRegistry.getEnabled()

// حسب Phase
const preProcessing = middlewareRegistry.getByPhase('pre-processing')

// حسب Category
const securityMiddlewares = middlewareRegistry.getByCategory('security')
```

#### 5. Performance Metrics

```typescript
// عرض إحصائيات middleware
const metrics = middlewareRegistry.getMetrics('rate-limiter')

console.log(`
  Total Executions: ${metrics.totalExecutions}
  Successful: ${metrics.successfulExecutions}
  Failed: ${metrics.failedExecutions}
  Skipped: ${metrics.skippedExecutions}
  Average Duration: ${metrics.averageDuration}ms
  Min Duration: ${metrics.minDuration}ms
  Max Duration: ${metrics.maxDuration}ms
`)

// إعادة تعيين الإحصائيات
middlewareRegistry.resetMetrics('rate-limiter')

// عرض جميع الإحصائيات
const allMetrics = middlewareRegistry.getAllMetrics()
```

#### 6. Event Listeners

```typescript
// الاستماع لأحداث Middleware
middlewareRegistry.onEvent('executed', (data) => {
  console.log(`Middleware ${data.middlewareId} executed`)
  if (data.data?.duration > 1000) {
    logger.warn('Slow middleware detected', data)
  }
})

middlewareRegistry.onEvent('error', (data) => {
  logger.error('Middleware error', data.error)
})

middlewareRegistry.onEvent('timeout', (data) => {
  logger.error(`Middleware ${data.middlewareId} timed out`)
})
```

### 🔗 استخدام Middleware Chain مع grammy

```typescript
import { middlewareRegistry } from '#root/modules/middleware/index.js'
import { Bot } from 'grammy'

const bot = new Bot(token)

// بناء chain لمرحلة معينة
const preProcessingChain = middlewareRegistry.buildChain({
  phase: 'pre-processing',
  sortByPriority: true,
})

// تطبيق الـ chain
preProcessingChain.forEach((middleware) => {
  bot.use(middleware)
})

// أو تطبيق جميع Middlewares المفعلة
const allMiddlewares = middlewareRegistry.buildChain()
allMiddlewares.forEach(mw => bot.use(mw))
```

---

## 🔗 التكامل مع البوت

### 1. Settings Integration

تم دمج Settings Manager في `src/bot/index.ts`:

```typescript
import { registerDefaultSettings, settingsManager } from '#root/modules/settings/index.js'

export async function createBot(token: string, dependencies: Dependencies) {
  // تسجيل الإعدادات الافتراضية
  registerDefaultSettings(settingsManager)
  logger.info('Settings Manager initialized')

  // التحقق من وضع الصيانة
  const maintenanceMode = await settingsManager.get<boolean>('bot.maintenance_mode')
  if (maintenanceMode) {
    logger.warn('Bot is in maintenance mode')
  }

  const bot = new TelegramBot<Context>(token)

  // Maintenance mode middleware
  protectedBot.use(async (ctx, next) => {
    const maintenanceMode = await settingsManager.get<boolean>('bot.maintenance_mode')
    if (maintenanceMode && ctx.dbUser?.role !== 'SUPER_ADMIN') {
      const msg = await settingsManager.get<string>('bot.maintenance_message')
      await ctx.reply(msg || 'البوت تحت الصيانة')
      return
    }
    await next()
  })

  // ... بقية الكود
}
```

### 2. Admin Panel Integration

تم إضافة Settings UI إلى Admin Panel في `src/bot/features/admin-panel/`:

```typescript
// config.ts
{
  id: 'settings',
  name: 'إعدادات البوت',
  icon: '⚙️',
  description: 'إدارة إعدادات البوت المركزية',
  handler: 'settingsManagerHandler',
  enabled: true,
  order: 5,
  permissions: ['SUPER_ADMIN'],
}

// handlers/settings-manager.ts
settingsManagerHandler.callbackQuery('admin:settings', async (ctx) => {
  // عرض قائمة الفئات
})

settingsManagerHandler.callbackQuery(/^admin:settings:category:(.+)$/, async (ctx) => {
  // عرض إعدادات الفئة
})

settingsManagerHandler.callbackQuery(/^admin:settings:edit:(.+)$/, async (ctx) => {
  // تعديل إعداد
})

settingsManagerHandler.callbackQuery(/^admin:settings:toggle:(.+)$/, async (ctx) => {
  // تبديل boolean setting
})
```

---

## 💡 أمثلة عملية

### مثال 1: إعدادات خاصة بميزة

```typescript
// في ملف الميزة
import { settingsManager } from '#root/modules/settings/index.js'

// تسجيل إعدادات الميزة
export async function initSalesFeature() {
  settingsManager.registerSettings([
    {
      key: 'sales.commission_rate',
      scope: 'global',
      category: 'custom',
      type: 'number',
      defaultValue: 5, // 5%
      description: 'نسبة العمولة على المبيعات',
      validation: {
        required: true,
        min: 0,
        max: 100,
      },
      isEditable: true,
      group: 'sales',
    },
    {
      key: 'sales.min_order_amount',
      scope: 'global',
      category: 'custom',
      type: 'number',
      defaultValue: 100,
      description: 'الحد الأدنى لقيمة الطلب',
      isEditable: true,
      group: 'sales',
    },
  ])
}

// استخدام الإعدادات
async function calculateCommission(saleAmount: number): Promise<number> {
  const rate = await settingsManager.get<number>('sales.commission_rate') || 5
  return saleAmount * (rate / 100)
}

async function validateOrder(amount: number): Promise<boolean> {
  const minAmount = await settingsManager.get<number>('sales.min_order_amount') || 0
  return amount >= minAmount
}
```

### مثال 2: إعدادات خاصة بالمستخدم

```typescript
// إعدادات واجهة المستخدم
settingsManager.registerSettings([
  {
    key: 'user.language',
    scope: 'user',
    category: 'ui',
    type: 'string',
    defaultValue: 'ar',
    validation: { enum: ['ar', 'en'] },
    isEditable: true,
  },
  {
    key: 'user.notifications_enabled',
    scope: 'user',
    category: 'notifications',
    type: 'boolean',
    defaultValue: true,
    isEditable: true,
  },
])

// استخدام
async function sendNotificationToUser(userId: number, message: string) {
  const enabled = await settingsManager.get<boolean>('user.notifications_enabled', {
    userId,
  })

  if (enabled) {
    await bot.api.sendMessage(userId, message)
  }
}
```

### مثال 3: Rate Limiting Middleware

```typescript
import { MiddlewareBuilder, middlewareRegistry } from '#root/modules/middleware/index.js'

const rateLimitMap = new Map<number, { count: number, resetAt: number }>()

const rateLimitMiddleware = MiddlewareBuilder.create()
  .id('rate-limiter')
  .name('Rate Limiter')
  .category('rate-limiting')
  .phase('pre-processing')
  .priority(5)
  .handler(async (ctx, next) => {
    const userId = ctx.from?.id
    if (!userId)
      return await next()

    const now = Date.now()
    const userLimit = rateLimitMap.get(userId)

    // Get settings
    const maxRequests = await settingsManager.get<number>('security.rate_limit_max_requests') || 30
    const window = await settingsManager.get<number>('security.rate_limit_window') || 60000

    if (!userLimit || now > userLimit.resetAt) {
      // New window
      rateLimitMap.set(userId, {
        count: 1,
        resetAt: now + window,
      })
      return await next()
    }

    if (userLimit.count >= maxRequests) {
      const waitTime = Math.ceil((userLimit.resetAt - now) / 1000)
      await ctx.reply(`⚠️ تجاوزت الحد الأقصى. حاول بعد ${waitTime} ثانية.`)
      return
    }

    userLimit.count++
    await next()
  })
  .condition(async (ctx) => {
    // لا تطبق على الأدمن
    return ctx.dbUser?.role !== 'SUPER_ADMIN' && ctx.dbUser?.role !== 'ADMIN'
  })
  .build()

middlewareRegistry.register(rateLimitMiddleware)
```

### مثال 4: Logging Middleware مع Metrics

```typescript
const requestLoggerMiddleware = MiddlewareBuilder.create()
  .id('request-logger')
  .name('Request Logger')
  .category('logging')
  .phase('pre-processing')
  .priority(1) // أول شيء
  .handler(async (ctx, next) => {
    const start = Date.now()
    const updateType = Object.keys(ctx.update)[0]
    const userId = ctx.from?.id
    const chatType = ctx.chat?.type

    logger.info({
      updateType,
      userId,
      chatType,
    }, 'Request received')

    try {
      await next()

      const duration = Date.now() - start
      logger.info({ duration }, 'Request completed')
    }
    catch (error) {
      const duration = Date.now() - start
      logger.error({ error, duration }, 'Request failed')
      throw error
    }
  })
  .build()

middlewareRegistry.register(requestLoggerMiddleware)

// عرض إحصائيات
setInterval(() => {
  const metrics = middlewareRegistry.getMetrics('request-logger')
  console.log(`
📊 Request Logger Stats:
  Total: ${metrics.totalExecutions}
  Success: ${metrics.successfulExecutions}
  Failed: ${metrics.failedExecutions}
  Avg Duration: ${metrics.averageDuration.toFixed(2)}ms
  `)
}, 60000) // كل دقيقة
```

---

## 🎯 أفضل الممارسات

### Settings Manager

1. **تسمية الإعدادات**: استخدم نمط `category.setting_name` مثل `bot.name`
2. **Validation**: دائماً أضف validation للإعدادات المهمة
3. **Default Values**: تأكد من وجود قيم افتراضية منطقية
4. **Documentation**: أضف وصف واضح لكل إعداد
5. **Hot-reload**: استخدم `onChange` للإعدادات التي تحتاج تحديث فوري
6. **Caching**: لا تعطل الـ cache إلا للإعدادات التي تتغير باستمرار
7. **Security**: ضع `isSecret: true` للبيانات الحساسة
8. **Restart Warning**: ضع `requiresRestart: true` إذا كان التغيير يحتاج إعادة تشغيل

### Middleware Builder

1. **Priority**: رتب Middlewares بعناية (أقل رقم = أعلى أولوية)
2. **Phases**: استخدم المرحلة المناسبة لكل middleware
3. **Conditions**: استخدم Conditions بدلاً من if داخل Handler
4. **Dependencies**: حدد الاعتماديات لتجنب الأخطاء
5. **Timeout**: ضع timeout للعمليات الطويلة
6. **Error Handling**: فعّل retry للعمليات الحساسة
7. **Metrics**: راقب الأداء باستمرار
8. **Documentation**: وثق كل middleware بوضوح

---

## 📝 الخلاصة

تم بنجاح إضافة نظامين متقدمين للقالب:

✅ **Settings Manager**: نظام إعدادات مركزي شامل مع UI من Telegram
✅ **Middleware Builder**: نظام متقدم لإدارة Middlewares
✅ **Full Integration**: دمج كامل مع البوت والـ Admin Panel
✅ **Production Ready**: جاهز للاستخدام في الإنتاج
✅ **Extensible**: سهل التوسع والإضافة عليه

---

**📚 للمزيد من المعلومات:**
- [Project Structure](./02-project-structure.md)
- [Development Guide](./07-development-guide.md)
- [Feature System](./FEATURE-SYSTEM-SUMMARY.md)
- [Permissions System](./PERMISSIONS-SYSTEM.md)

---

**تم التطوير بواسطة:** Telegram Bot Template
**التاريخ:** أكتوبر 2025
**الإصدار:** 2.0.0

🎉 **Happy Coding!**
