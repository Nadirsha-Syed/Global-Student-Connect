import { useEffect, useMemo, useState } from 'react';

const TOPICS = [
  {
    id: 'culture',
    title: 'Culture & Traditions',
    icon: '🌍',
    prompt: 'Share a festival from your country.',
    description: 'Celebrate heritage and everyday traditions.',
  },
  {
    id: 'education',
    title: 'Education',
    icon: '🎓',
    prompt: "What's student life like in your country?",
    description: 'Talk about classes, routines, and campus life.',
  },
  {
    id: 'hobbies',
    title: 'Hobbies',
    icon: '🎨',
    prompt: 'Talk about your favorite hobby.',
    description: 'Discover shared interests and creative habits.',
  },
  {
    id: 'environment',
    title: 'Environment',
    icon: '🌱',
    prompt: 'Discuss climate in your country.',
    description: 'Compare weather, seasons, and local life.',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'other',
    author: 'Aisha Rahman',
    text: 'Hi! I loved hearing about your city. What is a typical weekend like for you?',
    time: '09:41',
  },
  {
    id: 2,
    sender: 'me',
    author: 'You',
    text: 'I usually spend Saturdays exploring local cafés and meeting friends. How about you?',
    time: '09:42',
  },
  {
    id: 3,
    sender: 'other',
    author: 'Aisha Rahman',
    text: 'That sounds lovely. We often celebrate with family and traditional food during festivals.',
    time: '09:43',
  },
];

function IconButton({ label, active, className = '', children, onClick }) {
  return (
    <button
      type="button"
      className={`icon-button ${active ? 'is-active' : ''} ${className}`.trim()}
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default function VideoCallPage({ onNavigate }) {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState(TOPICS[0].id);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(13 * 60 + 45);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const selectedTopic = useMemo(
    () => TOPICS.find((topic) => topic.id === selectedTopicId) || TOPICS[0],
    [selectedTopicId],
  );

  const formatDuration = (value) => {
    const minutes = Math.floor(value / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleSendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      author: 'You',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((current) => [...current, newMessage]);
    setDraft('');
  };

  return (
    <section className="video-call-page">
      <div className="meeting-layout">
        <aside className={`topic-panel ${isTopicsOpen ? 'is-open' : 'is-collapsed'}`}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Conversation</p>
              <h2>Topics</h2>
            </div>
            <button
              type="button"
              className="ghost-button small"
              onClick={() => setIsTopicsOpen((current) => !current)}
            >
              {isTopicsOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="topic-list">
            {TOPICS.map((topic) => (
              <button
                key={topic.id}
                type="button"
                className={`topic-card ${selectedTopicId === topic.id ? 'selected' : ''}`}
                onClick={() => setSelectedTopicId(topic.id)}
              >
                <span className="topic-icon" aria-hidden="true">{topic.icon}</span>
                <span className="topic-content">
                  <strong>{topic.title}</strong>
                  <small>{topic.description}</small>
                </span>
              </button>
            ))}
          </div>

          <div className="prompt-box">
            <p className="prompt-label">Current question</p>
            <h3>{selectedTopic.prompt}</h3>
          </div>
        </aside>

        <main className="meeting-stage">
          <div className="meeting-header">
            <div className="participant-meta">
              <div className="status-dot" />
              <span>Scheduled Match</span>
            </div>
            <div className="meeting-meta">
              <span className="duration-pill">{formatDuration(elapsedSeconds)}</span>
            </div>
          </div>

          <div className="main-video-card">
            <div className="video-badges">
              <span className="badge">Live</span>
              <span className="badge soft">Student Match</span>
            </div>

            <div className="video-overlay">
              <div>
                <p className="eyebrow white">Matching with</p>
                <h1>Aisha Rahman</h1>
              </div>
              <div className="profile-chips">
                <span>Bangladesh</span>
                <span>Economics</span>
              </div>
            </div>

            <div className="self-video-preview">
              <div className="mini-avatar">Y</div>
              <span>You</span>
            </div>
          </div>

          <div className="call-controls">
            <IconButton label="Toggle microphone" active={isMicOn} onClick={() => setIsMicOn((current) => !current)}>
              {isMicOn ? '🎙️' : '🔇'}
            </IconButton>
            <IconButton label="Toggle camera" active={isCameraOn} onClick={() => setIsCameraOn((current) => !current)}>
              {isCameraOn ? '📹' : '🚫'}
            </IconButton>
            <IconButton label="Open chat" active={isChatOpen} onClick={() => setIsChatOpen((current) => !current)}>
              💬
            </IconButton>
            <IconButton label="Share screen" onClick={() => {}}>
              🖥️
            </IconButton>
            <IconButton label="More options" onClick={() => {}}>
              ⋯
            </IconButton>
            <button type="button" className="end-call-button" onClick={() => onNavigate('reflection')}>
              ✕
            </button>
          </div>
        </main>

        <aside className={`chat-panel ${isChatOpen ? 'is-open' : 'is-collapsed'}`}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">Conversation</p>
              <h2>Chat</h2>
            </div>
            <button
              type="button"
              className="ghost-button small"
              onClick={() => setIsChatOpen((current) => !current)}
            >
              {isChatOpen ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="chat-user-card">
            <div className="chat-avatar">AR</div>
            <div>
              <strong>Aisha Rahman</strong>
              <small>Bangladesh • Student</small>
            </div>
          </div>

          <div className="chat-thread">
            {messages.length === 0 ? (
              <div className="empty-chat">No messages yet. Start the conversation.</div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`chat-message ${message.sender === 'me' ? 'mine' : 'theirs'}`}>
                  <div className="message-header">
                    <span>{message.author}</span>
                    <small>{message.time}</small>
                  </div>
                  <p>{message.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="chat-composer">
            <input
              type="text"
              value={draft}
              placeholder="Type a message…"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <button type="button" onClick={handleSendMessage}>Send</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
