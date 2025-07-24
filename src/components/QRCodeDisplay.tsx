import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  url: string
  size?: number
}

export const QRCodeDisplay: React.FC<Props> = ({ url, size = 256 }) => {
  return (
    <div className="mt-6 text-center">
      <div className="bg-white p-4 inline-block">
        <QRCodeSVG value={url} size={size} />
      </div>
    </div>
  )
}
