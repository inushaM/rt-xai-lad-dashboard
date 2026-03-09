import { Card, CardContent, Typography, Box, Chip, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Grid } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import InfoIcon from '@mui/icons-material/Info'

const LimeExplanationCard = ({ explanation }) => {
  if (!explanation || explanation.error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            {explanation?.message || 'Could not generate explanation'}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  const rules = explanation.rules || []
  const topPositive = explanation.top_positive || []
  const topNegative = explanation.top_negative || []
  const studentFeatures = explanation.student_features || {}

  // Helper function to extract feature name from LIME condition strings
  const extractFeatureName = (limeFeatureString) => {
    // LIME can return formats like:
    // - "feature_name <= 1.00"
    // - "1.00 <= feature_name <= 24.00"
    // - "feature_name > 100"
    // - Just "feature_name"
    // - Or sometimes just numbers
    
    const str = String(limeFeatureString).trim()
    
    // If it's just a number, return null (we'll handle this separately)
    if (/^-?\d+\.?\d*$/.test(str)) {
      return null
    }
    
    // Try to find feature name in conditions like "1.00 <= feature_name <= 24.00"
    const betweenMatch = str.match(/[\d.]+?\s*<=\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*<=/i)
    if (betweenMatch) {
      return betweenMatch[1]
    }
    
    // Try "feature_name <= value" or "feature_name > value"
    const leftMatch = str.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[<>=]/i)
    if (leftMatch) {
      return leftMatch[1]
    }
    
    // Try "value <= feature_name" or "value > feature_name"
    const rightMatch = str.match(/[\d.]+\s*[<>=]+\s*([a-zA-Z_][a-zA-Z0-9_]*)/i)
    if (rightMatch) {
      return rightMatch[1]
    }
    
    // If no pattern matches, check if it's a valid feature name (starts with letter/underscore)
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str)) {
      return str
    }
    
    // Last resort: try to extract any word that looks like a feature name
    const wordMatch = str.match(/([a-zA-Z_][a-zA-Z0-9_]*)/)
    if (wordMatch) {
      return wordMatch[1]
    }
    
    return null
  }

  // Get all actual feature column names for matching
  const actualFeatureNames = Object.keys(studentFeatures)
  
  // Remove duplicate features and fix feature names
  const uniqueRules = []
  const seenFeatures = new Set()
  
  for (const rule of rules) {
    let baseFeature = extractFeatureName(rule.feature)
    
    // If extraction failed, try to match by finding similar feature names
    if (!baseFeature) {
      // Try to find a feature that contains this value or matches the pattern
      const numericValue = rule.feature.match(/[\d.]+/)?.[0]
      if (numericValue) {
        // This might be a numeric feature value, skip it or try to match by index
        continue // Skip numeric-only features
      }
      // Try to use the original string if it looks like a feature name
      baseFeature = rule.feature
    }
    
    // Validate that this is a real feature name
    if (!baseFeature || (!actualFeatureNames.includes(baseFeature) && !/^[a-zA-Z_]/.test(baseFeature))) {
      // Skip if it's not a valid feature name
      continue
    }
    
    if (!seenFeatures.has(baseFeature)) {
      seenFeatures.add(baseFeature)
      uniqueRules.push({
        ...rule,
        baseFeature: baseFeature,
        originalLimeFeature: rule.feature // Keep original for reference
      })
    } else {
      // If duplicate, keep the one with higher absolute weight
      const existingIndex = uniqueRules.findIndex(r => r.baseFeature === baseFeature)
      if (existingIndex !== -1 && Math.abs(rule.weight) > Math.abs(uniqueRules[existingIndex].weight)) {
        uniqueRules[existingIndex] = {
          ...rule,
          baseFeature: baseFeature,
          originalLimeFeature: rule.feature
        }
      }
    }
  }

  // Helper function to format feature values
  const formatFeatureValue = (feature, value) => {
    if (value === null || value === undefined || value === '') return 'N/A'
    
    // Format numeric values
    if (typeof value === 'number') {
      if (feature.includes('score') || feature.includes('probability')) {
        return value.toFixed(1)
      }
      if (feature.includes('credits') || feature.includes('days') || feature.includes('clicks')) {
        return Math.round(value).toLocaleString()
      }
      return value.toFixed(2)
    }
    
    return String(value)
  }

  // Helper function to get feature description
  const getFeatureDescription = (feature) => {
    const descriptions = {
      'total_clicks': 'Total clicks on learning materials',
      'avg_clicks_per_day': 'Average daily engagement',
      'active_days': 'Number of active days',
      'avg_score': 'Average assessment score',
      'studied_credits': 'Number of credits studied',
      'num_of_prev_attempts': 'Previous course attempts',
      'imd_band': 'Socioeconomic indicator (Index of Multiple Deprivation)',
      'highest_education': 'Highest level of education',
      'age_band': 'Age group',
      'gender': 'Gender',
      'disability': 'Disability status',
      'num_assessments': 'Total assessments',
      'submitted_assessments': 'Submitted assessments',
      'code_module': 'Course module code',
      'code_presentation': 'Course presentation code',
      'id_student': 'Student identifier',
      'id': 'Student identifier',
      'At_Risk': 'Actual at-risk status (if available)'
    }
    return descriptions[feature] || `Feature: ${feature}`
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            LIME Explanation
          </Typography>
          <InfoIcon fontSize="small" color="action" />
        </Box>
        
        {explanation.explanation && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">{explanation.explanation}</Typography>
          </Alert>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        {/* Student-Specific Feature Analysis */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2, mb: 2 }}>
          Student-Specific Analysis
        </Typography>
        
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Feature</strong></TableCell>
                <TableCell><strong>LIME Condition</strong></TableCell>
                <TableCell align="center"><strong>This Student's Value</strong></TableCell>
                <TableCell align="center"><strong>Condition Met</strong></TableCell>
                <TableCell align="right"><strong>Impact Weight</strong></TableCell>
                <TableCell align="center"><strong>Effect</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {uniqueRules.slice(0, 10).map((rule, index) => {
                // Use baseFeature which should now be properly extracted
                const baseFeature = rule.baseFeature || rule.feature
                
                // Skip if baseFeature is not a valid feature name (e.g., just a number)
                if (!baseFeature || /^-?\d+\.?\d*$/.test(baseFeature)) {
                  return null
                }
                
                // Get the actual value
                const studentValue = studentFeatures[baseFeature]
                const actualValue = rule.actual_value || formatFeatureValue(baseFeature, studentValue || studentFeatures[rule.feature])
                
                // Skip if we can't get a value
                if (actualValue === 'N/A' && !studentFeatures[baseFeature]) {
                  return null
                }
                
                // Get the original LIME condition string
                const limeCondition = rule.lime_condition || rule.originalLimeFeature || rule.feature || baseFeature
                
                // Try to evaluate if condition is met
                let conditionMet = null
                try {
                  const conditionStr = String(limeCondition).trim()
                  // Extract numeric value from condition
                  const conditionMatch = conditionStr.match(/([<>=]+)\s*([\d.]+)/)
                  if (conditionMatch && studentValue != null) {
                    const operator = conditionMatch[1]
                    const threshold = parseFloat(conditionMatch[2])
                    const studentNum = parseFloat(studentValue)
                    
                    if (!isNaN(studentNum) && !isNaN(threshold)) {
                      switch (operator) {
                        case '>':
                          conditionMet = studentNum > threshold
                          break
                        case '>=':
                          conditionMet = studentNum >= threshold
                          break
                        case '<':
                          conditionMet = studentNum < threshold
                          break
                        case '<=':
                          conditionMet = studentNum <= threshold
                          break
                        case '==':
                        case '=':
                          conditionMet = Math.abs(studentNum - threshold) < 0.01
                          break
                        default:
                          conditionMet = null
                      }
                    }
                  }
                  // Also check for range conditions like "1.00 <= feature <= 24.00"
                  const rangeMatch = conditionStr.match(/([\d.]+)\s*<=\s*[a-zA-Z_]+\s*<=\s*([\d.]+)/i)
                  if (rangeMatch && studentValue != null) {
                    const lowerBound = parseFloat(rangeMatch[1])
                    const upperBound = parseFloat(rangeMatch[2])
                    const studentNum = parseFloat(studentValue)
                    
                    if (!isNaN(studentNum) && !isNaN(lowerBound) && !isNaN(upperBound)) {
                      conditionMet = studentNum >= lowerBound && studentNum <= upperBound
                    }
                  }
                } catch (e) {
                  // If evaluation fails, leave as null
                }
                
                const impact = rule.weight > 0 ? 'Increases Risk' : 'Decreases Risk'
                const impactColor = rule.weight > 0 ? 'error' : 'success'
                
                return (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {baseFeature}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 0.5 }}>
                          {getFeatureDescription(baseFeature)}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                        {limeCondition}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ 
                        p: 1, 
                        bgcolor: 'primary.light', 
                        borderRadius: 1,
                        display: 'inline-block',
                        minWidth: 80
                      }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                          {actualValue}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {conditionMet !== null ? (
                        <Chip
                          label={conditionMet ? 'Yes' : 'No'}
                          color={conditionMet ? 'success' : 'default'}
                          size="small"
                          variant={conditionMet ? 'filled' : 'outlined'}
                        />
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: rule.weight > 0 ? 'error.main' : 'success.main',
                          fontSize: '1rem'
                        }}
                      >
                        {rule.weight > 0 ? '+' : ''}{rule.weight.toFixed(3)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={impact}
                        color={impactColor}
                        size="small"
                        variant="outlined"
                        sx={{ fontWeight: 500 }}
                      />
                    </TableCell>
                  </TableRow>
                )
              }).filter(Boolean)}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Quick Summary Cards */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
          Quick Summary
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {topPositive.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(211, 47, 47, 0.08)', 
                borderRadius: 1,
                border: '1px solid rgba(211, 47, 47, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TrendingUpIcon color="error" />
                  <Typography variant="subtitle2" color="error" sx={{ fontWeight: 600 }}>
                    Top Risk Factors
                  </Typography>
                </Box>
                {topPositive.map((rule, index) => {
                  const baseFeature = rule.baseFeature || extractFeatureName(rule.feature) || rule.feature
                  // Skip if it's just a number
                  if (!baseFeature || /^-?\d+\.?\d*$/.test(baseFeature)) return null
                  const actualValue = rule.actual_value || formatFeatureValue(baseFeature, studentFeatures[baseFeature] || studentFeatures[rule.feature])
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                        <strong style={{ color: '#000000' }}>{baseFeature}</strong>: 
                        <span style={{ color: '#1976d2', fontWeight: 600, marginLeft: '4px' }}>{actualValue}</span>
                        <span style={{ color: '#d32f2f', marginLeft: '8px', fontWeight: 600 }}>
                          (+{rule.weight.toFixed(3)})
                        </span>
                      </Typography>
                    </Box>
                  )
                }).filter(Boolean)}
              </Box>
            </Grid>
          )}
          
          {topNegative.length > 0 && (
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(46, 125, 50, 0.08)', 
                borderRadius: 1,
                border: '1px solid rgba(46, 125, 50, 0.2)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TrendingDownIcon color="success" />
                  <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 600 }}>
                    Protective Factors
                  </Typography>
                </Box>
                {topNegative.map((rule, index) => {
                  const baseFeature = rule.baseFeature || extractFeatureName(rule.feature) || rule.feature
                  // Skip if it's just a number
                  if (!baseFeature || /^-?\d+\.?\d*$/.test(baseFeature)) return null
                  const actualValue = rule.actual_value || formatFeatureValue(baseFeature, studentFeatures[baseFeature] || studentFeatures[rule.feature])
                  return (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography variant="body2" sx={{ color: '#000000', fontWeight: 500 }}>
                        <strong style={{ color: '#000000' }}>{baseFeature}</strong>: 
                        <span style={{ color: '#1976d2', fontWeight: 600, marginLeft: '4px' }}>{actualValue}</span>
                        <span style={{ color: '#2e7d32', marginLeft: '8px', fontWeight: 600 }}>
                          ({rule.weight.toFixed(3)})
                        </span>
                      </Typography>
                    </Box>
                  )
                }).filter(Boolean)}
              </Box>
            </Grid>
          )}
        </Grid>
        
        {/* All Features Guide (Collapsible) */}
        {uniqueRules.length > 10 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              All Contributing Features ({uniqueRules.length} total)
            </Typography>
            <Box component="ul" sx={{ pl: 2, maxHeight: 200, overflowY: 'auto' }}>
              {uniqueRules.slice(10).map((rule, index) => {
                const baseFeature = rule.baseFeature || extractFeatureName(rule.feature) || rule.feature
                // Skip if it's just a number
                if (!baseFeature || /^-?\d+\.?\d*$/.test(baseFeature)) return null
                const actualValue = rule.actual_value || formatFeatureValue(baseFeature, studentFeatures[baseFeature] || studentFeatures[rule.feature])
                return (
                  <Box component="li" key={index + 10} sx={{ mb: 0.5 }}>
                    <Typography variant="body2" fontSize="0.875rem" sx={{ color: 'text.primary' }}>
                      <strong>{baseFeature}</strong> <span style={{ color: '#1976d2', fontWeight: 600 }}>({actualValue})</span>: 
                      {rule.weight > 0 ? '+' : ''}{rule.weight.toFixed(4)} 
                      <span style={{ color: '#666', fontSize: '0.75rem', marginLeft: '4px' }}>
                        ({rule.contribution})
                      </span>
                    </Typography>
                  </Box>
                )
              }).filter(Boolean)}
            </Box>
          </Box>
        )}

      </CardContent>
    </Card>
  )
}

export default LimeExplanationCard
