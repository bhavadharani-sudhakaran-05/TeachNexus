import React, { useEffect, useRef, useState } from 'react'
import api from '../api'

export default function VoiceToLesson(){
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [generating, setGenerating] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(()=>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.lang = 'en-US'
    rec.interimResults = true
    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r=>r[0].transcript).join('')
      setTranscript(text)
    }
    rec.onend = ()=> setListening(false)
    recognitionRef.current = rec
    return ()=>{
      try{ rec.stop() }catch(e){}
    }
  }, [])

  function toggle(){
    const rec = recognitionRef.current
    if (!rec) return alert('Speech Recognition not supported in this browser')
    if (listening){ rec.stop(); setListening(false) }
    else { rec.start(); setListening(true) }
  }

  async function generate(){
    if (!transcript) return alert('No transcript to generate from')
    setGenerating(true)
    try{
      const res = await api.post('/ai/lesson', { topic: transcript.slice(0,120), grade: 'Mixed', duration: 30, extra: 'Generated from voice notes' })
      const plan = res.data.plan || { title:'', objectives:[], activities:[] }
      // save if logged in
      const token = localStorage.getItem('tn_token')
      if (!token) return alert('Generated. Login to save')
      await api.post('/lessonplans', { title: plan.title, objectives: plan.objectives, activities: plan.activities, grade: plan.grade || 'Mixed', subject: plan.subject || 'Voice notes' })
      alert('Lesson plan generated & saved')
    }catch(e){ console.error(e); alert('Generation failed') }
    finally{ setGenerating(false) }
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>🎤 Voice-to-Lesson Plan</h2>
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <button onClick={toggle} className={listening ? 'btn' : 'btn secondary'} style={{ padding: '12px 24px', fontSize: '1rem', width: '100%' }}>{listening ? '⏹️ Stop Recording' : '🎙️ Start Recording'}</button>
          {listening && <div style={{ marginTop: '12px', color: 'var(--danger)', fontWeight: 600, textAlign: 'center' }}>🔴 Recording...</div>}
        </div>
        <div>
          <label className="small" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>📝 Transcript</label>
          <textarea value={transcript} onChange={e=>setTranscript(e.target.value)} rows={6} placeholder="Your voice transcript will appear here, or type manually..."  style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit', fontFamily: 'inherit', resize: 'vertical' }} />
        </div>
      </div>
      <div>
        <button onClick={generate} className="btn" style={{ padding: '12px 24px', width: '100%' }} disabled={generating}>{generating ? '⏳ Generating...' : '✨ Generate Lesson Plan'}</button>
      </div>
    </div>
  )
}
