import React from 'react'

export default function Hero(){
  return (
    <header className="hero">
      <div className="hero-inner container">
        <nav className="hero-nav" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>TN</div>
            <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>TeachNexus</div>
          </div>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
            <a style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none' }}>Features</a>
            <a style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none' }}>Community</a>
            <a style={{ color: 'rgba(255,255,255,0.88)', textDecoration: 'none' }}>Pricing</a>
            <button className="btn" style={{ padding: '10px 14px' }}>Get Started</button>
          </div>
        </nav>

        <div className="hero-grid">
          <div>
            <h1>Connect. Create. Improve learning.</h1>
            <p>A teacher-first platform for sharing lesson resources, co-creating plans, and growing professionally — powered by MERN.</p>
            <div className="actions" style={{ marginTop: 18 }}>
              <button className="btn">Start Free</button>
              <button className="btn secondary">Request Demo</button>
            </div>
          </div>

          <aside>
            <div className="hero-card demo-card">
              <h4>Quick Demo</h4>
              <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 10, padding: 12, marginBottom: 12 }}>Lesson topic: <strong>Fractions</strong></div>
              <div style={{ fontSize: '0.95rem', color: '#374151', marginBottom: 14 }}>AI Lesson: 30 min • Grade 4 • 3 activities</div>
              <a href="/resources" className="btn" style={{ padding: '8px 12px', fontSize: '0.9rem', display: 'inline-block' }}>Browse Resources</a>
            </div>
          </aside>
        </div>
      </div>
    </header>
  )
}
