const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname)));

// Store active rooms
const rooms = new Map();

// Generate a 6-character room code like Kahoot
function generateRoomCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Serve your main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Create a new room
  socket.on('createRoom', (data) => {
    const roomCode = generateRoomCode();
    const playerName = data.playerName || 'Host';
    
    // Create new room
    rooms.set(roomCode, {
      host: socket.id,
      hostName: playerName,
      players: [{
        id: socket.id,
        name: playerName,
        score: 0,
        isHost: true
      }],
      gameState: 'lobby', // lobby, playing, finished
      currentQuestion: null,
      questionStartTime: null
    });

    socket.join(roomCode);
    socket.roomCode = roomCode;
    
    console.log(`Room created: ${roomCode} by ${playerName}`);
    
    socket.emit('roomCreated', {
      roomCode: roomCode,
      isHost: true,
      players: rooms.get(roomCode).players
    });
  });

  // Join an existing room
  socket.on('joinRoom', (data) => {
    const { roomCode, playerName } = data;
    const room = rooms.get(roomCode);
    
    if (!room) {
      socket.emit('joinError', { message: 'Room not found!' });
      return;
    }

    if (room.gameState === 'playing') {
      socket.emit('joinError', { message: 'Game already in progress!' });
      return;
    }

    // Add player to room
    const newPlayer = {
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      score: 0,
      isHost: false
    };

    room.players.push(newPlayer);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    console.log(`${newPlayer.name} joined room ${roomCode}`);

    // Notify all players in the room
    io.to(roomCode).emit('playerJoined', {
      player: newPlayer,
      players: room.players,
      roomCode: roomCode
    });

    // Send join confirmation to the new player
    socket.emit('joinSuccess', {
      roomCode: roomCode,
      isHost: false,
      players: room.players
    });
  });

  // Start the game (host only)
  socket.on('startGame', (data) => {
    const { roomCode } = data;
    const room = rooms.get(roomCode);
    
    if (!room || room.host !== socket.id) {
      socket.emit('error', { message: 'Only the host can start the game!' });
      return;
    }

    room.gameState = 'playing';
    console.log(`Game started in room ${roomCode}`);
    
    // Notify all players that the game is starting
    io.to(roomCode).emit('gameStarted', {
      message: 'Game is starting!',
      players: room.players
    });
  });

  // Handle player answers
  socket.on('submitAnswer', (data) => {
    const { roomCode, answer, timeRemaining } = data;
    const room = rooms.get(roomCode);
    
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    console.log(`${player.name} answered: ${answer}`);

    // Broadcast the answer to all players in the room
    io.to(roomCode).emit('playerAnswered', {
      playerId: socket.id,
      playerName: player.name,
      answer: answer,
      timeRemaining: timeRemaining
    });
  });

  // Sync questions between players
  socket.on('syncQuestion', (data) => {
    const { roomCode, question } = data;
    const room = rooms.get(roomCode);
    
    if (!room || room.host !== socket.id) return;

    room.currentQuestion = question;
    room.questionStartTime = Date.now();

    // Send question to all players except the host
    socket.to(roomCode).emit('questionReceived', {
      question: question,
      startTime: room.questionStartTime
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    
    // Remove player from room
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        room.players = room.players.filter(p => p.id !== socket.id);
        
        // If the host left, assign new host or close room
        if (room.host === socket.id) {
          if (room.players.length > 0) {
            room.host = room.players[0].id;
            room.players[0].isHost = true;
            console.log(`New host assigned in room ${socket.roomCode}`);
          } else {
            rooms.delete(socket.roomCode);
            console.log(`Room ${socket.roomCode} deleted - no players left`);
            return;
          }
        }

        // Notify remaining players
        io.to(socket.roomCode).emit('playerLeft', {
          players: room.players
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Trivia server running on http://localhost:${PORT}`);
  console.log(`📱 Open your browser and go to http://localhost:${PORT}`);
});