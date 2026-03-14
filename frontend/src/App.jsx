import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Resources from './pages/Resources'
import ResourceDetail from './pages/ResourceDetail'
import UploadResource from './pages/UploadResource'
import Dashboard from './pages/Dashboard'
import LessonPlanner from './pages/LessonPlanner'
import Communities from './pages/Communities'
import Chat from './pages/Chat'
import Admin from './pages/Admin'
import AIGenerator from './pages/AIGenerator'
import LessonEditor from './pages/LessonEditor'
import WhiteboardScanner from './pages/WhiteboardScanner'
import VoiceToLesson from './pages/VoiceToLesson'
import Leaderboard from './pages/Leaderboard'
import ParentPortal from './pages/ParentPortal'
import NotificationsPage from './pages/Notifications'

export default function App(){
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/resources" element={<Resources/>} />
        <Route path="/resources/upload" element={<UploadResource/>} />
        <Route path="/resources/:id" element={<ResourceDetail/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/planner" element={<LessonPlanner/>} />
        <Route path="/ai" element={<AIGenerator/>} />
        <Route path="/editor/:id" element={<LessonEditor/>} />
        <Route path="/whiteboard" element={<WhiteboardScanner/>} />
        <Route path="/voice" element={<VoiceToLesson/>} />
        <Route path="/leaderboard" element={<Leaderboard/>} />
        <Route path="/parent" element={<ParentPortal/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/communities" element={<Communities/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </BrowserRouter>
  )
}
