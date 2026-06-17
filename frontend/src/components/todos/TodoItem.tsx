import React from 'react'
import { Calendar, MapPin, Edit2, Trash2 } from 'lucide-react'
import { Todo } from '../../hooks/useTodos'
import { formatDate, isOverdue, isToday } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface TodoItemProps {
  todo: Todo
  onToggle: () => void
  onEdit: () => void
  onDelete: () => void
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-red-100 text-red-800 border-red-200'
}

const categoryColors = {
  academic: 'bg-blue-100 text-blue-800',
  personal: 'bg-purple-100 text-purple-800',
  work: 'bg-orange-100 text-orange-800',
  health: 'bg-green-100 text-green-800',
  other: 'bg-gray-100 text-gray-800'
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const dueDateStatus = todo.due_date ? (
    isOverdue(todo.due_date) && !todo.completed ? 'overdue' :
    isToday(todo.due_date) ? 'today' : 'upcoming'
  ) : null

  return (
    <div className={cn(
      'bg-white rounded-lg border shadow-sm p-4 transition-all hover:shadow-md',
      todo.completed && 'opacity-75'
    )}>
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={cn(
            'mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
            todo.completed
              ? 'bg-indigo-600 border-indigo-600'
              : 'border-gray-300 hover:border-indigo-400'
          )}
        >
          {todo.completed && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={cn(
                'text-lg font-medium',
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              )}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={cn(
                  'mt-1 text-sm',
                  todo.completed ? 'line-through text-gray-400' : 'text-gray-600'
                )}>
                  {todo.description}
                </p>
              )}

              {/* Tags */}
              <div className="flex items-center space-x-2 mt-3">
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                  priorityColors[todo.priority]
                )}>
                  {todo.priority} priority
                </span>
                
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  categoryColors[todo.category]
                )}>
                  {todo.category}
                </span>

                {todo.due_date && (
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    dueDateStatus === 'overdue' ? 'bg-red-100 text-red-800' :
                    dueDateStatus === 'today' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  )}>
                    <Calendar className="w-3 h-3 mr-1" />
                    {dueDateStatus === 'today' ? 'Due Today' : formatDate(new Date(todo.due_date))}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={onEdit}
                className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                title="Edit task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}