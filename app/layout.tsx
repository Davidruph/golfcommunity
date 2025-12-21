import type { Metadata } from 'next'
import { Host_Grotesk, Instrument_Serif, Geist } from 'next/font/google'
import './globals.css'
import { ReduxProvider } from '@/provider/Provider'
import CustomToast from '@/utils/showAlert'

const hostGrotesk = Host_Grotesk({
  variable: '--font-host-grotesk',
  subsets: ['latin'],
})

const instrumentSerif = Instrument_Serif({
  weight: '400',
  variable: '--font-instrument-serif',
  subsets: ['latin'],
})

const geist = Geist({
  weight: '400',
  variable: '--font-geist',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Golf4Community',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${hostGrotesk.variable} ${instrumentSerif.variable} ${geist.variable} antialiased w-full min-h-screen`}
      >
        <ReduxProvider>
          {children}
          <CustomToast />
        </ReduxProvider>
      </body>
    </html>
  )
}
