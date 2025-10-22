# إضافة ميزات جديدة

هذا الدليل مخصص للمطورين ويشرح كيفية إضافة ميزات جديدة للبوت.

## إضافة أمر جديد

لإضافة أمر جديد، اتبع الخطوات التالية:

1.  **إنشاء ملف ميزة جديد:**
    في مجلد `src/bot/features`، قم بإنشاء ملف جديد للميزة، على سبيل المثال `my_feature.ts`.

2.  **كتابة كود الميزة:**
    في الملف الجديد، قم بكتابة الكود الخاص بالأمر الجديد. استخدم `Composer` من `grammy` لتسجيل الأمر.

    ```typescript
    import type { Context } from '#root/bot/context.js'
    import { Composer } from 'grammy'

    const composer = new Composer<Context>()

    const feature = composer.chatType('private')

    feature.command('mycommand', (ctx) => {
      return ctx.reply('This is my new command!')
    })

    export { composer as myFeature }
    ```

3.  **تسجيل الميزة الجديدة:**
    في ملف `src/bot/index.ts`، قم باستيراد وتسجيل الميزة الجديدة.

    ```typescript
    // ... other imports
    import { myFeature } from './features/my_feature.js'

    // ...

    bot.use(myFeature)

    // ...
    ```

## إضافة محادثة جديدة (Wizard)

لإضافة محادثة جديدة، اتبع الخطوات التالية:

1.  **إنشاء ملف محادثة جديد:**
    في مجلد `src/modules/interaction/wizards`، قم بإنشاء ملف جديد للمحادثة، على سبيل المثال `my_wizard.ts`.

2.  **كتابة كود المحادثة:**
    في الملف الجديد، قم بكتابة الكود الخاص بالمحادثة.

    ```typescript
    import type { Conversation, ConversationFlavor } from '@grammyjs/conversations'
    import type { Context } from '#root/bot/context.js'

    type MyConversation = Conversation<Context>

    export const MY_CONVERSATION = 'my-conversation'

    export function createMyConversation() {
      return (conversation: MyConversation, ctx: Context) => {
        // ... your conversation logic here
      }
    }
    ```

3.  **تسجيل المحادثة:**
    في ملف `src/bot/index.ts`، قم بتسجيل المحادثة الجديدة.

    ```typescript
    // ... other imports
    import { conversations, createConversation } from '@grammyjs/conversations'
    import { MY_CONVERSATION, createMyConversation } from '#root/modules/interaction/wizards/my_wizard.js'

    // ...

    bot.use(conversations())
    bot.use(createConversation(createMyConversation(), MY_CONVERSATION))

    // ...
    ```

4.  **بدء المحادثة:**
    يمكنك بدء المحادثة من أي ميزة باستخدام `ctx.conversation.enter()`.

    ```typescript
    feature.command('start_conversation', (ctx) => {
      return ctx.conversation.enter(MY_CONVERSATION)
    })
    ```
