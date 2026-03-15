import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

function ResourceCard({r}){
  return (
    <div className="card glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>{r.title}</h4>
        <p className="muted small">{r.description}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="muted small">{r.subject} • {r.grade}</div>
        <Link to={`/resources/${r._id}`} className="btn" style={{ padding: '6px 12px', fontSize: '0.85rem', textDecoration: 'none', display: 'inline-block' }}>Open</Link>
      </div>
    </div>
  )
}

export default function Resources(){
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')

  async function load(){
    const res = await api.get('/resources', { params: { q } })
    setItems(res.data)
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', marginTop: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 600 }}>Resources</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search resources..." style={{ padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit', minWidth: '200px' }} />
          <button onClick={load} className="btn" style={{ padding: '10px 16px' }}>Search</button>
          <Link to="/resources/upload" className="btn secondary" style={{ padding: '10px 16px', textDecoration: 'none', display: 'inline-block' }}>Upload</Link>
        </div>
      </div>
      <div className="grid">
        {items.map(it=> <ResourceCard key={it._id} r={it} />)}
      </div>
    </div>
  )
}
