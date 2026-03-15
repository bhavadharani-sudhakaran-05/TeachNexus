import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Admin(){
  const [summary, setSummary] = useState(null)
  const [topResources, setTopResources] = useState([])

  useEffect(()=>{
    fetchSummary()
    fetchTop()
  },[])

  async function fetchSummary(){
    try{
      const res = await api.get('/analytics/summary')
      setSummary(res.data)
    }catch(e){ console.error(e) }
  }

  async function fetchTop(){
    try{
      const res = await api.get('/analytics/top-resources')
      setTopResources(res.data.items || [])
    }catch(e){ console.error(e) }
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px' }}>📊 Admin Dashboard</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>Events (7d)</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{summary ? summary.totalEvents : '—'}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>👥 Active Users (7d)</div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>{summary ? summary.activeUsers : '—'}</div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>📈 Top Event Types</div>
          <div style={{ marginTop: '8px' }}>
            {summary ? summary.byType.map((bt, i) => (
              <div key={bt._id} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                {i + 1}. {bt._id}: <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{bt.count}</span>
              </div>
            )) : <div style={{ color: 'var(--muted)' }}>—</div>}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <a href="/admin/templates" className="btn" style={{ display: 'inline-block', padding: '10px 16px' }}>✉️ Email Template Editor</a>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 600, marginBottom: '16px', fontSize: '1.1rem' }}>🏆 Top Resources (30d)</h3>
        {topResources.length ? (
          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            {topResources.map((it, i) => (
              <div key={it._id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>#{i + 1} {it._id.slice(0, 12)}...</span>
                <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{it.count} creations</span>
              </div>
            ))}
          </div>
        ) : <div style={{ fontSize: '0.875rem', color: 'var(--muted)', textAlign: 'center', padding: '20px' }}>📭 No data available</div>}
      </div>
    </div>
  )
}
