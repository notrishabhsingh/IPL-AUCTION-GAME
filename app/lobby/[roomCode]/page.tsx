'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket, getClientId } from '../../../lib/socket';
import { PixelBall, PixelStumps } from '@/components/PixelArt';

interface Team {
  id: string;
  name: string;
  purse: number;
  squad: string[];
  isActive: boolean;
  connected: boolean;
}

interface Room {
  code: string;
  lobbyName: string;
  hostId: string;
  teams: Team[];
  status: string;
}

type RoomStateResponse =
  | { success: true; room: Room }
  | { success: false; error?: string };

interface AckResult {
  success: boolean;
  error?: string;
}

const TEAM_COLORS = [
  '#48f0b2',
  '#ffc14d',
  '#ff5fa2',
  '#3dd9ff',
  '#b98cff',
  '#ff8a3d',
  '#7cff7a',
  '#ff4d6d',
];

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="stat-box">
      <p className="pixel-label">{label}</p>
      <p className="font-terminal text-2xl leading-none" style={{ color: accent || 'var(--ink)' }}>
        {value}
      </p>
    </div>
  );
}

export default function LobbyPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;
  const [room, setRoom] = useState<Room | null>(null);
  const [playerCount, setPlayerCount] = useState(200);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [socket] = useState<ReturnType<typeof getSocket> | null>(
    () => (typeof window === 'undefined' ? null : getSocket())
  );

  useEffect(() => {
    const s = getSocket();

    if (!s.connected) {
      s.connect();
    }

    const handleConnect = () => {
      s.emit('get-room-state', { roomCode, clientId: getClientId() }, (res: RoomStateResponse) => {
        if (res.success) {
          setRoom(res.room);
          if (res.room.status === 'auctioning') {
            router.push(`/auction/${roomCode}`);
          } else if (res.room.status === 'finished') {
            router.push(`/results/${roomCode}`);
          }
        } else {
          router.push('/');
        }
        setLoading(false);
      });
    };

    s.on('connect', handleConnect);
    if (s.connected) {
      handleConnect();
    }

    s.on('room-updated', (updatedRoom: Room) => {
      setRoom(updatedRoom);
    });

    s.on('auction-started', () => {
      router.push(`/auction/${roomCode}`);
    });

    return () => {
      s.off('connect', handleConnect);
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

    s.emit('start-auction', { playerCount }, (res: AckResult) => {
      if (res.success) {
        router.push(`/auction/${roomCode}`);
      } else {
        setError(res.error || 'Could not start the auction');
      }
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError('Could not copy the room code');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel px-8 py-6 text-center">
          <PixelBall className="mx-auto h-10 w-10" />
          <p className="pixel-label pixel-label--gold mt-4 cursor">BOOTING LOBBY_</p>
        </div>
      </div>
    );
  }

  const isHost = room?.hostId === socket?.id;
  const connectedTeams = room?.teams.filter(t => t.connected !== false) || [];
  const hostTeam = room?.teams.find(t => t.id === room.hostId);
  const emptySlots = Math.max(0, 8 - (room?.teams.length || 0));

  return (
    <div className="min-h-screen px-4 py-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-5 sm:p-7"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="pixel-label pixel-label--bright flex items-center gap-2">
                <span className="led led--on" />
                WAITING ROOM
              </p>
              <h1 className="mt-3 font-pixel text-lg leading-relaxed text-[var(--ink)] sm:text-2xl">
                {room?.lobbyName || 'IPL AUCTION'}
              </h1>
              <p className="mt-2 text-[19px] text-[var(--muted)]">
                Share the code. Assemble the franchises.
              </p>
              {hostTeam && (
                <p className="pixel-label mt-3">
                  HOST: <span className="text-[var(--gold)]">{hostTeam.name}</span>
                </p>
              )}
            </div>

            <div className="panel panel--flat shrink-0 bg-[#060c16] px-4 py-3 sm:min-w-[245px]">
              <p className="pixel-label">ROOM CODE</p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <span className="font-pixel text-base tracking-[0.18em] text-[var(--gold)] text-glow-gold">
                  {roomCode}
                </span>
                <button
                  onClick={handleCopy}
                  className="pixel-btn pixel-btn--ghost pixel-btn--sm"
                  aria-label="Copy room code"
                >
                  {copied ? 'COPIED!' : 'COPY'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <MiniStat label="TEAMS" value={`${connectedTeams.length}/8`} accent="var(--mint)" />
            <MiniStat label="PURSE" value="120 CR" accent="var(--gold)" />
            <MiniStat label="SQUAD CAP" value="25" accent="var(--cyan)" />
            <MiniStat label="BID CLOCK" value="10 SEC" accent="var(--purple)" />
          </div>

          {isHost && (
            <div className="panel panel--flat mt-5 bg-[#08101d] p-4">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="player-count" className="pixel-label">
                  PLAYER POOL
                </label>
                <span className="font-terminal text-2xl leading-none text-[var(--gold)]">
                  {playerCount}
                </span>
              </div>
              <input
                id="player-count"
                type="range"
                min="40"
                max="200"
                step="10"
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                className="pixel-range mt-3"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="pixel-label text-[var(--dim)]">40 MIN</span>
                <span className="pixel-label text-[var(--dim)]">200 MAX</span>
              </div>
            </div>
          )}
        </motion.div>

        <div className="mt-8 mb-3 flex items-center justify-between gap-3">
          <h2 className="pixel-label pixel-label--gold flex items-center gap-2">
            <PixelStumps className="h-4 w-4" />
            TEAM SELECT
          </h2>
          <span className="pixel-label flex items-center gap-2">
            {connectedTeams.length} CONNECTED
            <span className={connectedTeams.length >= 2 ? 'led led--on' : 'led led--off'} />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <AnimatePresence>
            {room?.teams.map((team, index) => {
              const color = TEAM_COLORS[index % TEAM_COLORS.length];
              const isMe = team.id === socket?.id;
              const isOffline = team.connected === false;

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.06 }}
                  className={`team-card ${isMe ? 'team-card--me' : ''} ${isOffline ? 'opacity-55' : ''}`}
                >
                  <div className="team-card__stripe" style={{ background: color }} />
                  <div className="p-4">
                    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-start sm:gap-3 sm:text-left">
                      <div
                        className="avatar-pixel h-12 w-12 text-xl sm:h-14 sm:w-14 sm:text-2xl"
                        style={{ background: color }}
                      >
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-pixel text-[10px] leading-relaxed text-[var(--ink)]">
                          {team.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap justify-center gap-1 sm:justify-start">
                          {isMe && <span className="pixel-tag text-[var(--gold)]">YOU</span>}
                          {isOffline ? (
                            <span className="pixel-tag text-[var(--red)]">OFFLINE</span>
                          ) : (
                            <span className="pixel-tag text-[var(--mint)]">READY</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t-2 border-dashed border-[#1d2e49] pt-2">
                      <span className="pixel-label">SLOT {String(index + 1).padStart(2, '0')}</span>
                      <span className={`led ${isOffline ? 'led--off' : 'led--on'}`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="team-card opacity-55" style={{ borderStyle: 'dashed' }}>
              <div className="team-card__stripe bg-[#1a2a45]" style={{ boxShadow: 'none' }} />
              <div className="p-4 text-center">
                <div className="slot-empty-avatar">+</div>
                <p className="pixel-label mt-3">OPEN SLOT</p>
                <p className="mt-1 text-[16px] text-[var(--dim)]">WAITING FOR PLAYER</p>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="panel panel--red panel--flat mt-6 bg-[#1a0a10] px-4 py-3">
            <p className="pixel-label pixel-label--red">! {error}</p>
          </div>
        )}

        <div className="mt-8">
          {isHost && connectedTeams.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel panel--mint p-5 text-center"
            >
              <p className="pixel-label pixel-label--bright">ALL BOARDS READY</p>
              <button
                onClick={handleStart}
                className="pixel-btn pixel-btn--mint pixel-btn--lg mt-3 w-full sm:w-auto sm:min-w-[320px]"
              >
                ▶ START AUCTION
              </button>
              <p className="pixel-label mt-3 text-[var(--dim)]">
                {connectedTeams.length} CONNECTED TEAMS • {playerCount} PLAYERS IN THE POOL
              </p>
            </motion.div>
          )}

          {isHost && connectedTeams.length < 2 && (
            <div className="panel panel--gold p-5 text-center">
              <p className="pixel-label pixel-label--gold cursor">WAITING FOR CHALLENGERS_</p>
              <p className="mt-2 text-[19px] text-[var(--muted)]">
                At least 2 connected teams are needed to start the auction.
              </p>
            </div>
          )}

          {!isHost && (
            <div className="panel p-5 text-center">
              <p className="pixel-label pixel-label--gold cursor">WAITING FOR THE HOST_</p>
              <p className="mt-2 text-[19px] text-[var(--muted)]">
                The auctioneer will start the bidding soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
