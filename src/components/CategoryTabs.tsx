import React from 'react';
import { GameCategory } from '../types';
import { playClickSound } from '../utils/audio';

interface CategoryTabsProps {
  activeCategory: GameCategory;
  onSelectCategory: (category: GameCategory) => void;
}

const CATEGORIES: { id: GameCategory; label: string; icon: string; highlight?: boolean }[] = [
  { id: 'popular', label: 'Popular', icon: '🔥', highlight: true },
  { id: 'lottery', label: 'Lottery', icon: '🎱' },
  { id: 'minigames', label: 'Mini games', icon: '🚀' },
  { id: 'slots', label: 'Slots', icon: '🎰' },
  { id: 'sports', label: 'Sports', icon: '🏏' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-0.5 my-1">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => {
              playClickSound();
              onSelectCategory(cat.id);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border cursor-pointer select-none ${
              isActive
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-purple-600 text-white border-amber-300/60 shadow-lg shadow-orange-500/25 scale-105'
                : 'bg-[#181145]/80 text-purple-200 border-purple-800/40 hover:bg-[#231a5c] hover:border-purple-600/50'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};
