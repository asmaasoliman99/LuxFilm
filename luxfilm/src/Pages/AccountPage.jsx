import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import {
  User, Mail, Phone, Lock, Eye, EyeOff, Edit3, Save, X,
  LogOut, Heart, Calendar, Shield, Camera, CheckCircle
} from 'lucide-react';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAuth } from '../Context/AuthContext';
import { useWishlist } from '../Context/WishlistContext';
import { Link } from 'react-router';

const updateSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .refine((n) => n.trim().split(' ').length >= 2, { message: 'Enter first and last name' }),
  userName: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^\d+$/, 'Digits only')
    .optional()
    .or(z.literal('')),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password required'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/* ─── Avatar colour hash ─── */
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
        <h2 className="text-3xl font-black mb-3">Access Denied</h2>
        <p className="text-gray-400 mb-8 text-center max-w-sm">
          You need to be signed in to view account details.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 bg-gradient-to-r from-[#842A3B] to-[#662222] text-white font-bold rounded-lg hover:scale-105 transition-all"
        >
          Sign In
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

  /* ── profile save ── */
  const handleSave = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const validated = updateSchema.parse(formData);
      updateUser(validated);
      setEditMode(false);
      setSaved(true);
      toast.success('Profile updated!', {
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
        toast.error('Please fix the errors');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── password change ── */
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const validated = passwordSchema.parse(pwData);
      // verify current password
      const users = JSON.parse(localStorage.getItem('luxfilm_users') || '[]');
      const found = users.find((u) => u.id === user.id && u.password === validated.currentPassword);
      if (!found) throw new Error('Current password is incorrect');

      // update password in users array
      const idx = users.findIndex((u) => u.id === user.id);
      users[idx].password = validated.newPassword;
      localStorage.setItem('luxfilm_users', JSON.stringify(users));

      setPwMode(false);
      setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password updated successfully!', {
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
        toast.error('Please fix the errors');
      } else {
        toast.error(err.message || 'Password update failed');
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
    `flex items-center bg-white/5 border rounded-lg px-4 py-3 focus-within:bg-white/10 transition-all duration-300 ${
      errors[name]
        ? 'border-[#8C1007] focus-within:border-[#8C1007]'
        : 'border-white/10 focus-within:border-[#842A3B]/60'
    }`;

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-4 md:px-12">
      <div className="max-w-5xl mx-auto">

        {/* ── Hero Card ── */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          {/* background strip */}
          <div className="h-36 bg-gradient-to-r from-[#3E0703] via-[#662222] to-[#842A3B]">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
          </div>

          <div className="bg-[#1a1a1a] border border-white/5 px-6 pb-6 pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 mb-5">
              {/* Avatar */}
              <div className="relative">
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center text-3xl font-black border-4 border-[#1a1a1a] shadow-2xl`}
                >
                  {initials}
                </div>
                {saved && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle size={14} />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-1">
                <h1 className="text-2xl md:text-3xl font-black">{user.fullName || 'User'}</h1>
                <p className="text-gray-400 text-sm">@{user.userName || user.email?.split('@')[0]}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-300 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link
                to="/wishlist"
                className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-[#842A3B]/50 transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#842A3B]/20 flex items-center justify-center group-hover:bg-[#842A3B]/30 transition">
                    <Heart size={18} className="text-[#842A3B] fill-[#842A3B]" />
                  </div>
                  <div>
                    <p className="text-2xl font-black">{wishlistCount}</p>
                    <p className="text-gray-500 text-xs">Wishlist</p>
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
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
                    </p>
                    <p className="text-gray-500 text-xs">Member since</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Shield size={18} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white capitalize">Active</p>
                    <p className="text-gray-500 text-xs">Account status</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Profile Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Details Card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <User size={18} className="text-[#842A3B]" /> Profile Details
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#842A3B] hover:text-[#A3485A] transition border border-[#842A3B]/40 hover:border-[#842A3B] rounded-lg px-3 py-1.5"
                  >
                    <Edit3 size={13} /> Edit
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditMode(false); setErrors({}); setFormData({ fullName: user?.fullName || '', userName: user?.userName || '', phone: user?.phone || '' }); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5"
                  >
                    <X size={13} /> Cancel
                  </button>
                )}
              </div>

              {!editMode ? (
                <div className="space-y-4">
                  {[
                    { icon: <User size={16} />, label: 'Full Name', value: user.fullName },
                    { icon: <span className="text-sm font-bold">@</span>, label: 'Username', value: user.userName },
                    { icon: <Mail size={16} />, label: 'Email', value: user.email },
                    { icon: <Phone size={16} />, label: 'Phone', value: user.phone || '—' },
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
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Full Name</label>
                    <div className={fieldClass('fullName')}>
                      <User size={16} className="text-gray-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-transparent border-none outline-none ml-3 w-full text-white text-sm placeholder:text-gray-600"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && <p className="text-[#ff6b6b] text-xs mt-1">{errors.fullName}</p>}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Username</label>
                    <div className={fieldClass('userName')}>
                      <span className="text-gray-500 text-sm font-bold flex-shrink-0">@</span>
                      <input
                        type="text"
                        value={formData.userName}
                        onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                        className="bg-transparent border-none outline-none ml-3 w-full text-white text-sm placeholder:text-gray-600"
                        placeholder="johndoe123"
                      />
                    </div>
                    {errors.userName && <p className="text-[#ff6b6b] text-xs mt-1">{errors.userName}</p>}
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Email (read-only)</label>
                    <div className="flex items-center bg-white/[0.03] border border-white/5 rounded-lg px-4 py-3 opacity-60 cursor-not-allowed">
                      <Mail size={16} className="text-gray-500 flex-shrink-0" />
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className="bg-transparent border-none outline-none ml-3 w-full text-gray-400 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">Phone</label>
                    <div className={fieldClass('phone')}>
                      <Phone size={16} className="text-gray-500 flex-shrink-0" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-transparent border-none outline-none ml-3 w-full text-white text-sm placeholder:text-gray-600"
                        placeholder="0123456789"
                      />
                    </div>
                    {errors.phone && <p className="text-[#ff6b6b] text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? <span className="animate-pulse">Saving...</span> : <><Save size={15} /> Save Changes</>}
                  </button>
                </form>
              )}
            </div>

            {/* Change Password Card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Lock size={18} className="text-[#842A3B]" /> Password
                </h2>
                {!pwMode ? (
                  <button
                    onClick={() => setPwMode(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#842A3B] hover:text-[#A3485A] transition border border-[#842A3B]/40 hover:border-[#842A3B] rounded-lg px-3 py-1.5"
                  >
                    <Edit3 size={13} /> Change
                  </button>
                ) : (
                  <button
                    onClick={() => { setPwMode(false); setErrors({}); setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-1.5"
                  >
                    <X size={13} /> Cancel
                  </button>
                )}
              </div>

              {!pwMode ? (
                <p className="text-gray-500 text-sm">••••••••••••  —  last updated unknown</p>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {[
                    { key: 'currentPassword', label: 'Current Password', show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                    { key: 'newPassword', label: 'New Password', show: showNew, toggle: () => setShowNew(!showNew) },
                    { key: 'confirmPassword', label: 'Confirm New Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                  ].map(({ key, label, show, toggle }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest">{label}</label>
                      <div className={fieldClass(key)}>
                        <Lock size={16} className="text-gray-500 flex-shrink-0" />
                        <input
                          type={show ? 'text' : 'password'}
                          value={pwData[key]}
                          onChange={(e) => setPwData({ ...pwData, [key]: e.target.value })}
                          className="bg-transparent border-none outline-none ml-3 w-full text-white text-sm placeholder:text-gray-600"
                          placeholder="••••••••"
                        />
                        <button type="button" onClick={toggle} className="text-gray-500 hover:text-white transition flex-shrink-0">
                          {show ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                      {errors[key] && <p className="text-[#ff6b6b] text-xs mt-1">{errors[key]}</p>}
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#842A3B] to-[#662222] hover:from-[#A3485A] hover:to-[#7d3535] text-white font-bold py-3 rounded-lg transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 text-sm"
                  >
                    {loading ? <span className="animate-pulse">Updating...</span> : <><Save size={15} /> Update Password</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: Wishlist preview */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Heart size={16} className="text-[#842A3B] fill-[#842A3B]" /> My Wishlist
                </h2>
                <Link
                  to="/wishlist"
                  className="text-xs text-[#842A3B] hover:text-[#A3485A] font-semibold transition"
                >
                  View all →
                </Link>
              </div>

              {wishlistCount === 0 ? (
                <div className="flex flex-col items-center py-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
                    <Heart size={24} className="text-gray-600" />
                  </div>
                  <p className="text-gray-500 text-xs">No saved movies yet</p>
                  <Link
                    to="/"
                    className="mt-3 text-xs text-[#842A3B] hover:text-[#A3485A] font-semibold transition"
                  >
                    Browse movies →
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.slice(0, 4).map((movie) => (
                    <Link
                      key={movie.id}
                      to={`/movie/${movie.id}`}
                      className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 -mx-2 transition group"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path || movie.backdrop_path}`}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-md flex-shrink-0"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/40x56/1c1c1c/666'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-[#A3485A] transition">
                          {movie.title || movie.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {(movie.release_date || movie.first_air_date)?.split('-')[0]}
                        </p>
                      </div>
                    </Link>
                  ))}
                  {wishlistCount > 4 && (
                    <Link
                      to="/wishlist"
                      className="block text-center text-xs text-gray-500 hover:text-[#842A3B] transition font-semibold py-2 border-t border-white/5 mt-2"
                    >
                      + {wishlistCount - 4} more movies
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="bg-[#1a1a1a] border border-red-900/20 rounded-2xl p-6">
              <h2 className="text-base font-bold text-red-400 mb-4">Danger Zone</h2>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-red-900/40 text-red-400 hover:bg-red-900/20 hover:border-red-500 transition-all duration-300 py-2.5 rounded-lg text-sm font-semibold"
              >
                <LogOut size={15} /> Sign Out of Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
