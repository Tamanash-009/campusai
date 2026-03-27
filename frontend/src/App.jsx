import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ChatPage from './pages/ChatPage'
import AssignmentPage from './pages/AssignmentPage'
import StudyPlannerPage from './pages/StudyPlannerPage'
import ResumePage from './pages/ResumePage'
import CareerPage from './pages/CareerPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/assignment" element={<AssignmentPage />} />
          <Route path="/study-planner" element={<StudyPlannerPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
