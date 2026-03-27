import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Plus, Trash2, Copy, Check, Sparkles, ArrowRight, User, GraduationCap, Briefcase, Award } from 'lucide-react'
import { api } from '../utils/api'

export default function ResumePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    education: [{ degree: '', institution: '', year: '' }],
    experience: [{ title: '', company: '', description: '' }],
    skills: [''],
    projects: [{ name: '', description: '' }],
    certifications: ['']
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const updateField = (section, index, field, val) => {
    const updated = [...form[section]]
    updated[index][field] = val
    setForm({ ...form, [section]: updated })
  }

  const updateSimple = (section, index, val) => {
    const updated = [...form[section]]
    updated[index] = val
    setForm({ ...form, [section]: updated })
  }

  const addItem = (section, template) => setForm({ ...form, [section]: [...form[section], template] })
  const removeItem = (section, i) => setForm({ ...form, [section]: form[section].filter((_, idx) => idx !== i) })

  const generateResume = async () => {
    setLoading(true)
    try {
      const data = await api.resume({
        ...form,
        skills: form.skills.filter(s => s.trim()),
        certifications: form.certifications.filter(c => c.trim())
      })
      setResult(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <FileText className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Resume Builder</h1>
          <p className="text-gray-400">Professional resume with ATS optimization</p>
        </div>

        <motion.div 
          className="glass rounded-3xl p-6 md:p-8 mb-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className={inputClass} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={inputClass} />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className={inputClass} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <motion.div 
            className="glass rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <GraduationCap className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Education</h2>
            </div>
            {form.education.map((edu, i) => (
              <div key={i} className="flex flex-wrap gap-2 mb-3">
                <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateField('education', i, 'degree', e.target.value)} className={`${inputClass} flex-1 min-w-[120px]`} />
                <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateField('education', i, 'institution', e.target.value)} className={`${inputClass} flex-1 min-w-[120px]`} />
                <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateField('education', i, 'year', e.target.value)} className={`${inputClass} w-24`} />
                {form.education.length > 1 && <motion.button onClick={() => removeItem('education', i)} className="p-3 rounded-xl bg-red-500/20 text-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Trash2 size={18} /></motion.button>}
              </div>
            ))}
            <motion.button onClick={() => addItem('education', { degree: '', institution: '', year: '' })} className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1" whileHover={{ x: 5 }}>
              <Plus size={16} /> Add Education
            </motion.button>
          </motion.div>

          <motion.div 
            className="glass rounded-3xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Award className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-bold text-white">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, i) => (
                <div key={i} className="flex gap-1">
                  <input type="text" placeholder="Skill" value={skill} onChange={(e) => updateSimple('skills', i, e.target.value)} className={`${inputClass} w-32`} />
                  {form.skills.length > 1 && <motion.button onClick={() => removeItem('skills', i)} className="text-red-400 hover:text-red-300" whileHover={{ scale: 1.1 }}><Trash2 size={16} /></motion.button>}
                </div>
              ))}
            </div>
            <motion.button onClick={() => addItem('skills', '')} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium flex items-center gap-1 mt-3" whileHover={{ x: 5 }}>
              <Plus size={16} /> Add Skill
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          className="glass rounded-3xl p-6 mb-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Briefcase className="text-white" size={20} />
            </div>
            <h2 className="text-lg font-bold text-white">Experience</h2>
          </div>
          {form.experience.map((exp, i) => (
            <motion.div 
              key={i} 
              className="mb-4 p-4 rounded-2xl bg-white/5 border border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex flex-wrap gap-2 mb-2">
                <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateField('experience', i, 'title', e.target.value)} className={`${inputClass} flex-1 min-w-[150px]`} />
                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateField('experience', i, 'company', e.target.value)} className={`${inputClass} flex-1 min-w-[150px]`} />
                {form.experience.length > 1 && <motion.button onClick={() => removeItem('experience', i)} className="p-3 rounded-xl bg-red-500/20 text-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Trash2 size={18} /></motion.button>}
              </div>
              <textarea placeholder="Description" value={exp.description} onChange={(e) => updateField('experience', i, 'description', e.target.value)} className={`${inputClass} resize-none`} rows={2} />
            </motion.div>
          ))}
          <motion.button onClick={() => addItem('experience', { title: '', company: '', description: '' })} className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center gap-1" whileHover={{ x: 5 }}>
            <Plus size={16} /> Add Experience
          </motion.button>
        </motion.div>

        <motion.div 
          className="glass rounded-3xl p-6 mb-6 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Projects</h2>
          {form.projects.map((proj, i) => (
            <div key={i} className="flex flex-wrap gap-2 mb-3">
              <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => updateField('projects', i, 'name', e.target.value)} className={`${inputClass} flex-1 min-w-[150px]`} />
              <input type="text" placeholder="Description" value={proj.description} onChange={(e) => updateField('projects', i, 'description', e.target.value)} className={`${inputClass} flex-1 min-w-[150px]`} />
              {form.projects.length > 1 && <motion.button onClick={() => removeItem('projects', i)} className="p-3 rounded-xl bg-red-500/20 text-red-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}><Trash2 size={18} /></motion.button>}
            </div>
          ))}
          <motion.button onClick={() => addItem('projects', { name: '', description: '' })} className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-1" whileHover={{ x: 5 }}>
            <Plus size={16} /> Add Project
          </motion.button>
        </motion.div>

        <motion.button
          onClick={generateResume}
          disabled={loading || !form.name || !form.email}
          className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-pink-500/30"
          whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.4)' }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Sparkles size={20} />
              </motion.div>
              Generating resume...
            </>
          ) : (
            <>
              <FileText size={20} />
              Generate Professional Resume
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
              className="glass rounded-3xl p-6 md:p-8 border border-pink-500/20"
              whileHover={{ boxShadow: '0 0 40px rgba(236, 72, 153, 0.1)' }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  Your Resume
                </h2>
                <motion.button 
                  onClick={() => copyToClipboard(result.resume_text)} 
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />} 
                  {copied ? 'Copied!' : 'Copy'}
                </motion.button>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300 bg-black/30 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-white/10">{result.resume_text}</pre>
            </motion.div>
            
            {result.ats_optimized && (
              <motion.div 
                className="glass rounded-3xl p-6 md:p-8 border border-emerald-500/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  ATS-Optimized Version
                </h2>
                <pre className="whitespace-pre-wrap text-gray-300 bg-black/30 p-6 rounded-2xl overflow-x-auto font-mono text-sm leading-relaxed border border-white/10">{result.ats_optimized}</pre>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
