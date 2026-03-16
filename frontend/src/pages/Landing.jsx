import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'

export default function Landing() {
  return (
    <>
      <Hero />

      {/* Statistics Bar */}
      <section style={{ background: 'linear-gradient(135deg, #0f1b2e 0%, #1a2a47 100%)', padding: '48px 24px', borderTop: '1px solid rgba(212, 165, 116, 0.1)' }}>
        <div className="container">
          <div className="stats-bar">
            <div className="stat-card">
              <div className="number">50K+</div>
              <div className="label">Teachers Collaborating</div>
            </div>
            <div className="stat-card">
              <div className="number">100K+</div>
              <div className="label">Resources Shared</div>
            </div>
            <div className="stat-card">
              <div className="number">25K+</div>
              <div className="label">Lesson Plans Created</div>
            </div>
            <div className="stat-card">
              <div className="number">⭐⭐⭐⭐⭐</div>
              <div className="label">Rated by Educators</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <div className="container">
          <div className="heading">
            <h2>Powerful Features for Modern Teaching</h2>
            <p className="subtitle">Everything teachers need to create, collaborate, and inspire — all in one beautiful platform</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>AI Lesson Generator</h3>
              <p>Generate engaging lesson plans in seconds. Our AI understands curriculum standards and creates content tailored to your students' needs.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Teacher Community</h3>
              <p>Connect with educators worldwide. Share insights, ask questions, and grow professionally through genuine peer collaboration.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Resource Hub</h3>
              <p>Access thousands of vetted, ready-to-use resources created by expert teachers. Filter by grade, subject, and standard.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Lesson Planner</h3>
              <p>Plan your entire semester in one unified view. Coordinate with colleagues and track lesson progress in real-time.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-Time Chat</h3>
              <p>Collaborate with colleagues instantly. Share ideas, feedback, and resources through secure, subject-specific channels.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎖️</div>
              <h3>Gamification & Badges</h3>
              <p>Celebrate your achievements and those of your students. Earn badges and climb leaderboards while growing as an educator.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="ai-section">
        <div className="container">
          <div className="heading">
            <h2>AI-Powered Teaching Excellence</h2>
            <p className="subtitle">Harness the power of artificial intelligence to elevate your classroom and save hours of preparation time</p>
          </div>

          <div className="features-grid" style={{ marginTop: 40 }}>
            <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(212,165,116,0.2)' }}>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.4), rgba(212,165,116,0.2))' }}>🤖</div>
              <h3 style={{ color: 'white' }}>Intelligent Content</h3>
              <p>AI analyzes student learning patterns and recommends personalized resources and lesson adaptations.</p>
            </div>

            <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(212,165,116,0.2)' }}>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.4), rgba(212,165,116,0.2))' }}>✍️</div>
              <h3 style={{ color: 'white' }}>Smart Grading</h3>
              <p>Get AI assistance with assessment creation and grading. Focus more on feedback and student growth.</p>
            </div>

            <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(212,165,116,0.2)' }}>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.4), rgba(212,165,116,0.2))' }}>📈</div>
              <h3 style={{ color: 'white' }}>Progress Analytics</h3>
              <p>Visualize student progress with beautiful dashboards. Identify trends and intervene early when needed.</p>
            </div>

            <div className="feature-card" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(212,165,116,0.2)' }}>
              <div className="feature-icon" style={{ background: 'linear-gradient(135deg, rgba(212,165,116,0.4), rgba(212,165,116,0.2))' }}>🎨</div>
              <h3 style={{ color: 'white' }}>Content Creation</h3>
              <p>From worksheets to presentations, AI helps you create professional, engaging classroom materials instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section>
        <div className="container">
          <div className="heading">
            <h2>Loved by Teachers Worldwide</h2>
            <p className="subtitle">See how TeachNexus is transforming classrooms and saving teachers precious time every single day</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "TeachNexus saved me 5 hours per week on lesson planning. I'm spending more time with my students now rather than behind my desk. This platform truly understands what teachers need."
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Sarah Chen</h4>
                  <p>Elementary Math • Grade 3-5</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "The community feature is incredible. I've connected with teachers from around the world. The resource library has resources I would never have found on my own. Absolutely game-changing."
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Marcus Johnson</h4>
                  <p>High School English • Literature</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "My students love the gamification elements. Engagement has gone up by 40% since we started using TeachNexus. Parents notice the difference in their homework. Worth every penny."
              </div>
              <div className="testimonial-author">
                <div className="testimonial-avatar"></div>
                <div className="testimonial-info">
                  <h4>Elena Rodriguez</h4>
                  <p>Science • Biology & Chemistry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ background: 'var(--cream-dark)' }} id="pricing">
        <div className="container">
          <div className="heading">
            <h2>Flexible Plans for Every Teacher</h2>
            <p className="subtitle">Choose the plan that fits your needs. Upgrade or downgrade anytime, no strings attached</p>
          </div>

          <div className="pricing-grid">
            {/* Free Plan */}
            <div className="pricing-card">
              <h3>Free</h3>
              <div className="pricing-price">$0<span>/mo</span></div>
              <p className="pricing-description">Perfect for getting started</p>
              <button className="btn secondary" style={{ width: '100%', marginBottom: 20 }}>Get Started Free</button>
              <ul className="pricing-features">
                <li>Up to 10 resources uploaded</li>
                <li>Basic resource library access</li>
                <li>Community chat</li>
                <li>Email support</li>
                <li>Limited AI suggestions</li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card featured">
              <div className="pricing-badge">MOST POPULAR</div>
              <h3>Pro</h3>
              <div className="pricing-price">$9<span>/mo</span></div>
              <p className="pricing-description">For serious educators</p>
              <button className="btn primary" style={{ width: '100%', marginBottom: 20 }}>Start Pro Trial</button>
              <ul className="pricing-features">
                <li>Unlimited resources</li>
                <li>Full resource library + filters</li>
                <li>AI lesson generator</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
                <li>Lesson planning templates</li>
                <li>Unlimited AI suggestions</li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="pricing-price">Custom<span>/mo</span></div>
              <p className="pricing-description">For schools & districts</p>
              <button className="btn secondary" style={{ width: '100%', marginBottom: 20 }}>Contact Sales</button>
              <ul className="pricing-features">
                <li>School-wide deployment</li>
                <li>SSO & advanced security</li>
                <li>Custom integrations</li>
                <li>Dedicated account manager</li>
                <li>Advanced reporting</li>
                <li>Professional onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ background: 'linear-gradient(135deg, #1a2a47 0%, #0f1b2e 100%)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: 12 }}>Join Thousands of Teachers Today</h2>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', marginBottom: 28 }}>
            Stop fighting with disconnected tools. Start teaching with joy. TeachNexus is waiting for you.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn primary">Start Free Now</button>
            <button className="btn secondary">Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 40 }}>
            <div>
              <h4 style={{ color: 'white', marginBottom: 16 }}>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">Roadmap</a>
              <a href="#">Updates</a>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: 16 }}>Community</h4>
              <a href="#">Forums</a>
              <a href="#">Teachers</a>
              <a href="#">Resources</a>
              <a href="#">Events</a>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: 16 }}>Company</h4>
              <a href="#">About</a>
              <a href="#">Blog</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div>
              <h4 style={{ color: 'white', marginBottom: 16 }}>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Security</a>
              <a href="#">Compliance</a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(212,165,116,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
            <div>© 2026 TeachNexus. All rights reserved.</div>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Twitter</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>LinkedIn</a>
              <a href="#" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
