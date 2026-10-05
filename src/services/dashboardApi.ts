export type FinanceKind = 'earning' | 'expense' | 'investment' | 'savings' | 'loan'

export interface FinanceRecord {
  id: string
  kind: FinanceKind
  amount: number
  date: string
}

export interface DashboardGoal {
  id: string
  name: string
  kind: FinanceKind
  targetAmount: number
  isLimit?: boolean
}

export interface DashboardData {
  records: FinanceRecord[]
  goals: DashboardGoal[]
}

const monthlyBase: Record<FinanceKind, number> = {
  earning: 78000,
  expense: 42800,
  investment: 21500,
  savings: 18500,
  loan: 12000,
}

export async function getDashboardData(): Promise<DashboardData> {
  await new Promise((resolve) => window.setTimeout(resolve, 350))
  const now = new Date()
  const kinds = Object.keys(monthlyBase) as FinanceKind[]
  const records: FinanceRecord[] = []

  for (let monthOffset = 47; monthOffset >= 0; monthOffset -= 1) {
    const month = new Date(now.getFullYear(), now.getMonth() - monthOffset, 1)
    for (const [kindIndex, kind] of kinds.entries()) {
      const variation = 0.84 + ((monthOffset * 7 + kindIndex * 11) % 33) / 100
      records.push({
        id: `${kind}-${month.getFullYear()}-${month.getMonth()}`,
        kind,
        amount: Math.round(monthlyBase[kind] * variation),
        date: new Date(month.getFullYear(), month.getMonth(), 2).toISOString(),
      })
    }
  }

  for (let dayOffset = 0; dayOffset < 14; dayOffset += 1) {
    for (const kind of ['earning', 'expense'] as const) {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOffset)
      records.push({
        id: `${kind}-day-${dayOffset}`,
        kind,
        amount: Math.round(monthlyBase[kind] / 30 * (0.65 + ((dayOffset * 13) % 60) / 100)),
        date: date.toISOString(),
      })
    }
  }

  return {
    records,
    goals: [
      { id: 'earning', name: 'Monthly earning target', kind: 'earning', targetAmount: 90000 },
      { id: 'investment', name: 'Investment target', kind: 'investment', targetAmount: 25000 },
      { id: 'savings', name: 'Savings target', kind: 'savings', targetAmount: 30000 },
      { id: 'expense', name: 'Expense limit', kind: 'expense', targetAmount: 50000, isLimit: true },
      { id: 'loan', name: 'Loan repayment target', kind: 'loan', targetAmount: 15000 },
    ],
  }
}