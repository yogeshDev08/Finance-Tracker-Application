import { useEffect, useState } from 'react'
import { ArrowRight, Lightbulb, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { ChartGrid } from '../../components/dashboard/ChartPanel'
import { SummaryCard, type SummaryMetric } from '../../components/dashboard/SummaryCard'
import { PageHeader } from '../../components/ui/PageHeader'
import { useCurrency } from '../../contexts/useCurrency'
import { useApi } from '../../hooks/useApi'
import { getDashboardData, type DashboardGoal, type FinanceKind, type FinanceRecord } from '../../services/dashboardApi'

const metrics: SummaryMetric[] = [
  { label: 'Total earned', kind: 'earning', accent: 'mint' },
  { label: 'Total spend', kind: 'expense', accent: 'coral' },
  { label: 'Total saved', kind: 'savings', accent: 'blue' },
  { label: 'Total invested', kind: 'investment', accent: 'gold' },
]

function getGreeting(date: Date) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  if (hour >= 17 && hour < 21) return 'Good evening'
  return 'Good night'
}

function monthTotal(records: FinanceRecord[], kind: FinanceKind, now: Date) {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  return records.reduce((total, record) => {
    const date = new Date(record.date)
    return record.kind === kind && !record.id.includes('-day-') && date >= monthStart && date <= now ? total + record.amount : total
  }, 0)
}

function GoalRows({ goals, records, isLoading }: { readonly goals: DashboardGoal[]; readonly records: FinanceRecord[]; readonly isLoading: boolean }) {
  const [visibleGoals, setVisibleGoals] = useState<string[]>(['earning', 'investment', 'savings'])
  const { formatAmount } = useCurrency()
  const now = new Date()
  const availableGoals = goals.filter((goal) => visibleGoals.includes(goal.id))
  const goalContent = isLoading
    ? [0, 1, 2].map((item) => <div key={item} className="h-20 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />)
    : availableGoals.map((goal) => {
      const achieved = monthTotal(records, goal.kind, now)
      const remaining = Math.max(0, goal.targetAmount - achieved)
      const progress = Math.min(100, achieved / goal.targetAmount * 100)
      const exceeded = Boolean(goal.isLimit && achieved > goal.targetAmount)
      const exceededBy = goal.targetAmount ? (achieved - goal.targetAmount) / goal.targetAmount * 100 : 0
      return <div key={goal.id} className="rounded-lg transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
        <div className="mb-2 flex justify-between gap-3 text-sm"><span className="text-slate-600 dark:text-slate-300">{goal.name}</span><span className="shrink-0 font-semibold text-slate-900 dark:text-white">{Math.round(progress)}%</span></div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className={`h-full rounded-full ${exceeded ? 'bg-rose-500' : 'bg-amber-300'}`} style={{ width: `${progress}%` }} /></div>
        <p className={`mt-2 text-xs ${exceeded ? 'font-semibold text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>
          {exceeded ? `${formatAmount(achieved - goal.targetAmount)} over budget (${exceededBy.toFixed(0)}%); ${formatAmount(achieved)} of ${formatAmount(goal.targetAmount)}` : `${formatAmount(achieved)} of ${formatAmount(goal.targetAmount)} · ${formatAmount(remaining)} remaining`}
        </p>
      </div>
    })

  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><UserRound size={18} className="text-slate-400" /><h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">Monthly goals</h2></div>
      <details className="relative">
        <summary className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-300">Choose goals</summary>
        <div className="absolute right-0 top-9 z-10 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          {goals.map((goal) => <label key={goal.id} className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300"><input type="checkbox" checked={visibleGoals.includes(goal.id)} onChange={(event) => setVisibleGoals((current) => event.target.checked ? [...current, goal.id] : current.filter((id) => id !== goal.id))} />{goal.name}</label>)}
        </div>
      </details>
    </div>
    <div className="grid gap-5 md:grid-cols-3">{goalContent}</div>
  </section>
}

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading, error, refetch } = useApi('/dashboard', getDashboardData)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(interval)
  }, [])

  const joined = user?.accountCreatedAt ?? user?.joined
  const accountCreatedAt = joined && !Number.isNaN(new Date(joined).getTime()) ? new Date(joined).toISOString() : undefined
  const dateLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: '2-digit' }).format(now)
  const firstName = user?.name.trim().split(/\s+/)[0] ?? 'there'

  return <div className="mx-auto max-w-7xl">
    <PageHeader eyebrow={dateLabel} title={`${getGreeting(now)}, ${firstName}`} description="Here is your financial snapshot for this month."
      action={<button type="button" onClick={refetch} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-105 hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">↻ Refresh data</button>} />
    {error && <div role="alert" className="mb-5 flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300"><span>{error}</span><button type="button" onClick={refetch} className="font-semibold underline">Retry</button></div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <SummaryCard key={metric.kind} metric={metric} records={data?.records ?? []} accountCreatedAt={accountCreatedAt} isLoading={isLoading} />)}</div>
    <div className="mt-6">
      <ChartGrid records={data?.records ?? []} isLoading={isLoading} />
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-2">
      <Link to="/profile" className="block rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-800">
        <div className="mb-7 flex items-start justify-between">{user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="size-12 rounded-full object-cover" /> : <div className="grid size-12 place-items-center rounded-full bg-amber-200 text-sm font-bold text-slate-900">{user?.initials ?? '—'}</div>}<ArrowRight size={18} className="text-slate-400" /></div>
        <p className="text-sm text-slate-400">Your profile</p><h2 className="mt-1 font-display text-xl font-semibold">{user?.name ?? 'Profile'}</h2><p className="mt-1 text-sm text-slate-400">{user?.email ?? ''}</p>
        {joined && <p className="mt-3 text-xs text-slate-400">Member since {user?.joined ?? new Date(joined).toLocaleDateString()}</p>}
      </Link>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md dark:border-amber-300/20 dark:bg-amber-300/10">
        <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-300"><Lightbulb size={18} /><h2 className="font-semibold">AI insights</h2></div>
        <p className="text-sm leading-6 text-amber-900/75 dark:text-amber-100/75">You are spending 14% less on dining this month. Moving that difference into your emergency fund could help you reach your goal two months earlier.</p>
        <button type="button" className="mt-4 text-sm font-semibold text-amber-800 dark:text-amber-200">View recommendations <ArrowRight className="ml-1 inline" size={14} /></button>
      </section>
    </div>
    <GoalRows goals={data?.goals ?? []} records={data?.records ?? []} isLoading={isLoading} />
  </div>
}
