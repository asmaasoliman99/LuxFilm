import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import MovieCard from '../Components/MovieCard';
import { useLanguage } from '../Context/Language';

const GenrePage = () => {
  const { genreId, genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const { lang, getTMDBLang, t } = useLanguage();
  const API_KEY = import.meta.env.VITE_TMDB_KEY;

  const currentLang = getTMDBLang();

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=${currentLang}`
        );
        setMovies(res.data.results);
      } catch (err) {
        console.error("Error fetching genre movies", err);
      }
    };

    if (genreId) {
      fetchGenreMovies();
    }
  }, [genreId, API_KEY, currentLang]);

  return (
    <div 
      className='bg-[#141414] min-h-screen pt-48 md:pt-25 pb-20 p-6 md:p-12 pt-24 transition-all duration-500'
    >
      <div className="mb-12 flex items-center gap-4">
        <div className="w-1.5 h-10 bg-[#842A3B] rounded-full"></div>
        <h1 className='text-3xl md:text-4xl font-bold text-white tracking-tight uppercase'>
          {t('genrePage.genreTitle', { genre: genreName })}
        </h1>
      </div>

      {/* movie grid */}
      <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-10 gap-y-32 justify-items-center'>
        {movies.length > 0 ? (
          movies.map(movie => (
            <div key={movie.id} className="w-full flex justify-center">
              <MovieCard 
                movie={movie} 
                API_KEY={API_KEY} 
                genresList={[]} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-gray-500 mt-20 text-xl font-medium italic">
             {t('genrePage.loading')}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenrePage;