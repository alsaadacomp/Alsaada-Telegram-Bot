# 📖 توثيق وحدة محققات الإدخال (Input Validators)

## 🎯 نظرة عامة

وحدة **محققات الإدخال** هي مجموعة شاملة من الدوال للتحقق من صحة المدخلات في تطبيقات Telegram Bot. تم تصميمها خصيصاً للسوق المصري والعربي مع دعم كامل للمعايير الدولية.

### ✨ الميزات الرئيسية

- ✅ **14 رقم قومي مصري** - تحقق كامل مع استخراج المعلومات
- ✅ **11 رقم موبايل مصري** - مع التعرف على الشبكة
- ✅ **أرقام صحيحة وعشرية** - جميع أنواع التحقق من الأرقام
- ✅ **بريد إلكتروني** - تحقق متقدم
- ✅ **نصوص وأسماء** - مع دعم العربية والإنجليزية
- ✅ **تواريخ** - مع حساب العمر والنطاقات
- ✅ **تحققات خاصة** - URL, IBAN, IP, MAC, UUID, وغيرها

---

## 📦 التثبيت والاستخدام

### الاستيراد

```typescript
import {
  isInteger,
  isValidEgyptPhone,
  isValidEmail,
  isValidName,
  isValidNationalID,
  isValidNumber,
} from '#root/modules/input/validators'
```

### مثال سريع

```typescript
import { isValidEgyptPhone, isValidNationalID } from '#root/modules/input/validators'

// التحقق من رقم موبايل
const isValid = isValidEgyptPhone('01012345678') // true

// التحقق من الرقم القومي
const isValidID = isValidNationalID('29501011234567') // true
```

---

## 📚 الدوال المتاحة

### 1️⃣ الرقم القومي المصري (14 رقم)

#### `isValidNationalID(id: string): boolean`

يتحقق من صحة الرقم القومي المصري (14 رقم).

**الشروط:**
- 14 رقم بالضبط
- يبدأ بـ 2 أو 3 (القرن)
- شهر صحيح (01-12)
- يوم صحيح (01-31)
- محافظة صحيحة (01-35)

```typescript
isValidNationalID('29501011234567') // ✅ true - صحيح
isValidNationalID('30001011234567') // ✅ true - صحيح
isValidNationalID('123456789') // ❌ false - أقل من 14
isValidNationalID('29513011234567') // ❌ false - شهر خاطئ
```

#### `validateNationalIDWithInfo(id: string): object`

يتحقق من الرقم القومي ويعيد معلومات مفصلة.

**المعلومات المستخرجة:**
- القرن (2 = 1900-1999، 3 = 2000-2099)
- السنة والشهر واليوم
- رقم المحافظة
- الجنس (فردي = ذكر، زوجي = أنثى)
- تاريخ الميلاد الكامل

```typescript
const info = validateNationalIDWithInfo('29501011234567')
/*
{
  isValid: true,
  century: 2,
  year: 95,
  month: 1,
  day: 1,
  governorate: 12,
  gender: 'male',      // الرقم التسلسلي فردي
  birthDate: '1995-01-01'
}
*/
```

---

### 2️⃣ رقم الموبايل المصري (11 رقم)

#### `isValidEgyptPhone(phone: string): boolean`

يتحقق من صحة رقم الموبايل المصري.

**الشروط:**
- 11 رقم بالضبط
- يبدأ بـ 01
- الرقم الثالث يجب أن يكون 0, 1, 2, أو 5

```typescript
isValidEgyptPhone('01012345678') // ✅ true - Vodafone
isValidEgyptPhone('01112345678') // ✅ true - Etisalat
isValidEgyptPhone('01212345678') // ✅ true - Orange
isValidEgyptPhone('01512345678') // ✅ true - WE
isValidEgyptPhone('010 1234 5678') // ✅ true - مع مسافات
isValidEgyptPhone('+201012345678') // ✅ true - مع كود دولي
isValidEgyptPhone('0212345678') // ❌ false - لا يبدأ بـ 01
```

#### `validateEgyptPhoneWithInfo(phone: string): object`

يتحقق من الرقم ويعيد معلومات مفصلة.

```typescript
const info = validateEgyptPhoneWithInfo('01012345678')
/*
{
  isValid: true,
  formatted: '01012345678',
  international: '+201012345678',
  operator: 'Vodafone'
}
*/
```

**الشبكات المدعومة:**
- `010` → Vodafone
- `011` → Etisalat
- `012` → Orange
- `015` → WE (We Telecom Egypt)

#### `isValidInternationalPhone(phone: string): boolean`

يتحقق من رقم موبايل دولي.

```typescript
isValidInternationalPhone('+201012345678') // ✅ مصر
isValidInternationalPhone('+966501234567') // ✅ سعودية
isValidInternationalPhone('+971501234567') // ✅ إمارات
```

---

### 3️⃣ الأرقام (صحيحة وعشرية)

#### `isValidNumber(value: string | number): boolean`

يتحقق من أن القيمة رقم صحيح.

```typescript
isValidNumber('123') // ✅ true
isValidNumber('123.45') // ✅ true
isValidNumber('-123') // ✅ true
isValidNumber('abc') // ❌ false
```

#### `isInteger(value: string | number): boolean`

يتحقق من أن القيمة رقم صحيح بدون كسور.

```typescript
isInteger('123') // ✅ true
isInteger('123.45') // ❌ false
```

#### `isDecimal(value: string | number, decimalPlaces?: number): boolean`

يتحقق من أن القيمة رقم عشري.

```typescript
isDecimal('123.45') // ✅ true
isDecimal('123.45', 2) // ✅ true - خانتين بالضبط
isDecimal('123.456', 2) // ❌ false - أكثر من خانتين
```

#### `isPositiveNumber(value: string | number): boolean`

يتحقق من أن الرقم موجب (أكبر من صفر).

```typescript
isPositiveNumber('123') // ✅ true
isPositiveNumber('0') // ❌ false
isPositiveNumber('-123') // ❌ false
```

#### `isInRange(value, min?, max?): boolean`

يتحقق من أن الرقم في نطاق معين.

```typescript
isInRange('50', 0, 100) // ✅ true
isInRange('150', 0, 100) // ❌ false
```

#### دوال إضافية:

- `isNegativeNumber(value)` - رقم سالب
- `isBetween(value, min, max)` - بين قيمتين
- `isEven(value)` - رقم زوجي
- `isOdd(value)` - رقم فردي
- `isNaturalNumber(value, includeZero?)` - عدد طبيعي
- `isPercentage(value, allowDecimals?)` - نسبة مئوية (0-100)

#### دوال التحويل:

```typescript
toNumber('123') // 123
toInteger('123.45') // 123
roundToDecimal('123.456', 2) // 123.46
```

---

### 4️⃣ البريد الإلكتروني

#### `isValidEmail(email: string): boolean`

يتحقق من صحة البريد الإلكتروني.

```typescript
isValidEmail('test@example.com') // ✅ true
isValidEmail('user.name@domain.co.uk') // ✅ true
isValidEmail('invalid') // ❌ false
```

#### دوال إضافية:

```typescript
extractUsername('test@example.com') // 'test'
extractDomain('test@example.com') // 'example.com'
normalizeEmail('  TEST@EXAMPLE.COM  ') // 'test@example.com'
```

---

### 5️⃣ النصوص والأسماء

#### `isNotEmpty(text: string): boolean`

يتحقق من أن النص ليس فارغ.

```typescript
isNotEmpty('Hello') // ✅ true
isNotEmpty('   ') // ❌ false - مسافات فقط
```

#### `hasMinLength(text: string, minLength: number): boolean`

يتحقق من الطول الأدنى.

```typescript
hasMinLength('Hello', 3) // ✅ true
hasMinLength('Hi', 3) // ❌ false
```

#### `isValidUsername(username: string): boolean`

يتحقق من صحة اسم المستخدم.

**الشروط:**
- من 3 إلى 30 حرف
- حروف إنجليزية وأرقام و `_` و `-`
- يبدأ بحرف
- ينتهي بحرف أو رقم

```typescript
isValidUsername('john_doe') // ✅ true
isValidUsername('user123') // ✅ true
isValidUsername('ab') // ❌ false - قصير
```

#### `isValidName(name: string, allowArabic = true): boolean`

يتحقق من صحة الاسم.

```typescript
isValidName('John Doe') // ✅ true
isValidName('أحمد محمد') // ✅ true
isValidName('أحمد محمد', false) // ❌ false - عربي غير مسموح
```

#### `isValidPassword(password: string): PasswordValidationResult`

يتحقق من قوة كلمة المرور.

```typescript
const result = isValidPassword('Pass123!')
/*
{
  isValid: true,
  strength: 'strong',
  score: 80,
  suggestions: []
}
*/
```

#### دوال إضافية:

- `hasMaxLength(text, maxLength)`
- `hasLengthBetween(text, min, max)`
- `isArabicOnly(text, allowSpaces?)`
- `isEnglishOnly(text, allowSpaces?)`
- `isNumericOnly(text)`
- `isAlphanumeric(text, allowSpaces?)`

---

### 6️⃣ التواريخ

#### `isValidDate(date: Date): boolean`

يتحقق من صحة كائن Date.

```typescript
isValidDate(new Date()) // ✅ true
isValidDate(new Date('invalid')) // ❌ false
```

#### `isValidDateString(dateString: string): boolean`

يتحقق من صحة string تاريخ.

```typescript
isValidDateString('2025-01-18') // ✅ true
isValidDateString('invalid') // ❌ false
```

#### دوال مفيدة:

```typescript
isFutureDate(date)        // في المستقبل؟
isPastDate(date)          // في الماضي؟
isToday(date)             // اليوم؟
isDateInRange(date, start?, end?)
getAge(birthDate)         // العمر بالسنوات
isAgeAbove(birthDate, minAge)
```

---

### 7️⃣ تحققات خاصة

#### `isValidUrl(url: string): boolean`

```typescript
isValidUrl('https://example.com') // ✅ true
isValidUrl('example.com') // ❌ false
```

#### `isValidIBAN(iban: string): boolean`

```typescript
isValidIBAN('SA0380000000608010167519') // ✅ IBAN سعودي
isValidIBAN('EG380019000500000000263180002') // ✅ IBAN مصري
```

#### دوال إضافية:

- `isValidIPv4(ip)`
- `isValidMACAddress(mac)`
- `isValidHexColor(color)`
- `isValidUUID(uuid)`
- `isValidJSON(jsonString)`
- `isValidBase64(base64String)`
- `isValidCreditCard(cardNumber)` - Luhn algorithm

---

## 🧪 الاختبارات

تم إنشاء مجموعة شاملة من الاختبارات:

```bash
npm run test
# أو
tsx ./tests/run-tests.ts
```

**عدد الاختبارات:** 47+ اختبار

- ✅ 20+ اختبار للأرقام
- ✅ 15+ اختبار للموبايل المصري
- ✅ 12+ اختبار للرقم القومي المصري

---

## 📖 أمثلة عملية

### مثال 1: تسجيل مستخدم مصري

```typescript
import {
  isValidEgyptPhone,
  isValidEmail,
  isValidName,
  isValidNationalID,
  validateNationalIDWithInfo,
} from '#root/modules/input/validators'

async function registerEgyptianUser(conversation, ctx) {
  // جمع الاسم
  await ctx.reply('ما اسمك الكامل؟')
  const { message } = await conversation.wait()
  const name = message?.text

  if (!name || !isValidName(name)) {
    return ctx.reply('❌ الاسم غير صحيح. يرجى إدخال اسم صحيح.')
  }

  // جمع الرقم القومي
  await ctx.reply('ما رقمك القومي؟ (14 رقم)')
  const { message: idMsg } = await conversation.wait()
  const nationalID = idMsg?.text

  if (!nationalID || !isValidNationalID(nationalID)) {
    return ctx.reply('❌ الرقم القومي غير صحيح. يجب أن يكون 14 رقم.')
  }

  // استخراج معلومات من الرقم القومي
  const idInfo = validateNationalIDWithInfo(nationalID)

  // جمع رقم الموبايل
  await ctx.reply('ما رقم موبايلك؟ (11 رقم)')
  const { message: phoneMsg } = await conversation.wait()
  const phone = phoneMsg?.text

  if (!phone || !isValidEgyptPhone(phone)) {
    return ctx.reply('❌ رقم الموبايل غير صحيح. يجب أن يكون 11 رقم يبدأ بـ 01')
  }

  // حفظ البيانات
  await UserRepository.create({
    name,
    nationalID,
    phone,
    birthDate: idInfo.birthDate,
    gender: idInfo.gender,
  })

  await ctx.reply(`
✅ تم التسجيل بنجاح!

👤 الاسم: ${name}
📱 الموبايل: ${phone}
🎂 تاريخ الميلاد: ${idInfo.birthDate}
⚧️ الجنس: ${idInfo.gender === 'male' ? 'ذكر' : 'أنثى'}
  `)
}
```

### مثال 2: إدخال مبلغ مالي

```typescript
import {
  isInRange,
  isPositiveNumber,
  isValidNumber,
  roundToDecimal,
} from '#root/modules/input/validators'

async function collectAmount(conversation, ctx, min = 1, max = 10000) {
  await ctx.reply(`أدخل المبلغ (من ${min} إلى ${max} جنيه):`)

  const { message } = await conversation.wait()
  const input = message?.text

  // التحقق من أنه رقم
  if (!input || !isValidNumber(input)) {
    await ctx.reply('❌ يرجى إدخال رقم صحيح.')
    return collectAmount(conversation, ctx, min, max)
  }

  // التحقق من أنه موجب
  if (!isPositiveNumber(input)) {
    await ctx.reply('❌ المبلغ يجب أن يكون موجب.')
    return collectAmount(conversation, ctx, min, max)
  }

  // التحقق من النطاق
  if (!isInRange(input, min, max)) {
    await ctx.reply(`❌ المبلغ يجب أن يكون بين ${min} و ${max} جنيه.`)
    return collectAmount(conversation, ctx, min, max)
  }

  // تقريب إلى خانتين عشريتين
  const amount = roundToDecimal(input, 2)!

  await ctx.reply(`✅ المبلغ: ${amount} جنيه`)

  return amount
}
```

---

## 🎯 أفضل الممارسات

### 1. استخدم الدوال المناسبة

```typescript
// ❌ سيء - لا تستخدم regex يدوي
if (/^01[0125]\d{8}$/.test(phone)) { }

// ✅ جيد - استخدم الدوال الجاهزة
if (isValidEgyptPhone(phone)) { }
```

### 2. استخرج المعلومات عند الحاجة

```typescript
// بدلاً من التحقق فقط
if (isValidNationalID(id)) {
  // استخرج المعلومات
  const info = validateNationalIDWithInfo(id)
  console.log(info.birthDate, info.gender)
}
```

### 3. استخدم التحويل الآمن

```typescript
// ✅ جيد - تحويل آمن
const num = toNumber(input)
if (num !== null) {
  // استخدم الرقم
}

// ❌ سيء - قد يفشل
const num = Number(input)
```

---

## 📂 هيكل الملفات

```
src/modules/input/validators/
├── types.ts                    # الأنواع الأساسية
├── email.validator.ts          # البريد الإلكتروني
├── phone.validator.ts          # الموبايل المصري
├── national-id.validator.ts    # الرقم القومي المصري
├── number.validator.ts         # الأرقام
├── text.validator.ts           # النصوص
├── date.validator.ts           # التواريخ
├── special.validator.ts        # تحققات خاصة
└── index.ts                    # التصدير الرئيسي
```

---

## 🚀 التوسع المستقبلي

يمكن إضافة محققات جديدة مثل:

- [ ] رقم بطاقة الهوية السعودية
- [ ] رقم الإقامة السعودي
- [ ] رقم السجل التجاري
- [ ] الرمز البريدي المصري
- [ ] أرقام الموبايل لدول أخرى

---

## 📞 الدعم

إذا كان لديك أي أسئلة أو اقتراحات، يرجى فتح issue في المشروع.

---

**تم التوثيق بواسطة:** فريق التطوير
**آخر تحديث:** يناير 2025
**الإصدار:** 1.0.0
