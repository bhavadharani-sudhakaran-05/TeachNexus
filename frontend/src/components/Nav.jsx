import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Notifications from './Notifications'

export default function Nav(){
  const navigate = useNavigate()
  const token = typeof window !== 'undefined' ? localStorage.getItem('tn_token') : null
  const { t, i18n } = useTranslation()

  function changeLang(e){
    const l = e.target.value
    i18n.changeLanguage(l)
  }

  function logout(){
    localStorage.removeItem('tn_token')
    localStorage.removeItem('tn_user')
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm">
      <Notifications />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 text-white rounded flex items-center justify-center font-bold">TN</div>
          <div className="font-semibold">TeachNexus</div>
        </Link>
        <nav className="space-x-4 text-sm flex items-center">
          <Link to="/resources" className="text-gray-600 hover:text-indigo-600">{t('app.resources')}</Link>
          <Link to="/planner" className="text-gray-600 hover:text-indigo-600">{t('app.planner')}</Link>
          <Link to="/communities" className="text-gray-600 hover:text-indigo-600">{t('app.communities')}</Link>
          <Link to="/chat" className="text-gray-600 hover:text-indigo-600">{t('app.chat')}</Link>
          {token ? (
            <>
              <Link to="/dashboard" className="text-gray-700 font-medium">Dashboard</Link>
                  <Link to="/parent" className="ml-2 text-gray-600 hover:text-indigo-600">{t('app.parent_portal')}</Link>
                  <Link to="/notifications" className="ml-2 text-gray-600 hover:text-indigo-600">Notifications</Link>
              <button onClick={logout} className="ml-2 text-sm px-3 py-1 bg-red-50 text-red-600 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 font-medium">{t('app.login')}</Link>
              <Link to="/register" className="ml-2 text-sm px-3 py-1 bg-indigo-600 text-white rounded">{t('app.signup')}</Link>
            </>
          )}
          <select onChange={changeLang} defaultValue={i18n.language} className="ml-4 border rounded px-2 py-1 text-sm">
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </nav>
      </div>
    </header>
  )
}
