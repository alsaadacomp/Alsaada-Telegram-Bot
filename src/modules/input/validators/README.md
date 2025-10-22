# 📋 Input Validators

وحدة محققات الإدخال للتحقق من صحة البيانات في تطبيقات Telegram Bot.

## 🚀 الاستخدام السريع

```typescript
import {
  isValidEgyptPhone,
  isValidEmail,
  isValidNationalID,
  isValidNumber,
} from '#root/modules/input/validators'

// رقم موبايل مصري (11 رقم)
isValidEgyptPhone('01012345678') // true

// رقم قومي مصري (14 رقم)
isValidNationalID('29501011234567') // true

// أرقام
isValidNumber('123.45') // true
isInteger('123') // true

// بريد إلكتروني
isValidEmail('test@example.com') // true
```

## 📚 الوحدات المتاحة

### الرقم القومي المصري
- `isValidNationalID(id)` - التحقق من 14 رقم
- `validateNationalIDWithInfo(id)` - استخراج المعلومات (تاريخ الميلاد، الجنس، المحافظة)

### رقم الموبايل المصري
- `isValidEgyptPhone(phone)` - التحقق من 11 رقم
- `validateEgyptPhoneWithInfo(phone)` - استخراج الشبكة والتنسيق الدولي
- `isValidInternationalPhone(phone)` - أرقام دولية

### الأرقام
- `isValidNumber()`, `isInteger()`, `isDecimal()`
- `isPositiveNumber()`, `isNegativeNumber()`
- `isInRange()`, `isBetween()`
- `isEven()`, `isOdd()`, `isNaturalNumber()`
- `toNumber()`, `toInteger()`, `roundToDecimal()`

### البريد الإلكتروني
- `isValidEmail()`
- `extractUsername()`, `extractDomain()`
- `normalizeEmail()`

### النصوص
- `isNotEmpty()`, `hasMinLength()`, `hasMaxLength()`
- `isValidUsername()`, `isValidName()`, `isValidPassword()`
- `isArabicOnly()`, `isEnglishOnly()`, `isAlphanumeric()`

### التواريخ
- `isValidDate()`, `isValidDateString()`
- `isFutureDate()`, `isPastDate()`, `isToday()`
- `getAge()`, `isAgeAbove()`

### تحققات خاصة
- `isValidUrl()`, `isValidIBAN()`
- `isValidIPv4()`, `isValidMACAddress()`
- `isValidUUID()`, `isValidJSON()`, `isValidCreditCard()`

## 📖 التوثيق الكامل

راجع [التوثيق الكامل](../../docs/VALIDATORS-DOCUMENTATION.md) للحصول على تفاصيل شاملة مع أمثلة.

## 🧪 الاختبارات

```bash
npm run test
```

عدد الاختبارات: 47+ اختبار مع معدل نجاح 100%

## 📂 الملفات

```
validators/
├── types.ts                    # الأنواع
├── email.validator.ts
├── phone.validator.ts          # ⭐ موبايل مصري
├── national-id.validator.ts    # ⭐ رقم قومي مصري
├── number.validator.ts         # ⭐ أرقام
├── text.validator.ts
├── date.validator.ts
├── special.validator.ts
└── index.ts
```

---

**Made with ❤️ for Egyptian Telegram Bots**
