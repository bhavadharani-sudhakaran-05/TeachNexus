import React, { useEffect, useState } from 'react'
import api from '../api'
import { Link } from 'react-router-dom'

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
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-school-info">
            <div className="admin-logo">🏫</div>
            <div className="admin-school-text">
              <h1>Lincoln High School</h1>
              <p>School ID: LHS-2024 • District: Central Valley</p>
            </div>
          </div>
          <div className="admin-metrics">
            <div className="admin-metric">
              <div className="admin-metric-label">Active Teachers</div>
              <div className="admin-metric-value">
                142
                <div className="admin-metric-indicator"></div>
              </div>
            </div>
            <div className="admin-metric">
              <div className="admin-metric-label">Resources Shared</div>
              <div className="admin-metric-value">
                2,847
                <div className="admin-metric-indicator"></div>
              </div>
            </div>
            <div className="admin-metric">
              <div className="admin-metric-label">Avg Engagement</div>
              <div className="admin-metric-value">
                87%
                <div className="admin-metric-indicator"></div>
              </div>
            </div>
            <div className="admin-metric">
              <div className="admin-metric-label">School Health</div>
              <div className="admin-metric-value">
                94%
                <div className="admin-metric-indicator"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="admin-heatmap">
          <h2 className="heatmap-title">📊 Teacher Activity Heatmap (Last 30 Days)</h2>
          <div className="heatmap-grid">
            {Array(35).fill(0).map((_, i) => (
              <div key={i} className="heatmap-cell">
                <span>{Math.floor(Math.random() * 100)}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop: 16, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)'}}>
            Each cell represents daily activity. Darker = more active.
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <h2 className="analytics-title">📈 Platform Analytics</h2>
          
          <div className="analytics-grid">
            <div>
              <div style={{fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 16}}>Resources by Type</div>
              <div className="analytics-chart">
                <div className="chart-bar" style={{height: '120px'}}></div>
                <div className="chart-bar" style={{height: '95px'}}></div>
                <div className="chart-bar" style={{height: '140px'}}></div>
                <div className="chart-bar" style={{height: '78px'}}></div>
                <div className="chart-bar" style={{height: '105px'}}></div>
              </div>
              <div style={{marginTop: 12, fontSize: '0.75rem', color: 'var(--text-lighter)', display: 'flex', justifyContent: 'space-around'}}>
                <span>Lessons</span>
                <span>Videos</span>
                <span>Worksheets</span>
                <span>Interactive</span>
                <span>Other</span>
              </div>
            </div>
            <div>
              <div style={{fontSize: '0.9rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 16}}>Usage by Subject</div>
              <div className="analytics-chart">
                <div className="chart-bar" style={{height: '130px'}}></div>
                <div className="chart-bar" style={{height: '110px'}}></div>
                <div className="chart-bar" style={{height: '125px'}}></div>
                <div className="chart-bar" style={{height: '90px'}}></div>
                <div className="chart-bar" style={{height: '85px'}}></div>
              </div>
              <div style={{marginTop: 12, fontSize: '0.75rem', color: 'var(--text-lighter)', display: 'flex', justifyContent: 'space-around'}}>
                <span>Math</span>
                <span>Science</span>
                <span>English</span>
                <span>History</span>
                <span>Art</span>
              </div>
            </div>
          </div>

          {/* Department Table */}
          <h3 style={{fontSize: '1rem', fontWeight: 600, color: 'var(--navy)', margin: '28px 0 16px'}}>Department Performance</h3>
          <table className="department-table">
            <thead>
              <tr>
                <th>Department</th>
                <th>Teachers</th>
                <th>Resources</th>
                <th>Avg Rating</th>
                <th>Engagement</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="department-name">Mathematics</td>
                <td>24</td>
                <td>687</td>
                <td>4.7 ⭐</td>
                <td>89%</td>
                <td><div className="department-sparkline"></div></td>
              </tr>
              <tr>
                <td className="department-name">Science</td>
                <td>18</td>
                <td>542</td>
                <td>4.6 ⭐</td>
                <td>86%</td>
                <td><div className="department-sparkline"></div></td>
              </tr>
              <tr>
                <td className="department-name">English</td>
                <td>22</td>
                <td>612</td>
                <td>4.8 ⭐</td>
                <td>92%</td>
                <td><div className="department-sparkline"></div></td>
              </tr>
              <tr>
                <td className="department-name">History</td>
                <td>16</td>
                <td>438</td>
                <td>4.5 ⭐</td>
                <td>81%</td>
                <td><div className="department-sparkline"></div></td>
              </tr>
              <tr>
                <td className="department-name">Arts & Music</td>
                <td>14</td>
                <td>362</td>
                <td>4.9 ⭐</td>
                <td>88%</td>
                <td><div className="department-sparkline"></div></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Announcements Panel */}
        <div className="announcements-panel">
          <h2 className="analytics-title">📢 School Announcements</h2>
          <div className="announcements-editor">
            <textarea placeholder="Write an announcement for all teachers..."></textarea>
          </div>
          <div style={{display: 'flex', gap: 12}}>
            <button className="btn primary">Publish Announcement</button>
            <button className="btn secondary">Save as Draft</button>
          </div>

          <div style={{marginTop: 24}}>
            <h3 style={{fontSize: '0.95rem', fontWeight: 600, color: 'var(--navy)', marginBottom: 12}}>Recent Announcements</h3>
            <div style={{background: 'linear-gradient(135deg, rgba(26,42,71,0.02), rgba(212,165,116,0.02))', border: '1px solid rgba(26,42,71,0.05)', borderRadius: 12, padding: 16, marginBottom: 12}}>
              <div style={{fontWeight: 600, color: 'var(--navy)', marginBottom: 4}}>📚 New AI Lesson Generator Available</div>
              <div style={{fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 8}}>All teachers now have access to the AI-powered lesson generator. Learn more in the training session this Friday.</div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>Posted 2 days ago</div>
            </div>
            <div style={{background: 'linear-gradient(135deg, rgba(26,42,71,0.02), rgba(212,165,116,0.02))', border: '1px solid rgba(26,42,71,0.05)', borderRadius: 12, padding: 16, marginBottom: 12}}>
              <div style={{fontWeight: 600, color: 'var(--navy)', marginBottom: 4}}>🎖️ Congratulations to Our Top Contributors</div>
              <div style={{fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: 8}}>Special recognition to the teachers who have uploaded 50+ resources this semester!</div>
              <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>Posted 5 days ago</div>
            </div>
          </div>
        </div>

        {/* More Admin Tools */}
        <div className="admin-heatmap" style={{background: 'white', border: '1px solid rgba(26,42,71,0.05)', marginTop: 32}}>
          <h2 className="heatmap-title" style={{color: 'var(--navy)'}}>⚙️ Administration Tools</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16}}>
            <Link to="/admin/templates" className="btn secondary" style={{padding: '12px 16px', textDecoration: 'none', textAlign: 'center'}}>
              ✉️ Email Templates
            </Link>
            <button className="btn secondary" style={{padding: '12px 16px'}}>
              👥 Manage Teachers
            </button>
            <button className="btn secondary" style={{padding: '12px 16px'}}>
              🔐 System Settings
            </button>
            <button className="btn secondary" style={{padding: '12px 16px'}}>
              📊 Export Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
