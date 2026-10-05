import { useMemo, useRef, useState, type PointerEvent } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from 'recharts'
import { Plus, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import type { PieSectorShapeProps } from 'recharts'
import { useCurrency } from '../../contexts/useCurrency'
import type { FinanceKind, FinanceRecord } from '../../services/dashboardApi'
import type { PeriodOption } from './SummaryCard'

type ChartType = 'Bar' | 'Line' | 'Donut' | 'Area'
interface ChartConfig { id: number; type: ChartType; span: number; kinds: FinanceKind[]; period: string }
const chartKinds: { id: FinanceKind; label: string }[] = [
  { id: 'investment', label: 'Investment' }, { id: 'earning', label: 'Earning' }, { id: 'expense', label: 'Expense' },
  { id: 'loan', label: 'Loans' }, { id: 'savings', label: 'Savings' },
]
const chartPeriods: PeriodOption[] = [
  { id: '7d', label: 'Last 7 days', days: 7 }, { id: '14d', label: 'Last 14 days', days: 14 },
  { id: '1m', label: 'Last 1 month', months: 1 }, { id: '2m', label: 'Last 2 months', months: 2 },
  { id: '3m', label: 'Last 3 months', months: 3 }, { id: '6m', label: 'Last 6 months', months: 6 },
  { id: '1y', label: 'Last 1 year', months: 12 }, { id: 'lifetime', label: 'Lifetime' },
]
const chartColors: Record<FinanceKind, string> = { earning: '#34d399', expense: '#fb7185', investment: '#38bdf8', savings: '#fbbf24', loan: '#94a3b8' }
const chartLabels: Record<FinanceKind, string> = { earning: 'Earnings', expense: 'Expenses', investment: 'Investments', savings: 'Savings', loan: 'Loans' }
const initialChart = (): ChartConfig => ({ id: Date.now(), type: 'Bar', span: 12, kinds: ['earning'], period: '6m' })

function getPeriodStart(period: PeriodOption, records: FinanceRecord[], now: Date) {
  if (period.id === 'lifetime') {
    const earliest = records.reduce((timestamp, record) => Math.min(timestamp, new Date(record.date).getTime()), now.getTime())
    return new Date(earliest)
  }
  if (period.days) return new Date(now.getFullYear(), now.getMonth(), now.getDate() - period.days + 1)
  return new Date(now.getFullYear(), now.getMonth() - (period.months ?? 3), now.getDate())
}

function groupRecords(records: FinanceRecord[], kinds: FinanceKind[], periodId: string) {
  const period = chartPeriods.find((option) => option.id === periodId) ?? chartPeriods[4]
  const now = new Date()
  const start = getPeriodStart(period, records, now)
  const buckets = new Map<string, Record<string, string | number>>()
  for (const record of records) {
    const date = new Date(record.date)
    if (!kinds.includes(record.kind) || date < start || date > now) continue
    if (period.days && !record.id.includes('-day-')) continue
    if (!period.days && record.id.includes('-day-')) continue
    const key = period.days ? date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : date.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
    const bucket = buckets.get(key) ?? { label: key, date: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
    bucket[record.kind] = Number(bucket[record.kind] ?? 0) + record.amount
    buckets.set(key, bucket)
  }
  return [...buckets.values()]
}

function ChartTooltip({ active, payload, label, formatAmount }: {
  readonly active?: boolean
  readonly payload?: { readonly name?: string | number; readonly value?: string | number; readonly payload?: { readonly date?: string } }[]
  readonly label?: string | number
  readonly formatAmount: (amount: number) => string
}) {
  if (!active || !payload?.length) return null
  const pointDate = payload[0]?.payload?.date
  return <div className="min-w-40 rounded-xl border border-white/70 bg-white/85 px-3.5 py-3 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/30">
    <p className="mb-2 border-b border-slate-200/80 pb-2 text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">{pointDate ?? String(label ?? '')}</p>
    <div className="space-y-1.5">
      {payload.map((entry, index) => {
        const kind = String(entry.name ?? '')
        return <div key={`${kind}-${index}`} className="flex items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i className="size-2 rounded-full" style={{ backgroundColor: chartColors[kind as FinanceKind] ?? '#94a3b8' }} />{chartLabels[kind as FinanceKind] ?? kind}</span>
          <span className="font-semibold tabular-nums text-slate-950 dark:text-white">{formatAmount(Number(entry.value ?? 0))}</span>
        </div>
      })}
    </div>
  </div>
}

function getChartTitle(kinds: FinanceKind[]) {
  if (kinds.length === 1) return chartLabels[kinds[0]]
  if (kinds.includes('earning')) return 'Cash flow'
  return 'Finance overview'
}

function FinancePieShape(props: PieSectorShapeProps) {
  const kind = props.payload?.name as FinanceKind
  return <Sector {...props} fill={chartColors[kind] ?? '#94a3b8'} />
}

function ChartVisualization({ type, kinds, points, formatAmount }: {
  readonly type: ChartType
  readonly kinds: FinanceKind[]
  readonly points: Record<string, string | number>[]
  readonly formatAmount: (amount: number, options?: Intl.NumberFormatOptions) => string
}) {
  const chartTooltip = <Tooltip cursor={{ fill: 'rgba(148, 163, 184, 0.10)' }} content={<ChartTooltip formatAmount={formatAmount} />} />
  const axes = <><CartesianGrid vertical={false} stroke="#e2e8f0" /><XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={11} /><YAxis tickLine={false} axisLine={false} fontSize={11} tickFormatter={(value: number) => formatAmount(value, { maximumFractionDigits: 0 })} /></>
  const pieData = chartKinds
    .filter(({ id }) => kinds.includes(id))
    .map(({ id, label }) => ({ name: id, label, value: points.reduce((sum, point) => sum + Number(point[id] ?? 0), 0) }))

  switch (type) {
    case 'Bar':
      return <BarChart data={points}>{axes}{chartTooltip}<Bar dataKey={kinds[0] ?? 'earning'} fill={chartColors[kinds[0] ?? 'earning']} radius={[4, 4, 0, 0]} />{kinds.slice(1).map((kind) => <Bar key={kind} dataKey={kind} fill={chartColors[kind]} radius={[4, 4, 0, 0]} />)}</BarChart>
    case 'Line':
      return <LineChart data={points}>{axes}{chartTooltip}{kinds.map((kind) => <Line key={kind} type="monotone" dataKey={kind} stroke={chartColors[kind]} strokeWidth={2} dot={false} />)}</LineChart>
    case 'Area':
      return <AreaChart data={points}>{axes}{chartTooltip}{kinds.map((kind) => <Area key={kind} type="monotone" dataKey={kind} stroke={chartColors[kind]} fill={chartColors[kind]} fillOpacity={0.22} />)}</AreaChart>
    case 'Donut':
      return <PieChart><Pie data={pieData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={88} paddingAngle={3} shape={FinancePieShape} />{chartTooltip}</PieChart>
  }
}

function ChartCard({ chart, records, onChange, onRemove, onDragStart, onDrop }: {
  readonly chart: ChartConfig
  readonly records: FinanceRecord[]
  readonly onChange: (next: ChartConfig) => void
  readonly onRemove: () => void
  readonly onDragStart: () => void
  readonly onDrop: () => void
}) {
  const { formatAmount } = useCurrency()
  const resizeOrigin = useRef<{ x: number; span: number } | null>(null)
  const points = useMemo(() => groupRecords(records, chart.kinds, chart.period), [records, chart.kinds, chart.period])
  const periodName = chartPeriods.find((period) => period.id === chart.period)?.label ?? 'Last 3 months'
  const title = getChartTitle(chart.kinds)

  const changeType = (type: ChartType) => onChange({ ...chart, type })
  const onResizeStart = (event: PointerEvent<HTMLButtonElement>) => {
    resizeOrigin.current = { x: event.clientX, span: chart.span }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onResizeMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!resizeOrigin.current) return
    const span = Math.max(4, Math.min(12, Math.round((resizeOrigin.current.span + (event.clientX - resizeOrigin.current.x) / 80) / 2) * 2))
    onChange({ ...chart, span })
  }

  return (
    <motion.section layout whileHover={{ y: -2 }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onDrop() }} style={{ gridColumn: `span ${chart.span} / span ${chart.span}` }} className="group relative min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div draggable onDragStart={onDragStart} className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">{title} – {periodName}</h2>
          <p className="mt-1 text-sm text-slate-500">Activity over time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`chart-type-${chart.id}`}>Chart type</label>
          <select id={`chart-type-${chart.id}`} value={chart.type} onChange={(event) => changeType(event.target.value as ChartType)} className="rounded-lg border border-slate-200/80 bg-white/60 px-2 py-2 text-xs text-slate-600 shadow-sm backdrop-blur-md transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-300/60 dark:border-slate-700/80 dark:bg-slate-800/55 dark:text-slate-300 dark:hover:bg-slate-800/80">
            {(['Bar', 'Line', 'Donut', 'Area'] as ChartType[]).map((type) => <option key={type}>{type}</option>)}
          </select>
          <label className="sr-only" htmlFor={`chart-period-${chart.id}`}>Chart date range</label>
          <select id={`chart-period-${chart.id}`} value={chart.period} onChange={(event) => onChange({ ...chart, period: event.target.value })} className="rounded-lg border border-slate-200/80 bg-white/60 px-2 py-2 text-xs text-slate-600 shadow-sm backdrop-blur-md transition hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-300/60 dark:border-slate-700/80 dark:bg-slate-800/55 dark:text-slate-300 dark:hover:bg-slate-800/80">
            {chartPeriods.map((period) => <option key={period.id} value={period.id}>{period.label}</option>)}
          </select>
          <details className="relative">
            <summary className="cursor-pointer list-none rounded-lg border border-slate-200/80 bg-white/60 px-2 py-2 text-xs text-slate-600 shadow-sm backdrop-blur-md transition hover:bg-white/80 dark:border-slate-700/80 dark:bg-slate-800/55 dark:text-slate-300 dark:hover:bg-slate-800/80">Data types</summary>
            <div className="absolute right-0 top-9 z-20 w-40 rounded-xl border border-white/70 bg-white/85 p-2 shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-black/30">
              {chartKinds.map(({ id, label }) => <label key={id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-600 transition-colors hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/80"><input type="checkbox" checked={chart.kinds.includes(id)} onChange={(event) => onChange({ ...chart, kinds: event.target.checked ? [...chart.kinds, id] : chart.kinds.filter((kind) => kind !== id) })} />{label}</label>)}
              <button type="button" onClick={() => onChange({ ...chart, kinds: chartKinds.map(({ id }) => id) })} className="px-2 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">All</button>
            </div>
          </details>
          {chart.id !== chartInitialId && <button type="button" onClick={onRemove} aria-label="Remove chart" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30">×</button>}
        </div>
      </div>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ChartVisualization type={chart.type} kinds={chart.kinds} points={points} formatAmount={formatAmount} />
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">{chart.kinds.map((kind) => <span key={kind} className="flex items-center gap-2"><i className="size-2 rounded-full" style={{ backgroundColor: chartColors[kind] }} />{chartLabels[kind]}</span>)}</div>
      <button type="button" onPointerDown={onResizeStart} onPointerMove={onResizeMove} onPointerUp={() => { resizeOrigin.current = null }} aria-label="Resize chart" title="Drag to resize" className="absolute bottom-1 right-1 grid size-5 cursor-ew-resize place-items-center text-slate-400 opacity-0 transition group-hover:opacity-100"><span className="h-3 w-1 border-x border-slate-400" /></button>
    </motion.section>
  )
}

const chartInitialId = 1

export function ChartGrid({ records, isLoading }: { readonly records: FinanceRecord[]; readonly isLoading: boolean }) {
  const [charts, setCharts] = useState<ChartConfig[]>(() => [{ ...initialChart(), id: chartInitialId }])
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const updateChart = (id: number, next: ChartConfig) => setCharts((current) => current.map((chart) => chart.id === id ? next : chart))
  const reset = () => setCharts([{ ...initialChart(), id: chartInitialId }])
  const addChart = () => setCharts((current) => [...current, { ...initialChart(), id: Date.now(), span: current.length ? 6 : 12 }])

  if (isLoading) return <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900" />
  return <div>
    <div className="group">
    <div className="mb-3 flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
      <button type="button" onClick={reset} className="flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-white dark:hover:bg-slate-900"><RotateCcw size={14} />Reset layout</button>
      <button type="button" onClick={addChart} title="Add New Chart" className="flex items-center gap-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:scale-105 dark:bg-amber-300 dark:text-slate-950"><Plus size={14} />Add chart</button>
    </div>
    <div className="grid grid-cols-12 items-start gap-6">
      {charts.map((chart) => <ChartCard key={chart.id} chart={chart} records={records} onChange={(next) => updateChart(chart.id, next)} onRemove={() => setCharts((current) => current.filter((entry) => entry.id !== chart.id))} onDragStart={() => setDraggedId(chart.id)} onDrop={() => {
        if (draggedId === null || draggedId === chart.id) return
        setCharts((current) => {
          const next = [...current]
          const from = next.findIndex((entry) => entry.id === draggedId)
          const to = next.findIndex((entry) => entry.id === chart.id)
          const [moved] = next.splice(from, 1)
          next.splice(to, 0, moved)
          return next
        })
        setDraggedId(null)
      }} />)}
    </div>
    </div>
  </div>
}