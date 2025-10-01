import { useState, useEffect, useMemo } from 'react'
import { X, ZoomIn, ZoomOut, Calendar, ChevronRight, ChevronDown } from 'lucide-react'
import { Element4DProperties } from '../types'

interface GanttChartProps {
  elements: Map<number, Element4DProperties>
  onClose: () => void
  onElementClick?: (elementId: string) => void
  currentDate?: Date
}

interface GanttRow {
  elementId: string
  elementName: string
  status: string
  progress: number
  scheduledStart?: Date
  scheduledEnd?: Date
  actualStart?: Date
  actualEnd?: Date
  phase?: string
  discipline?: string
}

function GanttChart({ elements, onClose, onElementClick, currentDate }: GanttChartProps) {
  const [zoomLevel, setZoomLevel] = useState<'day' | 'week' | 'month'>('week')
  const [groupBy, setGroupBy] = useState<'none' | 'phase' | 'discipline'>('phase')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  // Convert elements map to array
  const ganttRows = useMemo(() => {
    const rows: GanttRow[] = []
    elements.forEach((element) => {
      if (element.scheduledStartDate || element.scheduledEndDate) {
        rows.push({
          elementId: element.elementId,
          elementName: element.elementName || `Element ${element.elementId}`,
          status: element.status || 'not-started',
          progress: element.progress || 0,
          scheduledStart: element.scheduledStartDate ? new Date(element.scheduledStartDate) : undefined,
          scheduledEnd: element.scheduledEndDate ? new Date(element.scheduledEndDate) : undefined,
          actualStart: element.actualStartDate ? new Date(element.actualStartDate) : undefined,
          actualEnd: element.actualEndDate ? new Date(element.actualEndDate) : undefined,
          phase: element.phase,
          discipline: element.discipline
        })
      }
    })
    return rows.sort((a, b) => {
      const dateA = a.scheduledStart || a.actualStart || new Date()
      const dateB = b.scheduledStart || b.actualStart || new Date()
      return dateA.getTime() - dateB.getTime()
    })
  }, [elements])

  // Calculate timeline bounds
  const { minDate, maxDate, totalDays } = useMemo(() => {
    if (ganttRows.length === 0) {
      const now = new Date()
      return { minDate: now, maxDate: now, totalDays: 30 }
    }

    let min = new Date()
    let max = new Date()
    
    ganttRows.forEach(row => {
      const dates = [row.scheduledStart, row.scheduledEnd, row.actualStart, row.actualEnd].filter(d => d) as Date[]
      dates.forEach(date => {
        if (date < min || !min) min = date
        if (date > max || !max) max = date
      })
    })

    // Add padding
    min = new Date(min.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days before
    max = new Date(max.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days after

    const totalDays = Math.ceil((max.getTime() - min.getTime()) / (1000 * 60 * 60 * 24))
    
    return { minDate: min, maxDate: max, totalDays }
  }, [ganttRows])

  // Group rows
  const groupedRows = useMemo(() => {
    if (groupBy === 'none') {
      return { '': ganttRows }
    }

    const groups: { [key: string]: GanttRow[] } = {}
    ganttRows.forEach(row => {
      const groupKey = groupBy === 'phase' ? (row.phase || 'Unassigned') : (row.discipline || 'Unassigned')
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(row)
    })

    return groups
  }, [ganttRows, groupBy])

  useEffect(() => {
    // Auto-expand all groups initially
    if (groupBy !== 'none') {
      setExpandedGroups(new Set(Object.keys(groupedRows)))
    }
  }, [groupBy, groupedRows])

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName)
    } else {
      newExpanded.add(groupName)
    }
    setExpandedGroups(newExpanded)
  }

  const getDatePosition = (date: Date) => {
    const daysSinceStart = (date.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    return (daysSinceStart / totalDays) * 100
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-yellow-500'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Generate timeline headers
  const timelineHeaders = useMemo(() => {
    const headers: { label: string; position: number }[] = []
    const interval = zoomLevel === 'day' ? 1 : zoomLevel === 'week' ? 7 : 30
    
    let currentDate = new Date(minDate)
    while (currentDate <= maxDate) {
      const position = getDatePosition(currentDate)
      const label = zoomLevel === 'month' 
        ? currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      headers.push({ label, position })
      currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000)
    }
    
    return headers
  }, [minDate, maxDate, totalDays, zoomLevel])

  const currentDatePosition = currentDate ? getDatePosition(currentDate) : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-autodesk-black text-white p-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-hello-yellow" />
            <div>
              <h2 className="text-xl font-bold">Gantt Chart Timeline</h2>
              <p className="text-sm text-autodesk-gray-300">
                {ganttRows.length} scheduled elements · {formatDate(minDate)} to {formatDate(maxDate)}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-autodesk-gray-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Controls */}
        <div className="bg-autodesk-gray-100 p-4 border-b border-autodesk-gray-300 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-autodesk-black">Zoom:</span>
              <button
                onClick={() => setZoomLevel(prev => prev === 'month' ? 'week' : prev === 'week' ? 'day' : 'day')}
                className="p-2 bg-white border-2 border-autodesk-blue rounded hover:bg-autodesk-blue hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium text-autodesk-gray-700 min-w-[60px]">
                {zoomLevel === 'day' ? 'Daily' : zoomLevel === 'week' ? 'Weekly' : 'Monthly'}
              </span>
              <button
                onClick={() => setZoomLevel(prev => prev === 'day' ? 'week' : prev === 'week' ? 'month' : 'month')}
                className="p-2 bg-white border-2 border-autodesk-blue rounded hover:bg-autodesk-blue hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>

            {/* Group By */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-autodesk-black">Group by:</span>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="px-3 py-2 border-2 border-autodesk-teal rounded font-medium text-autodesk-black focus:outline-none focus:ring-2 focus:ring-autodesk-teal"
              >
                <option value="none">No Grouping</option>
                <option value="phase">Phase</option>
                <option value="discipline">Discipline</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-400 rounded"></div>
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Delayed</span>
            </div>
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="flex-1 overflow-auto">
          <div className="flex">
            {/* Left sidebar - Element names */}
            <div className="w-80 bg-autodesk-gray-50 border-r-2 border-autodesk-gray-300 flex-shrink-0">
              <div className="sticky top-0 bg-autodesk-black text-white p-3 font-bold text-sm border-b-2 border-hello-yellow z-10">
                Element Name
              </div>
              
              {Object.entries(groupedRows).map(([groupName, rows]) => (
                <div key={groupName}>
                  {groupBy !== 'none' && (
                    <div
                      onClick={() => toggleGroup(groupName)}
                      className="bg-autodesk-blue text-white p-2 cursor-pointer hover:bg-blue-600 transition-colors flex items-center gap-2 sticky top-10 z-10"
                    >
                      {expandedGroups.has(groupName) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                      <span className="font-semibold text-sm">{groupName} ({rows.length})</span>
                    </div>
                  )}
                  
                  {(groupBy === 'none' || expandedGroups.has(groupName)) && rows.map(row => (
                    <div
                      key={row.elementId}
                      onClick={() => onElementClick?.(row.elementId)}
                      className="p-2 border-b border-autodesk-gray-200 hover:bg-autodesk-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="text-sm font-medium text-autodesk-black truncate" title={row.elementName}>
                        {row.elementName}
                      </div>
                      <div className="text-xs text-autodesk-gray-600 flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(row.status)}`}></span>
                        <span>{row.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Right side - Timeline */}
            <div className="flex-1 relative bg-white overflow-x-auto">
              {/* Timeline header */}
              <div className="sticky top-0 bg-autodesk-gray-100 border-b-2 border-autodesk-gray-300 h-10 relative z-10">
                {timelineHeaders.map((header, idx) => (
                  <div
                    key={idx}
                    className="absolute text-xs font-semibold text-autodesk-black"
                    style={{ left: `${header.position}%`, transform: 'translateX(-50%)' }}
                  >
                    {header.label}
                  </div>
                ))}
              </div>

              {/* Current date indicator */}
              {currentDatePosition !== null && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-hello-yellow z-20 pointer-events-none"
                  style={{ left: `${currentDatePosition}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 bg-hello-yellow text-autodesk-black text-xs font-bold px-2 py-1 rounded whitespace-nowrap">
                    Today
                  </div>
                </div>
              )}

              {/* Timeline bars */}
              <div className="relative" style={{ minWidth: '800px' }}>
                {Object.entries(groupedRows).map(([groupName, rows]) => (
                  <div key={groupName}>
                    {groupBy !== 'none' && (
                      <div className="h-8 bg-autodesk-blue sticky left-0 z-10"></div>
                    )}
                    
                    {(groupBy === 'none' || expandedGroups.has(groupName)) && rows.map(row => (
                      <div key={row.elementId} className="h-12 border-b border-autodesk-gray-200 relative">
                        {/* Grid lines */}
                        {timelineHeaders.map((header, idx) => (
                          <div
                            key={idx}
                            className="absolute top-0 bottom-0 w-px bg-autodesk-gray-200"
                            style={{ left: `${header.position}%` }}
                          ></div>
                        ))}

                        {/* Scheduled bar */}
                        {row.scheduledStart && row.scheduledEnd && (
                          <div
                            className={`absolute top-2 h-3 ${getStatusColor(row.status)} opacity-30 rounded`}
                            style={{
                              left: `${getDatePosition(row.scheduledStart)}%`,
                              width: `${getDatePosition(row.scheduledEnd) - getDatePosition(row.scheduledStart)}%`
                            }}
                          ></div>
                        )}

                        {/* Actual bar with progress */}
                        {row.actualStart && (
                          <div
                            className={`absolute top-5 h-4 ${getStatusColor(row.status)} rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow group`}
                            style={{
                              left: `${getDatePosition(row.actualStart)}%`,
                              width: row.actualEnd 
                                ? `${getDatePosition(row.actualEnd) - getDatePosition(row.actualStart)}%`
                                : row.scheduledEnd
                                ? `${getDatePosition(row.scheduledEnd) - getDatePosition(row.actualStart)}%`
                                : '5%'
                            }}
                            title={`${row.elementName} - ${row.progress}% complete`}
                          >
                            {/* Progress indicator */}
                            <div
                              className="h-full bg-white bg-opacity-40 rounded-l"
                              style={{ width: `${row.progress}%` }}
                            ></div>
                            
                            {/* Tooltip on hover */}
                            <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-autodesk-black text-white text-xs p-2 rounded whitespace-nowrap shadow-lg z-30">
                              <div className="font-bold">{row.elementName}</div>
                              <div>Progress: {row.progress}%</div>
                              {row.scheduledStart && <div>Planned: {formatDate(row.scheduledStart)} - {row.scheduledEnd && formatDate(row.scheduledEnd)}</div>}
                              {row.actualStart && <div>Actual: {formatDate(row.actualStart)} {row.actualEnd && `- ${formatDate(row.actualEnd)}`}</div>}
                            </div>
                          </div>
                        )}

                        {/* If no actual start, show only scheduled */}
                        {!row.actualStart && row.scheduledStart && row.scheduledEnd && (
                          <div
                            className={`absolute top-5 h-4 ${getStatusColor(row.status)} rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow group`}
                            style={{
                              left: `${getDatePosition(row.scheduledStart)}%`,
                              width: `${getDatePosition(row.scheduledEnd) - getDatePosition(row.scheduledStart)}%`
                            }}
                            title={`${row.elementName} - Scheduled`}
                          >
                            <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 bg-autodesk-black text-white text-xs p-2 rounded whitespace-nowrap shadow-lg z-30">
                              <div className="font-bold">{row.elementName}</div>
                              <div>Status: {row.status}</div>
                              <div>Scheduled: {formatDate(row.scheduledStart)} - {formatDate(row.scheduledEnd)}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-autodesk-gray-100 p-3 rounded-b-lg border-t border-autodesk-gray-300 text-xs text-autodesk-gray-700">
          <strong>Tip:</strong> Click on an element name or bar to select it. Use zoom controls to adjust timeline view. Group by phase or discipline for better organization.
        </div>
      </div>
    </div>
  )
}

export default GanttChart
