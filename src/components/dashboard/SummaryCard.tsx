import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useCurrency } from '../../contexts/useCurrency'
import type { FinanceKind, FinanceRecord } from '../../services/dashboardApi'

export type SummaryMetric = { label: string; kind: FinanceKind; accent: string }
export type PeriodOption = { id: string; label: string; months?: number; days?: number }

const periods: PeriodOption[] = [
  { id: '1m', label: 'Last 1 month', months: 1 },
  { id: '2m', label: 'Last 2 months', months: 2 },
  { id: '3m', label: 'Last 3 months', months: 3 },
  { id: '6m', label: 'Last 6 months', months: 6 },
  { id: '1y', label: 'Last 1 year', months: 12 },
  { id: 'lifetime', label: 'Lifetime' },
]

function accountAgeInMonths(createdAt?: string) {
  if (!createdAt) return Number.POSITIVE_INFINITY
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY
  const now = new Date()
  return (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth()
}

function totalBetween(records: FinanceRecord[], kind: FinanceKind, start: Date, end: Date) {
  return records.reduce((total, record) => {
    const date = new Date(record.date)
    return record.kind === kind && !record.id.includes('-day-') && date >= start && date < end ? total + record.amount : total
  }, 0)
}

function getPeriodStart(period: PeriodOption, accountCreatedAt: string | undefined, records: FinanceRecord[], now: Date) {
  if (period.id === 'lifetime') return new Date(accountCreatedAt ?? records[0]?.date ?? now)
  if (period.id === '1m') return new Date(now.getFullYear(), now.getMonth(), 1)
  return new Date(now.getFullYear(), now.getMonth() - (period.months ?? 1), now.getDate())
}

export function SummaryCard({ metric, records, accountCreatedAt, isLoading }: {
  readonly metric: SummaryMetric
  readonly records: FinanceRecord[]
  readonly accountCreatedAt?: string
  readonly isLoading: boolean
}) {
  const [periodId, setPeriodId] = useState('1m')
  const [isOpen, setIsOpen] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const { formatAmount } = useCurrency()
  const now = new Date()
  const currentPeriod = periods.find((period) => period.id === periodId) ?? periods[0]
  const start = getPeriodStart(currentPeriod, accountCreatedAt, records, now)
  const end = new Date(now.getTime() + 1)
  const previousStart = new Date(start)
  if (currentPeriod.months) previousStart.setMonth(previousStart.getMonth() - currentPeriod.months)
  const currentTotal = totalBetween(records, metric.kind, start, end)
  const previousTotal = currentPeriod.id === 'lifetime' ? 0 : totalBetween(records, metric.kind, previousStart, start)
  const percent = previousTotal ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0
  const positive = metric.kind === 'expense' ? percent <= 0 : percent >= 0
  const accentClasses: Record<string, string> = {
    mint: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300',
    coral: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300',
    blue: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300',
    gold: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300',
  }
  const availablePeriods = accountAgeInMonths(accountCreatedAt) < 6 ? periods.filter((period) => period.id !== '1y') : periods

  useEffect(() => {
    if (!isOpen) return
    const handleOutsidePointer = (event: globalThis.PointerEvent) => {
      if (!cardRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handleOutsidePointer)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointer)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <motion.article ref={cardRef} layout whileHover={{ scale: 1.025, y: -2 }} transition={{ duration: 0.18 }} className={`relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${isOpen ? 'z-30' : 'z-0'}`}>
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} className="text-left text-sm text-slate-500 dark:text-slate-400">{metric.label}<span className="ml-2 text-xs">{currentPeriod.label}</span></button>
        <span className={`grid size-8 place-items-center rounded-lg ${accentClasses[metric.accent]}`}><TrendingUp size={16} /></span>
      </div>
      {isLoading ? <div className="h-8 w-36 animate-pulse rounded bg-slate-100 dark:bg-slate-800" /> : <div className="flex items-end justify-between gap-2">
        <p className="font-display text-2xl font-semibold text-slate-950 dark:text-white">{formatAmount(currentTotal)}</p>
        <span className={`flex items-center text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{previousTotal ? `${Math.abs(percent).toFixed(1)}%` : 'New'}
        </span>
      </div>}
      {isOpen && <div className="absolute left-4 right-4 top-14 z-10 rounded-xl border border-white/70 bg-white/85 p-2 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/85 dark:shadow-black/30">
        {availablePeriods.map((period) => <button key={period.id} type="button" onClick={() => { setPeriodId(period.id); setIsOpen(false) }} className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${periodId === period.id ? 'bg-amber-100/80 font-semibold text-slate-900 dark:bg-amber-300/15 dark:text-amber-200' : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80'}`}>{period.label}</button>)}
      </div>}
    </motion.article>
  )
}