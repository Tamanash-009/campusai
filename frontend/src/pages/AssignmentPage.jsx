import { useState } from 'react'
import { Lightbulb, BookOpen, AlertCircle } from 'lucide-react'
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
    try {
      const data = await api.assignment(question, subject || null, topic || null)
      setResult(data)
    } catch (error) {
      setResult({ guidance: 'Error getting help. Please try again.' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assignment Helper</h1>
      
      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Computer Science"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Sorting Algorithms"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Assignment Question</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Paste your assignment question here..."
            rows={5}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 resize-none"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          {loading ? 'Getting guidance...' : 'Get Assignment Guidance'}
        </button>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="text-yellow-400" size={24} />
              <h2 className="text-xl font-semibold">Guidance</h2>
            </div>
            <p className="whitespace-pre-wrap text-gray-300">{result.guidance}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="text-indigo-400" size={24} />
                <h3 className="text-lg font-semibold">Steps to Follow</h3>
              </div>
              <ol className="space-y-2">
                {result.steps?.map((step, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-orange-400" size={24} />
                <h3 className="text-lg font-semibold">Tips & Pitfalls</h3>
              </div>
              <ul className="space-y-2">
                {result.tips?.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span className="text-orange-400">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
