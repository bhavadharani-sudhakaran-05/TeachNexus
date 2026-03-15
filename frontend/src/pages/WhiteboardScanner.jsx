import React, { useState } from 'react'
import api from '../api'

export default function WhiteboardScanner(){
  const [file, setFile] = useState(null)
  const [text, setText] = useState('')
  const [processing, setProcessing] = useState(false)

  async function handleProcess(){
    if (!file) return alert('Choose an image first')
    setProcessing(true)
    try{
      const Tesseract = await import('tesseract.js')
      const { createWorker } = Tesseract
      const worker = createWorker({ logger: m => {} })
      await worker.load()
      await worker.loadLanguage('eng')
      await worker.initialize('eng')
      const { data } = await worker.recognize(file)
      await worker.terminate()
      setText(data.text || '')
    }catch(err){
      console.error('ocr error', err)
      alert('OCR failed')
    }finally{ setProcessing(false) }
  }

  async function generateLesson(){
    if (!text) return alert('No text extracted yet')
    try{
      const res = await api.post('/ai/lesson', { topic: text.slice(0,120), grade: 'Mixed', duration: 30, extra: 'Generated from whiteboard notes' })
      const plan = res.data.plan || { title:'', objectives:[], activities:[] }
      // open AI result in a simple editor by saving to lessonplans
      const token = localStorage.getItem('tn_token')
      if (!token) return alert('Login to save lesson plan')
      await api.post('/lessonplans', { title: plan.title, objectives: plan.objectives, activities: plan.activities, grade: plan.grade || 'Mixed', subject: plan.subject || 'From whiteboard' })
      alert('Lesson plan generated & saved')
    }catch(e){ console.error(e); alert('Generation failed') }
  }

  async function saveAsResource(){
    try{
      const token = localStorage.getItem('tn_token')
      if (!token) return alert('Login to save resource')
      const payload = { title: 'Whiteboard notes', description: text, subject: 'General', grade: 'Mixed', files: [] }
      const res = await api.post('/resources', payload)
      alert('Resource created')
    }catch(e){ console.error(e); alert('Save failed') }
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '24px' }}>📸 Whiteboard Scanner</h2>
      <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        <div style={{ padding: '16px', backgroundColor: 'rgba(0, 212, 255, 0.05)', border: '2px dashed rgba(0, 212, 255, 0.3)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '12px' }}>📤 Select a whiteboard image to scan</div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={e=>setFile(e.target.files?.[0]||null)}
            style={{ cursor: 'pointer' }}
          />
          {file && <div style={{ fontSize: '0.875rem', color: 'var(--accent)', marginTop: '8px', fontWeight: 600 }}>✓ {file.name}</div>}
        </div>
        
        <button 
          onClick={handleProcess} 
          className="btn"
          disabled={!file || processing}
          style={{ 
            padding: '12px', 
            opacity: !file || processing ? 0.5 : 1,
            cursor: !file || processing ? 'not-allowed' : 'pointer'
          }}
        >
          {processing ? '⏳ Processing with OCR...' : '🤖 Process Image'}
        </button>
        
        {(text || processing) && (
          <div>
            <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px' }}>📝 Extracted Text</label>
            <textarea 
              value={text} 
              onChange={e=>setText(e.target.value)} 
              rows={10}
              style={{ 
                width: '100%', 
                padding: '12px', 
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
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: '8px' }}>💡 Edit the text if needed before generating</div>
          </div>
        )}
        
        {text && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              onClick={generateLesson}
              className="btn"
              style={{ padding: '10px 16px', flex: 1, minWidth: '200px' }}
            >
              📚 Generate Lesson Plan
            </button>
            <button 
              onClick={saveAsResource}
              className="btn"
              style={{ 
                padding: '10px 16px', 
                flex: 1, 
                minWidth: '200px',
                backgroundColor: 'rgba(255, 204, 0, 0.2)',
                color: 'var(--accent)',
                border: '1px solid rgba(255, 204, 0, 0.3)'
              }}
            >
              💾 Save as Resource
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
