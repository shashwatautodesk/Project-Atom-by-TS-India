# 🚀 Quick Deployment Guide

Your app is split into two parts:
- **Backend (API Server)** → Deployed on **Render**
- **Frontend (React App)** → Deployed on **Vercel**

---

## ⚡ Fastest Way: Auto-Deploy from GitHub

### Setup (One-Time)

1. **Enable Auto-Deploy on Render (Backend)**
   ```
   → https://dashboard.render.com/
   → Click your service
   → Settings → Git
   → Enable "Auto-Deploy"
   → Save
   ```

2. **Enable Auto-Deploy on Vercel (Frontend)**
   ```
   → https://vercel.com/dashboard
   → Click your project
   → Settings → Git
   → Enable "Production Branch: main"
   → Save
   ```

### Deploy New Updates

```bash
# That's it! Just push to GitHub:
git add .
git commit -m "Your update message"
git push origin main

# Both Render AND Vercel will automatically:
# ✅ Detect the push
# ✅ Build your code
# ✅ Deploy to production
# ⏱️ Takes 2-5 minutes
```

---

## 🔧 Manual Deployment

### Deploy Backend (Render)

**Option A: Dashboard (Easiest)**
1. Go to https://dashboard.render.com/
2. Click your `acc-viewer-backend` service
3. Click **"Manual Deploy"** → **"Deploy latest commit"**
4. Wait for build to complete (~2-3 min)

**Option B: CLI**
```bash
# Install Render CLI (one-time)
npm install -g render-cli

# Login
render login

# Deploy
render deploy --service acc-viewer-backend
```

### Deploy Frontend (Vercel)

**Option A: Dashboard (Easiest)**
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click **"Deployments"** → **"Redeploy"**
4. Wait for build to complete (~1-2 min)

**Option B: CLI**
```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

---

## 🔍 Verify Deployment

### Check Backend (Render)
```bash
# Replace with your actual Render URL
curl https://YOUR-APP.onrender.com/health

# Should return:
# {"status":"ok","hasCredentials":true,"hasAIKey":true}
```

### Check Frontend (Vercel)
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Login with ACC credentials
3. Test loading a 3D model
4. Test AI Realistic Rendering

---

## 🔐 Environment Variables

### Render (Backend)
Go to Service → **Environment** tab:
```
APS_CLIENT_ID = Your Autodesk Client ID
APS_CLIENT_SECRET = Your Autodesk Secret
STABILITY_API_KEY = Your Stability AI Key
PORT = 3001
NODE_ENV = production
```

### Vercel (Frontend)
Go to Project → **Settings** → **Environment Variables**:
```
VITE_API_URL = https://your-render-url.onrender.com
```

**After adding/changing variables:**
- Render: Auto-restarts
- Vercel: Redeploy required

---

## 📊 Monitor Deployments

### Render Dashboard
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Response times
- **Events**: Deployment history

### Vercel Dashboard
- **Deployments**: Build history and status
- **Analytics**: Page views, performance
- **Speed Insights**: Core Web Vitals

---

## ⚠️ Troubleshooting

### Backend Not Responding
1. Check Render logs for errors
2. Verify environment variables are set
3. Test `/health` endpoint
4. Check if service is sleeping (free tier)

### Frontend Can't Connect to Backend
1. Check CORS settings in `server.js`
2. Verify `VITE_API_URL` is correct
3. Check browser console for errors
4. Ensure backend is running

### Build Fails
1. Check build logs in dashboard
2. Test build locally: `npm run build`
3. Verify all dependencies are in `package.json`
4. Check Node version compatibility

---

## 🎯 What Got Deployed

### Backend Updates
- ✅ AI rendering with automatic image resizing
- ✅ 50MB payload limit for screenshots
- ✅ Enhanced error handling
- ✅ 2-minute timeout protection
- ✅ Comprehensive logging

### Frontend Updates
- ✅ File browser folder filtering
- ✅ Shows only "Project Files"
- ✅ Better JSON response parsing
- ✅ Improved error messages

---

## 🔄 Rollback (Emergency)

### Render
1. Dashboard → Your service
2. **Events** tab
3. Find working deployment
4. Click **"Rollback"**

### Vercel
1. Dashboard → Your project
2. **Deployments** tab
3. Find working deployment
4. Click **⋯** → **"Promote to Production"**

---

## 📱 Quick Links

- **Render Dashboard**: https://dashboard.render.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/shashwatautodesk/Project-Atom-by-TS-India
- **Backend Health Check**: `https://YOUR-APP.onrender.com/health`
- **Frontend**: `https://your-project.vercel.app`

---

## ✅ Current Status

Your latest commits are:
1. **AI Rendering Fixes** (Commit: `de520eb`)
2. **File Browser Filter** (Commit: `19167d3`)

Both are in GitHub and ready to deploy! 🚀

Just push to `main` branch and let auto-deploy handle the rest!

