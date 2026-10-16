import React, { useState } from 'react';
import { StoreHeader } from './StoreHeader';
import { StoreHero } from './StoreHero';
import { StoreCatalog } from './StoreCatalog';
import { GameDetailModal } from './GameDetailModal';
import { CartModal } from './CartModal';
import { WishlistModal } from './WishlistModal';
import { LibraryView } from './LibraryView';
import { AdminCMS } from './AdminCMS';
import { FloatingSupport } from './FloatingSupport';
import { StoreFooter } from './StoreFooter';

import { STORE_GAMES } from '../data/mockStoreData';
import { CheckCircle2, Send, ExternalLink } from 'lucide-react';

export default function StoreApp() {
  const [activeTab, setActiveTab] = useState('store');
  const [searchQuery, setSearchQuery] = useState('');

  const [games, setGames] = useState(STORE_GAMES);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [purchasedGames, setPurchasedGames] = useState([]);

  const [selectedGame, setSelectedGame] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [telegramModalOpen, setTelegramModalOpen] = useState(false);
  const [telegramMessage, setTelegramMessage] = useState('Chào shop, tôi muốn mua game bản quyền.');

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (game) => {
    const existing = cartItems.find(i => i.game.id === game.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.game.id === game.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCartItems([...cartItems, { game, quantity: 1 }]);
    }
    showToast(`Đã thêm "${game.title}" vào giỏ hàng!`);
  };

  const handleRemoveCartItem = (id) => {
    setCartItems(cartItems.filter(i => i.game.id !== id));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    setCartItems([]);
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

  const handleOpenTelegram = (msg) => {
    if (msg) setTelegramMessage(msg);
    setTelegramModalOpen(true);
  };

  const handleAddGame = (newGame) => {
    setGames([newGame, ...games]);
  };

  const handleUpdateGame = (updatedGame) => {
    setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
  };

  const handleDeleteGame = (id) => {
    setGames(games.filter(g => g.id !== id));
  };

  const wishlistGames = games.filter(g => wishlistIds.includes(g.id));
  const hotDeals = games.filter(g => g.isHotDeal);

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
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setCartOpen(true)}
        onOpenWishlist={() => setWishlistOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {searchQuery ? (
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
              onAddToCart={handleAddToCart}
              onOpenTelegram={(title) => handleOpenTelegram(`Chào shop, tôi muốn mua game: ${title}`)}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
            />
          </div>
        ) : (
          <>
            {activeTab === 'store' && (
              <div className="space-y-12">
                <StoreHero
                  hotDeals={hotDeals}
                  onSelectGame={(g) => setSelectedGame(g)}
                  onAddToCart={handleAddToCart}
                  onOpenTelegram={() => handleOpenTelegram('Chào shop, tôi muốn mua Ace Combat 8 Wings of Theve.')}
                />

                <div className="border-t border-neutral-800/80 pt-10">
                  <StoreCatalog
                    games={games}
                    onSelectGame={(g) => setSelectedGame(g)}
                    onAddToCart={handleAddToCart}
                    onOpenTelegram={(title) => handleOpenTelegram(`Chào shop, tôi muốn mua game: ${title}`)}
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
                  Game Experience là nền tảng phân phối game bản quyền uy tín hàng đầu, cung cấp các mã kích hoạt Steam Key, Epic Games chính hãng với giá tốt nhất cho game thủ Việt Nam. Mọi giao dịch và hỗ trợ đều được kết nối trực tiếp nhanh chóng qua kênh Telegram chính thức.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleOpenTelegram('Chào shop, tôi muốn liên hệ hợp tác.')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow inline-flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Tham Gia Kênh Telegram
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-xl max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-black text-white">Liên Hệ & Hỗ Trợ 24/7</h2>
                <p className="text-sm text-neutral-300">
                  Bạn cần tư vấn mua game hoặc hỗ trợ kích hoạt key? Hãy nhắn tin ngay cho đội ngũ chúng tôi qua Telegram để nhận hỗ trợ tức thi.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => handleOpenTelegram('Chào shop, tôi cần hỗ trợ kỹ thuật.')}
                    className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm rounded-xl shadow-lg inline-flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" /> Mở Telegram Chat Ngay
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'library' && (
              <LibraryView
                purchasedGames={purchasedGames}
                onShowToast={showToast}
              />
            )}

            {activeTab === 'admin' && (
              <AdminCMS
                games={games}
                onAddGame={handleAddGame}
                onUpdateGame={handleUpdateGame}
                onDeleteGame={handleDeleteGame}
                onBackToStore={() => setActiveTab('store')}
                onShowToast={showToast}
              />
            )}
          </>
        )}
      </main>

      <FloatingSupport onOpenTelegram={() => handleOpenTelegram('Chào shop, tôi cần hỗ trợ qua Telegram.')} />

      {telegramModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mx-auto shadow-lg">
              <Send className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Chuyển Hướng Sang Telegram</h3>
              <p className="text-xs text-neutral-300">
                Hệ thống sẽ chuyển bạn trực tiếp đến Telegram Channel / Chat của shop để hoàn tất thanh toán và nhận Key ngay lập tức.
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 font-mono text-left">
              <strong>Nội dung tin nhắn:</strong>
              <p className="mt-1 text-purple-400">{telegramMessage}</p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setTelegramModalOpen(false)}
                className="flex-1 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Hủy
              </button>
              <a
                href="https://t.me/your_telegram_channel"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setTelegramModalOpen(false)}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-colors"
              >
                Mở Telegram <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          onClose={() => setSelectedGame(null)}
          onAddToCart={handleAddToCart}
          isWishlisted={wishlistIds.includes(selectedGame.id)}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenTelegram={(msg) => handleOpenTelegram(msg)}
        onShowToast={showToast}
      />

      <WishlistModal
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        wishlistGames={wishlistGames}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <StoreFooter />

    </div>
  );
}
