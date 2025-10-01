# 📊 Excel Import Guide - 4D BIM Schedule Mapping

## Overview

The **Excel Import** feature allows you to bulk-assign 4D schedule data to model elements by uploading a CSV file. This is perfect for importing WBS schedules, construction sequences, and project timelines.

---

## 🎯 Quick Start

1. **Enable 4D Mode** in the viewer
2. Click the **"Import Excel"** button in the yellow banner
3. Upload your CSV file
4. Configure the mapping (select which columns to match)
5. Click **"Import"**
6. Elements will be automatically colored based on their status!

---

## 📋 CSV File Requirements

### Required Columns

Your CSV file must have **at least one unique identifier column** to match elements:

- **WBS ID** - Work Breakdown Structure ID
- **External ID** - Revit GUID (most reliable)
- **Element Name** - Element name from the model
- Or any other unique identifier

### Optional Columns

Include any of these columns for schedule data:

| Column Name | Description | Example | Alternate Names |
|-------------|-------------|---------|-----------------|
| **Start Date** | Scheduled start date | 2025-10-01 | "Scheduled Start", "StartDate", "Scheduled Start Date" |
| **End Date** | Scheduled end date | 2025-10-15 | "Scheduled End", "EndDate", "Scheduled End Date" |
| **Actual Start** | Actual start date | 2025-10-02 | "Actual Start Date", "ActualStart" |
| **Actual End** | Actual completion date | 2025-10-14 | "Actual End Date", "ActualEnd" |
| **Status** | Current status | In Progress | - |
| **Progress** | Completion percentage | 75 | "% Complete", "Percent Complete" |
| **Phase** | Construction phase | Foundation | "Construction Phase" |
| **Discipline** | Trade discipline | Architectural | "Trade" |
| **Contractor** | Responsible contractor | ABC Construction | "Responsible", "Company" |
| **Notes** | Additional notes | Any text | "Description", "Comments" |

**✨ New: Flexible Column Matching!**

The import now supports:
- **Case-insensitive** column names (e.g., "start date" = "Start Date")
- **Multiple name variations** for each field (see "Alternate Names" above)
- **Automatic trimming** of whitespace
- **Detailed logging** in browser console (F12) showing what was extracted

---

## 📅 Date Format

All dates must be in **YYYY-MM-DD** format:

✅ **Correct:**
```
2025-10-01
2025-12-31
```

❌ **Incorrect:**
```
10/01/2025
01-Oct-2025
October 1, 2025
```

---

## 📊 Status Values

The system recognizes these status values (case-insensitive):

| Status | Recognized Values | Color |
|--------|------------------|-------|
| **Not Started** | Not Started, Pending, Planned | Gray |
| **In Progress** | In Progress, Active, Ongoing, Started | Yellow |
| **Completed** | Completed, Done, Finished | Green |
| **Delayed** | Delayed, Late, Behind Schedule | Red |

---

## 🎨 Element Mapping Process

### Step 1: Upload CSV File

1. Click **"Import Excel"** button
2. Select your CSV file (must be saved as CSV, not Excel .xlsx)
3. System will parse and preview your data

### Step 2: Configure Mapping

You'll see **two dropdown menus**:

#### **Dropdown 1: Viewer Element Property**

The system **automatically scans your loaded model** and shows **ALL available parameters**! This includes:

**Built-in Properties:**
- **External ID (Revit GUID)** - Most reliable, unique for each element
- **Element Name** - Matches element names
- **Database ID** - Viewer's internal ID

**All Model Parameters** (automatically discovered):
- **Identity Data**: Mark, Comments, Image, Workset, etc.
- **Constraints**: Level, Height Offset, Room Bounding, etc.
- **Structural**: Rebar Cover, Structural Material, etc.
- **Dimensions**: Length, Width, Height, Area, Volume, etc.
- **Phasing**: Phase Created, Phase Demolished, etc.
- **Materials & Finishes**: Material names, finishes, etc.
- **Construction**: Assembly Code, Type Mark, etc.
- **Any Custom Parameters** from your Revit model!

**The dropdown will show 50-200+ properties** depending on your model! Each property is labeled with its category:
```
External ID (Revit GUID)
Element Name
[Identity Data] Mark
[Identity Data] Comments
[Constraints] Level
[Structural] Rebar Cover
[Dimensions] Length
... and many more!
```

#### **Dropdown 2: Excel Column to Match**

Select which column in your CSV contains the matching values:

- **WBS ID**
- **External ID**
- **Element Name**
- Or any other column from your CSV

### Example Mapping

**Scenario:** Match elements using Revit GUIDs

- **Dropdown 1:** Select "External ID (Revit GUID)"
- **Dropdown 2:** Select "External ID" (column from your CSV)

The system will match each row's "External ID" value to the model element's External ID.

---

## 📝 Sample CSV Template

Use this template to create your schedule:

```csv
WBS ID,Element Name,External ID,Start Date,End Date,Status,Progress,Phase,Discipline,Contractor,Notes
WBS-001,Basic Wall [620045],50f92000-82f8-4258-b6a8-bb42c01b00a0-0009760d,2025-10-01,2025-10-15,In Progress,65,Foundation,Architectural,ABC Construction,Level 1 exterior walls
WBS-002,Structural Column [345221],a1b2c3d4-5678-90ab-cdef-1234567890ab,2025-10-05,2025-10-20,In Progress,40,Structure,Structural,XYZ Structural,Main building columns
WBS-003,Floor [789456],e5f6g7h8-9012-34ij-klmn-5678901234op,2025-10-10,2025-10-25,Not Started,0,Structure,Structural,XYZ Structural,Level 2 floor slab
```

A complete sample file is included: **`sample_schedule_import.csv`**

---

## 🔧 How to Get External IDs from Revit

### Method 1: Using Revit Schedules

1. Open your model in Revit
2. Create a new schedule (View > Schedules > Schedule/Quantities)
3. Add these fields:
   - Family and Type
   - Element ID
   - **UniqueId** (This is the External ID!)
4. Export to CSV (File > Export > Reports > Schedule)

### Method 2: Using Dynamo

Create a Dynamo script to export all element properties including UniqueId.

### Method 3: Using the Viewer Export

1. Load your model in the 4D viewer
2. Click **"Download CSV"** (the download icon)
3. Open the exported CSV to see all External IDs
4. Add your schedule columns to this file

---

## 🎯 Best Practices

### 1. **Use External ID for Maximum Reliability**
External IDs (Revit GUIDs) are unique and permanent. Element names can change, but External IDs remain constant.

### 2. **Clean Your Data**
- Remove empty rows
- Ensure dates are formatted correctly (YYYY-MM-DD)
- Use consistent status values

### 3. **Test with Small Batch First**
- Start with 10-20 elements to verify mapping works
- Check that elements are colored correctly
- Then import the full schedule

### 4. **Save as CSV from Excel**
If you created your schedule in Excel:
1. Click **File > Save As**
2. Choose **"CSV (Comma delimited) (*.csv)"**
3. Click **Save**

### 5. **Verify Column Names**
Column names should match exactly (case-insensitive is OK):
- ✅ "Start Date" or "start date"
- ❌ "StartDate" or "Start_Date"

---

## 🚀 Step-by-Step Workflow

### Full Import Process

1. **Prepare Your Schedule**
   - Create Excel file with WBS data
   - Include all required columns
   - Save as CSV

2. **Open Model in 4D Viewer**
   - Select your ACC project
   - Browse to the model file
   - Load in viewer

3. **Enable 4D Mode**
   - Click **"Enable 4D Mode"** button
   - Yellow banner appears

4. **Import Schedule**
   - Click **"Import Excel"** button
   - Upload your CSV file
   - Preview shows your data

5. **Configure Mapping**
   - **Dropdown 1:** Select viewer property (e.g., "External ID")
   - **Dropdown 2:** Select CSV column (e.g., "External ID")
   - Review the mapping rule

6. **Execute Import**
   - Click **"Import X Element Mappings"**
   - Wait for processing (may take a minute for large files)
   - Review success/failure counts

7. **Visualize Schedule**
   - Elements are automatically colored by status
   - Use Timeline Controls to filter by date
   - Click any element to view its schedule properties

---

## 🎨 Color Coding After Import

Elements are automatically colored based on their status:

- 🔴 **Red** - Delayed / Behind Schedule
- 🟡 **Yellow** - In Progress / Active
- 🟢 **Green** - Completed
- ⚪ **Gray** - Not Started / Planned

---

## 📊 Example Use Cases

### Use Case 1: Construction Sequence

Import a Primavera P6 or MS Project schedule:
1. Export project schedule to CSV
2. Map using WBS ID
3. Visualize construction sequence over time

### Use Case 2: Trade Coordination

Filter elements by discipline and contractor:
1. Import schedule with discipline/contractor data
2. Use timeline controls to filter
3. Coordinate between trades

### Use Case 3: Progress Tracking

Track actual vs planned progress:
1. Import baseline schedule
2. Update progress weekly
3. Re-import to see updated colors

---

## ❗ Troubleshooting

### Issue: "No match found for [value]"

**Cause:** The value in your CSV doesn't match any element in the model.

**Solutions:**
- Double-check the External ID/name is correct
- Try a different mapping property (e.g., use Name instead of External ID)
- Verify the element exists in the loaded model

### Issue: "Failed to map: X elements"

**Cause:** Some rows couldn't find matching elements.

**Solutions:**
- Export model properties using CSV export to see exact values
- Check for typos in your CSV
- Ensure you're using the correct view/discipline in the model

### Issue: CSV file not uploading

**Cause:** File is still in Excel format (.xlsx)

**Solutions:**
- Save as CSV format in Excel
- Use "CSV (Comma delimited)" not "CSV UTF-8"

### Issue: Dates not working

**Cause:** Incorrect date format

**Solutions:**
- Use YYYY-MM-DD format only
- Remove any time components
- Ensure no special characters

---

## 🔄 Re-importing Data

You can re-import anytime to update schedule data:

1. Modify your CSV file
2. Click **"Import Excel"** again
3. New data will **replace** existing mappings for matched elements

**Note:** This is additive - elements not in the new CSV will retain their previous properties.

---

## 💾 Syncing to Database

After importing, you can sync all properties to the backend database:

1. Click **"Sync to Database"** in the Property Panel
2. Or import will automatically save to memory
3. Data persists for the session

---

## 🎓 Advanced Tips

### Tip 1: Batch Processing

Import multiple CSV files for different disciplines:
- Import structural schedule first
- Then import MEP schedule
- Then import architectural schedule

### Tip 2: Formula in Excel

Use Excel formulas to generate External IDs or calculate dates automatically.

### Tip 3: Conditional Formatting

Use Excel conditional formatting to verify data quality before export.

### Tip 4: Version Control

Keep dated versions of your schedule CSV:
- `schedule_2025-10-01.csv`
- `schedule_2025-10-15.csv`
- Track changes over time

---

## 📞 Need Help?

If you encounter issues:

1. Check the browser console (F12) for error messages
2. Verify your CSV format matches the template
3. Test with the included `sample_schedule_import.csv` file
4. Review this guide's troubleshooting section

---

## ✨ Summary

The Excel Import feature makes it easy to:
- ✅ Bulk-assign schedule data to hundreds/thousands of elements
- ✅ Visualize construction sequences in 3D
- ✅ Track progress with automatic color coding
- ✅ Coordinate between multiple trades
- ✅ Update schedules quickly without manual clicking

Happy 4D scheduling! 🚀
