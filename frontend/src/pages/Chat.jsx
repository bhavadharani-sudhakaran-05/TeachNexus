import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import api from '../api'

export default function Chat(){
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)

  useEffect(()=>{
    const token = localStorage.getItem('tn_token')
    const base = (import.meta.env.VITE_WS_URL) || (import.meta.env.VITE_API_BASE?.replace('/api','')) || 'http://localhost:5000'
    const socket = io(base, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', ()=> setConnected(true))
    socket.on('disconnect', ()=> setConnected(false))

    socket.on('message', (m)=> setMessages(prev => [...prev, m]))
    socket.on('history', (arr)=> setMessages(arr || []))
    socket.on('presence', (p)=> setMessages(prev => [...prev, { system: true, text: `${p.user.name || 'User'} ${p.status}${p.room ? ' in '+p.room : ''}` }]))

    // auto-join global on connect
    socket.on('connect', ()=>{
      socket.emit('join_room', 'global')
    })

    return ()=>{
      socket.disconnect()
    }
  }, [])

  function send(){
    if (!text) return
    socketRef.current.emit('message', { room, text })
    setText('')
  }

  async function joinRoom(r){
    if (!socketRef.current) return
    setRoom(r)
    socketRef.current.emit('join_room', r)
    // load history via API as fallback
    try{
      const res = await api.get(`/chat/${encodeURIComponent(r)}`)
      setMessages(res.data || [])
    }catch(e){
      // ignore
    }
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>Real-time Chat</h2>
      <div className="card" style={{ padding: '20px' }}>
        <div className="muted-small" style={{ marginBottom: '16px' }}>Status: <span style={{ color: connected ? 'var(--success)' : 'var(--danger)', fontWeight: 600 }}>{connected ? '🟢 Connected' : '🔴 Disconnected'}</span></div>
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={()=>joinRoom('global')} className={room==='global' ? 'btn' : 'btn secondary'} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Global</button>
            <button onClick={()=>joinRoom('math-4')} className={room==='math-4' ? 'btn' : 'btn secondary'} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Math Grade 4</button>
            <button onClick={()=>joinRoom('science-ks3')} className={room==='science-ks3' ? 'btn' : 'btn secondary'} style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Science KS3</button>
          </div>
          <div style={{ height: '320px', overflowY: 'auto', padding: '12px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', marginBottom: '16px' }}>
            {messages.map((m, i)=> (
              <div key={i} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                {m.system ? <span className="muted" style={{ fontStyle: 'italic' }}>{m.text}</span> : <><strong style={{ marginRight: '8px', color: 'var(--accent)' }}>{m.username || m.user?.name || 'User'}:</strong><span>{m.text}</span></>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={text} onChange={e=>setText(e.target.value)} style={{ flex: 1, padding: '10px 12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} placeholder="Type a message..." />
          <button onClick={send} className="btn" style={{ padding: '10px 16px' }}>Send</button>
        </div>
      </div>
    </div>
  )
}
