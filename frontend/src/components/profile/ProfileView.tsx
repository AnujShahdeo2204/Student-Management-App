import React from 'react'
import { User, Mail, Calendar, Trophy, Target, Clock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTodos } from '../../hooks/useTodos'
import { useTimer } from '../../hooks/useTimer'

export function ProfileView() {
  const { user, signOut } = useAuth()
  const { todos } = useTodos()
  const { getCompletedSessions, settings } = useTimer()

  const completedTodos = todos.filter(t => t.completed).length
  const pendingTodos = todos.filter(t => !t.completed).length
  const completedSessions = getCompletedSessions()
  const totalFocusTime = completedSessions * settings.focus

  const stats = [
    {
      label: 'Completed Tasks',
      value: completedTodos,
      icon: Target,
      color: 'text-green-600 bg-green-100'
    },
    {
      label: 'Pending Tasks',
      value: pendingTodos,
      icon: Target,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      label: 'Focus Sessions',
      value: completedSessions,
      icon: Trophy,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      label: 'Focus Time',
      value: `${totalFocusTime}m`,
      icon: Clock,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your account and view your progress</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.user_metadata?.full_name || 'Student'}
            </h2>
            <div className="flex items-center text-gray-600 mt-1">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center text-gray-600 mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Joined {new Date(user?.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive notifications about your tasks and sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Dark Mode</h4>
              <p className="text-sm text-gray-600">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-900">Data Export</h4>
              <p className="text-sm text-gray-600">Download your data as JSON</p>
            </div>
            <button className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-600">Sign out of your account</p>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}