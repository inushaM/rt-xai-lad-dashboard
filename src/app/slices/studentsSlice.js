import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { dashboardApi } from '../../api/dashboardApi'

export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (filters = {}) => {
    const response = await dashboardApi.getStudents(filters)
    return response.data
  }
)

export const fetchStudent = createAsyncThunk(
  'students/fetchOne',
  async (studentId) => {
    const response = await dashboardApi.getStudent(studentId)
    return response.data
  }
)

const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    students: [],
    currentStudent: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        // Handle both response.data.data.students and response.data.students
        const students = action.payload?.data?.students || action.payload?.students || []
        state.students = students
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false
        state.currentStudent = action.payload
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { clearCurrentStudent } = studentsSlice.actions
export default studentsSlice.reducer
