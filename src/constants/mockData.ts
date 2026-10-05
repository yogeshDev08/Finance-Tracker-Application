import type { Earning, Expense, Investment, Loan, SummaryCard, User } from '../types'
import profileFixture from './profile.json'

export const user: User = profileFixture

export const summaryCards: SummaryCard[] = [
  { label: 'Total earned', value: '$12,480.00', change: '+8.4%', positive: true, accent: 'mint' },
  { label: 'Total spend', value: '$4,268.42', change: '-2.1%', positive: true, accent: 'coral' },
  { label: 'Total saved', value: '$8,211.58', change: '+12.6%', positive: true, accent: 'blue' },
  { label: 'Total invested', value: '$24,850.00', change: '+16.8%', positive: true, accent: 'gold' },
]

export const investments: Investment[] = [
  { name: 'Vanguard S&P 500 ETF', category: 'Index fund', invested: 8500, currentValue: 10120, returnRate: 19.1, status: 'Growing' },
  { name: 'Apple Inc.', category: 'Technology', invested: 4200, currentValue: 4980, returnRate: 18.6, status: 'Growing' },
  { name: 'iShares Core Bond ETF', category: 'Bonds', invested: 6000, currentValue: 6260, returnRate: 4.3, status: 'Stable' },
  { name: 'Fidelity Total Market', category: 'Index fund', invested: 3500, currentValue: 3490, returnRate: -0.3, status: 'Stable' },
]

export const earnings: Earning[] = [
  { source: 'Acme Corp. salary', date: 'Jun 28, 2026', category: 'Salary', amount: 6800, status: 'Received' },
  { source: 'Freelance project', date: 'Jun 21, 2026', category: 'Freelance', amount: 1250, status: 'Received' },
  { source: 'Dividend payout', date: 'Jun 14, 2026', category: 'Investments', amount: 184.5, status: 'Received' },
  { source: 'Photography session', date: 'Jul 04, 2026', category: 'Side income', amount: 450, status: 'Pending' },
]

export const expenses: Expense[] = [
  { merchant: 'Whole Foods Market', date: 'Jun 30, 2026', category: 'Groceries', amount: 124.86, payment: 'Visa •• 4820' },
  { merchant: 'Brooklyn Power & Light', date: 'Jun 28, 2026', category: 'Utilities', amount: 86.4, payment: 'Checking' },
  { merchant: 'Flight booking', date: 'Jun 24, 2026', category: 'Travel', amount: 422.1, payment: 'Visa •• 4820' },
  { merchant: 'Blue Bottle Coffee', date: 'Jun 22, 2026', category: 'Dining', amount: 18.75, payment: 'Visa •• 4820' },
]

export const loans: Loan[] = [
  { lender: 'Metro Bank', type: 'Home mortgage', balance: 248500, monthlyPayment: 1840, dueDate: 'Jul 01, 2026', progress: 32 },
  { lender: 'Lendwise', type: 'Student loan', balance: 18400, monthlyPayment: 420, dueDate: 'Jul 08, 2026', progress: 68 },
  { lender: 'Toyota Financial', type: 'Auto loan', balance: 12680, monthlyPayment: 385, dueDate: 'Jul 15, 2026', progress: 54 },
]
