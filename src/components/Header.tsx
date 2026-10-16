import React from 'react';
import { Search, Bookmark, Flame, Gamepad2, Gift, Newspaper, MessageSquare, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bookmarkedCount: number;
  onOpenBookmarks: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  bookmarkedCount,
  onOpenBookmarks
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1017]/95 backdrop-blur-md border-b border-neutral-800 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tighter text-white">
                2GAME<span className="text-red-600">.VN</span>
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-neutral-400 font-semibold">
                Cổng Thông Tin Game
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single line, whitespace-nowrap) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-neutral-300">
            <button
              onClick={() => setActiveTab('home')}
              className={`hover:text-red-500 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
                activeTab === 'home' ? 'text-red-500 border-red-500' : 'border-transparent'
              }`}
            >
              Trang Chủ
            </button>
            <button
              onClick={() => setActiveTab('giftcodes')}
              className={`hover:text-red-500 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'giftcodes' ? 'text-red-500 border-red-500' : 'border-transparent'
              }`}
            >
              <Gift className="w-4 h-4 text-red-500" />
              Giftcode Hot
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`hover:text-red-500 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'news' ? 'text-red-500 border-red-500' : 'border-transparent'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Tin Tức & Review
            </button>
            <button
              onClick={() => setActiveTab('games')}
              className={`hover:text-red-500 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'games' ? 'text-red-500 border-red-500' : 'border-transparent'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-500" />
              Kho Game
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`hover:text-red-500 transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 flex items-center gap-1.5 ${
                activeTab === 'community' ? 'text-red-500 border-red-500' : 'border-transparent'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Cộng Đồng
            </button>
          </nav>

          {/* Zone 3: Search & Primary Action */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative hidden sm:block w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm kiếm game, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <button
              onClick={onOpenBookmarks}
              className="relative p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 transition-colors flex items-center justify-center"
              title="Đã lưu / Yêu thích"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarkedCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {bookmarkedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('giftcodes')}
              className="hidden sm:inline-flex px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-600/30 transition-all whitespace-nowrap shrink-0"
            >
              Nhận Giftcode
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1219] border-b border-neutral-800 px-4 pt-2 pb-4 space-y-2">
          <div className="relative my-2 sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm game, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-red-600"
            />
          </div>
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'home' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300'}`}
          >
            Trang Chủ
          </button>
          <button
            onClick={() => { setActiveTab('giftcodes'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${activeTab === 'giftcodes' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300'}`}
          >
            <span className="flex items-center gap-2"><Gift className="w-4 h-4 text-red-500" /> Giftcode Hot</span>
            <span className="bg-red-600 text-[10px] px-1.5 py-0.5 rounded text-white font-bold">Mới</span>
          </button>
          <button
            onClick={() => { setActiveTab('news'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'news' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300'}`}
          >
            Tin Tức & Review
          </button>
          <button
            onClick={() => { setActiveTab('games'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'games' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300'}`}
          >
            Kho Game
          </button>
          <button
            onClick={() => { setActiveTab('community'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'community' ? 'bg-red-600/20 text-red-500' : 'text-neutral-300'}`}
          >
            Cộng Đồng
          </button>
        </div>
      )}
    </header>
  );
};
