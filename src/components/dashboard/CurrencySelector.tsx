import { useState, type FormEvent } from 'react'
import { useCurrency } from '../../contexts/useCurrency'

export function CurrencySelector() {
  const { currentCurrency, exchangeRates, setCurrency, addCustomCurrency } = useCurrency()
  const [code, setCode] = useState('')
  const [rate, setRate] = useState('')

  const submitCustomCurrency = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    addCustomCurrency(code, Number(rate))
    setCode('')
    setRate('')
  }

  return (
    <div className="flex items-center gap-1">
      <label className="sr-only" htmlFor="currency-select">Display currency</label>
      <select id="currency-select" value={currentCurrency} onChange={(event) => setCurrency(event.target.value)} className="max-w-24 rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
        {Object.keys(exchangeRates).sort().map((currency) => <option key={currency} value={currency}>{currency}</option>)}
      </select>
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg px-2 py-2 text-xs text-slate-500 hover:bg-white dark:hover:bg-slate-900" title="Add custom currency rate">+</summary>
        <form onSubmit={submitCustomCurrency} className="absolute right-0 top-10 z-20 w-56 space-y-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <label className="block text-xs text-slate-500">Currency code
            <input aria-label="Currency code" required maxLength={3} value={code} onChange={(event) => setCode(event.target.value)} placeholder="GBP" className="mt-1 w-full rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm uppercase dark:border-slate-700" />
          </label>
          <label className="block text-xs text-slate-500">Units per INR
            <input aria-label="Units per INR" required min="0.000001" step="any" type="number" value={rate} onChange={(event) => setRate(event.target.value)} placeholder="0.0095" className="mt-1 w-full rounded-md border border-slate-200 bg-transparent px-2 py-1.5 text-sm dark:border-slate-700" />
          </label>
          <button className="w-full rounded-md bg-slate-900 px-2 py-1.5 text-xs font-semibold text-white dark:bg-amber-300 dark:text-slate-950">Add currency</button>
        </form>
      </details>
    </div>
  )
}