import React from 'react'

export default function AITools(){
  return (
    <div className="ai-tools">
      {/* Hero Section */}
      <div className="ai-hero">
        <div className="ai-hero-content">
          <h1>Your Intelligent Teaching Assistant, Powered by AI</h1>
          <p>Save hours every week. Create smarter lesson plans. Make every student succeed. Experience the future of teaching today.</p>
        </div>
      </div>

      {/* AI Tools Grid */}
      <div className="ai-tools-grid" style={{paddingBottom: 0}}>
        {/* AI Lesson Generator */}
        <div className="ai-tool-section">
          <div className="ai-tool-mockup">
            📝 AI Lesson Generator
          </div>
          <div className="ai-tool-content">
            <h2>Generate Complete Lesson Plans in Seconds</h2>
            <p>Simply describe your lesson topic, grade level, and learning objectives. Our AI creates comprehensive, standards-aligned lesson plans with activities, assessments, and resources — all customized for your students.</p>
            <ul className="ai-tool-benefits">
              <li>Generate by topic, grade, or standard</li>
              <li>AI understands curriculum requirements</li>
              <li>Includes learning objectives & assessments</li>
              <li>Fully customizable content</li>
            </ul>
            <button className="btn primary" style={{marginTop: 20}}>Try AI Generator Free</button>
          </div>
        </div>

        {/* Resource Recommender */}
        <div className="ai-tool-section">
          <div className="ai-tool-content">
            <h2>Smart Resource Recommendations</h2>
            <p>AI analyzes your teaching style, student needs, and curriculum to recommend the perfect resources. Discover gems you'd never find manually — worksheets, videos, interactive tools, and lesson plans personalized just for you.</p>
            <ul className="ai-tool-benefits">
              <li>Personalized to your teaching style</li>
              <li>Based on student performance data</li>
              <li>Discover hidden resource gems</li>
              <li>One-click save to planner</li>
            </ul>
            <button className="btn primary" style={{marginTop: 20}}>Explore Recommendations</button>
          </div>
          <div className="ai-tool-mockup">
            🎯 Smart Recommender
          </div>
        </div>

        {/* Voice to Lesson */}
        <div className="ai-tool-section">
          <div className="ai-tool-mockup">
            🎤 Voice to Lesson
          </div>
          <div className="ai-tool-content">
            <h2>Turn Your Ideas into Lessons Instantly</h2>
            <p>Don't have time to type? Just talk. Say your lesson idea, and our AI transcribes, structures, and expands it into a full lesson plan. Perfect for documentation and sharing with colleagues.</p>
            <ul className="ai-tool-benefits">
              <li>Speak naturally, AI structures it</li>
              <li>Automatic transcription & editing</li>
              <li>Perfect for quick documentation</li>
              <li>Share with team instantly</li>
            </ul>
            <button className="btn primary" style={{marginTop: 20}}>Record a Lesson</button>
          </div>
        </div>

        {/* Smart Grading */}
        <div className="ai-tool-section">
          <div className="ai-tool-content">
            <h2>AI-Assisted Grading & Feedback</h2>
            <p>Reduce grading time by 60%. AI analyzes student work, grades it intelligently, and generates personalized feedback aligned to learning standards. You review and adjust in seconds instead of hours.</p>
            <ul className="ai-tool-benefits">
              <li>Intelligent assessment analysis</li>
              <li>Reduce grading time significantly</li>
              <li>Generate personalized feedback</li>
              <li>Track learning patterns</li>
            </ul>
            <button className="btn primary" style={{marginTop: 20}}>Upload Assignments</button>
          </div>
          <div className="ai-tool-mockup">
            ✅ Smart Grading
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="ai-call-section">
        <h2>Join Thousands of Teachers Using AI to Transform Their Classrooms</h2>
        <p>Free for all teachers. No credit card required. Start using AI-powered tools instantly.</p>
        <button className="ai-call-btn">
          Start Using AI Tools Today
        </button>
      </div>
    </div>
  )
}
