import React, { useState } from 'react'

export default function LessonPlanner() {
  const [view, setView] = useState('week')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [currentWeek, setCurrentWeek] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    duration: '',
    objectives: [''],
    materials: '',
    intro: '',
    mainActivity: '',
    practice: '',
    conclusion: '',
    assessment: '',
    homework: '',
    differentiation: ''
  })

  // Mock lesson data
  const mockLessons = [
    { id: 1, title: 'Quadratic Equations', subject: 'Algebra', grade: '9', day: 'Mon', time: '09:00', duration: '45min', status: 'complete', color: '#d4a574' },
    { id: 2, title: 'Photosynthesis Lab', subject: 'Biology', grade: '10', day: 'Tue', time: '10:00', duration: '60min', status: 'in-progress', color: '#10b981' },
    { id: 3, title: 'Shakespeare Analysis', subject: 'English', grade: '11', day: 'Wed', time: '11:00', duration: '45min', status: 'not-started', color: '#f59e0b' },
    { id: 4, title: 'World War II', subject: 'History', grade: '10', day: 'Thu', time: '13:00', duration: '50min', status: 'complete', color: '#8b5cf6' },
    { id: 5, title: 'Geometry Proofs', subject: 'Math', grade: '9', day: 'Fri', time: '09:00', duration: '45min', status: 'in-progress', color: '#d4a574' },
  ]

  const timeSlots = Array.from({ length: 8 }, (_, i) => `${8 + i}:00`)
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const handleObjectiveAdd = () => {
    setFormData({
      ...formData,
      objectives: [...formData.objectives, '']
    })
  }

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives]
    newObjectives[index] = value
    setFormData({ ...formData, objectives: newObjectives })
  }

  const handleObjectiveRemove = (index) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index)
    })
  }

  const handleGenerateWithAI = (topic, grade, duration) => {
    setFormData({
      ...formData,
      title: `${topic} Lesson Plan`,
      grade,
      duration,
      objectives: [
        `Students will understand the key concepts of ${topic}`,
        `Students will be able to apply ${topic} in real-world scenarios`,
        `Students will demonstrate mastery through assessment activities`
      ],
      materials: `Projector, whiteboard, handouts, multimedia resources for ${topic}`,
      intro: `Begin with an engaging question about ${topic} to capture student interest. Show a brief video or image that relates to the real-world application of ${topic}.`,
      mainActivity: `Present core concepts of ${topic} using interactive demonstrations. Use think-pair-share activities to encourage student discussion and understanding.`,
      practice: `Provide structured practice problems for ${topic}. Have students work in pairs to solve problems and discuss strategies.`,
      conclusion: `Summarize the key learning points about ${topic}. Have students share one thing they learned and one question they still have.`,
      assessment: `Quick quiz on ${topic} concepts. Observe student practice activities. Check for understanding through exit ticket.`,
      homework: `Practice problems on ${topic}. Research project extensions for advanced learners.`,
      differentiation: `For advanced students: challenge problems and research extension projects. For struggling students: step-by-step guides and small group instruction.`
    })
    setShowAIModal(false)
  }

  const resources = [
    { id: 1, title: 'Algebra Problem Sets', downloads: 1240, rating: 4.8 },
    { id: 2, title: 'Geometry Interactive', downloads: 856, rating: 4.9 },
    { id: 3, title: 'Calculus Worksheets', downloads: 2103, rating: 4.7 },
    { id: 4, title: 'Statistics Visualizer', downloads: 934, rating: 4.6 },
  ]

  return (
    <div className="lesson-planner-page">
      <div className="planner-header">
        <h1>📚 Weekly Lesson Planner</h1>
        <div className="planner-toolbar">
          <div className="view-options">
            <button className={`view-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>
              Day
            </button>
            <button className={`view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
              Week
            </button>
            <button className={`view-btn ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>
              Month
            </button>
          </div>

          <div className="date-nav">
            <button onClick={() => setCurrentWeek(currentWeek - 1)}>← Prev</button>
            <button onClick={() => setCurrentWeek(0)} className="today-btn">Today</button>
            <button onClick={() => setCurrentWeek(currentWeek + 1)}>Next →</button>
          </div>

          <button className="btn primary" onClick={() => { setShowEditor(true); setFormData({ ...formData, objectives: [''] }) }}>
            + Create Lesson Plan
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {!showEditor && (
        <div className="planner-calendar">
          <div className="calendar-grid">
            {/* Time slots row */}
            <div className="time-column">
              <div className="time-header"></div>
              {timeSlots.map(time => (
                <div key={time} className="time-slot">{time}</div>
              ))}
            </div>

            {/* Days */}
            {days.map(day => (
              <div key={day} className="day-column">
                <div className="day-header">{day}</div>
                {timeSlots.map(time => {
                  const lesson = mockLessons.find(l => l.day === day.slice(0, 3) && l.time.startsWith(time.split(':')[0]))
                  return (
                    <div
                      key={`${day}-${time}`}
                      className="day-slot"
                      onClick={() => lesson && setSelectedLesson(lesson)}
                    >
                      {lesson && (
                        <div className="lesson-block" style={{ borderLeftColor: lesson.color }}>
                          <div className="lesson-subject">{lesson.subject}</div>
                          <div className="lesson-title">{lesson.title}</div>
                          <div className="lesson-meta">{lesson.grade}th • {lesson.duration}</div>
                          <div className={`lesson-status status-${lesson.status}`}>
                            {lesson.status === 'complete' && '✓'}
                            {lesson.status === 'in-progress' && '◐'}
                            {lesson.status === 'not-started' && '◯'}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lesson Editor Panel */}
      {showEditor && (
        <div className="lesson-editor-panel">
          <div className="editor-header">
            <h2>Create New Lesson Plan</h2>
            <button className="close-btn" onClick={() => setShowEditor(false)}>✕</button>
          </div>

          <div className="editor-toolbar">
            <button className="btn secondary" onClick={() => alert('Saved as draft')}>💾 Save Draft</button>
            <button className="btn secondary" onClick={() => alert('Published')}>📤 Publish</button>
            <button className="btn secondary" onClick={() => alert('Exported as PDF')}>📄 Export PDF</button>
            <button className="btn secondary" onClick={() => alert('Sharing options')}>👥 Share</button>
            <button className="btn gold" onClick={() => setShowAIModal(true)}>✨ Generate with AI</button>
          </div>

          <div className="editor-content">
            {/* Main Editor */}
            <div className="editor-main">
              <div className="editor-section">
                <label>Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g., Quadratic Equations Fundamentals"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="editor-row">
                <div className="editor-section flex-1">
                  <label>Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="editor-section flex-1">
                  <label>Grade Level</label>
                  <input
                    type="text"
                    placeholder="e.g., 9-10"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  />
                </div>
                <div className="editor-section flex-1">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="e.g., 45 minutes"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </div>
              </div>

              <div className="editor-section">
                <label>Learning Objectives</label>
                {formData.objectives.map((obj, idx) => (
                  <div key={idx} className="objective-item">
                    <input
                      type="text"
                      placeholder={`Objective ${idx + 1}: Students will be able to...`}
                      value={obj}
                      onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                    />
                    {formData.objectives.length > 1 && (
                      <button className="remove-btn" onClick={() => handleObjectiveRemove(idx)}>✕</button>
                    )}
                  </div>
                ))}
                <button className="btn secondary" onClick={handleObjectiveAdd} style={{ marginTop: 8 }}>
                  + Add Objective
                </button>
              </div>

              <div className="editor-section">
                <label>Required Materials</label>
                <textarea
                  placeholder="List all materials, resources, and equipment needed for this lesson..."
                  value={formData.materials}
                  onChange={(e) => setFormData({ ...formData, materials: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="editor-section">
                <label>Introduction / Hook</label>
                <textarea
                  placeholder="How will you capture student attention at the start? What question or activity will engage them?"
                  value={formData.intro}
                  onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="editor-section">
                <label>Main Teaching Activity</label>
                <textarea
                  placeholder="Describe the core instructional content and delivery method. How will you teach the main concept?"
                  value={formData.mainActivity}
                  onChange={(e) => setFormData({ ...formData, mainActivity: e.target.value })}
                  rows="5"
                />
              </div>

              <div className="editor-section">
                <label>Student Practice Exercise</label>
                <textarea
                  placeholder="What practice activities will students do to reinforce learning? Individual work, pair work, or group work?"
                  value={formData.practice}
                  onChange={(e) => setFormData({ ...formData, practice: e.target.value })}
                  rows="4"
                />
              </div>

              <div className="editor-section">
                <label>Conclusion & Recap</label>
                <textarea
                  placeholder="How will you close the lesson? What will students take away?"
                  value={formData.conclusion}
                  onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="editor-section">
                <label>Assessment & Checking for Understanding</label>
                <textarea
                  placeholder="How will you know if students learned? What assessments will you use?"
                  value={formData.assessment}
                  onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="editor-section">
                <label>Homework Assignment</label>
                <textarea
                  placeholder="What homework will reinforce today's learning?"
                  value={formData.homework}
                  onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="editor-section">
                <label>Differentiation Strategies</label>
                <textarea
                  placeholder="How will you support struggling learners? How will you challenge advanced learners?"
                  value={formData.differentiation}
                  onChange={(e) => setFormData({ ...formData, differentiation: e.target.value })}
                  rows="4"
                />
              </div>
            </div>

            {/* Resources Sidebar */}
            <div className="editor-sidebar">
              <div className="sidebar-section">
                <h3>Attach Resources</h3>
                <input type="text" placeholder="Search resources..." className="resource-search" />
                <div className="resources-list">
                  {resources.map(res => (
                    <div key={res.id} className="resource-item">
                      <div className="resource-header">
                        <div className="resource-title">{res.title}</div>
                        <button className="attach-btn">+</button>
                      </div>
                      <div className="resource-meta">
                        {res.downloads} downloads • ⭐ {res.rating}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="modal-overlay">
          <div className="ai-modal">
            <h2>✨ Generate Lesson Plan with AI</h2>
            <p>Tell us what you want to teach, and our AI will create a complete lesson plan instantly.</p>

            <div className="ai-form">
              <div className="form-group">
                <label>What topic would you like to teach?</label>
                <input type="text" placeholder="e.g., Photosynthesis, American Revolution, Fractions..." id="ai-topic" />
              </div>

              <div className="form-group">
                <label>Grade Level</label>
                <input type="text" placeholder="e.g., 9-10, High School, Grade 5..." id="ai-grade" />
              </div>

              <div className="form-group">
                <label>Lesson Duration</label>
                <input type="text" placeholder="e.g., 45 minutes, 1 hour..." id="ai-duration" />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn primary"
                  onClick={() => {
                    const topic = document.getElementById('ai-topic').value
                    const grade = document.getElementById('ai-grade').value
                    const duration = document.getElementById('ai-duration').value
                    if (topic && grade && duration) {
                      handleGenerateWithAI(topic, grade, duration)
                    }
                  }}
                >
                  Generate Lesson Plan
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setShowAIModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Detail Panel */}
      {selectedLesson && !showEditor && (
        <div className="lesson-detail-panel">
          <button className="close-btn" onClick={() => setSelectedLesson(null)}>✕</button>
          <h2>{selectedLesson.title}</h2>
          <div className="detail-badge">{selectedLesson.subject}</div>
          <p><strong>Grade:</strong> {selectedLesson.grade}</p>
          <p><strong>Time:</strong> {selectedLesson.day} at {selectedLesson.time}</p>
          <p><strong>Duration:</strong> {selectedLesson.duration}</p>
          <p><strong>Status:</strong> {selectedLesson.status.replace('-', ' ')}</p>
          <button className="btn primary" onClick={() => setShowEditor(true)}>Edit Lesson Plan</button>
        </div>
      )}
    </div>
  )
}
