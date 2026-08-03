import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Sparkles, Gift } from 'lucide-react';
import { playClickSound, playSpinTickSound, playWinSound } from '../../utils/audio';

interface LuckyWheelGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

const SEGMENTS = [
  { label: '₹50', prize: 50, color: '#f59e0b' },
  { label: '₹100', prize: 100, color: '#8b5cf6' },
  { label: '₹10', prize: 10, color: '#10b981' },
  { label: '₹500', prize: 500, color: '#ec4899' },
  { label: '₹20', prize: 20, color: '#3b82f6' },
  { label: '₹200', prize: 200, color: '#f43f5e' },
  { label: '₹1,000', prize: 1000, color: '#eab308' },
  { label: '₹88', prize: 88, color: '#06b6d4' },
];

export const LuckyWheelGame: React.FC<LuckyWheelGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<number | null>(null);

  const handleSpinWheel = () => {
    if (isSpinning) return;

    playClickSound();
    setIsSpinning(true);
    setWonPrize(null);

    // Random winner index
    const winIdx = Math.floor(Math.random() * SEGMENTS.length);
    const prize = SEGMENTS[winIdx].prize;

    const extraSpins = 5 * 360; // 5 full turns
    const segmentDegree = 360 / SEGMENTS.length;
    const targetDegree = extraSpins + (SEGMENTS.length - winIdx) * segmentDegree - segmentDegree / 2;

    setRotation((prev) => prev + targetDegree);

    // Audio ticks during spin
    let count = 0;
    const tickInterval = setInterval(() => {
      playSpinTickSound();
      count++;
      if (count > 25) clearInterval(tickInterval);
    }, 150);

    setTimeout(() => {
      setIsSpinning(false);
      setWonPrize(prize);
      onUpdateBalance(balance + prize);
      playWinSound();
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      onAddBetRecord('Lucky Wheel', 0, prize, true, `Won ${SEGMENTS[winIdx].label} Reward`);
    }, 4000);
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

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-purple-500/20 border border-amber-500/40 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-black text-amber-300">DAILY LUCKY WHEEL</span>
        </div>
      </div>

      {/* Wheel Cabinet Container */}
      <div className="relative bg-[#160d45] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl mb-4 text-center overflow-hidden">
        {/* Pointer Arrow */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
          🔻
        </div>

        {/* Wheel SVG Canvas */}
        <div className="relative w-64 h-64 mx-auto my-4 flex items-center justify-center">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full transform transition-transform duration-[4000ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {SEGMENTS.map((seg, i) => {
              const angle = 360 / SEGMENTS.length;
              const startAngle = i * angle;
              const endAngle = (i + 1) * angle;

              const x1 = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
              const y1 = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
              const x2 = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
              const y2 = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              return (
                <g key={i}>
                  <path d={pathData} fill={seg.color} stroke="#100836" strokeWidth="1" />
                  <text
                    x="50"
                    y="22"
                    fill="#ffffff"
                    fontSize="5"
                    fontWeight="900"
                    textAnchor="middle"
                    transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Center Wheel Hub */}
          <div className="absolute w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-purple-950 font-black flex items-center justify-center text-xs shadow-xl border-2 border-white">
            SPIN
          </div>
        </div>

        {wonPrize !== null && (
          <div className="mt-2 bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 p-3 rounded-xl font-black text-sm shadow-lg animate-bounce">
            🎁 CONGRATULATIONS! YOU WON +₹{wonPrize}!
          </div>
        )}
      </div>

      {/* Spin Button */}
      <button
        onClick={handleSpinWheel}
        disabled={isSpinning}
        className={`w-full py-4 rounded-xl font-black text-base tracking-widest uppercase transition-all shadow-xl cursor-pointer ${
          isSpinning
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 shadow-amber-500/40 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isSpinning ? 'SPINNING WHEEL...' : 'SPIN FREE DAILY WHEEL! 🎡'}
      </button>
    </div>
  );
};
