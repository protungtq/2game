import React from 'react';
import { Send, Heart, Star, ShieldCheck, Cpu, HardDrive, Monitor, CheckCircle2 } from 'lucide-react';
import { StoreGame } from '../types';

interface GameDetailModalProps {
  game: StoreGame;
  onClose: () => void;
  onOrderTelegram: (game: StoreGame) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  onClose,
  onOrderTelegram,
  isWishlisted,
  onToggleWishlist
}) => {
  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase">
              {game.drm} Key
            </span>
            {!game.inStock && (
              <span className="bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-bold px-3 py-1 rounded-md uppercase">
                Hết hàng
              </span>
            )}
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Chính hãng 100%
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWishlist(game.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isWishlisted
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Yêu thích"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-neutral-800 hover:bg-red-600 text-neutral-300 hover:text-white rounded-xl transition-colors font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover image */}
            <div className="md:col-span-1 rounded-2xl overflow-hidden border border-neutral-800 h-64 md:h-full">
              <img
                src={game.coverImage}
                alt={game.title}
                className={`w-full h-full object-cover ${!game.inStock ? 'grayscale opacity-70' : ''}`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Details info */}
            <div className="md:col-span-2 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {game.genres.map(g => (
                    <span key={g} className="bg-neutral-950 text-neutral-300 text-xs px-2.5 py-1 rounded border border-neutral-800">
                      {g}
                    </span>
                  ))}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {game.title}
                </h1>

                <div className="flex items-center gap-4 text-xs text-neutral-400">
                  {game.publisher && (
                    <>
                      <span>Phát hành: <strong className="text-neutral-200">{game.publisher}</strong></span>
                      <span>•</span>
                    </>
                  )}
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-amber-400" /> {game.rating} / 5.0
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed pt-2">
                  {game.description}
                </p>
              </div>

              {/* Price & Action box */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {game.discountPercentage > 0 && (
                      <>
                        <span className="text-xs font-bold text-red-500 bg-red-950/80 px-2 py-0.5 rounded">
                          -{game.discountPercentage}%
                        </span>
                        <span className="text-xs text-neutral-500 line-through">
                          {formatVND(game.originalPrice)}
                        </span>
                      </>
                    )}
                  </div>
                  <span className="text-2xl font-black text-white">
                    {formatVND(game.price)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    onOrderTelegram(game);
                    onClose();
                  }}
                  className={`px-6 py-3 text-white font-black text-xs rounded-xl shadow-lg flex items-center gap-2 transition-transform active:scale-95 ${
                    game.inStock
                      ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                      : 'bg-neutral-700 hover:bg-neutral-600'
                  }`}
                >
                  <Send className="w-4 h-4" /> {game.inStock ? 'Đặt mua qua Telegram' : 'Hỏi hàng qua Telegram'}
                </button>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Monitor className="w-4 h-4 text-red-500" /> Cấu Hình Hệ Thống (PC)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 text-xs text-neutral-300 space-y-2">
              <div>
                <span className="text-neutral-500 block font-semibold mb-0.5">Hệ điều hành (OS):</span>
                <strong className="text-white">{game.systemRequirements.os}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block font-semibold mb-0.5">Bộ xử lý (CPU):</span>
                <strong className="text-white">{game.systemRequirements.processor}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block font-semibold mb-0.5">Bộ nhớ RAM:</span>
                <strong className="text-white">{game.systemRequirements.memory}</strong>
              </div>
              <div>
                <span className="text-neutral-500 block font-semibold mb-0.5">Đồ họa (GPU):</span>
                <strong className="text-white">{game.systemRequirements.graphics}</strong>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-neutral-900">
                <span className="text-neutral-500 block font-semibold mb-0.5">Dung lượng trống (Storage):</span>
                <strong className="text-white">{game.systemRequirements.storage}</strong>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
