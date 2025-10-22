# توثيق إضافة Conversations Plugin إلى قالب Telegram Bot Template

## 1. مقدمة
يهدف هذا التوثيق إلى شرح عملية دمج وإعداد **Conversations Plugin** ضمن قالب **[Telegram Bot Template](https://github.com/bot-base/telegram-bot-template)**، وتوضيح كيفية استخدامه لإدارة الحوارات المتعددة داخل البوت بشكل منظم واحترافي.

---

## 2. الغرض من الإضافة
يُستخدم **Conversations Plugin** لتسهيل التعامل مع الحوارات (Conversations) بين المستخدم والبوت عبر مراحل متعددة — مثل جمع البيانات خطوة بخطوة، أو تنفيذ أوامر تتطلب أكثر من رسالة واحدة من المستخدم.

يُعد هذا النظام بديلاً مثاليًا لاستخدام متغيرات الجلسة (session variables) بشكل يدوي، لأنه:
- يُدير حالة كل مستخدم بشكل منفصل.
- يسمح بالتفرع المنطقي داخل الحوار.
- يوفّر إمكانية الخروج أو الإلغاء من الحوار بسهولة.

---

## 3. خطوات الإضافة

### 3.1 تثبيت الحزمة المطلوبة
في البداية، تم تثبيت الحزمة الرسمية الخاصة بالمحادثات:
```bash
npm install @grammyjs/conversations
```

---

### 3.2 استيراد المكونات في الكود الأساسي
تم تعديل الملف الرئيسي **index.js** أو **bot.js** (حسب هيكل المشروع) لاستيراد المكونات التالية:

```javascript
import { conversations, createConversation } from "@grammyjs/conversations";
```

---

### 3.3 تفعيل الـ Middleware
بعد تفعيل الـ session الأساسي، تمت إضافة middleware الخاصة بالمحادثات:

```javascript
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());
```

> ⚠️ ملاحظة: يجب استدعاء `conversations()` بعد تفعيل `session()` مباشرة.

---

### 3.4 إنشاء محادثة جديدة (Conversation)
لإنشاء محادثة جديدة، تمت إضافة ملف مخصص في المسار `src/conversations/` باسم مثل:

```
src/conversations/collectUserInfo.js
```

ويحتوي على الكود التالي كمثال:

```javascript
export async function collectUserInfo(conversation, ctx) {
  await ctx.reply("مرحبًا! ما اسمك؟");
  const name = await conversation.wait();

  await ctx.reply("ما عمرك؟");
  const age = await conversation.wait();

  await ctx.reply(`شكرًا يا ${name.message.text}، تم تسجيل عمرك (${age.message.text}) بنجاح!`);
}
```

---

### 3.5 تسجيل المحادثة داخل البوت
بعد إنشاء المحادثة، يجب تسجيلها داخل النظام الرئيسي:

```javascript
import { collectUserInfo } from "./src/conversations/collectUserInfo.js";

bot.use(createConversation(collectUserInfo));
```

---

### 3.6 استدعاء المحادثة عند أمر معين
تم ربط المحادثة بأمر في البوت:

```javascript
bot.command("register", async (ctx) => {
  await ctx.conversation.enter("collectUserInfo");
});
```

عند كتابة `/register` في المحادثة، يبدأ البوت في تشغيل الحوار التفاعلي.

---

## 4. طريقة الاستخدام المستقبلية

### 4.1 إنشاء محادثات جديدة
لإضافة محادثات أخرى، يكفي:
1. إنشاء ملف جديد داخل `src/conversations/`.
2. كتابة دالة محادثة جديدة على نفس النمط.
3. تسجيلها باستخدام `createConversation()`.
4. استدعاؤها داخل أوامر جديدة.

### 4.2 بنية التسمية المقترحة
| العنصر | التسمية المقترحة | الوصف |
|--------|------------------|--------|
| ملف المحادثة | `src/conversations/featureName.js` | اسم يعكس الغرض من الحوار |
| اسم الدالة | `featureNameConversation` | اسم واضح ووحيد لكل محادثة |
| الأمر المستدعي | `/featureName` | الأمر الذي يبدأ الحوار |

---

## 5. مثال عملي مبسط
**الهدف:** جمع بريد إلكتروني من المستخدم للتحقق.

```javascript
export async function emailCollector(conversation, ctx) {
  await ctx.reply("من فضلك أدخل بريدك الإلكتروني:");
  const email = await conversation.wait();

  await ctx.reply(`تم استلام البريد: ${email.message.text}`);
}
```

ثم تسجيلها:

```javascript
bot.use(createConversation(emailCollector));

bot.command("email", async (ctx) => {
  await ctx.conversation.enter("emailCollector");
});
```

---

## 6. نصائح عملية
- استخدم `conversation.external()` إذا كنت تحتاج إلى عمليات خارجية مثل قواعد البيانات أو API.
- استخدم `conversation.skip()` لتجاوز خطوة عند تحقق شرط معين.
- يمكنك إنهاء الحوار يدويًا باستخدام `return;` أو إرجاع قيمة معينة من الدالة.
- راقب الأخطاء المحتملة عبر `try/catch` داخل المحادثات لضمان استقرار البوت.

---

## 7. الخلاصة
إضافة **Conversations Plugin** حولت أسلوب إدارة الحوارات من معالجة يدوية إلى نظام ذكي ومنظم. هذه الإضافة تسهّل إنشاء بوتات متقدمة تعتمد على منطق تفاعلي متعدد الخطوات، مثل:
- تسجيل المستخدمين.
- نماذج إدخال البيانات.
- محادثات خدمة العملاء.

توصى هذه الإضافة كجزء أساسي من أي بوت يعتمد على Telegraf/Grammy أو القالب الرسم