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
    <div className="container">
      <h2 style={{ fontSize: '1.875rem', fontWeight: 600, marginBottom: '24px', marginTop: '24px' }}>🤖 AI Lesson Generator</h2>
      <form onSubmit={generate} className="card" style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label className="small" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Topic or Subject</label>
          <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g., Fractions in Elementary Math" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="small" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Grade Level</label>
            <input value={grade} onChange={e=>setGrade(e.target.value)} placeholder="e.g., Grade 4" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
          </div>
          <div>
            <label className="small" style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Duration (minutes)</label>
            <input type="number" value={duration} onChange={e=>setDuration(Number(e.target.value))} min="15" max="120" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
          </div>
        </div>
        <button className="btn" style={{ padding: '12px' }} disabled={loading}>{loading ? '⏳ Generating...' : '✨ Generate Lesson'}</button>
      </form>

      {plan && (
        <div className="card">
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>📜 {plan.title || `${topic} Lesson Plan`}</h3>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>📚 Learning Objectives</h4>
            <ul style={{ paddingLeft: '20px' }}>
              {(plan.objectives||[]).map((o,i)=> <li key={i} className="small muted" style={{ marginBottom: '6px' }}>• {o}</li>)}
            </ul>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>🎯 Activities</h4>
            <ol style={{ paddingLeft: '20px' }}>
              {(plan.activities||[]).map((a,i)=> (
                <li key={i} className="small" style={{ marginBottom: '12px' }}><strong style={{ color: 'var(--accent)' }}>{a.title}</strong> <span className="muted">— {a.durationMinutes}min</span><div className="muted small" style={{ marginTop: '4px' }}>{a.description}</div></li>
              ))}
            </ol>
          </div>
          <button onClick={save} className="btn" style={{ padding: '10px 16px' }}>💾 Save to Lesson Plans</button>
        </div>
      )}
    </div>
  )
}
