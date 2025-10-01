import { useState, useEffect } from 'react'
import { ProjectFile, Folder, Project } from '../types'
import { File, Folder as FolderIcon, Loader2, AlertCircle, FileBox, ArrowLeft } from 'lucide-react'
import api from '../services/api'

interface FileBrowserProps {
  projectId: string
  hubId: string
  onSelectFile: (file: ProjectFile) => void
}

type Item = ProjectFile | Folder

function FileBrowser({ projectId, hubId, onSelectFile }: FileBrowserProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [folderStack, setFolderStack] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    loadFiles()
  }, [projectId, hubId, currentFolderId])

  const loadFiles = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let response
      
      if (!hubId) {
        setError('Hub ID is missing. Please select a project again.')
        setLoading(false)
        return
      }
      
      if (!currentFolderId) {
        // Load top folders
        console.log('Loading top folders for hub:', hubId, 'project:', projectId)
        response = await api.getTopFolders(hubId, projectId)
      } else {
        // Load folder contents
        console.log('Loading folder contents for folder:', currentFolderId)
        response = await api.getFolderContents(projectId, currentFolderId)
      }
      
      const data = response.data || []
      const processedItems: Item[] = []
      
      for (const item of data) {
        if (item.type === 'folders') {
          // It's a folder
          processedItems.push({
            id: item.id,
            name: item.attributes?.displayName || item.attributes?.name || 'Unnamed Folder',
            type: 'folders',
            displayName: item.attributes?.displayName
          })
        } else if (item.type === 'items') {
          // It's a file - get its version info
          try {
            const versionsResponse = await api.getItemVersions(projectId, item.id)
            const latestVersion = versionsResponse.data?.[0]
            
            if (latestVersion) {
              const fileName = latestVersion.attributes?.displayName || latestVersion.attributes?.name || 'Unnamed File'
              const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'unknown'
              
              // Get URN from derivatives relationship
              const derivativeUrn = latestVersion.relationships?.derivatives?.data?.id
              
              processedItems.push({
                id: item.id,
                name: fileName,
                displayName: fileName,
                type: fileExtension,
                urn: derivativeUrn,
                objectId: latestVersion.id,
                size: latestVersion.attributes?.storageSize,
                lastModifiedTime: latestVersion.attributes?.lastModifiedTime,
                versionNumber: latestVersion.attributes?.versionNumber
              })
            }
          } catch (versionError) {
            console.warn(`Failed to get version for item ${item.id}:`, versionError)
          }
        }
      }
      
      setItems(processedItems)
    } catch (err: any) {
      setError(err.message || 'Failed to load files. Please try again.')
      console.error('Error loading files:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'N/A'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFileIcon = (type: string) => {
    const iconClass = "w-5 h-5"
    switch (type.toLowerCase()) {
      case 'rvt':
      case 'rfa':
        return <FileBox className={`${iconClass} text-autodesk-blue`} />
      case 'dwg':
      case 'dxf':
        return <File className={`${iconClass} text-hello-yellow`} />
      case 'ifc':
        return <FileBox className={`${iconClass} text-autodesk-teal`} />
      case 'nwd':
      case 'nwc':
        return <FileBox className={`${iconClass} text-autodesk-orange`} />
      default:
        return <File className={`${iconClass} text-autodesk-gray-500`} />
    }
  }

  const isViewableFile = (type: string): boolean => {
    const viewableTypes = ['rvt', 'rfa', 'dwg', 'dxf', 'ifc', 'nwd', 'nwc', 'pdf', 'fbx', 'obj']
    return viewableTypes.includes(type.toLowerCase())
  }

  const handleItemClick = (item: Item) => {
    if (item.type === 'folders') {
      setCurrentFolderId(item.id)
      setFolderStack([...folderStack, { id: item.id, name: item.name }])
    } else if (isViewableFile(item.type)) {
      onSelectFile(item as ProjectFile)
    }
  }

  const handleGoBack = () => {
    if (folderStack.length > 0) {
      const newStack = [...folderStack]
      newStack.pop()
      setFolderStack(newStack)
      setCurrentFolderId(newStack.length > 0 ? newStack[newStack.length - 1].id : null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-hello-yellow animate-spin mx-auto mb-4" />
          <p className="text-autodesk-gray-700 font-medium">Loading files...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-autodesk-orange mx-auto mb-4" />
          <p className="text-autodesk-gray-700 mb-4">{error}</p>
          <button
            onClick={loadFiles}
            className="px-6 py-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-autodesk-black">Select a File</h2>
          {folderStack.length > 0 && (
            <button
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {folderStack.length > 1 ? folderStack[folderStack.length - 2].name : 'Root'}</span>
            </button>
          )}
        </div>
        <p className="text-autodesk-gray-600">
          {folderStack.length > 0 
            ? `Current folder: ${folderStack[folderStack.length - 1].name}` 
            : 'Choose a file to view in 3D'}
        </p>
      </div>

      <div className="bg-white border-2 border-autodesk-gray-200 rounded-lg overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-autodesk-black border-b-2 border-hello-yellow">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-autodesk-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-autodesk-white uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-autodesk-white uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-autodesk-white uppercase tracking-wider">
                  Modified
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-autodesk-gray-200">
              {items.map((item) => {
                const isFolder = item.type === 'folders'
                const isViewable = !isFolder && isViewableFile(item.type)
                
                return (
                  <tr
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={`${
                      isFolder || isViewable
                        ? 'cursor-pointer hover:bg-hello-yellow/10'
                        : 'opacity-50 cursor-not-allowed'
                    } transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        {isFolder ? (
                          <FolderIcon className="w-5 h-5 text-hello-yellow" />
                        ) : (
                          getFileIcon(item.type)
                        )}
                        <span className="text-autodesk-black font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold bg-autodesk-black text-autodesk-white rounded uppercase">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-autodesk-gray-600">
                      {isFolder ? '-' : formatFileSize((item as ProjectFile).size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-autodesk-gray-600">
                      {isFolder ? '-' : formatDate((item as ProjectFile).lastModifiedTime)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-autodesk-gray-200">
          <File className="w-16 h-16 text-autodesk-gray-400 mx-auto mb-4" />
          <p className="text-autodesk-gray-600">No files found</p>
        </div>
      )}
    </div>
  )
}

export default FileBrowser
