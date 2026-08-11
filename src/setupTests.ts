import '@testing-library/jest-dom'

/**
 * jsdom implements neither matchMedia nor the View Transitions API. Stub the
 * former so theme resolution runs its real code path; leave the latter absent
 * so ThemeToggle exercises its documented fallback.
 */
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}
