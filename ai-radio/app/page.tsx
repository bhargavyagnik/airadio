import React from 'react';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-white via-blue-50/30 to-blue-100/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,70,255,0.04),transparent_25%),radial-gradient(circle_at_70%_60%,rgba(0,70,255,0.03),transparent_25%)]" />
      <div className="w-full max-w-6xl px-8 space-y-24 relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center space-y-8">
          <div className="relative">
            <h1 className="text-8xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 drop-shadow-sm">
              aiPod
            </h1>
            <div className="absolute -inset-x-24 top-1/2 transform -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />
          </div>
          <h2 className="text-2xl text-gray-500 font-light">
          The Future of Audio, Powered by AI.
          </h2>
          <Link 
            href="/ipod" 
            className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg group relative overflow-hidden"
          >
            <span className="relative z-10">Try aiPod Now</span>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]" />
          </Link>
        </section>

        <section className="text-center space-y-8 relative mb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,70,255,0.02),transparent_50%)]" />
          <h2 className="text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            AI-Powered Music Experience
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Control your music with natural voice commands. 
            Experience a new way of listening.
          </p>
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-medium mb-8 text-gray-700">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl border border-gray-200/60 hover:border-blue-500/50 transition-all bg-white/50 backdrop-blur-sm hover:bg-white/80 group">
                <h4 className="text-lg font-semibold mb-3 text-blue-800 group-hover:text-blue-600 transition-colors">Function Tool Calling</h4>
                <p className="text-gray-600">Advanced AI capabilities for seamless music control and interaction</p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-200/60 hover:border-blue-500/50 transition-all bg-white/50 backdrop-blur-sm hover:bg-white/80 group">
                <h4 className="text-lg font-semibold mb-3 text-blue-800 group-hover:text-blue-600 transition-colors">Smart News Integration</h4>
                <p className="text-gray-600">Real-time news updates powered by Perplexity AI</p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-200/60 hover:border-blue-500/50 transition-all bg-white/50 backdrop-blur-sm hover:bg-white/80 group">
                <h4 className="text-lg font-semibold mb-3 text-blue-800 group-hover:text-blue-600 transition-colors">Voice Assistant</h4>
                <p className="text-gray-600">Eleven Labs powered voice assistant for reminders and interactions</p>
              </div>
              <div className="p-8 rounded-2xl border border-gray-200/60 hover:border-blue-500/50 transition-all bg-white/50 backdrop-blur-sm hover:bg-white/80 group">
                <h4 className="text-lg font-semibold mb-3 text-blue-800 group-hover:text-blue-600 transition-colors">Coming Soon</h4>
                <p className="text-gray-600">More exciting features in development including personalized recommendations</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 
