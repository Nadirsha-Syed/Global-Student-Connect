import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [apiStatus, setApiStatus] = useState('Checking API connection...');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((res) => res.json())
      .then((data) => setApiStatus(`Connected: ${data.message}`))
      .catch(() => setApiStatus('Backend offline (run "npm run server" on port 5000)'));
  }, []);

  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '750px', margin: '3rem auto', padding: '0 1.5rem', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: '#0f172a' }}>Global Student Connect</h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>MERN Stack Monorepo • Clean Team Starter</p>
        <div style={{ marginTop: '1rem', padding: '0.6rem 1rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.875rem' }}>
          <strong>API Status:</strong> <span style={{ color: apiStatus.includes('Connected') ? '#16a34a' : '#d97706', fontWeight: 500 }}>{apiStatus}</span>
        </div>
      </header>

      <section>
        <h2 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.75rem' }}>Streamlined Project Structure</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fafafa' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#334155' }}>📁 <code>src/components/</code></h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Reusable UI widgets (Auth forms, Video player, Student cards, Modals).</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fafafa' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: '#334155' }}>📁 <code>src/pages/</code></h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Full views & routes (Dashboard, VideoRoom, ReflectionForm, Profile).</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
