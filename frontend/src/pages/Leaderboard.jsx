import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Leaderboard(){
  const [list, setList] = useState([])

  useEffect(()=>{
    api.get('/gamification/leaderboard').then(r=>setList(r.data.leaderboard)).catch(()=>{})
  }, [])

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>🏆 Leaderboard</h2>
      <div className="card">
        <ol style={{ listStylePosition: 'inside', paddingLeft: 0 }}>
          {list.map((u,i)=> (
            <li key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'var(--muted)' }}>#{i+1}</span>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>{u.name}</div>
                  <div className="muted small">{u.school || 'No school'}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{u.xp || 0} XP</div>
                <div className="muted small">Level {u.level || 1}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
