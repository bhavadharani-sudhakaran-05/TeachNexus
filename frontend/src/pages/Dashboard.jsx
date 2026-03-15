import BadgesList from '../components/BadgesList'
import React from 'react'

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tn_user') || 'null') : null
  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>Dashboard</h2>
      {user ? (
        <div className="card" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontWeight: 600, marginBottom: '12px' }}>Welcome, {user.name}</h3>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{user ? user.name : 'Guest'}</div>
          <div className="muted">Role: {user ? user.role : '—'}</div>
          <div style={{ marginTop: '18px' }}>
            <div className="small" style={{ marginBottom: '6px' }}>XP: <strong>{user.xp || 0}</strong></div>
            <div className="small" style={{ marginBottom: '12px' }}>Level: <strong>{user.level || 1}</strong></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
              {(user.badges || []).length ? (user.badges || []).map(b => <span key={b} style={{ display: 'inline-block', padding: '4px 10px', background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', color: 'white', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>{b}</span>) : <span className="muted small">No badges yet</span>}
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            <a href="/leaderboard" className="btn" style={{ padding: '10px 16px', display: 'inline-block', textDecoration: 'none' }}>View Leaderboard</a>
          </div>
        </div>
      ) : (
        <div className="card" style={{ color: 'var(--muted)' }}>Please login to see your dashboard.</div>
      )}
      <div style={{ marginTop: '24px' }}>
        <BadgesList />
      </div>
    </div>
  )
}
