import BadgesList from '../components/BadgesList'
import React from 'react'

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tn_user') || 'null') : null
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      {user ? (
        <div className="bg-white p-6 rounded shadow">
          <h3 className="font-medium">Welcome, {user.name}</h3>
          <div className="text-lg font-bold">{user ? user.name : 'Guest'}</div>
          <div className="text-sm text-gray-600">Role: {user ? user.role : '—'}</div>
          <div className="mt-3">
            <div className="text-sm">XP: <strong>{user.xp || 0}</strong></div>
            <div className="text-sm">Level: <strong>{user.level || 1}</strong></div>
            <div className="mt-2">Badges: {(user.badges || []).length ? (user.badges||[]).map(b=> <span key={b} className="inline-block mr-2 px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">{b}</span>) : <span className="text-sm text-gray-500">None yet</span>}</div>
          </div>
          <div className="mt-4">
            <a href="/leaderboard" className="px-3 py-2 bg-indigo-600 text-white rounded">View Leaderboard</a>
          </div>
        </div>
      ) : (
        <div>Please login to see your dashboard.</div>
      )}
        <div className="col-span-3">
          <BadgesList />
        </div>
    </div>
  )
}
