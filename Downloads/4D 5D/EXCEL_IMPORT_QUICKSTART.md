# 🚀 Excel Import - Quick Start Guide

## Import Schedule in 3 Steps

### Step 1: Prepare CSV File
```csv
External ID,Start Date,End Date,Status,Progress
50f92000-82f8-4258-b6a8-bb42c01b00a0-0009760d,2025-10-01,2025-10-15,In Progress,65
a1b2c3d4-5678-90ab-cdef-1234567890ab,2025-10-05,2025-10-20,Completed,100
```

### Step 2: Configure Mapping
- **Dropdown 1:** Choose from **ALL model properties** (Mark, Level, Comments, etc.)
- **Dropdown 2:** External ID (from your CSV)

**Note:** The system automatically scans your model and shows ALL available parameters!

### Step 3: Import
Click "Import" and watch elements get colored automatically! ✨

---

## 📋 Required CSV Columns

**Minimum requirement:** One unique identifier column
- External ID (recommended)
- WBS ID
- Element Name
- Or any unique field

**Optional columns:**
- Start Date, End Date
- Status, Progress
- Phase, Discipline, Contractor
- Notes

---

## 📅 Date Format
**Always use:** `YYYY-MM-DD`

✅ `2025-10-01`  
❌ `10/01/2025`

---

## 🎨 Status Colors

| Status | Color |
|--------|-------|
| Not Started | ⚪ Gray |
| In Progress | 🟡 Yellow |
| Completed | 🟢 Green |
| Delayed | 🔴 Red |

---

## 🔧 How to Get External IDs

**Easiest way:** 
1. Load model in viewer
2. Click "Download CSV" button
3. Your CSV now has all External IDs!
4. Add schedule columns to this file
5. Re-import it

---

## ⚡ Pro Tips

✅ Use External ID for best results  
✅ Save Excel file as CSV format  
✅ Test with 10 rows first  
✅ Dates must be YYYY-MM-DD  

---

## 🎯 Common Mapping Examples

### Mapping by External ID (Most Reliable)
- Dropdown 1: `External ID (Revit GUID)`
- Dropdown 2: `External ID` or `GUID`

### Mapping by Element Name
- Dropdown 1: `Element Name`
- Dropdown 2: `Element Name` or `Name`

### Mapping by WBS ID
- Dropdown 1: `External ID (Revit GUID)`
- Dropdown 2: `WBS ID` (CSV contains Revit GUIDs in WBS ID column)

---

Need more details? See **EXCEL_IMPORT_GUIDE.md**
