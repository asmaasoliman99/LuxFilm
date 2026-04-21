import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import logo from '../assets/logo.png';
import { Search, LogIn, Languages, CircleUserRound, ChevronDown } from 'lucide-react';
import '../index.css';

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    
    const fetchGenres = async () => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
        setGenres(res.data.genres);
      } catch { 
        console.error("Error fetching genres");
       }
    };

    fetchGenres();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [API_KEY]);

  const navItemClass = "cursor-pointer hover:text-[#660B05] transition duration-300 font-semibold";

  return (
    <nav className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 lg:px-12 transition-all duration-500 ${isScrolled ? 'bg-[#141414]' : 'bg-transparent bg-gradient-to-b from-black/70 to-transparent'}`}>
      
      <div className="flex items-center gap-6 lg:gap-10">
        <Link to="/"><img src={logo} alt="LuxFilm" className="w-40 lg:w-30 cursor-pointer object-contain" /></Link>
        
        <ul className="hidden md:flex items-center gap-5 text-sm text-[#e5e5e5]">
          <li className={navItemClass}><Link to="/">Home</Link></li>
          
          <li className={`relative group flex items-center gap-1 ${navItemClass}`}>
            Genres <ChevronDown size={14} />
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#141414] border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
              <div className="grid grid-cols-1 py-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {genres.map((genre) => (
                  <Link key={genre.id} to={`/genre/${genre.id}/${genre.name}`} className="px-4 py-2 hover:bg-[#660B05] hover:text-white transition text-xs font-medium">{genre.name}</Link>
                ))}
              </div>
            </div>
          </li>
          <li className={navItemClass}>My List</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 text-white">
        {/* Search Bar */}
        <div className={`flex items-center bg-black/60 border transition-all duration-300 px-3 py-2 rounded-full overflow-hidden 
              ${isSearchOpen ? 'w-44 lg:w-72 border-white/80' : 'w-16 border-white/40'}`}
            >
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="focus:outline-none flex items-center justify-center p-0" 
              >
                <Search 
                  size={30} 
                  className="cursor-pointer hover:text-gray-300 transition-transform active:scale-90" 
                />
              </button>
              
              <input 
                type="text" 
                placeholder="Titles, people, genres" 
                autoFocus={isSearchOpen}
                className={`bg-transparent border-none outline-none text-base px-3 transition-all duration-300 placeholder:text-gray-400
                  ${isSearchOpen ? 'w-full opacity-100 ml-2' : 'w-0 opacity-0 pointer-events-none'}`}
              />
            </div>

        <div className="flex items-center gap-2 border border-gray-600 rounded bg-black/40 px-2 py-1 cursor-pointer">
          <Languages size={18} />
          <select className="bg-transparent text-xs border-none outline-none cursor-pointer">
            <option value="en" className="bg-[#141414]">English</option>
            <option value="ar" className="bg-[#141414]">العربية</option>
          </select>
        </div>

        <CircleUserRound size={24} className="cursor-pointer hover:text-gray-300 transition" />
        <LogIn size={24} className="cursor-pointer hover:text-[#660B05] transition" onClick={() => navigate('/login')} />
      </div>
    </nav>
  );
};

export default Navbar;