import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  Alert,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { dashboardApi } from '../api/dashboardApi'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import StatusChip from '../components/common/StatusChip'
import LimeExplanationCard from '../components/explanations/LimeExplanationCard'
import { formatRiskProbability } from '../utils/risk'
import { formatNumber } from '../utils/formatters'

const StudentDetailPage = () => {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [limeExplanation, setLimeExplanation] = useState(null)
  const [loadingLime, setLoadingLime] = useState(false)

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true)
        const response = await dashboardApi.getStudent(studentId)
        setStudent(response.data.data)
      } catch (err) {
        setError(err.message || 'Failed to load student')
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [studentId])

  const handleGetLimeExplanation = async () => {
    if (!student?.student) return
    
    try {
      setLoadingLime(true)
      const response = await dashboardApi.getLimeExplanation(student.student)
      setLimeExplanation(response.data.data)
    } catch (err) {
      console.error('Error fetching LIME explanation:', err)
    } finally {
      setLoadingLime(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading student details..." />
  }

  if (error || !student) {
    return <ErrorState message={error || 'Student not found'} />
  }

  const { student: studentData, prediction } = student
  const riskLevel = prediction?.risk_label || (prediction?.risk_probability < 0.4 ? 'low' : prediction?.risk_probability < 0.7 ? 'medium' : 'high')

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/students')}
          sx={{ mb: 2 }}
        >
          Back to Students
        </Button>
      </Box>
      
      <PageHeader
        title={`Student: ${studentId}`}
        subtitle="Detailed view with prediction and explanations"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Student Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Student ID
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {studentId}
                  </Typography>
                </Grid>
                {studentData.code_module && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Module
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {studentData.code_module}
                    </Typography>
                  </Grid>
                )}
                {studentData.code_presentation && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Presentation
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {studentData.code_presentation}
                    </Typography>
                  </Grid>
                )}
                {studentData.gender && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Gender
                    </Typography>
                    <Typography variant="body1">
                      {studentData.gender}
                    </Typography>
                  </Grid>
                )}
                {studentData.age_band && (
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Age Band
                    </Typography>
                    <Typography variant="body1">
                      {studentData.age_band}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Risk Prediction
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Risk Probability
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                  {formatRiskProbability(prediction?.risk_probability || 0)}
                </Typography>
                <StatusChip riskLevel={riskLevel} />
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Predicted At Risk: {prediction?.predicted_at_risk ? 'Yes' : 'No'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Threshold Used: {formatNumber(prediction?.threshold_used || 0.5)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  LIME Explanation
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleGetLimeExplanation}
                  disabled={loadingLime}
                >
                  {loadingLime ? 'Loading...' : 'Generate Explanation'}
                </Button>
              </Box>
              {limeExplanation ? (
                <LimeExplanationCard explanation={limeExplanation} />
              ) : (
                <Alert severity="info">
                  Click "Generate Explanation" to see why this student was predicted as at-risk or not at-risk.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default StudentDetailPage
