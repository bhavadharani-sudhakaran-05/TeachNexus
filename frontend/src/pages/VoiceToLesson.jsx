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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Voice-to-Lesson Plan</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <button onClick={toggle} className={`px-4 py-2 rounded ${listening ? 'bg-red-500 text-white' : 'bg-indigo-600 text-white'}`}>{listening ? 'Stop' : 'Start Recording'}</button>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Transcript</label>
          <textarea value={transcript} onChange={e=>setTranscript(e.target.value)} rows={6} className="w-full p-2 border rounded" />
        </div>
        <div>
          <button onClick={generate} className="px-4 py-2 bg-green-600 text-white rounded" disabled={generating}>{generating ? 'Generating...' : 'Generate Lesson'}</button>
        </div>
      </div>
    </div>
  )
}
