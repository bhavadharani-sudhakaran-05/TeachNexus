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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Real-time Chat</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-3 text-sm text-gray-500">Status: {connected ? 'Connected' : 'Disconnected'}</div>
        <div className="mb-3">
          <div className="flex gap-2 mb-3">
            <button onClick={()=>joinRoom('global')} className={`px-3 py-1 rounded ${room==='global' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Global</button>
            <button onClick={()=>joinRoom('math-4')} className={`px-3 py-1 rounded ${room==='math-4' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Math Grade 4</button>
            <button onClick={()=>joinRoom('science-ks3')} className={`px-3 py-1 rounded ${room==='science-ks3' ? 'bg-indigo-600 text-white' : 'bg-white border'}`}>Science KS3</button>
          </div>
          <div className="h-64 overflow-auto p-2 border rounded bg-gray-50 mb-3">
            {messages.map((m, i)=> (
              <div key={i} className={m.system ? 'text-sm text-gray-500 italic' : 'mb-2'}>
                {m.system ? (<span className="italic">{m.text}</span>) : (<><strong className="mr-2">{m.username || m.user?.name || 'User'}:</strong><span>{m.text}</span></>)}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <input value={text} onChange={e=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type a message" />
          <button onClick={send} className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
        </div>
      </div>
    </div>
  )
}
