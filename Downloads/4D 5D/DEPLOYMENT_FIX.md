# 🔧 Fix 404 Error on Deployment

## The Problem

Your app has **TWO parts**:
1. **Frontend** (React) - Currently deployed on Vercel ✅
2. **Backend** (Node.js API) - NOT deployed yet ❌

The 404 error happens because the frontend is trying to call backend APIs that don't exist yet!

---

## ✅ SOLUTION: Deploy Backend First

You need to deploy the backend separately. Here's the **EASIEST** way:

### Option 1: Render (Recommended - FREE) 🚀

#### Step 1: Deploy Backend to Render

1. **Go to [render.com](https://render.com)**
2. **Sign up/Login** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect** your repository: `Project-Atom-by-TS-India`
5. **Configure:**
   ```
   Name: project-atom-api
   Region: Choose closest to you
   Branch: main
   Root Directory: (leave empty)
   Runtime: Node
   Build Command: npm install
   Start Command: node server.js
   ```
6. **Select Instance Type:** Free
7. **Add Environment Variables:**
   Click "Advanced" → "Add Environment Variable"
   ```
   APS_CLIENT_ID = your_client_id
   APS_CLIENT_SECRET = your_client_secret
   STABILITY_API_KEY = your_stability_key (optional)
   PORT = 3001
   NODE_ENV = production
   ```
8. **Click "Create Web Service"**
9. **Wait 5-10 minutes** for deployment
10. **Copy your backend URL** (e.g., `https://project-atom-api.onrender.com`)

#### Step 2: Update Vercel Frontend

1. **Go to [vercel.com](https://vercel.com/dashboard)**
2. **Click on your project**
3. **Go to "Settings" → "Environment Variables"**
4. **Add new variable:**
   ```
   Name: VITE_API_URL
   Value: https://project-atom-api.onrender.com
   ```
   (Use YOUR backend URL from Step 1)
5. **Go to "Deployments" tab**
6. **Click "..." on latest deployment → "Redeploy"**
7. **Wait 2-3 minutes**
8. **Test your site!** 🎉

---

### Option 2: Railway (Alternative - FREE)

#### Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up** with GitHub
3. **Click "New Project" → "Deploy from GitHub repo"**
4. **Select** your repository
5. **Add Environment Variables:**
   ```
   APS_CLIENT_ID
   APS_CLIENT_SECRET
   STABILITY_API_KEY
   PORT=3001
   ```
6. **Click "Deploy"**
7. **Go to Settings → Generate Domain**
8. **Copy your backend URL**

#### Step 2: Update Vercel (same as above)

---

## 🎯 Quick Fix Commands (Alternative)

If you want to deploy everything to Render:

### Deploy Frontend + Backend on Render

1. Create a `render.yaml` file (already exists!)
2. Go to Render → New → Blueprint
3. Connect your repository
4. It will deploy BOTH frontend and backend automatically!

---

## ⚡ FASTEST FIX: Use Render Blueprint

Since you already have `render.yaml`, this is the EASIEST:

1. **Go to [render.com/select-repo](https://dashboard.render.com/select-repo)**
2. **Connect GitHub** (if not already)
3. **Select:** `Project-Atom-by-TS-India`
4. **Click "Connect"**
5. Render will detect `render.yaml` and ask to deploy as **Blueprint**
6. **Add Environment Variables** when prompted:
   ```
   APS_CLIENT_ID
   APS_CLIENT_SECRET
   STABILITY_API_KEY
   ```
7. **Click "Apply"**
8. **Wait 5-10 minutes**
9. **DONE!** Both frontend and backend will be live! 🎉

---

## 🔍 How to Check if Backend is Working

Visit your backend URL directly:
```
https://your-backend-url.onrender.com/health
```

You should see:
```json
{
  "status": "OK",
  "timestamp": "...",
  "apsConfigured": true
}
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Frontend (Vercel/Render)                   │
│  https://project-atom.vercel.app            │
│                                             │
│  - React UI                                 │
│  - 3D Viewer                                │
│  - Analytics                                │
│  - 4D Controls                              │
└──────────────────┬──────────────────────────┘
                   │ API Calls
                   ▼
┌─────────────────────────────────────────────┐
│  Backend (Render/Railway)                   │
│  https://project-atom-api.onrender.com      │
│                                             │
│  - OAuth Authentication                     │
│  - APS API Proxy                            │
│  - 4D Database                              │
│  - IFC Conversion                           │
│  - AI Rendering                             │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  Autodesk Platform Services (APS)          │
│  - BIM 360 / ACC Data                       │
│  - Model Derivative API                     │
│  - Data Management API                      │
└─────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After deploying backend:

- [ ] Backend URL responds at `/health`
- [ ] Environment variables are set
- [ ] Frontend has `VITE_API_URL` pointing to backend
- [ ] Frontend redeployed after adding env var
- [ ] Can access landing page
- [ ] Can log in to Autodesk
- [ ] Can select projects
- [ ] Viewer loads models

---

## 🚨 Common Issues

### Issue: "Failed to authenticate"
**Solution:** Check backend environment variables for APS credentials

### Issue: "Cannot connect to backend"
**Solution:** Verify `VITE_API_URL` in Vercel settings

### Issue: "CORS error"
**Solution:** Backend `server.js` already has CORS enabled, should work

### Issue: "Backend sleeping" (Render free tier)
**Solution:** Free tier sleeps after 15min of inactivity. First request wakes it up (takes 30-60 seconds)

---

## 💡 Pro Tip: Deploy Everything to One Platform

**Easiest solution:** Use Render Blueprint (already configured!)

This will deploy BOTH frontend and backend in one go:
1. Go to Render
2. New → Blueprint
3. Connect your repo
4. Add env variables
5. Deploy!

---

## 📞 Need Help?

1. Check backend logs in Render/Railway dashboard
2. Check browser console for errors (F12)
3. Verify environment variables are correct
4. Test backend URL directly

---

## 🎉 Once Fixed

Your app will be live at:
- **Frontend:** `https://your-project.vercel.app`
- **Backend:** `https://your-backend.onrender.com`

And all features will work:
- ✅ Project browsing
- ✅ 3D Viewer
- ✅ 4D BIM
- ✅ Analytics
- ✅ AI Rendering
- ✅ Element Search
- ✅ Measure & Markup

---

**Choose your path:**
- **Easiest:** Render Blueprint (deploy both together)
- **Flexible:** Vercel (frontend) + Render (backend)
- **Alternative:** Railway for backend

