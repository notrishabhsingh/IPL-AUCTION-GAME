'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSocket } from '../../../lib/socket';
import { getPlayerById } from '../../../lib/players';

interface Team {
  id: string;
  name: string;
  purse: number;
  squad: string[];
  isActive: boolean;
}

interface SoldPlayer {
  id: string;
  name: string;
  role: string;
  soldTo: string | null;
  soldFor: number;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [teams, setTeams] = useState<Team[]>([]);
  const [soldPlayers, setSoldPlayers] = useState<SoldPlayer[]>([]);
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
          setTeams(res.room.teams);
          setSoldPlayers(res.room.soldPlayers || []);
        }
        setLoading(false);
      });
    };

    if (s.connected) {
      handleConnect();
    } else {
      s.once('connect', handleConnect);
    }
  }, [roomCode]);

  const calculateTeamStrength = (team: Team) => {
    let batting = 0;
    let bowling = 0;
    let allRounders = 0;
    let wk = 0;

    team.squad.forEach(playerId => {
      const player = getPlayerById(playerId);
      if (!player) return;

      if (player.role === 'BAT') {
        batting += player.ipl.runs || 0;
      } else if (player.role === 'BOWL') {
        bowling += (player.ipl.wickets || 0) * 10;
      } else if (player.role === 'AR') {
        allRounders += 1;
        batting += (player.ipl.runs || 0) * 0.5;
        bowling += (player.ipl.wickets || 0) * 5;
      } else if (player.role === 'WK') {
        wk += 1;
        batting += player.ipl.runs || 0;
      }
    });

    const total = batting + bowling + (allRounders * 50) + (wk * 30);
    return { batting, bowling, allRounders, wk, total };
  };

  const rankedTeams = [...teams]
    .map(team => ({
      team,
      stats: calculateTeamStrength(team),
    }))
    .sort((a, b) => b.stats.total - a.stats.total);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-2xl text-[var(--accent-gold)]">Loading results...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gradient mb-4">AUCTION COMPLETE</h1>
          <p className="text-[var(--text-secondary)]">Room: {roomCode}</p>
        </motion.div>

        {/* Leaderboard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-[var(--accent-gold)]">Team Rankings</h2>
          <div className="space-y-4">
            {rankedTeams.map((item, index) => (
              <motion.div
                key={item.team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`glass-card rounded-xl p-6 ${index === 0 ? 'ring-2 ring-[var(--accent-gold)] glow-gold' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl
                      ${index === 0 ? 'bg-[var(--accent-gold)] text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-amber-700 text-white' : 'bg-[var(--bg-card)]'}`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{item.team.name}</h3>
                      <p className="text-[var(--text-muted)]">{item.team.squad.length} players • {item.team.purse.toFixed(1)} Cr remaining</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-[var(--text-muted)]">Batting</p>
                      <p className="font-bold text-[var(--accent-gold)]">{(item.stats.batting / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-muted)]">Bowling</p>
                      <p className="font-bold text-[var(--accent-purple)]">{item.stats.bowling}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-muted)]">AR/WK</p>
                      <p className="font-bold">{item.stats.allRounders + item.stats.wk}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--text-muted)]">Score</p>
                      <p className="font-bold text-[var(--accent-green)]">{item.stats.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Squads */}
        <div className="grid md:grid-cols-2 gap-6">
          {teams.map((team) => {
            const totalSpent = 120 - team.purse;
            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{team.name}</h3>
                  <span className="text-[var(--accent-gold)] font-bold">{totalSpent.toFixed(1)} Cr spent</span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {team.squad.map((playerId) => {
                    const player = getPlayerById(playerId);
                    const soldInfo = soldPlayers.find(p => p.id === playerId);
                    if (!player) return null;

                    return (
                      <div key={playerId} className="flex items-center justify-between bg-[var(--bg-secondary)] rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                            ${player.role === 'BAT' ? 'bg-blue-500' :
                              player.role === 'BOWL' ? 'bg-red-500' :
                              player.role === 'AR' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                            {player.role}
                          </div>
                          <div>
                            <p className="font-semibold">{player.name}</p>
                            <p className="text-xs text-[var(--text-muted)]">{player.country}</p>
                          </div>
                        </div>
                        <span className="text-[var(--accent-green)] font-bold">
                          {soldInfo?.soldFor} Cr
                        </span>
                      </div>
                    );
                  })}
                </div>

                {team.squad.length === 0 && (
                  <p className="text-[var(--text-muted)] text-center py-8">No players bought</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Unsold Players */}
        {soldPlayers.filter(p => !p.soldTo).length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12"
          >
            <h3 className="text-xl font-bold mb-4 text-[var(--accent-red)]">Unsold Players</h3>
            <div className="flex flex-wrap gap-2">
              {soldPlayers.filter(p => !p.soldTo).map((player) => (
                <div key={player.id} className="glass-card rounded-lg px-4 py-2 opacity-60">
                  {player.name}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/')}
            className="py-4 px-8 rounded-xl bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-light)] transition-all font-semibold text-lg"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}