# Complete Setup Guide - ACC 3D Viewer

This guide will walk you through setting up the ACC 3D Viewer application from scratch.

## 📋 Prerequisites

Before you begin, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **Git** (optional, for version control)
4. **Autodesk Account** with access to ACC/BIM 360

## 🔧 Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React & React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Express (backend server)
- Axios (HTTP client)
- And more...

## 🔐 Step 2: Get Autodesk Credentials

### 2.1 Create Forge/APS App

1. Go to https://aps.autodesk.com/
2. Sign in with your Autodesk account
3. Click **"Create Application"** or go to https://aps.autodesk.com/myapps/create
4. Fill in the application details:
   - **Application Name**: `ACC 3D Viewer` (or your preferred name)
   - **Description**: `Web application for viewing ACC models`
   - **Callback URL**: `http://localhost:3000` (for development)

### 2.2 Enable Required APIs

Make sure these APIs are enabled for your app:
- ✅ **Data Management API** (to access ACC files)
- ✅ **Model Derivative API** (to view 3D models)
- ✅ **BIM 360 API** (for ACC/BIM 360 access)

### 2.3 Get Client ID and Secret

1. After creating the app, you'll see:
   - **Client ID** (looks like: `xxxxxxxxxxxxxxxxxxxxx`)
   - **Client Secret** (click "Show" to reveal it)
2. **Copy both values** - you'll need them in the next step

## ⚙️ Step 3: Configure Environment Variables

1. In the project root directory, you'll see a `.env` file
2. Open it and replace the placeholder values:

```env
APS_CLIENT_ID=your_actual_client_id_here
APS_CLIENT_SECRET=your_actual_client_secret_here
PORT=3001
```

**Important:**
- Never commit the `.env` file to version control
- Keep your Client Secret safe and private
- The `.env` file is already in `.gitignore`

## 🚀 Step 4: Start the Application

You have two options:

### Option A: Run Everything Together (Recommended)

```bash
npm run dev:all
```

This starts both the backend server and frontend development server.

### Option B: Run Separately

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## ✅ Step 5: Verify Setup

1. **Backend Server**: You should see:
   ```
   ═══════════════════════════════════════════════════════
   🚀 ACC 3D Viewer API Server running on port 3001
   ═══════════════════════════════════════════════════════
   📍 Local:            http://localhost:3001
   📍 Health Check:     http://localhost:3001/health
   
   ✅ APS credentials configured
   ═══════════════════════════════════════════════════════
   ```

2. **Frontend**: Open your browser to `http://localhost:3000`

3. **Test Backend**: Visit `http://localhost:3001/health` - you should see:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-09-30T...",
     "hasCredentials": true
   }
   ```

## 🎯 Step 6: Using the Application

### 6.1 Select a Project

1. The app will automatically fetch your ACC/BIM 360 projects
2. You should see a "Server Status: ✅ Connected" banner
3. Click on any project card to browse its files

**Troubleshooting:**
- If you see "No projects found": Make sure your account has access to ACC/BIM 360
- If you see "Server not running": Go back to Step 4

### 6.2 Browse Files

1. After selecting a project, you'll see the file browser
2. Navigate through folders by clicking on them
3. Use the "Back" button to go up one level
4. Files that can be viewed in 3D are highlighted

### 6.3 View 3D Models

1. Click on a supported file (RVT, DWG, IFC, etc.)
2. The viewer will:
   - Check if the file is translated
   - Start translation if needed (first time only)
   - Load the 3D model once ready

**Supported File Types:**
- Revit (RVT, RFA)
- AutoCAD (DWG, DXF)
- IFC
- Navisworks (NWD, NWC)
- And more...

## 🔍 Troubleshooting Common Issues

### Issue 1: "Server not running"

**Solution:**
```bash
# Make sure backend server is running
npm run dev:server
```

### Issue 2: "APS credentials not configured"

**Solution:**
- Check that `.env` file exists
- Verify `APS_CLIENT_ID` and `APS_CLIENT_SECRET` are set correctly
- Restart the backend server after changing `.env`

### Issue 3: "No hubs found"

**Solution:**
- Verify your Autodesk account has access to ACC or BIM 360
- Check that BIM 360 API is enabled in your APS app
- Try a different Autodesk account with ACC access

### Issue 4: "Translation in progress"

**Explanation:** 
- Files need to be translated before viewing (first time only)
- This can take 1-10 minutes depending on file size
- Wait and try again after a few minutes
- The app will show "Check Again" button to retry

### Issue 5: CORS Errors

**Solution:**
- Make sure you're using the backend server (not calling APIs directly)
- Check that CORS is enabled in `server.js`
- Clear browser cache and refresh

### Issue 6: Viewer Not Loading

**Solution:**
- Check browser console (F12) for errors
- Verify internet connection (Viewer loads from Autodesk CDN)
- Try a different browser (Chrome/Edge recommended)
- Refresh the page

## 🏗️ Building for Production

When you're ready to deploy:

```bash
# Build the frontend
npm run build

# The build output will be in the /dist folder
```

For production deployment, you'll need to:
1. Deploy the backend server to a hosting service (Heroku, AWS, Azure, etc.)
2. Deploy the frontend build to a static hosting service (Vercel, Netlify, etc.)
3. Update environment variables for production
4. Set up proper domain and SSL certificates

## 📚 Additional Resources

### Autodesk Documentation
- [APS Getting Started](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/get-2-legged-token/)
- [Forge Viewer Guide](https://aps.autodesk.com/en/docs/viewer/v7/developers_guide/overview/)
- [Data Management API](https://aps.autodesk.com/en/docs/data/v2/developers_guide/overview/)
- [Model Derivative API](https://aps.autodesk.com/en/docs/model-derivative/v2/developers_guide/overview/)

### Community Support
- [Forge Community](https://forge.autodesk.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/autodesk-forge)
- [GitHub Issues](https://github.com/autodesk-forge)

## 🎓 Understanding the Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Frontend)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Project    │→ │     File     │→ │   3D Viewer  │  │
│  │   Selector   │  │   Browser    │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                 ↓                  ↓           │
└─────────┼─────────────────┼──────────────────┼──────────┘
          │                 │                  │
          ↓                 ↓                  ↓
┌─────────────────────────────────────────────────────────┐
│              Backend Server (Node.js/Express)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  OAuth Token │  │  Data Mgmt   │  │    Model     │  │
│  │  Management  │  │     API      │  │  Derivative  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         ↓                 ↓                  ↓           │
└─────────┼─────────────────┼──────────────────┼──────────┘
          │                 │                  │
          ↓                 ↓                  ↓
┌─────────────────────────────────────────────────────────┐
│           Autodesk Platform Services (APS)               │
│                 (formerly Forge)                         │
└─────────────────────────────────────────────────────────┘
```

## 🔒 Security Best Practices

1. **Never expose credentials in frontend code**
   - Always use backend server for OAuth
   - Don't commit `.env` file

2. **Use environment variables**
   - Different credentials for dev/staging/production
   - Never hardcode secrets

3. **Implement rate limiting**
   - Prevent API abuse
   - Add request throttling

4. **Add authentication**
   - Secure your application with user login
   - Implement access control

## 🎉 You're All Set!

If you've followed all the steps, you should now have a fully functional ACC 3D Viewer running locally. Start exploring your ACC projects and viewing 3D models!

For questions or issues, check the main README.md or open an issue on GitHub.

Happy viewing! 🏗️✨

