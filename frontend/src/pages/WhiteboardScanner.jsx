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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Whiteboard Scanner</h2>
      <div className="bg-white p-4 rounded shadow">
        <div className="mb-3">
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
        </div>
        <div className="mb-3">
          <button onClick={handleProcess} className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={processing}>{processing ? 'Processing...' : 'Process Image'}</button>
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Extracted Text</label>
          <textarea value={text} onChange={e=>setText(e.target.value)} rows={8} className="w-full p-2 border rounded" />
        </div>
        <div className="flex gap-3">
          <button onClick={generateLesson} className="px-4 py-2 bg-green-600 text-white rounded">Generate Lesson</button>
          <button onClick={saveAsResource} className="px-4 py-2 bg-gray-200 rounded">Save as Resource</button>
        </div>
      </div>
    </div>
  )
}
