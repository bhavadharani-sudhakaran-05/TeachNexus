import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api'

export default function ResourceDetail(){
  const { id } = useParams()
  const [resItem, setResItem] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    api.get(`/resources/${id}`).then(r=>setResItem(r.data)).catch(()=>{})
  },[id])

  if (!resItem) return <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>⏳ Loading...</div>

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px', marginTop: '24px' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '8px' }}>📚 {resItem.title}</h2>
        {resItem.forkFrom && (
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px' }}>
            Remixed from <a href={`/resources/${resItem.forkFrom}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>original</a>
          </div>
        )}
        <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '16px' }}>
          {resItem.subject} • {resItem.grade}
        </div>
        
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {resItem.verified ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: 'rgba(0, 212, 255, 0.1)', color: 'var(--accent)', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600 }}>✓ Verified</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 12px', backgroundColor: 'rgba(255, 204, 0, 0.1)', color: 'var(--accent)', borderRadius: '8px', fontSize: '0.875rem' }}>⏳ Pending verification</span>
          )}
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>🔀 {resItem.forkCount || 0} remixes</span>
        </div>
        
        {resItem.verificationNotes && <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '16px', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>📝 {resItem.verificationNotes}</div>}
        
        <p style={{ fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px', color: 'var(--text-secondary)' }}>{resItem.description}</p>
        
        {resItem.files && resItem.files.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '12px', fontSize: '0.95rem' }}>📎 Attachments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resItem.files.map(f=> (
                <a key={f.url} href={f.url} style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '0.95rem', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '6px', display: 'inline-block', maxWidth: 'fit-content' }}>
                  🔗 {f.filename}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button onClick={async ()=>{
            const token = localStorage.getItem('tn_token')
            if (!token) return navigate('/login')
            try{
              const res = await api.post(`/resources/${id}/remix`, {})
              navigate(`/resources/${res.data._id}`)
            }catch(e){ alert('Remix failed') }
          }} className="btn" style={{ padding: '10px 16px' }}>🎨 Remix This</button>

          <button onClick={async ()=>{
            try{
              const idToCheck = id
              const res = await api.post('/verify', { resourceId: idToCheck })
              const top = res.data.matches || []
              const list = top.slice(0,5).map(m => `${(m.score*100).toFixed(1)}% — ${m.title}`).join('\n')
              alert('Top similarity matches:\n' + (list || 'No matches found'))
            }catch(e){ console.error(e); alert('Check failed') }
          }} className="btn" style={{ padding: '10px 16px', backgroundColor: 'rgba(255, 204, 0, 0.2)', color: 'var(--accent)', border: '1px solid rgba(255, 204, 0, 0.3)' }}>🔍 Check Similarity</button>

          {(() => {
            const u = JSON.parse(localStorage.getItem('tn_user')||'null')
            if (u && (u.role==='admin' || u.role==='principal')){
              return (
                <button onClick={async ()=>{
                  const notes = prompt('Enter verification notes (optional)')
                  const ok = confirm('Mark resource as verified?')
                  try{
                    await api.put(`/verify/${id}`, { verified: ok, notes })
                    alert('Verification updated')
                    window.location.reload()
                  }catch(e){ console.error(e); alert('Verification failed') }
                }} className="btn" style={{ padding: '10px 16px', backgroundColor: 'rgba(0, 212, 255, 0.2)', color: 'var(--accent)', border: '1px solid rgba(0, 212, 255, 0.3)' }}>✅ Verify Resource</button>
              )
            }
            return null
          })()}
        </div>
      </div>
    </div>
  )
}
