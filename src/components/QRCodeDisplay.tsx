import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
}

export const QRCodeDisplay: React.FC<Props> = ({ url }) => {
  return (
    <div className="mt-6 text-center">
      <div className="bg-white p-4 inline-block">
        <QRCodeSVG value={url} size={256} />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-sm text-blue-600 hover:underline break-all"
      >
        Open directions in browser
      </a>
    </div>
  )
}
