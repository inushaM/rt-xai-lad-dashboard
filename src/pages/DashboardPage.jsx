import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import { fetchDashboardSummary } from '../app/slices/dashboardSlice'
import PageHeader from '../components/common/PageHeader'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import MetricCard from '../components/common/MetricCard'
import RiskDistributionChart from '../components/dashboard/RiskDistributionChart'
import ModuleRiskChart from '../components/dashboard/ModuleRiskChart'
import PresentationRiskChart from '../components/dashboard/PresentationRiskChart'
import HighRiskTable from '../components/dashboard/HighRiskTable'
import PeopleIcon from '@mui/icons-material/People'
import WarningIcon from '@mui/icons-material/Warning'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { formatPercentage } from '../utils/formatters'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { summary, loading, error } = useSelector((state) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardSummary())
  }, [dispatch])

  if (loading) {
    return <LoadingState message="Loading dashboard data..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(fetchDashboardSummary())} />
  }

  if (!summary) {
    return <ErrorState message="No data available" />
  }

  // Debug: Log summary to console (remove in production)
  console.log('Dashboard Summary:', summary)

  // Ensure we have valid numeric values
  const totalStudents = Number(summary.total_students) || 0
  const predictedAtRisk = Number(summary.predicted_at_risk_count) || 0
  const averageRisk = Number(summary.average_risk_probability) || 0
  const highRiskCount = Number(summary.high_risk_count) || 0
  const lowRiskCount = Number(summary.low_risk_count) || 0
  const mediumRiskCount = Number(summary.medium_risk_count) || 0

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of student risk predictions and analytics"
      />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Students"
            value={totalStudents}
            icon={<PeopleIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Predicted At Risk"
            value={predictedAtRisk}
            subtitle={`${formatPercentage(predictedAtRisk / (totalStudents || 1))} of total`}
            icon={<WarningIcon />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Average Risk"
            value={formatPercentage(averageRisk)}
            icon={<TrendingUpIcon />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="High Risk"
            value={highRiskCount}
            subtitle={`${formatPercentage(highRiskCount / (totalStudents || 1))} of total`}
            icon={<WarningIcon />}
            color="error"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RiskDistributionChart data={{
            low_risk_count: lowRiskCount,
            medium_risk_count: mediumRiskCount,
            high_risk_count: highRiskCount
          }} />
        </Grid>
        <Grid item xs={12} md={6}>
          <HighRiskTable limit={10} />
        </Grid>

        <Grid item xs={12} md={6}>
          <ModuleRiskChart data={summary} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PresentationRiskChart data={summary} />
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardPage
