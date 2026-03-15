import React, { useState, useEffect } from 'react'
import api from '../api'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function UploadResource(){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('')
  const [file, setFile] = useState(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const remixId = searchParams.get('remixId')

  useEffect(()=>{
    async function loadRemix(){
      if (!remixId) return
      try{
        const res = await api.get(`/resources/${remixId}`)
        const r = res.data
        setTitle(r.title + ' (Remix)')
        setDescription(r.description)
        setSubject(r.subject)
        setGrade(r.grade)
      }catch(e){}
    }
    loadRemix()
  }, [remixId])

  async function submit(e){
    e.preventDefault()
    try{
      let files = []
      if (file) {
        const fd = new FormData()
        fd.append('file', file)
        const up = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/uploads', {
          method: 'POST',
          body: fd,
          headers: { Authorization: 'Bearer ' + (localStorage.getItem('tn_token') || '') }
        })
        if (!up.ok) throw new Error('Upload failed')
        const j = await up.json()
        files = [{ url: j.url, filename: j.filename, mimeType: j.mimeType }]
      }

      const payload = { title, description, subject, grade, files }
      const res = await api.post('/resources', payload)
      navigate(`/resources/${res.data._id}`)
    }catch(err){
      console.error(err)
      alert('Upload failed: ' + (err.message || ''))
    }
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', marginTop: '32px', marginBottom: '32px' }}>
      <div className="card">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>📤 Create Resource</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>📝 Title *</label>
            <input 
              value={title} 
              onChange={e=>setTitle(e.target.value)} 
              placeholder="Resource title"
              required
              style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>📋 Description *</label>
            <textarea 
              value={description} 
              onChange={e=>setDescription(e.target.value)} 
              placeholder="Detailed description of this resource"
              required
              rows={5}
              style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }} 
            />
          </div>
          
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>🎓 Subject *</label>
              <input 
                value={subject} 
                onChange={e=>setSubject(e.target.value)} 
                placeholder="e.g., Math, Science"
                required
                style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '6px' }}>👥 Grade Level *</label>
              <input 
                value={grade} 
                onChange={e=>setGrade(e.target.value)} 
                placeholder="e.g., 9th, High School"
                required
                style={{ width: '100%', padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem' }} 
              />
            </div>
          </div>
          
          <div style={{ padding: '12px', backgroundColor: 'rgba(0, 212, 255, 0.05)', border: '1px dashed rgba(0, 212, 255, 0.3)', borderRadius: '8px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '8px', fontWeight: 600 }}>📎 Attach File (Optional)</label>
            <input 
              type="file"
              onChange={e=>setFile(e.target.files?.[0]||null)}
              style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}
            />
            {file && <div style={{ fontSize: '0.875rem', color: 'var(--accent)', marginTop: '6px' }}>✓ {file.name}</div>}
          </div>
          
          <button className="btn" style={{ padding: '12px', fontSize: '1rem', fontWeight: 600, marginTop: '12px' }}>✨ Create Resource</button>
        </form>
      </div>
    </div>
  )
}
