import React, { useState } from 'react'
import { Plus, Filter, Search } from 'lucide-react'
import { useTodos, Todo } from '../../hooks/useTodos'
import { TodoItem } from './TodoItem'
import { TodoForm } from './TodoForm'
import { cn } from '../../lib/utils'

type FilterType = 'all' | 'pending' | 'completed'
type CategoryType = Todo['category'] | 'all'

export function TodoList() {
  const { todos, loading, addTodo, updateTodo, deleteTodo, toggleTodo } = useTodos()
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !todo.completed) ||
      (filter === 'completed' && todo.completed)
    
    const matchesCategory = categoryFilter === 'all' || todo.category === categoryFilter
    
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         todo.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesFilter && matchesCategory && matchesSearch
  })

  const pendingCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  const handleSubmit = async (todoData: Omit<Todo, 'id' | 'created_at' | 'user_id'>) => {
    try {
      if (editingTodo) {
        await updateTodo(editingTodo.id, todoData)
        setEditingTodo(null)
      } else {
        await addTodo(todoData)
      }
      setShowForm(false)
    } catch (error) {
      console.error('Error saving todo:', error)
    }
  }

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingTodo(null)
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          <p className="text-gray-600">Stay organized and productive</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <div className="w-6 h-6 bg-orange-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <div className="w-6 h-6 bg-green-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{todos.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
          </div>
          {(['all', 'pending', 'completed'] as FilterType[]).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                filter === filterType
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          {(['all', 'academic', 'personal', 'work', 'health', 'other'] as CategoryType[]).map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                categoryFilter === category
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-3">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first task'}
            </p>
            {!searchQuery && filter === 'all' && categoryFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </button>
            )}
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id)}
              onEdit={() => handleEdit(todo)}
              onDelete={() => deleteTodo(todo.id)}
            />
          ))
        )}
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  )
}