
# النشر (Deployment)

يوفر هذا القالب إعدادات جاهزة لنشر الروبوت الخاص بك باستخدام Docker. يوضح هذا القسم كيفية استخدام هذا الإعداد.

## النشر باستخدام Docker

يأتي القالب مع فرع (`branch`) مخصص يسمى `deploy/docker-compose` يحتوي على جميع الملفات والإعدادات اللازمة لتشغيل الروبوت داخل حاوية Docker. لاستخدام هذا الإعداد، يجب عليك دمج (merge) هذا الفرع في مشروعك.

### الخطوة 1: إضافة القالب كمستودع بعيد (Remote)

إذا لم تكن قد قمت بذلك بالفعل، أضف مستودع القالب الأصلي كمستودع بعيد (remote) في مشروعك المحلي:

```bash
git remote add template https://github.com/bot-base/telegram-bot-template.git
git remote update
```

### الخطوة 2: دمج فرع Docker

قم بدمج فرع `deploy/docker-compose` في مشروعك. استخدم الأمر التالي لدمج الملفات مع إعطاء الأولوية للملفات الواردة من الفرع:

```bash
git merge template/deploy/docker-compose -X theirs --squash --no-commit --allow-unrelated-histories
```

بعد تشغيل هذا الأمر، سيكون لديك ملفات `compose.yml` و `compose.prod.yml` وملف `Dockerfile` في مشروعك.

### الخطوة 3: إعداد متغيرات البيئة

بدلاً من ملف `.env` واحد، يستخدم إعداد Docker ملفات بيئة منفصلة للتطوير والإنتاج.

1.  قم بإنشاء ملفات البيئة اللازمة:

    ```bash
    # لبيئة التطوير
    cp .env.example .env.bot.dev

    # لبيئة الإنتاج
    cp .env.example .env.bot.prod
    ```

2.  افتح الملفين الجديدين (`.env.bot.dev` و `.env.bot.prod`) وقم بتعيين `BOT_TOKEN` والمتغيرات الأخرى اللازمة لكل بيئة.

### الخطوة 4: تشغيل الروبوت باستخدام Docker Compose

الآن يمكنك تشغيل الروبوت باستخدام Docker.

-   **في وضع التطوير (Development Mode):**

    سيقوم هذا الأمر ببناء وتشغيل الحاوية في وضع التطوير مع إعادة التحميل التلقائي عند تغيير الكود.

    ```bash
    docker compose up
    ```

-   **في وضع الإنتاج (Production Mode):**

    تأكد من تعيين `DEBUG="false"` في ملف `.env.bot.prod`.

    استخدم الأمر التالي لتشغيل الروبوت في وضع الإنتاج. يستخدم هذا الأمر ملف `compose.prod.yml` الإضافي الذي يحتوي على إعدادات محسّنة للإنتاج.

    ```bash
    docker compose -f compose.yml -f compose.prod.yml up
    ```

    للتشغيل في الخلفية، أضف الخيار `-d`:

    ```bash
    docker compose -f compose.yml -f compose.prod.yml up -d
    ```

باتباع هذه الخطوات، يمكنك بسهولة نشر وتشغيل روبوت تليجرام الخاص بك في بيئة معزولة وقابلة للتطوير باستخدام Docker.
