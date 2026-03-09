import { configureStore } from '@reduxjs/toolkit'
import dashboardReducer from './slices/dashboardSlice'
import studentsReducer from './slices/studentsSlice'

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    students: studentsReducer,
  },
})
