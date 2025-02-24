import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'aiPod - AI-Powered Music Experience',
  description: 'Control your music with natural voice commands',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="w-full px-8 py-4 bg-black/5 backdrop-blur-md fixed top-0 z-50">
          <div className="max-w-6xl mx-auto">
            <ul className="flex justify-between items-center">
              <li>
                <Link href="/" className="text-black hover:text-blue-500">Home</Link>
              </li>
              <li>
                <Link 
                  href="/ipod" 
                  className="text-black hover:text-blue-500 transition-colors"
                >
                  Try aiPod Now
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
