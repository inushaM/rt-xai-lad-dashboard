import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { dashboardApi } from '../../api/dashboardApi'
import StatusChip from '../common/StatusChip'
import { formatRiskProbability } from '../../utils/risk'

const HighRiskTable = ({ limit = 10 }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHighRisk = async () => {
      try {
        const response = await dashboardApi.getHighRiskStudents(limit)
        setStudents(response.data.data?.students || [])
      } catch (error) {
        console.error('Error fetching high-risk students:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHighRisk()
  }, [limit])

  const handleRowClick = (student) => {
    const studentId = student.student_id || student.id_student || student.id
    if (studentId) {
      navigate(`/students/${studentId}`)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading...</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          High-Risk Students
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Presentation</TableCell>
                <TableCell align="right">Risk Probability</TableCell>
                <TableCell>Risk Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No high-risk students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student, index) => {
                  const studentId = student.student_id || student.id_student || student.id || `Student ${index}`
                  const riskLevel = student.risk_label || (student.risk_probability < 0.4 ? 'low' : student.risk_probability < 0.7 ? 'medium' : 'high')
                  return (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => handleRowClick(student)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{studentId}</TableCell>
                      <TableCell>{student.code_module || 'N/A'}</TableCell>
                      <TableCell>{student.code_presentation || 'N/A'}</TableCell>
                      <TableCell align="right">
                        {formatRiskProbability(student.risk_probability)}
                      </TableCell>
                      <TableCell>
                        <StatusChip riskLevel={riskLevel} />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export default HighRiskTable
