import { useState, useEffect } from 'react'
import { Project, Hub } from '../types'
import { FolderOpen, Loader2, AlertCircle, Server, Search, X } from 'lucide-react'
import api from '../services/api'

interface ProjectSelectorProps {
  onSelectProject: (project: Project) => void
}

function ProjectSelector({ onSelectProject }: ProjectSelectorProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serverStatus, setServerStatus] = useState<string>('Checking...')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedHub, setSelectedHub] = useState<string>('all')
  const [hubs, setHubs] = useState<Hub[]>([])

  useEffect(() => {
    checkServerAndLoadProjects()
  }, [])

  const checkServerAndLoadProjects = async () => {
    try {
      const health = await api.checkHealth()
      if (!health.hasCredentials) {
        setServerStatus('⚠️ Server running but credentials not configured')
        setError('APS credentials not configured. Please update the .env file with your APS_CLIENT_ID and APS_CLIENT_SECRET.')
        setLoading(false)
        return
      }
      setServerStatus('✅ Connected')
      await loadProjects()
    } catch (err) {
      setServerStatus('❌ Server not running')
      setError('Backend server not running. Please start it with: npm run dev:server')
      setLoading(false)
    }
  }

  const loadProjects = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Get all hubs first
      const hubsResponse = await api.listHubs()
      const fetchedHubs: Hub[] = hubsResponse.data || []
      
      if (fetchedHubs.length === 0) {
        setError('No hubs found. Make sure your APS account has access to ACC/BIM 360.')
        setProjects([])
        return
      }

      // Store hubs for filter dropdown
      setHubs(fetchedHubs)

      // Get projects from all hubs
      const allProjects: Project[] = []
      
      for (const hub of fetchedHubs) {
        try {
          const projectsResponse = await api.listProjects(hub.id)
          const hubProjects = projectsResponse.data || []
          
          // Get the hub name from attributes
          const hubName = hub.attributes?.name || hub.name || 'Unknown Hub'
          
          // Transform and add hub info to projects
          hubProjects.forEach((proj: any) => {
            allProjects.push({
              id: proj.id,
              name: proj.attributes?.name || 'Unnamed Project',
              status: proj.attributes?.status || 'active',
              description: `Hub: ${hubName}`,
              hubId: hub.id
            })
          })
        } catch (hubError) {
          console.warn(`Failed to load projects from hub ${hub.id}:`, hubError)
        }
      }
      
      if (allProjects.length === 0) {
        setError('No projects found in any hubs.')
      }
      
      setProjects(allProjects)
    } catch (err: any) {
      setError(err.message || 'Failed to load projects. Please try again.')
      console.error('Error loading projects:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter projects based on search query and selected hub
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesHub = selectedHub === 'all' || project.hubId === selectedHub
    
    return matchesSearch && matchesHub
  })

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedHub('all')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-hello-yellow animate-spin mx-auto mb-4" />
          <p className="text-autodesk-gray-700 font-medium">Loading projects...</p>
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
            onClick={loadProjects}
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
      {/* Server Status Banner */}
      <div className="bg-autodesk-black border-l-4 border-hello-yellow rounded p-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Server className="w-5 h-5 text-hello-yellow" />
          <span className="text-autodesk-white">Server Status: <span className="font-semibold text-hello-yellow">{serverStatus}</span></span>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-autodesk-black mb-2">Select a Project</h2>
        <p className="text-autodesk-gray-600">Choose a project to browse its files and models</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border-2 border-autodesk-gray-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-autodesk-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-autodesk-gray-50 border-2 border-autodesk-gray-300 rounded text-autodesk-black placeholder-autodesk-gray-400 focus:outline-none focus:ring-2 focus:ring-hello-yellow focus:border-hello-yellow transition-all"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-autodesk-black text-autodesk-gray-500 transition-colors"
                title="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Hub Filter */}
          <div className="relative">
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              className="w-full px-4 py-3 bg-autodesk-gray-50 border-2 border-autodesk-gray-300 rounded text-autodesk-black focus:outline-none focus:ring-2 focus:ring-hello-yellow focus:border-hello-yellow transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Hubs</option>
              {hubs.map((hub) => (
                <option key={hub.id} value={hub.id}>
                  {hub.attributes?.name || hub.name || 'Unknown Hub'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-autodesk-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-autodesk-gray-600">
            {searchQuery || selectedHub !== 'all' ? (
              <span>
                Found <span className="font-semibold text-autodesk-black">{filteredProjects.length}</span> of {projects.length} project{projects.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
                {selectedHub !== 'all' && ` in ${hubs.find(h => h.id === selectedHub)?.attributes?.name || hubs.find(h => h.id === selectedHub)?.name}`}
              </span>
            ) : (
              <span>
                Total: <span className="font-semibold text-autodesk-black">{projects.length}</span> project{projects.length !== 1 ? 's' : ''} across {hubs.length} hub{hubs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {(searchQuery || selectedHub !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-autodesk-blue hover:text-autodesk-teal font-semibold transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group bg-white border-2 border-autodesk-gray-200 hover:border-hello-yellow rounded-lg p-6 text-left transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-autodesk-black rounded group-hover:bg-hello-yellow transition-colors">
                <FolderOpen className="w-6 h-6 text-hello-yellow group-hover:text-autodesk-black transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-autodesk-black mb-1 truncate group-hover:text-autodesk-black">
                  {project.name}
                </h3>
                {project.description && (
                  <p className="text-sm text-autodesk-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                )}
                {project.status && (
                  <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-autodesk-teal text-white rounded">
                    {project.status}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredProjects.length === 0 && projects.length > 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-autodesk-gray-200">
          <Search className="w-16 h-16 text-autodesk-gray-400 mx-auto mb-4" />
          <p className="text-autodesk-gray-600 mb-4">No projects match your search</p>
          <button
            onClick={handleClearSearch}
            className="px-6 py-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors text-sm"
          >
            Clear search
          </button>
        </div>
      )}

      {projects.length === 0 && !loading && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-autodesk-gray-200">
          <FolderOpen className="w-16 h-16 text-autodesk-gray-400 mx-auto mb-4" />
          <p className="text-autodesk-gray-600">No projects found</p>
        </div>
      )}
    </div>
  )
}

export default ProjectSelector
