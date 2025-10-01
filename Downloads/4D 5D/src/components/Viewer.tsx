import { useEffect, useRef, useState } from 'react'
import { ProjectFile, SelectedElement, Element4DProperties } from '../types'
import { Loader2, AlertCircle, Maximize2, ZoomIn, ZoomOut, Home, RefreshCw, Download, Clock, FileUp, BarChart3, PieChart, Sparkles, Search, Ruler, Pencil } from 'lucide-react'
import api from '../services/api'
import PropertyPanel from './PropertyPanel'
import TimelineControls from './TimelineControls'
import ImportMapping from './ImportMapping'
import GanttChart from './GanttChart'
import { Analytics } from './Analytics'
import AIRenderer from './AIRenderer'
import ElementSearch from './ElementSearch'

interface ViewerProps {
  file: ProjectFile
  projectId: string
}

function Viewer({ file }: ViewerProps) {
  const viewerDivRef = useRef<HTMLDivElement>(null)
  const viewerRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewerReady, setViewerReady] = useState(false)
  const [translationStatus, setTranslationStatus] = useState<string>('Checking...')
  const [exporting, setExporting] = useState(false)
  const [convertingToIfc, setConvertingToIfc] = useState(false)
  
  // 4D BIM States
  const [show4DControls, setShow4DControls] = useState(false)
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null)
  const [element4DPropertiesMap, setElement4DPropertiesMap] = useState<Map<number, Element4DProperties>>(new Map())
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [showGanttChart, setShowGanttChart] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  // AI Rendering State
  const [showAIRenderer, setShowAIRenderer] = useState(false)
  
  // Element Search State
  const [showElementSearch, setShowElementSearch] = useState(false)

  useEffect(() => {
    initializeViewer()
    
    return () => {
      if (viewerRef.current) {
        viewerRef.current.finish()
        viewerRef.current = null
      }
    }
  }, [file])

  // Setup selection handler when 4D mode is toggled or element map changes
  useEffect(() => {
    if (!viewerRef.current || !viewerReady) return

    const viewer = viewerRef.current
    
    // Remove existing listener if any
    viewer.removeEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleElementSelection)
    
    // Re-add listener with current state
    viewer.addEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleElementSelection)
    
    if (show4DControls) {
      console.log('4D Mode enabled - selection handler active')
      // Add visual indicator that 4D mode is active
      if (window.Autodesk?.Viewing?.SelectionMode?.LEAF_OBJECT) {
        viewer.setSelectionMode(window.Autodesk.Viewing.SelectionMode.LEAF_OBJECT)
      }
    } else {
      console.log('4D Mode disabled')
      // Clear selection when disabling 4D mode
      viewer.clearSelection()
      setSelectedElement(null)
    }

    // Cleanup function
    return () => {
      if (viewer) {
        viewer.removeEventListener(window.Autodesk.Viewing.SELECTION_CHANGED_EVENT, handleElementSelection)
      }
    }
  }, [show4DControls, viewerReady, element4DPropertiesMap])

  const initializeViewer = async () => {
    setLoading(true)
    setError(null)
    setViewerReady(false)

    if (!viewerDivRef.current) {
      setError('Viewer container not found')
      setLoading(false)
      return
    }

    // Check if file has URN
    if (!file.urn) {
      setError('File URN not available. The file may not be ready for viewing.')
      setLoading(false)
      return
    }

    try {
      // Check if Autodesk Viewer is loaded
      if (!window.Autodesk || !window.Autodesk.Viewing) {
        setError('Autodesk Viewer library not loaded. Please refresh the page.')
        setLoading(false)
        return
      }

      const Autodesk = window.Autodesk

      // Check translation status first
      setTranslationStatus('Checking file translation status...')
      try {
        const manifest = await api.getManifest(file.urn)
        const status = manifest.status
        
        if (status === 'inprogress') {
          setTranslationStatus('File is being translated. This may take a few minutes...')
          setError('File translation in progress. Please wait and try again in a few minutes.')
          setLoading(false)
          return
        } else if (status === 'failed') {
          setTranslationStatus('Translation failed')
          setError('File translation failed. The file format may not be supported.')
          setLoading(false)
          return
        } else if (status === 'timeout') {
          setTranslationStatus('Translation timed out')
          setError('File translation timed out. Please try again.')
          setLoading(false)
          return
        }
        
        setTranslationStatus('Translation complete')
      } catch (manifestError: any) {
        // If manifest doesn't exist, try to start translation
        if (manifestError.message?.includes('404') || manifestError.message?.includes('not found')) {
          setTranslationStatus('Starting translation...')
          try {
            await api.startTranslation(file.urn)
            setError('Translation started. This may take several minutes. Please try again later.')
            setLoading(false)
            return
          } catch (translationError) {
            console.error('Failed to start translation:', translationError)
            setError('Failed to start file translation. Please try again.')
            setLoading(false)
            return
          }
        }
      }

      // Initialize the viewer with real token
      const options = {
        env: 'AutodeskProduction',
        api: 'derivativeV2',
        getAccessToken: async (onTokenReady: (token: string, expire: number) => void) => {
          try {
            const tokenData = await api.getAccessToken()
            onTokenReady(tokenData.access_token, tokenData.expires_in)
          } catch (err) {
            console.error('Failed to get access token:', err)
            setError('Failed to authenticate. Please check backend server.')
          }
        }
      }

      Autodesk.Viewing.Initializer(options, () => {
        const viewerDiv = viewerDivRef.current
        if (!viewerDiv) return

        // Create viewer instance
        const viewer = new Autodesk.Viewing.GuiViewer3D(viewerDiv, {
          extensions: [
            'Autodesk.DocumentBrowser',
            'Autodesk.Measure',
            'Autodesk.Viewing.MarkupsCore'
          ]
        })
        viewerRef.current = viewer
        
        console.log('Viewer initialized with extensions: Measure, MarkupsCore')

        // Start the viewer
        const startResult = viewer.start()
        if (startResult > 0) {
          setError('Failed to initialize viewer')
          setLoading(false)
          return
        }

        setViewerReady(true)

        // Load the document
        const documentId = `urn:${file.urn}`
        
        Autodesk.Viewing.Document.load(
          documentId,
          (doc: any) => {
            // Document loaded successfully
            const defaultModel = doc.getRoot().getDefaultGeometry()
            
            if (defaultModel) {
              viewer.loadDocumentNode(doc, defaultModel).then(() => {
                setLoading(false)
                setTranslationStatus('Model loaded successfully')
                
                // Load extensions after model is loaded
                viewer.loadExtension('Autodesk.Measure').then(() => {
                  console.log('✓ Measure extension loaded')
                }).catch((err: any) => {
                  console.warn('Could not load Measure extension:', err)
                })
                
                viewer.loadExtension('Autodesk.Viewing.MarkupsCore').then(() => {
                  console.log('✓ MarkupsCore extension loaded')
                }).catch((err: any) => {
                  console.warn('Could not load MarkupsCore extension:', err)
                })
                
                // Automatically zoom to fit the entire model in view
                setTimeout(() => {
                  viewer.fitToView()
                  // Set this as the home view for the reset button
                  viewer.autocam.setHomeViewFrom(viewer.navigation.getCamera())
                }, 100)

                // Event listener is managed by useEffect hook based on 4D mode state
              })
            } else {
              setError('No viewable content found in this file')
              setLoading(false)
            }
          },
          (errorCode: any, errorMsg: string) => {
            // Document loading failed
            console.error('Failed to load document:', errorCode, errorMsg)
            setError(`Failed to load document: ${errorMsg}`)
            setLoading(false)
          }
        )
      })
    } catch (err: any) {
      console.error('Error initializing viewer:', err)
      setError(err.message || 'Failed to initialize viewer. Please try again.')
      setLoading(false)
    }
  }

  const handleZoomIn = () => {
    if (viewerRef.current) {
      viewerRef.current.navigation.setZoomTowardsPivot(true)
      const fov = viewerRef.current.getFOV()
      viewerRef.current.setFOV(fov * 0.9)
    }
  }

  const handleZoomOut = () => {
    if (viewerRef.current) {
      viewerRef.current.navigation.setZoomTowardsPivot(true)
      const fov = viewerRef.current.getFOV()
      viewerRef.current.setFOV(fov * 1.1)
    }
  }

  const handleResetView = () => {
    if (viewerRef.current) {
      viewerRef.current.navigation.setRequestHomeView(true)
    }
  }

  const handleToggleMeasure = () => {
    if (!viewerRef.current) return
    
    const measureExtension = viewerRef.current.getExtension('Autodesk.Measure')
    if (measureExtension) {
      if (measureExtension.isActive()) {
        measureExtension.deactivate()
        console.log('Measure tool deactivated')
      } else {
        measureExtension.activate('distance')
        console.log('Measure tool activated')
      }
    } else {
      console.warn('Measure extension not loaded')
    }
  }

  const handleToggleMarkup = () => {
    if (!viewerRef.current) return
    
    const markupExtension = viewerRef.current.getExtension('Autodesk.Viewing.MarkupsCore')
    if (markupExtension) {
      // Check if in edit mode using the correct API
      if (markupExtension.editMode) {
        // Exit markup mode
        markupExtension.leaveEditMode()
        markupExtension.hide()
        console.log('Markup mode deactivated')
      } else {
        // Enter markup mode
        markupExtension.show()
        markupExtension.enterEditMode()
        console.log('Markup mode activated')
      }
    } else {
      console.warn('MarkupsCore extension not loaded')
      alert('Markup extension is not available. Please wait for the model to fully load.')
    }
  }

  const handleFullscreen = () => {
    if (viewerDivRef.current) {
      if (viewerDivRef.current.requestFullscreen) {
        viewerDivRef.current.requestFullscreen()
      }
    }
  }

  const handleExportToCSV = async () => {
    if (!viewerRef.current) {
      alert('Viewer not initialized')
      return
    }

    setExporting(true)
    
    try {
      const viewer = viewerRef.current
      const model = viewer.model
      
      if (!model) {
        alert('No model loaded')
        setExporting(false)
        return
      }

      // Array to store all element data
      const elementsData: any[] = []
      
      // Get the instance tree
      const instanceTree = model.getInstanceTree()
      
      if (!instanceTree) {
        alert('Could not access model data')
        setExporting(false)
        return
      }

      // Function to get ALL properties for a single element (including grouped properties)
      const getElementProperties = (dbId: number): Promise<any> => {
        return new Promise((resolve) => {
          // Use getProperties2 to get all properties including those in categories
          model.getBulkProperties2([dbId], {}, (results: any) => {
            if (results && results.length > 0) {
              resolve(results[0])
            } else {
              resolve(null)
            }
          }, (error: any) => {
            console.error('Error getting properties for dbId:', dbId, error)
            resolve(null)
          })
        })
      }

      // Get all node IDs
      const getAllDbIds = (): number[] => {
        const dbIds: number[] = []
        const rootId = instanceTree.getRootId()
        
        const traverse = (nodeId: number) => {
          dbIds.push(nodeId)
          instanceTree.enumNodeChildren(nodeId, (childId: number) => {
            traverse(childId)
          })
        }
        
        traverse(rootId)
        return dbIds
      }

      const allDbIds = getAllDbIds()
      console.log(`Found ${allDbIds.length} elements in the model`)

      // Get properties for all elements (in batches to avoid overwhelming)
      const batchSize = 50
      for (let i = 0; i < allDbIds.length; i += batchSize) {
        const batch = allDbIds.slice(i, i + batchSize)
        const batchPromises = batch.map(dbId => getElementProperties(dbId))
        const batchResults = await Promise.all(batchPromises)
        
        batchResults.forEach(props => {
          if (props && props.properties && props.properties.length > 0) {
            // Create a flat object with all properties
            const elementData: any = {
              'Element ID': props.dbId,
              'Element Name': props.name || 'Unnamed',
              'External ID': props.externalId || ''
            }
            
            // Add all properties (including those in categories/groups)
            props.properties.forEach((prop: any) => {
              if (prop.displayName && prop.displayValue !== undefined && prop.displayValue !== null) {
                // Use category prefix if available to organize properties
                const propName = prop.displayCategory && prop.displayCategory !== '__internalref__' 
                  ? `${prop.displayCategory} - ${prop.displayName}` 
                  : prop.displayName
                
                // Handle different value types
                let value = prop.displayValue
                if (typeof value === 'object') {
                  value = JSON.stringify(value)
                }
                
                elementData[propName] = value
              }
            })
            
            elementsData.push(elementData)
          }
        })
        
        // Update progress
        console.log(`Processed ${Math.min(i + batchSize, allDbIds.length)} of ${allDbIds.length} elements`)
      }

      if (elementsData.length === 0) {
        alert('No elements with properties found')
        setExporting(false)
        return
      }

      // Get all unique headers from all elements (some elements may have different properties)
      const allHeaders = new Set<string>()
      elementsData.forEach(row => {
        Object.keys(row).forEach(key => allHeaders.add(key))
      })
      
      // Convert to array and sort (keep Element ID, Name, External ID first)
      const sortedHeaders = Array.from(allHeaders).sort((a, b) => {
        const priority: any = { 'Element ID': 0, 'Element Name': 1, 'External ID': 2 }
        const priorityA = priority[a] !== undefined ? priority[a] : 999
        const priorityB = priority[b] !== undefined ? priority[b] : 999
        
        if (priorityA !== priorityB) return priorityA - priorityB
        return a.localeCompare(b)
      })
      
      // Create CSV header
      let csv = sortedHeaders.map(h => `"${h}"`).join(',') + '\n'
      
      // Create CSV rows
      elementsData.forEach(row => {
        const values = sortedHeaders.map(header => {
          const value = row[header] !== undefined && row[header] !== null ? row[header] : ''
          // Escape quotes and wrap in quotes
          return `"${String(value).replace(/"/g, '""')}"`
        })
        csv += values.join(',') + '\n'
      })

      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      const fileName = `${file.name.replace(/\.[^/.]+$/, '')}_elements_${new Date().toISOString().split('T')[0]}.csv`
      
      link.setAttribute('href', url)
      link.setAttribute('download', fileName)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log(`Exported ${elementsData.length} elements to ${fileName}`)
      alert(`Successfully exported ${elementsData.length} elements!`)
      
    } catch (err: any) {
      console.error('Error exporting to CSV:', err)
      alert('Error exporting data: ' + err.message)
    } finally {
      setExporting(false)
    }
  }

  const handleConvertToIfc = async () => {
    if (!file.urn) {
      alert('File URN is missing')
      return
    }

    setConvertingToIfc(true)
    
    try {
      console.log('Starting IFC conversion for URN:', file.urn)
      
      // Request IFC conversion from backend
      const response = await api.convertToIfc(file.urn)
      
      if (response.success) {
        alert(`IFC conversion started successfully!\n\nJob ID: ${response.jobId}\n\nThe conversion is processing. You'll be able to download the IFC file once it completes (usually 1-5 minutes).\n\nCheck the console for updates.`)
        
        // Poll for conversion status
        pollIfcConversionStatus(response.jobId, file.urn)
      } else {
        throw new Error(response.message || 'Failed to start IFC conversion')
      }
      
    } catch (err: any) {
      console.error('Error converting to IFC:', err)
      
      let errorMessage = 'Failed to convert to IFC format.'
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      alert(`IFC Conversion Error:\n\n${errorMessage}\n\nNote: IFC export may not be supported for all file types. Revit files typically work best.`)
      setConvertingToIfc(false)
    }
  }

  const pollIfcConversionStatus = async (jobId: string, urn: string, attempts = 0) => {
    const maxAttempts = 60 // Poll for up to 5 minutes (every 5 seconds)
    
    try {
      const status = await api.checkIfcConversionStatus(urn)
      
      console.log(`IFC conversion status (attempt ${attempts + 1}):`, status.status)
      
      if (status.status === 'success' || status.status === 'complete') {
        console.log('IFC conversion completed!', status)
        
        // Download the IFC file
        if (status.downloadUrl) {
          const fileName = `${file.name.replace(/\.[^/.]+$/, '')}.ifc`
          
          // Create download link
          const link = document.createElement('a')
          link.href = status.downloadUrl
          link.download = fileName
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          alert(`IFC file downloaded successfully!\n\nFile: ${fileName}`)
        } else {
          alert('IFC conversion completed, but download URL not available. Check console for details.')
        }
        
        setConvertingToIfc(false)
      } else if (status.status === 'failed' || status.status === 'timeout') {
        throw new Error(status.message || 'IFC conversion failed')
      } else if (status.status === 'inprogress' || status.status === 'pending') {
        // Still processing, poll again
        if (attempts < maxAttempts) {
          setTimeout(() => {
            pollIfcConversionStatus(jobId, urn, attempts + 1)
          }, 5000) // Check every 5 seconds
        } else {
          throw new Error('IFC conversion timed out. The file may be too large or complex.')
        }
      }
      
    } catch (err: any) {
      console.error('Error checking IFC conversion status:', err)
      alert(`IFC Conversion Error:\n\n${err.message || 'Failed to check conversion status'}`)
      setConvertingToIfc(false)
    }
  }

  // 4D BIM Functions
  const handleElementSelection = () => {
    console.log('Selection event fired, 4D Mode:', show4DControls)
    
    if (!viewerRef.current) {
      console.log('Viewer not ready')
      return
    }

    // Only handle selection when 4D mode is enabled
    if (!show4DControls) {
      console.log('4D Mode not enabled - ignoring selection')
      return
    }

    const selection = viewerRef.current.getSelection()
    console.log('Selected elements:', selection)
    
    if (selection && selection.length > 0) {
      const dbId = selection[0]
      console.log('Selected element dbId:', dbId)
      
      // Get element properties
      viewerRef.current.model.getProperties(dbId, (result: any) => {
        console.log('Element properties loaded:', result)
        
        const selectedElem: SelectedElement = {
          dbId: dbId,
          name: result.name || 'Unnamed Element',
          externalId: result.externalId,
          properties: element4DPropertiesMap.get(dbId)
        }
        
        console.log('Setting selected element:', selectedElem)
        setSelectedElement(selectedElem)
      })
    } else {
      console.log('No selection or empty selection')
      setSelectedElement(null)
    }
  }

  const handleSave4DProperties = async (properties: Element4DProperties) => {
    if (!selectedElement) return

    // Update local map
    const newMap = new Map(element4DPropertiesMap)
    newMap.set(selectedElement.dbId, properties)
    setElement4DPropertiesMap(newMap)

    // Apply color based on status
    applyElementColor(selectedElement.dbId, properties.status || 'not-started')

    console.log('4D Properties saved for element:', selectedElement.dbId, properties)
    alert('Properties saved successfully!')
  }

  const handleSyncToDatabase = async (properties: Element4DProperties) => {
    if (!selectedElement) return

    try {
      // Call backend API to sync to database
      const response = await api.sync4DPropertiesToDatabase(selectedElement.dbId, properties)
      
      // Update with database record ID
      const updatedProperties = { ...properties, databaseRecordId: response.recordId }
      
      const newMap = new Map(element4DPropertiesMap)
      newMap.set(selectedElement.dbId, updatedProperties)
      setElement4DPropertiesMap(newMap)

      setSelectedElement({
        ...selectedElement,
        properties: updatedProperties
      })

      console.log('Synced to database:', response)
      alert(`Successfully synced to database!\nRecord ID: ${response.recordId}`)
    } catch (error: any) {
      console.error('Failed to sync to database:', error)
      alert(`Failed to sync to database: ${error.message}`)
    }
  }

  const applyElementColor = (dbId: number, status: string) => {
    if (!viewerRef.current) return

    const viewer = viewerRef.current
    const color = getStatusColor(status)

    // Apply color to element
    viewer.setThemingColor(dbId, color, null, true)
  }

  const getStatusColor = (status: string) => {
    // Returns THREE.Vector4(r, g, b, a) where values are 0-1
    switch (status) {
      case 'completed':
        return new (window as any).THREE.Vector4(0.13, 0.80, 0.33, 1) // Green
      case 'in-progress':
        return new (window as any).THREE.Vector4(0.00, 0.69, 0.94, 1) // Blue
      case 'delayed':
        return new (window as any).THREE.Vector4(1.00, 0.27, 0.23, 1) // Red
      case 'not-started':
      default:
        return new (window as any).THREE.Vector4(0.60, 0.60, 0.60, 1) // Gray
    }
  }

  const handle4DDateChange = (date: Date) => {
    setCurrentDate(date)
    apply4DVisualization(date, statusFilter)
  }

  const handle4DFilterChange = (filter: string) => {
    setStatusFilter(filter)
    apply4DVisualization(currentDate, filter)
  }

  const handle4DPlayPause = (playing: boolean) => {
    // TODO: Implement timeline animation
    console.log('4D Playback:', playing ? 'Playing' : 'Paused')
  }

  const apply4DVisualization = (date: Date, filter: string) => {
    if (!viewerRef.current) return

    const viewer = viewerRef.current
    const model = viewer.model
    const instanceTree = model.getInstanceTree()
    if (!instanceTree) return

    console.log(`\n=== Applying 4D Visualization ===`)
    console.log(`Current Date: ${date.toISOString().split('T')[0]}`)
    console.log(`Status Filter: ${filter}`)
    console.log(`Total elements with 4D data: ${element4DPropertiesMap.size}`)

    // Get all element IDs in the model
    const getAllDbIds = (): number[] => {
      const dbIds: number[] = []
      const rootId = instanceTree.getRootId()
      
      const traverse = (nodeId: number) => {
        dbIds.push(nodeId)
        instanceTree.enumNodeChildren(nodeId, (childId: number) => {
          traverse(childId)
        })
      }
      
      traverse(rootId)
      return dbIds
    }

    const allDbIds = getAllDbIds()
    const elementsToShow: number[] = []
    const elementsToHide: number[] = []
    
    // Clear existing theming and show all first
    viewer.clearThemingColors()
    viewer.showAll()

    // Process each element
    allDbIds.forEach(dbId => {
      const props = element4DPropertiesMap.get(dbId)
      
      if (!props) {
        // Element has no 4D data - hide it during 4D playback
        elementsToHide.push(dbId)
        return
      }

      // Check if element should be visible based on dates
      const scheduledStart = props.scheduledStartDate ? new Date(props.scheduledStartDate) : null
      const scheduledEnd = props.scheduledEndDate ? new Date(props.scheduledEndDate) : null
      const actualStart = props.actualStartDate ? new Date(props.actualStartDate) : null
      const actualEnd = props.actualEndDate ? new Date(props.actualEndDate) : null

      // Determine if element should be visible at current date
      let isVisible = false
      let currentStatus = props.status || 'not-started'

      // Use actual dates if available, otherwise scheduled dates
      const startDate = actualStart || scheduledStart
      const endDate = actualEnd || scheduledEnd

      if (startDate && endDate) {
        // Element has date range
        if (date >= startDate && date <= endDate) {
          // Currently being worked on
          isVisible = true
          if (currentStatus === 'not-started') {
            currentStatus = 'in-progress'
          }
        } else if (date > endDate) {
          // Work period has ended - show as completed
          isVisible = true
          if (currentStatus !== 'delayed') {
            currentStatus = 'completed'
          }
        } else {
          // Work hasn't started yet - hide
          isVisible = false
        }
      } else if (startDate && !endDate) {
        // Only has start date
        if (date >= startDate) {
          isVisible = true
          if (currentStatus === 'not-started') {
            currentStatus = 'in-progress'
          }
        } else {
          isVisible = false
        }
      } else {
        // No dates - always show but dimmed
        isVisible = true
      }

      // Apply status filter
      if (filter !== 'all') {
        if (filter !== currentStatus) {
          isVisible = false
        }
      }

      // Add to appropriate list
      if (isVisible) {
        elementsToShow.push(dbId)
        // Apply color based on status
        applyElementColor(dbId, currentStatus)
      } else {
        elementsToHide.push(dbId)
      }
    })

    console.log(`Elements to show: ${elementsToShow.length}`)
    console.log(`Elements to hide: ${elementsToHide.length}`)

    // Hide elements not in current time period
    if (elementsToHide.length > 0) {
      viewer.hide(elementsToHide)
    }

    // Ensure visible elements are shown
    if (elementsToShow.length > 0) {
      viewer.show(elementsToShow)
      // Isolate to focus only on current elements
      viewer.isolate(elementsToShow)
    }

    // Force refresh
    viewer.impl.invalidate(true, true, true)

    console.log(`=== Visualization Applied ===\n`)
  }

  const toggle4DMode = () => {
    const newShow = !show4DControls
    console.log('Toggling 4D Mode:', newShow ? 'ON' : 'OFF')
    setShow4DControls(newShow)
    
    if (!newShow) {
      // Clear all theming when disabling 4D mode
      if (viewerRef.current) {
        viewerRef.current.clearThemingColors()
        viewerRef.current.showAll()
        viewerRef.current.isolate([]) // Clear isolation
        viewerRef.current.impl.invalidate(true, true, true)
      }
      setSelectedElement(null)
    } else {
      // Show instruction message and apply initial visualization
      alert('4D Mode Enabled!\n\nClick any element in the 3D view to assign schedule properties.\n\nUse the date picker and playback controls to see construction progress over time.')
      
      // Apply initial 4D visualization
      if (element4DPropertiesMap.size > 0) {
        setTimeout(() => {
          apply4DVisualization(currentDate, statusFilter)
        }, 100)
      }
    }
  }

  const handleCaptureScreenshot = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!viewerRef.current) {
        reject(new Error('Viewer not ready'))
        return
      }

      const viewer = viewerRef.current
      const width = 1920
      const height = 1080

      // Capture high-resolution screenshot
      viewer.getScreenShot(width, height, (blobUrl: string) => {
        // Convert blob URL to base64
        fetch(blobUrl)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader()
            reader.onloadend = () => {
              const base64data = reader.result as string
              resolve(base64data)
            }
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
          .catch(reject)
      })
    })
  }

  const handleBulkImport = async (mappedData: any[]) => {
    if (!viewerRef.current) {
      alert('Viewer not ready')
      return
    }

    console.log('=== STARTING BULK IMPORT ===')
    console.log('Mappings to process:', mappedData.length)
    console.log('Mapping field:', mappedData[0]?.mappingField)
    console.log('Sample mapping value:', mappedData[0]?.mappingValue)
    
    const viewer = viewerRef.current
    const model = viewer.model
    const instanceTree = model.getInstanceTree()
    
    if (!instanceTree) {
      alert('Model not loaded properly')
      return
    }

    // Clear existing theming
    console.log('Clearing existing element colors...')
    viewer.clearThemingColors()

    let successCount = 0
    let failedCount = 0
    const newMap = new Map(element4DPropertiesMap)
    const matchedElements: number[] = []

    // Helper function to get all dbIds
    const getAllDbIds = (): number[] => {
      const dbIds: number[] = []
      const rootId = instanceTree.getRootId()
      
      const traverse = (nodeId: number) => {
        dbIds.push(nodeId)
        instanceTree.enumNodeChildren(nodeId, (childId: number) => {
          traverse(childId)
        })
      }
      
      traverse(rootId)
      return dbIds
    }

    const allDbIds = getAllDbIds()
    console.log(`Found ${allDbIds.length} elements in model`)
    console.log(`Processing ${mappedData.length} CSV rows...`)

    // Process each mapping
    for (let i = 0; i < mappedData.length; i++) {
      const mapping = mappedData[i]
      const { mappingValue, mappingField, properties } = mapping
      
      if (!mappingValue) {
        console.warn(`Row ${i + 1}: Missing mapping value`)
        failedCount++
        continue
      }

      console.log(`\n--- Processing Row ${i + 1}/${mappedData.length} ---`)
      console.log(`Looking for: ${mappingField} = "${mappingValue}"`)

      // Find matching element
      let found = false
      
      for (const dbId of allDbIds) {
        const elementMatches = await new Promise((resolve) => {
          model.getBulkProperties2([dbId], {}, (results: any[]) => {
            if (!results || results.length === 0) {
              resolve(false)
              return
            }
            
            const result = results[0]
            
            // Check built-in properties
            if (mappingField === 'externalId') {
              const matches = result.externalId === mappingValue
              if (matches) {
                console.log(`✓ Match found! DbId: ${dbId}, ExternalId: ${result.externalId}`)
              }
              resolve(matches)
            } else if (mappingField === 'name') {
              const matches = result.name === mappingValue
              if (matches) {
                console.log(`✓ Match found! DbId: ${dbId}, Name: ${result.name}`)
              }
              resolve(matches)
            } else if (mappingField === 'dbId') {
              const matches = dbId === parseInt(mappingValue)
              if (matches) {
                console.log(`✓ Match found! DbId: ${dbId}`)
              }
              resolve(matches)
            } else {
              // Check in all properties by attributeName
              if (result.properties) {
                const prop = result.properties.find((p: any) => 
                  (p.attributeName === mappingField || p.displayName === mappingField) && 
                  (p.displayValue == mappingValue || String(p.displayValue) === String(mappingValue))
                )
                if (prop) {
                  console.log(`✓ Match found! DbId: ${dbId}, Property: ${prop.displayName} = ${prop.displayValue}`)
                }
                resolve(!!prop)
              } else {
                resolve(false)
              }
            }
          }, (error: any) => {
            console.error('Error checking element:', error)
            resolve(false)
          })
        })

        if (elementMatches) {
          // Found matching element! Assign properties
          const element4DProps: Element4DProperties = {
            elementId: dbId.toString(),
            elementName: properties.elementName || `Element ${dbId}`,
            externalId: mappingValue,
            scheduledStartDate: properties.scheduledStartDate,
            scheduledEndDate: properties.scheduledEndDate,
            actualStartDate: properties.actualStartDate,
            actualEndDate: properties.actualEndDate,
            status: properties.status || 'not-started',
            progress: properties.progress || 0,
            phase: properties.phase,
            discipline: properties.discipline,
            contractor: properties.contractor,
            notes: properties.notes
          }

          newMap.set(dbId, element4DProps)
          matchedElements.push(dbId)
          
          // Apply color
          const status = properties.status || 'not-started'
          console.log(`Applying color for status: ${status}`)
          applyElementColor(dbId, status)
          
          found = true
          successCount++
          console.log(`✓ Successfully mapped row ${i + 1} to element ${dbId}`)
          break
        }
      }

      if (!found) {
        console.warn(`✗ No match found for "${mappingValue}"`)
        failedCount++
      }
    }

    console.log('\n=== IMPORT SUMMARY ===')
    console.log(`Total rows: ${mappedData.length}`)
    console.log(`Successfully matched: ${successCount}`)
    console.log(`Failed to match: ${failedCount}`)
    console.log(`Matched element IDs:`, matchedElements)

    // Update state
    setElement4DPropertiesMap(newMap)
    console.log('Updated properties map with', newMap.size, 'elements')

    // Close dialog
    setShowImportDialog(false)

    // Apply 4D visualization to show/hide elements based on current date
    console.log('Applying 4D visualization after import...')
    setTimeout(() => {
      apply4DVisualization(currentDate, statusFilter)
    }, 100)

    // Show results
    const message = `Import Complete!\n\n✓ Successfully mapped: ${successCount}\n✗ Failed to match: ${failedCount}\n\nElements are now visible based on the current date (${currentDate.toISOString().split('T')[0]}).\n\nUse the date picker to navigate through time!\n\nCheck browser console (F12) for detailed logs.`
    alert(message)
    
    console.log('=== IMPORT COMPLETE ===')
  }

  return (
    <div className="space-y-4">
      {/* 4D Mode Active Banner */}
      {show4DControls && (
        <div className="bg-hello-yellow border-4 border-autodesk-black rounded-lg p-4 shadow-lg animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-autodesk-black" />
              <div>
                <h3 className="text-lg font-bold text-autodesk-black">4D Mode Active</h3>
                <p className="text-sm text-autodesk-gray-800">Click any element in the 3D view to assign schedule properties</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowGanttChart(true)}
                className="px-4 py-2 bg-autodesk-blue text-white font-semibold rounded hover:bg-blue-600 transition-colors flex items-center gap-2"
                title="Show Gantt Chart Timeline"
                disabled={element4DPropertiesMap.size === 0}
              >
                <BarChart3 className="w-4 h-4" />
                Gantt Chart
              </button>
              <button
                onClick={() => setShowImportDialog(true)}
                className="px-4 py-2 bg-autodesk-teal text-white font-semibold rounded hover:bg-teal-600 transition-colors flex items-center gap-2"
                title="Import schedule from Excel/CSV"
              >
                <FileUp className="w-4 h-4" />
                Import Excel
              </button>
              <button
                onClick={toggle4DMode}
                className="px-4 py-2 bg-autodesk-black text-hello-yellow font-semibold rounded hover:bg-autodesk-gray-800 transition-colors"
              >
                Disable 4D Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4D Timeline Controls - Positioned at Top */}
      {show4DControls && (
        <TimelineControls
          onDateChange={handle4DDateChange}
          onFilterChange={handle4DFilterChange}
          onPlayPause={handle4DPlayPause}
        />
      )}

      {/* File Info */}
      <div className="bg-autodesk-black border-l-4 border-hello-yellow rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-autodesk-white mb-3">{file.name}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-autodesk-gray-300">
          <span>Type: <span className="text-hello-yellow font-semibold">{file.type.toUpperCase()}</span></span>
          {file.size && (
            <span>Size: <span className="text-hello-yellow font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</span></span>
          )}
          {file.lastModifiedTime && (
            <span>Modified: <span className="text-hello-yellow font-semibold">
              {new Date(file.lastModifiedTime).toLocaleDateString()}
            </span></span>
          )}
          {file.versionNumber && (
            <span>Version: <span className="text-hello-yellow font-semibold">v{file.versionNumber}</span></span>
          )}
          <span>Status: <span className={`font-semibold ${
            translationStatus.includes('complete') || translationStatus.includes('successfully') 
              ? 'text-autodesk-teal' 
              : translationStatus.includes('failed') 
              ? 'text-autodesk-orange' 
              : 'text-hello-yellow'
          }`}>{translationStatus}</span></span>
        </div>
      </div>

      {/* Toolbar - Controls Outside Viewer */}
      {viewerReady && !loading && !error && (
        <div className="bg-autodesk-black border-2 border-autodesk-gray-700 rounded-lg p-4 mb-4 shadow-lg">
          <div className="flex items-center justify-between gap-4">
            {/* Left Side - Main Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowElementSearch(true)}
                className="px-4 py-3 bg-autodesk-teal hover:bg-opacity-80 text-white font-semibold rounded transition-colors shadow-lg border-2 border-autodesk-teal"
                title="Search Elements"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span className="text-sm">Find</span>
                </div>
              </button>
              <button
                onClick={() => setShowAnalytics(true)}
                className="px-4 py-3 bg-autodesk-blue hover:bg-opacity-80 text-white font-semibold rounded transition-colors shadow-lg border-2 border-autodesk-blue"
                title="View BOQ Analytics"
              >
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  <span className="text-sm">Analytics</span>
                </div>
              </button>
              <button
                onClick={toggle4DMode}
                className={`px-4 py-3 font-semibold rounded transition-colors shadow-lg border-2 ${
                  show4DControls 
                    ? 'bg-hello-yellow text-autodesk-black border-autodesk-black' 
                    : 'bg-autodesk-gray-700 text-hello-yellow border-hello-yellow hover:bg-autodesk-gray-600'
                }`}
                title="Toggle 4D BIM Mode"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">4D Mode</span>
                </div>
              </button>
              <button
                onClick={handleConvertToIfc}
                disabled={convertingToIfc}
                className={`px-4 py-3 bg-autodesk-teal hover:bg-opacity-80 text-white font-semibold rounded transition-colors shadow-lg border-2 border-autodesk-teal ${
                  convertingToIfc ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Convert to IFC"
              >
                {convertingToIfc ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm">Converting...</span>
                  </div>
                ) : (
                  <span className="text-sm">Export IFC</span>
                )}
              </button>
              <button
                onClick={handleExportToCSV}
                disabled={exporting}
                className={`px-4 py-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors shadow-lg border-2 border-autodesk-black ${
                  exporting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Export Properties to CSV"
              >
                <div className="flex items-center gap-2">
                  {exporting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  <span className="text-sm">Export CSV</span>
                </div>
              </button>
              <button
                onClick={() => setShowAIRenderer(true)}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded transition-all shadow-lg border-2 border-purple-400 transform hover:scale-105"
                title="AI Realistic Rendering"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm">AI Render</span>
                </div>
              </button>
            </div>

            {/* Right Side - Viewer Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMeasure}
                className="p-3 bg-autodesk-gray-700 hover:bg-autodesk-orange text-autodesk-orange hover:text-white rounded transition-colors shadow-lg border-2 border-autodesk-orange"
                title="Measure Tool"
              >
                <Ruler className="w-5 h-5" />
              </button>
              <button
                onClick={handleToggleMarkup}
                className="p-3 bg-autodesk-gray-700 hover:bg-autodesk-teal text-autodesk-teal hover:text-white rounded transition-colors shadow-lg border-2 border-autodesk-teal"
                title="Markup Tool"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomIn}
                className="p-3 bg-autodesk-gray-700 hover:bg-hello-yellow text-hello-yellow hover:text-autodesk-black rounded transition-colors shadow-lg border-2 border-hello-yellow"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-3 bg-autodesk-gray-700 hover:bg-hello-yellow text-hello-yellow hover:text-autodesk-black rounded transition-colors shadow-lg border-2 border-hello-yellow"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-3 bg-autodesk-gray-700 hover:bg-hello-yellow text-hello-yellow hover:text-autodesk-black rounded transition-colors shadow-lg border-2 border-hello-yellow"
                title="Reset View"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                onClick={handleFullscreen}
                className="p-3 bg-autodesk-gray-700 hover:bg-hello-yellow text-hello-yellow hover:text-autodesk-black rounded transition-colors shadow-lg border-2 border-hello-yellow"
                title="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewer Container */}
      <div className="relative bg-white border-2 border-autodesk-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '70vh' }}>

        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-autodesk-white/95 z-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-hello-yellow animate-spin mx-auto mb-4" />
              <p className="text-autodesk-black text-lg font-semibold">Loading 3D Model...</p>
              <p className="text-autodesk-gray-600 text-sm mt-2">This may take a moment</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-autodesk-white/95 z-20">
            <div className="text-center max-w-md mx-auto px-4">
              <AlertCircle className="w-12 h-12 text-autodesk-orange mx-auto mb-4" />
              <p className="text-autodesk-gray-700 mb-4 font-medium">{error}</p>
              <button
                onClick={initializeViewer}
                className="px-6 py-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors"
              >
                Retry
              </button>
              {error?.includes('translation') && (
                <button
                  onClick={() => {
                    setTimeout(() => initializeViewer(), 5000)
                  }}
                  className="mt-4 px-6 py-3 bg-autodesk-black hover:bg-autodesk-gray-900 text-hello-yellow rounded transition-colors flex items-center space-x-2 mx-auto font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Check Again</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Viewer Div */}
        <div
          ref={viewerDivRef}
          className="w-full h-full"
          style={{ position: 'relative' }}
        />
      </div>

      {/* Instructions */}
      <div className="bg-autodesk-black border-l-4 border-hello-yellow rounded-lg p-4 shadow-md">
        <h3 className="text-sm font-semibold text-hello-yellow mb-3">Viewer Controls & Export</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-semibold text-autodesk-white mb-2">Navigation:</h4>
            <ul className="text-xs text-autodesk-gray-300 space-y-1">
              <li>• <span className="text-autodesk-white">Left Click + Drag</span> - Rotate</li>
              <li>• <span className="text-autodesk-white">Middle Click + Drag</span> - Pan</li>
              <li>• <span className="text-autodesk-white">Scroll Wheel</span> - Zoom</li>
              <li>• <span className="text-autodesk-white">Right Click</span> - Context menu</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-autodesk-white mb-2">Export:</h4>
            <ul className="text-xs text-autodesk-gray-300 space-y-1">
              <li>• <span className="text-autodesk-teal">Export IFC</span> - Convert model to IFC format</li>
              <li>• <span className="text-hello-yellow">Download Icon</span> - Export properties to CSV</li>
              <li>• CSV includes all element properties</li>
              <li>• Compatible with Excel and other tools</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property Panel */}
      {show4DControls && selectedElement && (
        <PropertyPanel
          selectedElement={selectedElement}
          onClose={() => setSelectedElement(null)}
          onSave={handleSave4DProperties}
          onSyncToDatabase={handleSyncToDatabase}
        />
      )}

      {/* Import Mapping Dialog */}
      {showImportDialog && viewerRef.current && (
        <ImportMapping
          onClose={() => setShowImportDialog(false)}
          onImport={handleBulkImport}
          viewer={viewerRef.current}
        />
      )}

      {/* Gantt Chart */}
      {showGanttChart && (
        <GanttChart
          elements={element4DPropertiesMap}
          currentDate={currentDate}
          onClose={() => setShowGanttChart(false)}
          onElementClick={(elementId) => {
            // Select the element in the viewer
            if (viewerRef.current) {
              const dbId = parseInt(elementId)
              viewerRef.current.select(dbId)
              viewerRef.current.fitToView([dbId])
            }
            setShowGanttChart(false)
          }}
        />
      )}

      {/* Analytics */}
      {showAnalytics && viewerRef.current && (
        <Analytics
          viewer={viewerRef.current}
          onClose={() => setShowAnalytics(false)}
        />
      )}

      {/* AI Renderer */}
      {showAIRenderer && (
        <AIRenderer
          onClose={() => setShowAIRenderer(false)}
          onCapture={handleCaptureScreenshot}
        />
      )}

      {/* Element Search */}
      {showElementSearch && viewerRef.current && (
        <ElementSearch
          viewer={viewerRef.current}
          onClose={() => setShowElementSearch(false)}
        />
      )}
    </div>
  )
}

export default Viewer
