import React from 'react'
import '../(frontend)/globals.css'
import '../../components/EndUserComm/styles/globals.css'

export const metadata = {
  title: 'End-user Communication',
  description: 'Create and manage branded message & templates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
