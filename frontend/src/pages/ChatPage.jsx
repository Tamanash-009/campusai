import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, Zap } from 'lucide-react'
import { api } from '../utils/api'

const suggestions = [
  { icon: '📅', text: 'Exam schedule' },
  { icon: '📚', text: 'Syllabus info' },
  { icon: '💰', text: 'Fee structure' },
  { icon: '🎉', text: 'Campus events' },
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hey there! 👋 I\'m CampusAI, your smart assistant for Brainware University. Ask me anything about timetables, exams, syllabus, fees, events, or anything else!' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (messageText = null) => {
    const text = messageText || input.trim()
    if (!text || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    try {
      const data = await api.chat(text, sessionId)
      if (data.session_id) setSessionId(data.session_id)
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Oops! Something went wrong. Please try again!' 
      }])
    }

    setLoading(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)]">
      <motion.div 
        className="glass rounded-3xl h-full flex flex-col overflow-hidden border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Bot className="text-white" size={24} />
            </motion.div>
            <div>
              <h2 className="font-semibold text-white">CampusAI Assistant</h2>
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-xs text-gray-400">Always here to help</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <motion.div 
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </motion.div>
                  <motion.div 
                    className={`rounded-2xl px-5 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md' 
                        : 'bg-white/10 backdrop-blur-sm text-gray-100 rounded-bl-md border border-white/10'
                    }`}
                    whileHover={{ scale: 1.01 }}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl rounded-bl-md px-5 py-4 border border-white/10">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2.5 h-2.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                        animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && !loading && (
          <motion.div 
            className="px-4 pb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-gray-500 mb-3 text-center">Try asking about:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s, i) => (
                <motion.button
                  key={i}
                  onClick={() => sendMessage(`Tell me about ${s.text}`)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-gray-300 hover:text-white transition-all flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span>{s.icon}</span>
                  {s.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-3 items-end">
            <motion.div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about campus..."
                className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                rows={1}
                whileFocus={{ scale: 1.01 }}
              />
            </motion.div>
            <motion.button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white p-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(99, 102, 241, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <Send size={22} />
            </motion.button>
          </div>
          <p className="text-[10px] text-gray-500 text-center mt-3">
            Powered by <span className="text-indigo-400">Gemini AI</span> • CampusAI for Brainware University
          </p>
        </div>
      </motion.div>
    </div>
  )
}
