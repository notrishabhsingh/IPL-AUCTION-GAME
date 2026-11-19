'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { connectSocket, getClientId } from '../lib/socket';

interface CreateRoomResponse {
  success: boolean;
  roomCode?: string;
  error?: string;
}

interface JoinRoomResponse {
  success: boolean;
  error?: string;
}

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [lobbyName, setLobbyName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const createdRef = useRef(false);

  const handleCreate = async () => {
    if (!lobbyName.trim() || !teamName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (createdRef.current) return;
    createdRef.current = true;
    setLoading(true);
    setError('');

    try {
      const socket = connectSocket();

      // Wait for connection if not connected
      if (!socket.connected) {
        await new Promise<void>((resolve) => {
          socket.once('connect', () => resolve());
          // Timeout after 5 seconds
          setTimeout(() => resolve(), 5000);
        });
      }

      socket.emit('create-room', { lobbyName, teamName, clientId: getClientId() }, (res: CreateRoomResponse) => {
        if (res.success && res.roomCode) {
          router.push(`/lobby/${res.roomCode}`);
        } else {
          setError(res.error || 'Failed to create room');
          setLoading(false);
          createdRef.current = false;
        }
      });
    } catch {
      setError('Connection failed');
      setLoading(false);
      createdRef.current = false;
    }
  };

  const handleJoin = async () => {
    if (!roomCode.trim() || !teamName.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const socket = connectSocket();

      if (!socket.connected) {
        await new Promise<void>((resolve) => {
          socket.once('connect', () => resolve());
          setTimeout(() => resolve(), 5000);
        });
      }

      socket.emit('join-room', { roomCode: roomCode.toUpperCase(), teamName, clientId: getClientId() }, (res: JoinRoomResponse) => {
        if (res.success) {
          router.push(`/lobby/${roomCode.toUpperCase()}`);
        } else {
          setError(res.error || 'Failed to join room');
          setLoading(false);
        }
      });
    } catch {
      setError('Connection failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-[var(--accent-purple)] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--accent-gold)] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-gradient mb-4"
          >
            IPL BID WARS
          </motion.h1>
          <p className="text-[var(--text-secondary)] text-lg">
            Bid. Build. Dominate.
          </p>
        </div>

        {mode === 'select' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-xl font-semibold text-center mb-6">Choose Your Path</h2>
            <div className="space-y-4">
              <button
                onClick={() => setMode('create')}
                className="w-full py-4 px-6 rounded-xl bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-light)] transition-all font-semibold text-lg flex items-center justify-center gap-3"
              >
                <span className="text-2xl">+</span>
                Create Lobby
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full py-4 px-6 rounded-xl border-2 border-[var(--accent-gold)] text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-black transition-all font-semibold text-lg"
              >
                Join Lobby
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'create' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-8"
          >
            <button
              onClick={() => { setMode('select'); setError(''); }}
              className="text-[var(--text-secondary)] hover:text-white mb-6 flex items-center gap-2"
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-6">Create New Lobby</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[var(--text-secondary)] mb-2">Lobby Name</label>
                <input
                  type="text"
                  value={lobbyName}
                  onChange={(e) => setLobbyName(e.target.value)}
                  placeholder="IPL Auction 2024"
                  className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--bg-card)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-purple)]"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-2">Your Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Royal Challengers"
                  className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--bg-card)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-purple)]"
                />
              </div>
              {error && <p className="text-[var(--accent-red)] text-sm">{error}</p>}
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-light)] transition-all font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Lobby'}
              </button>
            </div>
          </motion.div>
        )}

        {mode === 'join' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-2xl p-8"
          >
            <button
              onClick={() => { setMode('select'); setError(''); }}
              className="text-[var(--text-secondary)] hover:text-white mb-6 flex items-center gap-2"
            >
              ← Back
            </button>
            <h2 className="text-xl font-semibold mb-6">Join Existing Lobby</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[var(--text-secondary)] mb-2">Room Code</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  maxLength={6}
                  className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--bg-card)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] text-center text-2xl font-bold tracking-widest"
                />
              </div>
              <div>
                <label className="block text-[var(--text-secondary)] mb-2">Your Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Mumbai Indians"
                  className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--bg-card)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>
              {error && <p className="text-[var(--accent-red)] text-sm">{error}</p>}
              <button
                onClick={handleJoin}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[var(--accent-gold)] text-black hover:bg-[var(--accent-gold-light)] transition-all font-semibold text-lg disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Lobby'}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}