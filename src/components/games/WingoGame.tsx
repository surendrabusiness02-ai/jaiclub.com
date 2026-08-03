import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Clock, History, Trophy, Sparkles } from 'lucide-react';
import { WingoBet, WingoPeriodResult } from '../../types';
import { playClickSound, playWinSound, playCoinSound } from '../../utils/audio';

interface WingoGameProps {
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
  onBack: () => void;
  onAddBetRecord: (gameName: string, amount: number, payout: number, isWin: boolean, details: string) => void;
}

const PRESET_AMOUNTS = [10, 50, 100, 500, 1000];
const MULTIPLIERS = [1, 5, 10, 20, 50];

export const WingoGame: React.FC<WingoGameProps> = ({
  balance,
  onUpdateBalance,
  onBack,
  onAddBetRecord,
}) => {
  const [period, setPeriod] = useState('2026080310045');
  const [timeLeft, setTimeLeft] = useState(42);
  const [selectedType, setSelectedType] = useState<'color' | 'number' | 'size' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [baseAmount, setBaseAmount] = useState<number>(10);
  const [multiplier, setMultiplier] = useState<number>(1);
  const [myBets, setMyBets] = useState<WingoBet[]>([]);

  // Period Result History
  const [history, setHistory] = useState<WingoPeriodResult[]>([
    { period: '2026080310044', number: 7, colors: ['green'], size: 'big', timestamp: '10:04 AM' },
    { period: '2026080310043', number: 0, colors: ['red', 'violet'], size: 'small', timestamp: '10:03 AM' },
    { period: '2026080310042', number: 3, colors: ['green'], size: 'small', timestamp: '10:02 AM' },
    { period: '2026080310041', number: 8, colors: ['red'], size: 'big', timestamp: '10:01 AM' },
    { period: '2026080310040', number: 5, colors: ['green', 'violet'], size: 'big', timestamp: '10:00 AM' },
    { period: '2026080310039', number: 2, colors: ['red'], size: 'small', timestamp: '09:59 AM' },
  ]);

  // Timer loop
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Resolve period!
          resolveCurrentPeriod();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [period, myBets]);

  const resolveCurrentPeriod = () => {
    // Generate random outcome
    const winNum = Math.floor(Math.random() * 10);
    let colors: ('green' | 'violet' | 'red')[] = [];
    if (winNum === 0) colors = ['red', 'violet'];
    else if (winNum === 5) colors = ['green', 'violet'];
    else if (winNum % 2 === 0) colors = ['red'];
    else colors = ['green'];

    const size: 'big' | 'small' = winNum >= 5 ? 'big' : 'small';

    const newResult: WingoPeriodResult = {
      period,
      number: winNum,
      colors,
      size,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setHistory((prev) => [newResult, ...prev.slice(0, 19)]);

    // Next period
    const nextPeriodNum = BigInt(period) + 1n;
    setPeriod(nextPeriodNum.toString());

    // Resolve any active bets for this period
    const currentPeriodBets = myBets.filter((b) => b.period === period && !b.result);
    if (currentPeriodBets.length > 0) {
      let totalPayout = 0;
      let totalWon = false;

      const updatedBets = myBets.map((b) => {
        if (b.period !== period || b.result) return b;

        let isWin = false;
        let payoutMult = 0;

        if (b.type === 'color') {
          if (b.selection === 'green' && colors.includes('green')) {
            isWin = true;
            payoutMult = winNum === 5 ? 1.5 : 2;
          } else if (b.selection === 'red' && colors.includes('red')) {
            isWin = true;
            payoutMult = winNum === 0 ? 1.5 : 2;
          } else if (b.selection === 'violet' && colors.includes('violet')) {
            isWin = true;
            payoutMult = 4.5;
          }
        } else if (b.type === 'number') {
          if (parseInt(b.selection, 10) === winNum) {
            isWin = true;
            payoutMult = 9;
          }
        } else if (b.type === 'size') {
          if (b.selection.toLowerCase() === size) {
            isWin = true;
            payoutMult = 2;
          }
        }

        const payout = isWin ? Math.round(b.totalAmount * payoutMult) : 0;
        if (isWin) {
          totalWon = true;
          totalPayout += payout;
        }

        onAddBetRecord('Wingo 1M', b.totalAmount, payout, isWin, `${b.selection.toUpperCase()} (Period ${b.period})`);

        return {
          ...b,
          result: {
            number: winNum,
            colors,
            size,
            isWin,
            payout,
          },
        };
      });

      setMyBets(updatedBets);

      if (totalWon) {
        onUpdateBalance(balance + totalPayout);
        playWinSound();
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const totalBetCost = baseAmount * multiplier;

  const handlePlaceBet = () => {
    if (!selectedType || !selectedOption) {
      alert('Please select a Color, Number or Size to place your bet!');
      return;
    }
    if (timeLeft <= 5) {
      alert('Betting locked for current round! Please wait for next round in 5 seconds.');
      return;
    }
    if (balance < totalBetCost) {
      alert('Insufficient balance! Please deposit to continue playing.');
      return;
    }

    playCoinSound();
    onUpdateBalance(balance - totalBetCost);

    const newBet: WingoBet = {
      id: 'WB-' + Date.now().toString().slice(-6),
      period,
      type: selectedType,
      selection: selectedOption,
      amount: baseAmount,
      multiplier,
      totalAmount: totalBetCost,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMyBets((prev) => [newBet, ...prev]);
    setSelectedType(null);
    setSelectedOption('');
  };

  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Top Navigation */}
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

        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-purple-900/40 border border-amber-500/40 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span className="text-xs font-black text-amber-300">WINGO 1 MIN LOTTERY</span>
        </div>
      </div>

      {/* Header Countdown Card */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-950 border border-purple-500/40 rounded-2xl p-4 shadow-xl mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
              Period Number
            </span>
            <span className="text-lg font-black text-amber-300 tracking-wider">
              {period}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Time Remaining
            </span>
            <div className="flex items-center gap-1 mt-1">
              <span className="bg-black/60 border border-cyan-500/40 text-cyan-300 text-xl font-mono font-black px-2.5 py-1 rounded-lg">
                00
              </span>
              <span className="text-cyan-400 font-bold">:</span>
              <span
                className={`bg-black/60 border text-xl font-mono font-black px-2.5 py-1 rounded-lg ${
                  timeLeft <= 10
                    ? 'border-red-500 text-red-400 animate-pulse'
                    : 'border-cyan-500/40 text-cyan-300'
                }`}
              >
                {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </span>
            </div>
          </div>
        </div>

        {timeLeft <= 5 && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
            <span className="text-red-400 font-black text-sm tracking-widest uppercase animate-pulse">
              🔒 PERIOD LOCK - DRAWING RESULT...
            </span>
          </div>
        )}
      </div>

      {/* Color Betting Options */}
      <div className="bg-[#170e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <h3 className="text-xs font-bold text-purple-200 tracking-wider uppercase mb-3">
          1. Select Color (Payout x2 - x4.5)
        </h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              playClickSound();
              setSelectedType('color');
              setSelectedOption('green');
            }}
            className={`py-3 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer ${
              selectedType === 'color' && selectedOption === 'green'
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white ring-4 ring-emerald-400/50 scale-105'
                : 'bg-emerald-700/80 text-white hover:bg-emerald-600'
            }`}
          >
            GREEN <span className="text-[10px] block font-normal opacity-90">x2.0</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setSelectedType('color');
              setSelectedOption('violet');
            }}
            className={`py-3 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer ${
              selectedType === 'color' && selectedOption === 'violet'
                ? 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white ring-4 ring-fuchsia-400/50 scale-105'
                : 'bg-purple-700/80 text-white hover:bg-purple-600'
            }`}
          >
            VIOLET <span className="text-[10px] block font-normal opacity-90">x4.5</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setSelectedType('color');
              setSelectedOption('red');
            }}
            className={`py-3 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer ${
              selectedType === 'color' && selectedOption === 'red'
                ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white ring-4 ring-red-400/50 scale-105'
                : 'bg-rose-700/80 text-white hover:bg-rose-600'
            }`}
          >
            RED <span className="text-[10px] block font-normal opacity-90">x2.0</span>
          </button>
        </div>

        {/* Number Betting Grid (0 - 9) */}
        <h3 className="text-xs font-bold text-purple-200 tracking-wider uppercase mt-4 mb-2">
          2. Select Number (Payout x9.0)
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const isSelected = selectedType === 'number' && selectedOption === num.toString();
            let numBg = 'bg-gradient-to-tr from-emerald-600 to-green-500';
            if (num === 0) numBg = 'bg-gradient-to-tr from-purple-600 via-red-600 to-rose-500';
            else if (num === 5) numBg = 'bg-gradient-to-tr from-purple-600 via-emerald-600 to-green-500';
            else if (num % 2 === 0) numBg = 'bg-gradient-to-tr from-rose-600 to-red-500';

            return (
              <button
                key={num}
                onClick={() => {
                  playClickSound();
                  setSelectedType('number');
                  setSelectedOption(num.toString());
                }}
                className={`h-11 rounded-xl font-black text-lg text-white shadow-md flex flex-col items-center justify-center transition-all cursor-pointer ${numBg} ${
                  isSelected ? 'ring-4 ring-yellow-300 scale-110' : 'hover:scale-105 opacity-90'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Big / Small Option */}
        <h3 className="text-xs font-bold text-purple-200 tracking-wider uppercase mt-4 mb-2">
          3. Big / Small (Payout x2.0)
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              playClickSound();
              setSelectedType('size');
              setSelectedOption('big');
            }}
            className={`py-2.5 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer ${
              selectedType === 'size' && selectedOption === 'big'
                ? 'bg-amber-500 text-purple-950 ring-4 ring-amber-300 scale-105'
                : 'bg-amber-950/70 border border-amber-600/40 text-amber-300 hover:bg-amber-900/80'
            }`}
          >
            BIG (5-9) <span className="text-[10px] block font-normal">x2.0</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setSelectedType('size');
              setSelectedOption('small');
            }}
            className={`py-2.5 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer ${
              selectedType === 'size' && selectedOption === 'small'
                ? 'bg-cyan-500 text-purple-950 ring-4 ring-cyan-300 scale-105'
                : 'bg-cyan-950/70 border border-cyan-600/40 text-cyan-300 hover:bg-cyan-900/80'
            }`}
          >
            SMALL (0-4) <span className="text-[10px] block font-normal">x2.0</span>
          </button>
        </div>
      </div>

      {/* Bet Amount Control Box */}
      <div className="bg-[#170e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-purple-300">BET AMOUNT</span>
          <span className="text-xs font-black text-amber-300">
            Total Bet: ₹{totalBetCost}
          </span>
        </div>

        {/* Base Amount Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3">
          {PRESET_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => {
                playClickSound();
                setBaseAmount(amt);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                baseAmount === amt
                  ? 'bg-amber-400 text-purple-950 border-amber-300'
                  : 'bg-purple-950/60 text-purple-200 border-purple-800/40 hover:bg-purple-900'
              }`}
            >
              ₹{amt}
            </button>
          ))}
        </div>

        {/* Multipliers */}
        <div className="flex items-center justify-between gap-1.5 mb-4">
          <span className="text-xs font-bold text-purple-300">MULTIPLIER:</span>
          <div className="flex items-center gap-1">
            {MULTIPLIERS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  playClickSound();
                  setMultiplier(m);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  multiplier === m
                    ? 'bg-cyan-400 text-purple-950 border-cyan-300'
                    : 'bg-purple-950/60 text-purple-200 border-purple-800/40'
                }`}
              >
                X{m}
              </button>
            ))}
          </div>
        </div>

        {/* Place Bet Button */}
        <button
          onClick={handlePlaceBet}
          disabled={!selectedType || !selectedOption}
          className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
            selectedType && selectedOption
              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-purple-950 shadow-amber-500/30 hover:scale-[1.02] active:scale-95'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedOption
            ? `CONFIRM BET ${selectedOption.toUpperCase()} (₹${totalBetCost})`
            : 'SELECT COLOR OR NUMBER ABOVE'}
        </button>
      </div>

      {/* Period Draw History Table */}
      <div className="bg-[#170e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black text-white tracking-wider uppercase flex items-center gap-1.5">
            <History className="w-4 h-4 text-amber-400" /> Game History Trend
          </h3>
          <span className="text-[10px] text-purple-300 font-bold">LAST 20 DRAWS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-purple-800/60 text-purple-300 text-[10px] uppercase">
                <th className="py-2">Period</th>
                <th className="py-2 text-center">Number</th>
                <th className="py-2 text-center">Big/Small</th>
                <th className="py-2 text-right">Colors</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-900/40">
              {history.map((h) => (
                <tr key={h.period} className="hover:bg-purple-900/30">
                  <td className="py-2 font-mono text-[11px] text-gray-300">
                    {h.period.slice(-5)}
                  </td>
                  <td className="py-2 text-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-black/50 text-amber-300 font-black text-center leading-6 border border-purple-500/30">
                      {h.number}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        h.size === 'big' ? 'bg-amber-950 text-amber-300' : 'bg-cyan-950 text-cyan-300'
                      }`}
                    >
                      {h.size}
                    </span>
                  </td>
                  <td className="py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {h.colors.map((c, i) => (
                        <span
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            c === 'green'
                              ? 'bg-emerald-500'
                              : c === 'red'
                              ? 'bg-rose-500'
                              : 'bg-purple-500'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* My Bets Log */}
      {myBets.length > 0 && (
        <div className="bg-[#170e45] border border-purple-800/40 rounded-2xl p-4 shadow-lg">
          <h3 className="text-xs font-black text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-400" /> My Bets History
          </h3>
          <div className="space-y-2">
            {myBets.map((b) => (
              <div
                key={b.id}
                className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-300 uppercase">
                      {b.selection}
                    </span>
                    <span className="text-[10px] text-gray-400">({b.period.slice(-5)})</span>
                  </div>
                  <span className="text-[11px] text-purple-300 block">
                    Cost: ₹{b.totalAmount}
                  </span>
                </div>

                <div className="text-right">
                  {b.result ? (
                    b.result.isWin ? (
                      <span className="text-emerald-400 font-black text-xs block">
                        +₹{b.result.payout} (WIN)
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold text-xs block">₹0 (LOST)</span>
                    )
                  ) : (
                    <span className="text-amber-400 text-xs font-bold animate-pulse">
                      PENDING...
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
