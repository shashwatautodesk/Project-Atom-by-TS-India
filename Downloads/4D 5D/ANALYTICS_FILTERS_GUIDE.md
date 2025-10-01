# 🔍 Analytics Filters Guide

## Overview

The Analytics tab now includes powerful filtering options to help you focus on the categories that matter most!

---

## 🎯 Filter Options

### 1. **Major Categories Only** ✅ (Default: ON)

**What it does:**
- Hides Revit-specific internal categories
- Filters out system categories like:
  - Revit Lines, Revit Sketch
  - Revit Detail Items
  - Analytical categories
  - Grids, Views, Sheets
  - Tags, Annotations
  - Reference planes

**When to use:**
- For clean BOQ reports
- When presenting to clients
- For material takeoffs
- Cost estimation

**When to turn OFF:**
- To see ALL categories in the model
- For debugging model issues
- To verify annotation counts

---

### 2. **Minimum Element Count** (Slider: 0-50)

**What it does:**
- Shows only categories with at least X elements
- Default: 5 elements

**Use cases:**

**Set to 0:**
- See all categories, even single elements
- Comprehensive analysis

**Set to 5-10 (Default):**
- Remove noise from small categories
- Focus on significant elements

**Set to 20+:**
- Show only major categories
- High-level overview

---

### 3. **Discipline Filter** (Dropdown)

**Options:**
- **All Disciplines** (default) - Show everything
- **Architecture** - Walls, Floors, Doors, Windows, Stairs, etc.
- **Structure** - Columns, Beams, Framing, Foundations
- **MEP** - Pipes, Ducts, Cables, Conduits, HVAC, Electrical

**Automatic Detection:**

The filter intelligently categorizes based on names:

**Architecture:**
- Walls, Floors, Roofs, Ceilings
- Doors, Windows
- Stairs, Railings, Ramps
- Rooms, Furniture
- Curtain Walls

**Structure:**
- Structural Columns, Beams
- Structural Framing
- Foundations, Trusses, Braces

**MEP:**
- Pipes, Ducts, Cables, Conduits
- Mechanical Equipment
- Electrical Fixtures
- Lighting, HVAC
- Sprinklers, Fire Protection
- Plumbing

---

### 4. **Search Categories** 🔍

**What it does:**
- Real-time text search
- Case-insensitive
- Filters category names

**Examples:**
```
Search: "wall" → Shows: Walls, Curtain Walls, Shaft Walls, etc.
Search: "door" → Shows: Doors, Garage Doors, etc.
Search: "structural" → Shows: Structural Columns, Structural Framing, etc.
```

**Tips:**
- Use partial words (e.g., "struct" finds "Structural")
- Clear search with X button
- Combines with other filters

---

## 🎨 Active Filters Display

At the bottom of the filter panel, you'll see colorful badges showing active filters:

```
Active filters:  [Major Categories] [Min 5 elements] [Architecture] [Search: "wall"]
```

Each badge shows:
- 🔵 Blue = Major Categories filter
- 🟢 Teal = Minimum element count
- 🟡 Yellow = Discipline filter
- 🟠 Orange = Search query

---

## 🔄 Reset Filters

Click **"Reset Filters"** button to restore defaults:
- ✅ Major Categories Only: ON
- ✅ Min Elements: 5
- ✅ Discipline: All
- ✅ Search: (empty)

---

## 📊 Summary Card Updates

The **"Categories Shown"** card now displays:
```
Categories Shown
    15
of 88 total
```

This shows:
- **15** = Categories after filters
- **88** = Total categories in model

---

## 💡 Common Filter Combinations

### 1. **Clean BOQ for Clients**
```
✅ Major Categories Only: ON
✅ Min Elements: 10
✅ Discipline: All
✅ Search: (empty)
```
**Result:** Only significant building elements

---

### 2. **Architectural Quantity Takeoff**
```
✅ Major Categories Only: ON
✅ Min Elements: 5
✅ Discipline: Architecture
✅ Search: (empty)
```
**Result:** Walls, Floors, Doors, Windows, etc.

---

### 3. **MEP Coordination**
```
✅ Major Categories Only: ON
✅ Min Elements: 0
✅ Discipline: MEP
✅ Search: (empty)
```
**Result:** All MEP elements, even small counts

---

### 4. **Structural Analysis**
```
✅ Major Categories Only: ON
✅ Min Elements: 1
✅ Discipline: Structure
✅ Search: (empty)
```
**Result:** Columns, Beams, Framing, Foundations

---

### 5. **Find Specific Elements**
```
✅ Major Categories Only: OFF
✅ Min Elements: 0
✅ Discipline: All
✅ Search: "window"
```
**Result:** All window-related categories

---

### 6. **Complete Model Audit**
```
✅ Major Categories Only: OFF
✅ Min Elements: 0
✅ Discipline: All
✅ Search: (empty)
```
**Result:** Every single category (88 in your model!)

---

## 🎯 How Filters Work Together

Filters are **cumulative** (AND logic):

**Example:**
```
Major Categories: ON
Min Elements: 10
Discipline: Architecture
Search: "wall"
```

Shows categories that:
1. ✅ Are major categories (not Revit internal)
2. ✅ AND have ≥ 10 elements
3. ✅ AND are architectural
4. ✅ AND contain "wall" in the name

**Result:** Walls, Curtain Walls (if they have 10+ elements)

---

## 📈 Filter Impact on Charts

Filters affect:
- ✅ **Pie Chart** - Shows only filtered categories
- ✅ **Bar Charts** - Shows only filtered categories
- ✅ **Detailed Table** - Shows only filtered rows

**Totals (in summary cards) remain unchanged** - they show the complete model data.

---

## 🔧 Troubleshooting

### "Categories Shown: 0"

**Possible causes:**
1. Min element count too high
2. Search query too specific
3. No categories match discipline filter

**Solution:**
- Click "Reset Filters"
- Lower min element count
- Clear search query

---

### "Not seeing a category I know exists"

**Check:**
1. Is "Major Categories Only" ON? (May be hiding it)
2. Does it have fewer elements than your min count?
3. Does your search query exclude it?
4. Is it in a different discipline?

**Solution:**
- Turn OFF "Major Categories Only"
- Set Min Elements to 0
- Clear all filters

---

### "Too many categories in charts"

**Solution:**
- Turn ON "Major Categories Only"
- Increase Min Element Count (10-20)
- Select specific Discipline
- Use search to narrow down

---

## 📚 Best Practices

### 1. **Start Broad, Then Narrow**
1. Open Analytics (see all major categories)
2. Identify areas of interest
3. Apply discipline filter
4. Use search for specific types

### 2. **Use Search for Verification**
- Search for expected categories
- Verify they exist with correct counts
- Cross-check against design documents

### 3. **Export Different Views**
- Export CSV with different filter settings
- Create separate reports for each discipline
- Compare filtered vs. unfiltered data

### 4. **Presentation Mode**
```
Major Categories: ON
Min Elements: 15-20
Discipline: Based on audience
```
Clean, focused data for stakeholders

### 5. **Detailed Analysis Mode**
```
Major Categories: OFF
Min Elements: 0
Discipline: All
```
Complete picture for technical review

---

## ✨ Summary

The new filters give you:
- ✅ **Major Categories** - Hide Revit system elements
- ✅ **Min Element Count** - Focus on significant categories
- ✅ **Discipline Filter** - Architecture, Structure, or MEP
- ✅ **Search** - Find specific categories instantly
- ✅ **Active Filters Display** - See what's applied
- ✅ **Reset** - One-click restore defaults

**Default settings show a clean, professional BOQ with major categories having 5+ elements!**

---

**Happy Filtering! 🎉**

