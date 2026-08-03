import React from 'react';
import { Download, Volume2, VolumeX, Plus, Bell } from 'lucide-react';
import { playClickSound, setSoundEnabled, isSoundEnabled } from '../utils/audio';

interface HeaderProps {
  balance: number;
  onOpenDeposit: () => void;
  language: 'EN' | 'HI';
  onToggleLanguage: () => void;
  onOpenSupport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  balance,
  onOpenDeposit,
  language,
  onToggleLanguage,
  onOpenSupport,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  const formattedBalance = balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#0d072b] via-[#1a0e4a] to-[#0d072b] border-b border-purple-900/50 shadow-lg px-3 py-2.5 max-w-md mx-auto">
      <div className="flex items-center justify-between gap-2">
        {/* Balance Display Pill */}
        <div className="flex items-center bg-gradient-to-r from-[#1b1448] to-[#2a1d6e] border border-violet-500/40 rounded-full pl-3 pr-1 py-1 shadow-inner shadow-purple-950/60">
          <span className="text-amber-400 font-bold text-sm tracking-wide mr-1.5 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
            ₹{formattedBalance}
          </span>
          <button
            onClick={() => {
              playClickSound();
              onOpenDeposit();
            }}
            className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-purple-950 font-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md shadow-amber-500/30 cursor-pointer"
            title="Deposit Funds"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Center Brand Logo (JAICLUB) */}
        <div className="flex items-center gap-1.5 cursor-pointer group select-none">
          <div className="relative">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent filter drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              JAI
            </span>
            <span className="text-xl font-black italic tracking-wider text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
              CLUB
            </span>
            {/* Glowing Crown Icon */}
            <span className="absolute -top-2.5 left-1 text-xs animate-pulse">👑</span>
            {/* Tiny glowing star */}
            <span className="absolute -top-1 -right-2 text-[10px] text-yellow-300 animate-spin">✨</span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300 hover:text-white transition-colors"
            title={soundOn ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Download App Icon */}
          <button
            onClick={() => {
              playClickSound();
              alert('JaiClub Official App Download initiated! Installing APK...');
            }}
            className="flex items-center gap-1 bg-gradient-to-r from-lime-600 to-emerald-500 hover:from-lime-500 hover:to-emerald-400 text-white font-semibold text-xs px-2 py-1 rounded-lg border border-lime-400/30 shadow-sm cursor-pointer transition-transform active:scale-95"
            title="Download App"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Support Bell */}
          <button
            onClick={() => {
              playClickSound();
              onOpenSupport();
            }}
            className="relative p-1.5 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-300 hover:text-white"
            title="Customer Support"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              playClickSound();
              onToggleLanguage();
            }}
            className="flex items-center gap-1 bg-purple-900/60 border border-purple-700/50 rounded-lg px-2 py-1 text-xs text-purple-200 font-medium hover:bg-purple-800/70 cursor-pointer"
          >
            <span>{language === 'EN' ? '🇺🇸' : '🇮🇳'}</span>
            <span>{language}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
