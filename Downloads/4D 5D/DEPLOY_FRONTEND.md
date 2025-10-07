# Deploy Frontend to Vercel - Manual Guide

## Method 1: Using Vercel Dashboard (Easiest)

1. **Login to Vercel**
   - Go to https://vercel.com/dashboard
   - Find your project

2. **Trigger Deployment**
   - Click on your project
   - Click **"Deployments"** tab
   - Click **"Redeploy"** button
   - Or click **"Deploy"** → **"Production"**

3. **Monitor Build**
   - Watch real-time build logs
   - Wait for "Build Completed" message
   - Your frontend will be live!

## Method 2: Using Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or use the npm script
npm run deploy:vercel
```

## Method 3: Using Git Push (If Auto-Deploy Enabled)

Your changes are already in GitHub! Vercel will automatically:
1. Detect the push to `main` branch
2. Build your project
3. Deploy to production

Check deployment status at: https://vercel.com/dashboard

## Important: Environment Variables

Set these in Vercel Dashboard:

1. Go to your project → **Settings** → **Environment Variables**

2. Add the following (if not already set):

   **For Production:**
   - `VITE_API_URL` = Your Render backend URL
     - Example: `https://acc-viewer-backend.onrender.com`
   
   **Optional:**
   - `NODE_VERSION` = 18.18.0

3. Click **Save**
4. Redeploy for changes to take effect

## Connecting Frontend to Backend

Update your API endpoint to point to Render:

### If using environment variables:

In your `.env.production` file (create if doesn't exist):
```env
VITE_API_URL=https://YOUR-RENDER-URL.onrender.com
```

### If hardcoded in `api.ts`:

Update the base URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://YOUR-RENDER-URL.onrender.com';
```

Then commit and push:
```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

## Verify Deployment

1. **Visit your Vercel URL**
   - Example: `https://your-project.vercel.app`

2. **Test Functionality**
   - Login with ACC credentials
   - Browse projects
   - Load a 3D model
   - Test AI Realistic Rendering

3. **Check Browser Console**
   - Press F12
   - Look for any errors
   - Verify API calls are going to correct backend

## Recent Updates Deployed

✅ File Browser improvements:
- Filters out ACC system folders
- Shows only "Project Files" at root level
- Cleaner, faster navigation

✅ AI Rendering improvements:
- Enhanced error handling
- Better JSON response parsing
- Automatic image resizing

## Build Configuration

Your `vercel.json` is already configured:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

## Troubleshooting

### Build Fails

Check build logs in Vercel dashboard. Common issues:
- Missing dependencies in `package.json`
- TypeScript errors
- Environment variable issues

**Fix:**
```bash
# Test build locally first
npm run build

# If successful, push and redeploy
git push origin main
```

### API Calls Fail (CORS Errors)

Update your backend (`server.js`) to allow Vercel domain:

```javascript
// In server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-project.vercel.app',
    'https://*.vercel.app'
  ]
}));
```

### 404 on Routes

Already configured in `vercel.json`:
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```

### Slow Initial Load

Enable caching (already configured):
```json
"headers": [
  {
    "source": "/assets/(.*)",
    "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]
  }
]
```

## Custom Domain (Optional)

To add a custom domain:

1. Go to your project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `viewer.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

## Performance Tips

1. **Enable Compression** (automatic in Vercel)
2. **Use Edge Functions** for faster API calls
3. **Enable Analytics** in Vercel dashboard
4. **Monitor Performance** in Vercel Speed Insights

## Rollback (If Needed)

If something goes wrong:

1. Go to **Deployments** tab
2. Find previous working deployment
3. Click **⋯** (three dots)
4. Click **Promote to Production**

Your previous version will be restored immediately!

