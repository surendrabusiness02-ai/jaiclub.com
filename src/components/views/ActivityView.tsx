import React from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Gift, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import { UserProfile } from '../../types';
import { playClickSound, playWinSound, playCoinSound } from '../../utils/audio';

interface ActivityViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenDeposit: () => void;
}

const CHECKIN_DAYS = [
  { day: 1, reward: 10, label: 'Day 1' },
  { day: 2, reward: 20, label: 'Day 2' },
  { day: 3, reward: 30, label: 'Day 3' },
  { day: 4, reward: 50, label: 'Day 4' },
  { day: 5, reward: 80, label: 'Day 5' },
  { day: 6, reward: 100, label: 'Day 6' },
  { day: 7, reward: 300, label: 'Day 7 VIP', chest: true },
];

export const ActivityView: React.FC<ActivityViewProps> = ({
  user,
  onUpdateUser,
  onOpenDeposit,
}) => {
  const todayStr = new Date().toISOString().slice(0, 10);
  const alreadyCheckedIn = user.lastCheckInDate === todayStr;

  const handleClaimCheckIn = () => {
    if (alreadyCheckedIn) {
      alert('You have already claimed today’s check-in reward! Come back tomorrow.');
      return;
    }

    const currentDayIdx = user.checkInStreak % 7;
    const rewardAmt = CHECKIN_DAYS[currentDayIdx].reward;

    playCoinSound();
    playWinSound();
    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });

    onUpdateUser({
      ...user,
      balance: user.balance + rewardAmt,
      lastCheckInDate: todayStr,
      checkInStreak: user.checkInStreak + 1,
    });
  };

  return (
    <div className="bg-[#0b0826] min-h-screen text-white p-3 max-w-md mx-auto pb-24">
      {/* Title */}
      <div className="flex items-center gap-2 mb-4">
        <Gift className="w-5 h-5 text-amber-400" />
        <h1 className="text-lg font-black text-white tracking-wide uppercase">
          ACTIVITY & BONUS REWARDS
        </h1>
      </div>

      {/* 7-Day Check-in Calendar */}
      <div className="bg-gradient-to-r from-[#170e47] via-[#241569] to-[#170e47] border border-purple-500/40 rounded-2xl p-4 shadow-xl mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> DAILY LOGIN REWARDS
            </h2>
            <p className="text-[10px] text-purple-200">
              Streak: <span className="text-white font-bold">{user.checkInStreak} Days</span>
            </p>
          </div>

          <button
            onClick={handleClaimCheckIn}
            disabled={alreadyCheckedIn}
            className={`px-4 py-2 rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer ${
              alreadyCheckedIn
                ? 'bg-purple-950/80 text-purple-400 border border-purple-800/40 cursor-default'
                : 'bg-gradient-to-r from-amber-400 to-yellow-300 text-purple-950 shadow-amber-400/30 hover:scale-105 active:scale-95'
            }`}
          >
            {alreadyCheckedIn ? 'CLAIMED TODAY' : 'CLAIM TODAY’S REWARD'}
          </button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-4 gap-2 my-2">
          {CHECKIN_DAYS.map((item, idx) => {
            const isCompleted = idx < (user.checkInStreak % 7) || (alreadyCheckedIn && idx === (user.checkInStreak % 7) - 1);
            const isCurrent = idx === (user.checkInStreak % 7) && !alreadyCheckedIn;

            return (
              <div
                key={item.day}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : isCurrent
                    ? 'bg-amber-950/80 border-amber-400 text-amber-300 animate-pulse ring-2 ring-amber-400/50'
                    : 'bg-purple-950/40 border-purple-800/40 text-purple-300'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{item.label}</span>
                <span className="text-xl my-1">{item.chest ? '🎁' : '🪙'}</span>
                <span className="text-xs font-black">+₹{item.reward}</span>
                {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Tasks Center */}
      <div className="bg-[#170e47] border border-purple-800/40 rounded-2xl p-4 shadow-lg mb-4">
        <h2 className="text-xs font-black text-purple-200 tracking-wider uppercase mb-3 flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-400" /> MISSION TASK CENTER
        </h2>

        <div className="space-y-2.5">
          {/* Task 1 */}
          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-white block">First Deposit Task</span>
              <span className="text-[10px] text-purple-300">Recharge ₹300+ to get ₹488 Extra Bonus</span>
            </div>
            <button
              onClick={() => {
                playClickSound();
                onOpenDeposit();
              }}
              className="bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-950 font-black text-[11px] px-3 py-1.5 rounded-lg hover:scale-105 active:scale-95"
            >
              RECHARGE
            </button>
          </div>

          {/* Task 2 */}
          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-white block">Play 5 Wingo Lottery Bets</span>
              <span className="text-[10px] text-purple-300">Reward: +₹50 Cash Chest</span>
            </div>
            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/60 px-2 py-1 rounded">
              3 / 5 DONE
            </span>
          </div>

          {/* Task 3 */}
          <div className="bg-purple-950/60 border border-purple-800/50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-xs font-black text-white block">Invite 1 Friend to Join</span>
              <span className="text-[10px] text-purple-300">Get ₹150 Instant Referral Cash</span>
            </div>
            <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded">
              ACTIVE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
