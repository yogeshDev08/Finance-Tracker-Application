import { useCallback, useEffect, useState } from 'react'

interface ApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useApi<T>(endpoint: string, request: () => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({ data: null, isLoading: true, error: null })
  const [requestVersion, setRequestVersion] = useState(0)

  const refetch = useCallback(() => {
    setState((current) => ({ ...current, isLoading: true, error: null }))
    setRequestVersion((version) => version + 1)
  }, [])

  useEffect(() => {
    let cancelled = false
    request().then((data) => {
      if (!cancelled) setState({ data, isLoading: false, error: null })
    }).catch((error: unknown) => {
      if (!cancelled) setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error.message : `Unable to load ${endpoint}.`,
      })
    })
    return () => { cancelled = true }
  }, [endpoint, request, requestVersion])

  return { ...state, refetch }
}