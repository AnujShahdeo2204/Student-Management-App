import { createClient } from '@supabase/supabase-js'

// ✅ Use environment variables (recommended for security)
// fallback to actual values if not provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kbucnonovfrnyrwelzil.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidWNub25vdmZybnlyd2VsemlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNDMyMTcsImV4cCI6MjA3MjYxOTIxN30.Jv-ftoxATxyRpAhmzUxxqYUvbtMuIpoU-d_Yi1qhrTc'

// ✅ Create a typed client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ✅ Define your database schema
export type Database = {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string
          title: string
          description: string
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          category: 'academic' | 'personal' | 'work' | 'health' | 'other'
          due_date: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          category?: 'academic' | 'personal' | 'work' | 'health' | 'other'
          due_date?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          category?: 'academic' | 'personal' | 'work' | 'health' | 'other'
          due_date?: string | null
          created_at?: string
          user_id?: string
        }
      }
      timetable_events: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description?: string
          location?: string
          day_of_week: number
          start_time: string
          end_time: string
          color?: string
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          location?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          color?: string
          created_at?: string
          user_id?: string
        }
      }
      timer_sessions: {
        Row: {
          id: string
          type: 'focus' | 'short_break' | 'long_break'
          duration: number
          completed: boolean
          start_time: string
          end_time: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          type: 'focus' | 'short_break' | 'long_break'
          duration: number
          completed?: boolean
          start_time: string
          end_time?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          type?: 'focus' | 'short_break' | 'long_break'
          duration?: number
          completed?: boolean
          start_time?: string
          end_time?: string | null
          created_at?: string
          user_id?: string
        }
      }
    }
  }
}
