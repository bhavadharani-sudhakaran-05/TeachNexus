import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function UploadResource() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [xpEarned, setXpEarned] = useState(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    grades: [],
    resourceType: 'lesson',
    standards: [],
    language: 'en',
    tags: [],
    visibility: 'public',
    thumbnail: null,
    thumbnailType: 'default' // 'custom' or 'default'
  })

  const SUBJECTS = [
    { id: 'math', name: 'Mathematics', thumbnail: '📐' },
    { id: 'science', name: 'Science', thumbnail: '🔬' },
    { id: 'english', name: 'English', thumbnail: '📚' },
    { id: 'history', name: 'History', thumbnail: '🏛️' },
    { id: 'art', name: 'Art', thumbnail: '🎨' },
    { id: 'pe', name: 'Physical Education', thumbnail: '⚽' },
    { id: 'music', name: 'Music', thumbnail: '🎵' },
    { id: 'languages', name: 'Languages', thumbnail: '🌍' },
  ]

  const GRADES = [
    { id: 'pk-k', name: 'PreK-K' },
    { id: 'elementary', name: 'Elementary' },
    { id: 'middle', name: 'Middle School' },
    { id: 'high', name: 'High School' },
  ]

  const RESOURCE_TYPES = [
    { id: 'lesson', label: 'Lesson Plan', icon: '📋' },
    { id: 'worksheet', label: 'Worksheet', icon: '📄' },
    { id: 'presentation', label: 'Presentation', icon: '🎯' },
    { id: 'video', label: 'Video', icon: '🎬' },
    { id: 'interactive', label: 'Interactive Tool', icon: '🎮' },
    { id: 'assessment', label: 'Assessment', icon: '✓' },
  ]

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'video/mp4', 'image/png', 'image/jpeg']

    if (file.size > maxSize) {
      alert('File size exceeds 100MB limit')
      return
    }

    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported')
      return
    }

    // Simulate upload progress
    setUploadedFile(null)
    setUploadProgress(0)
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadProgress(100)
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          type: file.type,
          file: file
        })
      } else {
        setUploadProgress(progress)
      }
    }, 300)
  }

  const toggleGrade = (id) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.includes(id)
        ? prev.grades.filter(g => g !== id)
        : [...prev.grades, id]
    }))
  }

  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleThumbnailSelect = (thumbnail) => {
    setFormData(prev => ({
      ...prev,
      thumbnail,
      thumbnailType: 'default'
    }))
  }

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a resource title')
      return
    }

    if (!uploadedFile) {
      alert('Please upload a file')
      return
    }

    try {
      // Upload file first
      const formDataFile = new FormData()
      formDataFile.append('file', uploadedFile.file)
      
      const uploadRes = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/uploads', {
        method: 'POST',
        body: formDataFile,
        headers: { Authorization: 'Bearer ' + (localStorage.getItem('tn_token') || '') }
      })

      if (!uploadRes.ok) throw new Error('Upload failed')
      const uploadedData = await uploadRes.json()

      // Create resource
      const resourcePayload = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        grade: formData.grades.join(', '),
        resourceType: formData.resourceType,
        language: formData.language,
        tags: formData.tags,
        visibility: formData.visibility,
        files: [{ url: uploadedData.url, filename: uploadedData.filename, mimeType: uploadedData.mimeType }]
      }

      const res = await api.post('/resources', resourcePayload)

      // Show success
      setShowSuccess(true)
      setXpEarned(Math.floor(Math.random() * 50) + 50)
      setSuccessMessage(`Congratulations! Your "${formData.title}" has been published!`)

      setTimeout(() => {
        setShowSuccess(false)
        navigate('/resources')
      }, 3000)
    } catch (err) {
      console.error(err)
      alert('Failed to publish resource: ' + (err.message || ''))
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
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
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatUp {
          from {
            opacity: 0;
            transform: translateY(80px);
          }
          to {
            opacity: 1;
            transform: translateY(-80px);
          }
        }
        .upload-container {
          animation: fadeInUp 0.6s ease-out;
        }
        .stagger-item {
          animation: fadeInUp 0.4s ease-out backwards;
        }
        .stagger-item:nth-child(1) { animation-delay: 0.1s; }
        .stagger-item:nth-child(2) { animation-delay: 0.2s; }
        .stagger-item:nth-child(3) { animation-delay: 0.3s; }
        .stagger-item:nth-child(4) { animation-delay: 0.4s; }
        .stagger-item:nth-child(5) { animation-delay: 0.5s; }
        .cloud-icon {
          animation: float 3s ease-in-out infinite;
        }
        .resource-card-float {
          animation: floatUp 0.8s ease-out;
        }
      `}</style>

      {/* Header Section */}
      <div style={{ background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%)', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '700', margin: '0 0 12px', lineHeight: '1.2' }}>
          Share Your Brilliance With The World
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Every resource you upload helps thousands of teachers and millions of students around the globe. Your generosity transforms education.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }} className="upload-container">
        {/* Upload Zone */}
        <div
          className="stagger-item"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: '3px dashed var(--navy)',
            borderRadius: '16px',
            padding: '60px 40px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            background: isDragging ? 'rgba(212,165,116,0.15)' : uploadedFile ? 'rgba(16,185,129,0.08)' : 'transparent',
            boxShadow: isDragging ? '0 0 32px rgba(212,165,116,0.3)' : uploadedFile ? '0 0 24px rgba(16,185,129,0.2)' : 'none',
            borderColor: isDragging ? 'var(--gold)' : uploadedFile ? 'var(--success)' : 'var(--navy)'
          }}
          onClick={() => !uploadedFile && fileInputRef.current?.click()}
        >
          {!uploadedFile ? (
            <div>
              <div className="cloud-icon" style={{ fontSize: '64px', marginBottom: '16px' }}>
                ☁️
              </div>
              <h3 style={{ color: 'var(--navy)', margin: '0 0 8px', fontSize: '1.3rem' }}>
                {isDragging ? 'Drop your file here' : 'Drag and drop your file'}
              </h3>
              <p style={{ color: 'var(--text-lighter)', margin: '0 0 16px', fontSize: '0.95rem' }}>
                or click to browse
              </p>
              <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Accepted formats:</div>
                <div>PDF, PowerPoint, Word, MP4, PNG, JPG</div>
                <div style={{ marginTop: '8px', color: 'var(--text-lighter)' }}>Maximum file size: 100MB</div>
              </div>
            </div>
          ) : (
            <div>
              {uploadProgress < 100 ? (
                <div>
                  <div className="cloud-icon" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.6 }}>
                    ☁️
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(212,165,116,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          background: 'linear-gradient(90deg, var(--gold), var(--gold-light))',
                          width: `${uploadProgress}%`,
                          transition: 'width 0.2s'
                        }}
                      />
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-light)', margin: 0, fontSize: '0.9rem' }}>
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                  <h3 style={{ color: 'var(--navy)', margin: '0 0 8px', fontSize: '1.2rem' }}>
                    {uploadedFile.name}
                  </h3>
                  <p style={{ color: 'var(--text-lighter)', margin: '0', fontSize: '0.9rem' }}>
                    {uploadedFile.size} MB
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setUploadedFile(null)
                      setUploadProgress(0)
                    }}
                    style={{
                      marginTop: '12px',
                      background: 'transparent',
                      color: 'var(--gold)',
                      border: '1px solid var(--gold)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}
                  >
                    Change File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          style={{ display: 'none' }}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.png,.jpg,.jpeg"
        />

        {/* Form Section */}
        {uploadedFile && (
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Title */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)', fontSize: '1rem' }}>
                Resource Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your resource a clear, descriptive title..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid rgba(26,42,71,0.1)',
                  borderRadius: '10px',
                  fontSize: '1.05rem',
                  fontWeight: '600',
                  fontFamily: 'inherit',
                  color: 'var(--navy)',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26,42,71,0.1)'}
              />
            </div>

            {/* Description */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what's in this resource, how to use it, and what students will learn..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid rgba(26,42,71,0.1)',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: 'var(--navy)',
                  transition: 'all 0.2s',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26,42,71,0.1)'}
              />
            </div>

            {/* Subject & Grade */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="stagger-item">
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)' }}>
                  Subject *
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid rgba(26,42,71,0.1)',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    fontFamily: 'inherit',
                    color: 'var(--navy)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26,42,71,0.1)'}
                >
                  <option value="">Select a subject</option>
                  {SUBJECTS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="stagger-item">
                <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)' }}>
                  Grade Levels
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {GRADES.map(grade => (
                    <button
                      key={grade.id}
                      onClick={() => toggleGrade(grade.id)}
                      style={{
                        padding: '8px 12px',
                        background: formData.grades.includes(grade.id) ? 'var(--gold)' : 'rgba(26,42,71,0.06)',
                        color: formData.grades.includes(grade.id) ? 'var(--navy)' : 'var(--navy)',
                        border: formData.grades.includes(grade.id) ? 'none' : '1px solid rgba(26,42,71,0.1)',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      {grade.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Resource Type */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: 'var(--navy)' }}>
                Resource Type
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {RESOURCE_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setFormData(prev => ({ ...prev, resourceType: type.id }))}
                    style={{
                      padding: '12px',
                      background: formData.resourceType === type.id ? 'rgba(212,165,116,0.2)' : 'rgba(26,42,71,0.04)',
                      border: formData.resourceType === type.id ? '2px solid var(--gold)' : '1px solid rgba(26,42,71,0.1)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = formData.resourceType === type.id ? 'var(--gold)' : 'rgba(26,42,71,0.1)'}
                  >
                    <div style={{ fontSize: '20px' }}>{type.icon}</div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--navy)', textAlign: 'center' }}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)' }}>
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid rgba(26,42,71,0.1)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: 'var(--navy)',
                  cursor: 'pointer'
                }}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>

            {/* Tags */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: 'var(--navy)' }}>
                Tags
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {formData.tags.map((tag, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--navy)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        fontSize: '1rem',
                        padding: 0
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add tags... (press Enter)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '2px solid rgba(26,42,71,0.1)',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: 'var(--navy)'
                }}
              />
            </div>

            {/* Thumbnail Selection */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: 'var(--navy)' }}>
                Thumbnail
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {SUBJECTS.map(subject => (
                  <button
                    key={subject.id}
                    onClick={() => handleThumbnailSelect(subject.thumbnail)}
                    style={{
                      padding: '16px',
                      background: formData.thumbnail === subject.thumbnail ? 'rgba(212,165,116,0.2)' : 'rgba(26,42,71,0.04)',
                      border: formData.thumbnail === subject.thumbnail ? '2px solid var(--gold)' : '1px solid rgba(26,42,71,0.1)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: '32px' }}>{subject.thumbnail}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-lighter)', textAlign: 'center' }}>
                      {subject.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="stagger-item">
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '12px', color: 'var(--navy)' }}>
                Who can see this resource?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                  style={{
                    padding: '16px',
                    background: formData.visibility === 'public' ? 'rgba(212,165,116,0.15)' : 'rgba(26,42,71,0.04)',
                    border: formData.visibility === 'public' ? '2px solid var(--gold)' : '1px solid rgba(26,42,71,0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '32px' }}>🌍</div>
                  <div style={{ fontWeight: '600', color: 'var(--navy)' }}>Public</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)' }}>All teachers can find it</div>
                </button>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, visibility: 'private' }))}
                  style={{
                    padding: '16px',
                    background: formData.visibility === 'private' ? 'rgba(212,165,116,0.15)' : 'rgba(26,42,71,0.04)',
                    border: formData.visibility === 'private' ? '2px solid var(--gold)' : '1px solid rgba(26,42,71,0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '32px' }}>🔒</div>
                  <div style={{ fontWeight: '600', color: 'var(--navy)' }}>School Only</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-lighter)' }}>Only your school staff</div>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowPreview(true)}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'transparent',
                  border: '2px solid var(--gold)',
                  color: 'var(--gold)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212,165,116,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                👀 Preview
              </button>
              <button
                onClick={handlePublish}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: 'var(--gold)',
                  color: 'var(--navy)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '1rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(212,165,116,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                🚀 Publish Resource
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
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
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{ margin: '0 0 20px', color: 'var(--navy)' }}>Resource Preview</h3>

            {/* Resource Card Preview */}
            <div style={{
              background: 'var(--bg-2)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '20px',
              border: '1px solid rgba(26,42,71,0.1)'
            }}>
              <div style={{
                height: '160px',
                background: 'linear-gradient(135deg, var(--navy), var(--navy-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                {formData.thumbnail || '📚'}
              </div>
              <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px', color: 'var(--navy)', fontSize: '1.05rem' }}>
                  {formData.title || 'Untitled Resource'}
                </h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  {formData.subject && (
                    <span style={{
                      background: 'var(--gold)',
                      color: 'var(--navy)',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {SUBJECTS.find(s => s.id === formData.subject)?.name}
                    </span>
                  )}
                  <span style={{
                    background: 'rgba(26,42,71,0.1)',
                    color: 'var(--text-light)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {RESOURCE_TYPES.find(t => t.id === formData.resourceType)?.label}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-lighter)', lineHeight: '1.4' }}>
                  {formData.description || 'No description provided'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPreview(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--gold)',
                color: 'var(--navy)',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Success Animation */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          pointerEvents: 'none'
        }}>
          <div className="resource-card-float" style={{
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: 'var(--navy)', margin: '0 0 12px', fontSize: '2rem' }}>
              {successMessage}
            </h2>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--gold)',
              marginBottom: '8px'
            }}>
              +{xpEarned} XP
            </div>
            <p style={{ color: 'var(--text-light)', margin: 0 }}>
              You helped the teaching community grow!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
