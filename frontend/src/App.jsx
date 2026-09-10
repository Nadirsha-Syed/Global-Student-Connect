import React, { useState, useEffect } from 'react';
import VideoCall from './pages/VideoCall.jsx';
import './App.css';

const PRESET_STUDENTS = [
  {
    name: 'Alice Smith',
    country: 'Germany',
    interests: ['React', 'AI', 'Web Performance'],
    languages: ['German', 'English'],
  },
  {
    name: 'Kenji Sato',
    country: 'Japan',
    interests: ['React', 'System Design', 'Algorithms'],
    languages: ['Japanese', 'English'],
  },
];

const TEAM_MEMBERS = [
  {
    role: '1. Frontend',
    responsibility: 'Student UI',
    work: 'Login, profile, dashboard, matching screens',
    paths: 'src/pages/ (Login, Profile, Dashboard, Matching)',
  },
  {
    role: '2. Frontend',
    responsibility: 'Video/Interaction UI',
    work: 'Video-call page, chat, topic/question interface',
    paths: 'src/pages/ (VideoCall.jsx, Chat.jsx), src/components/',
  },
  {
    role: '3. Backend',
    responsibility: 'Authentication & Profiles',
    work: 'APIs, login/signup, student profiles',
    paths: 'backend/controllers/auth*, backend/routes/auth*, models/User.js',
  },
  {
    role: '4. Backend',
    responsibility: 'Matching & Scheduling',
    work: 'Matching algorithm, database, meeting scheduling',
    paths: 'backend/controllers/match*, models/Match.js, models/Session.js',
  },
  {
    role: '5. Integration/AI',
    responsibility: 'AI + DevOps',
    work: 'AI-assisted matching/topic suggestions, API integration, deployment, testing',
    paths: 'backend/controllers/ai*, deployment configs, integration testing',
  },
];

function App() {
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'meeting'
  const [apiStatus, setApiStatus] = useState('Checking API connection...');
  const [roomId, setRoomId] = useState('room-global-study-101');
  
  // Selected Profile
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);
  const currentStudent = PRESET_STUDENTS[selectedStudentIndex];
  const peerStudent = PRESET_STUDENTS[1 - selectedStudentIndex];

  const [meetingTopic, setMeetingTopic] = useState('React Performance & Microfrontends');

  useEffect(() => {
    const host = window.location.hostname || 'localhost';
    fetch(`http://${host}:5000/`)
      .then((res) => res.json())
      .then((data) => setApiStatus(`Connected: ${data.message}`))
      .catch(() => setApiStatus(`Backend offline on ${host}:5000 (run "npm run server")`));
  }, []);

  if (activeView === 'meeting') {
    return (
      <div style={{ padding: '1rem', background: '#090d16', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={() => setActiveView('dashboard')}
            style={{
              padding: '0.5rem 1rem',
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            ← Back to Dashboard
          </button>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Active Profile: <strong style={{ color: '#38bdf8' }}>{currentStudent.name} ({currentStudent.country})</strong>
          </div>
        </div>

        <VideoCall
          roomId={roomId}
          currentUser={currentStudent}
          peerUser={peerStudent}
          sessionTopic={meetingTopic}
          onLeave={() => setActiveView('dashboard')}
        />
      </div>
    );
  }

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '960px', margin: '2.5rem auto', padding: '0 1.5rem', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 700 }}>Global Student Connect</h1>
            <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>MERN Stack Monorepo • Live WebRTC Video & AI Co-Pilot</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveView('dashboard')}
              style={{
                padding: '0.5rem 1rem',
                background: activeView === 'dashboard' ? '#0f172a' : '#e2e8f0',
                color: activeView === 'dashboard' ? '#ffffff' : '#334155',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('meeting')}
              style={{
                padding: '0.5rem 1rem',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              📹 Join Room ({currentStudent.name.split(' ')[0]})
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong>Backend & WebRTC Gateway:</strong>
          <span style={{ color: apiStatus.includes('Connected') ? '#16a34a' : '#d97706', fontWeight: 600 }}>{apiStatus}</span>
        </div>
      </header>

      {/* Video Call Quick Launch Card */}
      <section style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
          🎥 Test 1-on-1 Video Study Room
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: 0 }}>
          Select which student this browser window represents, then click Enter Room. In your incognito/second window, select the other student to connect them!
        </p>

        {/* Profile Quick Selectors */}
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          <button
            onClick={() => setSelectedStudentIndex(0)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '8px',
              border: selectedStudentIndex === 0 ? '2px solid #2563eb' : '1px solid #cbd5e1',
              background: selectedStudentIndex === 0 ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 700, color: '#1e293b' }}>🇩🇪 Student 1: Alice Smith</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Germany • React & AI</div>
          </button>

          <button
            onClick={() => setSelectedStudentIndex(1)}
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '8px',
              border: selectedStudentIndex === 1 ? '2px solid #2563eb' : '1px solid #cbd5e1',
              background: selectedStudentIndex === 1 ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ fontWeight: 700, color: '#1e293b' }}>🇯🇵 Student 2: Kenji Sato</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Japan • System Design & React</div>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.25rem' }}>Study Topic</label>
            <input
              type="text"
              value={meetingTopic}
              onChange={(e) => setMeetingTopic(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>

        <button
          onClick={() => setActiveView('meeting')}
          style={{
            marginTop: '1.25rem',
            padding: '0.75rem 1.5rem',
            background: '#16a34a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
          }}
        >
          🚀 Enter Room as {currentStudent.name}
        </button>
      </section>

      {/* Team Matrix */}
      <section>
        <h2 style={{ fontSize: '1.35rem', color: '#1e293b', marginBottom: '1rem', fontWeight: 600 }}>Team Ownership Matrix</h2>
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155' }}>Member</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155' }}>Responsibility</th>
                <th style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#334155' }}>Main Work</th>
              </tr>
            </thead>
            <tbody>
              {TEAM_MEMBERS.map((member, idx) => (
                <tr key={idx} style={{ borderBottom: idx !== TEAM_MEMBERS.length - 1 ? '1px solid #e2e8f0' : 'none', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#0f172a' }}>{member.role}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#2563eb', fontWeight: 500 }}>{member.responsibility}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#475569' }}>
                    <div>{member.work}</div>
                    <code style={{ fontSize: '0.75rem', color: '#64748b', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                      {member.paths}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
