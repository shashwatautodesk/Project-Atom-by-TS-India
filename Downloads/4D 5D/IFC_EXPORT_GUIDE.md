# 🏗️ IFC Export Feature Guide

## Overview
The ACC 3D Viewer now supports **exporting models to IFC format** (Industry Foundation Classes) - the industry-standard format for BIM data exchange.

## 🎯 What is IFC?
IFC (Industry Foundation Classes) is an open, neutral file format for Building Information Modeling (BIM) data exchange. It's widely supported by:
- Revit, Navisworks, AutoCAD
- ArchiCAD, Tekla, Bentley
- Solibri, BIMcollab
- And 100+ other BIM tools

## ✨ Features

### 1. **One-Click IFC Export**
- Click the teal "Export IFC" button in the viewer
- Automatic conversion via Autodesk Model Derivative API
- Progress tracking with real-time updates

### 2. **Smart Status Polling**
- Automatically checks conversion status every 5 seconds
- Shows progress in console (F12 to view)
- Auto-downloads when complete

### 3. **Error Handling**
- Clear error messages if format not supported
- Timeout handling for large files
- Detailed console logging for troubleshooting

## 🚀 How to Use

### Step-by-Step Guide:

1. **Load a 3D Model**
   - Select a project from your ACC account
   - Browse folders and select a file
   - Wait for the model to load in the viewer

2. **Click "Export IFC" Button**
   - Located in the top-right corner (teal button)
   - The button shows "Converting..." while processing

3. **Wait for Conversion**
   - Small files: 30 seconds - 2 minutes
   - Medium files: 2-5 minutes
   - Large files: 5-10 minutes
   - Progress updates appear in browser console (press F12)

4. **Download Automatically**
   - When complete, the IFC file downloads automatically
   - File named: `[OriginalFileName].ifc`
   - Ready to open in any IFC-compatible software

## 📋 Supported File Types

### ✅ **Best Support:**
- **Revit Files** (.rvt, .rfa) - Full support
- **AutoCAD** (.dwg, .dxf) - Good support
- **Navisworks** (.nwd, .nwc) - Limited support

### ⚠️ **Limited Support:**
- **IFC Files** - Already in IFC format (re-export may work)
- **Other CAD formats** - Depends on APS support

### ❌ **Not Supported:**
- **Image files** (.jpg, .png, .pdf)
- **Point clouds** (.rcs, .rcp)
- **Proprietary formats** without IFC export capability

## 🎨 UI Elements

### Export IFC Button (Teal)
```
Location: Top-right of viewer
Color: Teal/cyan (#00D4D4)
States:
  - Normal: "Export IFC"
  - Processing: "Converting..." with spinner
  - Disabled: Grayed out during conversion
```

### Export CSV Button (Yellow)
```
Location: Top-right of viewer (next to IFC button)
Color: Hello Yellow (#FED42D)
Function: Exports element properties to CSV
```

## 🔍 Technical Details

### Backend Endpoints:

1. **POST /api/modelderivative/convert-to-ifc**
   - Starts IFC conversion job
   - Request body: `{ "urn": "model-urn" }`
   - Response: `{ "success": true, "jobId": "..." }`

2. **GET /api/modelderivative/:urn/ifc-status**
   - Checks conversion status
   - Response: `{ "status": "success", "downloadUrl": "..." }`

3. **GET /api/modelderivative/download/:urn/:derivativeUrn**
   - Downloads the IFC file
   - Streams file directly to browser

### Conversion Process:

```
User clicks "Export IFC"
    ↓
Frontend calls backend API
    ↓
Backend requests conversion from APS
    ↓
APS queues conversion job
    ↓
Frontend polls status every 5 seconds
    ↓
Conversion completes (1-10 minutes)
    ↓
Download URL retrieved from manifest
    ↓
File downloads automatically
```

### Status Values:
- `pending` - Job queued, not started yet
- `inprogress` - Actively converting (shows progress %)
- `success` / `complete` - Conversion finished
- `failed` - Conversion error
- `timeout` - Took too long (max 5 minutes polling)

## 📊 Console Output

Press **F12** to open browser console and see:

```javascript
Starting IFC conversion for URN: dXJuOmFkc2sub2JqZWN0czo...
IFC conversion status (attempt 1): inprogress
IFC conversion status (attempt 2): inprogress
IFC conversion status (attempt 3): inprogress
IFC conversion status (attempt 4): success
IFC conversion completed! { status: 'success', downloadUrl: '...' }
IFC file downloaded successfully!
```

## 🛠️ Troubleshooting

### Issue: "IFC export is not supported for this file type"
**Solution:** 
- Only certain file types support IFC export
- Try with a Revit (.rvt) file
- Check if the original file has IFC data

### Issue: "IFC conversion timed out"
**Solution:**
- File may be too large or complex
- Try a smaller/simpler model
- Check APS service status

### Issue: "Download URL not available"
**Solution:**
- Conversion completed but file not accessible
- Check console for manifest details
- Try the conversion again

### Issue: Button stays "Converting..." forever
**Solution:**
- Refresh the page
- Check browser console for errors
- Verify backend is running (http://localhost:3001/health)

## 💡 Best Practices

1. **File Size**
   - Files under 100MB convert fastest
   - Large files (>500MB) may timeout
   - Consider splitting large models

2. **Network**
   - Ensure stable internet connection
   - Conversion happens on Autodesk servers
   - Don't close browser during conversion

3. **Format Compatibility**
   - Revit files work best
   - Ensure source file has valid geometry
   - Some metadata may not transfer

4. **Multiple Exports**
   - Wait for first export to complete
   - Can export multiple different files
   - Each conversion is independent

## 🔗 Related Features

### CSV Export (Yellow Button)
- Exports element properties to spreadsheet
- Includes all property groups
- Instant export (no conversion needed)
- Compatible with Excel/Google Sheets

### Viewer Navigation
- Zoom, pan, rotate controls
- Fullscreen mode
- Model isolation
- Section views

## 📞 Support & Resources

### Autodesk Documentation:
- [Model Derivative API](https://aps.autodesk.com/en/docs/model-derivative/v2)
- [IFC Format Specification](https://www.buildingsmart.org/standards/bsi-standards/industry-foundation-classes/)
- [APS Developer Portal](https://aps.autodesk.com)

### Common Use Cases:
- **Clash Detection**: Export to Navisworks, Solibri
- **Energy Analysis**: Import to Revit, IES VE
- **Cost Estimation**: Load into CostX, Vico
- **Coordination**: Share with subcontractors
- **Archive**: Long-term BIM data storage

## 🎉 Success Indicators

You'll know it worked when:
1. ✅ Alert: "IFC conversion started successfully!"
2. ✅ Console shows progress updates
3. ✅ Alert: "IFC file downloaded successfully!"
4. ✅ File appears in Downloads folder
5. ✅ Can open file in IFC viewer (e.g., Solibri, FZK Viewer)

## 🔄 Version History

**Version 1.0.0** (Current)
- Initial IFC export implementation
- Support for Revit and CAD files
- Automatic status polling
- Direct file download
- Error handling and user feedback

---

**Happy Exporting!** 🚀

For issues or questions, check the browser console (F12) for detailed logs.

