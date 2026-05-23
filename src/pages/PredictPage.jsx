import { useState } from 'react'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from '@mui/material'
import { dashboardApi } from '../api/dashboardApi'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import StatusChip from '../components/common/StatusChip'
import LimeExplanationCard from '../components/explanations/LimeExplanationCard'
import { formatRiskProbability } from '../utils/risk'

const SELECT_FIELDS = ['gender', 'age_band', 'highest_education', 'imd_band', 'disability']

const validateField = (field, value, allData = {}) => {
  const strVal = String(value ?? '').trim()

  switch (field) {
    case 'gender':
    case 'age_band':
    case 'highest_education':
    case 'imd_band':
    case 'disability':
      return strVal === '' ? 'This field is required' : ''

    case 'num_of_prev_attempts': {
      if (strVal === '') return 'This field is required'
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Must be a whole number'
      if (n < 0) return 'Must be 0 or greater'
      if (n > 20) return 'Must be 20 or less'
      return ''
    }

    case 'studied_credits': {
      if (strVal === '') return 'This field is required'
      const n = parseFloat(value)
      if (isNaN(n)) return 'Must be a number'
      if (n <= 0) return 'Must be greater than 0'
      return ''
    }

    case 'total_clicks': {
      if (strVal === '') return 'This field is required'
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Must be a whole number'
      if (n < 0) return 'Must be 0 or greater'
      return ''
    }

    case 'active_days': {
      if (strVal === '') return 'This field is required'
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Must be a whole number'
      if (n < 1) return 'Must be at least 1'
      if (n > 365) return 'Must be 365 or less'
      return ''
    }

    case 'avg_clicks_per_day': {
      if (strVal === '') return 'This field is required'
      const n = parseFloat(value)
      if (isNaN(n)) return 'Must be a number'
      if (n < 0) return 'Must be 0 or greater'
      return ''
    }

    case 'avg_score': {
      if (strVal === '') return 'This field is required'
      const n = parseFloat(value)
      if (isNaN(n)) return 'Must be a number'
      if (n < 0 || n > 100) return 'Must be between 0 and 100'
      return ''
    }

    case 'num_assessments': {
      if (strVal === '') return 'This field is required'
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Must be a whole number'
      if (n < 0) return 'Must be 0 or greater'
      return ''
    }

    case 'submitted_assessments': {
      if (strVal === '') return 'This field is required'
      const n = Number(value)
      if (!Number.isInteger(n)) return 'Must be a whole number'
      if (n < 0) return 'Must be 0 or greater'
      const total = parseInt(allData.num_assessments)
      if (!isNaN(total) && n > total) {
        return `Cannot exceed total assessments (${total})`
      }
      return ''
    }

    default:
      return ''
  }
}

const validateAll = (data) => {
  const errs = {}
  Object.keys(data).forEach((field) => {
    const msg = validateField(field, data[field], data)
    if (msg) errs[field] = msg
  })
  return errs
}

const allTouched = (data) =>
  Object.keys(data).reduce((acc, k) => ({ ...acc, [k]: true }), {})

const PredictPage = () => {
  const [formData, setFormData] = useState({
    gender: '',
    age_band: '',
    highest_education: '',
    imd_band: '',
    disability: '',
    num_of_prev_attempts: '',
    studied_credits: '',
    total_clicks: '',
    active_days: '',
    avg_clicks_per_day: '',
    avg_score: '',
    num_assessments: '',
    submitted_assessments: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [prediction, setPrediction] = useState(null)
  const [limeExplanation, setLimeExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (field) => (event) => {
    const value = event.target.value
    const isSelect = SELECT_FIELDS.includes(field)

    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      if (isSelect) {
        setTouched((t) => ({ ...t, [field]: true }))
        setErrors((e) => ({ ...e, [field]: validateField(field, value, updated) }))
      } else {
        setErrors((e) => ({ ...e, [field]: '' }))

        if (field === 'num_assessments' && touched.submitted_assessments) {
          setErrors((e) => ({
            ...e,
            submitted_assessments: validateField('submitted_assessments', prev.submitted_assessments, updated),
          }))
        }
      }

      return updated
    })
  }

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field], formData),
    }))
  }

  const fieldError = (field) => (touched[field] ? errors[field] || '' : '')

  // Define dropdown options
  const genderOptions = [
    { value: '0', label: 'Female (0)' },
    { value: '1', label: 'Male (1)' },
    { value: 'M', label: 'Male (M)' },
    { value: 'F', label: 'Female (F)' },
  ]

  const ageBandOptions = [
    { value: '0', label: '0-35 (0)' },
    { value: '1', label: '35-55 (1)' },
    { value: '2', label: '55+ (2)' },
    { value: '0-35', label: '0-35' },
    { value: '35-55', label: '35-55' },
    { value: '55+', label: '55+' },
  ]

  const educationOptions = [
    { value: '0', label: 'Lower Than A Level (0)' },
    { value: '1', label: 'A Level or Equivalent (1)' },
    { value: '2', label: 'HE Qualification (2)' },
    { value: '4', label: 'Post Graduate Qualification (4)' },
    { value: 'Lower Than A Level', label: 'Lower Than A Level' },
    { value: 'A Level or Equivalent', label: 'A Level or Equivalent' },
    { value: 'HE Qualification', label: 'HE Qualification' },
    { value: 'Post Graduate Qualification', label: 'Post Graduate Qualification' },
  ]

  const imdBandOptions = [
    { value: '0', label: '0-10% (0)' },
    { value: '1', label: '10-20% (1)' },
    { value: '2', label: '20-30% (2)' },
    { value: '3', label: '30-40% (3)' },
    { value: '4', label: '40-50% (4)' },
    { value: '5', label: '50-60% (5)' },
    { value: '6', label: '60-70% (6)' },
    { value: '7', label: '70-80% (7)' },
    { value: '8', label: '80-90% (8)' },
    { value: '9', label: '90-100% (9)' },
    { value: '10', label: '90-100% (10)' },
    { value: '0-10%', label: '0-10%' },
    { value: '10-20%', label: '10-20%' },
    { value: '20-30%', label: '20-30%' },
    { value: '30-40%', label: '30-40%' },
    { value: '40-50%', label: '40-50%' },
    { value: '50-60%', label: '50-60%' },
    { value: '60-70%', label: '60-70%' },
    { value: '70-80%', label: '70-80%' },
    { value: '80-90%', label: '80-90%' },
    { value: '90-100%', label: '90-100%' },
  ]

  const disabilityOptions = [
    { value: '0', label: 'No (0)' },
    { value: '1', label: 'Yes (1)' },
    { value: 'N', label: 'No (N)' },
    { value: 'Y', label: 'Yes (Y)' },
  ]

  const generateRandomStudent = () => {
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(1)

    const prevAttempts = randomInt(0, 3)
    const studiedCredits = randomItem([60, 90, 120, 150, 180, 240])
    const activeDays = randomInt(5, 100)
    const totalClicks = randomInt(50, 2000)
    const avgClicksPerDay = (totalClicks / activeDays).toFixed(2)
    const avgScore = randomFloat(0, 100)
    const numAssessments = randomInt(0, 10)
    const submittedAssessments = randomInt(0, numAssessments)

    return {
      gender: randomItem(genderOptions).value,
      age_band: randomItem(ageBandOptions).value,
      highest_education: randomItem(educationOptions).value,
      imd_band: randomItem(imdBandOptions).value,
      disability: randomItem(disabilityOptions).value,
      num_of_prev_attempts: prevAttempts.toString(),
      studied_credits: studiedCredits.toString(),
      total_clicks: totalClicks.toString(),
      active_days: activeDays.toString(),
      avg_clicks_per_day: avgClicksPerDay,
      avg_score: avgScore,
      num_assessments: numAssessments.toString(),
      submitted_assessments: submittedAssessments.toString(),
    }
  }

  const handleFillTestData = () => {
    const testData = generateRandomStudent()
    setFormData(testData)
    setErrors({})
    setTouched({})
    setPrediction(null)
    setLimeExplanation(null)
    setError(null)
  }

  const handlePredict = async () => {
    const validationErrors = validateAll(formData)
    setTouched(allTouched(formData))
    setErrors(validationErrors)

    if (Object.values(validationErrors).some((e) => e)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      setPrediction(null)
      setLimeExplanation(null)

      const payload = {
        ...formData,
        num_of_prev_attempts: parseInt(formData.num_of_prev_attempts) || 0,
        studied_credits: parseFloat(formData.studied_credits) || 0,
        total_clicks: parseInt(formData.total_clicks) || 0,
        active_days: parseInt(formData.active_days) || 0,
        avg_clicks_per_day: parseFloat(formData.avg_clicks_per_day) || 0,
        avg_score: parseFloat(formData.avg_score) || 0,
        num_assessments: parseInt(formData.num_assessments) || 0,
        submitted_assessments: parseInt(formData.submitted_assessments) || 0,
      }

      const response = await dashboardApi.predict(payload)
      setPrediction(response.data.data)

      try {
        const limeResponse = await dashboardApi.getLimeExplanation(payload)
        setLimeExplanation(limeResponse.data.data)
      } catch (limeErr) {
        console.error('Error fetching LIME explanation:', limeErr)
      }
    } catch (err) {
      setError(err.message || 'Failed to make prediction')
    } finally {
      setLoading(false)
    }
  }

  const riskLevel = prediction?.risk_label || (prediction?.risk_probability < 0.4 ? 'low' : prediction?.risk_probability < 0.7 ? 'medium' : 'high')

  return (
    <>
      <PageHeader
        title="Predict Student Risk"
        subtitle="Enter student features to get a risk prediction and explanation"
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Student Features
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleFillTestData}
                  size="small"
                >
                  Fill Test Data
                </Button>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!fieldError('gender')}>
                    <InputLabel>Gender *</InputLabel>
                    <Select
                      value={formData.gender}
                      label="Gender *"
                      onChange={handleChange('gender')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {genderOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldError('gender') && (
                      <FormHelperText>{fieldError('gender')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!fieldError('age_band')}>
                    <InputLabel>Age Band *</InputLabel>
                    <Select
                      value={formData.age_band}
                      label="Age Band *"
                      onChange={handleChange('age_band')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {ageBandOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldError('age_band') && (
                      <FormHelperText>{fieldError('age_band')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!fieldError('highest_education')}>
                    <InputLabel>Highest Education *</InputLabel>
                    <Select
                      value={formData.highest_education}
                      label="Highest Education *"
                      onChange={handleChange('highest_education')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {educationOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldError('highest_education') && (
                      <FormHelperText>{fieldError('highest_education')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!fieldError('imd_band')}>
                    <InputLabel>IMD Band *</InputLabel>
                    <Select
                      value={formData.imd_band}
                      label="IMD Band *"
                      onChange={handleChange('imd_band')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {imdBandOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldError('imd_band') && (
                      <FormHelperText>{fieldError('imd_band')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" error={!!fieldError('disability')}>
                    <InputLabel>Disability *</InputLabel>
                    <Select
                      value={formData.disability}
                      label="Disability *"
                      onChange={handleChange('disability')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {disabilityOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldError('disability') && (
                      <FormHelperText>{fieldError('disability')}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Previous Attempts"
                    type="number"
                    value={formData.num_of_prev_attempts}
                    onChange={handleChange('num_of_prev_attempts')}
                    onBlur={handleBlur('num_of_prev_attempts')}
                    error={!!fieldError('num_of_prev_attempts')}
                    helperText={fieldError('num_of_prev_attempts') || 'Range: 0 – 20'}
                    size="small"
                    inputProps={{ min: 0, max: 20, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Studied Credits"
                    type="number"
                    value={formData.studied_credits}
                    onChange={handleChange('studied_credits')}
                    onBlur={handleBlur('studied_credits')}
                    error={!!fieldError('studied_credits')}
                    helperText={fieldError('studied_credits') || 'Must be greater than 0'}
                    size="small"
                    inputProps={{ min: 1, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Total Clicks"
                    type="number"
                    value={formData.total_clicks}
                    onChange={handleChange('total_clicks')}
                    onBlur={handleBlur('total_clicks')}
                    error={!!fieldError('total_clicks')}
                    helperText={fieldError('total_clicks') || 'Total VLE clicks'}
                    size="small"
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Active Days"
                    type="number"
                    value={formData.active_days}
                    onChange={handleChange('active_days')}
                    onBlur={handleBlur('active_days')}
                    error={!!fieldError('active_days')}
                    helperText={fieldError('active_days') || 'Range: 1 – 365'}
                    size="small"
                    inputProps={{ min: 1, max: 365, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Avg Clicks Per Day"
                    type="number"
                    value={formData.avg_clicks_per_day}
                    onChange={handleChange('avg_clicks_per_day')}
                    onBlur={handleBlur('avg_clicks_per_day')}
                    error={!!fieldError('avg_clicks_per_day')}
                    helperText={fieldError('avg_clicks_per_day') || 'Must be 0 or greater'}
                    size="small"
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Average Score"
                    type="number"
                    value={formData.avg_score}
                    onChange={handleChange('avg_score')}
                    onBlur={handleBlur('avg_score')}
                    error={!!fieldError('avg_score')}
                    helperText={fieldError('avg_score') || 'Range: 0 – 100'}
                    size="small"
                    inputProps={{ min: 0, max: 100, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Number of Assessments"
                    type="number"
                    value={formData.num_assessments}
                    onChange={handleChange('num_assessments')}
                    onBlur={handleBlur('num_assessments')}
                    error={!!fieldError('num_assessments')}
                    helperText={fieldError('num_assessments') || 'Total assessments in module'}
                    size="small"
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Submitted Assessments"
                    type="number"
                    value={formData.submitted_assessments}
                    onChange={handleChange('submitted_assessments')}
                    onBlur={handleBlur('submitted_assessments')}
                    error={!!fieldError('submitted_assessments')}
                    helperText={fieldError('submitted_assessments') || 'Cannot exceed total assessments'}
                    size="small"
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePredict}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? 'Predicting...' : 'Predict Risk'}
                </Button>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {loading ? (
            <LoadingState message="Making prediction..." />
          ) : prediction ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Prediction Result
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Risk Probability
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
                    {formatRiskProbability(prediction.risk_probability)}
                  </Typography>
                  <StatusChip riskLevel={riskLevel} />
                </Box>
                <Box>
                  <Typography variant="body2" color="textSecondary">
                    Predicted At Risk: {prediction.predicted_at_risk ? 'Yes' : 'No'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Threshold: {(prediction.threshold_used * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Alert severity="info">
                  Fill in the form and click "Predict Risk" to see results.
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>

        {limeExplanation && (
          <Grid item xs={12}>
            <LimeExplanationCard explanation={limeExplanation} />
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default PredictPage
