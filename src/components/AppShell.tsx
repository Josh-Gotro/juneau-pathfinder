import React from 'react'
import { ThemeToggle } from './ThemeToggle'
import { OfflineIcon } from './icons'
import { useOnline } from '../hooks/useOnline'

interface Props {
  title: string
  children: React.ReactNode
  /** Thumb-zone controls: travel mode and view navigation. */
  footer: React.ReactNode
}

/**
 * Screen chrome shared by both views.
 *
 * Content is top-aligned so that revealing the notes panel or a QR code grows
 * the page downward instead of re-centering it and sliding the next tap target
 * out from under your thumb. On wide containers the card recovers its centered
 * look — see the `shell` container query in index.css.
 */
export const AppShell: React.FC<Props> = ({ title, children, footer }) => {
  const online = useOnline()

  return (
  <div className="flex h-full flex-col bg-ground text-ink">
    <header className="grid shrink-0 grid-cols-[3rem_1fr_3rem] items-center pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <span aria-hidden="true" />
      <h1 className="text-center text-2xl font-extrabold tracking-tight">{title}</h1>
      <ThemeToggle />
    </header>

    <main className="shell-main flex flex-1 flex-col overflow-y-auto pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
      <div className="shell-card mx-auto w-full max-w-md space-y-5 pb-6">
        {!online && (
          <p
            role="status"
            className="reveal flex items-center gap-2 rounded-control border border-edge bg-surface px-3 py-2 text-sm text-ink-muted"
          >
            <OfflineIcon className="size-4 shrink-0" />
            No signal. Directions need a connection — copy the coordinates instead.
          </p>
        )}
        {children}
      </div>
    </main>

    <footer className="@container shrink-0 border-t border-edge bg-surface pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2">{footer}</div>
      </footer>
    </div>
  )
}
