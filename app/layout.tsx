import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { RouteProvider } from '@/contexts/route-context'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: 'DisruptGuard - AI Supply Chain Risk Dashboard',
  description: 'AI-powered supply chain risk monitoring and predictive analytics for India logistics',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1a1b26',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <RouteProvider>
          {children}
        </RouteProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
