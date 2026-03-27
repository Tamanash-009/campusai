import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, BarChart3, Users } from 'lucide-react'
import { api } from '../utils/api'

export default function AdminPage() {
  const [documents, setDocuments] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const docs = await api.getDocuments()
    const stats = await api.getAnalytics()
    setDocuments(docs || [])
    setAnalytics(stats)
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await api.uploadDocument(file)
      await loadData()
    } catch (error) {
      console.error('Upload failed:', error)
    }
    setUploading(false)
  }

  const handleDelete = async (docId) => {
    try {
      await api.deleteDocument(docId)
      await loadData()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="text-indigo-400" size={24} />
            <span className="text-gray-400">Documents</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.total_documents || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="text-green-400" size={24} />
            <span className="text-gray-400">Chats Today</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.total_chats_today || 0}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-purple-400" size={24} />
            <span className="text-gray-400">Active Users</span>
          </div>
          <p className="text-3xl font-bold">{analytics?.total_users || 0}</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
        <p className="text-gray-400 text-sm mb-4">
          Upload PDF documents (syllabus, timetables, notices) to build the RAG knowledge base.
        </p>
        <label className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 rounded-lg cursor-pointer transition-colors">
          <Upload size={20} />
          {uploading ? 'Uploading...' : 'Choose PDF File'}
          <input type="file" accept=".pdf" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Uploaded Documents</h2>
        {documents.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No documents uploaded yet</p>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="text-indigo-400" size={24} />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-400">
                      {doc.chunks_count} chunks • {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(doc.id)} className="text-red-400 hover:text-red-300 p-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
