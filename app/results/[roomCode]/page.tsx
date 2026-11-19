'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSocket, getClientId } from '../../../lib/socket';
import { PixelBall, PixelCoin, PixelTrophy } from '@/components/PixelArt';

interface Team {
  id: string;
  name: string;
  purse: number;
  squad: string[];
  isActive: boolean;
}

interface PlayerStats {
  matches?: number;
  runs?: number;
  wickets?: number;
  avg?: number;
  sr?: number;
  economy?: number;
  fifties?: number;
  hundreds?: number;
  bowlAvg?: number;
  bowlSr?: number;
}

interface SoldPlayer {
  id: string;
  name: string;
  role: string;
  basePrice: number;
  country: string;
  ipl: PlayerStats;
  t20i: PlayerStats;
  soldTo: string | null;
  soldFor: number;
}

interface ResultsRoom {
  teams: Team[];
  soldPlayers: SoldPlayer[];
}

type RoomStateResponse =
  | { success: true; room: ResultsRoom }
  | { success: false; error?: string };

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

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.roomCode as string;

  const [teams, setTeams] = useState<Team[]>([]);
  const [soldPlayers, setSoldPlayers] = useState<SoldPlayer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSocket();

    if (!s.connected) {
      s.connect();
    }

    const handleConnect = () => {
      s.emit('get-room-state', { roomCode, clientId: getClientId() }, (res: RoomStateResponse) => {
        if (res.success) {
          setTeams(res.room.teams);
          setSoldPlayers(res.room.soldPlayers || []);
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

    return () => {
      s.off('connect', handleConnect);
    };
  }, [roomCode, router]);

  const getPlayerInfo = (playerId: string) => {
    return soldPlayers.find(p => p.id === playerId);
  };

  const calculateTeamStrength = (team: Team) => {
    let batting = 0;
    let bowling = 0;
    let allRounders = 0;
    let wk = 0;

    team.squad.forEach(playerId => {
      const player = getPlayerInfo(playerId);
      if (!player) return;

      if (player.role === 'BAT') {
        batting += player.ipl?.runs || 0;
      } else if (player.role === 'BOWL') {
        bowling += (player.ipl?.wickets || 0) * 10;
      } else if (player.role === 'AR') {
        allRounders += 1;
        batting += (player.ipl?.runs || 0) * 0.5;
        bowling += (player.ipl?.wickets || 0) * 5;
      } else if (player.role === 'WK') {
        wk += 1;
        batting += player.ipl?.runs || 0;
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
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="panel px-10 py-8 text-center">
          <PixelTrophy className="mx-auto h-12 w-12" />
          <p className="pixel-label pixel-label--gold mt-4 cursor">TALLYING THE SCORE_</p>
        </div>
      </div>
    );
  }

  const champion = rankedTeams[0];
  const maxScore = Math.max(1, ...rankedTeams.map(item => item.stats.total));
  const soldCount = soldPlayers.filter(player => player.soldTo).length;
  const unsoldPlayers = soldPlayers.filter(player => !player.soldTo);
  const podium = [
    { place: 2, entry: rankedTeams[1] },
    { place: 1, entry: rankedTeams[0] },
    { place: 3, entry: rankedTeams[2] },
  ];

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="pixel-label pixel-label--gold flex items-center justify-center gap-2">
            <span className="led led--gold" />
            GAME OVER • FINAL WHISTLE
            <span className="led led--gold" />
          </p>
          <h1 className="arcade-title mt-4 text-[clamp(2rem,7vw,4.25rem)] leading-[1.16]">
            AUCTION COMPLETE
          </h1>
          <p className="pixel-label mt-4">
            ROOM {roomCode} • {teams.length} FRANCHISES • {soldCount} PLAYERS SOLD
          </p>
        </motion.header>

        {champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="panel panel--gold mx-auto mt-8 max-w-2xl p-5 text-center sm:p-7"
          >
            <PixelTrophy className="mx-auto h-16 w-16" />
            <p className="pixel-label pixel-label--gold mt-3">AUCTION CHAMPION</p>
            <h2 className="mt-2 break-words font-pixel text-lg leading-relaxed text-[var(--gold)] text-glow-gold sm:text-2xl">
              {champion.team.name}
            </h2>
            <p className="mt-3 text-[20px] text-[var(--muted)]">
              {champion.team.squad.length} PLAYERS BOUGHT • SCORE{' '}
              <span className="text-[var(--mint)]">{champion.stats.total.toLocaleString()}</span>
            </p>
          </motion.div>
        )}

        {/* Podium */}
        {rankedTeams.length > 0 && (
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 items-end gap-2 sm:gap-3">
            {podium.map(({ place, entry }) => {
              if (!entry) return <div key={`podium-${place}`} />;
              const color = TEAM_COLORS[rankedTeams.indexOf(entry) % TEAM_COLORS.length];
              return (
                <motion.div
                  key={entry.team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + place * 0.08 }}
                  className="flex flex-col"
                >
                  <div className="panel panel--flat p-2 text-center">
                    <p className="pixel-label" style={{ color }}>
                      {place === 1 ? 'CHAMPION' : `PLACE ${place}`}
                    </p>
                    <p className="mt-1 break-words font-pixel text-[8px] leading-relaxed text-[var(--ink)]">
                      {entry.team.name}
                    </p>
                    <p className="mt-1 font-terminal text-xl leading-none" style={{ color }}>
                      {entry.stats.total.toLocaleString()}
                    </p>
                  </div>
                  <div className={`podium-stand podium-stand--${place} mt-2`}>{place}</div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Scoreboard */}
        <section className="panel mt-8">
          <div className="panel__head">
            <span className="pixel-label pixel-label--gold flex items-center gap-2">
              <PixelBall className="h-4 w-4" />
              FINAL SCOREBOARD
            </span>
            <span className="pixel-label">RANK / SCORE</span>
          </div>

          <div className="scroll-retro overflow-x-auto p-2 sm:p-3">
            {rankedTeams.map((item, index) => (
              <motion.div
                key={item.team.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`mb-2 grid grid-cols-[44px_minmax(0,1fr)] items-center gap-2 border-2 p-2 sm:grid-cols-[44px_minmax(0,1.4fr)_repeat(3,minmax(0,0.6fr))_minmax(0,0.8fr)] ${
                  index === 0
                    ? 'border-[#8a6520] bg-[rgba(255,193,77,0.06)]'
                    : 'border-[#1b2b45] bg-[#08101d]'
                }`}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center font-pixel text-xs text-[#071018]"
                  style={{ background: index === 0 ? 'var(--gold)' : TEAM_COLORS[index % TEAM_COLORS.length] }}
                >
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-pixel text-[9px] text-[var(--ink)]">{item.team.name}</p>
                  <div className="mt-1 h-1.5 w-full border border-black bg-[#060c16]">
                    <div
                      className="h-full"
                      style={{
                        width: `${Math.max(3, (item.stats.total / maxScore) * 100)}%`,
                        background: index === 0 ? 'var(--gold)' : 'var(--mint)',
                      }}
                    />
                  </div>
                  <p className="mt-1 text-[15px] text-[var(--dim)] sm:hidden">
                    SCORE {item.stats.total.toLocaleString()}
                  </p>
                </div>

                <div className="hidden text-center sm:block">
                  <p className="pixel-label">BAT</p>
                  <p className="font-terminal text-lg leading-none text-[var(--gold)]">{(item.stats.batting / 1000).toFixed(1)}K</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="pixel-label">BOWL</p>
                  <p className="font-terminal text-lg leading-none text-[var(--red)]">{item.stats.bowling}</p>
                </div>
                <div className="hidden text-center sm:block">
                  <p className="pixel-label">AR/WK</p>
                  <p className="font-terminal text-lg leading-none text-[var(--cyan)]">{item.stats.allRounders + item.stats.wk}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="pixel-label">SCORE</p>
                  <p className="font-terminal text-xl leading-none text-[var(--mint)]">{item.stats.total.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Squads */}
        <div className="mb-3 mt-10 flex items-center justify-between gap-3">
          <h2 className="pixel-label pixel-label--gold">SQUAD SHEETS</h2>
          <span className="pixel-label">{teams.length} TEAMS</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {teams.map((team, teamIndex) => {
            const totalSpent = 120 - team.purse;
            const color = TEAM_COLORS[teamIndex % TEAM_COLORS.length];

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel"
              >
                <div className="team-card__stripe" style={{ background: color, borderRadius: 0 }} />
                <div className="panel__head">
                  <span className="truncate font-pixel text-[10px] text-[var(--ink)]">{team.name}</span>
                  <span className="pixel-label pixel-label--gold">{totalSpent.toFixed(1)} CR SPENT</span>
                </div>

                <div className="p-3">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="pixel-label">PURSE LEFT</span>
                    <span className="font-terminal text-lg leading-none text-[var(--gold)]">{team.purse.toFixed(1)} CR</span>
                  </div>
                  <div className="purse-bar mb-3">
                    <div
                      className="purse-bar__fill"
                      style={{
                        width: `${Math.max(0, Math.min(100, (team.purse / 120) * 100))}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>

                  <div className="scroll-retro max-h-72 overflow-y-auto pr-1">
                    {team.squad.map((playerId) => {
                      const player = getPlayerInfo(playerId);
                      if (!player) return null;

                      return (
                        <div key={playerId} className="roster-row">
                          <span
                            className="role-chip"
                            style={{ background: ROLE_COLORS[player.role] || 'var(--purple)' }}
                          >
                            {player.role}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[18px] leading-tight text-[var(--ink)]">{player.name}</p>
                            <p className="text-[14px] leading-tight text-[var(--dim)]">{player.country}</p>
                          </div>
                          <span className="font-terminal text-lg leading-none text-[var(--mint)]">
                            {player.soldFor} CR
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {team.squad.length === 0 && (
                    <p className="pixel-label py-8 text-center text-[var(--dim)]">NO PLAYERS BOUGHT</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Unsold bin */}
        {unsoldPlayers.length > 0 && (
          <section className="panel panel--red mt-8">
            <div className="panel__head">
              <span className="pixel-label pixel-label--red">UNSOLD BIN</span>
              <span className="pixel-label">{unsoldPlayers.length} PLAYERS</span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3">
              {unsoldPlayers.map(player => (
                <span key={player.id} className="pixel-tag text-[var(--dim)]">
                  {player.name}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/')}
            className="pixel-btn pixel-btn--gold pixel-btn--lg w-full sm:w-auto sm:min-w-[280px]"
          >
            <PixelCoin className="h-5 w-5" />
            PLAY AGAIN
          </button>
          <p className="pixel-label cursor mt-4">INSERT COIN TO CONTINUE_</p>
        </div>
      </div>
    </div>
  );
}
