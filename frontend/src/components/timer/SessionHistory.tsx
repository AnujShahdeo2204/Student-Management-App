import React from 'react'
import { X, Clock, Calendar } from 'lucide-react'
import { useTimer } from '../../hooks/useTimer'
import { formatDate } from '../../lib/utils'

interface SessionHistoryProps {
  onClose: () => void
}

const SESSION_ICONS = {
  focus: '🧠',
  short_break: '☕',
  long_break: '🌴'
}

const SESSION_COLORS = {
  focus: 'bg-indigo-100 text-indigo-800',
  short_break: 'bg-green-100 text-green-800',
  long_break: 'bg-purple-100 text-purple-800'
}

export function SessionHistory({ onClose }: SessionHistoryProps) {
  const { sessions } = useTimer()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Session History</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
              <p className="text-gray-500">Start your first focus session to see your history here</p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-2xl">{SESSION_ICONS[session.type]}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SESSION_COLORS[session.type]}`}>
                        {session.type.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {session.duration} minutes
                      </span>
                      {session.completed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Incomplete
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(new Date(session.start_time))}</span>
                      <Clock className="w-4 h-4 ml-4 mr-1" />
                      <span>
                        {new Date(session.start_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {session.end_time && (
                          <> - {new Date(session.end_time).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}