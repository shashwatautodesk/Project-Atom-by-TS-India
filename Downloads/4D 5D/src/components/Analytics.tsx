import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FileSpreadsheet, BarChart3, PieChart as PieChartIcon, Download, Filter, Search, X, Zap } from 'lucide-react';

interface CategoryData {
  name: string;
  count: number;
  volume: number;
  area: number;
  length: number;
  color: string;
}

interface AnalyticsProps {
  viewer: any;
  onClose: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ viewer, onClose }) => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [allCategoryData, setAllCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalArea, setTotalArea] = useState(0);
  const [activeChart, setActiveChart] = useState<'pie' | 'bar' | 'quantity'>('pie');
  
  // Filter states
  const [showMajorOnly, setShowMajorOnly] = useState(true);
  const [minElementCount, setMinElementCount] = useState(5);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'architecture' | 'structure' | 'mep'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);

  // Autodesk-inspired color palette
  const COLORS = [
    '#FFD700', // Hello Yellow
    '#0696D7', // Autodesk Blue
    '#00C9A7', // Autodesk Teal
    '#FF6B35', // Autodesk Orange
    '#9D4EDD', // Purple
    '#06A77D', // Green
    '#E63946', // Red
    '#457B9D', // Steel Blue
    '#F4A261', // Sandy
    '#2A9D8F', // Teal
    '#E76F51', // Coral
    '#264653', // Dark Blue
  ];

  useEffect(() => {
    if (viewer && viewer.model) {
      extractBOQData();
    }
  }, [viewer]);

  // Apply filters whenever filter settings change
  useEffect(() => {
    if (allCategoryData.length > 0) {
      applyFilters();
    }
  }, [allCategoryData, showMajorOnly, minElementCount, categoryFilter, searchQuery, selectedCategories]);

  // Helper function to check if a category is a major Revit category
  const isMajorCategory = (categoryName: string): boolean => {
    const excludePatterns = [  // Revit-specific internal categories
      /Sketch/i,
      /Detail/i,
      /Analytical/i,
      /Lines$/i,
      /^Imports/i,
      /^RVT/i,
      /Opening$/i,
      /^Survey/i,
      /^Specialty Equipment$/i,
      /^Space Type/i,
      /Grid/i,
      /^View/i,
      /^Sheet/i,
      /^Viewport/i,
      /^Note/i,
      /^Tag/i,
      /^Text/i,
      /^Dimension/i,
      /^Model Group/i,
      /^Annotation/i,
      /^Reference/i,
    ];

    return !excludePatterns.some(pattern => pattern.test(categoryName));
  };

  // Helper function to determine category discipline
  const getCategoryDiscipline = (categoryName: string): 'architecture' | 'structure' | 'mep' | 'other' => {
    const lowerName = categoryName.toLowerCase();
    
    // MEP categories
    if (lowerName.includes('pipe') || lowerName.includes('duct') || lowerName.includes('cable') ||
        lowerName.includes('conduit') || lowerName.includes('mechanical') || lowerName.includes('electrical') ||
        lowerName.includes('plumbing') || lowerName.includes('hvac') || lowerName.includes('lighting') ||
        lowerName.includes('sprinkler') || lowerName.includes('fire')) {
      return 'mep';
    }
    
    // Structural categories
    if (lowerName.includes('structural') || lowerName.includes('column') || lowerName.includes('beam') ||
        lowerName.includes('framing') || lowerName.includes('foundation') || lowerName.includes('truss') ||
        lowerName.includes('brace')) {
      return 'structure';
    }
    
    // Architectural categories
    if (lowerName.includes('wall') || lowerName.includes('floor') || lowerName.includes('roof') ||
        lowerName.includes('ceiling') || lowerName.includes('door') || lowerName.includes('window') ||
        lowerName.includes('stair') || lowerName.includes('railing') || lowerName.includes('room') ||
        lowerName.includes('curtain') || lowerName.includes('ramp') || lowerName.includes('furniture')) {
      return 'architecture';
    }
    
    return 'other';
  };

  // Apply all filters
  const applyFilters = () => {
    let filtered = [...allCategoryData];

    // Filter by selected specific categories (highest priority)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(cat => selectedCategories.includes(cat.name));
    } else {
      // Only apply other filters if no specific categories are selected
      
      // Filter by major categories only
      if (showMajorOnly) {
        filtered = filtered.filter(cat => isMajorCategory(cat.name));
      }

      // Filter by discipline
      if (categoryFilter !== 'all') {
        filtered = filtered.filter(cat => getCategoryDiscipline(cat.name) === categoryFilter);
      }
    }

    // Always apply these filters
    // Filter by minimum element count
    if (minElementCount > 0) {
      filtered = filtered.filter(cat => cat.count >= minElementCount);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cat => cat.name.toLowerCase().includes(query));
    }

    // Sort by count
    filtered.sort((a, b) => b.count - a.count);

    setCategoryData(filtered);
  };

  // Toggle category selection
  const toggleCategory = (categoryName: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryName) 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  // Quick filter presets
  const quickFilters = [
    { label: 'Walls', categories: ['Walls', 'Basic Wall', 'Curtain Wall', 'Stacked Wall'] },
    { label: 'Floors', categories: ['Floors', 'Floor'] },
    { label: 'Roofs', categories: ['Roofs', 'Roof'] },
    { label: 'Doors', categories: ['Doors', 'Door'] },
    { label: 'Windows', categories: ['Windows', 'Window'] },
    { label: 'Structural', categories: ['Structural Columns', 'Structural Framing', 'Structural Foundations'] },
  ];

  const applyQuickFilter = (categories: string[]) => {
    const matching = allCategoryData
      .filter(cat => categories.some(qc => cat.name.includes(qc)))
      .map(cat => cat.name);
    setSelectedCategories(matching);
  };

  const extractBOQData = () => {
    console.log('=== EXTRACTING BOQ DATA ===');
    setLoading(true);

    const model = viewer.model;
    const instanceTree = model.getData().instanceTree;
    
    if (!instanceTree) {
      console.error('No instance tree found');
      setLoading(false);
      return;
    }

    const categoryMap = new Map<string, CategoryData>();
    let elementCount = 0;

    // Get all leaf nodes (actual elements, not groups)
    instanceTree.enumNodeChildren(instanceTree.getRootId(), (dbId: number) => {
      // Check if it's a leaf node (actual element)
      if (instanceTree.getChildCount(dbId) === 0) {
        elementCount++;
      }
    }, true);

    console.log(`Total elements found: ${elementCount}`);

    // Get bulk properties for all elements
    model.getBulkProperties2(
      [],
      { propFilter: ['Category', 'Volume', 'Area', 'Length'], ignoreHidden: false },
      (results: any[]) => {
        console.log(`Processing ${results.length} elements for BOQ`);

        results.forEach((result) => {
          const category = result.properties.find((p: any) => p.displayName === 'Category')?.displayValue || 'Uncategorized';
          const volume = parseFloat(result.properties.find((p: any) => p.displayName === 'Volume')?.displayValue) || 0;
          const area = parseFloat(result.properties.find((p: any) => p.displayName === 'Area')?.displayValue) || 0;
          const length = parseFloat(result.properties.find((p: any) => p.displayName === 'Length')?.displayValue) || 0;

          if (!categoryMap.has(category)) {
            categoryMap.set(category, {
              name: category,
              count: 0,
              volume: 0,
              area: 0,
              length: 0,
              color: COLORS[categoryMap.size % COLORS.length],
            });
          }

          const categoryData = categoryMap.get(category)!;
          categoryData.count++;
          categoryData.volume += volume;
          categoryData.area += area;
          categoryData.length += length;
        });

        // Convert map to array and sort by count
        const dataArray = Array.from(categoryMap.values()).sort((a, b) => b.count - a.count);

        // Calculate totals
        const totalVol = dataArray.reduce((sum, cat) => sum + cat.volume, 0);
        const totalAr = dataArray.reduce((sum, cat) => sum + cat.area, 0);

        setAllCategoryData(dataArray); // Store all data
        setTotalElements(elementCount);
        setTotalVolume(totalVol);
        setTotalArea(totalAr);
        setLoading(false);

        console.log('=== BOQ DATA EXTRACTED ===');
        console.log('Categories:', dataArray.length);
        console.log('Total Elements:', elementCount);
        console.log('Total Volume:', totalVol.toFixed(2));
        console.log('Total Area:', totalAr.toFixed(2));
      },
      (error: any) => {
        console.error('Error extracting BOQ data:', error);
        setLoading(false);
      }
    );
  };

  const handleExportToCSV = () => {
    if (categoryData.length === 0) return;

    const headers = ['Category', 'Element Count', 'Volume', 'Area', 'Length'];
    const rows = categoryData.map((cat) => [
      cat.name,
      cat.count.toString(),
      cat.volume.toFixed(2),
      cat.area.toFixed(2),
      cat.length.toFixed(2),
    ]);

    // Add totals row
    rows.push([
      'TOTAL',
      totalElements.toString(),
      totalVolume.toFixed(2),
      totalArea.toFixed(2),
      categoryData.reduce((sum, cat) => sum + cat.length, 0).toFixed(2),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `BOQ_Summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('BOQ data exported to CSV');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-autodesk-black border border-hello-yellow p-3 rounded-lg shadow-lg">
          <p className="text-autodesk-white font-bold">{data.name}</p>
          <p className="text-hello-yellow">Count: {data.count}</p>
          {data.volume > 0 && <p className="text-autodesk-blue">Volume: {data.volume.toFixed(2)}</p>}
          {data.area > 0 && <p className="text-autodesk-teal">Area: {data.area.toFixed(2)}</p>}
          {data.length > 0 && <p className="text-autodesk-orange">Length: {data.length.toFixed(2)}</p>}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
        <div className="bg-autodesk-black border-2 border-hello-yellow p-8 rounded-lg text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-hello-yellow border-opacity-75 mx-auto mb-4"></div>
          <p className="text-autodesk-white text-xl">Analyzing Model...</p>
          <p className="text-autodesk-gray text-sm mt-2">Extracting BOQ Data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 overflow-auto">
      <div className="min-h-screen p-6">
        {/* Header */}
        <div className="bg-autodesk-black border-2 border-hello-yellow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="w-10 h-10 text-hello-yellow" />
              <div>
                <h2 className="text-3xl font-bold text-autodesk-white">BOQ Analytics</h2>
                <p className="text-autodesk-gray">Bill of Quantities Summary</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-autodesk-blue hover:bg-opacity-80 text-white rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-autodesk-gray hover:bg-opacity-80 text-white rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-autodesk-black border-2 border-autodesk-blue rounded-lg p-6">
            <p className="text-autodesk-gray text-sm mb-2">Total Elements</p>
            <p className="text-4xl font-bold text-autodesk-blue">{totalElements.toLocaleString()}</p>
          </div>
          <div className="bg-autodesk-black border-2 border-autodesk-teal rounded-lg p-6">
            <p className="text-autodesk-gray text-sm mb-2">Categories Shown</p>
            <p className="text-4xl font-bold text-autodesk-teal">{categoryData.length}</p>
            <p className="text-autodesk-gray text-xs mt-1">of {allCategoryData.length} total</p>
          </div>
          <div className="bg-autodesk-black border-2 border-hello-yellow rounded-lg p-6">
            <p className="text-autodesk-gray text-sm mb-2">Total Volume</p>
            <p className="text-4xl font-bold text-hello-yellow">{totalVolume.toFixed(2)}</p>
          </div>
          <div className="bg-autodesk-black border-2 border-autodesk-orange rounded-lg p-6">
            <p className="text-autodesk-gray text-sm mb-2">Total Area</p>
            <p className="text-4xl font-bold text-autodesk-orange">{totalArea.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-autodesk-black border-2 border-autodesk-gray rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-hello-yellow" />
            <h3 className="text-xl font-bold text-autodesk-white">Filters</h3>
            <button
              onClick={() => {
                setShowMajorOnly(true);
                setMinElementCount(5);
                setCategoryFilter('all');
                setSearchQuery('');
                setSelectedCategories([]);
                setShowCategorySelector(false);
              }}
              className="ml-auto text-sm text-autodesk-blue hover:text-hello-yellow transition-colors"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Major Categories Toggle */}
            <div>
              <label className="flex items-center gap-2 text-autodesk-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMajorOnly}
                  onChange={(e) => setShowMajorOnly(e.target.checked)}
                  className="w-5 h-5 rounded bg-autodesk-gray border-autodesk-gray text-hello-yellow focus:ring-hello-yellow"
                />
                <span className="text-sm">Major Categories Only</span>
              </label>
              <p className="text-xs text-autodesk-gray mt-1">Hide Revit internal categories</p>
            </div>

            {/* Minimum Element Count */}
            <div>
              <label className="block text-sm text-autodesk-white mb-2">
                Min. Elements: <span className="text-hello-yellow font-bold">{minElementCount}</span>
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={minElementCount}
                onChange={(e) => setMinElementCount(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-autodesk-gray mt-1">Show categories with ≥ {minElementCount} elements</p>
            </div>

            {/* Discipline Filter */}
            <div>
              <label className="block text-sm text-autodesk-white mb-2">Discipline</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-hello-yellow focus:ring-1 focus:ring-hello-yellow outline-none cursor-pointer"
              >
                <option value="all">All Disciplines</option>
                <option value="architecture">Architecture</option>
                <option value="structure">Structure</option>
                <option value="mep">MEP</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm text-autodesk-white mb-2">Search Categories</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-autodesk-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., Walls, Doors..."
                  className="w-full pl-10 pr-8 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:border-hello-yellow focus:ring-1 focus:ring-hello-yellow outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-hello-yellow"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mt-6 border-t border-autodesk-gray-700 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-autodesk-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-hello-yellow" />
                Quick Filters
              </h4>
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-xs text-autodesk-blue hover:text-hello-yellow transition-colors"
                >
                  Clear Selection ({selectedCategories.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {quickFilters.map((filter, index) => (
                <button
                  key={index}
                  onClick={() => applyQuickFilter(filter.categories)}
                  className="px-4 py-2 bg-gradient-to-r from-autodesk-blue to-autodesk-teal hover:from-hello-yellow hover:to-yellow-400 text-white hover:text-autodesk-black text-sm rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Category Selector Toggle */}
            <button
              onClick={() => setShowCategorySelector(!showCategorySelector)}
              className="flex items-center gap-2 text-sm text-autodesk-gray-300 hover:text-hello-yellow transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showCategorySelector ? 'Hide' : 'Show'} All Categories ({allCategoryData.length})
            </button>
          </div>

          {/* Category Selector */}
          {showCategorySelector && (
            <div className="mt-4 p-4 bg-autodesk-gray-800 rounded-lg border border-autodesk-gray-700 max-h-64 overflow-y-auto">
              <p className="text-xs text-autodesk-gray-400 mb-3">
                Select specific categories to display (overrides other filters):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allCategoryData.map((cat, index) => (
                  <label
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-autodesk-gray-700 rounded cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                      className="w-4 h-4 rounded bg-autodesk-gray-600 border-autodesk-gray-500 text-hello-yellow focus:ring-hello-yellow focus:ring-2"
                    />
                    <span className="text-xs text-autodesk-white truncate" title={cat.name}>
                      {cat.name} ({cat.count})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Active Filters Summary */}
          {(showMajorOnly || minElementCount > 0 || categoryFilter !== 'all' || searchQuery || selectedCategories.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-autodesk-gray">Active filters:</span>
              {showMajorOnly && (
                <span className="px-3 py-1 bg-autodesk-blue bg-opacity-20 text-autodesk-blue text-xs rounded-full border border-autodesk-blue">
                  Major Categories
                </span>
              )}
              {minElementCount > 0 && (
                <span className="px-3 py-1 bg-autodesk-teal bg-opacity-20 text-autodesk-teal text-xs rounded-full border border-autodesk-teal">
                  Min {minElementCount} elements
                </span>
              )}
              {categoryFilter !== 'all' && (
                <span className="px-3 py-1 bg-hello-yellow bg-opacity-20 text-hello-yellow text-xs rounded-full border border-hello-yellow">
                  {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </span>
              )}
              {searchQuery && (
                <span className="px-3 py-1 bg-autodesk-orange bg-opacity-20 text-autodesk-orange text-xs rounded-full border border-autodesk-orange">
                  Search: "{searchQuery}"
                </span>
              )}
              {selectedCategories.length > 0 && (
                <span className="px-3 py-1 bg-purple-500 bg-opacity-20 text-purple-400 text-xs rounded-full border border-purple-400">
                  {selectedCategories.length} {selectedCategories.length === 1 ? 'Category' : 'Categories'} Selected
                </span>
              )}
            </div>
          )}
        </div>

        {/* Chart Type Selector */}
        <div className="bg-autodesk-black border-2 border-autodesk-gray rounded-lg p-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveChart('pie')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeChart === 'pie'
                  ? 'bg-hello-yellow text-autodesk-black font-bold'
                  : 'bg-autodesk-gray text-white hover:bg-opacity-80'
              }`}
            >
              <PieChartIcon className="w-5 h-5" />
              Distribution
            </button>
            <button
              onClick={() => setActiveChart('bar')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeChart === 'bar'
                  ? 'bg-hello-yellow text-autodesk-black font-bold'
                  : 'bg-autodesk-gray text-white hover:bg-opacity-80'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Element Count
            </button>
            <button
              onClick={() => setActiveChart('quantity')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                activeChart === 'quantity'
                  ? 'bg-hello-yellow text-autodesk-black font-bold'
                  : 'bg-autodesk-gray text-white hover:bg-opacity-80'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Quantities
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="bg-autodesk-black border-2 border-autodesk-gray rounded-lg p-6 mb-6">
          {activeChart === 'pie' && (
            <div>
              <h3 className="text-2xl font-bold text-autodesk-white mb-4">Category Distribution</h3>
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Pie
                    data={categoryData as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.count}`}
                    outerRadius={180}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === 'bar' && (
            <div>
              <h3 className="text-2xl font-bold text-autodesk-white mb-4">Elements by Category</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={categoryData as any}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                  <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={150} />
                  <YAxis stroke="#fff" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#FFD700" name="Element Count">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeChart === 'quantity' && (
            <div>
              <h3 className="text-2xl font-bold text-autodesk-white mb-4">Quantities by Category</h3>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={categoryData as any}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#666" />
                  <XAxis dataKey="name" stroke="#fff" angle={-45} textAnchor="end" height={150} />
                  <YAxis stroke="#fff" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="volume" fill="#0696D7" name="Volume" />
                  <Bar dataKey="area" fill="#00C9A7" name="Area" />
                  <Bar dataKey="length" fill="#FF6B35" name="Length" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Detailed Table */}
        <div className="bg-autodesk-black border-2 border-autodesk-gray rounded-lg p-6">
          <h3 className="text-2xl font-bold text-autodesk-white mb-4">Detailed BOQ Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-hello-yellow">
                  <th className="px-4 py-3 text-hello-yellow font-bold">Category</th>
                  <th className="px-4 py-3 text-hello-yellow font-bold text-right">Count</th>
                  <th className="px-4 py-3 text-hello-yellow font-bold text-right">Volume</th>
                  <th className="px-4 py-3 text-hello-yellow font-bold text-right">Area</th>
                  <th className="px-4 py-3 text-hello-yellow font-bold text-right">Length</th>
                  <th className="px-4 py-3 text-hello-yellow font-bold text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {categoryData.map((cat, index) => (
                  <tr
                    key={index}
                    className="border-b border-autodesk-gray hover:bg-autodesk-gray hover:bg-opacity-20 transition-all"
                  >
                    <td className="px-4 py-3 text-autodesk-white font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: cat.color }}></div>
                        {cat.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-autodesk-white text-right">{cat.count.toLocaleString()}</td>
                    <td className="px-4 py-3 text-autodesk-blue text-right">{cat.volume.toFixed(2)}</td>
                    <td className="px-4 py-3 text-autodesk-teal text-right">{cat.area.toFixed(2)}</td>
                    <td className="px-4 py-3 text-autodesk-orange text-right">{cat.length.toFixed(2)}</td>
                    <td className="px-4 py-3 text-hello-yellow text-right font-bold">
                      {((cat.count / totalElements) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="border-t-2 border-hello-yellow bg-autodesk-gray bg-opacity-30">
                  <td className="px-4 py-3 text-hello-yellow font-bold">TOTAL</td>
                  <td className="px-4 py-3 text-hello-yellow font-bold text-right">{totalElements.toLocaleString()}</td>
                  <td className="px-4 py-3 text-hello-yellow font-bold text-right">{totalVolume.toFixed(2)}</td>
                  <td className="px-4 py-3 text-hello-yellow font-bold text-right">{totalArea.toFixed(2)}</td>
                  <td className="px-4 py-3 text-hello-yellow font-bold text-right">
                    {categoryData.reduce((sum, cat) => sum + cat.length, 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-hello-yellow font-bold text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

