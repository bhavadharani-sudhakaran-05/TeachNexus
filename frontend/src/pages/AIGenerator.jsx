import React, { useState } from 'react'
import api from '../api'

export default function AIGenerator(){
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('Grade 4')
  const [duration, setDuration] = useState(30)
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)

  async function generate(e){
    e?.preventDefault()
    setLoading(true)
    try{
      const res = await api.post('/ai/lesson', { topic, grade, duration })
      setPlan(res.data.plan || { text: res.data.text })
    }catch(err){
      alert('Generation failed')
    }finally{ setLoading(false) }
  }

  async function save(){
    try{
      const token = localStorage.getItem('tn_token')
      if (!token) return alert('Login to save')
      const payload = {
        title: plan.title || `${topic} lesson`,
        objectives: plan.objectives || [],
        activities: plan.activities || [],
        grade,
        subject: topic
      }
      const res = await api.post('/lessonplans', payload)
      alert('Saved')
    }catch(err){
      alert('Save failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Lesson Generator</h2>
      <form onSubmit={generate} className="space-y-3 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm">Topic</label>
          <input value={topic} onChange={e=>setTopic(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Grade</label>
            <input value={grade} onChange={e=>setGrade(e.target.value)} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Duration (minutes)</label>
            <input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} className="w-full p-2 border rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" disabled={loading}>{loading ? 'Generating...' : 'Generate'}</button>
        </div>
      </form>

      {plan && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold text-xl mb-2">{plan.title}</h3>
          <div className="mb-3">
            <strong>Objectives</strong>
            <ul className="list-disc pl-6 text-sm text-gray-700">{(plan.objectives||[]).map((o,i)=> <li key={i}>{o}</li>)}</ul>
          </div>
          <div>
            <strong>Activities</strong>
            <ol className="list-decimal pl-6 text-sm text-gray-700">{(plan.activities||[]).map((a,i)=> (
              <li key={i} className="mb-2"><div className="font-medium">{a.title} — {a.durationMinutes}m</div><div className="text-sm">{a.description}</div></li>
            ))}</ol>
          </div>
          <div className="mt-4">
            <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">Save to Lesson Plans</button>
          </div>
        </div>
      )}
    </div>
  )
}
