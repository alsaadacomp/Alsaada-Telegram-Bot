### Prisma وأوامر الصيانة

أوامر أساسية:
- `npx prisma generate` توليد العميل.
- `npx prisma migrate dev` إنشاء/تطبيق هجرات التطوير.
- `npx prisma migrate deploy` تطبيق هجرات الإنتاج.
- `npx prisma studio` واجهة إدارة.
- `npx prisma db pull` سحب المخطط من قاعدة البيانات.
- `npx prisma db push` دفع المخطط (تنبيه: قد يسبب تغييرات خطيرة).

مشاكل Windows EPERM:
- أغلق Prisma Studio، شغّل كمسؤول، وحاول `npx prisma migrate reset --force`.

نسخ احتياطي (اقتراح):
- استخدم سكربت خارجي لنسخ قاعدة البيانات `prisma/dev.db` بشكل دوري.
