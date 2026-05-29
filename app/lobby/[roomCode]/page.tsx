'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket, connectSocket, disconnectSocket } from '../../../lib/socket';

interface Team {
  id: string;
  name: string;
  purse: number;
  squad: string[];
  isActive: boolean;
}

interface Room {
  code: string;
  lobbyName: string;
  hostId: string;
  teams: Team[];
  status: string;
}

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [playerCount, setPlayerCount] = useState(200);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    if (!s.connected) {
      s.connect();
    }

    const handleConnect = () => {
      s.emit('get-room-state', (res: any) => {
        if (res.success) {
          setRoom(res.room);
          if (res.room.status === 'auctioning') {
            router.push(`/auction/${roomCode}`);
          }
        } else {
          router.push('/');
        }
        setLoading(false);
      });
    };

    if (s.connected) {
      handleConnect();
    } else {
      s.once('connect', handleConnect);
    }

    s.on('room-updated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    s.on('auction-started', () => {
      router.push(`/auction/${roomCode}`);
    });

    return () => {
      s.off('room-updated');
      s.off('auction-started');
    };
  }, [roomCode, router]);

  const handleStart = async () => {
    const s = getSocket();
    if (!s.connected) {
      await new Promise<void>((resolve) => {
        s.once('connect', () => resolve());
        setTimeout(() => resolve(), 5000);
      });
    }

    s.emit('start-auction', { playerCount }, (res: any) => {
      if (res.success) {
        router.push(`/auction/${roomCode}`);
      } else {
        console.error('Start auction failed:', res.error);
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-2xl text-[var(--accent-gold)]">Loading...</div>
      </div>
    );
  }

  const myTeam = room?.teams.find(t => t.id === socket?.id);
  const isHost = room?.hostId === socket?.id;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[var(--accent-purple)] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-[var(--accent-gold)] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gradient">{room?.lobbyName || 'IPL Auction'}</h1>
              <p className="text-[var(--text-secondary)] mt-1">Room Code: <span className="text-[var(--accent-gold)] font-bold text-2xl tracking-widest">{roomCode}</span></p>
            </div>
            <div className="text-right">
              <p className="text-[var(--text-muted)]">Status</p>
              <p className="text-[var(--accent-green)] font-semibold">Waiting for players</p>
            </div>
          </div>

          {isHost && (
            <div className="mb-8 p-4 bg-[var(--bg-secondary)] rounded-xl">
              <label className="block text-[var(--text-secondary)] mb-2">Number of Players</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="40"
                    max="200"
                  step="10"
                  value={playerCount}
                  onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                  className="flex-1 accent-[var(--accent-purple)]"
                />
                <span className="text-[var(--accent-gold)] font-bold text-xl w-16">{playerCount}</span>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatePresence>
            {room?.teams.map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card rounded-xl p-6 text-center ${team.id === socket?.id ? 'ring-2 ring-[var(--accent-gold)]' : ''}`}
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-2xl font-bold">
                  {team.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-lg">{team.name}</h3>
                <p className="text-[var(--text-muted)] text-sm mt-1">
                  {team.id === socket?.id ? 'You' : 'Joined'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {[...Array(Math.max(0, 8 - (room?.teams.length || 0)))].map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center border-dashed border-2 border-[var(--text-muted)] opacity-50">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center text-2xl font-bold text-[var(--text-muted)]">
                ?
              </div>
              <p className="text-[var(--text-muted)]">Waiting...</p>
            </div>
          ))}
        </div>

        {isHost && room && room.teams.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <button
              onClick={handleStart}
              className="py-4 px-12 rounded-xl bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/80 transition-all font-bold text-xl glow-gold"
            >
              Start Auction 🚀
            </button>
            <p className="text-[var(--text-muted)] mt-3">Need at least 2 teams to start</p>
          </motion.div>
        )}

        {!isHost && (
          <div className="text-center">
            <p className="text-[var(--text-muted)]">Waiting for host to start the auction...</p>
          </div>
        )}
      </div>
    </div>
  );
}