import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Save, Download, Eye, EyeOff, Maximize2, CheckSquare, Trash2, Clock, Plus, Minus } from 'lucide-react';

interface SearchCriteria {
  id: string;
  type: 'text' | 'category' | 'level' | 'parameter' | 'family';
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
  value: string | number;
  value2?: string | number; // For 'between' operator
  caseSensitive?: boolean;
}

interface SearchPreset {
  id: string;
  name: string;
  criteria: SearchCriteria[];
  timestamp: string;
}

interface SearchResult {
  dbId: number;
  name: string;
  category: string;
  level?: string;
  family?: string;
  type?: string;
  properties: { [key: string]: any };
}

interface ElementSearchProps {
  viewer: any;
  onClose: () => void;
}

const ElementSearch: React.FC<ElementSearchProps> = ({ viewer, onClose }) => {
  const [criteria, setCriteria] = useState<SearchCriteria[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedResults, setSelectedResults] = useState<Set<number>>(new Set());
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);
  const [availableParameters, setAvailableParameters] = useState<string[]>([]);
  const [presets, setPresets] = useState<SearchPreset[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchPreset[]>([]);
  const [showPresets, setShowPresets] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [logicMode, setLogicMode] = useState<'AND' | 'OR'>('AND');

  // Load model data on mount
  useEffect(() => {
    if (!viewer) {
      console.log('Viewer not ready yet');
      return;
    }
    
    // Wait for viewer to be fully loaded
    if (!viewer.model) {
      console.log('Viewer model not ready yet');
      return;
    }
    
    console.log('Viewer ready, loading model data...');
    loadModelData();
    loadPresetsFromStorage();
    loadHistoryFromStorage();
  }, [viewer]);

  const loadModelData = async () => {
    try {
      const model = viewer.model;
      if (!model) {
        console.error('Model not available');
        return;
      }

      const instanceTree = model.getInstanceTree();
      if (!instanceTree) {
        console.error('Instance tree not available');
        return;
      }

      console.log('Loading model parameters...');

      const categories = new Set<string>();
      const levels = new Set<string>();
      const parameters = new Set<string>();

      // Get root node
      const rootId = instanceTree.getRootId();
      
      // Get all leaf nodes (actual elements)
      const allDbIds: number[] = [];
      const getAllLeafNodes = (dbId: number) => {
        if (instanceTree.getChildCount(dbId) === 0) {
          allDbIds.push(dbId);
        }
        instanceTree.enumNodeChildren(dbId, (childId: number) => {
          getAllLeafNodes(childId);
        });
      };
      getAllLeafNodes(rootId);

      console.log(`Found ${allDbIds.length} elements, loading properties...`);

      if (allDbIds.length === 0) {
        console.warn('No elements found in model');
        return;
      }

      // Use getBulkProperties2 to get ALL properties from a sample of elements
      const sampleSize = Math.min(100, allDbIds.length); // Sample first 100 elements
      const sampleIds = allDbIds.slice(0, sampleSize);

      model.getBulkProperties2(
        sampleIds,
        { propFilter: [] }, // Empty filter = get ALL properties
        (elements: any[]) => {
          console.log(`Processing ${elements.length} elements for properties...`);
          
          elements.forEach((element: any) => {
            if (element.properties) {
              element.properties.forEach((prop: any) => {
                // Add all property names
                if (prop.displayName) {
                  parameters.add(prop.displayName);
                }
                
                // Collect categories
                if (prop.displayName === 'Category' && prop.displayValue) {
                  categories.add(prop.displayValue);
                }
                
                // Collect levels
                if ((prop.displayName === 'Level' || prop.displayName === 'Reference Level') && prop.displayValue) {
                  levels.add(prop.displayValue);
                }
              });
            }
          });

          const sortedParams = Array.from(parameters).sort();
          const sortedCategories = Array.from(categories).sort();
          const sortedLevels = Array.from(levels).sort();

          console.log(`✓ Loaded ${sortedParams.length} unique parameters`);
          console.log(`✓ Loaded ${sortedCategories.length} categories`);
          console.log(`✓ Loaded ${sortedLevels.length} levels`);

          setAvailableParameters(sortedParams);
          setAvailableCategories(sortedCategories);
          setAvailableLevels(sortedLevels);
        },
        (error: any) => {
          console.error('Error loading model data:', error);
          alert('Failed to load model parameters. Please try refreshing the page.');
        }
      );
    } catch (error) {
      console.error('Error in loadModelData:', error);
    }
  };

  const loadPresetsFromStorage = () => {
    const saved = localStorage.getItem('elementSearchPresets');
    if (saved) {
      setPresets(JSON.parse(saved));
    }
  };

  const loadHistoryFromStorage = () => {
    const saved = localStorage.getItem('elementSearchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  };

  const savePresetsToStorage = (newPresets: SearchPreset[]) => {
    localStorage.setItem('elementSearchPresets', JSON.stringify(newPresets));
  };

  const saveHistoryToStorage = (newHistory: SearchPreset[]) => {
    localStorage.setItem('elementSearchHistory', JSON.stringify(newHistory));
  };

  const addCriteria = () => {
    const newCriteria: SearchCriteria = {
      id: Date.now().toString(),
      type: 'text',
      field: 'name',
      operator: 'contains',
      value: '',
      caseSensitive: false
    };
    setCriteria([...criteria, newCriteria]);
  };

  const removeCriteria = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const updateCriteria = (id: string, updates: Partial<SearchCriteria>) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const performSearch = async () => {
    if (criteria.length === 0) {
      alert('Please add at least one search criteria');
      return;
    }

    setSearching(true);
    setResults([]);

    try {
      const model = viewer.model;
      const instanceTree = model.getInstanceTree();
      if (!instanceTree) {
        alert('Model not ready');
        setSearching(false);
        return;
      }

      const foundResults: SearchResult[] = [];
      const rootId = instanceTree.getRootId();

      // Get all leaf nodes
      const allDbIds: number[] = [];
      const getAllLeafNodes = (dbId: number) => {
        if (instanceTree.getChildCount(dbId) === 0) {
          allDbIds.push(dbId);
        }
        instanceTree.enumNodeChildren(dbId, (childId: number) => {
          getAllLeafNodes(childId);
        });
      };
      getAllLeafNodes(rootId);

      console.log(`Searching ${allDbIds.length} elements...`);

      // Get properties for all elements
      model.getBulkProperties2(
        allDbIds,
        { propFilter: availableParameters },
        (elements: any[]) => {
          elements.forEach((element: any) => {
            // Build property map
            const propMap: { [key: string]: any } = {};
            if (element.properties) {
              element.properties.forEach((prop: any) => {
                propMap[prop.displayName] = prop.displayValue;
              });
            }

            // Check if element matches criteria
            const matches = criteria.map(criterion => {
              return matchesCriterion(element, propMap, criterion);
            });

            // Apply logic mode (AND/OR)
            const elementMatches = logicMode === 'AND' 
              ? matches.every(m => m)
              : matches.some(m => m);

            if (elementMatches) {
              foundResults.push({
                dbId: element.dbId,
                name: element.name || 'Unnamed',
                category: propMap['Category'] || 'Unknown',
                level: propMap['Level'] || propMap['Reference Level'],
                family: propMap['Family'] || propMap['Type Name'],
                type: propMap['Type'],
                properties: propMap
              });
            }
          });

          setResults(foundResults);
          setSearching(false);

          // Add to search history
          addToHistory();

          // Highlight all found elements in the viewer
          highlightResults(foundResults);

          console.log(`Found ${foundResults.length} matching elements`);
        },
        (error: any) => {
          console.error('Search error:', error);
          setSearching(false);
          alert('Search failed. Please try again.');
        }
      );
    } catch (error) {
      console.error('Search error:', error);
      setSearching(false);
      alert('Search failed. Please try again.');
    }
  };

  const matchesCriterion = (element: any, propMap: { [key: string]: any }, criterion: SearchCriteria): boolean => {
    let targetValue: any = '';

    // Get target value based on criterion type
    switch (criterion.type) {
      case 'text':
        targetValue = element.name || '';
        break;
      case 'category':
        targetValue = propMap['Category'] || '';
        break;
      case 'level':
        targetValue = propMap['Level'] || propMap['Reference Level'] || '';
        break;
      case 'family':
        targetValue = propMap['Family'] || propMap['Type Name'] || '';
        break;
      case 'parameter':
        targetValue = propMap[criterion.field] || '';
        break;
    }

    // Convert to string for comparison
    const targetStr = String(targetValue);
    const searchValue = String(criterion.value);

    // Apply case sensitivity
    const compareTarget = criterion.caseSensitive ? targetStr : targetStr.toLowerCase();
    const compareSearch = criterion.caseSensitive ? searchValue : searchValue.toLowerCase();

    // Apply operator
    switch (criterion.operator) {
      case 'equals':
        return compareTarget === compareSearch;
      case 'contains':
        return compareTarget.includes(compareSearch);
      case 'startsWith':
        return compareTarget.startsWith(compareSearch);
      case 'endsWith':
        return compareTarget.endsWith(compareSearch);
      case 'greaterThan':
        return parseFloat(targetStr) > parseFloat(searchValue);
      case 'lessThan':
        return parseFloat(targetStr) < parseFloat(searchValue);
      case 'between':
        if (criterion.value2) {
          const val = parseFloat(targetStr);
          return val >= parseFloat(searchValue) && val <= parseFloat(String(criterion.value2));
        }
        return false;
      default:
        return false;
    }
  };

  const addToHistory = () => {
    const historyEntry: SearchPreset = {
      id: Date.now().toString(),
      name: `Search ${new Date().toLocaleString()}`,
      criteria: [...criteria],
      timestamp: new Date().toISOString()
    };
    const newHistory = [historyEntry, ...searchHistory].slice(0, 10); // Keep last 10
    setSearchHistory(newHistory);
    saveHistoryToStorage(newHistory);
  };

  const highlightResults = (foundResults: SearchResult[]) => {
    if (!viewer || foundResults.length === 0) return;

    // Clear any previous highlighting
    viewer.clearThemingColors();

    // Highlight color: Yellow/Orange for search results
    const highlightColor = new (window as any).THREE.Vector4(1.0, 0.84, 0.0, 1); // Gold/Yellow

    // Apply highlight to all found elements
    foundResults.forEach(result => {
      viewer.setThemingColor(result.dbId, highlightColor, null, true);
    });

    // Force viewer refresh
    viewer.impl.invalidate(true, true, true);

    console.log(`Highlighted ${foundResults.length} elements in viewer`);
  };

  const clearHighlighting = () => {
    if (!viewer) return;
    viewer.clearThemingColors();
    viewer.impl.invalidate(true, true, true);
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      alert('Please enter a preset name');
      return;
    }
    if (criteria.length === 0) {
      alert('Please add search criteria first');
      return;
    }

    const preset: SearchPreset = {
      id: Date.now().toString(),
      name: presetName,
      criteria: [...criteria],
      timestamp: new Date().toISOString()
    };

    const newPresets = [...presets, preset];
    setPresets(newPresets);
    savePresetsToStorage(newPresets);
    setPresetName('');
    alert(`Preset "${preset.name}" saved!`);
  };

  const loadPreset = (preset: SearchPreset) => {
    setCriteria([...preset.criteria]);
    setShowPresets(false);
  };

  const deletePreset = (id: string) => {
    const newPresets = presets.filter(p => p.id !== id);
    setPresets(newPresets);
    savePresetsToStorage(newPresets);
  };

  const handleIsolate = () => {
    if (results.length === 0) return;
    const dbIds = Array.from(selectedResults).length > 0 
      ? Array.from(selectedResults) 
      : results.map(r => r.dbId);
    viewer.isolate(dbIds);
    viewer.fitToView(dbIds);
  };

  const handleHide = () => {
    if (results.length === 0) return;
    const dbIds = Array.from(selectedResults).length > 0 
      ? Array.from(selectedResults) 
      : results.map(r => r.dbId);
    viewer.hide(dbIds);
  };

  const handleShowAll = () => {
    viewer.showAll();
    viewer.isolate([]);
    clearHighlighting();
  };

  const handleSelect = () => {
    if (results.length === 0) return;
    const dbIds = Array.from(selectedResults).length > 0 
      ? Array.from(selectedResults) 
      : results.map(r => r.dbId);
    viewer.select(dbIds);
  };

  const handleFitToView = () => {
    if (results.length === 0) return;
    const dbIds = Array.from(selectedResults).length > 0 
      ? Array.from(selectedResults) 
      : results.map(r => r.dbId);
    viewer.fitToView(dbIds);
  };

  const toggleResultSelection = (dbId: number) => {
    const newSelected = new Set(selectedResults);
    if (newSelected.has(dbId)) {
      newSelected.delete(dbId);
    } else {
      newSelected.add(dbId);
    }
    setSelectedResults(newSelected);
  };

  const selectAllResults = () => {
    setSelectedResults(new Set(results.map(r => r.dbId)));
  };

  const clearSelection = () => {
    setSelectedResults(new Set());
  };

  const exportResults = () => {
    if (results.length === 0) {
      alert('No results to export');
      return;
    }

    // Create CSV
    const headers = ['Name', 'Category', 'Level', 'Family', 'Type', ...Object.keys(results[0].properties)];
    const rows = results.map(r => {
      const row = [
        r.name,
        r.category,
        r.level || '',
        r.family || '',
        r.type || '',
        ...Object.values(r.properties)
      ];
      return row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `search-results-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Side Panel - No overlay, just the panel */}
      <div className="fixed left-0 top-0 h-full w-[600px] bg-autodesk-black border-r-2 border-autodesk-blue shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-autodesk-black to-gray-900 border-b-2 border-autodesk-blue p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Search className="w-6 h-6 text-autodesk-blue" />
            <div>
              <h2 className="text-xl font-bold text-white">Element Search</h2>
              <p className="text-xs text-autodesk-gray-300">
                Advanced filters & parameters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-autodesk-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-autodesk-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-bold text-white">Search Criteria</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPresets(!showPresets)}
                    className="px-2 py-1.5 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    Presets
                  </button>
                  <button
                    onClick={addCriteria}
                    className="px-2 py-1.5 bg-autodesk-blue hover:bg-blue-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Filter
                  </button>
                </div>
              </div>

              {/* Logic Mode */}
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs text-autodesk-gray-400">Logic:</span>
                <button
                  onClick={() => setLogicMode('AND')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                    logicMode === 'AND'
                      ? 'bg-autodesk-blue text-white'
                      : 'bg-autodesk-gray-700 text-autodesk-gray-300 hover:bg-autodesk-gray-600'
                  }`}
                >
                  AND
                </button>
                <button
                  onClick={() => setLogicMode('OR')}
                  className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
                    logicMode === 'OR'
                      ? 'bg-autodesk-blue text-white'
                      : 'bg-autodesk-gray-700 text-autodesk-gray-300 hover:bg-autodesk-gray-600'
                  }`}
                >
                  OR
                </button>
              </div>
            </div>

            {/* Presets Panel */}
            {showPresets && (
              <div className="p-4 border-b border-autodesk-gray-700 bg-autodesk-gray-900">
                <h4 className="text-sm font-semibold text-white mb-2">Saved Presets</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto mb-3">
                  {presets.length === 0 ? (
                    <p className="text-sm text-autodesk-gray-500">No saved presets</p>
                  ) : (
                    presets.map(preset => (
                      <div key={preset.id} className="flex items-center justify-between p-2 bg-autodesk-gray-800 rounded">
                        <button
                          onClick={() => loadPreset(preset)}
                          className="flex-1 text-left text-sm text-white hover:text-autodesk-blue"
                        >
                          {preset.name}
                        </button>
                        <button
                          onClick={() => deletePreset(preset.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                <h4 className="text-sm font-semibold text-white mb-2 mt-3">Recent Searches</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {searchHistory.length === 0 ? (
                    <p className="text-sm text-autodesk-gray-500">No search history</p>
                  ) : (
                    searchHistory.map(entry => (
                      <button
                        key={entry.id}
                        onClick={() => loadPreset(entry)}
                        className="w-full text-left p-2 bg-autodesk-gray-800 rounded text-sm text-white hover:bg-autodesk-gray-700"
                      >
                        {entry.name}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Criteria List */}
            <div className="flex-1 overflow-y-auto p-4">
              {criteria.length === 0 ? (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 text-autodesk-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-autodesk-gray-400">No filters added</p>
                  <p className="text-xs text-autodesk-gray-500 mt-1">Click "Add Filter"</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {criteria.map((criterion, index) => (
                    <div key={criterion.id} className="bg-autodesk-gray-800 p-3 rounded-lg border border-autodesk-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-autodesk-blue">Filter #{index + 1}</span>
                        <button
                          onClick={() => removeCriteria(criterion.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Type Selection */}
                      <div className="mb-2">
                        <label className="block text-xs text-autodesk-gray-400 mb-1">Search By</label>
                        <select
                          value={criterion.type}
                          onChange={(e) => updateCriteria(criterion.id, { type: e.target.value as any, field: 'name' })}
                          className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue"
                        >
                          <option value="text">Element Name</option>
                          <option value="category">Category</option>
                          <option value="level">Level</option>
                          <option value="family">Family/Type</option>
                          <option value="parameter">Parameter Value</option>
                        </select>
                      </div>

                      {/* Parameter Selection (if type is parameter) */}
                      {criterion.type === 'parameter' && (
                        <div className="mb-2">
                          <label className="block text-xs text-autodesk-gray-400 mb-1">
                            Parameter Name ({availableParameters.length} available)
                          </label>
                          <select
                            value={criterion.field}
                            onChange={(e) => updateCriteria(criterion.id, { field: e.target.value })}
                            className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue cursor-pointer"
                          >
                            {availableParameters.length === 0 ? (
                              <option value="">Loading parameters...</option>
                            ) : (
                              availableParameters.map(param => (
                                <option key={param} value={param}>{param}</option>
                              ))
                            )}
                          </select>
                        </div>
                      )}

                      {/* Operator Selection */}
                      <div className="mb-2">
                        <label className="block text-xs text-autodesk-gray-400 mb-1">Condition</label>
                        <select
                          value={criterion.operator}
                          onChange={(e) => updateCriteria(criterion.id, { operator: e.target.value as any })}
                          className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue cursor-pointer"
                        >
                          <option value="equals">Equals</option>
                          <option value="contains">Contains</option>
                          <option value="startsWith">Starts With</option>
                          <option value="endsWith">Ends With</option>
                          <option value="greaterThan">Greater Than</option>
                          <option value="lessThan">Less Than</option>
                          <option value="between">Between</option>
                        </select>
                      </div>

                      {/* Value Input */}
                      <div className="mb-2">
                        <label className="block text-xs text-autodesk-gray-400 mb-1">Value</label>
                        {criterion.type === 'category' ? (
                          <select
                            value={criterion.value}
                            onChange={(e) => updateCriteria(criterion.id, { value: e.target.value })}
                            className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue cursor-pointer hover:bg-autodesk-gray-600"
                          >
                            <option value="">Select category...</option>
                            {availableCategories.length === 0 ? (
                              <option value="" disabled>Loading categories...</option>
                            ) : (
                              availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                              ))
                            )}
                          </select>
                        ) : criterion.type === 'level' ? (
                          <select
                            value={criterion.value}
                            onChange={(e) => updateCriteria(criterion.id, { value: e.target.value })}
                            className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue cursor-pointer hover:bg-autodesk-gray-600"
                          >
                            <option value="">Select level...</option>
                            {availableLevels.length === 0 ? (
                              <option value="" disabled>Loading levels...</option>
                            ) : (
                              availableLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))
                            )}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={criterion.value}
                            onChange={(e) => updateCriteria(criterion.id, { value: e.target.value })}
                            placeholder="Enter value..."
                            className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue placeholder-autodesk-gray-500 hover:bg-autodesk-gray-600 cursor-text"
                            autoComplete="off"
                          />
                        )}
                      </div>

                      {/* Second Value (for between operator) */}
                      {criterion.operator === 'between' && (
                        <div className="mb-2">
                          <label className="block text-xs text-autodesk-gray-400 mb-1">To</label>
                          <input
                            type="text"
                            value={criterion.value2 || ''}
                            onChange={(e) => updateCriteria(criterion.id, { value2: e.target.value })}
                            placeholder="Enter second value..."
                            className="w-full px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-autodesk-blue placeholder-autodesk-gray-500 hover:bg-autodesk-gray-600 cursor-text"
                            autoComplete="off"
                          />
                        </div>
                      )}

                      {/* Case Sensitive Option */}
                      {(criterion.type === 'text' || criterion.type === 'parameter') && (
                        <label className="flex items-center gap-2 text-xs text-autodesk-gray-400">
                          <input
                            type="checkbox"
                            checked={criterion.caseSensitive}
                            onChange={(e) => updateCriteria(criterion.id, { caseSensitive: e.target.checked })}
                            className="rounded"
                          />
                          Case Sensitive
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Preset Section */}
            <div className="p-4 border-t border-autodesk-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  placeholder="Preset name..."
                  className="flex-1 px-2 py-1.5 bg-autodesk-gray-700 text-white border border-autodesk-gray-600 rounded text-xs"
                />
                <button
                  onClick={savePreset}
                  className="px-3 py-1.5 bg-autodesk-teal hover:bg-teal-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                >
                  <Save className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="p-4 border-t border-autodesk-gray-700 bg-autodesk-gray-900">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Results ({results.length})
                  </h3>
                  {selectedResults.size > 0 && (
                    <p className="text-xs text-autodesk-gray-400">{selectedResults.size} selected</p>
                  )}
                </div>
                {results.length > 0 && (
                  <button
                    onClick={exportResults}
                    className="px-2 py-1 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </button>
                )}
              </div>
              {/* Action Buttons */}
              {results.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={handleSelect}
                    className="px-2 py-1 bg-autodesk-blue hover:bg-blue-600 text-white rounded text-xs flex items-center gap-1"
                  >
                    <CheckSquare className="w-3 h-3" />
                    Select
                  </button>
                  <button
                    onClick={handleIsolate}
                    className="px-2 py-1 bg-autodesk-teal hover:bg-teal-600 text-white rounded text-xs flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Isolate
                  </button>
                  <button
                    onClick={handleHide}
                    className="px-2 py-1 bg-autodesk-orange hover:bg-orange-600 text-white rounded text-xs flex items-center gap-1"
                  >
                    <EyeOff className="w-3 h-3" />
                    Hide
                  </button>
                  <button
                    onClick={handleFitToView}
                    className="px-2 py-1 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black rounded text-xs flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    Fit
                  </button>
                  <button
                    onClick={handleShowAll}
                    className="px-2 py-1 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded text-xs"
                  >
                    Reset
                  </button>
                  <button
                    onClick={clearHighlighting}
                    className="px-2 py-1 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded text-xs"
                  >
                    Clear Highlight
                  </button>
                  <button
                    onClick={selectAllResults}
                    className="px-2 py-1 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded text-xs"
                  >
                    All
                  </button>
                  <button
                    onClick={clearSelection}
                    className="px-2 py-1 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 text-white rounded text-xs"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Search Button */}
            <div className="p-4 border-t border-autodesk-gray-700">
              <button
                onClick={performSearch}
                disabled={searching || criteria.length === 0}
                className={`w-full px-4 py-2.5 bg-autodesk-blue hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-sm ${
                  searching || criteria.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {searching ? 'Searching...' : `🔍 Search (${logicMode})`}
              </button>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-4 bg-autodesk-gray-900">
              {results.length === 0 ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-autodesk-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-autodesk-gray-400">No results yet</p>
                  <p className="text-xs text-autodesk-gray-500 mt-1">Add criteria and search</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.dbId}
                      className={`p-2 rounded border-2 cursor-pointer transition-all ${
                        selectedResults.has(result.dbId)
                          ? 'bg-autodesk-blue bg-opacity-20 border-autodesk-blue'
                          : 'bg-autodesk-gray-800 border-autodesk-gray-700 hover:border-autodesk-gray-600'
                      }`}
                      onClick={() => toggleResultSelection(result.dbId)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-white text-xs truncate">{result.name}</h4>
                          <div className="text-xs text-autodesk-gray-400 mt-0.5 flex flex-wrap gap-2">
                            <span className="truncate">📦 {result.category}</span>
                            {result.level && <span className="truncate">🏢 {result.level}</span>}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewer.select([result.dbId]);
                            viewer.fitToView([result.dbId]);
                          }}
                          className="ml-2 p-1.5 bg-autodesk-blue hover:bg-blue-600 rounded text-white flex-shrink-0"
                          title="Zoom to element"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>
      </div>
    </>
  );
};

export default ElementSearch;

