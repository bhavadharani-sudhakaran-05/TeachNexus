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
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Upload Resource</h3>
      <form onSubmit={submit} className="space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-3">
          <input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="p-2 border rounded" />
          <input value={grade} onChange={e=>setGrade(e.target.value)} placeholder="Grade" className="p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm mb-1">Attach file (optional)</label>
          <input type="file" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
      </form>
    </div>
  )
}
