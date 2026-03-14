import React from 'react'

export default function Hero(){
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <nav className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center font-semibold">TN</div>
            <div className="font-bold">TeachNexus</div>
          </div>
          <div className="space-x-4">
            <a className="hover:underline" href="#">Features</a>
            <a className="hover:underline" href="#">Community</a>
            <a className="hover:underline" href="#">Pricing</a>
            <button className="ml-2 bg-white text-indigo-600 px-4 py-2 rounded">Get Started</button>
          </div>
        </nav>

        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Connect. Create. Improve learning.</h1>
            <p className="text-lg text-white/90 mb-6">A teacher-first platform for sharing lesson resources, co-creating plans, and growing professionally — powered by MERN.</p>
            <div className="flex space-x-3">
              <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded shadow">Start Free</button>
              <button className="bg-white/20 text-white px-6 py-3 rounded border border-white/30">Request Demo</button>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="bg-white/10 rounded-lg p-6 shadow-inner">
              <h4 className="text-white font-semibold mb-2">Quick Demo</h4>
              <div className="bg-white rounded p-4 text-gray-800">Lesson topic: <strong>Fractions</strong></div>
              <div className="mt-4 text-sm text-white/90">AI Lesson: 30 min • Grade 4 • 3 activities</div>
              <div className="mt-4">
                <a href="/resources" className="text-sm bg-white text-indigo-600 px-3 py-2 rounded">Browse Resources</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
