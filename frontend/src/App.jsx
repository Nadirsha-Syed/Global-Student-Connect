import { useEffect, useMemo, useState } from 'react';
import './App.css';
import VideoCallPage from './pages/VideoCallPage';
import ReflectionPage from './pages/ReflectionPage';
import ReflectionSuccessPage from './pages/ReflectionSuccessPage';

function DashboardView({ onNavigate }) {
  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">G</div>
          <div>
            <span className="brand-label">Global Student Connect</span>
            <small>Student Match</small>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          <span className="nav-link active">Dashboard</span>
          <span className="nav-link">Matches</span>
          <span className="nav-link">Messages</span>
        </nav>

        <div className="profile-pill">
          <span className="profile-avatar">Y</span>
          <span>Yasmin</span>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="welcome-panel">
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>Find your next meaningful conversation.</h1>
          </div>
          <button type="button" className="primary-button" onClick={() => onNavigate('video-call')}>
            Start a Call
          </button>
        </section>

        <div className="dashboard-grid">
          <article className="feature-card highlighted">
            <div className="card-header">
              <p className="eyebrow">Upcoming Match</p>
              <span className="status-badge">Confirmed</span>
            </div>

            <div className="match-profile">
              <div className="match-avatar">AR</div>
              <div>
                <h2>Aisha Rahman</h2>
                <p>Bangladesh • Economics student</p>
              </div>
            </div>

            <ul className="match-details">
              <li>Topic: Culture & Traditions</li>
              <li>Time: Today, 6:30 PM</li>
              <li>Language: English</li>
            </ul>

            <button type="button" className="secondary-button" onClick={() => onNavigate('video-call')}>
              Join Meeting
            </button>
          </article>

          <article className="feature-card overview-card">
            <div className="card-header">
              <p className="eyebrow">Connection goals</p>
            </div>

            <div className="goal-row">
              <span className="goal-circle blue">92%</span>
              <div>
                <strong>Shared interests</strong>
                <p>Art, festivals, and student life</p>
              </div>
            </div>

            <div className="goal-row">
              <span className="goal-circle green">4.9</span>
              <div>
                <strong>Conversation quality</strong>
                <p>High engagement from both students</p>
              </div>
            </div>
          </article>

          <article className="feature-card conversation-card">
            <div className="card-header">
              <p className="eyebrow">Suggested prompt</p>
            </div>
            <h3>Share a festival from your country.</h3>
            <p>
              Explore customs, traditions, and what makes your culture uniquely memorable.
            </p>
          </article>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(() => {
    if (typeof window === 'undefined') return 'dashboard';
    const hashRoute = window.location.hash.replace('#', '');
    return hashRoute || 'dashboard';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const nextRoute = window.location.hash.replace('#', '') || 'dashboard';
      setRoute(nextRoute);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeRoute = (nextRoute) => {
    const safeRoute = nextRoute || 'dashboard';
    setRoute(safeRoute);
    if (safeRoute === 'dashboard') {
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    window.location.hash = safeRoute;
  };

  const currentPage = useMemo(() => {
    switch (route) {
      case 'video-call':
        return <VideoCallPage onNavigate={changeRoute} />;
      case 'reflection':
        return <ReflectionPage onNavigate={changeRoute} />;
      case 'reflection-success':
        return <ReflectionSuccessPage onNavigate={changeRoute} />;
      default:
        return <DashboardView onNavigate={changeRoute} />;
    }
  }, [route]);

  return <div className="app-shell">{currentPage}</div>;
}

export default App;
