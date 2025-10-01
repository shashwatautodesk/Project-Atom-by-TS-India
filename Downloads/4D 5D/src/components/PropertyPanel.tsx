import { useState, useEffect } from 'react'
import { Element4DProperties, SelectedElement } from '../types'
import { X, Save, Calendar, Clock, User, Tag, FileText, Database } from 'lucide-react'

interface PropertyPanelProps {
  selectedElement: SelectedElement | null
  onClose: () => void
  onSave: (properties: Element4DProperties) => void
  onSyncToDatabase: (properties: Element4DProperties) => void
}

function PropertyPanel({ selectedElement, onClose, onSave, onSyncToDatabase }: PropertyPanelProps) {
  const [properties, setProperties] = useState<Element4DProperties>({
    elementId: '',
    elementName: '',
    status: 'not-started',
    progress: 0
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    if (selectedElement) {
      setProperties(selectedElement.properties || {
        elementId: selectedElement.dbId.toString(),
        elementName: selectedElement.name,
        externalId: selectedElement.externalId,
        status: 'not-started',
        progress: 0
      })
    }
  }, [selectedElement])

  if (!selectedElement) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(properties)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSyncToDatabase = async () => {
    setIsSyncing(true)
    try {
      await onSyncToDatabase(properties)
    } finally {
      setIsSyncing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'delayed': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l-4 border-autodesk-blue shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-autodesk-black text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">4D Properties</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-autodesk-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-autodesk-gray-300">
          Element: <span className="text-hello-yellow font-semibold">{selectedElement.name}</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Element Info */}
        <div className="bg-autodesk-gray-50 border-2 border-autodesk-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-bold text-autodesk-black mb-3 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Element Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-autodesk-gray-600">ID:</span>{' '}
              <span className="font-semibold">{selectedElement.dbId}</span>
            </div>
            {selectedElement.externalId && (
              <div>
                <span className="text-autodesk-gray-600">External ID:</span>{' '}
                <span className="font-mono text-xs">{selectedElement.externalId}</span>
              </div>
            )}
          </div>
        </div>

        {/* Schedule Information */}
        <div className="bg-white border-2 border-autodesk-blue rounded-lg p-4">
          <h3 className="text-sm font-bold text-autodesk-black mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-autodesk-blue" />
            Schedule
          </h3>
          
          <div className="space-y-3">
            {/* Scheduled Start Date */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Scheduled Start Date
              </label>
              <input
                type="date"
                value={properties.scheduledStartDate || ''}
                onChange={(e) => setProperties({ ...properties, scheduledStartDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-blue focus:outline-none text-sm"
              />
            </div>

            {/* Scheduled End Date */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Scheduled End Date
              </label>
              <input
                type="date"
                value={properties.scheduledEndDate || ''}
                onChange={(e) => setProperties({ ...properties, scheduledEndDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-blue focus:outline-none text-sm"
              />
            </div>

            {/* Actual Start Date */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Actual Start Date
              </label>
              <input
                type="date"
                value={properties.actualStartDate || ''}
                onChange={(e) => setProperties({ ...properties, actualStartDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-blue focus:outline-none text-sm"
              />
            </div>

            {/* Actual End Date */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Actual End Date
              </label>
              <input
                type="date"
                value={properties.actualEndDate || ''}
                onChange={(e) => setProperties({ ...properties, actualEndDate: e.target.value })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-blue focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Status & Progress */}
        <div className="bg-white border-2 border-autodesk-teal rounded-lg p-4">
          <h3 className="text-sm font-bold text-autodesk-black mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-autodesk-teal" />
            Status & Progress
          </h3>
          
          <div className="space-y-3">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Status
              </label>
              <div className="flex gap-2 mb-2">
                <div className={`h-2 w-2 rounded-full ${getStatusColor(properties.status || 'not-started')}`} />
                <span className="text-xs capitalize">{properties.status?.replace('-', ' ')}</span>
              </div>
              <select
                value={properties.status || 'not-started'}
                onChange={(e) => setProperties({ ...properties, status: e.target.value as any })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-teal focus:outline-none text-sm"
              >
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Progress: {properties.progress || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={properties.progress || 0}
                onChange={(e) => setProperties({ ...properties, progress: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="mt-2 bg-autodesk-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-autodesk-teal h-full transition-all"
                  style={{ width: `${properties.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white border-2 border-autodesk-orange rounded-lg p-4">
          <h3 className="text-sm font-bold text-autodesk-black mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-autodesk-orange" />
            Project Details
          </h3>
          
          <div className="space-y-3">
            {/* Phase */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Construction Phase
              </label>
              <input
                type="text"
                value={properties.phase || ''}
                onChange={(e) => setProperties({ ...properties, phase: e.target.value })}
                placeholder="e.g., Foundation, Structure, MEP"
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-orange focus:outline-none text-sm"
              />
            </div>

            {/* Discipline */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Discipline
              </label>
              <select
                value={properties.discipline || ''}
                onChange={(e) => setProperties({ ...properties, discipline: e.target.value })}
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-orange focus:outline-none text-sm"
              >
                <option value="">Select discipline...</option>
                <option value="architectural">Architectural</option>
                <option value="structural">Structural</option>
                <option value="mechanical">Mechanical</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="civil">Civil</option>
              </select>
            </div>

            {/* Contractor */}
            <div>
              <label className="block text-xs font-semibold text-autodesk-gray-600 mb-1">
                Contractor
              </label>
              <input
                type="text"
                value={properties.contractor || ''}
                onChange={(e) => setProperties({ ...properties, contractor: e.target.value })}
                placeholder="Contractor name"
                className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-orange focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white border-2 border-autodesk-gray-300 rounded-lg p-4">
          <h3 className="text-sm font-bold text-autodesk-black mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-autodesk-gray-600" />
            Notes
          </h3>
          <textarea
            value={properties.notes || ''}
            onChange={(e) => setProperties({ ...properties, notes: e.target.value })}
            placeholder="Add any additional notes or comments..."
            rows={4}
            className="w-full px-3 py-2 border-2 border-autodesk-gray-300 rounded focus:border-autodesk-black focus:outline-none text-sm resize-none"
          />
        </div>

        {/* Database Info */}
        {properties.databaseRecordId && (
          <div className="bg-autodesk-gray-50 border-2 border-autodesk-gray-300 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-autodesk-gray-600">
              <Database className="w-4 h-4" />
              <span>Database Record ID: <span className="font-mono font-semibold">{properties.databaseRecordId}</span></span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white pt-4 pb-2 space-y-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full px-4 py-3 bg-autodesk-blue hover:bg-blue-600 text-white font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Properties'}
          </button>
          
          <button
            onClick={handleSyncToDatabase}
            disabled={isSyncing}
            className="w-full px-4 py-3 bg-autodesk-teal hover:bg-teal-600 text-white font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Database className="w-4 h-4" />
            {isSyncing ? 'Syncing...' : 'Sync to Database'}
          </button>

          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-autodesk-gray-200 hover:bg-autodesk-gray-300 text-autodesk-black font-semibold rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyPanel

