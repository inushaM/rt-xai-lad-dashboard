import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import StudentDetailPage from './pages/StudentDetailPage'
import GlobalExplainabilityPage from './pages/GlobalExplainabilityPage'
import MetricsPage from './pages/MetricsPage'
import PredictPage from './pages/PredictPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/:studentId" element={<StudentDetailPage />} />
        <Route path="/explanations" element={<GlobalExplainabilityPage />} />
        <Route path="/metrics" element={<MetricsPage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  )
}

export default App
