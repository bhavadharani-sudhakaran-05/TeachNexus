import React, { useState } from 'react'
import api from '../api'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('tn_token', res.data.token)
      localStorage.setItem('tn_user', JSON.stringify(res.data.user))
      navigate('/onboarding')
    }catch(err){
      setError(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <div className="card" style={{ maxWidth: '380px', width: '100%', padding: '32px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '24px', textAlign: 'center' }}>Create Account</h2>
        {error && <div style={{ background: 'rgba(251,113,133,0.15)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid rgba(251,113,133,0.2)' }}>{error}</div>}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
          <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: 'inherit' }} />
          <button className="btn" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>Sign Up</button>
        </form>
      </div>
    </div>
  )
}
