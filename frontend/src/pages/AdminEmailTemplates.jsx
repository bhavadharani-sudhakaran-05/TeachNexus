import React, { useEffect, useState } from 'react'
import api from '../api'

export default function AdminEmailTemplates(){
  const [locales, setLocales] = useState({})
  const [selected, setSelected] = useState({ locale: 'en', name: 'badge' })
  const [html, setHtml] = useState('')
  const [text, setText] = useState('')

  useEffect(()=>{ loadList() },[])

  async function loadList(){
    try{
      const res = await api.get('/admin/templates/list')
      setLocales(res.data.locales || {})
    }catch(e){ console.error(e) }
  }

  async function loadTemplate(){
    try{
      const res = await api.get(`/admin/templates/${selected.locale}/${selected.name}`)
      setHtml(res.data.html || '')
      setText(res.data.text || '')
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ if (selected) loadTemplate() }, [selected])

  async function save(){
    try{
      await api.put(`/admin/templates/${selected.locale}/${selected.name}`, { html, text })
      alert('Saved')
    }catch(e){ console.error(e); alert('Save failed') }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Email Templates (Admin)</h2>
      <div className="mb-4 flex items-center space-x-3">
        <select value={selected.locale} onChange={e=>setSelected(s=>({ ...s, locale: e.target.value }))} className="border px-3 py-2">
          {Object.keys(locales).length ? Object.keys(locales).map(l=> <option key={l} value={l}>{l}</option>) : <option value="en">en</option>}
        </select>
        <select value={selected.name} onChange={e=>setSelected(s=>({ ...s, name: e.target.value }))} className="border px-3 py-2">
          {(locales[selected.locale] || ['badge']).map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <button onClick={loadTemplate} className="px-3 py-2 bg-indigo-600 text-white rounded">Load</button>
        <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">Save</button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium mb-2">HTML</h3>
          <textarea value={html} onChange={e=>setHtml(e.target.value)} className="w-full h-64 border p-2" />
        </div>
        <div>
          <h3 className="font-medium mb-2">Text</h3>
          <textarea value={text} onChange={e=>setText(e.target.value)} className="w-full h-64 border p-2" />
        </div>
      </div>
    </div>
  )
}
