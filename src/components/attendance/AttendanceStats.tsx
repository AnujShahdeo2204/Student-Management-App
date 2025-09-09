import React from 'react'
import { TrendingUp, TrendingDown, Target, Calendar } from 'lucide-react'
import { useAttendance } from '../../hooks/useAttendance'
import { cn } from '../../lib/utils'

export function AttendanceStats() {
  const { subjects, records, getAttendancePercentage } = useAttendance()

  const overallStats = {
    totalSubjects: subjects.length,
    totalClasses: subjects.reduce((sum, s) => sum + s.total_classes, 0),
    totalAttended: subjects.reduce((sum, s) => sum + s.attended_classes, 0),
    averageAttendance: subjects.length > 0 
      ? Math.round(subjects.reduce((sum, s) => sum + getAttendancePercentage(s), 0) / subjects.length)
      : 0
  }

  const subjectsAboveTarget = subjects.filter(s => getAttendancePercentage(s) >= s.required_percentage)
  const subjectsBelowTarget = subjects.filter(s => getAttendancePercentage(s) < s.required_percentage)

  const recentRecords = records.slice(0, 10)

  if (subjects.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No statistics available</h3>
        <p className="text-gray-500">Add subjects and mark attendance to see statistics</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Subjects</p>
              <p className="text-2xl font-bold text-blue-900">{overallStats.totalSubjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Classes Attended</p>
              <p className="text-2xl font-bold text-green-900">
                {overallStats.totalAttended}/{overallStats.totalClasses}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Average Attendance</p>
              <p className="text-2xl font-bold text-purple-900">{overallStats.averageAttendance}%</p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-indigo-600">On Target</p>
              <p className="text-2xl font-bold text-indigo-900">
                {subjectsAboveTarget.length}/{subjects.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Subject Performance</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {subjects.map((subject) => {
              const percentage = getAttendancePercentage(subject)
              const isAboveTarget = percentage >= subject.required_percentage
              
              return (
                <div key={subject.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {isAboveTarget ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{subject.name}</p>
                      <p className="text-sm text-gray-600">
                        {subject.attended_classes}/{subject.total_classes} classes
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={cn(
                      'text-lg font-bold',
                      isAboveTarget ? 'text-green-600' : 'text-red-600'
                    )}>
                      {percentage}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Target: {subject.required_percentage}%
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentRecords.length > 0 && (
        <div className="bg-white border rounded-lg">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {recentRecords.map((record) => {
                const subject = subjects.find(s => s.id === record.subject)
                const statusColors = {
                  present: 'bg-green-100 text-green-800',
                  late: 'bg-yellow-100 text-yellow-800',
                  absent: 'bg-red-100 text-red-800'
                }
                
                return (
                  <div key={record.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        statusColors[record.status]
                      )}>
                        {record.status}
                      </span>
                      <span className="font-medium text-gray-900">
                        {subject?.name || 'Unknown Subject'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}