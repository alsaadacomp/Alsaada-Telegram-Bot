# 🔔 دليل نظام الإشعارات الاحترافي

## 📚 نظرة عامة

نظام إشعارات شامل وقوي يدعم:
- ✅ إرسال إشعارات فردية وجماعية
- ✅ 7 أنواع مختلفة من الإشعارات
- ✅ 4 مستويات للأولوية
- ✅ 8 فئات مستهدفة مختلفة
- ✅ قوالب جاهزة قابلة للتخصيص
- ✅ جدولة وتكرار الإشعارات
- ✅ سجل وإحصائيات تفصيلية
- ✅ تفضيلات المستخدم وساعات الهدوء

---

## 🎯 كيفية عمل النظام

### 1. **الإعدادات العامة** (Settings)

يمكن للسوبر أدمن التحكم في الإعدادات العامة من: **⚙️ الإعدادات → 🔔 إعدادات الإشعارات**

#### إعدادات متاحة:

| الإعداد | الوصف | القيمة الافتراضية |
|--------|------|-------------------|
| `notifications.enabled` | تفعيل/تعطيل نظام الإشعارات بالكامل | `true` (مفعل) |
| `notifications.default_priority` | الأولوية الافتراضية للإشعارات الجديدة | `normal` (عادي) |

**مثال:**
- إذا قمت بتعطيل `notifications.enabled`، لن يتم إرسال **أي** إشعار في النظام بالكامل.
- إذا غيرت `default_priority` إلى `critical`، كل الإشعارات الجديدة التي لم تحدد أولويتها ستكون حرجة.

---

### 2. **أنواع الإشعارات** (Notification Types)

يدعم النظام 7 أنواع:

| النوع | الرمز | الاستخدام |
|------|------|-----------|
| `info` | ℹ️ | معلومات عامة |
| `success` | ✅ | إخطار نجاح عملية |
| `warning` | ⚠️ | تحذيرات |
| `error` | ❌ | أخطاء |
| `announcement` | 📢 | إعلانات عامة |
| `reminder` | 🔔 | تذكيرات |
| `alert` | 🚨 | تنبيهات عاجلة |

**مثال على الاستخدام:**
```typescript
// إرسال إشعار نجاح
await notificationService.sendToAllUsers({
  message: 'تم إضافة المنتج بنجاح!',
  type: 'success',
  priority: 'normal'
})

// إرسال تنبيه حرج
await notificationService.sendToAdmins({
  message: 'اكتشاف محاولة اختراق!',
  type: 'alert',
  priority: 'critical'
})
```

---

### 3. **مستويات الأولوية** (Priority Levels)

4 مستويات من الأولوية:

| المستوى | الرمز | الوصف |
|---------|------|-------|
| `normal` | 🔵 | إشعارات عادية |
| `important` | 🟡 | إشعارات مهمة تحتاج انتباه |
| `urgent` | 🟠 | إشعارات عاجلة |
| `critical` | 🔴 | إشعارات حرجة جداً |

**التأثير:**
- عندما تضبط الأولوية الافتراضية على `critical`، كل إشعار جديد (بدون أولوية محددة) سيصبح حرجاً.

---

### 4. **الفئات المستهدفة** (Target Audiences)

8 فئات مختلفة:

| الفئة | الوصف | مثال استخدام |
|------|-------|--------------|
| `all_users` | 👥 جميع المستخدمين | إعلانات عامة |
| `all_admins` | 👨‍💼 جميع الإداريين | تحديثات إدارية |
| `super_admin` | ⭐ السوبر أدمن فقط | تنبيهات نظام حرجة |
| `role` | 🎭 دور محدد (ADMIN, USER, etc.) | إشعارات خاصة بدور |
| `specific_users` | 📌 مستخدمون محددون | إشعارات شخصية |
| `active_users` | ✅ المستخدمون النشطون | عروض خاصة |
| `inactive_users` | 💤 المستخدمون غير النشطين | تذكير بالعودة |
| `new_users` | 🆕 المستخدمون الجدد | رسائل ترحيب |

**مثال:**
```typescript
// إرسال لجميع المستخدمين النشطين
await notificationService.sendToActiveUsers({
  message: 'عرض خاص لمدة 24 ساعة! 🎉',
  type: 'announcement',
  priority: 'important'
})

// إرسال للسوبر أدمن فقط
await notificationService.sendToSuperAdmin({
  message: 'تم اكتشاف خطأ في قاعدة البيانات',
  type: 'error',
  priority: 'critical'
})
```

---

## 🎨 لوحة الإشعارات (Notifications Panel)

### الوصول:
**القائمة الرئيسية → 🔔 لوحة الإشعارات**

### الأقسام المتاحة:

#### 1. **📤 إرسال إشعار**

**إشعار فردي:**
- إرسال إشعار لمستخدم محدد (قريباً)

**إشعار جماعي:**
1. اختر الفئة المستهدفة (كل المستخدمين، الإداريين، إلخ)
2. اختر نوع الإشعار (معلومات، تحذير، إلخ)
3. اختر الأولوية (عادي، مهم، عاجل، حرج)
4. أدخل نص الرسالة
5. إرسال

#### 2. **📋 القوالب الجاهزة**

قوالب محددة مسبقاً للاستخدامات الشائعة:

| القالب | الوصف | المتغيرات |
|--------|-------|-----------|
| 👋 **ترحيب** | رسالة ترحيب للمستخدمين الجدد | `userName`, `botName` |
| ✅ **تسجيل ناجح** | إشعار نجاح التسجيل | `userName`, `userId` |
| 📊 **تقرير جاهز** | إشعار بجاهزية التقرير | `reportName`, `date` |
| 🚨 **تنبيه نظام** | تنبيه لمشكلة في النظام | `alertMessage`, `timestamp` |
| 🚫 **حظر مستخدم** | إشعار بحظر مستخدم | `userName`, `reason`, `adminName` |
| 🔧 **وضع صيانة** | إعلان وضع الصيانة | `startTime`, `duration` |

**مثال على الاستخدام:**
```typescript
// إرسال من قالب
await notificationService.sendFromTemplate(
  'welcome',
  { audience: 'specific_users', userIds: [12345] },
  { userName: 'أحمد', botName: 'بوت السعادة' }
)
```

#### 3. **📊 سجل الإشعارات**

- عرض آخر 10 إشعارات تم إرسالها
- يظهر الحالة، النوع، الأولوية، عدد المستلمين، النجاح/الفشل
- إمكانية مسح السجل

#### 4. **📈 إحصائيات الإشعارات**

إحصائيات شاملة تشمل:
- **المجموع الكلي**: عدد الإشعارات، نسبة النجاح
- **حسب الحالة**: مرسل، فشل، معلق، مجدول، ملغي
- **حسب الأولوية**: عادي، مهم، عاجل، حرج
- **حسب النوع**: معلومات، نجاح، تحذير، خطأ، إعلان، تذكير، تنبيه
- **حسب الفئة المستهدفة**: كل المستخدمين، الإداريين، إلخ

---

## 💻 الاستخدام البرمجي (للمطورين)

### 1. **الإرسال البسيط**

```typescript
import { NotificationService } from '#root/modules/notifications/notification-service.js'

const notificationService = new NotificationService()

// إرسال لجميع المستخدمين
await notificationService.sendToAllUsers({
  message: 'إعلان مهم!',
  type: 'announcement',
  priority: 'important'
})

// إرسال للإداريين
await notificationService.sendToAdmins({
  message: 'تقرير جديد متاح',
  type: 'info'
})

// إرسال للسوبر أدمن
await notificationService.sendToSuperAdmin({
  message: 'تنبيه أمني',
  type: 'alert',
  priority: 'critical'
})
```

### 2. **الإرسال حسب الدور**

```typescript
// إرسال لدور معين
await notificationService.sendToRole('ADMIN', {
  message: 'اجتماع الإدارة غداً',
  type: 'reminder',
  priority: 'important'
})
```

### 3. **الإرسال لمستخدمين محددين**

```typescript
// إرسال لمستخدمين محددين
await notificationService.sendToUsers(
  [123, 456, 789], // معرفات المستخدمين
  {
    message: 'رسالة خاصة',
    type: 'info'
  }
)
```

### 4. **جدولة الإشعارات**

```typescript
// جدولة إشعار في وقت محدد
const notificationId = await notificationService.schedule(
  {
    message: 'تذكير بالاجتماع',
    type: 'reminder',
    priority: 'important'
  },
  { audience: 'all_admins' },
  { scheduledAt: new Date('2024-12-25 10:00:00') }
)

// إلغاء إشعار مجدول
notificationService.cancelScheduled(notificationId)
```

### 5. **الإشعارات المتكررة**

```typescript
// إشعار يومي
await notificationService.scheduleRecurring(
  {
    message: 'تقرير يومي',
    type: 'info'
  },
  { audience: 'all_admins' },
  {
    recurring: {
      frequency: 'daily',
      time: '09:00' // كل يوم الساعة 9 صباحاً
    }
  }
)

// إشعار أسبوعي
await notificationService.scheduleRecurring(
  {
    message: 'تقرير أسبوعي',
    type: 'info'
  },
  { audience: 'super_admin' },
  {
    recurring: {
      frequency: 'weekly',
      daysOfWeek: [1], // الإثنين (0 = الأحد)
      time: '10:00'
    }
  }
)
```

### 6. **استخدام القوالب**

```typescript
// إنشاء قالب مخصص
import { NotificationTemplateBuilder } from '#root/modules/notifications/core/notification-template.js'

const template = new NotificationTemplateBuilder(
  'custom_template',
  'قالب مخصص',
  'مرحباً {{userName}}، لديك {{count}} رسائل جديدة'
)
template.setType('info')
template.setPriority('normal')
template.setVariables(['userName', 'count'])

// تسجيل القالب
notificationService.registerTemplate(template)

// استخدام القالب
await notificationService.sendFromTemplate(
  'custom_template',
  { audience: 'specific_users', userIds: [123] },
  { userName: 'أحمد', count: 5 }
)
```

### 7. **تفضيلات المستخدم**

```typescript
// ضبط تفضيلات المستخدم
notificationService.setUserPreferences(123, {
  enabled: true,
  types: ['info', 'announcement'], // يستقبل فقط المعلومات والإعلانات
  priorities: ['important', 'critical'], // يستقبل فقط المهم والحرج
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00' // لا إشعارات من 10 مساءً إلى 8 صباحاً
  }
})
```

### 8. **الإحصائيات والسجل**

```typescript
// الحصول على السجل
const history = notificationService.getHistory(20) // آخر 20 إشعار

// الحصول على الإحصائيات
const stats = notificationService.getStatistics()
console.log(`معدل النجاح: ${stats.successRate}%`)
console.log(`الإجمالي: ${stats.total}`)

// مسح السجل
notificationService.clearHistory()
```

---

## 🔧 أمثلة عملية

### مثال 1: نظام تسجيل المستخدمين

```typescript
// عند تسجيل مستخدم جديد
async function onUserRegistered(user: any) {
  // 1. إرسال ترحيب للمستخدم
  await notificationService.sendToUsers(
    [user.userId],
    {
      message: `مرحباً ${user.name}! 👋\nشكراً لانضمامك إلينا.`,
      type: 'success',
      priority: 'normal'
    }
  )

  // 2. إخطار الإداريين
  await notificationService.sendToAdmins({
    message: `مستخدم جديد: ${user.name} (${user.userId})`,
    type: 'info',
    priority: 'normal'
  })
}
```

### مثال 2: نظام التقارير

```typescript
// عند جاهزية التقرير
async function onReportReady(report: any) {
  await notificationService.sendFromTemplate(
    'report_ready',
    { audience: 'super_admin' },
    {
      reportName: report.name,
      date: new Date().toLocaleDateString('ar')
    }
  )
}
```

### مثال 3: نظام التنبيهات

```typescript
// عند اكتشاف مشكلة
async function onSystemError(error: any) {
  await notificationService.sendToSuperAdmin({
    message: `⚠️ خطأ في النظام!\n\n${error.message}\n\nالوقت: ${new Date().toLocaleString('ar')}`,
    type: 'error',
    priority: 'critical'
  })
}
```

---

## ✨ الميزات المستقبلية

- [ ] نظام محادثة لإدخال الرسائل
- [ ] إرسال الإشعارات الفردية بالكامل
- [ ] ربط القوالب بقاعدة البيانات
- [ ] إشعارات عبر القنوات المتعددة (Email, SMS)
- [ ] تحليلات متقدمة ورسوم بيانية
- [ ] نظام الموافقات للإشعارات الحرجة
- [ ] إمكانية تحرير القوالب من الواجهة

---

## 📝 ملاحظات مهمة

1. **الإعدادات العامة** تؤثر على **جميع** الإشعارات في النظام
2. **تفضيلات المستخدم** لها أولوية على الإعدادات العامة
3. **ساعات الهدوء** تمنع الإشعارات في أوقات محددة
4. **السجل** يحفظ في الذاكرة حالياً (سيتم ربطه بقاعدة البيانات لاحقاً)
5. **القوالب** تدعم المتغيرات بصيغة `{{variableName}}`

---

## 🆘 الدعم

لأي استفسارات أو مشاكل، يرجى مراجعة:
- `src/modules/notifications/` - الكود الأساسي
- `src/bot/features/notifications-panel/` - واجهة البوت
- `src/modules/settings/default-settings.ts` - الإعدادات الافتراضية

---

**تم إنشاؤه بواسطة**: نظام إدارة البوت الاحترافي
**الإصدار**: 1.0.0
**التاريخ**: 2024
