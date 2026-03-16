import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Profile() {
  const [activeTab, setActiveTab] = useState('about')
  const [isFollowing, setIsFollowing] = useState(false)

  // Mock profile data
  const teacher = {
    name: 'Emma Rodriguez',
    subject: 'Mathematics',
    grade: 'Grades 9-11',
    school: 'Lincoln High School',
    location: 'San Francisco, CA',
    experience: '12 years',
    level: 8,
    nextLevelXP: '2,450 / 3,000',
    avatar: '👩‍🏫',
    cover: 'linear-gradient(135deg, #1a2a47 0%, #243456 100%)',
    bio: 'I\'m passionate about making mathematics tangible and exciting for students. My teaching approach combines classical problem-solving with modern visualization techniques, helping students see the beauty in numbers and equations. I believe every student can excel in math when given the right tools and encouragement.',
    skills: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Problem Solving', 'STEM'],
    socials: [
      { name: 'LinkedIn', icon: '💼', url: '#' },
      { name: 'Twitter', icon: '𝕏', url: '#' },
      { name: 'Website', icon: '🌐', url: '#' }
    ],
    stats: {
      resources: 487,
      followers: 3240,
      downloads: 18943,
      xp: 54820
    }
  }

  const resources = [
    { id: 1, title: 'Quadratic Equations Masterclass', downloads: 1240, rating: 4.8, icon: '📊' },
    { id: 2, title: 'Geometry Proofs Collection', downloads: 856, rating: 4.9, icon: '📐' },
    { id: 3, title: 'Calculus Limits Visualizer', downloads: 2103, rating: 4.7, icon: '📈' },
    { id: 4, title: 'Statistics Lab Activities', downloads: 934, rating: 4.6, icon: '📉' },
    { id: 5, title: 'Interactive Trigonometry', downloads: 1567, rating: 4.8, icon: '🔄' },
    { id: 6, title: 'Algebra Problem Sets', downloads: 2341, rating: 4.5, icon: '✏️' }
  ]

  const badges = [
    { id: 1, name: 'Rising Star', icon: '⭐', earned: true },
    { id: 2, name: 'Resource Master', icon: '🎯', earned: true },
    { id: 3, name: 'Community Hero', icon: '🦸', earned: true },
    { id: 4, name: 'Streak Week', icon: '🔥', earned: true },
    { id: 5, name: 'Mentor', icon: '🧑‍🏫', earned: true },
    { id: 6, name: 'Innovator', icon: '💡', earned: true },
    { id: 7, name: 'Educator Elite', icon: '👑', earned: false },
    { id: 8, name: 'Legend', icon: '🏆', earned: false }
  ]

  const communities = [
    'Math Teachers Circle',
    'STEM Innovators',
    'Secondary Education Community',
    'Problem Solving Group'
  ]

  const activities = [
    { action: 'Uploaded resource', title: 'Advanced Calculus Worksheets', time: '2 hours ago' },
    { action: 'Earned badge', title: 'Rising Star', time: '1 day ago' },
    { action: 'Joined community', title: 'STEM Innovators', time: '3 days ago' },
    { action: 'Received follower', title: 'James Mitchell followed you', time: '1 week ago' }
  ]

  return (
    <div className="profile-page">
      {/* Cover Photo */}
      <div className="profile-cover" style={{ background: teacher.cover }}></div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            <div className="avatar-circle">{teacher.avatar}</div>
            <div className="level-badge">L{teacher.level}</div>
          </div>
          <div className="profile-text">
            <h1 className="profile-name">{teacher.name}</h1>
            <div className="profile-credentials">
              {teacher.subject} • {teacher.grade} • {teacher.school} • {teacher.location} • {teacher.experience}
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn primary" onClick={() => setIsFollowing(!isFollowing)}>
            {isFollowing ? '✓ Following' : '+ Follow'}
          </button>
          <button className="btn secondary">✉️ Message</button>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="profile-stats">
        <div className="stat-pill">
          <div className="stat-value">{teacher.stats.resources}</div>
          <div className="stat-label">Resources</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{teacher.stats.followers.toLocaleString()}</div>
          <div className="stat-label">Followers</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{teacher.stats.downloads.toLocaleString()}</div>
          <div className="stat-label">Downloads</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{teacher.stats.xp.toLocaleString()}</div>
          <div className="stat-label">XP Total</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-container">
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
          <button 
            className={`tab ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button 
            className={`tab ${activeTab === 'lessons' ? 'active' : ''}`}
            onClick={() => setActiveTab('lessons')}
          >
            Lesson Plans
          </button>
          <button 
            className={`tab ${activeTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('communities')}
          >
            Communities
          </button>
          <button 
            className={`tab ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
          >
            Badges
          </button>
          <button 
            className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="tab-content">
              <div className="about-section">
                <h2>Teaching Philosophy</h2>
                <p>{teacher.bio}</p>
              </div>

              <div className="about-section">
                <h2>Skills & Expertise</h2>
                <div className="skills-grid">
                  {teacher.skills.map((skill, idx) => (
                    <div key={idx} className="skill-chip">{skill}</div>
                  ))}
                </div>
              </div>

              <div className="about-section">
                <h2>Connect</h2>
                <div className="socials-grid">
                  {teacher.socials.map((social, idx) => (
                    <a key={idx} href={social.url} className="social-link">
                      <span className="social-icon">{social.icon}</span>
                      <span>{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="tab-content">
              <div className="resources-showcase">
                {resources.map(resource => (
                  <div key={resource.id} className="resource-card-item">
                    <div className="resource-icon">{resource.icon}</div>
                    <div className="resource-info">
                      <h3>{resource.title}</h3>
                      <div className="resource-meta">
                        <span>📥 {resource.downloads} downloads</span>
                        <span>⭐ {resource.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <div className="tab-content">
              <div className="coming-soon">
                <div style={{fontSize: '3rem', marginBottom: 16}}>📝</div>
                <h3>Lesson Plans</h3>
                <p>Emma has created 24 lesson plans covering Algebra through Calculus</p>
              </div>
            </div>
          )}

          {/* Communities Tab */}
          {activeTab === 'communities' && (
            <div className="tab-content">
              <div className="communities-list">
                {communities.map((community, idx) => (
                  <div key={idx} className="community-membership">
                    <div style={{fontSize: '1.5rem'}}>👥</div>
                    <div style={{flex: 1}}>
                      <div style={{fontWeight: 600, color: 'var(--navy)'}}>{community}</div>
                      <div style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>Active member</div>
                    </div>
                    <button className="btn secondary" style={{padding: '6px 12px', fontSize: '0.85rem'}}>View</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges Tab */}
          {activeTab === 'badges' && (
            <div className="tab-content">
              <div style={{textAlign: 'center', marginBottom: 32}}>
                <div style={{fontSize: '2rem', fontWeight: 700, color: 'var(--gold)', marginBottom: 4}}>
                  {badges.filter(b => b.earned).length} Badges Earned
                </div>
                <div style={{color: 'var(--text-light)'}}>
                  Celebrating {teacher.name}'s achievements on TeachNexus
                </div>
              </div>
              <div className="badges-showcase">
                {badges.map(badge => (
                  <div key={badge.id} className={`badge-item ${badge.earned ? 'earned' : 'locked'}`}>
                    <div className="badge-emoji">{badge.icon}</div>
                    <div className="badge-name">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="tab-content">
              <div className="activity-feed">
                {activities.map((activity, idx) => (
                  <div key={idx} className="activity-item">
                    <div className="activity-marker"></div>
                    <div className="activity-content">
                      <div style={{fontWeight: 600, color: 'var(--navy)'}}>
                        {activity.action}
                      </div>
                      <div style={{color: 'var(--text-light)', marginBottom: 4}}>
                        {activity.title}
                      </div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-lighter)'}}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
