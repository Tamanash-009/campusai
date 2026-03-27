import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, Trash2, BarChart3, Users, Database, Sparkles, Shield, Check, AlertCircle } from 'lucide-react'
import { api } from '../utils/api'

export default function AdminPage() {
  const [documents, setDocuments] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

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
    setUploadProgress(0)
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 90))
    }, 200)

    try {
      await api.uploadDocument(file)
      setUploadProgress(100)
      await loadData()
    } catch (error) {
      console.error('Upload failed:', error)
    }

    clearInterval(progressInterval)
    setTimeout(() => {
      setUploading(false)
      setUploadProgress(0)
    }, 1000)
  }

  const handleDelete = async (docId) => {
    try {
      await api.deleteDocument(docId)
      await loadData()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const statCards = [
    { icon: FileText, label: 'Documents', value: analytics?.total_documents || 0, gradient: 'from-indigo-500 to-purple-500' },
    { icon: BarChart3, label: 'Chats Today', value: analytics?.total_chats_today || 0, gradient: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Active Users', value: analytics?.total_users || 0, gradient: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Shield className="text-white" size={32} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your RAG knowledge base</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <motion.div 
              key={stat.label}
              className="glass rounded-3xl p-6 border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)' }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                  <stat.icon className="text-white" size={26} />
                </div>
                <div>
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="glass rounded-3xl p-6 md:p-8 mb-8 border border-indigo-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Upload className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Document</h2>
              <p className="text-sm text-gray-400">Build your RAG knowledge base</p>
            </div>
          </div>
          
          <p className="text-gray-400 text-sm mb-6">
            Upload PDF documents (syllabus, timetables, notices) to enable AI-powered Q&A with your university data.
          </p>
          
          <label className="block relative cursor-pointer">
            <motion.div 
              className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-white/20 hover:border-indigo-500/50 transition-all bg-white/5"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {uploading ? (
                <>
                  <motion.div 
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="text-white" size={28} />
                  </motion.div>
                  <p className="text-white font-medium">Uploading...</p>
                  <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <Upload className="text-white" size={28} />
                  </div>
                  <p className="text-white font-medium">Click to upload PDF</p>
                  <p className="text-sm text-gray-400">or drag and drop</p>
                </>
              )}
            </motion.div>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleUpload} 
              className="hidden" 
              disabled={uploading} 
            />
          </label>
        </motion.div>

        <motion.div 
          className="glass rounded-3xl p-6 md:p-8 border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Database className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Uploaded Documents</h2>
              <p className="text-sm text-gray-400">{documents.length} documents in knowledge base</p>
            </div>
          </div>
          
          {documents.length === 0 ? (
            <motion.div 
              className="flex flex-col items-center justify-center py-12 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <FileText className="text-gray-500" size={36} />
              </div>
              <p className="text-gray-400 mb-2">No documents uploaded yet</p>
              <p className="text-sm text-gray-500">Upload PDF files above to build your knowledge base</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc, i) => (
                <motion.div 
                  key={doc.id} 
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <FileText className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{doc.name}</p>
                      <p className="text-sm text-gray-400 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-white/10 text-xs">{doc.chunks_count} chunks</span>
                        <span>•</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                  <motion.button 
                    onClick={() => handleDelete(doc.id)} 
                    className="p-3 rounded-xl bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
