import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api'

export default function ResourceDetail(){
  const { id } = useParams()
  const [resItem, setResItem] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    api.get(`/resources/${id}`).then(r=>setResItem(r.data)).catch(()=>{})
  },[id])

  if (!resItem) return <div className="max-w-4xl mx-auto p-6">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-semibold mb-2">{resItem.title}</h2>
      {resItem.forkFrom && (
        <div className="text-sm text-gray-500 mb-2">Remixed from <a className="text-indigo-600" href={`/resources/${resItem.forkFrom}`}>original</a></div>
      )}
      <div className="text-sm text-gray-500 mb-4">{resItem.subject} • {resItem.grade}</div>
      <div className="mb-3">
        {resItem.verified ? (
          <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded">Verified ✓</div>
        ) : (
          <div className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded">Not verified</div>
        )}
        {resItem.verificationNotes && (<div className="text-sm text-gray-500 mt-2">Notes: {resItem.verificationNotes}</div>)}
      </div>
      <p className="mb-4">{resItem.description}</p>
      <div className="mb-4 text-sm text-gray-600">Forks: {resItem.forkCount || 0}</div>
      <div className="space-y-2">
        {resItem.files?.map(f=> (
          <a key={f.url} href={f.url} className="text-indigo-600 block">{f.filename}</a>
        ))}
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={async ()=>{
          const token = localStorage.getItem('tn_token')
          if (!token) return navigate('/login')
          try{
            const res = await api.post(`/resources/${id}/remix`, {})
            navigate(`/resources/${res.data._id}`)
          }catch(e){ alert('Remix failed') }
        }} className="mt-4 px-4 py-2 bg-green-600 text-white rounded">Remix</button>

        <button onClick={async ()=>{
          try{
            const idToCheck = id
            const res = await api.post('/verify', { resourceId: idToCheck })
            const top = res.data.matches || []
            const list = top.slice(0,5).map(m => `${(m.score*100).toFixed(1)}% — ${m.title} (id:${m.id})`).join('\n')
            alert('Top matches:\n' + (list || 'No matches'))
          }catch(e){ console.error(e); alert('Check failed') }
        }} className="mt-4 px-4 py-2 bg-yellow-500 text-white rounded">Check Similarity</button>

        {/* Verify button for admins/principals */}
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
              }} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">Verify</button>
            )
          }
          return null
        })()}
      </div>
    </div>
  )
}
