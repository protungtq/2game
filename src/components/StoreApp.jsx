import React, { useState, useEffect } from 'react';
import { StoreHeader } from './StoreHeader';
import { StoreHero } from './StoreHero';
import { StoreCatalog } from './StoreCatalog';
import { GameDetailModal } from './GameDetailModal';
import { WishlistModal } from './WishlistModal';
import { FloatingSupport } from './FloatingSupport';
import { StoreFooter } from './StoreFooter';

import { STORE_GAMES } from '../data/mockStoreData';
import { supabase } from '../lib/supabase';
import { mapProductToStoreGame } from '../lib/mapProduct';
import { CheckCircle2, Send } from 'lucide-react';

export const TELEGRAM_USERNAME = 'girl2vn';

export function buildTelegramOrderLink(game) {
  const priceStr = game && game.price ? game.price.toLocaleString('vi-VN') + ' đ' : '';
  const msg = game
    ? `Chào shop! Mình muốn mua key game: ${game.title}${priceStr ? ' - ' + priceStr : ''}. Shop còn hàng không?`
    : 'Chào shop! Mình cần tư vấn mua key game.';
  return `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(msg)}`;
}

export function openTelegramOrder(game) {
  window.open(buildTelegramOrderLink(game), '_blank', 'noopener,noreferrer');
}

export default function StoreApp() {
  const [activeTab, setActiveTab] = useState('store');
  const [searchQuery, setSearchQuery] = useState('');

  const [wishlistIds, setWishlistIds] = useState([]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  // Products: Supabase first, fallback to mock data
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false });
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setGames(data.map(mapProductToStoreGame));
        } else {
          setGames(STORE_GAMES);
        }
      } catch (e) {
        if (!cancelled) setGames(STORE_GAMES);
      } finally {
        if (!cancelled) setLoadingGames(false);
      }
    }
    loadProducts();
    return () => { cancelled = true; };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleToggleWishlist = (id) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds(wishlistIds.filter(w => w !== id));
      showToast('Đã xóa game khỏi danh sách yêu thích');
    } else {
      setWishlistIds([...wishlistIds, id]);
      showToast('Đã thêm game vào danh sách yêu thích');
    }
  };

  const wishlistGames = games.filter(g => wishlistIds.includes(g.id));
  const hotDeals = games.filter(g => g.isHotDeal);
  const heroGames = hotDeals.length >= 3 ? hotDeals : games.slice(0, 3);

  const filteredSearchGames = searchQuery
    ? games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())))
    : games;

  return (
    <div className="min-h-screen bg-[#0b0d12] text-neutral-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-purple-600/80 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      <StoreHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loadingGames ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-purple-600/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-neutral-400">Đang tải game...</p>
          </div>
        ) : searchQuery ? (
          <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-black text-white">
                Kết quả tìm kiếm cho: <span className="text-purple-400">"{searchQuery}"</span>
              </h2>
              <span className="text-xs text-neutral-400">{filteredSearchGames.length} kết quả</span>
            </div>

            <StoreCatalog
              games={filteredSearchGames}
              onSelectGame={(g) => setSelectedGame(g)}
              onOrderTelegram={openTelegramOrder}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        ) : (
          <>
            {activeTab === 'store' && (
              <div className="space-y-12">
                <StoreHero
                  hotDeals={heroGames}
                  onSelectGame={(g) => setSelectedGame(g)}
                  onOrderTelegram={openTelegramOrder}
                />

                <div className="border-t border-neutral-800/80 pt-10">
                  <StoreCatalog
                    games={games}
                    onSelectGame={(g) => setSelectedGame(g)}
                    onOrderTelegram={openTelegramOrder}
                    wishlistIds={wishlistIds}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </div>
              </div>
            )}

            {activeTab === 'company' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
                <h2 className="text-2xl font-black text-white">Về Game Experience</h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Game Experience là shop bán key game Steam bản quyền uy tín, giá tốt cho game thủ Việt Nam. Chọn game bạn thích, bấm đặt mua — tin nhắn sẽ được gửi thẳng tới shop qua Telegram, shop xác nhận và giao key ngay.
                </p>
                <div className="pt-4">
                  <a
                    href={buildTelegramOrderLink(null)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Nhắn Telegram Cho Shop
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-xl max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-black text-white">Liên Hệ & Hỗ Trợ</h2>
                <p className="text-sm text-neutral-300">
                  Bạn cần tư vấn mua game hoặc hỗ trợ kích hoạt key? Nhắn tin ngay cho shop qua Telegram để được hỗ trợ nhanh nhất.
                </p>
                <div className="pt-4">
                  <a
                    href={buildTelegramOrderLink(null)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl shadow-lg inline-flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Mở Telegram Chat Ngay
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <FloatingSupport onOpenTelegram={() => openTelegramOrder(null)} />

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onOrderTelegram={openTelegramOrder}
          isWishlisted={wishlistIds.includes(selectedGame.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistGames={wishlistGames}
        onRemoveWishlist={handleToggleWishlist}
        onOrderTelegram={openTelegramOrder}
      />

      <StoreFooter />

    </div>
  );
}
