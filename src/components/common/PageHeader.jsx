import { Typography, Box } from '@mui/material'

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body1" color="textSecondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}

export default PageHeader
