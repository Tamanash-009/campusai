import { useState } from 'react'
import { Calendar, Plus, Trash2, Download } from 'lucide-react'
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

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Study Planner</h1>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Your Subjects
        </h2>
        <div className="space-y-2 mb-4">
          {subjects.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={s}
                onChange={(e) => updateSubject(i, e.target.value)}
                placeholder="Subject name"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(i)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addSubject} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
          <Plus size={16} /> Add Subject
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Exam Schedule</h2>
        <div className="space-y-3 mb-4">
          {exams.map((exam, i) => (
            <div key={i} className="flex gap-3 items-center">
              <input
                type="text"
                value={exam.name}
                onChange={(e) => updateExam(i, 'name', e.target.value)}
                placeholder="Exam name"
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
              />
              <input
                type="date"
                value={exam.date}
                onChange={(e) => updateExam(i, 'date', e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
              />
              {exams.length > 1 && (
                <button onClick={() => removeExam(i)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={addExam} className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm">
          <Plus size={16} /> Add Exam
        </button>
      </div>

      <button
        onClick={generatePlan}
        disabled={loading || !subjects.some(s => s.trim()) || !exams.some(e => e.name && e.date)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors mb-6"
      >
        {loading ? 'Generating plan...' : 'Generate Study Plan'}
      </button>

      {schedule && (
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Study Schedule</h2>
            <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
              <Download size={18} /> Export Calendar
            </button>
          </div>
          <p className="text-gray-400 mb-4">{schedule.summary}</p>
          <div className="space-y-2">
            {schedule.schedule?.slice(0, 14).map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
                <span className="text-sm text-gray-400 w-24">{item.date}</span>
                <span className="font-medium text-indigo-400">{item.subject}</span>
                <span className="text-gray-300 flex-1">{item.topics}</span>
                <span className="text-sm text-gray-400">{item.duration}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
