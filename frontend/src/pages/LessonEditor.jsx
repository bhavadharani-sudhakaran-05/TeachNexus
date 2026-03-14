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
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Collaborative Lesson Editor</h2>
      <div className="mb-3 text-sm text-gray-600">Room: {id ? `lesson-${id}` : 'lesson-temp'} • Status: {connected ? 'Connected' : 'Disconnected'}</div>
      <textarea ref={textareaRef} value={content} onChange={onChange} rows={18} className="w-full p-3 border rounded bg-white" />
      <div className="text-sm text-gray-500 mt-2">This editor syncs in real-time using Yjs. Open the same URL in another browser to collaborate.</div>
    </div>
  )
}
