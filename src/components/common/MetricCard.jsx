import { Card, CardContent, Typography, Box } from '@mui/material'

const MetricCard = ({ title, value, subtitle, icon, color = 'primary' }) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box sx={{ color: `${color}.main`, fontSize: 40 }}>
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default MetricCard
