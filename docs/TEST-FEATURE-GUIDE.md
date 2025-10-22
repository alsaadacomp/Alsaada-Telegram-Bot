# 🧪 Test Feature - دليل الاستخدام

**قسم تجريبي لعرض جميع الوحدات المبنية**

---

## 🚀 كيفية الاستخدام

### 1️⃣ شغّل البوت
```bash
npm run dev
```

### 2️⃣ افتح البوت في Telegram

### 3️⃣ ابدأ المحادثة
```
/start
```

سيظهر لك:
- رسالة ترحيب
- **زر Keyboard: "📋 القائمة الرئيسية"** ⬅️ هذا هو المفتاح!

### 4️⃣ اضغط على "📋 القائمة الرئيسية"

ستظهر قائمة Inline بالأقسام:
```
📋 القائمة الرئيسية

[🧪 قسم تجريبي]
[⚙️ الإعدادات]
```

### 5️⃣ اضغط على "🧪 قسم تجريبي"

ستظهر الأقسام الفرعية:
```
🧪 قسم تجريبي

[📝 نموذج تجريبي]
[🔄 نموذج متعدد الخطوات]
[📊 جدول بيانات تجريبي]
[⬅️ رجوع]
```

### 6️⃣ اختر أي قسم فرعي

سيظهر لك:
- معلومات مفصلة عن الوحدة
- أمثلة على الكود
- عدد الاختبارات
- المميزات الكاملة

---

## 📋 الأقسام الفرعية

### 📝 نموذج تجريبي
**يعرض: Form Builder Module**
- 73 اختبار ✅
- TextField, EmailField, PhoneField
- NumberField, SelectField
- 62+ Validator Functions

### 🔄 نموذج متعدد الخطوات
**يعرض: Multi-Step Forms Module**
- 130 اختبار ✅
- MultiStepForm, StepNavigation
- ProgressTracker
- Conversations Integration

### 📊 جدول بيانات تجريبي
**يعرض: Data Tables Module**
- 118 اختبار ✅
- DataTable Builder
- Sorting, Filtering, Pagination
- Export (CSV, JSON, HTML, MD)
- Prisma Integration

---

## 🎯 النظام الكامل

```
المستخدم
    ↓
/start → Keyboard Button "📋 القائمة الرئيسية"
    ↓
يضغط على الزر
    ↓
Inline Menu (الأقسام الرئيسية)
    ↓
🧪 قسم تجريبي
    ↓
Inline Menu (الأقسام الفرعية)
    ↓
📝 نموذج تجريبي / 🔄 متعدد الخطوات / 📊 جدول بيانات
    ↓
عرض معلومات الوحدة
```

---

## ⚙️ التخصيص

### تعطيل القسم التجريبي
في `src/bot/features/test-feature/config.ts`:
```typescript
enabled: false // ← القسم يختفي!
```

### تغيير الصلاحيات
```typescript
permissions: ['ADMIN'] // فقط للمديرين
```

### تغيير الترتيب
```typescript
order: 10 // يظهر متأخراً
```

---

## 🔧 الملفات

```
src/bot/features/
├── test-feature/
│   ├── config.ts              ← التكوين
│   ├── index.ts               ← نقطة الدخول
│   └── handlers/
│       ├── form-demo.ts       ← عرض Forms
│       ├── multi-step-demo.ts ← عرض Multi-Step
│       └── table-demo.ts      ← عرض Tables
│
├── main-menu.ts               ← معالج القائمة الرئيسية
└── welcome.ts                 ← زر Keyboard هنا!
```

---

## 💡 ملاحظات

- ✅ زر Keyboard دائم (persistent)
- ✅ يظهر في جميع الرسائل
- ✅ Auto-Discovery يكتشف القسم تلقائياً
- ✅ جميع الوحدات مختبرة (321 اختبار!)

---

## 🎉 النتيجة

الآن لديك:
1. ✅ زر Keyboard "📋 القائمة الرئيسية"
2. ✅ قوائم Inline ديناميكية
3. ✅ قسم تجريبي كامل
4. ✅ 3 أقسام فرعية تعرض جميع الوحدات
5. ✅ نظام Auto-Discovery يعمل 100%

**جرّب الآن!** 🚀
