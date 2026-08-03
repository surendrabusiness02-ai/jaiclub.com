import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Trophy, Sparkles } from 'lucide-react';
import { playClickSound, playWinSound, playCoinSound } from '../../utils/audio';

interface CricketGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

const CRICKET_OPTIONS = [
  { id: '1run', label: '1 Run', mult: 1.8, icon: '⚡' },
  { id: '2run', label: '2 Runs', mult: 3.0, icon: '🏃' },
  { id: '4run', label: 'BOUNDARY (4)', mult: 5.0, icon: '💥' },
  { id: '6run', label: 'SIXER (6)', mult: 10.0, icon: '🚀' },
  { id: 'wicket', label: 'WICKET!', mult: 12.0, icon: '🎯' },
  { id: 'dot', label: 'DOT BALL (0)', mult: 2.2, icon: '🛡️' },
];

export const CricketGame: React.FC<CricketGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [selectedBet, setSelectedBet] = useState<string>('');
  const [betAmount, setBetAmount] = useState<number>(100);
  const [isBowling, setIsBowling] = useState<boolean>(false);
  const [lastOutcome, setLastOutcome] = useState<string | null>(null);

  const handleBowlNextBall = () => {
    if (!selectedBet) {
      alert('Please select a next-ball prediction!');
      return;
    }
    if (balance < betAmount) {
      alert('Insufficient balance! Please deposit to continue.');
      return;
    }

    playCoinSound();
    onUpdateBalance(balance - betAmount);
    setIsBowling(true);
    setLastOutcome(null);

    setTimeout(() => {
      // Pick outcome
      const rand = Math.random();
      let outcome = '1run';
      if (rand < 0.3) outcome = '1run';
      else if (rand < 0.5) outcome = '2run';
      else if (rand < 0.7) outcome = 'dot';
      else if (rand < 0.85) outcome = '4run';
      else if (rand < 0.94) outcome = '6run';
      else outcome = 'wicket';

      setIsBowling(false);
      setLastOutcome(outcome);

      const opt = CRICKET_OPTIONS.find((o) => o.id === outcome);
      const isWin = outcome === selectedBet;

      if (isWin && opt) {
        const payout = Math.round(betAmount * opt.mult);
        onUpdateBalance(balance + payout);
        playWinSound();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
        onAddBetRecord('Cricket Live', betAmount, payout, true, `Won ${opt.label} (x${opt.mult})`);
      } else {
        onAddBetRecord('Cricket Live', betAmount, 0, false, `Ball resulted in ${opt?.label}`);
      }
    }, 1800);
  };

  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center gap-1 bg-purple-950/70 border border-purple-700/50 rounded-xl px-3 py-1.5 text-xs text-purple-200 font-bold hover:bg-purple-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lobby
        </button>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 px-3 py-1 rounded-full">
          <Trophy className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-black text-emerald-300">IPL LIVE CRICKET BET</span>
        </div>
      </div>

      {/* Cricket Scoreboard Banner */}
      <div className="bg-gradient-to-r from-[#06331a] via-[#0d542b] to-[#042412] border-2 border-emerald-500/50 rounded-2xl p-4 shadow-2xl mb-4 relative overflow-hidden text-center">
        <div className="flex items-center justify-between text-xs font-bold text-emerald-300 mb-2">
          <span>INDIA VS AUSTRALIA</span>
          <span className="bg-red-600 text-white px-2 py-0.5 rounded text-[10px] animate-pulse">● LIVE 19.4 OVER</span>
        </div>

        <div className="text-3xl font-black text-white tracking-wider my-1">
          IND 184 / 4 <span className="text-sm font-normal text-emerald-200">(19.4 OV)</span>
        </div>

        <div className="text-xs text-emerald-200 font-medium bg-black/40 py-1.5 rounded-lg border border-emerald-500/30">
          Bowler: M. Starc 🏏 Batter: V. Kohli (88* off 44)
        </div>

        {isBowling && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 animate-pulse">
            <span className="text-3xl">🏏</span>
            <span className="text-sm font-black text-emerald-300 tracking-widest mt-1">BOWLING NEXT BALL...</span>
          </div>
        )}
      </div>

      {/* Outcome Toast */}
      {lastOutcome && (
        <div className="bg-purple-900 border border-purple-500 p-3 rounded-xl mb-4 text-center">
          <span className="text-xs font-bold text-purple-200 block">RESULT OF PREVIOUS BALL:</span>
          <span className="text-xl font-black text-amber-300">
            {CRICKET_OPTIONS.find((o) => o.id === lastOutcome)?.icon}{' '}
            {CRICKET_OPTIONS.find((o) => o.id === lastOutcome)?.label}
          </span>
        </div>
      )}

      {/* Options Grid */}
      <div className="bg-[#150d42] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <h3 className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-3">
          PREDICT NEXT BALL OUTCOME:
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {CRICKET_OPTIONS.map((opt) => {
            const isSel = selectedBet === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  playClickSound();
                  setSelectedBet(opt.id);
                }}
                className={`p-3 rounded-xl font-black text-xs flex items-center justify-between border transition-all cursor-pointer ${
                  isSel
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-amber-300 ring-4 ring-emerald-400/40 scale-105'
                    : 'bg-purple-950/70 border-purple-800/50 text-purple-200 hover:bg-purple-900'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
                <span className="text-amber-300 font-mono">x{opt.mult}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bet Box */}
      <div className="bg-[#150d42] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-purple-300">BET AMOUNT</span>
          <div className="flex gap-1.5">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  playClickSound();
                  setBetAmount(amt);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  betAmount === amt
                    ? 'bg-amber-400 text-purple-950 border-amber-300'
                    : 'bg-purple-950/60 text-purple-200 border-purple-800/40'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleBowlNextBall}
          disabled={!selectedBet || isBowling}
          className={`w-full py-4 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
            selectedBet && !isBowling
              ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-purple-950 shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isBowling ? 'BOWLING...' : `CONFIRM NEXT BALL BET (₹${betAmount})`}
        </button>
      </div>
    </div>
  );
};
