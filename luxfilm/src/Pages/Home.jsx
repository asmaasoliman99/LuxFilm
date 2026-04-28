import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router";
import TitleCards from "../Components/TitleCards";
import { LanguageContext } from "../context/LanguageContext.js";
import { ThemeContext } from "../context/ThemeContext";

const Home = () => {
  const { t, lang } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const [heroMovie, setHeroMovie] = useState(null);
  const navigate = useNavigate();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const getHero = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=${lang}`,
        );
        const results = res.data.results;
        const randomMovie = results[Math.floor(Math.random() * results.length)];
        setHeroMovie(randomMovie);
      } catch (err) {
        console.error("Error fetching hero:", err);
      }
    };

    if (API_KEY) {
      getHero();
    }
  }, [API_KEY, lang]);

  const handleMoreInfo = () => {
    if (heroMovie?.id) {
      navigate(`/movie/${heroMovie.id}`);
    }
  };

  return (
    <div className="relative bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)] overflow-hidden">
      {/* Hero Section */}
      <div className="relative w-full h-[80vh] md:h-[95vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {heroMovie && (
            <img
              src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path} ${theme === "light" ? "text-white" : ""}`}
              alt={heroMovie.title}
              className="w-full h-full object-cover brightness-[0.6] transition-opacity duration-500"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)] via-transparent to-transparent"></div>
          <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>
        </div>

        <div className="relative z-10 px-6 md:px-12 max-w-3xl mt-1">
          <h1
            className={`text-4xl md:text-6xl font-extrabold mb-1 drop-shadow-lg text-black ${theme === "light" ? "text-black" : ""}`}
          >
            {heroMovie?.title || heroMovie?.name || t("loading")}
          </h1>
          <p
            className={`text-sm md:text-lg leading-snug mb-8 drop-shadow-md line-clamp-3 md:line-clamp-4 text-black ${theme === "light" ? "text-black" : ""}`}
          >
            {heroMovie?.overview}
          </p>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white text-black px-5 py-2 md:px-8 md:py-3 rounded hover:bg-white/80 transition font-bold shadow-lg">
              <Play className="fill-black w-5 h-5 md:w-6 md:h-6" /> {t("play")}
            </button>

            <button
              onClick={handleMoreInfo}
              className={`${theme === "light" ? "text-black" : ""} flex items-center gap-2 bg-gray-500/50 text-white px-5 py-2 md:px-8 md:py-3 rounded hover:bg-gray-500/30 transition font-bold backdrop-blur-md shadow-lg ${theme === "light" ? "text-black" : ""}`}
            >
              <Info className="w-5 h-5 md:w-6 md:h-6" /> {t("moreInfo")}
            </button>
          </div>
        </div>
      </div>

      {/* Movies Rows */}
      <div className="relative z-20 px-0 -mt-1 md:-mt-24 flex flex-col gap-1 pb-35">
        <TitleCards title={t("blockbusterMovies")} category="top_rated" />
        <TitleCards title={t("onlyOnLuxFilm")} category="popular" />
        <TitleCards title={t("upcoming")} category="upcoming" />
        <TitleCards title={t("topPicksForYou")} category="now_playing" />
      </div>
    </div>
  );
};

export default Home;
