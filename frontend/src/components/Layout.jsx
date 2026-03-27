import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  MessageCircle, BookOpen, Calendar, FileText, Briefcase, Shield, 
  Menu, X, Bot, Sparkles
} from 'lucide-react'

const navItems = [
  { path: '/', icon: MessageCircle, label: 'Chat', color: 'from-indigo-500 to-purple-500' },
  { path: '/assignment', icon: BookOpen, label: 'Assignment', color: 'from-purple-500 to-pink-500' },
  { path: '/study-planner', icon: Calendar, label: 'Study Plan', color: 'from-cyan-500 to-blue-500' },
  { path: '/resume', icon: FileText, label: 'Resume', color: 'from-pink-500 to-rose-500' },
  { path: '/career', icon: Briefcase, label: 'Career', color: 'from-amber-500 to-orange-500' },
  { path: '/admin', icon: Shield, label: 'Admin', color: 'from-emerald-500 to-teal-500' },
]

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { x: -300, opacity: 0, transition: { ease: 'easeInOut', duration: 0.2 } }
}

const menuItemVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: i => ({
    x: 0,
    opacity: 1,
    transition: { delay: i * 0.08, type: 'spring', damping: 20 }
  })
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen relative">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="relative">
                <motion.div
                  className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bot className="text-white" size={24} />
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">CampusAI</h1>
                <p className="text-[10px] text-gray-400 -mt-0.5 tracking-wide">Brainware University</p>
              </div>
            </motion.div>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(({ path, icon: Icon, label, color }, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 + 0.2, duration: 0.3 }}
                >
                  <Link
                    to={path}
                    className={`nav-item flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      location.pathname === path
                        ? `text-white bg-gradient-to-r ${color} shadow-lg`
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={18} className="transition-transform group-hover:scale-110" />
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 bottom-0 w-80 glass border-r border-white/5 z-50 lg:hidden overflow-hidden"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="p-6 space-y-3">
                {navItems.map(({ path, icon: Icon, label, color }, i) => (
                  <motion.div
                    key={path}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={menuItemVariants}
                  >
                    <Link
                      to={path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-medium transition-all duration-300 ${
                        location.pathname === path
                          ? `text-white bg-gradient-to-r ${color} shadow-lg`
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={22} />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {children}
        </motion.div>
      </main>

      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', damping: 15 }}
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 rounded-2xl glow-primary cursor-pointer">
            <Sparkles className="text-white" size={24} />
          </div>
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
