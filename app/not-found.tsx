import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>

      <Link
        href="/"
        className="px-6 py-3 rounded-md bg-black text-white hover:opacity-80 transition"
      >
        Go back home
      </Link>
    </div>
  )
}
