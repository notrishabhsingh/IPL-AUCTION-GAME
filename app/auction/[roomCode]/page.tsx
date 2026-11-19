'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket, getClientId } from '../../../lib/socket';
import { PixelBall, PixelCoin, PixelStumps } from '@/components/PixelArt';

const BID_TIMER_SECONDS = 10;

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

const ROLE_COLORS: Record<string, string> = {
  BAT: '#3dd9ff',
  BOWL: '#ff4d6d',
  AR: '#48f0b2',
  WK: '#ffc14d',
};

const ROLE_LABELS: Record<string, string> = {
  BAT: 'BATSMAN',
  BOWL: 'BOWLER',
  AR: 'ALL-ROUNDER',
  WK: 'WICKET KEEPER',
};

interface Player {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  ipl: { matches: number; runs?: number; wickets?: number; avg?: number; sr?: number; economy?: number; fifties?: number; hundreds?: number; bowlAvg?: number; bowlSr?: number };
  t20i: { matches: number; runs?: number; wickets?: number; avg?: number; sr?: number; economy?: number; fifties?: number; hundreds?: number; bowlAvg?: number; bowlSr?: number };
  country: string;
}

interface Team {
  id: string;
  name: string;
  purse: number;
  squad: string[];
  isActive: boolean;
  connected: boolean;
}

interface BidHistory {
  playerId: string;
  playerName: string;
  teamName: string;
  amount: number;
  timestamp: number;
}

interface Room {
  hostId: string;
  isPaused: boolean;
}

interface CurrentBid {
  amount: number;
  bidderId: string | null;
  bidderName: string | null;
}

interface AuctionRoom {
  status: string;
  hostId: string;
  isPaused: boolean;
  teams: Team[];
  bidHistory: BidHistory[];
  shuffledPlayers: Player[];
  currentPlayerIndex: number;
  currentBid: CurrentBid;
  timerDuration: number;
  timerStart: number | null;
  pausedTimeLeft: number | null;
}

type RoomStateResponse =
  | { success: true; room: AuctionRoom }
  | { success: false; error?: string };

interface AckResult {
  success: boolean;
  error?: string;
}

interface BidPlacedPayload {
  currentBid: CurrentBid;
  timerDuration: number;
  currentPlayerIndex?: number;
  bidHistory?: BidHistory[];
}

interface NextPlayerPayload {
  player: Player;
  currentBid: CurrentBid;
  timerDuration: number;
  currentPlayerIndex?: number;
  teams: Team[];
  bidHistory?: BidHistory[];
}

interface AuctionPausedPayload {
  isPaused: boolean;
  timeLeft?: number;
  timerDuration?: number;
}

interface TeamPassedPayload {
  teamId: string;
}

interface RoomUpdatedPayload {
  hostId: string;
  isPaused?: boolean;
  teams: Team[];
}

function StatRows({ stats, role }: { stats: Player['ipl']; role: string }) {
  const isBowler = role === 'BOWL';

  return (
    <dl className="mt-1">
      <div className="stat-row">
        <dt>MATCHES</dt>
        <dd>{stats.matches}</dd>
      </div>
      {isBowler ? (
        <>
          <div className="stat-row"><dt>WICKETS</dt><dd>{stats.wickets ?? 0}</dd></div>
          <div className="stat-row"><dt>ECONOMY</dt><dd>{stats.economy ?? '-'}</dd></div>
          <div className="stat-row"><dt>BOWL AVG</dt><dd>{stats.bowlAvg ?? '-'}</dd></div>
          <div className="stat-row"><dt>BOWL SR</dt><dd>{stats.bowlSr ?? '-'}</dd></div>
        </>
      ) : (
        <>
          <div className="stat-row"><dt>RUNS</dt><dd>{stats.runs ?? 0}</dd></div>
          <div className="stat-row"><dt>AVERAGE</dt><dd>{stats.avg ?? 0}</dd></div>
          <div className="stat-row"><dt>STRIKE RATE</dt><dd>{stats.sr ?? 0}</dd></div>
          <div className="stat-row"><dt>50s / 100s</dt><dd>{stats.fifties ?? 0} / {stats.hundreds ?? 0}</dd></div>
          {role === 'AR' && <div className="stat-row"><dt>WICKETS</dt><dd>{stats.wickets ?? 0}</dd></div>}
        </>
      )}
    </dl>
  );
}

export default function AuctionPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentBid, setCurrentBid] = useState<CurrentBid>({ amount: 0, bidderId: null, bidderName: null });
  const [teams, setTeams] = useState<Team[]>([]);
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [customBid, setCustomBid] = useState('');
  const [error, setError] = useState('');
  const [socket] = useState<ReturnType<typeof getSocket> | null>(
    () => (typeof window === 'undefined' ? null : getSocket())
  );
  const [loading, setLoading] = useState(true);
  const [playerCount, setPlayerCount] = useState(0);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [roomInfo, setRoomInfo] = useState<Room>({ hostId: '', isPaused: false });
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTeamSquad = (teamId: string) => {
    setExpandedTeams(prev => {
      const next = new Set(prev);
      if (next.has(teamId)) {
        next.delete(teamId);
      } else {
        next.add(teamId);
      }
      return next;
    });
  };

  useEffect(() => {
    const s = getSocket();

    if (!s.connected) {
      s.connect();
    }

    const handleConnect = () => {
      s.emit('get-room-state', { roomCode, clientId: getClientId() }, (res: RoomStateResponse) => {
        if (res.success) {
          if (res.room.status === 'finished') {
            router.push(`/results/${roomCode}`);
            return;
          }
          if (res.room.status === 'waiting') {
            router.push(`/lobby/${roomCode}`);
            return;
          }
          const duration = res.room.timerDuration || BID_TIMER_SECONDS;
          let remaining = duration;
          if (res.room.isPaused && typeof res.room.pausedTimeLeft === 'number') {
            remaining = res.room.pausedTimeLeft;
          } else if (res.room.timerStart) {
            const elapsed = (Date.now() - res.room.timerStart) / 1000;
            remaining = Math.max(0, Math.ceil(duration - elapsed));
          }

          setRoomInfo({ hostId: res.room.hostId, isPaused: res.room.isPaused || false });
          setTeams(res.room.teams);
          setBidHistory(res.room.bidHistory || []);
          setAllPlayers(res.room.shuffledPlayers || []);
          setPlayerCount(res.room.shuffledPlayers?.length || 0);
          setCurrentPlayerIndex(res.room.currentPlayerIndex || 0);

          if (res.room.currentPlayerIndex < res.room.shuffledPlayers.length) {
            setCurrentPlayer(res.room.shuffledPlayers[res.room.currentPlayerIndex]);
            setCurrentBid(res.room.currentBid);
            setTimeLeft(Math.ceil(remaining));
          }
        }
        setLoading(false);
      });
    };

    s.on('connect', handleConnect);
    if (s.connected) {
      handleConnect();
    }

    s.on('bid-placed', (data: BidPlacedPayload) => {
      setCurrentBid(data.currentBid);
      setTimeLeft(data.timerDuration);
      if (typeof data.currentPlayerIndex === 'number') {
        setCurrentPlayerIndex(data.currentPlayerIndex);
      }
      if (data.bidHistory) {
        setBidHistory(data.bidHistory);
      }
    });

    s.on('next-player', (data: NextPlayerPayload) => {
      setCurrentPlayer(data.player);
      setCurrentBid(data.currentBid);
      setTimeLeft(data.timerDuration);
      setTeams(data.teams);
      if (typeof data.currentPlayerIndex === 'number') {
        setCurrentPlayerIndex(data.currentPlayerIndex);
      }
      if (data.bidHistory) {
        setBidHistory(data.bidHistory);
      }
      setError('');
    });

    s.on('auction-ended', () => {
      router.push(`/results/${roomCode}`);
    });

    s.on('team-passed', (data: TeamPassedPayload) => {
      setTeams(prev => prev.map(t => t.id === data.teamId ? { ...t, isActive: false } : t));
    });

    s.on('auction-paused', (data: AuctionPausedPayload) => {
      setRoomInfo(prev => ({ ...prev, isPaused: data.isPaused }));
      if (typeof data.timeLeft === 'number') {
        setTimeLeft(Math.ceil(data.timeLeft));
      }
      if (!data.isPaused && typeof data.timerDuration === 'number') {
        setTimeLeft(Math.ceil(data.timerDuration));
      }
    });

    s.on('room-updated', (updatedRoom: RoomUpdatedPayload) => {
      if (!updatedRoom) return;
      setTeams(updatedRoom.teams);
      setRoomInfo({
        hostId: updatedRoom.hostId,
        isPaused: updatedRoom.isPaused || false,
      });
    });

    return () => {
      s.off('connect', handleConnect);
      s.off('bid-placed');
      s.off('next-player');
      s.off('auction-ended');
      s.off('team-passed');
      s.off('auction-paused');
      s.off('room-updated');
    };
  }, [roomCode, router]);

  useEffect(() => {
    if (loading || roomInfo.isPaused) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          return 0; // Stop at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, roomInfo.isPaused]);

  const getBidIncrement = (amount: number) => {
    if (amount >= 20) {
      return 0.5;
    } else if (amount >= 5) {
      return 0.25;
    }
    return 0.2;
  };

  const getMinBid = () => {
    if (!currentPlayer) return 0;
    if (currentBid.amount === 0) return currentPlayer.basePrice;
    return currentBid.amount + getBidIncrement(currentBid.amount);
  };

  const isOverseasPlayer = (player: Player) => {
    return player.country && player.country.toLowerCase() !== 'india';
  };

  const getPlayerById = (id: string): Player | undefined => {
    return allPlayers.find(p => p.id === id);
  };

  const handlePause = () => {
    socket?.emit('pause-auction', { roomCode }, (res: AckResult) => {
      if (!res?.success) {
        setError(res?.error || 'Could not pause auction');
      }
    });
  };

  const handleResume = () => {
    socket?.emit('resume-auction', { roomCode }, (res: AckResult) => {
      if (!res?.success) {
        setError(res?.error || 'Could not resume auction');
      }
    });
  };

  const handleEndAuction = () => {
    if (confirm('Are you sure you want to end the auction?')) {
      socket?.emit('end-auction', { roomCode }, (res: AckResult) => {
        if (!res?.success) {
          setError(res?.error || 'Could not end auction');
        }
      });
    }
  };

  const handleBid = (amount: number) => {
    const team = teams.find(t => t.id === socket?.id);
    if (!team) return;

    if (!team.isActive) {
      setError('You passed on this player');
      return;
    }

    // Prevent own team from bidding twice in a row
    if (currentBid.bidderId === socket?.id) {
      setError('You already have the highest bid. Wait for another team to bid.');
      return;
    }

    if (amount < getMinBid()) {
      setError(`Minimum bid is ${getMinBid()} crore`);
      return;
    }

    if (amount > team.purse) {
      setError('Insufficient funds');
      return;
    }

    setError('');
    socket?.emit('place-bid', { amount, roomCode }, (res: AckResult) => {
      if (!res?.success) {
        setError(res?.error || 'Bid failed');
      }
    });
  };

  const handleCustomBid = () => {
    const amount = parseFloat(customBid);
    if (isNaN(amount)) {
      setError('Enter a valid amount');
      return;
    }
    handleBid(amount);
    setCustomBid('');
  };

  const handlePass = () => {
    socket?.emit('pass', { roomCode }, (res: AckResult) => {
      if (!res?.success) {
        setError(res?.error || 'Could not pass');
      }
    });
  };

  const myTeam = teams.find(t => t.id === socket?.id);
  const isMyBid = currentBid.bidderId === socket?.id;
  const cannotBid = !myTeam || !myTeam.isActive || isMyBid;

  const formatCr = (value: number) => {
    const rounded = Number(value.toFixed(2));
    return rounded >= 1 ? `${rounded} Cr` : `${Math.round(rounded * 100)}L`;
  };

  // Quick-bid targets always respect the server's current minimum increment.
  const quickBids = currentPlayer
    ? Array.from(new Set(
        [0.2, 0.5, 1, 2].map(increment => {
          const base = currentBid.amount === 0 ? currentPlayer.basePrice : currentBid.amount;
          return Math.max(Number((base + increment).toFixed(2)), getMinBid());
        })
      ))
    : [];

  const currentLotBids = currentPlayer
    ? bidHistory.filter(bid => bid.playerId === currentPlayer.id)
    : [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel px-10 py-8 text-center">
          <div className="mb-4 flex justify-center gap-2">
            {[0, 1, 2].map((block) => (
              <span
                key={block}
                className="blink inline-block h-4 w-4 border-2 border-[var(--shadow)] bg-[var(--mint)]"
                style={{ animationDelay: `${block * 0.18}s` }}
              />
            ))}
          </div>
          <PixelBall className="mx-auto h-10 w-10" />
          <p className="pixel-label pixel-label--gold mt-4 cursor">LOADING AUCTION_</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b-4 border-[var(--shadow)] bg-[#060c16]/92 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1500px] flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5 sm:px-5">
          <div className="flex items-center gap-2">
            <PixelBall className="h-6 w-6" />
            <span className="font-pixel text-[9px] text-[var(--gold)] sm:text-[11px]">IPL BID WARS</span>
          </div>

          <span className="hidden h-5 w-0.5 bg-[var(--line)] sm:block" />

          <span className="pixel-tag text-[var(--cyan)]">ROOM {roomCode}</span>

          <div className="flex items-center gap-2">
            <span className="pixel-label">LOT</span>
            <span className="font-terminal text-xl leading-none text-[var(--ink)]">
              {playerCount > 0 ? String(Math.min(currentPlayerIndex + 1, playerCount)).padStart(2, '0') : '00'}
              <span className="text-[var(--dim)]">/{playerCount}</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {socket?.id === roomInfo.hostId ? (
              <>
                <span className="pixel-label hidden items-center gap-1 sm:flex">
                  <span className="led led--gold" />
                  HOST
                </span>
                <button
                  onClick={roomInfo.isPaused ? handleResume : handlePause}
                  className={`pixel-btn pixel-btn--sm ${roomInfo.isPaused ? 'pixel-btn--mint' : 'pixel-btn--gold'}`}
                >
                  {roomInfo.isPaused ? '▶ RESUME' : 'II PAUSE'}
                </button>
                <button onClick={handleEndAuction} className="pixel-btn pixel-btn--sm pixel-btn--red">
                  ■ END
                </button>
              </>
            ) : (
              <span className="pixel-label flex items-center gap-2">
                <span className="led led--on" />
                LIVE
              </span>
            )}
          </div>
        </div>
      </header>

      {roomInfo.isPaused && (
        <div className="relative z-20 bg-[var(--red)] px-4 py-2 text-center">
          <p className="pixel-label blink" style={{ color: '#1a0308' }}>
            II AUCTION PAUSED — HOST HAS FROZEN THE CLOCK II
          </p>
        </div>
      )}

      <main className="mx-auto grid w-full max-w-[1500px] flex-1 grid-cols-1 items-start gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
        {/* Left: franchises */}
        <aside className="order-2 panel flex flex-col lg:order-1">
          <div className="panel__head">
            <span className="pixel-label pixel-label--gold flex items-center gap-2">
              <PixelStumps className="h-4 w-4" />
              FRANCHISE BOARD
            </span>
            <span className="pixel-label">{teams.length}/8</span>
          </div>

          <div className="scroll-retro space-y-2 overflow-y-auto p-2 lg:max-h-[calc(100vh-130px)]">
            {teams.map((team, index) => {
              const color = TEAM_COLORS[index % TEAM_COLORS.length];
              const isMe = team.id === socket?.id;
              const isLeading = team.id === currentBid.bidderId;
              const isOffline = team.connected === false;
              const expanded = expandedTeams.has(team.id);
              const pursePercent = Math.max(0, Math.min(100, (team.purse / 120) * 100));

              return (
                <motion.div
                  layout
                  key={team.id}
                  className={`team-card ${isLeading ? 'team-card--leading' : ''} ${isMe ? 'team-card--me' : ''} ${isOffline ? 'opacity-55' : ''}`}
                >
                  <div className="team-card__stripe" style={{ background: color }} />
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="avatar-pixel h-9 w-9 text-sm" style={{ background: color }}>
                        {team.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <h3 className="truncate font-pixel text-[10px] text-[var(--ink)]">{team.name}</h3>
                          {isMe && <span className="pixel-tag pixel-tag--xs text-[var(--gold)]">YOU</span>}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {isLeading && <span className="pixel-tag pixel-tag--xs text-[var(--mint)]">HIGH BID</span>}
                          {isOffline && <span className="pixel-tag pixel-tag--xs text-[var(--red)]">OFFLINE</span>}
                          {!team.isActive && <span className="pixel-tag pixel-tag--xs text-[var(--red)]">PASSED</span>}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between gap-2">
                      <span className="pixel-label">PURSE</span>
                      <span className={`font-terminal text-xl leading-none ${team.purse < 10 ? 'text-[var(--red)]' : 'text-[var(--gold)]'}`}>
                        {team.purse.toFixed(1)} CR
                      </span>
                    </div>
                    <div className="purse-bar mt-1">
                      <div
                        className="purse-bar__fill"
                        style={{
                          width: `${pursePercent}%`,
                          backgroundColor: team.purse < 10 ? 'var(--red)' : color,
                          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,.22) 0 2px, transparent 2px 7px)',
                        }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="pixel-label">{team.squad.length} PLAYERS</span>
                      {team.squad.length > 0 && (
                        <button
                          onClick={() => toggleTeamSquad(team.id)}
                          className="pixel-label text-[var(--cyan)] transition-colors hover:text-[var(--mint)]"
                        >
                          {expanded ? 'HIDE ▲' : 'SQUAD ▼'}
                        </button>
                      )}
                    </div>

                    {expanded && (
                      <div className="scroll-retro mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
                        {team.squad.map(playerId => {
                          const player = getPlayerById(playerId);
                          if (!player) return null;
                          return (
                            <div key={playerId} className="flex items-center gap-1.5">
                              <span
                                className="role-chip"
                                style={{ background: ROLE_COLORS[player.role] || 'var(--purple)', width: 26, height: 18, fontSize: 6 }}
                              >
                                {player.role}
                              </span>
                              <span className="truncate text-[15px] text-[var(--muted)]">{player.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </aside>

        {/* Center: auction stage */}
        <section className="order-1 flex min-w-0 flex-col items-center lg:order-2">
          <AnimatePresence mode="wait">
            {currentPlayer && (
              <motion.div
                key={currentPlayer.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -40 }}
                className="w-full max-w-2xl"
              >
                {/* Countdown */}
                <div className="panel panel--flat bg-[#060c16]/85 p-3 sm:p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="pixel-label flex items-center gap-2">
                        <span className={`led ${timeLeft <= 3 ? 'led--off' : 'led--on'}`} />
                        BID WINDOW
                      </p>
                      <p className={`score mt-1 ${timeLeft <= 3 ? 'text-[var(--red)] text-glow-red' : 'text-[var(--mint)] text-glow-mint'}`}>
                        {String(Math.max(timeLeft, 0)).padStart(2, '0')}
                        <span className="ml-1 font-terminal text-lg">SEC</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="pixel-label">LOT NUMBER</p>
                      <p className="mt-1 font-pixel text-[11px] text-[var(--gold)]">
                        {String(Math.min(currentPlayerIndex + 1, playerCount || 1)).padStart(2, '0')} / {playerCount}
                      </p>
                      <p className={`pixel-label mt-1 ${timeLeft <= 3 ? 'text-[var(--red)]' : 'text-[var(--dim)]'}`}>
                        {roomInfo.isPaused ? 'PAUSED' : timeLeft <= 3 ? 'CLOSING!' : 'BIDDING OPEN'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-10 gap-1">
                    {Array.from({ length: BID_TIMER_SECONDS }).map((_, index) => (
                      <div
                        key={index}
                        className={`timer-block ${index < timeLeft ? (timeLeft <= 3 ? 'timer-block--danger' : 'timer-block--on') : ''}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Player card */}
                <div className="panel mt-3 p-4 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div
                      className="avatar-pixel h-24 w-24 shrink-0 text-4xl sm:h-28 sm:w-28 sm:text-5xl"
                      style={{ background: ROLE_COLORS[currentPlayer.role] || 'var(--purple)' }}
                    >
                      {currentPlayer.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="pixel-tag"
                          style={{ color: ROLE_COLORS[currentPlayer.role] || 'var(--purple)' }}
                        >
                          {ROLE_LABELS[currentPlayer.role] || currentPlayer.role}
                        </span>
                        {isOverseasPlayer(currentPlayer) && (
                          <span className="pixel-tag text-[var(--pink)]">OVERSEAS</span>
                        )}
                        <span className="pixel-tag text-[var(--dim)]">{currentPlayer.country}</span>
                      </div>

                      <h2 className="mt-2 break-words font-pixel text-base leading-relaxed text-[var(--ink)] sm:text-2xl">
                        {currentPlayer.name}
                      </h2>
                      <p className="mt-2 text-[18px] text-[var(--muted)]">
                        LOT {currentPlayer.id.toUpperCase()} • BASE {currentPlayer.basePrice} CR
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="stat-box">
                      <div className="flex items-center justify-between border-b-2 border-[#1b2b45] pb-1">
                        <span className="pixel-label text-[var(--gold)]">IPL CAREER</span>
                        <span className="pixel-label">{currentPlayer.ipl.matches} MAT</span>
                      </div>
                      <StatRows stats={currentPlayer.ipl} role={currentPlayer.role} />
                    </div>
                    <div className="stat-box">
                      <div className="flex items-center justify-between border-b-2 border-[#1b2b45] pb-1">
                        <span className="pixel-label text-[var(--cyan)]">T20I CAREER</span>
                        <span className="pixel-label">{currentPlayer.t20i.matches} MAT</span>
                      </div>
                      <StatRows stats={currentPlayer.t20i} role={currentPlayer.role} />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="stat-box">
                      <p className="pixel-label">BASE PRICE</p>
                      <p className="mt-1 font-terminal text-3xl leading-none text-[var(--gold)]">
                        {currentPlayer.basePrice}
                        <span className="ml-1 text-base">CR</span>
                      </p>
                    </div>
                    <div className="stat-box" style={{ borderColor: '#1e7a62' }}>
                      <p className="pixel-label pixel-label--bright">CURRENT BID</p>
                      <motion.p
                        key={currentBid.amount}
                        initial={{ scale: 1.25 }}
                        animate={{ scale: 1 }}
                        className={`mt-1 font-terminal text-3xl leading-none ${currentBid.amount > 0 ? 'text-[var(--mint)]' : 'text-[var(--dim)]'}`}
                      >
                        {currentBid.amount > 0 ? `${currentBid.amount} CR` : 'NO BIDS'}
                      </motion.p>
                      <p className="mt-1 text-[16px] leading-tight text-[var(--gold)]">
                        {currentBid.bidderName || 'WAITING FOR A BID'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bid controls */}
                <div className="panel mt-3 p-4 sm:p-5">
                  {isMyBid && (
                    <div className="mb-3 border-2 border-[#8a6520] bg-[rgba(255,193,77,0.12)] px-3 py-2">
                      <p className="pixel-label pixel-label--gold">
                        ★ YOU HOLD THE HIGHEST BID — WAIT FOR A RAISE
                      </p>
                    </div>
                  )}
                  {myTeam && !myTeam.isActive && (
                    <div className="mb-3 border-2 border-[#7f2438] bg-[rgba(255,77,109,0.1)] px-3 py-2">
                      <p className="pixel-label pixel-label--red">✕ YOU PASSED ON THIS LOT</p>
                    </div>
                  )}

                  <p className="pixel-label mb-2 flex items-center gap-2">
                    <PixelCoin className="h-4 w-4" />
                    QUICK BID
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {quickBids.map((bidAmount) => (
                      <button
                        key={bidAmount}
                        onClick={() => handleBid(bidAmount)}
                        disabled={cannotBid || (myTeam ? myTeam.purse < bidAmount : true)}
                        className="pixel-btn pixel-btn--ghost bid-key"
                      >
                        <span className="pixel-label text-[var(--dim)]">BID</span>
                        <span className="bid-key__amount text-[var(--gold)]">{formatCr(bidAmount)}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="number"
                      value={customBid}
                      onChange={(e) => setCustomBid(e.target.value)}
                      placeholder={`MIN ${getMinBid()} CR`}
                      disabled={cannotBid}
                      className="pixel-input min-w-0 flex-1"
                      aria-label="Custom bid amount in crore"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCustomBid}
                        disabled={cannotBid}
                        className="pixel-btn pixel-btn--mint flex-1 sm:flex-none"
                      >
                        BID
                      </button>
                      <button
                        onClick={handlePass}
                        disabled={!myTeam || !myTeam.isActive}
                        className="pixel-btn pixel-btn--red flex-1 sm:flex-none"
                      >
                        PASS
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-3 border-2 border-[#7f2438] bg-[rgba(255,77,109,0.1)] px-3 py-2">
                      <p className="pixel-label pixel-label--red">! {error}</p>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-[#1d2e49] pt-2">
                    <p className="pixel-label">
                      MIN BID: <span className="text-[var(--gold)]">{getMinBid()} CR</span>
                    </p>
                    <p className="pixel-label">
                      PURSE LEFT: <span className="text-[var(--cyan)]">{myTeam ? myTeam.purse.toFixed(1) : '--'} CR</span>
                    </p>
                  </div>

                  {myTeam && myTeam.isActive && myTeam.purse < getMinBid() && (
                    <p className="pixel-label pixel-label--red mt-2">! INSUFFICIENT FUNDS TO BID</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right: bid feed */}
        <aside className="order-3 panel flex flex-col lg:order-3 lg:min-h-[420px]">
          <div className="panel__head">
            <span className="pixel-label pixel-label--gold flex items-center gap-2">
              <span className="led led--on" />
              LIVE BID FEED
            </span>
            <span className="pixel-label">{currentLotBids.length}</span>
          </div>

          <div className="scroll-retro flex-1 space-y-1.5 overflow-y-auto p-2 lg:max-h-[calc(100vh-130px)]">
            {currentLotBids.length === 0 ? (
              <div className="p-3 text-[18px] text-[var(--dim)]">
                <p className="text-[var(--mint)]">&gt; AUCTIONEER ONLINE</p>
                <p className="mt-1">&gt; AWAITING FIRST BID_</p>
                <p className="mt-4 text-[var(--dim)]">Every raise is logged here in real time.</p>
              </div>
            ) : (
              currentLotBids.slice(0, 30).map((bid, index) => (
                <motion.div
                  key={`${bid.playerId}-${bid.timestamp}-${index}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`feed-line ${index === 0 ? 'feed-line--latest' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-pixel text-[9px] text-[var(--cyan)]">{bid.teamName}</span>
                    <span className="font-terminal text-xl leading-none text-[var(--mint)]">{bid.amount} CR</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[15px] text-[var(--muted)]">{bid.playerName}</span>
                    <span className="text-[13px] text-[var(--dim)]">
                      {new Date(bid.timestamp).toLocaleTimeString([], { minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="border-t-2 border-[#1b2b45] p-3">
            <div className="flex justify-between gap-2">
              <span className="pixel-label">HIGHEST</span>
              <span className="font-terminal text-lg leading-none text-[var(--mint)]">
                {currentBid.amount > 0 ? `${currentBid.amount} CR` : '—'}
              </span>
            </div>
            <div className="mt-1 flex justify-between gap-2">
              <span className="pixel-label">BIDDER</span>
              <span className="truncate font-terminal text-lg leading-none text-[var(--gold)]">
                {currentBid.bidderName || '—'}
              </span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
