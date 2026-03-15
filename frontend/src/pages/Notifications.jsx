import React, { useEffect, useState } from 'react'
import api from '../api'

export default function NotificationsPage(){
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)

  async function load(){
    try{
      const res = await api.get('/notifications')
      setItems(res.data.items || [])
      setUnread(res.data.unread || 0)
      // notify Nav about unread count
      window.dispatchEvent(new CustomEvent('notifications:updated', { detail: { unread: res.data.unread || 0 } }))
    }catch(e){ console.error(e) }
  }

  async function markAllRead(){
    try{
      await api.put('/notifications/read-all')
      load()
    }catch(e){ console.error(e) }
  }

  useEffect(()=>{ load() },[])

  async function markRead(id){
    try{
      await api.put(`/notifications/${id}/read`)
      load()
    }catch(e){ console.error(e) }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Notifications ({unread})</h2>
        <button onClick={markAllRead} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Mark all read</button>
      </div>
      <div className="space-y-3">
        {items.map(n => (
          <div key={n._id} className={`p-4 rounded border ${n.read ? 'bg-white' : 'bg-indigo-50'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium">{n.title}</div>
                <div className="text-sm text-gray-700">{n.body}</div>
                <div className="text-xs text-gray-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              {!n.read && <button onClick={()=>markRead(n._id)} className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded text-sm">Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
