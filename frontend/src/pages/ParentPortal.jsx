import React, { useEffect, useState } from 'react'
import api from '../api'
import { useTranslation } from 'react-i18next'

export default function ParentPortal(){
  const { t } = useTranslation()
  const [children, setChildren] = useState([])
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(()=>{
    fetchChildren()
  },[])

  async function fetchChildren(){
    try{
      const res = await api.get('/parents/children')
      setChildren(res.data.children || [])
    }catch(e){
      console.error(e)
    }
  }

  async function linkChild(e){
    e.preventDefault()
    try{
      const res = await api.post('/parents/link', { childEmail: email })
      setMsg(res.data.message)
      setEmail('')
      fetchChildren()
    }catch(err){
      setMsg(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">{t('app.parent_portal')}</h2>
      <form onSubmit={linkChild} className="mb-4 flex items-center space-x-2">
        <input placeholder="child@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="border px-3 py-2 rounded flex-1" />
        <button className="px-4 py-2 bg-indigo-600 text-white rounded">{t('app.link_child')}</button>
      </form>
      {msg && <div className="mb-4 text-sm text-green-700">{msg}</div>}
      <div>
        <h3 className="text-lg font-medium mb-2">{t('app.children')}</h3>
        <ul className="space-y-2">
          {children.map(c=> (
            <li key={c._id} className="p-3 border rounded flex justify-between">
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-600">{c.email}</div>
              </div>
              <div className="text-sm text-gray-700">XP: {c.xp || 0} • Level: {c.level || 1}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
