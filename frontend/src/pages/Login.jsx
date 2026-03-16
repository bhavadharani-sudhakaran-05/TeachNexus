import React, { useState } from 'react'
import api from '../api'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    try{
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('tn_token', res.data.token)
      localStorage.setItem('tn_user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      {/* Left Side - Illustration & Quote */}
      <div className="login-left">
        <div className="login-left-content">
          <h2>Every day you teach,<br/>you change a life forever</h2>
          <p>Join thousands of educators building the future, one lesson at a time.</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <form onSubmit={submit} className="login-form">
          {/* Logo & Heading */}
          <div className="logo">TN</div>
          <h1>Welcome Back, Educator</h1>
          <p className="subtitle">Continue your journey of growth and collaboration</p>

          {/* Error Message */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="login-remember">
            <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
              <span>Remember me</span>
            </label>
            <a href="#">Forgot password?</a>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="btn primary" style={{ width: '100%', padding: '12px', margin: '24px 0' }}>
            Sign In
          </button>

          {/* Divider */}
          <div className="login-divider">or</div>

          {/* Social Login */}
          <div className="login-social">
            <button type="button" className="social-btn">
              Google
            </button>
            <button type="button" className="social-btn">
              Apple
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="login-signup">
            Don't have an account? <Link to="/register">Create a free account</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
