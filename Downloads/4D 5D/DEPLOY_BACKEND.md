# Deploy Backend to Render - Manual Guide

## Method 1: Using Render Dashboard (Easiest)

1. **Login to Render**
   - Go to https://dashboard.render.com/
   - Find your `acc-viewer-backend` service

2. **Trigger Manual Deploy**
   - Click on your service
   - Click **"Manual Deploy"** button
   - Select **"Deploy latest commit"**
   - Render will pull latest code from GitHub and deploy

3. **Monitor Deployment**
   - Watch the logs in real-time
   - Wait for "Build succeeded" message
   - Your backend will be live at your Render URL

## Method 2: Using Render CLI

```bash
# Install Render CLI (one-time)
npm install -g render-cli

# Login to Render
render login

# Deploy your service
render deploy --service acc-viewer-backend
```

## Method 3: Using Git Push (If Auto-Deploy Enabled)

```bash
# Your changes are already pushed!
# Render will automatically detect and deploy

# Check deployment status:
# Go to https://dashboard.render.com/
# Click on your service
# View "Events" tab
```

## Important: Update Environment Variables

After deployment, verify your environment variables in Render:

1. Go to your service → **Environment**
2. Ensure these are set:
   - `APS_CLIENT_ID` = Your Autodesk APS Client ID
   - `APS_CLIENT_SECRET` = Your Autodesk APS Secret
   - `STABILITY_API_KEY` = Your Stability AI API Key
   - `PORT` = 3001
   - `NODE_ENV` = production

3. Click **Save Changes**
4. Service will automatically restart

## Verify Deployment

Test your backend:

```bash
# Replace YOUR_RENDER_URL with your actual Render URL
curl https://YOUR_RENDER_URL.onrender.com/health

# Expected response:
# {
#   "status": "ok",
#   "hasCredentials": true,
#   "hasAIKey": true
# }
```

## Recent Updates Deployed

✅ AI Realistic Rendering fixes:
- 50MB payload limit for large screenshots
- Automatic image resizing for Stability AI
- Enhanced error handling with JSON responses
- 2-minute timeout protection

## Troubleshooting

**Build Failed?**
- Check logs in Render dashboard
- Verify `package.json` has all dependencies
- Ensure Node version compatibility

**Service Won't Start?**
- Check environment variables are set
- Verify `server.js` exists
- Check logs for error messages

**API Not Working?**
- Verify APS credentials are correct
- Test `/health` endpoint
- Check CORS settings if calling from different domain

