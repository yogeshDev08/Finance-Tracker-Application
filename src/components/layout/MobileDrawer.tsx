import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { Menu, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setMobileDrawerOpen } from '../../features/ui/uiSlice'
import { Sidebar } from './Sidebar'

export function MobileDrawer() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((state) => state.ui.mobileDrawerOpen)

  return <>
    <button type="button" onClick={() => dispatch(setMobileDrawerOpen(true))} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Open navigation"><Menu size={21} /></button>
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={() => dispatch(setMobileDrawerOpen(false))}>
        <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"><div className="fixed inset-0 bg-slate-950/40" /></TransitionChild>
        <div className="fixed inset-0 flex"><TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="ease-in duration-150" leaveFrom="translate-x-0" leaveTo="-translate-x-full"><DialogPanel className="relative flex w-72 max-w-[85vw] bg-white dark:bg-slate-950"><button type="button" onClick={() => dispatch(setMobileDrawerOpen(false))} className="absolute right-3 top-4 z-10 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close navigation"><X size={20} /></button><Sidebar mobile /></DialogPanel></TransitionChild></div>
      </Dialog>
    </Transition>
  </>
}
