import { motion } from 'framer-motion'
import { BarChart3, CircleDollarSign, CreditCard, HandCoins, LayoutDashboard, LogOut, PiggyBank, UserRound, WalletCards, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { logout } from '../../features/auth/authSlice'
import { toggleSidebar } from '../../features/ui/uiSlice'

const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Investment', to: '/investments', icon: BarChart3 },
  { label: 'Earning', to: '/earnings', icon: CircleDollarSign },
  { label: 'Expense', to: '/expenses', icon: WalletCards },
  { label: 'Loans', to: '/loans', icon: HandCoins },
  { label: 'Financials', to: '/financials', icon: PiggyBank },
  { label: 'Profile', to: '/profile', icon: UserRound },
]

interface SidebarProps { readonly mobile?: boolean }

export function Sidebar({ mobile = false }: SidebarProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const collapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const currentUser = useAppSelector((state) => state.auth.user)
  let sidebarWidth = 256
  if (!mobile && collapsed) sidebarWidth = 84

  const handleLogout = () => { dispatch(logout()); navigate('/login') }

  return (
    <motion.aside animate={{ width: sidebarWidth }} transition={{ duration: 0.22 }} className={`${mobile ? 'flex w-full' : 'hidden lg:flex'} min-h-screen shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-5 dark:border-slate-800 dark:bg-slate-950`}>
      <div className="flex items-center gap-3 px-3 pb-9">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-slate-900 text-amber-300 dark:bg-amber-300 dark:text-slate-950"><CreditCard size={21} /></div>
        {!collapsed && <span className="font-display text-lg font-semibold tracking-tight text-slate-900 dark:text-white">Ledgerly</span>}
      </div>
      <nav className="flex-1 space-y-1">
        {navigation.map(({ label, to, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === '/'} title={collapsed ? label : undefined} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white shadow-sm dark:bg-amber-300 dark:text-slate-950' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white'} ${collapsed ? 'justify-center' : ''}`}>
            <Icon size={19} strokeWidth={1.8} />
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-3 pt-5">
        <button type="button" onClick={() => dispatch(toggleSidebar())} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 ${collapsed ? 'justify-center' : ''}`} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}
          {!collapsed && 'Collapse menu'}
        </button>
        {!collapsed && currentUser && <div className="flex items-center gap-3 border-t border-slate-200 px-2 pt-5 dark:border-slate-800"><div className="grid size-9 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800 dark:bg-amber-300/20 dark:text-amber-200">{currentUser.initials}</div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 dark:text-white">{currentUser.name}</p><p className="text-xs text-slate-400">{currentUser.role}</p></div></div>}
        <button type="button" onClick={handleLogout} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/30 ${collapsed ? 'justify-center' : ''}`} title="Log out"><LogOut size={19} />{!collapsed && 'Log out'}</button>
      </div>
    </motion.aside>
  )
}
