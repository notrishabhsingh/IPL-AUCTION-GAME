const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { getRandomPlayers } = require('./lib/players');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isOverseasPlayer(player) {
  return player.country && player.country.toLowerCase() !== 'india';
}

function getOverseasCount(team, allPlayers) {
  return team.squad.filter(playerId => {
    const player = allPlayers.find(p => p.id === playerId);
    return player && isOverseasPlayer(player);
  }).length;
}

function canTeamBuyPlayer(team, player, allPlayers) {
  const currentSquadSize = team.squad.length;
  if (currentSquadSize >= 25) {
    return { canBuy: false, reason: 'Maximum 25 players allowed per team' };
  }

  if (isOverseasPlayer(player)) {
    const overseasCount = getOverseasCount(team, allPlayers);
    if (overseasCount >= 8) {
      return { canBuy: false, reason: 'Maximum 8 overseas players allowed per team' };
    }
  }

  return { canBuy: true, reason: null };
}

function getBidIncrement(currentAmount) {
  if (currentAmount >= 20) {
    return 0.5;
  } else if (currentAmount >= 5) {
    return 0.25;
  }
  return 0.2;
}

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('create-room', ({ lobbyName, teamName }, callback) => {
      const roomCode = generateRoomCode();
      const room = {
        code: roomCode,
        lobbyName,
        hostId: socket.id,
        teams: [{
          id: socket.id,
          name: teamName,
          purse: 120,
          squad: [],
          isActive: true,
        }],
        shuffledPlayers: [],
        currentPlayerIndex: 0,
        currentBid: {
          amount: 0,
          bidderId: null,
          bidderName: null,
          timestamp: null,
        },
        timerStart: null,
        timerDuration: 45,
        status: 'waiting',
        bidHistory: [],
        soldPlayers: [],
        isPaused: false,
      };
      rooms.set(roomCode, room);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      console.log(`Room created: ${roomCode}`);
      callback({ success: true, roomCode, room });
    });

    socket.on('join-room', ({ roomCode, teamName }, callback) => {
      const room = rooms.get(roomCode);
      if (!room) {
        callback({ success: false, error: 'Room not found' });
        return;
      }
      if (room.teams.length >= 8) {
        callback({ success: false, error: 'Room is full' });
        return;
      }
      if (room.status !== 'waiting') {
        callback({ success: false, error: 'Auction already started' });
        return;
      }

      const team = {
        id: socket.id,
        name: teamName,
        purse: 120,
        squad: [],
        isActive: true,
      };
      room.teams.push(team);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      console.log(`Team joined: ${teamName} in room ${roomCode}`);

      io.to(roomCode).emit('room-updated', room);
      callback({ success: true, room });
    });

    socket.on('start-auction', ({ playerCount }, callback) => {
      const room = rooms.get(socket.roomCode);
      if (!room) {
        callback({ success: false, error: 'Room not found' });
        return;
      }
      if (room.hostId !== socket.id) {
        callback({ success: false, error: 'Only host can start' });
        return;
      }

      room.shuffledPlayers = getRandomPlayers(playerCount || 200);
      room.status = 'auctioning';
      room.currentPlayerIndex = 0;
      room.currentBid = {
        amount: room.shuffledPlayers[0].basePrice,
        bidderId: null,
        bidderName: null,
        timestamp: null,
      };
      room.timerStart = Date.now();
      room.timerDuration = 10;

      io.to(socket.roomCode).emit('auction-started', {
        players: room.shuffledPlayers,
        currentPlayer: room.shuffledPlayers[0],
        currentBid: room.currentBid,
        timerDuration: room.timerDuration,
        bidHistory: room.bidHistory,
      });
      callback({ success: true });
    });

    socket.on('place-bid', ({ amount }, callback) => {
      const room = rooms.get(socket.roomCode);
      if (!room || room.status !== 'auctioning') {
        callback({ success: false, error: 'Auction not active' });
        return;
      }

      if (room.isPaused) {
        callback({ success: false, error: 'Auction is paused' });
        return;
      }

      const currentPlayer = room.shuffledPlayers[room.currentPlayerIndex];
      const team = room.teams.find(t => t.id === socket.id);
      if (!team) {
        callback({ success: false, error: 'Team not found' });
        return;
      }

      // Prevent same team from bidding twice in a row
      if (room.currentBid.bidderId === socket.id) {
        callback({ success: false, error: 'You already have the highest bid. Wait for another team to bid.' });
        return;
      }

      // Check team player limit (25 max)
      if (team.squad.length >= 25) {
        callback({ success: false, error: 'Maximum 25 players allowed per team' });
        return;
      }

      // Check overseas player limit (8 max) for overseas players
      if (isOverseasPlayer(currentPlayer)) {
        const overseasCount = getOverseasCount(team, room.shuffledPlayers);
        if (overseasCount >= 8) {
          callback({ success: false, error: 'Maximum 8 overseas players allowed per team' });
          return;
        }
      }

      const minBid = room.currentBid.amount === 0
        ? currentPlayer.basePrice
        : room.currentBid.amount + getBidIncrement(room.currentBid.amount);

      if (amount < minBid) {
        callback({ success: false, error: `Minimum bid is ${minBid} crore` });
        return;
      }

      if (amount > team.purse) {
        callback({ success: false, error: 'Insufficient funds' });
        return;
      }

      room.currentBid = {
        amount,
        bidderId: socket.id,
        bidderName: team.name,
        timestamp: Date.now(),
      };
      room.timerStart = Date.now();
      room.timerDuration = 10;

      room.bidHistory.unshift({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        teamName: team.name,
        amount,
        timestamp: Date.now(),
      });

      io.to(socket.roomCode).emit('bid-placed', {
        amount,
        bidderId: socket.id,
        bidderName: team.name,
        currentBid: room.currentBid,
        timerDuration: room.timerDuration,
        bidHistory: room.bidHistory,
      });
      callback({ success: true });
    });

    socket.on('pass', ({ roomCode }, callback) => {
      const room = rooms.get(roomCode || socket.roomCode);
      if (!room || room.status !== 'auctioning') {
        callback?.({ success: false, error: 'Auction not active' });
        return;
      }

      const team = room.teams.find(t => t.id === socket.id);
      if (!team) {
        callback?.({ success: false, error: 'Team not found' });
        return;
      }

      team.isActive = false;
      io.to(socket.roomCode).emit('team-passed', { teamId: socket.id });
      callback?.({ success: true });
    });

    socket.on('sell-player', ({ roomCode }, callback) => {
      const room = rooms.get(roomCode || socket.roomCode);
      if (!room || room.status !== 'auctioning') {
        callback?.({ success: false, error: 'Auction not active' });
        return;
      }

      const currentPlayer = room.shuffledPlayers[room.currentPlayerIndex];
      const winningBid = room.currentBid;

      if (winningBid.bidderId) {
        const winningTeam = room.teams.find(t => t.id === winningBid.bidderId);
        if (winningTeam) {
          winningTeam.purse -= winningBid.amount;
          winningTeam.squad.push(currentPlayer.id);
          room.soldPlayers.push({
            ...currentPlayer,
            soldTo: winningTeam.name,
            soldFor: winningBid.amount,
          });
        }
      } else {
        room.soldPlayers.push({
          ...currentPlayer,
          soldTo: null,
          soldFor: 0,
        });
      }

      room.currentPlayerIndex++;
      if (room.currentPlayerIndex >= room.shuffledPlayers.length) {
        room.status = 'finished';
        io.to(socket.roomCode).emit('auction-ended', {
          teams: room.teams,
          soldPlayers: room.soldPlayers,
        });
        callback?.({ success: true, auctionEnded: true });
      } else {
        const nextPlayer = room.shuffledPlayers[room.currentPlayerIndex];
        room.currentBid = {
          amount: nextPlayer.basePrice,
          bidderId: null,
          bidderName: null,
          timestamp: null,
        };
        room.timerStart = Date.now();
        room.timerDuration = 10;

        room.teams.forEach(t => t.isActive = true);

        io.to(socket.roomCode).emit('next-player', {
          player: nextPlayer,
          currentBid: room.currentBid,
          timerDuration: room.timerDuration,
          teams: room.teams,
          bidHistory: room.bidHistory,
        });
        callback?.({ success: true });
      }
    });

    socket.on('get-room-state', (callback) => {
      const room = rooms.get(socket.roomCode);
      if (room) {
        callback({ success: true, room });
      } else {
        callback({ success: false, error: 'Room not found' });
      }
    });

    // Host controls - pause auction
    socket.on('pause-auction', (payload, callback) => {
      const roomCode = payload?.roomCode || socket.roomCode;
      console.log('pause-auction received:', { socketId: socket.id, socketRoomCode: socket.roomCode, payloadRoomCode: payload?.roomCode, room: rooms.get(roomCode) ? 'found' : 'not found' });
      const room = rooms.get(roomCode);
      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }
      if (room.hostId !== socket.id) {
        callback?.({ success: false, error: 'Only host can control auction' });
        return;
      }
      room.isPaused = true;
      io.to(roomCode).emit('auction-paused', { isPaused: true });
      callback?.({ success: true });
    });

    // Host controls - resume auction
    socket.on('resume-auction', (payload, callback) => {
      const roomCode = payload?.roomCode || socket.roomCode;
      const room = rooms.get(roomCode);
      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }
      if (room.hostId !== socket.id) {
        callback?.({ success: false, error: 'Only host can control auction' });
        return;
      }
      room.isPaused = false;
      io.to(roomCode).emit('auction-paused', { isPaused: false });
      callback?.({ success: true });
    });

    // Host controls - end auction
    socket.on('end-auction', (payload, callback) => {
      const roomCode = payload?.roomCode || socket.roomCode;
      const room = rooms.get(roomCode);
      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }
      if (room.hostId !== socket.id) {
        callback?.({ success: false, error: 'Only host can end auction' });
        return;
      }
      room.status = 'finished';
      io.to(roomCode).emit('auction-ended', {
        teams: room.teams,
        soldPlayers: room.soldPlayers,
      });
      callback?.({ success: true });
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.roomCode) {
        const room = rooms.get(socket.roomCode);
        if (room) {
          room.teams = room.teams.filter(t => t.id !== socket.id);
          if (room.teams.length === 0) {
            rooms.delete(socket.roomCode);
            console.log(`Room deleted: ${socket.roomCode}`);
          } else {
            io.to(socket.roomCode).emit('room-updated', room);
          }
        }
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});