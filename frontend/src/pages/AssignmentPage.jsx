import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, BookOpen, AlertCircle, Send, Sparkles, ArrowRight } from 'lucide-react'
import { api } from '../utils/api'

export default function AssignmentPage() {
  const [question, setQuestion] = useState('')
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setLoading(true)
    setResult(null)
    try {
      const data = await api.assignment(question, subject || null, topic || null)
      setResult(data)
    } catch (error) {
      setResult({ guidance: 'Error getting help. Please try again.', steps: [], tips: [] })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BookOpen className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Assignment Helper</h1>
          <p className="text-gray-400">Get step-by-step guidance without the direct answers</p>
        </div>
        
        <motion.form 
          onSubmit={handleSubmit} 
          className="glass rounded-3xl p-6 md:p-8 mb-8 border border-white/10"
          whileHover={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.1)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-purple-400" /> Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g., Computer Science"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-pink-400" /> Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Sorting Algorithms"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
              <AlertCircle size={14} className="text-indigo-400" /> Assignment Question
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Paste your assignment question here and I'll help you understand how to approach it..."
              rows={5}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
              required
            />
          </motion.div>
          
          <motion.button
            type="submit"
            disabled={loading || !question.trim()}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30"
            whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles size={20} />
                </motion.div>
                Getting guidance...
              </>
            ) : (
              <>
                <Lightbulb size={20} />
                Get Assignment Guidance
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </motion.form>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="glass rounded-3xl p-6 md:p-8 border border-yellow-500/20"
              whileHover={{ boxShadow: '0 0 40px rgba(250, 204, 21, 0.1)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Lightbulb className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Guidance</h2>
                  <p className="text-xs text-gray-400">Step-by-step approach</p>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{result.guidance}</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="glass rounded-3xl p-6 border border-indigo-500/20"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <BookOpen className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Steps to Follow</h3>
                </div>
                <ol className="space-y-3">
                  {result.steps?.map((step, i) => (
                    <motion.li 
                      key={i} 
                      className="flex gap-3 text-gray-300 items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>

              <motion.div 
                className="glass rounded-3xl p-6 border border-orange-500/20"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                whileHover={{ boxShadow: '0 0 40px rgba(249, 115, 22, 0.1)' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <AlertCircle className="text-white" size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Tips & Pitfalls</h3>
                </div>
                <ul className="space-y-3">
                  {result.tips?.map((tip, i) => (
                    <motion.li 
                      key={i} 
                      className="flex gap-3 text-gray-300 items-start"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 + i * 0.1 }}
                    >
                      <span className="flex-shrink-0 w-2 h-2 bg-orange-400 rounded-full mt-2"></span>
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
