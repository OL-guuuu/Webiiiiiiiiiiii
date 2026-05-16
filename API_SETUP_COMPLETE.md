# API Save System - Complete Setup Guide

## 🎯 Overview

Your website now has a completely rebuilt **API Save System** that automatically persists all dashboard changes to a cloud storage backend. When you click "Save to API", your changes are saved globally and visible to all visitors.

## 🚨 Current Status

Your system is **NOT configured** yet. The API endpoints are ready, but you need to set up persistent storage.

### Storage Backends Available:

- **Vercel KV** (Recommended if using Vercel) - Fastest, free tier available
- **Upstash Redis** (Works anywhere) - Excellent free tier, 10,000 commands/day
- **Local File** (Development only) - Not suitable for production

## ⚡ Quick Setup (Choose One)

### Option 1: Upstash Redis (Recommended for Everyone)

**Step 1: Create Upstash Account**

1. Go to https://upstash.com
2. Sign up for a free account
3. Create a new Redis database

**Step 2: Get Your Credentials**

1. In your Upstash dashboard, find your database
2. Click "Details" → "REST API"
3. Copy these values:
   - `UPSTASH_REDIS_REST_URL` (starts with `https://`)
   - `UPSTASH_REDIS_REST_TOKEN` (your bearer token)

**Step 3: Add Environment Variables**

If deploying on **Vercel**:

1. Go to your project settings → Environment Variables
2. Add two variables:
   - Name: `UPSTASH_REDIS_REST_URL` → Paste the URL
   - Name: `UPSTASH_REDIS_REST_TOKEN` → Paste the token
3. Redeploy your site

If hosting **locally**:

1. Create a `.env.local` file in your project root:
   ```
   UPSTASH_REDIS_REST_URL=https://your-url-here
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```
2. Restart your development server

**Step 4: Verify**

1. Go to your dashboard
2. Click "Settings" → "Storage & Backup"
3. Click the "Check" button next to "API Health"
4. You should see "✓ Upstash Redis Connected"

### Option 2: Vercel KV (If Using Vercel)

**Step 1: Enable Vercel KV**

1. Go to Vercel dashboard → Your Project
2. Go to "Storage" tab → "Create Database" → "Vercel KV"
3. Choose a region and create

**Step 2: Get Credentials**

1. Go to the KV database details
2. Copy these:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

**Step 3: Add to Environment Variables**

1. Go to Project Settings → Environment Variables
2. Add both variables (they should auto-populate if using Vercel's UI)
3. Redeploy

## 🧪 Testing Your Setup

### Test 1: Check API Health

1. Open Dashboard → Settings → Storage & Backup
2. Click "Check" button
3. Should show "healthy" status with green checkmarks

### Test 2: Make a Test Change

1. Go to Dashboard → Site Editor → Any Section
2. Change a small piece of text
3. Click "Save to API"
4. Should see success message: "Changes saved to API successfully!"

### Test 3: Verify Persistence

1. Open your site in a **different browser** or **incognito window**
2. Your changes should be visible to the new visitor
3. If changes are visible, everything is working!

## 📊 API Diagnostics

The system includes built-in diagnostics. In your Dashboard:

1. Go to **Settings** → **Storage & Backup**
2. Click the **"Check"** button next to "API Health"
3. You'll see detailed status for:
   - ✓ Config Endpoint connectivity
   - ✓ Vercel KV status (if configured)
   - ✓ Upstash Redis status (if configured)
   - ✓ Any issues preventing saves

### Common Issues & Fixes:

| Error                             | Cause                           | Fix                                                         |
| --------------------------------- | ------------------------------- | ----------------------------------------------------------- |
| "Config Endpoint: ✗ Error"        | API not responding              | Check deployment, wait 1-2 min                              |
| "Upstash Redis: ○ Not configured" | Missing env vars                | Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` |
| "Status: degraded"                | Storage backend failing         | Check Redis connection, verify credentials                  |
| "No persistent storage available" | Neither KV nor Redis configured | Follow setup steps above                                    |

## 🔧 API Endpoints Reference

Your system includes these endpoints:

### `GET /api/config`

Retrieves current configuration from storage backend

**Response:**

```json
{
  "success": true,
  "data": {
    /* your site config */
  },
  "source": "upstash-redis",
  "timestamp": 1234567890
}
```

### `PUT /api/config`

Saves configuration to storage backend

**Request:**

```json
{
  /* your site config */
}
```

**Response:**

```json
{
  "success": true,
  "source": "upstash-redis",
  "message": "Configuration saved to Upstash Redis - visible to all users",
  "timestamp": 1234567890
}
```

### `GET /api/health`

Diagnostic endpoint to check system health

**Response:**

```json
{
  "success": true,
  "status": "healthy",
  "storage": {
    "vercelKv": { "configured": false, "status": "not-configured" },
    "upstashRedis": { "configured": true, "status": "connected" },
    "localFile": { "configured": false, "status": "disabled-in-production" }
  },
  "recommendations": []
}
```

## 🛡️ Security Notes

- Your dashboard password is `00000008` (default, changeable in env vars)
- All API calls use HTTPS in production
- Configuration data is stored encrypted by your provider (Vercel/Upstash)
- No personally identifiable information is logged

## 🔄 How the System Works

1. **You edit content** in the Dashboard
2. **Changes saved locally** to your browser (instant)
3. **Click "Save to API"**
4. **API attempts to persist** to storage backends in priority order:
   - Vercel KV (if configured)
   - Upstash Redis (if configured)
   - Local file (dev only, with warning)
5. **Global update** - all visitors see the new config on next page load

## 📱 Multi-Device Sync

Once your API is configured, changes made on any device are instantly visible everywhere:

1. Edit on **Desktop Dashboard** → Click "Save to API"
2. Open site on **Mobile** → Changes visible immediately
3. Edit on **Tablet Dashboard** → Click "Save to API"
4. Check **Desktop** → Changes visible

## 🚀 Advanced Configuration

### Custom API Password

Set in environment variables:

```
DASHBOARD_PASSWORD=your-custom-password
```

### Change Storage Backend

To switch from Upstash to Vercel KV:

1. Add `KV_REST_API_URL` and `KV_REST_API_TOKEN`
2. Remove or keep `UPSTASH_REDIS_*` (system will prefer KV)
3. Redeploy

### Monitoring & Logging

Check your deployment logs:

- **Vercel**: Deployments → Runtime Logs
- **Local**: Check browser console when using dev server

## ❓ Troubleshooting

### Changes not appearing for other users?

1. Click "Check" in API Health
2. Verify all backends show green ✓
3. If not, follow configuration steps above
4. Click "Save to API" again

### Getting timeout errors?

1. Check internet connection
2. Verify Redis credentials are correct
3. In Upstash, check rate limits haven't been exceeded
4. Try again in 30 seconds

### Want to test locally?

1. The system automatically falls back to local file storage in development
2. Changes won't sync across devices locally (by design)
3. Deploy to production to test global sync

## 📞 Support

If problems persist:

1. Check the error message in Dashboard → Settings → Storage & Backup
2. Run "Check" to get detailed diagnostics
3. Review logs in your deployment platform
4. Verify all environment variables are set correctly

---

**Your system is now ready to save and sync changes globally! 🎉**
