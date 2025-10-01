import { useState } from 'react'
import ProjectSelector from './components/ProjectSelector'
import FileBrowser from './components/FileBrowser'
import Viewer from './components/Viewer'
import LandingPage from './components/LandingPage'
import { Project, ProjectFile } from './types'
import Logo from './components/Logo'

function App() {
  const [hasEntered, setHasEntered] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null)

  const handleProjectSelect = (project: Project) => {
    console.log('Selected project:', project)
    setSelectedProject(project)
    setSelectedFile(null)
  }

  const handleFileSelect = (file: ProjectFile) => {
    setSelectedFile(file)
  }

  const handleBack = () => {
    if (selectedFile) {
      setSelectedFile(null)
    } else if (selectedProject) {
      setSelectedProject(null)
    }
  }

  const handleGoHome = () => {
    setHasEntered(false)
    setSelectedProject(null)
    setSelectedFile(null)
  }

  // Show landing page first
  if (!hasEntered) {
    return <LandingPage onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen bg-autodesk-white">
      {/* Header */}
      <header className="bg-autodesk-black border-b-4 border-hello-yellow sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleGoHome}
              className="flex items-center space-x-4 group cursor-pointer hover:opacity-80 transition-opacity"
              title="Return to Landing Page"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo size="medium" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-autodesk-white flex items-center gap-2">
                  Project <span className="text-hello-yellow group-hover:text-yellow-400 transition-colors">Atom</span>
                </h1>
                <p className="text-xs text-autodesk-gray-300">
                  Powered by Autodesk Platform Services
                </p>
                <p className="text-xs text-autodesk-teal mt-0.5">
                  Developed by Autodesk India Technical Sales
                </p>
              </div>
            </button>
            {(selectedProject || selectedFile) && (
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black font-semibold rounded transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
          {selectedProject && (
            <div className="mt-3 pt-3 border-t border-autodesk-gray-700">
              <span className="text-sm text-autodesk-gray-400">Current Project:</span>{' '}
              <span className="font-semibold text-hello-yellow">{selectedProject.name}</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedProject ? (
          <ProjectSelector onSelectProject={handleProjectSelect} />
        ) : !selectedFile ? (
          <FileBrowser 
            projectId={selectedProject.id}
            hubId={selectedProject.hubId || ''}
            onSelectFile={handleFileSelect} 
          />
        ) : (
          <Viewer file={selectedFile} projectId={selectedProject.id} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-4 border-hello-yellow bg-autodesk-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center gap-3 mb-3 group cursor-pointer hover:opacity-80 transition-opacity"
              title="Return to Landing Page"
            >
              <div className="transform group-hover:scale-110 transition-transform duration-300">
                <Logo size="small" />
              </div>
              <p className="text-autodesk-white font-bold text-lg">
                Project <span className="text-hello-yellow group-hover:text-yellow-400 transition-colors">Atom</span>
              </p>
            </button>
            <p className="text-autodesk-gray-400 text-sm mb-2">
              Powered by Autodesk Platform Services
            </p>
            <p className="text-autodesk-teal text-sm mb-3">
              Developed by Autodesk India Technical Sales
            </p>
            <p className="text-autodesk-gray-400 text-xs italic mb-3">
              For more details contact{' '}
              <a 
                href="mailto:shashwat.bahrdwaj@autodesk.com" 
                className="text-hello-yellow hover:text-yellow-400 underline transition-colors"
              >
                shashwat.bahrdwaj@autodesk.com
              </a>
            </p>
            <p className="text-autodesk-gray-500 text-xs">
              © {new Date().getFullYear()} Autodesk, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
