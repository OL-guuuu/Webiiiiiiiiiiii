# إعداد قاعدة بيانات Upstash Redis

## 📋 نظرة عامة

هذا الدليل يشرح كيفية إنشاء قاعدة بيانات Upstash Redis وربطها بمشروعك على Vercel.

## 🚀 الخطوات

### الخطوة 1: إنشاء حساب Upstash

1. اذهب إلى [https://upstash.com](https://upstash.com)
2. انقر على "Sign Up" أو "Login"
3. يمكنك استخدام GitHub أو Google للتسجيل

### الخطوة 2: إنشاء قاعدة بيانات Redis

1. بعد تسجيل الدخول، انقر على "Create Database"
2. اختر المنطقة (Region) الأقرب لك (مثلاً: Frankfurt أو Paris)
3. انقر على "Create"

### الخطوة 3: الحصول على بيانات الاتصال

1. بعد إنشاء قاعدة البيانات، سترى صفحة "Details"
2. انسخ القيم التالية:
   - **UPSTASH_REDIS_REST_URL**: رابط REST API
   - **UPSTASH_REDIS_REST_TOKEN**: رمز التحقق (Token)

### الخطوة 4: إضافة المتغيرات البيئية إلى Vercel

#### الطريقة 1: عبر واجهة الويب

1. اذهب إلى [https://vercel.com](https://vercel.com)
2. اختر مشروعك `webiiiiii`
3. انقر على "Settings" ثم "Environment Variables"
4. أضف المتغيرات التالية:

   **المتغير 1:**
   - Name: `UPSTASH_REDIS_REST_URL`
   - Value: (القيمة التي نسختها من Upstash)
   - Environments: Production, Preview, Development

   **المتغير 2:**
   - Name: `UPSTASH_REDIS_REST_TOKEN`
   - Value: (القيمة التي نسختها من Upstash)
   - Environments: Production, Preview, Development

   **المتغير 3:**
   - Name: `DASHBOARD_SESSION_SECRET`
   - Value: قيمة طويلة وعشوائية لا تشاركها مع أحد
   - Environments: Production, Preview, Development

   **المتغير 4 (اختياري):**
   - Name: `APP_ORIGIN`
   - Value: رابط الموقع النهائي، مثل `https://webiiiiii.vercel.app`
   - Environments: Production

5. انقر على "Save"

#### الطريقة 2: عبر CLI

```bash
# إضافة UPSTASH_REDIS_REST_URL
vercel env add UPSTASH_REDIS_REST_URL production
# الصق القيمة عند الطلب

# إضافة UPSTASH_REDIS_REST_TOKEN
vercel env add UPSTASH_REDIS_REST_TOKEN production
# الصق القيمة عند الطلب
```

### الخطوة 5: إعادة نشر المشروع

بعد إضافة المتغيرات البيئية، ستحتاج إلى إعادة نشر المشروع:

```bash
vercel --prod
```

أو عبر واجهة الويب:

1. اذهب إلى "Deployments"
2. انقر على "Redeploy"

## ✅ التحقق من الإعداد

بعد إعادة النشر، يمكنك التحقق من أن قاعدة البيانات تعمل بشكل صحيح:

1. افتح الـdashboard محلياً: `npm run dev`
2. قم بتعديل بعض الإعدادات
3. انقر على زر "Save to API" (سيتم إضافته قريباً)
4. افتح الموقع المنشور: https://webiiiiii.vercel.app
5. تحقق من أن التغييرات تظهر

### تصدير واستيراد التخصيصات

من داخل الداشبورد يمكنك الآن تصدير حزمة تخصيص كاملة بصيغة JSON، ثم استيرادها لاحقاً لإعادة كل الإعدادات والنسخ المحفوظة إلى نفس الحالة.

## 🔧 استكشاف الأخطاء

### المشكلة: "Redis not initialized"

**الحل:**

- تأكد من إضافة المتغيرات البيئية بشكل صحيح
- تأكد من إعادة نشر المشروع بعد إضافة المتغيرات

### المشكلة: "Failed to save config to Redis"

**الحل:**

- تحقق من صحة بيانات الاتصال (URL و Token)
- تأكد من أن قاعدة البيانات نشطة في Upstash

### المشكلة: التغييرات لا تظهر على الموقع المنشور

**الحل:**

- تأكد من أنك قمت بحفظ الإعدادات إلى API
- تحقق من سجلات Vercel (Logs) لمعرفة الأخطاء
- تأكد من أن المتغيرات البيئية موجودة في بيئة Production

### المشكلة: لا يمكن تسجيل الدخول إلى لوحة التحكم

**الحل:**

- تأكد من ضبط `DASHBOARD_PASSWORD` و `DASHBOARD_SESSION_SECRET`
- تأكد من عدم حظر الكوكيز في المتصفح
- إذا كان الموقع يعمل على دومين مخصص، اضبط `APP_ORIGIN` ليطابقه

## 📊 معلومات إضافية

### الأسعار

Upstash Redis يقدم خطة مجانية تتضمن:

- 10,000 أمر يومياً
- 256 MB تخزين
- استمرارية البيانات

هذا كافٍ تماماً لمشروعك الحالي.

### الأمان

- لا تشارك بيانات الاتصال (URL و Token) مع أي شخص
- تأكد من أن المتغيرات البيئية محمية في Vercel
- استخدم كلمات مرور قوية لـ DASHBOARD_PASSWORD
- استخدم قيمة عشوائية طويلة لـ DASHBOARD_SESSION_SECRET

## 🎯 الخطوات التالية

بعد إعداد قاعدة البيانات:

1. ✅ تم تعديل API endpoint لاستخدام Upstash Redis
2. ✅ تم تعزيز المصادقة بجلسة HttpOnly
3. ⏳ سيتم اختبار الاتصال محلياً
4. ⏳ سيتم إعادة نشر الموقع
5. ⏳ سيتم التحقق من أن التغييرات تظهر فوراً

## 📞 الدعم

إذا واجهت أي مشاكل:

- تحقق من [وثائق Upstash](https://upstash.com/docs)
- تحقق من [وثائق Vercel](https://vercel.com/docs)
- راجع سجلات Vercel (Logs) في لوحة التحكم
