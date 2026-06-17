import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export interface ChatMessage {
  id: string
  message: string
  response: string
  timestamp: string
  user_id: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

export function useChatbot() {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchMessages()
      fetchFAQs()
    }
  }, [user])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error
      setFaqs(data || [])
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    }
  }

  const findBestMatch = (userMessage: string): FAQ | null => {
    const message = userMessage.toLowerCase()
    let bestMatch: FAQ | null = null
    let highestScore = 0

    for (const faq of faqs) {
      let score = 0
      
      // Check if question contains similar words
      const questionWords = faq.question.toLowerCase().split(' ')
      const messageWords = message.split(' ')
      
      for (const word of messageWords) {
        if (word.length > 3) { // Only check meaningful words
          for (const qWord of questionWords) {
            if (qWord.includes(word) || word.includes(qWord)) {
              score += 1
            }
          }
        }
      }

      // Check keywords
      for (const keyword of faq.keywords) {
        if (message.includes(keyword.toLowerCase())) {
          score += 2
        }
      }

      if (score > highestScore && score > 0) {
        highestScore = score
        bestMatch = faq
      }
    }

    return bestMatch
  }

  const getPersonalizedResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase()

    // Get user's data for personalized responses
    try {
      const [todosResult, subjectsResult, sessionsResult] = await Promise.all([
        supabase.from('todos').select('*').eq('user_id', user?.id),
        supabase.from('subjects').select('*').eq('user_id', user?.id),
        supabase.from('timer_sessions').select('*').eq('user_id', user?.id).eq('completed', true)
      ])

      const todos = todosResult.data || []
      const subjects = subjectsResult.data || []
      const sessions = sessionsResult.data || []

      // Personalized responses based on user data
      if (message.includes('todo') || message.includes('task')) {
        const pendingTodos = todos.filter(t => !t.completed)
        const completedTodos = todos.filter(t => t.completed)
        
        if (message.includes('how many')) {
          return `You have ${pendingTodos.length} pending tasks and ${completedTodos.length} completed tasks. ${pendingTodos.length > 0 ? 'Keep going! 💪' : 'Great job staying on top of your tasks! 🎉'}`
        }
        
        if (message.includes('overdue')) {
          const overdue = pendingTodos.filter(t => t.due_date && new Date(t.due_date) < new Date())
          return overdue.length > 0 
            ? `You have ${overdue.length} overdue tasks. Consider prioritizing them to stay on track! ⏰`
            : `No overdue tasks! You're doing great with time management! ✅`
        }
      }

      if (message.includes('attendance')) {
        if (subjects.length === 0) {
          return "You haven't added any subjects yet. Go to the Attendance section to add your subjects and start tracking! 📚"
        }
        
        const totalSubjects = subjects.length
        const goodAttendance = subjects.filter(s => {
          const percentage = s.total_classes > 0 ? (s.attended_classes / s.total_classes) * 100 : 0
          return percentage >= s.required_percentage
        }).length

        return `You're tracking ${totalSubjects} subjects. ${goodAttendance} out of ${totalSubjects} subjects have good attendance. ${goodAttendance === totalSubjects ? 'Excellent work! 🌟' : 'Keep it up! 📈'}`
      }

      if (message.includes('focus') || message.includes('timer') || message.includes('pomodoro')) {
        const completedSessions = sessions.filter(s => s.type === 'focus').length
        const totalFocusTime = completedSessions * 25 // Assuming 25min sessions
        
        return `You've completed ${completedSessions} focus sessions, totaling ${totalFocusTime} minutes of focused work! ${completedSessions > 10 ? 'You\'re a focus champion! 🏆' : 'Keep building that focus habit! 🎯'}`
      }

    } catch (error) {
      console.error('Error getting personalized data:', error)
    }

    return ''
  }

  const sendMessage = async (userMessage: string) => {
    setLoading(true)
    
    try {
      let response = ''
      
      // First try to get personalized response
      const personalizedResponse = await getPersonalizedResponse(userMessage)
      if (personalizedResponse) {
        response = personalizedResponse
      } else {
        // Fall back to FAQ matching
        const matchedFAQ = findBestMatch(userMessage)
        if (matchedFAQ) {
          response = matchedFAQ.answer
        } else {
          response = "I'm not sure how to help with that specific question. You can ask me about your todos, attendance, focus sessions, or general study tips! 🤔"
        }
      }

      // Save the conversation
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([{
          message: userMessage,
          response,
          user_id: user?.id,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      
      setMessages(prev => [data, ...prev])
      return response
    } catch (error) {
      console.error('Error sending message:', error)
      return "Sorry, I encountered an error. Please try again! 😅"
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user?.id)

      if (error) throw error
      setMessages([])
    } catch (error) {
      console.error('Error clearing history:', error)
    }
  }

  return {
    messages,
    faqs,
    loading,
    sendMessage,
    clearHistory,
    refetch: fetchMessages
  }
}