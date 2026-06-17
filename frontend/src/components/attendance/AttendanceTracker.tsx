import React, { useState } from 'react'
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useAttendance } from '../../hooks/useAttendance'
import { cn } from '../../lib/utils'

export function AttendanceTracker() {
  const { subjects, markAttendance } = useAttendance()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState<string | null>(null)

  const handleMarkAttendance = async (subjectId: string, status: 'present' | 'absent' | 'late') => {
    setLoading(subjectId)
    try {
      await markAttendance(subjectId, status, selectedDate)
    } catch (error) {
      console.error('Error marking attendance:', error)
    } finally {
      setLoading(null)
    }
  }

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects to track</h3>
        <p className="text-gray-500">Add subjects first to start marking attendance</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Date Selector */}
      <div className="flex items-center space-x-4">
        <Calendar className="w-5 h-5 text-gray-500" />
        <label className="text-sm font-medium text-gray-700">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Subjects List */}
      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                <p className="text-sm text-gray-600">
                  Current: {subject.attended_classes}/{subject.total_classes} classes
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleMarkAttendance(subject.id, 'present')}
                disabled={loading === subject.id}
                className={cn(
                  'flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors',
                  'bg-green-100 text-green-800 hover:bg-green-200',
                  loading === subject.id && 'opacity-50 cursor-not-allowed'
                )}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Present
              </button>

              <button
                onClick={() => handleMarkAttendance(subject.id, 'late')}
                disabled={loading === subject.id}
                className={cn(
                  'flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors',
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
                  loading === subject.id && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Clock className="w-4 h-4 mr-2" />
                Late
              </button>

              <button
                onClick={() => handleMarkAttendance(subject.id, 'absent')}
                disabled={loading === subject.id}
                className={cn(
                  'flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors',
                  'bg-red-100 text-red-800 hover:bg-red-200',
                  loading === subject.id && 'opacity-50 cursor-not-allowed'
                )}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Absent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}