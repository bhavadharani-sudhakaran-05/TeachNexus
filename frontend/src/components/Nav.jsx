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
        <nav className="menu">
          <Link to="/resources">{t('app.resources')}</Link>
          <Link to="/planner">{t('app.planner')}</Link>
          <Link to="/communities">{t('app.communities')}</Link>
          <Link to="/chat">{t('app.chat')}</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="primary">Dashboard</Link>
              <Link to="/parent">{t('app.parent_portal')}</Link>
              <Link to="/notifications" style={{ position: 'relative' }}>
                Notifications
                {unread > 0 && <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--danger)', color: 'white', borderRadius: '50%', width: 20, height: 20, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread}</span>}
              </Link>
              <button onClick={logout} className="btn secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="primary">{t('app.login')}</Link>
              <Link to="/register" className="btn">{t('app.signup')}</Link>
            </>
          )}
          <select onChange={changeLang} defaultValue={i18n.language} className="lang-select">
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </nav>
      </div>
    </header>
  )
}
