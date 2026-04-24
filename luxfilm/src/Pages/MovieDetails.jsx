import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Play, Heart, Star, Calendar, Clock, Globe } from 'lucide-react';
import TitleCards from '../Components/TitleCards';
import { useWishlist } from '../Context/WishlistContext';

const MovieDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isSeries, setIsSeries] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  useEffect(() => {
    const fetchData = async () => {
      try {
        let type = 'movie';
        let mainRes;
        try {
          mainRes = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
          setIsSeries(false);
        } catch {
          mainRes = await axios.get(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
          type = 'tv';
          setIsSeries(true);
          const sRes = await axios.get(`${BASE_URL}/tv/${id}/season/1?api_key=${API_KEY}`);
          setEpisodes(sRes.data.episodes);
        }
        setItem(mainRes.data);

        const vRes = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
        setTrailerKey(vRes.data.results.find((v) => v.type === 'Trailer')?.key);
      } catch (err) {
        console.error('Details Fetch Error:', err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id, API_KEY]);

  if (!item)
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white font-bold">
        Loading...
      </div>
    );

  const inWishlist = isInWishlist(item.id);

  return (
    <div className="bg-[#141414] min-h-screen text-white pb-20">
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
              className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-semibold text-gray-200"
            >
              {g.name}
            </span>
          ))}
        </div>

        <h1 className="text-5xl md:text-7xl font-black mb-6 max-w-4xl leading-tight">
          {item.title || item.name}
        </h1>

        <div className="flex items-center gap-6 mb-8">
          <button className="flex items-center gap-2 px-10 py-3 bg-white text-black font-bold rounded hover:bg-white/80 transition text-xl shadow-lg">
            <Play fill="black" size={24} /> Play
          </button>
          <button
            onClick={() => toggleWishlist(item)}
            className={`p-3 border-2 rounded-full transition-all duration-300 ${
              inWishlist
                ? 'border-[#842A3B] bg-[#842A3B]/20 hover:bg-[#842A3B]/30'
                : 'border-gray-400 hover:border-white bg-black/20'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={24}
              className={`transition-all duration-300 ${
                inWishlist ? 'text-[#842A3B] fill-[#842A3B]' : 'text-white'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold">
              <div className="flex items-center gap-1 text-green-500">
                <Star size={16} fill="currentColor" />
                <span>{(item.vote_average * 10).toFixed(0)}% Match</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Calendar size={16} />
                <span>{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
              </div>
              {item.runtime && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock size={16} />
                  <span>
                    {Math.floor(item.runtime / 60)}h {item.runtime % 60}m
                  </span>
                </div>
              )}
              <span className="px-2 py-0.5 border border-gray-600 text-[10px] rounded text-gray-400 uppercase">
                Ultra HD 4K
              </span>
            </div>
            <div>
              <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-3">
                Description
              </h3>
              <p className="text-lg md:text-xl text-gray-100 leading-relaxed font-light">
                {item.overview || 'No description available.'}
              </p>
            </div>
          </div>

          {/* Sidebar Details */}
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4 text-sm">
            {[
              {
                label: 'Original Language',
                val:
                  item.spoken_languages?.[0]?.english_name || item.original_language,
                icon: <Globe size={14} />,
              },
              {
                label: 'Production',
                val: item.production_companies
                  ?.slice(0, 2)
                  .map((c) => c.name)
                  .join(', '),
              },
              { label: 'Status', val: item.status, isBadge: true },
            ].map((info, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1 ${idx !== 0 ? 'border-t border-white/10 pt-4' : ''}`}
              >
                <span className="text-gray-500 font-bold uppercase text-[10px]">
                  {info.label}
                </span>
                <span
                  className={`${
                    info.isBadge
                      ? 'bg-green-500/20 text-green-400 px-2 py-1 rounded w-fit text-[10px] font-bold'
                      : 'text-gray-200 flex items-center gap-2'
                  }`}
                >
                  {info.icon} {info.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Episodes */}
        {isSeries && episodes.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-8 border-l-4 border-red-600 pl-4">Episodes</h2>
            <div className="flex flex-col gap-4">
              {episodes.map((ep) => (
                <div
                  key={ep.id}
                  className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl hover:bg-white/5 transition group"
                >
                  <span className="hidden md:block text-2xl text-gray-600 font-black w-10 group-hover:text-white">
                    {ep.episode_number}
                  </span>
                  <img
                    src={
                      ep.still_path
                        ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                        : 'https://via.placeholder.com/300x169'
                    }
                    className="w-full md:w-48 aspect-video object-cover rounded-lg"
                    alt={ep.name}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold">{ep.name}</h4>
                      <span className="text-gray-500 text-xs">{ep.runtime}m</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2">{ep.overview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-24">
          <TitleCards
            title="Because you watched this"
            category={`${isSeries ? 'tv' : 'movie'}/${id}/recommendations`}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
