import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface Todo {
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

export function useTodos() {
  const { user } = useAuth()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('Error fetching todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (todo: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ ...todo, user_id: user?.id }])
        .select()
        .single()

      if (error) throw error
      setTodos(prev => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error adding todo:', error)
      throw error
    }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo))
      return data
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id)
    if (todo) {
      await updateTodo(id, { completed: !todo.completed })
    }
  }

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos
  }
}