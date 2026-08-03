import React from 'react';
import { GameCategory, GameId } from '../types';
import { playClickSound } from '../utils/audio';

interface GameItem {
  id: GameId;
  name: string;
  category: GameCategory;
  tag: string;
  winRate: string;
  bgGradient: string;
  borderColor: string;
  iconSvg: React.ReactNode;
}

interface GameCardGridProps {
  activeCategory: GameCategory;
  onLaunchGame: (gameId: GameId) => void;
}

const GAMES: GameItem[] = [
  {
    id: 'aviator',
    name: 'AVIATOR',
    category: 'popular',
    tag: 'HOT x1000',
    winRate: '98.5% WIN',
    bgGradient: 'from-[#3b0918] via-[#6d1326] to-[#24040d]',
    borderColor: 'border-red-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24 overflow-hidden rounded-xl">
        <img
          src="/src/assets/images/aviator_game_banner_1785778178491.jpg"
          alt="Aviator Professional"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-xl shadow-inner border border-red-500/30 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 text-[10px] font-black text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/40 backdrop-blur-sm">
          CRASH x1000
        </div>
      </div>
    ),
  },
  {
    id: 'wingo',
    name: 'WINGO 1M',
    category: 'lottery',
    tag: '1 MIN LOTTERY',
    winRate: 'HIGH MULTIPLIER',
    bgGradient: 'from-[#431407] via-[#9a3412] to-[#270903]',
    borderColor: 'border-amber-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24 gap-1">
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-green-500 to-emerald-300 flex items-center justify-center text-white font-black text-sm shadow-lg border border-white/40">
          7
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 flex items-center justify-center text-white font-black text-base shadow-xl border border-white/40 -mt-2">
          8
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center text-purple-950 font-black text-sm shadow-lg border border-amber-200">
          ₹
        </div>
      </div>
    ),
  },
  {
    id: 'cricket',
    name: 'CRICKET',
    category: 'sports',
    tag: 'IPL / T20',
    winRate: 'LIVE ODDS',
    bgGradient: 'from-[#062c19] via-[#14532d] to-[#041d10]',
    borderColor: 'border-emerald-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24">
        <div className="text-5xl filter drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]">
          🏏
        </div>
        <div className="absolute bottom-1 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40">
          IPL LIVE
        </div>
      </div>
    ),
  },
  {
    id: 'mines',
    name: 'MINES',
    category: 'minigames',
    tag: '99% CASH OUT',
    winRate: 'UNLIMITED',
    bgGradient: 'from-[#1e1b4b] via-[#312e81] to-[#0f0e26]',
    borderColor: 'border-indigo-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24 gap-2">
        <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.7)] animate-bounce">
          💎
        </span>
        <span className="text-3xl">💣</span>
      </div>
    ),
  },
  {
    id: 'slots',
    name: '777 SLOTS',
    category: 'slots',
    tag: 'JACKPOT ₹1,00,000',
    winRate: 'MEGA SPIN',
    bgGradient: 'from-[#4c0519] via-[#881337] to-[#2d020e]',
    borderColor: 'border-rose-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24">
        <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(244,63,94,0.8)]">
          🎰
        </div>
      </div>
    ),
  },
  {
    id: 'wheel',
    name: 'LUCKY WHEEL',
    category: 'popular',
    tag: 'FREE DAILY SPIN',
    winRate: '100% WIN',
    bgGradient: 'from-[#451a03] via-[#78350f] to-[#280f02]',
    borderColor: 'border-yellow-500/50',
    iconSvg: (
      <div className="relative flex items-center justify-center w-full h-24">
        <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] animate-spin-slow">
          🎡
        </div>
      </div>
    ),
  },
];

export const GameCardGrid: React.FC<GameCardGridProps> = ({
  activeCategory,
  onLaunchGame,
}) => {
  const filteredGames = GAMES.filter(
    (g) => activeCategory === 'popular' || g.category === activeCategory
  );

  return (
    <div className="my-3">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-amber-400 rounded-full" />
          <h2 className="text-sm font-black tracking-wide text-white uppercase">
            {activeCategory === 'popular' ? 'Popular Games' : `${activeCategory.toUpperCase()} GAMES`}
          </h2>
        </div>
        <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
          ALL {filteredGames.length} AVAILABLE
        </span>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            onClick={() => {
              playClickSound();
              onLaunchGame(game.id);
            }}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${game.bgGradient} border ${game.borderColor} p-3 shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer flex flex-col justify-between min-h-[175px]`}
          >
            {/* Top Tag & Win Badge */}
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full border border-amber-400/30">
                {game.tag}
              </span>
              <span className="text-[9px] font-extrabold text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded">
                {game.winRate}
              </span>
            </div>

            {/* Game Graphic */}
            <div className="my-1 group-hover:scale-110 transition-transform duration-300">
              {game.iconSvg}
            </div>

            {/* Bottom Title & Play Button */}
            <div className="z-10 mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide group-hover:text-amber-300 transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-[10px] text-gray-300 font-medium">JaiClub Official</p>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 font-black flex items-center justify-center text-xs shadow-md shadow-amber-400/30 group-hover:scale-110 transition-transform">
                  ▶
                </div>
              </div>
            </div>

            {/* Glowing Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};
