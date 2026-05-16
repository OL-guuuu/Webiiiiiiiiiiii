# تحسينات الأمان - نظام الرسائل

## نظرة عامة
تم رفع مستوى الأمان في نظام الرسائل إلى أقصى درجة مع الحفاظ على سهولة الاستخدام. هذا النظام مصمم للتعامل مع الرسائل المهمة بأمان تام.

## التحسينات الأمنية المطبقة

### 1. التحقق من البيانات (Data Validation)
- **التحقق من صحة البريد الإلكتروني**: استخدام regex صارم للتحقق من صيغة البريد
- **التحقق من طول الحقول**: 
  - الاسم: 2-100 حرف
  - البريد الإلكتروني: 5-254 حرف
  - الموضوع: 5-200 حرف
  - الرسالة: 10-10000 حرف
- **منع الحقول الفارغة**: التحقق من أن جميع الحقول المطلوبة مليئة
- **تنظيف البيانات**: إزالة المسافات الزائدة من البداية والنهاية

### 2. الحماية من هجمات XSS
- **تنظيف HTML**: إزالة أي أكواد HTML أو JavaScript من المدخلات
- **ترميز الأحرف الخاصة**: تحويل الأحرف الخطرة إلى HTML entities
- **منع حقن البرامج النصية**: التحقق من عدم وجود `<script>` أو `javascript:` أو `onerror=`

### 3. الحماية من هجمات CSRF
- **Token CSRF**: إضافة token فريد لكل طلب
- **التحقق من Origin**: التحقق من أن الطلب يأتي من نفس النطاق
- **SameSite Cookies**: استخدام `SameSite=Strict` للكوكيز

### 4. الحماية من هجمات Rate Limiting
- **حد الطلبات**: 5 رسائل كحد أقصى لكل 5 دقائق لكل IP
- **تتبع الطلبات**: استخدام Redis لتتبع عدد الطلبات من كل IP
- **حظر مؤقت**: منع الطلبات الزائدة تلقائياً

### 5. الحماية من هجمات Honeypot
- **حقل مخفي**: إضافة حقل مخفي لا يراه البشر
- **التحقق من الحقل**: إذا تم ملء الحقل، يتم رفض الرسالة
- **كشف البوتات**: كشف البوتات التي تملأ جميع الحقول تلقائياً

### 6. التشفير والتخزين الآمن
- **تشفير البيانات**: تشفير محتوى الرسالة قبل التخزين
- **تخزين آمن**: استخدام Upstash Redis مع اتصال آمن
- **إدارة المفاتيح**: استخدام متغيرات البيئة للمفاتيح السرية

### 7. التحقق من المصدر (Source Verification)
- **التحقق من User-Agent**: التحقق من أن الطلب يأتي من متصفح حقيقي
- **التحقق من Referer**: التحقق من أن الطلب يأتي من صفحة الاتصال
- **منع الطلبات المباشرة**: منع الوصول المباشر إلى API

### 8. إدارة الجلسات (Session Management)
- **جلسات آمنة**: استخدام HttpOnly و Secure cookies
- **انتهاء الصلاحية**: انتهاء صلاحية الجلسة بعد 30 دقيقة
- **إعادة التوليد**: إعادة توليد session ID بعد تسجيل الدخول

## الملفات الأمنية الجديدة

### 1. `src/utils/securityUtils.ts`
أدوات أمان شاملة تشمل:
- `sanitizeInput()`: تنظيف المدخلات
- `validateEmail()`: التحقق من البريد الإلكتروني
- `generateCSRFToken()`: توليد token CSRF
- `validateCSRFToken()`: التحقق من token CSRF
- `encryptData()`: تشفير البيانات
- `decryptData()`: فك تشفير البيانات
- `generateHoneypotField()`: توليد حقل Honeypot
- `checkRateLimit()`: التحقق من حد الطلبات

### 2. `src/utils/messageValidator.ts`
مدقق بيانات الرسائل:
- `validateMessage()`: التحقق من صحة الرسالة
- `sanitizeMessageData()`: تنظيف بيانات الرسالة
- `ValidationResult`: نوع البيانات للنتائج

### 3. `api/messages.js`
API endpoint للرسائل:
- `POST /api/messages`: إرسال رسالة جديدة
- `GET /api/messages`: جلب جميع الرسائل
- `DELETE /api/messages/:id`: حذف رسالة
- `PATCH /api/messages/:id`: تحديث حالة الرسالة

## إعدادات الأمان

### متغيرات البيئة المطلوبة
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

### إعدادات Rate Limiting
```javascript
const RATE_LIMIT_CONFIG = {
  maxRequests: 5,        // أقصى عدد طلبات
  windowMs: 5 * 60 * 1000, // نافذة الوقت (5 دقائق)
  message: 'Too many requests, please try again later.'
};
```

### إعدادات Honeypot
```javascript
const HONEYPOT_CONFIG = {
  fieldName: 'website_url', // اسم الحقل المخفي
  timeout: 3000,            // الحد الأدنى للوقت (مللي ثانية)
};
```

## أفضل الممارسات الأمنية

### 1. للعميل (Frontend)
- ✅ استخدام HTTPS دائماً
- ✅ التحقق من صحة البيانات قبل الإرسال
- ✅ عدم تخزين بيانات حساسة في localStorage
- ✅ استخدام Content Security Policy (CSP)
- ✅ تحديث المكتبات بانتظام

### 2. للخادم (Backend)
- ✅ التحقق من جميع المدخلات
- ✅ استخدام Parameterized Queries
- ✅ تسجيل محاولات الاختراق
- ✅ مراقبة النشاط المشبوه
- ✅ النسخ الاحتياطي المنتظم

### 3. للتخزين (Storage)
- ✅ تشفير البيانات الحساسة
- ✅ استخدام اتصالات آمنة
- ✅ النسخ الاحتياطي المنتظم
- ✅ إدارة الصلاحيات بدقة
- ✅ مراجعة السجلات بانتظام

## الاختبار الأمني

### اختبار XSS
```javascript
// محاولة حقن XSS
const maliciousInput = '<script>alert("XSS")</script>';
const sanitized = sanitizeInput(maliciousInput);
// النتيجة: '<script>alert("XSS")</script>'
```

### اختبار CSRF
```javascript
// محاولة CSRF بدون token
const response = await fetch('/api/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* data */ })
});
// النتيجة: 403 Forbidden
```

### اختبار Rate Limiting
```javascript
// إرسال أكثر من 5 رسائل في 5 دقائق
for (let i = 0; i < 6; i++) {
  await sendMessage({ /* data */ });
}
// النتيجة: 429 Too Many Requests
```

### اختبار Honeypot
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

## المراقبة والتسجيل

### أنواع الأحداث المسجلة
- ✅ محاولات تسجيل الدخول الفاشلة
- ✅ محاولات CSRF المشبوهة
- ✅ تجاوز Rate Limiting
- ✅ ملء حقل Honeypot
- ✅ إدخالات غير صالحة
- ✅ أخطاء التشفير

### تنبيهات الأمان
- 🚨 محاولات متعددة من نفس IP
- 🚨 أنماط مشبوهة في البيانات
- 🚨 استخدام User-Agent غير معروف
- 🚨 محاولات الوصول إلى endpoints محمية

## الصيانة والتحديثات

### تحديثات أمنية منتظمة
- تحديث المكتبات شهرياً
- مراجعة الكود ربع سنوياً
- اختبار الاختراق سنوياً
- تحديث الشهادات أسبوعياً

### النسخ الاحتياطي
- نسخ احتياطي يومي للبيانات
- نسخ احتياطي أسبوعي للتكوين
- نسخ احتياطي شهري للسجلات
- اختبار الاستعادة شهرياً

## الدعم والمساعدة

### في حالة وجود مشكلة أمنية
1. راجع السجلات (logs)
2. تحقق من إعدادات الأمان
3. اختبر النظام
4. اتصل بالدعم الفني

### موارد إضافية
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Best Practices](https://web.dev/secure/)
- [CSP Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## الخلاصة

هذا النظام مصمم بأمان عالي للتعامل مع الرسائل المهمة. جميع التحسينات الأمنية تم تطبيقها واختبارها. النظام جاهز للاستخدام في بيئة الإنتاج.

**ملاحظة**: تأكد من تكوين جميع متغيرات البيئة المطلوبة قبل نشر النظام في بيئة الإنتاج.