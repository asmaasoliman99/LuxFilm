import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import logo from "../assets/logo.png";
import {
  Search,
  LogIn,
  Languages,
  CircleUserRound,
  ChevronDown,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext.js";
import "../index.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useContext(LanguageContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [genres, setGenres] = useState([]);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  const handleSearch = (event) => {
    event.preventDefault();
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }

    if (!searchQuery.trim() && !selectedGenre) {
      setIsSearchOpen(true);
      return;
    }

    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedGenre) params.set('genre', selectedGenre);
    navigate(`/search?${params.toString()}`);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);

    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
        );
        setGenres(res.data.genres);
      } catch {
        console.error("Error fetching genres");
      }
    };

    fetchGenres();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [API_KEY]);

  const navItemClass =
    "cursor-pointer hover:text-[#660B05] transition duration-300 font-semibold";

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 lg:px-12 transition-all duration-500 ${isScrolled ? "bg-[#141414]" : "bg-transparent bg-gradient-to-b from-black/70 to-transparent"}`}
    >
      <div className="flex items-center gap-6 lg:gap-10">
        <Link to="/">
          <img
            src={logo}
            alt="LuxFilm"
            className="w-40 lg:w-30 cursor-pointer object-contain"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-5 text-sm text-[#e5e5e5]">
          <li className={navItemClass}>
            <Link to="/">{t('home')}</Link>
          </li>

          <li
            className={`relative group flex items-center gap-1 ${navItemClass}`}
          >
            {t('genres')} <ChevronDown size={14} />
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#141414] border border-gray-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
              <div className="grid grid-cols-1 py-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}/${genre.name}`}
                    className="px-4 py-2 hover:bg-[#660B05] hover:text-white transition text-xs font-medium"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li className={navItemClass}>{t('myList')}</li>
        </ul>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 text-white">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
            className={`flex items-center bg-black/60 border transition-all duration-300 px-3 py-2 rounded-full overflow-hidden ${isSearchOpen ? "w-44 lg:w-72 border-white/80" : "w-16 border-white/40"}`}
          >
            <button
              type="submit"
              className="focus:outline-none flex items-center justify-center p-0"
            >
              <Search
                size={30}
                className="cursor-pointer hover:text-gray-300 transition-transform active:scale-90"
              />
            </button>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              autoFocus={isSearchOpen}
              className={`bg-transparent border-none outline-none text-base px-3 transition-all duration-300 placeholder:text-gray-400 ${isSearchOpen ? "w-full opacity-100 ml-2" : "w-0 opacity-0 pointer-events-none"}`}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>

          {isSearchOpen && (
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-black/70 border border-white/40 text-sm text-white rounded-full px-3 py-2 outline-none"
            >
              <option value="">{t('allGenres')}</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          )}
        </form>

        <div className="flex items-center gap-2 border border-gray-600 rounded bg-black/40 px-2 py-1">
          <Languages size={18} />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs border-none outline-none cursor-pointer"
          >
            <option value="en" className="bg-[#141414]">
              {t('langEnglish')}
            </option>
            <option value="ar" className="bg-[#141414]">
              {t('langArabic')}
            </option>
          </select>
        </div>

        <CircleUserRound
          size={24}
          className="cursor-pointer hover:text-gray-300 transition"
        />
        <LogIn
          size={24}
          className="cursor-pointer hover:text-[#660B05] transition"
          onClick={() => navigate("/login")}
        />
      </div>
    </nav>
  );
};

export default Navbar;
