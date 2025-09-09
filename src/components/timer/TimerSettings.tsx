import React, { useState } from 'react'
import { X } from 'lucide-react'

interface TimerSettingsProps {
  settings: {
    focus: number
    short_break: number
    long_break: number
  }
  onSave: (settings: { focus: number; short_break: number; long_break: number }) => void
  onClose: () => void
}

export function TimerSettings({ settings, onSave, onClose }: TimerSettingsProps) {
  const [formData, setFormData] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Timer Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Duration (minutes)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={formData.focus}
                onChange={(e) => setFormData({ ...formData, focus: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">{formData.focus}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Break Duration (minutes)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={formData.short_break}
                onChange={(e) => setFormData({ ...formData, short_break: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">{formData.short_break}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Break Duration (minutes)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={formData.long_break}
                onChange={(e) => setFormData({ ...formData, long_break: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="w-12 text-center font-medium">{formData.long_break}</span>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}