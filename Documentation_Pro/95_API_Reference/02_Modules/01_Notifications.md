# 🔔 Notification Service - API Reference

## 📋 جدول المحتويات
- [نظرة عامة](#نظرة-عامة)
- [التثبيت والاستيراد](#التثبيت-والاستيراد)
- [الوظائف الأساسية](#الوظائف-الأساسية)
- [الإرسال المتقدم](#الإرسال-المتقدم)
- [الجدولة](#الجدولة)
- [القوالب](#القوالب)
- [الإحصائيات](#الإحصائيات)
- [الأمثلة الكاملة](#الأمثلة-الكاملة)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## 🎯 نظرة عامة

نظام إشعارات شامل ومتطور للغاية يدعم:
- ✅ 7 أنواع إشعارات (INFO, SUCCESS, WARNING, ERROR, ANNOUNCEMENT, REMINDER, ALERT)
- ✅ 6 مستويات أولوية (LOW, NORMAL, IMPORTANT, HIGH, URGENT, CRITICAL)
- ✅ إرسال جماعي (Batch Sending)
- ✅ جدولة ذكية (Scheduling)
- ✅ إشعارات متكررة (Recurring)
- ✅ قوالب مع متغيرات ذكية
- ✅ تفضيلات مستخدم
- ✅ ساعات صمت (Quiet Hours)
- ✅ تتبع شامل (Full Tracking)

---

## 📦 التثبيت والاستيراد

### الاستيراد الأساسي:

```typescript
import { notificationService } from '#root/modules/notifications'
```

### الاستيراد المتقدم:

```typescript
// جميع الخدمات
import { 
  notificationService,
  templateManagementService,
  smartVariableService 
} from '#root/modules/notifications'

// الأنواع
import type {
  NotificationConfig,
  NotificationType,
  NotificationPriority,
  SendResult,
  NotificationTarget
} from '#root/modules/notifications/types'
```

---

## 🚀 الوظائف الأساسية

### 1. `sendToAllUsers()` - إرسال لجميع المستخدمين

**التوقيع:**
```typescript
sendToAllUsers(
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**البارامترات:**
```typescript
interface NotificationConfig {
  message: string                    // النص (مطلوب)
  type?: NotificationType            // النوع (اختياري)
  priority?: NotificationPriority    // الأولوية (اختياري)
  buttons?: any[]                    // أزرار (اختياري)
  image?: string                     // صورة (اختياري)
  parseMode?: 'Markdown' | 'HTML'    // نمط النص (اختياري)
}

interface BatchSendConfig {
  batchSize?: number          // حجم الدفعة (افتراضي: 50)
  delayBetweenBatches?: number // التأخير بين الدفعات (ms) (افتراضي: 1000)
  continueOnError?: boolean    // الاستمرار عند الخطأ (افتراضي: true)
}
```

**القيمة المرجعة:**
```typescript
interface SendResult {
  success: boolean          // هل نجحت العملية؟
  sentCount: number         // عدد الإرسالات الناجحة
  failedCount: number       // عدد الإرسالات الفاشلة
  failedUserIds: number[]   // IDs المستخدمين الذين فشل إرسالهم
  errors: Error[]           // قائمة الأخطاء
}
```

**مثال بسيط:**
```typescript
const result = await notificationService.sendToAllUsers({
  message: '🎉 لدينا ميزة جديدة!',
  type: 'announcement',
  priority: 'important'
})

console.log(`تم الإرسال لـ ${result.sentCount} مستخدم`)
```

**مثال متقدم مع Batch:**
```typescript
const result = await notificationService.sendToAllUsers(
  {
    message: '📢 تحديث مهم للنظام',
    type: 'announcement',
    priority: 'urgent',
    parseMode: 'Markdown'
  },
  {
    batchSize: 100,           // إرسال 100 في المرة
    delayBetweenBatches: 2000, // انتظار ثانيتين بين كل دفعة
    continueOnError: true      // استمر حتى لو فشل بعضها
  }
)

if (result.success) {
  console.log('✅ تم الإرسال بنجاح')
} else {
  console.log(`⚠️ فشل إرسال ${result.failedCount} إشعار`)
  console.log('الأخطاء:', result.errors)
}
```

---

### 2. `sendToAdmins()` - إرسال للمشرفين

**التوقيع:**
```typescript
sendToAdmins(
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
await notificationService.sendToAdmins({
  message: '⚠️ طلب انضمام جديد يحتاج موافقة',
  type: 'alert',
  priority: 'high'
})
```

---

### 3. `sendToSuperAdmin()` - إرسال للمدير الأعلى

**التوقيع:**
```typescript
sendToSuperAdmin(
  config: NotificationConfig
): Promise<SendResult>
```

**مثال:**
```typescript
await notificationService.sendToSuperAdmin({
  message: '🚨 خطأ حرج في النظام!',
  type: 'error',
  priority: 'critical'
})
```

---

### 4. `sendToRole()` - إرسال حسب الدور

**التوقيع:**
```typescript
sendToRole(
  role: UserRole,              // 'SUPER_ADMIN' | 'ADMIN' | 'USER' | 'GUEST' | 'MODERATOR'
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
// إرسال لجميع المستخدمين العاديين
await notificationService.sendToRole('USER', {
  message: '💡 نصيحة اليوم: استخدم الاختصارات لتسريع عملك',
  type: 'info',
  priority: 'low'
})

// إرسال لجميع المشرفين
await notificationService.sendToRole('ADMIN', {
  message: '📊 التقرير الأسبوعي جاهز',
  type: 'info',
  priority: 'normal'
})
```

---

### 5. `sendToUsers()` - إرسال لمستخدمين محددين

**التوقيع:**
```typescript
sendToUsers(
  userIds: number[],
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
// إرسال لمستخدمين محددين
await notificationService.sendToUsers(
  [101, 102, 103, 104, 105],  // IDs المستخدمين
  {
    message: '🎁 تهانينا! لقد فزت بجائزة',
    type: 'success',
    priority: 'high'
  }
)
```

---

### 6. `sendToActiveUsers()` - إرسال للمستخدمين النشطين

يرسل للمستخدمين الذين نشطوا في آخر 7 أيام.

**التوقيع:**
```typescript
sendToActiveUsers(
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
await notificationService.sendToActiveUsers({
  message: '👏 شكراً لاستخدامك المستمر!',
  type: 'success',
  priority: 'normal'
})
```

---

### 7. `sendToInactiveUsers()` - إرسال للمستخدمين غير النشطين

يرسل للمستخدمين الذين لم ينشطوا منذ 7 أيام أو أكثر.

**التوقيع:**
```typescript
sendToInactiveUsers(
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
await notificationService.sendToInactiveUsers({
  message: '😢 نفتقدك! عد إلينا واكتشف الجديد',
  type: 'reminder',
  priority: 'normal'
})
```

---

### 8. `sendToNewUsers()` - إرسال للمستخدمين الجدد

يرسل للمستخدمين المسجلين في آخر 30 يوم.

**التوقيع:**
```typescript
sendToNewUsers(
  config: NotificationConfig,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال:**
```typescript
await notificationService.sendToNewUsers({
  message: '🌟 مرحباً! هل تحتاج مساعدة في البداية؟',
  type: 'info',
  priority: 'normal'
})
```

---

## 🎨 الإرسال المتقدم

### 1. `sendNotificationWithSmartVariables()` - مع متغيرات ذكية

إرسال إشعارات مخصصة لكل مستخدم باستخدام متغيرات ذكية.

**التوقيع:**
```typescript
sendNotificationWithSmartVariables(
  notificationData: any,
  staticVariables: Record<string, string>
): Promise<SendResult>
```

**المتغيرات الذكية المتاحة:**
```typescript
{
  // معلومات المستخدم
  fullName: string      // الاسم الكامل
  firstName: string     // الاسم الأول
  lastName: string      // اسم العائلة
  nickname: string      // اللقب
  userId: string        // معرف المستخدم
  telegramId: string    // معرف تيليجرام
  role: string          // الدور
  
  // معلومات زمنية
  currentDate: string   // التاريخ الحالي
  currentTime: string   // الوقت الحالي
  currentDateTime: string // التاريخ والوقت
  
  // معلومات النظام
  botName: string       // اسم البوت
  supportContact: string // جهة الاتصال
}
```

**مثال:**
```typescript
const result = await notificationService.sendNotificationWithSmartVariables(
  {
    message: `
      مرحباً {{fullName}}! 👋
      
      لديك {{taskCount}} مهمة معلقة.
      آخر نشاط لك كان في {{lastActiveDate}}.
      
      شكراً لك!
      فريق {{botName}}
    `,
    type: 'info',
    priority: 'normal',
    targetAudience: 'all_users'
  },
  {
    taskCount: '5',
    lastActiveDate: '2025-10-20'
  }
)

// سيحصل كل مستخدم على رسالة مخصصة:
// "مرحباً أحمد محمد! 👋
//  لديك 5 مهمة معلقة.
//  آخر نشاط لك كان في 2025-10-20..."
```

---

## ⏰ الجدولة

### 1. `schedule()` - جدولة إشعار

**التوقيع:**
```typescript
schedule(
  config: NotificationConfig,
  target: NotificationTarget,
  schedule: ScheduleConfig
): Promise<string>  // يرجع ID الإشعار
```

**البارامترات:**
```typescript
interface NotificationTarget {
  audience: 'all_users' | 'all_admins' | 'super_admin' | 'role' | 'specific_users' | 'active_users' | 'inactive_users' | 'new_users'
  role?: UserRole
  userIds?: number[]
}

interface ScheduleConfig {
  scheduledAt?: Date       // وقت الإرسال
  recurring?: boolean      // هل متكرر؟
  recurringConfig?: {
    interval: 'daily' | 'weekly' | 'monthly'
    time?: string          // 'HH:MM' (مثلاً: '09:00')
    dayOfWeek?: number     // للأسبوعي (0-6)
    dayOfMonth?: number    // للشهري (1-31)
  }
}
```

**مثال 1: جدولة بسيطة**
```typescript
const scheduledDate = new Date('2025-10-25T10:00:00')

const notificationId = await notificationService.schedule(
  {
    message: '📅 تذكير: اجتماع الفريق اليوم الساعة 3 مساءً',
    type: 'reminder',
    priority: 'important'
  },
  {
    audience: 'all_admins'
  },
  {
    scheduledAt: scheduledDate
  }
)

console.log(`تم جدولة الإشعار: ${notificationId}`)
```

**مثال 2: جدولة لمستخدمين محددين**
```typescript
const tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(9, 0, 0, 0)  // 9 صباحاً

await notificationService.schedule(
  {
    message: '☀️ صباح الخير! لديك مهام جديدة',
    type: 'info'
  },
  {
    audience: 'specific_users',
    userIds: [101, 102, 103]
  },
  {
    scheduledAt: tomorrow
  }
)
```

---

### 2. `scheduleRecurring()` - جدولة متكررة

**مثال 1: تذكير يومي**
```typescript
const notificationId = await notificationService.scheduleRecurring(
  {
    message: '📊 التقرير اليومي متاح الآن',
    type: 'info',
    priority: 'normal'
  },
  {
    audience: 'all_admins'
  },
  {
    recurring: true,
    recurringConfig: {
      interval: 'daily',
      time: '09:00'  // كل يوم الساعة 9 صباحاً
    }
  }
)
```

**مثال 2: تذكير أسبوعي**
```typescript
await notificationService.scheduleRecurring(
  {
    message: '📈 ملخص الأسبوع جاهز',
    type: 'info',
    priority: 'important'
  },
  {
    audience: 'all_admins'
  },
  {
    recurring: true,
    recurringConfig: {
      interval: 'weekly',
      dayOfWeek: 1,  // الإثنين (0 = الأحد)
      time: '10:00'
    }
  }
)
```

**مثال 3: تذكير شهري**
```typescript
await notificationService.scheduleRecurring(
  {
    message: '💰 تقرير المبيعات الشهري',
    type: 'announcement',
    priority: 'high'
  },
  {
    audience: 'role',
    role: 'ADMIN'
  },
  {
    recurring: true,
    recurringConfig: {
      interval: 'monthly',
      dayOfMonth: 1,  // أول يوم من الشهر
      time: '08:00'
    }
  }
)
```

---

### 3. `cancelScheduled()` - إلغاء إشعار مجدول

**التوقيع:**
```typescript
cancelScheduled(notificationId: string): boolean
```

**مثال:**
```typescript
const notificationId = await notificationService.schedule(...)

// إلغاء الإشعار
const cancelled = notificationService.cancelScheduled(notificationId)

if (cancelled) {
  console.log('✅ تم إلغاء الإشعار')
} else {
  console.log('❌ لم يتم العثور على الإشعار')
}
```

---

## 📝 القوالب

### 1. `registerTemplate()` - تسجيل قالب

**التوقيع:**
```typescript
registerTemplate(template: NotificationTemplateBuilder): void
```

**مثال:**
```typescript
import { NotificationTemplateBuilder } from '#root/modules/notifications/core'

// إنشاء قالب
const welcomeTemplate = new NotificationTemplateBuilder('welcome', 'رسالة ترحيب')
  .setMessage('مرحباً {{fullName}}! 🎉\n\nنحن سعداء بانضمامك إلى {{botName}}')
  .setType('info')
  .setPriority('normal')
  .addRequiredVariable('fullName')
  .addRequiredVariable('botName')

// تسجيل القالب
notificationService.registerTemplate(welcomeTemplate)
```

---

### 2. `getTemplate()` - الحصول على قالب

**التوقيع:**
```typescript
getTemplate(templateId: string): NotificationTemplateBuilder | undefined
```

**مثال:**
```typescript
const template = notificationService.getTemplate('welcome')

if (template) {
  console.log('القالب موجود')
}
```

---

### 3. `sendFromTemplate()` - الإرسال من قالب

**التوقيع:**
```typescript
sendFromTemplate(
  templateId: string,
  target: NotificationTarget,
  variables?: TemplateVariable,
  batchConfig?: BatchSendConfig
): Promise<SendResult>
```

**مثال كامل:**
```typescript
// 1. إنشاء وتسجيل القالب
const reminderTemplate = new NotificationTemplateBuilder('task_reminder', 'تذكير بالمهام')
  .setMessage(`
    مرحباً {{userName}}! ⏰
    
    لديك {{taskCount}} مهمة معلقة:
    {{taskList}}
    
    الموعد النهائي: {{deadline}}
  `)
  .setType('reminder')
  .setPriority('important')
  .addRequiredVariable('userName')
  .addRequiredVariable('taskCount')
  .addRequiredVariable('taskList')
  .addRequiredVariable('deadline')

notificationService.registerTemplate(reminderTemplate)

// 2. الإرسال من القالب
const result = await notificationService.sendFromTemplate(
  'task_reminder',
  {
    audience: 'specific_users',
    userIds: [101]
  },
  {
    userName: 'أحمد',
    taskCount: '3',
    taskList: '- مهمة 1\n- مهمة 2\n- مهمة 3',
    deadline: '2025-10-25'
  }
)
```

---

## 📊 الإحصائيات

### 1. `getHistory()` - سجل الإشعارات

**التوقيع:**
```typescript
getHistory(limit?: number): Promise<NotificationRecord[]>
```

**مثال:**
```typescript
// الحصول على آخر 10 إشعارات
const history = await notificationService.getHistory(10)

history.forEach(record => {
  console.log(`
    النوع: ${record.type}
    الرسالة: ${record.message}
    المستلمون: ${record.recipients.length}
    الناجح: ${record.successCount}
    الفاشل: ${record.failureCount}
    التاريخ: ${record.createdAt}
  `)
})
```

---

### 2. `getStatistics()` - إحصائيات شاملة

**التوقيع:**
```typescript
getStatistics(): Promise<NotificationStatistics>
```

**القيمة المرجعة:**
```typescript
interface NotificationStatistics {
  total: number               // إجمالي الإشعارات
  sent: number                // المرسلة بنجاح
  failed: number              // الفاشلة
  pending: number             // المنتظرة
  byType: Record<string, number>      // حسب النوع
  byPriority: Record<string, number>  // حسب الأولوية
  byStatus: Record<string, number>    // حسب الحالة
  recentActivity: any[]       // النشاط الأخير
}
```

**مثال:**
```typescript
const stats = await notificationService.getStatistics()

console.log(`
  📊 إحصائيات الإشعارات:
  
  الإجمالي: ${stats.total}
  الناجحة: ${stats.sent}
  الفاشلة: ${stats.failed}
  المنتظرة: ${stats.pending}
  
  حسب النوع:
  ${JSON.stringify(stats.byType, null, 2)}
  
  حسب الأولوية:
  ${JSON.stringify(stats.byPriority, null, 2)}
`)
```

---

### 3. `clearHistory()` - مسح السجل

**التوقيع:**
```typescript
clearHistory(): Promise<void>
```

**مثال:**
```typescript
await notificationService.clearHistory()
console.log('✅ تم مسح سجل الإشعارات')
```

---

## 👤 تفضيلات المستخدم

### 1. `setUserPreferences()` - ضبط التفضيلات

**التوقيع:**
```typescript
setUserPreferences(
  userId: number,
  preferences: UserNotificationPreferences
): void
```

**البارامترات:**
```typescript
interface UserNotificationPreferences {
  enabled: boolean                    // تفعيل الإشعارات
  types?: NotificationType[]          // الأنواع المسموحة
  priorities?: NotificationPriority[] // الأولويات المسموحة
  quietHours?: {
    enabled: boolean
    start: string    // 'HH:MM'
    end: string      // 'HH:MM'
  }
  channels?: string[]  // القنوات (telegram, email, sms...)
}
```

**مثال:**
```typescript
notificationService.setUserPreferences(101, {
  enabled: true,
  types: ['info', 'success', 'announcement'],  // فقط هذه الأنواع
  priorities: ['normal', 'important', 'high'], // فقط هذه الأولويات
  quietHours: {
    enabled: true,
    start: '22:00',  // من 10 مساءً
    end: '08:00'     // إلى 8 صباحاً
  }
})
```

---

### 2. `getUserPreferences()` - الحصول على التفضيلات

**التوقيع:**
```typescript
getUserPreferences(userId: number): UserNotificationPreferences | undefined
```

**مثال:**
```typescript
const prefs = notificationService.getUserPreferences(101)

if (prefs) {
  console.log('الإشعارات مفعلة:', prefs.enabled)
  console.log('ساعات الصمت:', prefs.quietHours)
}
```

---

## 🔥 الأمثلة الكاملة

### مثال 1: نظام ترحيب متكامل

```typescript
// عند تسجيل مستخدم جديد
async function welcomeNewUser(userId: number, userName: string) {
  // 1. إرسال رسالة ترحيب فورية
  await notificationService.sendToUsers(
    [userId],
    {
      message: `
        🎉 مرحباً ${userName}!
        
        نحن سعداء بانضمامك إلى فريقنا.
        
        ابدأ باستكشاف الميزات الجديدة!
      `,
      type: 'success',
      priority: 'important'
    }
  )
  
  // 2. جدولة رسالة متابعة بعد 24 ساعة
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  await notificationService.schedule(
    {
      message: `
        👋 هل تحتاج مساعدة؟
        
        فريق الدعم جاهز لمساعدتك في أي وقت!
      `,
      type: 'info',
      priority: 'normal'
    },
    {
      audience: 'specific_users',
      userIds: [userId]
    },
    {
      scheduledAt: tomorrow
    }
  )
  
  // 3. جدولة تذكير أسبوعي
  await notificationService.scheduleRecurring(
    {
      message: '📊 ملخصك الأسبوعي متاح الآن!',
      type: 'info',
      priority: 'normal'
    },
    {
      audience: 'specific_users',
      userIds: [userId]
    },
    {
      recurring: true,
      recurringConfig: {
        interval: 'weekly',
        dayOfWeek: 1,  // الإثنين
        time: '09:00'
      }
    }
  )
}
```

---

### مثال 2: نظام تنبيهات للمشرفين

```typescript
async function alertAdminsAboutNewJoinRequest(
  requestId: number,
  userName: string,
  userPhone: string
) {
  await notificationService.sendToAdmins({
    message: `
      🔔 طلب انضمام جديد
      
      الاسم: ${userName}
      الهاتف: ${userPhone}
      
      يرجى المراجعة والموافقة.
    `,
    type: 'alert',
    priority: 'high',
    buttons: [
      [
        { text: '✅ موافقة', callback_data: `approve_${requestId}` },
        { text: '❌ رفض', callback_data: `reject_${requestId}` }
      ]
    ]
  })
}
```

---

### مثال 3: حملة إعلانية مجدولة

```typescript
async function scheduleCampaign() {
  // إرسال للمستخدمين النشطين
  const activeResult = await notificationService.sendToActiveUsers({
    message: `
      🎁 عرض خاص!
      
      خصم 50% على جميع الخدمات
      العرض ساري لمدة 24 ساعة فقط!
    `,
    type: 'announcement',
    priority: 'important'
  })
  
  // إرسال للمستخدمين غير النشطين بعد يوم
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  await notificationService.schedule(
    {
      message: `
        😢 نفتقدك!
        
        خصم حصري 60% لك فقط
        عد الآن واستفد من العرض!
      `,
      type: 'reminder',
      priority: 'high'
    },
    {
      audience: 'inactive_users'
    },
    {
      scheduledAt: tomorrow
    }
  )
  
  return {
    activeSent: activeResult.sentCount,
    inactiveScheduled: true
  }
}
```

---

### مثال 4: نظام تنبيهات أمنية

```typescript
async function securityAlert(
  eventType: 'login' | 'password_change' | 'suspicious_activity',
  userId: number,
  details: string
) {
  const messages = {
    login: '🔐 تم تسجيل دخول جديد',
    password_change: '⚠️ تم تغيير كلمة المرور',
    suspicious_activity: '🚨 نشاط مشبوه تم رصده'
  }
  
  // تنبيه المستخدم
  await notificationService.sendToUsers(
    [userId],
    {
      message: `
        ${messages[eventType]}
        
        ${details}
        
        إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً!
      `,
      type: eventType === 'suspicious_activity' ? 'error' : 'warning',
      priority: eventType === 'suspicious_activity' ? 'critical' : 'important'
    }
  )
  
  // تنبيه المشرفين للنشاط المشبوه
  if (eventType === 'suspicious_activity') {
    await notificationService.sendToAdmins({
      message: `
        🚨 نشاط مشبوه
        
        المستخدم: ${userId}
        التفاصيل: ${details}
      `,
      type: 'error',
      priority: 'critical'
    })
  }
}
```

---

## 🐛 استكشاف الأخطاء

### الخطأ: "Notifications are disabled"

**السبب:** الإشعارات معطلة في الإعدادات

**الحل:**
```typescript
import { settingsManager } from '#root/modules/settings'

await settingsManager.set('notifications.enabled', true)
```

---

### الخطأ: "Template not found"

**السبب:** القالب غير مسجل

**الحل:**
```typescript
// تأكد من تسجيل القالب أولاً
notificationService.registerTemplate(myTemplate)

// ثم استخدمه
await notificationService.sendFromTemplate('template_id', ...)
```

---

### الخطأ: "Missing template variables"

**السبب:** لم توفر جميع المتغيرات المطلوبة

**الحل:**
```typescript
// تحقق من المتغيرات المطلوبة
const template = notificationService.getTemplate('my_template')
const validation = template.validateVariables(myVariables)

if (!validation.valid) {
  console.log('المتغيرات الناقصة:', validation.missing)
}
```

---

### الخطأ: بطء في الإرسال

**السبب:** إرسال لعدد كبير بدون batch

**الحل:**
```typescript
// ✅ استخدم batch config
await notificationService.sendToAllUsers(
  config,
  {
    batchSize: 50,
    delayBetweenBatches: 1000
  }
)
```

---

## 💡 أفضل الممارسات

### 1. استخدم الأنواع المناسبة
```typescript
// ✅ جيد
type: 'error'      // للأخطاء
type: 'warning'    // للتحذيرات
type: 'success'    // للنجاح
type: 'info'       // للمعلومات

// ❌ سيء
type: 'info'       // لكل شيء!
```

### 2. حدد الأولوية بحكمة
```typescript
// ✅ جيد
priority: 'critical'  // للأخطاء الحرجة فقط
priority: 'normal'    // للرسائل العادية

// ❌ سيء
priority: 'critical' // لكل شيء!
```

### 3. استخدم Batch للأعداد الكبيرة
```typescript
// ✅ جيد - مع batch
await notificationService.sendToAllUsers(config, {
  batchSize: 50,
  delayBetweenBatches: 1000
})

// ❌ سيء - بدون batch (قد يسبب حظر من Telegram)
await notificationService.sendToAllUsers(config)
```

### 4. احترم تفضيلات المستخدم
```typescript
// قبل الإرسال المباشر، تحقق من التفضيلات
const prefs = notificationService.getUserPreferences(userId)
if (!prefs?.enabled) {
  console.log('المستخدم أوقف الإشعارات')
  return
}
```

### 5. تابع النتائج
```typescript
const result = await notificationService.send(...)

// دائماً تحقق من النتيجة
if (!result.success) {
  logger.error('Failed notifications:', result.failedUserIds)
  // اتخذ إجراء (إعادة محاولة، تسجيل، إلخ)
}
```

---

## 📚 مراجع إضافية

- [Template Management Service](./01_Notifications_Templates.md)
- [Smart Variables Service](./01_Notifications_SmartVariables.md)
- [Notification Database Service](./01_Notifications_Database.md)
- [أمثلة متقدمة](../../70_أمثلة_تدفقات/03_نظام_الإشعارات.md)

---

**آخر تحديث:** 21 أكتوبر 2025  
**الإصدار:** 1.0.0
