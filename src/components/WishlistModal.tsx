import React from 'react';
import { Heart, Trash2, Send, Star } from 'lucide-react';
import { StoreGame } from '../types';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistGames: StoreGame[];
  onRemoveWishlist: (id: string) => void;
  onOrderTelegram: (game: StoreGame) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistGames,
  onRemoveWishlist,
  onOrderTelegram
}) => {
  if (!isOpen) return null;

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <h2 className="text-lg font-black text-white">Danh Sách Yêu Thích ({wishlistGames.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {wishlistGames.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Chưa có game yêu thích</h3>
              <p className="text-xs text-neutral-400">Hãy nhấn vào biểu tượng trái tim trên game bạn quan tâm để lưu lại.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {wishlistGames.map((game) => (
                <div key={game.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={game.coverImage} alt={game.title} className="w-14 h-16 rounded-lg object-cover border border-neutral-800 shrink-0" referrerPolicy="no-referrer" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-red-500 uppercase">{game.drm} Key</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{game.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-red-500">{formatVND(game.price)}</span>
                        <span className="text-[10px] text-neutral-500 line-through">{formatVND(game.originalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onOrderTelegram(game);
                      }}
                      className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors shadow"
                      title="Đặt mua qua Telegram"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemoveWishlist(game.id)}
                      className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-500 rounded-xl transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
