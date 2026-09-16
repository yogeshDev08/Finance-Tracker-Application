import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { ThemeMode } from '../../types'

interface UiState {
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  theme: ThemeMode
}

const storedTheme = localStorage.getItem('finance-theme') as ThemeMode | null
const initialState: UiState = {
  sidebarCollapsed: false,
  mobileDrawerOpen: false,
  theme: storedTheme ?? 'system',
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed },
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => { state.mobileDrawerOpen = action.payload },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload
      localStorage.setItem('finance-theme', action.payload)
    },
  },
})

export const { toggleSidebar, setMobileDrawerOpen, setTheme } = uiSlice.actions
export default uiSlice.reducer
