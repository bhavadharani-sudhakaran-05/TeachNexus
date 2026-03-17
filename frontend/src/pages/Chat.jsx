import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import api from '../api'

export default function Chat(){
  const [conversations, setConversations] = useState([
    { id: 1, name: 'Sarah Mitchell', avatar: '👩‍🏫', online: true, lastMessage: 'That lesson plan looks great!', timestamp: '5m ago', unread: 2, subject: 'Math' },
    { id: 2, name: 'James Chen', avatar: '👨‍🏫', online: true, lastMessage: 'Thanks for sharing the resource', timestamp: '12m ago', unread: 0, subject: 'Science' },
    { id: 3, name: 'Emma Rodriguez', avatar: '👩‍🏫', online: false, lastMessage: 'See you at the meeting', timestamp: '2h ago', unread: 0, subject: 'English' },
  ])
  
  const [communities, setCommunities] = useState([
    { id: 'c1', name: 'Math Teachers Circle', avatar: '🔢', members: 24, lastMessage: 'New STEM resources available', timestamp: '1h ago' },
    { id: 'c2', name: 'Science Innovators', avatar: '🔬', members: 18, lastMessage: 'Lab experiment tips thread', timestamp: '3h ago' },
  ])

  const [activeConversation, setActiveConversation] = useState(null)
  const [activeCommunity, setActiveCommunity] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [connected, setConnected] = useState(true)
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState(false)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('tn_token')
    const base = (import.meta.env.VITE_WS_URL) || (import.meta.env.VITE_API_BASE?.replace('/api','')) || 'http://localhost:5000'
    const socket = io(base, { auth: { token } })
    socketRef.current = socket

    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('message', (m) => {
      setMessages(prev => [...prev, m])
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)
    })
    socket.on('typing', (data) => setTypingIndicator(true))
    socket.on('stop_typing', () => setTypingIndicator(false))

    return () => socket.disconnect()
  }, [])

  const scrollToBottom = () => setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 0)

  const handleSendMessage = () => {
    if (!messageText.trim()) return
    
    const newMessage = {
      id: Date.now(),
      sender: 'You',
      text: messageText,
      timestamp: 'now',
      isOwn: true
    }
    
    setMessages(prev => [...prev, newMessage])
    setMessageText('')
    scrollToBottom()
    
    if (socketRef.current) {
      socketRef.current.emit('message', { 
        conversationId: activeConversation?.id, 
        text: messageText 
      })
    }
  }

  const handleAttachFile = () => alert('📎 File attachment modal would open here')
  const handleEmojiPicker = () => alert('😊 Emoji picker would open here')
  
  const handleComposeNew = () => {
    setShowComposeModal(true)
  }

  const startConversation = (teacher) => {
    setShowComposeModal(false)
    // Create new conversation or find existing
    const existing = conversations.find(c => c.id === teacher.id)
    if (existing) {
      setActiveConversation(existing)
    } else {
      const newConv = {
        id: Math.random(),
        name: teacher.name,
        avatar: teacher.avatar,
        online: true,
        lastMessage: '',
        timestamp: 'now',
        unread: 0,
        subject: teacher.subject
      }
      setConversations(prev => [newConv, ...prev])
      setActiveConversation(newConv)
    }
    setMessages([])
  }

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCommunities = communities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderChatMessage = (message) => (
    <div
      key={message.id}
      style={{
        display: 'flex',
        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
        marginBottom: '16px',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '8px',
          maxWidth: '70%',
          flexDirection: message.isOwn ? 'row-reverse' : 'row'
        }}
      >
        <div
          style={{
            fontSize: '24px'
          }}
        >
          {message.isOwn ? '👤' : activeConversation?.avatar}
        </div>
        <div>
          <div
            style={{
              background: message.isOwn ? 'var(--navy)' : 'var(--card)',
              color: message.isOwn ? 'white' : 'var(--text)',
              padding: '12px 16px',
              borderRadius: '12px',
              wordWrap: 'break-word'
            }}
          >
            {message.text}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)', marginTop: '4px', textAlign: message.isOwn ? 'right' : 'left' }}>
            {message.timestamp}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', background: 'var(--bg)' }}>
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes typing {
          0%, 60%, 100% { opacity: 0.5; }
          30% { opacity: 1; }
        }
        .typing-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: var(--text-lighter);
          border-radius: 50%;
          animation: typing 1.4s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      {/* Left Panel - Conversations */}
      <div style={{ width: '320px', borderRight: '1px solid rgba(212,165,116,0.1)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px', borderBottom: '1px solid rgba(212,165,116,0.1)' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: '1.3rem', color: 'var(--navy)' }}>Messages</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                background: 'var(--bg-2)',
                color: 'var(--text)'
              }}
            />
            <button
              onClick={handleComposeNew}
              style={{
                background: 'var(--gold)',
                color: 'var(--navy)',
                border: 'none',
                padding: '10px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              ✎
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => {
                setActiveConversation(conv)
                setActiveCommunity(null)
                setMessages([
                  { id: 1, sender: conv.name, text: conv.lastMessage, timestamp: '2h ago', isOwn: false },
                ])
              }}
              style={{
                padding: '12px 12px',
                borderBottom: '1px solid rgba(212,165,116,0.05)',
                cursor: 'pointer',
                background: activeConversation?.id === conv.id ? 'rgba(212,165,116,0.08)' : 'transparent',
                transition: 'all 0.2s',
                borderLeft: activeConversation?.id === conv.id ? '3px solid var(--gold)' : '3px solid transparent'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,165,116,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = activeConversation?.id === conv.id ? 'rgba(212,165,116,0.08)' : 'transparent'}
            >
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative', fontSize: '32px' }}>
                  {conv.avatar}
                  {conv.online && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      background: 'var(--success)',
                      borderRadius: '50%',
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      border: '2px solid var(--bg)'
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{conv.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-lighter)' }}>{conv.timestamp}</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-lighter)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {conv.lastMessage}
                  </div>
                </div>
                {conv.unread > 0 && (
                  <div
                    style={{
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}
                  >
                    {conv.unread}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Communities Section */}
          {filteredCommunities.length > 0 && (
            <div style={{ paddingTop: '12px' }}>
              <div style={{ padding: '8px 12px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-lighter)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Communities
              </div>
              {filteredCommunities.map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => {
                    setActiveCommunity(comm)
                    setActiveConversation(null)
                    setMessages([
                      { id: 1, sender: 'Sarah', text: 'Hello community!', timestamp: '1h ago', isOwn: false },
                    ])
                  }}
                  style={{
                    padding: '12px 12px',
                    borderBottom: '1px solid rgba(212,165,116,0.05)',
                    cursor: 'pointer',
                    background: activeCommunity?.id === comm.id ? 'rgba(212,165,116,0.08)' : 'transparent',
                    transition: 'all 0.2s',
                    borderLeft: activeCommunity?.id === comm.id ? '3px solid var(--gold)' : '3px solid transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,165,116,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = activeCommunity?.id === comm.id ? 'rgba(212,165,116,0.08)' : 'transparent'}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '32px' }}>{comm.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{comm.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)' }}>{comm.members} members</div>
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-lighter)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {comm.lastMessage}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConversation || activeCommunity ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,165,116,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '36px' }}>
                  {activeConversation?.avatar || activeCommunity?.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--navy)', fontSize: '1.1rem' }}>
                    {activeConversation?.name || activeCommunity?.name}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-lighter)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeConversation && (
                      <>
                        <span style={{ background: 'var(--success)', width: '6px', height: '6px', borderRadius: '50%', display: 'inline-block' }} />
                        <span>{activeConversation.online ? 'Online' : 'Offline'}</span>
                        <span style={{ color: 'var(--gold)', fontWeight: 500 }}>• {activeConversation.subject}</span>
                      </>
                    )}
                    {activeCommunity && <span>{activeCommunity.members} members</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>☎️</button>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>📹</button>
                <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>⋮</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' }}>
              {messages.map(renderChatMessage)}
              {typingIndicator && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '24px' }}>{activeConversation?.avatar}</div>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(212,165,116,0.1)', background: 'var(--bg-2)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <button onClick={handleEmojiPicker} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '8px' }}>
                  😊
                </button>
                <button onClick={handleAttachFile} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '8px' }}>
                  📎
                </button>
                <button onClick={() => setShowResourceModal(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '8px' }}>
                  📚
                </button>
                <input
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid rgba(212,165,116,0.2)',
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    background: 'var(--bg)',
                    color: 'var(--text)',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    background: messageText.trim() ? 'var(--gold)' : 'rgba(212,165,116,0.3)',
                    color: messageText.trim() ? 'var(--navy)' : 'var(--text-lighter)',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '20px',
                    cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.2s'
                  }}
                >
                  ↗
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-lighter)', fontSize: '1.1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
              <div>Select a conversation to start messaging</div>
              <button
                onClick={handleComposeNew}
                style={{
                  marginTop: '16px',
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Start New Conversation
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--navy)' }}>Start New Conversation</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'new1', name: 'Lisa Thompson', avatar: '👩‍🏫', subject: 'Math' },
                { id: 'new2', name: 'Marcus Johnson', avatar: '👨‍🏫', subject: 'History' },
                { id: 'new3', name: 'Diana Wells', avatar: '👩‍🏫', subject: 'Art' },
              ].map(teacher => (
                <div
                  key={teacher.id}
                  onClick={() => startConversation(teacher)}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-2)'}
                >
                  <div style={{ fontSize: '24px' }}>{teacher.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{teacher.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-lighter)' }}>{teacher.subject}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowComposeModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--navy)',
                fontWeight: '600'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {showResourceModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg)',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 16px', color: 'var(--navy)' }}>Share Resource</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                { id: 'r1', title: 'Algebra Fundamentals', type: 'PDF' },
                { id: 'r2', title: 'Interactive Geometry Lesson', type: 'HTML' },
                { id: 'r3', title: 'Math Problem Set Vol. 2', type: 'Document' },
              ].map(resource => (
                <div
                  key={resource.id}
                  onClick={() => {
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      sender: 'You',
                      text: `Shared: ${resource.title}`,
                      timestamp: 'now',
                      isOwn: true,
                      resource
                    }])
                    setShowResourceModal(false)
                  }}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(212,165,116,0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-2)'}
                >
                  <div style={{ fontSize: '20px' }}>📄</div>
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--navy)' }}>{resource.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-lighter)' }}>{resource.type}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowResourceModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'transparent',
                border: '1px solid rgba(212,165,116,0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: 'var(--navy)',
                fontWeight: '600'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
