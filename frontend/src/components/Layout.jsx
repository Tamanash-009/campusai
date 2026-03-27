import { MessageCircle, BookOpen, Calendar, FileText, Briefcase, Shield, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { path: '/', icon: MessageCircle, label: 'Chat' },
  { path: '/assignment', icon: BookOpen, label: 'Assignment' },
  { path: '/study-planner', icon: Calendar, label: 'Study Plan' },
  { path: '/resume', icon: FileText, label: 'Resume' },
  { path: '/career', icon: Briefcase, label: 'Career' },
  { path: '/admin', icon: Shield, label: 'Admin' },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                CampusAI
              </Link>
              <div className="hidden md:flex gap-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      location.pathname === path
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="md:hidden bg-gray-800 border-b border-gray-700">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 text-sm ${
                location.pathname === path ? 'bg-indigo-600' : 'hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          ))}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
