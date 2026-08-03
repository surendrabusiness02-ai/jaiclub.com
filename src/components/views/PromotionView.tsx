import React, { useState } from 'react';
import { Gem, Copy, Share2, Users, DollarSign, Award, Check } from 'lucide-react';
import { UserProfile } from '../../types';
import { playClickSound } from '../../utils/audio';

interface PromotionViewProps {
  user: UserProfile;
}

export const PromotionView: React.FC<PromotionViewProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const referralLink = `https://jaiclub.app/register?ref=${user.referralCode}`;

  const handleCopyLink = () => {
    playClickSound();
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Gem className="w-5 h-5 text-amber-400" />
        <h1 className="text-lg font-black text-white tracking-wide uppercase">
          AGENT PROMOTION & REVENUE
        </h1>
      </div>

      {/* Main Commission Overview Card */}
      <div className="bg-gradient-to-tr from-purple-950 via-indigo-900 to-purple-900 border-2 border-amber-400/50 rounded-2xl p-4 shadow-2xl mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-black/40 px-2.5 py-1 rounded-full border border-amber-400/30">
            👑 JAI CLUB SUPER AGENT
          </span>
          <span className="text-xs font-bold text-cyan-300">REF: {user.referralCode}</span>
        </div>

        <div className="my-2">
          <span className="text-xs text-purple-200 uppercase font-bold tracking-wider block">
            Yesterday's Total Commission
          </span>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
            ₹3,840.00
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-purple-800/60 text-center">
          <div>
            <span className="text-[10px] text-purple-300 uppercase block">Direct Invites</span>
            <span className="text-base font-black text-white">42</span>
          </div>
          <div>
            <span className="text-[10px] text-purple-300 uppercase block">Total Team</span>
            <span className="text-base font-black text-cyan-300">188</span>
          </div>
          <div>
            <span className="text-[10px] text-purple-300 uppercase block">Team Turn Over</span>
            <span className="text-base font-black text-amber-300">₹2.4L</span>
          </div>
        </div>
      </div>

      {/* Copy Referral Link Box */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <h2 className="text-xs font-black text-purple-200 tracking-wider uppercase mb-2">
          YOUR INVITATION LINK
        </h2>

        <div className="flex items-center gap-2 bg-purple-950/80 border border-purple-700/50 rounded-xl p-2.5">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="w-full bg-transparent text-xs font-mono text-purple-200 outline-none"
          />
          <button
            onClick={handleCopyLink}
            className="flex-shrink-0 bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-transform active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* 3-Tier Commission Ratio Matrix */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <h2 className="text-xs font-black text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> 3-TIER REBATE COMMISSION
        </h2>

        <div className="space-y-2 text-xs">
          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="font-black text-amber-300 block">Tier 1 Subordinates (Direct)</span>
              <span className="text-[10px] text-purple-300">0.6% of total betting turnover</span>
            </div>
            <span className="text-sm font-black text-emerald-400">0.6%</span>
          </div>

          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="font-black text-cyan-300 block">Tier 2 Subordinates</span>
              <span className="text-[10px] text-purple-300">0.3% of total betting turnover</span>
            </div>
            <span className="text-sm font-black text-cyan-400">0.3%</span>
          </div>

          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="font-black text-purple-300 block">Tier 3 Subordinates</span>
              <span className="text-[10px] text-purple-300">0.1% of total betting turnover</span>
            </div>
            <span className="text-sm font-black text-purple-400">0.1%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
