import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import { Play, Info, Heart } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';

const MovieCard = React.memo(({ movie, API_KEY, genresList = [] }) => {
  const [videoKey, setVideoKey] = useState(null);
  const [hovering, setHovering] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const inWishlist = isInWishlist(movie.id);

  const genres = useMemo(() => {
    if (!movie?.genre_ids || !Array.isArray(genresList)) {
      return "";
    }

    return movie.genre_ids
      .slice(0, 3)
      .map((id) => {
        const foundGenre = genresList.find((g) => g && g.id === id);
        return foundGenre ? foundGenre.name : null;
      })
      .filter(Boolean)
      .join(' • ');
  }, [movie.genre_ids, genresList]);

  const fetchTrailer = async () => {
    setHovering(true);
    if (videoKey) return;
    try {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`
      );
      const trailer = data.results.find(
        (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
      );
      if (trailer) setVideoKey(trailer.key);
    } catch (err) {
      console.error("Trailer Fetch Error:", err);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(movie);
  };

  return (
    <Link
      to={`/movie/${movie.id}`}
      onMouseEnter={fetchTrailer}
      onMouseLeave={() => setHovering(false)}
      className="group/card min-w-[200px] md:min-w-[280px] relative cursor-pointer rounded-lg transition-all duration-500 hover:scale-125 z-10 hover:z-50 shadow-none hover:shadow-2xl"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-lg bg-[#141414]">
        {hovering && videoKey ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
            className="w-full h-full scale-110 pointer-events-none border-none"
            title="movie-trailer"
            allow="autoplay"
          />
        ) : (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`}
            className="w-full h-full object-cover"
            alt={movie.title || movie.name}
          />
        )}
      </div>

      <div className="absolute top-[98%] left-0 w-full p-3 bg-[#181818] opacity-0 group-hover/card:opacity-100 invisible group-hover/card:visible transition-all duration-300 rounded-b-lg shadow-2xl">
        <h3 className="text-white text-[12px] font-bold mb-2 line-clamp-1">
          {movie.title || movie.name}
        </h3>

        <div className="flex justify-between items-center mb-3 w-full">
          <div className="flex gap-1.5">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="p-1.5 bg-white rounded-full hover:bg-white/80 transition"
            >
              <Play size={10} fill="black" />
            </button>

            <button
              onClick={handleWishlistClick}
              className={`p-1.5 border rounded-full transition-all duration-200 ${
                inWishlist
                  ? 'border-[#842A3B] bg-[#842A3B]/20 hover:bg-[#842A3B]/40'
                  : 'border-gray-500 hover:border-white'
              }`}
            >
              <Heart
                size={10}
                className={`transition-all duration-200 ${
                  inWishlist ? 'text-[#842A3B] fill-[#842A3B]' : 'text-white'
                }`}
              />
            </button>
          </div>

          <div className="p-1.5 border border-gray-500 rounded-full hover:border-white transition">
            <Info size={12} className="text-white" />
          </div>
        </div>

        <div className="text-[10px] text-white flex flex-col gap-1 text-left">
          <div className="flex items-center gap-2">
            <span className="text-green-500 font-bold">
              {movie.vote_average ? (movie.vote_average * 10).toFixed(0) : 0}% Match
            </span>
            <span className="text-gray-400">13+ • HD</span>
          </div>
          {genres && <div className="text-[10px] text-gray-300 font-medium line-clamp-1">{genres}</div>}
        </div>
      </div>
    </Link>
  );
});

export default MovieCard;