import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Golf4Community Authentication',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="antialiased w-full min-h-screen">{children}</main>
}
