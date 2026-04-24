import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Heart, Trash2, Play, Info, Star, BookmarkX, ShoppingBag } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 text-white">
        <div className="relative mb-8">
          <div className="w-28 h-28 rounded-full bg-[#842A3B]/20 flex items-center justify-center border border-[#842A3B]/40">
            <Heart size={48} className="text-[#842A3B]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#662222] flex items-center justify-center text-xs font-bold">
            🔒
          </div>
        </div>
        <h2 className="text-3xl font-black mb-3 text-center">Sign in to access your Wishlist</h2>
        <p className="text-gray-400 text-center mb-8 max-w-md">
          Keep track of all the movies you want to watch. Sign in to save and manage your personal wishlist.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-gradient-to-r from-[#842A3B] to-[#662222] text-white font-bold rounded-lg hover:from-[#A3485A] hover:to-[#7d3535] transition-all duration-300 hover:scale-105"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 border-2 border-[#842A3B] text-white font-bold rounded-lg hover:bg-[#842A3B]/20 transition-all duration-300"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  if (wishlistCount === 0) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-6 text-white">
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-[#1a1a1a] border-2 border-dashed border-gray-700 flex items-center justify-center">
            <BookmarkX size={52} className="text-gray-600" />
          </div>
        </div>
        <h2 className="text-3xl font-black mb-3 text-center">Your wishlist is empty</h2>
        <p className="text-gray-400 text-center mb-8 max-w-md text-sm leading-relaxed">
          Start exploring movies and add them to your wishlist by clicking the{' '}
          <Heart size={14} className="inline text-[#842A3B]" /> heart icon on any movie card.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-gradient-to-r from-[#842A3B] to-[#662222] text-white font-bold rounded-lg hover:from-[#A3485A] hover:to-[#7d3535] transition-all duration-300 hover:scale-105"
        >
          Browse Movies
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-20 px-6 md:px-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Heart size={28} className="text-[#842A3B] fill-[#842A3B]" />
            <h1 className="text-4xl md:text-5xl font-black">My Wishlist</h1>
          </div>
          <p className="text-gray-400 ml-11">
            {wishlistCount} {wishlistCount === 1 ? 'movie' : 'movies'} saved
          </p>
        </div>

        <button
          onClick={clearWishlist}
          className="flex items-center gap-2 border border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-500 transition-all duration-300 px-5 py-2.5 rounded-lg text-sm font-semibold self-start md:self-auto"
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-[#842A3B]/60 via-[#662222]/30 to-transparent mb-10" />

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {wishlist.map((movie) => (
          <div
            key={movie.id}
            className="relative group rounded-xl overflow-hidden bg-[#1c1c1c] border border-white/5 hover:border-[#842A3B]/50 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-[#842A3B]/10"
            onMouseEnter={() => setHoveredId(movie.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Poster */}
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}`}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x450/1c1c1c/666?text=No+Image';
                }}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Actions */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link
                  to={`/movie/${movie.id}`}
                  className="flex items-center gap-1.5 bg-white text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition"
                >
                  <Info size={12} /> Details
                </Link>
                <button
                  onClick={() => removeFromWishlist(movie.id)}
                  className="flex items-center gap-1.5 bg-[#842A3B]/80 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#A3485A] transition"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>

              {/* Rating Badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] font-bold text-white">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>

              {/* Remove button top-right */}
              <button
                onClick={() => removeFromWishlist(movie.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-[#842A3B]"
              >
                <Heart size={12} className="text-[#842A3B] fill-[#842A3B] group-hover:text-white" />
              </button>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-white text-xs font-bold line-clamp-2 leading-tight mb-1">
                {movie.title || movie.name}
              </h3>
              <p className="text-gray-500 text-[10px]">
                {(movie.release_date || movie.first_air_date)?.split('-')[0] || 'N/A'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
