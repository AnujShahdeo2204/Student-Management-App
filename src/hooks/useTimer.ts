import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export type SessionType = 'focus' | 'short_break' | 'long_break'

export interface TimerSession {
  id: string
  type: SessionType
  duration: number
  completed: boolean
  start_time: string
  end_time: string | null
  created_at: string
  user_id: string
}

export function useTimer() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<TimerSession[]>([])
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [sessionType, setSessionType] = useState<SessionType>('focus')
  const [settings, setSettings] = useState({
    focus: 25,
    short_break: 5,
    long_break: 15
  })
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user])

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            completeSession()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const startSession = async () => {
    if (isRunning) return

    const duration = settings[sessionType]
    setTimeLeft(duration * 60)
    setIsRunning(true)

    try {
      const { data, error } = await supabase
        .from('timer_sessions')
        .insert([{
          type: sessionType,
          duration,
          completed: false,
          start_time: new Date().toISOString(),
          user_id: user?.id
        }])
        .select()
        .single()

      if (error) throw error
      setCurrentSession(data)
    } catch (error) {
      console.error('Error starting session:', error)
    }
  }

  const pauseSession = () => {
    setIsRunning(false)
  }

  const resetSession = async () => {
    setIsRunning(false)
    setTimeLeft(settings[sessionType] * 60)
    
    if (currentSession && !currentSession.completed) {
      try {
        await supabase
          .from('timer_sessions')
          .delete()
          .eq('id', currentSession.id)
      } catch (error) {
        console.error('Error deleting incomplete session:', error)
      }
    }
    
    setCurrentSession(null)
  }

  const completeSession = async () => {
    setIsRunning(false)
    
    if (currentSession) {
      try {
        const { data, error } = await supabase
          .from('timer_sessions')
          .update({
            completed: true,
            end_time: new Date().toISOString()
          })
          .eq('id', currentSession.id)
          .select()
          .single()

        if (error) throw error
        
        setSessions(prev => [data, ...prev.filter(s => s.id !== data.id)])
        setCurrentSession(null)
        
        // Auto-switch session type
        if (sessionType === 'focus') {
          const completedFocusSessions = sessions.filter(s => s.type === 'focus' && s.completed).length + 1
          setSessionType(completedFocusSessions % 4 === 0 ? 'long_break' : 'short_break')
        } else {
          setSessionType('focus')
        }
        
        setTimeLeft(settings[sessionType === 'focus' ? 'short_break' : 'focus'] * 60)
      } catch (error) {
        console.error('Error completing session:', error)
      }
    }
  }

  const switchSessionType = (type: SessionType) => {
    if (isRunning) return
    
    setSessionType(type)
    setTimeLeft(settings[type] * 60)
  }

  const updateSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    if (!isRunning) {
      setTimeLeft(newSettings[sessionType] * 60)
    }
  }

  const getProgress = () => {
    const totalTime = settings[sessionType] * 60
    return totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0
  }

  const getCompletedSessions = () => {
    return sessions.filter(s => s.completed && s.type === 'focus').length
  }

  return {
    sessions,
    currentSession,
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
    getCompletedSessions,
    refetch: fetchSessions
  }
}