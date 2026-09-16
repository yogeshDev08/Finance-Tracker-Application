import { Bell, Search } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { MobileDrawer } from './MobileDrawer'
import { Sidebar } from './Sidebar'

export function MainLayout() {
  const currentUser = useAppSelector((state) => state.auth.user)
  return <div className="flex min-h-screen bg-[#f7f8fa] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Sidebar />
    <div className="min-w-0 flex-1">
      <header className="flex h-19 items-center justify-between border-b border-slate-200/80 bg-[#f7f8fa]/90 px-5 backdrop-blur md:px-9 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="flex items-center gap-3"><MobileDrawer /><div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-400 md:flex dark:border-slate-800 dark:bg-slate-900"><Search size={16} /><span className="text-sm">Search anything...</span><kbd className="ml-12 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800">⌘ K</kbd></div><h1 className="font-display text-xl font-semibold tracking-tight md:hidden">Ledgerly</h1></div>
        <div className="flex items-center gap-4"><button type="button" className="relative rounded-lg p-2 text-slate-500 hover:bg-white dark:hover:bg-slate-900" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-rose-500" /></button><div className="grid size-9 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-amber-800 dark:bg-amber-300/20 dark:text-amber-200">{currentUser?.initials ?? 'AM'}</div></div>
      </header>
      <main className="p-5 md:p-9"><Outlet /></main>
    </div>
  </div>
}
