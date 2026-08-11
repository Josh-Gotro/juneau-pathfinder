import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../ThemeToggle'

/*
 * jsdom has no View Transitions API, so these exercise the documented
 * fallback: the theme applies immediately without the circular wipe.
 */

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('defaults to dark when the system reports no light preference', () => {
    render(<ThemeToggle />)

    // Offers the switch *to* light, meaning it currently resolves dark.
    expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument()
  })

  it('stamps the chosen theme on the root element', () => {
    render(<ThemeToggle />)

    fireEvent.click(screen.getByLabelText('Switch to light theme'))

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
  })

  it('persists the choice across a remount', () => {
    const { unmount } = render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Switch to light theme'))
    unmount()

    render(<ThemeToggle />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'light')
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument()
  })

  it('keeps the installed app status bar in step with the theme', () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)

    render(<ThemeToggle />)
    fireEvent.click(screen.getByLabelText('Switch to light theme'))

    expect(meta.getAttribute('content')).toBe('#f5f7f4')
    document.head.removeChild(meta)
  })
})
