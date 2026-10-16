import React, { useState } from 'react';
import { Search, Gamepad2, Heart, Menu, X } from 'lucide-react';

interface StoreHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  wishlistCount,
  onOpenWishlist
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0d1017]/95 backdrop-blur-md border-b border-neutral-800 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Brand Logo matching screenshot */}
          <div
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => setActiveTab('store')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase block leading-none">
                GAME <span className="text-purple-400 font-light">EXPERIENCE</span>
              </span>
            </div>
          </div>

          {/* Navigation Links matching screenshot: Game, Công ty, Liên hệ */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-neutral-300">
            <button
              onClick={() => setActiveTab('store')}
              className={`hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'store' ? 'text-purple-400 font-bold' : ''
              }`}
            >
              Game ▾
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'company' ? 'text-purple-400 font-bold' : ''
              }`}
            >
              Công ty ▾
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'contact' ? 'text-purple-400 font-bold' : ''
              }`}
            >
              Liên hệ
            </button>

          </nav>

          {/* Search and Action Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative hidden sm:block w-48 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Tìm game..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161a23] border border-neutral-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 bg-[#161a23] hover:bg-neutral-800 border border-neutral-700/80 rounded-xl text-neutral-300 transition-colors flex items-center justify-center"
              title="Danh sách yêu thích"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-purple-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1219] border-b border-neutral-800 px-4 pt-2 pb-4 space-y-2">
          <div className="relative my-2 sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm game..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'store' ? 'bg-purple-600/20 text-purple-400' : 'text-neutral-300'}`}
          >
            Game
          </button>
          <button
            onClick={() => { setActiveTab('company'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'company' ? 'bg-purple-600/20 text-purple-400' : 'text-neutral-300'}`}
          >
            Công ty
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${activeTab === 'contact' ? 'bg-purple-600/20 text-purple-400' : 'text-neutral-300'}`}
          >
            Liên hệ
          </button>

        </div>
      )}
    </header>
  );
};
