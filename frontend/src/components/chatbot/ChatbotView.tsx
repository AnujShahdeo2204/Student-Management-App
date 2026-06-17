import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Trash2, HelpCircle } from 'lucide-react'
import { useChatbot } from '../../hooks/useChatbot'
import { cn } from '../../lib/utils'

export function ChatbotView() {
  const { messages, loading, sendMessage, clearHistory } = useChatbot()
  const [inputMessage, setInputMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')

    // Add user message to chat
    const userChatMessage = {
      id: Date.now().toString(),
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, userChatMessage])

    // Get bot response
    const response = await sendMessage(userMessage)
    
    // Add bot response to chat
    const botChatMessage = {
      id: (Date.now() + 1).toString(),
      text: response,
      isUser: false,
      timestamp: new Date()
    }
    setChatMessages(prev => [...prev, botChatMessage])
  }

  const handleClearChat = () => {
    setChatMessages([])
    clearHistory()
  }

  const quickQuestions = [
    "How many tasks do I have?",
    "What's my attendance status?",
    "How many focus sessions have I completed?",
    "Any overdue tasks?",
    "Study tips for better focus",
    "How to improve attendance?"
  ]

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Study Assistant</h1>
            <p className="text-sm text-gray-600">Ask me about your tasks, attendance, or study tips!</p>
          </div>
        </div>
        
        <button
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Clear chat history"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {chatMessages.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hi! I'm your Study Assistant 👋</h3>
            <p className="text-gray-600 mb-6">
              I can help you with information about your tasks, attendance, focus sessions, and provide study tips!
            </p>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-sm font-medium text-gray-700 mb-3">Try asking me:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(question)}
                    className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm"
                  >
                    <HelpCircle className="w-4 h-4 inline mr-2 text-indigo-500" />
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start space-x-3',
                  message.isUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                    message.isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={cn(
                    'text-xs mt-1',
                    message.isUser ? 'text-indigo-200' : 'text-gray-500'
                  )}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.isUser && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}