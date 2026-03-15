import React, { useEffect, useState } from 'react'
import api from '../api'

export default function NotificationsPage(){
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)

  async function load(){
    try{
      const res = await api.get('/notifications')
      setItems(res.data.items || [])
      setUnread(res.data.unread || 0)
      // notify Nav about unread count
      window.dispatchEvent(new CustomEvent('notifications:updated', { detail: { unread: res.data.unread || 0 } }))
    }catch(e){ console.error(e) }
  }

  async function markAllRead(){
    try{
      await api.put('/notifications/read-all')
      load()
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ load() },[])

  async function markRead(id){
    try{
      await api.put(`/notifications/${id}/read`)
      load()
    }catch(e){ console.error(e) }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', marginTop: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 600 }}>🔔 Notifications ({unread})</h2>
        <button onClick={markAllRead} className="btn secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Mark All Read</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {items.map(n => (
          <div key={n._id} className="card" style={{ background: n.read ? 'var(--card)' : 'linear-gradient(90deg, rgba(124,92,255,0.1), transparent)', borderLeft: n.read ? 'none' : '3px solid var(--accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{n.title}</div>
                <div className="muted small">{n.body}</div>
                <div className="muted small" style={{ fontSize: '0.8rem', marginTop: '8px' }}>📅 {new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.read && <button onClick={()=>markRead(n._id)} className="btn secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>Mark Read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
