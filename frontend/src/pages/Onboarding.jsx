import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({
    subjects: [],
    grades: [],
    photo: null,
    bio: '',
    school: '',
    city: '',
    experience: ''
  })
  const [isAnimating, setIsAnimating] = useState(true)

  const SUBJECTS = [
    { id: 'math', name: 'Mathematics', icon: '∑', color: '#FF6B6B' },
    { id: 'science', name: 'Science', icon: '🔬', color: '#4ECDC4' },
    { id: 'english', name: 'English', icon: '📚', color: '#95E1D3' },
    { id: 'history', name: 'History', icon: '🏛️', color: '#FFD93D' },
    { id: 'art', name: 'Art', icon: '🎨', color: '#6BCB77' },
    { id: 'pe', name: 'Physical Education', icon: '⚽', color: '#FF6B9D' },
    { id: 'music', name: 'Music', icon: '🎵', color: '#A8E6CF' },
    { id: 'languages', name: 'Languages', icon: '🌍', color: '#FFD3B6' },
  ]

  const GRADES = [
    { id: 'pk-k', name: 'PreK-K', range: 'Ages 3-5' },
    { id: 'elementary', name: 'Elementary', range: 'Grades 1-5' },
    { id: 'middle', name: 'Middle School', range: 'Grades 6-8' },
    { id: 'high', name: 'High School', range: 'Grades 9-12' },
    { id: 'college', name: 'Higher Ed', range: 'College+' },
  ]

  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('tn_onboarding')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setProfile(data.profile)
        setStep(data.step)
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // Auto-save progress
  const saveProgress = (newProfile, newStep) => {
    localStorage.setItem('tn_onboarding', JSON.stringify({
      profile: newProfile,
      step: newStep
    }))
  }

  // Update profile and save
  const updateProfile = (updates) => {
    const updated = { ...profile, ...updates }
    setProfile(updated)
    saveProgress(updated, step)
  }

  const toggleSubject = (id) => {
    const updated = profile.subjects.includes(id)
      ? profile.subjects.filter(s => s !== id)
      : [...profile.subjects, id]
    updateProfile({ subjects: updated })
  }

  const toggleGrade = (id) => {
    const updated = profile.grades.includes(id)
      ? profile.grades.filter(g => g !== id)
      : [...profile.grades, id]
    updateProfile({ grades: updated })
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateProfile({ photo: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      saveProgress(profile, step + 1)
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 300)
    } else {
      completeOnboarding()
    }
  }

  const handleSkip = () => {
    if (step < 4) {
      handleNext()
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = () => {
    localStorage.removeItem('tn_onboarding')
    // Save profile to backend
    navigate('/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a2a47 0%, #0f1b2e 100%)', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
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
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
        .onboarding-container {
          animation: fadeInScale 0.6s ease-out;
        }
        .stagger-item {
          animation: fadeInUp 0.4s ease-out backwards;
        }
        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .confetti-piece {
          position: fixed;
          pointer-events: none;
        }
      `}</style>

      {step === 0 && <WelcomeScreen onContinue={() => { setStep(1); setIsAnimating(true); saveProgress(profile, 1); }} />}
      
      {step > 0 && (
        <div style={{ flex: 1, padding: '40px 20px', display: 'flex', flexDirection: 'column' }}>
          {/* Progress Indicator */}
          <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', marginBottom: '40px' }}>
            <ProgressIndicator currentStep={step} totalSteps={5} />
          </div>

          {/* Content */}
          <div style={{ flex: 1, maxWidth: '600px', margin: '0 auto', width: '100%' }} className="onboarding-container">
            {step === 1 && (
              <SubjectSelection
                subjects={SUBJECTS}
                selected={profile.subjects}
                onToggle={toggleSubject}
              />
            )}

            {step === 2 && (
              <GradeSelection
                grades={GRADES}
                selected={profile.grades}
                onToggle={toggleGrade}
              />
            )}

            {step === 3 && (
              <PhotoUpload
                photo={profile.photo}
                onUpload={handlePhotoUpload}
              />
            )}

            {step === 4 && (
              <Personalization
                profile={profile}
                onUpdate={updateProfile}
              />
            )}

            {step === 5 && (
              <CelebrationScreen profile={profile} />
            )}
          </div>

          {/* Action Buttons */}
          {step < 5 && (
            <div style={{ marginTop: '40px', maxWidth: '600px', margin: '40px auto 0', width: '100%', textAlign: 'center' }}>
              <button
                onClick={handleNext}
                style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  border: 'none',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  width: '100%',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,165,116,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {step === 4 ? 'Complete Setup' : 'Next'}
              </button>
              <button
                onClick={handleSkip}
                style={{
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.6)',
                  border: 'none',
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              >
                Skip for now
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function WelcomeScreen({ onContinue }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Orb */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)',
        top: '10%',
        right: '10%',
        animation: 'pulse 4s ease-in-out infinite'
      }} />

      <div style={{ textAlign: 'center', maxWidth: '480px', position: 'relative', zIndex: 2 }}>
        {/* Logo Animation */}
        <div style={{
          fontSize: '72px',
          marginBottom: '24px',
          animation: 'fadeInScale 0.8s ease-out',
          background: 'linear-gradient(135deg, var(--gold) 0%, rgba(212,165,116,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🎓
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '2.8rem',
          color: 'white',
          fontWeight: '700',
          margin: '0 0 16px',
          lineHeight: '1.2',
          animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
        }}>
          Welcome to TeachNexus
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: '1.2rem',
          color: 'rgba(255,255,255,0.8)',
          margin: '0 0 32px',
          lineHeight: '1.6',
          animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
        }}>
          Your teaching community awaits. The next few steps will personalize your experience perfectly.
        </p>

        {/* CTA Button */}
        <button
          onClick={onContinue}
          style={{
            background: 'var(--gold)',
            color: 'var(--navy)',
            border: 'none',
            padding: '16px 40px',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: 'pointer',
            animation: 'fadeInUp 0.8s ease-out 0.6s backwards',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(212,165,116,0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Let's Get Started
        </button>
      </div>
    </div>
  )
}

function ProgressIndicator({ currentStep, totalSteps }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', justifyContent: 'center' }}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: i < currentStep ? 'var(--gold)' : i === currentStep - 1 ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
              color: i <= currentStep - 1 ? 'var(--navy)' : 'rgba(255,255,255,0.6)',
              fontWeight: '600',
              fontSize: '1rem',
              transition: 'all 0.4s ease-out',
              border: i < currentStep ? 'none' : '2px solid rgba(255,255,255,0.2)'
            }}
          >
            {i < currentStep ? '✓' : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              style={{
                height: '2px',
                background: i < currentStep - 1 ? 'var(--gold)' : 'rgba(255,255,255,0.1)',
                width: '32px',
                transition: 'all 0.4s ease-out'
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function SubjectSelection({ subjects, selected, onToggle }) {
  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '12px', textAlign: 'center' }}>
        What subjects do you teach?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
        Select all that apply
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {subjects.map((subject, idx) => (
          <div
            key={subject.id}
            className="stagger-item"
            style={{ '--animation-delay': `${idx * 0.05}s` }}
          >
            <button
              onClick={() => onToggle(subject.id)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: selected.includes(subject.id) ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                position: 'relative',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,116,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ fontSize: '28px' }}>{subject.icon}</div>
              <span style={{
                color: selected.includes(subject.id) ? 'var(--gold)' : 'white',
                fontWeight: selected.includes(subject.id) ? '600' : '500',
                fontSize: '0.95rem'
              }}>
                {subject.name}
              </span>
              {selected.includes(subject.id) && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: '700'
                }}>
                  ✓
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GradeSelection({ grades, selected, onToggle }) {
  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '12px', textAlign: 'center' }}>
        Which grade levels do you teach?
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
        Select all that apply
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {grades.map((grade, idx) => (
          <div
            key={grade.id}
            className="stagger-item"
            style={{ '--animation-delay': `${idx * 0.05}s` }}
          >
            <button
              onClick={() => onToggle(grade.id)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: selected.includes(grade.id) ? '2px solid var(--gold)' : '2px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(212,165,116,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem', textAlign: 'left' }}>
                  {grade.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textAlign: 'left' }}>
                  {grade.range}
                </div>
              </div>
              {selected.includes(grade.id) && (
                <div style={{
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  ✓
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PhotoUpload({ photo, onUpload }) {
  const uploadRef = React.useRef(null)

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '12px', textAlign: 'center' }}>
        Upload your profile photo
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
        Let the community put a face to the name
      </p>

      <div
        onClick={() => uploadRef.current?.click()}
        style={{
          border: '3px dashed rgba(212,165,116,0.4)',
          borderRadius: '12px',
          padding: '40px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s',
          background: 'rgba(255,255,255,0.02)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--gold)'
          e.currentTarget.style.background = 'rgba(212,165,116,0.08)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212,165,116,0.4)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }}
      >
        {photo ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <img
              src={photo}
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
            <div style={{ color: 'var(--gold)', fontWeight: '600' }}>
              Photo selected ✓
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                uploadRef.current?.click()
              }}
              style={{
                background: 'rgba(212,165,116,0.2)',
                color: 'var(--gold)',
                border: '1px solid var(--gold)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              Choose Different Photo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '48px' }}>📷</div>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '1rem' }}>
              Click to upload or drag & drop
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              PNG, JPG, GIF up to 5MB
            </div>
          </div>
        )}
      </div>

      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        onChange={onUpload}
        style={{ display: 'none' }}
      />
    </div>
  )
}

function Personalization({ profile, onUpdate }) {
  const [formData, setFormData] = React.useState({
    bio: profile.bio,
    school: profile.school,
    city: profile.city,
    experience: profile.experience
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    onUpdate({ ...profile, [field]: value })
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '12px', textAlign: 'center' }}>
        Tell us about yourself
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: '32px', fontSize: '0.95rem' }}>
        Help fellow teachers get to know you
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[
          { label: 'Your Bio', field: 'bio', placeholder: 'Share what makes your teaching unique...', rows: 3 },
          { label: 'School Name', field: 'school', placeholder: 'Where do you teach?', rows: 1 },
          { label: 'City', field: 'city', placeholder: 'Your city', rows: 1 },
          { label: 'Years of Experience', field: 'experience', placeholder: 'How many years have you been teaching?', rows: 1 }
        ].map((item, idx) => (
          <div
            key={item.field}
            className="stagger-item"
            style={{ '--animation-delay': `${idx * 0.1}s` }}
          >
            <label style={{ display: 'block', color: 'white', fontWeight: '600', marginBottom: '8px', fontSize: '0.95rem' }}>
              {item.label}
            </label>
            {item.rows > 1 ? (
              <textarea
                value={formData[item.field]}
                onChange={(e) => handleChange(item.field, e.target.value)}
                placeholder={item.placeholder}
                rows={item.rows}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  resize: 'vertical'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            ) : (
              <input
                type="text"
                value={formData[item.field]}
                onChange={(e) => handleChange(item.field, e.target.value)}
                placeholder={item.placeholder}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--gold)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CelebrationScreen({ profile }) {
  const navigate = useNavigate()
  const [confetti, setConfetti] = React.useState([])

  React.useEffect(() => {
    // Generate confetti pieces
    const pieces = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      duration: Math.random() * 2 + 2,
      delay: Math.random() * 0.5
    }))
    setConfetti(pieces)

    // Clear saved onboarding data
    localStorage.removeItem('tn_onboarding')
  }, [])

  const quickActions = [
    {
      title: 'Explore Resources',
      description: 'Browse thousands of lesson plans, worksheets, and materials',
      icon: '📚',
      action: () => navigate('/resources')
    },
    {
      title: 'Join a Community',
      description: 'Connect with teachers in your subject and grade level',
      icon: '👥',
      action: () => navigate('/communities')
    },
    {
      title: 'Try AI Planner',
      description: 'Generate lesson plans in minutes with our AI assistant',
      icon: '✨',
      action: () => navigate('/ai-tools')
    }
  ]

  return (
    <div style={{
      textAlign: 'center',
      animation: 'fadeInScale 0.6s ease-out'
    }}>
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          style={{
            position: 'fixed',
            left: `${piece.left}%`,
            top: '-20px',
            width: '8px',
            height: '8px',
            background: ['var(--gold)', 'rgba(212,165,116,0.7)', 'white'][piece.id % 3],
            borderRadius: '50%',
            animation: `confetti ${piece.duration}s ease-in ${piece.delay}s forwards`,
            pointerEvents: 'none'
          }}
        />
      ))}

      {/* Profile Card */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '2px solid var(--gold)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
        animation: 'slideIn 0.6s ease-out 0.2s backwards'
      }}>
        {profile.photo ? (
          <img
            src={profile.photo}
            alt="Profile"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              margin: '0 auto 16px',
              border: '3px solid var(--gold)'
            }}
          />
        ) : (
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--gold), rgba(212,165,116,0.5))',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px'
          }}>
            👤
          </div>
        )}
        <div style={{ color: 'white', fontWeight: '600', fontSize: '1.2rem', marginBottom: '8px' }}>
          Profile Complete!
        </div>
        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
          Your teaching profile is all set up
        </div>
      </div>

      {/* Congratulations */}
      <h2 style={{ color: 'white', marginBottom: '12px', fontSize: '2.2rem' }}>
        🎉 Congratulations!
      </h2>
      <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '40px', fontSize: '1.05rem' }}>
        Welcome to TeachNexus. You're ready to transform your teaching.
      </p>

      {/* Quick Action Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '2px solid rgba(212,165,116,0.3)',
              borderRadius: '12px',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              color: 'white',
              textAlign: 'left',
              animation: `slideIn 0.6s ease-out ${0.3 + idx * 0.1}s backwards`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--gold)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(212,165,116,0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212,165,116,0.3)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{ fontSize: '32px', flexShrink: 0 }}>{action.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                {action.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
                {action.description}
              </div>
            </div>
            <div style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>→</div>
          </button>
        ))}
      </div>
    </div>
  )
}
