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
  Sun,
  Moon,
} from "lucide-react";
import { LanguageContext } from "../context/LanguageContext.js";
import "../index.css";
import { ThemeContext } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const { toggleTheme, setTheme, theme } = useContext(ThemeContext);

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
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedGenre) params.set("genre", selectedGenre);
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

  const { lang, setLang, t } = useContext(LanguageContext);
  const navItemClass =
    "cursor-pointer hover:text-[#660B05] transition duration-300 font-semibold";

  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const themeContainer = document.getElementById("theme-container");
      if (themeContainer && !themeContainer.contains(e.target)) {
        setThemeMenuOpen(false);
      }
    };

    if (themeMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [themeMenuOpen]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 flex items-center justify-between px-4 py-4 lg:px-12 transition-all duration-500 ${isScrolled ? "bg-[var(--bg-secondary)]" : "bg-transparent bg-gradient-to-b from-black/70 to-transparent"}`}
    >
      <div className="flex items-center gap-6 lg:gap-10">
        <Link to="/">
          <img
            src={logo}
            alt="LuxFilm"
            className="w-40 lg:w-30 cursor-pointer object-contain"
          />
        </Link>

        <ul className="hidden md:flex items-center gap-5 text-sm text-[ #000000]">
          <li className={navItemClass}>
            <Link to="/">{t("home")}</Link>
          </li>

          <li
            className={`relative group flex items-center gap-1 ${navItemClass}`}
          >
            {t("genres")} <ChevronDown size={14} />
            <div className="absolute top-full left-0 mt-2 w-48 bg-[var(--bg-secondary)] border border-[var(--border)] rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100]">
              <div className="grid grid-cols-1 py-2 max-h-[400px] overflow-y-auto no-scrollbar">
                {genres.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/genre/${genre.id}/${genre.name}`}
                    className="px-4 py-2 hover:bg-[var(--accent)] hover:text-white transition text-xs font-medium"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </li>
          <li className={navItemClass}>
            <Link to="/wishlist">{t("myList")}</Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 lg:gap-6 text-[var(--text-primary)]">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div
            className={`flex items-center bg-[var(--bg-secondary)]/60 border transition-all duration-300 px-3 py-2 rounded-full overflow-hidden 
              ${isSearchOpen ? "w-44 lg:w-72 border-[var(--border)]" : "w-16 border-[var(--border)]/40"}`}
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
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus={isSearchOpen}
              className={`bg-transparent border-none outline-none text-base px-3 transition-all duration-300 placeholder:text-gray-400
                  ${isSearchOpen ? "w-full opacity-100 ml-2" : "w-0 opacity-0 pointer-events-none"}`}
            />
          </div>

          {isSearchOpen && (
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-[var(--bg-secondary)]/70 border border-[var(--border)]/40 text-sm text-[var(--text-primary)] rounded-full px-3 py-2 outline-none"
            >
              <option value="">{t("allGenres")}</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          )}
        </form>

        <div className="flex items-center gap-2 border border-[var(--border)] rounded bg-[var(--bg-secondary)]/40 px-2 py-1">
          <Languages size={18} />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs border-none outline-none cursor-pointer"
          >
            <option value="en" className="bg-[var(--bg-secondary)]">
              {t("langEnglish")}
            </option>
            <option value="ar" className="bg-[var(--bg-secondary)]">
              {t("langArabic")}
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
        <div className="relative" id="theme-container">
          <button
            onClick={() => setThemeMenuOpen((prev) => !prev)}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-lg transition-all duration-300"
            title={`Current: ${theme === "light" ? "Light Mode" : "Dark Mode"}`}
          >
            {theme === "light" ? (
              <Sun size={16} className="text-amber-500" />
            ) : (
              <Moon size={16} className="text-blue-400" />
            )}
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {theme === "light" ? "Light" : "Dark"}
            </span>
          </button>

          {themeMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] shadow-2xl overflow-hidden z-50 backdrop-blur-sm">
              <button
                onClick={() => {
                  setTheme("light");
                  setThemeMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                  theme === "light"
                    ? "bg-[var(--accent)] text-white font-bold"
                    : "text-[var(--text-primary)] hover:bg-[var(--accent)]/20"
                }`}
              >
                <Sun size={18} className="text-amber-500" />
                <span>{t("lightMode")}</span>
              </button>
              <div className="h-px bg-[var(--border)]" />
              <button
                onClick={() => {
                  setTheme("dark");
                  setThemeMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition ${
                  theme === "dark"
                    ? "bg-[var(--accent)] text-white font-bold"
                    : "text-[var(--text-primary)] hover:bg-[var(--accent)]/20"
                }`}
              >
                <Moon size={18} className="text-blue-400" />
                <span>{t("darkMode")}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
