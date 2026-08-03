import React from 'react';
import { Volume2 } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface NoticeMarqueeProps {
  onOpenNotice: () => void;
  language: 'EN' | 'HI';
}

export const NoticeMarquee: React.FC<NoticeMarqueeProps> = ({ onOpenNotice, language }) => {
  const noticeText =
    language === 'HI'
      ? 'हमारा कस्टमर सर्विस कभी भी सदस्य का पासवर्ड या पिन नहीं मांगेगा — यदि आपको कोई संदिग्ध लिंक मिले तो सावधान रहें!'
      : 'Official JaiClub Customer Care will NEVER ask for your password or OTP. Play safe & win big!';

  return (
    <div className="flex items-center justify-between gap-2 bg-[#140d3a]/90 border border-purple-800/50 rounded-xl px-3 py-1.5 shadow-md my-2">
      {/* Speaker Icon */}
      <div className="flex-shrink-0 text-amber-400 animate-pulse">
        <Volume2 className="w-4 h-4" />
      </div>

      {/* Marquee Text */}
      <div className="flex-1 overflow-hidden whitespace-nowrap text-xs text-purple-200 font-medium">
        <div className="inline-block animate-[marquee_18s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer" onClick={onOpenNotice}>
          {noticeText} &nbsp;&nbsp;&nbsp; 🎁 Daily Login Chest Bonus Active! &nbsp;&nbsp;&nbsp; 🚀 Aviator Multiplier reached 45.8x today!
        </div>
      </div>

      {/* Detail Button */}
      <button
        onClick={() => {
          playClickSound();
          onOpenNotice();
        }}
        className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-[11px] px-3 py-1 rounded-full border border-purple-400/40 shadow-sm active:scale-95 transition-transform cursor-pointer"
      >
        {language === 'HI' ? 'विवरण' : 'Detail'}
      </button>
    </div>
  );
};
