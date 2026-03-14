import React, { useEffect, useState } from 'react'
import api from '../api'

export default function BadgesList(){
  const [badges, setBadges] = useState([])

  useEffect(()=>{ fetchBadges() },[])

  async function fetchBadges(){
    try{
      const res = await api.get('/badges')
      setBadges(res.data.badges || [])
    }catch(e){ console.error(e) }
  }

  async function evalBadges(){
    try{
      const res = await api.post('/badges/evaluate')
      setBadges(res.data.badges || [])
      alert(res.data.awarded?.length ? `Awarded: ${res.data.awarded.join(',')}` : 'No new badges')
    }catch(e){ console.error(e) }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">My Badges</h3>
        <button onClick={evalBadges} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Evaluate</button>
      </div>
      <ul className="space-y-2">
        {badges.length ? badges.map(b => (
          <li key={b} className="p-2 border rounded">{b}</li>
        )) : <li className="text-sm text-gray-600">No badges yet</li>}
      </ul>
    </div>
  )
}
