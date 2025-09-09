import React, { useState } from 'react'
import { Play, Pause, RotateCcw, Settings, History } from 'lucide-react'
import { useTimer, SessionType } from '../../hooks/useTimer'
import { TimerSettings } from './TimerSettings'
import { SessionHistory } from './SessionHistory'
import { formatTime, cn } from '../../lib/utils'

const SESSION_TYPES: { type: SessionType; label: string; color: string; icon: string }[] = [
  { type: 'focus', label: 'Focus', color: 'bg-indigo-600', icon: '🧠' },
  { type: 'short_break', label: 'Short Break', color: 'bg-green-600', icon: '☕' },
  { type: 'long_break', label: 'Long Break', color: 'bg-purple-600', icon: '🌴' }
]

export function TimerView() {
  const {
    timeLeft,
    isRunning,
    sessionType,
    settings,
    startSession,
    pauseSession,
    resetSession,
    switchSessionType,
    updateSettings,
    getProgress,
    getCompletedSessions
  } = useTimer()

  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = getProgress()
  const completedSessions = getCompletedSessions()

  const currentSessionConfig = SESSION_TYPES.find(s => s.type === sessionType)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Focus Timer</h1>
          <p className="text-gray-600">Stay focused with the Pomodoro technique</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHistory(true)}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Session History"
          >
            <History className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            title="Timer Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <div className="w-6 h-6 bg-indigo-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Focus Time</p>
              <p className="text-2xl font-bold text-gray-900">{completedSessions * settings.focus}m</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Type</h2>
        <div className="grid grid-cols-3 gap-4">
          {SESSION_TYPES.map((session) => (
            <button
              key={session.type}
              onClick={() => switchSessionType(session.type)}
              disabled={isRunning}
              className={cn(
                'p-4 rounded-lg border-2 transition-all text-center',
                sessionType === session.type
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300',
                isRunning && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="text-2xl mb-2">{session.icon}</div>
              <div className="font-medium text-gray-900">{session.label}</div>
              <div className="text-sm text-gray-600">
                {settings[session.type]}m
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Progress Ring */}
            <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${progress * 283} 283`}
                className={cn(
                  'transition-all duration-1000',
                  currentSessionConfig?.color.replace('bg-', 'text-') || 'text-indigo-600'
                )}
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
                {formatTime(minutes, seconds)}
              </div>
              <div className="text-lg font-medium text-gray-600">
                {currentSessionConfig?.label}
              </div>
              {isRunning && (
                <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Active
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4 mt-8">
            <button
              onClick={resetSession}
              disabled={!isRunning && timeLeft === settings[sessionType] * 60}
              className="p-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-6 h-6" />
            </button>

            <button
              onClick={isRunning ? pauseSession : startSession}
              className={cn(
                'p-4 rounded-full text-white transition-all transform hover:scale-105',
                currentSessionConfig?.color || 'bg-indigo-600'
              )}
            >
              {isRunning ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>

            <button
              onClick={() => {/* Skip session */}}
              disabled={!isRunning}
              className="p-3 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Skip"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Focus Mode Card */}
      {isRunning && sessionType === 'focus' && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center">
            <div className="text-3xl mr-4">🧠</div>
            <div>
              <h3 className="text-lg font-semibold">Focus Mode Active</h3>
              <p className="text-indigo-100">
                Stay focused and avoid distractions. You've got this!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <TimerSettings
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <SessionHistory onClose={() => setShowHistory(false)} />
      )}
    </div>
  )
}