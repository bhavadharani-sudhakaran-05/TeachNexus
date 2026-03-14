import React from 'react'
import Hero from '../components/Hero'

export default function Home(){
  return (
    <div>
      <Hero />
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold mb-6">Core Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Resource Library</h3>
            <p className="text-sm text-gray-600">Upload, search, review and bookmark lesson resources.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">Live Collaboration</h3>
            <p className="text-sm text-gray-600">Real-time co-editing and chat for teachers.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="font-medium text-lg mb-2">AI Tools</h3>
            <p className="text-sm text-gray-600">Lesson generator, summarizer and assistant.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
