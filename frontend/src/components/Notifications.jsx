import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import api from '../api'

export default function Notifications(){
  const [notes, setNotes] = useState([])

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('tn_token') : null
    const url = import.meta.env.VITE_WS_URL || 'http://localhost:5000'
    const socket = io(url, { auth: { token } })

    socket.on('connect', ()=>{})
    socket.on('notification', async (n) => {
      const id = Date.now() + Math.random()
      const item = { id, ...n }
      setNotes(s => [item, ...s])
      // auto remove after 6s
      setTimeout(()=> setNotes(s => s.filter(x => x.id !== id)), 6000)
      // refresh unread count UI by calling notifications endpoint and dispatch event
      try {
        const res = await api.get('/notifications')
        const unread = res.data.unread || 0
        window.dispatchEvent(new CustomEvent('notifications:updated', { detail: { unread } }))
      } catch(e){}
    })

    return ()=> socket.disconnect()
  },[])

  if (!notes.length) return null

  return (
    <div className="toast-container">
      {notes.map(n => (
        <div key={n.id} className="toast">
          <div className="title">{n.type === 'badge_awarded' ? 'Badge Awarded' : 'Notification'}</div>
          {n.badges && <div className="muted small mt-1">You earned: {n.badges.join(', ')}</div>}
          {n.message && <div className="muted small mt-1">{n.message}</div>}
        </div>
      ))}
    </div>
  )
}
