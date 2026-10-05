import { useEffect, useRef, type PropsWithChildren } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { useAppSelector } from './hooks'

function ThemeController({ children }: Readonly<PropsWithChildren>) {
  const theme = useAppSelector((state) => state.ui.theme)
  const transitionTimer = useRef<number | null>(null)

  useEffect(() => {
    const root = document.documentElement
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemTheme.matches)
      if (root.dataset.themeInitialized === 'true') {
        root.classList.add('theme-transitioning')
        if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
        transitionTimer.current = window.setTimeout(() => {
          root.classList.remove('theme-transitioning')
          transitionTimer.current = null
        }, 450)
      } else {
        root.dataset.themeInitialized = 'true'
      }
      root.classList.toggle('dark', isDark)
      root.style.colorScheme = isDark ? 'dark' : 'light'
    }

    applyTheme()
    if (theme !== 'system') return

    systemTheme.addEventListener('change', applyTheme)
    return () => systemTheme.removeEventListener('change', applyTheme)
  }, [theme])

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
    document.documentElement.classList.remove('theme-transitioning')
  }, [])

  return children
}

export function AppProviders({ children }: Readonly<PropsWithChildren>) {
  return <Provider store={store}><ThemeController>{children}</ThemeController></Provider>
}
