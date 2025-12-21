import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Golf4Community Authentication',
  description: 'Connecting Golfers. Empowering Communities.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <section className="antialiased w-full p-3">{children}</section>
}
