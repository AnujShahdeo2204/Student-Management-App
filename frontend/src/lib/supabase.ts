import { createClient } from '@supabase/supabase-js'
import { localSeedData, localSeedUser } from './localSeed'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export const isLocalSupabaseFallback = !(supabaseUrl && supabaseAnonKey)

type AnyRecord = Record<string, any>
type Store = Record<keyof typeof localSeedData, AnyRecord[]>

const STORE_KEY = 'student-manager-local-store'
const SESSION_KEY = 'student-manager-local-session'
const LOGGED_OUT_KEY = 'student-manager-local-signed-out'
const authListeners = new Set<(event: string, session: any) => void>()

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `local-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`

const nowIso = () => new Date().toISOString()

const loadStore = (): Store => {
  const raw = globalThis.localStorage?.getItem(STORE_KEY)
  if (raw) {
    return JSON.parse(raw) as Store
  }

  const seeded = clone(localSeedData) as Store
  globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(seeded))
  return seeded
}

const saveStore = (store: Store) => {
  globalThis.localStorage?.setItem(STORE_KEY, JSON.stringify(store))
}

const getDefaultSession = () => ({
  user: clone(localSeedUser),
  access_token: 'local-demo-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: null,
  refresh_token: 'local-demo-refresh-token',
})

const getStoredSession = () => {
  const raw = globalThis.localStorage?.getItem(SESSION_KEY)
  if (raw) {
    return JSON.parse(raw)
  }

  if (globalThis.localStorage?.getItem(LOGGED_OUT_KEY) === 'true') {
    return null
  }

  const session = getDefaultSession()
  globalThis.localStorage?.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

const setStoredSession = (session: any) => {
  if (session) {
    globalThis.localStorage?.setItem(SESSION_KEY, JSON.stringify(session))
    globalThis.localStorage?.removeItem(LOGGED_OUT_KEY)
  } else {
    globalThis.localStorage?.removeItem(SESSION_KEY)
    globalThis.localStorage?.setItem(LOGGED_OUT_KEY, 'true')
  }

  for (const listener of authListeners) {
    listener(session ? 'SIGNED_IN' : 'SIGNED_OUT', session)
  }
}

const matches = (row: AnyRecord, filters: Array<{ column: string; value: any }>) =>
  filters.every(filter => row[filter.column] === filter.value)

class LocalQueryBuilder {
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select'
  private filters: Array<{ column: string; value: any }> = []
  private orderColumn: string | null = null
  private orderAscending = true
  private limitCount: number | null = null
  private singleResult = false
  private payload: AnyRecord[] = []
  private updates: AnyRecord = {}

  constructor(private readonly table: keyof typeof localSeedData) {}

  select() {
    this.operation = 'select'
    return this
  }

  insert(rows: AnyRecord[]) {
    this.operation = 'insert'
    this.payload = rows
    return this
  }

  update(updates: AnyRecord) {
    this.operation = 'update'
    this.updates = updates
    return this
  }

  delete() {
    this.operation = 'delete'
    return this
  }

  eq(column: string, value: any) {
    this.filters.push({ column, value })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderColumn = column
    this.orderAscending = options?.ascending ?? true
    return this
  }

  limit(count: number) {
    this.limitCount = count
    return this
  }

  single() {
    this.singleResult = true
    return this
  }

  then(onfulfilled?: any, onrejected?: any) {
    return this.execute().then(onfulfilled, onrejected)
  }

  private execute() {
    return Promise.resolve().then(() => {
      const store = loadStore()
      const tableData = [...(store[this.table] ?? [])]

      if (this.operation === 'insert') {
        const inserted = this.payload.map(row => ({
          ...row,
          id: row.id ?? generateId(),
          created_at: row.created_at ?? nowIso(),
        }))

        store[this.table] = [...tableData, ...inserted]
        saveStore(store)

        return {
          data: this.singleResult ? inserted[0] ?? null : inserted,
          error: null,
        }
      }

      const filtered = tableData.filter(row => matches(row, this.filters))

      if (this.operation === 'update') {
        const updated = tableData.map(row =>
          matches(row, this.filters) ? { ...row, ...this.updates } : row,
        )

        store[this.table] = updated
        saveStore(store)

        const result = updated.filter(row => matches(row, this.filters))
        return {
          data: this.singleResult ? result[0] ?? null : result,
          error: result.length === 0 ? new Error(`No rows found in ${this.table}`) : null,
        }
      }

      if (this.operation === 'delete') {
        store[this.table] = tableData.filter(row => !matches(row, this.filters))
        saveStore(store)
        return { data: null, error: null }
      }

      let results = [...filtered]

      if (this.orderColumn) {
        results.sort((left, right) => {
          const leftValue = left[this.orderColumn as string]
          const rightValue = right[this.orderColumn as string]

          if (leftValue === rightValue) return 0
          return (leftValue > rightValue ? 1 : -1) * (this.orderAscending ? 1 : -1)
        })
      }

      if (this.limitCount !== null) {
        results = results.slice(0, this.limitCount)
      }

      return {
        data: this.singleResult ? results[0] ?? null : results,
        error: null,
      }
    })
  }
}

const localSupabase = {
  auth: {
    async getSession() {
      return { data: { session: getStoredSession() }, error: null }
    },
    onAuthStateChange(callback: (event: string, session: any) => void) {
      authListeners.add(callback)
      return {
        data: {
          subscription: {
            unsubscribe() {
              authListeners.delete(callback)
            },
          },
        },
      }
    },
    async signOut() {
      setStoredSession(null)
      return { error: null }
    },
    async restoreDemoSession() {
      const session = getDefaultSession()
      setStoredSession(session)
      return { data: { session }, error: null }
    },
  },
  from(table: string) {
    return new LocalQueryBuilder(table as keyof typeof localSeedData)
  },
}

export const supabase = isLocalSupabaseFallback
  ? (localSupabase as any)
  : createClient(supabaseUrl as string, supabaseAnonKey as string)

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
