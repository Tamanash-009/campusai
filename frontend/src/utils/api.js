const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export const api = {
  async chat(message, sessionId = null) {
    const res = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    })
    return res.json()
  },

  async assignment(question, subject = null, topic = null) {
    const res = await fetch(`${API_URL}/assignment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, subject, topic })
    })
    return res.json()
  },

  async studyPlan(exams, subjects) {
    const res = await fetch(`${API_URL}/study-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ exams, subjects })
    })
    return res.json()
  },

  async resume(data) {
    const res = await fetch(`${API_URL}/resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return res.json()
  },

  async career(skills, interests, educationLevel, currentRole = null) {
    const res = await fetch(`${API_URL}/career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skills, interests, education_level: educationLevel, current_role: currentRole })
    })
    return res.json()
  },

  async uploadDocument(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    })
    return res.json()
  },

  async getDocuments() {
    const res = await fetch(`${API_URL}/documents`)
    return res.json()
  },

  async deleteDocument(docId) {
    const res = await fetch(`${API_URL}/documents/${docId}`, { method: 'DELETE' })
    return res.json()
  },

  async getAnalytics() {
    const res = await fetch(`${API_URL}/analytics`)
    return res.json()
  }
}
