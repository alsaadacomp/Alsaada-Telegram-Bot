# 8️⃣ النشر والتشغيل - Deployment

## 🚀 نظرة عامة

دليل شامل لنشر البوت في بيئات مختلفة.

---

## 🔧 الإعداد للإنتاج

### 1. تحديث ملف .env

```env
# الإنتاج
BOT_TOKEN=your_production_token
BOT_MODE=polling  # أو webhook
DATABASE_URL="postgresql://user:pass@host:5432/db"
LOG_LEVEL=info
DEBUG=false
BOT_ADMINS=[your_telegram_id]
```

### 2. بناء المشروع

```bash
# تثبيت الحزم (production only)
npm ci --only=production

# توليد Prisma Client
npm run prisma:generate

# تطبيق Migrations
npm run prisma:migrate:prod

# بناء TypeScript (اختياري)
npm run build
```

### 3. اختبار الإنتاج محلياً

```bash
# اختبر قبل النشر
npm start
```

---

## 🐳 Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine

# تثبيت dependencies
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# نسخ الكود
COPY . .

# توليد Prisma Client
RUN npx prisma generate

# تعريف المنفذ (للـ Webhook)
EXPOSE 80

# تشغيل البوت
CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  bot:
    build: .
    restart: unless-stopped
    env_file: .env
    volumes:
      - ./data:/app/data # لقاعدة SQLite
    # ports:  # إذا كنت تستخدم Webhook
    #   - "80:80"

  # (اختياري) PostgreSQL
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: botuser
      POSTGRES_PASSWORD: strongpassword
      POSTGRES_DB: botdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

volumes:
  postgres_data:
```

### الأوامر

```bash
# بناء وتشغيل
docker-compose up -d

# عرض السجلات
docker-compose logs -f bot

# إيقاف
docker-compose down

# إعادة البناء
docker-compose up -d --build
```

---

## ☁️ الخوادم السحابية

### VPS (DigitalOcean, Linode, etc.)

#### 1. الاتصال بالخادم

```bash
ssh root@your_server_ip
```

#### 2. التثبيت

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت Git
apt install -y git

# تثبيت PM2 (Process Manager)
npm install -g pm2
```

#### 3. رفع المشروع

```bash
# استنساخ المشروع
cd /opt
git clone <your-repo-url> telegram-bot
cd telegram-bot

# التثبيت
npm ci --only=production

# إنشاء .env
nano .env
# (أضف متغيرات البيئة)

# إعداد القاعدة
npm run prisma:generate
npm run prisma:migrate:prod
```

#### 4. التشغيل مع PM2

```bash
# تشغيل البوت
pm2 start npm --name "telegram-bot" -- start

# حفظ القائمة
pm2 save

# تفعيل التشغيل التلقائي عند الإقلاع
pm2 startup
# (اتبع التعليمات)

# الأوامر المفيدة
pm2 status              # حالة التطبيقات
pm2 logs telegram-bot   # عرض السجلات
pm2 restart telegram-bot  # إعادة التشغيل
pm2 stop telegram-bot   # إيقاف
pm2 delete telegram-bot # حذف
```

---

## 🌐 Webhook Mode

### إعداد Nginx كـ Reverse Proxy

#### 1. تثبيت Nginx

```bash
apt install -y nginx certbot python3-certbot-nginx
```

#### 2. إعداد Nginx

```nginx
# /etc/nginx/sites-available/telegram-bot

server {
    listen 80;
    server_name bot.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# تفعيل الموقع
ln -s /etc/nginx/sites-available/telegram-bot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 3. الحصول على شهادة SSL

```bash
certbot --nginx -d bot.yourdomain.com
```

#### 4. تحديث .env

```env
BOT_MODE=webhook
BOT_WEBHOOK=https://bot.yourdomain.com/webhook
BOT_WEBHOOK_SECRET=your-secret-token-min-12-chars
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
```

#### 5. تشغيل البوت

```bash
pm2 restart telegram-bot
```

---

## 🔄 التحديث والصيانة

### تحديث البوت

```bash
# الاتصال بالخادم
ssh root@your_server_ip

# الانتقال للمجلد
cd /opt/telegram-bot

# جلب التحديثات
git pull

# تثبيت الحزم الجديدة
npm ci --only=production

# تحديث القاعدة (إذا لزم)
npm run prisma:migrate:prod
npm run prisma:generate

# إعادة تشغيل البوت
pm2 restart telegram-bot
```

### النسخ الاحتياطي

#### قاعدة البيانات

```bash
# SQLite
cp /opt/telegram-bot/data/dev.db /backups/db-$(date +%Y%m%d).db

# PostgreSQL
pg_dump -U botuser botdb > /backups/db-$(date +%Y%m%d).sql
```

#### أتمتة النسخ الاحتياطي

```bash
# إنشاء سكريبت
nano /opt/backup-bot.sh
```

```bash
#!/bin/bash
# /opt/backup-bot.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/backups/telegram-bot"

mkdir -p $BACKUP_DIR

# نسخ قاعدة البيانات
cp /opt/telegram-bot/data/dev.db $BACKUP_DIR/db-$DATE.db

# حذف النسخ الأقدم من 7 أيام
find $BACKUP_DIR -name "db-*.db" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# جعله قابل للتنفيذ
chmod +x /opt/backup-bot.sh

# جدولة يومياً الساعة 3 صباحاً
crontab -e
# أضف:
0 3 * * * /opt/backup-bot.sh >> /var/log/bot-backup.log 2>&1
```

---

## 📊 المراقبة

### عرض السجلات

```bash
# PM2 logs
pm2 logs telegram-bot

# مع فلترة
pm2 logs telegram-bot | grep ERROR

# آخر 100 سطر
pm2 logs telegram-bot --lines 100
```

### مراقبة الأداء

```bash
# PM2 monitoring
pm2 monit

# معلومات مفصلة
pm2 show telegram-bot
```

### إعداد تنبيهات

```bash
# تثبيت PM2 monitoring (اختياري)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🛡️ الأمان

### 1. جدار الحماية

```bash
# UFW (Ubuntu Firewall)
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable

# التحقق
ufw status
```

### 2. تأمين SSH

```bash
# /etc/ssh/sshd_config
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# إعادة تشغيل SSH
systemctl restart sshd
```

### 3. تحديثات الأمان

```bash
# تحديثات تلقائية
apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

---

## ⚡ تحسين الأداء

### 1. استخدام PostgreSQL بدلاً من SQLite

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/botdb"
```

### 2. تفعيل Caching

```typescript
// استخدم Redis للـ session storage
import { RedisAdapter } from '@grammyjs/storage-redis'
import { Redis } from 'ioredis'

const redis = new Redis()
const storage = new RedisAdapter({ instance: redis })
```

### 3. Load Balancing (للبوتات الكبيرة)

استخدم عدة instances مع PM2:

```bash
pm2 start npm --name "telegram-bot" -i 4 -- start
# -i 4 = 4 instances
```

---

## 🐛 حل المشاكل

### البوت لا يستجيب

```bash
# تحقق من الحالة
pm2 status

# تحقق من السجلات
pm2 logs telegram-bot --err

# أعد التشغيل
pm2 restart telegram-bot
```

### خطأ في قاعدة البيانات

```bash
# أعد إنشاء Client
npm run prisma:generate

# طبق Migrations
npm run prisma:migrate:prod
```

### مشاكل الذاكرة

```bash
# زيادة حد الذاكرة لـ PM2
pm2 start npm --name "telegram-bot" --max-memory-restart 500M -- start
```

---

## 📝 Checklist قبل النشر

- [ ] اختبرت البوت محلياً
- [ ] حدثت `.env` بقيم الإنتاج
- [ ] DEBUG=false
- [ ] استخدمت قاعدة بيانات إنتاجية
- [ ] طبقت جميع Migrations
- [ ] أعددت HTTPS (للـ Webhook)
- [ ] فعلت جدار الحماية
- [ ] أعددت النسخ الاحتياطي
- [ ] أعددت المراقبة
- [ ] وثقت معلومات الخادم

---

## 📚 موارد إضافية

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

---

[⬅️ السابق: دليل التطوير](./07-development-guide.md) | [⬆️ العودة للفهرس](./README.md) | [➡️ التالي: المرجع البرمجي](./09-api-reference.md)
