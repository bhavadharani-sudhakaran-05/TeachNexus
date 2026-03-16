import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard(){
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('tn_user') || 'null') : null

  const motivations = [
    "Every day you teach, you change a life forever.",
    "Your passion inspires the next generation.",
    "Great teachers create infinite impact.",
    "Teaching is the one profession that creates all other professions.",
    "You're making a difference today!"
  ]
  
  const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)]

  if (!user) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div style={{textAlign: 'center', paddingTop: 60}}>
            <h2 style={{color: 'var(--navy)', marginBottom: 16}}>Please log in to access your dashboard</h2>
            <Link to="/login" className="btn primary">Go to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Greeting */}
        <div className="dashboard-greeting">
          <div className="greeting-text">Good morning, {user.name}! 🌟</div>
          <div className="greeting-motivation">{randomMotivation}</div>
        </div>

        {/* Metrics */}
        <div className="dashboard-metrics">
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-label">Resources Uploaded</div>
              <span className="metric-trend">↑ 12%</span>
            </div>
            <div className="metric-number">24</div>
            <div className="metric-suffix">+2 this month</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-label">Total Downloads</div>
              <span className="metric-trend">↑ 34%</span>
            </div>
            <div className="metric-number">1.2K</div>
            <div className="metric-suffix">+450 this month</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-label">Community Reputation</div>
              <span className="metric-trend">↑ 8%</span>
            </div>
            <div className="metric-number">8.4/10</div>
            <div className="metric-suffix">Based on reviews</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-label">Current XP Level</div>
              <span className="metric-trend">↑ 2 levels</span>
            </div>
            <div className="metric-number">Level 28</div>
            <div className="metric-suffix">2,450/3,000 to Level 29</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          {/* Feed */}
          <div className="dashboard-feed">
            <h2 className="section-title">📰 Recent Activity</h2>
            
            <div className="activity-item">
              <div className="activity-header">
                <div className="activity-avatar"></div>
                <div>
                  <div className="activity-name">Sarah Chen</div>
                  <div className="activity-action">rated your resource 5 stars</div>
                </div>
                <div className="activity-time">2h ago</div>
              </div>
              <div className="activity-content">"Great lesson plan! My students loved the activities."</div>
            </div>

            <div className="activity-item">
              <div className="activity-header">
                <div className="activity-avatar"></div>
                <div>
                  <div className="activity-name">Marcus Johnson</div>
                  <div className="activity-action">downloaded your worksheet</div>
                </div>
                <div className="activity-time">5h ago</div>
              </div>
              <div className="activity-content">Fractions for Grade 4 - Complete Activity Pack</div>
            </div>

            <div className="activity-item">
              <div className="activity-header">
                <div className="activity-avatar"></div>
                <div>
                  <div className="activity-name">Elena Rodriguez</div>
                  <div className="activity-action">started following you</div>
                </div>
                <div className="activity-time">1d ago</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-header">
                <div className="activity-avatar"></div>
                <div>
                  <div className="activity-name">TeachNexus Community</div>
                  <div className="activity-action">added you to discussion</div>
                </div>
                <div className="activity-time">1d ago</div>
              </div>
              <div className="activity-content">"Best practices for teaching fractions" - Mathematics Community</div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="dashboard-sidebar">
            {/* Quick Actions */}
            <div className="sidebar-card">
              <h3>⚡ Quick Actions</h3>
              <div className="quick-actions">
                <Link to="/resources/upload" className="quick-action" style={{textDecoration: 'none'}}>
                  📤 Upload Resource
                </Link>
                <Link to="/ai" className="quick-action" style={{textDecoration: 'none'}}>
                  🤖 Generate with AI
                </Link>
                <Link to="/planner" className="quick-action" style={{textDecoration: 'none'}}>
                  📅 Create Lesson Plan
                </Link>
                <Link to="/communities" className="quick-action" style={{textDecoration: 'none'}}>
                  👥 Join Community
                </Link>
              </div>
            </div>

            {/* Current Challenge */}
            <div className="sidebar-card">
              <h3>🎯 This Week's Challenge</h3>
              <div style={{marginBottom: 12}}>
                <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)', marginBottom: 8}}>Share 3 Resources</div>
                <div style={{height: 6, background: 'rgba(26,42,71,0.1)', borderRadius: 3, overflow: 'hidden'}}>
                  <div style={{height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-light))', width: '66%'}}></div>
                </div>
              </div>
              <div style={{fontSize: '0.85rem', color: 'var(--text-lighter)', marginBottom: 8}}>2 of 3 completed</div>
              <div style={{padding: '8px 12px', background: 'rgba(212,165,116,0.1)', color: 'var(--gold)', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, textAlign: 'center'}}>+250 XP when complete</div>
            </div>

            {/* Daily Streak */}
            <div className="sidebar-card">
              <h3>🔥 Daily Streak</h3>
              <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 4}}>7 days</div>
              <div style={{fontSize: '0.9rem', color: 'var(--text-light)'}}>Keep it up! You're on fire!</div>
              <div style={{marginTop: 12, padding: '10px 12px', background: 'var(--navy)', color: 'white', borderRadius: 8, textAlign: 'center', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'}}>
                Log in tomorrow to continue
              </div>
            </div>

            {/* Schedule Preview */}
            <div className="sidebar-card">
              <h3>📅 This Week</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <div style={{padding: 10, background: 'rgba(26,42,71,0.04)', borderRadius: 8, borderLeft: '3px solid var(--gold)'}}>
                  <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Fractions Lesson</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>Monday • Grade 4</div>
                </div>
                <div style={{padding: 10, background: 'rgba(26,42,71,0.04)', borderRadius: 8, borderLeft: '3px solid var(--gold)'}}>
                  <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Photosynthesis Lab</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>Wednesday • Grade 6</div>
                </div>
                <div style={{padding: 10, background: 'rgba(26,42,71,0.04)', borderRadius: 8, borderLeft: '3px solid var(--gold)'}}>
                  <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Essay Review</div>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>Friday • Grade 10</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
