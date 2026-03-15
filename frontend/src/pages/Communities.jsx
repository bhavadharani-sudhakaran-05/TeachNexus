import React from 'react'

export default function Communities(){
  const mock = [
    { id:1, name: 'Math Grade 4', members: 124 },
    { id:2, name: 'Science Secondary', members: 86 },
    { id:3, name: 'Early Years Literacy', members: 54 }
  ]

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>👥 Communities</h2>
      <div className="grid">
        {mock.map(c=> (
          <div key={c.id} className="card glow">
            <h3 style={{ fontWeight: 600, marginBottom: '8px', fontSize: '1.1rem' }}>{c.name}</h3>
            <div className="muted small">{c.members} members</div>
            <button className="btn" style={{ marginTop: '16px', padding: '8px 12px', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>Join Community</button>
          </div>
        ))}
      </div>
    </div>
  )
}
