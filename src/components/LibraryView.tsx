import React, { useState } from 'react';
import { Gamepad2, Key, Copy, Check, ShieldCheck, Download, Sparkles } from 'lucide-react';
import { StoreGame } from '../types';

interface LibraryViewProps {
  purchasedGames: StoreGame[];
  onShowToast: (msg: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ purchasedGames, onShowToast }) => {
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Generate a mock Steam key format for each purchased game
  const generateSteamKey = (title: string) => {
    const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `STEAM-${(hash * 12345).toString(36).toUpperCase()}-${(hash * 67890).toString(36).toUpperCase()}-VN`;
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    onShowToast(`Đã sao chép Steam Key: ${key}`);
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-950 via-neutral-900 to-neutral-900 border border-red-900/40 rounded-2xl p-6 sm:p-8 space-y-2 shadow-xl">
        <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-500 text-xs font-bold px-3 py-1 rounded-full border border-red-600/30">
          <Key className="w-3.5 h-3.5" /> Thư Viện Bản Quyền Của Bạn
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Kho Key Steam Đã Sở Hữu ({purchasedGames.length})
        </h2>
        <p className="text-sm text-neutral-400">
          Các mã kích hoạt bản quyền chính hãng đã mua sẽ được lưu trữ vĩnh viễn tại đây để bạn kích hoạt bất cứ lúc nào trên Steam.
        </p>
      </div>

      {purchasedGames.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
          <Gamepad2 className="w-16 h-16 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Thư viện của bạn đang trống</h3>
          <p className="text-sm text-neutral-400 max-w-md mx-auto">
            Hãy khám phá cửa hàng và sở hữu những tựa game bom tấn AAA ngay hôm nay với mức giá ưu đãi nhất!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {purchasedGames.map((game, idx) => {
            const steamKey = generateSteamKey(game.title + idx);
            const isCopied = copiedKeyId === game.id;
            return (
              <div
                key={game.id + idx}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-4 group hover:border-red-600/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={game.coverImage}
                    alt={game.title}
                    className="w-20 h-24 rounded-xl object-cover border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1.5 flex-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Đã thanh toán & Xác thực
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {game.title}
                    </h3>
                    <span className="text-xs text-neutral-400 block">{game.drm} Platform</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-neutral-800">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Mã Kích Hoạt (Steam Key):</span>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-red-400 tracking-wider flex items-center justify-between select-all">
                    <span>{steamKey}</span>
                    <button
                      onClick={() => handleCopyKey(steamKey, game.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition-all ${
                        isCopied ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-500 text-white'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
