import React from 'react';
import { TabType } from '../types';
import { Gamepad2, Gift, Wallet, User, Gem } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; isCenter?: boolean }[] = [
    { id: 'home', label: 'Home', icon: <Gamepad2 className="w-5 h-5" /> },
    { id: 'activity', label: 'Activity', icon: <Gift className="w-5 h-5" /> },
    { id: 'promotion', label: 'Promotion', icon: <Gem className="w-6 h-6 text-yellow-300" />, isCenter: true },
    { id: 'wallet', label: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
    { id: 'account', label: 'Account', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto px-2 pb-2">
      <div className="bg-gradient-to-r from-[#0e092d] via-[#1d1252] to-[#0e092d] border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-950/90 px-2 py-1.5 flex items-center justify-around backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative -mt-6">
                <button
                  onClick={() => {
                    playClickSound();
                    onSelectTab(tab.id);
                  }}
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 via-fuchsia-600 to-amber-400 p-0.5 shadow-xl shadow-fuchsia-600/50 flex flex-col items-center justify-center transition-all duration-300 transform active:scale-90 ${
                    isActive ? 'scale-110 ring-4 ring-amber-400/40' : 'hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full rounded-full bg-[#1b1049] flex flex-col items-center justify-center text-amber-300">
                    <span className="text-xl filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse">💎</span>
                    <span className="text-[9px] font-black tracking-tighter uppercase text-amber-300">
                      PROMO
                    </span>
                  </div>
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-amber-300 scale-105'
                  : 'text-purple-300/70 hover:text-purple-100'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-purple-800/50 border border-purple-500/40 shadow-inner' : ''
                }`}
              >
                {tab.icon}
              </div>
              <span className={`text-[10px] font-bold mt-0.5 tracking-tight ${isActive ? 'text-amber-300' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
