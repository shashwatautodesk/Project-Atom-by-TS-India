# 📊 Analytics Guide - BOQ Summary

## Overview

The **Analytics** tab provides comprehensive Bill of Quantities (BOQ) analysis with interactive visualizations of your model. Get instant insights into element counts, quantities, and category distribution.

---

## 🚀 Quick Start

### Accessing Analytics

1. **Load a Model** in the 3D Viewer
2. **Click the "Analytics" button** (blue button with pie chart icon) in the top-right corner
3. **Explore the visualizations**:
   - Category distribution pie chart
   - Element count bar charts
   - Quantity analysis (volume, area, length)
   - Detailed BOQ table

---

## 📈 Available Visualizations

### 1. **Distribution Chart (Pie Chart)**

**What it shows:**
- Visual breakdown of elements by category
- Percentage distribution
- Color-coded categories

**Use cases:**
- Quick overview of model composition
- Identify dominant categories
- Presentation-ready visuals

**Interactive features:**
- Hover to see element counts and percentages
- Legend shows all categories

---

### 2. **Element Count Chart (Bar Chart)**

**What it shows:**
- Number of elements per category
- Sorted by count (highest to lowest)
- Color-coded bars matching distribution chart

**Use cases:**
- Identify categories with most elements
- Compare element counts across categories
- Quantity takeoff verification

**Interactive features:**
- Hover to see exact counts
- Rotated labels for readability

---

### 3. **Quantities Chart (Multi-Bar Chart)**

**What it shows:**
- **Volume** (cubic units) - Blue bars
- **Area** (square units) - Teal bars
- **Length** (linear units) - Orange bars

**Use cases:**
- Material quantity estimation
- Cost calculation support
- Construction planning

**Interactive features:**
- Hover to see all quantities for a category
- Compare volumes, areas, and lengths side-by-side

---

## 📊 Summary Dashboard

### Key Metrics

**Total Elements:**
- Count of all model elements
- Displayed in large blue card

**Categories:**
- Number of unique categories
- Displayed in teal card

**Total Volume:**
- Sum of all element volumes
- Displayed in yellow card

**Total Area:**
- Sum of all element areas
- Displayed in orange card

---

## 📋 Detailed BOQ Table

### Columns

| Column | Description |
|--------|-------------|
| **Category** | Element category name with color indicator |
| **Count** | Number of elements in this category |
| **Volume** | Total volume (cubic units) |
| **Area** | Total area (square units) |
| **Length** | Total length (linear units) |
| **%** | Percentage of total elements |

### Features

- **Color Indicators**: Each row has a color box matching the chart colors
- **Hover Effects**: Rows highlight on hover
- **Totals Row**: Bottom row shows aggregate totals (highlighted in yellow)
- **Sortable**: Automatically sorted by element count

---

## 💾 Export to CSV

### How to Export

1. Click the **"Export CSV"** button (top-right of Analytics screen)
2. File automatically downloads as `BOQ_Summary_YYYY-MM-DD.csv`
3. Open in Excel, Google Sheets, or any spreadsheet software

### CSV Contents

The exported CSV includes:
- Category names
- Element counts
- Volumes
- Areas
- Lengths
- **Totals row** at the bottom

### Use Cases

- Import into cost estimation software
- Share with project stakeholders
- Archive project quantities
- Integration with ERP systems

---

## 🎨 Chart Types Explained

### When to Use Each Chart

| Chart Type | Best For | Answers Questions Like |
|------------|----------|------------------------|
| **Pie Chart** | Overview & Composition | "What's the breakdown of my model?" |
| **Bar Chart - Count** | Element counting | "Which category has the most elements?" |
| **Bar Chart - Quantities** | Material estimation | "How much concrete do I need?" |
| **Table** | Detailed analysis | "Give me all the numbers" |

---

## 🔍 Reading the Data

### Understanding Quantities

**Volume:**
- Measured in cubic units (e.g., m³, ft³)
- Important for: Concrete, excavation, earthwork
- Example: Wall volume = 45.23 m³

**Area:**
- Measured in square units (e.g., m², ft²)
- Important for: Flooring, painting, cladding
- Example: Floor area = 1250.00 m²

**Length:**
- Measured in linear units (e.g., m, ft)
- Important for: Piping, cables, framing
- Example: Beam length = 156.75 m

**Note:** Units depend on your model's unit settings.

---

## 💡 Tips & Best Practices

### 1. **Run Analytics After Model Changes**
- Always refresh analytics after model updates
- Close and reopen Analytics to recalculate

### 2. **Compare Across Design Iterations**
- Export CSV for each design version
- Track changes in element counts and quantities

### 3. **Use for Clash Detection**
- Unexpected element counts may indicate modeling errors
- Compare with expected quantities from design documents

### 4. **Coordinate with Teams**
- Share CSV exports with quantity surveyors
- Use charts in client presentations
- Include in project documentation

### 5. **Verify Quantities**
- Cross-reference with manual calculations
- Check units (metric vs. imperial)
- Confirm with project specifications

---

## 🎯 Use Cases

### For Architects
- **Design Review**: Verify element distribution matches design intent
- **Presentations**: Use charts to explain design composition to clients
- **Documentation**: Export BOQ for project records

### For Engineers
- **Structural Analysis**: Calculate material volumes for load analysis
- **MEP Coordination**: Track piping/duct/cable lengths
- **Quantity Takeoff**: Generate preliminary material estimates

### For Contractors
- **Cost Estimation**: Use quantities for material pricing
- **Procurement**: Determine order quantities from BOQ
- **Project Planning**: Schedule work based on element counts

### For Quantity Surveyors
- **BOQ Preparation**: Extract quantities for detailed BOQ
- **Cost Control**: Monitor quantities against budget
- **Claims Management**: Document as-built quantities

---

## 🛠️ Troubleshooting

### No Data Showing

**Problem:** Analytics screen is blank or shows zero elements

**Solutions:**
1. Ensure model is fully loaded (wait for 3D view to appear)
2. Check that model has visible elements
3. Try closing and reopening Analytics
4. Refresh the page and reload the model

---

### Missing Quantities

**Problem:** Volume/Area/Length columns show 0.00

**Solutions:**
1. Not all elements have volume/area/length properties
2. Some categories (like groups/assemblies) don't have quantities
3. Check model properties to verify quantities exist
4. This is normal for annotation elements, views, etc.

---

### Categories Show as "Uncategorized"

**Problem:** Many elements grouped under "Uncategorized"

**Solutions:**
1. Elements may lack Category property in the model
2. This is common in imported models
3. Consider updating model metadata in authoring software
4. Elements are still counted correctly

---

### Export CSV Not Working

**Problem:** CSV file doesn't download

**Solutions:**
1. Check browser download settings
2. Ensure pop-ups are not blocked
3. Try a different browser
4. Check for browser console errors (F12)

---

## 🔄 Refresh Analytics

Analytics data is extracted when you first open the tab. To refresh:

1. **Close Analytics** (click "Close" button)
2. **Make changes** to model view/filters (if needed)
3. **Reopen Analytics** (click "Analytics" button)
4. Data is **automatically recalculated**

---

## 📐 Technical Details

### Data Extraction

- Uses `getBulkProperties2()` API for comprehensive property extraction
- Analyzes all leaf nodes (actual elements, not groups)
- Processes properties: Category, Volume, Area, Length
- Handles missing properties gracefully

### Performance

- **Small Models** (< 1000 elements): < 2 seconds
- **Medium Models** (1000-10000 elements): 2-10 seconds
- **Large Models** (> 10000 elements): 10-30 seconds

### Color Scheme

Uses Autodesk brand colors:
- **Hello Yellow** (#FFD700)
- **Autodesk Blue** (#0696D7)
- **Autodesk Teal** (#00C9A7)
- **Autodesk Orange** (#FF6B35)
- Plus additional accent colors for more categories

---

## 🎓 Learning Path

### Beginner
1. ✅ Open Analytics and explore the summary cards
2. ✅ View the pie chart to understand model composition
3. ✅ Export CSV and open in Excel

### Intermediate
4. ✅ Compare bar charts to identify quantity patterns
5. ✅ Use detailed table for specific category analysis
6. ✅ Export multiple CSV files for different models

### Advanced
7. ✅ Integrate CSV exports into estimation workflows
8. ✅ Create custom analyses from exported data
9. ✅ Compare quantities across design iterations

---

## 📞 Support

### Still Need Help?

1. **Check Browser Console** (F12 → Console) for errors
2. **Verify Model Properties** - Some models may lack quantity data
3. **Review Model Setup** - Ensure proper categorization in authoring software
4. **Try Sample Models** - Test with known-good models first

---

## 🆕 Future Enhancements

Planned features:
- Cost database integration for pricing
- Custom unit conversions
- Filter by category/discipline
- Comparison between models
- Historical quantity tracking
- Export to PDF report

---

## ✨ Summary

The Analytics tab provides:
- ✅ **3 Chart Types**: Pie, Bar (Count), Bar (Quantities)
- ✅ **4 Summary Metrics**: Elements, Categories, Volume, Area
- ✅ **1 Detailed Table**: Complete BOQ breakdown
- ✅ **CSV Export**: For further analysis
- ✅ **Modern UI**: Autodesk-branded, responsive design
- ✅ **Interactive**: Hover tooltips, chart switching

**Perfect for:** BOQ generation, quantity takeoff, project planning, cost estimation, and design analysis!

---

**Happy Analyzing! 📊✨**

