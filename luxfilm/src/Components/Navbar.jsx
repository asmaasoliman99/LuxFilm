import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Search, LogIn, LogOut, Languages, CircleUserRound, ChevronDown, Heart } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useWishlist } from '../Context/WishlistContext';
import { useLanguage } from '../Context/Language';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { lang, setLang } = useLanguage(); 

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false); 
  const [genres, setGenres] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    
    axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
      .then(res => setGenres(res.data.genres))
      .catch(() => console.error('Error fetching genres'));

    return () => window.removeEventListener('scroll', handleScroll);
  }, [API_KEY]);

  useEffect(() => {
    if (!searchQuery.trim()) return;
    const timer = setTimeout(() => navigate(`/search?query=${searchQuery}`), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, navigate]);

  const navItemClass = 'cursor-pointer hover:text-[#842A3B] transition duration-300 font-semibold';

  return (
    <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 lg:px-12 transition-all duration-500 ${isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'}`}>
      
      {/* Left Side: Logo & Main Nav */}
      <div className="flex items-center gap-6 lg:gap-10">
        <Link to="/"><img src={logo} alt="LuxFilm" className="w-40 lg:w-30 object-contain" /></Link>
        <ul className="hidden md:flex items-center gap-5 text-sm text-[#e5e5e5]">
          <li className={navItemClass}><Link to="/">Home</Link></li>
          <li className={`relative group flex items-center gap-1 ${navItemClass}`}>
            Genres <ChevronDown size={14} />
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#141414] border border-gray-700 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
              <div className="grid py-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {genres.map(g => (
                  <Link key={g.id} to={`/genre/${g.id}/${g.name}`} className="px-4 py-2 hover:bg-[#842A3B] hover:text-white text-xs transition">{g.name}</Link>
                ))}
              </div>
            </div>
          </li>
          <li className={navItemClass}><Link to="/wishlist">My List</Link></li>
        </ul>
      </div>

      {/* Right Side: Tools & Profile */}
      <div className="flex items-center gap-4 lg:gap-6 text-white">
        
        {/* Search Input */}
        <div className={`flex items-center bg-black/60 border transition-all px-3 py-2 rounded-full overflow-hidden ${isSearchOpen ? 'w-44 lg:w-72 border-white/80' : 'w-16 border-white/40'}`}>
          <button onClick={() => setIsSearchOpen(!isSearchOpen)}><Search size={22} className="active:scale-90 transition" /></button>
          <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus={isSearchOpen} placeholder="Search..." className={`bg-transparent outline-none text-sm px-3 transition-all ${isSearchOpen ? 'w-full opacity-100 ml-2' : 'w-0 opacity-0 pointer-events-none'}`} />
        </div>

        {/* Language Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-[11px] font-bold text-gray-300 hover:text-white uppercase"
          >
            <Languages size={16} className="text-gray-400" />
            {lang}
            <ChevronDown size={10} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          {isLangOpen && (
            <div className="absolute top-full right-0 mt-2 w-20 bg-[#141414] border border-white/10 rounded-md shadow-2xl py-1 z-[100] animate-in fade-in zoom-in duration-200">
              {['en', 'ar'].map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setIsLangOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-[10px] font-bold transition-colors uppercase hover:bg-[#842A3B] ${lang === l ? 'text-[#842A3B] hover:text-white' : 'text-gray-300'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist */}
        <Link to="/wishlist" className="relative">
          <Heart size={24} className={`transition ${wishlistCount > 0 ? 'text-[#842A3B] fill-[#842A3B]' : 'hover:text-[#842A3B]'}`} />
          {wishlistCount > 0 && <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#842A3B] text-[10px] rounded-full flex items-center justify-center shadow-lg">{wishlistCount > 99 ? '99+' : wishlistCount}</span>}
        </Link>

        {/* User Auth */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/account" className="flex items-center gap-2 group">
              <span className="hidden lg:block text-xs font-semibold text-gray-300 group-hover:text-white transition">Hi, {user.fullName?.split(' ')[0] || user.email?.split('@')[0]}</span>
              <CircleUserRound size={24} className="hover:text-[#842A3B] transition" />
            </Link>
            <LogOut size={24} className="hover:text-[#ff4444] transition cursor-pointer" onClick={() => { logout(); navigate('/login'); }} />
          </div>
        ) : (
          <LogIn size={24} className="hover:text-[#842A3B] transition cursor-pointer" onClick={() => navigate('/login')} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;