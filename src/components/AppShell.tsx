import React from 'react'

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
export const AppShell: React.FC<Props> = ({ title, children, footer }) => (
  <div className="flex min-h-[100dvh] flex-col bg-ground text-ink">
    <header className="shrink-0 pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] pb-3">
      <h1 className="text-center text-2xl font-extrabold tracking-tight">{title}</h1>
    </header>

    <main className="shell-main flex flex-1 flex-col overflow-y-auto pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))]">
      <div className="shell-card mx-auto w-full max-w-md space-y-5 pb-6">{children}</div>
    </main>

    <footer className="@container shrink-0 border-t border-edge bg-surface pl-[max(1.25rem,env(safe-area-inset-left))] pr-[max(1.25rem,env(safe-area-inset-right))] pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex w-full max-w-md flex-col gap-2">{footer}</div>
    </footer>
  </div>
)
