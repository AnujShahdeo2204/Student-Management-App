import React, { useState } from 'react'
import { Plus, BookOpen, TrendingUp, AlertTriangle, Calendar, BarChart3 } from 'lucide-react'
import { useAttendance } from '../../hooks/useAttendance'
import { SubjectForm } from './SubjectForm'
import { AttendanceTracker } from './AttendanceTracker'
import { AttendanceStats } from './AttendanceStats'
import { cn } from '../../lib/utils'

export function AttendanceView() {
  const { subjects, loading, getAttendancePercentage, getClassesNeeded, getClassesCanMiss } = useAttendance()
  const [showSubjectForm, setShowSubjectForm] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'tracker' | 'stats'>('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Calculator</h1>
          <p className="text-gray-600">Track your attendance and calculate required classes</p>
        </div>
        <button
          onClick={() => setShowSubjectForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'tracker', label: 'Mark Attendance', icon: Calendar },
              { id: 'stats', label: 'Statistics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              {subjects.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects added</h3>
                  <p className="text-gray-500 mb-4">Add your subjects to start tracking attendance</p>
                  <button
                    onClick={() => setShowSubjectForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Subject
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subjects.map((subject) => {
                    const percentage = getAttendancePercentage(subject)
                    const classesNeeded = getClassesNeeded(subject)
                    const classesCanMiss = getClassesCanMiss(subject)
                    const isLowAttendance = percentage < subject.required_percentage

                    return (
                      <div
                        key={subject.id}
                        className={cn(
                          'bg-white border rounded-lg p-6 hover:shadow-md transition-shadow',
                          isLowAttendance ? 'border-red-200 bg-red-50' : 'border-gray-200'
                        )}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                          {isLowAttendance && (
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Attendance</span>
                            <span className={cn(
                              'font-bold text-lg',
                              isLowAttendance ? 'text-red-600' : 'text-green-600'
                            )}>
                              {percentage}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={cn(
                                'h-2 rounded-full transition-all',
                                isLowAttendance ? 'bg-red-500' : 'bg-green-500'
                              )}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>

                          <div className="text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Present: {subject.attended_classes}</span>
                              <span>Total: {subject.total_classes}</span>
                            </div>
                            <div className="mt-2">
                              Required: {subject.required_percentage}%
                            </div>
                          </div>

                          {classesNeeded > 0 ? (
                            <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                              <p className="text-sm text-red-800">
                                <TrendingUp className="w-4 h-4 inline mr-1" />
                                Attend next <strong>{classesNeeded}</strong> classes to reach {subject.required_percentage}%
                              </p>
                            </div>
                          ) : classesCanMiss > 0 ? (
                            <div className="bg-green-100 border border-green-200 rounded-lg p-3">
                              <p className="text-sm text-green-800">
                                ✅ You can miss <strong>{classesCanMiss}</strong> more classes
                              </p>
                            </div>
                          ) : (
                            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                              <p className="text-sm text-yellow-800">
                                ⚠️ Maintain perfect attendance to stay safe
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tracker' && (
            <AttendanceTracker />
          )}

          {activeTab === 'stats' && (
            <AttendanceStats />
          )}
        </div>
      </div>

      {/* Subject Form Modal */}
      {showSubjectForm && (
        <SubjectForm
          onClose={() => setShowSubjectForm(false)}
        />
      )}
    </div>
  )
}