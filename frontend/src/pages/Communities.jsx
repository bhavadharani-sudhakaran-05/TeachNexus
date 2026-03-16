import React, { useState } from 'react'

export default function Communities(){
  const [joinedCategories, setJoinedCategories] = useState({})

  const categories = [
    { id: 1, name: 'Mathematics', members: 2340, icon: '🔢' },
    { id: 2, name: 'Science', members: 1856, icon: '🔬' },
    { id: 3, name: 'English', members: 1524, icon: '📚' },
    { id: 4, name: 'History', members: 987, icon: '🏛️' },
    { id: 5, name: 'Art & Music', members: 654, icon: '🎨' }
  ]

  const posts = [
    {
      id: 1,
      author: 'Sarah Chen',
      avatar: '👩‍🏫',
      subject: 'Math',
      title: 'Best strategies for teaching fractions?',
      content: 'I\'m looking for innovative ways to help my 4th graders understand fractions. Does anyone have success stories or resources?',
      community: 'Mathematics',
      likes: 45,
      comments: 12,
      time: '2h ago'
    },
    {
      id: 2,
      author: 'Marcus Johnson',
      avatar: '👨‍🏫',
      subject: 'Science',
      title: 'Virtual lab experiments that actually work',
      content: 'Just discovered some amazing virtual labs for chemistry. They\'re interactive and my students love them!',
      community: 'Science',
      likes: 87,
      comments: 23,
      time: '4h ago'
    },
    {
      id: 3,
      author: 'Elena Rodriguez',
      avatar: '👩‍🎓',
      subject: 'English',
      title: 'How to increase student engagement in literature?',
      content: 'My students seem disengaged during literature discussions. Any ideas for making it more interactive?',
      community: 'English',
      likes: 34,
      comments: 18,
      time: '6h ago'
    }
  ]

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-header">
        <div className="container" style={{maxWidth: 900}}>
          <h1 style={{margin: 0}}>Teacher Community</h1>
          <p style={{margin: 0}}>Connect with educators worldwide. Share ideas, ask questions, and grow together.</p>
        </div>
      </div>

      {/* Categories */}
      <div className="community-categories">
        <div className="container">
          <div className="categories-title">Popular Communities</div>
          <div className="categories-scroll">
            {categories.map(cat => (
              <div key={cat.id} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <div className="category-name">{cat.name}</div>
                <div className="category-members">{cat.members.toLocaleString()} teachers</div>
                <button 
                  className={`category-join ${joinedCategories[cat.id] ? 'joined' : ''}`}
                  onClick={() => setJoinedCategories({...joinedCategories, [cat.id]: !joinedCategories[cat.id]})}
                >
                  {joinedCategories[cat.id] ? '✓ Joined' : 'Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{maxWidth: 1400}}>
        <div className="community-main">
          {/* Feed */}
          <div className="community-feed">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">{post.avatar}</div>
                  <div>
                    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                      <span className="post-author">{post.author}</span>
                      <span className="post-badge">{post.subject}</span>
                    </div>
                    <div className="post-time">{post.time}</div>
                  </div>
                </div>
                <div className="post-title">{post.title}</div>
                <div className="post-content">{post.content}</div>
                <span className="post-community">in {post.community}</span>
                <div className="post-stats">
                  <span>❤️ {post.likes} Likes</span>
                  <span>💬 {post.comments} Comments</span>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="community-sidebar">
            <div className="sidebar-widget">
              <h3>🔥 Trending Discussions</h3>
              <ul>
                <li><a href="#">How to handle classroom anxiety</a></li>
                <li><a href="#">Best back-to-school activities</a></li>
                <li><a href="#">Managing hybrid learning</a></li>
                <li><a href="#">Assessment strategies</a></li>
              </ul>
            </div>

            <div className="sidebar-widget">
              <h3>👑 Top Contributors</h3>
              <ul>
                <li style={{marginBottom: 12}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div style={{width: 32, height: 32, borderRadius: 50, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))'}}></div>
                    <div>
                      <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Sarah Chen</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-lighter)'}}>⭐ Level 42</div>
                    </div>
                  </div>
                </li>
                <li style={{marginBottom: 12}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <div style={{width: 32, height: 32, borderRadius: 50, background: 'linear-gradient(135deg, var(--gold), var(--gold-light))'}}></div>
                    <div>
                      <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Marcus Johnson</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-lighter)'}}>⭐ Level 38</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <div className="sidebar-widget">
              <h3>📅 Upcoming Events</h3>
              <ul>
                <li style={{marginBottom: 12}}>
                  <a href="#" style={{textDecoration: 'none'}}>
                    <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Virtual Workshop</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-lighter)'}}>Tomorrow at 3pm</div>
                  </a>
                </li>
                <li>
                  <a href="#" style={{textDecoration: 'none'}}>
                    <div style={{fontWeight: 600, fontSize: '0.9rem', color: 'var(--navy)'}}>Community Hangout</div>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-lighter)'}}>Friday at 5pm</div>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Compose Button */}
      <button className="compose-btn" title="Start a new discussion">+ </button>
    </div>
  )
}
