import React from 'react';
import { User, ShieldCheck, Headphones, History, Award, ChevronRight } from 'lucide-react';
import { UserProfile, BetRecord } from '../../types';
import { playClickSound } from '../../utils/audio';

interface AccountViewProps {
  user: UserProfile;
  bets: BetRecord[];
  onOpenSupport: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  user,
  bets,
  onOpenSupport,
}) => {
  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Profile Header Box */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-3xl flex items-center justify-center shadow-lg border-2 border-amber-200">
            {user.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white">{user.name}</h2>
              <span className="text-[10px] font-black text-purple-950 bg-amber-400 px-2 py-0.5 rounded-full">
                VIP {user.vipLevel}
              </span>
            </div>
            <p className="text-[11px] text-purple-300">ID: {user.id}</p>
            <p className="text-[11px] text-purple-300">{user.phone}</p>
          </div>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onOpenSupport();
          }}
          className="p-2.5 rounded-xl bg-purple-900/60 border border-purple-700/50 text-amber-300 hover:text-white"
          title="Customer Support"
        >
          <Headphones className="w-5 h-5" />
        </button>
      </div>

      {/* VIP Level Progress Bar */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-amber-300 uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> VIP LEVEL PROGRESS
          </span>
          <span className="text-[11px] font-bold text-purple-300">
            {user.vipExp} / 1000 EXP
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-purple-950 rounded-full overflow-hidden border border-purple-800/60 mb-2">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${(user.vipExp / 1000) * 100}%` }}
          />
        </div>
        <p className="text-[10px] text-purple-300 text-right">
          Recharge ₹650 more to reach <strong className="text-amber-300">VIP 2</strong>
        </p>
      </div>

      {/* Account Bet Records */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" /> RECENT BET LOGS
          </h2>
          <span className="text-[10px] text-purple-300 font-bold">TOTAL {bets.length}</span>
        </div>

        <div className="space-y-2">
          {bets.slice(0, 10).map((b) => (
            <div
              key={b.id}
              className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-white block">{b.gameName}</span>
                <span className="text-[10px] text-purple-300">{b.details}</span>
              </div>

              <div className="text-right">
                {b.isWin ? (
                  <span className="text-emerald-400 font-black block">+₹{b.payout}</span>
                ) : (
                  <span className="text-red-400 font-bold block">-₹{b.betAmount}</span>
                )}
                <span className="text-[9px] text-gray-400">{b.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Care Box */}
      <button
        onClick={() => {
          playClickSound();
          onOpenSupport();
        }}
        className="w-full bg-gradient-to-r from-purple-800 to-indigo-800 border border-purple-500/40 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg cursor-pointer hover:from-purple-700 hover:to-indigo-700 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <Headphones className="w-6 h-6 text-amber-400" />
          <div className="text-left">
            <span className="text-xs font-black uppercase block">24/7 Official Customer Service</span>
            <span className="text-[10px] text-purple-200">Need help with deposits or game rules? Chat now!</span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-purple-300" />
      </button>
    </div>
  );
};
