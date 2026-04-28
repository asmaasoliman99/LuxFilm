import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Edit3, Save, X,
  LogOut, Heart, Calendar, Shield, CheckCircle
} from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useWishlist } from '../Context/WishlistContext';
import { Link } from 'react-router';
import { useLanguage } from '../Context/Language';

const getAvatarColor = (str = '') => {
  const colors = [
    'from-[#842A3B] to-[#662222]',
    'from-[#662222] to-[#3E0703]',
    'from-[#A3485A] to-[#842A3B]',
    'from-[#3E0703] to-[#662222]',
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const AccountPage = () => {
  const { user, logout, updateUser } = useAuth();
  const { wishlist, wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();

  const updateSchema = z.object({
    fullName: z
      .string()
      .min(1, t('validation.fullNameRequired'))
      .refine((n) => n.trim().split(' ').length >= 2, { message: t('validation.fullNameTwoWords') }),
    userName: z
      .string()
      .min(3, t('validation.usernameMin'))
      .regex(/^[a-zA-Z0-9_]+$/, t('validation.usernameFormat')),
    phone: z
      .string()
      .min(10, t('validation.phoneMin'))
      .regex(/^\d+$/, t('validation.phoneDigits'))
      .optional()
      .or(z.literal('')),
  });

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, t('validation.currentPasswordRequired')),
      newPassword: z.string().min(8, t('validation.passwordMin')),
      confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
      message: t('validation.passwordsMatch'),
      path: ['confirmPassword'],
    });

  const [editMode, setEditMode] = useState(false);
  const [pwMode, setPwMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    userName: user?.userName || '',
    phone: user?.phone || '',
  });

  const [pwData, setPwData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 text-white">
        <div className="w-24 h-24 rounded-full bg-[#842A3B]/20 flex items-center justify-center mb-6 border border-[#842A3B]/40">
          <Shield size={40} className="text-[#842A3B]" />
        </div>
        <h2 className="text-3xl font-black mb-3">{t('account.accessDenied')}</h2>
        <p className="text-gray-400 mb-8 text-center max-w-sm">
          {t('account.signInToView')}
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-[#842A3B] to-[#662222] text-white font-bold rounded-lg hover:scale-105 transition-all"
        >
          {t('auth.signIn')}
        </button>
      </div>
    );
  }

  const initials = (user.fullName || user.email || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const avatarGradient = getAvatarColor(user.fullName || user.email);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const validated = updateSchema.parse(formData);
      updateUser(validated);
      setEditMode(false);
      setSaved(true);
      toast.success(t('account.profileUpdated'), {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #842A3B' },
      });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe = {};
        err.flatten().fieldErrors &&
          Object.keys(err.flatten().fieldErrors).forEach(
            (k) => (fe[k] = err.flatten().fieldErrors[k][0])
          );
        setErrors(fe);
        toast.error(t('account.fixErrors'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const validated = passwordSchema.parse(pwData);
      const users = JSON.parse(localStorage.getItem('luxfilm_users') || '[]');
      const found = users.find((u) => u.id === user.id && u.password === validated.currentPassword);
      if (!found) throw new Error(t('account.incorrectCurrentPassword'));

      const idx = users.findIndex((u) => u.id === user.id);
      users[idx].password = validated.newPassword;
      localStorage.setItem('luxfilm_users', JSON.stringify(users));

      setPwMode(false);
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success(t('account.passwordUpdated'), {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #842A3B' },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fe = {};
        err.flatten().fieldErrors &&
          Object.keys(err.flatten().fieldErrors).forEach(
            (k) => (fe[k] = err.flatten().fieldErrors[k][0])
          );
        setErrors(fe);
        toast.error(t('account.fixErrors'));
      } else {
        toast.error(err.message || t('auth.loginFailed'));
        setErrors({ currentPassword: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fieldClass = (name) =>
    `flex items-center bg-white/5 border rounded-lg px-4 py-3 focus-within:bg-white/10 transition-all duration-300 ${errors[name]
      ? 'border-[#8C1007] focus-within:border-[#8C1007]'
      : 'border-white/10 focus-within:border-[#842A3B]/60'
    }`;

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <div className="h-36 bg-gradient-to-r from-[#3E0703] via-[#662222] to-[#842A3B]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 mb-5">
              <div className="relative">
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-3xl font-black border-4 border-[#1a1a1a] shadow-2xl`}>
                  {initials}
                </div>
                {saved && (
                  <div className="absolute -top-1 -end-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-1">
                <h1 className="text-2xl md:text-3xl font-black">{user.fullName || 'User'}</h1>
                <p className="text-gray-400 text-sm">@{user.userName || user.email?.split('@')[0]}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link to="/wishlist" className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#842A3B]/50 transition group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#842A3B]/20 flex items-center justify-center group-hover:bg-[#842A3B]/30 transition">
                    <Heart size={18} className="text-[#842A3B] fill-[#842A3B]" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">{wishlistCount}</p>
                    <p className="text-gray-500 text-xs">{t('account.wishlist')}</p>
                  </div>
                </div>
              </Link>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Calendar size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-gray-500 text-xs">{t('account.memberSince')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white capitalize">{t('account.active')}</p>
                    <p className="text-gray-500 text-xs">{t('account.accountStatus')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={18} className="text-[#842A3B]" /> {t('account.profileDetails')}
                </h2>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#842A3B] hover:text-[#A3485A] transition border border-[#842A3B]/40 hover:border-[#842A3B] rounded-lg px-3 py-1.5">
                    <Edit3 size={13} /> {t('account.edit')}
                  </button>
                ) : (
                  <button onClick={() => { setEditMode(false); setErrors({}); setFormData({ fullName: user?.fullName || '', userName: user?.userName || '', phone: user?.phone || '' }); }} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5">
                    <X size={13} /> {t('account.cancel')}
                  </button>
                )}
              </div>

              {!editMode ? (
                <div className="space-y-4">
                  {[
                    { icon: <User size={16} />, label: t('auth.fullName'), value: user.fullName },
                    { icon: <span className="text-sm font-bold">@</span>, label: t('auth.username'), value: user.userName },
                    { icon: <Mail size={16} />, label: t('auth.email'), value: user.email },
                    { icon: <Phone size={16} />, label: t('auth.phone'), value: user.phone || '—' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-0.5">{item.label}</p>
                        <p className="text-white font-medium text-sm truncate">{item.value || '—'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{t('auth.fullName')}</label>
                    <div className={fieldClass('fullName')}>
                      <User size={16} className="text-gray-500 flex-shrink-0" />
                      <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="bg-transparent border-none outline-none ms-3 w-full text-white text-sm placeholder:text-gray-600" placeholder={t('auth.fullNamePlaceholder')} />
                    </div>
                    {errors.fullName && <p className="text-[#ff6b6b] text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{t('auth.username')}</label>
                    <div className={fieldClass('userName')}>
                      <span className="text-gray-500 text-sm font-bold flex-shrink-0">@</span>
                      <input type="text" value={formData.userName} onChange={(e) => setFormData({ ...formData, userName: e.target.value })} className="bg-transparent border-none outline-none ms-3 w-full text-white text-sm placeholder:text-gray-600" placeholder={t('auth.usernamePlaceholder')} />
                    </div>
                    {errors.userName && <p className="text-[#ff6b6b] text-xs mt-1">{errors.userName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{t('auth.email')} ({t('account.readOnly')})</label>
                    <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 opacity-60 cursor-not-allowed">
                      <Mail size={16} className="text-gray-500 flex-shrink-0" />
                      <input type="email" value={user.email} readOnly className="bg-transparent border-none outline-none ms-3 w-full text-gray-400 text-sm cursor-not-allowed" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{t('auth.phone')}</label>
                    <div className={fieldClass('phone')}>
                      <Phone size={16} className="text-gray-500 flex-shrink-0" />
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-transparent border-none outline-none ms-3 w-full text-white text-sm placeholder:text-gray-600" placeholder={t('auth.phonePlaceholder')} />
                    </div>
                    {errors.phone && <p className="text-[#ff6b6b] text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                    {loading ? <span className="animate-pulse">{t('account.saving')}</span> : <><Save size={15} /> {t('account.saveChanges')}</>}
                  </button>
                </form>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Lock size={18} className="text-[#842A3B]" /> {t('auth.password')}
                </h2>
                {!pwMode ? (
                  <button onClick={() => setPwMode(true)} className="flex items-center gap-1.5 text-xs font-semibold text-[#842A3B] hover:text-[#A3485A] transition border border-[#842A3B]/40 hover:border-[#842A3B] rounded-lg px-3 py-1.5">
                    <Edit3 size={13} /> {t('account.change')}
                  </button>
                ) : (
                  <button onClick={() => { setPwMode(false); setErrors({}); setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5">
                    <X size={13} /> {t('account.cancel')}
                  </button>
                )}
              </div>

              {!pwMode ? (
                <p className="text-gray-500 text-sm">••••••••••••  —  {t('account.lastUpdatedUnknown')}</p>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {[
                    { key: 'currentPassword', label: t('account.currentPassword'), show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                    { key: 'newPassword', label: t('account.newPassword'), show: showNew, toggle: () => setShowNew(!showNew) },
                    { key: 'confirmPassword', label: t('account.confirmNewPassword'), show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                  ].map(({ key, label, show, toggle }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{label}</label>
                      <div className={fieldClass(key)}>
                        <Lock size={16} className="text-gray-500 flex-shrink-0" />
                        <input type={show ? 'text' : 'password'} value={pwData[key]} onChange={(e) => setPwData({ ...pwData, [key]: e.target.value })} className="bg-transparent border-none outline-none ms-3 w-full text-white text-sm placeholder:text-gray-600" placeholder="••••••••" />
                        <button type="button" onClick={toggle} className="text-gray-500 hover:text-white transition flex-shrink-0">
                          {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors[key] && <p className="text-[#ff6b6b] text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}

                  <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 text-sm">
                    {loading ? <span className="animate-pulse">{t('account.updating')}</span> : <><Save size={15} /> {t('account.updatePassword')}</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Heart size={16} className="text-[#842A3B] fill-[#842A3B]" /> {t('account.myWishlist')}
                </h2>
                <Link to="/wishlist" className="text-xs text-[#842A3B] hover:text-[#A3485A] font-semibold transition">
                  {t('account.viewAll')}
                </Link>
              </div>

              {wishlistCount === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Heart size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-xs">{t('account.noSavedMovies')}</p>
                  <Link to="/" className="mt-3 text-xs text-[#842A3B] hover:text-[#A3485A] font-semibold transition">
                    {t('account.browseMovies')}
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.slice(0, 4).map((movie) => (
                    <Link key={movie.id} to={`/movie/${movie.id}`} className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 -mx-2 transition group">
                      <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path || movie.backdrop_path}`} alt={movie.title} className="w-10 h-14 object-cover rounded-md flex-shrink-0" onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56/1c1c1c/666'; }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-[#A3485A] transition">{movie.title || movie.name}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{(movie.release_date || movie.first_air_date)?.split('-')[0]}</p>
                      </div>
                    </Link>
                  ))}
                  {wishlistCount > 4 && (
                    <Link to="/wishlist" className="block text-center text-xs text-gray-500 hover:text-[#842A3B] transition font-semibold py-2 border-t border-white/5 mt-2">
                      {t('account.moreMovies', { count: wishlistCount - 4 })}
                    </Link>
                  )}
                </div>
              )}
            </div>

            <div className="bg-[#1a1a1a] border border-red-900/20 rounded-2xl p-6">
              <h2 className="text-base font-bold text-red-400 mb-4">{t('account.dangerZone')}</h2>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 border border-red-900/40 text-red-400 hover:bg-red-900/20 hover:border-red-500 transition-all duration-300 py-2.5 rounded-lg text-sm font-semibold">
                <LogOut size={15} /> {t('account.signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
