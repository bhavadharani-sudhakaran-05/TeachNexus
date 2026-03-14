import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Leaderboard(){
  const [list, setList] = useState([])

  useEffect(()=>{
    api.get('/gamification/leaderboard').then(r=>setList(r.data.leaderboard)).catch(()=>{})
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
      <div className="bg-white p-4 rounded shadow">
        <ol className="list-decimal pl-6">
          {list.map((u,i)=> (
            <li key={u._id} className="mb-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-500">{u.school || ''}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">XP {u.xp}</div>
                <div className="text-sm text-gray-500">Level {u.level}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
