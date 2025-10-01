# 🔍 Element Search & Find Guide

## Overview

Project Atom includes a **powerful Element Search & Find feature** that allows you to locate and filter BIM elements based on multiple criteria, parameters, and custom conditions. This is similar to professional BIM software search capabilities but accessible directly in the web viewer.

---

## 🚀 Quick Start

### Accessing the Search Tool

1. **Load a 3D model** in the viewer
2. Click the **"Find"** button (teal button with search icon) in the toolbar
3. The search panel **slides in from the left side** (600px width)
4. The 3D viewer remains visible on the right for real-time interaction

### Simple Search Example

1. Click **"Add Filter"**
2. Select **"Element Name"** as search type
3. Choose **"Contains"** as condition
4. Enter **"Wall"** as value
5. Click **"🔍 Search (AND)"**
6. **Results are highlighted in yellow/gold** in the 3D viewer
7. View all matching elements in the results list!

---

## 📖 Features

### 🎯 Search Types

#### 1. **Element Name**
Search by the element's name/identifier.

**Example**: Find all "Structural Columns"
```
Type: Element Name
Condition: Contains
Value: Column
```

#### 2. **Category**
Filter by Revit category (Walls, Doors, Windows, etc.).

**Example**: Find all doors
```
Type: Category
Condition: Equals
Value: Doors
```

#### 3. **Level**
Search by building level.

**Example**: Find elements on Level 2
```
Type: Level
Condition: Equals
Value: Level 2
```

#### 4. **Family/Type**
Filter by family or type name.

**Example**: Find all elements of a specific family
```
Type: Family/Type
Condition: Contains
Value: Basic Wall
```

#### 5. **Parameter Value**
Search by any model parameter value.

**Example**: Find elements with area > 100
```
Type: Parameter Value
Parameter Name: Area
Condition: Greater Than
Value: 100
```

---

### 🔧 Operators/Conditions

| Operator | Description | Use Case |
|----------|-------------|----------|
| **Equals** | Exact match | Find specific category or level |
| **Contains** | Substring match | Find names containing text |
| **Starts With** | Begins with text | Find elements with specific prefix |
| **Ends With** | Ends with text | Find elements with specific suffix |
| **Greater Than** | Numeric comparison | Find elements above threshold |
| **Less Than** | Numeric comparison | Find elements below threshold |
| **Between** | Range comparison | Find elements within a range |

---

### 🧮 Logic Modes

#### AND Mode (All Criteria)
All filters must match for an element to be included.

**Example**: Find all walls on Level 2
```
Filter 1: Category = Walls
Filter 2: Level = Level 2
Logic: AND
Result: Only walls on Level 2
```

#### OR Mode (Any Criteria)
Element matches if it satisfies ANY filter.

**Example**: Find walls or columns
```
Filter 1: Category = Walls
Filter 2: Category = Structural Columns
Logic: OR
Result: All walls + all columns
```

---

## 🎨 Advanced Features

### 1. **Multiple Filters**

Combine multiple criteria for precise searches:

**Example**: Find large windows on upper floors
```
Filter 1: Category = Windows
Filter 2: Level = Level 3
Filter 3: Parameter (Area) > 10
Logic: AND
```

### 2. **Case Sensitivity**

For text searches, toggle case sensitivity:
- ☑️ **Case Sensitive**: "Wall" ≠ "wall"
- ☐ **Case Insensitive**: "Wall" = "wall" (default)

### 3. **Between Operator**

Search for values within a range:

**Example**: Find elements with area between 50-100
```
Type: Parameter Value
Parameter: Area
Condition: Between
Value: 50
To: 100
```

---

## 💾 Presets & History

### Save Search Presets

1. Configure your search filters
2. Enter a **preset name** in the text field
3. Click **"Save"**
4. Access later from **"Presets"** dropdown

**Use Cases**:
- Frequently used searches
- Quality control checks
- Standard project queries

### Search History

The last **10 searches** are automatically saved:
- Click **"Presets"** button
- View **"Recent Searches"** section
- Click any entry to reload criteria

---

## 🎯 Working with Results

### Selection Tools

**Individual Selection**:
- Click any result to select it
- Blue highlight indicates selection
- Click again to deselect

**Bulk Selection**:
- **Select All**: Select all results
- **Clear**: Deselect all

### Viewer Actions

Once you have results, use these actions:

| Action | Button | Description |
|--------|--------|-------------|
| **Select** | ☑️ | Select elements in viewer |
| **Isolate** | 👁️ | Hide everything except results |
| **Hide** | 🚫 | Hide only the results |
| **Fit** | 🎯 | Zoom camera to fit results |
| **Reset** | 🔄 | Reset viewer visibility + clear highlights |
| **Clear Highlight** | 🎨 | Remove yellow highlighting only |

### Automatic Highlighting

**After every search:**
- ✅ Found elements are **automatically highlighted in yellow/gold**
- ✅ Highlighting persists while you interact with results
- ✅ View highlighted elements alongside the 3D model
- ✅ Click "Clear Highlight" to remove colors
- ✅ Click "Reset" to clear everything

**Quick Zoom**:
- Click the 🎯 button on any individual result to zoom to that element

---

## 📊 Export Results

Export your search results to CSV:

1. Perform a search
2. Click **"Export"** button
3. Download CSV with:
   - Element names
   - Categories
   - Levels
   - All properties

**Use Cases**:
- Documentation
- Quality reports
- Quantity takeoffs
- Coordination lists

---

## 🎓 Use Cases & Examples

### 1. **Quality Control**

Find all elements without required parameters:

```
Filter 1: Parameter (Mark) = "" (empty)
Logic: AND
Action: Review and fix in source model
```

### 2. **Quantity Extraction**

Extract all structural elements by level:

```
Filter 1: Category = Structural Columns
Filter 2: Level = Level 1
Action: Export to CSV for QTO
```

### 3. **Clash Detection Prep**

Isolate specific systems for review:

```
Filter 1: Category = Ducts
Filter 2: Level = Level 2
Action: Isolate + Screenshot
```

### 4. **Material Takeoff**

Find elements with specific materials:

```
Filter 1: Parameter (Structural Material) = Concrete
Filter 2: Parameter (Volume) > 1
Action: Export for material estimation
```

### 5. **Design Review**

Find elements by phase:

```
Filter 1: Parameter (Phase Created) = New Construction
Filter 2: Parameter (Phase Demolished) = None
Action: Review new elements
```

### 6. **Area Analysis**

Find rooms/spaces in a range:

```
Filter 1: Category = Rooms
Filter 2: Parameter (Area) Between 200-500
Action: Export for area schedule
```

---

## 🔧 Advanced Techniques

### Complex Multi-Criteria Search

**Example**: Find all MEP equipment on mechanical levels requiring maintenance access

```
Filter 1: Category = Mechanical Equipment
Filter 2: Level Contains "Mech"
Filter 3: Parameter (Maintenance Access) = Yes
Filter 4: Parameter (Status) = Active
Logic: AND
```

### Parameter-Based Filtering

**Example**: Find elements with specific cost range

```
Filter 1: Parameter (Cost) Greater Than 1000
Filter 2: Parameter (Cost) Less Than 5000
Logic: AND
```

### Naming Convention Validation

**Example**: Verify all elements follow naming standards

```
Filter 1: Element Name Starts With "STR-"
Filter 2: Category = Structural Framing
Logic: AND
Action: Find non-compliant elements
```

---

## 💡 Pro Tips

### 1. **Start Broad, Then Narrow**

Begin with a simple filter, then add criteria:
1. Search for category
2. Review results count
3. Add level filter
4. Add parameter constraints

### 2. **Use Presets for Standard Checks**

Create presets for:
- ✅ Quality control checks
- ✅ Phase-based filters
- ✅ System isolation
- ✅ Material verification

### 3. **Combine with Other Features**

- **Search → Isolate → 4D Mode**: Focus on specific elements in timeline
- **Search → Export → Analytics**: Custom BOQ for filtered elements
- **Search → Isolate → AI Render**: Create renders of specific areas

### 4. **Parameter Discovery**

Not sure what parameters are available?
- Add a **Parameter Value** filter
- Click the **Parameter Name** dropdown
- Browse all available parameters alphabetically

### 5. **Export for Documentation**

Use CSV export to:
- Create equipment lists
- Generate door/window schedules
- Build custom BOQs
- Produce coordination reports

---

## 🎯 Real-World Workflows

### Workflow 1: MEP Coordination

```
1. Search: Category = Ducts, Level = Level 3
2. Action: Isolate
3. Search: Category = Pipes, Level = Level 3
4. Compare: Visual clash check
5. Export: Generate coordination list
```

### Workflow 2: Construction Phasing

```
1. Search: Parameter (Phase) = Phase 1
2. Action: Isolate + Fit
3. Tool: Switch to 4D Mode
4. Result: Animated Phase 1 construction
```

### Workflow 3: Material Verification

```
1. Search: Parameter (Material) = Steel
2. Action: Select All
3. Tool: Open Analytics
4. Result: Steel element quantities
```

### Workflow 4: Room Analysis

```
1. Search: Category = Rooms
2. Filter: Area Between 100-200
3. Export: CSV with room data
4. Analysis: Space utilization report
```

---

## ⚙️ Technical Details

### Search Performance

- **Indexing**: Automatic on model load
- **Search Speed**: ~1-2 seconds for 10,000 elements
- **Memory**: Efficient bulk property retrieval
- **Results Limit**: None (all matches returned)

### Data Storage

- **Presets**: Stored in browser localStorage
- **History**: Last 10 searches cached
- **Persistence**: Survives browser refresh
- **Privacy**: All data stored locally

### Supported Parameters

The search tool supports **all model parameters**, including:
- Built-in Revit parameters
- Shared parameters
- Project parameters
- Family parameters
- Instance parameters
- Type parameters

---

## 🔧 Troubleshooting

### No Results Found

**Possible Causes**:
1. **Too Restrictive**: AND logic with incompatible filters
2. **Wrong Values**: Check spelling, case sensitivity
3. **Parameter Not Present**: Not all elements have all parameters

**Solutions**:
- Try OR logic instead of AND
- Use "Contains" instead of "Equals"
- Verify parameter exists in model
- Check sample element properties first

### Slow Search

**If search takes > 5 seconds**:
- Large models may take longer
- Close other browser tabs
- Simplify search criteria
- Use more specific filters first

### Search Panel Not Opening

**Troubleshooting**:
1. Ensure model is fully loaded
2. Check browser console (F12) for errors
3. Refresh the page
4. Try a different model

### Results Not Visible in Viewer

**Solutions**:
1. Click **"Show All"** first
2. Use **"Fit to View"** action
3. Check if elements are hidden in model
4. Try **"Isolate"** instead

---

## 🌟 Feature Roadmap

Upcoming enhancements:

- [ ] **Fuzzy Search**: Approximate string matching
- [ ] **Regular Expressions**: Advanced pattern matching
- [ ] **Spatial Filters**: Search by 3D location/proximity
- [ ] **Relationship Filters**: Find connected elements
- [ ] **Batch Actions**: Modify parameters in bulk
- [ ] **Visual Query Builder**: Drag-and-drop interface
- [ ] **Search Analytics**: Most common searches
- [ ] **Cloud Presets**: Share across team

---

## 📚 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + F` | Open search panel (future) |
| `Enter` | Perform search |
| `Esc` | Close search panel |
| `Ctrl/Cmd + A` | Select all results |

---

## 🤝 Support

For questions or issues:
- Check the element properties first
- Verify filter syntax
- Try simpler criteria
- Contact: shashwat.bahrdwaj@autodesk.com

---

## 📖 Related Documentation

- **Analytics Guide**: `ANALYTICS_GUIDE.md` - BOQ analysis
- **4D BIM Guide**: `4D_BIM_GUIDE.md` - Timeline visualization
- **Excel Import Guide**: `EXCEL_IMPORT_GUIDE.md` - Bulk data import

---

## 📄 License & Credits

**Element Search & Find Feature:**
- Developed by **Autodesk India Technical Sales**
- Part of **Project Atom**

**Project Atom:**
- Built on **Autodesk Platform Services**
- © 2025 Autodesk, Inc. All rights reserved.

---

**Happy Searching! 🔍✨**

Find any element in your BIM model with ease using advanced filters and powerful search capabilities!

