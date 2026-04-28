import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import axios from 'axios';
import MovieCard from '../Components/MovieCard';
import { useLanguage } from '../Context/Language';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const { lang, t } = useLanguage();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=${lang === 'ar' ? 'ar-SA' : 'en-US'}&page=${page}`
        );
        setResults(res.data.results);
        setTotalPages(res.data.total_pages);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (query) fetchResults();
  }, [query, lang, API_KEY, page]); 

    
useEffect(() => {
  if (page !== 1) {
    setPage(1);
  }
}, [query, page]);

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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-4">
        <h2 className="text-2xl font-bold">
          {t('searchPage.title')}
          <span className="text-[#842A3B]">"{query}"</span>
        </h2>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-400">
            {t('searchPage.sortBy')}
          </label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#222] text-white border border-gray-700 outline-none px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-[#333] transition"
          >
            <option value="popularity" className="bg-[#141414]">{t('searchPage.popularity')}</option>
            <option value="rating" className="bg-[#141414]">{t('searchPage.topRated')}</option>
            <option value="date" className="bg-[#141414]">{t('searchPage.releaseDate')}</option>
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
                {t('searchPage.noResults')}
              </p>
            )}
          </div>

          {/* 3. أزرار الـ Pagination */}
          {results.length > 0 && (
            <div className="flex justify-center items-center gap-8 mt-32">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-6 py-2 bg-[#222] border border-gray-700 rounded-md disabled:opacity-20 hover:bg-[#333] transition-all text-sm font-bold active:scale-95"
              >
                {t('searchPage.previous')}
              </button>

              <div className="flex flex-col items-center">
                <span className="text-[#842A3B] font-black text-xl leading-none">{page}</span>
                <span className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest">{t('searchPage.page')}</span>
              </div>

              <button 
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-6 py-2 bg-[#222] border border-gray-700 rounded-md disabled:opacity-20 hover:bg-[#333] transition-all text-sm font-bold active:scale-95"
              >
                {t('searchPage.next')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;