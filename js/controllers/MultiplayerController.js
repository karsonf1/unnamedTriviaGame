// Multiplayer functionality for the trivia game
const MultiplayerController = (() => {
  let socket = null;
  let currentRoom = null;
  let isHost = false;
  let players = [];

  // Initialize Socket.IO connection
  const initializeSocket = () => {
    socket = io();

    // Room creation success
    socket.on('roomCreated', (data) => {
      currentRoom = data.roomCode;
      isHost = true;
      players = data.players;
      showLobby();
      updatePlayerList();
      showFeedback('Room created successfully!', 'success');
    });

    // Successfully joined a room
    socket.on('joinSuccess', (data) => {
      currentRoom = data.roomCode;
      isHost = false;
      players = data.players;
      showLobby();
      updatePlayerList();
      showFeedback('Joined room successfully!', 'success');
    });

    // Failed to join room
    socket.on('joinError', (data) => {
      showFeedback(data.message, 'error');
    });

    // Another player joined the room
    socket.on('playerJoined', (data) => {
      players = data.players;
      updatePlayerList();
      showFeedback(`${data.player.name} joined the room!`, 'info');
    });

    // A player left the room
    socket.on('playerLeft', (data) => {
      players = data.players;
      updatePlayerList();
      showFeedback('A player left the room.', 'info');
    });

    // Game started
    socket.on('gameStarted', (data) => {
      showFeedback('Game starting...', 'success');
      setTimeout(() => {
        startMultiplayerGame();
      }, 2000);
    });

    // Received a question from host
    socket.on('questionReceived', (data) => {
      if (!isHost) {
        // Display the question for non-host players
        GameController.setCurrentQuestion(data.question);
        View.renderQuestion(data.question);
        View.showScreen('game');
      }
    });

    // Another player submitted an answer
    socket.on('playerAnswered', (data) => {
      showPlayerAnswer(data.playerId, data.playerName, data.answer);
    });
  };

  // Show feedback messages
  const showFeedback = (message, type = 'info') => {
    const feedback = document.getElementById('lobby-feedback');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = `feedback-${type}`;
      
      // Clear after 4 seconds
      setTimeout(() => {
        feedback.textContent = '';
        feedback.className = '';
      }, 4000);
    }
  };

  // Update the player list display
  const updatePlayerList = () => {
    const playerList = document.getElementById('player-list');
    const playerCount = document.getElementById('player-count');
    const startButton = document.getElementById('start-multiplayer-game');

    if (playerList) {
      if (players.length === 0) {
        playerList.innerHTML = `
          <div style="color: #666; font-style: italic; text-align: center; padding: 20px;">
            Waiting for players to join...
          </div>
        `;
      } else {
        playerList.innerHTML = players.map(player => 
          `<div class="player-item ${player.isHost ? 'host' : ''}">
            <span class="player-name">${player.name}</span>
            ${player.isHost ? '<span class="host-badge">👑 Host</span>' : ''}
          </div>`
        ).join('');
      }
    }

    if (playerCount) {
      playerCount.textContent = players.length;
    }

    // Show start button only for host with at least 2 players
    if (startButton) {
      startButton.style.display = (isHost && players.length >= 2) ? 'inline-block' : 'none';
    }
  };

  // Show the lobby screen
  const showLobby = () => {
    const roomCodeDisplay = document.getElementById('room-code-display');
    if (roomCodeDisplay) {
      roomCodeDisplay.textContent = currentRoom;
    }
    View.showScreen('lobby');
  };

  // Create a new room
  const createRoom = () => {
    const hostName = document.getElementById('host-name-input').value.trim();
    if (!hostName) {
      // Add visual feedback to the create room screen
      const hostNameInput = document.getElementById('host-name-input');
      hostNameInput.style.borderColor = '#dc2626';
      hostNameInput.placeholder = 'Please enter your name!';
      setTimeout(() => {
        hostNameInput.style.borderColor = '';
        hostNameInput.placeholder = 'Enter your name';
      }, 3000);
      return;
    }

    if (!socket) {
      initializeSocket();
    }

    socket.emit('createRoom', { playerName: hostName });
  };

  // Join an existing room
  const joinRoom = () => {
    const playerName = document.getElementById('player-name-input').value.trim();
    const roomCode = document.getElementById('room-code-input').value.trim().toUpperCase();

    if (!playerName) {
      const playerNameInput = document.getElementById('player-name-input');
      playerNameInput.style.borderColor = '#dc2626';
      playerNameInput.placeholder = 'Please enter your name!';
      setTimeout(() => {
        playerNameInput.style.borderColor = '';
        playerNameInput.placeholder = 'Enter your name';
      }, 3000);
      return;
    }

    if (!roomCode || roomCode.length !== 6) {
      const roomCodeInput = document.getElementById('room-code-input');
      roomCodeInput.style.borderColor = '#dc2626';
      roomCodeInput.placeholder = 'NEED 6 CHARS!';
      setTimeout(() => {
        roomCodeInput.style.borderColor = '';
        roomCodeInput.placeholder = 'Enter 6-character code';
      }, 3000);
      return;
    }

    if (!socket) {
      initializeSocket();
    }

    socket.emit('joinRoom', { roomCode, playerName });
  };

  // Start the multiplayer game (host only)
  const startGame = () => {
    if (!isHost) return;
    
    socket.emit('startGame', { roomCode: currentRoom });
  };

  // Leave the current room
  const leaveRoom = () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    currentRoom = null;
    isHost = false;
    players = [];
    View.showScreen('home');
  };

  // Start the actual multiplayer game
  const startMultiplayerGame = () => {
    // For host: start the game and sync questions
    if (isHost) {
      // Get a random question and send it to all players
      const question = Model.getRandomQuestion();
      if (question) {
        socket.emit('syncQuestion', { roomCode: currentRoom, question });
        // Start the game for the host too
        GameController.setCurrentQuestion(question);
        GameController.startMultiplayerGame();
      }
    }
    // For non-hosts, the game will start when they receive the question
  };

  // Submit an answer in multiplayer mode
  const submitAnswer = (answer, timeRemaining) => {
    if (socket && currentRoom) {
      socket.emit('submitAnswer', { 
        roomCode: currentRoom, 
        answer, 
        timeRemaining 
      });
    }
  };

  // Show when a player answers
  const showPlayerAnswer = (playerId, playerName, answer) => {
    console.log(`${playerName} answered: ${answer}`);
    // You could show this in the UI if desired
  };

  // Initialize event listeners
  const init = () => {
    // Create room button
    const createRoomBtn = document.getElementById('create-room-btn');
    const createRoomSubmit = document.getElementById('create-room-submit');
    const createRoomBack = document.getElementById('create-room-back');

    // Join room button
    const joinRoomBtn = document.getElementById('join-room-btn');
    const joinRoomSubmit = document.getElementById('join-room-submit');
    const joinRoomBack = document.getElementById('join-room-back');

    // Lobby buttons
    const startMultiplayerGameBtn = document.getElementById('start-multiplayer-game');
    const leaveRoomBtn = document.getElementById('leave-room');

    // Event listeners
    if (createRoomBtn) {
      createRoomBtn.addEventListener('click', () => View.showScreen('create-room'));
    }

    if (createRoomSubmit) {
      createRoomSubmit.addEventListener('click', createRoom);
    }

    if (createRoomBack) {
      createRoomBack.addEventListener('click', () => View.showScreen('home'));
    }

    if (joinRoomBtn) {
      joinRoomBtn.addEventListener('click', () => View.showScreen('join-room'));
    }

    if (joinRoomSubmit) {
      joinRoomSubmit.addEventListener('click', joinRoom);
    }

    if (joinRoomBack) {
      joinRoomBack.addEventListener('click', () => View.showScreen('home'));
    }

    if (startMultiplayerGameBtn) {
      startMultiplayerGameBtn.addEventListener('click', startGame);
    }

    if (leaveRoomBtn) {
      leaveRoomBtn.addEventListener('click', leaveRoom);
    }

    // Handle Enter key for inputs
    const hostNameInput = document.getElementById('host-name-input');
    if (hostNameInput) {
      hostNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') createRoom();
      });
    }

    const playerNameInput = document.getElementById('player-name-input');
    const roomCodeInput = document.getElementById('room-code-input');
    if (playerNameInput && roomCodeInput) {
      playerNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') roomCodeInput.focus();
      });
      roomCodeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinRoom();
      });
    }
  };

  return {
    init,
    submitAnswer,
    isInMultiplayerRoom: () => currentRoom !== null,
    isHost: () => isHost
  };
})();

// Initialize multiplayer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  MultiplayerController.init();
});