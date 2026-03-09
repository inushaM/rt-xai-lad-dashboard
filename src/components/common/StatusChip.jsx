import { Chip } from '@mui/material'
import { getRiskColor, getRiskLabel } from '../../utils/risk'

const StatusChip = ({ riskLevel, label }) => {
  const color = getRiskColor(riskLevel)
  const displayLabel = label || getRiskLabel(riskLevel)
  
  return (
    <Chip
      label={displayLabel}
      color={color}
      size="small"
      sx={{ fontWeight: 500 }}
    />
  )
}

export default StatusChip
