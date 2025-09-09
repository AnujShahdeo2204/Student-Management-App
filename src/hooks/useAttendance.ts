import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface AttendanceRecord {
  id: string
  subject: string
  date: string
  status: 'present' | 'absent' | 'late'
  created_at: string
  user_id: string
}

export interface Subject {
  id: string
  name: string
  total_classes: number
  attended_classes: number
  required_percentage: number
  user_id: string
  created_at: string
}

export function useAttendance() {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSubjects()
      fetchRecords()
    }
  }, [user])

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user?.id)
        .order('name', { ascending: true })

      if (error) throw error
      setSubjects(data || [])
    } catch (error) {
      console.error('Error fetching subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false })

      if (error) throw error
      setRecords(data || [])
    } catch (error) {
      console.error('Error fetching records:', error)
    }
  }

  const addSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'user_id' | 'total_classes' | 'attended_classes'>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ 
          ...subject, 
          user_id: user?.id,
          total_classes: 0,
          attended_classes: 0
        }])
        .select()
        .single()

      if (error) throw error
      setSubjects(prev => [...prev, data])
      return data
    } catch (error) {
      console.error('Error adding subject:', error)
      throw error
    }
  }

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setSubjects(prev => prev.map(subject => subject.id === id ? data : subject))
      return data
    } catch (error) {
      console.error('Error updating subject:', error)
      throw error
    }
  }

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSubjects(prev => prev.filter(subject => subject.id !== id))
    } catch (error) {
      console.error('Error deleting subject:', error)
      throw error
    }
  }

  const markAttendance = async (subjectId: string, status: 'present' | 'absent' | 'late', date: string) => {
    try {
      // Add attendance record
      const { data: record, error: recordError } = await supabase
        .from('attendance_records')
        .insert([{
          subject: subjectId,
          date,
          status,
          user_id: user?.id
        }])
        .select()
        .single()

      if (recordError) throw recordError

      // Update subject statistics
      const subject = subjects.find(s => s.id === subjectId)
      if (subject) {
        const newTotalClasses = subject.total_classes + 1
        const newAttendedClasses = status === 'present' || status === 'late' 
          ? subject.attended_classes + 1 
          : subject.attended_classes

        await updateSubject(subjectId, {
          total_classes: newTotalClasses,
          attended_classes: newAttendedClasses
        })
      }

      setRecords(prev => [record, ...prev])
      return record
    } catch (error) {
      console.error('Error marking attendance:', error)
      throw error
    }
  }

  const getAttendancePercentage = (subject: Subject) => {
    if (subject.total_classes === 0) return 0
    return Math.round((subject.attended_classes / subject.total_classes) * 100)
  }

  const getClassesNeeded = (subject: Subject) => {
    const currentPercentage = getAttendancePercentage(subject)
    if (currentPercentage >= subject.required_percentage) return 0
    
    const requiredClasses = Math.ceil(
      (subject.required_percentage * subject.total_classes - subject.attended_classes * 100) /
      (100 - subject.required_percentage)
    )
    
    return Math.max(0, requiredClasses)
  }

  const getClassesCanMiss = (subject: Subject) => {
    const currentPercentage = getAttendancePercentage(subject)
    if (currentPercentage < subject.required_percentage) return 0
    
    const canMiss = Math.floor(
      (subject.attended_classes * 100 - subject.required_percentage * subject.total_classes) /
      subject.required_percentage
    )
    
    return Math.max(0, canMiss)
  }

  return {
    subjects,
    records,
    loading,
    addSubject,
    updateSubject,
    deleteSubject,
    markAttendance,
    getAttendancePercentage,
    getClassesNeeded,
    getClassesCanMiss,
    refetch: () => {
      fetchSubjects()
      fetchRecords()
    }
  }
}