# ⚡ Quick Deploy - 5 Minute Setup

## 🎯 Fastest Way to Deploy (Vercel + Render)

### Step 1: Deploy Backend (2 minutes)

1. **Go to**: https://render.com/
2. Click **Sign Up** (use GitHub)
3. Click **New +** → **Web Service**
4. Click **Connect GitHub** → Find your repository
5. Configure:
   - **Name**: `acc-viewer-api`
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Click **Advanced** → **Add Environment Variable**:
   - `APS_CLIENT_ID` = (your Autodesk client ID)
   - `APS_CLIENT_SECRET` = (your Autodesk secret)
   - `PORT` = `3001`
7. Click **Create Web Service**
8. **Wait 2-3 minutes** for deployment
9. **Copy your URL**: `https://acc-viewer-api-xxxx.onrender.com`

### Step 2: Deploy Frontend (2 minutes)

1. **Go to**: https://vercel.com/
2. Click **Sign Up** (use GitHub)
3. Click **Add New** → **Project**
4. **Import** your GitHub repository
5. Vercel auto-detects Vite ✅
6. Click **Environment Variables**:
   - Key: `VITE_API_URL`
   - Value: (paste your Render URL from Step 1)
7. Click **Deploy**
8. **Wait 1-2 minutes**
9. **Your app is live!** 🎉

### Step 3: Update Autodesk App (1 minute)

1. Go to: https://aps.autodesk.com/myapps
2. Click your app
3. Update **Callback URL**: `https://your-app.vercel.app/api/auth/callback`
4. Click **Save**

## ✅ Done!

Your app is now live at: `https://your-app.vercel.app`

Share this URL with anyone! 🚀

---

## 🔄 Updating Your Deployed App

When you make changes:

```bash
# Commit and push changes
git add .
git commit -m "Update feature"
git push origin main
```

Both Vercel and Render will **auto-deploy** your changes! ✨

---

## 💡 Pro Tips

1. **Custom Domain**: Both Vercel and Render support custom domains
2. **Free Tier**: Both offer generous free tiers
3. **Auto HTTPS**: SSL certificates included for free
4. **No Credit Card**: Required only for paid features

---

## 🆘 Troubleshooting

**Backend not responding?**
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set

**Frontend can't connect to backend?**
- Verify `VITE_API_URL` in Vercel settings
- Check CORS in `server.js`

**Still stuck?**
- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/support

---

## 📊 Your Deployment URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://acc-viewer-api-xxxx.onrender.com`
- **Backend Health**: `https://acc-viewer-api-xxxx.onrender.com/health`

Test the backend health endpoint to verify it's running!

