# 🚀 دليل التدفقات التفاعلية

## 📋 نظرة عامة

تم إنشاء تدفقات تفاعلية كاملة وعملية في القسم التجريبي (Test Feature) لعرض إمكانيات الوحدات المبنية.

---

## 📝 النموذج التجريبي (Form Demo)

### الوصف
تدفق تفاعلي كامل لجمع بيانات المستخدم خطوة بخطوة.

### المسار
```
القائمة الرئيسية → 🧪 قسم تجريبي → 📝 نموذج تجريبي
```

### الحقول المطلوبة
1. **الاسم الكامل** (3-50 حرف)
2. **البريد الإلكتروني** (تحقق من الصيغة)
3. **رقم الهاتف المصري** (010/011/012/015 + 8 أرقام)
4. **العمر** (18-100)
5. **القسم** (اختيار من قائمة)

### المميزات
- ✅ **تحقق فوري** من كل حقل
- ✅ **رسائل خطأ واضحة** عند إدخال بيانات خاطئة
- ✅ **حفظ تلقائي** للبيانات
- ✅ **إمكانية عرض البيانات** المحفوظة في أي وقت
- ✅ **إمكانية حذف البيانات** والبدء من جديد

### الكود المصدري
```
src/bot/features/test-feature/handlers/form-demo.ts
```

---

## 🔄 النموذج متعدد الخطوات (Multi-Step Demo)

### الوصف
رحلة تفاعلية من 5 خطوات مع تتبع التقدم والتنقل المرن.

### المسار
```
القائمة الرئيسية → 🧪 قسم تجريبي → 🔄 نموذج متعدد الخطوات
```

### الخطوات
1. **الترحيب** - مقدمة للرحلة
2. **المعلومات الشخصية** - اختيار الفئة العمرية
3. **الاهتمامات** - اختيار الاهتمام الرئيسي
4. **التفضيلات** - اختيار طريقة التواصل المفضلة
5. **التأكيد** - عرض ملخص شامل

### المميزات
- ✅ **شريط تقدم مرئي** (▰▰▱▱▱ 40%)
- ✅ **التنقل للأمام والخلف** بين الخطوات
- ✅ **حفظ البيانات** تلقائياً بين الخطوات
- ✅ **إمكانية الإلغاء** في أي وقت
- ✅ **عرض حالة التقدم** الحالية
- ✅ **ملخص نهائي** لجميع البيانات

### الكود المصدري
```
src/bot/features/test-feature/handlers/multi-step-demo.ts
```

---

## 📊 جدول البيانات التجريبي (Table Demo)

### الوصف
عرض توضيحي لإمكانيات Data Tables Module.

### المسار
```
القائمة الرئيسية → 🧪 قسم تجريبي → 📊 جدول بيانات تجريبي
```

### المميزات المعروضة
- ✅ **عرض بيانات منسقة** في جداول
- ✅ **أعمدة متنوعة** (نص، رقم، منطقي)
- ✅ **تنسيق مخصص** للقيم (✅/❌ للقيم المنطقية)
- ✅ **الفرز والتصفية** على الأعمدة
- ✅ **التقسيم إلى صفحات** (Pagination)
- ✅ **تصدير** بصيغة Markdown

### الكود المصدري
```
src/bot/features/test-feature/handlers/table-demo.ts
```

---

## 🔧 البنية التقنية

### نظام التسجيل التلقائي

جميع التدفقات مُسجلة تلقائياً عبر:

1. **Feature Auto-Discovery System**
   - يفحص مجلد `src/bot/features/`
   - يُحمل `config.ts` و `index.ts` تلقائياً
   - يُسجل الـ composers للتعامل مع الـ callbacks

2. **ترتيب التسجيل**
   ```typescript
   // في src/bot/index.ts

   // 1. تحميل جميع Features
   const loadResult = await featureLoader.loadAll()

   // 2. تسجيل Composers الخاصة بكل Feature
   loadResult.loadedFeatures.forEach((featureId) => {
     const feature = featureRegistry.get(featureId)
     if (feature && feature.composer) {
       protectedBot.use(feature.composer)
     }
   })

   // 3. تسجيل Main Menu (بعد Feature Composers)
   protectedBot.use(mainMenuComposer)
   ```

3. **أسبقية المعالجة**
   - Feature composers تُعالج أولاً (لتدفقاتها الخاصة)
   - Main menu composer يُعالج ثانياً (للتنقل العام)

---

## 📦 الوحدات المستخدمة

### Form Builder Module
```typescript
// تخزين مؤقت للبيانات
const formData = new Map<number, any>()

// تعقب الخطوات
formData.set(userId, { step: 'name' })

// التحقق من البيانات
if (text.length < 3 || text.length > 50) {
  await ctx.reply('❌ الاسم يجب أن يكون بين 3 و 50 حرف')
}
```

### Multi-Step Forms Module
```typescript
// حالة التدفق
const formState = new Map<number, any>()

// تتبع التقدم
const progress = Math.round((step / totalSteps) * 100)
const progressBar = '▰'.repeat(step) + '▱'.repeat(totalSteps - step)
```

### Inline Keyboards Builder
```typescript
// بناء لوحة المفاتيح
const keyboard = new InlineKeyboard()
  .text('👥 الموارد البشرية', 'dept:hr')
  .row()
  .text('💰 المالية', 'dept:finance')
  .row()
```

### Data Tables Module
```typescript
// إنشاء جدول
const dataTable = new DataTable(columns, data)

// الفرز
dataTable.sortBy('age', 'desc')

// التصفية
dataTable.filterBy('city', 'London')

// التصدير
const markdown = dataTable.export('markdown')
```

---

## 🎯 كيفية إنشاء تدفق جديد

### الخطوة 1: إنشاء المعالج
```typescript
// src/bot/features/your-feature/handlers/your-flow.ts

import type { Context } from '../../../context.js'
import { Composer, InlineKeyboard } from 'grammy'

export const yourFlowHandler = new Composer<Context>()

// معالج البداية
yourFlowHandler.callbackQuery(/^menu:sub:your-feature:your-flow$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  const keyboard = new InlineKeyboard()
    .text('ابدأ', 'your-flow:start')
    .row()
    .text('⬅️ رجوع', 'menu:back')

  await ctx.editMessageText(
    '🚀 **عنوان تدفقك**\n\nالوصف...',
    {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    }
  )
})

// معالجات إضافية...
yourFlowHandler.callbackQuery('your-flow:start', async (ctx) => {
  // منطق التدفق
})
```

### الخطوة 2: تسجيل المعالج
```typescript
// src/bot/features/your-feature/index.ts

import { Composer } from 'grammy'
import { yourFeatureConfig } from './config.js'
import { yourFlowHandler } from './handlers/your-flow.js'

export const composer = new Composer()

// تسجيل المعالج
composer.use(yourFlowHandler)

export { yourFeatureConfig as config }
```

### الخطوة 3: إضافة Sub-Feature في الـ Config
```typescript
// src/bot/features/your-feature/config.ts

export const yourFeatureConfig: FeatureConfig = {
  id: 'your-feature',
  name: 'قسمك',
  enabled: true,
  subFeatures: [
    {
      id: 'your-flow',
      name: '🚀 تدفقك الجديد',
      icon: '🚀',
      handler: 'yourFlowHandler',
      permissions: ['ADMIN', 'EMPLOYEE'],
    },
  ],
}
```

---

## ✅ أفضل الممارسات

### 1. التخزين المؤقت
```typescript
// استخدم Map لتخزين حالة المستخدم
const userState = new Map<number, any>()

// نظف البيانات عند الانتهاء
userState.delete(userId)
```

### 2. معالجة الأخطاء
```typescript
try {
  // منطق التدفق
}
catch (error) {
  console.error('Error:', error)
  await ctx.answerCallbackQuery('حدث خطأ')
}
```

### 3. التحقق من البيانات
```typescript
// تحقق فوري عند كل إدخال
if (!isValid(input)) {
  await ctx.reply('❌ البيانات غير صحيحة. حاول مرة أخرى.')
}
```

### 4. رسائل واضحة
```typescript
// استخدم رسائل واضحة ومنسقة
await ctx.editMessageText(
  '📝 **الخطوة 1/5: الاسم**\n\n'
  + 'الرجاء إدخال اسمك الكامل:\n\n'
  + '✅ 3-50 حرف\n'
  + '_مثال: أحمد محمد_',
  { parse_mode: 'Markdown' }
)
```

### 5. زر الرجوع
```typescript
// دائماً وفر زر رجوع
const keyboard = new InlineKeyboard()
  .text('⬅️ رجوع', 'menu:back')
```

---

## 🧪 الاختبار

### اختبار يدوي
1. شغل البوت: `npm run dev`
2. اضغط على زر "📋 القائمة الرئيسية"
3. اختر "🧪 قسم تجريبي"
4. جرب كل تدفق تفاعلي

### اختبار السيناريوهات
- ✅ إدخال بيانات صحيحة
- ❌ إدخال بيانات خاطئة
- ↩️ التنقل بين الخطوات
- 🗑️ حذف البيانات
- ❌ إلغاء العملية

---

## 📚 موارد إضافية

### الوثائق الأخرى
- [Feature Auto-Discovery System](./FEATURE-SYSTEM-SUMMARY.md)
- [Form Builder Module](../Documentation/conversations_plugin_doc.md)
- [Multi-Step Forms](./MULTI-STEP-FORMS-MODULE.md)
- [Data Tables](./DATA-TABLES-MODULE.md)
- [Inline Keyboards](./INLINE-KEYBOARDS-MODULE.md)

### الكود المصدري
```
src/bot/features/test-feature/
├── config.ts                       # تكوين القسم
├── index.ts                        # نقطة الدخول
└── handlers/
    ├── form-demo.ts                # تدفق النموذج
    ├── multi-step-demo.ts          # تدفق متعدد الخطوات
    └── table-demo.ts               # عرض الجداول
```

---

## 🎉 ملخص

**التدفقات التفاعلية الآن جاهزة وتعمل بالكامل!**

- ✅ **3 تدفقات تفاعلية** كاملة
- ✅ **تسجيل تلقائي** عبر Feature System
- ✅ **تحقق من البيانات** في الوقت الفعلي
- ✅ **تخزين وحفظ** للحالة
- ✅ **تنقل سلس** بين الخطوات
- ✅ **رسائل واضحة** ومنسقة
- ✅ **معالجة الأخطاء** الشاملة

---

**🚀 جاهز للاستخدام الآن!**
