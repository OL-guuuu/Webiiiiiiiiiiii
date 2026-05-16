# Webiiiiiiiiiiiiiii - موقع شخصي تفاعلي

موقع شخصي متكامل مع لوحة تحكم (Dashboard) تفاعلية، يدعم التعديل المباشر والمزامنة التلقائية.

## ✨ المميزات

### 🌐 الموقع العام

- عرض احترافي للمحتوى الشخصي
- تصميم متجاوب يعمل على جميع الأجهزة
- دعم الوضع الليلي والنهاري
- تحديثات فورية من الـDashboard

### 🎛️ لوحة التحكم (Dashboard)

- تعديل مباشر لجميع الإعدادات
- معاينة فورية للتغييرات
- حفظ التغييرات إلى API
- تصدير واستيراد حزمة تخصيص كاملة
- سجل نسخ وإمكانية استرجاع نسخة سابقة
- إحصائيات مفصلة

### 🔗 التكامل

- **API Endpoint**: يدير الإعدادات centrally
- **المزامنة التلقائية**: التغييرات تظهر فوراً على الموقع
- **الحماية**: جلسة خادم HttpOnly بدل كلمة مرور مكشوفة في الواجهة
- **التخزين**: دعم localStorage و API مع Upstash Redis

## 🚀 البدء السريع

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/OL-guuuu/Webiiiiiiiiiiii.git
cd Webiiiiiiiiiiii

# تثبيت الاعتماديات
npm install

# تشغيل المشروع محلياً
npm run dev
```

### المتغيرات البيئية

أنشئ ملف `.env` في جذر المشروع:

```bash
# كلمة مرور الـDashboard
DASHBOARD_PASSWORD=your_secure_password_here

# مفتاح جلسة المصادقة
DASHBOARD_SESSION_SECRET=your_long_random_secret

# أصل الموقع النهائي لتقييد CORS عند الحاجة
APP_ORIGIN=https://your-site.vercel.app
```

## 📁 البنية

```
webiiiiiiiiiiiiiii/
├── api/                    # API endpoints
│   └── config.ts          # إعدادات الموقع
├── src/
│   ├── components/        # مكونات React
│   ├── config/           # إعدادات الموقع
│   ├── context/          # React Context
│   ├── hooks/            # Custom Hooks
│   ├── pages/            # الصفحات
│   └── utils/            # أدوات مساعدة
├── public/               # ملفات عامة
├── vercel.json          # إعدادات Vercel
└── DEPLOYMENT_GUIDE.md  # دليل النشر
```

## 🎯 كيفية الاستخدام

### الموقع العام

1. افتح الموقع في المتصفح
2. الموقع سيجلب تلقائياً الإعدادات من API
3. استمتع بتصفح المحتوى

### لوحة التحكم

1. اذهب إلى `/dashboard`
2. أدخل كلمة المرور
3. عدل الإعدادات كما تريد
4. اضغط على "حفظ إلى API"
5. استخدم قسم `Storage & Backup` لتصدير حزمة التخصيص أو استيرادها لاحقاً
6. يمكنك استرجاع أي نسخة محفوظة من نفس القسم

## 🌐 النشر

### على Vercel

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

راجع [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) لمزيد من التفاصيل.

## 🔧 التطوير

### الأوامر المتاحة

```bash
# تشغيل بيئة التطوير
npm run dev

# بناء المشروع
npm run build

# معاينة البناء
npm run preview

# تشغيل الاختبارات
npm run test

# فحص الكود
npm run lint
```

### إضافة ميزات جديدة

1. عدل `src/config/siteConfig.ts` لإضافة إعدادات جديدة
2. أنشئ مكونات في `src/components/`
3. أضف الصفحات في `src/pages/`
4. استخدم `useSiteConfig()` للوصول إلى الإعدادات

## 📊 API

### GET /api/config

جلب إعدادات الموقع الحالية.

```bash
curl https://your-site.vercel.app/api/config
```

**الاستجابة:**

```json
{
  "success": true,
  "data": { ... },
  "lastUpdated": 1234567890,
  "version": "1.0.0"
}
```

### PUT /api/config

تحديث إعدادات الموقع (يتطلب مصادقة).

```bash
curl -X PUT https://your-site.vercel.app/api/config \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_password" \
  -d '{"siteName":"My Site"}'
```

**الاستجابة:**

```json
{
  "success": true,
  "lastUpdated": 1234567890,
  "version": "1.0.0"
}
```

## 🔒 الأمان

- الـDashboard يستخدم جلسة HttpOnly بعد تسجيل الدخول
- جميع طلبات الحفظ تتطلب جلسة صالحة
- HTTPS مفعّل تلقائياً على Vercel
- التخزين البعيد يتم عبر Upstash Redis عندما تكون المتغيرات البيئية مضبوطة

## 🤝 المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. Fork المشروع
2. أنشئ branch للميزة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى Branch (`git push origin feature/AmazingFeature`)
5. افتح Pull Request

## 📝 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف LICENSE للتفاصيل.

## 📞 الدعم

إذا واجهت أي مشاكل:

1. راجع [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. افتح Issue في GitHub
3. تواصل معنا عبر البريد الإلكتروني

## 🙏 شكر وتقدير

- Vercel لاستضافة المشروع
- React و Vite للتطوير
- المجتمع المفتوح المصدر

---

صُنع بـ ❤️ بواسطة [OL-guuuu](https://github.com/OL-guuuu)
