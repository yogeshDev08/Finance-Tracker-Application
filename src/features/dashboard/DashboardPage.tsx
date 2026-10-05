import { ArrowRight, Lightbulb, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { summaryCards, user as defaultUser } from "../../constants/mockData";
import { StatCard } from "../../components/ui/StatCard";
import { PageHeader } from "../../components/ui/PageHeader";

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user) ?? defaultUser;
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        eyebrow="Wednesday, July 01"
        title={`Good morning, ${user.name.split(" ")[0]}`}
        description="Here is your financial snapshot for this month."
        action={
          <button type="button" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-700 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
            + Add transaction
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-7 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">Cash flow</h2>
              <p className="mt-1 text-sm text-slate-500">Income versus spending over time</p>
            </div>
            <select className="rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-xs text-slate-600 outline-none dark:border-slate-700 dark:text-slate-300">
              <option>Last 6 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="flex h-56 items-end gap-3 border-b border-slate-100 px-2 dark:border-slate-800 sm:gap-6">
            {[62, 42, 75, 53, 84, 68, 92].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-44 w-full items-end gap-1">
                  <div className="w-1/2 rounded-t bg-amber-300" style={{ height: `${height}%` }} />
                  <div className="w-1/2 rounded-t bg-slate-900 dark:bg-slate-600" style={{ height: `${Math.max(30, height - 25)}%` }} />
                </div>
                <span className="text-[11px] text-slate-400">{["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"][index]}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-5 text-xs text-slate-500">
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-amber-300" />
              Income
            </span>
            <span className="flex items-center gap-2">
              <i className="size-2 rounded-full bg-slate-900 dark:bg-slate-600" />
              Expenses
            </span>
          </div>
        </section>
        <div className="space-y-6">
          <Link to="/profile" className="block rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white transition hover:-translate-y-0.5 dark:border-slate-800">
            <div className="mb-7 flex items-start justify-between">
              <div className="grid size-12 place-items-center rounded-full bg-amber-200 text-sm font-bold text-slate-900">{user.initials}</div>
              <ArrowRight size={18} className="text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">Your profile</p>
            <h2 className="mt-1 font-display text-xl font-semibold">{user.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{user.email}</p>
          </Link>
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-300/20 dark:bg-amber-300/10">
            <div className="mb-4 flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Lightbulb size={18} />
              <h2 className="font-semibold">AI insights</h2>
            </div>
            <p className="text-sm leading-6 text-amber-900/75 dark:text-amber-100/75">You are spending 14% less on dining this month. Moving that difference into your emergency fund could help you reach your goal two months earlier.</p>
            <button type="button" className="mt-4 text-sm font-semibold text-amber-800 dark:text-amber-200">
              View recommendations <ArrowRight className="ml-1 inline" size={14} />
            </button>
          </section>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center gap-2">
          <UserRound size={18} className="text-slate-400" />
          <h2 className="font-display text-lg font-semibold text-slate-950 dark:text-white">Monthly goals</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["Emergency fund", 72, "$7,200 of $10,000"],
            ["Investment target", 58, "$5,800 of $10,000"],
            ["Debt payoff", 41, "$4,100 of $10,000"],
          ].map(([name, value, detail]) => (
            <div key={name as string}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{name}</span>
                <span className="font-semibold text-slate-900 dark:text-white">{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div className="h-full rounded-full bg-amber-300" style={{ width: `${value}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
