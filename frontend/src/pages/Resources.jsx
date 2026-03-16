import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

function ResourceCard({r}){
  return (
    <div className="resource-card">
      <div className="resource-thumbnail">📚</div>
      <div className="resource-info">
        <div className="resource-title">{r.title}</div>
        <div className="resource-description">{r.description}</div>
        <div className="resource-meta">
          <span>{r.subject}</span>
          <span>Grade {r.grade}</span>
        </div>
        <div className="resource-rating">
          <span className="stars">⭐⭐⭐⭐⭐</span>
          <span>(124)</span>
        </div>
        <div className="resource-footer">
          <div className="resource-uploader">
            <div className="resource-avatar"></div>
            <span style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>By Teacher</span>
          </div>
          <Link to={`/resources/${r._id}`} style={{textDecoration: 'none', fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 600}}>View →</Link>
        </div>
      </div>
    </div>
  )
}

export default function Resources(){
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({})

  async function load(){
    const res = await api.get('/resources', { params: { q, ...filters } })
    setItems(res.data)
  }

  useEffect(()=>{ load() }, [])

  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Art']
  const grades = ['K-2', '3-5', '6-8', '9-12']
  const types = ['Lesson Plan', 'Worksheet', 'Video', 'Interactive']

  return (
    <div className="resources-page">
      {/* Search Bar Section */}
      <div className="resources-search">
        <div className="resources-search-bar">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search thousands of lesson plans, worksheets, videos and more..."
          />
        </div>
        <div className="resources-filters">
          <div className="filter-chip active">
            💡 All Subjects
            <span className="close">×</span>
          </div>
          <div className="filter-chip">
            Grade Level
            <span className="close">×</span>
          </div>
          <div className="filter-chip">
            Resource Type
            <span className="close">×</span>
          </div>
          <div className="filter-chip">
            Rating
            <span className="close">×</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="resources-container">
        {/* Sidebar */}
        <aside className="resources-sidebar">
          <h3>Filter Resources</h3>

          <div className="resources-filter-group">
            <h4 style={{fontSize: '0.9rem', color: 'var(--navy)', margin: 0, marginBottom: 8}}>Subject</h4>
            {subjects.map((s, i) => (
              <label key={i} className="resources-filter-item">
                <input type="checkbox" />
                <span>{s}</span>
                <span className="count">234</span>
              </label>
            ))}
          </div>

          <div className="resources-filter-group">
            <h4 style={{fontSize: '0.9rem', color: 'var(--navy)', margin: 0, marginBottom: 8}}>Grade</h4>
            {grades.map((g, i) => (
              <label key={i} className="resources-filter-item">
                <input type="checkbox" />
                <span>{g}</span>
                <span className="count">156</span>
              </label>
            ))}
          </div>

          <div className="resources-filter-group">
            <h4 style={{fontSize: '0.9rem', color: 'var(--navy)', margin: 0, marginBottom: 8}}>Type</h4>
            {types.map((t, i) => (
              <label key={i} className="resources-filter-item">
                <input type="checkbox" />
                <span>{t}</span>
                <span className="count">89</span>
              </label>
            ))}
          </div>

          <div className="resources-filter-group">
            <h4 style={{fontSize: '0.9rem', color: 'var(--navy)', margin: 0, marginBottom: 8}}>Rating</h4>
            {['⭐⭐⭐⭐⭐ (5★)', '⭐⭐⭐⭐ (4★+)', '⭐⭐⭐ (3★+)'].map((r, i) => (
              <label key={i} className="resources-filter-item">
                <input type="checkbox" />
                <span>{r}</span>
                <span className="count">456</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="resources-main">
          <div className="resources-toolbar">
            <div className="resources-toolbar-left">
              📊 Showing 248 results
            </div>
            <div className="resources-toolbar-right">
              <select style={{padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(26,42,71,0.1)'}}>
                <option>Sort by Relevance</option>
                <option>Newest</option>
                <option>Most Downloaded</option>
                <option>Highest Rated</option>
              </select>
              <button style={{padding: '8px 16px', background: 'white', border: '1px solid rgba(26,42,71,0.1)', borderRadius: '8px', cursor: 'pointer'}}>Grid View</button>
            </div>
          </div>

          <div className="resources-grid">
            {items.length > 0 ? items.map(it=> <ResourceCard key={it._id} r={it} />) : (
              <>
                <ResourceCard r={{_id: '1', title: 'Fractions: Introduction', description: 'Complete lesson plan with worksheets', subject: 'Math', grade: '4'}} />
                <ResourceCard r={{_id: '2', title: 'Photosynthesis Lab', description: 'Interactive science experiment', subject: 'Science', grade: '6'}} />
                <ResourceCard r={{_id: '3', title: 'Shakespeare Analysis', description: 'Essay writing guide', subject: 'English', grade: '10'}} />
                <ResourceCard r={{_id: '4', title: 'Ancient Rome Civilizations', description: 'Historical timeline project', subject: 'History', grade: '7'}} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div style={{textAlign: 'center', padding: '40px 24px'}}>
        <p style={{color: 'var(--text-light)', marginBottom: 16}}>Want to contribute? Share your amazing resources with the community</p>
        <Link to="/resources/upload" className="btn primary">Upload Your Resource</Link>
      </div>
    </div>
  )
}
