import React from 'react'

export default function Hero(){
  return (
    <header style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', padding: '60px 0' }}>
      <div className="container">
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.25)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, backdropFilter: 'blur(4px)' }}>TN</div>
            <div style={{ fontWeight: 700 }}>TeachNexus</div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', cursor: 'pointer' }}>Features</a>
            <a style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', cursor: 'pointer' }}>Community</a>
            <a style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', cursor: 'pointer' }}>Pricing</a>
            <button className="btn" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>Get Started</button>
          </div>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '16px', lineHeight: 1.2 }}>Connect. Create. Improve learning.</h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '24px', lineHeight: 1.5 }}>A teacher-first platform for sharing lesson resources, co-creating plans, and growing professionally — powered by MERN.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn" style={{ padding: '12px 24px' }}>Start Free</button>
              <button className="btn secondary" style={{ padding: '12px 24px' }}>Request Demo</button>
            </div>
          </div>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h4 style={{ color: '#fff', fontWeight: 600, marginBottom: '12px' }}>Quick Demo</h4>
              <div style={{ background: 'rgba(255,255,255,0.95)', borderRadius: '10px', padding: '12px', color: '#0b1220', marginBottom: '12px' }}>Lesson topic: <strong>Fractions</strong></div>
              <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '16px' }}>AI Lesson: 30 min • Grade 4 • 3 activities</div>
              <a href="/resources" className="btn" style={{ padding: '8px 12px', fontSize: '0.85rem', display: 'inline-block' }}>Browse Resources</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
