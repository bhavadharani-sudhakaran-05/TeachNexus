import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export default function Notifications(){
  const [notes, setNotes] = useState([])

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('tn_token') : null
    const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    const socket = io(url, { auth: { token } })

    socket.on('connect', ()=>{})
    socket.on('notification', (n) => {
      const id = Date.now() + Math.random()
      const item = { id, ...n }
      setNotes(s => [item, ...s])
      // auto remove after 6s
      setTimeout(()=> setNotes(s => s.filter(x => x.id !== id)), 6000)
    })

    return ()=> socket.disconnect()
  },[])

  if (!notes.length) return null

  return (
    <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 60 }}>
      {notes.map(n => (
        <div key={n.id} className="mb-2 p-3 bg-white shadow rounded border w-80">
          <div className="font-medium">{n.type === 'badge_awarded' ? 'Badge Awarded' : 'Notification'}</div>
          {n.badges && <div className="text-sm text-gray-700 mt-1">You earned: {n.badges.join(', ')}</div>}
          {n.message && <div className="text-sm text-gray-700 mt-1">{n.message}</div>}
        </div>
      ))}
    </div>
  )
}
