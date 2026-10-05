import { createContext, useMemo, useState, type PropsWithChildren } from 'react'

type ExchangeRates = Record<string, number>

interface CurrencyContextValue {
  currentCurrency: string
  exchangeRates: ExchangeRates
  setCurrency: (currency: string) => void
  addCustomCurrency: (currency: string, rate: number) => void
  convertAmount: (amountInINR: number) => number
  formatAmount: (amountInINR: number, options?: Intl.NumberFormatOptions) => string
}

export const CurrencyContext = createContext<CurrencyContextValue | null>(null)

const defaults: ExchangeRates = { INR: 1, USD: 0.012, EUR: 0.011 }

export function CurrencyProvider({ children }: Readonly<PropsWithChildren>) {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>(() => {
    try {
      const saved = localStorage.getItem('finance-currency-rates')
      return saved ? { ...defaults, ...JSON.parse(saved) as ExchangeRates } : defaults
    } catch {
      return defaults
    }
  })
  const [currentCurrency, setCurrentCurrency] = useState(() => {
    const saved = localStorage.getItem('finance-currency')
    return saved && (saved in exchangeRates) ? saved : 'INR'
  })

  const value = useMemo<CurrencyContextValue>(() => ({
    currentCurrency,
    exchangeRates,
    setCurrency: (currency) => {
      if (currency in exchangeRates) {
        setCurrentCurrency(currency)
        localStorage.setItem('finance-currency', currency)
      }
    },
    addCustomCurrency: (currency, rate) => {
      const code = currency.trim().toUpperCase()
      if (!/^[A-Z]{3}$/.test(code) || !Number.isFinite(rate) || rate <= 0) return
      const updated = { ...exchangeRates, [code]: rate }
      setExchangeRates(updated)
      setCurrentCurrency(code)
      localStorage.setItem('finance-currency-rates', JSON.stringify(updated))
      localStorage.setItem('finance-currency', code)
    },
    convertAmount: (amountInINR) => amountInINR * (exchangeRates[currentCurrency] ?? 1),
    formatAmount: (amountInINR, options = {}) => new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currentCurrency,
      maximumFractionDigits: 2,
      ...options,
    }).format(amountInINR * (exchangeRates[currentCurrency] ?? 1)),
  }), [currentCurrency, exchangeRates])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}