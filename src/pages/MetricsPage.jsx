import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { dashboardApi } from '../api/dashboardApi'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import MetricCard from '../components/common/MetricCard'
import { formatPercentage, formatNumber } from '../utils/formatters'
import AssessmentIcon from '@mui/icons-material/Assessment'

const MetricsPage = () => {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const response = await dashboardApi.getMetrics()
        setMetrics(response.data.data)
      } catch (err) {
        setError(err.message || 'Failed to load metrics')
      } finally {
        setLoading(false)
      }
    }
    fetchMetrics()
  }, [])

  if (loading) {
    return <LoadingState message="Loading model metrics..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!metrics) {
    return (
      <>
        <PageHeader title="Model Metrics" subtitle="Performance metrics from model training" />
        <ErrorState message="No metrics available" />
      </>
    )
  }

  // Extract common metric keys
  const trainAccuracy = metrics.train_accuracy || metrics.accuracy_train || metrics.train_acc
  const testAccuracy = metrics.test_accuracy || metrics.accuracy_test || metrics.test_acc
  const rocAuc = metrics.roc_auc || metrics.roc_auc_score || metrics.auc
  const cvMeanRocAuc = metrics.cv_mean_roc_auc || metrics.cv_roc_auc_mean
  const cvStdRocAuc = metrics.cv_std_roc_auc || metrics.cv_roc_auc_std
  const classificationReport = metrics.classification_report || metrics.report

  return (
    <>
      <PageHeader
        title="Model Metrics"
        subtitle="Performance metrics from model training and evaluation"
      />
      
      <Grid container spacing={3}>
        {trainAccuracy !== undefined && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Train Accuracy"
              value={formatPercentage(trainAccuracy)}
              icon={<AssessmentIcon />}
              color="primary"
            />
          </Grid>
        )}
        
        {testAccuracy !== undefined && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Test Accuracy"
              value={formatPercentage(testAccuracy)}
              icon={<AssessmentIcon />}
              color="primary"
            />
          </Grid>
        )}
        
        {rocAuc !== undefined && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="ROC-AUC"
              value={formatNumber(rocAuc, 4)}
              icon={<AssessmentIcon />}
              color="primary"
            />
          </Grid>
        )}
        
        {cvMeanRocAuc !== undefined && (
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="CV Mean ROC-AUC"
              value={formatNumber(cvMeanRocAuc, 4)}
              subtitle={cvStdRocAuc ? `± ${formatNumber(cvStdRocAuc, 4)}` : null}
              icon={<AssessmentIcon />}
              color="primary"
            />
          </Grid>
        )}

        {classificationReport && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Classification Report
                </Typography>
                {typeof classificationReport === 'string' ? (
                  <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {classificationReport}
                  </Typography>
                ) : (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Class</TableCell>
                          <TableCell align="right">Precision</TableCell>
                          <TableCell align="right">Recall</TableCell>
                          <TableCell align="right">F1-Score</TableCell>
                          <TableCell align="right">Support</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(classificationReport).map(([key, value]) => {
                          if (typeof value === 'object' && value !== null) {
                            return (
                              <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell align="right">{formatNumber(value.precision)}</TableCell>
                                <TableCell align="right">{formatNumber(value.recall)}</TableCell>
                                <TableCell align="right">{formatNumber(value['f1-score'])}</TableCell>
                                <TableCell align="right">{value.support}</TableCell>
                              </TableRow>
                            )
                          }
                          return null
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                All Metrics
              </Typography>
              <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {JSON.stringify(metrics, null, 2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default MetricsPage
