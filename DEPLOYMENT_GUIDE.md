# دليل نشر الموقع

## نظرة عامة

هذا الدليل يشرح كيفية نشر الموقع على Vercel مع الحفاظ على الـ Dashboard متصلاً بالموقع المنشور.

## البنية المعمارية

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐              │
│  │  Public Site │         │  Dashboard   │              │
│  │  (/)         │         │  (/dashboard) │              │
│  └──────┬───────┘         └──────┬───────┘              │
│         │                        │                        │
│         │                        │                        │
│         └────────┬───────────────┘                        │
│                  │                                        │
│                  ▼                                        │
│         ┌──────────────────┐                             │
│         │  API Endpoint    │                             │
│         │  (/api/config)   │                             │
│         └──────────────────┘                             │
│                  │                                        │
│                  ▼                                        │
│         ┌──────────────────┐                             │
│         │  Serverless      │                             │
│         │  Function        │                             │
│         └──────────────────┘                             │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## المميزات

✅ **الموقع العام**: يعرض المحتوى للجمهور ويجلب الإعدادات من API  
✅ **الـ Dashboard**: يسمح لك بتعديل الإعدادات وحفظها إلى API  
✅ **API Endpoint**: يدير الإعدادات ويوفرها للموقع والـDashboard  
✅ **المزامنة التلقائية**: أي تعديل في الـDashboard ينعكس فوراً على الموقع  
✅ **الحماية**: الـDashboard محمي بكلمة مرور

## خطوات النشر

### 1. إعداد المشروع

تأكد من أن جميع الملفات التالية موجودة:

- `api/config.ts` - API endpoint
- `src/utils/apiClient.ts` - API client
- `src/context/SiteConfigContext.tsx` - Context مع دعم API
- `vercel.json` - إعدادات Vercel
- `.env.example` - مثال المتغيرات البيئية

### 2. إعداد المتغيرات البيئية

أنشئ ملف `.env` في جذر المشروع:

```bash
# كلمة مرور الـDashboard (غيرها في الإنتاج)
DASHBOARD_PASSWORD=your_secure_password_here
```

### 3. نشر على Vercel

#### الطريقة الأولى: عبر Vercel CLI

```bash
# تثبيت Vercel CLI
npm install -g vercel

# تسجيل الدخول
vercel login

# نشر المشروع
vercel

# نشر للإنتاج
vercel --prod
```

#### الطريقة الثانية: عبر GitHub

1. ادفع المشروع إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. انقر على "Add New Project"
4. اختر مستودع GitHub الخاص بك
5. Vercel سيكتشف تلقائياً إعدادات المشروع
6. انقر على "Deploy"

### 4. إعداد المتغيرات البيئية في Vercel

بعد النشر:

1. اذهب إلى إعدادات المشروع في Vercel
2. اختر "Environment Variables"
3. أضف المتغير التالي:
   - **Name**: `DASHBOARD_PASSWORD`
   - **Value**: كلمة المرور الخاصة بك
4. انقر على "Save"
5. أعد نشر المشروع لتطبيق التغييرات

## كيفية الاستخدام

### للموقع العام

1. زور الموقع المنشور (مثلاً: `https://your-site.vercel.app`)
2. الموقع سيجلب تلقائياً الإعدادات من API
3. أي تعديل في الـDashboard سيظهر فوراً

### للـDashboard

1. زور الـDashboard (مثلاً: `https://your-site.vercel.app/dashboard`)
2. أدخل كلمة المرور للوصول
3. عدل الإعدادات كما تريد
4. اضغط على "حفظ إلى API" لحفظ التغييرات
5. التغييرات ستنعكس فوراً على الموقع العام

## التحقق من النشر

### اختبار API

```bash
# جلب الإعدادات
curl https://your-site.vercel.app/api/config

# تحديث الإعدادات (يتطلب كلمة المرور)
curl -X PUT https://your-site.vercel.app/api/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_password" \
  -d '{"siteName":"My Site"}'
```

### اختبار الموقع

1. افتح الموقع في المتصفح
2. تحقق من أن الإعدادات تظهر بشكل صحيح
3. افتح الـDashboard
4. عدل إعداد ما
5. عدل إلى الموقع وتحقق من ظهور التغيير

## استكشاف الأخطاء

### المشكلة: الموقع لا يجلب الإعدادات من API

**الحلول:**
- تأكد من أن API endpoint يعمل: `curl https://your-site.vercel.app/api/config`
- تحقق من console logs في المتصفح
- تأكد من أن `NEXT_PUBLIC_API_URL` مضبوط بشكل صحيح

### المشكلة: الـDashboard لا يحفظ التغييرات

**الحلول:**
- تأكد من أن كلمة المرور صحيحة
- تحقق من console logs في الـDashboard
- تأكد من أن `DASHBOARD_PASSWORD` مضبوط في Vercel

### المشكلة: التغييرات لا تظهر فوراً

**الحلول:**
- امسح cache المتصفح
- تأكد من أن الموقع يجلب الإعدادات من API وليس من localStorage
- تحقق من أن `cache: 'no-store'` مضبوط في طلبات API

## الأمان

### نصائح مهمة

1. **غير كلمة المرور**: استخدم كلمة مرور قوية في الإنتاج
2. **استخدم HTTPS**: Vercel يوفر HTTPS تلقائياً
3. **حد الوصول**: الـDashboard يجب أن يكون متاحاً فقط لك
4. **راقب السجلات**: راقب logs في Vercel لاكتشاف أي نشاط مشبوه

### تحسينات الأمان المقترحة

- إضافة rate limiting للـAPI
- استخدام JWT بدلاً من كلمة مرور بسيطة
- إضافة logging لجميع عمليات التعديل
- استخدام IP whitelist للـDashboard

## الصيانة

### تحديث المشروع

```bash
# سحب التغييرات
git pull origin main

# تثبيت التحديثات
npm install

# إعادة النشر
vercel --prod
```

### النسخ الاحتياطي

الإعدادات محفوظة في:
- API (على Vercel)
- localStorage (في المتصفح)

للنسخ الاحتياطي:
1. استخدم زر "تصدير" في الـDashboard
2. احفظ الملف JSON
3. يمكنك استيراده لاحقاً إذا لزم الأمر

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من logs في Vercel Dashboard
2. راجع console logs في المتصفح
3. تأكد من أن جميع المتغيرات البيئية مضبوطة
4. راجع هذا الدليل مرة أخرى

## الموارد

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)