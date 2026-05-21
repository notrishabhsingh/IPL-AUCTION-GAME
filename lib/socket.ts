import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;
let isConnecting = false;

export const getSocket = (): Socket => {
  if (!socket || !socket.io) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
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

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};