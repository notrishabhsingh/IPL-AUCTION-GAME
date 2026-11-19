'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { connectSocket, getClientId } from '../lib/socket';
import { PixelBall, PixelBat, PixelCoin, PixelStumps } from '@/components/PixelArt';

interface CreateRoomResponse {
  success: boolean;
  roomCode?: string;
  error?: string;
}

interface JoinRoomResponse {
  success: boolean;
  error?: string;
}

const marqueeItems = [
  '8 TEAMS',
  '120 CRORE PURSE',
  '200 PLAYERS',
  '25 PLAYER SQUADS',
  '8 OVERSEAS LIMIT',
  '10 SECOND BIDS',
];

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
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">
        <motion.header
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <PixelBat className="h-7 w-7 opacity-80" />
            <span className="pixel-label pixel-label--gold">CRICKET ARCADE • EST. 1986</span>
            <PixelBall className="h-6 w-6" />
          </div>

          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14 }}
            className="arcade-title text-[clamp(2.1rem,8vw,4.5rem)] leading-[1.18]"
          >
            IPL BID WARS
          </motion.h1>

          <p className="mt-4 font-pixel text-[9px] tracking-[0.34em] text-[var(--mint)] sm:text-[11px]">
            BID <span className="text-[var(--gold)]">•</span> BUILD <span className="text-[var(--gold)]">•</span> DOMINATE
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="pixel-tag text-[var(--mint)]">8 TEAMS</span>
            <span className="pixel-tag text-[var(--gold)]">120 CR PURSE</span>
            <span className="pixel-tag text-[var(--cyan)]">200 PLAYERS</span>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="panel mt-8 p-5 sm:p-7"
        >
          <div className="mb-5 flex items-center justify-between gap-3 border-b-2 border-[#22375a] pb-3">
            <span className="pixel-label pixel-label--bright flex items-center gap-2">
              <span className="led led--on" />
              PLAYER SELECT
            </span>
            <span className="pixel-label pixel-label--gold flex items-center gap-2">
              <span className="led led--gold" />
              ATTRACT MODE
            </span>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 14 }}
                className="space-y-3"
              >
                <button
                  onClick={() => setMode('create')}
                  className="pixel-btn pixel-btn--mint pixel-btn--lg pixel-btn--block justify-between"
                >
                  <span className="flex items-center gap-3">
                    <PixelStumps className="h-6 w-6" />
                    CREATE LOBBY
                  </span>
                  <span aria-hidden="true">►</span>
                </button>

                <button
                  onClick={() => setMode('join')}
                  className="pixel-btn pixel-btn--gold pixel-btn--lg pixel-btn--block justify-between"
                >
                  <span className="flex items-center gap-3">
                    <PixelBall className="h-6 w-6" />
                    JOIN WITH CODE
                  </span>
                  <span aria-hidden="true">►</span>
                </button>

                <div className="mt-5 border-t-2 border-dashed border-[#22375a] pt-4 text-center">
                  <p className="pixel-label pixel-label--bright leading-relaxed">
                    PICK A PLAYER MODE TO BEGIN
                  </p>
                  <p className="mt-1 text-[18px] text-[var(--muted)]">
                    Or press start and become the auctioneer.
                  </p>
                </div>
              </motion.div>
            )}

            {mode === 'create' && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
              >
                <button
                  onClick={() => { setMode('select'); setError(''); }}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm mb-5"
                >
                  ◄ BACK
                </button>

                <h2 className="font-pixel text-sm text-[var(--ink)]">CREATE LOBBY</h2>
                <p className="mb-5 mt-2 text-[18px] text-[var(--muted)]">
                  Set up the auction room. You will be the host.
                </p>

                <form
                  className="space-y-4"
                  onSubmit={(event) => { event.preventDefault(); handleCreate(); }}
                >
                  <div>
                    <label htmlFor="lobby-name" className="pixel-label mb-2 block">
                      LOBBY NAME
                    </label>
                    <input
                      id="lobby-name"
                      type="text"
                      value={lobbyName}
                      onChange={(e) => setLobbyName(e.target.value)}
                      placeholder="Sunday Slam Auction"
                      className="pixel-input"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="create-team" className="pixel-label mb-2 block">
                      YOUR TEAM NAME
                    </label>
                    <input
                      id="create-team"
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Royal Challengers"
                      className="pixel-input"
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="panel panel--red panel--flat bg-[#1a0a10] px-4 py-3">
                      <p className="pixel-label pixel-label--red">! {error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="pixel-btn pixel-btn--mint pixel-btn--block pixel-btn--lg"
                  >
                    {loading ? <span className="blink">CREATING LOBBY_</span> : 'START CABINET'}
                  </button>
                </form>
              </motion.div>
            )}

            {mode === 'join' && (
              <motion.div
                key="join"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
              >
                <button
                  onClick={() => { setMode('select'); setError(''); }}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm mb-5"
                >
                  ◄ BACK
                </button>

                <h2 className="font-pixel text-sm text-[var(--ink)]">JOIN LOBBY</h2>
                <p className="mb-5 mt-2 text-[18px] text-[var(--muted)]">
                  Enter the room code from the host.
                </p>

                <form
                  className="space-y-4"
                  onSubmit={(event) => { event.preventDefault(); handleJoin(); }}
                >
                  <div>
                    <label htmlFor="room-code" className="pixel-label mb-2 block">
                      ROOM CODE
                    </label>
                    <input
                      id="room-code"
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                      placeholder="ABC123"
                      maxLength={6}
                      className="pixel-input pixel-input--code"
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label htmlFor="join-team" className="pixel-label mb-2 block">
                      YOUR TEAM NAME
                    </label>
                    <input
                      id="join-team"
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Mumbai Indians"
                      className="pixel-input"
                      autoComplete="off"
                    />
                  </div>

                  {error && (
                    <div className="panel panel--red panel--flat bg-[#1a0a10] px-4 py-3">
                      <p className="pixel-label pixel-label--red">! {error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="pixel-btn pixel-btn--gold pixel-btn--block pixel-btn--lg"
                  >
                    {loading ? <span className="blink">CONNECTING_</span> : 'INSERT COIN'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <div className="mt-6 flex items-center justify-center gap-3">
          <PixelCoin className="h-5 w-5" />
          <p className="pixel-label cursor">INSERT COIN TO PLAY</p>
          <PixelCoin className="h-5 w-5" />
        </div>
      </div>

      <div className="marquee mt-8 w-full max-w-4xl">
        <div className="marquee__track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex" aria-hidden={copy === 1}>
              {marqueeItems.map((item) => (
                <span key={`${copy}-${item}`} className="marquee__item">
                  ◆ <strong>{item}</strong>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
