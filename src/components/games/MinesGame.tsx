import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Bomb, Gem, ShieldCheck } from 'lucide-react';
import { playClickSound, playWinSound, playCrashSound, playCoinSound } from '../../utils/audio';

interface MinesGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

export const MinesGame: React.FC<MinesGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [mineCount, setMineCount] = useState<number>(3);
  const [betAmount, setBetAmount] = useState<number>(100);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [minePositions, setMinePositions] = useState<number[]>([]);
  const [gemsFound, setGemsFound] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const startNewGame = () => {
    if (balance < betAmount) {
      alert('Insufficient balance! Please deposit to continue.');
      return;
    }

    playCoinSound();
    onUpdateBalance(balance - betAmount);

    // Randomly place mines
    const positions: number[] = [];
    while (positions.length < mineCount) {
      const rand = Math.floor(Math.random() * 25);
      if (!positions.includes(rand)) positions.push(rand);
    }

    setMinePositions(positions);
    setRevealed(Array(25).fill(false));
    setGemsFound(0);
    setCurrentMultiplier(1.0);
    setGameOver(false);
    setGameActive(true);
  };

  const handleTileClick = (index: number) => {
    if (!gameActive || revealed[index] || gameOver) return;

    const nextRevealed = [...revealed];
    nextRevealed[index] = true;
    setRevealed(nextRevealed);

    if (minePositions.includes(index)) {
      // Hit Mine! Boom!
      playCrashSound();
      setGameOver(true);
      setGameActive(false);
      // Reveal all mines
      const allRevealed = Array(25).fill(true);
      setRevealed(allRevealed);
      onAddBetRecord('Mines Sweeper', betAmount, 0, false, `Hit mine on tile ${index + 1}`);
    } else {
      // Safe Gem!
      playCoinSound();
      const nextGems = gemsFound + 1;
      setGemsFound(nextGems);

      // Multiplier increases as gems are found
      const newMult = parseFloat((1 + nextGems * (0.15 + mineCount * 0.05)).toFixed(2));
      setCurrentMultiplier(newMult);
    }
  };

  const handleCashout = () => {
    if (!gameActive || gemsFound === 0 || gameOver) return;
    const payout = Math.round(betAmount * currentMultiplier);
    onUpdateBalance(balance + payout);
    setGameActive(false);
    playWinSound();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onAddBetRecord('Mines Sweeper', betAmount, payout, true, `Cashed out @ ${currentMultiplier}x (${gemsFound} gems)`);
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

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/40 px-3 py-1 rounded-full">
          <Gem className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-black text-cyan-300">MINES SWEEPER</span>
        </div>
      </div>

      {/* Game Stats Header */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl mb-4 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block">
            Current Multiplier
          </span>
          <span className="text-2xl font-black text-amber-300 font-mono">
            {currentMultiplier}x
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest block">
            Next Payout
          </span>
          <span className="text-xl font-black text-emerald-400">
            ₹{Math.round(betAmount * currentMultiplier)}
          </span>
        </div>
      </div>

      {/* 5x5 Tiles Grid */}
      <div className="bg-[#150d42] border border-purple-800/40 rounded-2xl p-4 shadow-xl mb-4">
        <div className="grid grid-cols-5 gap-2">
          {Array(25)
            .fill(0)
            .map((_, i) => {
              const isRev = revealed[i];
              const isMine = minePositions.includes(i);

              return (
                <button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  disabled={!gameActive || isRev}
                  className={`h-14 rounded-xl font-black text-2xl flex items-center justify-center transition-all cursor-pointer shadow-md ${
                    isRev
                      ? isMine
                        ? 'bg-rose-950 border-2 border-rose-500 text-rose-400 animate-bounce'
                        : 'bg-emerald-950 border-2 border-emerald-500 text-emerald-300'
                      : 'bg-purple-900/80 hover:bg-purple-800 border border-purple-700/50 text-purple-300'
                  }`}
                >
                  {isRev ? (isMine ? '💣' : '💎') : ''}
                </button>
              );
            })}
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-[#150d42] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-purple-300">NUMBER OF MINES</span>
          <div className="flex gap-1.5">
            {[1, 3, 5, 10].map((m) => (
              <button
                key={m}
                onClick={() => {
                  playClickSound();
                  setMineCount(m);
                }}
                disabled={gameActive}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                  mineCount === m
                    ? 'bg-rose-500 text-white border-rose-300'
                    : 'bg-purple-950/60 text-purple-200 border-purple-800/40'
                }`}
              >
                💣 {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-purple-300">BET AMOUNT</span>
          <div className="flex gap-1.5">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  playClickSound();
                  setBetAmount(amt);
                }}
                disabled={gameActive}
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

        {gameActive ? (
          <button
            onClick={handleCashout}
            disabled={gemsFound === 0}
            className={`w-full py-4 rounded-xl font-black text-base tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
              gemsFound > 0
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 shadow-amber-500/30 animate-pulse'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {gemsFound > 0
              ? `CASH OUT ₹${Math.round(betAmount * currentMultiplier)} (${gemsFound} GEMS)`
              : 'CLICK TILES TO FIND GEMS'}
          </button>
        ) : (
          <button
            onClick={startNewGame}
            className="w-full py-4 rounded-xl font-black text-base tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 text-white shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            START GAME (₹{betAmount})
          </button>
        )}
      </div>
    </div>
  );
};
