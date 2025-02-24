import { RadioVisualizer } from "../../components/RadioVisualizer"
import Commands from "../../components/Commands"
import Link from 'next/link';

export default function Ipod() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white">
      <nav className="w-full px-8 py-4 bg-black/1 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <ul className="flex justify-between items-center">
            <li>
              <Link href="/" className="text-black hover:text-blue-500 transition-colors">aiPod</Link>
            </li>
            <li>
              <Link 
                href="/ipod" 
                className="text-black hover:text-blue-500  transition-colors"
              >
                Launch App
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="w-full bg-grey max-w-md mt-32 px-8 space-y-8">
        
        <div className="p-8 rounded-2xl shadow-2xl border-gray-800">
          <RadioVisualizer />
          <Commands />
        </div>
      </div>
    </main>
  )
} 