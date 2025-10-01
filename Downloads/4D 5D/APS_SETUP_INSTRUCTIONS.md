# How to Get Your APS Credentials

## Step-by-Step Guide to Create APS App

### 1. Go to Autodesk Platform Services
Visit: **https://aps.autodesk.com/**

### 2. Sign In
- Use your Autodesk account (same one you use for ACC/BIM 360)
- If you don't have an account, create one

### 3. Navigate to Applications
- Click on your profile (top right)
- Go to **"Applications"** or visit: https://aps.autodesk.com/myapps

### 4. Create New Application
Click **"Create Application"** button

### 5. Fill in Application Details
- **Application Name**: `ACC 3D Viewer` (or any name you prefer)
- **Description**: `Web application for viewing ACC 3D models`
- **Callback URL**: `http://localhost:5173/api/auth/callback`
- **Allow list**: Leave empty for development

### 6. ⚠️ IMPORTANT: Enable These APIs

You MUST enable these specific APIs (this is critical!):

✅ **Data Management API**
- Allows access to ACC/BIM 360 files and folders

✅ **Model Derivative API** 
- Allows 3D model viewing and translation

✅ **BIM 360 API** or **ACC API**
- Allows access to ACC/BIM 360 projects

### 7. Save and Get Credentials

After creating the app:
- You'll see **Client ID** (public)
- Click **"Show"** next to Client Secret to reveal it
- **COPY BOTH VALUES** - you'll need them in the next step

## Common Issues

### Issue: "client_id does not have access to api product"

**Solution:** 
- Go back to your app settings at https://aps.autodesk.com/myapps
- Click on your application
- Check that all three APIs are enabled:
  - ✅ Data Management API
  - ✅ Model Derivative API
  - ✅ BIM 360 API
- If any are missing, enable them and click **Save**

### Issue: "Invalid credentials"

**Solution:**
- Make sure you copied the entire Client ID and Client Secret
- Check for extra spaces or line breaks
- Try regenerating the Client Secret

## Next Steps

Once you have your credentials:
1. Create `.env` file in project root
2. Add your credentials (see below)
3. Restart the server

---

## Example .env File

Create a file named `.env` (no .txt extension) with this content:

```env
APS_CLIENT_ID=your_actual_client_id_here
APS_CLIENT_SECRET=your_actual_client_secret_here
PORT=3001
```

Replace `your_actual_client_id_here` and `your_actual_client_secret_here` with your real values.

---

## Verify Your Setup

After adding credentials:
1. Stop the server (Ctrl+C)
2. Run: `npm run dev:all`
3. You should see: "✅ APS credentials configured"
4. Open: http://localhost:5173
5. You should see your actual ACC projects!

---

## Need Help?

- APS Documentation: https://aps.autodesk.com/en/docs/
- OAuth Guide: https://aps.autodesk.com/en/docs/oauth/v2/
- Support: https://aps.autodesk.com/en/support/

