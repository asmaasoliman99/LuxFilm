import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';
import MovieCard from '../Components/MovieCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const lang = searchParams.get('lang') || 'en';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    setPage(1);
    setResults([]); 
  }, [query]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=${lang === 'ar' ? 'ar-SA' : 'en-US'}&page=${page}`
        );
        setResults(res.data.results);
        
        const apiTotalPages = res.data.total_pages;
        setTotalPages(apiTotalPages > 20 ? 20 : apiTotalPages);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query, lang, page, API_KEY]);

  const sortedResults = useMemo(() => {
    let sorted = [...results];
    if (sortBy === 'rating') {
      sorted.sort((a, b) => b.vote_average - a.vote_average);
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortBy === 'popularity') {
      sorted.sort((a, b) => b.popularity - a.popularity);
    }
    return sorted;
  }, [sortBy, results]);

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-32 pb-40 px-8 md:px-16 overflow-x-hidden">
      
      {/* Header & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
        <h2 className="text-2xl font-bold">
          {lang === 'ar' ? 'نتائج البحث عن: ' : 'Search Results for: '}
          <span className="text-[#842A3B]"> "{query}"</span>
        </h2>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-400">
            {lang === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#222] text-white border border-gray-700 outline-none px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-[#333] transition"
          >
            <option value="popularity" className="bg-[#141414]">{lang === 'ar' ? 'الأكثر شهرة' : 'Popularity'}</option>
            <option value="rating" className="bg-[#141414]">{lang === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}</option>
            <option value="date" className="bg-[#141414]">{lang === 'ar' ? 'الأحدث' : 'Release Date'}</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#842A3B]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-12 gap-y-36 justify-items-center">
            {sortedResults.length > 0 ? (
              sortedResults.map((movie) => (
                <div key={movie.id} className="w-full flex justify-center">

                   <MovieCard movie={movie} API_KEY={API_KEY} />
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 mt-10 italic">
                {lang === 'ar' ? 'هذا الفيلم غير متاح..' : 'No results found.'}
              </p>
            )}
          </div>


          {results.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center gap-8 mt-32">
              
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-6 py-2 bg-[#222] border border-gray-700 rounded-md disabled:opacity-20 hover:bg-[#333] transition-all text-sm font-bold active:scale-95"
              >
                {lang === 'ar' ? 'السابق' : 'Prev'}
              </button>

              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm font-medium uppercase tracking-widest">Page</span>
                <div className="w-12 h-12 rounded-full bg-[#842A3B] text-white font-black flex items-center justify-center text-xl shadow-[0_0_20px_rgba(132,42,59,0.4)]">
                  {page}
                </div>
                <span className="text-gray-500 text-sm font-medium">/ {totalPages}</span>
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 bg-[#222] border border-gray-700 rounded-md disabled:opacity-20 hover:bg-[#333] transition-all text-sm font-bold active:scale-95"
              >
                {lang === 'ar' ? 'التالي' : 'Next'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;