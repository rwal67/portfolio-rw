import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'rorypwalsh.com',
  description: 'The Premier Rory Walsh Portfolio',
  icons: {
    icon: '/rory2.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}