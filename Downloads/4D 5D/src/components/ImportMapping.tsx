import { useState, useRef, useEffect } from 'react'
import { Upload, X, Database, FileSpreadsheet, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ImportMappingProps {
  onClose: () => void
  onImport: (mappedData: any[]) => void
  viewer: any // Forge Viewer instance
}

interface ExcelRow {
  [key: string]: any
}

interface ViewerProperty {
  value: string
  label: string
  category?: string
}

function ImportMapping({ onClose, onImport, viewer }: ImportMappingProps) {
  const [excelData, setExcelData] = useState<ExcelRow[]>([])
  const [excelColumns, setExcelColumns] = useState<string[]>([])
  const [mappingField, setMappingField] = useState<string>('externalId') // Viewer property
  const [excelMappingColumn, setExcelMappingColumn] = useState<string>('') // Excel column
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null)
  const [loadingProperties, setLoadingProperties] = useState(true)
  const [viewerProperties, setViewerProperties] = useState<ViewerProperty[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extract all unique properties from the model
  useEffect(() => {
    const extractModelProperties = async () => {
      if (!viewer || !viewer.model) {
        setLoadingProperties(false)
        return
      }

      setLoadingProperties(true)
      
      try {
        const model = viewer.model
        const instanceTree = model.getInstanceTree()
        
        if (!instanceTree) {
          setLoadingProperties(false)
          return
        }

        // Start with basic properties
        const propertyMap = new Map<string, ViewerProperty>()
        
        // Add built-in properties
        propertyMap.set('externalId', { value: 'externalId', label: 'External ID (Revit GUID)', category: 'Built-in' })
        propertyMap.set('name', { value: 'name', label: 'Element Name', category: 'Built-in' })
        propertyMap.set('dbId', { value: 'dbId', label: 'Database ID', category: 'Built-in' })

        // Sample 100 random elements to find all property names
        const rootId = instanceTree.getRootId()
        const allDbIds: number[] = []
        
        const traverse = (nodeId: number) => {
          allDbIds.push(nodeId)
          instanceTree.enumNodeChildren(nodeId, (childId: number) => {
            traverse(childId)
          })
        }
        
        traverse(rootId)
        
        // Sample elements (take every Nth element for performance)
        const sampleSize = Math.min(100, allDbIds.length)
        const step = Math.max(1, Math.floor(allDbIds.length / sampleSize))
        const sampleIds = []
        for (let i = 0; i < allDbIds.length; i += step) {
          sampleIds.push(allDbIds[i])
          if (sampleIds.length >= sampleSize) break
        }

        console.log(`Scanning ${sampleIds.length} elements to discover all properties...`)

        // Get properties from sampled elements
        for (const dbId of sampleIds) {
          await new Promise<void>((resolve) => {
            model.getBulkProperties2([dbId], {}, (results: any[]) => {
              if (results && results.length > 0) {
                const result = results[0]
                
                // Add category if not already added
                if (result.properties) {
                  result.properties.forEach((prop: any) => {
                    const propName = prop.attributeName || prop.displayName
                    const propCategory = prop.displayCategory || 'Properties'
                    
                    if (propName && !propertyMap.has(propName)) {
                      propertyMap.set(propName, {
                        value: propName,
                        label: `${propName}`,
                        category: propCategory
                      })
                    }
                  })
                }
              }
              resolve()
            }, (error: any) => {
              console.error('Error getting properties:', error)
              resolve()
            })
          })
        }

        // Convert to sorted array
        const propertiesArray = Array.from(propertyMap.values())
        
        // Sort: Built-in first, then alphabetically by category and name
        propertiesArray.sort((a, b) => {
          if (a.category === 'Built-in' && b.category !== 'Built-in') return -1
          if (a.category !== 'Built-in' && b.category === 'Built-in') return 1
          if (a.category !== b.category) return (a.category || '').localeCompare(b.category || '')
          return a.label.localeCompare(b.label)
        })

        console.log(`Found ${propertiesArray.length} unique properties`)
        setViewerProperties(propertiesArray)
        
      } catch (error) {
        console.error('Error extracting model properties:', error)
        // Fallback to basic properties
        setViewerProperties([
          { value: 'externalId', label: 'External ID (Revit GUID)', category: 'Built-in' },
          { value: 'name', label: 'Element Name', category: 'Built-in' },
          { value: 'dbId', label: 'Database ID', category: 'Built-in' }
        ])
      }
      
      setLoadingProperties(false)
    }

    extractModelProperties()
  }, [viewer])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      parseCSV(text)
    }

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      alert('Excel files (.xlsx) detected.\n\nPlease save your Excel file as CSV format:\n1. Open in Excel\n2. File > Save As\n3. Choose "CSV (Comma delimited)"')
    } else {
      alert('Please upload a CSV file')
    }
  }

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) {
      alert('Empty file')
      return
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''))
    setExcelColumns(headers)

    // Parse data rows
    const data: ExcelRow[] = []
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i])
      if (values.length === headers.length) {
        const row: ExcelRow = {}
        headers.forEach((header, index) => {
          row[header] = values[index]
        })
        data.push(row)
      }
    }

    setExcelData(data)
    console.log('Parsed CSV data:', data)
    console.log('Columns:', headers)

    // Auto-select first column if it looks like an ID
    const idColumn = headers.find(h => 
      h.toLowerCase().includes('id') || 
      h.toLowerCase().includes('wbs') ||
      h.toLowerCase().includes('guid')
    )
    if (idColumn) {
      setExcelMappingColumn(idColumn)
    }
  }

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^["']|["']$/g, ''))
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current.trim().replace(/^["']|["']$/g, ''))
    return result
  }

  const handleImport = () => {
    if (!excelMappingColumn) {
      alert('Please select which Excel column to use for mapping')
      return
    }

    if (excelData.length === 0) {
      alert('Please upload a CSV file first')
      return
    }

    setImporting(true)

    console.log('=== STARTING CSV IMPORT MAPPING ===')
    console.log('Available columns:', excelColumns)
    console.log('Sample row:', excelData[0])

    // Helper function to get value from row with flexible column matching
    const getRowValue = (row: ExcelRow, ...columnNames: string[]): string => {
      for (const colName of columnNames) {
        // Try exact match first
        if (row[colName]) return String(row[colName]).trim()
        
        // Try case-insensitive match
        const key = Object.keys(row).find(k => k.toLowerCase() === colName.toLowerCase())
        if (key && row[key]) return String(row[key]).trim()
      }
      return ''
    }

    // Prepare mapped data
    const mappedData = excelData.map((row, index) => {
      const startDate = getRowValue(row, 'Start Date', 'Scheduled Start', 'Scheduled Start Date', 'StartDate')
      const endDate = getRowValue(row, 'End Date', 'Scheduled End', 'Scheduled End Date', 'EndDate')
      const actualStart = getRowValue(row, 'Actual Start', 'Actual Start Date', 'ActualStart')
      const actualEnd = getRowValue(row, 'Actual End', 'Actual End Date', 'ActualEnd')
      
      const props = {
        elementId: getRowValue(row, excelMappingColumn) || '',
        elementName: getRowValue(row, 'Element Name', 'Name', 'ElementName') || '',
        scheduledStartDate: startDate,
        scheduledEndDate: endDate,
        actualStartDate: actualStart,
        actualEndDate: actualEnd,
        status: mapStatus(getRowValue(row, 'Status') || 'not-started'),
        progress: parseInt(getRowValue(row, 'Progress', '% Complete', 'Percent Complete') || '0'),
        phase: getRowValue(row, 'Phase', 'Construction Phase') || '',
        discipline: getRowValue(row, 'Discipline', 'Trade') || '',
        contractor: getRowValue(row, 'Contractor', 'Responsible', 'Company') || '',
        notes: getRowValue(row, 'Notes', 'Description', 'Comments') || ''
      }

      // Log first row to verify date extraction
      if (index === 0) {
        console.log('Sample element properties:')
        console.log('  Element Name:', props.elementName)
        console.log('  Start Date:', props.scheduledStartDate)
        console.log('  End Date:', props.scheduledEndDate)
        console.log('  Actual Start:', props.actualStartDate)
        console.log('  Actual End:', props.actualEndDate)
        console.log('  Status:', props.status)
        console.log('  Progress:', props.progress)
        console.log('  Phase:', props.phase)
      }

      return {
        mappingValue: getRowValue(row, excelMappingColumn),
        mappingField: mappingField,
        properties: props
      }
    })

    console.log(`Prepared ${mappedData.length} elements for import`)
    console.log('=== CSV IMPORT MAPPING COMPLETE ===\n')

    // Call parent import handler
    onImport(mappedData)

    setImportResult({ success: mappedData.length, failed: 0 })
    setImporting(false)
  }

  const mapStatus = (status: string): 'not-started' | 'in-progress' | 'completed' | 'delayed' => {
    const s = status.toLowerCase()
    if (s.includes('complete') || s.includes('done') || s.includes('finish')) return 'completed'
    if (s.includes('progress') || s.includes('active') || s.includes('ongoing')) return 'in-progress'
    if (s.includes('delay') || s.includes('late') || s.includes('behind')) return 'delayed'
    return 'not-started'
  }

  const clearFile = () => {
    setExcelData([])
    setExcelColumns([])
    setExcelMappingColumn('')
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-autodesk-black text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-6 h-6 text-hello-yellow" />
              <div>
                <h2 className="text-xl font-bold">Import Schedule from Excel</h2>
                <p className="text-sm text-autodesk-gray-300">Map CSV data to model elements</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-autodesk-gray-700 rounded transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 1: Upload File */}
          <div className="bg-autodesk-gray-50 border-2 border-autodesk-gray-300 rounded-lg p-6">
            <h3 className="text-lg font-bold text-autodesk-black mb-4 flex items-center gap-2">
              <span className="bg-autodesk-blue text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              Upload CSV File
            </h3>
            
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              
              <label
                htmlFor="csv-upload"
                className="flex flex-col items-center justify-center border-2 border-dashed border-autodesk-gray-400 rounded-lg p-8 cursor-pointer hover:border-autodesk-blue hover:bg-autodesk-blue/5 transition-all"
              >
                <Upload className="w-12 h-12 text-autodesk-gray-400 mb-3" />
                <span className="text-lg font-semibold text-autodesk-black mb-1">
                  Click to upload CSV file
                </span>
                <span className="text-sm text-autodesk-gray-600">
                  or drag and drop your file here
                </span>
              </label>

              {excelData.length > 0 && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">File uploaded successfully!</p>
                        <p className="text-sm text-green-700">
                          {excelData.length} rows, {excelColumns.length} columns
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={clearFile}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Configure Mapping */}
          {excelData.length > 0 && (
            <div className="bg-autodesk-gray-50 border-2 border-autodesk-teal rounded-lg p-6">
              <h3 className="text-lg font-bold text-autodesk-black mb-4 flex items-center gap-2">
                <span className="bg-autodesk-teal text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                Configure Element Mapping
              </h3>

              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-autodesk-gray-700 mb-4">
                  Tell us how to match Excel rows to model elements. We'll use these two fields to find the correct element:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Dropdown 1: Viewer Property */}
                  <div>
                    <label className="block text-sm font-semibold text-autodesk-black mb-2">
                      Dropdown 1: Viewer Element Property
                    </label>
                    {loadingProperties ? (
                      <div className="w-full px-3 py-3 border-2 border-autodesk-blue rounded bg-autodesk-gray-50 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-autodesk-blue" />
                        <span className="text-autodesk-gray-600">Loading model properties...</span>
                      </div>
                    ) : (
                      <select
                        value={mappingField}
                        onChange={(e) => setMappingField(e.target.value)}
                        className="w-full px-3 py-3 border-2 border-autodesk-blue rounded font-semibold text-autodesk-black focus:outline-none focus:ring-2 focus:ring-autodesk-blue"
                      >
                        {viewerProperties.map((prop) => (
                          <option key={prop.value} value={prop.value}>
                            {prop.category && prop.category !== 'Built-in' ? `[${prop.category}] ${prop.label}` : prop.label}
                          </option>
                        ))}
                      </select>
                    )}
                    <p className="text-xs text-autodesk-gray-600 mt-1">
                      {loadingProperties 
                        ? 'Scanning model to discover all available properties...'
                        : `${viewerProperties.length} properties available from the 3D model`
                      }
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <ArrowRight className="w-8 h-8 text-autodesk-teal" />
                  </div>

                  {/* Dropdown 2: Excel Column */}
                  <div>
                    <label className="block text-sm font-semibold text-autodesk-black mb-2">
                      Dropdown 2: Excel Column to Match
                    </label>
                    <select
                      value={excelMappingColumn}
                      onChange={(e) => setExcelMappingColumn(e.target.value)}
                      className="w-full px-3 py-3 border-2 border-autodesk-teal rounded font-semibold text-autodesk-black focus:outline-none focus:ring-2 focus:ring-autodesk-teal"
                    >
                      <option value="">Select column...</option>
                      {excelColumns.map(col => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-autodesk-gray-600 mt-1">
                      Column from your CSV file
                    </p>
                  </div>
                </div>

                {mappingField && excelMappingColumn && (
                  <div className="mt-4 bg-autodesk-teal/10 border-2 border-autodesk-teal rounded-lg p-3">
                    <p className="text-sm font-semibold text-autodesk-black">
                      Mapping Rule:
                    </p>
                    <p className="text-sm text-autodesk-gray-800 mt-1">
                      Match element's <span className="font-bold text-autodesk-blue">{viewerProperties.find(p => p.value === mappingField)?.label}</span>
                      {' '}with Excel column <span className="font-bold text-autodesk-teal">"{excelMappingColumn}"</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Preview & Import */}
          {excelData.length > 0 && excelMappingColumn && (
            <div className="bg-autodesk-gray-50 border-2 border-hello-yellow rounded-lg p-6">
              <h3 className="text-lg font-bold text-autodesk-black mb-4 flex items-center gap-2">
                <span className="bg-hello-yellow text-autodesk-black w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                Preview & Import
              </h3>

              {/* Data Preview */}
              <div className="bg-white rounded-lg p-4 mb-4 overflow-x-auto">
                <h4 className="text-sm font-semibold text-autodesk-black mb-3">Data Preview (First 5 rows)</h4>
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-autodesk-gray-100">
                      <th className="border border-autodesk-gray-300 px-3 py-2 text-left">Row</th>
                      {excelColumns.slice(0, 6).map((col, idx) => (
                        <th 
                          key={idx} 
                          className={`border border-autodesk-gray-300 px-3 py-2 text-left ${
                            col === excelMappingColumn ? 'bg-autodesk-teal text-white' : ''
                          }`}
                        >
                          {col}
                        </th>
                      ))}
                      {excelColumns.length > 6 && (
                        <th className="border border-autodesk-gray-300 px-3 py-2 text-left text-autodesk-gray-500">
                          +{excelColumns.length - 6} more...
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-autodesk-gray-50">
                        <td className="border border-autodesk-gray-300 px-3 py-2 font-semibold">{idx + 1}</td>
                        {excelColumns.slice(0, 6).map((col, colIdx) => (
                          <td 
                            key={colIdx} 
                            className={`border border-autodesk-gray-300 px-3 py-2 ${
                              col === excelMappingColumn ? 'bg-autodesk-teal/10 font-semibold' : ''
                            }`}
                          >
                            {row[col] || '-'}
                          </td>
                        ))}
                        {excelColumns.length > 6 && (
                          <td className="border border-autodesk-gray-300 px-3 py-2 text-autodesk-gray-400">
                            ...
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {excelData.length > 5 && (
                  <p className="text-xs text-autodesk-gray-600 mt-2">
                    ... and {excelData.length - 5} more rows
                  </p>
                )}
              </div>

              {/* Import Result */}
              {importResult && (
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Import Successful!</p>
                      <p className="text-sm text-green-700">
                        Successfully prepared {importResult.success} element mappings
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Import Button */}
              <button
                onClick={handleImport}
                disabled={importing || !excelMappingColumn}
                className="w-full px-6 py-4 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                <Database className="w-6 h-6" />
                {importing ? 'Importing...' : `Import ${excelData.length} Element Mappings`}
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-autodesk-blue/10 border-2 border-autodesk-blue rounded-lg p-4">
            <h4 className="text-sm font-bold text-autodesk-black mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              CSV File Requirements
            </h4>
            <ul className="text-sm text-autodesk-gray-700 space-y-1 ml-6 list-disc">
              <li><strong>Required columns</strong>: At least one unique ID column (WBS ID, External ID, Element Name, etc.)</li>
              <li><strong>Optional columns</strong>: Start Date, End Date, Status, Progress, Phase, Discipline, Contractor, Notes</li>
              <li><strong>Date format</strong>: YYYY-MM-DD (e.g., 2025-10-15)</li>
              <li><strong>Status values</strong>: Not Started, In Progress, Completed, Delayed</li>
              <li><strong>Progress</strong>: Number from 0 to 100</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-autodesk-gray-100 p-4 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-autodesk-gray-300 hover:bg-autodesk-gray-400 text-autodesk-black font-semibold rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImportMapping

