import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';

export const movieService = {
  /**
   * Fetches a random trending movie backdrop for UI backgrounds
   */
  getTrendingBackdrop: async () => {
    try {
      const res = await axios.get(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}`);
      const movies = res.data.results;
      
      if (movies && movies.length > 0) {
        // Pick a random movie from the results (top 10 for better quality)
        const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 10));
        const backdropPath = movies[randomIndex].backdrop_path;
        return `${IMAGE_BASE_URL}${backdropPath}`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching trending backdrop:', error);
      return null;
    }
  }
};

export default movieService;
