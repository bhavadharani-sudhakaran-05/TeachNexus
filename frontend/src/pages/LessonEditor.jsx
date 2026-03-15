import React, { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { useParams } from 'react-router-dom'

export default function LessonEditor(){
  const { id } = useParams()
  const [connected, setConnected] = useState(false)
  const [content, setContent] = useState('')
  const textareaRef = useRef(null)
  const providerRef = useRef(null)

  useEffect(()=>{
    const doc = new Y.Doc()
    const room = id ? `lesson-${id}` : `lesson-temp`
    const wsUrl = import.meta.env.VITE_WS_URL || (import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE.replace('/api','') : 'ws://localhost:5000')
    const provider = new WebsocketProvider(wsUrl, room, doc)
    providerRef.current = provider

    provider.on('status', ev => setConnected(ev.status === 'connected'))

    const ytext = doc.getText('content')
    // init local state
    setContent(ytext.toString())

    const observer = () => setContent(ytext.toString())
    ytext.observe(observer)

    return ()=>{
      ytext.unobserve(observer)
      provider.disconnect()
      doc.destroy()
    }
  }, [id])

  function onChange(e){
    const value = e.target.value
    const doc = providerRef.current && providerRef.current.doc
    if (!doc) { setContent(value); return }
    const ytext = doc.getText('content')
    // replace entire text (simple approach)
    doc.transact(()=>{
      ytext.delete(0, ytext.length)
      ytext.insert(0, value)
    })
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '16px' }}>✍️ Collaborative Lesson Editor</h2>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>📍 Room: <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{id ? `lesson-${id}` : 'lesson-temp'}</span></span>
        <span style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: connected ? '#00d4ff' : '#ff6b6b' }}></span>
          <span style={{ color: connected ? 'var(--accent)' : '#ff6b6b' }}>{connected ? '🟢 Connected' : '🔴 Connecting...'}</span>
        </span>
      </div>
      
      <div className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <textarea 
          ref={textareaRef} 
          value={content} 
          onChange={onChange} 
          rows={20}
          style={{ 
            width: '100%', 
            padding: '14px', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px', 
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            lineHeight: '1.5'
          }} 
        />
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', textAlign: 'center', padding: '8px' }}>
          💡 Real-time sync via Yjs • Open same URL in another tab/browser to collaborate
        </div>
      </div>
    </div>
  )
}
