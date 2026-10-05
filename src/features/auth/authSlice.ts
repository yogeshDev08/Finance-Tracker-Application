import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { user as defaultUser } from '../../constants/mockData'
import type { User } from '../../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
}

const storedAuth = localStorage.getItem('finance-auth')
const initialState: AuthState = storedAuth
  ? JSON.parse(storedAuth) as AuthState
  : { user: null, isAuthenticated: false, accessToken: null, refreshToken: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Partial<User> | undefined>) => {
      state.user = { ...defaultUser, ...action.payload }
      state.isAuthenticated = true
      state.accessToken = 'mock-access-token'
      state.refreshToken = 'mock-refresh-token'
      localStorage.setItem('finance-auth', JSON.stringify(state))
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      if (state.isAuthenticated) {
        try {
          localStorage.setItem('finance-auth', JSON.stringify(state))
        } catch {
          // The in-memory profile remains usable when browser storage is unavailable.
        }
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      localStorage.removeItem('finance-auth')
    },
  },
})

export const { login, logout, updateProfile } = authSlice.actions
export default authSlice.reducer
