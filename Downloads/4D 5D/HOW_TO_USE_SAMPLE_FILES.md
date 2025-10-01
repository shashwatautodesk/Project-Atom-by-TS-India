# 📊 How to Use the Sample CSV Files

## Available Sample Files

### 1. **sample_schedule_import.csv** (Basic)
- 10 example elements
- Simple schedule data
- Good for first-time testing

### 2. **sample_schedule_ENHANCED.csv** (Advanced) ⭐ RECOMMENDED
- 25 example elements
- Shows all 4 status types:
  - ✅ **Completed** (Green) - 3 elements
  - 🔄 **In Progress** (Yellow) - 3 elements
  - ⚠️ **Delayed** (Red) - 2 elements
  - ⏸️ **Not Started** (Gray) - 17 elements
- Real construction sequence
- Multiple disciplines
- Various contractors

---

## 🎯 Option 1: Use CSV Directly (Fastest)

**Simply upload the CSV file as-is:**

1. Open the 4D viewer application
2. Enable 4D Mode
3. Click "Import Excel"
4. Select **`sample_schedule_ENHANCED.csv`**
5. Configure mapping and import!

✅ **No Excel needed!**

---

## 📑 Option 2: Open in Excel (Recommended for Editing)

### Step-by-Step:

**1. Open in Excel:**
```
Right-click sample_schedule_ENHANCED.csv → Open With → Microsoft Excel
```

**2. Edit Your Data:**
- Replace the External IDs with your actual element GUIDs
- Modify dates, status, progress
- Add your contractor names
- Update WBS IDs

**3. Save as CSV:**
```
File → Save As → Choose "CSV (Comma delimited) (*.csv)"
```
⚠️ **Important:** Must save as CSV, not .xlsx!

**4. Import to Application:**
- Upload your edited CSV file
- Map columns
- Done!

---

## 🔧 How to Get Your Element External IDs

### Method 1: Export from Viewer (Easiest)

1. Load your model in the viewer
2. Click the **"Download CSV"** button (download icon)
3. Open the exported CSV
4. Copy the External IDs
5. Paste into the sample file under "External ID" column
6. Re-import!

### Method 2: From Revit

1. Open your model in Revit
2. Create a Schedule/Quantities
3. Add these fields:
   - Family and Type
   - **UniqueId** (this is the External ID!)
4. Export schedule to CSV
5. Use that as your import file

---

## 📋 Understanding the Columns

| Column | Required? | Description | Example |
|--------|-----------|-------------|---------|
| **WBS ID** | Optional | Your project WBS code | WBS-001 |
| **Element Name** | Optional | Name from the model | Basic Wall [620045] |
| **External ID** | ⭐ RECOMMENDED | Revit GUID (most reliable) | 50f92000-82f8-... |
| **Start Date** | Optional | Planned start | 2025-10-01 |
| **End Date** | Optional | Planned end | 2025-10-15 |
| **Actual Start** | Optional | When work actually started | 2025-10-02 |
| **Actual End** | Optional | When work finished | 2025-10-14 |
| **Status** | Optional | Current status | In Progress |
| **Progress** | Optional | Completion % (0-100) | 65 |
| **Phase** | Optional | Construction phase | Foundation |
| **Discipline** | Optional | Trade | Architectural |
| **Contractor** | Optional | Responsible party | ABC Construction |
| **Notes** | Optional | Any comments | Level 1 walls |

---

## ✅ Status Values Recognized

The system automatically recognizes these status values (case-insensitive):

| You Type | System Recognizes As | Color |
|----------|---------------------|-------|
| Not Started, Pending, Planned | Not Started | ⚪ Gray |
| In Progress, Active, Ongoing | In Progress | 🟡 Yellow |
| Completed, Done, Finished | Completed | 🟢 Green |
| Delayed, Late, Behind | Delayed | 🔴 Red |

---

## 🎨 Example Workflows

### Workflow 1: Test with Sample Data

```
1. Use sample_schedule_ENHANCED.csv as-is
2. Import directly (no editing needed)
3. See how the import works
4. Elements will be colored (won't match your model)
```

### Workflow 2: Real Project Import

```
1. Export your model properties → Get External IDs
2. Open sample_schedule_ENHANCED.csv in Excel
3. Replace External IDs with your actual GUIDs
4. Update dates, status, contractors
5. Save as CSV
6. Import to viewer
7. Elements automatically colored! ✨
```

### Workflow 3: From Primavera/MS Project

```
1. Export your schedule from P6/Project to CSV
2. Add "External ID" column
3. Fill in External IDs (from Revit export)
4. Import to viewer
5. Visual 4D timeline ready!
```

---

## 🎯 Mapping Examples

### Example 1: Match by External ID (Most Reliable)
```
Dropdown 1: External ID (Revit GUID)
Dropdown 2: External ID
```
✅ Best for: Production use, accurate matching

### Example 2: Match by Element Name
```
Dropdown 1: Element Name
Dropdown 2: Element Name
```
✅ Best for: Quick testing, simple models

### Example 3: Match by WBS ID (if External ID is in WBS column)
```
Dropdown 1: External ID (Revit GUID)
Dropdown 2: WBS ID
```
✅ Best for: When your WBS ID IS the External ID

---

## 📊 Sample File Highlights

### sample_schedule_ENHANCED.csv includes:

**Completed Elements (100%):**
- WBS-001: Basic Wall (Foundation)
- WBS-012: Stair (Structure)
- WBS-021: Foundation Wall
- WBS-022: Slab on Grade

**In Progress (>0% <100%):**
- WBS-002: Structural Column (75%)
- WBS-011: Window (50%)
- WBS-019: Fire Protection (60%)

**Delayed Elements:**
- WBS-003: Floor (35% - behind schedule)
- WBS-013: Railing (25% - delayed)
- WBS-023: Structural Steel (40% - delayed)

**Not Started (0%):**
- Multiple elements across all phases

---

## 💡 Pro Tips

✅ **Start Small:** Import 5-10 elements first to verify mapping  
✅ **Use External ID:** Most reliable matching method  
✅ **Date Format:** Always use YYYY-MM-DD (2025-10-01)  
✅ **Test Import:** Use sample file first, then your data  
✅ **Excel UTF-8:** If special characters, save as "CSV UTF-8"  
✅ **Backup:** Keep original CSV before editing  

---

## ❗ Common Issues

### Issue: "No match found"
**Solution:** External IDs don't match. Export model properties first.

### Issue: Dates not working
**Solution:** Use YYYY-MM-DD format only.

### Issue: Excel adds extra quotes
**Solution:** Save as "CSV (Comma delimited)" not "CSV UTF-8"

---

## 🚀 Quick Test Command

**Try this right now:**

1. Open http://localhost:5173
2. Load any model
3. Enable 4D Mode
4. Import **sample_schedule_ENHANCED.csv**
5. Map: External ID → External ID
6. Click Import
7. See the color coding (even if IDs don't match your model)

---

## 📚 Related Guides

- **EXCEL_IMPORT_QUICKSTART.md** - 3-step import guide
- **EXCEL_IMPORT_GUIDE.md** - Complete documentation
- **4D_BIM_GUIDE.md** - Full 4D feature guide

---

**Happy importing! 🎉**
