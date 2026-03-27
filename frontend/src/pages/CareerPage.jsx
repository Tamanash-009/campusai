import { useState } from 'react'
import { Briefcase, GraduationCap, Target, Plus, Trash2 } from 'lucide-react'
import { api } from '../utils/api'

export default function CareerPage() {
  const [skills, setSkills] = useState([''])
  const [interests, setInterests] = useState([''])
  const [educationLevel, setEducationLevel] = useState('Bachelor\'s')
  const [currentRole, setCurrentRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const updateList = (setter, val, i) => {
    const updated = [...val]
    updated[i] = setter === setSkills ? skills[i] : interests[i]
    if (setter === setSkills) {
      updated[i] = skills[i]
      const newVal = [...skills]
      newVal[i] = e.target.value
      setSkills(newVal)
    }
  }

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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Career Guidance</h1>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Target size={20} /> Your Skills
        </h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.map((skill, i) => (
            <div key={i} className="flex gap-1">
              <input type="text" placeholder="Skill" value={skill}
                onChange={(e) => {
                  const updated = [...skills]
                  updated[i] = e.target.value
                  setSkills(updated)
                }}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 w-32" />
              {skills.length > 1 && <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>
        <button onClick={() => setSkills([...skills, ''])} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Your Interests</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((interest, i) => (
            <div key={i} className="flex gap-1">
              <input type="text" placeholder="Interest" value={interest}
                onChange={(e) => {
                  const updated = [...interests]
                  updated[i] = e.target.value
                  setInterests(updated)
                }}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 w-40" />
              {interests.length > 1 && <button onClick={() => setInterests(interests.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>}
            </div>
          ))}
        </div>
        <button onClick={() => setInterests([...interests, ''])} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
          <Plus size={16} /> Add Interest
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <GraduationCap size={20} /> Education Level
        </h2>
        <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500">
          <option>High School</option>
          <option>Associate's</option>
          <option>Bachelor's</option>
          <option>Master's</option>
          <option>PhD</option>
        </select>
        <input type="text" placeholder="Current Role (optional)" value={currentRole}
          onChange={(e) => setCurrentRole(e.target.value)}
          className="w-full mt-4 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500" />
      </div>

      <button onClick={handleSubmit} disabled={loading || !skills.some(s => s.trim())}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors mb-6">
        {loading ? 'Getting guidance...' : 'Get Career Guidance'}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={24} /> Career Paths
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.career_paths?.map((path, i) => (
                <div key={i} className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-semibold text-indigo-400 mb-2">{path.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{path.description}</p>
                  <div className="text-xs text-gray-500">
                    <span className="text-green-400">{path.salary_range}</span>
                    <div className="mt-2">Roles: {path.roles?.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Recommended Certifications</h2>
            <div className="space-y-3">
              {result.certifications?.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-medium">{cert.name}</h3>
                    <p className="text-sm text-gray-400">{cert.provider}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    cert.priority === 'High' ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'
                  }`}>
                    {cert.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Your Roadmap</h2>
            <div className="space-y-4">
              {result.roadmap?.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    {i < result.roadmap.length - 1 && <div className="w-0.5 h-full bg-gray-600 mt-2"></div>}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-medium text-lg">{step.action}</h3>
                    <p className="text-sm text-gray-400">{step.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
