import React, { useEffect, useState } from 'react'
import api from '../api'

export default function NotificationsPage(){
  const [items, setItems] = useState([
    { _id: '1', category: 'resources', title: 'New Resource Downloaded', body: 'Sarah Mitchell downloaded your "Algebra Fundamentals" lesson plan', timestamp: '5m ago', read: false },
    { _id: '2', category: 'community', title: 'New Comment on Your Post', body: 'James Chen replied to your discussion about Project-Based Learning', timestamp: '1h ago', read: false },
    { _id: '3', category: 'followers', title: 'New Follower', body: 'Emma Rodriguez started following you', timestamp: '2h ago', read: true },
    { _id: '4', category: 'achievements', title: 'Badge Earned!', body: 'You earned the "Resource Champion" badge for sharing 10+ resources', timestamp: '3h ago', read: true },
    { _id: '5', category: 'messages', title: 'New Message from Sarah Mitchell', body: 'Thanks for sharing that resource, it helped so much!', timestamp: '4h ago', read: true },
    { _id: '6', category: 'system', title: 'Check Out New AI Features', body: 'We just launched AI Lesson Planner 2.0 with enhanced customization', timestamp: '1d ago', read: true },
  ])

  const [activeFilter, setActiveFilter] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState({
    resources: { inApp: true, email: true, push: false },
    community: { inApp: true, email: true, push: true },
    followers: { inApp: true, email: false, push: false },
    messages: { inApp: true, email: true, push: true },
    achievements: { inApp: true, email: false, push: true },
    system: { inApp: true, email: true, push: false },
  })

  const CATEGORIES = [
    { id: 'all', label: 'All', icon: '🔔' },
    { id: 'resources', label: 'Resources', icon: '📚' },
    { id: 'community', label: 'Community', icon: '👥' },
    { id: 'followers', label: 'Followers', icon: '⭐' },
    { id: 'messages', label: 'Messages', icon: '💬' },
    { id: 'achievements', label: 'Achievements', icon: '🏆' },
    { id: 'system', label: 'System', icon: '⚙️' },
  ]

  const getCategoryColor = (category) => {
    const colors = {
      resources: '#FF6B6B',
      community: '#4ECDC4',
      followers: '#FFD93D',
      messages: '#6BCB77',
      achievements: '#A8E6CF',
      system: '#95B8D1'
    }
    return colors[category] || '#D4A574'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      resources: '📚',
      community: '💬',
      followers: '⭐',
      messages: '💌',
      achievements: '🏆',
      system: '⚙️'
    }
    return icons[category] || '🔔'
  }

  const markRead = (id) => {
    setItems(prev => prev.map(item => item._id === id ? { ...item, read: true } : item))
  }

  const markAllAsRead = () => {
    setItems(prev => prev.map(item => ({ ...item, read: true })))
  }

  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.category === activeFilter)

  const unreadCount = items.filter(item => !item.read).length
  const getUnreadByCategory = (category) => {
    if (category === 'all') return unreadCount
    return items.filter(item => item.category === category && !item.read).length
  }

  const getRelativeTime = (timestamp) => {
    // Simple parser for our mock data
    const timeMap = {
      '5m ago': 5,
      '1h ago': 60,
      '2h ago': 120,
      '3h ago': 180,
      '4h ago': 240,
      '1d ago': 1440
    }
    return timestamp
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '40px 24px' }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .notification-item {
          animation: slideInLeft 0.4s ease-out;
        }
        .tab-underline {
          border-bottom: 3px solid var(--gold);
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '700', margin: '0 0 8px', color: 'var(--navy)' }}>
              🔔 Notifications
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700'
                }}>
                  {unreadCount} unread
                </span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Mark All Read
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              style={{
                background: 'transparent',
                color: 'var(--navy)',
                border: '2px solid var(--navy)',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(26,42,71,0.05)'
                e.currentTarget.style.borderColor = 'var(--gold)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'var(--navy)'
              }}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '24px',
          marginBottom: '32px',
          borderBottom: '2px solid rgba(26,42,71,0.1)',
          paddingBottom: '12px',
          overflowX: 'auto',
          scrollBehavior: 'smooth'
        }}>
          {CATEGORIES.map(cat => {
            const count = getUnreadByCategory(cat.id)
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: '8px 0',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: activeFilter === cat.id ? '700' : '600',
                  color: activeFilter === cat.id ? 'var(--navy)' : 'var(--text-light)',
                  borderBottom: activeFilter === cat.id ? '3px solid var(--gold)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span style={{
                    background: 'var(--gold)',
                    color: 'var(--navy)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.length > 0 ? (
            filteredItems.map((notification, idx) => (
              <div
                key={notification._id}
                className="notification-item"
                onClick={() => markRead(notification._id)}
                style={{
                  animationDelay: `${idx * 0.05}s`,
                  background: notification.read ? 'var(--bg-2)' : 'rgba(212,165,116,0.08)',
                  border: `2px solid ${notification.read ? 'rgba(26,42,71,0.05)' : 'rgba(212,165,116,0.2)'}`,
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = notification.read ? 'rgba(26,42,71,0.02)' : 'rgba(212,165,116,0.12)'
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,116,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = notification.read ? 'var(--bg-2)' : 'rgba(212,165,116,0.08)'
                  e.currentTarget.style.borderColor = notification.read ? 'rgba(26,42,71,0.05)' : 'rgba(212,165,116,0.2)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Unread Indicator */}
                {!notification.read && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--gold)',
                    position: 'absolute',
                    left: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }} />
                )}

                {/* Category Icon */}
                <div style={{
                  fontSize: '28px',
                  flexShrink: 0,
                  marginLeft: '12px'
                }}>
                  {getCategoryIcon(notification.category)}
                </div>

                {/* Notification Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: '700',
                      color: 'var(--navy)',
                      fontSize: '0.95rem'
                    }}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <span style={{
                        background: 'var(--gold)',
                        color: 'var(--navy)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textTransform: 'uppercase'
                      }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: '0',
                    color: 'var(--text-light)',
                    fontSize: '0.9rem',
                    lineHeight: '1.4'
                  }}>
                    {notification.body}
                  </p>
                </div>

                {/* Timestamp */}
                <div style={{
                  color: 'var(--text-lighter)',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}>
                  {getRelativeTime(notification.timestamp)}
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              color: 'var(--text-lighter)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>
                All caught up! You have no new notifications in this category.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{ margin: '0 0 24px', color: 'var(--navy)', fontSize: '1.5rem' }}>
              Notification Preferences
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(preferences).map(([category, settings]) => (
                <div key={category} style={{ paddingBottom: '16px', borderBottom: '1px solid rgba(26,42,71,0.1)' }}>
                  <h3 style={{ margin: '0 0 12px', color: 'var(--navy)', fontSize: '1rem', textTransform: 'capitalize' }}>
                    {category}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(settings).map(([type, enabled]) => (
                      <label
                        key={type}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '6px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => {
                            setPreferences(prev => ({
                              ...prev,
                              [category]: {
                                ...prev[category],
                                [type]: e.target.checked
                              }
                            }))
                          }}
                          style={{
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer',
                            accentColor: 'var(--gold)'
                          }}
                        />
                        <span style={{
                          fontSize: '0.9rem',
                          color: 'var(--navy)',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {type === 'inApp' ? 'In-App' : type === 'email' ? 'Email Digest' : 'Push Notifications'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Save Preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'transparent',
                  color: 'var(--navy)',
                  border: '2px solid var(--navy)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
