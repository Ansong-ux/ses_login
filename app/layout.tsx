import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "UG Computer Engineering Department",
  description: "University of Ghana Computer Engineering Department Management System",
    generator: 'v0.dev',
    icons: {
        icon: '/images/seslogo.jpg',
    }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
