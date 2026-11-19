/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require('http');
const { parse } = require('url');
const { randomUUID } = require('crypto');
const next = require('next');
const { Server } = require('socket.io');
const { getRandomPlayers } = require('./lib/players');

// `npm run dev` / `npm start` pass an explicit mode so local `npm start`
// never boots Next in dev mode.
const cliMode = process.argv[2];
if (cliMode === '--dev') process.env.NODE_ENV = 'development';
if (cliMode === '--prod') process.env.NODE_ENV = 'production';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MAX_TEAMS = 8;
const MAX_SQUAD_SIZE = 25;
const MAX_OVERSEAS_PLAYERS = 8;
const STARTING_PURSE = 120;
const BID_TIMER_SECONDS = 10;
const MIN_TEAMS_TO_START = 2;
const ROOM_IDLE_CLEANUP_MS = 10 * 60 * 1000;

const rooms = new Map();
const roomTimers = new Map();
const roomCleanupTimers = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isOverseasPlayer(player) {
  return Boolean(player.country) && player.country.toLowerCase() !== 'india';
}

function getOverseasCount(team, allPlayers) {
  return team.squad.filter(playerId => {
    const player = allPlayers.find(p => p.id === playerId);
    return player && isOverseasPlayer(player);
  }).length;
}

function canTeamBuyPlayer(team, player, allPlayers) {
  if (team.squad.length >= MAX_SQUAD_SIZE) {
    return { canBuy: false, reason: `Maximum ${MAX_SQUAD_SIZE} players allowed per team` };
  }

  if (isOverseasPlayer(player)) {
    const overseasCount = getOverseasCount(team, allPlayers);
    if (overseasCount >= MAX_OVERSEAS_PLAYERS) {
      return { canBuy: false, reason: `Maximum ${MAX_OVERSEAS_PLAYERS} overseas players allowed per team` };
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

// Never expose clientId/hostClientId: they are the reconnect credentials.
function publicTeam(team) {
  return {
    id: team.id,
    name: team.name,
    purse: team.purse,
    squad: team.squad,
    isActive: team.isActive,
    connected: team.connected,
  };
}

function publicRoom(room) {
  return {
    code: room.code,
    lobbyName: room.lobbyName,
    hostId: room.hostId,
    teams: room.teams.map(publicTeam),
    shuffledPlayers: room.shuffledPlayers,
    currentPlayerIndex: room.currentPlayerIndex,
    currentBid: room.currentBid,
    timerStart: room.timerStart,
    timerDuration: room.timerDuration,
    pausedTimeLeft: room.pausedTimeLeft,
    status: room.status,
    bidHistory: room.bidHistory,
    soldPlayers: room.soldPlayers,
    isPaused: room.isPaused,
  };
}

function clearRoomTimer(roomCode) {
  const timer = roomTimers.get(roomCode);
  if (timer) {
    clearTimeout(timer);
    roomTimers.delete(roomCode);
  }
}

function detachFromCurrentRoom(socket, io) {
  const previousCode = socket.roomCode;
  if (!previousCode) return;

  const previousRoom = rooms.get(previousCode);
  if (previousRoom) {
    const team = previousRoom.teams.find(t => t.id === socket.id);
    if (team) team.connected = false;

    if (previousRoom.hostId === socket.id) {
      const fallbackHost = previousRoom.teams.find(t => t.id !== socket.id && t.connected);
      if (fallbackHost) {
        previousRoom.hostId = fallbackHost.id;
        previousRoom.hostClientId = fallbackHost.clientId;
      }
    }

    socket.leave(previousCode);
    io.to(previousCode).emit('room-updated', publicRoom(previousRoom));

    if (previousRoom.teams.every(t => !t.connected)) {
      scheduleRoomCleanup(previousCode);
    }
  }

  socket.roomCode = null;
}

function cancelRoomCleanup(roomCode) {
  const timer = roomCleanupTimers.get(roomCode);
  if (timer) {
    clearTimeout(timer);
    roomCleanupTimers.delete(roomCode);
  }
}

function scheduleRoomCleanup(roomCode) {
  cancelRoomCleanup(roomCode);
  const timer = setTimeout(() => {
    roomCleanupTimers.delete(roomCode);
    const room = rooms.get(roomCode);
    if (room && room.teams.every(team => !team.connected)) {
      clearRoomTimer(roomCode);
      rooms.delete(roomCode);
    }
  }, ROOM_IDLE_CLEANUP_MS);
  roomCleanupTimers.set(roomCode, timer);
}

// The server owns the countdown. Clients only animate it; they can never
// trigger a sale themselves.
function scheduleRoomTimer(room, io) {
  clearRoomTimer(room.code);
  if (room.status !== 'auctioning' || room.isPaused) return;

  room.timerStart = Date.now();
  const timer = setTimeout(() => {
    roomTimers.delete(room.code);
    if (room.status === 'auctioning' && !room.isPaused) {
      sellCurrentPlayer(room, io);
    }
  }, Math.max(0, room.timerDuration * 1000));

  roomTimers.set(room.code, timer);
}

function pauseRoomTimer(room) {
  clearRoomTimer(room.code);
  if (room.timerStart != null) {
    const elapsed = (Date.now() - room.timerStart) / 1000;
    room.pausedTimeLeft = Math.max(0, room.timerDuration - elapsed);
  } else {
    room.pausedTimeLeft = room.timerDuration;
  }
}

function finishAuction(room, io) {
  clearRoomTimer(room.code);
  room.status = 'finished';
  room.isPaused = false;
  io.to(room.code).emit('auction-ended', {
    teams: room.teams.map(publicTeam),
    soldPlayers: room.soldPlayers,
  });
}

function sellCurrentPlayer(room, io) {
  clearRoomTimer(room.code);

  if (room.status !== 'auctioning' || room.isPaused) {
    return { success: false, error: 'Auction not active' };
  }

  const currentPlayer = room.shuffledPlayers[room.currentPlayerIndex];
  if (!currentPlayer) {
    finishAuction(room, io);
    return { success: true, auctionEnded: true };
  }

  const winningBid = room.currentBid;
  if (winningBid.bidderId) {
    const winningTeam = room.teams.find(t => t.id === winningBid.bidderId);
    if (winningTeam) {
      winningTeam.purse = Number((winningTeam.purse - winningBid.amount).toFixed(2));
      winningTeam.squad.push(currentPlayer.id);
      room.soldPlayers.push({
        ...currentPlayer,
        soldTo: winningTeam.name,
        soldFor: winningBid.amount,
      });
    } else {
      room.soldPlayers.push({ ...currentPlayer, soldTo: null, soldFor: 0 });
    }
  } else {
    room.soldPlayers.push({ ...currentPlayer, soldTo: null, soldFor: 0 });
  }

  room.currentPlayerIndex += 1;

  if (room.currentPlayerIndex >= room.shuffledPlayers.length) {
    finishAuction(room, io);
    return { success: true, auctionEnded: true };
  }

  const nextPlayer = room.shuffledPlayers[room.currentPlayerIndex];
  room.currentBid = {
    amount: 0,
    bidderId: null,
    bidderName: null,
    timestamp: null,
  };
  room.teams.forEach(team => {
    team.isActive = true;
  });
  room.timerDuration = BID_TIMER_SECONDS;
  room.pausedTimeLeft = null;

  io.to(room.code).emit('next-player', {
    player: nextPlayer,
    currentPlayerIndex: room.currentPlayerIndex,
    currentBid: room.currentBid,
    timerDuration: room.timerDuration,
    teams: room.teams.map(publicTeam),
    bidHistory: room.bidHistory,
  });

  scheduleRoomTimer(room, io);
  return { success: true, auctionEnded: false };
}

function findTeamByClientId(room, clientId) {
  if (!clientId) return undefined;
  return room.teams.find(team => team.clientId === clientId);
}

function bindTeamToSocket(socket, room, clientId) {
  const team = findTeamByClientId(room, clientId);
  if (!team) return null;

  const previousId = team.id;
  team.id = socket.id;
  team.connected = true;

  // Restore host if this client was the host and nobody took over.
  if (room.hostId === previousId || room.hostClientId === clientId) {
    room.hostId = socket.id;
  }

  socket.roomCode = room.code;
  socket.clientId = clientId;
  socket.join(room.code);
  cancelRoomCleanup(room.code);

  return team;
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
    socket.on('create-room', (payload, callback) => {
      const { lobbyName, teamName, clientId } = payload || {};

      if (!lobbyName?.trim() || !teamName?.trim()) {
        callback?.({ success: false, error: 'Lobby and team name are required' });
        return;
      }

      detachFromCurrentRoom(socket, io);

      let roomCode = generateRoomCode();
      while (rooms.has(roomCode)) {
        roomCode = generateRoomCode();
      }

      const resolvedClientId = clientId || randomUUID();
      const team = {
        id: socket.id,
        clientId: resolvedClientId,
        name: teamName.trim(),
        purse: STARTING_PURSE,
        squad: [],
        isActive: true,
        connected: true,
      };

      const room = {
        code: roomCode,
        lobbyName: lobbyName.trim(),
        hostId: socket.id,
        hostClientId: resolvedClientId,
        teams: [team],
        shuffledPlayers: [],
        currentPlayerIndex: 0,
        currentBid: {
          amount: 0,
          bidderId: null,
          bidderName: null,
          timestamp: null,
        },
        timerStart: null,
        timerDuration: BID_TIMER_SECONDS,
        pausedTimeLeft: null,
        status: 'waiting',
        bidHistory: [],
        soldPlayers: [],
        isPaused: false,
      };

      rooms.set(roomCode, room);
      cancelRoomCleanup(roomCode);
      socket.join(roomCode);
      socket.roomCode = roomCode;
      socket.clientId = resolvedClientId;

      callback?.({ success: true, roomCode, room: publicRoom(room) });
    });

    socket.on('join-room', (payload, callback) => {
      const { roomCode, teamName, clientId } = payload || {};
      const code = String(roomCode || '').toUpperCase();
      const room = rooms.get(code);

      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }

      const resolvedClientId = clientId || randomUUID();

      // Same browser returning to the room: reattach instead of duplicating.
      const existingTeam = findTeamByClientId(room, resolvedClientId);
      if (existingTeam) {
        if (socket.roomCode && socket.roomCode !== code) {
          detachFromCurrentRoom(socket, io);
        }
        bindTeamToSocket(socket, room, resolvedClientId);
        io.to(code).emit('room-updated', publicRoom(room));
        callback?.({ success: true, room: publicRoom(room) });
        return;
      }

      if (!teamName?.trim()) {
        callback?.({ success: false, error: 'Team name is required' });
        return;
      }
      if (room.teams.length >= MAX_TEAMS) {
        callback?.({ success: false, error: 'Room is full' });
        return;
      }
      if (room.status !== 'waiting') {
        callback?.({ success: false, error: 'Auction already started' });
        return;
      }

      detachFromCurrentRoom(socket, io);

      const team = {
        id: socket.id,
        clientId: resolvedClientId,
        name: teamName.trim(),
        purse: STARTING_PURSE,
        squad: [],
        isActive: true,
        connected: true,
      };
      room.teams.push(team);

      // If the previous host left and nobody was connected to receive the
      // role, hand it to the first team that joins.
      const currentHost = room.teams.find(t => t.id === room.hostId);
      if (!currentHost || !currentHost.connected) {
        room.hostId = team.id;
        room.hostClientId = team.clientId;
      }

      socket.join(code);
      socket.roomCode = code;
      socket.clientId = resolvedClientId;
      cancelRoomCleanup(code);

      io.to(code).emit('room-updated', publicRoom(room));
      callback?.({ success: true, room: publicRoom(room) });
    });

    socket.on('start-auction', (payload, callback) => {
      const { playerCount } = payload || {};
      const room = rooms.get(socket.roomCode);

      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }
      if (room.hostId !== socket.id) {
        callback?.({ success: false, error: 'Only host can start' });
        return;
      }
      if (room.status !== 'waiting') {
        callback?.({ success: false, error: 'Auction already started' });
        return;
      }
      if (room.teams.filter(team => team.connected).length < MIN_TEAMS_TO_START) {
        callback?.({ success: false, error: 'Need at least 2 connected teams to start' });
        return;
      }

      const requestedCount = Number(playerCount);
      room.shuffledPlayers = getRandomPlayers(
        Number.isFinite(requestedCount) && requestedCount > 0 ? requestedCount : 200
      );
      room.status = 'auctioning';
      room.currentPlayerIndex = 0;
      room.currentBid = {
        amount: 0,
        bidderId: null,
        bidderName: null,
        timestamp: null,
      };
      room.bidHistory = [];
      room.soldPlayers = [];
      room.isPaused = false;
      room.pausedTimeLeft = null;
      room.timerDuration = BID_TIMER_SECONDS;

      io.to(room.code).emit('auction-started', {
        players: room.shuffledPlayers,
        currentPlayer: room.shuffledPlayers[0],
        currentPlayerIndex: 0,
        currentBid: room.currentBid,
        timerDuration: room.timerDuration,
        teams: room.teams.map(publicTeam),
        bidHistory: room.bidHistory,
      });

      scheduleRoomTimer(room, io);
      callback?.({ success: true });
    });

    socket.on('place-bid', (payload, callback) => {
      const { amount } = payload || {};
      const room = rooms.get(socket.roomCode);

      if (!room || room.status !== 'auctioning') {
        callback?.({ success: false, error: 'Auction not active' });
        return;
      }
      if (room.isPaused) {
        callback?.({ success: false, error: 'Auction is paused' });
        return;
      }

      const currentPlayer = room.shuffledPlayers[room.currentPlayerIndex];
      const team = room.teams.find(t => t.id === socket.id);
      if (!team) {
        callback?.({ success: false, error: 'Team not found' });
        return;
      }
      if (!team.isActive) {
        callback?.({ success: false, error: 'You passed on this player' });
        return;
      }

      if (room.currentBid.bidderId === socket.id) {
        callback?.({ success: false, error: 'You already have the highest bid. Wait for another team to bid.' });
        return;
      }

      const eligibility = canTeamBuyPlayer(team, currentPlayer, room.shuffledPlayers);
      if (!eligibility.canBuy) {
        callback?.({ success: false, error: eligibility.reason });
        return;
      }

      if (typeof amount !== 'number' || !Number.isFinite(amount)) {
        callback?.({ success: false, error: 'Invalid bid amount' });
        return;
      }

      const minBid = room.currentBid.amount === 0
        ? currentPlayer.basePrice
        : room.currentBid.amount + getBidIncrement(room.currentBid.amount);

      if (amount < minBid) {
        callback?.({ success: false, error: `Minimum bid is ${minBid} crore` });
        return;
      }
      if (amount > team.purse) {
        callback?.({ success: false, error: 'Insufficient funds' });
        return;
      }

      room.currentBid = {
        amount,
        bidderId: socket.id,
        bidderName: team.name,
        timestamp: Date.now(),
      };
      room.timerDuration = BID_TIMER_SECONDS;

      room.bidHistory.unshift({
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        teamName: team.name,
        amount,
        timestamp: Date.now(),
      });

      io.to(room.code).emit('bid-placed', {
        amount,
        bidderId: socket.id,
        bidderName: team.name,
        currentBid: room.currentBid,
        currentPlayerIndex: room.currentPlayerIndex,
        timerDuration: room.timerDuration,
        bidHistory: room.bidHistory,
      });

      scheduleRoomTimer(room, io);
      callback?.({ success: true });
    });

    socket.on('pass', (payload, callback) => {
      const { roomCode } = payload || {};
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
      io.to(room.code).emit('team-passed', { teamId: socket.id, teamName: team.name });
      callback?.({ success: true });
    });

    socket.on('get-room-state', (payloadOrCallback, maybeCallback) => {
      const callback = typeof payloadOrCallback === 'function' ? payloadOrCallback : maybeCallback;
      const payload = typeof payloadOrCallback === 'object' && payloadOrCallback
        ? payloadOrCallback
        : {};

      const roomCode = payload.roomCode || socket.roomCode;
      const room = roomCode ? rooms.get(roomCode) : undefined;

      if (!room) {
        callback?.({ success: false, error: 'Room not found' });
        return;
      }

      // A refresh/new tab reconnects with a new socket id. Rebind it to the
      // existing team using the persistent client id.
      const clientId = payload.clientId || socket.clientId;
      if (clientId) {
        const rebound = bindTeamToSocket(socket, room, clientId);
        if (rebound) {
          io.to(room.code).emit('room-updated', publicRoom(room));
        }
      }

      callback?.({ success: true, room: publicRoom(room) });
    });

    // Host controls - pause auction
    socket.on('pause-auction', (payload, callback) => {
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
      if (room.status !== 'auctioning') {
        callback?.({ success: false, error: 'Auction not active' });
        return;
      }
      if (room.isPaused) {
        callback?.({ success: true });
        return;
      }

      pauseRoomTimer(room);
      room.isPaused = true;
      io.to(roomCode).emit('auction-paused', {
        isPaused: true,
        timeLeft: room.pausedTimeLeft,
        timerDuration: room.timerDuration,
      });
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
      if (room.status !== 'auctioning') {
        callback?.({ success: false, error: 'Auction not active' });
        return;
      }
      if (!room.isPaused) {
        callback?.({ success: true });
        return;
      }

      const remaining = typeof room.pausedTimeLeft === 'number'
        ? room.pausedTimeLeft
        : BID_TIMER_SECONDS;

      room.isPaused = false;
      room.timerDuration = Math.max(0.1, remaining);
      room.pausedTimeLeft = null;

      io.to(roomCode).emit('auction-paused', {
        isPaused: false,
        timeLeft: room.timerDuration,
        timerDuration: room.timerDuration,
      });

      scheduleRoomTimer(room, io);
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

      finishAuction(room, io);
      callback?.({ success: true });
    });

    socket.on('disconnect', () => {
      const roomCode = socket.roomCode;
      if (!roomCode) return;

      const room = rooms.get(roomCode);
      if (!room) return;

      const team = room.teams.find(t => t.id === socket.id);
      if (team) {
        team.connected = false;
      }

      if (room.hostId === socket.id) {
        const fallbackHost = room.teams.find(t => t.id !== socket.id && t.connected);
        if (fallbackHost) {
          room.hostId = fallbackHost.id;
          room.hostClientId = fallbackHost.clientId;
        }
      }

      io.to(roomCode).emit('room-updated', publicRoom(room));

      if (room.teams.every(t => !t.connected)) {
        scheduleRoomCleanup(roomCode);
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT} (${dev ? 'development' : 'production'})`);
  });
});
