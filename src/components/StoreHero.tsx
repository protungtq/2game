import React from 'react';
import { StoreGame } from '../types';
import { Send } from 'lucide-react';

interface StoreHeroProps {
  hotDeals: StoreGame[];
  onSelectGame: (game: StoreGame) => void;
  onOrderTelegram: (game: StoreGame) => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ hotDeals, onSelectGame, onOrderTelegram }) => {
  if (hotDeals.length < 3) return null;

  const mainHero = hotDeals[0];
  const sideHero1 = hotDeals[1];
  const sideHero2 = hotDeals[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      
      {/* Main Large Hero Banner (Left - 2 cols) */}
      <div
        onClick={() => onSelectGame(mainHero)}
        className="lg:col-span-2 relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group cursor-pointer shadow-2xl h-[340px] sm:h-[420px]"
      >
        <img
          src={mainHero.bannerImage}
          alt={mainHero.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="absolute bottom-6 left-6 right-6 space-y-2 z-10">
          <span className="inline-block bg-purple-600 text-white text-[11px] font-black px-3 py-1 rounded-md uppercase tracking-wider">
            Bom Tấn Hot
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wider drop-shadow">
            {mainHero.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-xl">
            {mainHero.description}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOrderTelegram(mainHero);
              }}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Đặt mua qua Telegram
            </button>
          </div>
        </div>
      </div>

      {/* Side Banners (Right - 1 col stacking 2 images matching screenshot) */}
      <div className="flex flex-col gap-5">
        
        {/* Side Banner 1 */}
        <div
          onClick={() => onSelectGame(sideHero1)}
          className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group cursor-pointer shadow-xl h-[160px] sm:h-[200px]"
        >
          <img
            src={sideHero1.coverImage}
            alt={sideHero1.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide">
              {sideHero1.title}
            </h3>
            <span className="text-xs text-purple-400 font-bold">{sideHero1.price.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

        {/* Side Banner 2 */}
        <div
          onClick={() => onSelectGame(sideHero2)}
          className="relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group cursor-pointer shadow-xl h-[160px] sm:h-[200px]"
        >
          <img
            src={sideHero2.coverImage}
            alt={sideHero2.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wide">
              {sideHero2.title}
            </h3>
            <span className="text-xs text-purple-400 font-bold">{sideHero2.price.toLocaleString('vi-VN')} đ</span>
          </div>
        </div>

      </div>

    </div>
  );
};
