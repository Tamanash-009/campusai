import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, Trash2, Download, Sparkles, ArrowRight, Clock, BookOpen } from 'lucide-react'
import { api } from '../utils/api'

export default function StudyPlannerPage() {
  const [subjects, setSubjects] = useState([''])
  const [exams, setExams] = useState([{ name: '', date: '' }])
  const [loading, setLoading] = useState(false)
  const [schedule, setSchedule] = useState(null)

  const addSubject = () => setSubjects([...subjects, ''])
  const removeSubject = (i) => setSubjects(subjects.filter((_, idx) => idx !== i))
  const updateSubject = (i, val) => {
    const updated = [...subjects]
    updated[i] = val
    setSubjects(updated)
  }

  const addExam = () => setExams([...exams, { name: '', date: '' }])
  const removeExam = (i) => setExams(exams.filter((_, idx) => idx !== i))
  const updateExam = (i, field, val) => {
    const updated = [...exams]
    updated[i][field] = val
    setExams(updated)
  }

  const generatePlan = async () => {
    const validExams = exams.filter(e => e.name && e.date)
    const validSubjects = subjects.filter(s => s.trim())
    
    if (!validExams.length || !validSubjects.length) return
    
    setLoading(true)
    try {
      const data = await api.studyPlan(validExams, validSubjects)
      setSchedule(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const colors = ['from-cyan-500 to-blue-500', 'from-purple-500 to-pink-500', 'from-indigo-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500']

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Calendar className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Study Planner</h1>
          <p className="text-gray-400">AI-powered personalized study schedules</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            className="glass rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Your Subjects</h2>
            </div>
            <div className="space-y-3 mb-4">
              {subjects.map((s, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <input
                    type="text"
                    value={s}
                    onChange={(e) => updateSubject(i, e.target.value)}
                    placeholder="Subject name"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                  {subjects.length > 1 && (
                    <motion.button 
                      onClick={() => removeSubject(i)} 
                      className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.button 
              onClick={addSubject} 
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <Plus size={16} /> Add Subject
            </motion.button>
          </motion.div>

          <motion.div 
            className="glass rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Exam Schedule</h2>
            </div>
            <div className="space-y-3 mb-4">
              {exams.map((exam, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-2 items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) => updateExam(i, 'name', e.target.value)}
                    placeholder="Exam name"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  <input
                    type="date"
                    value={exam.date}
                    onChange={(e) => updateExam(i, 'date', e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  />
                  {exams.length > 1 && (
                    <motion.button 
                      onClick={() => removeExam(i)} 
                      className="p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>
            <motion.button 
              onClick={addExam} 
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <Plus size={16} /> Add Exam
            </motion.button>
          </motion.div>
        </div>

        <motion.button
          onClick={generatePlan}
          disabled={loading || !subjects.some(s => s.trim()) || !exams.some(e => e.name && e.date)}
          className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:via-blue-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/30"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(6, 182, 212, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={20} />
              </motion.div>
              Creating your schedule...
            </>
          ) : (
            <>
              <Calendar size={20} />
              Generate Study Plan
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {schedule && (
          <motion.div 
            className="mt-8 glass rounded-3xl p-6 md:p-8 border border-white/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Calendar size={20} />
                  </div>
                  Your Study Schedule
                </h2>
                <p className="text-gray-400 mt-1">{schedule.summary}</p>
              </div>
              <motion.button 
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                Export Calendar
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {schedule.schedule?.slice(0, 14).map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className={`w-24 h-10 rounded-xl bg-gradient-to-r ${colors[i % colors.length]} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-sm font-bold text-white">{item.date?.split('-').pop() || 'Day'}</span>
                  </div>
                  <div className="flex-1">
                    <span className="font-bold text-white">{item.subject}</span>
                    <p className="text-sm text-gray-400">{item.topics}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} />
                    {item.duration}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
