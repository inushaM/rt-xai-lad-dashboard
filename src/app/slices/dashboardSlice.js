import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardApi } from '../../api/dashboardApi'

export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async () => {
    const response = await dashboardApi.getSummary()
    // Axios response structure: response.data = { success: true, message: "...", data: {...} }
    // Extract the actual summary data object
    if (response.data && response.data.data) {
      return response.data.data
    }
    // Fallback if structure is different
    return response.data
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.loading = false
        // action.payload is already the extracted data from the thunk
        state.summary = action.payload
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export default dashboardSlice.reducer
