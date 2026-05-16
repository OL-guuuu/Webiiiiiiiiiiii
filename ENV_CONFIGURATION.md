# Environment Variables Configuration Template

## ⚡ Copy One of These Configurations

### Option 1: Upstash Redis (Recommended)

**For Vercel Deployment:**

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add these two environment variables:

```
Name: UPSTASH_REDIS_REST_URL
Value: [Paste your URL from Upstash]

Name: UPSTASH_REDIS_REST_TOKEN
Value: [Paste your token from Upstash]
```

3. Redeploy your project
4. Done! ✅

**For Local Development:**

1. Create file: `.env.local` in your project root
2. Add:

```env
UPSTASH_REDIS_REST_URL=https://your-url-from-upstash.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-from-upstash
```

3. Restart dev server
4. Done! ✅

---

### Option 2: Vercel KV (If Using Vercel)

**For Vercel Deployment:**

1. Go to Vercel Dashboard → Storage → Create Database → Vercel KV
2. Variables should auto-populate:

```
KV_REST_API_URL=https://your-kv-endpoint.vercel.app
KV_REST_API_TOKEN=your-token-here
```

3. Redeploy your project
4. Done! ✅

---

## 🔐 Where to Get Your Credentials

### Upstash

1. Sign up: https://upstash.com/
2. Create a Redis database
3. Click database name → "Details" or "REST API"
4. Copy:
   - `Endpoint` → `UPSTASH_REDIS_REST_URL`
   - `Token` → `UPSTASH_REDIS_REST_TOKEN`

### Vercel KV

1. Go to your Vercel project
2. "Storage" tab → Create KV Database
3. Credentials auto-added to Environment Variables

---

## ✅ Verification Checklist

After configuration:

- [ ] Environment variables added to deployment platform
- [ ] Project redeployed
- [ ] No deployment errors
- [ ] Dashboard → Settings → Storage & Backup → "Check" shows green ✓
- [ ] Test change: Edit something → "Save to API" → See success message
- [ ] Cross-device test: Open in different browser/device → Changes visible

---

## 🚨 If Something Goes Wrong

**"Environment variables not working?"**

1. Double-check variable names are EXACT (case-sensitive)
2. No extra spaces in values
3. Redeploy after adding variables
4. Wait 2-3 minutes for deployment to complete

**"Still getting errors after setup?"**

1. Dashboard → Settings → Storage & Backup
2. Click "Check" button
3. Read error messages - they're specific to your issue
4. Most common: Wrong credentials or network issue

**"Need to switch backends?"**

1. Just add/remove environment variables
2. System automatically uses available backend
3. No code changes needed

---

## 📝 Current Configuration Status

### Checked Values:

- `UPSTASH_REDIS_REST_URL`: Not set ❌
- `UPSTASH_REDIS_REST_TOKEN`: Not set ❌
- `KV_REST_API_URL`: Not set ❌
- `KV_REST_API_TOKEN`: Not set ❌

### Status: ⚠️ NEEDS CONFIGURATION

⏱️ **Time to setup:** ~5 minutes
📍 **Impact:** Changes will start syncing globally once configured

---

## 🎓 Understanding the System

**Before Configuration:**

- Changes save locally in your browser
- NOT visible to other devices
- "Save to API" works but doesn't persist globally

**After Configuration:**

- Changes save to Upstash or Vercel KV
- Visible to ALL visitors worldwide
- Works across devices/browsers
- Persists forever (or until you delete)

---

**Questions?** Check the detailed guide: `API_SETUP_COMPLETE.md`
