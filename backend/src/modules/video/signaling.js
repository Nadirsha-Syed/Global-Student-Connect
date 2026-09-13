import { Server as SocketIOServer } from 'socket.io';

/**
 * Initializes Socket.io WebRTC signaling gateway for Global Student Connect
 * @param {import('http').Server} httpServer
 * @param {string} clientUrl
 * @returns {SocketIOServer}
 */
export function initSignalingServer(httpServer, clientUrl = 'http://localhost:5173') {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: true,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Track active rooms and their participants: Map<roomId, Set<socketId>>
  const roomParticipants = new Map();
  const socketUserMap = new Map();

  io.on('connection', (socket) => {
    console.log(`[Signaling] Client connected: ${socket.id}`);

    // 1. Join a Video Meeting Room
    socket.on('join-room', ({ roomId, user = {} }) => {
      if (!roomId) return;

      socket.join(roomId);
      socketUserMap.set(socket.id, { ...user, socketId: socket.id, roomId });

      if (!roomParticipants.has(roomId)) {
        roomParticipants.set(roomId, new Set());
      }
      const participants = roomParticipants.get(roomId);

      // Check if room is already full (max 2 students for 1-on-1 study)
      if (participants.size >= 2 && !participants.has(socket.id)) {
        socket.emit('room-full', { message: 'This study room is full (max 2 participants).' });
        return;
      }

      participants.add(socket.id);
      console.log(`[Signaling] Socket ${socket.id} joined room ${roomId} (Total: ${participants.size})`);

      // Notify other peers in this room
      socket.to(roomId).emit('user-joined', {
        socketId: socket.id,
        user,
      });

      // Send list of existing peers in room to the newly joined peer
      const otherPeers = Array.from(participants)
        .filter((id) => id !== socket.id)
        .map((id) => socketUserMap.get(id) || { socketId: id });

      socket.emit('room-joined', {
        roomId,
        peers: otherPeers,
      });
    });

    // 2. WebRTC Signaling: SDP Offer
    socket.on('signal:offer', ({ targetSocketId, sdp, callerUser }) => {
      if (targetSocketId) {
        io.to(targetSocketId).emit('signal:offer', {
          callerSocketId: socket.id,
          sdp,
          callerUser: callerUser || socketUserMap.get(socket.id),
        });
      }
    });

    // 3. WebRTC Signaling: SDP Answer
    socket.on('signal:answer', ({ targetSocketId, sdp }) => {
      if (targetSocketId) {
        io.to(targetSocketId).emit('signal:answer', {
          responderSocketId: socket.id,
          sdp,
        });
      }
    });

    // 4. WebRTC Signaling: ICE Candidates
    socket.on('signal:ice-candidate', ({ targetSocketId, candidate }) => {
      if (targetSocketId && candidate) {
        io.to(targetSocketId).emit('signal:ice-candidate', {
          senderSocketId: socket.id,
          candidate,
        });
      }
    });

    // 5. In-Call Real-Time Text Chat
    socket.on('chat:message', ({ roomId, message }) => {
      if (roomId && message) {
        const userInfo = socketUserMap.get(socket.id) || { name: 'Student' };
        io.to(roomId).emit('chat:message', {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          senderId: socket.id,
          senderName: userInfo.name || 'Peer',
          senderCountry: userInfo.country || 'Global',
          text: message,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // 6. Media State Broadcast (Mute/Video toggle notifications)
    socket.on('media:toggle', ({ roomId, isAudioMuted, isVideoOff, isScreenSharing }) => {
      if (roomId) {
        socket.to(roomId).emit('peer:media-toggle', {
          socketId: socket.id,
          isAudioMuted,
          isVideoOff,
          isScreenSharing,
        });
      }
    });

    // 7. Cleanup on Disconnect / Leave
    const handleLeave = () => {
      const userInfo = socketUserMap.get(socket.id);
      if (userInfo && userInfo.roomId) {
        const { roomId } = userInfo;
        const participants = roomParticipants.get(roomId);
        if (participants) {
          participants.delete(socket.id);
          if (participants.size === 0) {
            roomParticipants.delete(roomId);
          }
        }
        socket.to(roomId).emit('user-left', {
          socketId: socket.id,
          userName: userInfo.name || 'Peer',
        });
        console.log(`[Signaling] Socket ${socket.id} left room ${roomId}`);
      }
      socketUserMap.delete(socket.id);
    };

    socket.on('leave-room', handleLeave);
    socket.on('disconnect', handleLeave);
  });

  return io;
}
