import { useEffect, type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { useAppSelector } from './hooks'

function ThemeController({ children }: PropsWithChildren) {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
  }, [theme])

  return children
}

export function AppProviders({ children }: PropsWithChildren) {
  return <Provider store={store}><ThemeController>{children}</ThemeController></Provider>
}
