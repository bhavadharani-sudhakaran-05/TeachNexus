import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

function ResourceCard({r}){
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold">{r.title}</h4>
      <p className="text-sm text-gray-600">{r.description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">{r.subject} • {r.grade}</div>
        <Link to={`/resources/${r._id}`} className="text-indigo-600 text-sm">Open</Link>
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
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Resources</h2>
        <div className="flex items-center space-x-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" className="border p-2 rounded" />
          <button onClick={load} className="bg-indigo-600 text-white px-4 py-2 rounded">Search</button>
          <Link to="/resources/upload" className="ml-2 px-4 py-2 bg-white border rounded">Upload</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map(it=> <ResourceCard key={it._id} r={it} />)}
      </div>
    </div>
  )
}
