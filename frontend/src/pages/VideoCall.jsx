import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './VideoCall.css';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

const BACKEND_URL = typeof window !== 'undefined'
  ? `http://${window.location.hostname || 'localhost'}:5000`
  : 'http://localhost:5000';

/**
 * Creates an animated 30fps canvas stream with user avatar and pulse waves.
 * This guarantees active WebRTC video frames when testing multi-tab on a single PC or when camera is disabled.
 */
function createAvatarStream(user) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');

  let hue = user.name ? (user.name.charCodeAt(0) * 35) % 360 : 210;
  let angle = 0;

  function draw() {
    angle += 0.04;
    // Gradient Background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, `hsl(${hue}, 45%, 14%)`);
    grad.addColorStop(1, `hsl(${(hue + 45) % 360}, 55%, 20%)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animated soundwave rings
    ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${0.4 + 0.3 * Math.sin(angle)})`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(320, 200, 85 + 12 * Math.sin(angle), 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `hsla(${hue + 35}, 85%, 65%, ${0.3 + 0.2 * Math.cos(angle)})`;
    ctx.beginPath();
    ctx.arc(320, 200, 110 + 15 * Math.cos(angle), 0, Math.PI * 2);
    ctx.stroke();

    // Central Avatar Circle
    ctx.fillStyle = `hsl(${hue}, 70%, 45%)`;
    ctx.beginPath();
    ctx.arc(320, 200, 72, 0, Math.PI * 2);
    ctx.fill();

    // Initials
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const initial = (user.name || 'S').slice(0, 2).toUpperCase();
    ctx.fillText(initial, 320, 200);

    // Name & Country label
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(user.name || 'Student', 320, 320);

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`📍 ${user.country || 'Global'} • Live Stream`, 320, 355);

    requestAnimationFrame(draw);
  }

  draw();

  const stream = canvas.captureStream(30);

  // Add silent audio track so WebRTC media negotiation has active audio transceiver
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const dst = audioCtx.createMediaStreamDestination();
    const gain = audioCtx.createGain();
    gain.gain.value = 0.001;
    osc.connect(gain);
    gain.connect(dst);
    osc.start();
    const audioTrack = dst.stream.getAudioTracks()[0];
    if (audioTrack) {
      stream.addTrack(audioTrack);
    }
  } catch (e) {
    console.warn('AudioContext fallback note:', e);
  }

  return stream;
}

export default function VideoCall({
  roomId = 'demo-study-room-101',
  currentUser = { name: 'Alice', country: 'Germany', interests: ['React', 'AI'], languages: ['German', 'English'] },
  peerUser = { name: 'Kenji', country: 'Japan', interests: ['React', 'System Design'], languages: ['Japanese', 'English'] },
  sessionTopic = 'React Performance & State Management',
  onLeave,
}) {
  const [connectionStatus, setConnectionStatus] = useState('waiting'); // 'waiting' | 'connecting' | 'connected'
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'chat'
  const [activePeer, setActivePeer] = useState(peerUser);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [needsUserPlay, setNeedsUserPlay] = useState(false);

  // Media States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  // AI Co-Pilot State
  const [aiData, setAiData] = useState(null);
  const [icebreakers, setIcebreakers] = useState([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const screenTrackRef = useRef(null);
  const targetPeerSocketId = useRef(null);
  const iceCandidateQueue = useRef([]);
  const incomingStreamRef = useRef(new MediaStream());

  // 1. Fetch AI Co-Pilot Data
  const fetchAiCoPilot = async (peer = activePeer) => {
    setIsLoadingAi(true);
    try {
      const [topicsRes, icebreakersRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/ai/topics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userA: currentUser, userB: peer, topic: sessionTopic }),
        }).then((r) => r.json()),
        fetch(`${BACKEND_URL}/api/ai/icebreakers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userA: currentUser, userB: peer }),
        }).then((r) => r.json()),
      ]);

      if (topicsRes?.success) setAiData(topicsRes.data);
      if (icebreakersRes?.success) setIcebreakers(icebreakersRes.data.icebreakers || []);
    } catch (err) {
      console.warn('AI Co-Pilot fetch note:', err.message);
    } finally {
      setIsLoadingAi(false);
    }
  };

  useEffect(() => {
    fetchAiCoPilot(activePeer);
  }, [sessionTopic, activePeer.name]);

  // Helper: Buffered ICE Candidate Adder
  const addCandidateOrQueue = async (pc, candidate) => {
    if (pc && pc.remoteDescription && pc.remoteDescription.type) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn('addIceCandidate note:', e);
      }
    } else {
      iceCandidateQueue.current.push(candidate);
    }
  };

  const flushIceCandidates = async (pc) => {
    while (iceCandidateQueue.current.length > 0) {
      const candidate = iceCandidateQueue.current.shift();
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn('Flushed candidate note:', e);
      }
    }
  };

  // Helper: Get or create local stream synchronously/fallback
  function ensureLocalStream() {
    if (localStreamRef.current) return localStreamRef.current;
    const fallback = createAvatarStream(currentUser);
    localStreamRef.current = fallback;
    setLocalStream(fallback);
    return fallback;
  }

  // Helper: Create & Setup RTCPeerConnection
  function createPeerConnection(targetSocketId, socket) {
    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.close();
      } catch (e) {}
    }

    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;
    incomingStreamRef.current = new MediaStream();

    // Add local tracks to peer connection
    const currentStream = ensureLocalStream();
    currentStream.getTracks().forEach((track) => {
      track.enabled = true;
      pc.addTrack(track, currentStream);
    });

    // Handle remote track arrival
    pc.ontrack = (event) => {
      console.log('[WebRTC] Track received:', event.track.kind, event.streams);
      
      let mediaStreamToUse;
      if (event.streams && event.streams[0]) {
        mediaStreamToUse = event.streams[0];
      } else {
        incomingStreamRef.current.addTrack(event.track);
        mediaStreamToUse = incomingStreamRef.current;
      }

      setRemoteStream(mediaStreamToUse);
      setConnectionStatus('connected');
    };

    // Forward ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && targetSocketId) {
        socket.emit('signal:ice-candidate', {
          targetSocketId,
          candidate: event.candidate,
        });
      }
    };

    // Connection state listeners
    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection State:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('waiting');
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE Connection State:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        setConnectionStatus('connected');
      }
    };

    return pc;
  }

  // Bind local stream to local preview
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [localStream]);

  // Bind remote stream to remote video element
  useEffect(() => {
    const videoEl = remoteVideoRef.current;
    if (videoEl && remoteStream) {
      videoEl.srcObject = remoteStream;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setNeedsUserPlay(false);
          })
          .catch((err) => {
            console.warn('Autoplay blocked by browser:', err);
            setNeedsUserPlay(true);
          });
      }
    }
  }, [remoteStream]);

  // 2. Initialize Media & WebRTC Signaling
  useEffect(() => {
    let isMounted = true;

    async function initCall() {
      // Step 1: GUARANTEE Local Stream is fully ready BEFORE connecting to signaling socket!
      let stream;
      if (typeof navigator !== 'undefined' && navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            audio: true,
          });
        } catch (mediaErr) {
          console.warn('Camera in use or denied, using animated live avatar stream:', mediaErr);
          stream = createAvatarStream(currentUser);
        }
      } else {
        console.warn('getUserMedia not available in current context, using animated avatar stream');
        stream = createAvatarStream(currentUser);
      }

      if (!isMounted) return;

      localStreamRef.current = stream;
      setLocalStream(stream);

      // Step 2: Now connect to Socket.io signaling server
      const socket = io(BACKEND_URL, { transports: ['websocket', 'polling'] });
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[WebRTC] Connected to signaling with ID:', socket.id);
        socket.emit('join-room', { roomId, user: currentUser });
      });

      // Peer Joined (We are the Caller / Initiator)
      socket.on('user-joined', async ({ socketId, user }) => {
        console.log('[WebRTC] Peer joined room:', socketId, user);
        targetPeerSocketId.current = socketId;
        if (user && user.name) {
          setActivePeer(user);
        }
        setConnectionStatus('connecting');

        const pc = createPeerConnection(socketId, socket);

        // Create Offer with explicit audio/video expectations
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        });
        await pc.setLocalDescription(offer);

        socket.emit('signal:offer', {
          targetSocketId: socketId,
          sdp: offer,
          callerUser: currentUser,
        });
      });

      // Room Joined (When we enter an existing room)
      socket.on('room-joined', async ({ peers }) => {
        if (peers && peers.length > 0) {
          const peer = peers[0];
          targetPeerSocketId.current = peer.socketId;
          if (peer.name) {
            setActivePeer(peer);
          }
          setConnectionStatus('connecting');
        }
      });

      // Receive Offer (We are the Callee / Responder)
      socket.on('signal:offer', async ({ callerSocketId, sdp, callerUser }) => {
        console.log('[WebRTC] Received offer from caller:', callerSocketId);
        targetPeerSocketId.current = callerSocketId;
        if (callerUser && callerUser.name) {
          setActivePeer(callerUser);
        }
        setConnectionStatus('connecting');

        const pc = createPeerConnection(callerSocketId, socket);

        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        await flushIceCandidates(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('signal:answer', {
          targetSocketId: callerSocketId,
          sdp: answer,
        });
      });

      // Receive Answer
      socket.on('signal:answer', async ({ responderSocketId, sdp }) => {
        console.log('[WebRTC] Received answer from:', responderSocketId);
        if (peerConnectionRef.current) {
          await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
          await flushIceCandidates(peerConnectionRef.current);
        }
      });

      // Receive ICE Candidate
      socket.on('signal:ice-candidate', async ({ senderSocketId, candidate }) => {
        if (candidate) {
          await addCandidateOrQueue(peerConnectionRef.current, candidate);
        }
      });

      // Chat Message
      socket.on('chat:message', (msg) => {
        if (isMounted) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      // Peer Left
      socket.on('user-left', () => {
        setConnectionStatus('waiting');
        setRemoteStream(null);
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }
        iceCandidateQueue.current = [];
      });
    }

    initCall();

    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      iceCandidateQueue.current = [];
    };
  }, [roomId]);

  // Handle explicit user gesture play unlock
  const handleUserPlayClick = (e) => {
    if (e) e.stopPropagation();
    const videoEl = remoteVideoRef.current;
    if (videoEl) {
      videoEl
        .play()
        .then(() => setNeedsUserPlay(false))
        .catch((err) => {
          console.warn('Direct unmuted play blocked, trying with muted unlock:', err);
          videoEl.muted = true;
          videoEl.play().then(() => {
            setNeedsUserPlay(false);
            setTimeout(() => { videoEl.muted = false; }, 300);
          });
        });
    }
  };

  // Media Controls
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !t.enabled));
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !t.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        if (peerConnectionRef.current) {
          const sender = peerConnectionRef.current.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        }

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          stopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (err) {
        console.warn('Screen share cancelled or failed:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }
    const originalVideoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (peerConnectionRef.current && originalVideoTrack) {
      const sender = peerConnectionRef.current.getSenders().find((s) => s.track && s.track.kind === 'video');
      if (sender) {
        sender.replaceTrack(originalVideoTrack);
      }
    }
    if (localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
    setIsScreenSharing(false);
  };

  // Chat Submission
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socketRef.current) return;

    socketRef.current.emit('chat:message', {
      roomId,
      message: chatInput.trim(),
    });
    setChatInput('');
  };

  return (
    <div className="videocall-container">
      {/* 1. Main Video Stage */}
      <div className="video-stage">
        <header className="video-header">
          <div className="room-meta">
            <h2>🌍 {sessionTopic}</h2>
            <p>Room ID: <code>{roomId}</code> • 1-on-1 Study Session</p>
          </div>
          <div>
            {(connectionStatus === 'connected' || remoteStream) && (
              <span className="status-badge status-connected">● Connected Live</span>
            )}
            {connectionStatus === 'waiting' && !remoteStream && (
              <span className="status-badge status-waiting">
                <span className="pulse-dot"></span> Waiting for {activePeer.name}...
              </span>
            )}
            {connectionStatus === 'connecting' && !remoteStream && (
              <span className="status-badge status-connecting">⚡ Connecting WebRTC...</span>
            )}
          </div>
        </header>

        {/* Video Grid */}
        <div className="video-grid">
          {/* Remote Peer Video */}
          <div className="video-card">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="video-element"
              style={{
                display: (connectionStatus === 'connected' || remoteStream) ? 'block' : 'none',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />

            {(connectionStatus === 'connected' || remoteStream) && (
              <div className="user-tag">{activePeer.name} ({activePeer.country})</div>
            )}

            {/* Tap to play overlay for browsers that block audio autoplay */}
            {needsUserPlay && (
              <button
                onClick={handleUserPlayClick}
                style={{
                  position: 'absolute',
                  zIndex: 20,
                  padding: '0.85rem 1.75rem',
                  background: 'rgba(37, 99, 235, 0.95)',
                  color: '#ffffff',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                }}
              >
                ▶️ Tap to Unlock Video & Audio
              </button>
            )}

            {!remoteStream && connectionStatus !== 'connected' && (
              <div className="waiting-overlay">
                <div style={{ fontSize: '2.8rem' }}>🎓</div>
                <h3 style={{ margin: '0.25rem 0' }}>Waiting for {activePeer.name}</h3>
                <p style={{ maxWidth: '320px', fontSize: '0.85rem', color: '#94a3b8' }}>
                  Make sure the second device joined room <code>{roomId}</code> as <strong>{activePeer.name}</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Local User Preview */}
          <div className="local-preview">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="video-element"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="user-tag">You ({currentUser.name} - {currentUser.country})</div>
          </div>
        </div>

        {/* Media Controls Bar */}
        <div className="controls-bar">
          <button
            onClick={toggleAudio}
            className={`control-btn ${isAudioMuted ? 'btn-danger' : 'btn-secondary'}`}
          >
            {isAudioMuted ? '🔇 Unmute' : '🎤 Mute'}
          </button>

          <button
            onClick={toggleVideo}
            className={`control-btn ${isVideoOff ? 'btn-danger' : 'btn-secondary'}`}
          >
            {isVideoOff ? '🚫 Start Video' : '📹 Stop Video'}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`control-btn ${isScreenSharing ? 'btn-active' : 'btn-secondary'}`}
          >
            {isScreenSharing ? '🖥️ Stop Share' : '🖥️ Share Screen'}
          </button>

          <button
            onClick={onLeave || (() => window.location.reload())}
            className="control-btn btn-danger"
            style={{ marginLeft: 'auto' }}
          >
            🔴 End Meeting
          </button>
        </div>
      </div>

      {/* 2. In-Call Sidebar */}
      <div className="call-sidebar">
        <div className="sidebar-tabs">
          <button
            className={`tab-btn ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            🤖 AI Study Co-Pilot
          </button>
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 In-Call Chat ({messages.length})
          </button>
        </div>

        {/* Tab 1: AI Co-Pilot */}
        {activeTab === 'ai' && (
          <div className="tab-content">
            {isLoadingAi ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>
                Generating tailored study guide for {currentUser.name} & {activePeer.name}...
              </p>
            ) : (
              <>
                {/* Cross Cultural Icebreakers */}
                <div className="ai-card">
                  <div className="ai-card-title">🧊 Cross-Cultural Icebreakers</div>
                  <ul className="ai-list">
                    {icebreakers.map((ib, i) => (
                      <li key={i}>{ib}</li>
                    ))}
                  </ul>
                </div>

                {/* Tailored Questions */}
                {aiData?.discussionQuestions && (
                  <div className="ai-card">
                    <div className="ai-card-title">💡 Discussion Questions</div>
                    <ul className="ai-list">
                      {aiData.discussionQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cross Cultural Angle */}
                {aiData?.crossCulturalAngle && (
                  <div className="ai-card" style={{ borderColor: 'rgba(234, 179, 8, 0.4)' }}>
                    <div className="ai-card-title" style={{ color: '#facc15' }}>
                      🌐 Cross-Cultural Angle
                    </div>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#fef08a' }}>
                      {aiData.crossCulturalAngle}
                    </p>
                  </div>
                )}

                {/* Suggested Agenda */}
                {aiData?.suggestedAgenda && (
                  <div className="ai-card">
                    <div className="ai-card-title">⏱️ Suggested Agenda</div>
                    {aiData.suggestedAgenda.map((step, idx) => (
                      <div key={idx} className="agenda-step">
                        <span className="agenda-time">{step.durationMinutes}m</span>
                        <div>
                          <strong style={{ display: 'block', color: '#f8fafc' }}>{step.phase}</strong>
                          <span style={{ color: '#94a3b8' }}>{step.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={() => fetchAiCoPilot(activePeer)} className="refresh-ai-btn">
                  🔄 Regenerate AI Prompts
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Live Chat */}
        {activeTab === 'chat' && (
          <div className="tab-content">
            <div className="chat-messages">
              {messages.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem' }}>
                  No messages yet. Say hi to {activePeer.name}!
                </p>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === socketRef.current?.id;
                  return (
                    <div key={msg.id} className={`chat-bubble ${isMe ? 'mine' : 'peer'}`}>
                      <div className="chat-sender">{msg.senderName} ({msg.senderCountry})</div>
                      <div>{msg.text}</div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSendMessage} className="chat-input-form">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="chat-input"
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
