import React from 'react';
import { Gamepad2, ShieldCheck, Heart } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  return (
    <footer className="bg-[#090b10] border-t border-neutral-800 text-neutral-400 mt-16 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">
                2GAME<span className="text-red-600">.STORE</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Cổng phân phối key bản quyền game Steam, Epic Games, GOG chính hãng với giá tốt nhất cho game thủ Việt Nam.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Danh Mục Cửa Hàng</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Game Bom Tấn AAA</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Khuyến Mãi Sốc -50%</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Steam Key Chính Hãng</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Game Nhập Vị & Thế Giới Mở</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hỗ Trợ Khách Hàng</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Hướng dẫn kích hoạt Steam Key</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Chính sách bảo hành bản quyền</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Phương thức thanh toán</span></li>
              <li><span className="hover:text-red-500 transition-colors cursor-pointer">Trung tâm trợ giúp 24/7</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bảo Mật & Thanh Toán</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hỗ trợ thanh toán qua Thẻ ngân hàng, QR Code, Momo, ZaloPay với mã hóa bảo mật tuyệt đối.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-900/40 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4" /> SSL Secure Checkout
              </span>
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 2Game.Store - Nền tảng phân phối game bản quyền hàng đầu Việt Nam.</p>
          <div className="flex items-center gap-1">
            <span>Được xây dựng với sự đam mê gaming</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
          </div>
        </div>

      </div>
    </footer>
  );
};
