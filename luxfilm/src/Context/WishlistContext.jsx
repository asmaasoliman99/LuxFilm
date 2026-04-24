import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('luxfilm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('luxfilm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToWishlist = useCallback((movie) => {
    setWishlist((prev) => {
      if (prev.find((m) => m.id === movie.id)) return prev;
      toast.success(`"${movie.title || movie.name}" added to wishlist!`, {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #842A3B' },
        iconTheme: { primary: '#842A3B', secondary: '#fff' },
      });
      return [...prev, movie];
    });
  }, []);

  const removeFromWishlist = useCallback((movieId) => {
    setWishlist((prev) => {
      const movie = prev.find((m) => m.id === movieId);
      if (movie) {
        toast(`"${movie.title || movie.name}" removed from wishlist`, {
          icon: '🗑️',
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #555' },
        });
      }
      return prev.filter((m) => m.id !== movieId);
    });
  }, []);

  const toggleWishlist = useCallback((movie) => {
    setWishlist((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        toast(`"${movie.title || movie.name}" removed from wishlist`, {
          icon: '🗑️',
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #555' },
        });
        return prev.filter((m) => m.id !== movie.id);
      } else {
        toast.success(`"${movie.title || movie.name}" added to wishlist!`, {
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #842A3B' },
          iconTheme: { primary: '#842A3B', secondary: '#fff' },
        });
        return [...prev, movie];
      }
    });
  }, []);

  const isInWishlist = useCallback((movieId) => {
    return wishlist.some((m) => m.id === movieId);
  }, [wishlist]);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast('Wishlist cleared', {
      icon: '🗑️',
      style: { background: '#1a1a1a', color: '#fff' },
    });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};

export default WishlistContext;
