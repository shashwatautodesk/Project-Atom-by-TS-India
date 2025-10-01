import { useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Calendar, Filter } from 'lucide-react'

interface TimelineControlsProps {
  onDateChange: (date: Date) => void
  onFilterChange: (filter: string) => void
  onPlayPause: (playing: boolean) => void
}

function TimelineControls({ onDateChange, onFilterChange, onPlayPause }: TimelineControlsProps) {
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)

  const handleDateChange = (dateString: string) => {
    setCurrentDate(dateString)
    onDateChange(new Date(dateString))
  }

  const handlePlayPause = () => {
    const newPlaying = !isPlaying
    setIsPlaying(newPlaying)
    onPlayPause(newPlaying)
  }

  const handleStepBackward = () => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() - 7) // Step back 1 week
    const newDate = date.toISOString().split('T')[0]
    setCurrentDate(newDate)
    onDateChange(date)
  }

  const handleStepForward = () => {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + 7) // Step forward 1 week
    const newDate = date.toISOString().split('T')[0]
    setCurrentDate(newDate)
    onDateChange(date)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    onFilterChange(newFilter)
  }

  return (
    <div className="bg-autodesk-black text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-hello-yellow" />
          4D Timeline Controls
        </h3>
        <span className="text-xs bg-autodesk-teal px-3 py-1 rounded-full font-semibold">
          {isPlaying ? '▶ PLAYING' : '⏸ PAUSED'}
        </span>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={handleStepBackward}
          className="p-3 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 rounded transition-colors"
          title="Step back 1 week"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={handlePlayPause}
          className="p-3 bg-hello-yellow hover:bg-yellow-400 text-autodesk-black rounded transition-colors flex-shrink-0"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        <button
          onClick={handleStepForward}
          className="p-3 bg-autodesk-gray-700 hover:bg-autodesk-gray-600 rounded transition-colors"
          title="Step forward 1 week"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        <div className="flex-1 ml-4">
          <label className="block text-xs text-autodesk-gray-300 mb-1">Playback Speed</label>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="w-full px-3 py-2 bg-autodesk-gray-700 border-2 border-autodesk-gray-600 rounded text-sm focus:outline-none focus:border-hello-yellow"
          >
            <option value={0.5}>0.5x (Slow)</option>
            <option value={1}>1x (Normal)</option>
            <option value={2}>2x (Fast)</option>
            <option value={5}>5x (Very Fast)</option>
          </select>
        </div>
      </div>

      {/* Date Selector */}
      <div className="mb-4">
        <label className="block text-xs text-autodesk-gray-300 mb-1">Current Date</label>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full px-4 py-3 bg-autodesk-gray-700 border-2 border-autodesk-gray-600 rounded text-white text-lg font-semibold focus:outline-none focus:border-hello-yellow"
        />
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-xs text-autodesk-gray-300 mb-1 flex items-center gap-1">
          <Filter className="w-3 h-3" />
          Show Elements
        </label>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full px-3 py-2 bg-autodesk-gray-700 border-2 border-autodesk-gray-600 rounded text-sm focus:outline-none focus:border-hello-yellow"
        >
          <option value="all">All Elements</option>
          <option value="scheduled">Scheduled for this Date</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="delayed">Delayed</option>
        </select>
      </div>

      {/* Legend */}
      <div className="bg-autodesk-gray-800 rounded-lg p-3">
        <h4 className="text-xs font-bold text-autodesk-gray-400 mb-2">Status Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded"></div>
            <span>Not Started</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Delayed</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 text-xs text-autodesk-gray-400 bg-autodesk-gray-800 rounded p-3">
        <p>
          <span className="font-semibold text-hello-yellow">Tip:</span> Click elements in the 3D view to assign schedule properties.
          Use Play to animate construction progress over time.
        </p>
      </div>
    </div>
  )
}

export default TimelineControls

