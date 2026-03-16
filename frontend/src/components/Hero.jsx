import React from 'react'

export default function Hero(){
  return (
    <header className="hero">
      <div className="hero-inner container">
        {/* Hero Navigation */}
        <nav className="hero-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="logo">TN</div>
            <span className="hero-nav-brand">TeachNexus</span>
          </div>
          <div className="hero-nav-links">
            <a href="#features">Features</a>
            <a href="#community">Community</a>
            <a href="#pricing">Pricing</a>
            <button className="btn primary">Get Started</button>
          </div>
        </nav>

        {/* Hero Grid */}
        <div className="hero-grid">
          <div>
            <h1>Where Great Teachers Come to Grow Together</h1>
            <p>A teacher-first platform for sharing lesson resources, co-creating plans, and growing professionally — powered by AI and community, built on the MERN stack.</p>
            
            <div className="actions">
              <button className="btn primary">Start Free Today</button>
              <button className="btn secondary">Watch Demo</button>
            </div>
          </div>

          {/* Demo Card */}
          <aside>
            <div className="hero-card demo-card">
              <h4>✨ Quick Demo</h4>
              <div className="demo-topic">Fractions for Grade 4</div>
              <div className="demo-meta">
                📚 AI Lesson • 30 min • 3 activities • ⭐⭐⭐⭐⭐
              </div>
              <a href="/resources" className="btn primary" style={{ display: 'inline-block' }}>
                Browse Resources →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </header>
  )
}
