import React, { useEffect, useState } from 'react'
import api from '../api'

export default function Gamification(){
  const [list, setList] = useState([])

  useEffect(()=>{
    api.get('/gamification/leaderboard').then(r=>setList(r.data.leaderboard)).catch(()=>{})
  }, [])

  return (
    <div className="gamification-page">
      <div className="gamification-container">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar">🧑‍🏫</div>
          <div className="profile-level">⭐ Level 28</div>
          <div className="profile-title">Expert Educator</div>
          <div className="profile-xp">2,450 / 3,000 XP to Level 29</div>
          <div className="profile-progress">
            <div className="profile-progress-bar"></div>
          </div>
          <div className="stats-pills">
            <div className="stat-pill">📚 <strong>24</strong> Lessons</div>
            <div className="stat-pill">⬇️ <strong>1.2K</strong> Downloads</div>
            <div className="stat-pill">👥 <strong>156</strong> Followers</div>
            <div className="stat-pill">💬 <strong>347</strong> Posts</div>
          </div>
        </div>

        {/* Badges Section */}
        <div className="badges-section">
          <h2 className="section-title">🎖️ Your Achievements</h2>
          <div className="badges-grid">
            <div className="badge-item">
              <div className="badge-circle">🏅</div>
              <div className="badge-name">First Upload</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle">⭐</div>
              <div className="badge-name">100 Downloads</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle">🤝</div>
              <div className="badge-name">Community Hero</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle">🔥</div>
              <div className="badge-name">7-Day Streak</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle locked">🎯</div>
              <div className="badge-name">Top Contributor</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle locked">👑</div>
              <div className="badge-name">Level 50</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle locked">🌟</div>
              <div className="badge-name">1000 Followers</div>
            </div>
            <div className="badge-item">
              <div className="badge-circle locked">💎</div>
              <div className="badge-name">Master Teacher</div>
            </div>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="leaderboard-section">
          <h2 className="section-title">🏆 Global Leaderboard - This Month</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th style={{width: 50}}>Rank</th>
                <th>Teacher</th>
                <th>Subject</th>
                <th style={{width: 120}}>XP Score</th>
                <th style={{width: 60}}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? list.map((u, i) => (
                <tr key={u._id}>
                  <td>
                    <span className={`leaderboard-rank ${i === 0 ? 'top-1' : i === 1 ? 'top-2' : i === 2 ? 'top-3' : ''}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                    </span>
                  </td>
                  <td>
                    <div className="leaderboard-name">
                      <div className="leaderboard-avatar"></div>
                      <span>{u.name}</span>
                    </div>
                  </td>
                  <td style={{fontSize: '0.9rem', color: 'var(--text-lighter)'}}>{u.subject || 'Mixed'}</td>
                  <td>
                    <span className="leaderboard-xp">{u.xp || 0}</span>
                  </td>
                  <td>
                    <div className="leaderboard-trend trend-up">↑ 2</div>
                  </td>
                </tr>
              )) : (
                <>
                  <tr>
                    <td><span className="leaderboard-rank top-1">🥇</span></td>
                    <td>
                      <div className="leaderboard-name">
                        <div className="leaderboard-avatar"></div>
                        <span>Sarah Chen</span>
                      </div>
                    </td>
                    <td style={{fontSize: '0.9rem', color: 'var(--text-lighter)'}}>Mathematics</td>
                    <td><span className="leaderboard-xp">4,890</span></td>
                    <td><div className="leaderboard-trend trend-down">↓ 1</div></td>
                  </tr>
                  <tr>
                    <td><span className="leaderboard-rank top-2">🥈</span></td>
                    <td>
                      <div className="leaderboard-name">
                        <div className="leaderboard-avatar"></div>
                        <span>Marcus Johnson</span>
                      </div>
                    </td>
                    <td style={{fontSize: '0.9rem', color: 'var(--text-lighter)'}}>Science</td>
                    <td><span className="leaderboard-xp">4,723</span></td>
                    <td><div className="leaderboard-trend trend-up">↑ 3</div></td>
                  </tr>
                  <tr>
                    <td><span className="leaderboard-rank top-3">🥉</span></td>
                    <td>
                      <div className="leaderboard-name">
                        <div className="leaderboard-avatar"></div>
                        <span>Elena Rodriguez</span>
                      </div>
                    </td>
                    <td style={{fontSize: '0.9rem', color: 'var(--text-lighter)'}}>English</td>
                    <td><span className="leaderboard-xp">4,456</span></td>
                    <td><div className="leaderboard-trend trend-up">↑ 1</div></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Challenges Section */}
        <div className="challenges-section">
          <h2 className="section-title">🎯 Active Challenges</h2>
          <div className="challenges-grid">
            <div className="challenge-card">
              <div className="challenge-title">Weekly Challenge: Share 3 Resources</div>
              <div className="challenge-description">Upload 3 high-quality resources this week to earn bonus XP.</div>
              <div className="challenge-progress">
                <div className="challenge-progress-bar" style={{width: '66%'}}></div>
              </div>
              <div className="challenge-meta">
                <span>2 of 3 completed</span>
                <span className="challenge-reward">+250 XP</span>
              </div>
            </div>

            <div className="challenge-card">
              <div className="challenge-title">Monthly: Reach 50 Community Points</div>
              <div className="challenge-description">Earn points through posts, comments, and helping others.</div>
              <div className="challenge-progress">
                <div className="challenge-progress-bar" style={{width: '84%'}}></div>
              </div>
              <div className="challenge-meta">
                <span>42 of 50 points</span>
                <span className="challenge-reward">+500 XP</span>
              </div>
            </div>

            <div className="challenge-card">
              <div className="challenge-title">Daily Streak: Log In For 7 Days</div>
              <div className="challenge-description">Maintain your daily streak to unlock exclusive rewards.</div>
              <div className="challenge-progress">
                <div className="challenge-progress-bar" style={{width: '100%'}}></div>
              </div>
              <div className="challenge-meta">
                <span>Complete! 🎉</span>
                <span className="challenge-reward">+100 XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
