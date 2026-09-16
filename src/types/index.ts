export type ThemeMode = 'light' | 'dark' | 'system'

export interface User {
  id: string
  name: string
  email: string
  role: string
  initials: string
  location: string
  joined: string
}

export interface SummaryCard {
  label: string
  value: string
  change: string
  positive: boolean
  accent: string
}

export interface Investment {
  name: string
  category: string
  invested: number
  currentValue: number
  returnRate: number
  status: 'Growing' | 'Stable'
}

export interface Earning {
  source: string
  date: string
  category: string
  amount: number
  status: 'Received' | 'Pending'
}

export interface Expense {
  merchant: string
  date: string
  category: string
  amount: number
  payment: string
}

export interface Loan {
  lender: string
  type: string
  balance: number
  monthlyPayment: number
  dueDate: string
  progress: number
}
