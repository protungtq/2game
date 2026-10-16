import React, { useState } from 'react';
import { StoreHeader } from './components/StoreHeader';
import { StoreHero } from './components/StoreHero';
import { StoreCatalog } from './components/StoreCatalog';
import { GameDetailModal } from './components/GameDetailModal';
import { CartModal } from './components/CartModal';
import { WishlistModal } from './components/WishlistModal';
import { LibraryView } from './components/LibraryView';
import { AdminCMS } from './components/AdminCMS';
import { FloatingSupport } from './components/FloatingSupport';
import { StoreFooter } from './components/StoreFooter';

import { STORE_GAMES } from './data/mockStoreData';
import { StoreGame, CartItem } from './types';
import { CheckCircle2, Send, ExternalLink, Gamepad2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('store');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [games, setGames] = useState<StoreGame[]>(STORE_GAMES);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [purchasedGames, setPurchasedGames] = useState<StoreGame[]>([]);

  const [selectedGame, setSelectedGame] = useState<StoreGame | null>(null);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [wishlistOpen, setWishlistOpen] = useState<boolean>(false);
  const [telegramModalOpen, setTelegramModalOpen] = useState<boolean>(false);
  const [telegramMessage, setTelegramMessage] = useState<string>('Chào shop, tôi muốn mua game bản quyền.');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (game: StoreGame) => {
    const existing = cartItems.find(i => i.game.id === game.id);
    if (existing) {
      setCartItems(cartItems.map(i => i.game.id === game.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCartItems([...cartItems, { game, quantity: 1 }]);
    }
    showToast(`Đã thêm "${game.title}" vào giỏ hàng!`);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(cartItems.filter(i => i.game.id !== id));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleToggleWishlist = (id: string) => {
    if (wishlistIds.includes(id)) {
      setWishlistIds(wishlistIds.filter(w => w !== id));
      showToast('Đã xóa game khỏi danh sách yêu thích');
    } else {
      setWishlistIds([...wishlistIds, id]);
      showToast('Đã thêm game vào danh sách yêu thích');
    }
  };

  const handleOpenTelegram = (msg?: string) => {
    if (msg) setTelegramMessage(msg);
    setTelegramModalOpen(true);
  };

  // CMS Handlers
  const handleAddGame = (newGame: StoreGame) => {
    setGames([newGame, ...games]);
  };

  const handleUpdateGame = (updatedGame: StoreGame) => {
    setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g));
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter(g => g.id !== id));
  };

  const wishlistGames = games.filter(g => wishlistIds.includes(g.id));
  const hotDeals = games.filter(g => g.isHotDeal);

  const filteredSearchGames = searchQuery
    ? games.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()) || g.genres.some(genre => genre.toLowerCase().includes(searchQuery.toLowerCase())))
    : games;

  return (
    <div className="min-h-screen bg-[#0b0d12] text-neutral-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-purple-600/80 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header matching screenshot */}
      <StoreHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Main Content */}
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
                  Bạn cần tư vấn mua game hoặc hỗ trợ kích hoạt key? Hãy nhắn tin ngay cho đội ngũ chúng tôi qua Telegram để nhận hỗ trợ tức thì.
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

      {/* Floating Telegram Support Widget */}
      <FloatingSupport onOpenTelegram={() => handleOpenTelegram('Chào shop, tôi cần hỗ trợ qua Telegram.')} />

      {/* Telegram Redirect Modal */}
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
                href={`https://t.me/your_telegram_channel`}
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

      {/* Modals */}
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

      {/* Footer */}
      <StoreFooter />

    </div>
  );
}
