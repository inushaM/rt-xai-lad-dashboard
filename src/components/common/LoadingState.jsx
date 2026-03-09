import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingState = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="textSecondary">{message}</Typography>
    </Box>
  )
}

export default LoadingState
