import React, { useState } from 'react'
import { Plus, Clock, MapPin, Edit2, Trash2 } from 'lucide-react'
import { useTimetable, TimetableEvent } from '../../hooks/useTimetable'
import { EventForm } from './EventForm'
import { cn } from '../../lib/utils'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`)

export function TimetableView() {
  const { events, loading, addEvent, updateEvent, deleteEvent, getEventsForDay } = useTimetable()
  const [selectedDay, setSelectedDay] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<TimetableEvent | null>(null)

  const handleSubmit = async (eventData: Omit<TimetableEvent, 'id' | 'created_at' | 'user_id'>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData)
        setEditingEvent(null)
      } else {
        await addEvent(eventData)
      }
      setShowForm(false)
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const handleEdit = (event: TimetableEvent) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setEditingEvent(null)
    setShowForm(false)
  }

  const handleDelete = async (event: TimetableEvent) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      await deleteEvent(event.id)
    }
  }

  const dayEvents = getEventsForDay(selectedDay)

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
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">Organize your weekly schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Day Selector */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex space-x-2 overflow-x-auto">
          {DAYS.map((day, index) => (
            <button
              key={day}
              onClick={() => setSelectedDay(index)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors',
                selectedDay === index
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Events for Selected Day */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {DAYS[selectedDay]} Schedule
          </h2>
          <p className="text-sm text-gray-600">
            {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>

        <div className="p-4">
          {dayEvents.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
              <p className="text-gray-500 mb-4">
                Add your first event for {DAYS[selectedDay]}
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={() => handleEdit(event)}
                  onDelete={() => handleDelete(event)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <EventForm
          event={editingEvent}
          selectedDay={selectedDay}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  )
}

interface EventCardProps {
  event: TimetableEvent
  onEdit: () => void
  onDelete: () => void
}

function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: event.color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{event.title}</h3>
          
          <div className="flex items-center text-sm text-gray-600 mt-1">
            <Clock className="w-4 h-4 mr-1" />
            <span>{event.start_time} - {event.end_time}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{event.location}</span>
            </div>
          )}
          
          {event.description && (
            <p className="text-sm text-gray-600 mt-2">{event.description}</p>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Edit event"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}