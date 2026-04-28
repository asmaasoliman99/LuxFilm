import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Play, Heart, Star, Calendar, Clock, Globe } from "lucide-react";
import TitleCards from "../Components/TitleCards";
import { useWishlist } from "../context/WishlistContext";
import { LanguageContext } from "../context/LanguageContext";
import { ThemeContext } from "../context/ThemeContext";

const MovieDetails = () => {
  const { theme } = useContext(ThemeContext);
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isSeries, setIsSeries] = useState(false);
  
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { t, lang } = useContext(LanguageContext);

  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = "https://api.themoviedb.org/3";

  const isLight = theme === "light";

  useEffect(() => {
    const fetchData = async () => {
      try {
        let type = "movie";
        let mainRes;

        try {
          mainRes = await axios.get(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=${lang}`
          );
          setIsSeries(false);
        } catch {
          mainRes = await axios.get(
            `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=${lang}`
          );
          type = "tv";
          setIsSeries(true);

          const sRes = await axios.get(
            `${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}&language=${lang}`
          );
          setEpisodes(sRes.data.episodes);
        }

        setItem(mainRes.data);

        const vRes = await axios.get(
          `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}&language=${lang}`
        );
        setTrailerKey(vRes.data.results.find((v) => v.type === "Trailer")?.key);
      } catch (err) {
        console.error("Details Fetch Error:", err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, API_KEY, lang]);

  if (!item)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white font-bold">
        {t("loading")}
      </div>
    );

  const inWishlist = isInWishlist(item.id);

  return (
    <div className={`min-h-screen pb-20 ${isLight ? "bg-white text-black" : "bg-[var(--bg-primary)] text-[var(--text-primary)]"}`}>
      {/* Hero Banner */}
      <div className="relative h-[80vh] w-full bg-black overflow-hidden">
        {trailerKey ? (
          <iframe
            className="w-full h-full scale-150 pointer-events-none"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}`}
            frameBorder="0"
            allow="autoplay"
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            className="w-full h-full object-cover opacity-60"
            alt="backdrop"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
      </div>

      <div className="px-6 md:px-12 -mt-60 relative z-10">
        {/* Genre Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.genres?.map((g) => (
            <span
              key={g.id}
              className={`px-3 py-1 backdrop-blur-md border rounded-full text-xs font-semibold ${
                isLight 
                  ? "bg-gray-100 border-gray-300 text-gray-800" 
                  : "bg-white/10 border-white/20 text-gray-200"
              }`}
            >
              {g.name}
            </span>
          ))}
        </div>

        <h1 className={`text-6xl md:text-7xl font-black mb-6 max-w-4xl leading-tight ${isLight ? "text-black" : ""}`}>
          {item.title || item.name}
        </h1>

        <div className="flex items-center gap-6 mb-8">
          <button className="flex items-center gap-2 px-10 py-3 bg-white text-black font-bold rounded hover:bg-white/90 transition text-xl shadow-lg">
            <Play fill="black" size={24} /> {t("play")}
          </button>

          <button
            onClick={() => toggleWishlist(item)}
            className={`p-3 border-2 rounded-full transition-all duration-300 ${
              inWishlist
                ? "border-[#842A3B] bg-[#842A3B]/20 hover:bg-[#842A3B]/30"
                : isLight 
                  ? "border-gray-400 hover:border-gray-600 bg-white/80" 
                  : "border-gray-400 hover:border-white bg-black/20"
            }`}
            title={inWishlist ? t("removeFromWishlist") : t("addToWishlist")}
          >
            <Heart
              size={24}
              className={`transition-all duration-300 ${
                inWishlist 
                  ? "text-[#842A3B] fill-[#842A3B]" 
                  : isLight 
                    ? "text-gray-700" 
                    : "text-white"
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-1 text-green-500">
                <Star size={16} fill="currentColor" />
                <span>
                  {(item.vote_average * 10).toFixed(0)}
                  {t("match")}
                </span>
              </div>
              <div className={`flex items-center gap-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                <Calendar size={16} />
                <span>
                  {(item.release_date || item.first_air_date)?.split("-")[0]}
                </span>
              </div>
              {item.runtime && (
                <div className={`flex items-center gap-1 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                  <Clock size={16} />
                  <span>
                    {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
                  </span>
                </div>
              )}
              <span className={`px-2 py-0.5 border rounded text-[10px] uppercase font-medium ${
                isLight ? "border-gray-400 text-gray-600" : "border-gray-600 text-gray-400"
              }`}>
                {t("ultraHD")}
              </span>
            </div>

            <div>
              <h3 className={`font-bold uppercase tracking-widest text-xs mb-3 ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                {t("description")}
              </h3>
              <p className={`text-lg md:text-xl leading-relaxed ${isLight ? "text-gray-900" : "text-gray-100"}`}>
                {item.overview || "No description available."}
              </p>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className={`p-6 rounded-xl border space-y-4 text-sm ${
            isLight 
              ? "bg-gray-50 border-gray-200" 
              : "bg-white/5 border-white/10"
          }`}>
            {[
              {
                label: "Original Language",
                val: item.spoken_languages?.[0]?.english_name || item.original_language,
                icon: <Globe size={14} />,
              },
              {
                label: "Production",
                val: item.production_companies?.slice(0, 2).map((c) => c.name).join(", "),
              },
              { label: "Status", val: item.status, isBadge: true },
            ].map((info, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 ${idx !== 0 ? "border-t pt-4" : ""} ${
                  isLight ? "border-gray-200" : "border-white/10"
                }`}
              >
                <span className={`uppercase text-[10px] font-bold ${isLight ? "text-gray-500" : "text-gray-500"}`}>
                  {info.label}
                </span>
                <span
                  className={`flex items-center gap-2 ${
                    info.isBadge
                      ? isLight 
                        ? "bg-green-100 text-green-700 px-2 py-1 rounded w-fit text-[10px] font-bold" 
                        : "bg-green-500/20 text-green-400 px-2 py-1 rounded w-fit text-[10px] font-bold"
                      : isLight 
                        ? "text-gray-800" 
                        : "text-gray-200"
                  }`}
                >
                  {info.icon} {info.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Episodes Section */}
        {isSeries && episodes.length > 0 && (
          <div className="mt-24">
            <h2 className={`text-3xl font-bold mb-8 border-l-4 pl-4 ${isLight ? "border-red-600 text-black" : "border-red-600"}`}>
              Episodes
            </h2>
          </div>
        )}

        <div className="mt-24">
          <TitleCards
            title="Because you watched this"
            category={`${isSeries ? "tv" : "movie"}/${id}/recommendations`}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;