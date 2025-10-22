# التثبيت والإعداد

هذا الدليل يشرح كيفية تثبيت وإعداد البوت على بيئة تطوير محلية.

## المتطلبات

-   [Node.js](https://nodejs.org/) (v20.0.0 أو أحدث)
-   [npm](https://www.npmjs.com/) (v8.0.0 أو أحدث)
-   قاعدة بيانات (PostgreSQL, MySQL, or SQLite)

## خطوات التثبيت

1.  **استنساخ المستودع:**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **تثبيت الاعتماديات:**

    ```bash
    npm install
    ```

3.  **إعداد قاعدة البيانات:**

    -   تأكد من أن قاعدة البيانات الخاصة بك تعمل.
    -   قم بإنشاء ملف `.env` في جذر المشروع وأضف متغير `DATABASE_URL` الذي يحتوي على رابط قاعدة البيانات الخاصة بك. مثال لـ PostgreSQL:

        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase"
        ```

    -   قم بتشغيل تحديثات قاعدة البيانات:

        ```bash
        npx prisma migrate dev
        ```

4.  **إعداد متغيرات البيئة:**

    في ملف `.env`، أضف المتغيرات التالية:

    ```env
    # وضع التشغيل: 'polling' أو 'webhook'
    BOT_MODE="polling"

    # توكن البوت من BotFather
    BOT_TOKEN="YOUR_BOT_TOKEN"

    # (اختياري) مستوى تسجيل الأحداث
    # LOG_LEVEL="info"

    # (اختياري) قائمة بأسماء الأدمنز بصيغة JSON
    # BOT_ADMINS="[123456789]"

    # إذا كان BOT_MODE هو 'webhook'، أضف المتغيرات التالية
    # BOT_WEBHOOK="https://your-domain.com/webhook"
    # BOT_WEBHOOK_SECRET="your-secret-token"
    # SERVER_HOST="0.0.0.0"
    # SERVER_PORT="80"
    ```

5.  **تشغيل البوت:**

    لتشغيل البوت في وضع التطوير مع المراقبة:

    ```bash
    npm run dev
    ```

    لبناء وتشغيل البوت في وضع الإنتاج:

    ```bash
    npm run build
    npm start
    ```

## أوامر أخرى

-   `npm run lint`: للتحقق من تنسيق الكود.
-   `npm run format`: لإصلاح تنسيق الكود.
-   `npm run typecheck`: للتحقق من الأنواع في TypeScript.
