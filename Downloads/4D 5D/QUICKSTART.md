# Quick Start Guide

Get the ACC 3D Viewer up and running in 5 minutes!

## 🚀 Quick Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser to http://localhost:3000
```

## 📝 What You'll See

The application has three main screens:

### 1. Project Selector
- Lists all available ACC projects
- Click on any project to browse its files

### 2. File Browser
- Shows all files and folders in the selected project
- Click on a viewable file (RVT, DWG, IFC, etc.) to open it in 3D

### 3. 3D Viewer
- Interactive 3D model viewer
- Use mouse to rotate, pan, and zoom
- Toolbar controls for common operations

## ⚡ Demo Mode

The application currently runs in **demo mode** with mock data. This allows you to:
- ✅ See the complete UI and navigation flow
- ✅ Test all components and interactions
- ✅ Understand how the application works
- ❌ View actual ACC files (requires authentication setup)

## 🔐 Enable Real ACC Data

To connect to real Autodesk Construction Cloud data:

### Step 1: Get Forge Credentials

1. Go to https://forge.autodesk.com/
2. Sign in with your Autodesk account
3. Create a new app or use an existing one
4. Enable **Data Management API** and **Model Derivative API**
5. Copy your **Client ID** and **Client Secret**

### Step 2: Set Up Backend Authentication

Choose one of these options:

#### Option A: Use the Example Server

1. Install backend dependencies:
   ```bash
   npm install express cors axios dotenv
   ```

2. Create a `.env` file:
   ```bash
   cp env.example.txt .env
   ```

3. Edit `.env` and add your credentials:
   ```
   FORGE_CLIENT_ID=your_actual_client_id
   FORGE_CLIENT_SECRET=your_actual_client_secret
   ```

4. Run the backend server:
   ```bash
   node server-example.js
   ```

5. Update the frontend components to call `http://localhost:3001/api/*` instead of using mock data

#### Option B: Use Cursor's MCP Server

If you have the Autodesk Construction Cloud MCP server configured:

1. Update `src/components/ProjectSelector.tsx` to use MCP tools
2. Update `src/components/FileBrowser.tsx` to use MCP tools
3. Update `src/components/Viewer.tsx` to get tokens from MCP

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js` to customize the theme

### Add File Types
Edit `src/components/FileBrowser.tsx` → `isViewableFile()` function

### Modify UI Layout
Components are in `src/components/` - fully customizable!

## 📦 Build for Production

```bash
# Create optimized build
npm run build

# Preview the build
npm run preview
```

## 🐛 Common Issues

### "Viewer library not loaded"
- Refresh the page
- Check your internet connection (Viewer loads from CDN)

### "Failed to load document"
- In demo mode, this is expected (no real URN)
- With real data, check that files are translated
- Verify your access token is valid

### Port already in use
```bash
# Change port in vite.config.ts
server: {
  port: 3001, // or any other port
}
```

## 📚 Learn More

- Check the full [README.md](./README.md) for detailed documentation
- Review component code in `src/components/`
- Explore the [Autodesk Forge documentation](https://forge.autodesk.com/en/docs/)

## 💡 Tips

1. **Start simple** - Run in demo mode first to understand the flow
2. **Backend is required** - Never put credentials in frontend code
3. **File translation** - Large models may take time to load
4. **CORS** - Always proxy API calls through your backend

## 🎯 Next Steps

Once you have the basics working:
- [ ] Set up proper authentication
- [ ] Replace mock data with real API calls
- [ ] Add file upload functionality
- [ ] Implement search and filters
- [ ] Add collaboration features
- [ ] Deploy to production

---

Need help? Check the [README.md](./README.md) or visit the [Forge Community](https://forge.autodesk.com/community)!

