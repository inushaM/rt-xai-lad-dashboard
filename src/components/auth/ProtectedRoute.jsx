import { Navigate } from 'react-router-dom'
import { authStorage } from '../../utils/auth'

const ProtectedRoute = ({ children }) => {
  if (!authStorage.isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
