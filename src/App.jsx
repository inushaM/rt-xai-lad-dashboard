import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import DashboardPage from './pages/DashboardPage'
import StudentsPage from './pages/StudentsPage'
import StudentDetailPage from './pages/StudentDetailPage'
import GlobalExplainabilityPage from './pages/GlobalExplainabilityPage'
import MetricsPage from './pages/MetricsPage'
import PredictPage from './pages/PredictPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/students"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <StudentsPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/students/:studentId"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <StudentDetailPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/explanations"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <GlobalExplainabilityPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/metrics"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <MetricsPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route
        path="/predict"
        element={(
          <ProtectedRoute>
            <AppLayout>
              <PredictPage />
            </AppLayout>
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
