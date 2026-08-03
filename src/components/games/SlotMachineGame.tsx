import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, Trophy } from 'lucide-react';
import { playClickSound, playSpinTickSound, playWinSound, playCoinSound } from '../../utils/audio';

interface SlotMachineGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

const SYMBOLS = [
  { id: '777', icon: '7️⃣', name: '777 Jackpot', mult: 50 },
  { id: 'BAR', icon: '🎰', name: 'Golden Bar', mult: 25 },
  { id: 'DIAMOND', icon: '💎', name: 'Diamond', mult: 15 },
  { id: 'BELL', icon: '🔔', name: 'Golden Bell', mult: 10 },
  { id: 'CHERRY', icon: '🍒', name: 'Cherry', mult: 5 },
  { id: 'LEMON', icon: '🍋', name: 'Lemon', mult: 2 },
];

export const SlotMachineGame: React.FC<SlotMachineGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [reels, setReels] = useState<number[]>([0, 0, 0]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [betAmount, setBetAmount] = useState(100);
  const [lastWin, setLastWin] = useState(0);

  const spinSlots = () => {
    if (balance < betAmount) {
      alert('Insufficient balance! Please deposit to continue.');
      return;
    }

    playCoinSound();
    onUpdateBalance(balance - betAmount);
    setIsSpinning(true);
    setLastWin(0);

    // Play spinning ticks
    let ticks = 0;
    const tickInterval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
        Math.floor(Math.random() * SYMBOLS.length),
      ]);
      playSpinTickSound();
      ticks++;
      if (ticks > 15) {
        clearInterval(tickInterval);
        resolveSpin();
      }
    }, 100);
  };

  const resolveSpin = () => {
    const finalReels = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
    setReels(finalReels);
    setIsSpinning(false);

    // Check winning combinations
    const r1 = finalReels[0];
    const r2 = finalReels[1];
    const r3 = finalReels[2];

    let payout = 0;
    let winDetails = 'No Match';

    if (r1 === r2 && r2 === r3) {
      // 3 of a kind match!
      const sym = SYMBOLS[r1];
      payout = betAmount * sym.mult;
      winDetails = `TRIPLE ${sym.name} (x${sym.mult})`;
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
      // 2 of a kind match
      const matchedIdx = r1 === r2 ? r1 : r3;
      const sym = SYMBOLS[matchedIdx];
      payout = Math.round(betAmount * (sym.mult / 3));
      winDetails = `DOUBLE ${sym.name}`;
    }

    if (payout > 0) {
      setLastWin(payout);
      onUpdateBalance(balance + payout);
      playWinSound();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onAddBetRecord('777 Mega Slot', betAmount, payout, true, winDetails);
    } else {
      onAddBetRecord('777 Mega Slot', betAmount, 0, false, winDetails);
    }
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

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-rose-500/20 to-amber-500/20 border border-rose-500/40 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-black text-rose-300">777 FORTUNE SLOTS</span>
        </div>
      </div>

      {/* Slot Machine Display Cabinet */}
      <div className="relative bg-gradient-to-b from-[#2d071a] via-[#4a0a2c] to-[#1a030f] border-4 border-amber-400/60 rounded-3xl p-5 shadow-2xl mb-4 text-center">
        {/* Lights */}
        <div className="flex justify-between mb-3 px-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 animate-ping" />
          <span className="text-xs font-black text-amber-300 tracking-widest uppercase">
            JAI CLUB MEGA JACKPOT ₹1,00,000
          </span>
          <span className="w-3 h-3 rounded-full bg-rose-400 animate-ping" />
        </div>

        {/* Reel Windows Grid */}
        <div className="grid grid-cols-3 gap-3 bg-[#0a0207] p-4 rounded-2xl border-2 border-amber-500/40 shadow-inner">
          {reels.map((symbolIdx, i) => (
            <div
              key={i}
              className={`h-28 rounded-xl bg-gradient-to-b from-[#1f0914] via-[#3d1228] to-[#1f0914] border-2 border-amber-400/40 flex flex-col items-center justify-center text-5xl shadow-lg transition-transform ${
                isSpinning ? 'animate-bounce' : ''
              }`}
            >
              <span>{SYMBOLS[symbolIdx].icon}</span>
              <span className="text-[10px] font-bold text-amber-300 mt-1 uppercase">
                {SYMBOLS[symbolIdx].id}
              </span>
            </div>
          ))}
        </div>

        {/* Win Alert */}
        {lastWin > 0 && (
          <div className="mt-4 bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 p-3 rounded-xl font-black text-base shadow-lg animate-bounce">
            🎉 BIG WIN! +₹{lastWin} WON!
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-[#180e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-purple-300">SPIN BET (₹)</span>
          <div className="flex gap-1.5">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  playClickSound();
                  setBetAmount(amt);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
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
          onClick={spinSlots}
          disabled={isSpinning}
          className={`w-full py-4 rounded-xl font-black text-base tracking-widest uppercase transition-all shadow-xl cursor-pointer ${
            isSpinning
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500 text-purple-950 shadow-rose-500/30 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isSpinning ? 'SPINNING REELS...' : `SPIN NOW (₹${betAmount})`}
        </button>
      </div>

      {/* Paytable */}
      <div className="bg-[#180e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
        <h3 className="text-xs font-black text-amber-300 tracking-wider uppercase mb-2 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> PAYTABLE MULTIPLIERS
        </h3>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {SYMBOLS.map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-800/30">
              <span className="flex items-center gap-1.5">
                <span>{s.icon}</span>
                <span className="text-gray-200 font-bold">{s.name}</span>
              </span>
              <span className="text-amber-400 font-black">x{s.mult}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
