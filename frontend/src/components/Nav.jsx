import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Notifications from './Notifications'
import api from '../api'

export default function Nav(){
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('tn_token') : null
  const { t, i18n } = useTranslation()
  const [unread, setUnread] = useState(0)

  function changeLang(e){
    const l = e.target.value
    i18n.changeLanguage(l)
  }

  useEffect(()=>{
    let mounted = true
    async function loadUnread(){
      if (!token) return
      try{
        const res = await api.get('/notifications')
        if (!mounted) return
        setUnread(res.data.unread || 0)
      }catch(e){ }
    }
    loadUnread()
    const handler = (e) => setUnread(e.detail?.unread || 0)
    window.addEventListener('notifications:updated', handler)
    return ()=>{ mounted = false; window.removeEventListener('notifications:updated', handler) }
  }, [token])

  function logout(){
    localStorage.removeItem('tn_token')
    localStorage.removeItem('tn_user')
    navigate('/')
  }

  return (
    <header className="nav">
      <Notifications />
      <div className="container row">
        <Link to="/" className="brand">
          <div className="logo"></div>
          <span>TeachNexus</span>
        </Link>
        <nav style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '.95rem', flex: 1, justifyContent: 'flex-end' }}>
          <Link to="/resources" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{t('app.resources')}</Link>
          <Link to="/planner" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{t('app.planner')}</Link>
          <Link to="/communities" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{t('app.communities')}</Link>
          <Link to="/chat" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{t('app.chat')}</Link>
          {token ? (
            <>
              <Link to="/dashboard" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Dashboard</Link>
              <Link to="/parent" style={{ color: 'var(--muted)', textDecoration: 'none' }}>{t('app.parent_portal')}</Link>
              <Link to="/notifications" style={{ color: 'var(--muted)', textDecoration: 'none', position: 'relative' }}>
                Notifications
                {unread > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
              </Link>
              <button onClick={logout} className="btn secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{t('app.login')}</Link>
              <Link to="/register" className="btn" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>{t('app.signup')}</Link>
            </>
          )}
          <select onChange={changeLang} defaultValue={i18n.language} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit', padding: '6px 8px', borderRadius: '8px', fontSize: '0.9rem' }}>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </nav>
      </div>
    </header>
  )
}
