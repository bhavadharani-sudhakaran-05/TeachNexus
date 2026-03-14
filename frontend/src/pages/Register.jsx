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
      navigate('/dashboard')
    }catch(err){
      setError(err.response?.data?.message || 'Register failed')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Create account</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full p-3 border rounded" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border rounded" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-3 border rounded" />
        <button className="w-full bg-indigo-600 text-white p-3 rounded">Sign up</button>
      </form>
    </div>
  )
}
