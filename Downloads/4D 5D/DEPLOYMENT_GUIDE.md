# 🚀 Deployment Guide - ACC 3D Viewer

This guide will help you deploy your ACC 3D Viewer application to the web so anyone can access it.

## 📋 Deployment Overview

Your application has **two parts** that need to be deployed:

1. **Frontend** (React app) - Can be deployed to static hosting
2. **Backend** (Node.js server) - Needs a Node.js hosting service

## 🎯 Recommended Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) ⭐ RECOMMENDED

**Best for:** Easy deployment, free tier available, great performance

#### Step 1: Deploy Backend to Render

1. **Create a Render account**: https://render.com/

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub/GitLab repository (or upload code)
   - Configure:
     - **Name**: `acc-viewer-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `node server.js`
     - **Plan**: Free (or paid for better performance)

3. **Add Environment Variables**:
   - Go to "Environment" tab
   - Add:
     ```
     APS_CLIENT_ID=your_actual_client_id
     APS_CLIENT_SECRET=your_actual_client_secret
     PORT=3001
     ```

4. **Deploy**: Click "Create Web Service"

5. **Copy your backend URL**: e.g., `https://acc-viewer-api.onrender.com`

#### Step 2: Deploy Frontend to Vercel

1. **Update API URL**:
   Create `.env.production` file:
   ```env
   VITE_API_URL=https://acc-viewer-api.onrender.com
   ```

2. **Create a Vercel account**: https://vercel.com/

3. **Deploy**:
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite
   - Add environment variable:
     - `VITE_API_URL` = your Render backend URL
   - Click "Deploy"

4. **Your app is live!** 🎉
   - URL: `https://your-app.vercel.app`

---

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Backend on Railway

1. **Create Railway account**: https://railway.app/

2. **New Project**:
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository
   - Railway auto-detects Node.js

3. **Add Environment Variables**:
   - Go to "Variables" tab
   - Add: `APS_CLIENT_ID`, `APS_CLIENT_SECRET`, `PORT`

4. **Generate Domain**:
   - Go to "Settings" → "Generate Domain"
   - Copy the URL: e.g., `https://your-app.up.railway.app`

#### Frontend on Netlify

1. **Create Netlify account**: https://netlify.com/

2. **New Site**:
   - Click "Add new site" → "Import an existing project"
   - Connect to Git
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`

3. **Environment Variables**:
   - Site settings → Environment variables
   - Add: `VITE_API_URL` = your Railway backend URL

4. **Deploy!**

---

### Option 3: All-in-One on Heroku

**Deploy both frontend and backend together**

1. **Create Heroku account**: https://heroku.com/

2. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli

3. **Prepare for deployment**:
   ```bash
   # Add this to package.json scripts:
   "heroku-postbuild": "npm run build",
   "start": "node server.js"
   ```

4. **Create Procfile**:
   ```
   web: node server.js
   ```

5. **Update server.js** to serve static files:
   ```javascript
   // Add this at the end of server.js, before app.listen()
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static('dist'));
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, 'dist', 'index.html'));
     });
   }
   ```

6. **Deploy**:
   ```bash
   heroku login
   heroku create your-app-name
   heroku config:set APS_CLIENT_ID=your_client_id
   heroku config:set APS_CLIENT_SECRET=your_client_secret
   git add .
   git commit -m "Prepare for Heroku deployment"
   git push heroku main
   ```

---

## 📦 Pre-Deployment Checklist

### 1. Update Callback URLs

In your Autodesk APS app settings:
- Add your production URL to callback URLs
- Example: `https://your-app.vercel.app/api/auth/callback`

### 2. Update CORS Settings

In `server.js`, update CORS to allow your frontend domain:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### 3. Environment Variables

Make sure these are set in production:
- `APS_CLIENT_ID`
- `APS_CLIENT_SECRET`
- `PORT` (backend)
- `VITE_API_URL` (frontend)
- `NODE_ENV=production`

### 4. Build the Frontend

Test the production build locally:
```bash
npm run build
npm run preview
```

---

## 🔒 Security Best Practices

### 1. Never Commit Secrets
- ✅ Keep `.env` in `.gitignore`
- ✅ Use environment variables in hosting platforms
- ❌ Never commit `APS_CLIENT_SECRET`

### 2. Use HTTPS
- ✅ All modern hosting platforms provide free SSL
- ✅ Autodesk requires HTTPS for callbacks

### 3. Rate Limiting
Add to `server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Add Authentication (Optional)
For production, consider adding user authentication:
- Auth0
- Firebase Auth
- Custom JWT authentication

---

## 💰 Cost Comparison

| Platform | Frontend | Backend | Total/Month |
|----------|----------|---------|-------------|
| **Vercel + Render** | Free | Free* | $0-7 |
| **Netlify + Railway** | Free | Free* | $0-5 |
| **Heroku** | - | $7/dyno | $7+ |
| **AWS/Azure** | ~$1-5 | ~$5-20 | $6-25+ |

*Free tiers have limitations (auto-sleep, limited resources)

---

## 🚀 Quick Deploy Commands

### Deploy to Vercel (Frontend)
```bash
npm install -g vercel
vercel
```

### Deploy to Render (Backend)
```bash
# Push to GitHub, then connect in Render dashboard
git add .
git commit -m "Deploy to Render"
git push origin main
```

---

## 🐛 Common Deployment Issues

### Issue 1: Backend Not Responding
**Solution**: 
- Check environment variables are set
- Check backend logs in hosting platform
- Ensure PORT is set correctly

### Issue 2: CORS Errors
**Solution**:
```javascript
// In server.js
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Issue 3: Build Fails
**Solution**:
- Run `npm run build` locally first
- Check Node.js version matches (use `.nvmrc`)
- Clear build cache in hosting platform

### Issue 4: API Calls Fail
**Solution**:
- Update `VITE_API_URL` in frontend
- Check network tab for exact error
- Verify backend URL is accessible

---

## 📊 Monitoring & Maintenance

### 1. Set Up Monitoring
- **Render**: Built-in logs and metrics
- **Vercel**: Analytics dashboard
- **Uptime Robot**: Free uptime monitoring

### 2. Logs
- Access logs through hosting platform dashboards
- Use `console.log` for debugging (remove in production)

### 3. Updates
```bash
# Pull latest changes
git pull origin main

# Vercel auto-deploys on git push
git push origin main
```

---

## 🎯 Step-by-Step: Fastest Deployment

### Total Time: ~15 minutes

1. **Backend (5 min)**:
   - Sign up for Render
   - New Web Service → Connect GitHub
   - Add environment variables
   - Deploy

2. **Frontend (5 min)**:
   - Sign up for Vercel
   - New Project → Import from GitHub
   - Add `VITE_API_URL` environment variable
   - Deploy

3. **Test (5 min)**:
   - Visit your Vercel URL
   - Test project selection
   - Test file browsing
   - Test 3D viewer

**Done! Your app is live! 🎉**

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Autodesk APS Deployment Guide](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-2-legged-token/)

---

## 🆘 Need Help?

If you encounter issues:
1. Check hosting platform logs
2. Verify environment variables
3. Test backend health endpoint: `https://your-backend/health`
4. Check browser console for errors

---

## ✅ Post-Deployment

After deployment, update your APS app:
1. Go to https://aps.autodesk.com/myapps
2. Click your app
3. Update **Callback URL** to your production URL
4. Save changes

**Your ACC 3D Viewer is now live and accessible to everyone!** 🚀

