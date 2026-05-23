import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { fetchStudents } from '../app/slices/studentsSlice'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import StatusChip from '../components/common/StatusChip'
import { formatRiskProbability } from '../utils/risk'

const StudentsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { students, loading, error } = useSelector((state) => state.students)
  
  const [filters, setFilters] = useState({
    student_id: '',
    code_module: '',
    code_presentation: '',
    risk_level: '',
  })
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  useEffect(() => {
    dispatch(fetchStudents(filters))
  }, [dispatch, filters])

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPage(0) // Reset to first page when filter changes
  }

  const handleRowClick = (student) => {
    const studentId = student.student_id || student.id_student || student.id
    if (studentId) {
      navigate(`/students/${studentId}`)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Get unique values for filter dropdowns
  const modules = [...new Set(students.map(s => s.code_module).filter(Boolean))]
  const presentations = [...new Set(students.map(s => s.code_presentation).filter(Boolean))]

  const paginatedStudents = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <>
      <PageHeader
        title="Students"
        subtitle="View and filter student records with risk predictions"
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="Student ID"
                  placeholder="Filter by student ID"
                  value={filters.student_id}
                  onChange={(e) => handleFilterChange('student_id', e.target.value)}
                  sx={{ minWidth: 200 }}
                  size="small"
                />
                <TextField
                  select
                  label="Module"
                  value={filters.code_module}
                  onChange={(e) => handleFilterChange('code_module', e.target.value)}
                  sx={{ minWidth: 200 }}
                  size="small"
                >
                  <MenuItem value="">All Modules</MenuItem>
                  {modules.map((module) => (
                    <MenuItem key={module} value={module}>
                      {module}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  select
                  label="Presentation"
                  value={filters.code_presentation}
                  onChange={(e) => handleFilterChange('code_presentation', e.target.value)}
                  sx={{ minWidth: 200 }}
                  size="small"
                >
                  <MenuItem value="">All Presentations</MenuItem>
                  {presentations.map((pres) => (
                    <MenuItem key={pres} value={pres}>
                      {pres}
                    </MenuItem>
                  ))}
                </TextField>
                
                <TextField
                  select
                  label="Risk Level"
                  value={filters.risk_level}
                  onChange={(e) => handleFilterChange('risk_level', e.target.value)}
                  sx={{ minWidth: 200 }}
                  size="small"
                >
                  <MenuItem value="">All Risk Levels</MenuItem>
                  <MenuItem value="low">Low Risk</MenuItem>
                  <MenuItem value="medium">Medium Risk</MenuItem>
                  <MenuItem value="high">High Risk</MenuItem>
                </TextField>
              </Box>

              {loading ? (
                <LoadingState />
              ) : error ? (
                <ErrorState message={error} />
              ) : (
                <>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
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
                        {paginatedStudents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              No students found
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedStudents.map((student, index) => {
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
                                  {student.risk_probability ? formatRiskProbability(student.risk_probability) : 'N/A'}
                                </TableCell>
                                <TableCell>
                                  {student.risk_probability ? (
                                    <StatusChip riskLevel={riskLevel} />
                                  ) : (
                                    'N/A'
                                  )}
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={students.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default StudentsPage
