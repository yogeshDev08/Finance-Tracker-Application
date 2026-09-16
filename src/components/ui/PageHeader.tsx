import type { ReactNode } from 'react'

interface PageHeaderProps { eyebrow?: string; title: string; description: string; action?: ReactNode }

export function PageHeader({ eyebrow, title, description, action }: Readonly<PageHeaderProps>) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-300">{eyebrow ?? 'Overview'}</p><h1 className="font-display text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl dark:text-white">{title}</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p></div>{action}</div>
}
