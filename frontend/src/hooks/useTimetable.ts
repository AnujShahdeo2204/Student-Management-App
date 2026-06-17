import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface TimetableEvent {
  id: string
  title: string
  description: string
  location: string
  day_of_week: number
  start_time: string
  end_time: string
  color: string
  created_at: string
  user_id: string
}

export function useTimetable() {
  const { user } = useAuth()
  const [events, setEvents] = useState<TimetableEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('timetable_events')
        .select('*')
        .eq('user_id', user?.id)
        .order('day_of_week', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const addEvent = async (event: Omit<TimetableEvent, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('timetable_events')
        .insert([{ ...event, user_id: user?.id }])
        .select()
        .single()

      if (error) throw error
      setEvents(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error adding event:', error)
      throw error
    }
  }

  const updateEvent = async (id: string, updates: Partial<TimetableEvent>) => {
    try {
      const { data, error } = await supabase
        .from('timetable_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setEvents(prev => prev.map(event => event.id === id ? data : event))
      return data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('timetable_events')
        .delete()
        .eq('id', id)

      if (error) throw error
      setEvents(prev => prev.filter(event => event.id !== id))
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  const getEventsForDay = (dayOfWeek: number) => {
    return events
      .filter(event => event.day_of_week === dayOfWeek)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsForDay,
    refetch: fetchEvents
  }
}