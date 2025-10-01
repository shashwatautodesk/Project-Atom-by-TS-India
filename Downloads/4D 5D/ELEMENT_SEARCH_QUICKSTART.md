# ⚡ Element Search Quick Start

Find any element in your BIM model in **3 simple steps**!

---

## 🎯 Quick Search (30 seconds)

### Step 1: Open Search
Click the **teal "Find"** button → Panel slides in from left

### Step 2: Add Filter
1. Click **"Add Filter"**
2. Select search type (e.g., "Element Name")
3. Choose condition (e.g., "Contains")
4. Enter value (e.g., "Wall")

### Step 3: Search & Highlight
Click **"🔍 Search (AND)"** → Results **highlighted in yellow**!

---

## 🔍 Common Searches

### Find All Walls
```
Type: Category
Condition: Equals
Value: Walls
```

### Find Elements on Level 2
```
Type: Level
Condition: Equals
Value: Level 2
```

### Find Large Elements
```
Type: Parameter Value
Parameter: Area
Condition: Greater Than
Value: 100
```

### Find by Name
```
Type: Element Name
Condition: Contains
Value: Door
```

---

## 🎨 What to Do with Results

Once you have search results:

| Action | What It Does |
|--------|--------------|
| **Auto** | ✨ **Results highlighted in yellow automatically** |
| **Click** | Select individual result |
| **Select** | Select all in viewer |
| **Isolate** | Show only these elements |
| **Hide** | Hide these elements |
| **Fit** | Zoom to results |
| **Reset** | Clear all + remove highlighting |
| **Clear Highlight** | Remove yellow highlighting only |
| **Export** | Download CSV |

---

## 💾 Save Your Searches

### Save as Preset
1. Configure filters
2. Enter name: `"My Search"`
3. Click **"Save"**
4. Reload anytime from **"Presets"** button

### Auto History
- Last 10 searches saved automatically
- Access via **"Presets"** → **"Recent Searches"**

---

## 🚀 Power User Tips

### 1. **Multi-Filter Search**

Combine multiple filters for precision:
```
Filter 1: Category = Doors
Filter 2: Level = Level 1
Filter 3: Parameter (Width) > 900
Logic: AND
Result: Wide doors on Level 1
```

### 2. **AND vs OR Logic**

- **AND**: Element must match ALL filters (narrower)
- **OR**: Element can match ANY filter (broader)

### 3. **Between Operator**

Find ranges easily:
```
Parameter: Area
Condition: Between
Value: 50
To: 100
```

---

## 📊 Export Results

1. Perform search
2. Click **"Export"**
3. Get CSV with all element data
4. Use in Excel, reports, or documentation

---

## 🎯 Quick Workflows

### Isolate MEP System
```
1. Search: Category = Ducts
2. Click: Isolate
3. Result: Only ductwork visible
```

### Find & Select Elements
```
1. Search: Element Name Contains "Column"
2. Click: Select All
3. Result: All columns selected in viewer
```

### Create Custom BOQ
```
1. Search: Category = Structural Framing
2. Filter: Level = Level 1
3. Click: Export
4. Result: CSV with structural data
```

---

## 💡 Pro Shortcuts

- **Select All Results**: Use "Select All" button
- **Quick Zoom**: Click 🎯 icon on any result
- **Reset View**: Click "Show All"
- **Multi-Select**: Click multiple results (Ctrl+Click)

---

## 🔧 Common Issues

### "No Results Found"
→ Try OR logic or "Contains" instead of "Equals"

### Can't See Results
→ Click "Show All" then "Isolate"

### Slow Search
→ Be more specific with first filter

---

## 📖 Need More Help?

Read the full guide: **ELEMENT_SEARCH_GUIDE.md**

---

**That's it! Start finding elements instantly! 🔍✨**

**Pro Tip**: Save your most common searches as presets for instant access!

