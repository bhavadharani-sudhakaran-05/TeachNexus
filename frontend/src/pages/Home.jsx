import React from 'react'
import Hero from '../components/Hero'

export default function Home(){
  return (
    <div>
      <Hero />
      <section className="container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px' }}>Core Features</h2>
        <div className="grid">
          <div className="card glow">
            <h3 style={{ marginBottom: '8px', fontWeight: 600 }}>📚 Resource Library</h3>
            <p className="muted">Upload, search, review and bookmark lesson resources.</p>
          </div>
          <div className="card glow">
            <h3 style={{ marginBottom: '8px', fontWeight: 600 }}>🤝 Live Collaboration</h3>
            <p className="muted">Real-time co-editing and chat for teachers.</p>
          </div>
          <div className="card glow">
            <h3 style={{ marginBottom: '8px', fontWeight: 600 }}>✨ AI Tools</h3>
            <p className="muted">Lesson generator, summarizer and assistant.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
