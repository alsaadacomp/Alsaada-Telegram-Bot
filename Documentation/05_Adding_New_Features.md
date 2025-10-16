
# إضافة ميزات جديدة

تم تصميم القالب ليكون معياريًا (modular)، مما يجعل إضافة ميزات وأوامر جديدة عملية سهلة ومنظمة. يوضح هذا الدليل الخطوات اللازمة لإضافة ميزة جديدة، مع مثال عملي لإنشاء أمر `/ping`.

## المنهجية العامة

تعتمد بنية القالب على "الميزات" (Features)، حيث تمثل كل ميزة ملفًا منفصلاً داخل مجلد `src/bot/features`. هذه الميزات هي في الأساس وحدات `Composer` من `grammy` يتم تجميعها معًا في نقطة الدخول الرئيسية للروبوت.

لإضافة ميزة جديدة، اتبع الخطوات التالية:

### الخطوة 1: إنشاء ملف الميزة الجديد

1.  اذهب إلى المجلد `src/bot/features`.
2.  أنشئ ملفًا جديدًا باسم وصفي للميزة التي تريد إضافتها. على سبيل المثال، لإنشاء أمر `/ping`، سننشئ ملفًا باسم `ping.ts`.

### الخطوة 2: كتابة كود الميزة

داخل ملف `ping.ts`، ستحتاج إلى كتابة الكود الذي يتعامل مع الأمر الجديد. إليك مثال كامل:

```typescript
// src/bot/features/ping.ts

import type { Context } from '#root/bot/context.js';
import { logHandle } from '#root/bot/helpers/logging.js';
import { Composer } from 'grammy';

const composer = new Composer<Context>();

// لتقييد الميزة على المحادثات الخاصة فقط
const feature = composer.chatType('private');

// تعريف معالج الأمر 'ping'
feature.command('ping', logHandle('command-ping'), (ctx) => {
  return ctx.reply(ctx.t('ping-pong'));
});

export { composer as pingFeature };
```

**شرح الكود:**

-   نستورد `Context` و`Composer` و`logHandle`.
-   ننشئ مثيلًا جديدًا من `Composer`.
-   نستخدم `composer.chatType('private')` لضمان أن هذا الأمر يعمل فقط في المحادثات الخاصة بين المستخدم والروبوت.
-   نستخدم `feature.command('ping', ...)` لتعريف معالج الأمر `/ping`.
-   `logHandle('command-ping')` هي دالة مساعدة لتسجيل أن هذا الأمر قد تم استدعاؤه.
-   `ctx.reply(ctx.t('ping-pong'))` هي الاستجابة التي سيرسلها الروبوت. لاحظ أننا نستخدم `ctx.t('ping-pong')` لجلب النص من ملفات الترجمة، مما يضمن دعم تعدد اللغات.
-   أخيرًا، نقوم بتصدير `composer` تحت اسم `pingFeature`.

### الخطوة 3: إضافة الترجمة

بما أننا استخدمنا `ctx.t('ping-pong')`، نحتاج إلى إضافة هذا المفتاح إلى ملفات الترجمة.

1.  افتح ملف `locales/en.ftl`.
2.  أضف السطر التالي:

    ```ftl
    ping-pong = Pong!
    ```

    إذا كان لديك لغات أخرى، أضف الترجمة المناسبة في ملفاتها أيضًا.

### الخطوة 4: تسجيل الميزة الجديدة في الروبوت

الآن بعد أن أنشأنا الميزة، نحتاج إلى إخبار الروبوت باستخدامها.

1.  افتح الملف `src/bot/index.ts`.
2.  استورد الميزة الجديدة التي أنشأتها في أعلى الملف:

    ```typescript
    import { pingFeature } from '#root/bot/features/ping.js';
    ```

3.  في دالة `createBot`، أضف الميزة الجديدة إلى قائمة المعالجات باستخدام `protectedBot.use()`:

    ```typescript
    // ... (الكود الحالي)

    // Handlers
    protectedBot.use(welcomeFeature);
    protectedBot.use(adminFeature);
    protectedBot.use(pingFeature); // <--- أضف الميزة هنا
    if (isMultipleLocales)
      protectedBot.use(languageFeature);

    // must be the last handler
    protectedBot.use(unhandledFeature);

    // ... (الكود الحالي)
    ```

    **ملاحظة هامة:** تأكد من إضافة الميزة الجديدة **قبل** `unhandledFeature`، وإلا فلن يتم الوصول إليها أبدًا.

### الخطوة 5: تحديث قائمة الأوامر (اختياري ولكنه موصى به)

لجعل الأمر الجديد يظهر في قائمة الأوامر التلقائية في تليجرام، يجب إضافته إلى معالج `/setcommands`.

1.  افتح الملف `src/bot/handlers/commands/setcommands.ts`.
2.  أضف تعريفًا للأمر الجديد `ping` بنفس طريقة تعريف الأوامر الأخرى:

    ```typescript
    // ...

    export async function setCommandsHandler(ctx: CommandContext<Context>) {
      const start = new Command('start', i18n.t('en', 'start.description'));
      // ...

      const language = new Command('language', i18n.t('en', 'language.description'));
      // ...

      const ping = new Command('ping', i18n.t('en', 'ping.description'));
      addCommandLocalizations(ping);
      addCommandToChats(ping, ctx.config.botAdmins);

      const setcommands = new Command('setcommands', i18n.t('en', 'setcommands.description'));
      // ...

      const commands = new CommandGroup()
        .add(start)
        .add(language)
        .add(ping) // <--- أضف الأمر هنا
        .add(setcommands);

      await commands.setCommands(ctx);

      return ctx.reply(ctx.t('admin-commands-updated'));
    }
    ```

3.  لا تنس إضافة وصف الأمر إلى ملفات الترجمة (مثل `locales/en.ftl`):

    ```ftl
    ping-description = Checks if the bot is responsive.
    ```

### الخطوة 6: الاختبار

1.  قم بتشغيل الروبوت في وضع التطوير (`npm run dev`).
2.  أرسل الأمر `/ping` إلى روبوتك. يجب أن يرد بـ "Pong!".
3.  (إذا قمت بالخطوة 5) أرسل الأمر `/setcommands` (من حساب مسؤول) لتحديث قائمة الأوامر. يجب أن يظهر الأمر `/ping` الآن في القائمة.

باتباع هذه الخطوات، يمكنك إضافة أي عدد من الميزات والأوامر إلى روبوتك بطريقة منظمة وقابلة للصيانة.
