import { ArrowDownRight, ArrowUpRight, TrendingUp } from 'lucide-react'
import type { SummaryCard } from '../../types'

export function StatCard({ card }: { card: SummaryCard }) {
  const accents: Record<string, string> = { mint: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300', coral: 'bg-rose-50 text-rose-700 dark:bg-rose-400/10 dark:text-rose-300', blue: 'bg-sky-50 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300', gold: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300' }
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="mb-6 flex items-center justify-between"><span className="text-sm text-slate-500 dark:text-slate-400">{card.label}</span><span className={`grid size-8 place-items-center rounded-lg ${accents[card.accent]}`}><TrendingUp size={16} /></span></div><div className="flex items-end justify-between gap-2"><p className="font-display text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{card.value}</p><span className="flex items-center text-xs font-semibold text-emerald-600"><ArrowUpRight size={14} />{card.change}</span></div></div>
}

export function Amount({ value, positive = false }: { value: number; positive?: boolean }) { return <span className={positive ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'font-medium text-slate-800 dark:text-slate-200'}>{positive ? '+' : ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span> }

export function TrendIcon({ down = false }: { down?: boolean }) { return down ? <ArrowDownRight size={15} /> : <ArrowUpRight size={15} /> }
