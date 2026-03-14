import React from 'react'

export default function Communities(){
  const mock = [
    { id:1, name: 'Math Grade 4', members: 124 },
    { id:2, name: 'Science Secondary', members: 86 },
    { id:3, name: 'Early Years Literacy', members: 54 }
  ]

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Communities</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {mock.map(c=> (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-gray-500">{c.members} members</div>
            <div className="mt-3"><button className="px-3 py-1 bg-indigo-600 text-white rounded">Join</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
