# Project Atom ⚛️

**Powered by Autodesk Platform Services**  
*Developed by Autodesk India Technical Sales*

A cutting-edge web application for browsing Autodesk Construction Cloud (ACC) projects and viewing 3D models with advanced analytics, 4D BIM progression, and BOQ analysis.

## 🚀 Features

- **Project Selection** - Browse and select from available ACC projects with search and hub filtering
- **File Browser** - Navigate through project files and folders
- **3D Viewer** - View BIM models (Revit, AutoCAD, IFC, etc.) in an interactive 3D viewer
- **Modern UI** - Beautiful, responsive interface built with React, Tailwind CSS, and Autodesk branding
- **Viewer Controls** - Zoom, pan, rotate, and fullscreen capabilities
- **CSV Export** - Export all model element properties to Excel-compatible CSV
- **IFC Conversion** - Convert models to IFC format for interoperability
- **🔍 Element Search & Find** - Advanced search with multiple filters, parameters, and logic operators
- **🎨 AI Realistic Rendering** - Transform 3D views into photorealistic images using Stability AI
- **📊 Analytics** - BOQ summary with interactive charts (pie, bar) and detailed quantity tables
- **4D BIM Progression** - Time-based construction visualization with schedule tracking
- **📥 Excel Import** - Bulk-import WBS schedules from CSV with smart element mapping
- **📈 Gantt Chart** - Visual timeline with zoom, grouping, and interactive element selection

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.3 with TypeScript
- **Build Tool**: Vite 5.2
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Charts**: Recharts (latest)
- **3D Viewer**: Autodesk Forge Viewer 7.x
- **AI Engine**: Stability AI (Stable Diffusion XL)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- An Autodesk Forge/APS account with ACC access

## 🔧 Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "4D 5D"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Autodesk Platform Services
   APS_CLIENT_ID=your_aps_client_id_here
   APS_CLIENT_SECRET=your_aps_client_secret_here
   
   # Stability AI (Optional - for AI Rendering)
   STABILITY_API_KEY=sk-your-stability-api-key-here
   ```

   **To get APS credentials:**
   - Go to [APS Portal](https://aps.autodesk.com/)
   - Create an app or use an existing one
   - Copy the Client ID and Client Secret
   - Make sure your app has ACC permissions enabled
   
   **To get Stability AI key (optional):**
   - Go to [Stability AI Platform](https://platform.stability.ai/)
   - Sign up (free tier: 25 credits/month)
   - Generate an API key
   - See `AI_RENDERING_GUIDE.md` for details

4. **Start the development server**
   ```bash
   npm run dev:all
   ```
   
   This starts both the backend (port 3001) and frontend (port 5173)

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## 📁 Project Structure

```
4D 5D/
├── src/
│   ├── components/
│   │   ├── ProjectSelector.tsx    # Project selection component
│   │   ├── FileBrowser.tsx        # File browsing component
│   │   └── Viewer.tsx             # 3D viewer component
│   ├── types.ts                   # TypeScript type definitions
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Global styles
│   └── vite-env.d.ts             # Vite type declarations
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── vite.config.ts                # Vite configuration
└── README.md                      # This file
```

## 🔐 Authentication Setup

This application requires proper OAuth authentication to access ACC data. Here's how to set it up:

### Option 1: Backend Server (Recommended)

Create a backend server to handle OAuth and token management:

1. **Create a Node.js backend** that:
   - Handles OAuth 2.0 flow
   - Exchanges authorization codes for access tokens
   - Refreshes tokens when needed
   - Proxies API requests to Autodesk services

2. **Update the application** to call your backend instead of mock data

Example backend endpoints needed:
- `GET /api/projects` - List ACC projects
- `GET /api/projects/:projectId/files` - List project files
- `GET /api/token` - Get Forge access token

### Option 2: Using MCP Server

If you have the Autodesk Construction Cloud MCP server configured, you can:

1. Use the MCP tools to fetch projects and files
2. Integrate the token retrieval in the Viewer component

## 🎨 Customization

### Changing the Theme

Edit `tailwind.config.js` to customize colors and styles:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Adding New File Types

Edit `src/components/FileBrowser.tsx` and add your file type to the `isViewableFile` function:

```typescript
const viewableTypes = ['rvt', 'rfa', 'dwg', 'dxf', 'ifc', 'nwd', 'nwc', 'pdf', 'fbx', 'obj', 'yourtype']
```

## 🐛 Troubleshooting

### Viewer Not Loading

1. **Check console for errors** - Open browser DevTools (F12)
2. **Verify Forge Viewer script** - Make sure it's loaded in `index.html`
3. **Check access token** - Ensure your OAuth token is valid

### Files Not Displaying

1. **Check file URN** - Ensure the file URN is correctly formatted
2. **Verify file translation** - Files must be translated by Forge before viewing
3. **Check permissions** - Ensure your Forge app has access to the ACC project

### CORS Issues

If you encounter CORS errors:
- Use a backend proxy server
- Configure proper CORS headers on your backend
- Don't call Autodesk APIs directly from the browser

## 🎨 AI Rendering Feature

Project Atom includes an **AI-powered realistic rendering** feature that transforms your 3D model views into photorealistic architectural visualizations.

### Quick Start

1. Get a free API key from [Stability AI](https://platform.stability.ai/)
2. Add to `.env`: `STABILITY_API_KEY=sk-your-key`
3. Restart server: `npm run dev:all`
4. Click the purple **"AI Render"** button in the viewer

### 7 Professional Styles

- 📸 **Photorealistic** - Professional architectural photography
- 🎬 **Cinematic** - Dramatic lighting and atmosphere
- 🌟 **Modern Minimal** - Clean, contemporary design
- 💎 **Luxury** - High-end materials and warm lighting
- ☀️ **Bright Daytime** - Sunny exterior views
- 🌅 **Golden Hour** - Sunset, warm tones
- 🌙 **Night Scene** - Artificial lighting, evening ambiance

### Free Tier

- **25 credits/month** = ~300 renders
- **Each render** costs ~$0.003 (less than a penny!)

📖 **Full Guide**: See `AI_RENDERING_GUIDE.md` for complete documentation

⚡ **Quick Start**: See `AI_RENDERING_QUICKSTART.md` for 5-minute setup

---

## 📚 Resources

- [Autodesk Platform Services](https://aps.autodesk.com/)
- [APS Viewer Documentation](https://aps.autodesk.com/en/docs/viewer/v7/developers_guide/overview/)
- [ACC API Documentation](https://aps.autodesk.com/en/docs/acc/v1/overview/)
- [Stability AI Documentation](https://platform.stability.ai/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Recharts Documentation](https://recharts.org/)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is provided as-is for demonstration purposes.

## ⚠️ Important Notes

- This is a demonstration application with mock data
- For production use, implement proper backend authentication
- Never expose your Forge Client Secret in client-side code
- Ensure you comply with Autodesk's API usage terms
- File translation can take time for large models

## 🎯 Next Steps

To make this application production-ready:

1. ✅ Implement backend OAuth server
2. ✅ Replace mock data with real ACC API calls
3. ✅ Add error handling and retry logic
4. ✅ Implement file upload functionality
5. ✅ Add user authentication
6. ✅ Implement caching for better performance
7. ✅ Add tests (unit, integration, e2e)
8. ✅ Set up CI/CD pipeline

## 💡 Support

For questions or issues:
- Check the [APS Community](https://aps.autodesk.com/community)
- Visit the [Autodesk Platform Services Help](https://aps.autodesk.com/en/support/)
- Contact: shashwat.bhardwaj@autodesk.com

---

Built with ❤️ using modern web technologies

