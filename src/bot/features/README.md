# 📁 Features Directory - مجلد الأقسام

هذا المجلد يحتوي على جميع أقسام البوت مع نظام **الاكتشاف التلقائي**.

---

## 🚀 إضافة قسم جديد - خطوات سريعة

### 1️⃣ أنشئ مجلد
```
src/bot/features/your-feature-name/
```

### 2️⃣ أنشئ `config.ts`
```typescript
import type { FeatureConfig } from '../registry/types.js'

export const yourFeatureConfig: FeatureConfig = {
  id: 'your-feature-name', // ⚠️ يجب أن يكون فريداً
  name: 'اسم القسم',
  icon: '🎯',
  enabled: true, // true = يظهر | false = مخفي
  order: 1, // الترتيب (أقل رقم = يظهر أولاً)
  permissions: ['ADMIN'], // من يمكنه الوصول
  subFeatures: [
    {
      id: 'sub-feature-1',
      name: 'القسم الفرعي الأول',
      icon: '📝',
      handler: 'handler1',
      enabled: true,
      permissions: ['ADMIN'], // صلاحيات القسم الفرعي
    },
  ],
}
```

### 3️⃣ أنشئ `index.ts`
```typescript
import type { Context } from '../../context.js'
import { Composer } from 'grammy'
import { yourFeatureConfig } from './config.js'

export const composer = new Composer<Context>()

// معالج القسم الفرعي
composer.callbackQuery(/^menu:sub:your-feature-name:sub-feature-1$/, async (ctx) => {
  await ctx.answerCallbackQuery()

  await ctx.editMessageText(
    '✅ **القسم الفرعي الأول**\n\nمرحباً!',
    { parse_mode: 'Markdown' }
  )
})

export { yourFeatureConfig as config } // ✅ إجباري
```

### 4️⃣ أعد تشغيل البوت
```bash
npm run dev
```

**🎉 القسم سيظهر تلقائياً!**

---

## 📂 الهيكل الموصى به

```
your-feature/
├── config.ts              # ✅ التكوين (إجباري)
├── index.ts               # ✅ نقطة الدخول (إجباري)
└── handlers/              # ⚠️ المعالجات (اختياري - لتنظيم أفضل)
    ├── sub-feature-1.ts
    ├── sub-feature-2.ts
    └── sub-feature-3.ts
```

---

## 🎯 أمثلة جاهزة

### 📌 مثال بسيط
انظر: `settings/` - قسم بسيط بدون handlers منفصلة

### 📌 مثال متقدم مع تدفقات تفاعلية
انظر: `test-feature/` - قسم كامل مع:
- ✅ 3 أقسام فرعية
- ✅ معالجات منظمة في `handlers/`
- ✅ تدفقات تفاعلية كاملة

---

## 📖 التوثيق الشامل المفصل

👉 **[docs/CREATE-NEW-FEATURE-GUIDE.md](../../../docs/CREATE-NEW-FEATURE-GUIDE.md)**

يحتوي على:
- ✅ شرح تفصيلي خطوة بخطوة
- ✅ أمثلة عملية كاملة (قسم الموارد البشرية)
- ✅ أفضل الممارسات
- ✅ استكشاف وحل الأخطاء
- ✅ نماذج جاهزة للنسخ واللصق

---

## 📋 الأقسام الموجودة

### الأقسام الثابتة (Built-in)
- `admin.ts` - أوامر الإدارة
- `language.ts` - تبديل اللغة
- `welcome.ts` - رسالة الترحيب
- `unhandled.ts` - معالج الأوامر غير المعروفة
- `main-menu.ts` - القائمة الرئيسية الديناميكية

### الأقسام الديناميكية (Auto-Discovered)
- `settings/` - قسم الإعدادات ✅
- `test-feature/` - قسم تجريبي ✅
- *(أضف أقسامك هنا)*

---

## 🔧 نظام Registry

المجلد `registry/` يحتوي على النظام الأساسي:
- `types.ts` - التعريفات (Types)
- `feature-registry.ts` - تخزين الأقسام
- `feature-loader.ts` - محرك الاكتشاف التلقائي
- `menu-builder.ts` - بناء القوائم الديناميكية

---

## ⚙️ الإعدادات المهمة

### 🔑 الصلاحيات المتاحة
```typescript
type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'GUEST'
```

| الصلاحية | الوصف |
|----------|-------|
| `SUPER_ADMIN` | المدير الأعلى - كامل الصلاحيات |
| `ADMIN` | مدير - معظم الصلاحيات |
| `EMPLOYEE` | موظف - صلاحيات محدودة |
| `GUEST` | ضيف - قراءة فقط |

### 📌 Pattern الـ Callback Data
```typescript
// للقسم الرئيسي
menu:feature:FEATURE_ID

// للقسم الفرعي
menu:sub:FEATURE_ID:SUBFEATURE_ID

// أمثلة
menu:feature:hr-department
menu:sub:hr-department:employees-list
```

---

## ✅ نقاط أساسية

- ✅ كل قسم يجب أن يكون له `id` **فريد**
- ✅ استخدم `enabled: false` لإخفاء قسم بدون حذفه
- ✅ `permissions: []` أو عدم تحديدها = متاح للجميع
- ✅ استخدم `order` للتحكم في ترتيب الظهور (1 = أول، 99 = آخر)
- ✅ دائماً ضع زر "⬅️ رجوع" في معالجاتك

---

## 🐛 استكشاف الأخطاء الشائعة

### ❌ القسم لا يظهر؟
1. ✅ تحقق من `enabled: true`
2. ✅ تحقق من `permissions` (أو احذفها للاختبار)
3. ✅ تحقق من تصدير `config` في `index.ts`
4. ✅ راجع لوج البوت عند التشغيل

### ❌ خطأ "Feature already registered"?
- يوجد قسمان بنفس الـ `id`
- تأكد أن كل `id` فريد في جميع الأقسام

### ❌ المعالج لا يعمل؟
- ✅ تحقق من Pattern الـ `callbackQuery`
- ✅ تأكد أن المعالج مُسجل في `composer.use()`
- ✅ راجع console للأخطاء

---

## ✨ مميزات النظام

- ✅ **اكتشاف تلقائي** - لا حاجة لتسجيل يدوي
- ✅ **تفعيل/إيقاف** - علم واحد للتحكم في الظهور
- ✅ **صلاحيات متقدمة** - للقسم الرئيسي والفرعي
- ✅ **قوائم ديناميكية** - تُبنى تلقائياً
- ✅ **متعدد المستويات** - أقسام رئيسية + فرعية

---

## 📚 موارد إضافية

### وثائق النظام
- 📘 **[دليل إنشاء الأقسام](../../../docs/CREATE-NEW-FEATURE-GUIDE.md)** - شامل ومفصل
- 📄 **[ملخص النظام](../../../docs/FEATURE-SYSTEM-SUMMARY.md)** - نظرة عامة
- 📄 **[دليل التدفقات](../../../docs/INTERACTIVE-FLOWS-GUIDE.md)** - التدفقات التفاعلية
- 📄 **[Registry README](./registry/README.md)** - شرح تقني للنظام

### الوحدات المتاحة للاستخدام
- 📝 **Form Builder** - نماذج تفاعلية
- 🔄 **Multi-Step Forms** - نماذج متعددة الخطوات
- ⌨️ **Inline Keyboards** - لوحات مفاتيح مخصصة
- 📊 **Data Tables** - جداول بيانات تفاعلية
- 🔔 **Notifications** - نظام إشعارات
- 📈 **Analytics** - تحليلات وتقارير

---

## 🚀 ابدأ الآن!

انسخ مجلد `test-feature/` وعدّل عليه، أو أنشئ مجلدك من الصفر!

**حظاً موفقاً! 💪🎉**
