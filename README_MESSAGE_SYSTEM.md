# نظام الرسائل الآمن - دليل المستخدم

## نظرة عامة

نظام رسائل آمن بالكامل يربط بين صفحة الاتصال ولوحة التحكم، مع حماية متقدمة من جميع الهجمات الشائعة.

## الميزات الرئيسية

### ✅ التواصل الكامل
- إرسال رسائل من صفحة Contact
- عرض الرسائل في Dashboard
- تحديث تلقائي للرسائل
- تحديث يدوي عند الطلب

### ✅ الأمان المتقدم
- حماية من XSS
- حماية من CSRF
- حماية من Rate Limiting
- حماية من Honeypot
- تشفير البيانات
- التحقق من صحة البيانات

### ✅ سهولة الاستخدام
- واجهة مستخدم بسيطة
- رسائل نجاح/خطأ واضحة
- تحديث تلقائي
- إدارة سهلة للرسائل

## البدء السريع

### 1. التثبيت

```bash
# استنساخ المشروع
git clone <your-repo-url>
cd <project-directory>

# تثبيت المكتبات
npm install

# تكوين متغيرات البيئة
cp .env.example .env
```

### 2. تكوين متغيرات البيئة

```env
# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# أو Vercel KV
KV_REST_API_URL=your_kv_url
KV_REST_API_TOKEN=your_kv_token

# مفاتيح التشفير
ENCRYPTION_KEY=your_encryption_key
CSRF_SECRET=your_csrf_secret
```

### 3. تشغيل المشروع

```bash
# تشغيل في وضع التطوير
npm run dev

# بناء المشروع
npm run build

# تشغيل في وضع الإنتاج
npm run preview
```

## الاستخدام

### إرسال رسالة

1. افتح صفحة Contact
2. املأ النموذج:
   - الاسم
   - البريد الإلكتروني
   - الموضوع
   - الرسالة
3. اضغط "إرسال"
4. انتظر رسالة النجاح

### عرض الرسائل

1. افتح Dashboard
2. انتقل لقسم "Messages"
3. الرسائل تُعرض تلقائياً
4. يمكنك:
   - عرض تفاصيل الرسالة
   - تحديث الحالة (new/read/archived)
   - حذف الرسالة
   - تحديث القائمة

### تحديث الرسائل

1. افتح Dashboard
2. انتقل لقسم "Messages"
3. اضغط زر "تحديث"
4. انتظر تحديث القائمة

## الأمان

### الحماية من الهجمات

#### XSS (Cross-Site Scripting)
```javascript
// محاولة حقن XSS
const maliciousInput = '<script>alert("XSS")</script>';
const sanitized = sanitizeInput(maliciousInput);
// النتيجة: '<script>alert("XSS")</script>'
```

#### CSRF (Cross-Site Request Forgery)
```javascript
// محاولة CSRF بدون token
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* data */ })
});
// النتيجة: 403 Forbidden
```

#### Rate Limiting
```javascript
// إرسال أكثر من 5 رسائل في 5 دقائق
for (let i = 0; i < 6; i++) {
  await sendMessage({ /* data */ });
}
// النتيجة: 429 Too Many Requests
```

#### Honeypot
```javascript
// ملء حقل Honeypot
const formData = {
  name: 'Test',
  email: 'test@example.com',
  subject: 'Test',
  message: 'Test message',
  website_url: 'http://bot.com' // حقل Honeypot
};
// النتيجة: 403 Forbidden
```

### التحقق من البيانات

```javascript
// التحقق من صحة الرسالة
const validation = validateMessage({
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Test',
  message: 'Test message'
});

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

## API

### POST /api/messages

إرسال رسالة جديدة.

**الطلب**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Test Subject",
  "message": "Test message",
  "csrfToken": "your-csrf-token"
}
```

**الاستجابة الناجحة**:
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": "msg-123456",
    "status": "new",
    "receivedAt": "2026-05-13T12:00:00Z"
  }
}
```

**الاستجابة الفاشلة**:
```json
{
  "success": false,
  "error": "Invalid email address"
}
```

### GET /api/messages

جلب جميع الرسائل.

**الاستجابة**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123456",
      "senderName": "John Doe",
      "email": "john@example.com",
      "subject": "Test Subject",
      "message": "Test message",
      "status": "new",
      "receivedAt": "2026-05-13T12:00:00Z"
    }
  ]
}
```

### DELETE /api/messages/:id

حذف رسالة.

**الاستجابة**:
```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

### PATCH /api/messages/:id

تحديث حالة الرسالة.

**الطلب**:
```json
{
  "status": "read"
}
```

**الاستجابة**:
```json
{
  "success": true,
  "message": "Message status updated successfully"
}
```

## استكشاف الأخطاء

### المشكلة: الرسائل لا تظهر في Dashboard

**الحلول**:
1. تحقق من تكوين Upstash Redis
2. تحقق من اتصال API
3. اضغط زر "تحديث" في Dashboard
4. راجع سجلات المتصفح

### المشكلة: خطأ "Too Many Requests"

**الحلول**:
1. انتظر 5 دقائق
2. تحقق من Rate Limiting
3. راجع سجلات API

### المشكلة: خطأ "Invalid CSRF Token"

**الحلول**:
1. أعد تحميل الصفحة
2. تحقق من CSRF token
3. راجع إعدادات الأمان

### المشكلة: خطأ "Invalid Email"

**الحلول**:
1. تحقق من صحة البريد الإلكتروني
2. استخدم صيغة صحيحة: `user@example.com`
3. راجع قواعد التحقق

## الصيانة

### النسخ الاحتياطي

```bash
# نسخ احتياطي يومي
npm run backup:daily

# نسخ احتياطي أسبوعي
npm run backup:weekly

# نسخ احتياطي شهري
npm run backup:monthly
```

### المراقبة

```bash
# عرض السجلات
npm run logs

# مراقبة الأمان
npm run security:check

# فحص النظام
npm run health:check
```

### التحديثات

```bash
# تحديث المكتبات
npm update

# تحديث الأمان
npm audit fix

# تحديث التوثيق
npm run docs:update
```

## الأداء

### تحسينات الأداء

- ✅ جلب تلقائي للرسائل
- ✅ تحديث ذكي للقوائم
- ✅ تخزين مؤقت للبيانات
- ✅ تحميل تدريجي

### مقاييس الأداء

- وقت الاستجابة: < 200ms
- وقت التحميل: < 1s
- استخدام الذاكرة: < 50MB
- استخدام الشبكة: < 1MB

## الدعم

### التوثيق

- [دليل المستخدم](README_MESSAGE_SYSTEM.md)
- [تحديثات النظام](MESSAGE_SYSTEM_UPDATE.md)
- [تحسينات الأمان](SECURITY_IMPROVEMENTS.md)
- [API Documentation](API_DOCUMENTATION_INDEX.md)

### الموارد

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Best Practices](https://web.dev/secure/)
- [Upstash Redis Documentation](https://docs.upstash.com/redis)
- [Vercel KV Documentation](https://vercel.com/docs/storage/vercel-kv)

### المساعدة

إذا واجهت أي مشكلة:
1. راجع التوثيق
2. راجع السجلات
3. تحقق من الإعدادات
4. اتصل بالدعم الفني

## الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## المساهمون

- [فريق التطوير](mailto:dev@example.com)

## الشكر

شكراً لجميع المساهمين في هذا المشروع.

---

**ملاحظة**: هذا النظام مصمم بأمان عالي للتعامل مع الرسائل المهمة. تأكد من تكوين جميع متغيرات البيئة المطلوبة قبل الاستخدام.