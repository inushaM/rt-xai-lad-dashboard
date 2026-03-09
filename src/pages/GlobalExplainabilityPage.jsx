import { useState, useEffect } from 'react'
import { Grid, Card, CardContent, Typography, Alert } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { dashboardApi } from '../api/dashboardApi'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'

const GlobalExplainabilityPage = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchShapGlobal = async () => {
      try {
        setLoading(true)
        const response = await dashboardApi.getShapGlobal()
        setData(response.data.data)
      } catch (err) {
        setError(err.message || 'Failed to load SHAP explanation')
      } finally {
        setLoading(false)
      }
    }
    fetchShapGlobal()
  }, [])

  if (loading) {
    return <LoadingState message="Loading global explainability data..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (!data || !data.top_features || data.top_features.length === 0) {
    return (
      <>
        <PageHeader
          title="Global Explainability"
          subtitle="SHAP feature importance across all predictions"
        />
        <Alert severity="info">No explainability data available</Alert>
      </>
    )
  }

  const chartData = data.top_features
    .slice(0, 15)
    .map((feature) => ({
      feature: feature.feature,
      importance: Math.abs(feature.importance),
    }))
    .reverse()

  return (
    <>
      <PageHeader
        title="Global Explainability"
        subtitle="SHAP feature importance across all predictions"
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Top Features by Importance
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                {data.explanation || data.summary}
              </Typography>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="feature" type="category" width={200} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="importance" fill="#1976d2" name="Feature Importance" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Feature Descriptions
              </Typography>
              <Grid container spacing={2}>
                {data.top_features.slice(0, 10).map((feature, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {feature.feature}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {feature.description || 'Feature importance for student risk prediction'}
                    </Typography>
                    <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: 'block' }}>
                      Importance: {Math.abs(feature.importance).toFixed(4)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default GlobalExplainabilityPage
