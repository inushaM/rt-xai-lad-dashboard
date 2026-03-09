import { Card, CardContent, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const PresentationRiskChart = ({ data }) => {
  if (!data || !data.presentation_breakdown) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Presentation Risk Breakdown
          </Typography>
          <Typography color="textSecondary">No data available</Typography>
        </CardContent>
      </Card>
    )
  }

  const chartData = Object.entries(data.presentation_breakdown).map(([presentation, stats]) => ({
    presentation,
    avgRisk: (stats.avg_risk * 100).toFixed(1),
    atRiskCount: stats.at_risk_count,
    totalStudents: stats.total_students,
  }))

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Presentation Risk Breakdown
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="presentation" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="avgRisk" fill="#1976d2" name="Avg Risk %" />
            <Bar dataKey="atRiskCount" fill="#d32f2f" name="At Risk Count" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default PresentationRiskChart
