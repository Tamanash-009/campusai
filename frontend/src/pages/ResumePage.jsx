import { useState } from 'react'
import { FileText, Plus, Trash2, Copy, Check } from 'lucide-react'
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Resume Builder</h1>

      <div className="space-y-6">
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})}
              className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Education</h2>
          {form.education.map((edu, i) => (
            <div key={i} className="flex gap-3 mb-3">
              <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateField('education', i, 'degree', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateField('education', i, 'institution', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateField('education', i, 'year', e.target.value)}
                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
              {form.education.length > 1 && <button onClick={() => removeItem('education', i)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>}
            </div>
          ))}
          <button onClick={() => addItem('education', { degree: '', institution: '', year: '' })} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
            <Plus size={16} /> Add Education
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((skill, i) => (
              <div key={i} className="flex gap-1">
                <input type="text" placeholder="Skill" value={skill} onChange={(e) => updateSimple('skills', i, e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 w-32" />
                {form.skills.length > 1 && <button onClick={() => removeItem('skills', i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>}
              </div>
            ))}
          </div>
          <button onClick={() => addItem('skills', '')} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm mt-3">
            <Plus size={16} /> Add Skill
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Experience</h2>
          {form.experience.map((exp, i) => (
            <div key={i} className="mb-4 p-4 bg-gray-700 rounded-lg">
              <div className="flex gap-3 mb-2">
                <input type="text" placeholder="Job Title" value={exp.title} onChange={(e) => updateField('experience', i, 'title', e.target.value)}
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
                <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateField('experience', i, 'company', e.target.value)}
                  className="flex-1 bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
                {form.experience.length > 1 && <button onClick={() => removeItem('experience', i)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>}
              </div>
              <textarea placeholder="Description" value={exp.description} onChange={(e) => updateField('experience', i, 'description', e.target.value)}
                className="w-full bg-gray-600 border border-gray-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none" rows={2} />
            </div>
          ))}
          <button onClick={() => addItem('experience', { title: '', company: '', description: '' })} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
            <Plus size={16} /> Add Experience
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Projects</h2>
          {form.projects.map((proj, i) => (
            <div key={i} className="mb-3 flex gap-3">
              <input type="text" placeholder="Project Name" value={proj.name} onChange={(e) => updateField('projects', i, 'name', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
              <input type="text" placeholder="Description" value={proj.description} onChange={(e) => updateField('projects', i, 'description', e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
              {form.projects.length > 1 && <button onClick={() => removeItem('projects', i)} className="text-red-400 hover:text-red-300 p-2"><Trash2 size={18} /></button>}
            </div>
          ))}
          <button onClick={() => addItem('projects', { name: '', description: '' })} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
            <Plus size={16} /> Add Project
          </button>
        </div>

        <button onClick={generateResume} disabled={loading || !form.name || !form.email}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors">
          {loading ? 'Generating Resume...' : 'Generate Resume'}
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2"><FileText size={24} /> Your Resume</h2>
              <button onClick={() => copyToClipboard(result.resume_text)} className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
                {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900 p-4 rounded-lg overflow-x-auto">{result.resume_text}</pre>
          </div>
          {result.ats_optimized && (
            <div className="bg-green-900/30 border border-green-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-green-400 mb-4">ATS-Optimized Version</h2>
              <pre className="whitespace-pre-wrap text-gray-300 bg-gray-900 p-4 rounded-lg overflow-x-auto">{result.ats_optimized}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
