# 📊 Gantt Chart Guide

## Overview

The **Gantt Chart** feature provides a visual timeline of your construction schedule, showing all elements with their scheduled and actual dates, progress, and status in an easy-to-read format.

---

## 🚀 Quick Start

### **Step 1: Add Schedule Data**

Before you can view the Gantt Chart, you need elements with schedule data:

**Option A: Import from Excel**
1. Enable 4D Mode
2. Click "Import Excel"
3. Upload your CSV file
4. Map columns and import

**Option B: Manual Entry**
1. Enable 4D Mode
2. Click elements in the 3D view
3. Assign dates and status in the Property Panel

### **Step 2: Open Gantt Chart**

1. Enable 4D Mode (if not already active)
2. Click the **"Gantt Chart"** button (blue button in the banner)
3. The Gantt Chart opens in a full-screen overlay

---

## 🎨 Understanding the Gantt Chart

### **Layout**

```
┌─────────────────────────────────────────────────────────┐
│  Header: Title, Date Range, Close Button               │
├─────────────────────────────────────────────────────────┤
│  Controls: Zoom, Group By, Legend                      │
├──────────────┬──────────────────────────────────────────┤
│              │  Timeline Header (dates)                 │
│  Element     ├──────────────────────────────────────────┤
│  Names       │  ███████ Scheduled Bar                   │
│  (Left)      │  ▓▓▓▓▓ Actual Progress Bar             │
│              │                                          │
│              │  │ ← Current Date Indicator            │
└──────────────┴──────────────────────────────────────────┘
```

### **Color Coding**

| Status | Color | Meaning |
|--------|-------|---------|
| ⚪ Gray | `bg-gray-400` | Not Started |
| 🟡 Yellow | `bg-yellow-500` | In Progress |
| 🟢 Green | `bg-green-500` | Completed |
| 🔴 Red | `bg-red-500` | Delayed |

### **Bar Types**

**Scheduled Bar (Translucent)**
- Light-colored bar showing planned dates
- Shows when work is scheduled to happen

**Actual Bar (Solid)**
- Bright-colored bar showing actual progress
- Includes progress indicator (white overlay)
- Hover to see detailed tooltip

---

## 🔧 Controls & Features

### **Zoom Controls**

**Three zoom levels:**

| Level | Interval | Best For |
|-------|----------|----------|
| **Daily** | 1 day | Short-term detailed planning |
| **Weekly** | 7 days | Medium-term overview (Default) |
| **Monthly** | 30 days | Long-term big picture |

**How to use:**
- Click **Zoom In** (🔍+) for more detail
- Click **Zoom Out** (🔍-) for broader view
- Current level shown in the middle

### **Group By**

Organize elements by:

**No Grouping**
- Simple flat list
- All elements shown sequentially

**Group by Phase**
- Foundation, Structure, Envelope, MEP, Interior, etc.
- Click group header to expand/collapse
- Shows element count per phase

**Group by Discipline**
- Architectural, Structural, Mechanical, Electrical, Plumbing
- Organize by trade/contractor
- Useful for trade coordination

### **Current Date Indicator**

- **Yellow vertical line** shows today's date
- "Today" label at the top
- Helps visualize what's overdue vs. upcoming

---

## 📋 Interactive Features

### **Click Element Name**

- Selects element in the 3D viewer
- Zooms/fits to that element
- Closes Gantt Chart
- Perfect for navigating to specific items

### **Click Timeline Bar**

- Also selects element in viewer
- Closes chart and focuses 3D view

### **Hover Over Bar**

**Tooltip shows:**
- Element name
- Progress percentage
- Scheduled dates (if available)
- Actual dates (if started)
- Status

### **Expand/Collapse Groups**

- Click group header (blue bar)
- Chevron icon indicates state (▼ expanded / ▶ collapsed)
- Group count shown in header

---

## 📊 Reading the Timeline

### **Progress Indicator**

On each **actual bar**:
- White overlay = completed portion
- Darker portion = remaining work
- Width = percentage (0-100%)

**Example:**
```
[■■■■■□□□□□] = 50% complete
[■■■■■■■□□□] = 70% complete
[■■■■■■■■■■] = 100% complete
```

### **Timeline Grid**

- Vertical lines mark time intervals
- Labels show dates at the top
- Auto-adjusts based on zoom level

### **Bar Positioning**

**Scheduled dates only:**
- One translucent bar

**Actual dates started:**
- Translucent scheduled bar (background)
- Solid actual bar (foreground)
- Compare planned vs. actual

**Completed:**
- Green solid bar
- Full progress (100%)

---

## 💡 Use Cases

### **Use Case 1: Progress Review**

**Goal:** See overall project status

**Steps:**
1. Open Gantt Chart
2. Group by Phase
3. Look for red (delayed) bars
4. Check progress on yellow (in-progress) items
5. Verify green (completed) items align with schedule

### **Use Case 2: Trade Coordination**

**Goal:** Coordinate between disciplines

**Steps:**
1. Open Gantt Chart
2. Group by Discipline
3. Look for overlapping bars
4. Identify conflicts or dependencies
5. Click element to view in 3D

### **Use Case 3: Schedule Variance**

**Goal:** Find delayed items

**Steps:**
1. Open Gantt Chart
2. Look for red bars (delayed status)
3. Compare actual vs. scheduled bars
4. Identify items behind schedule
5. Take corrective action

### **Use Case 4: Client Presentation**

**Goal:** Show project progress

**Steps:**
1. Import latest schedule
2. Open Gantt Chart
3. Zoom to appropriate level (weekly/monthly)
4. Group by Phase for clear organization
5. Point out current date indicator
6. Highlight completed work (green bars)

---

## 🎯 Best Practices

### ✅ **Do's**

✅ **Import complete schedule data**
   - Include both scheduled and actual dates
   - Update progress percentages regularly
   - Assign status accurately

✅ **Use appropriate grouping**
   - Phase for construction sequence
   - Discipline for trade coordination
   - None for small projects (<20 elements)

✅ **Choose right zoom level**
   - Daily: 1-2 week sprints
   - Weekly: 1-3 month phases
   - Monthly: 6+ month projects

✅ **Update regularly**
   - Re-import schedule weekly
   - Update progress on active items
   - Mark completed items

### ❌ **Don'ts**

❌ Don't use Gantt Chart without schedule data
❌ Don't forget to update progress percentages
❌ Don't mix different date formats
❌ Don't ignore delayed items (red bars)

---

## 🔧 Troubleshooting

### **Issue: Gantt Chart button is disabled**

**Cause:** No elements have schedule data

**Solution:**
1. Import schedule from Excel, OR
2. Manually assign dates to elements

---

### **Issue: Bars are too wide/narrow**

**Cause:** Wrong zoom level for your timeframe

**Solution:**
- Use zoom controls to adjust
- Daily: Short projects
- Weekly: Medium projects
- Monthly: Long projects

---

### **Issue: Can't see all elements**

**Cause:** Groups are collapsed

**Solution:**
- Click group headers to expand
- Or change "Group by" to "No Grouping"

---

### **Issue: Timeline dates are wrong**

**Cause:** Dates in CSV are incorrect format

**Solution:**
- Use YYYY-MM-DD format only
- Check imported dates in Property Panel
- Re-import with corrected dates

---

### **Issue: Current date line not visible**

**Cause:** Current date is outside visible range

**Solution:**
- Check that your schedule includes current date
- Adjust zoom level to see broader timeframe
- Verify timeline bounds

---

## 📚 Advanced Tips

### **Tip 1: Export Gantt View**

While the Gantt Chart doesn't have built-in export, you can:
1. Take a screenshot (Windows: Win + Shift + S)
2. Save for documentation/reports

### **Tip 2: Compare Planned vs Actual**

1. Set scheduled dates when importing
2. Update actual dates as work progresses
3. In Gantt Chart:
   - Light bar = planned
   - Solid bar = actual
   - Compare visually

### **Tip 3: Critical Path Identification**

1. Sort by scheduled start date (automatic)
2. Look for elements with no float
3. Focus on delayed items (red bars)
4. These are likely critical

### **Tip 4: Fast Navigation**

1. Open Gantt Chart
2. Find element in timeline
3. Click element name
4. Automatically jumps to 3D view
5. Element selected and zoomed

---

## 🎨 Visual Guide

### **Example Timeline**

```
Phase: Foundation
├─ Foundation Wall    [████████████] 100% Complete ✓
└─ Slab on Grade      [████████████] 100% Complete ✓

Phase: Structure  
├─ Columns            [████████░░░░]  70% In Progress ⚠
├─ Beams              [██████░░░░░░]  50% In Progress ⚠
└─ Floor Deck         [░░░░░░░░░░░░]   0% Not Started ○

Phase: Envelope
├─ Curtain Wall       [░░░░░░░░░░░░]   0% Not Started ○
└─ Roof               [░░░░░░░░░░░░]   0% Not Started ○
```

---

## 🔗 Related Features

**Timeline Controls**
- Set current date filter
- Play/pause animation
- Status filtering

**Property Panel**
- Edit individual element schedules
- Update status and progress
- Sync to database

**Excel Import**
- Bulk-import schedules
- Map WBS to elements
- Auto-assign dates

---

## ✨ Summary

The Gantt Chart provides:

✅ **Visual timeline** of project schedule  
✅ **Interactive selection** of elements  
✅ **Progress tracking** with color coding  
✅ **Flexible grouping** by phase or discipline  
✅ **Zoom controls** for different timeframes  
✅ **Current date indicator** for context  
✅ **Detailed tooltips** with full information  

**Perfect for:**
- Progress reviews
- Trade coordination
- Schedule analysis
- Client presentations
- Daily standups

---

**Open your Gantt Chart now and visualize your construction timeline! 📊**
