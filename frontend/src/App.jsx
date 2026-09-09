import { useState, useEffect } from 'react';
import './App.css';

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
    paths: 'src/pages/ (VideoCall, Chat), src/components/ (Video, Chat, Topics)',
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
  const [apiStatus, setApiStatus] = useState('Checking API connection...');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.json())
      .then((data) => setApiStatus(`Connected: ${data.message}`))
      .catch(() => setApiStatus('Backend offline (run "npm run server" on port 5000)'));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '880px', margin: '3rem auto', padding: '0 1.5rem', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.25rem', color: '#0f172a', fontWeight: 700 }}>Global Student Connect</h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>MERN Stack Monorepo • Team Starter Dashboard</p>
        <div style={{ marginTop: '1rem', padding: '0.65rem 1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <strong>API Status:</strong>
          <span style={{ color: apiStatus.includes('Connected') ? '#16a34a' : '#d97706', fontWeight: 600 }}>{apiStatus}</span>
        </div>
      </header>

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
