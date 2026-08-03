import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Rocket, History, Play, CheckCircle } from 'lucide-react';
import { playClickSound, playWinSound, playCrashSound, playCoinSound } from '../../utils/audio';

interface AviatorGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

const HISTORY_PRESETS = [1.25, 4.80, 1.10, 15.42, 2.30, 8.90, 1.05, 3.12, 2.45];

export const AviatorGame: React.FC<AviatorGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(100);
  const [autoCashout, setAutoCashout] = useState<number | ''>(2.0);
  const [hasBet, setHasBet] = useState(false);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState(0);
  const [cashoutMultiplier, setCashoutMultiplier] = useState(0);
  const [history, setHistory] = useState<number[]>(HISTORY_PRESETS);
  const [waitingTime, setWaitingTime] = useState(5);

  const crashPointRef = useRef(2.0);
  const animationFrameRef = useRef<number | null>(null);

  // Flight Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Start round timer when in waiting state
  useEffect(() => {
    if (gameState === 'waiting') {
      const timer = setInterval(() => {
        setWaitingTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            startFlightRound();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const startFlightRound = () => {
    // Generate crash point (mostly between 1.1x and 15x, occasionally up to 50x)
    const rand = Math.random();
    let crash = 1.05 + Math.pow(rand, 2) * 15;
    if (Math.random() < 0.08) crash = 1.01; // Instant crash
    else if (Math.random() < 0.05) crash = 35 + Math.random() * 20;

    crashPointRef.current = parseFloat(crash.toFixed(2));
    setMultiplier(1.0);
    setCashedOut(false);
    setGameState('flying');
  };

  // Main flight animation loop
  useEffect(() => {
    if (gameState !== 'flying') return;

    let startTime = Date.now();

    const updateFlight = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      // Multiplier increases exponentially with time
      const currentMult = parseFloat((1 + Math.pow(elapsed / 2.5, 1.8)).toFixed(2));

      if (currentMult >= crashPointRef.current) {
        // Plane Crashed!
        setMultiplier(crashPointRef.current);
        setGameState('crashed');
        playCrashSound();

        // Save crash to history
        setHistory((prev) => [crashPointRef.current, ...prev.slice(0, 14)]);

        if (hasBet && !cashedOut) {
          onAddBetRecord('Aviator Crash', betAmount, 0, false, `Crashed @ ${crashPointRef.current}x`);
          setHasBet(false);
        }

        // Wait 3s then go back to waiting state
        setTimeout(() => {
          setGameState('waiting');
          setHasBet(false);
          setCashedOut(false);
        }, 3000);

        return;
      }

      setMultiplier(currentMult);

      // Auto Cashout check
      if (hasBet && !cashedOut && autoCashout && currentMult >= autoCashout) {
        executeCashout(currentMult);
      }

      animationFrameRef.current = requestAnimationFrame(updateFlight);
    };

    animationFrameRef.current = requestAnimationFrame(updateFlight);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, hasBet, cashedOut, autoCashout]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#271b54';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (gameState === 'flying' || gameState === 'crashed') {
      const progress = Math.min((multiplier - 1) / 10, 1);
      const endX = 40 + progress * (width - 80);
      const endY = height - 30 - Math.pow(progress, 0.8) * (height - 80);

      // Draw flight path curve
      ctx.beginPath();
      ctx.moveTo(20, height - 20);
      ctx.quadraticCurveTo(width / 2, height - 30, endX, endY);
      ctx.strokeStyle = gameState === 'crashed' ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Fill glow area under curve
      ctx.lineTo(endX, height - 20);
      ctx.lineTo(20, height - 20);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, gameState === 'crashed' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(245, 158, 11, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Draw Plane Icon at end point
      if (gameState === 'flying') {
        ctx.font = '24px sans-serif';
        ctx.fillText('✈️', endX - 12, endY + 8);
      }
    }
  }, [multiplier, gameState]);

  const handlePlaceBet = () => {
    if (balance < betAmount) {
      alert('Insufficient balance! Please deposit to continue.');
      return;
    }
    playCoinSound();
    onUpdateBalance(balance - betAmount);
    setHasBet(true);
    setCashedOut(false);
  };

  const executeCashout = (currentMult: number) => {
    if (cashedOut || !hasBet) return;
    const winPayout = Math.round(betAmount * currentMult);
    setCashedOut(true);
    setCashoutAmount(winPayout);
    setCashoutMultiplier(currentMult);
    onUpdateBalance(balance + winPayout);
    playWinSound();
    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
    onAddBetRecord('Aviator Crash', betAmount, winPayout, true, `Cashed out @ ${currentMult}x`);
  };

  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => {
            playClickSound();
            onBack();
          }}
          className="flex items-center gap-1 bg-purple-950/70 border border-purple-700/50 rounded-xl px-3 py-1.5 text-xs text-purple-200 font-bold hover:bg-purple-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Lobby
        </button>

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-red-600/30 to-amber-500/30 border border-red-500/40 px-3 py-1 rounded-full">
          <Rocket className="w-4 h-4 text-red-400 animate-bounce" />
          <span className="text-xs font-black text-red-300">AVIATOR CRASH GAME</span>
        </div>
      </div>

      {/* Flight Multiplier History Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-[#140d38] p-2 rounded-xl border border-purple-800/40 mb-3">
        <History className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        {history.map((h, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded text-[10px] font-black font-mono border ${
              h >= 10
                ? 'bg-purple-900 text-fuchsia-300 border-fuchsia-500'
                : h >= 2
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-rose-950 text-rose-300 border-rose-500/50'
            }`}
          >
            {h.toFixed(2)}x
          </span>
        ))}
      </div>

      {/* Main Aviator Canvas Display Stage */}
      <div className="relative w-full h-64 rounded-2xl bg-gradient-to-b from-[#110933] to-[#0a0520] border-2 border-red-500/40 overflow-hidden shadow-2xl mb-4 flex flex-col items-center justify-center">
        {/* Professional Jet Graphic Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity pointer-events-none"
          style={{ backgroundImage: "url('/src/assets/images/aviator_game_banner_1785778178491.jpg')" }}
        />
        <canvas ref={canvasRef} width={380} height={256} className="absolute inset-0 w-full h-full z-0" />

        {/* Center Multiplier overlay */}
        <div className="z-10 text-center select-none pointer-events-none">
          {gameState === 'waiting' && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold text-cyan-300 tracking-widest uppercase mb-1">
                NEXT ROUND IN
              </span>
              <span className="text-4xl font-black text-amber-300 font-mono animate-pulse">
                {waitingTime}s
              </span>
              <span className="text-[10px] text-gray-400 mt-1">PLACE YOUR BETS NOW</span>
            </div>
          )}

          {gameState === 'flying' && (
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-500 font-mono drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]">
                {multiplier.toFixed(2)}x
              </span>
              {hasBet && !cashedOut && (
                <span className="text-xs font-bold text-emerald-400 mt-2 bg-black/60 px-3 py-1 rounded-full border border-emerald-500/40">
                  Potential Win: ₹{Math.round(betAmount * multiplier)}
                </span>
              )}
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-xs font-black text-red-400 tracking-widest uppercase mb-1">
                FLEW AWAY!
              </span>
              <span className="text-4xl font-black text-red-500 font-mono drop-shadow-[0_0_20px_rgba(239,68,68,0.9)]">
                {multiplier.toFixed(2)}x
              </span>
            </div>
          )}
        </div>

        {/* Cashout Toast Popup overlay */}
        {cashedOut && (
          <div className="absolute top-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2 rounded-xl shadow-xl border border-emerald-300 flex items-center gap-2 z-20 animate-pulse">
            <CheckCircle className="w-5 h-5 text-white" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-100 block">Cashed Out @ {cashoutMultiplier.toFixed(2)}x</span>
              <span className="text-sm font-black text-white">+₹{cashoutAmount} WON!</span>
            </div>
          </div>
        )}
      </div>

      {/* Betting Control Box */}
      <div className="bg-[#150e42] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        {/* Bet Amount Row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-purple-300">BET AMOUNT (₹)</span>
          <span className="text-xs font-black text-amber-300">Current Balance: ₹{balance}</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 0))}
            disabled={hasBet && gameState === 'flying'}
            className="w-full bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-amber-400"
          />
          <div className="flex gap-1">
            {[50, 100, 200, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => {
                  playClickSound();
                  setBetAmount(amt);
                }}
                disabled={hasBet && gameState === 'flying'}
                className="px-2.5 py-2 rounded-xl text-xs font-bold bg-purple-900 border border-purple-700/40 text-purple-200 hover:bg-purple-800"
              >
                +{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Auto Cashout Multipliers Input */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-xs font-bold text-purple-300">AUTO CASHOUT (x)</span>
          <input
            type="number"
            step="0.1"
            value={autoCashout}
            onChange={(e) => setAutoCashout(parseFloat(e.target.value) || '')}
            disabled={hasBet && gameState === 'flying'}
            placeholder="e.g. 2.0"
            className="w-28 bg-purple-950/80 border border-purple-700/50 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-400 text-right"
          />
        </div>

        {/* Main Action Button */}
        {gameState === 'flying' && hasBet && !cashedOut ? (
          <button
            onClick={() => executeCashout(multiplier)}
            className="w-full py-4 rounded-xl font-black text-base tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 shadow-xl shadow-amber-500/40 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            CASH OUT (₹{Math.round(betAmount * multiplier)})
          </button>
        ) : (
          <button
            onClick={handlePlaceBet}
            disabled={hasBet || gameState === 'flying'}
            className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
              hasBet
                ? 'bg-emerald-600 text-white cursor-default'
                : gameState === 'flying'
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-lime-500 via-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 hover:scale-[1.02] active:scale-95'
            }`}
          >
            {hasBet
              ? 'BET PLACED - WAITING FOR FLIGHT'
              : `BET ₹${betAmount} FOR NEXT ROUND`}
          </button>
        )}
      </div>

      {/* Simulated Live Player Feed */}
      <div className="bg-[#150e42] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
        <h3 className="text-xs font-black text-purple-200 tracking-wider uppercase mb-2 flex items-center justify-between">
          <span>LIVE BETS FEED</span>
          <span className="text-emerald-400 text-[10px]">● 1,420 ONLINE</span>
        </h3>
        <div className="space-y-1.5 text-xs">
          {[
            { user: 'R***78', bet: 500, mult: '2.45x', won: 1225 },
            { user: 'K***09', bet: 1000, mult: '1.80x', won: 1800 },
            { user: 'A***55', bet: 200, mult: '5.10x', won: 1020 },
            { user: 'S***34', bet: 100, mult: '1.12x', won: 112 },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between bg-purple-950/40 px-3 py-1.5 rounded-lg">
              <span className="text-gray-300 font-medium">{row.user}</span>
              <span className="text-amber-300 font-bold">₹{row.bet}</span>
              <span className="text-cyan-300 font-mono font-bold">{row.mult}</span>
              <span className="text-emerald-400 font-bold">+₹{row.won}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
