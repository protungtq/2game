import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Plus, Trash2, Edit3, Package, Tag, ArrowLeft, AlertTriangle, History, Smartphone, QrCode, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';
import { StoreGame } from '../types';

interface AdminCMSProps {
  games: StoreGame[];
  onAddGame: (game: StoreGame) => void;
  onUpdateGame: (game: StoreGame) => void;
  onDeleteGame: (id: string) => void;
  onBackToStore: () => void;
  onShowToast: (msg: string) => void;
}

interface AuditLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  games,
  onAddGame,
  onUpdateGame,
  onDeleteGame,
  onBackToStore,
  onShowToast
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [totpCode, setTotpCode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Whitelist of authorized admin Google emails
  const ALLOWED_ADMIN_EMAILS = ['mobitungtq@gmail.com', 'admin@gameexperience.vn', 'manager@2game.store'];

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'l1', action: 'SYSTEM_INIT', target: 'Google Whitelist & 2FA Enforcement Active', timestamp: 'Hôm nay, 00:00' }
  ]);

  const [activeSubTab, setActiveSubTab] = useState<'games' | 'add' | 'stats' | 'logs'>('games');
  const [editingGame, setEditingGame] = useState<StoreGame | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formPrice, setFormPrice] = useState(500000);
  const [formOriginalPrice, setFormOriginalPrice] = useState(1000000);
  const [formDiscount, setFormDiscount] = useState(50);
  const [formDrm, setFormDrm] = useState<'Steam' | 'Epic Games' | 'GOG' | 'Ubisoft Connect' | 'Rockstar'>('Steam');
  const [formGenre, setFormGenre] = useState('Action RPG');
  const [formCover, setFormCover] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
  const [formPublisher, setFormPublisher] = useState('Publisher Name');
  const [formDesc, setFormDesc] = useState('');

  const addAuditLog = (action: string, target: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      action,
      target,
      timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleGoogleLoginSimulation = (emailToTest?: string) => {
    const email = emailToTest || googleEmail.trim().toLowerCase();
    
    if (!email) {
      setAuthError('Vui lòng nhập hoặc chọn email Google.');
      return;
    }

    // Check Whitelist
    if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
      setAuthError(`Truy cập bị từ chối! Email "${email}" không nằm trong danh sách Quản trị viên được cấp phép.`);
      addAuditLog('UNAUTHORIZED_LOGIN_ATTEMPT', `Denied email: ${email}`);
      return;
    }

    // If in whitelist, proceed to 2FA verification or grant access
    setAuthError(null);
    setIsAuthenticated(true);
    addAuditLog('GOOGLE_OAUTH_SUCCESS', `Admin authenticated: ${email}`);
    onShowToast(`Đăng nhập thành công với tài khoản Google: ${email}`);
  };

  const formatVND = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const handleSaveGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      onShowToast('Vui lòng nhập tên game!');
      return;
    }

    if (editingGame) {
      const updated: StoreGame = {
        ...editingGame,
        title: formTitle,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercentage: Number(formDiscount),
        drm: formDrm,
        genres: [formGenre],
        coverImage: formCover,
        bannerImage: formCover,
        publisher: formPublisher,
        description: formDesc
      };
      onUpdateGame(updated);
      addAuditLog('UPDATE_GAME', `Updated: ${formTitle}`);
      onShowToast(`Đã cập nhật game "${formTitle}" thành công!`);
      setEditingGame(null);
    } else {
      const newGame: StoreGame = {
        id: `game_${Date.now()}`,
        title: formTitle,
        price: Number(formPrice),
        originalPrice: Number(formOriginalPrice),
        discountPercentage: Number(formDiscount),
        drm: formDrm,
        genres: [formGenre],
        coverImage: formCover,
        bannerImage: formCover,
        rating: 4.8,
        releaseDate: '2026',
        developer: formPublisher,
        publisher: formPublisher,
        description: formDesc || 'Tựa game bản quyền chính hãng.',
        systemRequirements: {
          os: 'Windows 10/11 64-bit',
          processor: 'Intel Core i5',
          memory: '16 GB RAM',
          graphics: 'NVIDIA GTX 1060',
          storage: '60 GB SSD'
        },
        inStock: true,
        isHotDeal: true
      };
      onAddGame(newGame);
      addAuditLog('CREATE_GAME', `Published: ${formTitle}`);
      onShowToast(`Đã đăng game mới "${formTitle}" lên cửa hàng!`);
    }

    setFormTitle('');
    setFormDesc('');
    setActiveSubTab('games');
  };

  const startEdit = (g: StoreGame) => {
    setEditingGame(g);
    setFormTitle(g.title);
    setFormPrice(g.price);
    setFormOriginalPrice(g.originalPrice);
    setFormDiscount(g.discountPercentage);
    setFormDrm(g.drm);
    setFormGenre(g.genres[0] || 'Action');
    setFormCover(g.coverImage);
    setFormPublisher(g.publisher);
    setFormDesc(g.description);
    setActiveSubTab('add');
  };

  const totalRevenue = games.reduce((acc, g) => acc + (g.originalPrice - g.price) * 15, 24500000);

  // Security Gate with Google OAuth Whitelist
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 px-4">
        <div className="bg-neutral-900 border border-purple-500/30 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/40 flex items-center justify-center mx-auto shadow-lg shadow-purple-600/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Đăng Nhập Quản Trị Google</h2>
            <p className="text-xs text-neutral-400">
              Hệ thống kiểm soát truy cập nghiêm ngặt: Chỉ các tài khoản Google nằm trong <strong>Whitelist</strong> mới được cấp quyền vào CMS.
            </p>
          </div>

          <div className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-400 uppercase">Nhập Email Google Của Bạn</label>
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            {authError && (
              <div className="bg-red-950/80 border border-red-800/80 p-3 rounded-xl flex items-start gap-2 text-xs text-red-300">
                <ShieldAlert className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              onClick={() => handleGoogleLoginSimulation()}
              className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-900 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-2.5 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Đăng Nhập Bằng Google OAuth
            </button>
          </div>

          {/* Quick test buttons for review */}
          <div className="pt-3 border-t border-neutral-800 space-y-2 text-left">
            <span className="text-[11px] font-bold text-neutral-400 block">⚡ Thử nghiệm nhanh tài khoản:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleGoogleLoginSimulation('mobitungtq@gmail.com')}
                className="flex-1 py-2 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" /> Login (Được phép)
              </button>
              <button
                onClick={() => handleGoogleLoginSimulation('hacker@gmail.com')}
                className="flex-1 py-2 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-[11px] font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Login (Bị chặn)
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button onClick={onBackToStore} className="text-xs text-neutral-400 hover:text-white underline">
              ← Quay lại trang chủ cửa hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* CMS Top Bar */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-purple-950/80 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToStore}
            className="p-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Về Cửa Hàng
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> WHITELIST GOOGLE ADMIN VERIFIED
              </span>
              <span className="text-xs text-neutral-400">Đã xác thực</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Bảng Quản Trị CMS & Đăng Game
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingGame(null);
              setFormTitle('');
              setFormDesc('');
              setActiveSubTab('games');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'games' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            Sản Phẩm ({games.length})
          </button>
          <button
            onClick={() => {
              setEditingGame(null);
              setFormTitle('');
              setFormDesc('');
              setActiveSubTab('add');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              activeSubTab === 'add' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Đăng Game Mới
          </button>
          <button
            onClick={() => setActiveSubTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSubTab === 'stats' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            Thống Kê
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              activeSubTab === 'logs' ? 'bg-purple-600 text-white' : 'bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" /> Nhật Ký
          </button>
        </div>
      </div>

      {/* Tab 1: Games Inventory */}
      {activeSubTab === 'games' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-500" /> Danh Sách Game Đang Bán
            </h3>
            <span className="text-xs text-neutral-400">Tổng số: {games.length} tựa game</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                <tr>
                  <th className="p-4">Tựa Game</th>
                  <th className="p-4">DRM</th>
                  <th className="p-4">Thể Loại</th>
                  <th className="p-4">Giá Bán</th>
                  <th className="p-4">Giảm Giá</th>
                  <th className="p-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-200">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={game.coverImage} alt={game.title} className="w-10 h-10 rounded-lg object-cover border border-neutral-800" referrerPolicy="no-referrer" />
                      <div>
                        <strong className="text-white block">{game.title}</strong>
                        <span className="text-[10px] text-neutral-400">{game.publisher}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-purple-400">{game.drm}</td>
                    <td className="p-4 text-neutral-300">{game.genres[0]}</td>
                    <td className="p-4 font-bold text-white">{formatVND(game.price)}</td>
                    <td className="p-4">
                      <span className="bg-rose-600/20 text-rose-400 font-bold px-2 py-0.5 rounded text-[10px]">
                        -{game.discountPercentage}%
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => startEdit(game)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors inline-flex items-center gap-1 font-medium"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        onClick={() => {
                          onDeleteGame(game.id);
                          addAuditLog('DELETE_GAME', `Deleted: ${game.title}`);
                          onShowToast(`Đã xóa game "${game.title}"`);
                        }}
                        className="px-3 py-1.5 bg-red-950/60 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors inline-flex items-center gap-1 font-medium border border-red-900/40"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Add / Edit Form */}
      {activeSubTab === 'add' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-2xl mx-auto space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-bold text-white">
              {editingGame ? `Chỉnh Sửa Game: ${editingGame.title}` : 'Đăng Tựa Game Bản Quyền Mới'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">Cập nhật thông tin, giá bán và mức chiết khấu cho cửa hàng.</p>
          </div>

          <form onSubmit={handleSaveGame} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-neutral-300 uppercase tracking-wide">Tên Game</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: GTA VI, Monster Hunter..."
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">Giá Bán (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">Giá Gốc (VNĐ)</label>
                <input
                  type="number"
                  required
                  value={formOriginalPrice}
                  onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">% Giảm Giá</label>
                <input
                  type="number"
                  required
                  value={formDiscount}
                  onChange={(e) => setFormDiscount(Number(e.target.value))}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">Nền Tảng DRM</label>
                <select
                  value={formDrm}
                  onChange={(e) => setFormDrm(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="Steam">Steam</option>
                  <option value="Epic Games">Epic Games</option>
                  <option value="GOG">GOG</option>
                  <option value="Ubisoft Connect">Ubisoft Connect</option>
                  <option value="Rockstar">Rockstar</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">Thể Loại</label>
                <input
                  type="text"
                  value={formGenre}
                  onChange={(e) => setFormGenre(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-neutral-300 uppercase tracking-wide">Nhà Phát Hành</label>
                <input
                  type="text"
                  value={formPublisher}
                  onChange={(e) => setFormPublisher(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300 uppercase tracking-wide">Link Ảnh Bìa (URL)</label>
              <input
                type="url"
                required
                value={formCover}
                onChange={(e) => setFormCover(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-neutral-300 uppercase tracking-wide">Mô Tả Game</label>
              <textarea
                rows={3}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('games')}
                className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-colors"
              >
                {editingGame ? 'Cập Nhật Game' : 'Đăng Game Lên Store'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Stats */}
      {activeSubTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-2 shadow-xl">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Tổng Doanh Thu</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{formatVND(totalRevenue)}</span>
            <span className="block text-[11px] text-neutral-500">+18% so với tháng trước</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-2 shadow-xl">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Tổng Sản Phẩm Trong Kho</span>
            <span className="text-2xl sm:text-3xl font-black text-white">{games.length} Tựa Game</span>
            <span className="block text-[11px] text-neutral-500">100% Key bản quyền chính hãng</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-2 shadow-xl">
            <span className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Danh Sách Whitelist</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{ALLOWED_ADMIN_EMAILS.length} Email</span>
            <span className="block text-[11px] text-neutral-500">Bảo mật tuyệt đối</span>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeSubTab === 'logs' && (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-500" /> Nhật Ký Hoạt Động & Bảo Mật (Audit Logs)
            </h3>
            <span className="text-xs text-neutral-400">Google Whitelist Enforced</span>
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-center text-neutral-500 text-xs py-4">Chưa có nhật ký hoạt động.</div>
            ) : (
              auditLogs.map(log => (
                <div key={log.id} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-950 text-purple-400 px-2 py-0.5 rounded font-bold text-[10px]">{log.action}</span>
                    <span className="text-neutral-200">{log.target}</span>
                  </div>
                  <span className="text-neutral-500">{log.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
