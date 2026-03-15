import React, { useEffect, useState } from 'react'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function ParentPortal(){
  const { t } = useTranslation()
  const [children, setChildren] = useState([])
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    fetchChildren()
  },[])

  async function fetchChildren(){
    try{
      const res = await api.get('/parents/children')
      setChildren(res.data.children || [])
    }catch(e){
      console.error(e)
    }
  }

  async function linkChild(e){
    e.preventDefault()
    try{
      const res = await api.post('/parents/link', { childEmail: email })
      setMsg(res.data.message)
      setEmail('')
      fetchChildren()
    }catch(err){
      setMsg(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>👨‍👩‍👧 {t('app.parent_portal')}</h2>
      <form onSubmit={linkChild} className="card" style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <label className="small" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Link Your Child</label>
          <input placeholder="child@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
        </div>
        <button className="btn" style={{ padding: '10px 16px' }}>{t('app.link_child') || 'Link'}</button>
      </form>
      {msg && <div style={{ background: 'rgba(52,211,153,0.15)', color: 'var(--success)', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid rgba(52,211,153,0.2)' }}>{msg}</div>}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>{t('app.children') || 'My Children'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {children.map(c=> (
            <div key={c._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{c.name}</div>
                <div className="muted small">{c.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="small" style={{ marginBottom: '4px' }}><strong>XP:</strong> {c.xp || 0}</div>
                <div className="muted small"><strong>Level:</strong> {c.level || 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
