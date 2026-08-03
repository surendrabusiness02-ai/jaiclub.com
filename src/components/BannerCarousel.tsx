import React, { useState, useEffect } from 'react';
import { playClickSound } from '../utils/audio';

interface BannerCarouselProps {
  onClaimBonus: () => void;
}

const BANNERS = [
  {
    id: 1,
    title: 'FIRST DEPOSIT BONUS',
    amount: '₹488',
    subtext: 'UP TO ₹488 EXTRA CASH',
    badge: 'NEW USER BONUS',
    buttonText: 'Claim Bonus',
    bgGradient: 'from-violet-950 via-purple-900 to-indigo-950',
    accentColor: 'text-amber-300',
    icon: '💎',
  },
  {
    id: 2,
    title: 'VIP DAILY CASHBACK',
    amount: '1.2%',
    subtext: 'AUTOMATIC REBATE EVERY MIDNIGHT',
    badge: 'VIP SPECIAL',
    buttonText: 'View VIP Rewards',
    bgGradient: 'from-fuchsia-950 via-purple-900 to-blue-950',
    accentColor: 'text-cyan-300',
    icon: '👑',
  },
  {
    id: 3,
    title: 'REFER & EARN ₹50,000+',
    amount: '3-TIER',
    subtext: 'UNLIMITED TEAM COMMISSION',
    badge: 'AGENT PROGRAM',
    buttonText: 'Invite Friends',
    bgGradient: 'from-amber-950 via-purple-950 to-red-950',
    accentColor: 'text-yellow-400',
    icon: '🚀',
  },
];

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onClaimBonus }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[currentSlide];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-purple-500/30 shadow-xl shadow-purple-950/60 my-3">
      <div
        className={`w-full bg-gradient-to-r ${banner.bgGradient} p-4 text-white relative flex flex-col justify-between min-h-[155px] transition-all duration-700`}
      >
        {/* Decorative Background Glowing Orbs & Vault Graphic Effect */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Laser streaks */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-pulse pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-purple-400/30 text-[11px] font-bold text-amber-300">
            <span>{banner.icon}</span>
            <span>{banner.badge}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
              JAI CLUB OFFICIAL
            </span>
          </div>
        </div>

        {/* Content Row with 3D Vault / Cash Graphic */}
        <div className="flex items-center justify-between z-10 my-2">
          <div className="max-w-[65%]">
            <h3 className="text-xs font-bold tracking-widest text-purple-200 uppercase">
              {banner.title}
            </h3>
            <div className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)]">
              {banner.amount}
            </div>
            <p className="text-[11px] font-medium text-purple-200/90 mt-0.5">
              {banner.subtext}
            </p>
          </div>

          {/* Graphical Vault / Safe / Coins Illustration */}
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600/40 via-purple-700/50 to-indigo-900/60 border border-amber-400/50 flex flex-col items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform">
              <span className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">🔒</span>
              <span className="text-[10px] font-black text-amber-300 tracking-wider uppercase mt-1">
                BONUS VAULT
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce">🪙</div>
            <div className="absolute -top-2 -left-2 text-xl">💵</div>
          </div>
        </div>

        {/* Bottom CTA Row */}
        <div className="flex items-center justify-between z-10 pt-1">
          <button
            onClick={() => {
              playClickSound();
              onClaimBonus();
            }}
            className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-purple-950 font-extrabold text-xs px-5 py-2 rounded-full shadow-lg shadow-amber-500/30 active:scale-95 transition-all cursor-pointer border border-yellow-200"
          >
            {banner.buttonText} →
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-1.5">
            {BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playClickSound();
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-purple-600/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
