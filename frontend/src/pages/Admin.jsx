import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Admin(){
  const [summary, setSummary] = useState(null)
  const [topResources, setTopResources] = useState([])

  useEffect(()=>{
    fetchSummary()
    fetchTop()
  },[])

  async function fetchSummary(){
    try{
      const res = await api.get('/analytics/summary')
      setSummary(res.data)
    }catch(e){ console.error(e) }
  }

  async function fetchTop(){
    try{
      const res = await api.get('/analytics/top-resources')
      setTopResources(res.data.items || [])
    }catch(e){ console.error(e) }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel</h2>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Events (7d)</div>
          <div className="text-2xl font-bold">{summary ? summary.totalEvents : '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Users (7d)</div>
          <div className="text-2xl font-bold">{summary ? summary.activeUsers : '—'}</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Top Event Types</div>
          <div className="mt-2">
            {summary ? summary.byType.map(bt => (
              <div key={bt._id} className="text-sm">{bt._1d}: {bt.count}</div>
            )) : '—'}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <a href="/admin/templates" className="px-3 py-2 bg-indigo-600 text-white rounded">Email Template Editor</a>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-3">Top Resources (30d)</h3>
        {topResources.length ? (
          <ul>
            {topResources.map(it => (
              <li key={it._id} className="py-2 border-b">Resource ID: {it._id} — {it.count} creations</li>
            ))}
          </ul>
        ) : <div className="text-sm text-gray-600">No data</div>}
      </div>
    </div>
  )
}
