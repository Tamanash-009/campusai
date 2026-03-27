import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, GraduationCap, Target, Plus, Trash2, Sparkles, ArrowRight, Rocket, Award, Map } from 'lucide-react'
import { api } from '../utils/api'

export default function CareerPage() {
  const [skills, setSkills] = useState([''])
  const [interests, setInterests] = useState([''])
  const [educationLevel, setEducationLevel] = useState("Bachelor's")
  const [currentRole, setCurrentRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const data = await api.career(
        skills.filter(s => s.trim()),
        interests.filter(i => i.trim()),
        educationLevel,
        currentRole || null
      )
      setResult(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Rocket className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Career Guidance</h1>
          <p className="text-gray-400">Discover your path with AI-powered insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            className="glass rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Target className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Your Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((skill, i) => (
                <div key={i} className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="Skill" 
                    value={skill}
                    onChange={(e) => {
                      const updated = [...skills]
                      updated[i] = e.target.value
                      setSkills(updated)
                    }}
                    className={`${inputClass} w-36`} 
                  />
                  {skills.length > 1 && (
                    <motion.button 
                      onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} 
                      className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
            <motion.button 
              onClick={() => setSkills([...skills, ''])} 
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <Plus size={16} /> Add Skill
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
                <Award className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Your Interests</h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {interests.map((interest, i) => (
                <div key={i} className="flex gap-1">
                  <input 
                    type="text" 
                    placeholder="Interest" 
                    value={interest}
                    onChange={(e) => {
                      const updated = [...interests]
                      updated[i] = e.target.value
                      setInterests(updated)
                    }}
                    className={`${inputClass} w-40`} 
                  />
                  {interests.length > 1 && (
                    <motion.button 
                      onClick={() => setInterests(interests.filter((_, idx) => idx !== i))} 
                      className="p-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  )}
                </div>
              ))}
            </div>
            <motion.button 
              onClick={() => setInterests([...interests, ''])} 
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
              whileHover={{ x: 5 }}
            >
              <Plus size={16} /> Add Interest
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          className="glass rounded-3xl p-6 mb-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Education & Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select 
              value={educationLevel} 
              onChange={(e) => setEducationLevel(e.target.value)}
              className={`${inputClass} cursor-pointer`}
            >
              <option>High School</option>
              <option>Associate's</option>
              <option>Bachelor's</option>
              <option>Master's</option>
              <option>PhD</option>
            </select>
            <input 
              type="text" 
              placeholder="Current Role (optional)" 
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className={inputClass}
            />
          </div>
        </motion.div>

        <motion.button
          onClick={handleSubmit}
          disabled={loading || !skills.some(s => s.trim())}
          className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-amber-500/30"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={20} />
              </motion.div>
              Analyzing your profile...
            </>
          ) : (
            <>
              <Rocket size={20} />
              Get Career Guidance
              <ArrowRight size={20} />
            </>
          )}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {result && (
          <motion.div 
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="glass rounded-3xl p-6 md:p-8 border border-indigo-500/20"
              whileHover={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)' }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Briefcase className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Career Paths</h2>
                  <p className="text-sm text-gray-400">Based on your skills and interests</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.career_paths?.map((path, i) => (
                  <motion.div 
                    key={i} 
                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-3">
                      <Briefcase className="text-white" size={18} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{path.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">{path.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-medium">{path.salary_range}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {path.roles?.slice(0, 3).map((role, j) => (
                        <span key={j} className="px-2 py-1 rounded-lg bg-white/5 text-xs text-gray-400">{role}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="glass rounded-3xl p-6 md:p-8 border border-emerald-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Award className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Recommended Certifications</h2>
                  <p className="text-sm text-gray-400">Boost your career prospects</p>
                </div>
              </div>
              <div className="space-y-3">
                {result.certifications?.map((cert, i) => (
                  <motion.div 
                    key={i} 
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div>
                      <h3 className="font-semibold text-white">{cert.name}</h3>
                      <p className="text-sm text-gray-400">{cert.provider}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-xl text-xs font-medium ${
                      cert.priority === 'High' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {cert.priority} Priority
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="glass rounded-3xl p-6 md:p-8 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Map className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Your Roadmap</h2>
                  <p className="text-sm text-gray-400">Step-by-step career path</p>
                </div>
              </div>
              <div className="relative">
                {result.roadmap?.map((step, i) => (
                  <motion.div 
                    key={i} 
                    className="flex gap-4 mb-6 last:mb-0"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        {step.step}
                      </motion.div>
                      {i < result.roadmap.length - 1 && (
                        <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="font-semibold text-white text-lg">{step.action}</h3>
                      <p className="text-sm text-purple-400 mt-1">{step.duration}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
