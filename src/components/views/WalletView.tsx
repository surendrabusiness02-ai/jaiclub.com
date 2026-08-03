import React from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, ShieldCheck, History } from 'lucide-react';
import { UserProfile, TransactionRecord } from '../../types';
import { playClickSound } from '../../utils/audio';

interface WalletViewProps {
  user: UserProfile;
  transactions: TransactionRecord[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  user,
  transactions,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Wallet className="w-5 h-5 text-amber-400" />
        <h1 className="text-lg font-black text-white tracking-wide uppercase">
          MY JAICLUB WALLET
        </h1>
      </div>

      {/* Main Wallet Card */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border-2 border-amber-400/50 rounded-2xl p-5 shadow-2xl mb-4 text-center">
        <span className="text-xs font-bold text-purple-300 uppercase tracking-widest block">
          TOTAL AVAILABLE BALANCE
        </span>
        <div className="text-4xl font-black text-amber-300 my-2 tracking-tight drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]">
          ₹{user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => {
              playClickSound();
              onOpenDeposit();
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 font-black text-xs py-3 rounded-xl shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-4 h-4 stroke-[3]" />
            <span>DEPOSIT CASH</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenWithdraw();
            }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-xs py-3 rounded-xl border border-purple-400/40 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>WITHDRAW BANK</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#170e47] border border-purple-800/40 p-3 rounded-xl text-center">
          <span className="text-[10px] text-purple-300 uppercase block">Total Recharged</span>
          <span className="text-base font-black text-emerald-400">₹{user.totalRecharge}</span>
        </div>
        <div className="bg-[#170e47] border border-purple-800/40 p-3 rounded-xl text-center">
          <span className="text-[10px] text-purple-300 uppercase block">Total Withdrawn</span>
          <span className="text-base font-black text-cyan-300">₹{user.totalWithdraw}</span>
        </div>
      </div>

      {/* Transactions Log */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" /> TRANSACTION HISTORY
          </h2>
          <span className="text-[10px] text-purple-300 font-bold">RECENT 10</span>
        </div>

        <div className="space-y-2">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-white capitalize block">
                  {txn.type} ({txn.method})
                </span>
                <span className="text-[10px] text-purple-300">{txn.timestamp}</span>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-black block ${
                    txn.type === 'deposit' || txn.type === 'bonus' || txn.type === 'checkin'
                      ? 'text-emerald-400'
                      : 'text-amber-300'
                  }`}
                >
                  {txn.type === 'deposit' || txn.type === 'bonus' || txn.type === 'checkin' ? '+' : '-'}₹
                  {txn.amount}
                </span>
                <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded">
                  {txn.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
