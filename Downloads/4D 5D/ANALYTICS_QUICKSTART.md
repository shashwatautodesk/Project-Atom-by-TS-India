# 📊 Analytics - Quick Start Guide

## ⚡ 60-Second Setup

### Step 1: Open Your Browser
The app is already running at `http://localhost:5173`

### Step 2: Load a Model
1. Select a project
2. Browse to a file
3. Click to load the model

### Step 3: Open Analytics
Click the **"Analytics"** button (blue button with pie chart icon)

---

## 🎯 What You'll See

### Summary Cards
```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ Total Elements  │   Categories    │  Total Volume   │   Total Area    │
│     1,234       │       15        │     450.23      │    2,150.00     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Chart Tabs
- **Distribution** - Pie chart showing category breakdown
- **Element Count** - Bar chart of elements per category
- **Quantities** - Multi-bar chart with volume/area/length

### Detailed Table
Category-by-category breakdown with:
- Element counts
- Volumes, Areas, Lengths
- Percentage of total

---

## 📥 Export Data

Click **"Export CSV"** button → Opens in Excel

CSV includes:
- All categories
- Element counts
- All quantities
- Totals row

---

## 🎨 Chart Features

### Interactive Tooltips
Hover over any chart element to see:
- Category name
- Element count
- Volumes, areas, lengths

### Color-Coded
Each category has a unique color that matches across:
- Pie chart
- Bar charts
- Table rows

### Chart Switching
Use the three buttons to switch between:
1. **Distribution** (Pie) - Best for seeing proportions
2. **Element Count** (Bar) - Best for comparing counts
3. **Quantities** (Multi-bar) - Best for material estimation

---

## 💡 Pro Tips

### 1. **For Cost Estimation**
- Export CSV
- Add unit costs for each category
- Calculate total = Quantity × Unit Cost

### 2. **For Presentations**
- Use pie chart for executive summaries
- Use bar charts for detailed reviews
- Export CSV for technical reports

### 3. **For Verification**
- Compare element counts with design intent
- Check quantities against specifications
- Spot unexpected categories (may indicate errors)

---

## 🔄 Refresh Data

If you make changes to the model view:
1. Close Analytics
2. Update filters/visibility in viewer
3. Reopen Analytics

Data is recalculated each time you open!

---

## 📋 Sample Output

### Example BOQ Table:
| Category | Count | Volume | Area | % |
|----------|-------|--------|------|---|
| Walls | 45 | 125.5 | 850.0 | 25% |
| Floors | 12 | 200.0 | 1200.0 | 35% |
| Columns | 30 | 50.0 | 0.0 | 20% |
| **TOTAL** | **87** | **375.5** | **2050.0** | **100%** |

---

## 🎓 Use Cases

**Architects:**
- Verify design composition
- Present to clients
- Document projects

**Engineers:**
- Calculate material loads
- Track MEP quantities
- Verify specifications

**Contractors:**
- Generate preliminary estimates
- Plan procurement
- Schedule resources

**QS/Estimators:**
- Prepare BOQ
- Cost control
- Claims documentation

---

## 🚀 Ready to Use!

Your app is running at: **http://localhost:5173**

1. Load a model
2. Click "Analytics"
3. Explore the charts
4. Export to CSV

**That's it! 🎉**

---

## 📖 More Information

For detailed documentation, see:
- `ANALYTICS_GUIDE.md` - Comprehensive guide
- `FEATURES_SUMMARY.md` - All features
- `README.md` - Project overview

---

**Happy Analyzing! 📊✨**

