# 4️⃣ قاعدة البيانات - Database & Prisma

## 🗄️ نظرة عامة

المشروع يستخدم **Prisma ORM** لإدارة قاعدة البيانات بطريقة آمنة ونوعية.

### لماذا Prisma؟

- ✅ **Type-Safe**: أمان نوعي كامل
- ✅ **Auto-completion**: اكمال تلقائي
- ✅ **Migrations**: إدارة تلقائية للتغييرات
- ✅ **Prisma Studio**: واجهة مرئية
- ✅ **متعدد القواعد**: SQLite, PostgreSQL, MySQL

---

## 📊 البنية الحالية

### Schema الحالي

```prisma
// prisma/schema.prisma

model User {
  id           Int       @id @default(autoincrement())
  telegramId   BigInt    @unique
  username     String?   @unique
  firstName    String?
  role         Role      @default(GUEST)
  isActive     Boolean   @default(true)
  lastActiveAt DateTime? @updatedAt
  createdAt    DateTime  @default(now())
}

enum Role {
  SUPER_ADMIN
  ADMIN
  EMPLOYEE
  GUEST
}
```

### الجداول الموجودة

| الجدول | الوصف |
|--------|-------|
| `User` | مستخدمو البوت |

---

## 🚀 الأوامر الأساسية

### إدارة Schema

```bash
# توليد Prisma Client (بعد تعديل Schema)
npm run prisma:generate

# دفع التغييرات للقاعدة (بدون Migration)
npm run db:push

# إنشاء Migration جديد
npm run prisma:migrate

# تطبيق Migrations في الإنتاج
npm run prisma:migrate:prod
```

### Prisma Studio

```bash
# فتح واجهة Prisma Studio
npm run prisma:studio

# أو مع البوت
npm run dev  # يشغل البوت + Studio معاً
```

### البيانات الأولية

```bash
# ملء قاعدة البيانات ببيانات تجريبية
npm run db:seed
```

---

## 📖 Prisma Studio

### الوصول

افتح المتصفح على: **http://localhost:5555**

### الميزات

✅ **عرض البيانات**: استعرض جميع الجداول
✅ **إضافة سجلات**: أضف بيانات جديدة
✅ **تعديل البيانات**: عدل السجلات الموجودة
✅ **حذف البيانات**: احذف سجلات
✅ **البحث والفلترة**: ابحث عن بيانات محددة
✅ **العلاقات**: تصفح العلاقات بين الجداول

---

## 💻 استخدام Database Class

### الاتصال بالقاعدة

```typescript
import { Database } from '#root/modules/database/index.js'

// الاتصال
await Database.connect()

// الحصول على Prisma Client
const prisma = Database.getClient()

// قطع الاتصال
await Database.disconnect()
```

### التحقق من الاتصال

```typescript
// هل القاعدة متصلة؟
if (Database.isConnected()) {
  console.log('Database is connected')
}
```

---

## 🔍 العمليات الأساسية (CRUD)

### Create - إنشاء

```typescript
// إنشاء مستخدم جديد
const newUser = await prisma.user.create({
  data: {
    telegramId: 123456789,
    username: 'john_doe',
    firstName: 'John',
    role: 'GUEST'
  }
})

// إنشاء عدة سجلات
const users = await prisma.user.createMany({
  data: [
    { telegramId: 111, username: 'user1' },
    { telegramId: 222, username: 'user2' },
  ]
})
```

### Read - القراءة

```typescript
// قراءة كل المستخدمين
const allUsers = await prisma.user.findMany()

// قراءة مستخدم واحد
const user = await prisma.user.findUnique({
  where: { telegramId: 123456789 }
})

// قراءة أول مستخدم يطابق الشرط
const firstAdmin = await prisma.user.findFirst({
  where: { role: 'ADMIN' }
})

// العد
const userCount = await prisma.user.count()
const adminCount = await prisma.user.count({
  where: { role: 'ADMIN' }
})
```

### Update - التحديث

```typescript
// تحديث مستخدم
const updatedUser = await prisma.user.update({
  where: { telegramId: 123456789 },
  data: { firstName: 'John Updated' }
})

// تحديث عدة سجلات
const result = await prisma.user.updateMany({
  where: { role: 'GUEST' },
  data: { isActive: false }
})

// تحديث أو إنشاء (Upsert)
const user = await prisma.user.upsert({
  where: { telegramId: 123456789 },
  update: { firstName: 'John' },
  create: {
    telegramId: 123456789,
    username: 'john_doe',
    firstName: 'John'
  }
})
```

### Delete - الحذف

```typescript
// حذف مستخدم
const deletedUser = await prisma.user.delete({
  where: { telegramId: 123456789 }
})

// حذف عدة سجلات
const result = await prisma.user.deleteMany({
  where: { isActive: false }
})

// حذف الكل
await prisma.user.deleteMany()
```

---

## 🔎 الاستعلامات المتقدمة

### الفلترة

```typescript
// شروط متعددة (AND)
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
    isActive: true
  }
})

// OR
const users = await prisma.user.findMany({
  where: {
    OR: [
      { role: 'ADMIN' },
      { role: 'SUPER_ADMIN' }
    ]
  }
})

// NOT
const users = await prisma.user.findMany({
  where: {
    NOT: { role: 'GUEST' }
  }
})

// IN
const users = await prisma.user.findMany({
  where: {
    role: { in: ['ADMIN', 'SUPER_ADMIN'] }
  }
})

// Contains (يحتوي على)
const users = await prisma.user.findMany({
  where: {
    username: { contains: 'admin' }
  }
})

// StartsWith / EndsWith
const users = await prisma.user.findMany({
  where: {
    username: { startsWith: 'test_' }
  }
})
```

### الترتيب

```typescript
// ترتيب تصاعدي
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'asc' }
})

// ترتيب تنازلي
const users = await prisma.user.findMany({
  orderBy: { createdAt: 'desc' }
})

// ترتيب متعدد
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'asc' },
    { createdAt: 'desc' }
  ]
})
```

### التصفح (Pagination)

```typescript
// Skip & Take
const users = await prisma.user.findMany({
  skip: 10, // تجاوز أول 10
  take: 5, // خذ 5 فقط
})

// Cursor-based pagination
const users = await prisma.user.findMany({
  take: 10,
  cursor: { id: 5 }, // ابدأ من id = 5
})
```

### اختيار الحقول

```typescript
// حقول محددة فقط
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    // لا يظهر باقي الحقول
  }
})
```

---

## 🔄 المعاملات (Transactions)

### معاملة بسيطة

```typescript
// كل العمليات تنجح أو تفشل معاً
const result = await prisma.$transaction([
  prisma.user.create({ data: { /* ... */ } }),
  prisma.user.update({ /* ... */ }),
  prisma.user.delete({ /* ... */ })
])
```

### معاملة تفاعلية

```typescript
const result = await prisma.$transaction(async (prisma) => {
  // العمليات هنا
  const user = await prisma.user.create({ /* ... */ })

  // منطق مخصص
  if (user.role === 'ADMIN') {
    await prisma.user.updateMany({ /* ... */ })
  }

  return user
})
```

---

## 🎯 أمثلة عملية

### 1. تسجيل مستخدم جديد

```typescript
async function registerUser(telegramId: number, username: string, firstName: string) {
  const prisma = Database.getClient()

  // تحقق إذا كان موجود
  const existing = await prisma.user.findUnique({
    where: { telegramId }
  })

  if (existing) {
    return existing
  }

  // أنشئ مستخدم جديد
  return await prisma.user.create({
    data: {
      telegramId,
      username,
      firstName,
      role: 'GUEST'
    }
  })
}
```

### 2. ترقية مستخدم لمسؤول

```typescript
async function promoteToAdmin(telegramId: number) {
  const prisma = Database.getClient()

  return await prisma.user.update({
    where: { telegramId },
    data: { role: 'ADMIN' }
  })
}
```

### 3. الحصول على كل المسؤولين

```typescript
async function getAllAdmins() {
  const prisma = Database.getClient()

  return await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'SUPER_ADMIN'] }
    },
    orderBy: { createdAt: 'desc' }
  })
}
```

### 4. إحصائيات المستخدمين

```typescript
async function getUserStats() {
  const prisma = Database.getClient()

  const total = await prisma.user.count()
  const active = await prisma.user.count({ where: { isActive: true } })
  const admins = await prisma.user.count({ where: { role: 'ADMIN' } })

  return { total, active, admins }
}
```

---

## 🔧 تعديل Schema

### إضافة جدول جديد

```prisma
// prisma/schema.prisma

model Message {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  content   String
  createdAt DateTime @default(now())
}

model User {
  // ... الحقول الموجودة
  messages  Message[]  // أضف العلاقة
}
```

### تطبيق التغييرات

```bash
# طريقة 1: Migration (موصى به للإنتاج)
npm run prisma:migrate

# طريقة 2: Push (سريع للتطوير)
npm run db:push

# توليد Client
npm run prisma:generate
```

---

## 🌐 تغيير نوع القاعدة

### من SQLite إلى PostgreSQL

1. **عدل `schema.prisma`:**

```prisma
datasource db {
  provider = "postgresql"  // بدلاً من sqlite
  url      = env("DATABASE_URL")
}
```

2. **عدل `.env`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

3. **طبق التغييرات:**

```bash
npm run prisma:migrate
```

### من SQLite إلى MySQL

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
```

---

## 🐛 حل المشاكل

### "Prisma Client not generated"

```bash
npm run prisma:generate
```

### "Database not found"

```bash
npm run prisma:migrate
# أو
npm run db:push
```

### تعارض في Migrations

```bash
# احذف مجلد migrations وأعد إنشاءه
rm -rf prisma/migrations
npm run prisma:migrate
```

### مشاكل Prisma Studio

```bash
# أعد تشغيله
npm run prisma:studio
```

---

## 📚 موارد إضافية

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

[⬅️ السابق: الإعدادات](./03-configuration.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: ميزات البوت](./05-bot-features.md)
