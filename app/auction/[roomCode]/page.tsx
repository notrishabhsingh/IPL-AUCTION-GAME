'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { connectSocket, disconnectSocket, getSocket } from '../../../lib/socket';

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

export default function AuctionPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [currentBid, setCurrentBid] = useState<{ amount: number; bidderId: string | null; bidderName: string | null }>({ amount: 0, bidderId: null, bidderName: null });
  const [teams, setTeams] = useState<Team[]>([]);
  const [bidHistory, setBidHistory] = useState<BidHistory[]>([]);
  const [timeLeft, setTimeLeft] = useState(10);
  const [customBid, setCustomBid] = useState('');
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playerCount, setPlayerCount] = useState(0);
  const [soldPlayers, setSoldPlayers] = useState<any[]>([]);
  const [roomInfo, setRoomInfo] = useState<Room>({ hostId: '', isPaused: false });
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const s = getSocket();
    setSocket(s);

    if (!s.connected) {
      s.connect();
    }

    const handleConnect = () => {
      s.emit('get-room-state', (res: any) => {
        if (res.success) {
          if (res.room.status === 'finished') {
            router.push(`/results/${roomCode}`);
            return;
          }
          if (res.room.status === 'waiting') {
            router.push(`/lobby/${roomCode}`);
            return;
          }
          setRoomInfo({ hostId: res.room.hostId, isPaused: res.room.isPaused || false });
          setTeams(res.room.teams);
          setBidHistory(res.room.bidHistory || []);
          setAllPlayers(res.room.shuffledPlayers || []);
          setPlayerCount(res.room.shuffledPlayers?.length || 0);

          if (res.room.currentPlayerIndex < res.room.shuffledPlayers.length) {
            setCurrentPlayer(res.room.shuffledPlayers[res.room.currentPlayerIndex]);
            setCurrentBid(res.room.currentBid);
            setTimeLeft(res.room.timerDuration);
          }
        }
        setLoading(false);
      });
    };

    if (s.connected) {
      handleConnect();
    } else {
      s.once('connect', handleConnect);
    }

    s.on('bid-placed', (data: any) => {
      setCurrentBid(data.currentBid);
      setTimeLeft(data.timerDuration);
      if (data.bidHistory) {
        setBidHistory(data.bidHistory);
      }
    });

    s.on('next-player', (data: any) => {
      setCurrentPlayer(data.player);
      setCurrentBid(data.currentBid);
      setTimeLeft(data.timerDuration);
      setTeams(data.teams);
      if (data.bidHistory) {
        setBidHistory(data.bidHistory);
      }
      setError('');
    });

    s.on('auction-ended', () => {
      router.push(`/results/${roomCode}`);
    });

    s.on('team-passed', (data: any) => {
      setTeams(prev => prev.map(t => t.id === data.teamId ? { ...t, isActive: false } : t));
    });

    s.on('auction-paused', (data: any) => {
      setRoomInfo(prev => ({ ...prev, isPaused: data.isPaused }));
    });

    return () => {
      s.off('bid-placed');
      s.off('next-player');
      s.off('auction-ended');
      s.off('team-passed');
      s.off('auction-paused');
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

  useEffect(() => {
    if (timeLeft === 0 && !loading && currentPlayer && !roomInfo.isPaused) {
      // Give 3 seconds before auto-selling to see result
      const timeout = setTimeout(() => {
        socket?.emit('sell-player', { roomCode }, (res: any) => {
          if (res?.auctionEnded) {
            router.push(`/results/${roomCode}`);
          }
        });
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [timeLeft, loading, currentPlayer, socket, router, roomCode, roomInfo.isPaused]);

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
    console.log('Attempting to pause auction, socket id:', socket?.id, 'roomCode:', roomCode);
    socket?.emit('pause-auction', { roomCode }, (res: any) => {
      console.log('Pause response:', res);
      if (!res.success) {
        setError(res.error);
      }
    });
  };

  const handleResume = () => {
    console.log('Attempting to resume auction, socket id:', socket?.id, 'roomCode:', roomCode);
    socket?.emit('resume-auction', { roomCode }, (res: any) => {
      console.log('Resume response:', res);
      if (!res.success) {
        setError(res.error);
      }
    });
  };

  const handleEndAuction = () => {
    if (confirm('Are you sure you want to end the auction?')) {
      console.log('Attempting to end auction, socket id:', socket?.id, 'roomCode:', roomCode);
      socket?.emit('end-auction', { roomCode }, (res: any) => {
        console.log('End auction response:', res);
        if (!res.success) {
          setError(res.error);
        }
      });
    }
  };

  const handleBid = (amount: number) => {
    // Prevent own team from bidding twice in a row
    if (currentBid.bidderId === socket?.id) {
      setError('You already have the highest bid. Wait for another team to bid.');
      return;
    }

    if (amount < getMinBid()) {
      setError(`Minimum bid is ${getMinBid()} crore`);
      return;
    }

    const myTeam = teams.find(t => t.id === socket?.id);
    if (!myTeam) return;

    if (amount > myTeam.purse) {
      setError('Insufficient funds');
      return;
    }

    setError('');
    socket?.emit('place-bid', { amount, roomCode }, (res: any) => {
      if (!res.success) {
        setError(res.error);
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
    socket?.emit('pass', { roomCode }, (res: any) => {
      if (!res.success) {
        setError(res.error);
      }
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'BAT': return 'bg-blue-500';
      case 'BOWL': return 'bg-red-500';
      case 'AR': return 'bg-green-500';
      case 'WK': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'BAT': return 'Batsman';
      case 'BOWL': return 'Bowler';
      case 'AR': return 'All-rounder';
      case 'WK': return 'Wicket Keeper';
      default: return role;
    }
  };

  const myTeam = teams.find(t => t.id === socket?.id);
  const currentBidderTeam = teams.find(t => t.id === currentBid.bidderId);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-2xl text-[var(--accent-gold)]">Loading auction...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <div className="bg-[var(--bg-secondary)] p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--accent-gold)]">IPL BID WARS</h1>
          <p className="text-[var(--text-muted)] text-sm">Room: {roomCode}</p>
        </div>
        <div className="text-right">
          <p className="text-[var(--text-muted)]">Player</p>
          <p className="text-white font-semibold">{playerCount - (teams.reduce((acc, t) => acc + t.squad.length, 0) + soldPlayers.length)} / {playerCount}</p>
        </div>
        {socket?.id === roomInfo.hostId && (
          <div className="flex items-center gap-2 ml-4">
            {roomInfo.isPaused ? (
              <button
                onClick={handleResume}
                className="px-4 py-2 rounded-lg bg-[var(--accent-green)] hover:bg-[var(--accent-green)]/80 text-white font-semibold text-sm"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-4 py-2 rounded-lg bg-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/80 text-black font-semibold text-sm"
              >
                Pause
              </button>
            )}
            <button
              onClick={handleEndAuction}
              className="px-4 py-2 rounded-lg bg-[var(--accent-red)] hover:bg-[var(--accent-red)]/80 text-white font-semibold text-sm"
            >
              End Auction
            </button>
          </div>
        )}
      </div>

      {roomInfo.isPaused && (
        <div className="bg-[var(--accent-red)] text-white text-center py-2 font-semibold">
          Auction Paused
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Teams */}
        <div className="w-full lg:w-64 bg-[var(--bg-secondary)] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-[var(--accent-gold)]">Teams</h2>
          <div className="space-y-3">
            {teams.map((team) => (
              <motion.div
                key={team.id}
                layout
                className={`glass-card rounded-xl p-4 ${team.id === currentBid.bidderId ? 'ring-2 ring-[var(--accent-green)] glow-gold' : ''} ${team.id === socket?.id ? 'ring-2 ring-[var(--accent-purple)]' : ''} ${!team.isActive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{team.name}</h3>
                  <span className="text-xs text-[var(--text-muted)]">{team.squad.length} players</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[var(--text-secondary)]">Purse</span>
                  <span className={`font-bold ${team.purse < 10 ? 'text-[var(--accent-red)]' : 'text-[var(--accent-gold)]'}`}>
                    {team.purse.toFixed(1)} Cr
                  </span>
                </div>
                {team.squad.length > 0 && (
                  <div className="mt-2 text-xs">
                    <span className="text-[var(--text-muted)]">Squad: </span>
                    <div className="flex flex-col gap-1 mt-1">
                      {team.squad.slice(0, 8).map(playerId => {
                        const player = getPlayerById(playerId);
                        if (!player) return null;
                        const roleLabel = player.role === 'BAT' ? 'Batsman' : player.role === 'BOWL' ? 'Bowler' : player.role === 'WK' ? 'Wicket Keeper' : 'All-rounder';
                        return (
                          <div key={playerId} className="flex items-center gap-2">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              player.role === 'BAT' ? 'bg-blue-500/20 text-blue-400' :
                              player.role === 'BOWL' ? 'bg-red-500/20 text-red-400' :
                              player.role === 'WK' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {roleLabel}
                            </span>
                            <span className="text-[var(--text-secondary)] text-sm">{player.name}</span>
                          </div>
                        );
                      })}
                      {team.squad.length > 8 && (
                        <span className="px-1.5 py-0.5 text-[var(--text-muted)] text-xs">+{team.squad.length - 8} more</span>
                      )}
                    </div>
                  </div>
                )}
                {!team.isActive && (
                  <div className="mt-2 text-xs text-[var(--accent-red)]">Passed</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Center - Main Stage */}
        <div className="flex-1 flex flex-col p-4">
          <AnimatePresence mode="wait">
            {currentPlayer && (
              <motion.div
                key={currentPlayer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex-1 flex flex-col items-center"
              >
                {/* Timer */}
                <div className="mb-6 relative">
                  <svg className="w-24 h-24" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="var(--bg-card)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={timeLeft <= 3 ? 'var(--accent-red)' : 'var(--accent-purple)'}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={283}
                      strokeDashoffset={283 * (1 - timeLeft / 45)}
                      className="timer-ring transition-all"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl font-bold ${timeLeft <= 3 ? 'text-[var(--accent-red)]' : 'text-white'}`}>
                      {timeLeft}
                    </span>
                  </div>
                </div>

                {/* Player Card */}
                <div className="glass-card rounded-2xl p-8 w-full max-w-lg mb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Player Avatar */}
                    <div className="w-32 h-32 rounded-2xl bg-[var(--accent-purple)] flex items-center justify-center text-5xl font-bold">
                      {currentPlayer.name.charAt(0)}
                    </div>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-3xl font-bold">{currentPlayer.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(currentPlayer.role)}`}>
                          {getRoleLabel(currentPlayer.role)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                      <p className="text-[var(--text-muted)]">{currentPlayer.country}</p>
                      {isOverseasPlayer(currentPlayer) && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[var(--accent-green)] text-white">
                          Overseas
                        </span>
                      )}
                    </div>

                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-5">
                          <p className="text-[var(--text-muted)] mb-3 text-base font-medium">IPL Stats</p>
                          <p className="font-semibold text-lg">{currentPlayer.ipl.matches} matches</p>
                          {currentPlayer.role === 'BOWL' ? (
                            <div className="text-[var(--accent-gold)] space-y-2 mt-2">
                              <p className="text-base">{currentPlayer.ipl.wickets} wickets</p>
                              <p className="text-sm opacity-80">{currentPlayer.ipl.economy} economy</p>
                              <p className="text-sm opacity-80">{currentPlayer.ipl.bowlAvg || '-'} bowling avg</p>
                              <p className="text-sm opacity-80">{currentPlayer.ipl.bowlSr || '-'} bowling SR</p>
                            </div>
                          ) : (
                            <div className="text-[var(--accent-gold)] space-y-2 mt-2">
                              <p className="text-base">{currentPlayer.ipl.runs || 0} runs</p>
                              <p className="text-sm opacity-80">{currentPlayer.ipl.avg || 0} average</p>
                              <p className="text-sm opacity-80">{currentPlayer.ipl.sr || 0} strike rate</p>
                              {currentPlayer.ipl.fifties > 0 && <p className="text-sm opacity-80">{currentPlayer.ipl.fifties} fifties</p>}
                              {currentPlayer.ipl.hundreds > 0 && <p className="text-sm opacity-80">{currentPlayer.ipl.hundreds} hundreds</p>}
                              {currentPlayer.role === 'AR' && currentPlayer.ipl.wickets && (
                                <p className="text-green-400 mt-2 text-sm">{currentPlayer.ipl.wickets} wickets | {currentPlayer.ipl.economy} eco</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="bg-[var(--bg-secondary)] rounded-xl p-5">
                          <p className="text-[var(--text-muted)] mb-3 text-base font-medium">T20I Stats</p>
                          <p className="font-semibold text-lg">{currentPlayer.t20i.matches} matches</p>
                          {currentPlayer.role === 'BOWL' ? (
                            <div className="text-[var(--accent-gold)] space-y-2 mt-2">
                              <p className="text-base">{currentPlayer.t20i.wickets} wickets</p>
                              <p className="text-sm opacity-80">{currentPlayer.t20i.economy} economy</p>
                              <p className="text-sm opacity-80">{currentPlayer.t20i.bowlAvg || '-'} bowling avg</p>
                              <p className="text-sm opacity-80">{currentPlayer.t20i.bowlSr || '-'} bowling SR</p>
                            </div>
                          ) : (
                            <div className="text-[var(--accent-gold)] space-y-2 mt-2">
                              <p className="text-base">{currentPlayer.t20i.runs || 0} runs</p>
                              <p className="text-sm opacity-80">{currentPlayer.t20i.avg || 0} average</p>
                              <p className="text-sm opacity-80">{currentPlayer.t20i.sr || 0} strike rate</p>
                              {currentPlayer.t20i.fifties > 0 && <p className="text-sm opacity-80">{currentPlayer.t20i.fifties} fifties</p>}
                              {currentPlayer.t20i.hundreds > 0 && <p className="text-sm opacity-80">{currentPlayer.t20i.hundreds} hundreds</p>}
                              {currentPlayer.role === 'AR' && currentPlayer.t20i.wickets && (
                                <p className="text-green-400 mt-2 text-sm">{currentPlayer.t20i.wickets} wickets | {currentPlayer.t20i.economy} eco</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[var(--bg-card)]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[var(--text-muted)]">Base Price</p>
                        <p className="text-xl font-bold">{currentPlayer.basePrice} Cr</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[var(--text-muted)]">Current Bid</p>
                        <motion.p
                          key={currentBid.amount}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          className="text-3xl font-bold text-[var(--accent-green)]"
                        >
                          {currentBid.amount > 0 ? `${currentBid.amount} Cr` : 'No bids yet'}
                        </motion.p>
                        {currentBid.bidderName && (
                          <p className="text-[var(--accent-gold)] text-sm">{currentBid.bidderName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bid Controls */}
                <div className="w-full max-w-lg">
                  {currentBid.bidderId === socket?.id && (
                    <div className="mb-4 p-3 bg-[var(--accent-gold)]/20 rounded-xl text-center text-[var(--accent-gold)] font-semibold">
                      You have the highest bid! Wait for others to outbid.
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[
                      { label: '+20L', increment: 0.2 },
                      { label: '+50L', increment: 0.5 },
                      { label: '+1Cr', increment: 1 },
                      { label: '+2Cr', increment: 2 }
                    ].map(({ label, increment }) => {
                      const bidAmount = currentBid.amount === 0
                        ? currentPlayer.basePrice + increment
                        : currentBid.amount + increment;
                      const isMyBid = currentBid.bidderId === socket?.id;
                      return (
                        <button
                          key={label}
                          onClick={() => handleBid(bidAmount)}
                          className={`py-3 rounded-xl transition-colors font-semibold ${isMyBid ? 'bg-gray-600 cursor-not-allowed' : 'bg-[var(--bg-card)] hover:bg-[var(--accent-purple)]'}`}
                          disabled={isMyBid || (myTeam && myTeam.purse < bidAmount)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      value={customBid}
                      onChange={(e) => setCustomBid(e.target.value)}
                      placeholder={`Min: ${getMinBid()} Cr`}
                      disabled={currentBid.bidderId === socket?.id}
                      className="flex-1 p-4 rounded-xl bg-[var(--bg-card)] text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-purple)] disabled:opacity-50"
                    />
                    <button
                      onClick={handleCustomBid}
                      disabled={currentBid.bidderId === socket?.id}
                      className="py-4 px-6 rounded-xl bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-light)] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      BID
                    </button>
                    <button
                      onClick={handlePass}
                      className="py-4 px-6 rounded-xl border-2 border-[var(--accent-red)] text-[var(--accent-red)] hover:bg-[var(--accent-red)] hover:text-white transition-colors font-semibold"
                    >
                      PASS
                    </button>
                  </div>

                  {error && (
                    <p className="text-[var(--accent-red)] text-center">{error}</p>
                  )}

                  {myTeam && myTeam.purse < getMinBid() && (
                    <p className="text-[var(--accent-red)] text-center">Insufficient funds to bid!</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Bid History */}
        <div className="w-full lg:w-72 bg-[var(--bg-secondary)] p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 text-[var(--accent-gold)]">Bid History</h2>
          <div className="space-y-2">
            {bidHistory.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center py-8">No bids yet</p>
            ) : (
              bidHistory.slice(0, 20).map((bid, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card rounded-lg p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{bid.teamName}</span>
                    <span className="text-[var(--accent-green)] font-bold">{bid.amount} Cr</span>
                  </div>
                  <p className="text-[var(--text-muted)] text-sm">{bid.playerName}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}