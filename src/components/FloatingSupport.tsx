import React from 'react';
import { HelpCircle, ArrowDown } from 'lucide-react';

interface FloatingSupportProps {
  onOpenTelegram: () => void;
}

export const FloatingSupport: React.FC<FloatingSupportProps> = ({ onOpenTelegram }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <button
        onClick={onOpenTelegram}
        className="flex items-center gap-2 bg-[#1b1f2d] hover:bg-[#252b3d] text-white px-4 py-3 rounded-full shadow-2xl border border-neutral-700/80 transition-all font-bold text-xs group"
      >
        <span className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white shadow">
          <HelpCircle className="w-3.5 h-3.5" />
        </span>
        <span>Hỗ trợ Telegram</span>
        <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow group-hover:translate-y-0.5 transition-transform">
          <ArrowDown className="w-3.5 h-3.5" />
        </span>
      </button>
    </div>
  );
};
