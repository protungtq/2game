import React, { useState } from 'react';
import { Heart, Star, Tag, ShieldCheck, Send } from 'lucide-react';
import { StoreGame } from '../types';

interface StoreCatalogProps {
  games: StoreGame[];
  onSelectGame: (game: StoreGame) => void;
  onOrderTelegram: (game: StoreGame) => void;
  wishlistIds: string[];
  onToggleWishlist: (id: string) => void;
}

export const StoreCatalog: React.FC<StoreCatalogProps> = ({
  games,
  onSelectGame,
  onOrderTelegram,
  wishlistIds,
  onToggleWishlist
}) => {
  const [activeFilterPill, setActiveFilterPill] = useState<string>('Tất cả');

  const filterPills = ['Tất cả', 'Dưới 300K', 'Dưới 700K', 'Bán chạy'];

  const filteredGames = games.filter(g => {
    if (activeFilterPill === 'Dưới 300K') return g.price < 300000;
    if (activeFilterPill === 'Dưới 700K') return g.price < 700000;
    if (activeFilterPill === 'Bán chạy') return g.isBestseller;
    return true; // Tất cả
  });

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header & Filter Pills matching screenshot */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>🔥</span> Khuyến mãi
        </h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterPills.map(pill => (
            <button
              key={pill}
              onClick={() => setActiveFilterPill(pill)}
              className={`px-5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 border ${
                activeFilterPill === pill
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-[#161a23] text-neutral-300 border-neutral-700/80 hover:bg-neutral-800'
              }`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Game Cards Grid matching screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredGames.map((game) => {
          const isWishlisted = wishlistIds.includes(game.id);
          return (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#121620] border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all shadow-xl flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Cover Image & Wishlist */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(game.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-colors ${
                      isWishlisted ? 'bg-purple-600 text-white' : 'bg-black/60 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                    {game.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[10px] font-bold text-neutral-300 flex items-center gap-1">
                      🎮 STEAM
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Discount Pill matching screenshot */}
              <div className="p-4 pt-0 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-rose-600 text-white text-[11px] font-black px-2 py-1 rounded-md shadow">
                    -{game.discountPercentage}%
                  </span>
                  <div>
                    <span className="block text-[11px] text-neutral-500 line-through">
                      {formatVND(game.originalPrice)}
                    </span>
                    <span className="text-sm font-black text-white">
                      {formatVND(game.price)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrderTelegram(game);
                  }}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
                  title="Đặt mua qua Telegram"
                >
                  <Send className="w-3.5 h-3.5" /> Đặt mua
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
