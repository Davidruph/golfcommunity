import Nav from '@/components/website/Nav'
import Footer from '@/components/website/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  )
}
