import React, { useState, useEffect } from 'react';
import { supabase, Product } from '../lib/supabase';
import {
  LogIn, LogOut, Plus, Pencil, Trash2, X, Save,
  Package, AlertCircle, Loader2, Eye, EyeOff
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const formatVND = (price: number | null) =>
  price == null ? '—' : price.toLocaleString('vi-VN') + ' đ';

interface FormState {
  name: string;
  slug: string;
  price: string;
  original_price: string;
  description: string;
  genre: string;
  image_url: string;
  steam_appid: string;
  stock: string;
  is_active: boolean;
  is_featured: boolean;
}

const emptyForm: FormState = {
  name: '', slug: '', price: '', original_price: '',
  description: '', genre: '', image_url: '', steam_appid: '',
  stock: '0', is_active: true, is_featured: false,
};

export default function AdminPanel() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState('');
  const [formBusy, setFormBusy] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) fetchProducts();
  }, [session]);

  const fetchProducts = async () => {
    setListLoading(true);
    setListError('');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setListError('Không tải được danh sách sản phẩm: ' + error.message);
    } else {
      setProducts(data || []);
    }
    setListLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(
        error.message === 'Invalid login credentials'
          ? 'Email hoặc mật khẩu không đúng.'
          : 'Đăng nhập thất bại: ' + error.message
      );
    }
    setLoginBusy(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProducts([]);
  };

  const openAddForm = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setFormOpen(true);
  };

  const openEditForm = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      price: String(p.price),
      original_price: p.original_price != null ? String(p.original_price) : '',
      description: p.description || '',
      genre: p.genre || '',
      image_url: p.image_url || '',
      steam_appid: p.steam_appid || '',
      stock: String(p.stock),
      is_active: p.is_active,
      is_featured: p.is_featured,
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: editing ? f.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const price = parseInt(form.price, 10);
    if (!form.name.trim()) { setFormError('Vui lòng nhập tên game.'); return; }
    if (!form.slug.trim()) { setFormError('Vui lòng nhập slug.'); return; }
    if (isNaN(price) || price < 0) { setFormError('Giá bán không hợp lệ.'); return; }
    const originalPrice = form.original_price.trim() === '' ? null : parseInt(form.original_price, 10);
    if (originalPrice != null && (isNaN(originalPrice) || originalPrice < 0)) { setFormError('Giá gốc không hợp lệ.'); return; }
    const stock = parseInt(form.stock, 10);
    if (isNaN(stock) || stock < 0) { setFormError('Tồn kho không hợp lệ.'); return; }

    setFormBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      price,
      original_price: originalPrice,
      description: form.description.trim() || null,
      genre: form.genre.trim() || null,
      image_url: form.image_url.trim() || null,
      steam_appid: form.steam_appid.trim() || null,
      stock,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };

    let error;
    if (editing) {
      ({ error } = await supabase.from('products').update(payload).eq('id', editing.id));
    } else {
      ({ error } = await supabase.from('products').insert(payload));
    }

    if (error) {
      setFormError(
        error.code === '23505'
          ? 'Slug đã tồn tại, vui lòng dùng slug khác.'
          : 'Lưu thất bại: ' + error.message
      );
    } else {
      setFormOpen(false);
      fetchProducts();
    }
    setFormBusy(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteBusy(true);
    const { error } = await supabase.from('products').delete().eq('id', deleteTarget.id);
    if (error) {
      alert('Xóa thất bại: ' + error.message);
    } else {
      setDeleteTarget(null);
      fetchProducts();
    }
    setDeleteBusy(false);
  };

  const inputCls =
    'w-full bg-[#0b0d12] border border-neutral-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500 transition-colors';
  const labelCls = 'block text-xs font-semibold text-neutral-400 mb-1.5';

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0b0d12] text-neutral-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#0b0d12] text-neutral-100 flex items-center justify-center px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-[#121620] border border-neutral-800/80 rounded-2xl p-8 shadow-xl space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-purple-600/15 border border-purple-500/30 rounded-2xl flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-xl font-black text-white">Admin CMS</h1>
            <p className="text-xs text-neutral-400">Đăng nhập để quản lý sản phẩm</p>
          </div>

          {loginError && (
            <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className={labelCls}>Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls} placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className={labelCls}>Mật khẩu</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls + ' pr-11'} placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loginBusy}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loginBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
            Đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d12] text-neutral-100">
      <header className="border-b border-neutral-800/80 bg-[#121620]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/15 border border-purple-500/30 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Admin CMS</h1>
              <p className="text-xs text-neutral-400">{session.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={openAddForm}
              className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Thêm game
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#1a1f2b] hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {listError && (
          <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{listError}</span>
          </div>
        )}

        {listLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-[#121620] border border-neutral-800/80 rounded-2xl">
            <Package className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-400 text-sm">Chưa có sản phẩm nào. Bấm "Thêm game" để tạo mới.</p>
          </div>
        ) : (
          <div className="bg-[#121620] border border-neutral-800/80 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800/80 text-left text-xs text-neutral-500 uppercase tracking-wide">
                    <th className="px-5 py-4 font-semibold">Game</th>
                    <th className="px-5 py-4 font-semibold">Giá bán</th>
                    <th className="px-5 py-4 font-semibold">Tồn kho</th>
                    <th className="px-5 py-4 font-semibold">Trạng thái</th>
                    <th className="px-5 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-neutral-800/50 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-14 h-10 object-cover rounded-lg border border-neutral-700/60" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-14 h-10 rounded-lg bg-neutral-800 flex items-center justify-center">
                              <Package className="w-5 h-5 text-neutral-600" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{p.name}</p>
                            <p className="text-xs text-neutral-500">{p.slug}{p.is_featured && <span className="ml-2 text-purple-400 font-semibold">Nổi bật</span>}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-white">{formatVND(p.price)}</p>
                        {p.original_price != null && p.original_price > p.price && (
                          <p className="text-xs text-neutral-500 line-through">{formatVND(p.original_price)}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                          {p.stock} key
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${p.is_active ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30' : 'bg-neutral-700/30 text-neutral-400 border border-neutral-600/50'}`}>
                          {p.is_active ? 'Đang bán' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(p)}
                            className="p-2 rounded-lg bg-[#1a1f2b] hover:bg-neutral-700 border border-neutral-700/80 text-neutral-300 transition-colors"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-2xl bg-[#121620] border border-neutral-800 rounded-2xl p-6 sm:p-8 my-8 space-y-5"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-white">{editing ? 'Sửa game' : 'Thêm game mới'}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Tên game *</label>
                <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} className={inputCls} placeholder="Elden Ring" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Slug *</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputCls} placeholder="elden-ring" />
              </div>
              <div>
                <label className={labelCls}>Giá bán (VND) *</label>
                <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputCls} placeholder="990000" />
              </div>
              <div>
                <label className={labelCls}>Giá gốc (VND)</label>
                <input type="number" min="0" value={form.original_price} onChange={(e) => setForm({ ...form, original_price: e.target.value })} className={inputCls} placeholder="1290000" />
              </div>
              <div>
                <label className={labelCls}>Thể loại</label>
                <input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className={inputCls} placeholder="Nhập vai, Hành động" />
              </div>
              <div>
                <label className={labelCls}>Steam App ID</label>
                <input value={form.steam_appid} onChange={(e) => setForm({ ...form, steam_appid: e.target.value })} className={inputCls} placeholder="1245620" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>URL ảnh cover</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={inputCls} placeholder="https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Mô tả</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls + ' min-h-[100px] resize-y'} placeholder="Mô tả ngắn về game..." />
              </div>
              <div>
                <label className={labelCls}>Tồn kho (số key)</label>
                <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={inputCls} placeholder="0" />
              </div>
              <div className="flex items-end gap-6 pb-1">
                <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-purple-600" />
                  Đang bán
                </label>
                <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-purple-600" />
                  Nổi bật
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#1a1f2b] hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 transition-colors">
                Hủy
              </button>
              <button type="submit" disabled={formBusy} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white transition-colors flex items-center gap-2">
                {formBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editing ? 'Lưu thay đổi' : 'Thêm game'}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#121620] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-black text-white">Xóa game?</h2>
            <p className="text-sm text-neutral-400">
              Bạn có chắc muốn xóa <span className="font-bold text-white">"{deleteTarget.name}"</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-[#1a1f2b] hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 transition-colors">
                Hủy
              </button>
              <button onClick={handleDelete} disabled={deleteBusy} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white transition-colors flex items-center gap-2">
                {deleteBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
