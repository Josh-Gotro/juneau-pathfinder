import React from 'react'

interface Props {
  url: string
  className?: string
}

export const BrowserLink: React.FC<Props> = ({ url, className = "text-sm text-blue-400 hover:text-blue-300 hover:underline break-all" }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      Open directions in browser
    </a>
  )
}