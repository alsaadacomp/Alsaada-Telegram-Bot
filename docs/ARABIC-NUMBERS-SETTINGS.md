# 🔢 دليل الأرقام العربية والإعدادات

## نظرة عامة

تم تطوير البوت ليدعم **الأرقام العربية والإنجليزية** في جميع حقول الإدخال، مع **عرض المبالغ بفواصل الآلاف** بشكل احترافي، بالإضافة إلى **لوحة إعدادات شاملة** للسوبر أدمن.

---

## 1️⃣ دعم الأرقام العربية والإنجليزية

### ✨ الميزات:

- ✅ **قبول الأرقام العربية** (٠١٢٣٤٥٦٧٨٩) والإنجليزية (0123456789) في جميع الحقول
- ✅ **تحويل تلقائي** من العربية للإنجليزية قبل المعالجة
- ✅ **دعم الفواصل** (1,000 أو ١,٠٠٠)
- ✅ **عرض الأرقام بفواصل الآلاف** بشكل احترافي

### 📍 الملفات المتأثرة:

#### `src/modules/input/formatters/number-formatter.ts`

الوحدة الأساسية لتحويل وتنسيق الأرقام:

```typescript
// تحويل الأرقام العربية للإنجليزية
normalizeArabicNumbers('١٢٣٤٥') // '12345'

// عرض الأرقام بفواصل
formatNumberWithCommas(1234567) // '1,234,567'

// تحليل الأرقام (عربي/إنجليزي)
parseNumber('١,٢٣٤') // 1234
parseNumber('1,234.56') // 1234.56

// تنسيق العملات
formatCurrency(1234.5) // '1,234.50'
formatCurrency(1234.5, 'EGP') // '1,234.50 EGP'

// التحقق من صحة الرقم
isValidNumberString('١٢٣') // true
isValidNumberString('123.45') // true
```

#### المُحققات المُحدثة (Validators):

1. **`number.validator.ts`**: يقبل الأرقام العربية والإنجليزية
   ```typescript
   isValidNumber('١٢٣') // true
   isValidNumber('123') // true
   toNumber('١٢٣') // 123
   ```

2. **`phone.validator.ts`**: يقبل أرقام الموبايل بالعربية والإنجليزية
   ```typescript
   isValidEgyptPhone('٠١٠١٢٣٤٥٦٧٨') // true
   isValidEgyptPhone('01012345678') // true
   ```

---

## 2️⃣ عرض المبالغ بفواصل الآلاف

### 🎯 الاستخدام:

```typescript
import { formatCurrency, formatNumber } from '#root/modules/input/formatters/index.js'

// في أي معالج
const amount = 1234567
await ctx.reply(`المبلغ: ${formatNumber(amount)} جنيه`) // المبلغ: 1,234,567 جنيه

// مع العملة
await ctx.reply(`الإجمالي: ${formatCurrency(1234.56, 'EGP')}`) // الإجمالي: 1,234.56 EGP
```

### 📊 أمثلة:

| المدخل | المخرج |
|--------|--------|
| `1000` | `1,000` |
| `10000` | `10,000` |
| `100000` | `100,000` |
| `1000000` | `1,000,000` |
| `1234.56` | `1,234.56` |

---

## 3️⃣ نظام الإعدادات الشامل

### 🎛️ الوصول:

**SUPER_ADMIN فقط** يرى زر **"⚙️ الإعدادات"** في الكيبورد بجانب "📋 القائمة الرئيسية".

### 📋 أقسام الإعدادات:

#### 1. **🏢 بيانات الشركة**
- ✏️ تعديل اسم الشركة
- 📊 بيانات الشركة الأخرى (قابلة للتوسع)

**الاستخدام:**
1. اضغط "⚙️ الإعدادات"
2. اختر "🏢 بيانات الشركة"
3. اختر "✏️ تعديل اسم الشركة"
4. أرسل الاسم الجديد
5. ✅ يتم الحفظ تلقائياً في قاعدة البيانات

#### 2. **🔧 إعدادات البوت**
- 🔧 وضع الصيانة
- 📝 رسالة الترحيب
- 🌐 اللغة الافتراضية

#### 3. **🎯 تفعيل/إيقاف الأقسام**
- ✅ عرض جميع الأقسام مع حالتها (مفعّل/معطّل)
- 🔘 الضغط على أي قسم يبدل حالته فوراً
- ⚡ التغيير فوري بدون إعادة تشغيل

**مثال:**
```
✅ قسم تجريبي (مفعّل)
✅ لوحة التحكم (مفعّل)
❌ قسم المبيعات (معطّل)
```

#### 4. **🔒 إعدادات الأمان**
- 🔒 حد المحاولات (Rate Limit)
- 🚫 الحظر التلقائي عند السبام
- 🔐 حد محاولات تسجيل الدخول

#### 5. **📊 إعدادات قاعدة البيانات**
- 💾 النسخ الاحتياطي التلقائي
- 🗄️ حد النسخ الاحتياطية
- ⏰ فترة النسخ الاحتياطي

#### 6. **📝 إعدادات السجلات**
- 📝 مستوى السجلات (debug, info, warn, error)
- 💾 حفظ السجلات في ملف
- 🔍 تسجيل استعلامات قاعدة البيانات

#### 7. **🔔 إعدادات الإشعارات**
- 🔔 تفعيل/إيقاف الإشعارات
- ⚡ الأولوية الافتراضية
- 🔄 إعادة المحاولة عند الفشل

#### 8. **⚡ إعدادات الأداء**
- 💨 تفعيل الكاش
- ⏱️ مدة الكاش
- 🚀 الحد الأقصى للطلبات المتزامنة

#### 9. **🌐 إعدادات اللغة**
- 🌐 اللغة الافتراضية للبوت

---

## 🛠️ البنية التقنية

### 📁 هيكل الملفات:

```
src/
├── modules/
│   └── input/
│       └── formatters/
│           └── number-formatter.ts    # 🆕 وحدة تنسيق الأرقام
│       └── validators/
│           ├── number.validator.ts    # ✅ محدّث
│           └── phone.validator.ts     # ✅ محدّث
├── bot/
│   ├── context.ts                     # ✅ محدّث (SessionData)
│   └── features/
│       ├── welcome.ts                 # ✅ زر الإعدادات
│       └── settings/                  # 🆕 نظام الإعدادات
│           ├── config.ts
│           ├── index.ts
│           └── handlers/
│               ├── company-settings.ts
│               └── features-toggle.ts
```

### 🔄 التكامل:

#### في `src/bot/context.ts`:
```typescript
export interface SessionData {
  awaitingInput?: {
    type: string
    messageId?: number
    data?: any
  }
}
```

#### في `src/bot/index.ts`:
```typescript
import { settingsFeatureComposer } from '#root/bot/features/settings/index.js'
// ...
protectedBot.use(settingsFeatureComposer)
```

---

## 📖 أمثلة عملية

### 1. استخدام تحويل الأرقام في معالج:

```typescript
import { formatNumber, normalizeArabicNumbers } from '#root/modules/input/formatters/index.js'

// في معالج إدخال المبلغ
bot.on('message:text', async (ctx) => {
  const userInput = ctx.message.text // قد يكون "١٢٣٤" أو "1234"
  const normalized = normalizeArabicNumbers(userInput)
  const amount = Number.parseFloat(normalized)

  await ctx.reply(`المبلغ المُدخل: ${formatNumber(amount)} جنيه`)
})
```

### 2. عرض تقرير مالي:

```typescript
import { formatCurrency } from '#root/modules/input/formatters/index.js'

const report = {
  revenue: 1250000,
  expenses: 450000,
  profit: 800000,
}

await ctx.reply(
  `📊 **التقرير المالي**\n\n`
  + `💰 الإيرادات: ${formatCurrency(report.revenue, 'EGP')}\n`
  + `💸 المصروفات: ${formatCurrency(report.expenses, 'EGP')}\n`
  + `✅ الربح: ${formatCurrency(report.profit, 'EGP')}`,
  { parse_mode: 'Markdown' }
)
// النتيجة:
// 💰 الإيرادات: 1,250,000.00 EGP
// 💸 المصروفات: 450,000.00 EGP
// ✅ الربح: 800,000.00 EGP
```

### 3. التحقق من رقم الهاتف (عربي/إنجليزي):

```typescript
import { isValidEgyptPhone } from '#root/modules/input/validators/index.js'

bot.on('message:text', async (ctx) => {
  const phone = ctx.message.text

  if (isValidEgyptPhone(phone)) {
    await ctx.reply(`✅ رقم الهاتف صحيح: ${phone}`)
  }
  else {
    await ctx.reply('❌ رقم الهاتف غير صحيح')
  }
})

// يقبل:
// - ٠١٠١٢٣٤٥٦٧٨
// - 01012345678
// - +201012345678
// - 00201012345678
```

---

## 🎨 تخصيص الإعدادات

### إضافة إعداد جديد:

1. **في `src/modules/settings/default-settings.ts`:**

```typescript
{
  key: 'company.address',
  scope: 'global',
  category: 'general',
  type: 'string',
  defaultValue: 'القاهرة، مصر',
  description: 'عنوان الشركة',
  validation: {
    required: false,
    min: 5,
    max: 200,
  },
  isEditable: true,
  requiresRestart: false,
  group: 'company',
  order: 3,
},
```

2. **إضافة معالج في Settings:**

```typescript
// في src/bot/features/settings/handlers/company-settings.ts
companySettingsHandler.callbackQuery('settings:company:edit-address', async (ctx) => {
  // معالج تعديل العنوان
})
```

3. **إضافة زر في الواجهة:**

```typescript
const keyboard = new InlineKeyboard()
  .text('✏️ تعديل اسم الشركة', 'settings:company:edit-name')
  .row()
  .text('📍 تعديل العنوان', 'settings:company:edit-address')
  .row()
```

---

## 🔐 الصلاحيات

| الدور | الوصول للإعدادات | تعديل الأقسام | عرض الإحصائيات |
|-------|-------------------|----------------|-----------------|
| **SUPER_ADMIN** | ✅ كامل | ✅ | ✅ |
| **ADMIN** | ❌ | ❌ | ✅ |
| **USER** | ❌ | ❌ | ❌ |
| **GUEST** | ❌ | ❌ | ❌ |

---

## 🚀 الاختبار

### اختبار الأرقام العربية:

```bash
# قم بإدخال الأرقام التالية في البوت:
١٢٣٤٥٦٧٨٩٠
1234567890
١,٢٣٤,٥٦٧
1,234,567
١٢٣.٤٥
123.45
```

### اختبار الإعدادات:

1. ✅ سجّل الدخول كـ SUPER_ADMIN
2. ✅ اضغط زر "⚙️ الإعدادات"
3. ✅ اختر "🏢 بيانات الشركة"
4. ✅ اختر "✏️ تعديل اسم الشركة"
5. ✅ أدخل اسم جديد
6. ✅ تحقق من التحديث في `/start`

### اختبار تفعيل/إيقاف الأقسام:

1. ✅ اضغط "⚙️ الإعدادات"
2. ✅ اختر "🎯 تفعيل/إيقاف الأقسام"
3. ✅ اضغط على أي قسم لتبديل حالته
4. ✅ ارجع للقائمة الرئيسية وتحقق من التغيير

---

## 🎯 الخلاصة

تم تطوير 3 ميزات رئيسية:

1. ✅ **دعم الأرقام العربية/الإنجليزية** في جميع حقول الأرقام
2. ✅ **عرض المبالغ بفواصل الآلاف** (1,000 - 1,000,000)
3. ✅ **نظام إعدادات شامل** للسوبر أدمن فقط

**جميع التغييرات متكاملة ومُختبرة وجاهزة للاستخدام!** 🚀
