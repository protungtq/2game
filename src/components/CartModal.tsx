import React, { useState } from 'react';
import { ShoppingCart, Trash2, ShieldCheck, Send, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenTelegram: (orderDetails: string) => void;
  onShowToast: (msg: string) => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onOpenTelegram,
  onShowToast
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.game.price * item.quantity), 0);

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const handleTelegramCheckout = () => {
    if (cartItems.length === 0) return;
    const orderSummary = cartItems.map(i => `${i.quantity}x ${i.game.title} (${formatVND(i.game.price)})`).join(', ');
    const message = `Chào shop, tôi muốn thanh toán đơn hàng: ${orderSummary}. Tổng tiền: ${formatVND(subtotal)}`;
    onOpenTelegram(message);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-black text-white">Giỏ Hàng Của Bạn ({cartItems.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingCart className="w-12 h-12 text-neutral-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Giỏ hàng đang trống</h3>
              <p className="text-xs text-neutral-400">Hãy chọn các tựa game yêu thích và thêm vào giỏ hàng nhé.</p>
            </div>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cartItems.map(({ game, quantity }) => (
                  <div key={game.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={game.coverImage} alt={game.title} className="w-12 h-12 rounded-lg object-cover border border-neutral-800 shrink-0" referrerPolicy="no-referrer" />
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase">{game.drm} Key</span>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">{game.title}</h4>
                        <span className="text-xs font-semibold text-neutral-400">{formatVND(game.price)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(game.id)}
                      className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary Bill */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-base font-black text-white pt-2">
                  <span>Tổng thanh toán:</span>
                  <span className="text-purple-400">{formatVND(subtotal)}</span>
                </div>
              </div>

              {/* Secure guarantee */}
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thanh toán nhanh chóng qua chuyển khoản và nhận key qua Telegram kênh của chúng tôi.</span>
              </div>

              {/* Checkout Telegram Button */}
              <button
                onClick={handleTelegramCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Thanh Toán & Nhắn Tin Telegram Ngay
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
