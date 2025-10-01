# 📊 Analytics - Category Filter Guide

## Overview

The Analytics tab now includes **advanced category filtering** beyond just "Major Categories Only". Users can filter by specific categories, use quick filters, or select custom combinations!

---

## 🎯 New Filter Features

### 1. **Quick Filters** ⚡

**One-click preset filters** for common element types:

| Button | What It Shows |
|--------|---------------|
| 🧱 **Walls** | All wall types (Basic, Curtain, Stacked) |
| 🏢 **Floors** | All floor elements |
| 🏠 **Roofs** | All roof elements |
| 🚪 **Doors** | All door types |
| 🪟 **Windows** | All window types |
| 🏗️ **Structural** | Columns, Framing, Foundations |

**How to use:**
1. Click any quick filter button
2. Charts instantly update to show only those categories
3. Click "Clear Selection" to remove filter

**Visual:**
```
⚡ Quick Filters                    Clear Selection (3)
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌────────┐
│Walls │ │Floors│ │Roofs │ │Doors │ │Windows│ │Structural│
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └────────┘
```

---

### 2. **Custom Category Selection** ✅

**Select ANY specific categories** from the complete list:

**Toggle Button:**
```
🔍 Show All Categories (88)
```

**When expanded:**
Shows a **checkbox grid** with ALL categories from your model:
```
┌─────────────────────────────────────────────────────┐
│ Select specific categories to display:              │
├─────────────────────────────────────────────────────┤
│ ☑️ Walls (45)           ☐ Doors (32)                │
│ ☑️ Floors (12)          ☐ Windows (28)              │
│ ☑️ Roofs (8)            ☐ Columns (15)              │
│ ☐ Stairs (6)           ☐ Furniture (23)            │
│ ... (scrollable list of all 88 categories)          │
└─────────────────────────────────────────────────────┘
```

**Features:**
- ✅ **Checkboxes** for each category
- ✅ **Element counts** shown for each
- ✅ **Scrollable** (max height with scroll)
- ✅ **Searchable** (use search box to filter list)
- ✅ **Multi-select** (pick as many as you want)

---

## 🔄 Filter Behavior

### **Priority System:**

**1. Specific Categories (Highest Priority)**
- If you select specific categories → **ONLY those show**
- Overrides Major Categories and Discipline filters
- Still respects Min Element Count and Search

**2. Major Categories + Discipline**
- If NO specific categories selected:
  - Major Categories filter applies
  - Discipline filter applies
  - Min Element Count applies
  - Search applies

**3. Always Active:**
- **Min Element Count** - Always filters
- **Search Query** - Always filters

---

## 📋 Filter Combinations

### Example 1: Quick Filter for Walls
```
Click "Walls" →
Result: Shows only Walls, Basic Walls, Curtain Walls, etc.
Other filters: Disabled
```

### Example 2: Custom Selection
```
Check: Walls, Floors, Roofs →
Result: Shows only those 3 categories
Other filters: Disabled
```

### Example 3: Major Categories + Discipline
```
Major Categories: ON
Discipline: Architecture
Min Elements: 10
Result: Major architectural categories with 10+ elements
```

### Example 4: Search with Selection
```
Selected: Walls, Floors, Roofs
Search: "basic"
Result: Only "Basic Wall" and "Basic Floor" (if exists)
```

---

## 🎨 Active Filter Display

**Badges show all active filters:**

```
Active filters:
[Major Categories] [Min 5 elements] [Architecture] [Search: "wall"] [3 Categories Selected]
```

**Badge Colors:**
- 🔵 **Blue** - Major Categories
- 🟢 **Teal** - Min Element Count
- 🟡 **Yellow** - Discipline
- 🟠 **Orange** - Search Query
- 🟣 **Purple** - Categories Selected

---

## 🎯 Use Cases

### 1. **Focus on Key Elements**
**Goal:** Analyze only walls, floors, and roofs

**Steps:**
1. Click "Walls" quick filter
2. Click "Show All Categories"
3. Also check "Floors" and "Roofs"
4. View charts showing only these 3

---

### 2. **Compare Structural Elements**
**Goal:** BOQ for all structural components

**Steps:**
1. Click "Structural" quick filter
2. Charts show Columns, Beams, Foundations
3. Export CSV for structural quantities

---

### 3. **Find Specific Elements**
**Goal:** Locate "Curtain Wall" category

**Steps:**
1. Type "curtain" in search
2. Click "Show All Categories"
3. Check "Curtain Wall"
4. View only that category

---

### 4. **Custom Report**
**Goal:** BOQ for doors and windows only

**Steps:**
1. Click "Doors" quick filter
2. Adds all door types
3. Click "Show All Categories"
4. Also check all window types
5. Export as "Doors & Windows BOQ"

---

## 🔧 How It Works

### Filter Logic
```javascript
1. IF specific categories are selected:
   → Show ONLY those categories
   
2. ELSE (no specific selection):
   → Apply Major Categories filter
   → Apply Discipline filter
   
3. ALWAYS apply:
   → Min Element Count filter
   → Search query filter
```

### Quick Filter Logic
```javascript
1. User clicks "Walls"
2. System finds all categories containing "Wall"
3. Selects: ["Walls", "Basic Wall", "Curtain Wall", "Stacked Wall"]
4. Charts update to show only these
```

---

## 💡 Pro Tips

### Tip 1: **Combine Quick Filters**
- Click "Walls" → Then check additional categories
- Builds on quick filter selection

### Tip 2: **Use Search to Find Categories**
- Type "structural" in search
- Show All Categories
- Easily find and select structural items

### Tip 3: **Clear Selection for Fresh Start**
- Click "Clear Selection (X)" to remove custom picks
- Returns to standard filters

### Tip 4: **Export Different Views**
- Select "Walls" → Export "Walls_BOQ.csv"
- Select "MEP" → Export "MEP_BOQ.csv"
- Create multiple specialized reports

---

## 🎨 Visual Design

### Quick Filter Buttons
- **Gradient backgrounds** (Blue → Teal)
- **Hover effect** → Changes to Yellow
- **Scale animation** → Grows 105% on hover
- **Modern rounded** design

### Category Checkboxes
- **Dark background** panel
- **Scrollable** grid layout
- **Hover effect** on each row
- **Yellow checkboxes** (brand color)
- **Element counts** beside names

---

## 📊 Chart Updates

**When filters are applied:**
- ✅ Charts **instantly update**
- ✅ **Smooth transitions**
- ✅ Summary cards **recalculate**
- ✅ Table **updates** with filtered data
- ✅ Active filters **display badges**

---

## 🔄 Reset Options

### Reset All Filters
**Button:** "Reset All Filters" (top right)

**Resets:**
- ✅ Major Categories → ON
- ✅ Min Elements → 5
- ✅ Discipline → All
- ✅ Search → Clear
- ✅ Selected Categories → Clear
- ✅ Category Selector → Hide

### Clear Selection
**Button:** "Clear Selection (X)" (quick filters section)

**Clears:**
- ✅ Selected Categories only
- ✅ Keeps other filters active

---

## 📱 Responsive Design

### Desktop (> 1024px)
- Quick filters: 6 buttons in a row
- Category grid: 4 columns
- Full width panels

### Tablet (768px - 1024px)
- Quick filters: 3 buttons per row
- Category grid: 3 columns
- Adjusted spacing

### Mobile (< 768px)
- Quick filters: Stack vertically
- Category grid: 2 columns
- Scrollable panels

---

## 🚀 Performance

**Optimized for:**
- ✅ **Large models** (1000+ categories handled smoothly)
- ✅ **Instant filtering** (no lag)
- ✅ **Smooth animations**
- ✅ **Efficient rendering**

---

## ✨ Summary

**New Category Filters provide:**
- ⚡ **6 Quick Filters** - One-click presets
- ✅ **Custom Selection** - Pick any categories
- 🔍 **88 Categories** - All available from model
- 🎨 **Beautiful UI** - Gradients, animations
- 🎯 **Smart Logic** - Intelligent filter priority
- 📊 **Instant Updates** - Real-time chart changes
- 💾 **Export Ready** - Filtered BOQ exports

**Perfect for:**
- 📋 Specialized BOQ reports
- 🔍 Detailed element analysis
- 📊 Custom visualizations
- 💰 Discipline-specific estimates

---

**Filter your BOQ data exactly how you need it! 🎯✨**

