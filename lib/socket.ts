import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let isConnecting = false;

export const getSocket = (): Socket => {
  if (!socket || !socket.io) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'), {
      autoConnect: false,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = (): Socket => {
  const s = getSocket();
  if (!s.connected && !isConnecting) {
    isConnecting = true;
    s.connect();
    s.on('connect', () => {
      isConnecting = false;
    });
  }
  return s;
};

const CLIENT_ID_KEY = 'ipl-bid-wars-client-id';

// Stable per-browser id used to recover your team after a refresh or a
// dropped connection (socket ids change on reconnect).
export const getClientId = (): string => {
  if (typeof window === 'undefined') return '';

  let id = window.localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};